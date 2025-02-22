import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '../views/DashboardView.vue';
import AssetsView from '../views/AssetsView.vue';
import AreasView from '../views/AreasView.vue';
import UsersView from '../views/UsersView.vue';
import ReportsView from '../views/ReportsView.vue';
import PeriodosAcademicosView from '../views/PeriodosAcademicosView.vue'; // Importa el nuevo componente

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/assets',
    name: 'Assets',
    component: AssetsView,
  },
  {
    path: '/areas',
    name: 'Areas',
    component: AreasView,
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
  },
  {
    path: '/periodos-academicos', // Nueva ruta para Periodos Académicos
    name: 'PeriodosAcadémicos',
    component: PeriodosAcademicosView, // Componente que has creado para los periodos académicos
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
