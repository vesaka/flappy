import { Container, Texture, TilingSprite, Graphics } from 'pixi.js';
import Model from '$core/2d/models/matter-model';
class Room extends Model {
    constructor(options) {
        super(options);
        
        this.$listen({
            background: ['loaded'],
            window: ['resize']
        });
        return this;
    }
    
//    createBody() {
//        const { model, world } = this;
//
//        const position = [this.pxm(model.x),this.pxm(model.height)];
//        const body = new Body({
//            mass: 0,
//            type: Body.STATIC,
//            gravityScale: 0,
//            position
//        });
//
//        body.addShape(new Plane({angle: Math.PI / 2}));
//
//        return body;
//    }
//    
    createModel() {
        const { app } = this;
        const box = new Graphics;
        const offset = 15;
        
        
        
        box.beginFill(0x000000, 0);
        box.lineStyle(3, 0x224422);
        box.drawRect(offset, offset, app.screen.width - 2*offset, app.screen.height - 2*offset);
        box.endFill();
        box.position.x = 3/2;
        box.position.y = 3/2;
        
        return box;
    }
    
    background_loaded(asset) {
        const url = asset.url;
        const texture = Texture.from(url);
        const bg = new TilingSprite(texture, this.app.screen.width, texture.height);

//        bg.scale.x = this.app.screen.width / texture.width;
       // bg.scale.y = this.app.screen.height / texture.height;
        
        //this.scene.addChild(bg);

        this.bg = bg;
    }
    
    window_resize() {
        const {bg, app, container} = this;
//        if (bg) {
//            bg.scale.x = app.screen.width / bg.texture.width;
//            bg.scale.y = app.screen.height / bg.texture.height;
//        }

    }
}

export default Room;