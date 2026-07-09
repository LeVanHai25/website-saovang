import os, sys
sys.stdout.reconfigure(encoding='utf-8')
BASE = r'd:\Sao Vàng\Website-SaoVang\website'

files_checks = {
    'nhom-sao-vang.html': [
        ('Tab cong trinh', 'switchProjectTab'),
        ('Bang so sanh', 'Maxpro'),
        ('Budget grid', 'budget-grid'),
        ('10 ly do', 'reasons-grid'),
        ('Case study', 'Mui'),
        ('Nav Profile Nhom', 'Profile Nh'),
    ],
    'linh-vuc-nhom-kinh.html': [
        ('EPCM Engineering', 'ENGINEERING'),
        ('EPCM Construction', 'CONSTRUCTION'),
        ('8 buoc', 'Ban Giao'),
        ('Laser 3D', 'laser'),
        ('Nav ok', 'Profile Nh'),
    ],
    'phu-kien.html': [
        ('CMECH M-Treatment', 'M-Treatment'),
        ('BOGO 4D', '150kg'),
        ('DRAHO', 'DRAHO'),
        ('Cam ket chinh hang', 'Gap Doi'),
        ('Nav ok', 'Profile Nh'),
    ],
}

all_ok = True
for fname, checks in files_checks.items():
    fpath = os.path.join(BASE, fname)
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    size = len(content)
    print(f'\n=== {fname} ({size:,} chars) ===')
    for label, keyword in checks:
        found = keyword.lower() in content.lower()
        status = 'OK' if found else 'MISSING'
        if not found:
            all_ok = False
        print(f'  [{status}] {label}')

print(f'\n{"ALL PASS" if all_ok else "SOME CHECKS FAILED"}')
