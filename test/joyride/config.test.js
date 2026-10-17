import assert from 'node:assert/strict';
import test from 'node:test';
import {DEFAULT_SETTINGS, DIFFICULTY_PRESETS, createSettings} from '../../joyride/script/config.js';

test('createSettings applies defaults and freezes the result', () => {
    const settings = createSettings();
    assert.equal(settings.speed, DEFAULT_SETTINGS.speed);
    assert.equal(settings.difficulty, 'normal');
    assert.equal(settings.theme, 'night');
    assert.ok(Object.isFrozen(settings));
});

test('createSettings accepts valid overrides', () => {
    const settings = createSettings({speed: 200, thrust: 2400, theme: 'day'});
    assert.equal(settings.speed, 200);
    assert.equal(settings.thrust, 2400);
    assert.equal(settings.theme, 'day');
});

test('harder presets pack rockets closer and bring missiles, gates and salvos sooner', () => {
    const [easy, normal, hard] = ['easy', 'normal', 'hard'].map((difficulty) => createSettings({difficulty}));
    assert.equal(normal.minGap, DIFFICULTY_PRESETS.normal.minGap);
    assert.ok(easy.minGap > normal.minGap && normal.minGap > hard.minGap);
    assert.ok(easy.maxGap > normal.maxGap && normal.maxGap > hard.maxGap);
    for (const key of ['missileFrom', 'gatesFrom', 'salvosFrom']) {
        assert.ok(easy[key] > normal[key] && normal[key] > hard[key], key);
    }
});

test('createSettings rejects unsafe or invalid values', () => {
    assert.throws(() => createSettings({theme: 'toString'}), /theme/);
    assert.throws(() => createSettings({gravity: 0}), /gravity/);
    assert.throws(() => createSettings({thrust: 800}), /thrust/);
    assert.throws(() => createSettings({minGap: 300, maxGap: 200}), /maxGap/);
    assert.throws(() => createSettings({speed: 500}), /maxSpeed/);
    assert.throws(() => createSettings({acceleration: -1}), /acceleration/);
    assert.throws(() => createSettings({gatesFrom: -1}), /gatesFrom/);
    assert.throws(() => createSettings({powerUpMin: 10, powerUpMax: 5}), /powerUpMax/);
    assert.throws(() => createSettings({hitboxInset: 7}), /hitboxInset/);
    assert.throws(() => createSettings({storageKey: ''}), /storageKey/);
    assert.throws(() => createSettings({difficulty: 'impossible'}), /difficulty/);
});
