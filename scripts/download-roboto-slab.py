#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Download fresh Roboto Slab fonts from Google Fonts using google-webfonts-helper API.
"""

import sys
import requests
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

FONTS_DIR = Path('public/fonts')

# Direct download URLs for Roboto Slab fonts from Google Fonts CDN
ROBOTO_SLAB_FONTS = {
    'roboto-slab-300.woff2': 'https://fonts.gstatic.com/s/robotoslab/v34/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjojISmb2Rj.woff2',
    'roboto-slab-400.woff2': 'https://fonts.gstatic.com/s/robotoslab/v34/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjojISmbw.woff2',
    'roboto-slab-500.woff2': 'https://fonts.gstatic.com/s/robotoslab/v34/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjoFISmb2Rj.woff2',
    'roboto-slab-700.woff2': 'https://fonts.gstatic.com/s/robotoslab/v34/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjoaIOmb2Rj.woff2',
    'roboto-slab-variable.woff2': 'https://fonts.gstatic.com/s/robotoslab/v34/BngRUXZYTXPIvIBgJJSb6ufA5qW54A.woff2',
}

def download_font(url, filename):
    """Download a font file"""
    try:
        print(f"Downloading {filename}...", end=' ')
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Validate WOFF2
        data = response.content
        if len(data) < 48:
            print(f"✗ File too small ({len(data)} bytes)")
            return False
        
        if data[0:4] != b'wOF2':
            print("✗ Invalid WOFF2 format")
            return False
        
        # Save file
        filepath = FONTS_DIR / filename
        with open(filepath, 'wb') as f:
            f.write(data)
        
        print(f"✓ {len(data):,} bytes")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Download error: {e}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("Roboto Slab Font Downloader")
    print("=" * 60)
    print()
    
    FONTS_DIR.mkdir(exist_ok=True, parents=True)
    
    success_count = 0
    fail_count = 0
    
    for filename, url in ROBOTO_SLAB_FONTS.items():
        if download_font(url, filename):
            success_count += 1
        else:
            fail_count += 1
    
    print()
    print("=" * 60)
    print(f"✓ Successfully downloaded: {success_count} fonts")
    if fail_count > 0:
        print(f"✗ Failed: {fail_count} fonts")
    print("=" * 60)
    print()
    
    if success_count > 0:
        print("Next steps:")
        print("1. Run validation: python scripts/validate-fonts.py")
        print("2. Test in browser: npm run dev")
    
    return 0 if fail_count == 0 else 1

if __name__ == '__main__':
    sys.exit(main())