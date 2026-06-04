import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Zap, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSent(true);
            // In dev mode, the backend returns the token directly
            if (res.data.resetToken) {
                setResetToken(res.data.resetToken);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4 relative overflow-hidden">
            <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-[#fd9d27]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md p-10 rounded-3xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] animate-fade-up relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#fd9d27]/10 flex items-center justify-center mb-4 ambient-glow">
                        <Zap size={24} fill="#fd9d27" className="text-[#fd9d27]" strokeWidth={0} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Forgot Password</h1>
                    <p className="text-[#adaaaa] mt-2 text-sm font-medium text-center">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl text-center font-medium">
                        {error}
                    </div>
                )}

                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-[#c0fe71]/10 border border-[#c0fe71]/30 text-[#c0fe71] rounded-xl text-sm font-medium">
                            ✅ If this email is registered, a reset link has been sent.
                        </div>

                        {/* Dev mode: show reset link directly */}
                        {resetToken && (
                            <div className="p-4 bg-[#71ceff]/10 border border-[#71ceff]/30 rounded-xl text-left">
                                <p className="text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-2">Dev Mode — Reset Link</p>
                                <Link
                                    to={`/reset-password?token=${resetToken}`}
                                    className="text-[#71ceff] text-sm font-bold hover:underline break-all"
                                >
                                    Click here to reset password →
                                </Link>
                            </div>
                        )}

                        <Link to="/login" className="text-[#fd9d27] text-sm font-bold hover:underline inline-flex items-center gap-1">
                            <ArrowLeft size={14} /> Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Campus Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                                <input
                                    type="email"
                                    className="cf-input pl-12"
                                    placeholder="yourname@iiita.ac.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="spinner" /> : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <p className="text-center text-[#adaaaa] text-sm mt-8">
                    Remember your password?{' '}
                    <Link to="/login" className="text-[#fd9d27] font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
