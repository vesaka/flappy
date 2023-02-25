<template>
    <div class="flex flex-col">
        <div class="flex flex-row text-center z-10 bg-white bg-hero-texture">
            <RouterLink v-for="route in routesLinks" :to="route.path" :class="linkClass" v-html="route.title"></RouterLink>
        </div>
        <RouterView v-slot="{ Component, route }">
            <transition :name="route.meta.transitionName || 'scale-up'">
                <component :is="Component" class="flex flex-grow h-full"/>
            </transition>
        </RouterView>
    </div>
</template>
<script>
    import { BASE, PLAY, SETTINGS, TUTORIAL } from './bootstrap/paths';
    const PATHNAME = '/game/flappy';
    
    export default {
        methods: {
            link(path) {
                return `${PATHNAME}/${path}`;
            },
            goTo(path) {
                this.$router.push(`${PATHNAME}/${path}`);
            }
        },
        computed: {
            linkClass() {
                return {
                    'text-blue-700 border border-solid bg-grey-300 py-3 px-4': true
                };
            },
            routesLinks() {
                return [{
                        path: PLAY,
                        name: 'game',
                        title: 'Game'
                    }, {
                        path: TUTORIAL,
                        name: 'tutorial',
                        title: 'Tutorial'
                    }, {
                        path: SETTINGS,
                        name: 'settings',
                        title: 'Settings'
                    }];
            }
        },
    }
</script>
<style>
    @font-face {
            font-family: "LuckiestGuy";
            src: url("/assets/flappy/fonts/LuckiestGuy.ttf");
    }
    
    body {
            font-family: LuckiestGuy, sans-serif;
    }
</style>