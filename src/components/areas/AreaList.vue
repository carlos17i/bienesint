<template>
  <div class="area-list">
    <h2>Lista de Áreas</h2>
    <input v-model="searchQuery" type="text" placeholder="Buscar área..." class="search-bar" />
    <table class="responsive-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Área Padre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="area in filteredAreas" :key="area.area_id">
          <td>{{ area.name }}</td>
          <td>{{ area.description }}</td>
          <td>{{ area.parent_area_id ? area.parent_area_name : 'Ninguna' }}</td>
          <td class="action-buttons">
            <button @click="editArea(area)" class="btn-icon"><i class='bx bx-edit'></i></button>
            <button @click="confirmDelete(area)" class="btn-icon danger"><i class='bx bx-trash'></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de edición -->
    <div v-if="isEditModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <button @click="closeEditModal" class="btn-close-modal">X</button>
        <h3>Editar Área</h3>
        <form @submit.prevent="submitEditForm">
          <div class="form-group">
            <label for="edit-name">Nombre del Área</label>
            <input type="text" id="edit-name" v-model="editForm.name" required />
          </div>
          <div class="form-group">
            <label for="edit-description">Descripción</label>
            <textarea id="edit-description" v-model="editForm.description"></textarea>
          </div>
          <div class="form-group">
            <label for="edit-parent-area">Área Padre</label>
            <select id="edit-parent-area" v-model="editForm.parent_area_id">
              <option value="">Seleccione un área padre (opcional)</option>
              <option v-for="area in areas" :key="area.area_id" :value="area.area_id">
                {{ area.name }}
              </option>
            </select>
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <button @click="closeDeleteModal" class="btn-close-modal">X</button>
        <h3>¿Estás seguro de que deseas eliminar esta área?</h3>
        <p><strong>{{ deleteArea?.name }}</strong></p>
        <button @click="deleteAreaFromDatabase">Sí, Eliminar</button>
        <button @click="closeDeleteModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AreaList',
  data() {
    return {
      areas: [], // Lista de áreas
      searchQuery: "", // Filtro de búsqueda
      isEditModalOpen: false, // Modal de edición
      isDeleteModalOpen: false, // Modal de eliminación
      editForm: {
        name: '',
        description: '',
        parent_area_id: null
      },
      deleteArea: null // Almacena el área a eliminar
    };
  },
  computed: {
    filteredAreas() {
      return this.areas.filter(area => {
        const query = this.searchQuery.toLowerCase();
        return (
          area.name.toLowerCase().includes(query) ||
          area.description.toLowerCase().includes(query)
        );
      });
    }
  },
  mounted() {
    this.fetchAreas(); // Cargar áreas al iniciar
  },
  methods: {
    fetchAreas() {
      axios.get('http://localhost:3000/api/areas')
        .then(response => {
          this.areas = response.data;
        })
        .catch(error => {
          console.error('Error al obtener las áreas:', error);
        });
    },

    editArea(area) {
      this.editForm = { ...area }; // Llenar el formulario con los datos del área a editar
      this.isEditModalOpen = true; // Abrir modal de edición
    },

    submitEditForm() {
      axios.put(`http://localhost:3000/api/areas/${this.editForm.area_id}`, this.editForm)
        .then(response => {
          this.fetchAreas(); // Actualizar las áreas después de editar
          this.closeEditModal();
        })
        .catch(error => {
          console.error('Error al editar el área:', error);
        });
    },

    confirmDelete(area) {
      this.deleteArea = area; // Guardar el área a eliminar
      this.isDeleteModalOpen = true; // Abrir el modal de eliminación
    },

    closeEditModal() {
      this.isEditModalOpen = false; // Cerrar el modal de edición
      this.editForm = {
        name: '',
        description: '',
        parent_area_id: null
      };
    },

    closeDeleteModal() {
      this.isDeleteModalOpen = false; // Cerrar el modal de eliminación
      this.deleteArea = null;
    },

    deleteAreaFromDatabase() {
      axios.delete(`http://localhost:3000/api/areas/${this.deleteArea.area_id}`)
        .then(response => {
          this.fetchAreas(); // Actualizar las áreas después de eliminar
          this.closeDeleteModal();
        })
        .catch(error => {
          console.error('Error al eliminar el área:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Estilos para la tabla */
.area-list {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1em;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4em;
  padding: 5px;
  border-radius: 8px;
}

.btn-icon.danger {
  color: #e74c3c;
}

.btn-close-modal {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.btn-close-modal:hover {
  background-color: #d32f2f;
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
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
