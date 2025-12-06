package tp.desarrollo.dto;

public class UserInfoResponse {
    private String username;
    private String role;
    private String message;

    public UserInfoResponse(String username, String role) {
        this.username = username;
        this.role = role;
        this.message = "Usuario autenticado correctamente";
    }

    // Getters
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
}