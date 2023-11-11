package com.bures.eventure.domain.controller

import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.UserRepository
import org.bson.types.ObjectId
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController(private val userRepository: UserRepository) {
    @GetMapping("")
    fun getUsers(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(this.userRepository.findAll())
    }

    @GetMapping("/{userId}")
    fun getUserById(@PathVariable userId: String): ResponseEntity<User> {
        val objectId = ObjectId(userId)
        val user = userRepository.findById(objectId)
        return if (user.isPresent) {
            ResponseEntity.ok(user.get())
        } else {
            ResponseEntity.notFound().build()
        }

    }
}