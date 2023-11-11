package com.bures.eventure

import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.provisioning.InMemoryUserDetailsManager
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry


@Configuration
@EnableWebSecurity
class SecurityConfig(){
@Bean
fun configure(http: HttpSecurity): SecurityFilterChain{
    http
        .csrf{ csrf -> csrf.disable()}
        .cors{ cors -> cors.disable()}
        .authorizeHttpRequests{authorizeHttpRequest ->
            authorizeHttpRequest.requestMatchers("/api/v1/login").permitAll()
            authorizeHttpRequest.requestMatchers("/api/v1/logout").permitAll()
            authorizeHttpRequest.requestMatchers("/api/v1/register").permitAll()
            authorizeHttpRequest.requestMatchers("/api/v1/events/all").permitAll()
            authorizeHttpRequest.requestMatchers("/api/v1/events/**").permitAll()
//            authorizeHttpRequest.requestMatchers("/api/v1/*").permitAll()
            authorizeHttpRequest.requestMatchers( "/api/v1/users/**").authenticated()
            authorizeHttpRequest.requestMatchers( "/api/v1/events").authenticated()
            authorizeHttpRequest.anyRequest().authenticated()
        }
        .exceptionHandling{
            exceptionHandling ->
                exceptionHandling.authenticationEntryPoint(AuthenticationEntryPoint { _, response: HttpServletResponse, ex: AuthenticationException ->
                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        ex.message
                    )
                })
        }.formLogin{formLogin -> formLogin.loginPage("/login").permitAll()}
        .logout{logout -> logout.permitAll()}






    return http.build()
}
    @Bean
    fun userDetailsService(): UserDetailsService {
        val user: UserDetails = User.builder()
            .username("user")
            .password("password")
            .roles("USER")
            .build()
        return InMemoryUserDetailsManager(user)
    }

    @Bean
    fun corsFilter(): CorsFilter {
        // allow localhost for dev purposes
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:3006", "http://localhost:8080")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE")
        configuration.allowedHeaders = listOf("authorization", "content-type")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return CorsFilter(source)
    }

}