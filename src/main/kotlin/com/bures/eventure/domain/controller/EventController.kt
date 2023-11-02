package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.event.EventDTO
import com.bures.eventure.domain.model.Event
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.service.EventService
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/events")
class EventController(private val eventRepository: EventRepository, private val eventService: EventService) {

    @PostMapping("")
    fun createEvent(@RequestBody event: Event): ResponseEntity<Event>{

        return ResponseEntity.ok(eventService.createEvent(event, eventRepository))
    }
    @GetMapping("/all")
    fun getAllEvents(): ResponseEntity<List<Event>>{
        return ResponseEntity.ok(eventService.getAllEvents(eventRepository));
    }

    @GetMapping("")
    fun getEventsByAmount(@RequestParam amount: Int): ResponseEntity<List<Event>>{
        return ResponseEntity.ok(eventService.getEventsByAmount(amount, eventRepository))
    }
    @GetMapping("/{eventId}")
    fun getEventById(@PathVariable eventId: String): ResponseEntity<Event>{
        val objectId = ObjectId(eventId)
        val event = eventRepository.findById(objectId)
        return if (event.isPresent){
            ResponseEntity.ok(event.get())
        }else {
            ResponseEntity.notFound().build()
        }

    }
}