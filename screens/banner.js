import UI from '$core/2d/display/ui';
import { Container, AnimatedSprite, Spritesheet, BaseTexture, Texture, Sprite, Rectangle } from 'pixi.js';
import { Ticker } from 'pixi.js';
class Banner extends UI {

    constructor(options = {}) {
        super(options);
        this.$listen({
            banner: ['loaded'],
            game: ['over', 'reset', 'ready']
        });
        this.screen = new Container;
        this.ui.addChild(this.screen);
        this.screen.zIndex = 10;

        this.parts = [];
        return this;
    }

    filter_textures() {
        const {app, size, position, width, height} = this;
        const splitAt = this.splitAt || 0.5;
        const split = this.split || 'x';
        const textures = [];
        if (true === this.vertical) {
            const h = height * splitAt;
            this.axis = 'y';
            this.stopAt = app.screen.height * splitAt;

            textures[0] = {
                frame: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: h
                },
                position: {
                    x: 0,
                    y: -h

                },
                step: h / (this.animation / 2),
            };
            textures[1] = {
                frame: {
                    x: 0,
                    y: h,
                    width: width,
                    height: height * (1 - splitAt)
                },
                position: {
                    x: 0,
                    y: height
                },
                step: (height * (1 - splitAt)) / (this.animation / 2),
            };
        } else {
            this.axis = 'x';
            this.stopAt = app.screen.width * splitAt;
            const w = width * splitAt;

            textures[0] = {
                frame: {
                    x: 0,
                    y: 0,
                    width: w,
                    height: height
                },
                position: {
                    x: -w,
                    y: 0
                },
                step: w / (this.animation / 2),
            };

            textures[1] = {
                frame: {
                    x: w,
                    y: 0,
                    width: width * (1 - splitAt),
                    height: height
                },
                position: {
                    x: width,
                    y: 0
                },
                step:(width * (1 - splitAt)) / (this.animation / 2),
            };

        }
        return textures;
    }

    game_over() {
        const {app, textures, parts, animation, axis} = this;
        const start = new Date().getTime();
        const end = start + animation + 300;
        const half = start + (animation/2);
        const ticker = new Ticker();

        const first = Math.cos(0 * (Math.PI / 180));
        let theta = 0;

        const step = textures[0].frame.height / (animation/2);
        let one = 1;
        ticker.add(delta => {
            const now = new Date().getTime();
            if (!parts.length) return;
            parts[0].position[axis] += textures[0].step*ticker.elapsedMS*one;
            parts[1].position[axis] -= textures[1].step*ticker.elapsedMS*one;
            if (one === 1 && now >= half) {
                one = -1;
                this.$emit('game_reset');
            }
            
            if (now > end+300) {
                ticker.stop();
                parts[0].position[axis] = textures[0].position[axis];
                parts[1].position[axis] = textures[1].position[axis];
                this.$emit('game_ready');
            }
            //parts.one.pos
        });

        ticker.start();
    }

    banner_loaded(asset) {
        const {app, size, position, textures} = this;

        for (let i in textures) {
            const texture = new Texture(asset.texture, textures[i].frame);
            const sprite = new Sprite(texture);
            //sprite.anchor.set(textures[i].anchor[0], textures[i].anchor[1]);
            sprite.position.set(textures[i].position.x, textures[i].position.y);
            this.screen.addChild(sprite);
            this.parts.push(sprite);
            
            
        }


    }

}
;

export default Banner;