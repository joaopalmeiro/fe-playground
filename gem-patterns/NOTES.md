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

```c
static const UWORD OEMMSKPAT = 7;
static const UWORD OEMPAT[128] = {
    /* Brick */
    0xFFFF, 0x8080, 0x8080, 0x8080, 0xFFFF, 0x0808, 0x0808, 0x0808,
    /* Diagonal Bricks */
    0x2020, 0x4040, 0x8080, 0x4141, 0x2222, 0x1414, 0x0808, 0x1010,
    /* Grass */
    0x0000, 0x0000, 0x1010, 0x2828, 0x0000, 0x0000, 0x0101, 0x8282,
    /* Trees */
    0x0202, 0x0202, 0xAAAA, 0x5050, 0x2020, 0x2020, 0xAAAA, 0x0505,
    /* Dashed x's */
    0x4040, 0x8080, 0x0000, 0x0808, 0x0404, 0x0202, 0x0000, 0x2020,
    /* Cobble Stones */
    0x6606, 0xC6C6, 0xD8D8, 0x1818, 0x8181, 0x8DB1, 0x0C33, 0x6000,
    /* Sand */
    0x0000, 0x0000, 0x0400, 0x0000, 0x0010, 0x0000, 0x8000, 0x0000,
    /* Rough Weave */
    0xF8F8, 0x6C6C, 0xC6C6, 0x8F8F, 0x1F1F, 0x3636, 0x6363, 0xF1F1,
    /* Quilt */
    0xAAAA, 0x0000, 0x8888, 0x1414, 0x2222, 0x4141, 0x8888, 0x0000,
    /* Patterned Cross */
    0x0808, 0x0000, 0xAAAA, 0x0000, 0x0808, 0x0000, 0x8888, 0x0000,
    /* Balls */
    0x7777, 0x9898, 0xF8F8, 0xF8F8, 0x7777, 0x8989, 0x8F8F, 0x8F8F,
    /* Vertical Scales */
    0x8080, 0x8080, 0x4141, 0x3E3E, 0x0808, 0x0808, 0x1414, 0xE3E3,
    /* Diagonal scales */
    0x8181, 0x4242, 0x2424, 0x1818, 0x0606, 0x0101, 0x8080, 0x8080,
    /* Checker Board */
    0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0x0F0F, 0x0F0F, 0x0F0F, 0x0F0F,
    /* Filled Diamond */
    0x0808, 0x1C1C, 0x3E3E, 0x7F7F, 0xFFFF, 0x7F7F, 0x3E3E, 0x1C1C,
    /* Herringbone */
    0x1111, 0x2222, 0x4444, 0xFFFF, 0x8888, 0x4444, 0x2222, 0xFFFF
};
```
