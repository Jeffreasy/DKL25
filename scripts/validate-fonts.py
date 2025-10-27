#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Validate existing WOFF2 font files.
"""

import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

FONTS_DIR = Path('public/fonts')

def validate_woff2(filepath):
    """Validate a WOFF2 file by checking its magic number and basic structure"""
    try:
        with open(filepath, 'rb') as f:
            data = f.read()
        
        if len(data) < 48:  # WOFF2 header is at least 48 bytes
            return False, "File too small"
        
        # Check WOFF2 magic number: 0x774F4632 ("wOF2")
        magic = data[0:4]
        if magic != b'wOF2':
            actual_magic = ' '.join(f'{b:02x}' for b in magic)
            return False, f"Invalid magic number: {actual_magic} (expected 77 4F 46 32)"
        
        # Check flavor (should be valid)
        flavor = data[4:8]
        valid_flavors = [
            b'\x00\x01\x00\x00',  # TrueType
            b'OTTO',               # CFF
            b'true',               # TrueType (alternative)
        ]
        
        if flavor not in valid_flavors:
            flavor_hex = ' '.join(f'{b:02x}' for b in flavor)
            return False, f"Invalid flavor: {flavor_hex}"
        
        return True, f"Valid WOFF2 ({len(data)} bytes)"
        
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 60)
    print("WOFF2 Font Validator")
    print("=" * 60)
    print()
    
    if not FONTS_DIR.exists():
        print(f"Error: Fonts directory not found: {FONTS_DIR}")
        return 1
    
    font_files = list(FONTS_DIR.glob('*.woff2'))
    
    if not font_files:
        print(f"No WOFF2 files found in {FONTS_DIR}")
        return 1
    
    print(f"Found {len(font_files)} font files\n")
    
    valid_count = 0
    invalid_count = 0
    
    for font_file in sorted(font_files):
        is_valid, message = validate_woff2(font_file)
        
        status = "✓" if is_valid else "✗"
        print(f"{status} {font_file.name}")
        print(f"  {message}")
        
        if is_valid:
            valid_count += 1
        else:
            invalid_count += 1
    
    print()
    print("=" * 60)
    print(f"Valid:   {valid_count}")
    print(f"Invalid: {invalid_count}")
    print("=" * 60)
    
    if invalid_count > 0:
        print("\nTo fix invalid fonts:")
        print("1. Delete the corrupt font files")
        print("2. Download fresh fonts from Google Fonts")
        print("3. Or use: python scripts/download-fresh-fonts.py")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())