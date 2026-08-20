import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

data_dir = os.path.join('website', 'data', 'aluminium')

required_files = [
    'groups.json', 'markets.json', 'levels.json', 'finishes.json',
    'applications.json', 'systems.json', 'verification.json'
]

print("=== VERIFYING SV ALUMINIUM DATA FOUNDATION (PHASE 1) ===")

for f in required_files:
    p = os.path.join(data_dir, f)
    if not os.path.exists(p):
        print(f"❌ Missing file: {p}")
        sys.exit(1)
    with open(p, 'r', encoding='utf-8') as fh:
        d = json.load(fh)
        print(f"✅ {f}: Valid JSON structure")

with open(os.path.join(data_dir, 'systems.json'), 'r', encoding='utf-8') as fh:
    sys_data = json.load(fh)
    systems = sys_data['systems']
    print(f"\nTotal systems loaded: {len(systems)} (Expected: 16)")
    assert len(systems) == 16, "Must contain exactly 16 systems"
    
    for s in systems:
        assert 'id' in s and 'code' in s and 'name' in s
        assert 'group_id' in s
        assert 'market_ids' in s
        assert 'level' in s and 'status' in s['level']
        assert 'finishes' in s
        assert 'technicalSpecs' in s and 'status' in s['technicalSpecs']
        assert 'marketing' in s
        print(f" - [{s['code']}] {s['name']} (Group: {s['group_id']} | Level: {s['level']['recommended_value']})")

with open(os.path.join(data_dir, 'groups.json'), 'r', encoding='utf-8') as fh:
    grp_data = json.load(fh)
    groups = grp_data['groups']
    print(f"\nTotal groups loaded: {len(groups)} (Expected: 5)")
    assert len(groups) == 5, "Must contain exactly 5 groups"
    for g in groups:
        print(f" - [{g['code']}] {g['name_vi']} ({len(g['system_ids'])} systems)")

print("\n🎉 ALL PHASE 1 DATA INTEGRITY TESTS PASSED 100%!")
