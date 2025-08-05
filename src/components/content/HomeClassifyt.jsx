import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useContext } from "react";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import PlanSetup from "../contexts/PlanSetup";
import gymage2 from "../../gymage2.png";

export default function HomeClassifyt() {
    const [loginStatus] = useContext(LoginStatusContextClassifyt);
    const [planSetup] = useContext(PlanSetup);

    const isLoggedIn = loginStatus?.username && planSetup?.WorkoutPlan;

    return (
        <>
            <div className="text-center">
                <img
                    src={gymage2}
                    alt="background image of a gym"
                    style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxHeight: "60vh"
                    }}
                />
            </div>
            <div className="text-center mt-4">
                <h1 style={{ fontWeight: "bold" }}>Welcome to ClassiFyt</h1>
                <p style={{ fontSize: "1.25rem", maxWidth: "800px", margin: "0 auto" }}>
                    Your personalized training companion — designed to balance cardio and strength, 
                    adapt to your goals, and help you stay consistent every step of the way.
                </p>
            </div>

            <Container className="mt-5 text-center">
                {!isLoggedIn ? (
                    <Row className="justify-content-center">
                        <Col xs={12} md={5} className="mb-4">
                            <h4>Already have an account?</h4>
                            <h5>Login here!</h5>
                            <Button variant="success" as={Link} to="/login" className="mt-2">
                                Login
                            </Button>
                        </Col>
                        <Col xs={12} md={5}>
                            <h4>New to ClassiFyt?</h4>
                            <h5>Sign up now!</h5>
                            <Button variant="primary" as={Link} to="/register" className="mt-2">
                                Register
                            </Button>
                        </Col>
                    </Row>
                ) : (
                    <Row className="justify-content-center">
                        <Col xs={12} md={5} className="mb-4">
                            <Card className="p-3 shadow">
                                <h4>Ready to adjust your goals?</h4>
                                <Button as={Link} to="/plan-setup" variant="warning" className="mt-2">
                                    Edit Plan
                                </Button>
                            </Card>
                        </Col>
                        <Col xs={12} md={5}>
                            <Card className="p-3 shadow">
                                <h4>View your personalized routine</h4>
                                <Button as={Link} to="/personal-plan" variant="info" className="mt-2">
                                    My Plan
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
}