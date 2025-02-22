<template>
    <div class="asset-details">
      <h2>Detalles del Bien</h2>
      <div v-if="asset">
        <p><strong>Nombre:</strong> {{ asset.name }}</p>
        <p><strong>Custodio:</strong> {{ asset.custodian }}</p>
        <p><strong>Ubicación:</strong> {{ asset.location }}</p>
        <p><strong>Descripción:</strong> {{ asset.description }}</p>
        <p><strong>Tipo:</strong> {{ asset.type }}</p>
        <p><strong>Modelo:</strong> {{ asset.model }}</p>
        <p><strong>Estado:</strong> {{ asset.status }}</p>
        <img :src="asset.photoUrl" alt="Foto del Bien" v-if="asset.photoUrl" />
        <p><strong>Código QR:</strong></p>
        <img :src="generateQRCodeImage(asset.qrCode)" alt="Código QR" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AssetDetails",
    data() {
      return {
        asset: {
          name: "Laptop Lenovo",
          custodian: "Juan Pérez",
          location: "Sala de Administración",
          description: "Laptop en buen estado",
          type: "Electrónica",
          model: "Lenovo ThinkPad X1",
          status: "Activo",
          qrCode: "Laptop-1620732821",
          photoUrl: "https://via.placeholder.com/150",
        },
      };
    },
    methods: {
      generateQRCodeImage(qrCode) {
        return `https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para los detalles del bien */
  .asset-details {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d1d1d1, #a6a6a6);
  border-radius: 8px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #007bff, #0056b3);
}
  img {
    max-width: 150px;
    margin-top: 10px;
  }
  </style>
  