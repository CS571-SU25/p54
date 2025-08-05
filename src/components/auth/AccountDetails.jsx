import { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import LoginUsersId from "../contexts/LoginUsersId";
import PlanSetup from '../contexts/PlanSetup';

export default function AccountDetails() {
    const [loginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId] = useContext(LoginUsersId);
    const [planSetup, setPlanSetup] = useContext(PlanSetup);

    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("account"); 
    const [entry, setEntry] = useState({});

    const [userData, setUserData] = useState({
        Firstname: "",
        Lastname: "",
        Age: "",
        Height: "",
        Weight: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (loginStatus?.username && loginStatus?.usernameId) {
            fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${loginStatus.username}?id=${loginStatus.usernameId}`, {
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data?.results?.[loginStatus.usernameId]) {
                    const entryData = data.results[loginStatus.usernameId];
                    setEntry(entryData);
                    setUserData({
                        Firstname: entryData.Firstname || "",
                        Lastname: entryData.Lastname || "",
                        Age: entryData.Age || "",
                        Height: entryData.Height || "",
                        Weight: entryData.Weight || ""
                    });
                }
            });
        }
    }, [loginStatus]);

    /**
     * Function used to save the updated user data to the user's api.
     */
    function onSave() {
        setEditMode(false);

        const updated = {
            ...entry,
            ...userData
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${loginStatus.username}?id=${loginStatus.usernameId}`, {
            method: "PUT",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updated)
        })
        .then(res => {
            if (!res.ok) {
                alert("Profile failed to update");
            }
        })
    }

    return (
        <Container fluid className="mt-4">
            <Row>
                <Col md={3} className="mb-3">
                    <div className="d-md-none">
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">Account Options</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setActiveTab("account")}>Account Details</Dropdown.Item>
                                <Dropdown.Item onClick={() => setActiveTab("plan")}>Personal Plan</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/delete-account">Delete Account</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className="d-none d-md-flex flex-column gap-2">
                        <ButtonGroup vertical>
                            <Button
                                variant={activeTab === "account" ? "primary" : "outline-primary"}
                                onClick={() => setActiveTab("account")}
                            >
                                Account Details
                            </Button>
                            <Button
                                variant={activeTab === "plan" ? "secondary" : "outline-secondary"}
                                onClick={() => setActiveTab("plan")}
                            >
                                Personal Plan
                            </Button>
                            <Button variant="outline-danger" as={Link} to="/delete-account">
                                Delete Account
                            </Button>
                        </ButtonGroup>
                    </div>
                </Col>

                <Col md={9}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>{activeTab === "account" ? "Personal Information" : "Your Plan"}</h4>
                                {activeTab === "account" && (
                                    <Button size="sm" onClick={() => setEditMode(prev => !prev)}>
                                        {editMode ? "Cancel" : "Edit"}
                                    </Button>
                                )}
                            </div>

                            {activeTab === "account" ? (
                                editMode ? (
                                    <Form>
                                        {["Firstname", "Lastname", "Age", "Height", "Weight"].map(field => (
                                            <Form.Group className="mb-3" key={field}>
                                                <Form.Label>{field}</Form.Label>
                                                <Form.Control
                                                    type={["Age", "Height", "Weight"].includes(field) ? "number" : "text"}
                                                    value={userData[field]}
                                                    onChange={e => setUserData({ ...userData, [field]: e.target.value })}
                                                />
                                            </Form.Group>
                                        ))}
                                        <Button variant="success" onClick={() => {onSave()}}>Save</Button>
                                    </Form>
                                ) : (
                                    <ul>
                                        {Object.entries(userData).map(([key, value]) => (
                                            <li key={key}><strong>{key}:</strong> {value || "—"}</li>
                                        ))}
                                    </ul>
                                )
                            ) : (
                                <>
                                    {planSetup === undefined ? (
                                        <div className="text-center">
                                            <p>You haven't finished setting up your plan yet!</p>
                                            <Button variant="primary" onClick={() => navigate("/plan-setup")}>Continue Plan Setup</Button>
                                        </div>
                                    ) : (
                                        <Row className="text-center">
                                            <Col xs={12} md={6} className="mb-3">
                                                <p>View your Personal Plan here!</p>
                                                <Button variant="success" onClick={() => navigate("/personal-plan")}>View Plan</Button>
                                            </Col>
                                            <Col xs={12} md={6} className="mb-3">
                                                <p>Edit your plan details here.</p>
                                                <Button onClick={() => navigate("/plan-setup")}>Edit Plan</Button>
                                            </Col>
                                        </Row>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
