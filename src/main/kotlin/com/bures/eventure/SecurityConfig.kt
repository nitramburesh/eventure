package com.bures.eventure


import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity

import org.springframework.security.core.userdetails.MapReactiveUserDetailsService
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails

import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry


@Configuration
@EnableWebFluxSecurity
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
class SecurityConfig(){


@Bean
fun configure(http: ServerHttpSecurity): SecurityWebFilterChain{

    http
        .csrf { csrf -> csrf.disable() }
        .csrf{ csrf -> csrf.disable()}
        .cors{ cors -> cors.disable()}
        .authorizeExchange{it
            .pathMatchers(HttpMethod.OPTIONS).permitAll()
            .pathMatchers("/api/v1/login").permitAll()
            .pathMatchers("/api/v1/logout").permitAll()
            .pathMatchers("/api/v1/register").permitAll()
            .pathMatchers("/api/v1/events/**").permitAll()
            .pathMatchers("/api/v1/users/**").permitAll()
            .pathMatchers("/api/v1/events/all").permitAll()
//            .pathMatchers("/api/v1/**").permitAll()
//            authorizeHttpRequest.requestMatchers( "/api/v1/users/**").authenticated()
//            authorizeHttpRequest.requestMatchers( "/api/v1/events").authenticated()
//            authorizeHttpRequest.anyRequest().authenticated()

        }
    return http.build()
}

    @Bean
    fun userDetailsService(): ReactiveUserDetailsService {
        val user: UserDetails = User.builder()
            .username("user")
            .password("password")
            .roles("USER")
            .build()
        return MapReactiveUserDetailsService(user)
    }



}
