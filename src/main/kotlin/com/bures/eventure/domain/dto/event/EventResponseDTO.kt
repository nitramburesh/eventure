package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Location
import org.bson.types.ObjectId
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.Date

data class EventResponseDTO (
    val id: String,
    var creatorId: String,
    var title: String,
    var location: Location,
    var time: LocalTime,
    var description: String,
    var attendees: List<String>,
    var likes: Int,
    var comments: List<Comment>,
    var tags: List<String>,
    var price: Int,
    var createdDate: Date,
    var eventDate: LocalDateTime,
)