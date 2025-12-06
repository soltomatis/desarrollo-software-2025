package tp.desarrollo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // aplica a todas las rutas
            .allowedOrigins("http://localhost:3000") // tu frontend Next.js
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            //  no hace falta allowCredentials(true) porque no usás cookies
    }
}