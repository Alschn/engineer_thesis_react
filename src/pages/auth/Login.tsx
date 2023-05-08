import { FC } from "react";
import AuthCard from "../../components/cards/AuthCard";
import LoginForm from "../../components/forms/LoginForm";

const Login: FC = () => {
  return (
    <AuthCard
      title={
        <h1>Login</h1>
      }
    >
      <LoginForm/>
    </AuthCard>
  );
};

export default Login;
