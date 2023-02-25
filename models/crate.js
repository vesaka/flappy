import Model from '$core/2d/models/matter-model';
import { Graphics, Sprite, Texture, Text } from 'pixi.js';
import { Body, Bodies } from 'matter-js';

class Crate extends Model {

    constructor(options) {
        super(options);


        return this;
    }

    createModel() {

        this.position = {
            x: 400,
            y: 350
        };


        this.size = {
            width: 40,
            height: 40,
        };


        const g = new Graphics();
        g.beginFill(0x224422, 0.1);
        g.lineStyle(3, 0x224422);
        g.drawRect(this.position.x, this.position.y, this.size.width, this.size.height);
        g.endFill();
       // g.pivot.set(0.5, 1);
        //g.pivot.set(0.5);
        const text = new Text(this.i);
        text.position.set(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
        text.anchor.set(0.5);
        g.addChild(text);
        
        text.scale.x = 1;
        text.scale.y = -1;
        return g;
    }

    createBody() {
        return Bodies.rectangle(
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height, 
                {
                    isStatic: true,
                    isSleeping: true
                }
            );
    }
}
;

export default Crate;
