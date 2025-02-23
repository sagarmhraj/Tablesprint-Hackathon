import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://localhost:5000/api/v1/user/forgot-password", { email });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Did you forget your password?</h2>
                <p className="text-gray-600 text-sm mb-5 text-center">
                    Enter your email address and we’ll send you a link to restore your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md w-full transition disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Request Reset Link"}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
