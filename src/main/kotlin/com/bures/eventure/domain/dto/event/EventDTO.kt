package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Location
import org.bson.types.ObjectId
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import java.util.Date

data class EventDTO(
    val id: ObjectId?,
    var creatorId: String,
    var title: String,
    var location: Location,
    var description: String,
    var attendees: List<String> = emptyList(),
    var likes: Int? =0,
    var comments: List<ObjectId>?=emptyList(),
    var tags: List<String>,
    var price: Int,
    var eventDate: Date,
    var createdDate: Date,
    var image: MultipartFile
)