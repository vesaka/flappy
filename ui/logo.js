import { Graphics } from 'pixi.js';
import UI from '$core/2d/display/ui';
import { Sprite, Texture, Ticker } from 'pixi.js';

class Logo extends UI {
    constructor(setup) {
        super(setup);

        this.$listen({
            logo: ['loaded'],
            game: ['start', 'over', 'reset']
        });

        this.ticker = new Ticker;
        
        return this;
    }

    reset() {
        const {app, setup, display} = this;

        display.visible = true;
        display.scale.set(setup.scale);
        display.anchor.set(0.5);
        display.position.x = app.screen.width / 2;
        display.position.y = (app.screen.height / 2) - (display.texture.height * 0.75);

        this.$on('character_float', delta => this.updateY(delta));
        
    }

    logo_loaded(asset) {
        const {app, setup, ui} = this;
        const texture = Texture.from(asset.url);
        const display = new Sprite(texture, setup.width, setup.height);


        this.display = display;

        this.reset();

        ui.addChild(display);

    }
    
//    character_float(delta) {
//        this.updateY(delta)
//    }

    updateY(delta) {
        const {display} = this;
        
        display.position.y += delta;
        if (display.position.y < -(display.texture.height / 2) || (display.scale.x < 0)) {
            display.visible = false;
            this.ticker.stop();
        }
        
//        display.position.y += delta;
//        //this.display.scale.set(this.display.scale.x-0.02);
//        if (display.position.y < -(display.texture.height/2) || (display.scale.x < 0)) {
//            this.$off('game_starting');
//            display.visible = false;
//        }
    }

    game_start() {
        this.$off('character_float');

        const {display, ticker} = this;
        ticker.add(delta => {
            display.scale.set(display.scale.x - 0.007);
           this.updateY(-2);
        });

        ticker.start();
    }

    game_over() {
        this.$off('character_float');
        this.display.visible = false;
        this.ticker.stop;
    }

    game_reset() {
        this.reset();
    }
    
    game_destroy() {
        
    }
}
;

export default Logo;