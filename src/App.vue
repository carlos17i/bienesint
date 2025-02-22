<template>
  <div id="app" class="container">
    <NavigationBar :logo="logo" />
    <router-view />
  </div>
</template>

<script>
import NavigationBar from './components/shared/NavigationBar.vue';
import logo from '@/assets/image.png'; // Importa la imagen del logo
// main.js o App.vue
import 'bootstrap/dist/css/bootstrap.min.css';
export default {
  name: "App",
  components: {
    NavigationBar,
  },
  data() {
    return {
      logo, // Define el logo para usarlo como propiedad
    };
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  
  /* Hacer que el contenedor ocupe todo el ancho */
  width: 100%;
  box-sizing: border-box;

  /* Hacer que el contenedor ocupe al menos el alto de la pantalla */
  min-height: 100vh;
}

/* Puedes agregar más estilos aquí, como para los botones, etc. */
</style>
