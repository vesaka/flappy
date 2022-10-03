import GameBase from '$lib/game/core/2d/game-matter';

import { main as mainEvents, game } from '$lib/game/flappy/config/events';
import { Texture, Container, TilingSprite } from 'pixi.js';
import { Bounds, Vertices, Runner, Detector, Common } from 'matter-js';
/** Models */
import Character from '$lib/game/flappy/models/character';
import Obstacle from '$lib/game/flappy/models/obstacle';

/**
 * UI Elements
 */
import Paralax from '$lib/game/flappy/ui/paralax';
import Logo from '$lib/game/flappy/ui/logo';
import Score from '$lib/game/flappy/ui/score';
import BestScore from '$lib/game/flappy/ui/best-score';
import Buttons from '$lib/game/flappy/ui/buttons';
import ProgressBar from '$lib/game/flappy/ui/bar-progress';

/**
 * Screens
 */
import GameReset from '$lib/game/flappy/screens/game-reset';
import Banner from '$lib/game/flappy/screens/banner';

import {raw, extend} from '$lib/game/core/utils/object';

import Stats from 'stats.js';
class FlappyGame extends GameBase {
    /**
     * 
     * @param {type} options
     * @returns {FlappyGame.constructor}
     */
    constructor(options) {
        super(options);

        this.$listen(mainEvents);
        this.$listen(game);
        this.$set('scene', new Container());
        this.$set('ui', new Container());

        this.ui.interactive = true;
        this.scene.interactive = true;
        this.ui.sortableChildren  = true;
        this.scene.sortableChildren  = true;
        
        this.app.stage.addChild(this.scene);
        this.app.stage.addChild(this.ui);
        this.$set('progresBar', new ProgressBar(this.options.ui.progress));
        this.$set('obstacles', []);
        this.columns = [];
        this.running = false;

        this.logo = new Logo(this.options.ui.logo);

        this.buttons = new Buttons(this.options.ui.buttons);

        this.paralax = new Paralax(this.options.ui.paralax);
        this.createScreens();
        this.stats = new Stats();
        this.stats.showPanel(0);

        this.$set('bounds', Bounds.create(Vertices.create([
            {x: 0, y: 0},
            {x: this.app.screen.width, y: 0},
            {x: 0, y: this.app.screen.height},
            {x: this.app.screen.width, y: this.app.screen.height}
        ])));
        this.container.appendChild(this.stats.dom);
        this.playing = false;
        this.restarting = false;

        return this;
    }

    /**
     * @description Creates the character model once the first asset was loaded.
     * the asset to available textures
     * 
     * @param {LoaderResource} asset
     * @returns {void}
     */
    flappy_loaded(asset) {
        if (!this.character) {
            this.character = new Character(this.options.models.character);
            this.add(this.character);
        }

        this.character.addState(asset);
    }

    obstacle_loaded(asset) {
        Obstacle.addTexture(asset);
    }
    
    createScreens() {
        this.banner = new Banner(
            this.options.ui.banner
        );
    }
    
    createUI() {
        const { options, ui } = this;
        this.score = new Score(options.ui);
        this.best_score = new BestScore(options.ui);

        ui.addChild(this.best_score.box);
        ui.addChild(this.score.box);
        ui.addChild(this.buttons.navbar);
        
        
    }

    game_start() {
        window.addEventListener('keyup', this.setPause);
    }

    game_pause(ev) {
        const code = (typeof ev.which === "number") ? ev.which : ev.keyCode;

        if (32 === code) {
            this.playing = !this.playing;
            if (this.playing) {
                Runner.stop(this.runner);
            } else {
                Runner.start(this.runner, this.engine);
            }

        }
    }

    game_over() {
        this.scene.interactive = false;
        window.removeEventListener('keyup', this.setPause);
        
        this.playing = false;
    }

    game_ready() {
        this.scene.interactive = true;
    }
    
    game_destroy() {

    }

    setPause(ev) {
        FlappyGame.prototype.$emit('game_pause', ev);
    }

    window_resize() {
        
    }

    onHold() {
        if (!this.playing) {
            this.playing = true;
            this.$emit('game_start');
        }

        this.character.updateState('down');
    }

    onRelease() {
        this.character.updateState('up');
    }

    createObstacles() {
        const {obstacles} = this.options.models;
        const {width, height} = this.app.screen;
        const box = {width, height};

        Obstacle.setDefaultTexture(this.assets.obstacle);
        Obstacle.setOptions(obstacles);
        const size = Obstacle.getDefaultSize();

        const [maxWidth, maxHeight] = [
            Number(((box.width / obstacles.columns) * obstacles.maxWidth).toFixed(2)),
            Number((box.height * (1 - obstacles.maxHeight)).toFixed(2))
        ];


        const [scaleY] = [(size.height / maxHeight).toFixed(0)];

        obstacles.width = Math.min(maxWidth, size.width * (size.width / maxWidth));
        obstacles.height = Math.max(maxHeight, size.height * (size.height / maxHeight))

        const space = ((box.width / obstacles.columns) + size.width / 4).toFixed(2);
        const countObstacles = obstacles.columns * 2;
        for (let i = 0; i < countObstacles; i++) {
            const obstacle = new Obstacle({
                index: i,
                row: Math.floor(i / obstacles.columns),
                column: i % obstacles.columns,
                space,
                box,
                matter: obstacles.default.matter,
                width: obstacles.width,
                height: obstacles.height
            });
            this.obstacles.push(obstacle);
            this.add(obstacle, 'obstacles');
        }
        
    }

    build() {
        const {app, scene, runner, playing, paralax, obstacles, character, options, stats} = this;

        const columns = options.models.obstacles.columns;
        const middle = app.screen.width / 2;
        this.createObstacles();
        this.createUI();

        scene.on('pointerdown', ev => this.onHold(ev, true))
                .on('pointerup', ev => this.onRelease(ev))
                .on('pointerupoutside', ev => this.onRelease(ev));

        character.updateState('floating');
        character.setObstacles(obstacles);

        
        app.ticker.add(delta => {
            stats.begin();
            character.animate();
            if (this.playing) {
                
                paralax.animate(delta);
                for (let i in obstacles) {
                    const obstacle = obstacles[i];
                    obstacles[i].updatePosition();
                    if (true === obstacle.coming && middle > obstacle.model.position.x) {
                        obstacle.coming = false;
                        if ((i < columns)) {
                            this.$emit('character_score')
                        }
                    }

                    
                }
                character.checkCollisions();

            }

            if (this.$hasEvent('game_starting')) {
                this.$emit('game_starting');
            }

            if (0 === app.ticker.lastTime % 10) {
                console.clear();
            }
            
            stats.end();
        });

        Runner.start(runner, this.engine);
    }
}
;

export default FlappyGame;