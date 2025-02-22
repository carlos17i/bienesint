<template>
    <div class="user-form">
      <h1>Registro de Usuarios</h1>
      <form @submit.prevent="saveUser">
        <div class="form-grid">
          <!-- Nombre de Usuario -->
          <div class="form-group">
            <label for="username">Nombre de Usuario:</label>
            <input type="text" id="username" v-model="user.username" required />
          </div>
  
          <!-- Contraseña -->
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password_hash" v-model="user.password_hash" required />
          </div>
  
          <!-- Correo Electrónico -->
          <div class="form-group">
            <label for="email">Correo Electrónico:</label>
            <input type="email" id="email" v-model="user.email" required />
          </div>
  
          <!-- Nombre Completo -->
          <div class="form-group">
            <label for="full_name">Nombre Completo:</label>
            <input type="text" id="full_name" v-model="user.full_name" required />
          </div>
  
          <!-- Rol -->
          <div class="form-group">
            <label for="role">Rol:</label>
            <select id="role" v-model="user.role" required>
              <option value="" disabled>Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
              <option value="Responsable">Responsable</option>
            </select>
          </div>
  
          <!-- Estado Activo -->
          <div class="form-group">
            <label for="is_active">Estado:</label>
            <select id="is_active" v-model="user.is_active" required>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </div>
  
        <div class="form-actions">
          <button type="submit" class="btn">Guardar Usuario</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          username: "",
          password_hash: "",
          email: "",
          full_name: "",
          role: "",
          is_active: "1", // Por defecto activo
        },
      };
    },
    methods: {
      async saveUser() {
        try {
          const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.user),
          });
          if (!response.ok) throw new Error("Error al guardar el usuario");
          alert("Usuario creado exitosamente");
          this.resetForm();
        } catch (error) {
          console.error("Error:", error);
          alert("Hubo un error al guardar el usuario");
        }
      },
      resetForm() {
        this.user = {
          username: "",
          password: "",
          email: "",
          full_name: "",
          role: "",
          is_active: "1",
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .user-form {
    max-width: 600px;
    margin: auto;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Tres columnas */
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-actions {
    text-align: center;
    margin-top: 20px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  