"""Validate documentation package data. Uses Python standard library only.
Does not approve licenses, sports technique, models or an application.
"""
from pathlib import Path
import hashlib
import json
import sys

root = Path(__file__).resolve().parents[1]
workout = json.loads((root / 'content/examples/mvp1-60min.workout.json').read_text(encoding='utf-8'))
total = sum(block['rounds'] * sum(item['workSeconds'] + item['restSeconds']
            for item in block['items']) for block in workout['blocks'])
if total != 3600 or total != workout['expectedDurationSeconds']:
    raise SystemExit(f'Invalid scheduled duration: {total}')
required = [
    'AGENTS.md', 'START_HERE.md', 'PROJECT_STATUS.md',
    'docs/product/ZERO_COST_AND_GROWTH_POLICY.md',
    'docs/product/FEATURE_COST_REVIEW.md',
    'docs/architecture/adr/0008-zero-cost-extensible.md',
    'docs/research/REMOTION_LICENSE_REVIEW.md',
]
for name in required:
    if not (root / name).is_file():
        raise SystemExit(f'Missing: {name}')
verified = 0
manifest = root / 'MANIFEST_SHA256.txt'
for line in manifest.read_text(encoding='utf-8').splitlines():
    if not line or line.startswith('#'):
        continue
    expected, name = line.split('  ', 1)
    path = (root / name).resolve()
    if root.resolve() not in path.parents or not path.is_file():
        raise SystemExit(f'Invalid manifest path: {name}')
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != expected:
        raise SystemExit(f'Hash mismatch: {name}')
    verified += 1
print(f'Duration: {total} s; manifest: {verified} files verified.')
print('Blueprint only. No 3D, sports or installed-license audit performed.')
