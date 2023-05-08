import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthApi, { LoginPayload } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

const LoginForm: FC = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
      mutationFn: (data: LoginPayload) => AuthApi.login(data),
      onSuccess: ({ data }) => {
        setToken(data.access);
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        toast.success('Logged in successfully');
        navigate('/posts/');
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error('Failed to authenticate...',);
          return;
        }

        toast.error('Something went wrong...');
      },
    }
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: "320px" }}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          className="form-control"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          className="form-control"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <Link to="/auth/register">Do not have an account?</Link>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-4">
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
