import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Sprite, Texture } from 'pixi.js';


class Ground extends Model {

    constructor(options) {
        super(options);
        return this;
    }

    createModel() {


        this.position = {
            x: 10,
            y: 10
        };




        // if (!this.size) {
        this.size = {
            width: this.app.screen.width - 20,
            height: this.app.screen.height - 20
        };
        //}
        const g = new Graphics();
        g.beginFill(0x224422, 0.1);
        g.lineStyle(3, 0x224422);
        g.drawRect(this.position.x, this.position.y, this.size.width, this.size.height);
        g.endFill();


        return g;
    }

//    createBody() {
//        const body = new Body({
//            mass: 0,
//            position: [0,0]
//            //angle: Math.PI
//        });
//        
//        const plane = new Plane({
////            width: this.pxm(this.size.width),
////            height: this.pxm(this.size.height)
//        });
//        
//        //plane.material = new Material;
//
//        body.addShape(plane);
//        return body;
//    }
}

export default Ground;