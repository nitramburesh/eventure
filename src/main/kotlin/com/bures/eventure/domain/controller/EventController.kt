package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.event.EventDetailResponseDTO
import com.bures.eventure.domain.dto.event.EventResponseDTO
import com.bures.eventure.domain.model.Event
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.repository.UserRepository
import com.bures.eventure.service.EventService
import org.bson.types.ObjectId
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/events")
class EventController(private val eventRepository: EventRepository, private val eventService: EventService, private val userRepository: UserRepository) {

    @PostMapping("")
    fun createEvent(@RequestBody event: Event): ResponseEntity<Event>{
        return ResponseEntity.ok(eventService.createEvent(event, eventRepository))
    }
    @GetMapping("/all")
    fun getAllEvents(): ResponseEntity<List<EventResponseDTO>>{
        return ResponseEntity.ok(eventService.getAllEvents(eventRepository));
    }


    @GetMapping("")
    fun getEventsByAmount(@RequestParam amount: Int): ResponseEntity<List<Event>>{
        return ResponseEntity.ok(eventService.getEventsByAmount(amount, eventRepository))
    }
    @GetMapping("/{eventId}")
    fun getEventById(@PathVariable eventId: String): ResponseEntity<EventDetailResponseDTO>{
        return ResponseEntity.ok(eventService.findById(eventId, eventRepository, userRepository))


    }
}