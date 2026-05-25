#!/usr/bin/env python3
from pathlib import Path
import os, time, zlib, shutil, subprocess
ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'source'
DIST = ROOT / 'dist'
HEADER_SIZE = 4377

def write_field(target, offset, size, value):
    data = str(value).encode('utf-8')[:size]
    target[offset:offset + len(data)] = data

def add_file(out, source_file, archive_path):
    data = source_file.read_bytes()
    archive_path = archive_path.replace('\\', '/')
    prefix, name = os.path.split(archive_path)
    header = bytearray(HEADER_SIZE)
    write_field(header, 0, 255, name)
    write_field(header, 255, 14, len(data))
    write_field(header, 269, 12, int(source_file.stat().st_mtime or time.time()))
    write_field(header, 281, 4088, prefix)
    write_field(header, 4369, 8, format(zlib.crc32(data) & 0xffffffff, '08x'))
    out.write(header)
    out.write(data)

def build_wpress():
    DIST.mkdir(parents=True, exist_ok=True)
    target = DIST / 'seusytv-premium.wpress'
    entries = [
        (SOURCE / 'package.json', 'package.json'),
        (SOURCE / 'database.sql', 'database.sql'),
    ]
    wp_content = SOURCE / 'wp-content'
    for file in sorted(wp_content.rglob('*')):
        if file.is_file():
            entries.append((file, file.relative_to(wp_content).as_posix()))
    with target.open('wb') as out:
        for source_file, archive_path in entries:
            add_file(out, source_file, archive_path)
        out.write(bytes(HEADER_SIZE))
    return target

def build_zips():
    theme_dir = SOURCE / 'wp-content/themes/seusytv-premium'
    plugin_dir = SOURCE / 'wp-content/plugins/seusytv-site-importer'
    shutil.make_archive(str(DIST / 'seusytv-premium-theme'), 'zip', theme_dir.parent, theme_dir.name)
    shutil.make_archive(str(DIST / 'seusytv-site-importer-plugin'), 'zip', plugin_dir.parent, plugin_dir.name)

if __name__ == '__main__':
    build_zips()
    wpress = build_wpress()
    print(wpress)
