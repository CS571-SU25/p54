
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, Outlet } from "react-router";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";

import white from '../../classifyt white.png';
import { useEffect, useState } from "react";

import { FaUserCircle } from 'react-icons/fa'; 
import LoginUsersId from "../contexts/LoginUsersId";
import PlanSetup from "../contexts/PlanSetup";
import Exercises from "../contexts/Exercises";
import ExercisesClassifyt from "../content/ExercisesClassifyt";
import { useContext } from "react";

// hw6 was very helpful in the structuring of this website, even down to folder location of certain elements

export default function LayoutClassifyt(props) {

    const [fullExercises, setFullExercises] = useState(() => {
        const stored = sessionStorage.getItem("exercises");
        return stored ? JSON.parse(stored) : undefined;
    })

    const [planSetup, setPlanSetup] = useContext(PlanSetup);

    useEffect(() => {
        const currentExercises = ExercisesClassifyt();

        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/exercises`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    const id = Object.keys(data.results);
                    const firstId = id[0];
                    const storedLength = data.results[firstId].length;

                    if (storedLength === currentExercises.length) return;
                    else {
                        console.log("are we updating? yes");
                        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/exercises?id=${firstId}`, {
                            method: "PUT",
                            headers: {
                                "X-CS571-ID": CS571.getBadgerId(),
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(currentExercises)
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            setFullExercises({
                                ...data.results[firstId],
                                currentExercises
                            });
                            sessionStorage.setItem("exercises", JSON.stringify(currentExercises));
                        })
                    }
                })
            // should only do this if exercises doesn't have an existing id; basically if i need to delete it or when i first start it
            } else {
                fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/exercises`, {
                    method: "POST",
                    headers: {
                        "X-CS571-ID": CS571.getBadgerId(),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(currentExercises)
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data, "exercises entry created");
                    setFullExercises(currentExercises);
                    sessionStorage.setItem("exercises", JSON.stringify(currentExercises));
                })
            }
        })
    }, [])

    const [loginStatus, setLoginStatus] = useState(() => {
        const stored = sessionStorage.getItem("loginStatus");
        return stored ? JSON.parse(stored) : undefined;
    })

    const [loginId, setLoginId] = useState(() => {
        const stored = sessionStorage.getItem("loginId");
        return stored ? JSON.parse(stored) : undefined;
    })

    const personalPlan = sessionStorage.getItem("planSetup");

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
                            {
                                personalPlan && (
                                <Nav.Link as={Link} to="/personal-plan">Personal Plan</Nav.Link>
                            )}
                            <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
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
                            <Nav.Link as={Link} to="/personal-plan">Personal Plan</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            {
                                loginStatus ? (
                                    <NavDropdown title={<FaUserCircle size={40} />} id="nav-dropdown" align="end">
                                        <NavDropdown.Item as={Link} to="/account-details">Account</NavDropdown.Item>
                                        {personalPlan && (
                                            <NavDropdown.Item as={Link} to="/personal-plan">Personal Plan</NavDropdown.Item>
                                        )}
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
            <Exercises.Provider value={[fullExercises]}>
                <LoginStatusContextClassifyt.Provider value={[loginStatus, setLoginStatus]}>
                    <LoginUsersId.Provider value={[loginId, setLoginId]}>
                        <Outlet />
                    </LoginUsersId.Provider>
                </LoginStatusContextClassifyt.Provider>
            </Exercises.Provider>
        </div>
        </>
    );

}