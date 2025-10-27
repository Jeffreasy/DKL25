#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix Roboto Slab fonts by downloading from Google Fonts API.
"""

import sys
import re
import requests
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

FONTS_DIR = Path('public/fonts')

def get_font_url_from_css(family, weight):
    """Get WOFF2 URL from Google Fonts CSS"""
    # URL encode family name
    family_encoded = family.replace(' ', '+')
    css_url = f'https://fonts.googleapis.com/css2?family={family_encoded}:wght@{weight}&display=swap'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(css_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Extract WOFF2 URL
        match = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', response.text)
        if match:
            return match.group(1)
        
    except Exception as e:
        print(f"Error fetching CSS: {e}")
    
    return None

def get_variable_font_url(family):
    """Get variable font URL"""
    family_encoded = family.replace(' ', '+')
    css_url = f'https://fonts.googleapis.com/css2?family={family_encoded}:wght@100..900&display=swap'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(css_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        match = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', response.text)
        if match:
            return match.group(1)
        
    except Exception as e:
        print(f"Error fetching variable font CSS: {e}")
    
    return None

def download_font(url, filename):
    """Download and validate font"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        data = response.content
        
        # Validate WOFF2
        if len(data) < 48:
            return False, f"File too small ({len(data)} bytes)"
        
        if data[0:4] != b'wOF2':
            return False, "Invalid WOFF2 format"
        
        # Save file
        filepath = FONTS_DIR / filename
        with open(filepath, 'wb') as f:
            f.write(data)
        
        return True, f"{len(data):,} bytes"
        
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 60)
    print("Roboto Slab Font Fixer")
    print("=" * 60)
    print()
    
    FONTS_DIR.mkdir(exist_ok=True, parents=True)
    
    # Font weights to download
    fonts_to_download = [
        ('Roboto Slab', '300', 'roboto-slab-300.woff2'),
        ('Roboto Slab', '400', 'roboto-slab-400.woff2'),
        ('Roboto Slab', '500', 'roboto-slab-500.woff2'),
        ('Roboto Slab', '700', 'roboto-slab-700.woff2'),
    ]
    
    success_count = 0
    fail_count = 0
    
    # Download static weights
    for family, weight, filename in fonts_to_download:
        print(f"Processing {filename}...")
        print(f"  Fetching URL from Google Fonts API...", end=' ')
        
        url = get_font_url_from_css(family, weight)
        
        if not url:
            print("✗ Could not get font URL")
            fail_count += 1
            continue
        
        print("✓")
        print(f"  Downloading...", end=' ')
        
        success, message = download_font(url, filename)
        
        if success:
            print(f"✓ {message}")
            success_count += 1
        else:
            print(f"✗ {message}")
            fail_count += 1
        
        print()
    
    # Download variable font
    print("Processing roboto-slab-variable.woff2...")
    print("  Fetching URL from Google Fonts API...", end=' ')
    
    var_url = get_variable_font_url('Roboto Slab')
    
    if var_url:
        print("✓")
        print("  Downloading...", end=' ')
        
        success, message = download_font(var_url, 'roboto-slab-variable.woff2')
        
        if success:
            print(f"✓ {message}")
            success_count += 1
        else:
            print(f"✗ {message}")
            fail_count += 1
    else:
        print("✗ Could not get font URL")
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
        print("1. Validate: python scripts/validate-fonts.py")
        print("2. Test: npm run dev")
    
    return 0 if fail_count == 0 else 1

if __name__ == '__main__':
    sys.exit(main())