package com.bures.eventure.service

import com.bures.eventure.domain.dto.event.EventDetailResponseDTO
import com.bures.eventure.domain.dto.event.EventResponseDTO
import com.bures.eventure.domain.model.Event
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.repository.UserRepository
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import org.bson.types.ObjectId
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
    fun getAllEvents(eventRepository: EventRepository): List<EventResponseDTO>{

        val eventResponse = eventRepository.findAll()
        val response = eventResponse.map{event ->
            mapEventToEventResponseDTO(event)
        }
        return response
    }
    fun getEventsByAmount(amount: Int, eventRepository: EventRepository):List<Event>{
        val pageable: Pageable = PageRequest.of(0, amount)
        return eventRepository.findAllBy(pageable);
    }

    fun findById(id: String, eventRepository: EventRepository, userRepository: UserRepository): EventDetailResponseDTO{
        val optionalEvent = eventRepository.findById(ObjectId(id))
        val event = optionalEvent.get()
        val user = userRepository.findById(ObjectId(event.creatorId))

        return EventDetailResponseDTO(
            id = event.id.toString(),
            username = user.get().username,
            title = event.title,
            attendees = event.attendees?.map{it.toString()}?: emptyList(),
            comments = event.comments ?: emptyList(),
            likes = event.likes ?: 0,
            tags = event.tags,
            price = event.price,
            createdDate = event.createdDate,
            eventDate = event.eventDate,
            description = event.description,
            location= event.location
        )
    }
}



fun mapEventToEventResponseDTO(event: Event): EventResponseDTO {
    return EventResponseDTO(
        id = event.id?.toString() ?: "",  // Convert ObjectId to String
        creatorId = event.creatorId,
        title = event.title,
        location = event.location,
        description = event.description,
        attendees = event.attendees?.map { it.toString() } ?: emptyList(),  // Convert ObjectId list to String list
        likes = event.likes ?: 0,
        comments = event.comments ?: emptyList(),
        tags = event.tags,
        price = event.price,
        date = event.date
    )
}