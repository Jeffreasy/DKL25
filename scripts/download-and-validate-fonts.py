#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Download fresh fonts from Google Fonts and validate them.
This fixes the "OTS parsing error: invalid sfntVersion" issue.
"""

import os
import sys
import requests
from pathlib import Path

# Fix Windows console encoding issues
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Font configuration
FONTS = [
    {
        'family': 'Roboto',
        'weights': ['300', '400', '500', '700'],
        'files': {
            '300': 'roboto-300.woff2',
            '400': 'roboto.woff2',
            '500': 'roboto-500.woff2',
            '700': 'roboto-700.woff2',
        }
    },
    {
        'family': 'Roboto+Slab',
        'weights': ['300', '400', '500', '700'],
        'files': {
            '300': 'roboto-slab-300.woff2',
            '400': 'roboto-slab-400.woff2',
            '500': 'roboto-slab-500.woff2',
            '700': 'roboto-slab-700.woff2',
        }
    }
]

FONTS_DIR = Path('public/fonts')
BACKUP_DIR = Path('public/fonts-backup')

def download_font(family, weight):
    """Download a font from Google Fonts API"""
    url = f'https://fonts.googleapis.com/css2?family={family}:wght@{weight}&display=swap'
    
    # Request with user-agent to get WOFF2 format
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        # Get CSS file
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        css_content = response.text
        
        # Extract WOFF2 URL from CSS
        import re
        match = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', css_content)
        
        if not match:
            print(f"  ✗ Could not find WOFF2 URL in CSS for {family} {weight}")
            return None
        
        font_url = match.group(1)
        
        # Download the font file
        font_response = requests.get(font_url)
        font_response.raise_for_status()
        
        return font_response.content
        
    except Exception as e:
        print(f"  ✗ Error downloading {family} {weight}: {e}")
        return None

def validate_woff2(data):
    """Basic WOFF2 validation - check magic number"""
    if len(data) < 4:
        return False
    
    # WOFF2 magic number: 0x774F4632 ("wOF2")
    magic = data[0:4]
    return magic == b'wOF2'

def backup_existing_fonts():
    """Backup existing fonts before replacing"""
    if not FONTS_DIR.exists():
        return
    
    BACKUP_DIR.mkdir(exist_ok=True)
    
    print("Backing up existing fonts...")
    for font_file in FONTS_DIR.glob('*.woff2'):
        backup_path = BACKUP_DIR / font_file.name
        import shutil
        shutil.copy2(font_file, backup_path)
        print(f"  ✓ Backed up: {font_file.name}")

def main():
    print("=" * 60)
    print("Google Fonts Downloader & Validator")
    print("=" * 60)
    print()
    
    # Create fonts directory
    FONTS_DIR.mkdir(exist_ok=True, parents=True)
    
    # Backup existing fonts
    backup_existing_fonts()
    print()
    
    total_downloaded = 0
    total_failed = 0
    
    for font_config in FONTS:
        family = font_config['family']
        family_display = family.replace('+', ' ')
        print(f"Downloading {family_display}...")
        
        for weight in font_config['weights']:
            filename = font_config['files'].get(weight)
            if not filename:
                continue
            
            print(f"  Weight {weight}...", end=' ')
            
            font_data = download_font(family, weight)
            
            if font_data:
                # Validate WOFF2
                if validate_woff2(font_data):
                    # Save font file
                    filepath = FONTS_DIR / filename
                    with open(filepath, 'wb') as f:
                        f.write(font_data)
                    
                    print(f"✓ Downloaded and validated ({len(font_data)} bytes)")
                    total_downloaded += 1
                else:
                    print("✗ Invalid WOFF2 format")
                    total_failed += 1
            else:
                total_failed += 1
        
        print()
    
    # Download variable font separately
    print("Downloading Roboto Slab Variable...")
    var_url = 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    try:
        response = requests.get(var_url, headers=headers)
        response.raise_for_status()
        
        import re
        match = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)', response.text)
        
        if match:
            font_response = requests.get(match.group(1))
            font_response.raise_for_status()
            
            if validate_woff2(font_response.content):
                filepath = FONTS_DIR / 'roboto-slab-variable.woff2'
                with open(filepath, 'wb') as f:
                    f.write(font_response.content)
                print(f"  ✓ Downloaded variable font ({len(font_response.content)} bytes)")
                total_downloaded += 1
            else:
                print("  ✗ Invalid WOFF2 format")
                total_failed += 1
    except Exception as e:
        print(f"  ✗ Error: {e}")
        total_failed += 1
    
    print()
    print("=" * 60)
    print(f"✓ Downloaded: {total_downloaded} fonts")
    if total_failed > 0:
        print(f"✗ Failed: {total_failed} fonts")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Test your application: npm run dev")
    print("2. Check browser console for font errors")
    print("3. If issues persist, check src/index.css font paths")

if __name__ == '__main__':
    main()