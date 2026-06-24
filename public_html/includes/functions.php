<?php

function e($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function now_sql() { return date('Y-m-d H:i:s'); }
function redirect($url) { header('Location: '.$url); exit; }
function is_post() { return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST'; }
function client_ip() { return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'; }

function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field() { return '<input type="hidden" name="csrf_token" value="'.e(csrf_token()).'">'; }

function verify_csrf() {
    if (!is_post()) return;
    $token = $_POST['csrf_token'] ?? '';
    if (!$token || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(419);
        exit('Invalid CSRF token.');
    }
}

function app_config() {
    static $config = null;
    if ($config !== null) return $config;
    $file = __DIR__.'/../config.php';
    $config = file_exists($file) ? require $file : ['installed' => false];
    return $config;
}

function is_installed() { $c = app_config(); return !empty($c['installed']); }

function db() {
    static $pdo = null;
    if ($pdo) return $pdo;
    $config = app_config();
    if (empty($config['installed'])) redirect('install.php');
    $db = $config['db'];
    $dsn = 'mysql:host='.$db['host'].';dbname='.$db['name'].';charset='.($db['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function query($sql, $params = []) { $stmt = db()->prepare($sql); $stmt->execute($params); return $stmt; }
function one($sql, $params = []) { $row = query($sql, $params)->fetch(); return $row ?: null; }
function all($sql, $params = []) { return query($sql, $params)->fetchAll(); }

function flash($type, $message) { $_SESSION['flash'][] = ['type' => $type, 'message' => $message]; }
function flashes() { $items = $_SESSION['flash'] ?? []; unset($_SESSION['flash']); return $items; }

function sensitive_setting_keys() {
    return ['whatsapp_access_token','whatsapp_verify_token','telegram_bot_token','telegram_webhook_secret'];
}

function app_key() { $c = app_config(); return (string)($c['app_key'] ?? ''); }

function encrypt_value($plain) {
    if ($plain === null || $plain === '') return $plain;
    $key = hash('sha256', app_key(), true);
    $iv = random_bytes(16);
    $cipher = openssl_encrypt((string)$plain, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
    return base64_encode($iv.$cipher);
}

function decrypt_value($encrypted) {
    if ($encrypted === null || $encrypted === '') return $encrypted;
    $raw = base64_decode((string)$encrypted, true);
    if ($raw === false || strlen($raw) < 17) return $encrypted;
    $iv = substr($raw, 0, 16);
    $cipher = substr($raw, 16);
    $plain = openssl_decrypt($cipher, 'AES-256-CBC', hash('sha256', app_key(), true), OPENSSL_RAW_DATA, $iv);
    return $plain === false ? $encrypted : $plain;
}

function setting($key, $default = '') {
    $row = one('SELECT setting_value, setting_type FROM settings WHERE setting_key = ?', [$key]);
    if (!$row) return $default;
    return $row['setting_type'] === 'encrypted' ? decrypt_value($row['setting_value']) : $row['setting_value'];
}

function set_setting($key, $value, $group = 'general') {
    $type = in_array($key, sensitive_setting_keys(), true) ? 'encrypted' : 'string';
    $stored = $type === 'encrypted' ? encrypt_value($value) : $value;
    query('INSERT INTO settings (setting_key, setting_value, setting_type, setting_group) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), setting_type = VALUES(setting_type), setting_group = VALUES(setting_group)', [$key, $stored, $type, $group]);
}

function require_login() {
    if (empty($_SESSION['user_id'])) redirect('login.php');
}

function current_user() {
    if (empty($_SESSION['user_id'])) return null;
    return one('SELECT * FROM users WHERE id = ?', [$_SESSION['user_id']]);
}

function require_role($roles = ['admin','manager','support']) {
    require_login();
    $user = current_user();
    if (!$user || !in_array($user['role'], (array)$roles, true)) {
        http_response_code(403);
        exit('Forbidden');
    }
}

function is_admin() { $u = current_user(); return $u && $u['role'] === 'admin'; }

function paginate($total, $page, $perPage) {
    $pages = max(1, (int)ceil($total / $perPage));
    return ['page' => max(1, min($page, $pages)), 'pages' => $pages, 'offset' => max(0, ($page - 1) * $perPage)];
}

function status_badge($status) {
    $map = ['pending'=>'warning','approved'=>'success','rejected'=>'danger','processed'=>'info','sent'=>'success','failed'=>'danger','received'=>'info','created'=>'success','unauthorized'=>'danger'];
    $class = $map[$status] ?? 'secondary';
    return '<span class="badge text-bg-'.$class.'">'.e(ucfirst($status)).'</span>';
}

function create_notification($type, $channel, $title, $body = '', $data = []) {
    query('INSERT INTO notifications (type, channel, title, body, data) VALUES (?, ?, ?, ?, ?)', [$type, $channel, $title, $body, json_encode($data)]);
}

function default_whatsapp_template() {
    return "🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}";
}

function render_trial_message($request) {
    $template = setting('whatsapp_template', default_whatsapp_template());
    $replace = [
        '{type}' => 'free_trial', '{name}' => $request['name'] ?? '', '{email}' => $request['email'] ?: 'N/A',
        '{whatsapp}' => $request['whatsapp'] ?? '', '{country}' => $request['country'] ?: 'N/A',
        '{dial_code}' => $request['dial_code'] ?: 'N/A', '{device}' => $request['device'] ?: 'N/A',
        '{plan}' => $request['plan'] ?? 'Free Trial', '{price}' => '$0', '{message}' => $request['message'] ?? '',
        '{ip}' => $request['ip_address'] ?: 'N/A', '{date}' => $request['created_at'] ?? now_sql(),
    ];
    return strtr($template, $replace);
}

function send_whatsapp_cloud($recipient, $message, $trialRequestId = null) {
    $token = setting('whatsapp_access_token');
    $phoneNumberId = setting('whatsapp_phone_number_id');
    if (!$token || !$phoneNumberId) {
        $response = ['error' => 'WhatsApp Access Token and Phone Number ID are required.'];
        query('INSERT INTO whatsapp_logs (trial_request_id, recipient, message, status, response) VALUES (?, ?, ?, ?, ?)', [$trialRequestId, $recipient, $message, 'failed', json_encode($response)]);
        set_setting('whatsapp_api_status', 'disconnected', 'integrations');
        set_setting('last_api_response', json_encode($response, JSON_PRETTY_PRINT), 'integrations');
        set_setting('last_connection_check', now_sql(), 'integrations');
        return false;
    }
    $payload = ['messaging_product'=>'whatsapp','to'=>$recipient,'type'=>'text','text'=>['body'=>$message]];
    $ch = curl_init('https://graph.facebook.com/v20.0/'.$phoneNumberId.'/messages');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_POST=>true, CURLOPT_HTTPHEADER=>['Authorization: Bearer '.$token, 'Content-Type: application/json'], CURLOPT_POSTFIELDS=>json_encode($payload), CURLOPT_TIMEOUT=>30]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    $ok = $code >= 200 && $code < 300 && !$error;
    $response = $error ? ['curl_error'=>$error] : ['http_code'=>$code, 'body'=>json_decode($body, true) ?: $body];
    query('INSERT INTO whatsapp_logs (trial_request_id, recipient, message, status, response, sent_at) VALUES (?, ?, ?, ?, ?, ?)', [$trialRequestId, $recipient, $message, $ok ? 'sent' : 'failed', json_encode($response), $ok ? now_sql() : null]);
    set_setting('whatsapp_api_status', $ok ? 'connected' : 'disconnected', 'integrations');
    set_setting('last_api_response', json_encode($response, JSON_PRETTY_PRINT), 'integrations');
    set_setting('last_connection_check', now_sql(), 'integrations');
    return $ok;
}

function set_telegram_webhook() {
    $token = setting('telegram_bot_token');
    $url = setting('telegram_webhook_url');
    $secret = setting('telegram_webhook_secret');
    if (!$token || !$url || !$secret) return [false, 'Telegram Bot Token, Webhook URL, and Webhook Secret are required.'];
    $post = http_build_query(['url'=>$url, 'secret_token'=>$secret]);
    $ch = curl_init('https://api.telegram.org/bot'.$token.'/setWebhook');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>$post, CURLOPT_TIMEOUT=>30]);
    $body = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); $error = curl_error($ch); curl_close($ch);
    $decoded = json_decode($body, true); $ok = !$error && $code >= 200 && $code < 300 && !empty($decoded['ok']);
    $response = $error ? ['curl_error'=>$error] : ['http_code'=>$code, 'body'=>$decoded ?: $body];
    query('INSERT INTO telegram_logs (direction, payload, message, status, error) VALUES (?, ?, ?, ?, ?)', ['outgoing', json_encode(['action'=>'setWebhook','url'=>$url]), 'Set Telegram webhook', $ok ? 'connected' : 'failed', $ok ? null : json_encode($response)]);
    set_setting('telegram_api_status', $ok ? 'connected' : 'disconnected', 'integrations');
    set_setting('last_api_response', json_encode($response, JSON_PRETTY_PRINT), 'integrations');
    set_setting('last_connection_check', now_sql(), 'integrations');
    return [$ok, $ok ? 'Telegram webhook set.' : 'Telegram webhook failed.'];
}

function test_telegram_bot() {
    $token = setting('telegram_bot_token');
    if (!$token) return [false, 'Telegram Bot Token is required.'];
    $ch = curl_init('https://api.telegram.org/bot'.$token.'/getMe');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>30]);
    $body = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); $error = curl_error($ch); curl_close($ch);
    $decoded = json_decode($body, true); $ok = !$error && $code >= 200 && $code < 300 && !empty($decoded['ok']);
    $response = $error ? ['curl_error'=>$error] : ['http_code'=>$code, 'body'=>$decoded ?: $body];
    query('INSERT INTO telegram_logs (direction, payload, message, status, error) VALUES (?, ?, ?, ?, ?)', ['outgoing', json_encode(['action'=>'getMe']), 'Test Telegram Bot API', $ok ? 'connected' : 'failed', $ok ? null : json_encode($response)]);
    set_setting('telegram_api_status', $ok ? 'connected' : 'disconnected', 'integrations');
    set_setting('last_api_response', json_encode($response, JSON_PRETTY_PRINT), 'integrations');
    set_setting('last_connection_check', now_sql(), 'integrations');
    return [$ok, $ok ? 'Telegram bot connected.' : 'Telegram bot test failed.'];
}
