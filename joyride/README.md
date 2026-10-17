# Tesla Joyride

A Jetpack-Joyride-style runner built from the [Tesla Bird](../README.md) assets: the Roadster
flies along a Starbase track and dodges floating Starships and incoming
missiles. It uses vanilla JavaScript and a single `<canvas>`.

<p align="center">
  <a href="https://troshkinpavel.github.io/tesla-bird/joyride/"><strong>▶ Play in your browser</strong></a>
</p>

## Controls

| Action | Mouse / touch | Keyboard |
| --- | --- | --- |
| Start a run | Press | Space, Arrow Up or W |
| Fly up | Hold | Hold Space, Arrow Up or W |
| Fall | Release | Release the key |
| Restart after a crash | Click the play button | Space |

## How to play

- Hold to fire the thrusters. Release and gravity pulls the car down.
- The ceiling and the track are safe, so you can drive along them.
- Rockets float in 8 orientations. After 150 m some of them spin, and they get longer as you go.
- From 150 m, **gates** appear: one rocket hangs from the ceiling and one stands on the track. Fly through the opening.
- From 100 m, a crosshair on the right edge follows your height. When it turns red and blinks,
  the line is locked and a missile flies in along it. From 500 m, a second crosshair sometimes tracks a line
  above or below you (a salvo).
- The run speeds up over time, and rockets come more often. The score is distance in metres.
  Charge goes up 25% every 750 m (FULL at 3000 m).

The distances above are for normal difficulty. Easy starts them later and hard starts them sooner.

## Extra life

Every run starts with one extra life, shown as a car icon under the run counter. The first hit
that would end the run destroys the rocket instead and calls off the missile warnings. You then blink through
rockets for 2 s. The next hit ends the run. A shield or a boost protects you first, so it doesn't use up the life.

## Power-ups

A pickup floats in every 7–13 seconds. Fly into it to switch it on.

| Pickup | Effect |
| --- | --- |
| Shield (blue badge) | Takes one hit. The rocket you hit is destroyed, and you blink through rockets for 1.2 s. |
| Boost (yellow battery) | 3 s at 2.2× speed on autopilot. You smash every rocket you touch, and no missiles launch. |
| Slow-mo (blue hourglass) | 6 s at 55% world speed, including missiles. |

## Run locally

Serve the repository root, not this folder, because the images are shared with Tesla Bird in
`../flappy-assets/image/`:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173/joyride/>. `?debug=true` shows hitboxes and turns off crashes.
`?theme=night|dawn|day` picks a theme.

Run these commands from the repository root:

| Command | What it does |
| --- | --- |
| `npm test` | Runs the unit tests of both games, including `test/joyride/`. |
| `npm run build` | Bundles both games. For this game, `node scripts/build.mjs joyride` bundles `joyride/script/*.js` and `joyride/style/styles.css` into hashed files that `joyride/index.html` loads. |
| `npm run check` | Runs the tests, then the build. |

After you change a file in `joyride/script/` or `joyride/style/`, run `npm run build`.

### Sprites

The power-up, shield, explosion and missile-warning sprites are made from the large originals in
[`art-src/`](art-src). To remake them after you change an original, run this from the repository root:

```sh
python3 scripts/make_sprites.py joyride/art-src flappy-assets/image sprites-preview.png
```

The script needs Pillow and NumPy. It removes backgrounds and canvas haze, crops the art, and shrinks it to game size.
`sprites-preview.png` shows the results at 3× on a dark background.

The tuning values (speed, thrust, gravity, rocket gaps, missile start distance) are in
[`config.js`](script/config.js).
