import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function CreateUser() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/v1/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.status === 201) {
                alert("User created successfully!");
                setUser({ name: "", email: "", password: "", confirmPassword: "" });
                navigate("/login"); // Redirect to login page after successful registration
            } else if (response.status === 409) {
                setError("User already exists! Please try a different email.");
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to create user. Please check your connection and try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create User</h2>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-md"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-md"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Create User
                </button>
            </form>

            {/* Login Button */}
            <button
                onClick={() => navigate("/")}
                className="w-full mt-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
            >
                Go to Login
            </button>
        </div>
    );
}

export default CreateUser;
