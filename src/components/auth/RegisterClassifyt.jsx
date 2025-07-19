import { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt.js";
import LoginUsersId from "../contexts/LoginUsersId.js";
import { Link, useNavigate } from "react-router";

export default function RegisterClassifyt() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);
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
            },
        })
        .then(res => res.json())
        .then(data => {
            setLoginId({ loginId: data.id });
            sessionStorage.setItem("loginId", JSON.stringify({ loginId: data.id }));

            const users = Object.values(data.results || {});

            if (users.some(u => u.username === trimmedUn)) {
                alert("That username has already been taken!");
                return;
            }
            
            // here, we're gonna create the directory that will store the user's name and data not related to login
            // then, the id we get from that response will be stored in the main bucket/users collection
            // --------------------------------------------------------------------------------------------------
            // the point of this is that we don't have to grab all the data from a given user everytime we want to
            // a) create a new account
            // b) log someone in
            fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${trimmedUn}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CS571-ID": CS571.getBadgerId()
                },
                body: JSON.stringify({
                    Id: "",
                    Firstname: "",
                    Lastname: ""
                })
            }).then(postRes => postRes.json()).then(postData => {
                // ^ postData.id is the id associated with the /username entry just POSTed ^
                if (postData.id) {

                    // if un not taken, make acc w a POST
                    fetch("https://cs571api.cs.wisc.edu/rest/su25/bucket/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CS571-ID": CS571.getBadgerId()
                        },
                        // we'll add more criteria later w a PUT
                        body: JSON.stringify({
                            username: trimmedUn,
                            password: password, 
                            id: postData.id
                        })
                    })
                    .then(postRes2 => postRes2.json())
                    .then(postData2 => {
                        if (postData2.id) {
                            alert("Your registration has been successful!");

                            const newLoginStatus = {
                                username: trimmedUn,
                                usernameId: postData.id // use the actual id returned from the personal bucket POST
                            };
                            const newLoginId = {
                                loginId: postData2.id // use the id returned from the POST to bucket/users
                            };

                            setLoginStatus(newLoginStatus);
                            setLoginId(newLoginId);
                            console.log(newLoginStatus, "username, usernameId");
                            console.log(newLoginId, "loginId");

                            sessionStorage.setItem("loginStatus", JSON.stringify(newLoginStatus));
                            sessionStorage.setItem("loginId", JSON.stringify(newLoginId));

                            navigate("/getting-started");

                        } else {
                            alert("Something went wrong while registering.");
                        }
                    })
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
