package com.bures.eventure.domain.dto.user

import org.bson.types.ObjectId


data class UserDTO(
        val id: ObjectId?,
        val username: String,
        val password: String
)
