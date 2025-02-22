<template>
  <div class="categoria-container">
    <h1>Gestión de Categorías</h1>

    <!-- Botón para abrir el modal -->
    <button @click="openModal" class="btn primary">Registrar Nueva Categoría</button>

    <!-- Modal para registrar o editar categoría -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Editar' : 'Registrar' }} Categoría</h2>
        <form @submit.prevent="saveCategoria">
          <div class="form-group">
            <label for="nombre_categoria">Nombre de la Categoría:</label>
            <input type="text" id="nombre_categoria" v-model="categoria.nombre_categoria" required />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn secondary">Cancelar</button>
            <button type="submit" class="btn primary">{{ isEditMode ? 'Actualizar' : 'Guardar' }} Categoría</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Lista de Categorías -->
    <div v-if="categorias.length" class="categorias-list">
      <h2>Categorías Registradas</h2>
      <ul>
        <li v-for="categoria in categorias" :key="categoria.id_categoria">
          <strong>{{ categoria.nombre_categoria }}</strong>
          <button @click="editCategoria(categoria)" class="btn secondary small">Editar</button>
          <button @click="deleteCategoria(categoria.id_categoria)" class="btn danger small">Eliminar</button>
        </li>
      </ul>
    </div>
    <div v-else class="no-categorias">
      <p>No hay categorías registradas.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      isModalOpen: false,
      isEditMode: false,  // Para saber si estamos editando
      categoria: {
        id_categoria: null,
        nombre_categoria: '',
      },
      categorias: [],
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      this.isEditMode = false; // Para registrar nueva categoría por defecto
      this.categoria = { id_categoria: null, nombre_categoria: '' }; // Limpiar el formulario
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    async saveCategoria() {
      try {
        let response;
        if (this.isEditMode) {
          // Si estamos en modo edición, actualizamos la categoría
          response = await fetch(`http://localhost:3000/api/categorias/${this.categoria.id_categoria}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.categoria),
          });
        } else {
          // Si estamos en modo registro, agregamos la nueva categoría
          response = await fetch('http://localhost:3000/api/categorias', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.categoria),
          });
        }

        if (response.ok) {
          const updatedCategoria = await response.json();

          if (this.isEditMode) {
            // Actualizamos la categoría en la lista
            const index = this.categorias.findIndex(c => c.id_categoria === updatedCategoria.id_categoria);
            this.categorias.splice(index, 1, updatedCategoria);
            Swal.fire('Éxito', 'La categoría ha sido actualizada correctamente.', 'success');
          } else {
            // Agregamos la nueva categoría
            this.categorias.push(updatedCategoria);
            Swal.fire('Éxito', 'La categoría ha sido registrada correctamente.', 'success');
          }

          this.resetForm();
          this.closeModal();
        } else {
          throw new Error('Error al guardar la categoría');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Hubo un problema al guardar la categoría', 'error');
      }
    },
    editCategoria(categoria) {
      this.isEditMode = true;
      this.categoria = { ...categoria }; // Cargar los datos de la categoría en el formulario
      this.openModal();  // Abrir el modal en modo edición
    },
    async deleteCategoria(id_categoria) {
      // Usamos SweetAlert para confirmar la eliminación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/api/categorias/${id_categoria}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            this.categorias = this.categorias.filter(categoria => categoria.id_categoria !== id_categoria);
            Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
          } else {
            throw new Error('Error al eliminar la categoría');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', 'Hubo un problema al eliminar la categoría', 'error');
        }
      }
    },
    resetForm() {
      this.categoria = {
        id_categoria: null,
        nombre_categoria: '',
      };
      this.isEditMode = false;
    },
  },
  async created() {
    // Cargar las categorías al iniciar
    try {
      const response = await fetch('http://localhost:3000/api/categorias');
      if (response.ok) {
        this.categorias = await response.json();
      } else {
        throw new Error('Error al cargar las categorías');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Hubo un problema al cargar las categorías', 'error');
    }
  },
};
</script>

<style scoped>
.categoria-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  max-width: 200px;
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

.small {
  font-size: 0.875em;
  padding: 6px 12px;
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
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h2 {
  font-size: 1.4em;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
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

.categorias-list {
  margin-top: 30px;
}

.categorias-list ul {
  list-style-type: none;
  padding: 0;
}

.categorias-list li {
  background-color: #f8f9fa;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-categorias {
  text-align: center;
  margin-top: 30px;
  color: #6c757d;
}
</style>
