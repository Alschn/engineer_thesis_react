import { FC, FormEvent } from "react";

interface CommentAddFormProps {
  isSubmitting: boolean;
  value: string,
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onChange: (newValue: string) => void;
}

const CommentAddForm: FC<CommentAddFormProps> = (
  {
    isSubmitting,
    onSubmit,
    onClear,
    value,
    onChange,
  }
) => {
  return (
    <form className="mt-3" onSubmit={onSubmit}>
      <textarea
        id="comment"
        className="form-control"
        style={{ resize: "none" }}
        placeholder="Write a comment..."
        rows={3}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="d-flex justify-content-end gap-2">
        {value.length > 0 && (
          <button className="btn btn-outline-danger mt-2" type="button" onClick={onClear}>
            Clear
          </button>
        )}
        <button className="btn btn-primary mt-2" type="submit" disabled={isSubmitting}>
          Comment
        </button>
      </div>
    </form>
  );
};

export default CommentAddForm;
