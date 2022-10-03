<template>
    <div>
        <div ref="container" class="flex relative inset-0 w-full h-full justify-center flex-grow items-center"></div>
    </div>
</template>
<script>
    import FlappyGame from '../flappy-game';
    import PixiMixin from '$lib/game/core/2d/mixins/pixi-mixin';
    
    export default {
        mixins: [PixiMixin],     
        mounted() {
            const {$store} = this;

            this.game = new FlappyGame({ 
                container: this.$refs.container,
                options: require(`$lib/game/flappy/config/options.json`),
                settings: require(`$lib/game/flappy/config/settings.json`),
                assets: require(`$lib/game/flappy/config/assets.json`),
                $store });
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
