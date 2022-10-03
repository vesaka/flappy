import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Sprite, Texture } from 'pixi.js';
import { Bodies, Body } from 'matter-js';
import { drawRect } from '$lib/game/core/2d/utils/debug';
import { between, percents } from '$lib/game/core//utils/math';

class Obstacle extends Model {
    constructor(options = {}) {
        super(options);
        this.resetPosition();
        
        this.$listen({
            game: ['start', 'over', 'reset', 'destroy']
        });
        
        this.size = Obstacle.getDefaultSize();
        if (1 === this.row) {
            this.rotate(Math.PI);
        }
        
        this.model.pivot.set(this.size.width / 2, this.size.height / 2);
        this.model.sprite.scale.set(
                (this.width / this.size.width).toFixed(2),
                (this.height / this.size.height).toFixed(2)
        )
        return this;
    }

    static addTexture(asset) {
        const texture = Texture.from(asset.url);
        Obstacle.prototype.textures[asset.name] = texture;
    }

    static setOptions(options) {
        const _options = Object.assign({}, options);
        const defaultOptions = options.default;
        for (let type in _options.types) {

            _options.types[type].texture = Obstacle.prototype.textures[_options.types[type].name || type]
                    || Obstacle.prototype.textures[Obstacle.prototype.defaultTexture];

            _options.types[type] = Object.assign({}, defaultOptions, _options.types[type]);
            _options.types[type].chance = Math.percents(_options.types[type].chance);
        }

        Obstacle.prototype.options = _options;
    }

    static setDefaultTexture(assets) {
        Obstacle.prototype.defaultTexture = Object.keys(assets)[0];
    }
    
    static getDefaultSize() {
        const {width, height} = Object.values(Obstacle.prototype.textures)[0];
        return {width, height}; 
    }

    static mapTypes(callback) {
        const options = Obstacle.prototype.options;
        for (let type in options.types) {
            callback(options.types[type], type);
        }
    }

    static firstOptions(callback) {
        const options = Obstacle.prototype.options;
        let res = false;
        for (let type in options.types) {
            res = callback(options.types[type], type);
            if (true === res) {
                return options.types[type];
            }
        }

        return null;
    }
    
    filter_matter(matter) {
        if (!matter.collisionFilter) {
            matter.collisionFilter = {}
        }
        const category = 0x0001;
        matter.collisionFilter.category = category;
        matter.collisionFilter.mask = category;
        return matter;
    }


    createBody() {
        const { defaultTexture, textures } = Obstacle.prototype;
        const texture = Object.values(Obstacle.prototype.textures)[0];
        return Bodies.rectangle(0, 0, texture.width, texture.height, this.matter);
    }

    createModel() {
        const sprite = new Sprite;
        const model = new Graphics;
        Obstacle.prototype.models.push(model);
        model.sprite = sprite;
        model.addChild(sprite);
        return model;
    }
    
    resetPosition(reset = false) {
        const {box, space, column, row, index, model, body} = this;
        const { models, options } = Obstacle.prototype;
        let $options = Obstacle.firstOptions(opt => {
            return Math.random() > opt.chance;
        });

        if (!$options) {
            $options = Object.values(options.types)[0];
        }
        model.sprite.texture = $options.texture;
        this.options = $options;
        
        const height = model.sprite.texture.height;

        this.setX(box.width + (reset ? 0 : (column * space) + Math.round(space / 2)));

        if (0 === row) {
            this.setY(between(box.height*0.4, box.height*0.7) + height/2);
        } else {
            const lowerSprite = models[column];
            this.setY(lowerSprite.position.y - options.gap - this.height);
        }
        
        this.coming = true;
    }

    updatePosition() {
        const {model, body, row, box} = this;
        const { speed, columns } = Obstacle.prototype.options;
        this.setX(body.position.x - speed);

        if ((body.position.x + (model.width / 2)) < 0) {
            this.resetPosition(true);

        }
        
        super.updatePosition();
    }
    
    game_reset() {
        this.resetPosition();
    }
    
    game_destroy() {
        Obstacle.prototype.models = [];
        Obstacle.prototype.textures = {};
    }
}
;

Obstacle.prototype.models = [];
Obstacle.prototype.textures = {};

export default Obstacle;