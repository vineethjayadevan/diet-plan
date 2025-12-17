import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black">
            <div className="w-full max-w-md p-10 space-y-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">Sign in to access your personalized plan</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-200 bg-red-900/30 border border-red-800 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 text-left bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 outline-none hover:bg-gray-800"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 text-left">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 text-left bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 outline-none hover:bg-gray-800"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl hover:bg-gradient-to-br focus:ring-4 focus:ring-indigo-500/30 shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    New to Diet Plan?{' '}
                    <Link to="/register" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
