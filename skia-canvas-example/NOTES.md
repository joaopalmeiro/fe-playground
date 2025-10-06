# Notes

- https://github.com/joaopalmeiro/template-ts-tsx-script
- https://github.com/samizdatco/skia-canvas:
  - "Skia Canvas is a Node.js implementation of the HTML Canvas drawing API for both on- and off-screen rendering. Since it uses Google's Skia graphics engine, its output is very similar to Chrome's `<canvas>` element — though it's also capable of things the browser's Canvas still can't achieve."
  - https://www.npmjs.com/package/skia-canvas
  - https://skia-canvas.org/

## Commands

```bash
npm install -D \
@biomejs/biome \
npm-run-all2 \
sort-package-json \
tsx
```

```bash
npm install -D "@types/node@$(cat .nvmrc | cut -d . -f 1-2)"
```

```bash
rm -rf node_modules/ && npm install
```
