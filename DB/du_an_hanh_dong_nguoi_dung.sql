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
-- Table structure for table `hanh_dong_nguoi_dung`
--

DROP TABLE IF EXISTS `hanh_dong_nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hanh_dong_nguoi_dung` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_dung` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hanh_dong` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thoi_gian` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hanh_dong_nguoi_dung`
--

LOCK TABLES `hanh_dong_nguoi_dung` WRITE;
/*!40000 ALTER TABLE `hanh_dong_nguoi_dung` DISABLE KEYS */;
INSERT INTO `hanh_dong_nguoi_dung` VALUES ('3fa85f64-5717-4562-b3fc-2c963f66afa6','3fa85f64-5717-4562-b3fc-2c963f66afa6','aaaaaaa','2026-02-11 01:15:40'),('4fa6b996-fbf8-11f0-9162-005056c00001','3fa85f64-5717-4562-b3fc-2c963f66afa6','string','2026-02-03 20:04:35'),('4fa73c26-fbf8-11f0-9162-005056c00001','ab688cf0-f6a8-11f0-9162-005056c00001','Tạo dự án mới','2026-01-28 03:20:35'),('4fa73e2e-fbf8-11f0-9162-005056c00001','ab689e5d-f6a8-11f0-9162-005056c00001','Cập nhật thông tin cá nhân','2026-01-28 03:20:35'),('4fa73f43-fbf8-11f0-9162-005056c00001','ab68a0ab-f6a8-11f0-9162-005056c00001','Thêm thành viên vào dự án','2026-01-28 03:20:35'),('4fa73ffa-fbf8-11f0-9162-005056c00001','ab68a17f-f6a8-11f0-9162-005056c00001','Bình luận bài đăng','2026-01-28 03:20:35'),('4fa740c5-fbf8-11f0-9162-005056c00001','ab68a235-f6a8-11f0-9162-005056c00001','Xóa bình luận','2026-01-28 03:20:35'),('4fa74169-fbf8-11f0-9162-005056c00001','ab68a2b7-f6a8-11f0-9162-005056c00001','Đổi mật khẩu','2026-01-28 03:20:35'),('4fa74207-fbf8-11f0-9162-005056c00001','ab68a32d-f6a8-11f0-9162-005056c00001','Xem thông báo','2026-01-28 03:20:35'),('4fa742ad-fbf8-11f0-9162-005056c00001','ab68a3d0-f6a8-11f0-9162-005056c00001','Rời khỏi dự án','2026-01-28 03:20:35'),('4fa74349-fbf8-11f0-9162-005056c00001','ab68a446-f6a8-11f0-9162-005056c00001','Đăng xuất hệ thống','2026-01-28 03:20:35');
/*!40000 ALTER TABLE `hanh_dong_nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25  2:12:44
