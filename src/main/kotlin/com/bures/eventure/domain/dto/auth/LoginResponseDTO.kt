package com.bures.eventure.domain.dto.auth

import org.bson.types.ObjectId

class LoginResponseDTO (
    val id: String,
    val username: String,
    val profilePicture: String
)