import { useContext, useRef, useState } from "react";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import LoginUsersId from "../contexts/LoginUsersId";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function LoginClassifyt() {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);

    const unRef = useRef();
    const pwRef = useRef();
    const [holder, setHolder] = useState(true);
    const [existsAndCorrect, setExistsAndCorrect] = useState(false);

    const navigate = useNavigate();

    function handleLoginClick(e) {
        e?.preventDefault();

        const username = unRef.current?.value.trim();
        const password = pwRef.current?.value;

        if (!username || !password) {
            setHolder(false);
            alert("Please enter a username and password!");
            return;
        } else {
            fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users`, {
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                }
            }).then(res => res.json()).then(data => {
                const users = Object.values(data.results || {});
                console.log(users, "users");                        //

                if (users.some(u => u.username === username)) {
                    const matchedUser = users.find(u => u.username === username);
                    console.log(matchedUser);                                      //
                    if (matchedUser.password === password) {
                        console.log("got into last if");                           //
                        const usersInfo = { username: username, usernameId: matchedUser.id };
                        setLoginStatus(usersInfo);
                        setExistsAndCorrect(true);
                        sessionStorage.setItem("loginStatus", JSON.stringify(usersInfo));
                        // fetch /username to get id for /users response, or just find it manually and set to loginId
                        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${usersInfo.username}`, {
                            headers: {
                                "X-CS571-ID": CS571.getBadgerId()
                            }
                        }).then(postRes => postRes.json()).then(postData => {
                            console.log(postData, "postdata");
                            console.log(postData.results, ".results");
                            console.log(postData.results[usersInfo.usernameId], ".usernameId", usersInfo.usernameId);
                            const transmitId = { loginId: postData.results[usersInfo.usernameId].Id };
                            console.log(transmitId);
                            setLoginId(transmitId);
                            sessionStorage.setItem("loginId", JSON.stringify({ loginId: transmitId }));
                            setExistsAndCorrect(true);
                            navigate("/");
                        })
                    } else {
                        setHolder(false);
                        return;
                    }
                } else {
                    setHolder(false);
                    return;
                }
            })
        }
    }

    return <>
        {
            existsAndCorrect ? <>
                <br/>
                <p>You're all logged in! Redirecting you home...</p>
            </> : <>
                <br/>
                <h2>Login</h2>
                <Form onSubmit={handleLoginClick}>
                    <br/>
                    {!holder && <p style={{ color: 'red' }}>Your username or password is incorrect!</p>}
                    <Form.Label htmlFor="usernameInput">Username</Form.Label>
                    <Form.Control ref={unRef} id="usernameInput"/>
                    <br />
                    <Form.Label htmlFor="passwordInput">Password</Form.Label>
                    <Form.Control ref={pwRef} type="password" id="passwordInput"/>
                    <br/>
                    <Button type="submit">Login</Button>
                </Form>
            </>
        }
    </>

}