import os
import sys
import gdown

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

folders = {
    "AN VƯỢNG VILLA": "187-2RrccNjMW6UNw32a8nztUjotqgOUb",
    "Du thuyền Azura": "1IUQcRWpcupoc1LgSmEbDNCfarhPoRXMu",
    "Du thuyền Calista": "10H1z95vODnTdcCgLpYmqmKcPnuoOtZFQ",
    "du thuyền leona cruise": "1zulyXOIxL6dFwIbUALNfhFYfMXpRxV27",
    "Du thuyền Tulip Cruise": "1V4Z7fYJfo1500uP7Mjd0h8IAlNsGHx23",
    "LINH HUỆ VILLA": "1FqTIblzMmw3E_IO9H6fdAKmNY7cvXXZe",
    "THANH HÓA": "1gL5XA1yhsGykzsE4KHAcB8eLcP0p6cOc"
}

base_output = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive"
os.makedirs(base_output, exist_ok=True)

for name, fid in folders.items():
    folder_path = os.path.join(base_output, name)
    # If folder already has files, skip or download missing
    if os.path.exists(folder_path) and len(os.listdir(folder_path)) > 3:
        print(f"Skipping {name} (already has {len(os.listdir(folder_path))} files)")
        continue
    
    print(f"\nDownloading folder: {name} (ID: {fid})...")
    url = f"https://drive.google.com/drive/folders/{fid}"
    try:
        gdown.download_folder(url=url, output=folder_path, quiet=False, use_cookies=False)
        print(f"Successfully finished {name}!")
    except Exception as e:
        print(f"Notice on {name}: {e}")

print("\nALL FOLDERS DOWNLOAD CYCLE COMPLETED!")
