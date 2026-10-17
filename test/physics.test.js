import assert from 'node:assert/strict';
import test from 'node:test';
import {
    advanceHorizontal,
    advanceVertical,
    constrainGapTop,
    findPipeCollision,
    formatClock,
    getBirdHitbox,
    getCharge,
    hasBoundaryCollision
} from '../flappy-assets/script/physics.js';

test('advanceVertical applies gravity using one deterministic step', () => {
    assert.deepEqual(advanceVertical(100, -500, 1800, 0.1), {
        position: 68,
        velocity: -320
    });
});

test('horizontal motion moves left at constant speed', () => {
    assert.equal(advanceHorizontal(300, 115, 0.5), 242.5);
});

test('bird hitbox is inset from the visible sprite', () => {
    assert.deepEqual(getBirdHitbox({x: 100, y: 50, width: 67, height: 47, inset: 5}), {
        left: 105,
        right: 162,
        top: 55,
        bottom: 92
    });
});

test('boundary collision uses the inset hitbox', () => {
    assert.equal(hasBoundaryCollision({top: 1, bottom: 99}, 100), false);
    assert.equal(hasBoundaryCollision({top: 0, bottom: 90}, 100), true);
    assert.equal(hasBoundaryCollision({top: 10, bottom: 100}, 100), true);
});

test('pipe collision distinguishes upper, lower and safe gap', () => {
    const upper = {name: 'upper'};
    const lower = {name: 'lower'};
    const pipe = {x: 100, gapTop: 80, gapSize: 120, upper, lower};

    assert.equal(
        findPipeCollision({left: 110, right: 150, top: 70, bottom: 110}, [pipe], 100)?.section,
        upper
    );
    assert.equal(
        findPipeCollision({left: 110, right: 150, top: 100, bottom: 210}, [pipe], 100)?.section,
        lower
    );
    assert.equal(
        findPipeCollision({left: 110, right: 150, top: 90, bottom: 190}, [pipe], 100),
        null
    );
});

test('adjacent pipe gaps cannot jump farther than the configured shift', () => {
    assert.equal(constrainGapTop(300, 50, 400, 150, 90), 240);
    assert.equal(constrainGapTop(20, 50, 400, 150, 90), 60);
    assert.equal(constrainGapTop(180, 50, 400, 150, 90), 180);
});

test('the first pipe may use the full safe vertical range', () => {
    assert.equal(constrainGapTop(300, 50, 400, undefined, 90), 300);
    assert.equal(constrainGapTop(20, 50, 400, undefined, 90), 50);
});

test('charge steps every 10 points and caps at full', () => {
    assert.deepEqual([0, 9, 10, 19, 20, 30, 39, 40, 99].map(getCharge), [0, 0, 25, 25, 50, 75, 75, 100, 100]);
});

test('mission clock formats time alive as HH:MM:SS', () => {
    assert.equal(formatClock(0), '00:00:00');
    assert.equal(formatClock(64.9), '00:01:04');
    assert.equal(formatClock(3725), '01:02:05');
});
