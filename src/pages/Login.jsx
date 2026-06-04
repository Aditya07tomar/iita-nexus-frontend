import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Zap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-[#fd9d27]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-[#71ceff]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md p-10 rounded-3xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] animate-fade-up relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#fd9d27]/10 flex items-center justify-center mb-4 ambient-glow">
                        <Zap size={24} fill="#fd9d27" className="text-[#fd9d27]" strokeWidth={0} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">CampusFlow</h1>
                    <p className="text-[#adaaaa] mt-2 text-sm font-medium">Campus Management Portal</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">Campus Email</label>
                        <input
                            type="email"
                            className="cf-input"
                            placeholder="yourname@iiita.ac.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">Password</label>
                        <input
                            type="password"
                            className="cf-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="spinner" />
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    <Link to="/forgot-password" className="text-[#494847] hover:text-[#fd9d27] font-medium transition-colors">
                        Forgot Password?
                    </Link>
                </p>

                <p className="text-center text-[#adaaaa] text-sm mt-4">
                    New here?{' '}
                    <Link to="/register" className="text-[#fd9d27] font-bold hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;