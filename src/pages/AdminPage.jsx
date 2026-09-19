import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Zap, LogOut, LayoutDashboard, Shield, Sun, Moon
} from 'lucide-react';
import AdminPanel from '../components/AdminPanel';
import NotificationBell from '../components/NotificationBell';

const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [isLightMode, setIsLightMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            // Only role_id 2 (admin) can access this page
            if (parsed.role !== 2) {
                navigate('/dashboard');
                return;
            }
            setUser(parsed);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className={`flex h-screen bg-[#0e0e0e] text-[#adaaaa] font-sans overflow-hidden ${isLightMode ? 'light-theme' : ''}`}>
            {/* Sidebar */}
            <aside className="w-64 bg-[#131313] border-r border-[rgba(73,72,71,0.15)] flex flex-col z-30 hide-mobile">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#fd9d27]/10 flex items-center justify-center ambient-glow">
                            <Zap size={22} className="text-[#fd9d27]" fill="#fd9d27" strokeWidth={0} />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight text-white">CampusFlow</h2>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group cursor-pointer text-[#adaaaa] hover:bg-[#1a1919] hover:text-white"
                    >
                        <span className="text-[#494847] group-hover:text-[#fd9d27] transition-colors">
                            <LayoutDashboard size={20} />
                        </span>
                        <span className="font-semibold text-sm">Back to Dashboard</span>
                    </button>

                    <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#494847] uppercase tracking-[0.2em]">
                        Administration
                    </div>
                    <button 
                        className="flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group cursor-pointer bg-[#fd9d27]/10 text-[#fd9d27] ambient-glow"
                    >
                        <span className="text-[#fd9d27] transition-colors">
                            <Shield size={20} />
                        </span>
                        <span className="font-semibold text-sm">Admin Panel</span>
                    </button>
                </nav>

                {/* User Context Footer */}
                <div className="p-5 mt-auto">
                    <div className="bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fd9d27]/10 flex items-center justify-center text-[#fd9d27] font-bold border border-[#fd9d27]/20 text-sm">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-[#494847] truncate font-bold tracking-widest uppercase">
                                Admin
                            </p>
                        </div>
                        <button onClick={handleLogout} className="text-[#494847] hover:text-[#ff7351] transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-[rgba(73,72,71,0.15)] flex items-center justify-between px-8 bg-[#0e0e0e]/80 cf-glass z-10">
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        <Shield size={20} className="text-[#fd9d27]" />
                        Admin Panel
                    </h1>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsLightMode(!isLightMode)} 
                            className="text-[#494847] hover:text-[#fd9d27] transition-colors p-2 rounded-full hover:bg-[rgba(73,72,71,0.1)]"
                        >
                            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <NotificationBell />
                        <div className="h-6 w-[1px] bg-[rgba(73,72,71,0.15)]"></div>
                        <p className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-8 animate-fade-up">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                            Admin Panel
                        </h1>
                        <p className="text-[#adaaaa] text-lg font-medium">Manage all campus systems from one place.</p>
                    </div>

                    <div className="max-w-full animate-fade-up">
                        <AdminPanel />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
