import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Zap, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. Token may have expired.');
        } finally {
            setLoading(false);
        }
    };

    // No token in URL
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4">
                <div className="text-center p-10 rounded-3xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] max-w-md">
                    <h1 className="text-xl font-bold text-white mb-4">Invalid Reset Link</h1>
                    <p className="text-[#adaaaa] text-sm mb-6">This link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="text-[#fd9d27] font-bold hover:underline">
                        Request a new reset link →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4 relative overflow-hidden">
            <div className="absolute bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-[#71ceff]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md p-10 rounded-3xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] animate-fade-up relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#fd9d27]/10 flex items-center justify-center mb-4 ambient-glow">
                        <Zap size={24} fill="#fd9d27" className="text-[#fd9d27]" strokeWidth={0} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h1>
                    <p className="text-[#adaaaa] mt-2 text-sm font-medium">Choose a new secure password.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-[#c0fe71]/10 border border-[#c0fe71]/30 text-[#c0fe71] rounded-xl text-sm font-medium">
                            ✅ Password reset successfully! Redirecting to login...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                                <input
                                    type="password"
                                    className="cf-input pl-12"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                                <input
                                    type="password"
                                    className="cf-input pl-12"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="spinner" /> : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="text-center text-[#adaaaa] text-sm mt-8">
                    <Link to="/login" className="text-[#fd9d27] font-bold hover:underline inline-flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
