package com.bures.eventure.service

import com.bures.eventure.domain.dto.response.GeneralResponse
import com.bures.eventure.domain.dto.user.UserDetailsDTO
import com.bures.eventure.domain.dto.user.UserEditUsernameDTO
import com.bures.eventure.domain.dto.user.UserEventDetailsDTO
import com.bures.eventure.domain.model.EditUserResponse
import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.CommentRepository
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.repository.UserRepository
import com.bures.eventure.repository.VenueRepository
import org.bson.types.ObjectId
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*
import javax.transaction.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val eventRepository: EventRepository,
    private val commentRepository: CommentRepository,
    private val venueRepository: VenueRepository
) {

    fun save(user: User): User {
        return userRepository.insert(user)
    }

    fun findByUsername(username: String): User? {
        return userRepository.findByUsername(username)
    }

    fun getUserEvents(userId: ObjectId): Optional<UserEventDetailsDTO> {
        val maybeUser = userRepository.findById(userId)
        return if (maybeUser.isPresent) {
            val user = maybeUser.get()
            val usersLikedEvents = user.likedEvents.map { it.toString() }
            val usersAttendedEvents = user.attendedEvents.map { it.toString() }
            Optional.of(UserEventDetailsDTO(likedEvents = usersLikedEvents, attendedEvents = usersAttendedEvents))
        } else {
            Optional.empty()
        }
    }

    fun getUserDetails(userId: ObjectId): Optional<UserDetailsDTO> {
        val maybeUser = userRepository.findById(userId)
        if (maybeUser.isPresent) {
            val user = maybeUser.get()

            val likedEvents =
                eventRepository.findAllById(user.likedEvents).map { mapEventToEventResponseDTO(it, userRepository, venueRepository) }
            val attendedEvents =
                eventRepository.findAllById(user.attendedEvents).map { mapEventToEventResponseDTO(it, userRepository, venueRepository) }

            return Optional.of(
                UserDetailsDTO(
                    id = user.id.toString(),
                    username = user.username,
                    likedEvents = likedEvents,
                    attendedEvents = attendedEvents,
                    profilePicture = user.profilePicture
                )
            )
        } else {
            return Optional.empty()
        }
    }

    fun editProfilePicture(userId: ObjectId, profilePicture: MultipartFile): String {
        val maybeUser = userRepository.findById(userId)
        return if (maybeUser.isPresent) {
            val user = maybeUser.get()
            val userIdString = userId.toString()
            val s3Service = S3Service()
            s3Service.uploadFile(userIdString, profilePicture.inputStream)
            user.profilePicture = "https://storage-eventure.s3.eu-north-1.amazonaws.com/${userIdString}"
            userRepository.save(user)
            "https://storage-eventure.s3.eu-north-1.amazonaws.com/${userIdString}"
        } else {
            "User not found."
        }
    }

    fun editUsername(userId: ObjectId, editUserPayload: UserEditUsernameDTO): EditUserResponse {
        val maybeUser = userRepository.findById(userId)
        return if (maybeUser.isPresent) {
            val user = maybeUser.get()
            val alreadyExists = userRepository.existsByUsername(editUserPayload.username)
            if (editUserPayload.username == user.username) {
                EditUserResponse.NoChange
            } else if (alreadyExists) {
                EditUserResponse.UsernameExists
            } else {
                user.username = editUserPayload.username
                userRepository.save(user)
                EditUserResponse.Success
            }

        } else {
            EditUserResponse.UserNotFound
        }
    }

    @Transactional
    fun deleteUser(userId: ObjectId): GeneralResponse {
        val maybeUser = userRepository.findById(userId)
        return if (maybeUser.isPresent) {

            //get users, events and comments
            val user = maybeUser.get()
            val eventsCreatedByUser = eventRepository.findAllByCreatorId(user.id.toString())
            val usersComments = commentRepository.findAllByUserId(user.id.toString())

            //map events to list of its ids
            val eventIds = eventsCreatedByUser.map { it.id }
            val commentIds = usersComments.map { it.id!! }

            //filter out comments made by deleted user
            val eventsCommentedByUser = eventRepository.findByCommentsIn(commentIds)
            eventsCommentedByUser.forEach { event ->
                event.comments = event.comments?.filter { commentId -> !commentIds.contains(commentId) }
                eventRepository.save(event)
            }

            //filter out attendances confirmed by user
            val eventsAttendedByUser = eventRepository.findByAttendeesIn(user.id)
            eventsAttendedByUser.forEach { event ->
                event.attendees = event.attendees.filter { it != user.id }
                eventRepository.save(event)
            }

            //delete according events and comments
            eventRepository.deleteAllById(eventIds)
            commentRepository.deleteAllById(commentIds)

            //delete profile picture image from storage
            val s3Service = S3Service()
            eventIds.forEach { s3Service.deleteObject(it.toString()) }
            s3Service.deleteObject(user.id.toString())

            //delete user itself
            userRepository.deleteById(user.id)
            GeneralResponse.Success
        } else {
            GeneralResponse.NotFound
        }
    }

}