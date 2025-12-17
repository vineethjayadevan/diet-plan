import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        age: '', gender: 'male', height: '', weight: '',
        goal: 'maintain', diet_type: 'veg'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-10 bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black">
            <div className="w-full max-w-3xl p-10 space-y-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800">
                <div className="text-center border-b border-gray-800 pb-6">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Create Your Plan
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">Join us to get your personalized diet stats</p>
                </div>

                {error && <div className="p-3 text-red-200 bg-red-900/30 border border-red-800 rounded-lg text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Column 1: Identity */}
                    <div className="space-y-5">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">User Details</h3>
                        <div className="space-y-4">
                            <input name="name" onChange={handleChange} placeholder="Full Name" required className="input-field" />
                            <input name="email" type="email" onChange={handleChange} placeholder="Email Address" required className="input-field" />
                            <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="input-field" />
                            <input name="phone" onChange={handleChange} placeholder="Phone Number" className="input-field" />
                        </div>
                    </div>

                    {/* Column 2: Stats & Prefs */}
                    <div className="space-y-5">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">Body & Goal</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="age" type="number" onChange={handleChange} placeholder="Age" required className="input-field" />
                            <select name="gender" onChange={handleChange} className="input-field">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <input name="height" type="number" onChange={handleChange} placeholder="Height (cm)" required className="input-field" />
                            <input name="weight" type="number" onChange={handleChange} placeholder="Weight (kg)" required className="input-field" />
                        </div>

                        <div className="space-y-4 mt-2">
                            <select name="goal" onChange={handleChange} className="input-field">
                                <option value="lose">Lose Weight</option>
                                <option value="maintain">Maintain Weight</option>
                                <option value="gain">Gain Muscle</option>
                            </select>
                            <select name="diet_type" onChange={handleChange} className="input-field">
                                <option value="veg">Vegetarian</option>
                                <option value="non-veg">Non-Vegetarian</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full py-4 font-bold text-lg text-white transition-all bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-purple-900/20 hover:shadow-purple-700/40 transform hover:-translate-y-0.5">
                            Generate My Diet Plan
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-500">
                    Already have an account? <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline">Sign in instead</Link>
                </p>
            </div>
            <style>{`
        .input-field {
          width: 100%;
          padding: 0.875rem 1rem;
          background-color: rgba(17, 24, 39, 0.6);
          border: 1px solid #374151;
          border-radius: 0.75rem;
          color: white;
          transition: all 0.2s;
          outline: none;
        }
        .input-field:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
          background-color: rgba(17, 24, 39, 0.8);
        }
        .input-field::placeholder {
            color: #6b7280;
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }
      `}</style>
        </div>
    );
};
export default Register;
