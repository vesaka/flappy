import { Graphics, Circle, Container } from 'pixi.js';
import UI from '$lib/game/core/2d/display/ui';
import { Sprite, Texture } from 'pixi.js';
import toggleFullscreen, {isFullscreen} from '$lib/game/utils/fullscreen';
import { sound } from '@pixi/sound';

import FadingMixin from '$lib/game/core/2d/mixins/fading-out-at-start-mixin';

class Buttons extends UI {

    constructor(setup) {
        setup.mixins = [FadingMixin];
        super(setup);

        const navbar = new Graphics();
        navbar.position.x = setup.position.x;
        navbar.position.y = setup.position.y;

        this.$listen({
            button: ['loaded', 'pressed'],
            audio: ['loaded'],
            game: ['start', 'over', 'reset', 'destroy'],
            window: ['resize']
        });

        this.types = {};

        let width = 0;
        for (let type in setup.types) {
            const options = Object.assign({}, setup.default, setup.types[type]);

            options.x = options.index * (options.size + options.margin);
            if (options.visible) {
                width += options.size + options.margin;
            }
            this.types[type] = options;
        }
        ///navbar.pivot.set(0.5);
//        navbar.width = width;
//        navbar.height = setup.default.size;
        navbar.position.x = this.app.screen.width - width - setup.offset.x;
        navbar.position.y = setup.offset.y;
        this.sprites = {};
        this.navbar = navbar;

        return this;
    }
    
    adjustPosition() {
        
    }
    
    window_resize() {
        console.log(this.app.screen.width);
    }

    getFadableElements() {
        return [this.navbar];
    }

    button_loaded(asset) {
        const texture = Texture.from(asset.url);
        const sprite = new Sprite(texture, texture.width, texture.height);
        const name = asset.key;

        const options = this.types[name];
        if (!options) {
            return;
        }

        sprite.position.x = options.x;
        sprite.position.y = 0;
//        sprite.pivot.y = this.navbar.position.y;
//        sprite.pivot.x = this.navbar.position.x + sprite.position.x;
        sprite.visible = options.visible;
        sprite.interactive = true;
        sprite.buttonMode = true;

        sprite.scale.set(0.45);

        const event = `${name}_pressed`;
        sprite.on('pointerdown', ev => {
            ev.stopped = true;
            ev.stopPropagation();
            return false;
        });
        sprite.on('pointerup', ev => {
            this.$emit(event, ev);
            ev.stopPropagation();
            return false;
        });
        if (typeof this[event] === 'function') {
            this.$on(event, (ev) => {
                ev.stopped = true;
                ev.stopPropagation();
                this[event](ev, name);
                return false;
            });
        }
        if (name === 'fullscreen') {
            document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this), false);
            document.addEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this), false);
            document.addEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this), false);
            document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this), false);
        }

        this.sprites[name] = sprite;
        this.navbar.addChild(sprite);
    }

    onFullscreenChange(ev) {
        const { app, sprites, navbar } = this;
        if (!isFullscreen()) {
            
            sprites.fullscreen.visible = true;
            sprites.smallscreen.visible = false;
        } else {
            sprites.fullscreen.visible = false;
            sprites.smallscreen.visible = true;

        }

        for (let key in this.sprites) {
            sprites[key].interactive = false;
        }

        app.view.style.height = window.innerHeight + 'px';

        setTimeout(() => {
            for (let key in sprites) {
                sprites[key].interactive = true;
            }
        }, 300);
        ///console.log(this.sprites.smallscreen.position);
    }

    audio_loaded(asset) {
        this.audioIsPlaying = [1, "on"].indexOf(this.settings.audio) > -1;
        //const audio = new sound()
        this.types.sound_on.visible = this.audioIsPlaying;
        this.types.sound_off.visible = !this.audioIsPlaying;
        this.audio = asset.sound;
        if (this.audioIsPlaying) {
            //this.audio.play();
        }

    }

    fullscreen_pressed(ev, name) {
        toggleFullscreen(this.app.view.parentNode);
    }

    smallscreen_pressed(ev, name) {
        toggleFullscreen(this.app.view.parentNode);
    }

    settings_pressed(ev) {

    }

    sound_on_pressed() {
        this.sprites.sound_on.visible = false;
        this.sprites.sound_off.visible = true;
        this.audio.pause();
    }

    sound_off_pressed() {
        this.sprites.sound_on.visible = true;
        this.sprites.sound_off.visible = false;

        this.audio.resume();
    }

    game_destroy() {
        document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this), false);
        document.removeEventListener('mozfullscreenchange', this.onFullscreenChange.bind(this), false);
        document.removeEventListener('MSFullscreenChange', this.onFullscreenChange.bind(this), false);
        document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this), false);
    }

    filter_position(position) {
        return this.normalize_values(position);
    }

    filter_offset(offset) {
        return this.normalize_values(offset);
    }

    filter_default(def) {
        return this.normalize_values(def);
    }

}
;

export default Buttons;


