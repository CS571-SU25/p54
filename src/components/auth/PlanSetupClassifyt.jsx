import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import LoginUsersId from "../contexts/LoginUsersId";
import PlanSetup from "../contexts/PlanSetup";
import { useNavigate } from "react-router";
import WorkoutAlgorithm from "../content/WorkoutAlgorithm";

export default function TrainingPlanBuilder() {

    // THERE'S A LOT GOING ON HERE -- I try my best to explain through comments

    const [sliderValue, setSliderValue] = useState(50);
    const [trainLikeAthlete, setTrainLikeAthlete] = useState(false);

    const [recMuscularityRating, setRecMuscularityRating] = useState(0);

    // effectively cuts normal cardio and strength vals in half if 
    // 'train like an athlete' box is checked
    const [adjustedCardio, setAdjustedCardio] = useState(50);
    const [adjustedStrength, setAdjustedStrength] = useState(50);

    const [loginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId] = useContext(LoginUsersId);
    const [planSetup, setPlanSetup] = useContext(PlanSetup);

    const [entry, setEntry] = useState({});

    // should be updated on load to hold the user's data
    const [userData, setUserData] = useState({
        Age: 0,
        Height: 0,
        Weight: 0, 
        MaxBench: 0,
        MaxPulldown: 0,
        MaxSquat: 0,
        Muscularity: 0,
        Cardio: 50,
        Strength: 50,
        Athlete: 0,
        Focus: "",
        Frequency: 0,
        WorkoutPlan: []
    });

    // stores state for muscular info button
    const [muscularInfo, setMuscularInfo] = useState(false);

    const navigate = useNavigate();

    // when we first load up the page, we check for existing data from the api. this is the first
    // step that implements maxbench etc, so we have to check if that criteria exists first w ||
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
                        Age: entryData.Age ?? 0,
                        Height: entryData.Height ?? 0,
                        Weight: entryData.Weight ?? 0,
                        MaxBench: entryData.MaxBench ?? 0,
                        MaxPulldown: entryData.MaxPulldown ?? 0,
                        MaxSquat: entryData.MaxSquat ?? 0,
                        Muscularity: entryData.Muscularity ?? 0,
                        Cardio: entryData.Cardio ?? 50,
                        Strength: entryData.Strength ?? 50,
                        Athlete: entryData.Athlete ?? 0,
                        Focus: entryData.Focus ?? "",
                        Frequency: entryData.Frequency ?? 0,
                        WorkoutPlan: entryData.WorkoutPlan ?? []
                    });
                    // sets starting slider val to be what user already had (if applic)
                    if (entryData.Athlete === 1) {
                        const sliderStart = entryData.Cardio * 2;
                        setSliderValue(sliderStart);
                        setTrainLikeAthlete(true);
                        setAdjustedCardio(entryData.Cardio);
                        setAdjustedStrength(entryData.Strength);
                    } else {
                        setSliderValue(entryData.Cardio);
                        setAdjustedCardio(entryData.Cardio);
                        setAdjustedStrength(entryData.Strength);
                    }
                }
            });
        }
    }, [loginStatus]);

    /**
     * Function used to save the updated user data to the user's api. 
     */
    function onSave() {

        if (userData.Focus === "") {
            alert("You must fill out the Training Focus field!");
            return;
        } else if (userData.Frequency === 0) {
            alert("You must fill out the Training Frequency field!");
            return;
        } else if (userData.Muscularity === 0) {
            alert("Your Muscularity cannot be 0!");
            return;
        }

        const workoutPlan = WorkoutAlgorithm({
            ...entry,
            ...userData
        });

        const updated = {
            ...entry,
            ...userData,
            WorkoutPlan: workoutPlan
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
            } else {
                setPlanSetup(updated);
                sessionStorage.setItem("planSetup", JSON.stringify(updated));
                alert("Training Data successfully saved!");
            }
        })
    }

    /**
     * This handles the calculating of a user's muscularity rating. This rating was made to make bmi a somewhat useful criteria: 
     * BMI does not account for if you are someone who is a larger human but has a lot of muscule, or conversely, someone who is 
     * smaller with little muscle. This coefficient effectively assesses the muscular weight as a proportion of your body weight
     * to properly gauge how muscular you already are. 
     * 
     * To simplify the math:
     * If someone can do >= double-their-body-weight for the listed exercises, they get a muscularity rating of 10. 
     * Conversely, someone who on average can lift their body weight for each exercise gets a 6, which I considered to be the 
     * 'average' human physique's muscularity. 
     * 
     * This is only a recommendation as this is not a perfect system, so if a user feels they should be higher or lower, it's 
     * ultimately up to them; with that said, with a lot of the people I've tried this with, it seems to be a pretty decent way
     * of turning an opinionated, qualitative assessment of someone's physique into a quantitative value, and lying or 
     * inflating this number will only hurt one's development as we cannot properly develop a training regime for where one's at. 
     * 
     * @returns result of getMuscularity function that groups user into a general 'muscular weight : body weight' coefficient
     */
    function handleMuscularity() {
        const aggregateStrength = (userData.MaxBench / userData.Weight * .3) + 
                                    (userData.MaxPulldown / userData.Weight * .25) + (userData.MaxSquat / userData.Weight * .45);
        setRecMuscularityRating(getMuscularity(aggregateStrength));
    }

    /**
     * Returns the muscularity coefficient corresponding with a given aggregate parameter
     * 
     * @param {*} aggregate 
     * @returns 
     */
    function getMuscularity(aggregate) {
        if (aggregate >= 2.0) return 10;
        if (aggregate >= 1.8) return 9;
        if (aggregate >= 1.55) return 8;
        if (aggregate >= 1.3) return 7;
        if (aggregate >= 1.0) return 6;
        if (aggregate >= 0.85) return 5;
        if (aggregate >= 0.7) return 4;
        if (aggregate >= 0.55) return 3;
        if (aggregate >= 0.4) return 2;
        if (aggregate >= 0.25) return 1;
        return 0;
    }

    /**
     * Sets the userdata object with the new muscularity rating; handles improper input
     * 
     * @param {*} rating 
     */
    function handleSetMuscularity(rating) {
        if (rating < 0 || rating > 10) {
            alert("Muscularity Coefficient must be between 0 and 10!");
        } else {
            setUserData({...userData, Muscularity: rating});
        }
    }

    /**
     * Adjusts the slider value, updates the relevant state vars, updates the userData obj
     * 
     * @param {*} val 
     */
    function handleSliderValue(val) {
        const cardio = trainLikeAthlete ? val / 2 : val;
        const strength = trainLikeAthlete ? 50 - val / 2 : 100 - val;
        setSliderValue(val);
        setAdjustedCardio(cardio);
        setAdjustedStrength(strength);
        setUserData({
            ...userData,
            Cardio: cardio,
            Strength: strength
        });
    }

    /**
     * Helper fn to change the slider values when the train like an athlete box is toggled; 
     * also updates the userData object that is ultimately put into the api.
     * 
     * @param {*} val 
     */
    function handleTrainLikeAthlete(val) {
        setTrainLikeAthlete(() => val ? 1 : 0);
        if (val) {
            // only changes vals if they're == 100
            if (adjustedCardio + adjustedStrength === 100) {
                const cardio = adjustedCardio / 2;
                const strength = adjustedStrength / 2;
                setAdjustedCardio(cardio);
                setAdjustedStrength(strength);
                setUserData({
                    ...userData,
                    Cardio: cardio,
                    Strength: strength,
                    Athlete: val ? 1 : 0,
                    Focus: val ? "Athlete" : userData.Focus === "Athlete" ? "" : userData.Focus
                });
            }
            return;
        // ensures vals are == 100 bc val is false
        } else if (adjustedCardio + adjustedStrength === 50) {
            const cardio = adjustedCardio * 2;
            const strength = adjustedStrength * 2;
            setAdjustedCardio(cardio);
            setAdjustedStrength(strength);
            setUserData({
                ...userData,
                Cardio: cardio,
                Strength: strength,
                Athlete: val ? 1 : 0,
                Focus: val ? "Athlete" : userData.Focus === "Athlete" ? "" : userData.Focus
            });
        } else {
            alert("Oops! There was an error trying to set your training focus! Please reload the page.");
        }
    }

    /**
     * This stores the recommended frequency of the user over 14 days, which is
     * determined based on their current fitness levels which they've shared. 
     */
    const recommendedFrequency = (() => {
        const muscle = recMuscularityRating ? recMuscularityRating : userData.Muscularity;
        const bmi = (userData.Weight / (userData.Height ** 2)) * 703;

        if (userData.Focus === "athlete") {
            // athletes should strive to be 8+ muscularity
            return muscle >= 8 ? 10 : 12;
        }

        if (userData.Focus === "Weight Loss") {
            // most likely overweight, start off easier, then start going 5/7 a week
            if (bmi >= 30) return 8;
            return 10;
        }

        if (userData.Focus === "Bulk") {
            if (bmi >= 29 && muscle < 6) return 6;
            if (bmi >= 26) return 8;
            return 10;
        }

        // i think this describes most college guys who just 'go'
        if (userData.Focus === "Slim Bulk") {
            if (muscle < 6) return 8;
            if (muscle < 7) return 10;
            return 11;
        }

        return 10;
    })();

    return (
        <Container fluid className="mt-4">
            <Row>
                {/* Main Section - Left */}
                <Col md={9}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h4>Training Focus</h4>
                            <Form.Label>
                                Cardio: {userData.Cardio}% | Strength Training: {userData.Strength}%
                            </Form.Label>
                            <Form.Range
                                value={sliderValue}
                                onChange={e => handleSliderValue(Number(e.target.value))}
                                min={0}
                                max={100}
                            />

                            <Form.Check
                                type="checkbox"
                                label="Train like an athlete (slider must be set manually)"
                                checked={trainLikeAthlete}
                                onChange={e => handleTrainLikeAthlete(e.target.checked)}
                            />

                            {trainLikeAthlete === 1 && <div className="mt-2"><strong>Athlete Mode:</strong> Balanced 50%</div>}

                            <hr />
                            <h4>Training Goals</h4>
                            <Form.Check
                                type="radio"
                                label="Bulk"
                                name="focus"
                                checked={userData.Focus === "Bulk"}
                                onChange={() => setUserData({...userData, Athlete: 0, Focus: "Bulk"})}
                            />
                            <Form.Check
                                type="radio"
                                label="Slim Bulk"
                                name="focus"
                                checked={userData.Focus === "Slim Bulk"}
                                onChange={() => setUserData({...userData, Athlete: 0, Focus: "Slim Bulk"})}
                            />
                            <Form.Check
                                type="radio"
                                label="Weight Loss"
                                name="focus"
                                checked={userData.Focus === "Weight Loss"}
                                onChange={() => setUserData({...userData, Athlete: 0, Focus: "Weight Loss"})}
                            />
                            <Form.Check
                                type="radio"
                                label="Athlete"
                                name="focus"
                                checked={trainLikeAthlete}
                                onChange={() => handleTrainLikeAthlete(true)}
                            />
                            <hr />
                            <h4>Training Frequency</h4>
                            <Form.Group>
                                <Form.Label>Training Days (out of 14): {userData.Frequency}</Form.Label>
                                <Form.Range
                                    value={userData.Frequency}
                                    onChange={e => {
                                        setUserData({...userData, Frequency: Number(e.target.value)});
                                    }}
                                    min={1}
                                    max={14}
                                />
                            </Form.Group>
                            <div>Recommended: {recommendedFrequency || "TBD - enter your information!"}</div>
                            <hr />
                            <h4>Muscularity</h4>
                            <Form.Group>
                                <Form.Label>(1 - 10):</Form.Label>
                                <Form.Control
                                    value={userData.Muscularity}
                                    onChange={e => handleSetMuscularity(Number(e.target.value))}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-center">
                        <Button style={{marginRight: 10}} variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        <Button style={{marginLeft: 10}} variant="success" onClick={onSave}>Save Training Plan</Button>
                    </div>
                </Col>

                {/* Sidebar Section - Right */}
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <h5>Input Maxes</h5>
                            <Form.Group className="mb-2">
                                <Form.Label>Bench Press (lbs)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={userData.MaxBench}
                                    onChange={e => setUserData({ ...userData, MaxBench: Number(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Lat Pulldown (lbs)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={userData.MaxPulldown}
                                    onChange={e => setUserData({ ...userData, MaxPulldown: Number(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Squat (lbs)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={userData.MaxSquat}
                                    onChange={e => setUserData({ ...userData, MaxSquat: Number(e.target.value) })}
                                />
                            </Form.Group>
                            <div><strong>Recommended Muscularity Rating:</strong> {isNaN(recMuscularityRating) ? "—" : recMuscularityRating}</div>
                            <Button style={{marginTop: 10}} onClick={() => handleMuscularity()}>Get Muscularity</Button>
                        </Card.Body>
                    </Card>
                    <Card style={{marginTop: 10}}>
                        <Card.Body>
                            <h5>What is Muscularity Rating?</h5>
                            { muscularInfo ? <>
                                <Button style={{marginBottom: 10}} variant="secondary" onClick={() => setMuscularInfo(false)}>Show Less</Button>
                            </> : <>
                                <Button onClick={() => setMuscularInfo(true)}>Show More</Button>
                            </>
                            }
                            { muscularInfo && (
                                <>
                                    <p>This rating was made to make BMI a somewhat useful criteria:</p>
                                    <p>BMI does not account for if you are someone who is a larger human but has a lot of muscule, or conversely, someone who is smaller with little muscle. <strong>This coefficient effectively assesses your muscular weight as a proportion of your body weight to properly gauge how muscular you already are.</strong></p>
                                    <p></p>
                                    <p>To simplify the math:</p>
                                    <p>If someone can do at least, on average, double-their-body-weight for the listed exercises, they get a muscularity rating of 10. </p>
                                    <p>Conversely, someone who on average can lift their body weight for each exercise gets a 6, which we considered to be the 'average' human physique's muscularity. </p>
                                    <p></p>
                                    <p>This is only a recommendation as this is not a perfect system, so if you feel you should be higher or lower, it's ultimately up to you!</p>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}