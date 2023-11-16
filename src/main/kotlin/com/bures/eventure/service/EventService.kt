package com.bures.eventure.service

import com.bures.eventure.domain.dto.comment.CommentDTO
import com.bures.eventure.domain.dto.event.EventAttendResponseDTO
import com.bures.eventure.domain.dto.event.EventDetailResponseDTO
import com.bures.eventure.domain.dto.event.EventResponseDTO
import com.bures.eventure.domain.dto.event.EventUpdateDTO
import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Event
import com.bures.eventure.repository.CommentRepository
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
import java.util.Optional


@Service
class EventService {
    fun createEvent(event: Event, eventRepository: EventRepository): Event {
        return eventRepository.insert(event);
    }

    fun getAllEvents(eventRepository: EventRepository): List<EventResponseDTO> {
        val eventResponse = eventRepository.findAll()
        val response = eventResponse.map { event ->
            mapEventToEventResponseDTO(event)
        }
        return response
    }

    fun getEventsByAmount(amount: Int, eventRepository: EventRepository): List<EventResponseDTO> {
        val pageable: Pageable = PageRequest.of(0, amount)
        return eventRepository.findAllBy(pageable).map { event ->  println(event); mapEventToEventResponseDTO(event)  }
    }

    fun findById(eventId: ObjectId,userId: ObjectId, eventRepository: EventRepository, commentRepository: CommentRepository, userRepository: UserRepository): EventDetailResponseDTO {
        val maybeEvent = eventRepository.findById(eventId)
        val event = maybeEvent.get()
        val maybeCreator = userRepository.findById(ObjectId(event.creatorId))
        val viewingUser = userRepository.findById(userId).get()
        val foundComments = commentRepository.findAllByIdIn(event.comments!!)
        val comments = foundComments.map {
            val maybeCommentAuthor = userRepository.findById(ObjectId(it.userId))
            CommentDTO(
                id = it.id.toString(),
                userId = maybeCommentAuthor.get().id.toString(),
                username = maybeCommentAuthor.get().username,
                date = it.date,
                message = it.message
            )
        }
        val isAttending = event.attendees.contains(viewingUser.id.toString())
        val isLiked = viewingUser.likedEvents.contains(eventId.toString())
        return EventDetailResponseDTO(
            id = event.id.toString(),
            username = maybeCreator.get().username,
            title = event.title,
            attendees = event.attendees,
            comments = comments,
            likes = event.likes ?: 0,
            tags = event.tags,
            price = event.price,
            createdDate = event.createdDate,
            eventDate = event.eventDate,
            description = event.description,
            location = event.location,
            isAttending = isAttending,
            isLiked = isLiked
        )
    }

    fun updateLikedEvent(
        eventId: ObjectId,
        userRepository: UserRepository,
        eventRepository: EventRepository,
        updateRequest: EventUpdateDTO
    ): Optional<List<String>> {
        val maybeEvent = eventRepository.findById(eventId)
        val maybeUser = userRepository.findById(ObjectId(updateRequest.userId))

        if (maybeEvent.isPresent && maybeUser.isPresent) {
            val event = maybeEvent.get()
            val user = maybeUser.get()
            val eventIdString = eventId.toString()
            updateRequest.userId?.let {
                user.likedEvents = user.likedEvents.let { likedEvents ->
                    if (likedEvents.contains(eventIdString)) {
                        likedEvents.minus(eventIdString)
                    } else {
                        likedEvents.plus(eventIdString)
                    }
                }
            }
            updateRequest.likes?.let { event.likes = it }
            userRepository.save(user)
            eventRepository.save(event)
            return Optional.of(user.likedEvents)
        }

        return Optional.empty()
    }

    fun updateAttendEvent(
        eventId: ObjectId,
        userRepository: UserRepository,
        eventRepository: EventRepository,
        updateRequest: EventUpdateDTO
    ): Optional<EventAttendResponseDTO> {
        val maybeEvent = eventRepository.findById(eventId)
        val maybeUser = userRepository.findById(ObjectId(updateRequest.userId))
        if (maybeEvent.isPresent && maybeUser.isPresent) {
            val event = maybeEvent.get()
            val user = maybeUser.get()
            val eventIdString = eventId.toString()
            updateRequest.userId?.let {
                user.attendedEvents = user.attendedEvents.let { attendedEvents ->
                    if (updateRequest.isAttending && !user.attendedEvents.contains(eventIdString)) {
                        attendedEvents.plus(eventIdString)
                    } else if (updateRequest.isAttending && user.attendedEvents.contains(eventIdString)) {
                        attendedEvents
                    } else {
                        attendedEvents.minus(eventIdString)
                    }
                }
            }
            updateRequest.userId?.let { userId ->
                event.attendees = event.attendees.let { attendees ->
                    if (updateRequest.isAttending && !event.attendees.contains(userId)) {
                        attendees.plus(userId)
                    } else if (updateRequest.isAttending && event.attendees.contains(userId)) {
                        attendees
                    } else {
                        attendees.minus(userId)
                    }
                }
            }
            userRepository.save(user)
            eventRepository.save(event)
            val isAttending = event.attendees.contains(user.id.toString())
            return Optional.of(EventAttendResponseDTO(isAttending=isAttending, attendedEvents = user.attendedEvents))
        }

        return Optional.empty()
    }

    fun addEventComment(eventId: ObjectId, eventRepository: EventRepository, commentRepository:CommentRepository, userRepository: UserRepository,updateRequest: EventUpdateDTO): Optional<CommentDTO> {
        val maybeEvent = eventRepository.findById(eventId)
        val maybeUser = userRepository.findById(ObjectId(updateRequest.comment?.userId))
        if (maybeEvent.isPresent && maybeUser.isPresent) {
            val event = maybeEvent.get()
            val user = maybeUser.get()
            val comment = updateRequest.comment!!
            comment.eventId = eventId.toString()
            val insertedComment = commentRepository.insert(comment)
            event.comments = event.comments?.plus(insertedComment.id!!)
            eventRepository.save(event)

            return Optional.of(mapToCommentDTO(insertedComment, user.username))
        }
        return Optional.empty()
    }

    fun deleteEventComment(eventId: ObjectId, eventRepository: EventRepository, commentRepository:CommentRepository, commentId: ObjectId): Boolean{
        val maybeEvent = eventRepository.findById(eventId)
        if (maybeEvent.isPresent) {
            val event = maybeEvent.get()
            event.comments = event.comments?.minus(commentId)
            commentRepository.deleteById(commentId)
            eventRepository.save(event)
            return true
        }
        return false
    }
}

fun mapToCommentDTO(comment: Comment, username: String) : CommentDTO{
    return CommentDTO(
        id = comment.id.toString(),
         userId= comment.userId,
         username= username,
         message= comment.message,
         date= comment.date
    )
}
fun mapEventToEventResponseDTO(event: Event): EventResponseDTO {
    return EventResponseDTO(
        id = event.id?.toString() ?: "",  // Convert ObjectId to String
        creatorId = event.creatorId,
        title = event.title,
        location = event.location,
        description = event.description,
        tags = event.tags,
        price = event.price,
        createdDate = event.createdDate,
        eventDate = event.eventDate
    )
}

