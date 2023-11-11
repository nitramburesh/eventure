package com.bures.eventure.domain.model

import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.MongoId
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import java.util.Date

@Document(collection = "event")
data class Event(
@MongoId
val id: ObjectId?,
var creatorId: String,
var title: String,
var location: Location,
var description: String,
@DBRef
var attendees: List<ObjectId>? = emptyList(),

var likes: Int? = 0,

@DBRef
var comments: List<Comment>? = emptyList(),

var tags: List<String>,

var price: Int,

var eventDate: LocalDateTime,
var createdDate: Date


)
