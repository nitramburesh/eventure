package com.bures.eventure.domain.model

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document(collection = "comment")
data class Comment(
@DBRef
var userId: ObjectId,
var message: String,
var date: LocalDateTime
)
