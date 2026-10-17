export function readBestScore(key, storage = getBrowserStorage()) {
    try {
        const value = Number.parseInt(storage?.getItem(key), 10);
        return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
        return 0;
    }
}

export function writeBestScore(key, value, storage = getBrowserStorage()) {
    try {
        storage?.setItem(key, String(value));
        return Boolean(storage);
    } catch {
        return false;
    }
}

export function readText(key, storage = getBrowserStorage()) {
    try {
        return storage?.getItem(key) ?? null;
    } catch {
        return null;
    }
}

export function writeText(key, value, storage = getBrowserStorage()) {
    try {
        storage?.setItem(key, value);
        return Boolean(storage);
    } catch {
        return false;
    }
}

export function isNewBestScore(score, bestScore, debug = false) {
    return !debug && score > bestScore;
}

function getBrowserStorage() {
    try {
        return globalThis.localStorage;
    } catch {
        return null;
    }
}
