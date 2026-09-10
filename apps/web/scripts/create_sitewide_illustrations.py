from __future__ import annotations

import hashlib
import math
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "images" / "illustrations"
SIZE = (720, 480)
BACKGROUND = (238, 243, 255)
FRAME_COUNT = 24
FRAME_DURATION_MS = 110


def is_connected_background(pixel: tuple[int, int, int]) -> bool:
    red, green, blue = pixel
    return (
        red >= 150
        and green >= 155
        and blue >= 175
        and max(pixel) - min(pixel) <= 105
        and blue >= red - 8
    )


def flatten_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)
    pixels = image.load()
    width, height = image.size
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if visited[index] or not is_connected_background(pixels[x, y]):
            return
        visited[index] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = BACKGROUND
        if x:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    return image


def motion_frame(image: Image.Image, phase: float, seed: int) -> Image.Image:
    direction = -1 if seed % 2 else 1
    scale = 1.008 + 0.006 * (0.5 + 0.5 * math.sin(phase))
    width = round(SIZE[0] * scale)
    height = round(SIZE[1] * scale)
    resized = image.resize((width, height), Image.Resampling.LANCZOS)
    dx = direction * 2.2 * math.sin(phase)
    dy = 2.4 * math.cos(phase + (seed % 5) * 0.2)
    left = round((width - SIZE[0]) / 2 + dx)
    top = round((height - SIZE[1]) / 2 + dy)
    return resized.crop((left, top, left + SIZE[0], top + SIZE[1]))


def process(source_path: Path) -> None:
    slug = source_path.name.removesuffix("-source.png")
    flat = flatten_background(Image.open(source_path))
    flat.save(source_path, optimize=True)

    seed = int(hashlib.sha1(slug.encode("utf-8")).hexdigest()[:8], 16)
    frames = [
        motion_frame(flat, index / FRAME_COUNT * math.tau, seed)
        for index in range(FRAME_COUNT)
    ]
    frames[0].save(
        ASSET_DIR / f"{slug}.webp",
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        quality=80,
        method=4,
        minimize_size=True,
    )
    print(slug, flush=True)


if __name__ == "__main__":
    sources = sorted(ASSET_DIR.glob("*-source.png"))
    for source in sources:
        process(source)
    print(f"Created {len(sources)} shadow-free animated illustration sets.")
