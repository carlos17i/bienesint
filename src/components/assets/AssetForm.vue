<template>
  <div class="modern-form">
    <header class="form-header">
      <h1>Registro de Bien</h1>
      <p class="subtitle">Sistema de Gestión de Bienes Institucionales</p>
    </header>

    <form @submit.prevent="saveAsset" class="form-container">
      <div class="form-grid">
        <!-- Fila 1 -->
        <div class="input-group">
          <label for="clase_de_bien">Nombre del Bien</label>
          <input type="text" id="clase_de_bien" v-model="asset.clase_de_bien" required
            placeholder="Ej: Equipo de Computación" />
        </div>

        <div class="input-group">
          <label for="codigo_institucional">Código Institucional</label>
          <input type="text" id="codigo_institucional" v-model="asset.codigo_institucional" required
            placeholder="Ej: INST-2024-001" />
        </div>

        <div class="input-group">
          <label for="codigo_senescyt">Código SENESCYT</label>
          <input type="text" id="codigo_senescyt" v-model="asset.codigo_senescyt" placeholder="Ej: SEN-2024-001" />
        </div>

        <div class="input-group">
          <label for="codigo_anterior">Código Anterior</label>
          <input type="text" id="codigo_anterior" v-model="asset.codigo_anterior" placeholder="Ej: ANT-2023-001" />
        </div>

        <div class="input-group">
          <label for="estado">Estado</label>
          <select id="estado" v-model="asset.estado" required>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En Reparación">En Reparación</option>
            <option value="Dado de Baja">Dado de Baja</option>
          </select>
        </div>

        <!-- Fila 2 -->
        <div class="input-group">
          <label for="modelo">Modelo</label>
          <input type="text" id="modelo" v-model="asset.modelo" placeholder="Ej: ThinkPad X1" />
        </div>

        <div class="input-group">
          <label for="serie">Serie</label>
          <input type="text" id="serie" v-model="asset.serie" placeholder="Ej: XYZ123456" />
        </div>

        <div class="input-group">
          <label for="marca">Marca</label>
          <input type="text" id="marca" v-model="asset.marca" placeholder="Ej: Lenovo" />
        </div>

        <div class="input-group">
          <label for="valor">Valor ($)</label>
          <input type="number" id="valor" v-model="asset.valor" step="0.01" required placeholder="0.00" />
        </div>

        <div class="input-group">
          <label for="categorias">Categoría</label>
          <select id="categorias" v-model="asset.categoria_id" required>
            <option value="">Seleccione una categoría</option>
            <option v-for="categoria in categoriasData" :key="categoria.id_categoria" :value="categoria.id_categoria">
              {{ categoria.nombre_categoria || categoria.nombre }}
            </option>
          </select>
        </div>

        <!-- Fila 3 -->
        <div class="input-group">
          <label for="ubicacion-area">Área</label>
          <select id="ubicacion-area" v-model="asset.ubicacion.area_id" required>
            <option value="">Seleccione un área</option>
            <option v-for="area in areasData" :key="area.id_ubicacion" :value="area.id_ubicacion">
              {{ area.area || area.nombre_ubicacion }}
            </option>
          </select>
        </div>


        <div class="input-group">
          <label for="numero_aula">Número de Aula</label>
          <input type="text" id="numero_aula" v-model="asset.ubicacion.numero_aula" placeholder="Ej: A-101" />
        </div>

        <div class="input-group">
          <label for="nro_acta_entrega">Nro. Acta Entrega</label>
          <input type="text" id="nro_acta_entrega" v-model="asset.nro_acta_entrega_recepcion"
            placeholder="Ej: ACT-001-2024" />
        </div>

        <div class="input-group">
          <label for="nro_acta_constatacion">Nro. Acta Constatación</label>
          <input type="text" id="nro_acta_constatacion" v-model="asset.nro_acta_constatacion_fisica"
            placeholder="Ej: CONS-001-2024" />
        </div>

        <!-- Fila 4 -->
        <div class="input-group">
          <label for="periodo_academico_id">Período Académico</label>
          <select id="periodo_academico_id" v-model="asset.periodo_academico_id" required>
            <option value="">Seleccione un período</option>
            <option v-for="periodo in periodosData" :key="periodo.id_periodo" :value="periodo.id_periodo">
              {{ periodo.nombre_periodo || periodo.nombre }}
            </option>
          </select>
        </div>
        <div class="usuarios-section bg-gray-50 rounded-lg p-4 mb-6">
          <label class="block text-gray-700 font-medium mb-2">Usuarios Asignados</label>

          <!-- Barra de búsqueda mejorada -->
          <div class="search-container relative mb-4">
            <input type="text" v-model="usuarioSearch" @input="searchUsuarios"
              placeholder="Buscar usuario por nombre o cédula..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <div v-if="isLoading" class="absolute right-3 top-2.5">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          </div>

          <!-- Resultados de búsqueda -->
          <div v-if="usuarioSearch && filteredUsuarios.length > 0"
            class="search-results max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm mb-4">
            <div v-for="usuario in filteredUsuarios" :key="usuario.id_usuario"
              class="user-item p-3 hover:bg-gray-50 border-b border-gray-100 flex justify-between items-center cursor-pointer"
              @click="addUsuario(usuario)">
              <div>
                <span class="font-medium text-gray-800">
                  {{ usuario.nombres }} {{ usuario.apellidos }}
                </span>
                <span class="text-sm text-gray-500 ml-2">({{ usuario.cedula }})</span>
              </div>
              <button type="button" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Agregar
              </button>
            </div>
          </div>

          <!-- Usuarios seleccionados -->
          <div class="selected-users">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Usuarios seleccionados:</h3>
            <div class="space-y-2">
              <div v-for="usuario in selectedUsuarios" :key="usuario.id_usuario"
                class="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                <span class="text-blue-800">
                  {{ usuario.nombres }} {{ usuario.apellidos }}
                </span>
                <button type="button" @click="removeUsuario(usuario)"
                  class="text-red-500 hover:text-red-700 focus:outline-none">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Fila 5 -->
        <div class="input-group span-5">
          <label for="observaciones">Notas</label>
          <textarea id="observaciones" v-model="asset.observaciones" rows="2"
            placeholder="Ingrese cualquier observación relevante..."></textarea>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> Guardar Bien
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asset: {
        clase_de_bien: '',
        codigo_institucional: '',
        codigo_senescyt: '',
        codigo_anterior: '',
        modelo: '',
        serie: '',
        marca: '',
        estado: 'Activo',
        valor: null,
        categoria_id: '',
        ubicacion: {
          sede: 'Sede Principal',
          area_id: '',
          numero_aula: ''
        },
        nro_acta_entrega_recepcion: '',
        nro_acta_constatacion_fisica: '',
        observaciones: '',
        periodo_academico_id: '',
      },
      categoriasData: [],
      areasData: [],
      periodosData: [],
      usuarios: [],
      selectedUsuarios: [],
      usuarioSearch: '',
    };
  },
  computed: {
    filteredUsuarios() {
      const search = this.usuarioSearch.toLowerCase();
      return this.usuarios.filter(usuario =>
        usuario.nombres.toLowerCase().includes(search) ||
        usuario.apellidos.toLowerCase().includes(search) ||
        usuario.cedula.includes(search)
      );
    }
  },
  methods: {
    async fetchInitialData() {
      try {
        // Fetch categorías
        const categoriasResponse = await fetch('http://localhost:3000/api/categorias');
        if (!categoriasResponse.ok) throw new Error('Error al obtener categorías');
        const categoriasData = await categoriasResponse.json();
        this.categoriasData = Array.isArray(categoriasData) ? categoriasData : [];
        console.log('Categorías cargadas:', this.categoriasData);

        // Fetch áreas
        const areasResponse = await fetch('http://localhost:3000/api/ubicaciones');
        if (!areasResponse.ok) throw new Error('Error al obtener áreas');
        const areasData = await areasResponse.json();
        this.areasData = Array.isArray(areasData) ? areasData : [];
        console.log('Áreas cargadas:', this.areasData);

        // Fetch períodos académicos
        const periodosResponse = await fetch('http://localhost:3000/api/periodos_academicos');
        if (!periodosResponse.ok) throw new Error('Error al obtener períodos');
        const periodosData = await periodosResponse.json();
        this.periodosData = Array.isArray(periodosData) ? periodosData : [];
        console.log('Períodos cargados:', this.periodosData);

        // Fetch usuarios
        const usuariosResponse = await fetch('http://localhost:3000/api/usuarios');
        if (!usuariosResponse.ok) throw new Error('Error al obtener usuarios');
        const usuariosData = await usuariosResponse.json();
        this.usuarios = Array.isArray(usuariosData) ? usuariosData : [];

      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        alert('Error al cargar los datos del formulario: ' + error.message);
      }
    },
    addUsuario(usuario) {
      if (!this.selectedUsuarios.find(u => u.id_usuario === usuario.id_usuario)) {
        this.selectedUsuarios.push(usuario);
      }
      this.usuarioSearch = '';
    },
    removeUsuario(usuario) {
      this.selectedUsuarios = this.selectedUsuarios.filter(
        u => u.id_usuario !== usuario.id_usuario
      );
    },
    async saveAsset() {
      try {
        const assetData = {
          ...this.asset,
          usuarios: this.selectedUsuarios.map(u => u.id_usuario)
        };

        const response = await fetch('http://localhost:3000/api/bienes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assetData)
        });

        if (response.ok) {
          alert('Bien registrado exitosamente');
          this.resetForm();
        } else {
          const responseData = await response.json();
          throw new Error(responseData.message || 'Error al guardar el bien');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar el bien');
      }
    },
    resetForm() {
      this.asset = {
        clase_de_bien: '',
        codigo_institucional: '',
        codigo_senescyt: '',
        codigo_anterior: '',
        modelo: '',
        serie: '',
        marca: '',
        estado: 'Activo',
        valor: null,
        categoria_id: '',
        ubicacion: {
          sede: 'Sede Principal',
          area_id: '',
          numero_aula: ''
        },
        nro_acta_entrega_recepcion: '',
        nro_acta_constatacion_fisica: '',
        observaciones: '',
        periodo_academico_id: '',
      };
      this.selectedUsuarios = [];
      this.usuarioSearch = '';
    }
  },
  created() {
    this.fetchInitialData();
  }
};
</script>


