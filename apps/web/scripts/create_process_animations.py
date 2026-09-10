from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "images" / "process"
SIZE = (900, 600)
FRAME_COUNT = 42
DURATION_MS = 85


def cover_frame(source: Image.Image, scale: float, dx: float, dy: float) -> Image.Image:
    width = round(SIZE[0] * scale)
    height = round(SIZE[1] * scale)
    resized = source.resize((width, height), Image.Resampling.LANCZOS)
    left = round((width - SIZE[0]) / 2 + dx)
    top = round((height - SIZE[1]) / 2 + dy)
    return resized.crop((left, top, left + SIZE[0], top + SIZE[1]))


def add_quote_sheen(frame: Image.Image, progress: float) -> Image.Image:
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x = round(120 + progress * 570)
    draw.rounded_rectangle((x, 287, x + 74, 356), radius=35, fill=(255, 255, 255, 50))
    overlay = overlay.filter(ImageFilter.GaussianBlur(13))
    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def add_service_lift(frame: Image.Image, phase: float) -> Image.Image:
    strength = 1.0 + 0.025 * (0.5 + 0.5 * math.sin(phase))
    return ImageEnhance.Color(frame).enhance(strength)


def add_booking_sheen(frame: Image.Image, progress: float, phase: float) -> Image.Image:
    overlay = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    x = round(310 + progress * 330)
    for y in (154, 307):
        draw.rounded_rectangle((x, y, x + 64, y + 20), radius=10, fill=(255, 255, 255, 68))
    pulse = round(18 + 10 * (0.5 + 0.5 * math.sin(phase)))
    draw.ellipse((450 - pulse, 481 - pulse, 450 + pulse, 481 + pulse), fill=(80, 150, 255, 34))
    overlay = overlay.filter(ImageFilter.GaussianBlur(10))
    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def animate(stem: str, effect: str) -> None:
    source_path = ASSET_DIR / f"{stem}-source.png"
    source = Image.open(source_path).convert("RGB").resize(SIZE, Image.Resampling.LANCZOS)
    frames: list[Image.Image] = []

    for index in range(FRAME_COUNT):
        progress = index / FRAME_COUNT
        phase = progress * math.tau
        scale = 1.012 + 0.008 * (0.5 + 0.5 * math.sin(phase))
        dx = 2.2 * math.sin(phase)
        dy = 2.8 * math.cos(phase)
        frame = cover_frame(source, scale, dx, dy)

        if effect == "quote":
            frame = add_quote_sheen(frame, progress)
        elif effect == "services":
            frame = add_service_lift(frame, phase)
        elif effect == "booking":
            frame = add_booking_sheen(frame, progress, phase)

        frames.append(frame)

    frames[0].save(
        ASSET_DIR / f"{stem}.webp",
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        quality=84,
        method=6,
        minimize_size=True,
    )


if __name__ == "__main__":
    animate("instant-quote", "quote")
    animate("choose-service", "services")
    animate("track-booking", "booking")

