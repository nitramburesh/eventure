package com.bures.eventure.domain.dto.user

import com.bures.eventure.domain.dto.event.EventResponseDTO

data class UserDetailsDTO(
    val id: String,
    val username: String,
    val likedEvents: List<EventResponseDTO>,
    val attendedEvents: List<EventResponseDTO>,
    val profilePicture: String
)
