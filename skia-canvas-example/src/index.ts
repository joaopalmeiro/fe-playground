import { Canvas } from "skia-canvas";

const SIZE: number = 400;

function main(): void {
  const canvas = new Canvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");

  const sweep = ctx.createConicGradient(Math.PI * 1.2, SIZE / 2, SIZE / 2);
  sweep.addColorStop(0, "red");
  sweep.addColorStop(0.25, "orange");
  sweep.addColorStop(0.5, "yellow");
  sweep.addColorStop(0.75, "green");
  sweep.addColorStop(1, "red");

  ctx.strokeStyle = sweep;
  ctx.lineWidth = 100;
  ctx.strokeRect(100, 100, 200, 200);

  canvas.toFileSync("rainbox.png", { density: 2 });
}

main();
