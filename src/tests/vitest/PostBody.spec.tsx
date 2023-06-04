import { fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import PostBody from "../../components/posts/PostBody";
import { render } from "../utils";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn()
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

it("should switch PostBody into preview", () => {
  let isEditing = true;
  const { getByText } = render(
    <PostBody
      isEditing={isEditing} body={'Hello world'}
      handleCancelEdit={() => isEditing = false}
      handlePostUpdate={(newBody) => isEditing = false}
    />
  );
  fireEvent.click(getByText('Cancel'));
  expect(isEditing).toBeFalsy();
});
