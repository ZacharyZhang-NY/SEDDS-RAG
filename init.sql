/*
 Navicat Premium Data Transfer

 Source Server         : DocSearch Local
 Source Server Type    : PostgreSQL
 Source Server Version : 150004 (150004)
 Source Host           : localhost:5432
 Source Catalog        : api
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 150004 (150004)
 File Encoding         : 65001

 Date: 13/05/2024 16:54:13
*/

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');


-- ----------------------------
-- Table structure for folders
-- ----------------------------
DROP TABLE IF EXISTS "public"."folders";
CREATE TABLE "public"."folders" (
  "id" uuid NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "parent_id" uuid,
  "created_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "created_by" uuid NOT NULL
)
;
ALTER TABLE "public"."folders" OWNER TO "myuser";

-- ----------------------------
-- Table structure for sources
-- ----------------------------
DROP TABLE IF EXISTS "public"."sources";
CREATE TABLE "public"."sources" (
  "id" uuid NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "content_length" int4,
  "created_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "created_by" uuid NOT NULL,
  "content" text COLLATE "pg_catalog"."default",
  "folder_id" uuid
)
;
ALTER TABLE "public"."sources" OWNER TO "myuser";

-- ----------------------------
-- Table structure for testlangchain
-- ----------------------------
DROP TABLE IF EXISTS "public"."testlangchain";
CREATE TABLE "public"."testlangchain" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "content" text COLLATE "pg_catalog"."default",
  "metadata" jsonb,
  "vector" "public"."vector"
)
;
ALTER TABLE "public"."testlangchain" OWNER TO "myuser";

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" uuid NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "salt" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
  "role" "public"."user_role" NOT NULL DEFAULT 'user'::user_role
)
;
ALTER TABLE "public"."users" OWNER TO "myuser";

-- ----------------------------
-- Primary Key structure for table folders
-- ----------------------------
ALTER TABLE "public"."folders" ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sources
-- ----------------------------
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table testlangchain
-- ----------------------------
ALTER TABLE "public"."testlangchain" ADD CONSTRAINT "testlangchain_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table folders
-- ----------------------------
ALTER TABLE "public"."folders" ADD CONSTRAINT "folders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."folders" ADD CONSTRAINT "folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sources
-- ----------------------------
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."sources" ADD CONSTRAINT "sources_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
