import { useContext, useRef, useState } from "react";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import LoginUsersId from "../contexts/LoginUsersId";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import PlanSetup from "../contexts/PlanSetup";

export default function LoginClassifyt() {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);
    const [planSetup, setPlanSetup] = useContext(PlanSetup);

    const unRef = useRef();
    const pwRef = useRef();
    const [holder, setHolder] = useState(true);
    const [msg, setMsg] = useState("");
    const [existsAndCorrect, setExistsAndCorrect] = useState(false);

    const navigate = useNavigate();

    function handleLoginClick(e) {
        e?.preventDefault();

        const username = unRef.current?.value.trim();
        const password = pwRef.current?.value;

        if (!username || !password) {
            setHolder(false);
            setMsg("Please enter a username and password!");
            return;
        } else {
            fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users`, {
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                }
            }).then(res => res.json()).then(data => {
                const users = Object.values(data.results || {});

                if (users.some(u => u.username === username)) {
                    const matchedUser = users.find(u => u.username === username);
                    if (matchedUser.password === password) {
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
                            const transmitId = { loginId: postData.results[usersInfo.usernameId].Id };
                            setLoginId(transmitId);
                            sessionStorage.setItem("loginId", JSON.stringify(transmitId));
                            setExistsAndCorrect(true);

                            const entryData = postData.results[usersInfo.usernameId];
                            const varPlanSetup = {
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
                            }
                            setPlanSetup(varPlanSetup);
                            sessionStorage.setItem("planSetup", JSON.stringify(entryData));

                            navigate("/");
                        })
                    } else {
                        setHolder(false);
                        setMsg("Incorrect username or password!");
                        return;
                    }
                } else {
                    setHolder(false);
                    setMsg("No user found with that username!");
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
                    {!holder && <p style={{ color: 'red' }}>{msg}</p>}
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