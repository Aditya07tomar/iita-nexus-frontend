import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Zap, Hash } from 'lucide-react';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        roll_no: '' 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            alert("Registration Successful! Welcome to CampusFlow.");
            navigate('/login');
        } catch (err) {
            console.error("API Error:", err.response?.data);
            alert(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#c0fe71]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-[#fd9d27]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-3xl p-10 animate-fade-up relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-[#fd9d27]/10 rounded-2xl flex items-center justify-center mb-4 ambient-glow">
                        <Zap size={24} fill="#fd9d27" className="text-[#fd9d27]" strokeWidth={0} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Join CampusFlow</h2>
                    <p className="text-[#adaaaa] text-sm mt-2 font-medium">Create your secure student profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputGroup 
                        icon={<User size={18}/>} 
                        placeholder="Full Name" 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                    <InputGroup 
                        icon={<Hash size={18}/>} 
                        placeholder="University Roll No" 
                        type="text" 
                        value={formData.roll_no} 
                        onChange={(e) => setFormData({...formData, roll_no: e.target.value})} 
                    />
                    <InputGroup 
                        icon={<Mail size={18}/>} 
                        placeholder="College Email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                    <InputGroup 
                        icon={<Lock size={18}/>} 
                        placeholder="Password" 
                        type="password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 btn-primary text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="spinner" /> : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-[#adaaaa] text-sm mt-8">
                    Already registered?{' '}
                    <Link to="/login" className="text-[#fd9d27] font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

const InputGroup = ({ icon, ...props }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494847] group-focus-within:text-[#fd9d27] transition-colors">
            {icon}
        </div>
        <input 
            {...props} 
            required 
            className="cf-input pl-12" 
        />
    </div>
);

export default Register;