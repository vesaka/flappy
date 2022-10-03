import UI from '$lib/game/core/2d/display/ui';
import { Graphics, Text, Ticker } from 'pixi.js';
import { BounceDown } from '$lib/game/core/utils/transitions';
class Screen extends UI {
    constructor(options) {
        super(options);
        this.style = Object.assign({}, this.options.ui.style, options.styles);
        const screen = new Graphics;
        screen.beginFill(0x008800, 0.5);
        screen.drawRect(0, 0, this.app.screen.width,  this.app.screen.height);
        screen.endFill();
        screen.visibile = true;
        screen.position.set(0, -this.app.screen.height);
        screen.alpha = 1;
        this.box = this.createBox();
        screen.addChild(this.box);
        this.ui.addChild(screen);
        this.screen = screen;
        
        this.header = this.createHeader();
        this.header.position.set(
                this.size.width*this.heading.position[0],
                this.size.height*this.heading.position[1]
        );
        this.header.anchor.set(0.5, 0);
        this.box.addChild(this.header);
        this.ticker = new Ticker;
        
        this.transition = new BounceDown({
            object: this,
            screen: this.app.screen,
            width: this.app.screen.width,
            height: this.app.screen.height
        });
        return this;
    }
    
    createBox() {
        const {position, size} = this;
        const box = new Graphics;
        box.beginFill(0xaa8800, 0.2);
        box.drawRect(0, 0, size.width,  size.height);
        box.position.set(position.x, position.y);
        box.endFill();
        
        return box;
    }
    
    createHeader() {
        return new Text('');
    }
    
    filter_size(size) {
        return {
            width: this.app.screen.width * size.width,
            height: this.app.screen.height * size.height
        };
    }
    
    filter_position(position) {
        return {
            x: (this.app.screen.width - this.size.width) / 2,
            y: (this.app.screen.height - this.size.height) / 2
        };
    }
    
    tween(direction = 1) {
        const {app, screen, animate} = this;
        const ticker = new Ticker;
        const start = new Date().getTime();
        const end = start + animate.duration;
        const step = app.screen.height / animate.duration;
        const action = 1 === direction ? 'shown' : 'closed';
        
        ticker.add(delta => {
             const now = new Date().getTime();
             
             if (now >= end) {
                 ticker.stop();
                 //this.$emit('screen_' + action, this);
                 screen.position.y = (1 === direction ? 0 :-app.screen.height);
                 return;
             }
             screen.position.y += step*ticker.elapsedMS * direction;

        });
        
        ticker.start();
    }
    
    scale(direction = 1) {
        const {app, screen, animate} = this;
        const ticker = new Ticker;
        const start = new Date().getTime();
        const end = start + animate.duration;
        const step = app.screen.height / animate.duration;
        
        ticker.add(delta => {
             const now = new Date().getTime();
             if (now > end) {
                 ticker.stop();
                 
             }
             screen.position.y += step*ticker.elapsedMS * direction;
             
        });
        
        ticker.start();
    }
    
    show() {
        this.tween();
    }
    
    close() {
        this.tween(-1);
    }

}
;

export default Screen;