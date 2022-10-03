import { Graphics } from 'pixi.js';
import UI from '$lib/game/core/2d/display/ui';
import FadingMixin from '$lib/game/core/2d/mixins/fading-out-at-start-mixin';

class Score extends UI {
    
    constructor(setup) {
        //setup.mixins = [FadingMixin];
        super(setup);

        this.box = new Graphics;
        

        this.counter = this.createCounter(setup.score.counter);
        this.label = this.createLabel(setup.score.label);

        this.box.position.x = setup.score.position.x;
        this.box.position.y = setup.score.position.y;
        this.box.addChild(this.counter);
        this.box.addChild(this.label);
        this.$listen({
            character: ['score', 'reset'],
            game: ['over', 'reset']
            
        });
        this.score = 0;
        return this;
    }
    
    createCounter(setup) {
        const counter = this.createText(setup.default, setup.style);
        counter.position.x = setup.position.x;
        counter.position.y = setup.position.y;
        return counter;
    }
    
    createLabel(setup) {
        const text = this.createText(this.i18n('ui.score'), setup.style);
        text.position.y = setup.position.y;
        
        return text;
    }
    
    character_score() {
        const {setup} = this;
        this.score ++;
        this.counter.text = this.score.toString().padStart(setup.score.counter.minLength, '0');
        
    }
    
    getFadableElements() {
        return [this.box];
    }
    
    game_over() {
        this.box.visible = false;
        this.$emit('score_update', this.score);
    }
    
    game_reset() {
        this.score = 0;
        this.counter.text = this.setup.score.counter.default;
        this.box.visible = true;
    }
    
}

export default Score;

