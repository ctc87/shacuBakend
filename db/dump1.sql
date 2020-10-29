-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: localhost    Database: shacu
-- ------------------------------------------------------
-- Server version	8.0.21-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `qr_queue` int unsigned DEFAULT NULL,
  `queue_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `qr_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `size` int unsigned DEFAULT NULL,
  `file_path` varchar(500) NOT NULL,
  `content_name` varchar(200) NOT NULL,
  `content_description` varchar(1000) NOT NULL,
  `content_type` varchar(50) NOT NULL,
  `authorized` tinyint(1) DEFAULT '0',
  `reg_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `qr_id` (`qr_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `content_ibfk_1` FOREIGN KEY (`qr_id`) REFERENCES `qr` (`id`) ON DELETE CASCADE,
  CONSTRAINT `content_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,NULL,'2020-10-28 17:47:40',1,1,21648,'1Screenshot_67.jpg','Meme Its Free','Meme de its free que mola un montón.','image',1,'2020-10-28 17:47:40'),(2,NULL,'2020-10-28 17:48:46',2,1,213572,'1_346dd5e1-c54f-456d-b6bc-254487b06502_large.png','La existencia es dolor','Rick y Morthy siempre tienen razón. ','image',1,'2020-10-28 17:48:46'),(3,NULL,'2020-10-28 17:49:50',3,1,53674,'homo-hominis-lupus.jpg','Homo Homini Luppus','Que el hombre se proteja del hombre.','image',1,'2020-10-28 17:49:50'),(4,NULL,'2020-10-28 17:51:04',4,1,10186,'1984_Ingsoc_George_Orwell-logo-8A79C73BFB-seeklogo.com.png','Meme Its Free','El lema del Socing es \"La guerra es paz, la libertad es esclavitud, la ignorancia es la fuerza\".','image',1,'2020-10-28 17:51:04');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_user`
--

DROP TABLE IF EXISTS `content_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_user` (
  `user_id` int unsigned NOT NULL,
  `content_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`content_id`),
  KEY `content_id` (`content_id`),
  CONSTRAINT `content_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `content_user_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `content` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_user`
--

LOCK TABLES `content_user` WRITE;
/*!40000 ALTER TABLE `content_user` DISABLE KEYS */;
INSERT INTO `content_user` VALUES (1,1),(1,2),(1,3),(1,4);
/*!40000 ALTER TABLE `content_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content_id` int unsigned DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `message_user` varchar(15000) DEFAULT NULL,
  `readed` tinyint(1) DEFAULT '0',
  `reg_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message_type` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,NULL,1,'Welcome to Shacu Carlos see get started if you want need help.',0,'2020-10-28 17:47:24','Registered');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr`
--

DROP TABLE IF EXISTS `qr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qr` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `lat` float DEFAULT NULL,
  `lon` float DEFAULT NULL,
  `qr_name` varchar(200) NOT NULL,
  `qr_image` varchar(15000) DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `reg_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr`
--

LOCK TABLES `qr` WRITE;
/*!40000 ALTER TABLE `qr` DISABLE KEYS */;
INSERT INTO `qr` VALUES (1,39.4834,-0.357259,'Vicente Zaragozá','data:image/gif;base64,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',0,'2020-10-28 17:47:39'),(2,39.485,-0.363066,'Benimaclet','data:image/gif;base64,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',0,'2020-10-28 17:48:46'),(3,39.4863,-0.367592,'Primat Reig','data:image/gif;base64,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',0,'2020-10-28 17:49:50'),(4,39.4897,-0.365344,'IngSoc','data:image/gif;base64,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',0,'2020-10-28 17:51:04');
/*!40000 ALTER TABLE `qr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `nick` varchar(10) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `reg_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Carlos','carlos.troyano.carmona@gmail.com','carlos.tro',1,'2020-10-28 17:47:24');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-28 18:53:26
