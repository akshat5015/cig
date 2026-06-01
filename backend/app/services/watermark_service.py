from PIL import (
    Image,
    ImageDraw,
    ImageFont
)


def add_watermark(
    image_path,
    output_path,
    text="EventSphere"
):

    image = Image.open(image_path)

    drawable = ImageDraw.Draw(image)

    width, height = image.size

    font = ImageFont.load_default()

    text_position = (
        width - 120,
        height - 30
    )

    drawable.text(
        text_position,
        text,
        fill=(255, 255, 255),
        font=font
    )

    image.save(output_path)