package com.bures.eventure.service

import com.bures.eventure.domain.dto.event.EventDTO
import com.bures.eventure.domain.model.Event
import com.bures.eventure.repository.EventRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class EventService {
    fun createEvent(event: Event, eventRepository: EventRepository):Event
    {
        return eventRepository.insert(event);
    }
    fun getAllEvents(eventRepository: EventRepository): List<Event>{
        return eventRepository.findAll()
    }
    fun getEventsByAmount(amount: Int, eventRepository: EventRepository):List<Event>{
        val pageable: Pageable = PageRequest.of(0, amount)
        return eventRepository.findAllBy(pageable);
    }
}