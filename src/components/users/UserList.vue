<template>
  <div class="usuario-container">
    <h1>Gestión de Usuarios</h1>

    <!-- Botón para abrir el modal -->
    <button @click="openModal" class="btn primary">Registrar Nuevo Usuario</button>

    <!-- Modal para registrar usuario -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>Registrar Usuario</h2>
        <form @submit.prevent="saveUsuario" class="usuario-form">
          <div class="form-group">
            <label for="nombres">Nombres:</label>
            <input type="text" id="nombres" v-model="usuario.nombres" required />
          </div>
          <div class="form-group">
            <label for="apellidos">Apellidos:</label>
            <input type="text" id="apellidos" v-model="usuario.apellidos" required />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" v-model="usuario.telefono" required />
          </div>
          <div class="form-group">
            <label for="correo_institucional">Correo Institucional:</label>
            <input type="email" id="correo_institucional" v-model="usuario.correo_institucional" required />
          </div>
          <div class="form-group">
            <label for="cedula">Cédula:</label>
            <input type="text" id="cedula" v-model="usuario.cedula" required />
          </div>
          <div class="form-group">
            <label for="carrera">Carrera:</label>
            <input type="text" id="carrera" v-model="usuario.carrera" required />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn secondary">Cancelar</button>
            <button type="submit" class="btn primary">Guardar Usuario</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Lista de Usuarios -->
    <div v-if="usuarios.length" class="usuarios-list">
      <h2>Usuarios Registrados</h2>
      <table class="usuarios-table">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Correo Institucional</th>
            <th>Cédula</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id_usuario">
            <td>{{ usuario.nombres }}</td>
            <td>{{ usuario.apellidos }}</td>
            <td>{{ usuario.telefono }}</td>
            <td>{{ usuario.correo_institucional }}</td>
            <td>{{ usuario.cedula }}</td>
            <td>{{ usuario.carrera }}</td>
            <td class="acciones">
              <button @click="editarUsuario(usuario)" class="btn secondary">Editar</button>
              <button @click="eliminarUsuario(usuario.id_usuario)" class="btn danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="no-usuarios">
      <p>No hay usuarios registrados.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      usuarios: [], // Aquí guardaremos los usuarios obtenidos de la API
      isModalOpen: false, // Estado para controlar la apertura del modal
      usuario: {
        nombres: '',
        apellidos: '',
        telefono: '',
        correo_institucional: '',
        cedula: '',
        carrera: ''
      }
    };
  },
  methods: {
    // Función para obtener los usuarios desde la API
    async fetchUsuarios() {
      try {
        const response = await fetch('http://localhost:3000/api/usuarios');
        const data = await response.json();
        this.usuarios = data; // Asignamos los usuarios a la propiedad 'usuarios'
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudieron cargar los usuarios.',
        });
      }
    },

    // Función para guardar un nuevo usuario
    async saveUsuario() {
      try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.usuario)
        });

        if (response.ok) {
          const data = await response.json();
          this.usuarios.push(data); // Agregamos el nuevo usuario a la lista
          this.closeModal(); // Cerramos el modal
          Swal.fire({
            icon: 'success',
            title: 'Usuario Registrado',
            text: 'El usuario fue registrado correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al guardar el usuario.',
          });
        }
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo guardar el usuario. Inténtalo más tarde.',
        });
      }
    },

    // Función para eliminar un usuario
    async eliminarUsuario(id_usuario) {
      const confirmDelete = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Este usuario será eliminado!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmDelete.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/api/usuarios/${id_usuario}`, {
            method: 'DELETE',
          });
          const data = await response.json();

          if (response.ok) {
            this.usuarios = this.usuarios.filter(usuario => usuario.id_usuario !== id_usuario); // Eliminamos el usuario de la lista
            Swal.fire({
              icon: 'success',
              title: 'Usuario Eliminado',
              text: data.message,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar el usuario.',
            });
          }
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo eliminar el usuario. Inténtalo más tarde.',
          });
        }
      }
    },

    // Función para abrir el modal
    openModal() {
      this.isModalOpen = true;
    },

    // Función para cerrar el modal
    closeModal() {
      this.isModalOpen = false;
      // Limpiar el formulario después de cerrar el modal
      this.usuario = {
        nombres: '',
        apellidos: '',
        telefono: '',
        correo_institucional: '',
        cedula: '',
        carrera: ''
      };
    },

    // Función para editar un usuario (por implementar)
    editarUsuario(usuario) {
      console.log("Editar usuario:", usuario);
      // Aquí puedes agregar la lógica para abrir un modal de edición con los datos del usuario
    }
  },
  created() {
    // Llamamos a fetchUsuarios cuando el componente es creado
    this.fetchUsuarios();
  }
};
</script>

<style scoped>
/* Los estilos no cambian */
.usuario-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;

  
}

h1 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #333;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  width: 100%;
  max-width: 250px;
}

.primary {
  background-color: #007bff;
  color: white;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.danger {
  background-color: #dc3545;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
  font-size: 1.4em;
  color: #333;
  margin-bottom: 20px;
}

.usuario-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  color: #495057;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.usuarios-list {
  margin-top: 30px;
}

.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.usuarios-table th, .usuarios-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.usuarios-table th {
  background-color: #007bff;
  color: white;
}

.usuarios-table td {
  background-color: #f8f9fa;
}

.acciones {
  display: flex;
  gap: 10px;
}

.no-usuarios {
  text-align: center;
  margin-top: 30px;
  color: #6c757d;
}
</style>
