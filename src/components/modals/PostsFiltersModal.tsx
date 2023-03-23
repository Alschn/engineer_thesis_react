import React, { ChangeEvent, FC, useReducer } from "react";
import { Button, Modal, ModalProps } from "react-bootstrap";
import { MultiValue } from "react-select";
import AsyncSelect from "react-select/async";
import ProfilesApi from "../../api/profiles";
import TagsApi from "../../api/tags";
import { SelectOption } from "../../api/types";

export interface State {
  title: string,
  slug: string,
  created_at__gte: string,
  created_at__lte: string,
  author: SelectOption[],
  tags: SelectOption[],
}

type Action =
  { type: "SET_TITLE", payload: string } |
  { type: "SET_SLUG", payload: string } |
  { type: "SET_CREATED_AT_GTE", payload: string } |
  { type: "SET_CREATED_AT_LTE", payload: string } |
  { type: "SET_AUTHOR", payload: SelectOption[] } |
  { type: "SET_TAGS", payload: SelectOption[] } |
  { type: "RESET" };

const initialState: State = {
  title: "",
  slug: "",
  created_at__gte: "",
  created_at__lte: "",
  author: [],
  tags: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };

    case "SET_SLUG":
      return { ...state, slug: action.payload };

    case "SET_CREATED_AT_GTE":
      return { ...state, created_at__gte: action.payload };

    case "SET_CREATED_AT_LTE":
      return { ...state, created_at__lte: action.payload };

    case "SET_AUTHOR":
      return { ...state, author: action.payload };

    case "SET_TAGS":
      return { ...state, tags: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

function loadAuthors(newValue: string) {
  return ProfilesApi.getAll({ username: newValue, page_size: 25 }).then(
    (r) => r.data.results.map(p => ({ label: p.username, value: p.username }))
  );
}

function loadTags(newValue: string) {
  return TagsApi.getAll({ tag__icontains: newValue, page_size: 25 }).then(
    (r) => r.data.results.map(t => ({ label: t.tag, value: t.tag }))
  );
}

interface PostsFiltersModalProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filters: State) => void;
}

const PostsFiltersModal: FC<PostsFiltersModalProps> = (
  {
    isOpen,
    onConfirm,
    onClose,
    ...rest
  }
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { title, slug, created_at__gte, created_at__lte, author, tags } = state;

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_TITLE", payload: e.target.value });
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SLUG", payload: e.target.value });
  };

  const handleCreatedAtGteChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_CREATED_AT_GTE", payload: e.target.value });
  };

  const handleCreatedAtLteChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_CREATED_AT_LTE", payload: e.target.value });
  };

  const handleAuthorChange = (value: MultiValue<SelectOption>) => {
    dispatch({ type: "SET_AUTHOR", payload: value as SelectOption[] });
  };

  const handleTagsChange = (value: MultiValue<SelectOption>) => {
    dispatch({ type: "SET_TAGS", payload: value as SelectOption[] });
  };

  const handleClearFilters = () => {
    dispatch({ type: "RESET" });
  };

  const handleConfirmFilters = () => {
    onConfirm(state);
  };

  return (
    <Modal show={isOpen} onHide={onClose} {...rest}>
      <Modal.Header closeButton>
        <Modal.Title>Posts Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Type to search by title..."
            maxLength={100}
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="slug" className="form-label">Slug</label>
          <input
            type="text"
            className="form-control"
            id="slug"
            name="slug"
            placeholder="Type to search by slug..."
            maxLength={100}
            value={slug}
            onChange={handleSlugChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <AsyncSelect
            id="author"
            name="author"
            placeholder="Choose authors..."
            isClearable
            isMulti
            loadOptions={loadAuthors}
            defaultOptions={true}
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <AsyncSelect
            id="tags"
            name="tags"
            placeholder="Choose tags..."
            isClearable
            isMulti
            loadOptions={loadTags}
            defaultOptions={true}
            value={tags}
            onChange={handleTagsChange}
          />
        </div>
        <div className="row">
          <div className="col-6 mb-3">
            <label htmlFor="created_at__gte" className="form-label">Created at (From)</label>
            <input
              type="date"
              className="form-control"
              id="created_at__gte"
              name="created_at__gte"
              max={created_at__lte}
              value={created_at__gte}
              onChange={handleCreatedAtGteChange}
            />
          </div>
          <div className="col-6">
            <label htmlFor="created_at__lte" className="form-label">Created at (To)</label>
            <input
              type="date"
              className="form-control"
              id="created_at__lte"
              name="created_at__lte"
              min={created_at__gte}
              value={created_at__lte}
              onChange={handleCreatedAtLteChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClearFilters}>
          Clear
        </Button>
        <Button variant="primary" onClick={handleConfirmFilters}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostsFiltersModal;
