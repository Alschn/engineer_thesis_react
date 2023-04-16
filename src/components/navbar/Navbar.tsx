import { FC } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar, { NavbarProps } from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthApi from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

interface MainNavbarProps extends NavbarProps {
  brand?: string;
}

const MainNavbar: FC<MainNavbarProps> = ({ brand = 'Thesis - React', ...rest }) => {
  const { isAuthenticated, user, setToken } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    AuthApi.logout().finally(() => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setToken(null);
      navigate('/auth/login');
    });
  };

  return (
    <Navbar expand="md" {...rest}>
      <Container>
        <Navbar.Brand href="/">{brand}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-collapse"/>
        <Navbar.Collapse id="navbar-collapse">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/posts">
              Posts
            </Nav.Link>
            <Nav.Link as={NavLink} to="/posts/feed/">
              Feed
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profiles">
              Profiles
            </Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={`${user!.username}`} id="nav-dropdown">
                <NavDropdown.Item as={Link} to={`/profiles/${user!.username}`}>Profile</NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/auth/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/auth/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
