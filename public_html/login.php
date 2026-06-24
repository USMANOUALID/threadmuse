<?php
require_once __DIR__.'/includes/app.php';
if (!is_installed()) redirect('install.php');
if (!empty($_SESSION['user_id'])) redirect('dashboard.php');
if (is_post()) {
    verify_csrf();
    $key='login_attempts'; $attempts=$_SESSION[$key]??[]; $attempts=array_filter($attempts,fn($t)=>$t>time()-300); if(count($attempts)>=5){$error='Too many login attempts. Try again later.';} else {
        $user=one('SELECT * FROM users WHERE email=?',[trim($_POST['email']??'')]);
        if($user && password_verify($_POST['password']??'', $user['password'])){session_regenerate_id(true);$_SESSION['user_id']=$user['id'];unset($_SESSION[$key]);redirect('dashboard.php');}
        $attempts[]=time();$_SESSION[$key]=$attempts;$error='Invalid credentials.';
    }
}
?><!doctype html><html data-bs-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Login - Trial Manager</title><link rel="stylesheet" href="assets/css/bootstrap.min.css"><link rel="stylesheet" href="assets/css/app.css"></head><body><div class="login-wrap"><div class="login-card"><h1>Trial Manager</h1><p class="text-muted">Secure admin access.</p><?php if(!empty($error)): ?><div class="alert alert-danger"><?=e($error)?></div><?php endif; ?><form method="post"><?=csrf_field()?><label class="form-label">Email</label><input class="form-control mb-3" type="email" name="email" required autofocus><label class="form-label">Password</label><input class="form-control mb-4" type="password" name="password" required><button class="btn btn-primary w-100">Login</button></form></div></div></body></html>
