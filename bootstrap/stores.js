import { defineStore } from 'pinia';
import api from '$core/services/laravel-spa-api.js';
import { raw, extend } from '$core/utils/object.js';

export const useAuthStore = defineStore('$auth$', {
    state: () => ({
        user: {
            id: '',
            name: '',
            token: '',
            isGuest: true
        }
    }),
    actions: {
        login(user) {
            for (let key in this.user) {
                if (user.hasOwnProperty(key)) {
                    this.user[key] = user[key];
                }
            }
            
        },
        async logout() {
            this.$reset();
        }
    },
    getters: {
        loggedIn: (state) => {
            return !!state.user.token && !state.user.isGuest;
        }
    },
    persist: {
        enabled: true,
        
    }
});

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            score: 0,
            bestScore: 0,
            endScore: 0,
            state: 'ready',
            players: [],
            fullscreen: false,
            sound: true,
            streak: {
                min: 1,
                max: 10,
                current: 1,
            },
            log: {
                start: '',
                end: '',
                score: '',
                secret: '',
                entries: []
            }
        };
    },
    actions: {
        updateTime(delta) {
            const { current, max, min } = this.time;
            if(this.time.current >= this.time.min) {
                this.time.current -= delta;
                if (this.time.current < this.time.min) {
                    this.time.current = this.time.min;
                }
            }
        },
        updateScore(score) {
            this.score = Math.max(this.score + score, 0);
        },
        updateBestScore() {
            
        },
        resetAll() {            
            const score = this.score;
        },
        setState(state) {
            this.state = state;
        }
    },
    getters: {
        currentTime(state) {
            return Math.round(state.time.current / 1000).toFixed(0);
        },
        getTimeProgress(state) {
            return (state.time.current / state.time.max).toFixed(2) * 100;
        },
        timeOver(state) {
            return state.time.current <= state.time.min;
        },
        gameIs(state) {
            return (status) => {
                return state.state === status;
            };
        }
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: sessionStorage, paths: ['sound', 'players'] },
            { storage: localStorage, paths: ['sound', 'players'] },
          ],
    }
});