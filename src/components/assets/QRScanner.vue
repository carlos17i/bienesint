<template>
    <div class="qr-scanner">
      <h2>Escanear Código QR</h2>
      <qrcode-stream @decode="onDecode" @error="onError" />
      <div v-if="scannedData">
        <h3>Información del Bien</h3>
        <p><strong>Código QR:</strong> {{ scannedData }}</p>
        <p><strong>Bien Encontrado:</strong> {{ asset.name }}</p>
        <p><strong>Ubicación:</strong> {{ asset.location }}</p>
        <p><strong>Descripción:</strong> {{ asset.description }}</p>
        <p><strong>Modelo:</strong> {{ asset.model }}</p>
        <p><strong>Estado:</strong> {{ asset.status }}</p>
        <img :src="asset.photoUrl" alt="Foto del Bien" v-if="asset.photoUrl" />
      </div>
    </div>
  </template>
  
  <script>
  import { QrcodeStream } from "vue-qrcode-reader";
  
  export default {
    name: "QRScanner",
    components: {
      QrcodeStream,
    },
    data() {
      return {
        scannedData: null, // Para almacenar el código QR escaneado
        asset: null, // Datos del bien
      };
    },
    methods: {
      onDecode(decodedData) {
        this.scannedData = decodedData; // Se guarda el código QR escaneado
        // Simulación de búsqueda del bien por QR
        this.findAsset(decodedData);
      },
      onError(error) {
        console.error(error); // Muestra los errores si ocurren durante el escaneo
      },
      findAsset(qrCode) {
        // Aquí deberías implementar la lógica para buscar el bien usando el código QR
        // Simulación de un bien encontrado basado en el QR
        const assetsDatabase = [
          {
            qrCode: "Laptop-1620732821",
            name: "Laptop Lenovo",
            location: "Sala de Administración",
            description: "Laptop en buen estado",
            model: "Lenovo ThinkPad X1",
            status: "Activo",
            photoUrl: "https://via.placeholder.com/150",
          },
          // Agrega más bienes si es necesario
        ];
  
        this.asset = assetsDatabase.find((asset) => asset.qrCode === qrCode);
      },
    },
  };
  </script>
  
  <style scoped>
  .qr-scanner {
    padding: 20px;
    text-align: center;
  }
  
  .qrcode-reader {
    width: 100%;
    height: 300px;
  }
  
  img {
    max-width: 150px;
    margin-top: 10px;
  }
  </style>
  