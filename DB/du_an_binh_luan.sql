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
-- Table structure for table `binh_luan`
--

DROP TABLE IF EXISTS `binh_luan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `binh_luan` (
  `id_binh_luan` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_bai_dang` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_dung` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_binh_luan` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `trang_thai` int NOT NULL,
  PRIMARY KEY (`id_binh_luan`),
  KEY `id_bai_dang` (`id_bai_dang`),
  KEY `id_nguoi_dung` (`id_nguoi_dung`),
  CONSTRAINT `binh_luan_ibfk_1` FOREIGN KEY (`id_bai_dang`) REFERENCES `bai_dang` (`id_bai_dang`) ON DELETE CASCADE,
  CONSTRAINT `binh_luan_ibfk_2` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `binh_luan`
--

LOCK TABLES `binh_luan` WRITE;
/*!40000 ALTER TABLE `binh_luan` DISABLE KEYS */;
INSERT INTO `binh_luan` VALUES ('0a58281e-6a94-4244-a858-d9fb1ee73cdf','56fedae9-a2cf-454f-857c-bf179aba8a91','ab6781ae-f6a8-11f0-9162-005056c00001','Có thể triển khai thực tế.','2026-02-24 17:53:48',1),('105b9f4a-b843-47e7-8e69-f4243cd70b31','4cf64b8c-6b62-4947-9303-dbf1f5818021','ab68a235-f6a8-11f0-9162-005056c00001','Mình sẽ áp dụng vào dự án.','2026-02-24 17:44:15',1),('10e3a4dd-2505-48ee-902a-ea30d1a6573e','28235f28-c80c-49f8-afc0-174f431f6351','ab68a0ab-f6a8-11f0-9162-005056c00001','Đã hiểu cách hoạt động.','2026-02-24 17:50:06',1),('1bf1336a-7f16-4c7c-b756-c6d3caf5103d','4cf64b8c-6b62-4947-9303-dbf1f5818021','ab68a446-f6a8-11f0-9162-005056c00001','Cảm ơn team.','2026-02-24 17:53:38',1),('308fca6f-022c-490b-bbea-759ab9196a70','4639128d-b162-44ce-a916-cfb00e83e29c','ab68a2b7-f6a8-11f0-9162-005056c00001','Tuyệt vời.','2026-02-24 17:50:32',1),('43924b35-a2f2-47ab-b01c-e8b8db9d0bc5','e351b1a9-5455-409b-b740-a2c0bbacfebe','ab68a235-f6a8-11f0-9162-005056c00001','Rất hữu ích cho dự án.','2026-02-24 17:54:27',1),('45bee037-4acd-47a0-8f37-21c725a8c1cc','56fedae9-a2cf-454f-857c-bf179aba8a91','ab68a2b7-f6a8-11f0-9162-005056c00001','Rất chuyên nghiệp.','2026-02-24 17:44:27',1),('590447f9-96e4-4757-9ea9-74218912c797','4311b316-3d3e-482d-9b50-43d4c4f4a4fa','ab68a0ab-f6a8-11f0-9162-005056c00001','Tính năng này rất cần thiết.','2026-02-24 17:43:53',1),('77b88ebc-cf31-4e38-9395-13b6ba1b0f04','d9f3ecf8-94d3-416a-af3c-9c364f1d4f0e','ab689e5d-f6a8-11f0-9162-005056c00001','Đã thử nghiệm thành công.','2026-02-24 17:52:31',1),('916f2889-d0e8-4c20-9d0f-f1ae4a3024e8','8c170cd1-48a7-4bb6-9768-9dbd6ba8609f','ab6781ae-f6a8-11f0-9162-005056c00001','Tôi đã xem qua và thấy rất ổn.','2026-02-24 17:52:19',1),('9296096a-98d0-4a9c-92d0-f22c2369ca19','a34750ee-83d0-408f-bea1-805031165814','ab68a0ab-f6a8-11f0-9162-005056c00001','Test thành công.','2026-02-24 17:54:15',1),('97d412b4-c295-4125-adfe-5fcaf1c8922c','56fedae9-a2cf-454f-857c-bf179aba8a91','ab68a3d0-f6a8-11f0-9162-005056c00001','Hoạt động ổn định.','2026-02-24 17:50:49',1),('9f37e527-eddf-44ea-ab3e-11067800fff7','8c170cd1-48a7-4bb6-9768-9dbd6ba8609f','ab68a3d0-f6a8-11f0-9162-005056c00001','Chạy mượt.','2026-02-24 17:49:23',1),('a351cdc2-d3c9-466d-826a-2b9670d92336','4311b316-3d3e-482d-9b50-43d4c4f4a4fa','ab68a32d-f6a8-11f0-9162-005056c00001','Hiệu suất tốt.','2026-02-24 17:53:15',1),('b738308a-86e9-43c3-8f53-336653915034','8c170cd1-48a7-4bb6-9768-9dbd6ba8609f','ab6781ae-f6a8-11f0-9162-005056c00001','Tôi đã xem qua và thấy rất ổn.','2026-02-24 17:52:09',1),('b97e2930-484e-42d4-832b-ed7b924f779c','57c1458e-1cd6-4c40-a73b-c0f191edc23f','ab688cf0-f6a8-11f0-9162-005056c00001','Rất ấn tượng.','2026-02-24 17:53:58',1),('ba9e63d9-1f21-4710-963b-46d44cf760eb','28235f28-c80c-49f8-afc0-174f431f6351','ab688cf0-f6a8-11f0-9162-005056c00001','Mình đã test và hoạt động tốt.','2026-02-24 17:43:28',1),('c7152dec-3060-4675-ab2b-9be517896c21','28235f28-c80c-49f8-afc0-174f431f6351','ab68a32d-f6a8-11f0-9162-005056c00001','Đã kiểm tra.','2026-02-24 17:54:45',1),('d13e8e45-0a63-4b07-8bb5-0f04526ada81','4639128d-b162-44ce-a916-cfb00e83e29c','ab68a3d0-f6a8-11f0-9162-005056c00001','Rất chuyên nghiệp.','2026-02-24 17:53:30',1),('d154f03e-9f76-493c-80fb-cae7b8cb3b5d','4cf64b8c-6b62-4947-9303-dbf1f5818021','ab68a32d-f6a8-11f0-9162-005056c00001','Đã thử nghiệm.','2026-02-24 17:50:40',1),('d659b806-374b-4558-a0e2-175eb970a5ee','8c170cd1-48a7-4bb6-9768-9dbd6ba8609f','ab689e5d-f6a8-11f0-9162-005056c00001','Đang theo dõi thêm.','2026-02-24 17:54:05',0),('d9cc6a6d-c6e2-4eca-ab02-fd44cebb6583','d9f3ecf8-94d3-416a-af3c-9c364f1d4f0e','ab6781ae-f6a8-11f0-9162-005056c00001','Giao diện đẹp.','2026-02-24 17:49:44',1),('da0e6a59-e3d2-4732-97ec-3876d9fdb76b','4311b316-3d3e-482d-9b50-43d4c4f4a4fa','ab68a235-f6a8-11f0-9162-005056c00001','Đã deploy thành công.','2026-02-24 17:50:24',1),('de098d55-cff0-4e88-8b15-1ee7ebc137c7','4639128d-b162-44ce-a916-cfb00e83e29c','ab68a17f-f6a8-11f0-9162-005056c00001','Cảm ơn đã chia sẻ.','2026-02-24 17:44:06',1),('dff2a590-ecbd-4f54-8b8d-e8c0d4f686ef','e351b1a9-5455-409b-b740-a2c0bbacfebe','ab68a0ab-f6a8-11f0-9162-005056c00001','Cần thêm tài liệu hướng dẫn.','2026-02-24 17:52:39',0),('e2627bbd-e4fb-40c5-adcd-b2c05444484e','28235f28-c80c-49f8-afc0-174f431f6351','ab68a235-f6a8-11f0-9162-005056c00001','Giao diện thân thiện.','2026-02-24 17:52:58',1),('e63cbf8a-7c7d-4b27-9640-796bf9f7cfdf','e351b1a9-5455-409b-b740-a2c0bbacfebe','ab688cf0-f6a8-11f0-9162-005056c00001','Đang test thêm.','2026-02-24 17:49:55',1),('f7b6ecf9-7bd4-4605-82d3-44201b2218e1','57c1458e-1cd6-4c40-a73b-c0f191edc23f','ab68a446-f6a8-11f0-9162-005056c00001','Rất tốt.','2026-02-24 17:50:58',1),('fc47bf0e-7e1e-40d7-8ecb-a33961faeba0','a34750ee-83d0-408f-bea1-805031165814','ab68a446-f6a8-11f0-9162-005056c00001','Có thể thêm tính năng mới.','2026-02-24 17:49:36',0);
/*!40000 ALTER TABLE `binh_luan` ENABLE KEYS */;
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
