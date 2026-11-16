"""Build the social share image and app icons (run from the repo root)."""
from PIL import Image, ImageDraw, ImageFont, ImageOps

CLAY = (217, 119, 87)
INK = (10, 10, 13)
BOLD = 'C:/Windows/Fonts/segoeuib.ttf'
MONO = 'C:/Windows/Fonts/consola.ttf'


def font(path, size):
    return ImageFont.truetype(path, size)


# ---- Open Graph / Twitter card: 1200x630 --------------------------------
W, H = 1200, 630
og = Image.new('RGB', (W, H), CLAY)
d = ImageDraw.Draw(og)

# Photo panel on the right, grayscale like the site's hero
photo = Image.open('assets/images/main page image.jpg').convert('L').convert('RGB')
pw, ph = 400, 550
photo = ImageOps.fit(photo, (pw, ph), method=Image.LANCZOS, centering=(0.5, 0.62))
mask = Image.new('L', (pw, ph), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, pw, ph), radius=14, fill=255)
og.paste(photo, (W - pw - 40, 40), mask)

# Name, tightly tracked like the hero
def tracked(draw, xy, text, fnt, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x

name_font = font(BOLD, 150)
tracked(d, (48, 70), 'RAHUL', name_font, INK, -6)
tracked(d, (48, 215), 'CHALLA', name_font, INK, -6)

d.text((52, 420), 'Software Engineer · AI & Backend', font=font(BOLD, 40), fill=INK)
d.text((52, 476), 'LLM inference · Distributed systems · Developer tools', font=font(BOLD, 26), fill=(60, 30, 20))
d.text((52, 560), 'RAHULCHALLA.COM  ·  SF BAY AREA', font=font(MONO, 24), fill=INK)
og.save('assets/images/og-image.jpg', quality=88, optimize=True, progressive=True)

# ---- Icons: "RC" monogram on terracotta ---------------------------------
def icon(size, radius_ratio):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    dd = ImageDraw.Draw(img)
    dd.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=CLAY)
    f = font(BOLD, int(size * 0.5))
    box = dd.textbbox((0, 0), 'RC', font=f)
    tw, th = box[2] - box[0], box[3] - box[1]
    dd.text(((size - tw) / 2 - box[0], (size - th) / 2 - box[1]), 'RC', font=f, fill=INK)
    return img

icon(180, 0).convert('RGB').save('assets/images/apple-touch-icon.png', optimize=True)  # iOS rounds corners itself
icon(512, 0.18).save('assets/images/icon-512.png', optimize=True)
icon(192, 0.18).save('assets/images/icon-192.png', optimize=True)
icon(32, 0.18).save('assets/images/favicon-32.png', optimize=True)
icon(48, 0.18).save('favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
print('done')
