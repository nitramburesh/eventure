package com.bures.eventure.service

import com.bures.eventure.domain.dto.comment.CommentDTO
import com.bures.eventure.domain.dto.comment.DeleteCommentDTO
import com.bures.eventure.domain.dto.event.*
import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Event
import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.CommentRepository
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.repository.UserRepository
import org.bson.types.ObjectId
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.regions.Region
import java.util.*


@Service
class EventService(
    private val eventRepository: EventRepository,
    private val userRepository: UserRepository,
    private val commentRepository: CommentRepository
) {
    private val accessKeyId = "AKIA4IVY4ZYDIC5YQPOB"
    private val secretAccessKey = "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"
    private val region = Region.EU_NORTH_1
    private val bucketName = "storage-eventure"
    fun createEvent(event: Event): Event {
        return eventRepository.insert(event);
    }

    fun storeImage(image: MultipartFile): String {
        val accessKeyId = "AKIA4IVY4ZYDIC5YQPOB"
        val secretAccessKey = "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"
        val region = Region.EU_NORTH_1
        val bucketName = "storage-eventure"
        val s3Service = S3Service(accessKeyId, secretAccessKey, region, bucketName)
        val imageId = UUID.randomUUID().toString()
        s3Service.uploadFile(imageId, image.inputStream)
        return "https://storage-eventure.s3.eu-north-1.amazonaws.com/${imageId}"
    }

    fun editEvent(eventId: ObjectId, editEventPayload: EditEventDTO): Boolean {
        val maybeEvent = eventRepository.findById(eventId)
        if (maybeEvent.isPresent) {
            val event = maybeEvent.get()
            event.title = editEventPayload.title
            event.location = editEventPayload.location
            event.description = editEventPayload.description
            event.tags = editEventPayload.tags
            event.eventDate = editEventPayload.eventDate
            eventRepository.save(event)
            return true
        } else {
            return false
        }


    }

    fun getAllEvents(): List<EventResponseDTO> {
        val eventResponse = eventRepository.findAll()
        val response = eventResponse.map { event ->
            mapEventToEventResponseDTO(event, userRepository)
        }
        return response
    }

    fun getEventsByAmount(amount: Int): List<EventResponseDTO> {
        val pageable: Pageable = PageRequest.of(0, amount)

        return eventRepository.findAllBy(pageable).map { event ->
            mapEventToEventResponseDTO(event, userRepository)
        }
    }

    fun findById(
        eventId: ObjectId,
        userId: ObjectId,
    ): EventDetailResponseDTO {
        val maybeEvent = eventRepository.findById(eventId)
        val event = maybeEvent.get()
        val creator = userRepository.findById(ObjectId(event.creatorId)).get()
        val viewingUser = userRepository.findById(userId).get()
        val foundComments = commentRepository.findAllByIdIn(event.comments!!)
        val comments = foundComments.map {
            val maybeCommentAuthor = userRepository.findById(ObjectId(it.userId))
            CommentDTO(
                id = it.id.toString(),
                userId = maybeCommentAuthor.get().id.toString(),
                username = maybeCommentAuthor.get().username,
                date = it.date,
                message = it.message,
                profilePicture = maybeCommentAuthor.get().profilePicture
            )
        }
        val isAttending = event.attendees.contains(viewingUser.id)
        val isLiked = viewingUser.likedEvents.contains(eventId)
        return EventDetailResponseDTO(
            id = event.id.toString(),
            creator = Creator(
                username = creator.username,
                id = creator.id.toString(),
                profilePicture = creator.profilePicture
            ),
            title = event.title,
            attendees = event.attendees.map { it.toString() },
            comments = comments,
            likes = event.likes ?: 0,
            tags = event.tags,
            price = event.price,
            createdDate = event.createdDate,
            eventDate = event.eventDate,
            description = event.description,
            location = event.location,
            isAttending = isAttending,
            isLiked = isLiked,
            image = event.image,

            )
    }

    fun updateLikedEvent(
        eventId: ObjectId,
        updateRequest: EventUpdateDTO
    ): Optional<List<String>> {
        val maybeEvent = eventRepository.findById(eventId)
        val maybeUser = userRepository.findById(ObjectId(updateRequest.userId))

        if (maybeEvent.isPresent && maybeUser.isPresent) {
            val event = maybeEvent.get()
            val user = maybeUser.get()
            updateRequest.userId?.let {
                user.likedEvents = user.likedEvents.let { likedEvents ->
                    if (likedEvents.contains(eventId)) {
                        likedEvents.minus(eventId)
                    } else {
                        likedEvents.plus(eventId)
                    }
                }
            }
            updateRequest.likes?.let { event.likes = it }
            userRepository.save(user)
            eventRepository.save(event)
            val usersLikedEvents = user.likedEvents.map { it.toString() }
            return Optional.of(
                usersLikedEvents
            )
        }

        return Optional.empty()
    }

    fun updateAttendEvent(
        eventId: ObjectId,
        updateRequest: EventUpdateDTO
    ): Optional<EventAttendResponseDTO> {
        val maybeEvent = eventRepository.findById(eventId)
        val maybeUser = userRepository.findById(ObjectId(updateRequest.userId))
        if (maybeEvent.isPresent && maybeUser.isPresent) {
            val event = maybeEvent.get()
            val user = maybeUser.get()
            updateRequest.userId?.let {
                user.attendedEvents = user.attendedEvents.let { attendedEvents ->
                    if (updateRequest.isAttending && !user.attendedEvents.contains(eventId)) {
                        attendedEvents.plus(eventId)
                    } else if (updateRequest.isAttending && user.attendedEvents.contains(eventId)) {
                        attendedEvents
                    } else {
                        attendedEvents.minus(eventId)
                    }
                }
            }
            updateRequest.userId?.let { userId ->
                val userObjectId = ObjectId(userId)
                event.attendees = event.attendees.let { attendees ->
                    if (updateRequest.isAttending && !event.attendees.contains(userObjectId)) {
                        attendees.plus(userObjectId)
                    } else if (updateRequest.isAttending && event.attendees.contains(userObjectId)) {
                        attendees
                    } else {
                        attendees.minus(userObjectId)
                    }
                }
            }
            userRepository.save(user)
            eventRepository.save(event)
            val isAttending = event.attendees.contains(user.id)
            val usersAttendedEvents = user.attendedEvents.map { it.toString() }
            return Optional.of(EventAttendResponseDTO(isAttending = isAttending, attendedEvents = usersAttendedEvents))
        }

        return Optional.empty()
    }

    fun addEventComment(
        eventId: ObjectId,
        updateRequest: EventUpdateDTO
    ): Optional<CommentDTO> {
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

            return Optional.of(mapToCommentDTO(insertedComment, user.username, user.profilePicture))
        }
        return Optional.empty()
    }

    fun deleteEventComment(
        eventId: ObjectId,
        commentId: ObjectId
    ): Boolean {
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

    fun deleteById(eventId: ObjectId, deletePayload: DeleteEventDTO): Boolean {
        eventRepository.deleteById(eventId)
        val s3Service = S3Service(accessKeyId, secretAccessKey, region, bucketName)
        s3Service.deleteObject(deletePayload.imageId)
        return true
    }
}

fun mapToCommentDTO(comment: Comment, username: String, profilePicture: String): CommentDTO {
    return CommentDTO(
        id = comment.id.toString(),
        userId = comment.userId,
        username = username,
        message = comment.message,
        date = comment.date,
        profilePicture = profilePicture
    )
}

fun mapEventToEventResponseDTO(event: Event, userRepository: UserRepository): EventResponseDTO {
    val user = userRepository.findById(ObjectId(event.creatorId)).get()
    return EventResponseDTO(
        id = event.id?.toString() ?: "",
        creator = Creator(
            id = event.creatorId,
            username = user.username,
            profilePicture = user.profilePicture
        ),
        title = event.title,
        location = event.location,
        description = event.description,
        tags = event.tags,
        price = event.price,
        createdDate = event.createdDate,
        eventDate = event.eventDate,
        image = event.image
    )


}

