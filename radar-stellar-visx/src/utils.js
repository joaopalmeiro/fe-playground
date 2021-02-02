export const round005 = (value) => {
  return Math.round(value * 20) / 20;
};

export const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

export const genAngles = (length, degrees) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle: i * (degrees / length),
  }));

export const genPoints = (length, radius) => {
  const step = (Math.PI * 2) / length;

  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};
