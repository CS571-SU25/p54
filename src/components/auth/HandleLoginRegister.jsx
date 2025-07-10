import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";

export default function HandleLoginRegister() {
    return (
        <>
            <br />
            <div className="d-flex flex-column align-items-center">
                <h1 style={{marginTop: "8rem"}}>How can we help today?</h1>
            </div>
            <br />
            <Container style={{marginTop: "6rem"}}>
                <Row className="justify-content-center text-center">
                    <Col xs={12} md={5} className="mb-4">
                        <h4>Already have an account?</h4>
                        <h5>Login here!</h5>
                        <br />
                        <Button variant="success" as={Link} to="/login">Login</Button>
                    </Col>
                    <Col xs={12} md={5}>
                        <h4>New to ClassiFyt?</h4>
                        <h5>Sign up now!</h5>
                        <br />
                        <Button variant="primary" as={Link} to="/register">Register</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
