import os
import sys
import requests
import re

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect the files that were listed and download them directly
def download_google_drive_file(file_id, destination):
    URL = "https://docs.google.com/uc?export=download"
    session = requests.Session()
    response = session.get(URL, params={'id': file_id}, stream=True)
    
    token = None
    for key, value in response.cookies.items():
        if key.startswith('download_warning'):
            token = value
            break
            
    if token:
        params = {'id': file_id, 'confirm': token}
        response = session.get(URL, params=params, stream=True)
        
    CHUNK_SIZE = 32768
    with open(destination, "wb") as f:
        for chunk in response.iter_content(CHUNK_SIZE):
            if chunk:
                f.write(chunk)
    print(f"Downloaded: {os.path.basename(destination)} ({os.path.getsize(destination)} bytes)")

# Test downloading 1 file from Tulip Cruise
os.makedirs(r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive\Du thuyền Tulip Cruise", exist_ok=True)
test_dest = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive\Du thuyền Tulip Cruise\117743464053135.jpg"
download_google_drive_file("1VhHi4XG63tYDpe3OQEwj7qoFgXAektMF", test_dest)
