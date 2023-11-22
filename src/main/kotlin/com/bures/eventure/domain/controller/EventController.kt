package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.comment.DeleteCommentDTO
import com.bures.eventure.domain.dto.event.*
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
import org.springframework.web.context.annotation.RequestScope
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/events")
class EventController(
    private val eventService: EventService,
) {

    @PostMapping("")
    fun createEvent(@RequestBody event: Event): ResponseEntity<Event> {
        return ResponseEntity.ok(eventService.createEvent(event))
    }

    @PostMapping("/image")
    fun storeImage(@RequestPart("file") image: MultipartFile): ResponseEntity<String> {
        eventService.storeImage(image)
        return ResponseEntity.ok(eventService.storeImage(image))
    }

    @GetMapping("/all")
    fun getAllEvents(): ResponseEntity<List<EventResponseDTO>> {
        return ResponseEntity.ok(eventService.getAllEvents());
    }


    @GetMapping("")
    fun getEventsByAmount(@RequestParam amount: Int): ResponseEntity<List<EventResponseDTO>> {
        return ResponseEntity.ok(eventService.getEventsByAmount(amount))
    }

    @GetMapping("/{eventId}")
    fun getEventById(
        @PathVariable eventId: String,
        @RequestParam userId: String
    ): ResponseEntity<EventDetailResponseDTO> {
        return ResponseEntity.ok(eventService.findById(ObjectId(eventId), ObjectId(userId)))
    }

    @PatchMapping("/{eventId}/edit")
    fun editEvent(@PathVariable eventId: String, @RequestBody editEventPayload: EditEventDTO): ResponseEntity<Any> {
        val success = eventService.editEvent(ObjectId(eventId), editEventPayload)
        return if (success) {
            ResponseEntity.ok("Event updated")
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }
    }

    @PatchMapping("/{eventId}/likes")
    fun updateLikedEvent(
        @PathVariable eventId: String,
        @RequestBody updateRequest: EventUpdateDTO
    ): ResponseEntity<Any> {
        val maybeList = eventService.updateLikedEvent(ObjectId(eventId), updateRequest)
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
            eventService.updateAttendEvent(ObjectId(eventId), updateRequest)
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
        val maybeAddedComment = eventService.addEventComment(ObjectId(eventId), updateRequest)
        return if (maybeAddedComment.isPresent) {
            ResponseEntity.ok(maybeAddedComment.get())
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }

    }

    @DeleteMapping("/{eventId}/comments")
    fun deleteEventComment(
        @PathVariable eventId: String,
        @RequestBody deletePayload: DeleteCommentDTO
    ): ResponseEntity<String> {
        val success = eventService.deleteEventComment(ObjectId(eventId), ObjectId(deletePayload.commentId))
        return if (success) {
            ResponseEntity.ok("Successfully deleted!")
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found.")
        }
    }

    @DeleteMapping("/{eventId}")
    fun deleteById(@PathVariable eventId: String, @RequestBody deletePayload: DeleteEventDTO): ResponseEntity<String> {
        val success = eventService.deleteById(ObjectId(eventId), deletePayload)
        return if (success) {
            ResponseEntity.ok("Event deleted.")
        } else {
            ResponseEntity.notFound().build()
        }
    }
}