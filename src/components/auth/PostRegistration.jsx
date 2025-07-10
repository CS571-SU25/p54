import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";

export default function PostRegistration() {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [age, setAge] = useState("");

    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");

    const [statusOne, setStatusOne] = useState(false);
    const [statusTwo, setStatusTwo] = useState(false);

    const [firstnameStatus, setFirstnameStatus] = useState(true);
    const [lastnameStatus, setLastnameStatus] = useState(true);

    useEffect(() => {
        if (!loginStatus?.id || (!statusOne && !statusTwo)) return;

        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            const og = data.result[loginStatus.id];
            if (!og) {
                alert("Failed to find account");
                return;
            }

            const updatedUser = {
                ...og,
                Firstname: firstname,
                Lastname: lastname,
                Age: age
            };

            if (statusTwo) {
                updatedUser.Height = height;
                updatedUser.Weight = weight;
            }

            return fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users?id=${loginStatus.id}`, {
                method: 'PUT',
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(updatedUser)
            });
        })
        .then(res => {
            if (res?.ok) {
                console.log("User successfully updated.");
            } else {
                alert("Something went wrong while updating your profile.");
            }
        });
    }, [statusOne, statusTwo]);


    function handleFirstnameInput(name) {
        setFirstname(name);
        if (name.length <= 20 && /^[A-Za-z\s]*$/.test(name)) {
            setFirstnameStatus(true);
        } else {
            setFirstnameStatus(false);
        }
    }

    function handleLastnameInput(name) {
        setLastname(name);
        if (name.length <= 20 && /^[A-Za-z\s]*$/.test(name)) {
            setLastnameStatus(true);
        } else {
            setLastnameStatus(false);
        }
    }

    function handleStatusOne() {
        if (firstnameStatus && lastnameStatus && firstname && lastname) {
            setStatusOne(true);
        } else {
            alert("Please correct your name/age fields before proceeding.");
        }
    }

    function handleStatusTwo() {
        // TODO: figure out more sophisticated way to choose body type, height maybe
        setStatusTwo(true);
    }

    return <>
        {
            statusOne ? <>
                <h3>How would you describe yourself?</h3>
                <Form>
                    <Form.Label htmlFor="heightInput">Height in. (e.g. enter 5'8" as 68)</Form.Label>
                    <Form.Control
                        id="heightInput"
                        type="number"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                    />
                    <Form.Label htmlFor="weightInput">Weight (lb.)</Form.Label>
                    <Form.Control
                        id="weightInput"
                        type="number"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />
                    <Form.Label htmlFor="ageInput">Age</Form.Label>
                    <Form.Control
                        id="ageInput"
                        type="number"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                    />
                    <br />
                    <Button variant="secondary" onClick={() => setStatusOne(false)}>Previous</Button>
                    <Button style={{ marginLeft: ".5rem" }} onClick={handleStatusTwo}>Next</Button>
                </Form>
            </> : <>
                <h3>Let's start by getting to know you!</h3>
                <Form>
                    {!firstnameStatus && <p style={{ color: 'red' }}>Enter a valid first name (letters/spaces only, 20 chars max)</p>}
                    <Form.Label htmlFor="firstnameInput">First Name</Form.Label>
                    <Form.Control
                        id="firstnameInput"
                        value={firstname}
                        onChange={e => handleFirstnameInput(e.target.value)}
                    />
                    <br />
                    {!lastnameStatus && <p style={{ color: 'red' }}>Enter a valid last name (letters/spaces only, 20 chars max)</p>}
                    <Form.Label htmlFor="lastnameInput">Last Name</Form.Label>
                    <Form.Control
                        id="lastnameInput"
                        value={lastname}
                        onChange={e => handleLastnameInput(e.target.value)}
                    />
                    <br />
                    <Form.Label htmlFor="ageInput">Age</Form.Label>
                    <Form.Control
                        id="ageInput"
                        type="number"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                    />
                    <br />
                    <Button onClick={handleStatusOne}>Next</Button>
                </Form>
            </>
        }
    </>
}
