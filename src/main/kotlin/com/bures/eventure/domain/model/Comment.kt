package com.bures.eventure.domain.model


import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.MongoId
import java.util.Date

@Document(collection = "comment")
data class Comment(
    @MongoId
    var id: ObjectId? = ObjectId(),
    var eventId: String?,
    var userId: String,
    var message: String,
    var date: Date
)
