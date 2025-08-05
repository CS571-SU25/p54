import { useContext, useEffect } from "react";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import LoginUsersId from "../contexts/LoginUsersId";
import { useNavigate } from "react-router";
import PlanSetup from "../contexts/PlanSetup";

export default function DeleteAccount() {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);
    const [planSetup, setPlanSetup] = useContext(PlanSetup);

    const navigate = useNavigate();

    useEffect(() => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!confirmDelete) {
            navigate(-1);
            return;
        }

        // if they're not logged in none of these should be present anyways
        if (!loginStatus || !loginId) {
            alert("Must be logged in to delete account!");
            sessionStorage.removeItem("loginStatus");
            setLoginStatus(undefined);
            sessionStorage.removeItem("loginId");
            setLoginId(undefined);
            sessionStorage.removeItem("planSetup");
            setPlanSetup(undefined);
            navigate("/");
            return;
        } else {
            fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${loginStatus.username}?id=entire_collection`, {
                method: "DELETE",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                },
                credentials: "include"
            }).then(res => {
                if (res.status === 200) {

                    console.log(loginId, "loginID.loginId");
                    fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users?id=${loginId.loginId}`, {
                        method: "DELETE",
                        headers: {
                            "X-CS571-ID": CS571.getBadgerId()
                        },
                        credentials: "include"
                    }).then(res => {
                        if (res.status === 200) {
                            alert("Your account has successfully been deleted.");
                            sessionStorage.removeItem("loginStatus");
                            setLoginStatus(undefined);
                            sessionStorage.removeItem("loginId");
                            setLoginId(undefined);
                            sessionStorage.removeItem("planSetup");
                            setPlanSetup(undefined);
                            navigate("/");
                        } else {
                            alert("Account deletion failed.");
                        }
                    })
                } else {
                    alert("Account deletion failed.");
                }
            })
        }
    }, []);
}