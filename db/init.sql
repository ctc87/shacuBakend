DROP DATABASE IF EXISTS shacu;

CREATE DATABASE shacu;

USE shacu;

CREATE TABLE users (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
email VARCHAR(50) NOT NULL,
nick VARCHAR(10) NOT NULL,
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY unique_email (email)
);

INSERT INTO users 
	(firstname, nick, email)
VALUES 
	('John', 'jn87', 'john@example.com'),
	('Mery', 'Agapita', 'meryjane@example.es');
