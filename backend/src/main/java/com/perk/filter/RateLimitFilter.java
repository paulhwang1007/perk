package com.perk.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Value("${perk.ratelimit.public}")
    private int publicLimit;

    @Value("${perk.ratelimit.authenticated}")
    private int authenticatedLimit;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Skip rate limiting for static resources (optional, not usually served by this backend)
        // or health checks if any

        String key = resolveKey(httpRequest);
        boolean isAuthenticated = isUserAuthenticated();
        int limit = isAuthenticated ? authenticatedLimit : publicLimit;

        Bucket bucket = cache.computeIfAbsent(key, k -> createNewBucket(limit));

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            httpResponse.setStatus(429);
            httpResponse.getWriter().write("Too Many Requests");
        }
    }

    private String resolveKey(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return "user:" + jwt.getSubject();
        }
        return "ip:" + request.getRemoteAddr();
    }

    private boolean isUserAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof Jwt;
    }

    private Bucket createNewBucket(int limit) {
        // Refill 'limit' tokens every 1 minute
        Bandwidth limitBandwidth = Bandwidth.builder()
            .capacity(limit)
            .refillGreedy(limit, Duration.ofMinutes(1))
            .build();
            
        return Bucket.builder()
            .addLimit(limitBandwidth)
            .build();
    }
}
