
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, Outlet } from "react-router";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";

import white from '../../classifyt white.png';
import { useEffect, useState } from "react";

import { FaUserCircle } from 'react-icons/fa'; 

// hw6 was very helpful in the structuring of this website, even down to folder location of certain elements

export default function LayoutClassifyt(props) {

    const [loginStatus, setLoginStatus] = useState(() => {
        const stored = sessionStorage.getItem("loginStatus");
        return stored ? JSON.parse(stored) : undefined;
    })

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 992); // lg breakpoint
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
        {
            isSmallScreen ? (
            // small screen navbar
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container className="justify-content-between">
                    <Navbar.Toggle aria-controls="navbar-sm" />
                    <Navbar.Brand as={Link} to="/" className="mx-auto">
                        <img
                        alt="Classifyt Logo"
                        src={white}
                        style={{ width: '150px', height: 'auto' }}
                        />
                    </Navbar.Brand>
                    <Navbar.Collapse id="navbar-sm" className="justify-content-center">
                        <Nav className="flex-column align-items-center">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            {
                                loginStatus ?
                                    <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                                    :
                                    <>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                        <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                    </>
                            }
                            <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
                            <Nav.Link as={Link} to="/other-info">Other Info</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            ) : (
            // large screen navbar
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                        alt="Classifyt Logo"
                        src={white}
                        style={{ width: '200px', height: 'auto' }}
                        />
                    </Navbar.Brand>
                    <Navbar.Collapse id="navbar-lg">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
                            <Nav.Link as={Link} to="/other-info">Other Info</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            {
                            loginStatus ? (
                                <NavDropdown title={<FaUserCircle size={40} />} id="nav-dropdown" align="end">
                                    <NavDropdown.Item as={Link} to="/account-details">Account</NavDropdown.Item>
                                    <NavDropdown.Item as="div">
                                        <Button variant="danger" onClick={() => navigate("/logout")}>Logout</Button>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} to="/handle" title="Handle">
                                    <Button>Login/Register</Button>
                                </Nav.Link>
                            )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            )
        }
        <div style={{ margin: "1rem" }}>
            <LoginStatusContextClassifyt.Provider value={[loginStatus, setLoginStatus]}>
                <Outlet />
            </LoginStatusContextClassifyt.Provider>
        </div>
        </>
    );

}