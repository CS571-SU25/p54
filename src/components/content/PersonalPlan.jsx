import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import PlanSetup from "../contexts/PlanSetup";
import WorkoutAlgorithm from "./WorkoutAlgorithm";
import { FaCheckCircle } from 'react-icons/fa';

export default function PersonalPlan() {
    const [planSetup, setPlanSetup] = useContext(PlanSetup);
    const [workouts, setWorkouts] = useState([]);
    const [completedDays, setCompletedDays] = useState({});

    // implementing modality
    const [selectedDay, setSelectedDay] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (planSetup?.WorkoutPlan) {
            setWorkouts(planSetup.WorkoutPlan);

            const initChecks = {};
            planSetup.WorkoutPlan.forEach((day, idx) => {
                initChecks[idx] = !!day.Checked;
            });
            setCompletedDays(initChecks);
        }
    }, [planSetup]);

    if (!planSetup?.WorkoutPlan) {
        return (
            <Container className="mt-4">
                <h2>No Plan Found</h2>
                <p>You haven't set up a training plan yet. Setup your plan through account details!</p>
            </Container>
        );
    }

    function handleRegenerate() {
        if (!planSetup?.WorkoutPlan) {
            console.warn("No planSetup.WorkoutPlan found, cannot regenerate.");
            return;
        }

        const newPlan = WorkoutAlgorithm(planSetup);
        
        const updated = {
            ...planSetup,
            WorkoutPlan: newPlan
        };

        setPlanSetup(updated);
        sessionStorage.setItem("planSetup", JSON.stringify(updated));
        setCompletedDays({});
    }

    function toggleDayComplete(idx) {
        // flip completion
        const updatedCompletedDays = {
            ...completedDays,
            [idx]: !completedDays[idx]
        };

        // update workouts list
        const updatedWorkouts = workouts.map((day, i) =>
            i === idx ? { ...day, Checked: updatedCompletedDays[idx] } : day
        );

        // update plan
        const updatedPlan = {
            ...planSetup,
            WorkoutPlan: updatedWorkouts
        };

        // commit all updates safely (outside of any setState updater callback)
        setCompletedDays(updatedCompletedDays);
        setPlanSetup(updatedPlan);
        setWorkouts(updatedWorkouts);
        sessionStorage.setItem("planSetup", JSON.stringify(updatedPlan));
    }


    return (
        <Container className="mt-4">
            <Container>
                <Row className="align-items-center mb-3">
                    <Col>
                        <h2>Personal Workout Plan</h2>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="warning" onClick={handleRegenerate}>Regenerate Plan!</Button>
                    </Col>
                </Row>
            </Container>
            {workouts.map((day, idx) => {
                const completed = completedDays[idx];
                return (
                    <Card
                        key={idx}
                        className={`mb-3 ${completed ? "bg-dark text-light" : ""}`}
                        style={{ marginTop: 20 }}
                    >
                        <Card.Body onClick={(e) => {
                            // Don't trigger if clicking on the checkbox or inside the Form.Check container
                            if (!e.target.closest('.form-check')) {
                                setSelectedDay(day);
                                setShowModal(true);
                            }
                        }}>
                            <Card.Title style={{ fontWeight: 'bold' }}>
                                Day {day.day}: {day.type.toUpperCase()}
                            </Card.Title>
                            <hr />
                            <Row>
                                {day.core?.length > 0 && (
                                    <Col md={4}>
                                        <h5>Core</h5>
                                        <ul>
                                            {day.core.map((ex, i) => (
                                                <li key={i}>
                                                    {ex.name} -{" "}
                                                    {ex.routine === "cardio"
                                                        ? (Array.isArray(ex.reps) ? ex.reps[0] : ex.reps)
                                                        : `${ex.sets} sets x ${ex.reps} reps`}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                )}

                                {day.main?.length > 0 && (
                                    <Col md={4}>
                                        <h5>Main</h5>
                                        <ul>
                                            {day.main.map((ex, i) => (
                                                <li key={i}>
                                                    {ex.name} -{" "}
                                                    {ex.routine === "cardio"
                                                        ? (Array.isArray(ex.reps) ? ex.reps[0] : ex.reps)
                                                        : `${ex.sets} sets x ${ex.reps} reps`}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                )}

                                {day.supplemental?.length > 0 && (
                                    <Col md={4}>
                                        <h5>Supplemental</h5>
                                        <ul>
                                            {day.supplemental.map((ex, i) => (
                                                <li key={i}>
                                                    {ex.name} -{" "}
                                                    {ex.routine === "cardio"
                                                        ? (Array.isArray(ex.reps) ? ex.reps[0] : ex.reps)
                                                        : `${ex.sets} sets x ${ex.reps} reps`}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                )}
                                {day.cardio?.length > 0 && (
                                    <Col md={4}>
                                        <h5>Cardio</h5>
                                        <ul>
                                            {day.cardio.map((ex, i) => (
                                                <li key={i}>
                                                    {ex.name} -{" "}
                                                    {Array.isArray(ex.reps) ? ex.reps[0] : ex.reps}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                )}
                            </Row>
                            <hr />
                            <div className="d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        <span>
                                            Completed{" "}
                                            {completed && (
                                                <FaCheckCircle
                                                    style={{ marginLeft: 8, color: "limegreen" }}
                                                />
                                            )}
                                        </span>
                                    }
                                    checked={completedDays[idx] || false}
                                    onChange={() => toggleDayComplete(idx)}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
            {selectedDay && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Day {selectedDay.day}: {selectedDay.type.toUpperCase()}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {["core", "main", "supplemental", "cardio"].map(section => (
                            selectedDay[section]?.length > 0 && (
                                <div key={section}>
                                    <h5 className="text-capitalize">{section}</h5>
                                    <ul>
                                        {selectedDay[section].map((ex, i) => {
                                            const name = Array.isArray(ex.name) ? ex.name[0] : ex.name;
                                            const sets = Array.isArray(ex.sets) ? ex.sets.join("-") : ex.sets ?? "?";
                                            const reps = Array.isArray(ex.reps) ? ex.reps.join("-") : ex.reps ?? "?";
                                            const rest = Array.isArray(ex.rest) ? ex.rest.join("-") : ex.rest ?? "?";
                                            const routine = ex.routine ?? ex.tags?.routine ?? "unknown";
                                            const target = ex.tags?.target ?? "N/A";

                                            return (
                                                <li key={i}>
                                                    <strong>{name}</strong><br />
                                                    {routine === "cardio"
                                                        ? `${sets} sets x ${reps}`
                                                        : `${sets} sets x ${reps} reps`}<br />
                                                    <p>
                                                        <em>Recommended Rest:</em> {rest} seconds<br />
                                                        <em>Target:</em> {target}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
            <br />
        </Container>
    );
}
