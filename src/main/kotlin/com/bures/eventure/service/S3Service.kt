package com.bures.eventure.service

import io.github.cdimascio.dotenv.Dotenv
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.io.InputStream
import java.lang.Exception
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardCopyOption
import java.util.*


class S3Service() {
    private val dotenv: Dotenv = Dotenv.load()
    private val accessKeyId = dotenv.get("ACCESS_KEY_ID")
    private val secretAccessKey = dotenv.get("SECRET_ACCESS_KEY")
    private val region = Region.EU_NORTH_1
    private val bucketName = dotenv.get("BUCKET_NAME")

    private val s3Client: S3Client = S3Client.builder()
        .region(region)
        .credentialsProvider { AwsBasicCredentials.create(accessKeyId, secretAccessKey) }
        .build()

    private val s3Bucket: String = bucketName
    private fun createTempFile(inputStream: InputStream): Path {
        val tempFile = Files.createTempFile(UUID.randomUUID().toString(), ".tmp")
        Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING)
        return tempFile
    }

    private fun uploadFileToS3(key: String, file: Path) {
        val putObjectRequest = PutObjectRequest.builder()
            .bucket(s3Bucket)
            .key(key)
            .build()

        s3Client.putObject(putObjectRequest, file)
    }

    private fun deleteTempFile(file: Path) {
        Files.deleteIfExists(file)
    }

    fun uploadFile(key: String, inputStream: InputStream) {
        val tempFile = createTempFile(inputStream)
        uploadFileToS3(key, tempFile)
        deleteTempFile(tempFile)
    }

    fun deleteObject(key: String) {
        val deleteObjectRequest = DeleteObjectRequest.builder()
            .bucket(s3Bucket)
            .key(key)
            .build()

        s3Client.deleteObject(deleteObjectRequest)
    }
}