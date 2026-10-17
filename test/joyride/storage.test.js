import assert from 'node:assert/strict';
import test from 'node:test';
import {isNewBestScore, readBestScore, readText, writeBestScore, writeText} from '../../joyride/script/storage.js';

function createStorage(initialValue = null) {
    let value = initialValue;
    return {
        getItem: () => value,
        setItem: (_key, nextValue) => {
            value = nextValue;
        }
    };
}

test('best score can be stored and restored', () => {
    const storage = createStorage();
    assert.equal(writeBestScore('score', 42, storage), true);
    assert.equal(readBestScore('score', storage), 42);
});

test('invalid and unavailable storage falls back safely', () => {
    assert.equal(readBestScore('score', createStorage('invalid')), 0);
    assert.equal(readBestScore('score', null), 0);
    assert.equal(writeBestScore('score', 10, null), false);
});

test('debug scores never become a new persisted best', () => {
    assert.equal(isNewBestScore(50, 10, true), false);
    assert.equal(isNewBestScore(50, 10, false), true);
    assert.equal(isNewBestScore(10, 10, false), false);
});

test('text settings round-trip and fall back to null', () => {
    const storage = createStorage();
    assert.equal(readText('theme', storage), null);
    assert.equal(writeText('theme', 'day', storage), true);
    assert.equal(readText('theme', storage), 'day');
    assert.equal(readText('theme', null), null);
    assert.equal(writeText('theme', 'day', null), false);
});
