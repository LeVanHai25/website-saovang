import os
import sys
import requests
import re
import time

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

folders = {
    "AN VƯỢNG VILLA": "187-2RrccNjMW6UNw32a8nztUjotqgOUb",
    "Biệt thự ĐÔ THÀNH VILLA": "1p74tN7Kekm11Fq0uX5kS_s7hHk0YV47L",
    "Du thuyền Azura": "1IUQcRWpcupoc1LgSmEbDNCfarhPoRXMu",
    "Du thuyền Calista": "10H1z95vODnTdcCgLpYmqmKcPnuoOtZFQ",
    "du thuyền leona cruise": "1zulyXOIxL6dFwIbUALNfhFYfMXpRxV27",
    "Du thuyền Tulip Cruise": "1V4Z7fYJfo1500uP7Mjd0h8IAlNsGHx23",
    "LINH HUỆ VILLA": "1FqTIblzMmw3E_IO9H6fdAKmNY7cvXXZe",
    "THANH HÓA": "1gL5XA1yhsGykzsE4KHAcB8eLcP0p6cOc"
}

# Explicit file mappings collected from previous gdown folder introspection
file_lists = {
    "du thuyền leona cruise": [
        ("11-FqWt48EXKzUtvpVoWhacCapC2fewNZ", "Du-thuyen-Leona-17.webp"),
        ("1qEsNiP_b50kVz2PNLrF8yGcJdzoX9btU", "leona-cruise-ha-long-1-ngay-9-1.jpg"),
        ("1Hwvo5OmTtJ5T4VlkBRBTisoUoxdeqllt", "Screenshot 2026-08-06 113626.png"),
        ("11IAcaybO7_eYRZ3FIrVNT1QneIjUfFop", "Screenshot 2026-08-06 113705.png"),
        ("1xfNz1PJBOkMEnp0oTl0mBxbnH8ILlWjK", "Screenshot 2026-08-06 113717.png"),
        ("1TQrgpA42BSA8sc7JjmVpGKPwWxOq4IBG", "Screenshot 2026-08-06 113736.png"),
        ("1dVTneFup5XgfOziDl5uRL0LVcOIJVVj_", "Screenshot 2026-08-06 113806.png"),
    ],
    "Du thuyền Tulip Cruise": [
        ("1VhHi4XG63tYDpe3OQEwj7qoFgXAektMF", "117743464053135.jpg"),
        ("1ITcKK8WsnpE_2o09DYotATb78hua1pUQ", "17743464382816.jpg"),
        ("1iiHtx8d2-BW_2Opp6_vo8OO9TB8sGqUy", "17743464384011.jpg"),
        ("1_sUF5uSv8dA2HBkN3vGt0-zes3KLJA9p", "17743464384213.jpg"),
        ("1quJledZ0Ge8VhKHmoqL3BMT4Xt4GsyrB", "17743464394575.jpg"),
        ("1Zwo7S7_eRaXlHIwJzqrRG5AtvmAxHb5u", "17743464419689.jpg"),
        ("1DqybCh3k8YZTHCQu9qGZiCBSzSBz_lP7", "17743464437000.jpg"),
        ("19_oHOWZmx-NQVljyNvGfMpFwROJx0oHk", "4593f6164fb0d812f815ed83e2d3607d.webp"),
        ("128i0RrXu8WxWqr1PaW--ovoDXxbq8_Q-", "72601412e04db35f10bd89397c749bdf.webp"),
        ("1SKvM4avH2qzMO4QkNadGnFX9zCaE-RfQ", "787b0bd1a782e00fc458a968a85e4d02.webp"),
        ("1-eYLMutnS6Hz-vsL9kIerloJTyb7FjQg", "814210040.jpg"),
        ("1OfdyBlERjh4JxMgmJv_iDkz-IaOLb9M5", "814214465.jpg"),
        ("127U7PX8dRX9tniOWoTNbgLS7Y1RRAozA", "814214466.jpg"),
        ("11zNF-uWGdsSD-VRSIWqtprCS9fMSZhKU", "814214761.jpg"),
        ("1FvVyq4WJqRaJqP0Gb9KqWqESygioeEwD", "814214767.jpg"),
        ("1xZMpLh_PDV9a0DbcNsRKoYaJhDaoJTsz", "814214769.jpg"),
        ("1iH5ag9A-di1GAXDgEZOKyZ_g6a3yFbjD", "815809780.jpg"),
        ("1OXEdie98yMCrNndcvtNlm73c9fTVRX8-", "817740894.jpg"),
        ("10CAzIzZr0WazQKt92Qwpy3w8jCdBxRqk", "817770314.jpg"),
        ("1ZrkyM-ddegymtsoJ3YV6GToZMFI5sOZf", "817770363.jpg"),
        ("1k6unCIHvpY2G0kJUcvAAK3zSW-IAoqI-", "819009688.jpg"),
        ("1wKLmB4aDGrV_yxhOB9JW5bPKBBcheqG7", "819009693.jpg"),
        ("1tJY3_O5g2aY2iqt1DqF6rrrKjl87Q1sf", "829578100.jpg"),
        ("1Cnzg4t3UEhC5dV9mgTRS3o2XKpwqDXPR", "841891470.jpg"),
        ("1j0qbfaVhvwa-ft5IYsnab3TDRtZ3h-kh", "94db0fce2afcf8eb0af476b0b093c9b7.jpg"),
        ("1MmAjL_nuabh85LjLBIGaz6pF9X3NzcAS", "c94d96b49bd84b8181b55d1f787f85a8.jpg"),
        ("1VgsU15IXW99jBFyE0tyIgGh9BsQVDvvw", "fd0aaa2f80cce2c56cf3d380baddd6a8.webp"),
    ],
    "LINH HUỆ VILLA": [
        ("16YpV_B2eMVMy0NHJofCKqLL6Crttrm8M", "504078858_1200024631821819_4297788230406310954_n.jpg"),
        ("1LGrQ_9ayOgMw11eLGDvpW5v5BrSWCXrA", "504115547_1200007231823559_3135861483801050415_n.jpg"),
        ("11U9Yqux5GYPR1HlPoD81Z1G2tUjNC650", "504169757_1200025158488433_1682140070892550157_n.jpg"),
        ("1nP1QceqDeMnZx7X_EVfy_Z3VqbmpkgRS", "504188655_1200025771821705_7427662519446095526_n.jpg"),
        ("1RcwsK9tg9i9e9D5qCYciJiJ3fYQbjqc6", "504206169_1200007208490228_3255616270990177462_n.jpg"),
        ("1XtMud0zEUI1KskEhrpMWmq-EIvbRsH7p", "504207118_1200007135156902_8994528104945645126_n.jpg"),
        ("1K_mZ0FMZL4g5lmSkQkIrmrwyVsYIJFV1", "504302239_1200023341821948_1562689908260013116_n.jpg"),
        ("1bJp8VSppPPZCNM1zzgA-ZUMFk4Q0FFTy", "504336224_1200007158490233_2269474228547031143_n.jpg"),
        ("1jWowWh1BGDj9JYf3uhWVxRG1Fun5ZOVt", "504375248_1200007191823563_8577524957491486908_n.jpg"),
        ("1oMbf6mM8bWjpoJctu6NUM1-74r2r5jXq", "504632240_1200022261822056_3708489017116146402_n.jpg"),
        ("1MHOwwti-URLr3ItCIfKoB70QulwTjxFx", "520358586_1237045501453065_3164994183015844937_n.jpg"),
        ("1U9S0Vplj0DrOoGBimCidQ9z8harRyJGi", "522473380_1236496298174652_8708196057636580309_n.jpg"),
        ("11ym3fy6vmX9rO4jcFgN8lit5CeHkLr83", "619286868_1381919173632363_3211160711098718126_n.jpg"),
        ("1K14KBb3fpgNPskU6VMAZ1_N4pHe_CKe4", "659771262_1440394827784797_5370832983640003355_n.jpg"),
        ("1FCZbNuO1yyVxdcpO-aZ35BGDIYZPhBiD", "660261697_1440394714451475_1493848790258259219_n.jpg"),
        ("1SLAZ8OtOp2SdX1ioG-tISxx64CwDa1O7", "660295965_1440394771118136_8915408593052706670_n.jpg"),
    ],
    "THANH HÓA": [
        ("1uvW38Zi3aI7hJ3_Qx1U22FLv6LzkkfY5", "480285222_1121116106379339_3192503878625435997_n.jpg"),
        ("1UIyX3m6tvwoCh9UWlRSEvfpXiuP_a_JI", "480358789_1121116213045995_1076324090988411002_n.jpg"),
        ("1eb-aEZ4IGidz9bIZ7u0Q3J-SzJUN2p3Y", "480508442_1121115783046038_795735584848785102_n.jpg"),
        ("1BbKQTeJUZqnSagjQ30-CIj9kqhH7jQFm", "480660593_1121115916379358_6938485201870120689_n.jpg"),
        ("1t5878AZsSHvnMY47pPTjq6t2DOkJgObL", "537698410_1263771675447114_4099543404000217916_n.jpg"),
        ("1tCrr0Kn4F3FIMAOmscBkOpo7uKJi88iY", "538439326_1263814208776194_5205699848917572268_n.jpg"),
        ("1MR2aDLXy1YneVXCPc01o3YxUrpxg35LL", "538916810_1263817042109244_6510746392134136914_n.jpg"),
        ("1iw2jMmwjHNq-lOWHwu4kxCtOkNAwxgdB", "539426468_1263781472112801_8328647923277251195_n.jpg"),
        ("1Ze6t4-NZ3Lp3gGI8f_jl9otiB4P0NC4w", "540001397_1263777195446562_2215832829545989346_n.jpg"),
    ]
}

