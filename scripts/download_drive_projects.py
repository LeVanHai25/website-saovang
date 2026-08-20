import os
import sys
import gdown

os.environ["PYTHONIOENCODING"] = "utf-8"
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

folder_url = "https://drive.google.com/drive/folders/1ZC2ca6UvysSqCjVsdAWOplrtJnIb9195"
output_dir = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive"

os.makedirs(output_dir, exist_ok=True)
print(f"Starting download from Google Drive to: {output_dir}")

try:
    gdown.download_folder(url=folder_url, output=output_dir, quiet=False, use_cookies=False)
    print("Download completed successfully!")
except Exception as e:
    print(f"Error downloading folder: {e}")
