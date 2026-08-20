import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('website/cokhisaovang.html', 'r', encoding='utf-8') as f:
    html = f.read()

imgs = re.findall(r'src=["\'](assets/images/[^"\']+)["\']', html)
print(f'Total local images referenced: {len(imgs)}')
missing = [img for img in imgs if not os.path.exists(os.path.join('website', img))]
if missing:
    print('Missing images:', missing)
else:
    print('All referenced images exist 100% on disk!')
