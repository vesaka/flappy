import { Graphics, RoundedRectangle } from 'pixi.js';
import Progress from '$lib/game/core/2d/display/progress';

const toNum = (str, n = 0) => {
    return parseInt(str.replace('#', ''), n);
};
class BarProgress extends Progress {
    constructor(setup) {
        super(setup);
        const fill = toNum(setup.background.fill,16);
        const bg = new Graphics;
        bg.beginFill(fill);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.alpha = 0.8;
        bg.endFill();
        this.bg = bg;
        this.screen.addChild(bg);
        this.createBar();
        return this;
    }
    
    
    createBar() {
        const {app, setup} = this;
        
        const outer = new Graphics();
        const border = setup.size.border;
        outer.beginFill(toNum(setup.outer.fill,16));
        outer.drawRoundedRect(
                app.screen.width / 2 - setup.size.width/2,
                setup.position.y,
                setup.size.width,
                setup.size.height,
                setup.size.radius
        );
        outer.endFill();

        const inner =  new Graphics();
        const size = {
            x: app.screen.width / 2 - setup.size.width/2 + border,
            y: setup.position.y + border,
            width: setup.size.width - border*2,
            height: setup.size.height - border*2,
            radius: setup.size.radius
            
        };
        inner.beginFill(toNum(setup.background.fill,16));
        inner.drawRoundedRect(
                size.x,
                size.y,
                size.width,
                size.height,
                size.radius
        );
        inner.endFill();
        

        this.size = size;
        
        this.screen.addChild(outer);
        this.screen.addChild(inner);
        this.drawProgress(0);
    }
    
    drawProgress(progress) {
        const {screen, setup, size} = this;
        if (this.bar) {
            screen.removeChild(this.bar);
        }
        const width = Math.round(((progress/100) * size.width) * 100) / 100;
        const bar = new Graphics();
        bar.beginFill(1129955);
        bar.drawRoundedRect(
                size.x,
                size.y,
                width,
                size.height,
                size.radius
        );
        bar.endFill();
        screen.addChild(bar);
        this.bar = bar;
        
    }
    
    onLoadProgress(progress) {
        this.drawProgress(progress);
    }
    
    onLoadComplete() {
        
        
    }
    
    loader_start(loader) {
        this.drawProgress(0);
    }
    
    loader_progress(loader) {
        this.drawProgress(loader.progress);
    }
    
    loader_error() {
        
    }
    
    loader_complete() {
        setTimeout(() => {
            this.app.stage.removeChild(this.screen);
        }, 300);
        
        this.$off('loader_complete');
    }
};

export default BarProgress;