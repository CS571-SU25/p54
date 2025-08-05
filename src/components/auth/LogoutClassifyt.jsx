import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import LoginStatusContextClassifyt from '../contexts/LoginStatusContextClassifyt';
import LoginUsersId from '../contexts/LoginUsersId';
import PlanSetup from '../contexts/PlanSetup';

export default function LogoutClassifyt() {
    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);
    const [planSetup, setPlanSetup] = useContext(PlanSetup);
    const navigate = useNavigate();

    useEffect(() => {
        async function logoutAndSave() {
            if (!loginStatus || !loginId) {
                console.warn("Logout attempted while not logged in.");
                sessionStorage.removeItem("loginStatus");
                navigate("/");
            } else {
                try {
                    // 1. Fetch current user to ensure account still exists
                    const res = await fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users`, {
                        headers: {
                            "X-CS571-ID": CS571.getBadgerId()
                        }
                    });
                    const data = await res.json();
                    const currentData = data.results[loginId.loginId];

                    if (!currentData) {
                        alert("Could not find your account to update.");
                        return;
                    }

                    // 2. PUT final planSetup to user's personal data (if it exists)
                    if (planSetup && loginStatus.username && loginStatus.usernameId) {
                        await fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${loginStatus.username}?id=${loginStatus.usernameId}`, {
                            method: "PUT",
                            headers: {
                                "X-CS571-ID": CS571.getBadgerId(),
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify(planSetup)
                        });
                    }

                } catch (err) {
                    console.warn("Failed to update plan before logout:", err);
                } finally {
                    // 3. Clear session and logout locally
                    sessionStorage.removeItem("loginStatus");
                    setLoginStatus(undefined);
                    sessionStorage.removeItem("loginId");
                    setLoginId(undefined);
                    sessionStorage.removeItem("planSetup");
                    setPlanSetup(undefined);
                    alert("You have been logged out!");
                    navigate("/");
                }
            }
        }

        logoutAndSave();
    }, []);

    return (
        <p>Logging you out...</p>
    );
}
