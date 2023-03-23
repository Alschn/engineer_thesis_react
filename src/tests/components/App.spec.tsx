import { test, expect } from "@playwright/experimental-ct-react";
import App from "../../App";

test("should work", async ({ mount }) => {
  const component = await mount(<App />);
  expect(component).toBeDefined();
});
