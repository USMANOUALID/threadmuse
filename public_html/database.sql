CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','support') NOT NULL DEFAULT 'support',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS trial_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  whatsapp VARCHAR(60) NOT NULL,
  country VARCHAR(120) NULL,
  dial_code VARCHAR(20) NULL,
  device VARCHAR(120) NULL,
  plan VARCHAR(120) NOT NULL DEFAULT 'Free Trial',
  message TEXT NULL,
  ip_address VARCHAR(45) NULL,
  status ENUM('pending','approved','rejected','processed') NOT NULL DEFAULT 'pending',
  approved_at DATETIME NULL,
  rejected_at DATETIME NULL,
  processed_at DATETIME NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_created (status, created_at),
  INDEX idx_email (email),
  INDEX idx_whatsapp (whatsapp),
  INDEX idx_country (country),
  INDEX idx_plan (plan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(191) NOT NULL UNIQUE,
  setting_value LONGTEXT NULL,
  setting_type VARCHAR(30) NOT NULL DEFAULT 'string',
  setting_group VARCHAR(80) NOT NULL DEFAULT 'general',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS telegram_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  direction VARCHAR(30) NOT NULL DEFAULT 'incoming',
  update_id BIGINT UNSIGNED NULL,
  payload LONGTEXT NULL,
  message TEXT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'received',
  error TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_update_id (update_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trial_request_id INT UNSIGNED NULL,
  recipient VARCHAR(80) NULL,
  message LONGTEXT NOT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'logged',
  response LONGTEXT NULL,
  sent_at DATETIME NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_request (trial_request_id),
  INDEX idx_status (status),
  CONSTRAINT fk_whatsapp_trial_request FOREIGN KEY (trial_request_id) REFERENCES trial_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  channel VARCHAR(60) NOT NULL DEFAULT 'admin',
  title VARCHAR(255) NOT NULL,
  body TEXT NULL,
  data LONGTEXT NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_channel (channel),
  INDEX idx_read (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
