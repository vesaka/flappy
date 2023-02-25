import settings from '$flappy/config/settings.json';
window.env = settings;
console.log(settings);
export default {
    install(app) {
        app.config.globalProperties.$env = settings;
        
    }
};

