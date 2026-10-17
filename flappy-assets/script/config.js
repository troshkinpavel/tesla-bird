// All gameplay numbers are in game px (640×360 logical resolution).
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;
export const RENDER_SCALE = 3;
export const PIPE_WIDTH = 26;
export const MIN_PILLAR_LENGTH = 88; // rocket nose + engine

// Data-driven themes: background, dim colour and dim opacity. Car, pillars and UI are shared.
export const THEMES = Object.freeze({
    night: Object.freeze({background: 'bg_starbase_night.webp', dimColor: '#030716', dim: 0.5}),
    dawn: Object.freeze({background: 'bg_starbase_dawn.webp', dimColor: '#160a2a', dim: 0.42}),
    day: Object.freeze({background: 'bg_starbase_day.webp', dimColor: '#0a1c3c', dim: 0.38})
});

export const DIFFICULTY_PRESETS = Object.freeze({
    easy: Object.freeze({
        step: 200,
        innerColumn: 96,
        maxGapShift: 50
    }),
    normal: Object.freeze({
        step: 170,
        innerColumn: 80,
        maxGapShift: 60
    }),
    hard: Object.freeze({
        step: 145,
        innerColumn: 70,
        maxGapShift: 72
    })
});

export const DEFAULT_SETTINGS = Object.freeze({
    difficulty: 'normal',
    theme: 'night',
    step: 170,
    innerColumn: 80,
    maxGapShift: 60,
    debug: false,
    speed: 115,
    gravity: 1100,
    jumpVelocity: -270,
    hitboxInset: 2,
    pipeWidth: PIPE_WIDTH,
    storageKey: 'tesla-bird-best-score',
    runsKey: 'tesla-bird-runs',
    themeKey: 'tesla-bird-theme'
});

export function createSettings(options = {}) {
    const difficulty = options.difficulty ?? DEFAULT_SETTINGS.difficulty;
    const preset = DIFFICULTY_PRESETS[difficulty];

    if (!preset) {
        throw new RangeError('FlappyBird option "difficulty" must be easy, normal or hard');
    }

    const settings = {...DEFAULT_SETTINGS, ...preset, ...options, difficulty};

    if (!Object.hasOwn(THEMES, settings.theme)) {
        throw new RangeError(`FlappyBird option "theme" must be one of ${Object.keys(THEMES).join(', ')}`);
    }

    validatePositiveNumber('step', settings.step);
    validatePositiveNumber('innerColumn', settings.innerColumn);
    validatePositiveNumber('maxGapShift', settings.maxGapShift);
    validatePositiveNumber('speed', settings.speed);
    validatePositiveNumber('gravity', settings.gravity);
    validatePositiveNumber('pipeWidth', settings.pipeWidth);

    if (settings.step < settings.pipeWidth) {
        throw new RangeError('FlappyBird option "step" must be at least the pipe width');
    }

    if (settings.innerColumn > GAME_HEIGHT - MIN_PILLAR_LENGTH * 2) {
        throw new RangeError('FlappyBird option "innerColumn" leaves no room for both pillars');
    }

    if (!Number.isFinite(settings.jumpVelocity) || settings.jumpVelocity >= 0) {
        throw new TypeError('FlappyBird option "jumpVelocity" must be a finite negative number');
    }

    if (!Number.isFinite(settings.hitboxInset) || settings.hitboxInset < 0 || settings.hitboxInset > 6) {
        throw new RangeError('FlappyBird option "hitboxInset" must be between 0 and 6 game pixels');
    }

    for (const key of ['storageKey', 'runsKey', 'themeKey']) {
        if (typeof settings[key] !== 'string' || !settings[key].trim()) {
            throw new TypeError(`FlappyBird option "${key}" must be a non-empty string`);
        }
    }

    return Object.freeze(settings);
}

function validatePositiveNumber(name, value) {
    if (!Number.isFinite(value) || value <= 0) {
        throw new TypeError(`FlappyBird option "${name}" must be a finite positive number`);
    }
}
