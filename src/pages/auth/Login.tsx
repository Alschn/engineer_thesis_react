import { FC } from "react";
import { Card, Container } from "react-bootstrap";
import LoginForm from "../../components/forms/LoginForm";

const Login: FC = () => {
  return (
    <Container>
      <Card>
        <Card.Header>
          <Card.Title>Login</Card.Title>
        </Card.Header>
        <Card.Body className="p-4">
          <LoginForm/>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
