package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Location
import org.bson.types.ObjectId
import java.time.LocalDateTime

data class EventDTO(
    val id: ObjectId?,
    var creatorId: String,
    var name: String,
    var location: Location,
    var description: String,
    var attendees: List<ObjectId>,
    var likes: Int,
    var comments: List<Comment>,
    var tags: List<String>,
    var price: Int,
    var date: LocalDateTime
)