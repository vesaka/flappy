import UI from '$lib/game/core/2d/display/ui';
import { Graphics, Ticker } from 'pixi.js';
import FadingMixin from '$lib/game/core/2d/mixins/fading-out-at-start-mixin';

class BestScore extends UI {
    constructor(setup) {
        setup.mixins = [FadingMixin];
        super(setup);
        this.$listen({
            character: ['score'],
            score: ['update'],
            game: ['start', 'reset']
        });

        this.box = new Graphics;
        this.ticker = new Ticker;

        this.best_score = this.$store.getters.load('score') || 0;

        this.highlight = this.createHighlight(setup.best_score.highlight);
        this.label = this.createLabel(setup.best_score.label);

        this.box.position.x = setup.best_score.position.x;
        this.box.position.y = setup.best_score.position.y;
        this.box.addChild(this.highlight);
        this.box.addChild(this.label);
       

        return this;
    }
    
    getFadableElements() {
        return [this.highlight, this.label];
    }

    createHighlight(setup) {
        const counter = this.createText(this.format(this.best_score), setup.style);
        counter.position.x = setup.position.x;
        counter.position.y = setup.position.y;
        //counter.anchor.set(0, 0.5);
        return counter;
    }

    createLabel(setup) {
        const text = this.createText(this.i18n('ui.best_score'), setup.style);
        //text.position.x = setup.position.x;
        text.position.y = setup.position.y;
        //text.anchor.set(0.5);

        return text;
    }

    score_update(score) {
        if (score > this.best_score) {
            this.best_score = score;
            this.highlight.text = this.format(this.best_score);
            this.$store.commit('data', {
                key: 'score',
                value: score
            });
        }
    }

    format(score) {
        return score.toString().padStart(3, '0');
    }
}

export default BestScore;