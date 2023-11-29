package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.dto.venue.VenueDTO
import java.time.LocalDateTime

data class EventResponseDTO (
    val id: String,
    var creator: Creator,
    var venue: VenueDTO,
    var title: String,
    var description: String,
    var tags: List<String>,
    var price: Int,
    var createdDate: String,
    var eventDate: String,
    var image: String
)