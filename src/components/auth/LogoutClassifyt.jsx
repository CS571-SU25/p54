import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LoginStatusContextClassifyt from '../contexts/LoginStatusContextClassifyt';

export default function LogoutClassifyt() {
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loginStatus || !loginStatus.id) {
            alert("No one is logged in!");
            sessionStorage.removeItem("loginStatus");
            setLoginStatus(undefined);
            navigate("/");
            return;
        }

        // 1. fetch current user data
        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            const currentData = data.results[loginStatus.id];
            if (!currentData) {
                alert("Could not find your account to update.");
                return;
            }

            // 2. PUT updated object with status as "offline"
            const updatedUser = {
                status: "offline",
                ...currentData
            };

            return fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users?id=${loginStatus.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CS571-ID": CS571.getBadgerId()
                },
                credentials: "include",
                body: JSON.stringify(updatedUser)
            });
        })
        .then(() => {
            // 3. clear session and logout locally
            sessionStorage.removeItem("loginStatus");
            setLoginStatus(undefined);
            alert("You have been logged out!");
            navigate("/");
        });
    }, []);

    return (
        <p>Logging you out...</p>
    );
}
