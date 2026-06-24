<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
require_once __DIR__.'/functions.php';
if (!is_installed() && basename($_SERVER['SCRIPT_NAME']) !== 'install.php') {
    redirect('install.php');
}
