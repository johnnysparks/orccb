#!/usr/bin/env python3
"""Fetch Oregon M8 building-code reference snippets for raw research traceability."""
from __future__ import annotations

import re
import urllib.request
from pathlib import Path
from pypdf import PdfReader

OUT = Path('src/content/raw/m8-source-snippets-2026-04-12.md')
TMP = Path('/tmp/orccb-m8')
TMP.mkdir(parents=True, exist_ok=True)

SOURCES = {
    'psi-cib': 'https://test-takers.psiexams.com/api/content/bulletin/4132',
    'ors455-2023-archive': 'https://www.oregonlegislature.gov/bills_laws/archive/2023ors455.pdf',
    'bcd-adopted-codes': 'https://www.oregon.gov/bcd/codes-stand/Pages/adopted-codes.aspx',
    'bcd-jurisdiction-renewals': 'https://www.oregon.gov/bcd/jurisdictions/pages/renewals.aspx',
    'ccb-contractor-tools': 'https://www.oregon.gov/ccb/pages/contractor-tools.aspx',
}

PDF_PATTERNS = {
    'psi-cib': [
        'Examination Content Outline',
        'Oregon Building Codes',
        'Jobsite Safety',
        'Building Exterior Shell',
        'This test is OPEN BOOK',
        'cover laws and business practices',
    ],
    'ors455-2023-archive': [
        '455.020 Purpose; scope of application',
        'The state building code shall establish uniform performance standards',
        '455.040 State building code preempts local ordinances and rules',
        '455.050 Building permits; content',
        '455.148 Comprehensive municipal building inspection programs',
        '455.158 Verification of required license prior to issuance of permit',
    ],
}

HTML_PATTERNS = {
    'bcd-adopted-codes': [
        'Adopted codes online',
        '2025 Oregon Structural Specialty Code',
        '2023 Oregon Residential Specialty Code',
        'Interim amendments',
    ],
    'bcd-jurisdiction-renewals': [
        'renew their programs in accordance with OAR 918-020',
        'four year reporting period cycle',
    ],
    'ccb-contractor-tools': [
        'If permits are necessary to perform the work',
        'Oregon Building Codes Division',
    ],
}


def fetch(url: str, path: Path) -> None:
    with urllib.request.urlopen(url, timeout=40) as r:
        path.write_bytes(r.read())


def snippet(text: str, needle: str, radius: int = 220) -> str:
    i = text.lower().find(needle.lower())
    if i < 0:
        return '(not found)'
    s = max(0, i - radius)
    e = min(len(text), i + len(needle) + radius)
    return re.sub(r'\s+', ' ', text[s:e]).strip()


lines = ['# M8 source snippets (generated)', '', 'Date: 2026-04-12 (UTC)', '']

for sid, url in SOURCES.items():
    ext = '.pdf' if sid in PDF_PATTERNS else '.html'
    local = TMP / f'{sid}{ext}'
    fetch(url, local)

    lines.append(f'## {sid}')
    lines.append(f'URL: {url}')

    if sid in PDF_PATTERNS:
        txt = '\n'.join((p.extract_text() or '') for p in PdfReader(str(local)).pages)
        for pat in PDF_PATTERNS[sid]:
            lines.append(f'- Pattern: `{pat}`')
            lines.append(f'  - Snippet: {snippet(txt, pat)}')
    else:
        html = local.read_text(encoding='utf-8', errors='ignore')
        text = re.sub(r'<script[\s\S]*?</script>', ' ', html, flags=re.I)
        text = re.sub(r'<style[\s\S]*?</style>', ' ', text, flags=re.I)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        for pat in HTML_PATTERNS[sid]:
            lines.append(f'- Pattern: `{pat}`')
            lines.append(f'  - Snippet: {snippet(text, pat)}')

    lines.append('')

OUT.write_text('\n'.join(lines), encoding='utf-8')
print(f'Wrote {OUT}')
