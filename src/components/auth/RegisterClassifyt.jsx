import { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt.js";
import { useNavigate } from "react-router";

export default function RegisterClassifyt() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const navigate = useNavigate();

    function handleRegisterSubmit(e) {
        e.preventDefault();

        const trimmedUn = username.trim();

        if (!trimmedUn || !password || !repeatPassword) {
            alert("You must provide both a username and password!");
            return;
        }

        if (!/^\d{7}$/.test(password)) {
            alert("Your password must be a 7-digit number!");
            return;
        }

        if (password !== repeatPassword) {
            alert("Your passwords do not match!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/su25/bucket/users", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {

            const users = Object.values(data.result || {});

            if (users.some(u => u.username === trimmedUn)) {
                alert("That username has already been taken!");
                return;
            }

            // if un not taken, make acc w a POST
            fetch("https://cs571api.cs.wisc.edu/rest/su25/bucket/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CS571-ID": CS571.getBadgerId()
                },
                // we'll add more criteria later w a PUT
                body: JSON.stringify({
                    status: "online",
                    username: trimmedUn,
                    pin: password
                })
            })
            .then(postRes => postRes.json())
            .then(postData => {
                if (postData.id) {
                    alert("Your registration has been successful!");
                    const newLogin = { username: trimmedUn, id: postData.id };
                    setIsLoggedIn(true);
                    setLoginStatus(newLogin);
                    sessionStorage.setItem("loginStatus", JSON.stringify(newLogin));
                    navigate("/getting-started");
                } else {
                    alert("Something went wrong while registering.");
                }
            });
        });
    }


    if (isLoggedIn) {
        return <h3>Let's setup your fitness journey!</h3>
    } else {
        return <Form onSubmit={handleRegisterSubmit}>
            <Form.Label htmlFor="usernameInput">Username</Form.Label>
            <Form.Control id="usernameInput" value={username} onChange={e => setUsername(e.target.value)} />
            <Form.Label htmlFor="passwordInput">Password</Form.Label>
            <Form.Control id="passwordInput" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Form.Label htmlFor="repeatpwInput">Repeat Password</Form.Label>
            <Form.Control id="repeatpwInput" type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
            <br />
            <Button type="submit">Register</Button>
        </Form>
    }
}
