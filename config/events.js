const main = {
    game: ['loaded', 'start', 'over', 'reset', 'pause'],
    background: ['loaded', 'failed'],
    locale: ['loaded'],
    window: ['resize', 'orientationchange']
};

const game = {
    character: ['ready', 'start', 'fly', 'hit', 'fell', 'scores'],
    flappy: ['loaded'],
    font: ['loaded'],
    obstacles: ['loaded'],
    obstacle: ['loaded', 'coming']
};

const obstacles = {
    obstacle: ['loaded']
};

const texture = {
    background: ['loaded', 'failed']
};
const character = {
    window: ['resize']
};
export default {};
export { main, game, texture, character, obstacles };
