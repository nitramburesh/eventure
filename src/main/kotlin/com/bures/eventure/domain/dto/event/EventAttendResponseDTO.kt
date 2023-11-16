package com.bures.eventure.domain.dto.event

data class EventAttendResponseDTO(
    val isAttending: Boolean,
    val attendedEvents: List<String>
)
