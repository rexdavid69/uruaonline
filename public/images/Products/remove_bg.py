from PIL import Image

# Open the PNG file
img = Image.open("global reach.png").convert("RGBA")

# Pick the background color (from the top-left pixel)
bg_color = img.getpixel((0, 0))

datas = img.getdata()
new_data = []

for item in datas:
    # Compare each pixel with the background color
    if abs(item[0] - bg_color[0]) < 30 and abs(item[1] - bg_color[1]) < 30 and abs(item[2] - bg_color[2]) < 30:
        # If close enough to background, make transparent
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

img.putdata(new_data)
img.save("output.png", "PNG")
print("Background removed! Saved as output.png")
