package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.comment.DeleteCommentDTO
import com.bures.eventure.domain.dto.event.EditEventDTO
import com.bures.eventure.domain.dto.event.EventDetailResponseDTO
import com.bures.eventure.domain.dto.event.EventResponseDTO
import com.bures.eventure.domain.dto.event.EventUpdateDTO
import com.bures.eventure.domain.model.Event
import com.bures.eventure.repository.CommentRepository
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.repository.UserRepository
import com.bures.eventure.service.EventService
import org.apache.coyote.Response
import org.bson.types.ObjectId
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/events")
class EventController(
    private val eventRepository: EventRepository,
    private val eventService: EventService,
    private val userRepository: UserRepository,
    private val commentRepository: CommentRepository
) {

    @PostMapping("")
    fun createEvent(@RequestBody event: Event): ResponseEntity<Event> {
        return ResponseEntity.ok(eventService.createEvent(event, eventRepository))
    }

    @GetMapping("/all")
    fun getAllEvents(): ResponseEntity<List<EventResponseDTO>> {
        return ResponseEntity.ok(eventService.getAllEvents(eventRepository));
    }


    @GetMapping("")
    fun getEventsByAmount(@RequestParam amount: Int): ResponseEntity<List<EventResponseDTO>> {
        return ResponseEntity.ok(eventService.getEventsByAmount(amount, eventRepository))
    }

    @GetMapping("/{eventId}")
    fun getEventById(@PathVariable eventId: String, @RequestParam userId: String): ResponseEntity<EventDetailResponseDTO> {
        return ResponseEntity.ok(eventService.findById(ObjectId(eventId),ObjectId(userId), eventRepository, commentRepository, userRepository))
    }
    @PatchMapping("/{eventId}/edit")
    fun editEvent(@PathVariable eventId: String, @RequestBody editEventPayload: EditEventDTO): ResponseEntity<Any>{
        val success = eventService.editEvent(ObjectId(eventId), eventRepository, editEventPayload)
        if (success){
            return ResponseEntity.ok("Event updated")
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }
    }
    @PatchMapping("/{eventId}/likes")
    fun updateLikedEvent(
        @PathVariable eventId: String,
        @RequestBody updateRequest: EventUpdateDTO
    ): ResponseEntity<Any> {
        val maybeList = eventService.updateLikedEvent(ObjectId(eventId), userRepository, eventRepository, updateRequest)
        return if (maybeList.isPresent) {
            ResponseEntity.ok(maybeList.get())
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }

    }

    @PatchMapping("/{eventId}/attendees")
    fun updateAttendEvent(
        @PathVariable eventId: String,
        @RequestBody updateRequest: EventUpdateDTO
    ): ResponseEntity<Any> {
        val maybeList =
            eventService.updateAttendEvent(ObjectId(eventId), userRepository, eventRepository, updateRequest)
        return if (maybeList.isPresent) {
            ResponseEntity.ok(maybeList.get())
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }

    }

    @PostMapping("/{eventId}/comments")
    fun addEventComment(
        @PathVariable eventId: String,
        @RequestBody updateRequest: EventUpdateDTO
    ): ResponseEntity<Any> {
        val maybeAddedComment = eventService.addEventComment(ObjectId(eventId), eventRepository,commentRepository, userRepository,updateRequest)
        return if (maybeAddedComment.isPresent){
         ResponseEntity.ok(maybeAddedComment.get())
        }else{
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }

    }
    @DeleteMapping("/{eventId}/comments")
    fun deleteEventComment(
        @PathVariable eventId: String,
        @RequestBody deletePayload: DeleteCommentDTO
    ): ResponseEntity<String>{
        val success = eventService.deleteEventComment(ObjectId(eventId),eventRepository,commentRepository,ObjectId(deletePayload.commentId))
        return if(success){
            ResponseEntity.ok("Successfully deleted!")
        }else{
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }
    }
}