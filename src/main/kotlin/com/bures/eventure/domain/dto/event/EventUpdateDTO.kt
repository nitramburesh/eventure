package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.model.Comment
import org.bson.types.ObjectId

data class EventUpdateDTO(
    val userId: String?,
    val likes: Int?,
    val isAttending: Boolean,
    val comment: Comment?,
)