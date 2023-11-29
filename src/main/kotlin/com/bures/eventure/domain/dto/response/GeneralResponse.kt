package com.bures.eventure.domain.dto.response

sealed class GeneralResponse {
    object Success : GeneralResponse()
    object NotFound : GeneralResponse()
}