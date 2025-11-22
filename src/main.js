// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Импортируем настроенный роутер

const app = createApp(App);

// Подключаем роутер к приложению
app.use(router);

app.mount('#app');