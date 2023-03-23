import { expect, it } from "vitest";
import App from "../../App";
import { render, screen } from "../utils";

it("should add 2 numbers", () => {
  expect(1 + 1).toEqual(2);
});

it("should render App", () => {
  render(<App />);
});
