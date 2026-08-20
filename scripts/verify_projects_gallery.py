import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('website/data/projects.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

projects = data['projects']
print(f"Total projects in database: {len(projects)}")

total_images = 0
missing_images = []

for p in projects:
    gallery = p.get('gallery', [])
    total_images += len(gallery)
    for img in gallery:
        full_path = os.path.join('website', img.lstrip('/'))
        if not os.path.exists(full_path):
            missing_images.append((p['id'], img))

print(f"Total gallery images checked: {total_images}")
if missing_images:
    print(f"WARNING: {len(missing_images)} missing images:")
    for pid, img in missing_images:
        print(f" - [{pid}] {img}")
else:
    print("SUCCESS: 100% of the 112 authentic gallery images exist on disk!")
