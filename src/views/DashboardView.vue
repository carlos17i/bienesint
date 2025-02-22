<template>
  <div class="dashboard-content">
    <h2 class="dashboard-title">Bienvenido al Dashboard</h2>
    <p class="intro-text">Este sistema permite gestionar y visualizar los bienes de manera eficiente, facilitando la
      gestión de inventarios, ubicaciones, y responsables. ¡Sigue leyendo para más detalles!</p>

    <!-- Sección de Promoción para Descargar la App -->
    <section class="section app-promotion">
      <h3 class="promotion-title">Descarga nuestra App</h3>
      <p class="promotion-text">Gestiona tus bienes desde cualquier lugar con nuestra aplicación móvil. Disponible en
        Android y iOS.</p>
      <div class="promotion-icons">
        <i class="bx bxl-android app-icon" aria-label="Android Icon"></i>
        <i class="bx bxl-apple app-icon" aria-label="iOS Icon"></i>
      </div>
      <div class="promotion-buttons">
        <a class="download-button android-button" href="https://drive.google.com/uc?export=download&id=18xeiXHcdR1MMZUuBJRMyixaHOT9cHEBx" download>
        Descargar para Android
    </a>
        <button class="download-button ios-button">Descargar para iOS</button>
      </div>
    </section>

    <!-- Sección de Requerimientos Funcionales -->
    <section class="section">
      <ul class="functional-requirements">
        <li>Gestión de bienes con información detallada: nombre, custodio, ubicación, etc.</li>
        <li>Generación de códigos únicos para los bienes, preferiblemente QR.</li>
        <li>Subida de fotos asociadas a cada bien.</li>
        <li>Registro de ubicaciones y responsables, con posibilidad de generar reportes segmentados.</li>
        <li>Generación de reportes en Excel y PDF.</li>
        <li>Interacción móvil y web con escaneo de códigos QR.</li>
      </ul>
    </section>

    <!-- Requerimientos No Funcionales -->
    <section class="section">
      <ul class="functional-requirements">
        <li>Accesibilidad: Plataforma web y app móvil.</li>
        <li>Usabilidad: Interfaz intuitiva.</li>
        <li>Rendimiento: Manejo de grandes volúmenes de datos.</li>
        <li>Seguridad: Control de acceso por roles.</li>
        <li>Compatibilidad: Generación de reportes en Excel/PDF.</li>
      </ul>
    </section>

    <!-- Resumen de funcionalidades críticas -->
    <section class="section summary">
      <ul class="summary-list">
        <li>Inventarios detallados y clasificación por ubicaciones.</li>
        <li>Generación y escaneo de códigos QR.</li>
        <li>Reportes automatizados por áreas y responsables.</li>
        <li>Interacción sin conexión en la app móvil.</li>
      </ul>
    </section>
  </div>
</template>

<script>
import NavigationBar from '../components/shared/NavigationBar.vue';
import AssetList from '../components/assets/AssetList.vue';
export default {
  name: 'DashboardView',
  components: {},
};
</script>

<style scoped>
/* Estilos generales */
.dashboard-content {
  margin: 40px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  animation: fadeIn 1s ease-in-out;
}

/* Título del Dashboard */
.dashboard-title {
  font-size: 2.5rem;
  color: #E95354;
  text-align: center;
  margin-bottom: 20px;
  animation: slideIn 1s ease-out;
}

/* Introducción */
.intro-text {
  font-size: 1.2rem;
  color: #252525;
  text-align: center;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeIn 2s forwards;
  animation-delay: 1s;
}

/* Sección de Promoción para la App */
.app-promotion {
  text-align: center;
  background: linear-gradient(135deg, #E95354, #F5A623);
  color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1.5s ease-in-out;
}

.promotion-title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.promotion-text {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.promotion-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.app-icon {
  font-size: 3rem;
  color: #fff;
}

.promotion-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.download-button {
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.android-button {
  background-color: #3DDC84;
  color: #fff;
}

.android-button:hover {
  background-color: #35C577;
}

.ios-button {
  background-color: #007AFF;
  color: #fff;
}

.ios-button:hover {
  background-color: #0066CC;
}

/* Estilos de las secciones */
.section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  animation: zoomIn 1s ease-out;
}

/* Listas */
.functional-requirements,
.summary-list {
  list-style: none;
  padding: 0;
}

.functional-requirements li,
.summary-list li {
  font-size: 1.1rem;
  color: #252525;
  margin-bottom: 10px;
  transition: transform 0.3s, color 0.3s;
}

.functional-requirements li:hover,
.summary-list li:hover {
  transform: translateX(10px);
  color: #E95354;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
