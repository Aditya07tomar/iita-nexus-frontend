import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Utensils, Bus, MessageSquare, 
    LogOut, Search, Zap, Briefcase, ChevronRight, BookOpen, Shield,
    AlertTriangle, ShoppingBag, Calendar, Calculator, MessageCircle,
    Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AIChat from '../components/AIChat';
import TransitCard from '../components/TransitCard';
import CareerBridge from '../components/CareerBridge';
import MessModule from '../components/MessModule';
import StudyMaterials from '../components/StudyMaterials';
import AdminPanel from '../components/AdminPanel';
import NotificationBell from '../components/NotificationBell';
import LostFound from '../components/LostFound';
import Marketplace from '../components/Marketplace';
import Events from '../components/Events';
import CGPACalculator from '../components/CGPACalculator';
import FeedbackForm from '../components/FeedbackForm';
import api from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLightMode, setIsLightMode] = useState(false);
    

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [nextMealData, setNextMealData] = useState({ title: 'Loading...', menu: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNextMeal = async () => {
            try {
                const res = await api.get('/mess/weekly');
                const weeklyMenu = res.data;
                const now = new Date();
                const hour = now.getHours();
                
                let targetDate = new Date(now);
                let mealType = 'Breakfast';
                
                if (hour < 10) {
                    mealType = 'Breakfast';
                } else if (hour < 15) {
                    mealType = 'Lunch';
                } else if (hour < 22) {
                    mealType = 'Dinner';
                } else {
                    mealType = 'Breakfast';
                    targetDate.setDate(targetDate.getDate() + 1);
                }
                
                const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
                const dayMenu = weeklyMenu.find(d => d.day_of_week === dayName);
                
                if (dayMenu) {
                    setNextMealData({
                        title: mealType,
                        menu: dayMenu[mealType.toLowerCase()] || 'Menu not updated'
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchNextMeal();
        
        // Refresh every minute to stay synced with time
        const interval = setInterval(fetchNextMeal, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Guard clause for session management
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isAdmin = user?.role === 2;

    // Map tab names to display titles
    const getTabTitle = () => {
        const titles = {
            'Overview': `Welcome back, ${user?.name?.split(' ')[0]}!`,
            'Materials': 'Study Materials',
            'Admin': 'Admin Panel',
            'LostFound': 'Lost & Found',
            'Marketplace': 'Student Marketplace',
            'Events': 'Campus Events',
            'CGPA': 'CGPA Calculator',
            'Feedback': 'Campus Feedback',
        };
        return titles[activeTab] || activeTab;
    };

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
                    <SidebarLink 
                        icon={<LayoutDashboard size={20}/>} 
                        label="Overview" 
                        active={activeTab === 'Overview'} 
                        onClick={() => setActiveTab('Overview')} 
                    />
                    <SidebarLink 
                        icon={<Utensils size={20}/>} 
                        label="Mess Menu" 
                        active={activeTab === 'Mess'} 
                        onClick={() => setActiveTab('Mess')} 
                    />
                    <SidebarLink 
                        icon={<Bus size={20}/>} 
                        label="Transit Tracker" 
                        active={activeTab === 'Transit'} 
                        onClick={() => setActiveTab('Transit')} 
                    />
                    <SidebarLink 
                        icon={<Briefcase size={20}/>} 
                        label="Career Bridge" 
                        active={activeTab === 'Career'} 
                        onClick={() => setActiveTab('Career')} 
                    />
                    <SidebarLink 
                        icon={<BookOpen size={20}/>} 
                        label="Study Materials" 
                        active={activeTab === 'Materials'} 
                        onClick={() => setActiveTab('Materials')} 
                    />

                    <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#494847] uppercase tracking-[0.2em]">
                        Campus Life
                    </div>
                    <SidebarLink 
                        icon={<AlertTriangle size={20}/>} 
                        label="Lost & Found" 
                        active={activeTab === 'LostFound'} 
                        onClick={() => setActiveTab('LostFound')} 
                    />
                    <SidebarLink 
                        icon={<ShoppingBag size={20}/>} 
                        label="Marketplace" 
                        active={activeTab === 'Marketplace'} 
                        onClick={() => setActiveTab('Marketplace')} 
                    />
                    <SidebarLink 
                        icon={<Calendar size={20}/>} 
                        label="Events" 
                        active={activeTab === 'Events'} 
                        onClick={() => setActiveTab('Events')} 
                    />

                    <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#494847] uppercase tracking-[0.2em]">
                        Tools
                    </div>
                    <SidebarLink 
                        icon={<Calculator size={20}/>} 
                        label="CGPA Calculator" 
                        active={activeTab === 'CGPA'} 
                        onClick={() => setActiveTab('CGPA')} 
                    />
                    <SidebarLink 
                        icon={<MessageCircle size={20}/>} 
                        label="Feedback" 
                        active={activeTab === 'Feedback'} 
                        onClick={() => setActiveTab('Feedback')} 
                    />
                    
                    <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#494847] uppercase tracking-[0.2em]">
                        Intelligence
                    </div>
                    {/* Toggle logic for AI Drawer */}
                    <SidebarLink 
                        icon={<MessageSquare size={20}/>} 
                        label="CampusFlow AI" 
                        active={isChatOpen}
                        onClick={() => setIsChatOpen(!isChatOpen)} 
                    />

                    {/* Admin-only sidebar link */}
                    {isAdmin && (
                        <>
                            <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#494847] uppercase tracking-[0.2em]">
                                Administration
                            </div>
                            <SidebarLink 
                                icon={<Shield size={20}/>} 
                                label="Admin Panel" 
                                active={activeTab === 'Admin'} 
                                onClick={() => setActiveTab('Admin')} 
                            />
                        </>
                    )}
                </nav>

                {/* User Context Footer */}
                <div className="p-5 mt-auto">
                    <div className="bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fd9d27]/10 flex items-center justify-center text-[#fd9d27] font-bold border border-[#fd9d27]/20 text-sm">
                            {user?.name?.[0] || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Student'}</p>
                            <p className="text-[10px] text-[#494847] truncate font-bold tracking-widest uppercase">
                                {isAdmin ? 'Admin' : 'Portal Active'}
                            </p>
                        </div>
                        <button onClick={handleLogout} className="text-[#494847] hover:text-[#ff7351] transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Application Canvas */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Global Header */}
                <header className="h-16 border-b border-[rgba(73,72,71,0.15)] flex items-center justify-between px-8 bg-[#0e0e0e]/80 cf-glass z-10">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                        <input 
                            className="cf-input pl-10 py-2.5 rounded-full text-sm" 
                            placeholder="Search campus logs..." 
                        />
                    </div>
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
                    {/* Header Section */}
                    <div className="mb-8 animate-fade-up">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                            {getTabTitle()}
                        </h1>
                        <p className="text-[#adaaaa] text-lg font-medium">Campus Management Systems Online.</p>
                    </div>

                    {/* View: Overview Dashboard */}
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                            <StatusCard title="Next Meal" value={nextMealData.title} sub={nextMealData.menu} color="#c0fe71" icon={<Utensils />} />
                            
                            {/* Real-time Transit Countdown */}
                            <TransitCard />
                            
                            <StatusCard title="CampusFlow AI" value="Stable" sub="Powered by Gemini 1.5" color="#71ceff" icon={<MessageSquare />} />
                            
                            {/* Feature Promo: Career Bridge */}
                            <div className="md:col-span-2 bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-8 flex justify-between items-center group cursor-pointer hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all relative overflow-hidden">
                                <div className="z-10">
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Career Bridge</h3>
                                    <p className="text-[#adaaaa] max-w-xs text-sm leading-relaxed mb-6">
                                        3 New placement drives are live. Check eligibility and schedule your interview.
                                    </p>
                                    <button 
                                        onClick={() => setActiveTab('Career')} 
                                        className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
                                    >
                                        Explore Jobs <ChevronRight size={16} />
                                    </button>
                                </div>
                                <Briefcase size={140} className="absolute -right-4 -bottom-4 text-[#fd9d27]/[0.04] group-hover:text-[#fd9d27]/[0.08] transition-all duration-500 rotate-12" />
                            </div>

                            {/* Study Materials Promo Card */}
                            <div className="bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-6 group cursor-pointer hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all relative overflow-hidden" onClick={() => setActiveTab('Materials')}>
                                <BookOpen size={80} className="absolute -right-2 -bottom-2 text-[#c0fe71]/[0.04] group-hover:text-[#c0fe71]/[0.08] transition-all duration-500 rotate-12" />
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#c0fe71]/10 flex items-center justify-center mb-4">
                                        <BookOpen size={20} className="text-[#c0fe71]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Study Materials</h3>
                                    <p className="text-xs text-[#adaaaa] leading-relaxed">Notes, PYQs, and resources — all in one place.</p>
                                </div>
                            </div>

                            {/* Quick Access: Campus Life Row */}
                            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <QuickLink label="Lost & Found" icon={<AlertTriangle size={20} />} color="#ff7351" onClick={() => setActiveTab('LostFound')} />
                                <QuickLink label="Marketplace" icon={<ShoppingBag size={20} />} color="#71ceff" onClick={() => setActiveTab('Marketplace')} />
                                <QuickLink label="Events" icon={<Calendar size={20} />} color="#c0fe71" onClick={() => setActiveTab('Events')} />
                                <QuickLink label="CGPA Calculator" icon={<Calculator size={20} />} color="#fd9d27" onClick={() => setActiveTab('CGPA')} />
                            </div>
                        </div>
                    )}

                    {/* View: Career Bridge Portal */}
                    {activeTab === 'Career' && (
                        <div className="max-w-5xl animate-fade-up">
                            <header className="mb-10">
                                <h2 className="text-2xl font-bold text-white tracking-tight">Campus Placements</h2>
                                <p className="text-[#adaaaa]">Active opportunities for the 2025-26 Academic Year.</p>
                            </header>
                            <CareerBridge />
                        </div>
                    )}

                    {/* View: Transit Tracker Detail */}
                    {activeTab === 'Transit' && (
                        <div className="max-w-3xl space-y-6 animate-fade-up">
                            <TransitCard />
                            <div className="bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6">Detailed Schedule</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex justify-between items-center p-5 bg-[#262626] rounded-xl hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#fd9d27]/10 rounded-lg flex items-center justify-center text-[#fd9d27] group-hover:bg-[#fd9d27] group-hover:text-[#4a2c00] transition-all">
                                                    <Bus size={20}/>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">Gate 3 Express</p>
                                                    <p className="text-[10px] text-[#494847] font-bold tracking-widest uppercase">Platform B</p>
                                                </div>
                                            </div>
                                            <p className="font-mono text-[#fd9d27] font-black">20:{i * 15}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: Mess Menu */}
                    {activeTab === 'Mess' && (
                        <div className="max-w-full animate-fade-up">
                            <header className="mb-10">
                                <h2 className="text-2xl font-bold text-white tracking-tight">Weekly Mess Planner</h2>
                                <p className="text-[#adaaaa] font-medium">Synced with Central Mess Committee.</p>
                            </header>
                            <MessModule />
                        </div>
                    )}

                    {/* View: Study Materials Hub */}
                    {activeTab === 'Materials' && (
                        <div className="max-w-full animate-fade-up">
                            <StudyMaterials />
                        </div>
                    )}

                    {/* View: Lost & Found */}
                    {activeTab === 'LostFound' && (
                        <div className="max-w-full animate-fade-up">
                            <LostFound />
                        </div>
                    )}

                    {/* View: Student Marketplace */}
                    {activeTab === 'Marketplace' && (
                        <div className="max-w-full animate-fade-up">
                            <Marketplace />
                        </div>
                    )}

                    {/* View: Campus Events */}
                    {activeTab === 'Events' && (
                        <div className="max-w-full animate-fade-up">
                            <Events />
                        </div>
                    )}

                    {/* View: CGPA Calculator */}
                    {activeTab === 'CGPA' && (
                        <div className="max-w-full animate-fade-up">
                            <CGPACalculator />
                        </div>
                    )}

                    {/* View: Feedback */}
                    {activeTab === 'Feedback' && (
                        <div className="max-w-full animate-fade-up">
                            <FeedbackForm />
                        </div>
                    )}

                    {/* View: Admin Panel (Admin Only) */}
                    {activeTab === 'Admin' && isAdmin && (
                        <div className="max-w-full animate-fade-up">
                            <AdminPanel />
                        </div>
                    )}
                </div>

                {/* AIChat Drawer (Overlays Main Area) */}
                <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </main>
        </div>
    );
};

/* --- Reusable Internal Components --- */

const SidebarLink = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group cursor-pointer ${
            active 
                ? 'bg-[#fd9d27]/10 text-[#fd9d27] ambient-glow' 
                : 'text-[#adaaaa] hover:bg-[#1a1919] hover:text-white'
        }`}
    >
        <span className={`${active ? 'text-[#fd9d27]' : 'text-[#494847] group-hover:text-[#fd9d27]'} transition-colors`}>
            {icon}
        </span>
        <span className="font-semibold text-sm">
            {label}
        </span>
    </button>
);

const StatusCard = ({ title, value, sub, color, icon }) => (
    <div className="p-6 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all group relative overflow-hidden">
        <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${color}15`, color: color }}
        >
            {icon}
        </div>
        <h3 className="text-[#494847] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{title}</h3>
        <p className="text-3xl font-black text-white mb-1 tracking-tight">{value}</p>
        <p className="text-xs text-[#adaaaa] font-medium">{sub}</p>
    </div>
);

const QuickLink = ({ label, icon, color, onClick }) => (
    <button onClick={onClick} className="p-5 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all group cursor-pointer text-left">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
        </div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-[10px] text-[#494847] font-bold uppercase tracking-widest mt-1">Open →</p>
    </button>
);

export default Dashboard;