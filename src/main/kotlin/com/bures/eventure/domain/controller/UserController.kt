package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.user.UserEventDetailsDTO
import com.bures.eventure.domain.dto.user.UserDTO

import com.bures.eventure.domain.dto.user.UserEditUsernameDTO
import com.bures.eventure.domain.model.EditUserResponse
import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.UserRepository
import com.bures.eventure.service.EventService
import com.bures.eventure.service.UserService
import org.apache.coyote.Response
import org.bson.types.ObjectId
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

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
    @PatchMapping("/edit/profilePicture/{userId}")
    fun storeProfilePicture(@PathVariable userId: String, @RequestPart("profilePicture") profilePicture: MultipartFile): ResponseEntity<String>{
        val objectId = ObjectId(userId)
        return ResponseEntity.ok(userService.editProfilePicture(objectId, profilePicture))
    }
    @PatchMapping("/edit/username/{userId}")
    fun editUsername(@PathVariable userId: String, @RequestBody editUserPayload: UserEditUsernameDTO): ResponseEntity<Any> {
        val objectId = ObjectId(userId)
        return when (val editUserResponse = userService.editUsername(objectId, editUserPayload)) {
            is EditUserResponse.Success -> ResponseEntity.ok(editUserResponse)
            is EditUserResponse.NoChange -> ResponseEntity.ok(editUserPayload.username)
            is EditUserResponse.UserNotFound -> ResponseEntity.notFound().build()
            is EditUserResponse.UsernameExists -> ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Username already exists. Choose a different username.")
        }


}
    @DeleteMapping("/{userId}")
    fun deleteUser(@PathVariable userId: String): ResponseEntity<Any>{
        val success = userService.deleteUser(ObjectId(userId))
        return if (success){
            ResponseEntity.ok("Deleted!")
        }else{
            return ResponseEntity.notFound().build()
        }
    }
}