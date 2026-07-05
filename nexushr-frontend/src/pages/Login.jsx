import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            await login(username, password);

            navigate("/");

        } catch (err) {

            console.log(err);

                console.log(err.response);

                console.log(err.response?.data);

                setError(
                    err.response?.data?.message ||
                    "Login Failed"
                );
        }

    };

    return (

        <div style={{ width: "400px", margin: "100px auto" }}>

            <h2>Nexus HR Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleLogin}>

                <input

                    type="text"

                    placeholder="Username"

                    value={username}

                    onChange={(e) => setUsername(e.target.value)}

                    style={{ width: "100%", marginBottom: "10px" }}

                />

                <input

                    type="password"

                    placeholder="Password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                    style={{ width: "100%", marginBottom: "10px" }}

                />

                <button type="submit">

                    Login

                </button>

            </form>

        </div>

    );

};

export default Login;