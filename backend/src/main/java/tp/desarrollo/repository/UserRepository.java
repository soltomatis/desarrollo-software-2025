package tp.desarrollo.repository;

import tp.desarrollo.clases.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, Long> {

    // 🔎 Buscar usuario por nombre de usuario
    Optional<Usuario> findByUsername(String username);

    // ✅ Verificar si existe un usuario con ese nombre
    boolean existsByUsername(String username);
}