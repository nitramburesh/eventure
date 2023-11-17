package com.bures.eventure.service

import com.bures.eventure.domain.dto.user.UserDetailsDTO
import com.bures.eventure.domain.dto.user.UserEditDTO
import com.bures.eventure.domain.dto.user.UserEventDetailsDTO
import com.bures.eventure.domain.model.EditUserResponse
import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.EventRepository
import com.bures.eventure.repository.UserRepository
import org.bson.types.ObjectId
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(private val userRepository: UserRepository, private val eventRepository: EventRepository) {
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
            Optional.of(UserEventDetailsDTO(likedEvents = user.likedEvents, attendedEvents = user.attendedEvents))
        } else {
            Optional.empty()
        }
    }

    fun getUserDetails(userId: ObjectId): Optional<UserDetailsDTO> {
        val maybeUser = userRepository.findById(userId)
        if (maybeUser.isPresent) {
            val user = maybeUser.get()
            val likedEventsObjectIds = user.likedEvents.map { ObjectId(it) }
            val attendedEventsObjectIds = user.attendedEvents.map { ObjectId(it) }
            val likedEvents = eventRepository.findAllById(likedEventsObjectIds).map { mapEventToEventResponseDTO(it) }
            val attendedEvents =
                eventRepository.findAllById(attendedEventsObjectIds).map { mapEventToEventResponseDTO(it) }

            return Optional.of(
                UserDetailsDTO(
                    id = user.id.toString(),
                    username = user.username,
                    likedEvents = likedEvents,
                    attendedEvents = attendedEvents
                )
            )
        } else {
            return Optional.empty()
        }
    }

    fun editUser(userId: ObjectId, editUserPayload: UserEditDTO): EditUserResponse {
        val maybeUser = userRepository.findById(userId)
        return if (maybeUser.isPresent) {
            val user = maybeUser.get()
            val alreadyExists = userRepository.existsByUsername(editUserPayload.username)
            if ( user.username == editUserPayload.username) {
                EditUserResponse.NoChange
            }else if(alreadyExists){
                EditUserResponse.UsernameExists
            }
            else {
                user.username = editUserPayload.username
                userRepository.save(user)
                EditUserResponse.Success
            }

        } else {
            EditUserResponse.UserNotFound
        }
    }
}