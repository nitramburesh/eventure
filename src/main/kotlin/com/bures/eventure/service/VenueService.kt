package com.bures.eventure.service

import com.bures.eventure.domain.dto.venue.VenueDTO
import com.bures.eventure.repository.VenueRepository
import org.springframework.stereotype.Service

@Service
class VenueService(private val venueRepository: VenueRepository) {
    fun getVenues(): List<VenueDTO> {
        return venueRepository.findAll().map {
            VenueDTO(
                id = it.id.toString(),
                name = it.name,
                address = it.address,
                city = it.city,
                country = it.country,
                postalCode = it.postalCode
            )
        }
    }
}