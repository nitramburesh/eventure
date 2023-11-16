package com.bures.eventure.domain.dto.comment

import java.util.Date

data class CommentDTO (
    val id: String,
    val userId: String,
    val username: String,
    val message: String,
    val date: Date
)
