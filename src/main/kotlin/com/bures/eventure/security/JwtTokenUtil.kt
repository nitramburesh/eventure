package com.bures.eventure.security

import com.bures.eventure.domain.model.User
import io.jsonwebtoken.Jwts
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import java.util.*
@Component
class JwtTokenUtil(user: User) {
    fun generateJwtToken(user: User):String{
        return Jwts.builder()
            .expiration(Date(System.currentTimeMillis() + 3600000)) // expires in 1 hour
            .subject(String.format("%s,%s", user.id.toString(), user.username))
            .signWith(Jwts.SIG.HS256.key().build())
            .compact()

    }

}