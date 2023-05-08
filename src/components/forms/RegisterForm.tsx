import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthApi, { UserRegisterPayload } from "../../api/auth";

const RegisterForm: FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: UserRegisterPayload) => AuthApi.register(data),
    onSuccess: () => {
      toast.success('Now you can login to your account');
      navigate("/auth/login");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Failed to register...');
        return;
      }

      toast.error('Something went wrong...');
    }
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password1":
        setPassword1(value);
        break;
      case "password2":
        setPassword2(value);
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ email, username, password1, password2 });
  };

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: "320px" }}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address</label>
        <input
          id="email"
          name="email"
          className="form-control"
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          id="username"
          name="username"
          className="form-control"
          type="text"
          placeholder="Enter username"
          required
          minLength={6}
          value={username}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password1" className="form-label">Password</label>
        <input
          id="password1"
          name="password1"
          className="form-control"
          type="password"
          placeholder="Enter password"
          required
          minLength={6}
          value={password1}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password2" className="form-label">Confirm password</label>
        <input
          id="password2"
          name="password2"
          className="form-control"
          type="password"
          placeholder="Confirm password"
          required
          minLength={6}
          value={password2}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <Link to="/auth/login">Already have an account?</Link>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-4">
        <button className="btn btn-primary" type="submit" disabled={mutation.isLoading}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
