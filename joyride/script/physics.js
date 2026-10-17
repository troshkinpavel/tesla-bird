import {FULL_CHARGE_METRES} from './config.js';

// Rocket sprite stack (game px): nose, N tiled bodies, engine. The hull is 26 px wide.
export const ROCKET = Object.freeze({nose: 57, body: 15, engine: 31, hull: 26});

export function advanceVertical(position, velocity, acceleration, deltaSeconds, minVelocity = -Infinity, maxVelocity = Infinity) {
    const nextVelocity = Math.min(maxVelocity, Math.max(minVelocity, velocity + acceleration * deltaSeconds));
    return {
        position: position + nextVelocity * deltaSeconds,
        velocity: nextVelocity
    };
}

export function advanceHorizontal(position, speed, deltaSeconds) {
    return position - speed * deltaSeconds;
}

export function getCarHitbox({x, y, width, height, inset}) {
    const horizontalInset = Math.min(inset, width / 2);
    const verticalInset = Math.min(inset, height / 2);

    return {
        left: x + horizontalInset,
        right: x + width - horizontalInset,
        top: y + verticalInset,
        bottom: y + height - verticalInset
    };
}

export function getRocketLength(bodies) {
    return ROCKET.nose + bodies * ROCKET.body + ROCKET.engine;
}

// Separating-axis test: axis-aligned box vs. a rectangle centred at (x, y), rotated by `angle` (0 = nose up).
export function boxHitsRotatedRect(box, {x, y, halfWidth, halfLength, angle}) {
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    const boxHalfWidth = (box.right - box.left) / 2;
    const boxHalfHeight = (box.bottom - box.top) / 2;
    const dx = x - (box.left + box.right) / 2;
    const dy = y - (box.top + box.bottom) / 2;

    if (Math.abs(dx) > boxHalfWidth + cos * halfWidth + sin * halfLength) return false;
    if (Math.abs(dy) > boxHalfHeight + sin * halfWidth + cos * halfLength) return false;

    const along = Math.abs(-dx * Math.sin(angle) + dy * Math.cos(angle));
    const across = Math.abs(dx * Math.cos(angle) + dy * Math.sin(angle));
    if (across > halfWidth + boxHalfWidth * cos + boxHalfHeight * sin) return false;
    return along <= halfLength + boxHalfWidth * sin + boxHalfHeight * cos;
}

// Charge replaces medals: every quarter of FULL_CHARGE_METRES adds 25%.
export function getCharge(metres) {
    return Math.min(4, Math.floor(metres / (FULL_CHARGE_METRES / 4))) * 25;
}

export function formatClock(seconds) {
    const total = Math.floor(seconds);
    return [total / 3600, (total % 3600) / 60, total % 60]
        .map((part) => String(Math.floor(part)).padStart(2, '0'))
        .join(':');
}
