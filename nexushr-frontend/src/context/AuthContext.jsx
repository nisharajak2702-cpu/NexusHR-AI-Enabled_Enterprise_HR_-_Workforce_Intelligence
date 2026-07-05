import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {

            try {

                const decoded = jwtDecode(token);

                setUser({

                    username: decoded.sub,

                    role: decoded.role

                });

            } catch (e) {

                localStorage.removeItem("token");

            }

        }

        setLoading(false);

    }, []);

    const login = async (username, password) => {

        const response = await api.post("/auth/login", {

            username,

            password

        });

        const token = response.data?.token ?? response.data?.accessToken ?? response.data?.access_token;
        if (!token) {
            throw new Error("Login response did not contain a valid token.");
        }

        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);

        setUser({

            username: decoded.sub,

            role: decoded.role

        });

    };

    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                login,

                logout,

                loading

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);