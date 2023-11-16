package com.bures.eventure.domain.dto.user

data class UserEventDetailsDTO(
    val likedEvents: List<String>,
    val attendedEvents: List<String>
)