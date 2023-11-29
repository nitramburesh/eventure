package com.bures.eventure.domain.dto.comment

import java.time.LocalDateTime


data class CommentDTO (
    val id: String,
    val userId: String,
    val username: String,
    val message: String,
    val date: String,
    val profilePicture : String
)
