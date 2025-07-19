import { useContext, useEffect } from "react";
import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";
import LoginUsersId from "../contexts/LoginUsersId";
import { useNavigate } from "react-router";

export default function DeleteAccount() {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);
    const [loginId, setLoginId] = useContext(LoginUsersId);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loginStatus || !loginId) {
            alert("Must be logged in to delete account!");
            sessionStorage.removeItem("loginStatus");
            setLoginStatus(undefined);
            navigate("/");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!confirmDelete) {
            navigate(-1);
            return;
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/${loginStatus.username}?id=entire_collection`, {
            method: "DELETE",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res => {
            if (res.status === 200) {

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
                        navigate("/");
                    } else {
                        alert("Account deletion failed.");
                    }
                })
            } else {
                alert("Account deletion failed.");
            }
        })
    }, []);
}