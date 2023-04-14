import { FC } from "react";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import { Link } from "react-router-dom";
import { ListPost } from "../../api/types";
import PostAuthorMeta from "./PostAuthorMeta";
import TagBadge from "./TagBadge";

interface PostListItemProps {
  post: ListPost;
}

const PostListItem: FC<PostListItemProps> = ({ post }) => {
  return (
    <Card className="shadow border-0" style={{ height: "100%" }}>
      <img
        src={post.thumbnail}
        alt="Thumbnail"
        className="rounded-top"
        height="300"
      />
      <CardHeader>
        <Card.Link as={Link} to={`/posts/${post.slug}`} className="fs-4 fw-bold text-dark text-decoration-none">
          {post.title}
        </Card.Link>
        <PostAuthorMeta
          author={post.author}
          createdAt={post.created_at}
        />
        <div className="d-flex gap-2 mt-2">
          {post.tags.map((tag) => (
            <TagBadge label={tag.tag} color={tag.color} key={tag.slug}/>
          ))}
        </div>
      </CardHeader>
      <Card.Body>
        <Card.Text>
          {post.description}
        </Card.Text>
      </Card.Body>
      <div className="d-flex justify-content-end px-3 pb-2">
        <Card.Link as={Link} to={`/posts/${post.slug}`} className="btn btn-sm btn-dark">
          Show details
        </Card.Link>
      </div>
    </Card>
  );
};

export default PostListItem;
