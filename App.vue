<template>
    <div class="flex flex-col">
        <div class="flex flex-row text-center z-10 bg-white bg-hero-texture">
            <button v-for="route in routesLinks" :class="linkClass" @click="goTo(route.name)" v-html="route.title"></button>
        </div>

        <router-view class="flex flex-grow h-full"></router-view>
    </div>
</template>
<script>
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
                        name: 'game',
                        title: 'Game'
                    }, {
                        name: 'tutorial',
                        title: 'Tutorial'
                    }, {
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