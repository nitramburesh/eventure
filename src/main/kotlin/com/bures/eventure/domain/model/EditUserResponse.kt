package com.bures.eventure.domain.model


sealed class EditUserResponse {
    object Success : EditUserResponse()
    object NoChange : EditUserResponse()
    object UsernameExists : EditUserResponse()
    object UserNotFound : EditUserResponse()
}