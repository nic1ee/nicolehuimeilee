"""Build preview/ from dist/: same files, with index.html reduced to body content for hosted previews."""
import re, shutil, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
dist, out = root / 'dist', root / 'preview'
shutil.rmtree(out, ignore_errors=True)
shutil.copytree(dist, out)
html = (dist / 'index.html').read_text()
head = re.search(r'<head>(.*)</head>', html, re.S).group(1)
body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
keep = [l for l in head.splitlines() if re.search(r'<title>|rel="stylesheet"|<script|rel="icon"|name="description"', l)]
(out / 'index.html').write_text('\n'.join(keep) + '\n' + body.strip() + '\n')
print((out / 'index.html').read_text())
