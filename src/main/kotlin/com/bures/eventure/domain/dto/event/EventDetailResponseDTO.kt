package com.bures.eventure.domain.dto.event

import com.bures.eventure.domain.dto.comment.CommentDTO
import com.bures.eventure.domain.dto.venue.VenueDTO
import com.bures.eventure.domain.model.Location
import java.time.LocalDateTime
import java.util.*

data class EventDetailResponseDTO (
    val id: String,
    var creator: Creator,
    var title: String,
    var venueId: String,
    var venues: List<VenueDTO>,
    var description: String,
    var attendees: List<String>,
    var likes: Int,
    var comments: List<CommentDTO>,
    var tags: List<String>,
    var price: Int,
    var createdDate: String,
    var eventDate: String,
    var isAttending: Boolean,
    var isLiked : Boolean,
    var image: String,
)
data class Creator(
    val id: String,
    val username: String,
    val profilePicture: String

)