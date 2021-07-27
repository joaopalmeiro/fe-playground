import { textPropsByEngine } from '@nivo/core';

import { everyNth } from './utils';

const tickSize = 5;
// const tickPadding = 5;
const tickPadding = 2.5;
// Tick rotation: https://github.com/plouc/nivo/blob/v0.73.1/packages/axes/src/compute.ts#L205

const textProps = textPropsByEngine['canvas'];

const fontSize = 11; // Default (https://nivo.rocks/guides/theming)
const fontFamily = 'Arial';

const domainLineWidth = 1;
// const domainLineWidth = 10;

const computeDomainLineOffset = (position) => {
  switch (position) {
    case 'top':
      return { x: 0, y: -domainLineWidth / 2 };
    case 'bottom':
      return { x: 0, y: domainLineWidth / 2 };
    case 'left':
      return { x: -domainLineWidth / 2, y: 0 };
    case 'right':
      return { x: domainLineWidth / 2, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

export const axisCanvas = (ctx, position, scale, width, height) => {
  const isXAxis = position === 'top' || position === 'bottom';
  const ticksPosition = position === 'top' || position === 'left' ? 'before' : 'after';

  const x = position === 'right' ? width : 0;
  const y = position === 'bottom' ? height : 0;

  const length = isXAxis ? width : height;

  // More info:
  // - https://github.com/d3/d3-scale#ordinal_domain
  // - https://github.com/plouc/nivo/blob/v0.73.1/packages/axes/src/compute.ts#L157
  const values = scale.domain(); // For `d3.scaleOrdinal()`

  const line = { lineX: 0, lineY: 0 };
  const text = { textX: 0, textY: 0 };

  // https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/lib/bridge.js
  let textAlign = textProps.align.center;
  let textBaseline = textProps.baseline.center;

  let translate;

  if (isXAxis) {
    // X-axis

    // Nullish coalescing operator (`??`)
    // `null` or `undefined`
    translate = (d) => ({ x: scale(d) ?? 0, y: 0 });

    line.lineY = tickSize * (ticksPosition === 'after' ? 1 : -1);
    text.textY = (tickSize + tickPadding) * (ticksPosition === 'after' ? 1 : -1);

    textBaseline = ticksPosition === 'after' ? textProps.baseline.top : textProps.baseline.bottom;
  } else {
    // Y-Axis
    translate = (d) => ({ x: 0, y: scale(d) ?? 0 });

    line.lineX = tickSize * (ticksPosition === 'after' ? 1 : -1);
    text.textX = (tickSize + tickPadding) * (ticksPosition === 'after' ? 1 : -1);

    textAlign = ticksPosition === 'after' ? textProps.align.left : textProps.align.right;
  }

  // const valuesToPlot = values;
  // const valuesToPlot = everyNth(values, 10);
  const valuesToPlot = everyNth(values, 10).concat(values[0]);

  const ticks = valuesToPlot.map((value) => ({
    // https://flaviocopes.com/how-to-check-value-is-number-javascript/
    key: typeof value === 'number' || typeof value === 'string' ? value : `${value}`,
    value,
    ...translate(value),
    ...line,
    ...text
  }));
  // console.log(ticks);
  // console.log(ticks[0]);

  ctx.save();

  // ctx.translate(x, y);
  const { x: xDomainLineOffset, y: yDomainLineOffset } = computeDomainLineOffset(position);
  // console.log(position, xDomainLineOffset, yDomainLineOffset);

  ctx.translate(x + xDomainLineOffset, y + yDomainLineOffset);

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = `${fontSize}px ${fontFamily}`;

  // Domain line
  // https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/theming/defaultTheme.js#L18
  ctx.lineWidth = domainLineWidth;
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap
  ctx.lineCap = 'butt';
  // It make the lines slightly longer
  // ctx.lineCap = 'square';
  ctx.strokeStyle = 'black';
  // ctx.strokeStyle = 'transparent';

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(isXAxis ? length : 0, isXAxis ? 0 : length);
  ctx.stroke();

  // Tick lines and labels
  // https://github.com/plouc/nivo/blob/v0.73.1/packages/core/src/theming/defaultTheme.js#L21
  ticks.forEach((tick) => {
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(tick.x, tick.y);
    ctx.lineTo(tick.x + tick.lineX, tick.y + tick.lineY);
    ctx.stroke();

    ctx.save();
    ctx.translate(tick.x + tick.textX, tick.y + tick.textY);
    ctx.fillStyle = 'black';
    // String function
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/String
    ctx.fillText(String(tick.value), 0, 0);

    ctx.restore();
  });

  ctx.restore();
};
