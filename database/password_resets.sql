-- Optional / legacy — the app no longer uses this table for password reset (reset is by username + new password via API).
-- Only run if you still want `password_resets` for other experiments.

-- Run once against vehicle_marketplace (after `users` exists).

CREATE TABLE IF NOT EXISTS `password_resets` (
  `reset_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reset_id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `password_resets_user_id` (`user_id`),
  CONSTRAINT `password_resets_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
