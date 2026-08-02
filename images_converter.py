from pathlib import Path

from PIL import Image
import pillow_avif  # noqa: F401

SOURCE = Path("/workspaces/nonnorocco/temp_images")
OUTPUT = Path("/workspaces/nonnorocco/static")

SUPPORTED = {
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".tif",
    ".tiff",
    ".gif",
}


def has_alpha(img: Image.Image) -> bool:
    if img.mode in ("RGBA", "LA"):
        return True

    if img.mode == "P":
        return "transparency" in img.info

    return False


def convert_image(path: Path):
    rel = path.relative_to(SOURCE)
    out_dir = OUTPUT / rel.parent
    out_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(path) as img:
        alpha = has_alpha(img)

        if alpha:
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        stem = out_dir / path.stem

        # WebP (good for everything)
        webp_path = stem.with_suffix(".webp")

        if alpha:
            img.save(
                webp_path,
                "WEBP",
                lossless=True,
                method=6,
            )
        else:
            img.save(
                webp_path,
                "WEBP",
                quality=82,
                method=6,
            )

        # AVIF (best for photos)
        if not alpha:
            avif_path = stem.with_suffix(".avif")
            img.save(
                avif_path,
                "AVIF",
                quality=50,      # roughly equivalent to WebP 80–85
                speed=6,         # lower = slower but smaller
            )

        print(f"✓ {path.name}")


def main():
    files = [
        p
        for p in SOURCE.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED
    ]

    print(f"Found {len(files)} images")

    for f in files:
        try:
            convert_image(f)
        except Exception as e:
            print(f"✗ {f}: {e}")

    print("Done")


if __name__ == "__main__":
    main()