<template>
  <div class="area-form">
    <h2>Registrar Nueva Área</h2>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nombre del Área</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="Ingrese el nombre del área"
        />
      </div>

      <div class="form-group">
        <label for="description">Descripción</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="Ingrese la descripción del área"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="parent_area_id">Área Padre</label>
        <select id="parent_area_id" v-model="formData.parent_area_id">
          <option value="">Seleccione un área padre (opcional)</option>
          <option v-for="area in areas" :key="area.area_id" :value="area.area_id">
            {{ area.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <button type="submit">Registrar Área</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        name: '',
        description: '',
        parent_area_id: null
      },
      areas: [], // Lista de áreas ya registradas para selección
      errorMessage: '' // Para manejar los errores en el formulario
    };
  },
  mounted() {
    this.fetchAreas(); // Cargar las áreas cuando el componente se monte
  },
  methods: {
    // Obtener las áreas registradas desde la API
    fetchAreas() {
      axios.get('http://localhost:3000/api/areas') // URL de la API para obtener las áreas
        .then(response => {
          this.areas = response.data; // Guardar las áreas en el estado
        })
        .catch(error => {
          console.error('Error al obtener áreas:', error);
          this.errorMessage = 'Hubo un problema al obtener las áreas. Intente más tarde.';
        });
    },

    // Enviar el formulario y registrar una nueva área
    submitForm() {
      axios.post('http://localhost:3000/api/areas', this.formData) // URL de la API para registrar un área
        .then(response => {
          console.log('Área registrada correctamente:', response.data);
          
          // Actualizar la lista de áreas después de agregar una nueva
          this.fetchAreas();
          
          // Cerrar el formulario o el modal
          this.$emit('close');
          
          // Limpiar el formulario
          this.formData = {
            name: '',
            description: '',
            parent_area_id: null
          };
        })
        .catch(error => {
          console.error('Error al registrar el área:', error);
          this.errorMessage = 'Hubo un error al registrar el área. Intente nuevamente.';
        });
    }
  }
};
</script>

<style scoped>
.area-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
