<template>
  <div class="assets-view">
    <div class="assets-content">
      <h2 class="title">Gestión de Bienes</h2>
      <section class="button-container">
        <button @click="openModal" class="button primary">Registrar Nuevo Bien</button>
        <button @click="openCategoriesModal" class="button secondary">Categorías</button>
        <!-- Nuevo Botón para Periodos Académicos -->
        <button @click="openPeriodsModal" class="button tertiary">Periodos Académicos</button>
      </section>

      <!-- Modal de Bienes -->
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content">
          <button @click="closeModal" class="btn-close">&times;</button>
          <AssetForm @close="closeModal" />
        </div>
      </div>

      <!-- Modal para la vista de Categorías -->
      <div v-if="isCategoriesModalOpen" class="modal-overlay">
        <div class="modal-content">
          <button @click="closeCategoriesModal" class="btn-close">&times;</button>
          <CategoriaAsset @close="closeCategoriesModal" />
        </div>
      </div>

      <!-- Modal para la vista de Periodos Académicos -->
      <div v-if="isPeriodsModalOpen" class="modal-overlay">
        <div class="modal-content">
          <button @click="closePeriodsModal" class="btn-close">&times;</button>
          <!-- Importa y usa el componente Periodos -->
          <PeriodosAcademicos @close="closePeriodsModal" />
        </div>
      </div>

      <!-- Lista de Bienes -->
      <AssetList />
    </div>
  </div>
</template>

<script>
// Importación de los componentes
import AssetList from '../components/assets/AssetList.vue';
import AssetForm from '../components/assets/AssetForm.vue';
import CategoriaAsset from '../components/categoria/CategoriaAsset.vue';
import PeriodosAcademicos from '../components/periodos/PeriodosAcademicos.vue';
export default {
  name: 'AssetsView',
  components: { 
    AssetList, 
    AssetForm, 
    CategoriaAsset,
    PeriodosAcademicos // Registrar el componente Periodos
  },
  data() {
    return {
      isCategoriesModalOpen: false,
      isModalOpen: false,
      isPeriodsModalOpen: false, // Nueva propiedad para manejar el modal de periodos académicos
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    openCategoriesModal() {
      this.isCategoriesModalOpen = true;
    },
    closeCategoriesModal() {
      this.isCategoriesModalOpen = false;
    },
    // Métodos para manejar el modal de periodos académicos
    openPeriodsModal() {
      this.isPeriodsModalOpen = true;
    },
    closePeriodsModal() {
      this.isPeriodsModalOpen = false;
    },
  },
};
</script>

<style scoped>
/* General Layout */
.assets-view {
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

.title {
  font-size: 2.5rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

/* Button Styles */
.button-container {
  display: flex;
  justify-content: flex-start; /* Alinea los botones a la izquierda */
  gap: 10px;
}

.button {
  padding: 15px 30px; /* Botones más gorditos */
  font-size: 1.2rem;  /* Fuente más grande */
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold; /* Fuente más fuerte */
}

.primary {
  background-color: #007BFF;
  color: white;
}

.secondary {
  background-color: #28a745;
  color: white;
}

.tertiary {
  background-color: #f39c12; /* Nuevo color para el botón de Periodos Académicos */
  color: white;
}

.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Sombra más fuerte */
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 15px;
  width: 100%; /* Cambiado a 100% */
  height: 100%; /* Cambiado a 100% */
  max-width: none; /* Eliminado el max-width */
  max-height: none; /* Eliminado el max-height */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
}

.btn-close:hover {
  color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .button-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .modal-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .modal-content {
    padding: 15px;
  }
}
</style>
