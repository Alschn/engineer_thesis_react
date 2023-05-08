import { FC } from "react";
import AuthCard from "../../components/cards/AuthCard";
import RegisterForm from "../../components/forms/RegisterForm";

const Register: FC = () => {
  return (
    <AuthCard
      title={
        <h1>Register</h1>
      }
    >
      <RegisterForm/>
    </AuthCard>
  );
};

export default Register;
