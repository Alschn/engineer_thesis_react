import { FC, ReactNode } from "react";
import { Card } from "react-bootstrap";

interface AuthCardProps {
  title: JSX.Element;
  children: ReactNode;
}

const AuthCard: FC<AuthCardProps> = ({ title, children }) => {
  return (
    <Card className="shadow border-0 p-3">
      <header className="bg-white border-bottom-0 d-flex justify-content-center">
        {title}
      </header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
};

export default AuthCard;