def download_file(file_id, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"Already exists: {os.path.basename(dest)}")
        return True
    
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    session = requests.Session()
    try:
        r = session.get(url, stream=True, timeout=20)
        # Check for confirmation token
        token = None
        for k, v in r.cookies.items():
            if k.startswith('download_warning'):
                token = v
                break
        if token:
            r = session.get(url, params={'confirm': token}, stream=True, timeout=20)
            
        with open(dest, 'wb') as f:
            for chunk in r.iter_content(32768):
                if chunk:
                    f.write(chunk)
        print(f"Downloaded: {os.path.basename(dest)} ({os.path.getsize(dest)} bytes)")
        return True
    except Exception as e:
        print(f"Error {file_id}: {e}")
        return False

base_output = r"d:\Sao Vàng\Website-SaoVang\website\assets\images\projects_drive"

for folder_name, files in file_lists.items():
    print(f"\n==========================================")
    print(f"Downloading files for: {folder_name} ({len(files)} files)")
    folder_dir = os.path.join(base_output, folder_name)
    os.makedirs(folder_dir, exist_ok=True)
    
    for fid, fname in files:
        dest_file = os.path.join(folder_dir, fname)
        download_file(fid, dest_file)
        time.sleep(0.3)

print("\nALL FILES DOWNLOADED SUCCESSFULLY!")
