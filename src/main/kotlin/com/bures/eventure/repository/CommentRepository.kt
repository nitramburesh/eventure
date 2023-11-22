package com.bures.eventure.repository

import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Event
import com.bures.eventure.domain.model.User
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface CommentRepository : MongoRepository<Comment, ObjectId> {
    fun findAllByIdIn(ids: Collection<ObjectId>): List<Comment>
    fun findAllByUserId(creatorId: String): List<Comment>
}