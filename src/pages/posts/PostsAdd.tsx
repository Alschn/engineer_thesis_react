import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import PostsApi, { PostCreatePayload } from "../../api/posts";
import TagsApi from "../../api/tags";
import { SelectOption } from "../../api/types";
import MarkdownEditor from "../../components/markdown/MarkdownEditor";

const loadOptions = (inputValue: string) => {
  return TagsApi.getAll(
    { tag__icontains: inputValue }
  ).then(res => res.data.results.map((t) => ({
    value: t.tag,
    label: t.tag
  })));
};

const PostsAdd: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [tags, setTags] = useState<any[]>([]);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: PostCreatePayload) => PostsApi.createPost(data),
    onSuccess: () => {
      toast.success('Your post has been created successfully.');
      navigate('/posts');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Failed to create post...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!body) {
      toast.error("Body is required!");
      return;
    }

    mutation.mutate({
      title, description, body,
      tags: tags.map(t => t.value)
    });
  };

  return (
    <form className="p-2 my-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          className="form-control"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter short description"
          className="form-control"
          required
          maxLength={1000}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="tags" className="form-label">Tags</label>
        <AsyncSelect
          id="tags"
          name="tags"
          placeholder="Choose tags..."
          loadOptions={loadOptions}
          defaultOptions={true}
          onChange={(newValue) => setTags(newValue as SelectOption[])}
          isClearable
          isMulti
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="body" className="form-label">Body</label>
        <MarkdownEditor
          value={body}
          onChange={setBody}
          placeholder="Enter post's body"
        />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default PostsAdd;
