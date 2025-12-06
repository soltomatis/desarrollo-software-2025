package tp.desarrollo.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import tp.desarrollo.dto.LoginRequest;
import tp.desarrollo.dto.LoginResponse;
import tp.desarrollo.dto.UserInfoResponse;
import tp.desarrollo.clases.Usuario;
import tp.desarrollo.repositorio.UserRepository;
import tp.desarrollo.security.JwtUtil;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    //  Endpoint de login → devuelve JWT
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        try {
            // Autenticar credenciales
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Buscar usuario en BD
            Usuario usuario = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Generar JWT con username y rol
            String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRole());

            LoginResponse response = new LoginResponse(
                "Login exitoso",
                usuario.getUsername(),
                usuario.getRole(),
                token
            );

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse("Credenciales inválidas", null, null, null));
        }
    }

    //  Endpoint para obtener info del usuario autenticado
    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Usuario usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserInfoResponse response = new UserInfoResponse(usuario.getUsername(), usuario.getRole());
        return ResponseEntity.ok(response);
    }
}