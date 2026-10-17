export function advanceVertical(position, velocity, gravity, deltaSeconds) {
    const nextVelocity = velocity + gravity * deltaSeconds;
    return {
        position: position + nextVelocity * deltaSeconds,
        velocity: nextVelocity
    };
}

export function advanceHorizontal(position, speed, deltaSeconds) {
    return position - speed * deltaSeconds;
}

export function getBirdHitbox({x, y, width, height, inset}) {
    const horizontalInset = Math.min(inset, width / 2);
    const verticalInset = Math.min(inset, height / 2);

    return {
        left: x + horizontalInset,
        right: x + width - horizontalInset,
        top: y + verticalInset,
        bottom: y + height - verticalInset
    };
}

export function hasBoundaryCollision(hitbox, playableBottom) {
    return hitbox.top <= 0 || hitbox.bottom >= playableBottom;
}

export function findPipeCollision(hitbox, pipes, pipeWidth) {
    for (const pipe of pipes) {
        const overlapsHorizontally = hitbox.right >= pipe.x && hitbox.left <= pipe.x + pipeWidth;
        if (!overlapsHorizontally) continue;

        if (hitbox.top <= pipe.gapTop) {
            return {pipe, section: pipe.upper};
        }

        if (hitbox.bottom >= pipe.gapTop + pipe.gapSize) {
            return {pipe, section: pipe.lower};
        }
    }

    return null;
}

export function constrainGapTop(candidate, minimum, maximum, previousGapTop, maxShift) {
    let allowedMinimum = minimum;
    let allowedMaximum = maximum;

    if (Number.isFinite(previousGapTop)) {
        allowedMinimum = Math.max(allowedMinimum, previousGapTop - maxShift);
        allowedMaximum = Math.min(allowedMaximum, previousGapTop + maxShift);
    }

    return Math.min(allowedMaximum, Math.max(allowedMinimum, candidate));
}

// Charge replaces medals: 10 = 25%, 20 = 50%, 30 = 75%, 40+ = 100%.
export function getCharge(score) {
    return Math.min(4, Math.floor(score / 10)) * 25;
}

export function formatClock(seconds) {
    const total = Math.floor(seconds);
    return [total / 3600, (total % 3600) / 60, total % 60]
        .map((part) => String(Math.floor(part)).padStart(2, '0'))
        .join(':');
}
