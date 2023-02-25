<template>
    <div>
        <div ref="container" class="flex relative inset-0 w-full h-full justify-center flex-grow items-center"></div>
    </div>
</template>
<script>
    import FlappyGame from '$flappy/game';
    import options from '$flappy/config/options.json';
    import assets from '$flappy/config/assets.json';
    import { useAuthStore, useGameStore } from '$flappy/bootstrap/stores';
    export default {
        mounted() {
            const {$store} = this;

            this.game = new FlappyGame({ 
                container: this.$refs.container,
                options,
                assets,
                $store: useGameStore()
            });
            this.game.load();
        },
        beforeUnmount() {
            this.game.destroy();
        }
    }
</script>
<style>
    nav {position: fixed}
</style>
