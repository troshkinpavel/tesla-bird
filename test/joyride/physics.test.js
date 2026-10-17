import assert from 'node:assert/strict';
import test from 'node:test';
import {
    advanceHorizontal,
    advanceVertical,
    boxHitsRotatedRect,
    formatClock,
    getCarHitbox,
    getCharge,
    getRocketLength
} from '../../joyride/script/physics.js';

test('advanceVertical applies acceleration using one deterministic step', () => {
    assert.deepEqual(advanceVertical(100, -500, 1800, 0.1), {position: 68, velocity: -320});
});

test('advanceVertical clamps velocity to the rise and fall limits', () => {
    assert.deepEqual(advanceVertical(100, -200, -1100, 0.1, -240, 420), {position: 76, velocity: -240});
    assert.deepEqual(advanceVertical(100, 400, 900, 0.1, -240, 420), {position: 142, velocity: 420});
});

test('horizontal motion moves left at constant speed', () => {
    assert.equal(advanceHorizontal(300, 115, 0.5), 242.5);
});

test('car hitbox is inset from the visible sprite', () => {
    assert.deepEqual(getCarHitbox({x: 100, y: 50, width: 67, height: 47, inset: 5}), {
        left: 105, right: 162, top: 55, bottom: 92
    });
});

test('rocket length stacks nose, bodies and engine', () => {
    assert.equal(getRocketLength(0), 88);
    assert.equal(getRocketLength(3), 133);
});

test('rotated rocket collision follows the hull, not its bounding box', () => {
    const box = {left: 0, right: 10, top: 0, bottom: 10};
    const upright = {x: 5, y: 50, halfWidth: 10, halfLength: 44, angle: 0};
    assert.equal(boxHitsRotatedRect(box, upright), true);
    assert.equal(boxHitsRotatedRect(box, {...upright, y: 60}), false);

    const sideways = {...upright, x: 50, y: 5, angle: Math.PI / 2};
    assert.equal(boxHitsRotatedRect(box, sideways), true);
    assert.equal(boxHitsRotatedRect(box, {...sideways, x: 60}), false);

    // Diagonal rocket: the box sits inside its bounding box but beside the hull.
    const diagonal = {x: 40, y: 40, halfWidth: 5, halfLength: 40, angle: Math.PI / 4};
    assert.equal(boxHitsRotatedRect({left: 60, right: 70, top: 60, bottom: 70}, diagonal), false);
    assert.equal(boxHitsRotatedRect({left: 60, right: 70, top: 10, bottom: 20}, diagonal), true);
});

test('charge steps every 750 metres and caps at full', () => {
    assert.deepEqual([0, 749, 750, 1499, 1500, 2250, 2999, 3000, 9000].map(getCharge), [0, 0, 25, 25, 50, 75, 75, 100, 100]);
});

test('mission clock formats time alive as HH:MM:SS', () => {
    assert.equal(formatClock(0), '00:00:00');
    assert.equal(formatClock(64.9), '00:01:04');
    assert.equal(formatClock(3725), '01:02:05');
});
