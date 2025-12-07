package tp.desarrollo.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Representa al usuario autenticado en el contexto de Spring Security.
 * Se diferencia de la entidad JPA Usuario porque no expone password ni id.
 */
public class AppUserDetails implements UserDetails {

    private final String username;
    private final String role;

    public AppUserDetails(String username, String role) {
        this.username = username;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return null; // no necesitamos la contraseña en el contexto de seguridad
    }

    @Override
    public String getUsername() {
        return username;
    }

    // Métodos de control de cuenta (pueden quedar siempre en true)
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

    public String getRole() {
        return role;
    }
}