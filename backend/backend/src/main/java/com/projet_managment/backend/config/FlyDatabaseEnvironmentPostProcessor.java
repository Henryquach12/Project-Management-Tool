package com.projet_managment.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Parses a cloud DATABASE_URL (postgres:// or postgresql://)
 * into Spring datasource properties at startup. Works on Render, Railway, Fly.io, etc.
 */
public class FlyDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null) return;
        if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) return;
        // Normalize to postgres:// so java.net.URI parses it correctly
        databaseUrl = databaseUrl.replaceFirst("^postgresql://", "postgres://");

        try {
            URI uri = new URI(databaseUrl);
            String[] userInfo = uri.getUserInfo().split(":", 2);
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath()
                    + "?sslmode=require";

            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", jdbcUrl);
            props.put("spring.datasource.username", userInfo[0]);
            props.put("spring.datasource.password", userInfo.length > 1 ? userInfo[1] : "");
            environment.getPropertySources().addFirst(new MapPropertySource("fly-database", props));
        } catch (Exception ignored) {
        }
    }
}
