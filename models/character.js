import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Sprite, Texture } from 'pixi.js';
import { character as characterEvents } from '$lib/game/flappy/config/events';
import { Body, Bodies, Query, Vector, Events } from 'matter-js';
import { between } from '$lib/game/core//utils/math';

class Character extends Model {
    constructor(options) {
        super(options);
        this.defaultState = Object.keys(options.states)[0];
        this.states = {};
        //this.model.pivot.set();
        this.action = 'floating';

        this.resetPosition();

        this.$listen({
            game: ['start', 'over', 'reset', 'ready'],
            character: ['up', 'down'],
            window: ['resize']
        });

        this.zeroVector = Vector.create(0, 0);
        return this;
    }

    filter_collision_points(path) {
        return this.createVerticesFromSvgPath(path);
    }

    filter_matter(matter) {
        if (!matter.collisionFilter) {
            matter.collisionFilter = {}
        }
        const category = 0x0001;
        matter.collisionFilter.category = category;
        return matter;
    }

    resetPosition() {
        
        this.theta = 180;
        this.setPosition(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );
    }

    addState(asset) {
        const {app, states, position, size, defaultState} = this;
        if (!states[asset.name]) {
            states[asset.name] = Texture.from(asset.url);
        }

        this.model.pivot.set(states[asset.name].width / 2, states[asset.name].height / 2);


    }

    updateState(move) {
        const state = `flappy_${move}`;
        for (let name in this.states) {
            if (state === name) {
                this.sprite.texture = this.states[name];
                this.$emit(`character_${move}`);
                break;
            }
        }

        this.action = move;
    }
    
    setObstacles(obstacles) {
        this.obstacles = obstacles.map(o => o.body);
    }

    character_up() {
        this.lastTimeFlap = this.app.ticker.lastTime;

    }

    character_down() {
    }

    game_reset() {
        Body.setStatic(this.body, true);
        Body.setAngularVelocity(this.body, 0);
        Body.setVelocity(this.body, this.zeroVector);
        this.rotate(0);
        this.resetPosition();
        
        this.updateState('floating');
        this.model.visible = true;
    }

    animate() {
        const {app, action, swing, body} = this;

        if ('floating' === action) {
            this.floating();
        } else if ('up' === action) {
            const deltaTime = (app.ticker.lastTime - this.lastTimeFlap) / 1000;
            this.increaseY(swing * deltaTime * 3);
        } else if ('down' === action) {
            this.increaseY(-swing * 1.5);
        }

        this.updatePosition();
        this.updateRotation();
    }

    floating() {
        const delta = Math.cos(this.theta * (Math.PI / 180));
        this.increaseY(delta);

        this.$emit('character_float', delta);
        this.theta += 1.5;
        if (this.theta >= 360) {
            this.theta = 0;
        }
    }

    mapStates(callback) {
        for (let name in this.states) {
            callback(this.states[name], name);
        }
    }

    firstState(callback) {
        for (let name in this.states) {
            const first = callback(this.states[name], name);
            if (true === first) {
                return this.states[name];
            }
        }

        return Object.values(this.states)[0];
    }

    createBody() {
        const {matter, collision_points, model} = this;
        //return Bodies.rectangle(0, 0, 34, 24, matter);
        const body = Bodies.fromVertices(0, 0, collision_points, matter);

        this.size = {
            width: Math.abs(body.bounds.max.x - body.bounds.min.x),
            height: Math.abs(body.bounds.max.y - body.bounds.min.y)
        };

        return body;
    }

    createModel() {
        const sprite = new Sprite;
        const g = new Graphics;
        //g.position.set(this.app.screen.width / 2, 150);

        g.drawPolygon(this.collision_points)
        g.endFill();
        g.addChild(sprite);
        this.sprite = sprite;
        sprite.visible = true;
        return g;
    }

    checkCollisions() {
        const {body, app, obstacles, sprite: {texture}} = this;
        let over = false;
        if (body.position.y < -texture.height || body.position.y > app.screen.height) {
            over = true;
        } else {
            const collisions = Query.collides(body, obstacles);
            if (collisions.length > 0) {
                const {tangent, supports: [contact]} = collisions[0];
                const force = {x: (body.position.x - contact.x) * this.inertia, y: (body.position.y - contact.y) * this.inertia};
                Body.setAngularVelocity(body, between(-2, 3));
                
                Body.applyForce(body, body.position, force);
                Body.setStatic(body, false);
                over = true;
            }
        }
        if (over) {
            this.$emit('game_over');
            setTimeout(() => {
                //this.$emit('game_reset');
            }, 2000);
        }      
    }

    window_resize() {
        const {app} = this;
        const pos = this.position = {
            x: app.screen.width / 2,
            y: app.screen.height / 2
        };
                
        
//app.renderer.resize(window.innerWidth, window.innerHeight);
//        this.mapStates(state => {
//            state.position.x = pos.x;
//            state.position.y = pos.y;
//        });

    }

}
;

export default Character;