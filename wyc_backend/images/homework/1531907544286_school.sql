-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 17, 2018 at 05:32 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school`
--

-- --------------------------------------------------------

--
-- Table structure for table `board`
--

CREATE TABLE `board` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `board`
--

INSERT INTO `board` (`id`, `name`) VALUES
(1, 'CBSE'),
(2, 'ICSE'),
(3, 'Uttar Pradesh'),
(4, 'Andhra Pradesh'),
(5, 'Assam'),
(6, 'Bihar'),
(7, 'Chhattisgarh'),
(8, 'Delhi'),
(9, 'Goa'),
(10, 'Gujarat'),
(11, 'Haryana'),
(12, 'Himachal Pradesh'),
(13, 'Indian Board'),
(14, 'Jammu & Kashmir'),
(15, 'Jharkhand'),
(16, 'Karnataka'),
(17, 'Kerala'),
(18, 'Madhya Pradesh'),
(19, 'Maharashtra'),
(20, 'Manipur'),
(21, 'Meghalaya'),
(22, 'Mizoram'),
(23, 'Nagaland'),
(24, 'National Institute of Open Schooling'),
(25, 'Odisha'),
(26, 'Punjab'),
(27, 'Rajasthan'),
(28, 'Tamil Nadu'),
(29, 'Telangana'),
(30, 'Tripura'),
(31, 'Uttarakhand'),
(32, 'West Bengal'),
(33, 'International Baccalaureate (IB)'),
(34, 'Others');

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `id` int(11) NOT NULL,
  `school_id` int(11) NOT NULL,
  `branch` varchar(100) NOT NULL,
  `principal_name` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `secondary_email` varchar(50) NOT NULL,
  `primary_no` varchar(15) NOT NULL,
  `secondary_no` varchar(15) NOT NULL,
  `logo` longtext NOT NULL,
  `website` varchar(100) NOT NULL,
  `start_admission_no` int(11) NOT NULL,
  `sender_id` varchar(10) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`id`, `school_id`, `branch`, `principal_name`, `email`, `secondary_email`, `primary_no`, `secondary_no`, `logo`, `website`, `start_admission_no`, `sender_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'South Bangalore', 'Ramesh Rajan', 'delhipssb@gmail.com', 'delhipssbinfo@gmail.com', '9874563210', '9874563211', '', 'www.delhipublicschool.com', 0, '', NULL, '2017-12-19 12:09:49', '2018-01-23 13:20:09'),
