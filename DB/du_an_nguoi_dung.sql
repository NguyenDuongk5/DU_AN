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
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `id_nguoi_dung` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hoten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tendangnhap` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matkhau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `goi_y_mk` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loai_tai_khoan` tinyint NOT NULL,
  `trang_thai` tinyint(1) DEFAULT '1',
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_nguoi_dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES ('11111111-1111-1121-1111-111111111111','Admin','Admin','Admin@gmail.com','admin123','hi',2,2,'2026-02-22 07:23:26','2026-02-22 07:23:26'),('3fa85f64-5717-4562-b3fc-2c963f66afa6','Nguyen Vu Thuy Duong','a','duong@gmail.com','123456','string',0,0,'2026-02-01 07:18:11','2026-02-24 07:31:46'),('ab6781ae-f6a8-11f0-9162-005056c00001','Nguyen Van A','nguyenvana','duongnvt2402@gmail.com','123456','so thu cung',1,1,'2026-01-21 09:07:53','2026-02-23 17:59:03'),('ab688cf0-f6a8-11f0-9162-005056c00001','Tran Thi B','tranthib','tranthib@gmail.com','1234567','mon an yeu thich',1,1,'2026-01-21 09:07:53','2026-02-14 10:12:06'),('ab689e5d-f6a8-11f0-9162-005056c00001','Le Van C','levanc','c@gmail.com','123456','ten me',1,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a0ab-f6a8-11f0-9162-005056c00001','Pham Thi D','phamthid','d@gmail.com','123456','biet danh',2,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a17f-f6a8-11f0-9162-005056c00001','Hoang Van E','hoangvane','e@gmail.com','123456','truong hoc',1,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a235-f6a8-11f0-9162-005056c00001','Vo Thi F','vothif','f@gmail.com','123456','so thich',1,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a2b7-f6a8-11f0-9162-005056c00001','Do Van G','dovang','g@gmail.com','123456','ten ban than',2,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a32d-f6a8-11f0-9162-005056c00001','Bui Thi H','buithih','h@gmail.com','123456','mon hoc',1,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a3d0-f6a8-11f0-9162-005056c00001','Dang Van I','dangvani','i@gmail.com','123456','ca si yeu thich',1,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('ab68a446-f6a8-11f0-9162-005056c00001','Ngo Thi K','ngothik','k@gmail.com','123456','mau sac',1,1,'2026-01-21 09:07:53','2026-01-21 09:07:53'),('cad37d81-f602-41f4-aabf-82f9a95fee0a','Đào Thu Hường 2','huong1234','huong2@gmail.com','123456',NULL,0,1,'2026-02-24 06:12:33','2026-02-24 06:12:33');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25  2:12:46
