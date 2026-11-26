# Notes

- https://gitlab.com/joaommpalmeiro/template-react-vite
- https://aresluna.org/ui-style-guides/
  - https://aresluna.org/ui-style-guides/GEM%20and%20TOS/GEM%20User%20Interface%20Guidelines/661.html
  - https://aresluna.org/ui-style-guides/GEM%20and%20TOS/GEM%20User%20Interface%20Guidelines/663.html
  - https://aresluna.org/ui-style-guides/GEM%20and%20TOS/GEM%20User%20Interface%20Guidelines/image-1027.gif
- https://vega.github.io/vega-lite/examples/bar.html
- https://d3js.org/d3-scale/band#band_round
- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering

## Commands

```bash
rm -rf node_modules/ && npm install
```

```bash
npm config ls -l
```

### Clean slate

```bash
rm -rf dist/ node_modules/
```

## Snippets

```ts
/**
 * GEM VDI fill patterns (style 2, `FIS_PATTERN`), keyed by their index in the GEM pattern table.
 * Each pattern is 8 rows of 16-bit words, written in binary (MSB = leftmost pixel, 1 = foreground).
 * Source: EmuTOS `vdi/vdi_fill.c` (`OEMPAT`), https://github.com/emutos/emutos
 */
const GEM_PATTERNS = {
  // Trees (0x0202, 0x0202, 0xAAAA, 0x5050, 0x2020, 0x2020, 0xAAAA, 0x0505)
  12: [
    "0000001000000010",
    "0000001000000010",
    "1010101010101010",
    "0101000001010000",
    "0010000000100000",
    "0010000000100000",
    "1010101010101010",
    "0000010100000101",
  ],
  // Balls (0x7777, 0x9898, 0xF8F8, 0xF8F8, 0x7777, 0x8989, 0x8F8F, 0x8F8F)
  19: [
    "0111011101110111",
    "1001100010011000",
    "1111100011111000",
    "1111100011111000",
    "0111011101110111",
    "1000100110001001",
    "1000111110001111",
    "1000111110001111",
  ],
} as const satisfies Record<number, readonly string[]>;
```

```markdown
They're the tile size of a GEM pattern: 16 pixels wide and 8 rows tall. Both numbers come from how the VDI stores fill patterns in the EmuTOS source.

**Width = 16:** each row of `OEMPAT` is a `UWORD`, a 16-bit word, and the VDI fills spans one word at a time. So one row is 16 pixels, one per bit. That's why `patternToPath` pads each row's bit string to 16 characters, and why the `<pattern>` tile is `16 * PIXEL_SIZE` wide.

**Height = 8:** `OEMMSKPAT = 7`. In `st_fl_ptr`, that value becomes `patmsk`, and the fill code uses it to pick the pattern row for each screen line, roughly `y & patmsk`. A mask of 7 cycles through rows 0-7, so these patterns repeat every 8 lines. That's also why each pattern in `OEMPAT` takes 8 entries, `(fi - 8) * (pm + 1)`. It sets the tile height to `8 * PIXEL_SIZE`.

You might notice that Trees and Balls repeat each byte (`0x0202`, `0x7777`), so they're really 8×8. Not every GEM pattern does that. Cobblestones has `0x6606` and `0x8DB1`, which only line up with a 16-wide tile. Keeping 16 means any of the other patterns can be added without changing the tile logic.

Height isn't fixed across all GEM fill types. The user-defined pattern (`ROM_UD_PATRN`, mask `0x000f`) has 16 rows. If you ever add one of those, you'd derive the height from `rows.length` for each pattern rather than using the shared constant.
```
