<template>
  <nav class="navigation-bar">
    <div class="logo">
      <router-link to="/">
        <img :src="logo" alt="Int Bienes">
      </router-link>
    </div>

    <ul>
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/assets">Bienes</router-link></li>
      <li><router-link to="/areas">Áreas</router-link></li>
      <li><router-link to="/users">Usuarios</router-link></li>
      <li><router-link to="/reports">Reportes</router-link></li>
    </ul>
  </nav>
</template>

<script>
import logo from '@/components/image/logoInt.png';

export default {
  name: "YourComponentName",
  data() {
    return {
      logo, // Ruta al logo
    };
  },
};
</script>

<style scoped>
/* Barra de navegación estática */
.navigation-bar {
  background-color: rgba(255, 255, 255, 0.9); /* Fondo semitransparente */
  padding: 20px; /* Padding fijo */
  margin: 10px 20px; /* Márgenes fijos */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: static; /* Barra estática */
  z-index: 1000; /* Asegura que esté encima de otros elementos */
}

/* Logo */
.logo img {
  width: 80px;
  height: 80px;
  object-fit: cover; /* Mantén proporciones sin distorsión */
}

/* Menú */
.navigation-bar ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.navigation-bar li {
  display: inline;
}

.navigation-bar a {
  color: #252525;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.3s, transform 0.3s;
}

.navigation-bar a:hover {
  color: #E95354;
  transform: scale(1.1);
}
</style>
