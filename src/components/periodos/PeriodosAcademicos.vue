<template>
  <div class="periodos-academicos">
    <h1>Gestión de Periodos Académicos</h1>

    <!-- Botón para abrir el modal de agregar -->
    <button @click="openModal()" class="btn-primary">Agregar Periodo</button>

    <!-- Modal para agregar y editar -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ periodo.id_periodo ? 'Editar' : 'Agregar' }} Periodo</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre_periodo">Nombre del Periodo</label>
            <input type="text" id="nombre_periodo" v-model="periodo.nombre_periodo" placeholder="Nombre del periodo"
              required />
          </div>

          <div class="form-group">
            <label for="fecha_inicio">Fecha de Inicio</label>
            <input type="date" id="fecha_inicio" v-model="periodo.fecha_inicio" required />
          </div>

          <div class="form-group">
            <label for="fecha_fin">Fecha de Fin</label>
            <input type="date" id="fecha_fin" v-model="periodo.fecha_fin" required />
          </div>

          <div class="form-group">
            <label for="activo">Activo</label>
            <input type="checkbox" id="activo" v-model="periodo.activo" />
          </div>

          <div class="form-buttons">
            <button type="submit" class="btn-primary">Guardar</button>
            <button @click="closeModal" type="button" class="btn-close"></button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de periodos -->
    <div class="periodos-list">
      <h3>Periodos Registrados</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="periodo in periodos" :key="periodo.id_periodo">
            <td>{{ periodo.nombre_periodo }}</td>
            <td>{{ periodo.fecha_inicio }}</td>
            <td>{{ periodo.fecha_fin }}</td>
            <td>{{ periodo.activo ? 'Sí' : 'No' }}</td>
            <td>
              <button @click="editPeriodo(periodo)" class="btn-secondary">Editar</button>
              <button @click="deletePeriodo(periodo.id_periodo)" class="btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'PeriodosAcademicosView',
  data() {
    return {
      periodo: {
        id_periodo: null,
        nombre_periodo: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: false,
      },
      periodos: [],
      isModalOpen: false, // Controla si el modal está abierto o cerrado
    };
  },
  created() {
    this.fetchPeriodos();
  },
  methods: {
    async fetchPeriodos() {
      try {
        const response = await axios.get('http://localhost:3000/api/periodos_academicos');
        this.periodos = response.data;
      } catch (error) {
        console.error('Error al cargar los periodos:', error);
      }
    },
    async submitForm() {
      try {
        if (this.periodo.id_periodo) {
          // Editar el periodo existente
          await axios.put(`http://localhost:3000/api/periodos_academicos/${this.periodo.id_periodo}`, this.periodo);
          Swal.fire({
            title: 'Éxito!',
            text: 'El periodo académico ha sido actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        } else {
          // Crear un nuevo periodo
          const response = await axios.post('http://localhost:3000/api/periodos_academicos', this.periodo);
          this.periodos.push(response.data);
          Swal.fire({
            title: 'Éxito!',
            text: 'El nuevo periodo académico ha sido creado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
        this.closeModal(); // Cerrar el modal después de guardar
      } catch (error) {
        console.error('Error al guardar el periodo:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar el periodo académico.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    },
    resetForm() {
      this.periodo = {
        id_periodo: null,
        nombre_periodo: '',
        fecha_inicio: '',
        fecha_fin: '',
        activo: false,
      };
    },
    openModal() {
      this.isModalOpen = true;
      this.resetForm(); // Reiniciar el formulario cuando se abre el modal
    },
    closeModal() {
      this.isModalOpen = false;
    },
    editPeriodo(periodo) {
      // Copiar los valores del periodo seleccionado en el formulario
      this.periodo = { ...periodo };
      
      // Asegurarse de que las fechas están correctamente formateadas en el input
      this.periodo.fecha_inicio = this.formatDate(periodo.fecha_inicio);
      this.periodo.fecha_fin = this.formatDate(periodo.fecha_fin);

      this.isModalOpen = true; // Asegurarse de que el modal se abra
    },
    formatDate(date) {
      // Formato de fecha que Vue espera: 'yyyy-MM-dd'
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    async deletePeriodo(id_periodo) {
      try {
        await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Este periodo académico será eliminado permanentemente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.delete(`http://localhost:3000/api/periodos_academicos/${id_periodo}`);
            this.periodos = this.periodos.filter(periodo => periodo.id_periodo !== id_periodo);
            Swal.fire({
              title: 'Éxito!',
              text: 'El periodo académico ha sido eliminado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      } catch (error) {
        console.error('Error al eliminar el periodo:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el periodo académico.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    },
  },
};
</script>



<style scoped>
/* Estilos generales */
.periodos-academicos {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

button.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

button.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}

button:hover {
  opacity: 0.8;
}

button:focus {
  outline: none;
}

.periodos-list {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

table th {
  background-color: #f4f4f4;
}

table tr:hover {
  background-color: #f1f1f1;
}

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 1rem;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-content .btn-close {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

.modal-content .btn-close:hover {
  background-color: #e55347;
}

@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
  }
}
</style>
