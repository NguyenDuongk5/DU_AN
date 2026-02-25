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
-- Table structure for table `bai_dang`
--

DROP TABLE IF EXISTS `bai_dang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bai_dang` (
  `id_bai_dang` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_du_an` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_tac_gia` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tieu_de` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` int DEFAULT '0',
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_cap_nhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bai_dang`),
  KEY `id_du_an` (`id_du_an`),
  KEY `id_tac_gia` (`id_tac_gia`),
  CONSTRAINT `bai_dang_ibfk_1` FOREIGN KEY (`id_du_an`) REFERENCES `du_an` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bai_dang_ibfk_2` FOREIGN KEY (`id_tac_gia`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bai_dang`
--

LOCK TABLES `bai_dang` WRITE;
/*!40000 ALTER TABLE `bai_dang` DISABLE KEYS */;
INSERT INTO `bai_dang` VALUES ('1dcee4ee-6c95-42c7-88ff-877df107f4c7','bfc9d805-7db3-417d-8d26-8fa74c8d7134','ab68a446-f6a8-11f0-9162-005056c00001','Kiểm tra bảo mật','Đã kiểm tra lỗ hổng bảo mật.','post20.jpg',2,'2026-02-24 17:38:30','2026-02-24 17:38:30'),('28235f28-c80c-49f8-afc0-174f431f6351','7f965de5-b6fd-48e6-a3cd-cffc27834906','ab68a235-f6a8-11f0-9162-005056c00001','Cập nhật API','Đã thêm API chỉnh sửa bài viết.','001b2b43-6b46-4144-899f-e89a4fe2e81c.jpg',1,'2026-02-24 17:37:46','2026-02-24 17:58:40'),('3fd0d48d-7b84-428e-bde9-b6cf228ad80e','2613dde4-57e2-4c0d-b6d2-61035c36dc6a','ab68a3d0-f6a8-11f0-9162-005056c00001','Cập nhật giao diện','Đã cải thiện giao diện dashboard.','b611b8a7-80b3-43ce-a2c1-c6de7c633829.jpg',1,'2026-02-24 18:34:32','2026-02-24 18:35:11'),('4311b316-3d3e-482d-9b50-43d4c4f4a4fa','8ed1fc71-0bea-4464-954f-b136510ea5da','ab68a32d-f6a8-11f0-9162-005056c00001','Thêm phân quyền','Đã thêm phân quyền admin và user.','2c340cf4-3906-45e7-8042-080c5013b967.jpg',1,'2026-02-24 17:14:50','2026-02-24 18:00:24'),('44b1c4ff-f7ac-4c8e-8f55-8018a07e2f4f','7f965de5-b6fd-48e6-a3cd-cffc27834906','ab6781ae-f6a8-11f0-9162-005056c00001','Cập nhật giao diện','Đã cải thiện giao diện dashboard.','1d5b7369-2707-4bd2-8215-5798195a3105.jpg',0,'2026-02-24 18:37:33','2026-02-24 18:37:33'),('4639128d-b162-44ce-a916-cfb00e83e29c','3598a6e7-3fbf-45fe-b71c-795932f6da8a','ab68a0ab-f6a8-11f0-9162-005056c00001','Upload hình ảnh','Chức năng upload ảnh hoạt động ổn định.','1afd67c9-c7f7-4859-a919-46374783a6c4.jpg',1,'2026-02-24 17:14:10','2026-02-24 18:04:00'),('47ac1f57-2d39-409b-b60f-31f5d172e80e','8e337696-5607-4815-9e9d-d13640be1563','ab68a2b7-f6a8-11f0-9162-005056c00001','Fix lỗi upload','Đã sửa lỗi upload file lớn.','post7.jpg',2,'2026-02-24 17:14:41','2026-02-24 17:14:41'),('4cf64b8c-6b62-4947-9303-dbf1f5818021','2586e5ea-11d6-4463-aa50-58f90ed2e605','ab6781ae-f6a8-11f0-9162-005056c00001','Cập nhật tiến độ','Đã hoàn thành module quản lý người dùng.','post11.jpg',1,'2026-02-24 17:36:40','2026-02-24 17:36:40'),('56fedae9-a2cf-454f-857c-bf179aba8a91','2c75ac8e-8b69-4ed0-8c2c-ed5c668a5a9a','ab689e5d-f6a8-11f0-9162-005056c00001','Thêm chức năng đăng nhập','Đã hoàn thiện chức năng đăng nhập và đăng ký.','83c4112f-0f21-46fb-bdf4-6d157b080e75.jpg',1,'2026-02-24 17:14:02','2026-02-24 18:09:08'),('57c1458e-1cd6-4c40-a73b-c0f191edc23f','9c7575e7-b000-47e1-8a13-981ef267ae64','ab68a3d0-f6a8-11f0-9162-005056c00001','Backup dữ liệu','Đã backup dữ liệu hệ thống.','cd446dc3-7bdf-4168-9122-7c7d85cb2ff2.jpg',1,'2026-02-24 17:38:27','2026-02-24 18:05:15'),('6a121b5b-3698-4fde-b63d-eb05b8cb72a7','48391358-809b-4272-80b1-1d8b5d826184','ab68a32d-f6a8-11f0-9162-005056c00001','Tối ưu database','Đã tối ưu các query để tăng hiệu suất.','0226a50c-5b69-4609-9e05-e8d16ff36623.jpg',1,'2026-02-24 18:14:34','2026-02-24 18:16:28'),('77af0bea-424e-40d4-9171-e2e251b38f20','2613dde4-57e2-4c0d-b6d2-61035c36dc6a','ab68a3d0-f6a8-11f0-9162-005056c00001','Thiết kế giao diện','Đã hoàn thành bản thiết kế giao diện trang chủ.','d6e5b6cc-6e57-47c6-ac7d-cf2776fcf9a7.jpg',1,'2026-02-24 18:35:01','2026-02-24 18:35:07'),('8c170cd1-48a7-4bb6-9768-9dbd6ba8609f','7f965de5-b6fd-48e6-a3cd-cffc27834906','ab68a235-f6a8-11f0-9162-005056c00001','API bài viết','Đã hoàn thành API thêm bài viết.','66abe3ca-a62e-4a46-855a-aac3e6dc094b.jpg',1,'2026-02-24 17:14:30','2026-02-24 17:58:55'),('92a33cf6-e02a-424a-bbf4-c9109c630f3e','3598a6e7-3fbf-45fe-b71c-795932f6da8a','ab68a0ab-f6a8-11f0-9162-005056c00001','Thêm chức năng tìm kiếm','Đã thêm tìm kiếm bài viết theo tiêu đề.','post14.jpg',0,'2026-02-24 17:37:23','2026-02-24 17:37:23'),('a34750ee-83d0-408f-bea1-805031165814','2586e5ea-11d6-4463-aa50-58f90ed2e605','ab6781ae-f6a8-11f0-9162-005056c00001','Khởi tạo dự án','Dự án đã được tạo thành công. Bắt đầu thiết lập cấu trúc.','post1.jpg',1,'2026-02-24 17:13:13','2026-02-24 17:13:13'),('d0bf81e1-0413-49c7-b645-17a4ac26f322','2c75ac8e-8b69-4ed0-8c2c-ed5c668a5a9a','ab688cf0-f6a8-11f0-9162-005056c00001','Thiết kế giao diện','Đã hoàn thành bản thiết kế giao diện trang chủ.','ca44a32c-f2f6-482d-8b07-e04cbf570883.jpg',0,'2026-02-24 18:39:19','2026-02-24 18:39:19'),('d5037671-5f1f-4b43-ac8e-d445ae9e8c0e','bfc9d805-7db3-417d-8d26-8fa74c8d7134','ab68a446-f6a8-11f0-9162-005056c00001','Test hệ thống','Đang tiến hành test toàn bộ hệ thống.','959bf3e1-6210-4f4e-94ab-f8904311bda8.jpg',1,'2026-02-24 17:15:59','2026-02-24 18:07:47'),('d9f3ecf8-94d3-416a-af3c-9c364f1d4f0e','8e337696-5607-4815-9e9d-d13640be1563','ab68a2b7-f6a8-11f0-9162-005056c00001','Thêm comment','Đã thêm chức năng bình luận.','d96b76ca-3c58-40ea-a975-ddecce0c57c9.jpg',1,'2026-02-24 17:37:56','2026-02-24 18:01:57'),('e351b1a9-5455-409b-b740-a2c0bbacfebe','48391358-809b-4272-80b1-1d8b5d826184','ab68a17f-f6a8-11f0-9162-005056c00001','Upload avatar','Người dùng có thể upload avatar.','8617f8f4-528f-4a10-81df-b69db1df1689.jpg',1,'2026-02-24 17:37:36','2026-02-24 18:11:13');
/*!40000 ALTER TABLE `bai_dang` ENABLE KEYS */;
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
