package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.dto.comment.CommentDTO
import com.bures.eventure.domain.dto.user.UserDTO
import com.bures.eventure.domain.model.Comment
import com.bures.eventure.domain.model.Location
import com.bures.eventure.domain.model.User
import com.google.type.DateTime
import java.time.LocalDateTime
import java.time.LocalTime
import java.util.*

data class EventDetailResponseDTO (
    val id: String,
    var creator: Creator,
    var title: String,
    var location: Location,
    var description: String,
    var attendees: List<String>,
    var likes: Int,
    var comments: List<CommentDTO>,
    var tags: List<String>,
    var price: Int,
    var createdDate: Date,
    var eventDate: Date,
    var isAttending: Boolean,
    var isLiked : Boolean
)
data class Creator(
    val id: String,
    val username: String
)