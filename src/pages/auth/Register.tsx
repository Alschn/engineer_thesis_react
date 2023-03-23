import { FC } from "react";
import { Card, Container } from "react-bootstrap";
import RegisterForm from "../../components/forms/RegisterForm";

const Register: FC = () => {
  return (
    <Container>
      <Card>
        <Card.Header>Register</Card.Header>
        <Card.Body>
          <RegisterForm/>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
