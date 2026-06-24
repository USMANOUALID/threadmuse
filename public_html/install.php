<?php
session_start();
function e($v){return htmlspecialchars((string)$v,ENT_QUOTES,'UTF-8');}
$errors=[];$success=false;
if ($_SERVER['REQUEST_METHOD']==='POST') {
    $host=trim($_POST['db_host']??'localhost'); $name=trim($_POST['db_name']??''); $user=trim($_POST['db_user']??''); $pass=(string)($_POST['db_pass']??'');
    $adminName=trim($_POST['admin_name']??'Admin'); $adminEmail=trim($_POST['admin_email']??''); $adminPass=(string)($_POST['admin_password']??'');
    if(!$name||!$user||!$adminEmail||strlen($adminPass)<8) $errors[]='Database name/user, admin email, and an 8+ character password are required.';
    if(!$errors){
        try{
            $pdo=new PDO('mysql:host='.$host.';charset=utf8mb4',$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
            $pdo->exec('CREATE DATABASE IF NOT EXISTS `'.str_replace('`','``',$name).'` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
            $pdo=new PDO('mysql:host='.$host.';dbname='.$name.';charset=utf8mb4',$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
            $sql=file_get_contents(__DIR__.'/database.sql');
            foreach(array_filter(array_map('trim',explode(';',$sql))) as $stmt){$pdo->exec($stmt);}
            $appKey = bin2hex(random_bytes(32));
            $encrypt = function($plain) use ($appKey) {
                $key = hash('sha256', $appKey, true);
                $iv = random_bytes(16);
                return base64_encode($iv.openssl_encrypt((string)$plain, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv));
            };
            $hash=password_hash($adminPass,PASSWORD_DEFAULT);
            $stmt=$pdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), role=VALUES(role)');
            $stmt->execute([$adminName,$adminEmail,$hash,'admin']);
            $defaults=[
                'app_name'=>'Trial Manager','whatsapp_template'=>"🔥 NEW IPTV FREE TRIAL REQUEST\n\n📌 Type: {type}\n👤 Name: {name}\n📧 Email: {email}\n📱 WhatsApp: {whatsapp}\n🌍 Country: {country}\n☎️ Dial Code: {dial_code}\n📦 Plan: {plan}\n💰 Price: {price}\n📝 Message: {message}\n🌐 IP: {ip}\n🕒 Date: {date}",
                'whatsapp_admin_number'=>'','notifications_whatsapp_enabled'=>'1','notifications_telegram_enabled'=>'1','notifications_email_enabled'=>'0','whatsapp_api_status'=>'disconnected','telegram_api_status'=>'disconnected','last_api_response'=>'No API calls have been made yet.','last_connection_check'=>'Never'
            ];
            $stmt=$pdo->prepare('INSERT INTO settings (setting_key,setting_value,setting_group) VALUES (?,?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)');
            foreach($defaults as $k=>$v){$stmt->execute([$k,$v,'general']);}
            $secret = bin2hex(random_bytes(24));
            $stmt=$pdo->prepare('INSERT INTO settings (setting_key,setting_value,setting_type,setting_group) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value), setting_type=VALUES(setting_type)');
            $stmt->execute(['telegram_webhook_secret',$encrypt($secret),'encrypted','integrations']);
            $config="<?php\nreturn ".var_export(['installed'=>true,'app_key'=>$appKey,'db'=>['host'=>$host,'name'=>$name,'user'=>$user,'pass'=>$pass,'charset'=>'utf8mb4']],true).";\n";
            if(file_put_contents(__DIR__.'/config.php',$config)===false) throw new Exception('Could not write config.php. Check file permissions.');
            $success=true;
        }catch(Throwable $ex){$errors[]=$ex->getMessage();}
    }
}
?><!doctype html><html data-bs-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Install Trial Manager</title><link rel="stylesheet" href="assets/css/bootstrap.min.css"><link rel="stylesheet" href="assets/css/app.css"></head><body><div class="login-wrap"><div class="login-card"><h1>Install Trial Manager</h1><?php if($success): ?><div class="alert alert-success">Installation complete. <a href="login.php">Go to login</a></div><?php else: ?><?php foreach($errors as $er): ?><div class="alert alert-danger"><?=e($er)?></div><?php endforeach; ?><form method="post"><h5>Database</h5><label class="form-label">Host</label><input class="form-control mb-3" name="db_host" value="localhost"><label class="form-label">Database Name</label><input class="form-control mb-3" name="db_name" required><label class="form-label">Database User</label><input class="form-control mb-3" name="db_user" required><label class="form-label">Database Password</label><input class="form-control mb-4" type="password" name="db_pass"><h5>Admin Account</h5><label class="form-label">Name</label><input class="form-control mb-3" name="admin_name" value="Admin"><label class="form-label">Email</label><input class="form-control mb-3" type="email" name="admin_email" required><label class="form-label">Password</label><input class="form-control mb-4" type="password" name="admin_password" required><button class="btn btn-primary w-100">Install</button></form><?php endif; ?></div></div></body></html>
