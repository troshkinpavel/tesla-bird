// All gameplay numbers are in game px (640×360 logical resolution).
export const GAME_WIDTH = 640;
export const GAME_HEIGHT = 360;
export const RENDER_SCALE = 3;
export const PX_PER_METRE = 10;
export const FULL_CHARGE_METRES = 3000;

// Data-driven themes: background, dim colour and dim opacity. Car, rockets and UI are shared.
export const THEMES = Object.freeze({
    night: Object.freeze({background: 'bg_starbase_night.webp', dimColor: '#030716', dim: 0.5}),
    dawn: Object.freeze({background: 'bg_starbase_dawn.webp', dimColor: '#160a2a', dim: 0.42}),
    day: Object.freeze({background: 'bg_starbase_day.webp', dimColor: '#0a1c3c', dim: 0.38})
});

// Gaps between rockets at the start speed. They stretch with speed, but less than the speed grows,
// so rockets come more often as the run goes on. Distances (…From) are in metres.
export const DIFFICULTY_PRESETS = Object.freeze({
    easy: Object.freeze({minGap: 230, maxGap: 340, missileFrom: 250, gatesFrom: 300, salvosFrom: 900}),
    normal: Object.freeze({minGap: 170, maxGap: 260, missileFrom: 100, gatesFrom: 150, salvosFrom: 500}),
    hard: Object.freeze({minGap: 140, maxGap: 210, missileFrom: 30, gatesFrom: 50, salvosFrom: 250})
});

export const DEFAULT_SETTINGS = Object.freeze({
    difficulty: 'normal',
    theme: 'night',
    ...DIFFICULTY_PRESETS.normal,
    debug: false,
    speed: 185,
    maxSpeed: 420,
    acceleration: 5,
    gravity: 1000,
    thrust: 2200,
    maxRise: 260,
    maxFall: 460,
    powerUpMin: 7, // seconds between power-up pickups
    powerUpMax: 13,
    hitboxInset: 2,
    storageKey: 'tesla-joyride-best',
    runsKey: 'tesla-joyride-runs',
    themeKey: 'tesla-joyride-theme'
});

export function createSettings(options = {}) {
    const difficulty = options.difficulty ?? DEFAULT_SETTINGS.difficulty;
    const preset = DIFFICULTY_PRESETS[difficulty];

    if (!preset) {
        throw new RangeError('TeslaJoyride option "difficulty" must be easy, normal or hard');
    }

    const settings = {...DEFAULT_SETTINGS, ...preset, ...options, difficulty};

    if (!Object.hasOwn(THEMES, settings.theme)) {
        throw new RangeError(`TeslaJoyride option "theme" must be one of ${Object.keys(THEMES).join(', ')}`);
    }

    for (const name of ['minGap', 'maxGap', 'speed', 'maxSpeed', 'gravity', 'thrust', 'maxRise', 'maxFall', 'powerUpMin', 'powerUpMax']) {
        validatePositiveNumber(name, settings[name]);
    }

    for (const name of ['acceleration', 'missileFrom', 'gatesFrom', 'salvosFrom']) {
        if (!Number.isFinite(settings[name]) || settings[name] < 0) {
            throw new TypeError(`TeslaJoyride option "${name}" must be zero or a finite positive number`);
        }
    }

    if (settings.maxGap < settings.minGap) {
        throw new RangeError('TeslaJoyride option "maxGap" must be at least "minGap"');
    }

    if (settings.powerUpMax < settings.powerUpMin) {
        throw new RangeError('TeslaJoyride option "powerUpMax" must be at least "powerUpMin"');
    }

    if (settings.maxSpeed < settings.speed) {
        throw new RangeError('TeslaJoyride option "maxSpeed" must be at least "speed"');
    }

    if (settings.thrust <= settings.gravity) {
        throw new RangeError('TeslaJoyride option "thrust" must be stronger than gravity');
    }

    if (!Number.isFinite(settings.hitboxInset) || settings.hitboxInset < 0 || settings.hitboxInset > 6) {
        throw new RangeError('TeslaJoyride option "hitboxInset" must be between 0 and 6 game pixels');
    }

    for (const key of ['storageKey', 'runsKey', 'themeKey']) {
        if (typeof settings[key] !== 'string' || !settings[key].trim()) {
            throw new TypeError(`TeslaJoyride option "${key}" must be a non-empty string`);
        }
    }

    return Object.freeze(settings);
}

function validatePositiveNumber(name, value) {
    if (!Number.isFinite(value) || value <= 0) {
        throw new TypeError(`TeslaJoyride option "${name}" must be a finite positive number`);
    }
}
