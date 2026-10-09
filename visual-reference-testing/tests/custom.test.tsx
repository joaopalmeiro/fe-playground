import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import ButtonB from "../src/components/ButtonB";
import ButtonC from "../src/components/ButtonC";

test("ButtonB", async () => {
  const screen = await render(<ButtonB />);

  await expect(screen.getByRole("button")).toMatchScreenshot("button-default");
});

test("ButtonC", async () => {
  const screen = await render(<ButtonC />);

  await expect(screen.getByRole("button")).toMatchScreenshot("button-default");
});
