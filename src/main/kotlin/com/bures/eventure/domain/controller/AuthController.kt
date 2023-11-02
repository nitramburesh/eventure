package com.bures.eventure.domain.controller

import com.bures.eventure.domain.dto.auth.LoginDTO
import com.bures.eventure.domain.dto.auth.LoginResponseDTO
import com.bures.eventure.domain.dto.auth.RegisterDTO
import com.bures.eventure.domain.model.User
import com.bures.eventure.service.UserService
import io.jsonwebtoken.Jwts
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/v1")
class AuthController(private val userService: UserService) {
    @PostMapping("/register")
    fun register(@RequestBody body: RegisterDTO): ResponseEntity<User>{
        val user = User()
        user.username = body.username
        user.password = body.password

        return ResponseEntity.ok(userService.save(user));
    }

    @PostMapping("/login")
    fun login(@RequestBody body: LoginDTO, response: HttpServletResponse): ResponseEntity<Any>{
        val user = userService.findByUsername(body.username) ?: return ResponseEntity.badRequest().body("User not found!")

        if (!user.comparePassword(body.password)){
            return ResponseEntity.badRequest().body("Invalid password!")
        }

        val subject = user.id.toString()
        val key = Jwts.SIG.HS256.key().build()
        val jwt = Jwts.builder().subject(subject).signWith(key).compact()

        return ResponseEntity.ok(LoginResponseDTO(user.id.toString(), body.username,jwt))
    }

}