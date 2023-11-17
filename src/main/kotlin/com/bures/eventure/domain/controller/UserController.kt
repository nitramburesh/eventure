package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.user.UserEventDetailsDTO
import com.bures.eventure.domain.dto.user.UserDTO
import com.bures.eventure.domain.dto.user.UserEditDTO
import com.bures.eventure.domain.model.EditUserResponse
import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.UserRepository
import com.bures.eventure.service.EventService
import com.bures.eventure.service.UserService
import org.bson.types.ObjectId
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/users")
class UserController(private val userRepository: UserRepository, private val userService: UserService) {
    @GetMapping("/all")
    fun getUsers(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(this.userRepository.findAll())
    }

    @GetMapping("/events/{userId}")
    fun getUserEvents(@PathVariable userId: String): ResponseEntity<UserEventDetailsDTO> {
        val objectId = ObjectId(userId)
        val maybeUser = userService.getUserEvents(objectId)
        return if (maybeUser.isPresent) {
            ResponseEntity.ok(maybeUser.get())
        } else {
            ResponseEntity.notFound().build()
        }


    }

    @GetMapping("/details/{userId}")
    fun getUserDetails(@PathVariable userId: String): ResponseEntity<Any> {
        val objectId = ObjectId(userId)
        val maybeUserDetails = userService.getUserDetails(objectId)
        if (maybeUserDetails.isPresent) {
            val user = maybeUserDetails.get()
            return ResponseEntity.ok(user)
        }
        return ResponseEntity.notFound().build()
    }

    @PatchMapping("/edit/{userId}")
    fun editUser(@PathVariable userId: String, @RequestBody editUserPayload: UserEditDTO): ResponseEntity<Any> {
        val objectId = ObjectId(userId)
        val editUserResponse = userService.editUser(objectId, editUserPayload)
        return when (editUserResponse) {
            is EditUserResponse.Success -> ResponseEntity.ok("User sucessfully updated!")
            is EditUserResponse.NoChange -> ResponseEntity.ok("User not changed.")
            is EditUserResponse.UserNotFound -> ResponseEntity.notFound().build()
            is EditUserResponse.UsernameExists -> ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Username already exists. Choose a different username.")
        }
}
}