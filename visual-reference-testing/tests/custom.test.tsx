import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import ButtonB from "../src/components/ButtonB";

test("button: default", async () => {
  const screen = await render(<ButtonB />);

  await expect(screen.getByRole("button")).toMatchScreenshot("button-default");
});
