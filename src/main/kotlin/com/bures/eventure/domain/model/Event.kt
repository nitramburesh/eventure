package com.bures.eventure.domain.model


import org.bson.types.ObjectId
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.MongoId
import java.time.LocalDateTime
import java.util.*

@Document(collection = "events")
data class Event(
    @MongoId
val id: ObjectId?,
    var creatorId: String,
    var title: String,
    var venueId: String,
    var description: String,
    var attendees: List<ObjectId> = emptyList(),

    var likes: Int? = 0,

    var comments: List<ObjectId>? = emptyList(),

    var tags: List<String>,

    var price: Int,

    var eventDate: LocalDateTime,
    var createdDate: LocalDateTime,
    var image: String,

    )
