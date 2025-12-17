import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Utensils, Flame, User, Edit } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [plan, setPlan] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('/api/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
            setPlan(res.data.plan);
            setEditForm({
                weight: res.data.user.weight,
                age: res.data.user.age,
                goal: res.data.user.goal,
                diet_type: res.data.user.diet_type
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('/api/user/profile', editForm, { headers: { Authorization: `Bearer ${token}` } });
            setPlan(res.data.plan);
            setEditing(false);
        } catch (err) {
            alert("Failed to update");
        }
    };

    if (!plan) return <div className="text-white text-center mt-20">Loading Plan...</div>;

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white">D</div>
                        <h1 className="text-xl font-bold tracking-wide">Diet<span className="text-purple-400">Plan</span></h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-sm text-gray-400 hidden sm:block">Welcome, <span className="text-white font-medium">{user?.name}</span></span>
                        <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Top Section: Stats & Profile Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Calorie Card */}
                    <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-3xl border border-indigo-500/20 p-8 shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-purple-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                            <div>
                                <h2 className="text-lg font-medium text-indigo-300 uppercase tracking-wider mb-1">Daily Target</h2>
                                <div className="text-6xl md:text-7xl font-black text-white tracking-tight">
                                    {plan.daily_calories}
                                    <span className="text-2xl md:text-3xl text-gray-400 font-normal ml-2">kcal</span>
                                </div>
                                <div className="mt-4 flex items-center space-x-2 text-sm text-indigo-200 bg-indigo-500/10 px-3 py-1 rounded-full w-fit">
                                    <Flame size={16} />
                                    <span className="capitalize">{editForm.goal} Goal</span>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                {/* Decor or Chart placeholder */}
                                <div className="w-24 h-24 rounded-full border-4 border-purple-500/30 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-purple-500/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile & Edit Card */}
                    <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-xl flex flex-col justify-between relative group hover:border-gray-700 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Your Profile</h3>
                                <p className="text-sm text-gray-500">Manage your metrics</p>
                            </div>
                            <button
                                onClick={() => setEditing(!editing)}
                                className={`p-2 rounded-xl transition-all ${editing ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                {editing ? <span className="text-xs font-bold px-1">Close</span> : <Edit size={18} />}
                            </button>
                        </div>

                        {!editing ? (
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                                    <span className="text-gray-400 text-sm">Weight</span>
                                    <span className="text-white font-semibold">{editForm.weight} kg</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                                    <span className="text-gray-400 text-sm">Age</span>
                                    <span className="text-white font-semibold">{editForm.age}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                                    <span className="text-gray-400 text-sm">Diet</span>
                                    <span className="text-white font-semibold capitalize">{editForm.diet_type}</span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Weight (kg)</label>
                                    <input type="number" value={editForm.weight} onChange={e => setEditForm({ ...editForm, weight: e.target.value })} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Goal</label>
                                    <select value={editForm.goal} onChange={e => setEditForm({ ...editForm, goal: e.target.value })} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none">
                                        <option value="lose">Lose Weight</option>
                                        <option value="maintain">Maintain</option>
                                        <option value="gain">Gain Muscle</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold">Diet Type</label>
                                    <select value={editForm.diet_type} onChange={e => setEditForm({ ...editForm, diet_type: e.target.value })} className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none">
                                        <option value="veg">Vegetarian</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                                    Update Plan
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Meals Section */}
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Utensils className="text-purple-500" />
                    Today's Menu
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {['breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
                        const meal = plan.meals[mealType];
                        if (!meal) return null;

                        return (
                            <div key={mealType} className="group relative bg-gray-900 rounded-2xl border border-gray-800 p-6 overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-all group-hover:from-purple-500/20"></div>

                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{mealType}</h4>
                                <div className="text-lg font-semibold text-white leading-tight mb-2 group-hover:text-purple-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {meal.item}
                                </div>
                                <div className="flex items-center text-sm text-gray-400 mt-4 pt-4 border-t border-gray-800">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">{meal.calories} kcal</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
