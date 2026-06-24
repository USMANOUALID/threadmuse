<?php require_once __DIR__.'/app.php'; require_login(); $user = current_user(); ?>
<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($page_title ?? 'Trial Manager') ?></title>
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/css/app.css">
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <a class="brand" href="dashboard.php"><span>TM</span><strong>Trial Manager</strong></a>
    <nav class="nav flex-column gap-1">
      <a class="nav-link" href="dashboard.php">Dashboard</a>
      <a class="nav-link" href="trial-requests.php">Trial Requests</a>
      <a class="nav-link" href="users.php">Users</a>
      <a class="nav-link" href="settings.php">Settings</a>
      <a class="nav-link" href="integrations.php">Settings → Integrations</a>
      <a class="nav-link" href="trial-requests.php?log=telegram">Telegram Logs</a>
      <a class="nav-link" href="trial-requests.php?log=whatsapp">WhatsApp Logs</a>
    </nav>
    <div class="sidebar-user">
      <div><?= e($user['name']) ?></div><small><?= e($user['email']) ?> · <?= e($user['role']) ?></small>
      <a class="btn btn-outline-light btn-sm w-100 mt-3" href="logout.php">Logout</a>
    </div>
  </aside>
  <main class="main">
    <header class="topbar"><div><small>Free Trial Control Center</small><h1><?= e($page_title ?? 'Trial Manager') ?></h1></div></header>
    <div class="container-fluid py-4">
      <?php foreach (flashes() as $f): ?><div class="alert alert-<?= e($f['type']) ?>"><?= e($f['message']) ?></div><?php endforeach; ?>
