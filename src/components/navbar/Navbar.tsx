import { FC } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const MainNavbar: FC = () => {
  const { isAuthenticated, user, setToken } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken(null);
    navigate('/auth/login');
  };

  return (
    <Navbar expand="md">
      <Container>
        <Navbar.Brand href="/">Thesis - React</Navbar.Brand>
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
