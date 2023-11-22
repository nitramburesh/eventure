package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Location
import java.util.Date

data class EventResponseDTO (
    val id: String,
    var creator: Creator,
    var title: String,
    var location: Location,
    var description: String,
    var tags: List<String>,
    var price: Int,
    var createdDate: Date,
    var eventDate: Date,
    var image: String
)