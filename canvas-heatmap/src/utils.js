import { range } from 'd3-array';

// More info:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
// - https://stackoverflow.com/a/43044960
// - https://mariusschulz.com/blog/returning-object-literals-from-arrow-functions-in-javascript
// - https://stackoverflow.com/a/23436563
// - https://flaviocopes.com/how-to-append-item-to-array/
export const genSquareMatrixData = (n, start = 1) => {
  const indexes = range(start, n + start);
  const instances = [];

  for (const x of indexes) {
    for (const y of indexes) {
      instances.push({
        x: x,
        y: y,
        value: Math.random()
      });
    }
  }

  return instances;
};

export const getUniqueValues = (data, accessor) => [...new Set(data.map(accessor))];

// Source: https://github.com/plouc/nivo/blob/master/packages/core/src/lib/interactivity/index.js
export const getRelativeCursor = (el, event) => {
  // More info: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
  // Viewport
  const { clientX, clientY } = event;

  // More info: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  const bounds = el.getBoundingClientRect();

  return [clientX - bounds.left, clientY - bounds.top];
};

// Source: https://github.com/plouc/nivo/blob/master/packages/core/src/lib/interactivity/detect.js
export const isCursorInRect = (x, y, width, height, cursorX, cursorY) =>
  x <= cursorX && cursorX <= x + width && y <= cursorY && cursorY <= y + height;

// Source: 30secondsofcode.org/js/s/every-nth
export const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