(2, 1, 'North Bangalore', 'Ram', 'dpssb@gmail.com', '', '9856321470', '8520741963', '', 'www.dpsnb.com', 0, '', NULL, '2018-01-23 13:19:40', '2018-01-23 13:20:12'),
(10, 4, 'Bangalore', 'Ragav', 'armybang@gmail.com', 'armybang.edu@gmail.com', '8888555500', '9512312300', '', 'www.armybang.edu', 100001, '', 'Army School', '2018-03-07 09:14:51', '2018-03-07 09:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `week_off` enum('All','No','Alternate') NOT NULL,
  `alternate_first_off` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `calendar`
--

INSERT INTO `calendar` (`id`, `session_id`, `name`, `week_off`, `alternate_first_off`, `created_at`, `updated_at`) VALUES
(1, 1, 'calendar 1', 'No', NULL, '2017-12-11 06:57:22', '2018-02-21 06:44:47'),
(2, 1, 'calendar 2', 'No', NULL, '2017-12-11 06:58:23', '2017-12-11 06:58:23'),
(3, 1, 'calendar 3', 'No', NULL, '2017-12-11 06:58:23', '2017-12-11 06:58:30'),
(60, 2, 'calendar 1', 'All', NULL, '2018-02-21 06:59:36', '2018-02-21 07:03:43'),
(61, 1, 'sdfsdfsdfs', 'No', NULL, '2018-04-02 06:10:28', '2018-04-02 06:10:28'),
(62, 1, 'asds', 'All', NULL, '2018-04-02 06:10:59', '2018-04-02 06:10:59'),
(63, 1, 'all saturday off', 'All', NULL, '2018-04-02 06:33:28', '2018-04-02 06:33:28'),
(64, 1, 'alternate', 'Alternate', '2017-05-05', '2018-04-02 06:34:05', '2018-04-02 06:34:05');

-- --------------------------------------------------------

--
-- Table structure for table `calendar_class`
--

CREATE TABLE `calendar_class` (
  `id` int(11) NOT NULL,
  `calendar_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `calendar_class`
--

INSERT INTO `calendar_class` (`id`, `calendar_id`, `class_id`, `created_at`) VALUES
(1, 1, 2, '2017-12-11 07:13:29'),
(2, 1, 11, '2017-12-11 07:16:46'),
(3, 1, 12, '2017-12-11 07:16:46'),
(4, 1, 13, '2017-12-11 07:16:46'),
(5, 1, 1, '2017-12-11 07:16:46'),
(6, 2, 3, '2017-12-11 07:16:46'),
(7, 2, 4, '2017-12-11 07:16:46'),
(8, 2, 5, '2017-12-11 07:16:46'),
(9, 3, 6, '2017-12-11 07:16:46'),
(10, 3, 7, '2017-12-11 07:16:46'),
(11, 3, 8, '2017-12-11 07:16:46'),
(12, 3, 9, '2017-12-11 07:16:46'),
(13, 3, 10, '2017-12-11 07:16:46'),
(30, 60, 14, '2018-03-07 13:36:31'),
(31, 60, 15, '2018-03-07 13:36:31'),
(32, 60, 16, '2018-03-07 13:36:31'),
(33, 60, 17, '2018-03-07 13:36:31'),
(34, 60, 18, '2018-03-07 13:36:31'),
(35, 60, 19, '2018-03-07 13:36:31'),
(36, 60, 20, '2018-03-07 13:36:31'),
(37, 60, 21, '2018-03-07 13:36:31');

-- --------------------------------------------------------

--
-- Table structure for table `calendar_holiday`
--

CREATE TABLE `calendar_holiday` (
  `id` int(11) NOT NULL,
  `calendar_id` int(11) NOT NULL,
  `holiday_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `calendar_holiday`
--

INSERT INTO `calendar_holiday` (`id`, `calendar_id`, `holiday_id`, `created_at`) VALUES
(1, 1, 1, '2017-12-11 07:26:23'),
(3, 1, 3, '2017-12-11 07:28:35'),
(4, 1, 4, '2017-12-11 07:28:35'),
(5, 1, 5, '2017-12-11 07:28:35'),
(6, 1, 6, '2017-12-11 07:28:35'),
(7, 1, 7, '2017-12-11 07:28:35'),
(8, 1, 8, '2017-12-11 07:28:35'),
(9, 1, 9, '2017-12-11 07:28:35'),
(10, 1, 10, '2017-12-11 07:28:35'),
(11, 2, 1, '2017-12-11 07:28:35'),
(13, 2, 3, '2017-12-11 07:28:35'),
(14, 2, 4, '2017-12-11 07:28:35'),
(15, 2, 5, '2017-12-11 07:28:35'),
(16, 2, 6, '2017-12-11 07:28:35'),
(17, 2, 7, '2017-12-11 07:28:35'),
(18, 2, 8, '2017-12-11 07:28:35'),
(19, 2, 9, '2017-12-11 07:28:35'),
(20, 2, 10, '2017-12-11 07:28:35'),
(21, 3, 1, '2017-12-11 07:28:35'),
(23, 3, 3, '2017-12-11 07:28:35'),
(24, 3, 4, '2017-12-11 07:28:35'),
(25, 3, 5, '2017-12-11 07:28:35'),
(26, 3, 6, '2017-12-11 07:28:35'),
(27, 3, 7, '2017-12-11 07:28:35'),
(28, 3, 8, '2017-12-11 07:28:35'),
(29, 3, 9, '2017-12-11 07:28:35'),
(30, 3, 10, '2017-12-11 07:28:35'),
(31, 61, 1, '2018-04-02 06:10:28'),
(32, 61, 3, '2018-04-02 06:10:28'),
(33, 61, 4, '2018-04-02 06:10:28'),
(34, 61, 5, '2018-04-02 06:10:28'),
(35, 61, 6, '2018-04-02 06:10:28'),
(36, 61, 7, '2018-04-02 06:10:28'),
(37, 61, 8, '2018-04-02 06:10:28'),
(38, 61, 9, '2018-04-02 06:10:28'),
(39, 61, 10, '2018-04-02 06:10:28'),
(40, 62, 1, '2018-04-02 06:10:59'),
(41, 62, 3, '2018-04-02 06:10:59'),
(42, 62, 4, '2018-04-02 06:10:59'),
(43, 62, 5, '2018-04-02 06:10:59'),
(44, 62, 6, '2018-04-02 06:10:59'),
(45, 62, 7, '2018-04-02 06:10:59'),
(46, 62, 8, '2018-04-02 06:10:59'),
(47, 62, 9, '2018-04-02 06:10:59'),
(48, 62, 10, '2018-04-02 06:10:59'),
(49, 63, 1, '2018-04-02 06:33:28'),
(50, 63, 3, '2018-04-02 06:33:28'),
(51, 63, 4, '2018-04-02 06:33:28'),
(52, 63, 5, '2018-04-02 06:33:28'),
(53, 63, 6, '2018-04-02 06:33:28'),
(54, 63, 7, '2018-04-02 06:33:28'),
(55, 63, 8, '2018-04-02 06:33:28'),
(56, 63, 9, '2018-04-02 06:33:28'),
(57, 63, 10, '2018-04-02 06:33:28'),
(58, 64, 1, '2018-04-02 06:34:05'),
(59, 64, 3, '2018-04-02 06:34:05'),
(60, 64, 4, '2018-04-02 06:34:05'),
(61, 64, 5, '2018-04-02 06:34:05'),
(62, 64, 6, '2018-04-02 06:34:05'),
(63, 64, 7, '2018-04-02 06:34:05'),
(64, 64, 8, '2018-04-02 06:34:05'),
(65, 64, 9, '2018-04-02 06:34:05'),
(66, 64, 10, '2018-04-02 06:34:05');

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `sort` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`id`, `branch_id`, `name`, `status`, `sort`, `created_at`) VALUES
(1, 1, 'First', 1, 3, '2017-12-12 21:30:00'),
(2, 1, 'Second', 1, 4, '2017-12-12 21:30:00'),
(3, 1, 'Third', 1, 5, '2017-12-12 21:30:00'),
(4, 1, 'Fourth', 1, 6, '2017-12-12 21:30:00'),
(5, 1, 'Fifth', 1, 7, '2017-12-12 21:30:00'),
(6, 1, 'sixth', 1, 8, '2017-12-12 21:30:00'),
(7, 1, 'Seventh', 1, 9, '2017-12-12 21:30:00'),
(8, 1, 'Eighth', 1, 10, '2017-12-12 21:30:00'),
(9, 1, 'Ninth', 1, 11, '2017-12-12 21:30:00'),
(10, 1, 'Tenth', 1, 12, '2017-12-12 21:30:00'),
(11, 1, 'Pre KG', 0, 0, '2017-12-12 21:30:00'),
(12, 1, 'LKG', 0, 1, '2017-12-12 21:30:00'),
(13, 1, 'UKG', 0, 2, '2017-12-12 21:30:00'),
(14, 2, 'Pre KG', 1, 0, '2018-02-21 06:40:56'),
(15, 2, 'LKG', 1, 1, '2018-02-21 06:40:56'),
(16, 2, 'UKG', 1, 2, '2018-02-21 06:40:56'),
(17, 2, 'First', 1, 3, '2018-02-21 06:40:56'),
(18, 2, 'Second', 1, 4, '2018-02-21 06:40:56'),
(19, 2, 'Third', 1, 5, '2018-02-21 06:40:56'),
(20, 2, 'Fourth', 1, 6, '2018-02-21 06:40:56'),
(21, 2, 'Fifth', 1, 7, '2018-02-21 06:40:56'),
(22, 1, '1', 1, 8, '2018-03-28 09:51:46');

-- --------------------------------------------------------

--
-- Table structure for table `class_subject`
--

CREATE TABLE `class_subject` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `class_subject`
--

INSERT INTO `class_subject` (`id`, `section_id`, `subject_id`, `teacher_id`, `created_at`) VALUES
(1, 1, 1, 5, '2017-12-11 10:28:24'),
(2, 1, 2, 5, '2017-12-11 10:38:49'),
(3, 1, 3, 2, '2017-12-11 10:38:49'),
(4, 1, 4, 2, '2017-12-11 10:38:49'),
(5, 1, 5, 2, '2017-12-11 10:38:49'),
(11, 3, 6, 5, '2017-12-11 10:38:49'),
(12, 3, 7, NULL, '2017-12-11 10:38:49'),
(13, 3, 8, NULL, '2017-12-11 10:38:49'),
(14, 3, 9, NULL, '2017-12-11 10:38:49'),
(15, 3, 10, 5, '2017-12-11 10:38:49'),
(16, 3, 11, 2, '2017-12-11 10:38:49'),
(22, 5, 3, NULL, '2017-12-11 10:38:49'),
(23, 5, 4, 5, '2017-12-11 10:38:49'),
(24, 5, 5, NULL, '2017-12-11 10:38:49'),
(25, 5, 6, NULL, '2017-12-11 10:38:49'),
(26, 5, 7, NULL, '2017-12-11 10:38:49'),
(27, 5, 8, NULL, '2017-12-11 10:38:49'),
(33, 7, 14, NULL, '2017-12-11 10:38:49'),
(34, 7, 1, NULL, '2017-12-11 10:38:49'),
(35, 7, 2, NULL, '2017-12-11 10:38:49'),
(36, 7, 3, NULL, '2017-12-11 10:38:49'),
(41, 9, 8, NULL, '2017-12-11 10:38:49'),
(42, 9, 9, NULL, '2017-12-11 10:38:49'),
(43, 9, 10, NULL, '2017-12-11 10:38:49'),
(44, 9, 11, NULL, '2017-12-11 10:38:49'),
(45, 9, 12, NULL, '2017-12-11 10:38:49'),
(46, 9, 13, NULL, '2017-12-11 10:38:49'),
(51, 11, 4, NULL, '2017-12-11 10:38:49'),
(52, 11, 5, NULL, '2017-12-11 10:38:49'),
(53, 11, 6, NULL, '2017-12-11 10:38:49'),
(54, 11, 7, NULL, '2017-12-11 10:38:49'),
(59, 13, 12, NULL, '2017-12-11 10:38:49'),
(60, 13, 13, NULL, '2017-12-11 10:38:49'),
(61, 13, 14, NULL, '2017-12-11 10:38:49'),
(62, 13, 1, NULL, '2017-12-11 10:38:49'),
(67, 15, 6, NULL, '2017-12-11 10:38:49'),
(68, 15, 7, NULL, '2017-12-11 10:38:49'),
(69, 15, 8, NULL, '2017-12-11 10:38:49'),
(74, 17, 13, 5, '2017-12-11 10:38:49'),
(75, 17, 14, NULL, '2017-12-11 10:38:49'),
(76, 17, 1, NULL, '2017-12-11 10:38:49'),
(77, 17, 2, NULL, '2017-12-11 10:38:49'),
(78, 17, 3, NULL, '2017-12-11 10:38:49'),
(83, 19, 8, NULL, '2017-12-11 10:38:49'),
(84, 19, 9, NULL, '2017-12-11 10:38:49'),
(85, 19, 10, NULL, '2017-12-11 10:38:49'),
(89, 21, 14, NULL, '2017-12-11 10:38:49'),
(90, 21, 1, NULL, '2017-12-11 10:38:49'),
(91, 21, 2, NULL, '2017-12-11 10:38:49'),
(93, 23, 4, NULL, '2017-12-11 10:38:49'),
(94, 23, 5, NULL, '2017-12-11 10:38:49'),
(95, 23, 6, NULL, '2017-12-11 10:38:49'),
(100, 25, 11, NULL, '2017-12-11 10:38:49'),
(101, 25, 12, NULL, '2017-12-11 10:38:49'),
(102, 25, 13, NULL, '2017-12-11 10:38:49'),
(103, 25, 14, 5, '2017-12-11 10:38:49'),
(288, 46, 23, NULL, '2018-02-21 07:52:26'),
(289, 46, 24, NULL, '2018-02-21 07:52:26'),
(290, 46, 25, NULL, '2018-02-21 07:52:26'),
(291, 46, 26, NULL, '2018-02-21 07:52:26'),
(292, 46, 27, NULL, '2018-02-21 07:52:26'),
(293, 47, 28, NULL, '2018-02-21 07:52:26'),
(294, 47, 29, NULL, '2018-02-21 07:52:26'),
(295, 47, 30, NULL, '2018-02-21 07:52:26'),
(296, 47, 31, NULL, '2018-02-21 07:52:26'),
(297, 47, 32, NULL, '2018-02-21 07:52:26'),
(298, 48, 33, NULL, '2018-02-21 07:52:26'),
(299, 48, 34, NULL, '2018-02-21 07:52:26'),
(300, 48, 35, NULL, '2018-02-21 07:52:26'),
(301, 48, 36, NULL, '2018-02-21 07:52:26'),
(302, 48, 37, NULL, '2018-02-21 07:52:26'),
(303, 49, 23, NULL, '2018-02-21 07:52:26'),
(304, 49, 24, NULL, '2018-02-21 07:52:26'),
(305, 49, 25, NULL, '2018-02-21 07:52:26'),
(306, 49, 26, NULL, '2018-02-21 07:52:26'),
(307, 49, 27, NULL, '2018-02-21 07:52:26'),
(308, 50, 28, NULL, '2018-02-21 07:52:26'),
(309, 50, 29, NULL, '2018-02-21 07:52:26'),
(310, 50, 30, NULL, '2018-02-21 07:52:26'),
(311, 50, 31, NULL, '2018-02-21 07:52:26'),
(312, 50, 32, NULL, '2018-02-21 07:52:26'),
(313, 51, 33, NULL, '2018-02-21 07:52:26'),
(314, 51, 34, NULL, '2018-02-21 07:52:26'),
(315, 51, 35, NULL, '2018-02-21 07:52:26'),
(316, 51, 36, NULL, '2018-02-21 07:52:26'),
(317, 51, 37, NULL, '2018-02-21 07:52:26'),
(318, 52, 23, NULL, '2018-02-21 07:52:26'),
(319, 52, 24, NULL, '2018-02-21 07:52:26'),
(320, 52, 25, NULL, '2018-02-21 07:52:26'),
(321, 52, 26, NULL, '2018-02-21 07:52:26'),
(322, 52, 27, NULL, '2018-02-21 07:52:26'),
(323, 53, 28, NULL, '2018-02-21 07:52:26'),
(324, 53, 29, NULL, '2018-02-21 07:52:26'),
(325, 53, 30, NULL, '2018-02-21 07:52:26'),
(326, 53, 31, NULL, '2018-02-21 07:52:26'),
(327, 53, 32, NULL, '2018-02-21 07:52:26'),
(328, 54, 33, NULL, '2018-02-21 07:52:26'),
(329, 54, 34, NULL, '2018-02-21 07:52:26'),
(330, 54, 35, NULL, '2018-02-21 07:52:26'),
(331, 54, 36, NULL, '2018-02-21 07:52:26'),
(332, 54, 37, NULL, '2018-02-21 07:52:26'),
(333, 55, 23, NULL, '2018-02-21 07:52:26'),
(334, 55, 24, NULL, '2018-02-21 07:52:26'),
(335, 55, 25, NULL, '2018-02-21 07:52:26'),
(336, 55, 26, NULL, '2018-02-21 07:52:26'),
(337, 55, 27, NULL, '2018-02-21 07:52:26'),
(338, 57, 33, NULL, '2018-02-21 07:52:26'),
(339, 57, 34, NULL, '2018-02-21 07:52:26'),
(340, 57, 35, NULL, '2018-02-21 07:52:26'),
(341, 57, 36, NULL, '2018-02-21 07:52:26'),
(342, 57, 37, NULL, '2018-02-21 07:52:26'),
(343, 1, 6, 5, '2018-03-16 09:33:05'),
(344, 3, 1, NULL, '2018-03-21 11:50:32'),
(345, 3, 1, NULL, '2018-03-21 11:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `class_teacher`
--

CREATE TABLE `class_teacher` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `board_id` int(11) DEFAULT NULL,
  `stream_id` int(11) DEFAULT NULL,
  `roll_no_flag` int(11) NOT NULL DEFAULT '0',
  `delegated_teacher_id` int(11) DEFAULT NULL,
  `delegated_from_date` date DEFAULT NULL,
  `delegated_to_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `class_teacher`
--

INSERT INTO `class_teacher` (`id`, `session_id`, `section_id`, `teacher_id`, `board_id`, `stream_id`, `roll_no_flag`, `delegated_teacher_id`, `delegated_from_date`, `delegated_to_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, 1, NULL, 1, NULL, NULL, NULL, '2017-12-11 07:53:49', '2018-03-29 13:46:46'),
(3, 1, 3, 3, 1, NULL, 1, NULL, NULL, NULL, '2017-12-11 08:33:07', '2018-03-29 13:50:31'),
(5, 1, 5, 4, 1, NULL, 1, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-30 08:00:52'),
(7, 1, 7, 6, 1, NULL, 0, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-16 06:04:03'),
(9, 1, 9, 5, 1, NULL, 0, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-16 06:04:03'),
(11, 1, 11, 1, 1, NULL, 0, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-16 06:04:03'),
(13, 1, 13, 8, 1, NULL, 0, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-16 06:04:03'),
(15, 1, 15, 7, 1, NULL, 0, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-16 06:04:03'),
(19, 1, 19, 9, 1, 1, 0, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-16 06:05:23'),
(21, 1, 21, 8, NULL, NULL, 1, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-29 13:49:34'),
(23, 1, 23, 5, NULL, NULL, 1, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-29 13:49:41'),
(25, 1, 25, 3, NULL, NULL, 1, NULL, NULL, NULL, '2017-12-11 08:43:01', '2018-03-29 13:49:47'),
(47, 2, 46, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:05', '2018-02-21 07:29:49'),
(48, 2, 47, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:13', '2018-02-21 07:30:39'),
(49, 2, 48, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:25', '2018-02-21 07:30:42'),
(50, 2, 49, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:31', '2018-02-21 07:30:30'),
(51, 2, 50, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:37', '2018-02-21 07:30:25'),
(52, 2, 51, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:42', '2018-02-21 07:30:20'),
(53, 2, 52, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:42:53', '2018-02-21 07:30:17'),
(54, 2, 53, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:43:03', '2018-02-21 07:30:13'),
(55, 2, 54, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:43:09', '2018-03-08 13:44:22'),
(56, 2, 55, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:43:23', '2018-03-08 13:44:19'),
(57, 2, 57, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-21 06:43:37', '2018-02-21 07:29:56'),
(58, 10, 1, 2, 2, 2, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:14:51'),
(59, 10, 3, 8, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:23:28'),
(60, 10, 5, 5, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:23:25'),
(61, 10, 7, 3, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:22:59'),
(63, 10, 11, 7, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:22:53'),
(64, 10, 13, 6, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:22:48'),
(65, 10, 15, 3, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:22:36'),
(66, 10, 17, 2, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:22:32'),
(67, 10, 19, 1, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:22:29'),
(68, 10, 21, 8, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:21:56'),
(69, 10, 23, 6, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:21:47'),
(70, 10, 25, 5, NULL, NULL, 0, NULL, NULL, NULL, '2018-02-27 05:14:51', '2018-02-27 05:21:44'),
(71, 2, 58, 13, 1, 4, 0, NULL, NULL, NULL, '2018-04-01 10:49:48', '2018-04-01 10:49:48');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `father_name` varchar(50) NOT NULL,
  `husband_name` varchar(50) DEFAULT NULL,
  `contact_no` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `id_proof` varchar(50) DEFAULT NULL,
  `photo_no` varchar(20) DEFAULT NULL,
  `photo` text,
  `type_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `branch_id`, `first_name`, `last_name`, `father_name`, `husband_name`, `contact_no`, `email`, `dob`, `gender`, `blood_group`, `barcode`, `qualification`, `address`, `aadhar_no`, `id_proof`, `photo_no`, `photo`, `type_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Mohan', '', '', NULL, '7458963210', 'Mohan@gmail.com', '1990-09-09', 'Male', NULL, NULL, 'M.E', 'India gate, Mumbai', '', NULL, NULL, NULL, 4, 1, '2017-12-09 12:33:57', '2018-04-06 08:24:40'),
(2, 1, 'vinay', '', '', NULL, '9894929680', 'vinay@gmail.com', '1985-12-29', 'Male', NULL, NULL, 'Ph.D', '#Marathalli\r\nBangalore', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:42:38', '2018-04-02 02:57:45'),
(3, 1, 'Radhakrishna', '', '', NULL, '34534534534', 'Radhakrishna@gmail.com', '1989-12-25', 'Male', NULL, NULL, 'Ph.D', 'Hosur', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:50:05', '2018-04-02 03:09:53'),
(4, 1, 'Vishu', '', '', NULL, '546546456', 'Vishu@gmail.com', '1973-02-22', 'Male', NULL, NULL, 'PGCE', 'Hosur', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:50:05', '2017-12-11 07:52:23'),
(5, 1, 'rajaram', '', '', NULL, '4565461233', 'rajaram@gmail.com', '1971-12-17', 'Male', NULL, NULL, 'PGCE', 'Hosur', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:50:05', '2018-02-20 12:59:18'),
(6, 1, 'prema', '', '', NULL, '234324234', 'prema@gmail.com', '1973-05-24', 'Female', NULL, NULL, 'PGCE', 'dfgfdg', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:50:05', '2017-12-22 07:25:51'),
(7, 1, 'ranjith', '', '', NULL, '2342342342', 'ranjithc@gmail.com', '1970-12-17', 'Male', NULL, NULL, 'PGCE', 'Hosur', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:50:05', '2018-02-15 10:17:51'),
(8, 1, 'vino', 'raj', 'ram', NULL, '234234234234', 'vino@gmail.com', '1970-12-29', 'Male', 'A+', '345345435', 'PGCE', 'Hosuryrty', '123232131', NULL, '1', '8.jpg', 2, 1, '2017-12-11 07:50:05', '2018-04-05 12:15:12'),
(9, 1, 'Arudhathi', '', '', NULL, '5687435436', 'Arudhathi@gmail.com', '1989-09-15', 'Female', 'A+', '12344444', 'PGCE', 'Hosur', '123232131232', NULL, '123123', NULL, 4, 1, '2017-12-11 07:50:05', '2018-04-03 07:17:17'),
(10, 1, 'Radha', '', '', NULL, '4560989567', 'radha@gmail.com', '1987-02-12', 'Female', NULL, NULL, 'PGCE', 'Hosur', '', NULL, NULL, NULL, 4, 1, '2017-12-11 07:50:05', '2017-12-22 07:25:41'),
(12, 1, 'Vijay', 'Prakesh', '', NULL, '9512365478', 'vijayprakesh@dps.com', '1980-01-01', 'Male', NULL, NULL, 'PhD.', '10,Manipal County Rd, Aishwarya Crystal Layout, Singasandra, bangalore - 560068', '654312341234', NULL, NULL, NULL, 2, 1, '2018-02-16 10:10:35', '2018-02-16 10:13:46'),
(13, 1, 'Raj', 'guru', '', NULL, '987678901', 'raj1980@gmail.com', '1980-01-01', 'Male', NULL, NULL, 'PhD.', '10, Aishwarya Crystal Layout, Singasandra, bangalore - 560068', '123412341234', NULL, NULL, NULL, 4, 1, '2018-02-21 08:07:56', '2018-04-02 04:38:05'),
(14, 1, 'Veda', 'krishnamoorthi', '', NULL, '987678100', 'vedakt@gmail.com', '1972-01-01', 'Male', NULL, NULL, 'PhD.', '10, Aishwarya Crystal Layout, Singasandra, bangalore - 560068', '123412341000', NULL, NULL, NULL, 2, 1, '2018-02-21 08:16:41', '2018-04-02 03:07:14'),
(15, 1, 'vasanthakumar', NULL, 'pvk', NULL, '9894929680', 'pvk@gmail.com', '1992-01-06', 'Male', NULL, NULL, NULL, 'Bangalore', '78920000000', NULL, NULL, '15.jpg', 4, 1, '2018-04-02 03:10:10', '2018-04-06 08:50:50'),
(16, 1, 'eeeeee', NULL, 'asd', NULL, '222222222', 'dfsdf@gmail.com', '2018-04-04', 'Male', NULL, NULL, NULL, 'fdsdfsdfsdfsdf', '555555555555555', NULL, NULL, NULL, 4, 1, '2018-04-07 09:55:25', '2018-04-07 09:55:25'),
(17, 1, 'sadsadsadsad', 'dfgfdg', 'dfgfdgdfg', NULL, '34234234234', 'dfgfdgdfg@gmail.com', '2018-04-03', 'Female', NULL, NULL, NULL, 'sdfsdfsdfsd', '3444333333333', NULL, NULL, '17.jpg', 4, 1, '2018-04-07 09:57:58', '2018-04-07 09:57:58');

-- --------------------------------------------------------

--
-- Table structure for table `employee_device`
--

CREATE TABLE `employee_device` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `device_token` text NOT NULL,
  `imei` varchar(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `employee_professional_info`
--

CREATE TABLE `employee_professional_info` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `designation` varchar(50) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `experience` varchar(100) DEFAULT NULL,
  `salary` int(11) DEFAULT NULL,
  `feedback` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee_professional_info`
--

INSERT INTO `employee_professional_info` (`id`, `branch_id`, `employee_id`, `designation`, `joining_date`, `experience`, `salary`, `feedback`, `created_at`, `updated_at`) VALUES
(2, 1, 12, NULL, '2010-01-01', '10 years', 100000, NULL, '2018-02-16 10:10:35', '2018-02-16 10:10:35'),
(3, 2, 13, NULL, '2010-01-01', '10 years', 25000, NULL, '2018-02-21 08:07:56', '2018-02-21 09:02:02'),
(5, 2, 14, NULL, '2010-01-01', '10 years', 52000, NULL, '2018-02-21 08:16:42', '2018-02-21 09:02:05'),
(6, 1, 15, NULL, NULL, NULL, NULL, NULL, '2018-04-02 03:10:10', '2018-04-02 03:10:10'),
(7, 1, 16, NULL, NULL, NULL, NULL, NULL, '2018-04-07 09:55:25', '2018-04-07 09:55:25'),
(8, 1, 17, NULL, NULL, NULL, NULL, NULL, '2018-04-07 09:57:58', '2018-04-07 09:57:58');

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `max_mark` int(11) NOT NULL,
  `min_mark` int(11) NOT NULL,
  `weightage` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`id`, `session_id`, `name`, `max_mark`, `min_mark`, `weightage`, `created_at`, `updated_at`) VALUES
(1, 1, 'First Mid Term', 100, 35, 10, '2018-01-29 05:55:18', '2018-02-22 07:38:13'),
(2, 1, 'Quarterly exam', 100, 35, 20, '2018-01-29 05:59:25', '2018-01-29 05:59:25'),
(3, 1, 'Second mid Term', 100, 35, 10, '2018-01-29 05:59:25', '2018-01-29 05:59:25'),
(4, 1, 'Half yearly exam', 100, 35, 20, '2018-01-29 05:59:25', '2018-01-29 05:59:25'),
(5, 1, 'Third mid Term', 100, 35, 10, '2018-01-29 05:59:25', '2018-01-29 05:59:25'),
(6, 1, 'Annual exam', 100, 35, 30, '2018-01-29 05:59:25', '2018-01-29 05:59:25'),
(7, 2, 'First Mid Term', 100, 35, 10, '2018-02-21 07:59:40', '2018-02-22 05:45:41'),
(8, 2, 'Quarterly exam', 100, 35, 20, '2018-02-21 07:59:40', '2018-02-22 05:45:45'),
(9, 2, 'Second mid Term', 100, 35, 10, '2018-02-21 07:59:40', '2018-02-22 05:45:49'),
(10, 2, 'Half yearly exam', 100, 35, 20, '2018-02-21 07:59:40', '2018-02-22 05:45:53'),
(11, 2, 'Third mid Term', 100, 35, 10, '2018-02-21 07:59:40', '2018-02-22 05:45:56'),
(12, 2, 'Annual exam', 100, 35, 30, '2018-02-21 07:59:40', '2018-02-22 05:46:00');

-- --------------------------------------------------------

--
-- Table structure for table `exam_mark`
--

CREATE TABLE `exam_mark` (
  `id` int(11) NOT NULL,
  `exam_schedule_id` int(11) NOT NULL,
  `student_section_id` int(11) NOT NULL,
  `mark` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_mark`
--

INSERT INTO `exam_mark` (`id`, `exam_schedule_id`, `student_section_id`, `mark`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 95, '2018-02-23 12:05:45', '2018-02-23 12:05:45'),
(2, 1, 2, 98, '2018-02-23 12:05:45', '2018-02-23 12:05:45'),
(3, 1, 3, 90, '2018-02-23 12:05:45', '2018-02-23 12:05:45'),
(4, 1, 4, 80, '2018-02-23 12:05:45', '2018-02-23 12:05:45'),
(5, 1, 5, 70, '2018-02-23 12:05:45', '2018-02-23 12:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `exam_schedule`
--

CREATE TABLE `exam_schedule` (
  `id` int(11) NOT NULL,
  `exam_status_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_schedule`
--

INSERT INTO `exam_schedule` (`id`, `exam_status_id`, `subject_id`, `date`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2018-02-19', '10:00:00', '13:00:00', 1, '2018-01-30 12:33:15', '2018-02-22 13:27:40'),
(2, 1, 2, '2018-02-20', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:28:42'),
(3, 1, 3, '2018-02-21', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:28:42'),
(4, 1, 4, '2018-02-22', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:28:42'),
(5, 1, 5, '2018-02-23', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:28:42'),
(11, 2, 11, '2018-02-19', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:34:01'),
(12, 2, 10, '2018-02-20', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:34:05'),
(13, 2, 9, '2018-02-21', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:34:07'),
(14, 2, 8, '2018-02-22', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:34:09'),
(15, 2, 7, '2018-02-23', '10:00:00', '13:00:00', 1, '2018-01-30 12:43:00', '2018-02-22 13:34:11');

-- --------------------------------------------------------

--
-- Table structure for table `exam_status`
--

CREATE TABLE `exam_status` (
  `id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `mark_due_date` date DEFAULT NULL,
  `publish_due_date` date DEFAULT NULL,
  `status` enum('Active','Publish') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exam_status`
--

INSERT INTO `exam_status` (`id`, `exam_id`, `section_id`, `start_date`, `end_date`, `mark_due_date`, `publish_due_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 1, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 12:42:26', '2018-02-22 13:21:46'),
(2, 5, 3, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 12:56:33', '2018-02-22 13:21:46'),
(3, 5, 5, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 12:56:54', '2018-02-22 13:21:46'),
(4, 5, 7, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(5, 5, 9, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(6, 5, 11, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(7, 5, 13, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(8, 5, 15, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(9, 5, 17, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(10, 5, 19, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(11, 5, 21, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(12, 5, 23, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46'),
(13, 5, 25, '2018-03-15', '2018-03-25', '2018-03-28', '2018-03-29', 'Active', '2018-02-22 13:16:59', '2018-02-22 13:21:46');

-- --------------------------------------------------------

--
-- Table structure for table `fee_category`
--

CREATE TABLE `fee_category` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_category`
--

INSERT INTO `fee_category` (`id`, `branch_id`, `name`, `created_at`) VALUES
(1, 1, 'General', '2018-02-28 09:31:37'),
(2, 1, 'OBC', '2018-03-14 10:37:14'),
(3, 1, 'SC/ST', '2018-03-14 10:43:42');

-- --------------------------------------------------------

--
-- Table structure for table `fee_class`
--

CREATE TABLE `fee_class` (
  `id` int(11) NOT NULL,
  `fee_structure_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_class`
--

INSERT INTO `fee_class` (`id`, `fee_structure_id`, `class_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 22),
(8, 1, 7),
(9, 1, 8),
(10, 1, 10),
(11, 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `fee_head`
--

CREATE TABLE `fee_head` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `periodicity` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_head`
--

INSERT INTO `fee_head` (`id`, `session_id`, `name`, `periodicity`, `created_at`) VALUES
(1, 1, 'Tuition Fee', 'Monthly', '2018-04-09 05:45:58'),
(2, 1, 'Development Fee', 'Quarterly', '2018-04-09 05:46:09'),
(3, 1, 'Sports Fee', 'Half-Yearly', '2018-04-09 05:48:41'),
(4, 1, 'Annual Exam Fee', 'January', '2018-04-09 05:50:58'),
(5, 1, 'annual day fee', 'February', '2018-04-09 05:52:58');

-- --------------------------------------------------------

--
-- Table structure for table `fee_invoice`
--

CREATE TABLE `fee_invoice` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `student_section_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_invoice`
--

INSERT INTO `fee_invoice` (`id`, `session_id`, `student_section_id`, `date`, `amount`, `created_at`) VALUES
(6, 1, 1, '2018-04-17', 5500, '2018-04-17 12:35:34'),
(7, 1, 5, '2018-04-17', 5500, '2018-04-17 12:35:45'),
(8, 1, 9, '2018-04-17', 5500, '2018-04-17 12:36:13');

-- --------------------------------------------------------

--
-- Table structure for table `fee_invoice_info`
--

CREATE TABLE `fee_invoice_info` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `fee_head_name` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_invoice_info`
--

INSERT INTO `fee_invoice_info` (`id`, `invoice_id`, `fee_head_name`, `amount`, `created_at`) VALUES
(16, 6, 'Tuition Fee', 1000, '2018-04-17 12:35:35'),
(17, 6, 'Development Fee', 1500, '2018-04-17 12:35:35'),
(18, 6, 'Sports Fee', 3000, '2018-04-17 12:35:35'),
(19, 7, 'Tuition Fee', 1000, '2018-04-17 12:35:45'),
(20, 7, 'Development Fee', 1500, '2018-04-17 12:35:45'),
(21, 7, 'Sports Fee', 3000, '2018-04-17 12:35:45'),
(22, 8, 'Tuition Fee', 1000, '2018-04-17 12:36:13'),
(23, 8, 'Development Fee', 1500, '2018-04-17 12:36:13'),
(24, 8, 'Sports Fee', 3000, '2018-04-17 12:36:13');

-- --------------------------------------------------------

--
-- Table structure for table `fee_payment`
--

CREATE TABLE `fee_payment` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `student_section_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_mode` enum('Cash','Cheque','Debit card','Credit card','Net banking','Others') NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_payment`
--

INSERT INTO `fee_payment` (`id`, `session_id`, `student_section_id`, `invoice_id`, `payment_date`, `payment_mode`, `transaction_id`, `amount`, `created_at`) VALUES
(1, 1, 1, 6, '2018-04-17', 'Cash', '', 1000, '2018-04-17 12:52:29'),
(2, 1, 1, 6, '2018-04-17', 'Cash', '', 1000, '2018-04-17 12:53:45'),
(3, 1, 1, 6, '2018-04-17', 'Cash', '', 1000, '2018-04-17 12:54:23'),
(4, 1, 5, 7, '2018-04-17', 'Cash', '', 10000, '2018-04-17 12:54:40');

-- --------------------------------------------------------

--
-- Table structure for table `fee_schedule`
--

CREATE TABLE `fee_schedule` (
  `id` int(11) NOT NULL,
  `fee_structure_info_id` int(11) NOT NULL,
  `due_date` date NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_schedule`
--

INSERT INTO `fee_schedule` (`id`, `fee_structure_info_id`, `due_date`, `amount`, `created_at`) VALUES
(1, 1, '2018-04-25', 1000, '2018-04-16 07:47:35'),
(2, 1, '2018-08-25', 1000, '2018-04-16 07:47:35'),
(3, 1, '2018-06-25', 1000, '2018-04-16 07:47:35'),
(4, 1, '2018-07-25', 1000, '2018-04-16 07:47:35'),
(5, 1, '2018-05-25', 1000, '2018-04-16 07:47:35'),
(6, 1, '2018-09-25', 1000, '2018-04-16 07:47:35'),
(7, 1, '2018-10-25', 1000, '2018-04-16 07:47:35'),
(8, 1, '2018-11-25', 1000, '2018-04-16 07:47:35'),
(9, 1, '2018-12-25', 1000, '2018-04-16 07:47:35'),
(10, 1, '2019-01-25', 1000, '2018-04-16 07:47:35'),
(11, 1, '2019-02-25', 1000, '2018-04-16 07:47:35'),
(12, 1, '2019-03-25', 1000, '2018-04-16 07:47:35'),
(13, 2, '2018-04-25', 1500, '2018-04-16 07:47:35'),
(14, 2, '2018-07-25', 1500, '2018-04-16 07:47:35'),
(15, 2, '2018-10-25', 1500, '2018-04-16 07:47:35'),
(16, 2, '2019-01-25', 1500, '2018-04-16 07:47:35'),
(17, 3, '2018-04-25', 3000, '2018-04-16 07:47:35'),
(18, 3, '2018-10-25', 3000, '2018-04-16 07:47:35'),
(19, 4, '2019-01-25', 500, '2018-04-16 07:47:35'),
(20, 5, '2019-02-25', 500, '2018-04-16 07:47:35');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure`
--

CREATE TABLE `fee_structure` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_structure`
--

INSERT INTO `fee_structure` (`id`, `session_id`, `name`, `created_at`) VALUES
(1, 1, 'Primary Fee Structure', '2018-04-09 06:50:23');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure_info`
--

CREATE TABLE `fee_structure_info` (
  `id` int(11) NOT NULL,
  `fee_structure_id` int(11) NOT NULL,
  `fee_head_id` int(11) NOT NULL,
  `fee_category_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `first_due_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `fee_structure_info`
--

INSERT INTO `fee_structure_info` (`id`, `fee_structure_id`, `fee_head_id`, `fee_category_id`, `amount`, `first_due_date`, `created_at`) VALUES
(1, 1, 1, 1, 1000, '2018-04-25', '2018-04-16 07:47:34'),
(2, 1, 2, 1, 1500, '2018-04-25', '2018-04-16 07:47:35'),
(3, 1, 3, 1, 3000, '2018-04-25', '2018-04-16 07:47:35'),
(4, 1, 4, 1, 500, '2019-01-25', '2018-04-16 07:47:35'),
(5, 1, 5, 1, 500, '2019-02-25', '2018-04-16 07:47:35');

-- --------------------------------------------------------

--
-- Table structure for table `holiday`
--

CREATE TABLE `holiday` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `no_of_days` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `holiday`
--

INSERT INTO `holiday` (`id`, `session_id`, `name`, `start_date`, `end_date`, `no_of_days`, `created_at`, `updated_at`) VALUES
(1, 1, 'New Year', '2017-01-01', '2017-01-01', 1, '2017-12-11 07:20:22', '2017-12-11 07:20:22'),
(3, 1, 'Pongal', '2017-01-14', '2017-01-17', 4, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(4, 1, 'Republic Day', '2017-01-26', '2017-01-26', 1, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(5, 1, 'Holi', '2017-03-01', '2017-03-02', 1, '2017-12-11 07:25:54', '2018-02-21 06:54:09'),
(6, 1, 'Good Friday', '2017-04-14', '2017-04-14', 1, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(7, 1, 'May Day', '2017-05-01', '2017-05-01', 1, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(8, 1, 'Independence Day', '2017-08-15', '2017-08-15', 1, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(9, 1, 'Diwali/Deepavali', '2017-10-19', '2017-10-21', 3, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(10, 1, 'Christmas', '2017-12-25', '2017-12-25', 1, '2017-12-11 07:25:54', '2017-12-11 07:25:54'),
(11, 2, 'New Year', '2017-01-01', '2017-01-01', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(12, 2, 'Pongal', '2017-01-14', '2017-01-17', 4, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(13, 2, 'Republic Day', '2017-01-26', '2017-01-26', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(14, 2, 'Holi', '2017-03-01', '2017-03-02', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(15, 2, 'Good Friday', '2017-04-14', '2017-04-14', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(16, 2, 'May Day', '2017-05-01', '2017-05-01', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(17, 2, 'Independence Day', '2017-08-15', '2017-08-15', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(18, 2, 'Diwali/Deepavali', '2017-10-19', '2017-10-21', 3, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(19, 2, 'Christmas', '2017-12-25', '2017-12-25', 1, '2018-02-21 06:56:09', '2018-02-21 06:56:09'),
(21, 2, 'gandhi jayanti', '2018-10-02', '2018-10-02', 1, '2018-03-09 12:26:01', '2018-03-09 12:26:01');

-- --------------------------------------------------------

--
-- Table structure for table `homework`
--

CREATE TABLE `homework` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `homework`
--

INSERT INTO `homework` (`id`, `session_id`, `section_id`, `subject_id`, `title`, `description`, `images`, `start_date`, `end_date`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'first Lession', 'complete 1-20 pages', '', '2018-01-24', '2018-01-25', 1, '2018-01-18 09:43:04', '2018-02-24 11:15:41'),
(2, 1, 1, 2, 'test postion', 'read 1st lession comprehensive', '', '2018-01-24', '2018-01-26', 2, '2018-01-18 09:47:20', '2018-02-24 11:16:00'),
(3, 1, 1, 3, 'project', 'learn about india', '', '2018-01-23', '2018-01-26', 3, '2018-01-18 09:47:20', '2018-02-24 11:16:00'),
(4, 1, 1, 4, 'talking', 'talk about any one sport', '', '2018-01-23', '2018-01-26', 4, '2018-01-18 09:47:20', '2018-02-24 11:16:00'),
(5, 1, 1, 5, 'Tables', 'read 1 - 5 tables', '', '2018-01-23', '2018-01-26', 5, '2018-01-18 09:47:20', '2018-02-24 11:16:00'),
(6, 1, 1, 1, 'maths workout ', 'write 5 times 5-10 table', '', '2018-01-29', '2017-01-31', 5, '2018-01-29 11:15:33', '2018-02-24 11:16:00'),
(7, 1, 1, 2, 'title', 'description', '', '2018-01-29', '2017-02-02', 5, '2018-01-29 11:19:58', '2018-02-24 11:16:00'),
(8, 1, 1, 2, 'India', 'write about india states', '', '2018-01-30', '2017-02-03', 5, '2018-01-30 09:22:39', '2018-02-24 11:16:00'),
(9, 1, 55, 26, 'Tmw test', '1st lession', '', '2018-02-21', '2018-02-23', 13, '2018-02-21 08:08:39', '2018-02-24 11:16:00'),
(10, 1, 57, 37, 'Project', 'draw india ouline map', '', '2018-02-21', '2018-02-22', 13, '2018-02-21 08:11:44', '2018-02-24 11:16:00'),
(49, 1, 1, 2, 'India', 'write india states and unionteriot', '', '2018-04-02', '2017-02-03', 2, '2018-04-02 05:43:11', '2018-04-02 05:43:11'),
(50, 1, 1, 2, 'test', 'write india states and unionteriot', '2018-04-17_2_1.jpg', '2018-04-17', '2017-04-20', 13, '2018-04-17 06:54:25', '2018-04-17 06:54:26');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_type` enum('Employee','Parent') NOT NULL DEFAULT 'Employee',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `session_id`, `message`, `sender_id`, `recipient_type`, `created_at`) VALUES
(1, 1, 'sdfsdf', 12, 'Employee', '2018-03-31 12:19:01'),
(2, 1, 'checking', 12, 'Parent', '2018-03-31 12:25:03'),
(3, 1, 'achecking', 12, 'Parent', '2018-03-31 12:26:36'),
(5, 1, 'hai vasanth', 14, 'Employee', '2018-04-02 03:04:25'),
(6, 1, '2nd msg', 14, 'Employee', '2018-04-02 03:05:27'),
(7, 1, 'again check', 14, 'Employee', '2018-04-02 03:07:27'),
(8, 1, 'section student message', 14, 'Parent', '2018-04-02 04:10:23'),
(9, 1, 'section student message', 14, 'Parent', '2018-04-02 04:12:04'),
(10, 1, 'section student message', 14, 'Parent', '2018-04-02 04:12:49'),
(11, 1, 'section student message', 14, 'Parent', '2018-04-02 04:14:49'),
(12, 1, 'section student message', 14, 'Parent', '2018-04-02 04:14:57'),
(13, 1, 'section student message', 14, 'Parent', '2018-04-02 04:16:57'),
(14, 1, 'sectiosection student message	\n', 14, 'Parent', '2018-04-02 04:19:43'),
(15, 1, 'section student message	\n', 14, 'Parent', '2018-04-02 04:20:43'),
(16, 1, 'section student message	\n', 14, 'Parent', '2018-04-02 04:24:28'),
(17, 1, 'asdasdsad', 14, 'Parent', '2018-04-02 04:25:52'),
(18, 1, 'asdasdsad', 14, 'Parent', '2018-04-02 04:28:49'),
(19, 1, 'new one', 14, 'Parent', '2018-04-02 04:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `message_recipient`
--

CREATE TABLE `message_recipient` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `message_recipient`
--

INSERT INTO `message_recipient` (`id`, `section_id`, `message_id`) VALUES
(1, 1, 13),
(2, 5, 13),
(3, 1, 14),
(4, 5, 14),
(5, 21, 15),
(6, 23, 15),
(7, 25, 15),
(8, 1, 15),
(9, 5, 15),
(10, 7, 15),
(11, 9, 15),
(12, 11, 15),
(13, 13, 15),
(14, 3, 15),
(15, 15, 15),
(16, 19, 15),
(17, 21, 16),
(18, 23, 16),
(19, 25, 16),
(20, 1, 16),
(21, 3, 16),
(22, 5, 16),
(23, 7, 16),
(24, 9, 16),
(25, 11, 16),
(26, 13, 16),
(27, 15, 16),
(28, 19, 16),
(29, 1, 17),
(30, 5, 17),
(31, 1, 18),
(32, 5, 18),
(33, 21, 19),
(34, 23, 19),
(35, 25, 19),
(36, 1, 19),
(37, 3, 19),
(38, 5, 19),
(39, 7, 19),
(40, 9, 19),
(41, 11, 19),
(42, 13, 19),
(43, 15, 19),
(44, 19, 19);

-- --------------------------------------------------------

--
-- Table structure for table `module`
--

CREATE TABLE `module` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `module`
--

INSERT INTO `module` (`id`, `name`, `created_at`) VALUES
(1, 'Fee', '2018-03-01 13:30:10'),
(2, 'Attendance', '2018-03-01 13:31:53'),
(3, 'Homework', '2018-03-01 13:31:53'),
(4, 'Exam', '2018-03-01 13:31:53'),
(5, 'Messaging', '2018-03-01 13:31:53');

-- --------------------------------------------------------

--
-- Table structure for table `notice_board`
--

CREATE TABLE `notice_board` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_type` enum('Parent','Employee') NOT NULL DEFAULT 'Parent',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notice_board`
--

INSERT INTO `notice_board` (`id`, `session_id`, `title`, `description`, `sender_id`, `recipient_type`, `created_at`, `updated_at`) VALUES
(1, 1, 'meeting', 'Parent meeting: 23rd Feb 12 PM <====> Admin To Parent', 12, 'Parent', '2018-02-19 09:44:37', '2018-02-24 06:47:12'),
(5, 1, 'Meeting', '23 rd Feb 4.00 Meeting', 2, 'Parent', '2018-02-19 09:48:16', '2018-02-19 10:52:16'),
(7, 1, 'Meeting', 'Parent meeting : 23rd Feb 10 AM', 2, 'Parent', '2018-02-19 09:55:02', '2018-02-19 09:55:15'),
(8, 1, 'Meeting', 'Parent meeting : 23rd Feb 11 AM', 2, 'Parent', '2018-02-19 09:55:32', '2018-02-19 09:55:38'),
(9, 1, 'Meeting', 'Parent meeting : 23rd Feb 12 PM', 12, 'Employee', '2018-02-19 10:51:42', '2018-02-19 10:52:57'),
(12, 1, 'Meeting', 'board exam meeting 24th Feb 2018, 11:00 AM to 1:00 PM', 12, 'Employee', '2018-02-19 13:34:29', '2018-02-19 13:34:29'),
(13, 1, 'Testing', 'Testing', 12, 'Employee', '2018-03-31 09:52:53', '2018-03-31 09:52:53'),
(14, 1, 'asd', 'asdsadsad', 12, 'Employee', '2018-03-31 09:57:05', '2018-03-31 09:57:05'),
(15, 1, 'sdf', 'sdfsdfsdf', 12, 'Parent', '2018-03-31 10:06:19', '2018-03-31 10:06:19'),
(16, 1, 'asdasdasdasd', 'asdsadasdsad', 14, 'Employee', '2018-04-02 04:37:27', '2018-04-02 04:37:27'),
(17, 1, 'sdassd', 'asdasdasdasd', 14, 'Employee', '2018-04-02 04:38:14', '2018-04-02 04:38:14'),
(18, 1, 'asdasd', 'asdasdsad', 14, 'Employee', '2018-04-02 04:40:10', '2018-04-02 04:40:10'),
(19, 1, 'asdasd', 'sdasda', 14, 'Employee', '2018-04-02 04:42:55', '2018-04-02 04:42:55'),
(20, 1, 'checking', 'asdasdsad', 14, 'Employee', '2018-04-02 04:47:11', '2018-04-02 04:47:11'),
(21, 1, 'checking', 'adsdasd', 14, 'Employee', '2018-04-02 04:48:08', '2018-04-02 04:48:08'),
(22, 1, 'checking', 'asdasdas', 14, 'Employee', '2018-04-02 04:48:46', '2018-04-02 04:48:46'),
(23, 1, 'asdsadsad', 'asdasdsadsad', 14, 'Employee', '2018-04-02 04:49:25', '2018-04-02 04:49:25'),
(24, 1, 'checking', 'checking', 14, 'Employee', '2018-04-02 04:52:21', '2018-04-02 04:52:21'),
(25, 1, 'checking again', 'asdsadsadsadasd', 14, 'Employee', '2018-04-02 04:52:57', '2018-04-02 04:52:57'),
(26, 1, 'meeting', 'asdsad', 14, 'Employee', '2018-04-02 04:53:18', '2018-04-02 04:53:18'),
(27, 1, 'student Notice checking', 'sdfsdfsdf', 14, 'Parent', '2018-04-02 05:27:06', '2018-04-02 05:27:06'),
(28, 1, 'student Notice checking', 'sdfsdfsdf', 14, 'Parent', '2018-04-02 05:29:06', '2018-04-02 05:29:06'),
(29, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:09:09', '2018-04-02 12:09:09'),
(30, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:13:06', '2018-04-02 12:13:06'),
(31, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:13:21', '2018-04-02 12:13:21'),
(32, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:14:07', '2018-04-02 12:14:07'),
(33, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:16:57', '2018-04-02 12:16:57'),
(34, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:18:25', '2018-04-02 12:18:25'),
(35, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:18:57', '2018-04-02 12:18:57'),
(36, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:20:13', '2018-04-02 12:20:13'),
(37, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:21:21', '2018-04-02 12:21:21'),
(38, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:21:55', '2018-04-02 12:21:55'),
(39, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:22:59', '2018-04-02 12:22:59'),
(40, 1, 'Testing1', 'testing1', 12, 'Parent', '2018-04-02 12:23:31', '2018-04-02 12:23:31'),
(41, 1, 'Testing1', 'testing1', 13, 'Parent', '2018-04-02 13:40:33', '2018-04-02 13:40:33'),
(42, 1, 'Testing1', 'testing1', 13, 'Parent', '2018-04-02 13:44:26', '2018-04-02 13:44:26');

-- --------------------------------------------------------

--
-- Table structure for table `notice_recipient`
--

CREATE TABLE `notice_recipient` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `notice_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notice_recipient`
--

INSERT INTO `notice_recipient` (`id`, `section_id`, `notice_id`) VALUES
(1, 1, 1),
(3, 5, 1),
(4, 3, 1),
(6, 1, 7),
(7, 21, 15),
(8, 23, 15),
(9, 25, 15),
(10, 1, 15),
(11, 5, 15),
(12, 7, 15),
(13, 3, 15),
(14, 9, 15),
(15, 11, 15),
(16, 13, 15),
(17, 15, 15),
(18, 19, 15),
(19, 1, 27),
(20, 1, 28),
(21, 5, 29),
(22, 5, 30),
(23, 1, 31),
(24, 1, 32),
(25, 1, 33),
(26, 1, 34),
(27, 1, 35),
(28, 1, 36),
(29, 1, 37),
(30, 1, 38),
(31, 1, 39),
(32, 1, 40),
(33, 1, 41),
(34, 1, 42);

-- --------------------------------------------------------

--
-- Table structure for table `occupation`
--

CREATE TABLE `occupation` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `occupation`
--

INSERT INTO `occupation` (`id`, `name`, `created_at`) VALUES
(1, 'Govt. Service', '2018-02-28 12:56:34'),
(2, 'Private Service', '2018-03-14 11:04:57'),
(3, 'Professional', '2018-03-14 11:04:57'),
(4, 'Business', '2018-03-14 11:06:01'),
(5, 'Retired', '2018-03-14 11:06:01'),
(6, 'Not working', '2018-03-14 11:06:10'),
(7, 'Others', '2018-03-14 11:06:10');

-- --------------------------------------------------------

--
-- Table structure for table `one_to_one`
--

CREATE TABLE `one_to_one` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `type` enum('SMS','Notice') NOT NULL DEFAULT 'SMS',
  `recipient` int(11) NOT NULL,
  `recipient_type` enum('Employee','Parent') NOT NULL DEFAULT 'Employee',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `one_to_one`
--

INSERT INTO `one_to_one` (`id`, `session_id`, `title`, `description`, `type`, `recipient`, `recipient_type`, `created_at`) VALUES
(1, 1, NULL, '', 'SMS', 8, 'Employee', '2018-03-31 13:45:27'),
(2, 1, NULL, '', 'SMS', 8, 'Employee', '2018-03-31 13:49:44'),
(3, 1, NULL, 'vadfadfdaf', 'SMS', 8, 'Employee', '2018-03-31 13:51:08'),
(4, 1, 'adfafa', 'sdasdasd', 'Notice', 8, 'Employee', '2018-03-31 13:53:08'),
(5, 1, NULL, 'vasa', 'SMS', 17, 'Parent', '2018-03-31 15:00:16'),
(6, 1, 'sdfsdf', 'sdfsdfsdf', 'Notice', 17, 'Parent', '2018-03-31 15:05:27'),
(7, 1, NULL, 'hello vasanth', 'SMS', 15, 'Employee', '2018-04-02 03:15:31'),
(8, 1, NULL, 'vasaanth', 'SMS', 15, 'Employee', '2018-04-02 03:20:38'),
(9, 1, NULL, 'check it', 'SMS', 15, 'Employee', '2018-04-02 03:26:42'),
(10, 1, NULL, 'check it again', 'SMS', 15, 'Employee', '2018-04-02 03:29:05'),
(11, 1, NULL, 'particular student message', 'SMS', 10, 'Parent', '2018-04-02 03:36:49'),
(12, 1, NULL, 'particular student message	', 'SMS', 10, 'Parent', '2018-04-02 03:37:41'),
(13, 1, NULL, 'particular student message	', 'SMS', 10, 'Parent', '2018-04-02 03:38:12'),
(14, 1, NULL, 'studentMessage', 'SMS', 10, 'Parent', '2018-04-02 03:40:42'),
(15, 1, NULL, 'studentInfo.student.parent.contact_no', 'SMS', 10, 'Parent', '2018-04-02 03:41:23'),
(16, 1, NULL, 'contact_no', 'SMS', 10, 'Parent', '2018-04-02 03:42:03'),
(17, 1, 'checking', 'adssadsad', 'Notice', 15, 'Employee', '2018-04-02 05:01:29'),
(18, 1, 'asdsad', 'asdasdas', 'Notice', 15, 'Employee', '2018-04-02 05:02:21'),
(19, 1, 'checking', 'asdasdsad', 'Notice', 2, 'Parent', '2018-04-02 05:10:01'),
(20, 1, 'asdsa', 'dsadsadsad', 'Notice', 2, 'Parent', '2018-04-02 05:11:25'),
(21, 1, 'asdsa', 'dsadsadsad', 'Notice', 2, 'Parent', '2018-04-02 05:12:45'),
(22, 1, 'asdasd', 'asdasdsad', 'Notice', 6, 'Parent', '2018-04-02 05:14:57'),
(23, 1, 'asdasd', 'asdasdasdsad', 'Notice', 2, 'Parent', '2018-04-02 05:16:26'),
(24, 1, 'asdas', 'dsadasdsad', 'Notice', 2, 'Parent', '2018-04-02 05:16:44'),
(25, 1, 'Manish checking single student push', 'sdfsdfsdf', 'Notice', 2, 'Parent', '2018-04-02 05:17:22');

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

CREATE TABLE `parent` (
  `id` int(11) NOT NULL,
  `father_name` varchar(50) NOT NULL,
  `mother_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `father_no` varchar(15) DEFAULT NULL,
  `mother_no` varchar(15) DEFAULT NULL,
  `father_qualification` varchar(100) DEFAULT NULL,
  `mother_qualification` varchar(100) DEFAULT NULL,
  `father_occupation` varchar(50) DEFAULT NULL,
  `mother_occupation` varchar(50) DEFAULT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parent`
--

INSERT INTO `parent` (`id`, `father_name`, `mother_name`, `email`, `contact_no`, `father_no`, `mother_no`, `father_qualification`, `mother_qualification`, `father_occupation`, `mother_occupation`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Ramu', 'Leela', 'ramu@gmail.com', '7452103690', '7452103690', '7452103874', NULL, NULL, NULL, NULL, '#320 hosur road,\r\nkudlu gate,\r\nBangalore - 560078', '2017-12-11 06:24:33', '2017-12-15 11:13:03'),
(2, 'Rajan', 'Aadhira', 'Rajan@gmail.com', '7892013654', '7892013654', '7410258963', NULL, NULL, NULL, NULL, '#20 rajiv road,\r\nbtm 2 stage,\r\nbangalore - 560077', '2017-12-11 06:39:05', '2017-12-15 11:13:11'),
(3, 'venu', 'Dhanya', 'venu@gmail.com', '9987678888', '9123456780', '9987678888', NULL, NULL, NULL, NULL, '#ranaja street,\r\nE-city phase 1,\r\nbangalore - 564300', '2017-12-11 06:42:03', '2017-12-15 11:13:26'),
(4, 'brabhu', 'Kashika', 'brabhu@gmail.com', '7532146980', '7895201463', '7532146980', NULL, NULL, NULL, NULL, '#2 PES road,\r\nKonappana agaragara,\r\nBangalore - 560089', '2017-12-11 06:44:07', '2017-12-15 11:13:28'),
(12, 'dsad', 'asdsamd', 'basd@gmail.com', '3423423480', '123213123123', '123123213', NULL, NULL, NULL, NULL, 'sdfsdf', '2018-02-20 13:17:00', '2018-02-20 13:17:00'),
(18, 'rajan', 'kumari', 'rajan@gmail.com', '9510000100', '9510000100', '9994442251', '', '', '', '', '#indira nagar, bangaluru - 560068', '2018-02-28 09:54:44', '2018-02-28 10:54:56'),
(21, 'wer', '234', 'sdfds@gmail.com', '345435435', '234324', '23423', '12th Pass', '12th Pass', 'Private Service', 'Private Service', 'sdfgfdg', '2018-03-17 11:01:29', '2018-03-17 11:01:29'),
(22, 'Rahul', 'xyx', 'rahul@kratitech.com', '9560315528', '9560315528', '9560315528', '', '', '', '', '#indira nagar, bangaluru - 560068', '2018-03-23 13:48:50', '2018-03-23 13:48:50'),
(23, 'Dinakaran', 'Divya', 'dinakaran@kratitech.com', '9850000000', '9850000000', '9850000000', '', '', '', '', '#indira nagar, bangaluru - 560068', '2018-03-23 13:51:32', '2018-04-02 03:45:22'),
(28, 'Vijay', 'rooba', 'vijay@gmail.com', '9894929680', NULL, NULL, NULL, NULL, NULL, NULL, 'chennai', '2018-03-26 15:10:47', '2018-04-02 04:07:32'),
(29, 'vasanth', 'vasanth', 'vasanthvv@gmail.com', '8903709742', NULL, NULL, NULL, NULL, NULL, NULL, 'vasanth', '2018-04-02 03:51:08', '2018-04-02 03:51:08'),
(30, 'sdf', 'sdf', 'sdf@gmial.com', '9522446565', NULL, NULL, NULL, NULL, NULL, NULL, 'sdf', '2018-04-02 04:08:47', '2018-04-02 04:08:47');

-- --------------------------------------------------------

--
-- Table structure for table `parent_device`
--

CREATE TABLE `parent_device` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `device_token` text NOT NULL,
  `imei` varchar(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parent_device`
--

INSERT INTO `parent_device` (`id`, `parent_id`, `device_token`, `imei`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'djS9ZjNbzo8:APA91bGOyg_e6hBCAa2YmmKWbw2iHl-hx4eBrCGjz8SPO68P1v-LL1iTHsKXWfH2H1yOXU52BXXJnBhOjPn4Gx8nGbjdMs8f8Fk8HfdItSM-5_LC_fmvoWV2pZKy0dgNmH3-oKRuf-OK', 'asd', 1, '2018-03-27 09:36:18', '2018-04-02 12:19:52'),
(2, 2, 'djS9ZjNbzo8:APA91bGOyg_e6hBCAa2YmmKWbw2iHl-hx4eBrCGjz8SPO68P1v-LL1iTHsKXWfH2H1yOXU52BXXJnBhOjPn4Gx8nGbjdMs8f8Fk8HfdItSM-5_LC_fmvoWV2pZKy0dgNmH3-oKRuf-OK', '', 1, '2018-03-27 10:41:06', '2018-04-02 12:19:49'),
(3, 3, 'djS9ZjNbzo8:APA91bGOyg_e6hBCAa2YmmKWbw2iHl-hx4eBrCGjz8SPO68P1v-LL1iTHsKXWfH2H1yOXU52BXXJnBhOjPn4Gx8nGbjdMs8f8Fk8HfdItSM-5_LC_fmvoWV2pZKy0dgNmH3-oKRuf-OK', '', 1, '2018-03-27 10:41:06', '2018-04-02 12:19:56'),
(4, 4, 'djS9ZjNbzo8:APA91bGOyg_e6hBCAa2YmmKWbw2iHl-hx4eBrCGjz8SPO68P1v-LL1iTHsKXWfH2H1yOXU52BXXJnBhOjPn4Gx8nGbjdMs8f8Fk8HfdItSM-5_LC_fmvoWV2pZKy0dgNmH3-oKRuf-OK', '', 1, '2018-03-27 10:41:31', '2018-04-02 12:19:59'),
(5, 12, 'djS9ZjNbzo8:APA91bGOyg_e6hBCAa2YmmKWbw2iHl-hx4eBrCGjz8SPO68P1v-LL1iTHsKXWfH2H1yOXU52BXXJnBhOjPn4Gx8nGbjdMs8f8Fk8HfdItSM-5_LC_fmvoWV2pZKy0dgNmH3-oKRuf-OK', '', 1, '2018-03-27 10:41:31', '2018-04-02 12:20:02');

-- --------------------------------------------------------

--
-- Table structure for table `periods`
--

CREATE TABLE `periods` (
  `id` int(11) NOT NULL,
  `timings_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `qualification`
--

CREATE TABLE `qualification` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`id`, `name`, `created_at`) VALUES
(1, 'Under 12', '2018-02-28 12:56:55'),
(2, '12th Pass', '2018-03-14 11:04:00'),
(3, 'Graduate', '2018-03-14 11:04:00'),
(4, 'Post-graduate', '2018-03-14 11:04:13'),
(5, 'Doctorate', '2018-03-14 11:04:13'),
(6, 'Others', '2018-03-14 11:04:16');

-- --------------------------------------------------------

--
-- Table structure for table `religion`
--

CREATE TABLE `religion` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `religion`
--

INSERT INTO `religion` (`id`, `name`, `created_at`) VALUES
(1, 'Hindu', '2018-02-28 12:56:43'),
(2, 'Muslim', '2018-03-14 11:01:54'),
(3, 'Sikh', '2018-03-14 11:01:54'),
(4, 'Jain', '2018-03-14 11:02:05'),
(5, 'Buddhist', '2018-03-14 11:02:05'),
(6, 'Christian', '2018-03-14 11:02:13'),
(7, 'Others', '2018-03-14 11:02:13');

-- --------------------------------------------------------

--
-- Table structure for table `school`
--

CREATE TABLE `school` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `school`
--

INSERT INTO `school` (`id`, `name`, `created_at`) VALUES
(1, 'Delhi Public School', '2018-01-27 07:20:49'),
(3, 'dps', '2018-03-01 12:23:17'),
(4, 'Army Public School', '2018-03-07 09:13:16');

-- --------------------------------------------------------

--
-- Table structure for table `school_subscription`
--

CREATE TABLE `school_subscription` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `duration` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `fee` int(11) NOT NULL DEFAULT '0',
  `attendance` int(11) NOT NULL DEFAULT '0',
  `homework` int(11) NOT NULL DEFAULT '0',
  `exam` int(11) NOT NULL DEFAULT '0',
  `messaging` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `room_no` varchar(20) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `class_id`, `name`, `room_no`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'A', '101', 1, '2017-12-10 11:09:00', '2018-02-27 09:55:14'),
(3, 2, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(5, 3, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(7, 4, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(9, 5, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(11, 6, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(13, 7, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(15, 8, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(17, 9, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(19, 10, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(21, 11, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(23, 12, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(25, 13, 'A', NULL, 1, '2017-12-10 11:13:03', '2018-01-06 10:10:19'),
(46, 14, 'A', '101', 1, '2018-02-21 06:42:05', '2018-02-21 06:42:05'),
(47, 14, 'B', '102', 1, '2018-02-21 06:42:13', '2018-02-21 06:42:13'),
(48, 15, 'A', '103', 1, '2018-02-21 06:42:24', '2018-02-21 06:42:24'),
(49, 16, 'A', '104', 1, '2018-02-21 06:42:31', '2018-02-21 06:42:31'),
(50, 17, 'A', '105', 1, '2018-02-21 06:42:37', '2018-02-21 06:42:37'),
(51, 17, 'B', '106', 1, '2018-02-21 06:42:42', '2018-02-21 06:42:42'),
(52, 18, 'A', '107', 1, '2018-02-21 06:42:53', '2018-02-21 06:42:53'),
(53, 19, 'B', '108', 1, '2018-02-21 06:43:02', '2018-02-21 06:43:02'),
(54, 20, 'A', '109', 1, '2018-02-21 06:43:09', '2018-02-22 13:14:18'),
(55, 21, 'A', '110', 1, '2018-02-21 06:43:23', '2018-02-22 13:14:14'),
(57, 21, 'B', '', 1, '2018-02-21 06:43:37', '2018-02-21 06:43:37'),
(58, 14, 'C', NULL, 1, '2018-04-01 10:49:48', '2018-04-01 10:49:48');

-- --------------------------------------------------------

--
-- Table structure for table `section_name`
--

CREATE TABLE `section_name` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `section_name`
--

INSERT INTO `section_name` (`id`, `branch_id`, `name`, `created_at`) VALUES
(1, 1, 'A', '2018-02-28 12:48:23'),
(2, 1, 'B', '2018-02-28 12:46:21'),
(3, 1, 'C', '2018-02-28 12:46:27'),
(4, 1, 'D', '2018-03-28 09:52:51');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('Present','Past','Future') DEFAULT 'Present',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `branch_id`, `name`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '2017-2018', '2017-05-01', '2019-04-20', 'Present', '2017-12-09 11:56:58', '2018-04-09 10:00:18'),
(2, 2, '2017 - 2018', '2017-05-10', '2018-05-03', 'Present', '2018-02-21 06:30:28', '2018-02-21 06:30:35'),
(10, 1, '2016-2017', '2016-05-10', '2017-04-23', 'Past', '2018-02-13 07:22:07', '2018-02-13 07:22:07');

-- --------------------------------------------------------

--
-- Table structure for table `stream`
--

CREATE TABLE `stream` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stream`
--

INSERT INTO `stream` (`id`, `branch_id`, `name`, `created_at`) VALUES
(1, 1, '1st - Computer Science', '2018-02-14 07:52:54'),
(2, 1, '1st - Biology', '2018-02-14 07:52:58'),
(3, 1, '3rd - Accountant', '2018-02-14 07:53:02'),
(4, 2, '1st - Science', '2018-02-14 02:22:54'),
(5, 2, '1st - Biology', '2018-02-14 02:22:58'),
(6, 2, '1st - Maths', '2018-02-14 02:23:02');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `admission_no` varchar(10) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `dob` date NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `due_amount` decimal(11,2) NOT NULL,
  `religion` varchar(20) DEFAULT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `id_proof` varchar(50) DEFAULT NULL,
  `admission_date` date NOT NULL,
  `house` varchar(20) DEFAULT NULL,
  `barcode` varchar(20) DEFAULT NULL,
  `mode_of_transport` varchar(20) DEFAULT NULL,
  `photo_no` varchar(20) DEFAULT NULL,
  `photo` longtext,
  `remarks` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `admission_no`, `parent_id`, `first_name`, `last_name`, `dob`, `gender`, `blood_group`, `category_id`, `due_amount`, `religion`, `aadhar_no`, `id_proof`, `admission_date`, `house`, `barcode`, `mode_of_transport`, `photo_no`, `photo`, `remarks`, `created_at`, `updated_at`) VALUES
(1, '0', 1, 'Anand', 'raj', '2010-12-04', 'Male', '', 1, '2500.00', NULL, NULL, NULL, '2015-12-04', NULL, NULL, NULL, NULL, NULL, '', '2017-12-11 06:19:16', '2018-04-17 12:54:23'),
(2, '0', 2, 'Ragav', 'rajan', '2005-12-05', 'Male', '', 1, '0.00', NULL, NULL, NULL, '2009-06-03', NULL, NULL, NULL, NULL, NULL, '', '2017-12-11 06:30:02', '2018-04-17 12:17:58'),
(3, '0', 2, 'Vinay', 'kumar', '2006-12-05', 'Male', '', 1, '0.00', NULL, NULL, NULL, '2010-06-01', NULL, NULL, NULL, NULL, NULL, '', '2017-12-11 06:33:08', '2018-02-28 09:30:08'),
(4, '0', 3, 'Rani', 'M', '2009-12-05', 'Female', '', 1, '0.00', NULL, NULL, NULL, '2014-06-02', NULL, NULL, NULL, NULL, NULL, '', '2017-12-11 06:33:08', '2018-02-28 09:30:08'),
(5, '0', 4, 'Bindhu', 'sri', '2007-12-05', 'Female', '', 1, '-4500.00', NULL, NULL, NULL, '2011-06-10', NULL, NULL, NULL, NULL, NULL, '', '2017-12-11 06:33:08', '2018-04-17 12:54:40'),
(12, '0', 12, 'rani', 'm', '2000-01-01', 'Male', '', NULL, '0.00', NULL, NULL, NULL, '2017-12-12', NULL, NULL, NULL, NULL, NULL, '', '2018-02-20 13:17:00', '2018-03-29 11:44:33'),
(13, '100001', 18, 'rani', 'm', '2000-01-01', 'Male', '', 1, '0.00', '0', '', '', '2017-12-12', NULL, NULL, NULL, NULL, NULL, '', '2018-02-28 09:54:45', '2018-03-30 10:56:52'),
(19, '100001', 21, 'sdfsdf', 'sdf', '2018-03-07', 'Female', '', 2, '0.00', 'Muslim', 'wrwerwer', 'wer', '2018-03-08', NULL, NULL, NULL, NULL, NULL, 'wer', '2018-03-17 11:01:30', '2018-03-17 11:01:30'),
(20, '100001', 22, 'Manish', 'Yadhav', '2000-01-01', 'Male', '', 1, '5500.00', 'Hindu', '', '', '2017-12-12', NULL, NULL, NULL, NULL, NULL, '', '2018-03-23 13:48:50', '2018-04-17 12:36:14'),
(21, '100001', 23, 'varun', 'Yadhav', '2000-01-01', 'Male', '', 1, '0.00', 'Hindu', '', '', '2017-12-12', NULL, NULL, NULL, NULL, NULL, '', '2018-03-23 13:51:32', '2018-03-30 10:56:58'),
(28, '100001', 28, 'Aakanksha', 's', '2010-01-02', 'Female', '', NULL, '0.00', NULL, NULL, NULL, '2015-01-02', NULL, NULL, NULL, NULL, '28.jpg', NULL, '2018-03-26 15:10:47', '2018-04-06 14:17:40'),
(29, '100001', 29, 'vasanth', NULL, '2018-04-02', 'Male', NULL, NULL, '0.00', NULL, NULL, NULL, '2018-04-01', NULL, NULL, NULL, NULL, NULL, NULL, '2018-04-02 03:51:08', '2018-04-02 03:51:08'),
(30, '100001', 30, 'sdfsdf', 's', '2018-04-02', 'Male', NULL, NULL, '0.00', NULL, NULL, NULL, '2018-04-20', NULL, NULL, NULL, NULL, NULL, NULL, '2018-04-02 04:08:47', '2018-04-02 04:08:47');

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance`
--

CREATE TABLE `student_attendance` (
  `id` int(11) NOT NULL,
  `student_section_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `student_attendance`
--

INSERT INTO `student_attendance` (`id`, `student_section_id`, `date`, `status`, `created_at`) VALUES
(1, 1, '2018-01-18', 2, '2018-01-20 11:41:36'),
(2, 2, '2018-01-18', 2, '2018-01-20 11:42:43'),
(3, 3, '2018-01-18', 2, '2018-01-20 11:42:43'),
(4, 4, '2018-01-18', 1, '2018-01-20 11:42:43'),
(5, 5, '2018-01-18', 1, '2018-01-20 11:42:43'),
(6, 1, '2018-01-19', 1, '2018-01-20 11:42:43'),
(7, 2, '2018-01-19', 1, '2018-01-20 11:42:43'),
(8, 3, '2018-01-19', 1, '2018-01-20 11:42:43'),
(9, 4, '2018-01-19', 1, '2018-01-20 11:42:43'),
(10, 4, '2018-01-19', 1, '2018-01-20 11:42:43'),
(11, 1, '2018-01-17', 1, '2018-01-20 11:42:43'),
(12, 2, '2018-01-17', 1, '2018-01-20 11:44:34'),
(13, 3, '2018-01-17', 1, '2018-01-20 11:46:00'),
(14, 4, '2018-01-17', 1, '2018-01-20 11:46:00'),
(15, 5, '2018-01-17', 1, '2018-01-20 11:46:00'),
(16, 1, '2018-01-16', 1, '2018-01-20 11:46:00'),
(17, 2, '2018-01-16', 1, '2018-01-20 11:46:00'),
(18, 3, '2018-01-16', 1, '2018-01-20 11:46:00'),
(19, 4, '2018-01-16', 1, '2018-01-20 11:46:00'),
(20, 5, '2018-01-16', 1, '2018-01-20 11:46:00'),
(21, 1, '2018-01-15', 1, '2018-01-20 11:46:00'),
(22, 2, '2018-01-15', 1, '2018-01-20 11:46:00'),
(23, 3, '2018-01-15', 1, '2018-01-20 11:46:00'),
(24, 4, '2018-01-15', 1, '2018-01-20 11:46:00'),
(25, 5, '2018-01-15', 1, '2018-01-20 11:46:00'),
(26, 1, '2018-02-01', 1, '2018-02-01 13:13:11'),
(27, 2, '2018-02-01', 1, '2018-02-01 13:13:11'),
(28, 3, '2018-02-01', 0, '2018-02-01 13:13:11'),
(29, 4, '2018-02-01', 1, '2018-02-01 13:13:11'),
(30, 5, '2018-02-01', 1, '2018-02-01 13:13:11'),
(31, 1, '2018-02-04', 1, '2018-02-05 08:00:44'),
(32, 2, '2018-02-04', 3, '2018-02-05 08:00:44'),
(33, 3, '2018-02-04', 1, '2018-02-05 08:00:44'),
(34, 4, '2018-02-04', 1, '2018-02-05 08:00:44'),
(35, 4, '2018-02-04', 1, '2018-02-05 08:00:44'),
(36, 1, '2018-02-13', 1, '2018-02-13 09:10:22'),
(37, 2, '2018-02-13', 1, '2018-02-13 09:10:22'),
(38, 3, '2018-02-13', 1, '2018-02-13 09:10:22'),
(39, 4, '2018-02-13', 0, '2018-02-13 09:10:22'),
(40, 1, '2018-02-15', 1, '2018-04-02 05:41:45'),
(41, 2, '2018-02-15', 1, '2018-04-02 05:41:45'),
(42, 3, '2018-02-15', 1, '2018-04-02 05:41:45'),
(43, 4, '2018-02-15', 1, '2018-04-02 05:41:45'),
(44, 4, '2018-02-15', 1, '2018-04-02 05:41:45'),
(45, 1, '2018-02-16', 1, '2018-04-02 05:42:21'),
(46, 3, '2018-02-16', 1, '2018-04-02 05:42:21'),
(47, 2, '2018-02-16', 1, '2018-04-02 05:42:21'),
(48, 4, '2018-02-16', 1, '2018-04-02 05:42:21'),
(49, 4, '2018-02-16', 1, '2018-04-02 05:42:21'),
(50, 1, '2018-02-16', 1, '2018-04-02 05:42:30'),
(51, 2, '2018-02-16', 2, '2018-04-02 05:42:30'),
(52, 3, '2018-02-16', 1, '2018-04-02 05:42:30'),
(53, 4, '2018-02-16', 1, '2018-04-02 05:42:30'),
(54, 4, '2018-02-16', 1, '2018-04-02 05:42:30'),
(55, 1, '2018-02-16', 1, '2018-04-02 05:42:38'),
(56, 2, '2018-02-16', 0, '2018-04-02 05:42:38'),
(57, 3, '2018-02-16', 1, '2018-04-02 05:42:38'),
(58, 4, '2018-02-16', 1, '2018-04-02 05:42:38'),
(59, 4, '2018-02-16', 1, '2018-04-02 05:42:38');

-- --------------------------------------------------------

--
-- Table structure for table `student_section`
--

CREATE TABLE `student_section` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `roll_no` int(11) DEFAULT NULL,
  `status` enum('STUDYING','PASS','FAIL','COMPLETED','TRANSFER') NOT NULL DEFAULT 'STUDYING',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `student_section`
--

INSERT INTO `student_section` (`id`, `session_id`, `student_id`, `section_id`, `roll_no`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 2, 'STUDYING', '2017-12-11 10:52:16', '2018-03-29 13:46:46'),
(2, 1, 2, 1, 5, 'STUDYING', '2017-12-11 10:53:57', '2018-03-29 13:46:46'),
(3, 1, 3, 3, 9, 'STUDYING', '2017-12-11 10:54:38', '2018-03-29 15:01:50'),
(4, 1, 4, 1, 6, 'STUDYING', '2017-12-11 10:56:50', '2018-03-29 13:46:46'),
(5, 1, 5, 1, 3, 'STUDYING', '2017-12-11 10:57:13', '2018-03-29 13:46:46'),
(6, 1, 12, 1, 7, 'STUDYING', '2018-02-20 13:17:01', '2018-03-29 13:46:46'),
(7, 2, 13, 55, NULL, 'STUDYING', '2018-02-28 09:54:45', '2018-02-28 10:54:56'),
(8, 2, 19, 5, NULL, 'STUDYING', '2018-03-17 11:01:30', '2018-03-17 11:01:30'),
(9, 1, 20, 1, 4, 'STUDYING', '2018-03-23 13:48:51', '2018-03-29 13:46:46'),
(10, 1, 21, 1, 8, 'STUDYING', '2018-03-23 13:51:32', '2018-03-29 13:46:46'),
(17, 1, 28, 5, 1, 'STUDYING', '2018-03-26 15:10:48', '2018-04-02 03:54:59'),
(18, 1, 29, 1, NULL, 'STUDYING', '2018-04-02 03:51:08', '2018-04-02 03:55:59'),
(19, 1, 30, 3, NULL, 'STUDYING', '2018-04-02 04:08:47', '2018-04-02 04:08:47');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`id`, `branch_id`, `name`, `created_at`) VALUES
(1, 1, 'Mathematics', '2017-12-19 12:59:45'),
(2, 1, 'Science', '2017-12-19 12:59:45'),
(3, 1, 'Music', '2017-12-19 12:59:45'),
(4, 1, 'English', '2017-12-19 12:59:45'),
(5, 1, 'Sports', '2017-12-19 12:59:45'),
(6, 1, 'Physical Education', '2017-12-19 12:59:45'),
(7, 1, 'Algebra', '2017-12-19 12:59:45'),
(8, 1, 'Basic Math', '2017-12-19 12:59:45'),
(9, 1, 'Arts', '2017-12-19 12:59:45'),
(10, 1, 'Dramatics', '2017-12-19 12:59:45'),
(11, 1, 'Geometry', '2017-12-19 12:59:45'),
(12, 1, 'Life Science', '2017-12-19 12:59:45'),
(13, 1, 'Physical Science', '2017-12-19 12:59:45'),
(14, 1, 'Health', '2017-12-19 12:59:45'),
(21, 1, 'Chemistry', '2018-02-05 07:10:07'),
(22, 1, 'newewe', '2018-02-07 11:41:48'),
(23, 2, 'Mathematics', '2017-12-19 07:29:45'),
(24, 2, 'Science', '2017-12-19 07:29:45'),
(25, 2, 'Music', '2017-12-19 07:29:45'),
(26, 2, 'English', '2017-12-19 07:29:45'),
(27, 2, 'Sports', '2017-12-19 07:29:45'),
(28, 2, 'Physical Education', '2017-12-19 07:29:45'),
(29, 2, 'Algebra', '2017-12-19 07:29:45'),
(30, 2, 'Basic Math', '2017-12-19 07:29:45'),
(31, 2, 'Arts', '2017-12-19 07:29:45'),
(32, 2, 'Dramatics', '2017-12-19 07:29:45'),
(33, 2, 'Geometry', '2017-12-19 07:29:45'),
(34, 2, 'Life Science', '2017-12-19 07:29:45'),
(35, 2, 'Physical Science', '2017-12-19 07:29:45'),
(36, 2, 'Health', '2017-12-19 07:29:45'),
(37, 2, 'Chemistry', '2018-02-05 01:40:07'),
(38, 1, 'xcvxcvxcv', '2018-04-09 13:25:04');

-- --------------------------------------------------------

--
-- Table structure for table `timetable`
--

CREATE TABLE `timetable` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `start_time` time NOT NULL,
  `no_of_days` int(11) NOT NULL,
  `no_of_period` int(11) NOT NULL,
  `period_duration` int(11) NOT NULL,
  `break_duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `timetable`
--

INSERT INTO `timetable` (`id`, `branch_id`, `name`, `start_time`, `no_of_days`, `no_of_period`, `period_duration`, `break_duration`, `created_at`) VALUES
(1, 1, 'Primary time table', '09:00:00', 5, 5, 45, 20, '2018-04-12 11:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `timings`
--

CREATE TABLE `timings` (
  `id` int(11) NOT NULL,
  `timetable_id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `type` enum('Period','Break') NOT NULL DEFAULT 'Period',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `timings`
--

INSERT INTO `timings` (`id`, `timetable_id`, `start_time`, `end_time`, `type`, `created_at`, `updated_at`) VALUES
(1, 1, '09:00:00', '09:45:00', 'Period', '2018-04-12 11:31:46', '2018-04-12 11:31:46'),
(2, 1, '09:45:00', '10:30:00', 'Period', '2018-04-12 11:31:46', '2018-04-12 11:31:46'),
(3, 1, '10:30:00', '10:50:00', 'Break', '2018-04-12 11:31:46', '2018-04-12 11:31:46'),
(4, 1, '11:35:00', '12:20:00', 'Period', '2018-04-12 11:31:46', '2018-04-12 11:31:46'),
(5, 1, '12:20:00', '13:05:00', 'Period', '2018-04-12 11:31:46', '2018-04-12 11:31:46'),
(6, 1, '10:50:00', '11:35:00', 'Period', '2018-04-12 11:31:46', '2018-04-12 11:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_no` varchar(15) NOT NULL,
  `password` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('Employee','Parent') NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `user_name`, `user_no`, `password`, `user_id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ramu@gmail.com', '7452103690', 'ee8e4b7c8c0bbff0ea180db2cfa15aa5', 1, 'Parent', 1, '2017-12-15 11:15:21', '2018-02-15 12:55:27'),
(2, 'Rajan@gmail.com', '7892013654', 'ee8e4b7c8c0bbff0ea180db2cfa15aa5', 2, 'Parent', 1, '2017-12-15 11:16:06', '2017-12-22 06:34:28'),
(3, 'Mohan@gmail.com', '7458963210', 'ee8e4b7c8c0bbff0ea180db2cfa15aa5', 1, 'Employee', 1, '2017-12-15 11:17:22', '2018-02-15 12:27:49'),
(4, 'vinay@gmail.com', '4565461233', 'f073560f61c8466c16bc60350fba6231', 2, 'Employee', 1, '2017-12-15 11:18:10', '2018-03-20 08:30:12'),
(6, 'vijayprakesh@dps.com', '9512365478', 'f073560f61c8466c16bc60350fba6231', 12, 'Employee', 1, '2018-02-16 10:10:35', '2018-03-20 08:31:15'),
(11, 'basd@gmail.com', '3423423480', 'c17c9db0b85bb67b87202a1a04e1b459', 12, 'Parent', 1, '2018-02-20 13:17:00', '2018-02-20 13:17:00'),
(12, 'raj1980@gmail.com', '987678100', 'ee8e4b7c8c0bbff0ea180db2cfa15aa5', 13, 'Employee', 1, '2018-02-21 08:07:56', '2018-02-27 07:35:50'),
(13, 'test@gmail.com', '987678100', 'ee8e4b7c8c0bbff0ea180db2cfa15aa5', 14, 'Employee', 1, '2018-02-21 08:16:42', '2018-04-03 07:01:58'),
(14, 'rajan@gmail.com', '9510000100', '7d0a6350a5962093c2bc130ef8727b1f', 18, 'Parent', 1, '2018-02-28 09:54:45', '2018-02-28 10:54:56'),
(15, 'sdfds@gmail.com', '345435435', 'e73eca55c084a788b429a55b667318f8', 21, 'Parent', 1, '2018-03-17 11:01:30', '2018-03-17 11:01:30'),
(16, 'rahul@kratitech.com', '9560315528', '56e255eaa0d3212805a79a75b868dc9a', 22, 'Parent', 1, '2018-03-23 13:48:51', '2018-03-23 13:48:51'),
(17, 'dinakaran@kratitech.com', '9850000000', '5e3ec1a81c3c28e1131a309625808b5f', 23, 'Parent', 1, '2018-03-23 13:51:32', '2018-03-23 13:51:32'),
(30, 'vijay@gmail.com', '9999900000', '319f59bc863a4eb002da1934901aebb4', 28, 'Parent', 1, '2018-03-26 15:10:48', '2018-03-26 15:10:48'),
(31, 'pvk@gmail.com', '8903709742', '4c1f7ede705743a8fb29e0652d78ff85', 15, 'Employee', 1, '2018-04-02 03:10:10', '2018-04-02 03:10:10'),
(32, 'vasanthvv@gmail.com', '8903709742', '4c1f7ede705743a8fb29e0652d78ff85', 29, 'Parent', 1, '2018-04-02 03:51:08', '2018-04-02 03:51:08'),
(33, 'sdf@gmial.com', '9522446565', 'cf764c2d12da2e1990f19451f917219e', 30, 'Parent', 1, '2018-04-02 04:08:47', '2018-04-02 04:08:47'),
(35, 'sdfsdfggfdkg@gmail.com', '4523434234', 'a999d256d31aa74cafd66f202b75fc98', 32, 'Parent', 1, '2018-04-07 08:18:00', '2018-04-07 08:18:00'),
(36, 'asdsadtt@gmail.com', '1111111111', 'e11170b8cbd2d74102651cb967fa28e5', 33, 'Parent', 1, '2018-04-07 08:30:32', '2018-04-07 08:30:32'),
(38, 'dfsdf@gmail.com', '222222222', '0d777e9e30b918e9034ab610712c90cf', 16, 'Employee', 1, '2018-04-07 09:55:25', '2018-04-07 09:55:25'),
(39, 'dfgfdgdfg@gmail.com', '34234234234', 'b7979cf34f0e8ce36a15e6fb8cb6733b', 17, 'Employee', 1, '2018-04-07 09:57:58', '2018-04-07 09:57:58');

-- --------------------------------------------------------

--
-- Table structure for table `user_session`
--

CREATE TABLE `user_session` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(50) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_session`
--

INSERT INTO `user_session` (`id`, `user_id`, `session_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 12, '152267524333912', 1, '2018-04-02 13:20:43', '2018-04-02 14:03:55'),
(2, 13, '152394325714313', 1, '2018-04-03 07:02:06', '2018-04-17 05:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

CREATE TABLE `user_type` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`id`, `name`) VALUES
(1, 'Super Admin'),
(2, 'Admin'),
(3, 'Sub Admin'),
(4, 'Teacher');

-- --------------------------------------------------------

--
-- Table structure for table `week_off`
--

CREATE TABLE `week_off` (
  `id` int(11) NOT NULL,
  `calendar_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `board`
--
ALTER TABLE `board`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `calendar_class`
--
ALTER TABLE `calendar_class`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calendar_id` (`calendar_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `calendar_holiday`
--
ALTER TABLE `calendar_holiday`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calendar_id` (`calendar_id`),
  ADD KEY `holiday_id` (`holiday_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`branch_id`);

--
-- Indexes for table `class_subject`
--
ALTER TABLE `class_subject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `class_teacher`
--
ALTER TABLE `class_teacher`
  ADD PRIMARY KEY (`id`),
  ADD KEY `delegated_teacher_id` (`delegated_teacher_id`),
  ADD KEY `CONSISTENT` (`section_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `stream_id` (`stream_id`),
  ADD KEY `board_id` (`board_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`branch_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `employee_device`
--
ALTER TABLE `employee_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employee_professional_info`
--
ALTER TABLE `employee_professional_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `exam_mark`
--
ALTER TABLE `exam_mark`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_schedule_id` (`exam_schedule_id`),
  ADD KEY `student_section_id` (`student_section_id`);

--
-- Indexes for table `exam_schedule`
--
ALTER TABLE `exam_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `exam_status_id` (`exam_status_id`);

--
-- Indexes for table `exam_status`
--
ALTER TABLE `exam_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `fee_category`
--
ALTER TABLE `fee_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `fee_class`
--
ALTER TABLE `fee_class`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fee_structure_id` (`fee_structure_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `fee_head`
--
ALTER TABLE `fee_head`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `fee_invoice`
--
ALTER TABLE `fee_invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `student_section_id` (`student_section_id`);

--
-- Indexes for table `fee_invoice_info`
--
ALTER TABLE `fee_invoice_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `fee_payment`
--
ALTER TABLE `fee_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_section_id` (`student_section_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `fee_schedule`
--
ALTER TABLE `fee_schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fee_structure_info_id` (`fee_structure_info_id`);

--
-- Indexes for table `fee_structure`
--
ALTER TABLE `fee_structure`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `fee_structure_info`
--
ALTER TABLE `fee_structure_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fee_structure_id` (`fee_structure_id`),
  ADD KEY `fee_head_id` (`fee_head_id`),
  ADD KEY `fee_category_id` (`fee_category_id`);

--
-- Indexes for table `holiday`
--
ALTER TABLE `holiday`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `homework`
--
ALTER TABLE `homework`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_recipient`
--
ALTER TABLE `message_recipient`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notice_board`
--
ALTER TABLE `notice_board`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `notice_recipient`
--
ALTER TABLE `notice_recipient`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notice_id` (`notice_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `occupation`
--
ALTER TABLE `occupation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `one_to_one`
--
ALTER TABLE `one_to_one`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parent`
--
ALTER TABLE `parent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parent_device`
--
ALTER TABLE `parent_device`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `periods`
--
ALTER TABLE `periods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timings_id` (`timings_id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `qualification`
--
ALTER TABLE `qualification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `religion`
--
ALTER TABLE `religion`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school`
--
ALTER TABLE `school`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school_subscription`
--
ALTER TABLE `school_subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `section_name`
--
ALTER TABLE `section_name`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`branch_id`);

--
-- Indexes for table `stream`
--
ALTER TABLE `stream`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`branch_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_section_id`);

--
-- Indexes for table `student_section`
--
ALTER TABLE `student_section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`branch_id`);

--
-- Indexes for table `timetable`
--
ALTER TABLE `timetable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `timings`
--
ALTER TABLE `timings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time_table_id` (`timetable_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_session`
--
ALTER TABLE `user_session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `week_off`
--
ALTER TABLE `week_off`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calendar_id` (`calendar_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `board`
--
ALTER TABLE `board`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;
--
-- AUTO_INCREMENT for table `calendar_class`
--
ALTER TABLE `calendar_class`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
--
-- AUTO_INCREMENT for table `calendar_holiday`
--
ALTER TABLE `calendar_holiday`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `class_subject`
--
ALTER TABLE `class_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=346;
--
-- AUTO_INCREMENT for table `class_teacher`
--
ALTER TABLE `class_teacher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;
--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `employee_device`
--
ALTER TABLE `employee_device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `employee_professional_info`
--
ALTER TABLE `employee_professional_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `exam_mark`
--
ALTER TABLE `exam_mark`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `exam_schedule`
--
ALTER TABLE `exam_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `exam_status`
--
ALTER TABLE `exam_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `fee_category`
--
ALTER TABLE `fee_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `fee_class`
--
ALTER TABLE `fee_class`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `fee_head`
--
ALTER TABLE `fee_head`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `fee_invoice`
--
ALTER TABLE `fee_invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `fee_invoice_info`
--
ALTER TABLE `fee_invoice_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `fee_payment`
--
ALTER TABLE `fee_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `fee_schedule`
--
ALTER TABLE `fee_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `fee_structure`
--
ALTER TABLE `fee_structure`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `fee_structure_info`
--
ALTER TABLE `fee_structure_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `holiday`
--
ALTER TABLE `holiday`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `homework`
--
ALTER TABLE `homework`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `message_recipient`
--
ALTER TABLE `message_recipient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT for table `module`
--
ALTER TABLE `module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `notice_board`
--
ALTER TABLE `notice_board`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `notice_recipient`
--
ALTER TABLE `notice_recipient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
--
-- AUTO_INCREMENT for table `occupation`
--
ALTER TABLE `occupation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `one_to_one`
--
ALTER TABLE `one_to_one`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `parent`
--
ALTER TABLE `parent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `parent_device`
--
ALTER TABLE `parent_device`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `periods`
--
ALTER TABLE `periods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `qualification`
--
ALTER TABLE `qualification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `religion`
--
ALTER TABLE `religion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `school`
--
ALTER TABLE `school`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `school_subscription`
--
ALTER TABLE `school_subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;
--
-- AUTO_INCREMENT for table `section_name`
--
ALTER TABLE `section_name`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `stream`
--
ALTER TABLE `stream`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `student_attendance`
--
ALTER TABLE `student_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `student_section`
--
ALTER TABLE `student_section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT for table `timetable`
--
ALTER TABLE `timetable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `timings`
--
ALTER TABLE `timings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `user_session`
--
ALTER TABLE `user_session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `user_type`
--
ALTER TABLE `user_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `week_off`
--
ALTER TABLE `week_off`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`);

--
-- Constraints for table `calendar`
--
ALTER TABLE `calendar`
  ADD CONSTRAINT `calendar_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `calendar_class`
--
ALTER TABLE `calendar_class`
  ADD CONSTRAINT `calendar_class_ibfk_1` FOREIGN KEY (`calendar_id`) REFERENCES `calendar` (`id`),
  ADD CONSTRAINT `calendar_class_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`);

--
-- Constraints for table `calendar_holiday`
--
ALTER TABLE `calendar_holiday`
  ADD CONSTRAINT `calendar_holiday_ibfk_1` FOREIGN KEY (`calendar_id`) REFERENCES `calendar` (`id`),
  ADD CONSTRAINT `calendar_holiday_ibfk_2` FOREIGN KEY (`holiday_id`) REFERENCES `holiday` (`id`);

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `class_subject`
--
ALTER TABLE `class_subject`
  ADD CONSTRAINT `class_subject_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `class_subject_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
  ADD CONSTRAINT `class_subject_ibfk_4` FOREIGN KEY (`teacher_id`) REFERENCES `employee` (`id`);

--
-- Constraints for table `class_teacher`
--
ALTER TABLE `class_teacher`
  ADD CONSTRAINT `CONSISTENT` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `class_teacher_ibfk_3` FOREIGN KEY (`delegated_teacher_id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `class_teacher_ibfk_4` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `class_teacher_ibfk_7` FOREIGN KEY (`teacher_id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `class_teacher_ibfk_8` FOREIGN KEY (`stream_id`) REFERENCES `stream` (`id`),
  ADD CONSTRAINT `class_teacher_ibfk_9` FOREIGN KEY (`board_id`) REFERENCES `board` (`id`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`),
  ADD CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `user_type` (`id`);

--
-- Constraints for table `employee_device`
--
ALTER TABLE `employee_device`
  ADD CONSTRAINT `employee_device_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`);

--
-- Constraints for table `employee_professional_info`
--
ALTER TABLE `employee_professional_info`
  ADD CONSTRAINT `employee_professional_info_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `employee_professional_info_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `exam_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `exam_mark`
--
ALTER TABLE `exam_mark`
  ADD CONSTRAINT `exam_mark_ibfk_1` FOREIGN KEY (`exam_schedule_id`) REFERENCES `exam_schedule` (`id`),
  ADD CONSTRAINT `exam_mark_ibfk_2` FOREIGN KEY (`student_section_id`) REFERENCES `student_section` (`id`);

--
-- Constraints for table `exam_schedule`
--
ALTER TABLE `exam_schedule`
  ADD CONSTRAINT `exam_schedule_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
  ADD CONSTRAINT `exam_schedule_ibfk_3` FOREIGN KEY (`exam_status_id`) REFERENCES `exam_status` (`id`);

--
-- Constraints for table `exam_status`
--
ALTER TABLE `exam_status`
  ADD CONSTRAINT `exam_status_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`id`),
  ADD CONSTRAINT `exam_status_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`);

--
-- Constraints for table `fee_category`
--
ALTER TABLE `fee_category`
  ADD CONSTRAINT `fee_category_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `fee_class`
--
ALTER TABLE `fee_class`
  ADD CONSTRAINT `fee_class_ibfk_1` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structure` (`id`),
  ADD CONSTRAINT `fee_class_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`);

--
-- Constraints for table `fee_head`
--
ALTER TABLE `fee_head`
  ADD CONSTRAINT `fee_head_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `fee_invoice`
--
ALTER TABLE `fee_invoice`
  ADD CONSTRAINT `fee_invoice_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `fee_invoice_ibfk_2` FOREIGN KEY (`student_section_id`) REFERENCES `student_section` (`id`);

--
-- Constraints for table `fee_invoice_info`
--
ALTER TABLE `fee_invoice_info`
  ADD CONSTRAINT `fee_invoice_info_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `fee_invoice` (`id`);

--
-- Constraints for table `fee_payment`
--
ALTER TABLE `fee_payment`
  ADD CONSTRAINT `fee_payment_ibfk_1` FOREIGN KEY (`student_section_id`) REFERENCES `student_section` (`id`),
  ADD CONSTRAINT `fee_payment_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `fee_payment_ibfk_3` FOREIGN KEY (`invoice_id`) REFERENCES `fee_invoice` (`id`);

--
-- Constraints for table `fee_schedule`
--
ALTER TABLE `fee_schedule`
  ADD CONSTRAINT `fee_schedule_ibfk_1` FOREIGN KEY (`fee_structure_info_id`) REFERENCES `fee_structure_info` (`id`);

--
-- Constraints for table `fee_structure`
--
ALTER TABLE `fee_structure`
  ADD CONSTRAINT `fee_structure_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `fee_structure_info`
--
ALTER TABLE `fee_structure_info`
  ADD CONSTRAINT `fee_structure_info_ibfk_1` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structure` (`id`),
  ADD CONSTRAINT `fee_structure_info_ibfk_2` FOREIGN KEY (`fee_head_id`) REFERENCES `fee_head` (`id`),
  ADD CONSTRAINT `fee_structure_info_ibfk_3` FOREIGN KEY (`fee_category_id`) REFERENCES `fee_category` (`id`);

--
-- Constraints for table `holiday`
--
ALTER TABLE `holiday`
  ADD CONSTRAINT `holiday_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `homework`
--
ALTER TABLE `homework`
  ADD CONSTRAINT `homework_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `homework_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
  ADD CONSTRAINT `homework_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `homework_ibfk_4` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `notice_board`
--
ALTER TABLE `notice_board`
  ADD CONSTRAINT `notice_board_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `notice_board_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `employee` (`id`);

--
-- Constraints for table `notice_recipient`
--
ALTER TABLE `notice_recipient`
  ADD CONSTRAINT `notice_recipient_ibfk_2` FOREIGN KEY (`notice_id`) REFERENCES `notice_board` (`id`),
  ADD CONSTRAINT `notice_recipient_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`);

--
-- Constraints for table `parent_device`
--
ALTER TABLE `parent_device`
  ADD CONSTRAINT `parent_device_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`);

--
-- Constraints for table `periods`
--
ALTER TABLE `periods`
  ADD CONSTRAINT `periods_ibfk_1` FOREIGN KEY (`timings_id`) REFERENCES `timings` (`id`),
  ADD CONSTRAINT `periods_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `periods_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`);

--
-- Constraints for table `school_subscription`
--
ALTER TABLE `school_subscription`
  ADD CONSTRAINT `school_subscription_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`);

--
-- Constraints for table `section_name`
--
ALTER TABLE `section_name`
  ADD CONSTRAINT `section_name_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `session_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `stream`
--
ALTER TABLE `stream`
  ADD CONSTRAINT `stream_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `fee_category` (`id`);

--
-- Constraints for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`student_section_id`) REFERENCES `student_section` (`id`);

--
-- Constraints for table `student_section`
--
ALTER TABLE `student_section`
  ADD CONSTRAINT `student_section_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`),
  ADD CONSTRAINT `student_section_ibfk_4` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `student_section_ibfk_5` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `timetable`
--
ALTER TABLE `timetable`
  ADD CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`);

--
-- Constraints for table `timings`
--
ALTER TABLE `timings`
  ADD CONSTRAINT `timings_ibfk_1` FOREIGN KEY (`timetable_id`) REFERENCES `timetable` (`id`);

--
-- Constraints for table `user_session`
--
ALTER TABLE `user_session`
  ADD CONSTRAINT `user_session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `week_off`
--
ALTER TABLE `week_off`
  ADD CONSTRAINT `week_off_ibfk_1` FOREIGN KEY (`calendar_id`) REFERENCES `calendar` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
