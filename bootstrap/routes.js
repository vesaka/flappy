import Home from '$flappy/components/pages/Home.vue';
import Settings from '$flappy/components/pages/Settings.vue';
import Tutorial from '$flappy/components/pages/Tutorial.vue';
import Leaderboard from '$flappy/components/pages/Leaderboard.vue';
import Playground from '$flappy/components/pages/Playground.vue';
import NotFound from '$flappy/components/pages/NotFound.vue';

import { BASE, PLAY, PAGE_404, SETTINGS, TUTORIAL } from './paths';

const routes = [
    {
        path: BASE,
        name: 'home',
        component: Home,
        meta: {
            title: 'Welcome',
            transitionName: 'slide-left',
        }
    },
    {
        path: PLAY,
        name: 'play',
        component: Playground,
        meta: {
            title: 'Play',
            transitionName: 'slide-left',
        }
    },
    {
        path: SETTINGS,
        name: 'settings',
        component: Settings,
        meta: {
            title: 'Settings',
            transitionName: 'slide-left',
        }
    },
    {
        path: TUTORIAL,
        name: 'tutorial',
        component: Tutorial,
        meta: {
            title: 'Tutorial',
            transitionName: 'slide-left',
        }
    },
    {
        path: PAGE_404,
        name: '404',
        component: NotFound,
        meta: {
            title: '404',
            transitionName: 'slide-left',
        }
    },
];

export default routes;

