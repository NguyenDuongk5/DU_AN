-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: du_an
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `thanh_vien_du_an`
--

DROP TABLE IF EXISTS `thanh_vien_du_an`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanh_vien_du_an` (
  `id_thanh_vien_du_an` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_du_an` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_dung` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_vaitro` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` int NOT NULL,
  `ngay_tham_gia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_thanh_vien_du_an`),
  UNIQUE KEY `uk_duan_nguoidung` (`id_du_an`,`id_nguoi_dung`),
  KEY `id_nguoi_dung` (`id_nguoi_dung`),
  KEY `id_vaitro` (`id_vaitro`),
  CONSTRAINT `thanh_vien_du_an_ibfk_1` FOREIGN KEY (`id_du_an`) REFERENCES `du_an` (`id`) ON DELETE CASCADE,
  CONSTRAINT `thanh_vien_du_an_ibfk_2` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE CASCADE,
  CONSTRAINT `thanh_vien_du_an_ibfk_3` FOREIGN KEY (`id_vaitro`) REFERENCES `vai_tro` (`id_vaitro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_vien_du_an`
--

LOCK TABLES `thanh_vien_du_an` WRITE;
/*!40000 ALTER TABLE `thanh_vien_du_an` DISABLE KEYS */;
/*!40000 ALTER TABLE `thanh_vien_du_an` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25  2:12:45
