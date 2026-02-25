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
-- Table structure for table `du_an`
--

DROP TABLE IF EXISTS `du_an`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `du_an` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tieu_de` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_unicode_ci,
  `mau` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_nguoi_tao` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_duan_nguoitao` (`id_nguoi_tao`),
  CONSTRAINT `fk_duan_nguoitao` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `nguoi_dung` (`id_nguoi_dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `du_an`
--

LOCK TABLES `du_an` WRITE;
/*!40000 ALTER TABLE `du_an` DISABLE KEYS */;
INSERT INTO `du_an` VALUES ('2586e5ea-11d6-4463-aa50-58f90ed2e605','Website tin tức','Trang web đọc tin tức','#198754','2026-02-24 07:37:26','2026-02-24 07:37:26','ab68a446-f6a8-11f0-9162-005056c00001'),('2613dde4-57e2-4c0d-b6d2-61035c36dc6a','App quản lý chi tiêu','Theo dõi thu chi cá nhân','#6610f2','2026-02-24 07:36:55','2026-02-24 07:36:55','ab68a3d0-f6a8-11f0-9162-005056c00001'),('2c75ac8e-8b69-4ed0-8c2c-ed5c668a5a9a','Hệ thống quản lý thư viện','Quản lý sách và người mượn','#fd7e14','2026-02-24 07:36:24','2026-02-24 07:36:24','ab68a235-f6a8-11f0-9162-005056c00001'),('3598a6e7-3fbf-45fe-b71c-795932f6da8a','Website bán hàng','Trang web thương mại điện tử','#ffc107','2026-02-24 07:35:47','2026-02-24 07:35:47','ab689e5d-f6a8-11f0-9162-005056c00001'),('48391358-809b-4272-80b1-1d8b5d826184','Website học online','Nền tảng học tập trực tuyến','#0dcaf0','2026-02-24 07:36:46','2026-02-24 07:36:46','ab68a32d-f6a8-11f0-9162-005056c00001'),('7f965de5-b6fd-48e6-a3cd-cffc27834906','Website quản lý dự án','Quản lý tiến độ dự án','#0d6efd','2026-02-24 07:37:49','2026-02-24 07:37:49','ab6781ae-f6a8-11f0-9162-005056c00001'),('8e337696-5607-4815-9e9d-d13640be1563','Website quản lý sinh viên','Hệ thống quản lý thông tin sinh viên và điểm số','#0d6efd','2026-02-24 07:35:24','2026-02-24 07:35:24','ab688cf0-f6a8-11f0-9162-005056c00001'),('8ed1fc71-0bea-4464-954f-b136510ea5da','App quản lý nhân sự','Quản lý nhân viên','#ffc107','2026-02-24 07:38:04','2026-02-24 07:38:04','ab688cf0-f6a8-11f0-9162-005056c00001'),('9c7575e7-b000-47e1-8a13-981ef267ae64','App chat realtime','Ứng dụng chat sử dụng WebSocket','#dc3545','2026-02-24 07:36:00','2026-02-24 07:36:00','ab68a0ab-f6a8-11f0-9162-005056c00001'),('bfc9d805-7db3-417d-8d26-8fa74c8d7134','Website blog cá nhân','Nơi chia sẻ kiến thức và kinh nghiệm','#6f42c1','2026-02-24 07:36:11','2026-02-24 07:36:11','ab68a17f-f6a8-11f0-9162-005056c00001'),('c9316b00-9163-4e53-b7fa-ef77f032a742','het tet roii','lụy tết','#FF85C1','2026-02-23 03:05:15','2026-02-23 03:05:15','3fa85f64-5717-4562-b3fc-2c963f66afa6'),('cb70d04e-ba95-4481-923a-56297d1c9f95','App quản lý công việc','Ứng dụng theo dõi tiến độ công việc cá nhân','#198754','2026-02-24 07:35:36','2026-02-24 07:35:36','ab688cf0-f6a8-11f0-9162-005056c00001'),('dd7633f4-f6a9-11f0-9162-005056c00001','Test du an','Mo ta test','#ff0000','2026-01-21 09:16:27','2026-01-30 15:23:52','ab6781ae-f6a8-11f0-9162-005056c00001'),('e86dd699-b0f2-4415-87d1-a586607d24e7','App ghi chú','Ứng dụng lưu ghi chú cá nhân','#20c997','2026-02-24 07:36:36','2026-02-24 07:36:36','ab68a2b7-f6a8-11f0-9162-005056c00001'),('fe8ff1b2-ba5e-4670-a535-6a537d37ebf4','App đặt lịch','Ứng dụng đặt lịch hẹn','#dc3545','2026-02-24 07:37:40','2026-02-24 07:37:40','cad37d81-f602-41f4-aabf-82f9a95fee0a');
/*!40000 ALTER TABLE `du_an` ENABLE KEYS */;
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
