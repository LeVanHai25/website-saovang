try:
    from PIL import Image as PILImage
    print("Pillow is installed")
except ImportError:
    print("Pillow is NOT installed")
