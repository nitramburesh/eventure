package com.bures.eventure.repository

import com.bures.eventure.domain.model.User
import com.mongodb.client.MongoClient
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface UserRepository: MongoRepository<User, ObjectId>{
    fun findByUsername(username: String):User?
    fun existsByUsername(username: String): Boolean
    }