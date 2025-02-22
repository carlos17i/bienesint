<template>
  <div class="ubicacion-container">
    <h1>Gestión de Ubicaciones</h1>

    <!-- Botón para abrir el modal -->
    <button @click="openModal" class="btn primary">Registrar Nueva Ubicación</button>

    <!-- Modal para registrar/editar ubicación -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Editar Ubicación' : 'Registrar Ubicación' }}</h2>
        <form @submit.prevent="saveOrUpdateUbicacion">
          <div class="form-group">
            <label for="area">Área:</label>
            <input type="text" id="area" v-model="ubicacion.area" required />
          </div>
          <div class="form-group">
            <label for="numero_aula">Número de Aula:</label>
            <input type="text" id="numero_aula" v-model="ubicacion.numero_aula" required />
          </div>
          <div class="form-group">
            <label for="sede">Sede:</label>
            <select id="sede" v-model="ubicacion.sede" required>
              <option value="Sede Principal">Sede Principal</option>
              <option value="Escuela Municipal">Escuela Municipal</option>
            </select>
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <textarea id="descripcion" v-model="ubicacion.descripcion" rows="3" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn secondary">Cancelar</button>
            <button type="submit" class="btn primary">{{ isEditing ? 'Actualizar Ubicación' : 'Guardar Ubicación' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de Ubicaciones -->
    <div v-if="ubicaciones.length" class="ubicaciones-table">
      <h2>Ubicaciones Registradas</h2>
      <table>
        <thead>
          <tr>
            <th>Área</th>
            <th>Número de Aula</th>
            <th>Sede</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ubicacion in ubicaciones" :key="ubicacion.id_ubicacion">
            <td>{{ ubicacion.area }}</td>
            <td>{{ ubicacion.numero_aula }}</td>
            <td>{{ ubicacion.sede }}</td>
            <td>{{ ubicacion.descripcion }}</td>
            <td>
              <button @click="editUbicacion(ubicacion)" class="btn secondary">Editar</button>
              <button @click="confirmDeleteUbicacion(ubicacion.id_ubicacion)" class="btn danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-ubicaciones">
      <p>No hay ubicaciones registradas.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'AreasView',
  data() {
    return {
      ubicaciones: [],  // Lista de ubicaciones
      isModalOpen: false,  // Control para abrir/cerrar el modal
      ubicacion: {
        area: '',
        numero_aula: '',
        sede: 'Sede Principal',
        descripcion: '',
      },
      editingUbicacion: null, // Para manejar la edición
      isEditing: false, // Indicador de edición
    };
  },
  methods: {
    async fetchUbicaciones() {
      try {
        const response = await fetch('http://localhost:3000/api/ubicaciones');
        const data = await response.json();
        this.ubicaciones = data;
      } catch (error) {
        console.error('Error al cargar las ubicaciones:', error);
      }
    },

    openModal() {
      this.isModalOpen = true;
      this.resetForm();
      this.isEditing = false;
    },

    closeModal() {
      this.isModalOpen = false;
    },

    async saveOrUpdateUbicacion() {
      if (this.isEditing) {
        await this.updateUbicacion();
      } else {
        await this.saveUbicacion();
      }
    },

    async saveUbicacion() {
      try {
        const response = await fetch('http://localhost:3000/api/ubicaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.ubicacion),
        });

        if (response.ok) {
          const newUbicacion = await response.json();
          this.ubicaciones.push(newUbicacion);
          this.resetForm();
          this.closeModal();
          Swal.fire('¡Éxito!', 'Ubicación guardada correctamente.', 'success');
        } else {
          throw new Error('Error al guardar la ubicación');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al guardar la ubicación.', 'error');
      }
    },

    editUbicacion(ubicacion) {
      this.ubicacion = { ...ubicacion }; // Cargar los datos al formulario
      this.editingUbicacion = ubicacion.id_ubicacion;
      this.isEditing = true;
      this.isModalOpen = true;
    },

    async updateUbicacion() {
      try {
        const response = await fetch(`http://localhost:3000/api/ubicaciones/${this.editingUbicacion}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.ubicacion),
        });

        if (response.ok) {
          const updatedUbicacion = await response.json();
          const index = this.ubicaciones.findIndex(u => u.id_ubicacion === this.editingUbicacion);
          if (index !== -1) {
            this.ubicaciones.splice(index, 1, updatedUbicacion);
          }
          this.resetForm();
          this.closeModal();
          Swal.fire('¡Éxito!', 'Ubicación actualizada correctamente.', 'success');
        } else {
          throw new Error('Error al actualizar la ubicación');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al actualizar la ubicación.', 'error');
      }
    },

    async confirmDeleteUbicacion(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        this.deleteUbicacion(id);
      }
    },

    async deleteUbicacion(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/ubicaciones/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          this.ubicaciones = this.ubicaciones.filter(ubicacion => ubicacion.id_ubicacion !== id);
          Swal.fire('¡Eliminado!', 'La ubicación ha sido eliminada.', 'success');
        } else {
          throw new Error('Error al eliminar la ubicación');
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al eliminar la ubicación.', 'error');
      }
    },

    resetForm() {
      this.ubicacion = {
        area: '',
        numero_aula: '',
        sede: 'Sede Principal',
        descripcion: '',
      };
      this.editingUbicacion = null;
      this.isEditing = false;
    },
  },
  created() {
    this.fetchUbicaciones();
  },
};
</script>

<style scoped>
.ubicacion-container {
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

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.ubicaciones-table {
  margin-top: 30px;
  overflow-x: auto;
}

.ubicaciones-table table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ubicaciones-table th,
.ubicaciones-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.ubicaciones-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.no-ubicaciones {
  text-align: center;
  margin-top: 30px;
  color: #6c757d;
}
</style>