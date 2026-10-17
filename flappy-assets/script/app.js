import {THEMES} from './config.js';
import {FlappyBird} from './flappy.js';

function initializeGame() {
    const params = new URLSearchParams(location.search);
    const isDebug = params.get('debug') === 'true';
    const theme = params.get('theme');
    const debugCheckbox = document.getElementById('debugToggle');

    debugCheckbox.checked = isDebug;
    debugCheckbox.addEventListener('change', function handleDebugChange() {
        params.set('debug', String(this.checked));
        location.search = params.toString();
    });

    FlappyBird('container', {
        difficulty: 'normal', // easy | normal | hard
        ...(Object.hasOwn(THEMES, theme ?? '') && {theme}), // ?theme=night|dawn|day overrides the saved choice
        debug: isDebug
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame, {once: true});
} else {
    initializeGame();
}
