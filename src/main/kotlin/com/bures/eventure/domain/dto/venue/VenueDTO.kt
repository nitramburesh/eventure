package com.bures.eventure.domain.dto.venue

data class VenueDTO(
    val id: String,
    val name: String,
    val address: String,
    val city: String,
    val country: String,
    val postalCode: Int
)
