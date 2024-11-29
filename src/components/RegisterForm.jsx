import { registerUser } from "./services/auth";

const handleRegister = async () => {
  const { user, error } = await registerUser("test@example.com", "password123", true);
  if (user) {
    console.log("Usuario registrado:", user.uid);
  } else {
    console.error("Error al registrar:", error);
  }
};
