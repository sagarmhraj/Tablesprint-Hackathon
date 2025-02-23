import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract token from URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const email = searchParams.get("email"); // Capture email if needed

    // Debugging: Check if token is extracted
    useEffect(() => {
        console.log("Token from URL:", token);
        console.log("Email from URL:", email);
        console.log("Current URL Path:", location.pathname);
        console.log("Current URL Query Params:", location.search);
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        console.log("Sending Token to Backend:", token);  // Debugging
        console.log("Sending Email to Backend:", email);
        console.log("Sending Password:", password);


        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/reset-password", {
                token,
                email,
                password
            });

            console.log("Response from Backend:", res.data);
            setMessage(res.data.message);

            // Redirect to login page after successful reset
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.error("Error from Backend:", error.response?.data);
            setMessage(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
