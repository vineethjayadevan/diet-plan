import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [otpPhone, setOtpPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post('/api/auth/forgot-password', { email, phone });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to request OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post('/api/auth/reset-password', {
                email,
                phone,
                otp_email: otpEmail,
                otp_phone: otpPhone,
                new_password: newPassword
            });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black">
            <div className="w-full max-w-md p-10 space-y-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {step === 1 ? 'Enter details to receive OTP' : 'Verify OTPs and set new password'}
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-200 bg-red-900/30 border border-red-800 rounded-lg text-center">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="p-3 text-sm text-green-200 bg-green-900/30 border border-green-800 rounded-lg text-center">
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 text-left bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 outline-none hover:bg-gray-800"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">Phone Number</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-5 py-3 text-left bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 outline-none hover:bg-gray-800"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl hover:bg-gradient-to-br focus:ring-4 focus:ring-indigo-500/30 shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Send OTPs
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">Email OTP</label>
                                <input
                                    type="text"
                                    value={otpEmail}
                                    onChange={(e) => setOtpEmail(e.target.value)}
                                    className="w-full px-5 py-3 text-center bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">Phone OTP</label>
                                <input
                                    type="text"
                                    value={otpPhone}
                                    onChange={(e) => setOtpPhone(e.target.value)}
                                    className="w-full px-5 py-3 text-center bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-5 py-3 text-left bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 outline-none hover:bg-gray-800"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl hover:bg-gradient-to-br focus:ring-4 focus:ring-indigo-500/30 shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <p className="text-sm text-center text-gray-500">
                    <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
