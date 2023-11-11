package com.bures.eventure.domain.dto.auth
import javax.validation.constraints.NotBlank

class RegisterDTO (
    @NotBlank
    val username: String,
    @NotBlank
    val password: String
)