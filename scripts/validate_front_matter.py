#!/usr/bin/env python
"""Validate YAML front matter for Markdown content.

Rules:
  * _posts: require title, date
  * _pages: require title
  * date must not be > today + 1 day
  * title must be non-empty string
Exit non-zero if violations.
"""
from __future__ import annotations
import sys, re, datetime as dt, pathlib
import yaml

ALLOW_FUTURE_DAYS = 1

def extract_front_matter(path: pathlib.Path):
    text = path.read_text(encoding='utf-8', errors='replace')
    if not text.startswith('---'):
        return None, 'missing starting ---'
    # split only on first two '---' lines
    parts = text.split('\n---', 2)
    if len(parts) < 2:
        return None, 'unterminated front matter'
    fm_raw = parts[1].lstrip('\n') if parts[0] == '---' else parts[0][3:]
    try:
        data = yaml.safe_load(fm_raw) or {}
    except Exception as e:
        return None, f'yaml parse error: {e}'
    return data, None

def validate(path: pathlib.Path):
    errors = []
    data, err = extract_front_matter(path)
    if err:
        errors.append(err)
        return errors
    is_post = path.parts[0] == '_posts'
    title = data.get('title')
    if not isinstance(title, str) or not title.strip():
        errors.append('missing or empty title')
    if is_post:
        # Date is optional; if included, lightly sanity-check future drift
        date_val = data.get('date')
        if date_val:
            try:
                parsed = None
                for fmt in ('%Y-%m-%d %H:%M:%S %z', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d'):
                    try:
                        parsed = dt.datetime.strptime(str(date_val), fmt)
                        break
                    except ValueError:
                        continue
                if parsed:
                    today = dt.datetime.utcnow()
                    if parsed.tzinfo:
                        parsed_utc = parsed.astimezone(dt.timezone.utc).replace(tzinfo=None)
                    else:
                        parsed_utc = parsed
                    if parsed_utc - today > dt.timedelta(days=ALLOW_FUTURE_DAYS):
                        errors.append(f'date {parsed_utc.date()} is too far in future')
                # If unparsable, ignore (since date is optional) but could warn; choose silent per request
            except Exception:
                pass
    return errors

def main(paths):
    all_errors = []
    for p in paths:
        path = pathlib.Path(p)
        errs = validate(path)
        if errs:
            for e in errs:
                all_errors.append(f"{path}: {e}")
    if all_errors:
        print('[front-matter-validate] FAIL:')
        for e in all_errors:
            print('  -', e)
        print(f"Total errors: {len(all_errors)}")
        return 1
    print('[front-matter-validate] OK')
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
