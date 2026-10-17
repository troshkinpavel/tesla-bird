"""Turn the hand-made source images into game-size sprites (1 sprite px = 1 game px, drawn at 3x)."""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
PREVIEW = Path(sys.argv[3])


def load(name):
    return Image.open(SRC / name).convert('RGBA')


def drop_black_background(image):
    # Flood fill from every corner over near-black only, so dark outlines inside the art survive.
    rgb = image.convert('RGB')
    for corner in [(0, 0), (rgb.width - 1, 0), (0, rgb.height - 1), (rgb.width - 1, rgb.height - 1)]:
        ImageDraw.floodfill(rgb, corner, (255, 0, 255), thresh=28)
    data = np.array(image)
    data[(np.array(rgb) == (255, 0, 255)).all(axis=2), 3] = 0
    return Image.fromarray(data)


def clean(image, haze=40):
    data = np.array(image)
    data[data[..., 3] < haze, 3] = 0  # generator haze across the whole canvas
    return Image.fromarray(data)


def crop(image):
    return image.crop(image.getbbox())


def fit(image, size, crisp=True):
    # Pillow resizes RGBA with premultiplied alpha, so edges do not pick up the background colour.
    resized = image.resize(size, Image.Resampling.LANCZOS if image.width < size[0] * 2 else Image.Resampling.BOX)
    if not crisp:
        return resized
    data = np.array(resized)
    data[..., 3] = np.where(data[..., 3] >= 110, 255, 0)  # hard pixel-art edges
    return Image.fromarray(data)


def fit_height(image, height, **options):
    width = max(1, round(image.width * height / image.height))
    return fit(image, (width, height), **options)


def cells(image, centers, center_y, side):
    half = side // 2
    return [image.crop((x - half, center_y - half, x + half, center_y + half)) for x in centers]


def strip(frames):
    sheet = Image.new('RGBA', (sum(frame.width for frame in frames), frames[0].height))
    x = 0
    for frame in frames:
        sheet.paste(frame, (x, 0))
        x += frame.width
    return sheet


sprites = {
    'powerup_shield': fit_height(crop(clean(load('powerup_shield.png'))), 26),
    'powerup_boost': fit_height(crop(clean(drop_black_background(load('powerup_boost.webp')))), 30),
    'powerup_slowmo': fit_height(crop(clean(drop_black_background(load('powerup_slowmo.webp')))), 30),
    'shield_bubble': fit_height(crop(clean(load('shield_bubble.webp'))), 30, crisp=False),
}

explosion = clean(load('explosion.png'))
sprites['explosion_strip'] = strip([
    fit(cell, (32, 32))
    for cell in cells(explosion, [139, 371, 615, 869, 1115, 1363, 1603, 1834], 404, 260)
])

warning = clean(load('warning_missile.png'))
sprites['warning_missile'] = strip([fit(cell, (24, 24), crisp=False) for cell in cells(warning, [596, 1183], 445, 520)])

for name, sprite in sprites.items():
    sprite.save(OUT / f'{name}.png', optimize=True)
    print(name, sprite.size)

# Contact sheet at 3x on the night-sky colour, to check edges the way the game shows them.
pad = 12
width = sum(sprite.width * 3 + pad for sprite in sprites.values()) + pad
height = max(sprite.height * 3 for sprite in sprites.values()) + pad * 2
sheet = Image.new('RGBA', (width, height), (18, 22, 48, 255))
x = pad
for sprite in sprites.values():
    big = sprite.resize((sprite.width * 3, sprite.height * 3), Image.Resampling.NEAREST)
    sheet.alpha_composite(big, (x, pad))
    x += big.width + pad
sheet.save(PREVIEW)
