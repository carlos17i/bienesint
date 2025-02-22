<template>
  <div class="asset-table">
    <h1>Lista de Bienes Registrados</h1>

    <div class="search-container">
      <input v-model="searchQuery" type="text" placeholder="Buscar bien..." class="search-input" />
    </div>

    <div class="table-container">
      <div v-if="isLoading" class="loading">Cargando bienes...</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Clase de Bien</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Serie</th>
            <th>Estado</th>
            <th>Valor</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in filteredAssets" :key="asset.id_bien">
            <td>{{ asset.codigo_institucional }}</td>
            <td>{{ asset.clase_de_bien }}</td>
            <td>{{ asset.modelo }}</td>
            <td>{{ asset.marca }}</td>
            <td>{{ asset.serie }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(asset.estado)]">
                {{ asset.estado }}
              </span>
            </td>
            <td class="value-cell">{{ formatCurrency(asset.valor) }}</td>
            <td>{{ formatDate(asset.fecha_registro) }}</td>
            <td class="action-buttons">
              <button @click="viewAsset(asset.id_bien)" class="btn-action btn-view" title="Ver detalles">
                👁️
              </button>
              <button @click="editAsset(asset.id_bien)" class="btn-action btn-edit" title="Editar">
                ✏️
              </button>
              <button @click="deleteAsset(asset.id_bien)" class="btn-action btn-delete" title="Eliminar">
                🗑️
              </button>
              <button @click="generateQRCode(asset.id_bien)" class="btn-action btn-qr" title="Generar QR">
                📱
              </button>
            </td>
          </tr>
          <tr v-if="filteredAssets.length === 0">
            <td colspan="9" class="no-data">No se encontraron bienes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import QRCode from 'qrcode';

export default {
  data() {
    return {
      assets: [],
      searchQuery: '',
      isLoading: true
    };
  },
  computed: {
    filteredAssets() {
      if (!Array.isArray(this.assets)) return [];

      const query = this.searchQuery.toLowerCase();
      return this.assets.filter(asset => {
        return (
          (asset.codigo_institucional?.toLowerCase() || '').includes(query) ||
          (asset.clase_de_bien?.toLowerCase() || '').includes(query) ||
          (asset.modelo?.toLowerCase() || '').includes(query) ||
          (asset.serie?.toLowerCase() || '').includes(query) ||
          (asset.marca?.toLowerCase() || '').includes(query) ||
          (asset.estado?.toLowerCase() || '').includes(query) ||
          (String(asset.valor) || '').includes(query) ||
          (asset.observaciones?.toLowerCase() || '').includes(query)
        );
      });
    }
  },
  methods: {
    getStatusClass(status) {
      const statusMap = {
        'Activo': 'status-active',
        'Inactivo': 'status-inactive',
        'En Reparación': 'status-maintenance',
        'Dado de Baja': 'status-retired'
      };
      return statusMap[status] || 'status-default';
    },

    formatDate(timestamp) {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleDateString();
    },

    formatCurrency(value) {
      if (!value) return '$0.00';
      return `$${parseFloat(value).toFixed(2)}`;
    },

    async fetchAssets() {
      try {
        const response = await fetch('http://192.168.1.5:3000/api/bienes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          this.assets = data.map(asset => ({
            ...asset,
            codigo_institucional: asset.codigo_institucional || '',
            clase_de_bien: asset.clase_de_bien || '',
            modelo: asset.modelo || '',
            serie: asset.serie || '',
            marca: asset.marca || '',
            estado: asset.estado || 'Inactivo',
            valor: asset.valor || 0,
            fecha_registro: asset.fecha_registro || null
          }));
        } else {
          Swal.fire('Error', 'La respuesta de la API no es un array', 'error');
          this.assets = [];
        }
      } catch (error) {
        Swal.fire('Error', 'Error al cargar los bienes: ' + error.message, 'error');
        this.assets = [];
      } finally {
        this.isLoading = false;
      }
    },

    async viewAsset(id) {
      try {
        const response = await fetch(`http://192.168.1.5:3000/api/bienes/${id}`);
        const data = await response.json();
        Swal.fire('Detalles del bien', JSON.stringify(data, null, 2), 'info');
      } catch (error) {
        Swal.fire('Error', 'Error al obtener detalles del bien: ' + error.message, 'error');
      }
    },

    async deleteAsset(id) {
      Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`http://localhost:3000/api/bienes/${id}`, {
              method: 'DELETE'
            });
            if (response.ok) {
              this.assets = this.assets.filter(asset => asset.id_bien !== id);
              Swal.fire('Eliminado', 'El bien ha sido eliminado con éxito', 'success');
            } else {
              throw new Error('Error al eliminar el bien');
            }
          } catch (error) {
            Swal.fire('Error', 'Error al eliminar el bien: ' + error.message, 'error');
          }
        }
      });
    },

    editAsset(id) {
      Swal.fire('Funcionalidad no implementada', `Editar bien con ID: ${id}`, 'info');
    },

    async generateQRCode(id) {
  try {
    // Llamar a la API de bienes para generar el código QR
    const response = await fetch(`http://localhost:3000/api/generateQRCode/${id}`);
    const data = await response.json();

    if (data.qrCodeDataUrl) {
      const link = document.createElement("a");
      link.href = data.qrCodeDataUrl;
      link.download = `QR_${id}.png`;
      link.click();

      Swal.fire({
        title: "QR Generado",
        text: "El QR ha sido generado y descargado con éxito",
        imageUrl: data.qrCodeDataUrl,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "QR Code",
        icon: "success",
      });
    } else {
      Swal.fire("Error", "No se pudo generar el código QR", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Error al generar el código QR: " + error.message, "error");
  }
}


  },

  async created() {
    await this.fetchAssets();
  }
};
</script>

<style scoped>
/* Aquí puedes agregar el estilo para la tabla y los botones */
.search-container {
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
}

.status-active {
  background-color: green;
  color: white;
}

.status-inactive {
  background-color: red;
  color: white;
}

.status-maintenance {
  background-color: orange;
  color: white;
}

.status-retired {
  background-color: gray;
  color: white;
}

.value-cell {
  text-align: right;
}

.action-buttons button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.action-buttons button i {
  margin-right: 5px;
}

.action-buttons button:hover {
  background-color: #0056b3;
}
</style>
