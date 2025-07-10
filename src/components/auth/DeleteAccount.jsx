import LoginStatusContextClassifyt from "../contexts/LoginStatusContextClassifyt";

export default function DeleteAccount() {

    const [loginStatus, setLoginStatus] = useContext(LoginStatusContextClassifyt);

    useEffect(() => {
        if (!loginStatus || !loginStatus.id) {
            alert("Must be logged in to delete account!");
            sessionStorage.removeItem("loginStatus");
            setLoginStatus(undefined);
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!confirmDelete) {
            return;
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/su25/bucket/users?id=${loginStatus.id}`, {
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
                navigate("/");
            } else {
                alert("Account deletion failed.");
            }
        })
    }, []);
}