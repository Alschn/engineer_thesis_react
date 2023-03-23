import { FC } from "react";
import { Card } from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import { Link } from "react-router-dom";
import { ListPost } from "../../api/types";

interface PostListItemProps {
  post: ListPost;
}

const PostListItem: FC<PostListItemProps> = ({ post }) => {
  const createdAt = new Date(post.created_at);

  return (
    <Card>
      <CardHeader>
        <Card.Title>
          {post.title}
        </Card.Title>
        <Card.Subtitle className="mb-2">
          {post.author.username}
        </Card.Subtitle>
        <Card.Subtitle className="text-muted mb-2">
          {createdAt.toLocaleString()}
        </Card.Subtitle>
        <Card.Link as={Link} to={`/posts/${post.slug}`} className="text-decoration-none">
          {post.slug}
        </Card.Link>
        <div className="d-flex gap-2 mt-2">
          {post.tags.map((tag) => (
            <span className="badge text-bg-primary" key={`badge-tag-${tag}`}>{tag}</span>
          ))}
        </div>
      </CardHeader>
      <Card.Body>
        <Card.Text>
          {post.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PostListItem;
