import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LoginStatusContextClassifyt from '../contexts/LoginStatusContextClassifyt';
import LoginUsersId from '../contexts/LoginUsersId';

export default function LogoutClassifyt() {
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);
    const navigate = useNavigate();
    console.log(loginId);

    useEffect(() => {
        console.log(loginId.loginId, "loginid");
        if (!loginStatus || !loginId) {
            console.warn("Logout attempted while not logged in.");
        } else {
            // 1. fetch current user data
            fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users`, {
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const currentData = data.results[loginId.loginId];
                console.log(currentData, "currentdata");
                if (!currentData) {
                    alert("Could not find your account to update.");
                    return;
                }
            })
            .then(() => {
                // 2. clear session and logout locally
                sessionStorage.removeItem("loginStatus");
                setLoginStatus(undefined);
                sessionStorage.removeItem("loginId");
                setLoginId(undefined);
                alert("You have been logged out!");
                navigate("/");
            });
        }
    }, []);

    return (
        <p>Logging you out...</p>
    );
}
