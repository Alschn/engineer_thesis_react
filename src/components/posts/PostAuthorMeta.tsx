import { FC } from "react";
import { ProfileEmbedded } from "../../api/types";
import defaultAvatar from "../../assets/avatar.jpg";
import { formatDate } from "../../utils/dates";

interface PostAuthorMetaProps {
  author: ProfileEmbedded;
  createdAt: string;
}

const PostAuthorMeta: FC<PostAuthorMetaProps> = ({ author, createdAt }) => {
  const formattedCreatedAt = formatDate(createdAt);

  return (
    <div className="d-flex flex-row align-items-center gap-2 mb-2">
      <img
        src={author.image || defaultAvatar}
        alt="Profile"
        className="rounded-circle"
        height="48"
      />
      <div className="d-flex flex-column justify-content-center">
        <div>
          <a href={`/profiles/${author.username}`} className="fs-5 fw-bold text-decoration-none">
            {author.username}
          </a>
        </div>
        <span className="text-muted fs-6">
      {formattedCreatedAt}
    </span>
      </div>
    </div>
  );
};

export default PostAuthorMeta;
