import './style.css';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory, createWebHistory  } from 'vue-router';

import env from './bootstrap/env';
import pinia from './bootstrap/pinia';
import router from './bootstrap/router';

import App from './App.vue';

console.log('dasdasda');
createApp(App)
    .use(env)
    .use(router)
    .use(pinia)
    .mount('#app');