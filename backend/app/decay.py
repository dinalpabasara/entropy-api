import random
from typing import Optional

DECAY_CHARS = "!@#$%^&*()_+~`{}|[]\\;':\",./<>?"
NOISE_SET = DECAY_CHARS + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


def decay_text(content: str, health_percentage: int) -> str:
    if health_percentage >= 100:
        return content
    if health_percentage <= 0:
        return ""

    chars = list(content)
    corruption_ratio = 1 - (health_percentage / 100)
    num_corrupt = max(1, int(len(chars) * corruption_ratio * 0.6))

    for _ in range(num_corrupt):
        idx = random.randint(0, len(chars) - 1)
        if chars[idx].isspace():
            continue
        chars[idx] = random.choice(DECAY_CHARS)

    return "".join(chars)


def decay_coordinates(lat: float, lng: float, health_percentage: int) -> tuple[float, float]:
    if health_percentage >= 100:
        return (lat, lng)
    drift = (100 - health_percentage) / 100 * 0.1
    lat += random.uniform(-drift, drift)
    lng += random.uniform(-drift, drift)
    return (round(lat, 6), round(lng, 6))


def corruption_ratio(health_percentage: int) -> float:
    return max(0.0, 1.0 - (health_percentage / 100.0))


def generate_decay_preview(content: str, health_percentage: int) -> str:
    if health_percentage <= 0:
        return "<DATA EXPIRED>"
    if health_percentage >= 100:
        return content[:100] + ("..." if len(content) > 100 else "")

    preview = decay_text(content[:100], health_percentage)
    return preview + ("..." if len(content) > 100 else "")
