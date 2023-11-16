package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.model.Location
import java.time.LocalDateTime

data class EditEventDTO(
    val title: String,
    val location: Location,
    val description: String,
    val tags: List<String>,
    var eventDate: LocalDateTime,
)
