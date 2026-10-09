import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import ButtonA from "../src/components/ButtonA";

test("button: default", async () => {
  const screen = await render(<ButtonA />);

  await expect(screen.getByRole("button")).toMatchScreenshot("button-default");
});
