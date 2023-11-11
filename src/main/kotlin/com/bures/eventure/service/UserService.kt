package com.bures.eventure.service

import com.bures.eventure.domain.model.User
import com.bures.eventure.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {
    fun save(user : User):User{

        return userRepository.insert(user)
    }
    fun findByUsername(username: String): User?{
        return userRepository.findByUsername(username)
    }
}