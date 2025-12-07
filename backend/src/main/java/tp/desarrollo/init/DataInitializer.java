package tp.desarrollo.init;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import tp.desarrollo.clases.Usuario;
import tp.desarrollo.repositorio.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
        }

        if (userRepository.findByUsername("Mario").isEmpty()) {
            Usuario conserje = new Usuario();
            conserje.setUsername("Mario");
            conserje.setPassword(passwordEncoder.encode("conserje001"));
            conserje.setRole("ROLE_CONSERJE");
            userRepository.save(conserje);
        }
    }
}