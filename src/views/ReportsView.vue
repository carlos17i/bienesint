<template>
  <div class="report-container">
    <!-- Card para Generar Reporte -->
    <div class="card" @click="openModal">
      <i class="fas fa-chart-bar card-icon"></i>
      <h2>Generar Reporte</h2>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Seleccione el Tipo de Reporte</h2>

        <!-- Selector de Tipo de Reporte -->
        <div class="form-group">
          <label>Tipos de Reporte:</label>
          <div class="checkbox-group">
            <div>
              <input 
                type="checkbox" 
                id="general" 
                @change="toggleAll" 
                :checked="allSelected" 
              />
              <label for="general"><strong>General (Seleccionar Todos)</strong></label>
            </div>
            <div v-for="option in reportOptions" :key="option.value">
              <input 
                type="checkbox" 
                :id="option.value" 
                :value="option.value" 
                v-model="selectedReports" 
              />
              <label :for="option.value">{{ option.label }}</label>
            </div>
          </div>
        </div>

        <!-- Selector de Fechas -->
        <div class="form-group">
          <label for="start-date">Fecha de Inicio:</label>
          <input type="date" id="start-date" v-model="startDate" required />
        </div>
        <div class="form-group">
          <label for="end-date">Fecha de Fin:</label>
          <input type="date" id="end-date" v-model="endDate" required />
        </div>

        <!-- Botones de Acción -->
        <div class="modal-actions">
          <button @click="generateReport" class="btn">Generar</button>
          <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      selectedReports: [],
      allSelected: false,
      startDate: "",
      endDate: "",
      reportOptions: [
        { value: "Areas", label: "Areas" },
        { value: "inventario", label: "Reporte de Inventario" },
        { value: "usuarios", label: "Reporte de Usuarios" },
      ],
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedReports = [];
      this.allSelected = false;
      this.startDate = "";
      this.endDate = "";
    },
    toggleAll() {
      if (this.allSelected) {
        this.selectedReports = [];
      } else {
        this.selectedReports = this.reportOptions.map((option) => option.value);
      }
      this.allSelected = !this.allSelected;
    },
    generateReport() {
      if (!this.selectedReports.length || !this.startDate || !this.endDate) {
        alert("Por favor complete todos los campos.");
        return;
      }
      alert(
        `Generando los siguientes reportes: ${this.selectedReports.join(
          ", "
        )} desde ${this.startDate} hasta ${this.endDate}`
      );
      this.closeModal();
    },
  },
  watch: {
    selectedReports(newValue) {
      this.allSelected = newValue.length === this.reportOptions.length;
    },
  },
};
</script>

<style scoped>
/* Estilo para el contenedor de los cards */
.report-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

/* Estilo del card */
.card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 300px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 4rem;
  color: #007bff;
  margin-bottom: 10px;
}

.card h2 {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
}

/* Estilo del modal */
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
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

.modal h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 1em;
}

.checkbox-group div {
  margin-bottom: 0.5em;
}

label {
  font-size: 14px;
}

input[type="checkbox"] {
  margin-right: 0.5em;
}

input[type="date"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn {
  background-color: #007bff;
  color: white;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
