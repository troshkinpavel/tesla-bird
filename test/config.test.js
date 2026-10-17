import assert from 'node:assert/strict';
import test from 'node:test';
import {DEFAULT_SETTINGS, DIFFICULTY_PRESETS, createSettings} from '../flappy-assets/script/config.js';

test('createSettings applies defaults and freezes the result', () => {
    const settings = createSettings();
    assert.equal(settings.speed, DEFAULT_SETTINGS.speed);
    assert.equal(settings.hitboxInset, 2);
    assert.equal(settings.innerColumn, 80);
    assert.equal(settings.step, 170);
    assert.equal(settings.difficulty, 'normal');
    assert.equal(settings.theme, 'night');
    assert.ok(Object.isFrozen(settings));
});

test('createSettings accepts valid overrides', () => {
    const settings = createSettings({step: 180, pipeWidth: 30, speed: 300, theme: 'day'});
    assert.equal(settings.step, 180);
    assert.equal(settings.pipeWidth, 30);
    assert.equal(settings.theme, 'day');
    assert.equal(settings.speed, 300);
});

test('difficulty presets change spacing while normal preserves the current balance', () => {
    const easy = createSettings({difficulty: 'easy'});
    const normal = createSettings({difficulty: 'normal'});
    const hard = createSettings({difficulty: 'hard'});

    assert.deepEqual(
        {step: normal.step, innerColumn: normal.innerColumn, maxGapShift: normal.maxGapShift},
        DIFFICULTY_PRESETS.normal
    );
    assert.ok(easy.step > normal.step && normal.step > hard.step);
    assert.ok(easy.innerColumn > normal.innerColumn && normal.innerColumn > hard.innerColumn);
    assert.ok(easy.maxGapShift < normal.maxGapShift && normal.maxGapShift < hard.maxGapShift);
});

test('individual options can override a difficulty preset', () => {
    const settings = createSettings({difficulty: 'easy', step: 220, innerColumn: 100});
    assert.equal(settings.difficulty, 'easy');
    assert.equal(settings.step, 220);
    assert.equal(settings.innerColumn, 100);
    assert.equal(settings.maxGapShift, 50);
});

test('createSettings rejects overlapping pipe spacing', () => {
    assert.throws(
        () => createSettings({step: 25, pipeWidth: 26}),
        /step.*pipe width/
    );
});

test('createSettings rejects unsafe or invalid values', () => {
    assert.throws(() => createSettings({innerColumn: 200}), /innerColumn/);
    assert.throws(() => createSettings({theme: 'toString'}), /theme/);
    assert.equal(createSettings({theme: 'dawn'}).theme, 'dawn');
    assert.throws(() => createSettings({gravity: 0}), /gravity/);
    assert.throws(() => createSettings({maxGapShift: 0}), /maxGapShift/);
    assert.throws(() => createSettings({jumpVelocity: 1}), /jumpVelocity/);
    assert.throws(() => createSettings({hitboxInset: 7}), /hitboxInset/);
    assert.throws(() => createSettings({storageKey: ''}), /storageKey/);
    assert.throws(() => createSettings({difficulty: 'impossible'}), /difficulty/);
});