<style scoped>
.modern-form {
  max-width: 1200px;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 15px;
}

.form-header {
  text-align: center;
  margin-bottom: 1rem;
}

.form-header h1 {
  color: #1a237e;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
}

.form-container {
  padding: 1.5rem;
  border-radius: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.span-2 {
  grid-column: span 2;
}

.span-3 {
  grid-column: span 3;
}

.span-5 {
  grid-column: span 5;
}

label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85rem;
}

input,
select,
textarea {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background: white;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  outline: none;
}

select[multiple] {
  height: 80px;
}

.search-users {
  position: relative;
}

.users-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
}

.user-option {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.user-option:hover {
  background-color: #f3f4f6;
}

.selected-users {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.3rem;
}

.user-tag {
  color: #4f46e5;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.remove-user {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .span-5 {
    grid-column: span 3;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .span-2,
  .span-3,
  .span-5 {
    grid-column: span 2;
  }

  .modern-form {
    margin: 0.5rem;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .span-2,
  .span-3,
  .span-5 {
    grid-column: span 1;
  }
}

.search-results {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: #f7fafc;
}

.search-results::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.user-item:last-child {
  border-bottom: none;
}

.selected-users {
  transition: all 0.3s ease;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-results {
  animation: fadeIn 0.2s ease-out;
}
</style>