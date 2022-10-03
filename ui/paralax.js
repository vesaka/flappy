import Container from '$lib/game/core/container';
import { Texture, TilingSprite, Graphics } from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
class Paralax extends Container {
    constructor(options) {
        super(options);
        this.$listen({
            paralax: ['loaded'],
            window: ['resize']
        });
        
        this.layers = [];
    }
    
    paralax_loaded(asset) {
        const texture = Texture.from(asset.url);
        const { app: { screen }, scene, layers } = this;
        const setup = this.getPanel(asset.key, texture);
        const layer = layers[asset.key] = new TilingSprite(texture);
        
        layer.width = setup.width || texture.width;
        layer.height = setup.height || texture.height;
        layer.position.y = setup.position.y || layer.position.y;
        layer.tilePosition.x = setup.tile.x;
//        layer.tilePosition.y = setup.tile.y;
        layer.scale.y = setup.scale.y;
        
        layer.setup = setup;
        
        scene.addChild(layer);
    }
    
    getPanel(key, texture) {
        const setup = this.panels[key];
        const method = `handle_${key}`;
        if (typeof this[method] === 'function') {
            return this[method](setup, texture);
        }
        
        return setup;
    }
    
    handle_far(setup, texture) {
        setup.position = {};
        setup.scale = {
            x: 1,
            y: this.app.screen.height / texture.height
        };
        
        setup.tile = {
            x: -50,
            y: 0
        }
        
        setup.width = texture.width * 2;
        return setup;
    }
    handle_near(setup, texture) {
        setup.position = {
            y: this.app.screen.height - texture.height
        };
        setup.scale = {
            x: 1,
            y: 1
        };
        
        setup.tile = {
            x: -50,
            y: 0
        }
        
        setup.width = this.app.screen.width * 2;
        return setup;
    }
    
    animate(delta) {
        for (let i in this.layers) {
            const layer = this.layers[i];
            layer.tilePosition.x -= delta * layer.setup.speed * 0.3;
            
//            if (layer.position.x <= -(layer.setup.width / 2)) {
//                layer.position.x = 0;
//            }
        }
    }
}

export default Paralax;