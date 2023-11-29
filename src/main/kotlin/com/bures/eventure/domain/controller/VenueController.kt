package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.venue.VenueDTO
import com.bures.eventure.service.VenueService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/venues")
class VenueController(private val venueService: VenueService) {

    @GetMapping("/all")
    fun getVenues(): ResponseEntity<List<VenueDTO>>{
        return ResponseEntity.ok(venueService.getVenues())
    }
}