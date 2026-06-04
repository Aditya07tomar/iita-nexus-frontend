import React, { useState, useEffect, useCallback } from 'react';
import { 
    BarChart3, Users, Utensils, Briefcase, Megaphone, BookOpen, 
    Plus, Edit3, Trash2, X, Save, RefreshCw 
} from 'lucide-react';
import api from '../services/api';

// ══════════════════════════════════════════
// AdminPanel — Complete Admin Dashboard
// ══════════════════════════════════════════
const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState('analytics');

    const sections = [
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
        { id: 'users', label: 'Users', icon: <Users size={18} /> },
        { id: 'placements', label: 'Placements', icon: <Briefcase size={18} /> },
        { id: 'announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
        { id: 'mess', label: 'Mess Menu', icon: <Utensils size={18} /> },
        { id: 'materials', label: 'Materials', icon: <BookOpen size={18} /> },
    ];

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Section Tabs */}
            <div className="flex gap-2 flex-wrap">
                {sections.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeSection === s.id
                                ? 'bg-[#fd9d27]/10 text-[#fd9d27]'
                                : 'bg-[#1a1919] text-[#adaaaa] hover:bg-[#262626] hover:text-white'
                        }`}
                    >
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            {/* Section Content */}
            {activeSection === 'analytics' && <AnalyticsSection />}
            {activeSection === 'users' && <UsersSection />}
            {activeSection === 'placements' && <PlacementsSection />}
            {activeSection === 'announcements' && <AnnouncementsSection />}
            {activeSection === 'mess' && <MessSection />}
            {activeSection === 'materials' && <MaterialsSection />}
        </div>
    );
};

// ──── Analytics Dashboard ────
const AnalyticsSection = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/analytics');
                setStats(res.data);
            } catch (err) {
                console.error('Analytics error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;
    if (!stats) return <p className="text-[#adaaaa]">Failed to load analytics.</p>;

    const cards = [
        { label: 'Total Users', value: stats.totalUsers, color: '#fd9d27' },
        { label: 'Study Materials', value: stats.totalMaterials, color: '#c0fe71' },
        { label: 'Total Downloads', value: stats.totalDownloads, color: '#71ceff' },
        { label: 'AI Conversations', value: stats.totalChats, color: '#fd9d27' },
        { label: 'Placement Drives', value: stats.totalPlacements, color: '#c0fe71' },
        { label: 'Announcements', value: stats.totalAnnouncements, color: '#71ceff' },
        { label: 'New Users (7d)', value: stats.recentUsers, color: '#fd9d27' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)]">
                        <p className="text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-2">{c.label}</p>
                        <p className="text-3xl font-black tracking-tight" style={{ color: c.color }}>{c.value}</p>
                    </div>
                ))}
            </div>
            {stats.topMaterials?.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)]">
                    <h3 className="text-sm font-bold text-white mb-4">Most Downloaded Materials</h3>
                    <div className="space-y-2">
                        {stats.topMaterials.map((m, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-[#262626] rounded-xl">
                                <span className="text-sm text-white font-medium">{m.title}</span>
                                <span className="text-xs text-[#fd9d27] font-bold">{m.download_count} downloads</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ──── Users Management ────
const UsersSection = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error('Users fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    return (
        <div className="rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[rgba(73,72,71,0.15)]">
                            <th className="text-left p-4 text-[10px] font-bold text-[#494847] uppercase tracking-widest">Name</th>
                            <th className="text-left p-4 text-[10px] font-bold text-[#494847] uppercase tracking-widest">Email</th>
                            <th className="text-left p-4 text-[10px] font-bold text-[#494847] uppercase tracking-widest">Roll No</th>
                            <th className="text-left p-4 text-[10px] font-bold text-[#494847] uppercase tracking-widest">Role</th>
                            <th className="text-left p-4 text-[10px] font-bold text-[#494847] uppercase tracking-widest">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b border-[rgba(73,72,71,0.08)] hover:bg-[#262626] transition-colors">
                                <td className="p-4 text-white font-medium">{u.name}</td>
                                <td className="p-4 text-[#adaaaa]">{u.email}</td>
                                <td className="p-4 text-[#adaaaa]">{u.roll_no}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${u.role_id === 2 ? 'bg-[#fd9d27]/10 text-[#fd9d27]' : 'bg-[#71ceff]/10 text-[#71ceff]'}`}>
                                        {u.role_id === 2 ? 'Admin' : 'Student'}
                                    </span>
                                </td>
                                <td className="p-4 text-[#494847] text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ──── Placements Management ────
const PlacementsSection = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ company_name: '', role: '', salary: '', deadline: '', location: '', status: 'active' });

    const fetchPlacements = useCallback(async () => {
        try {
            const res = await api.get('/placements');
            setPlacements(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPlacements(); }, [fetchPlacements]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/admin/placements/${editingId}`, form);
            } else {
                await api.post('/admin/placements', form);
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ company_name: '', role: '', salary: '', deadline: '', location: '', status: 'active' });
            fetchPlacements();
        } catch (err) {
            alert(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (p) => {
        setForm({
            company_name: p.company_name, role: p.role, salary: p.salary,
            deadline: p.deadline?.split('T')[0] || '', location: p.location || '', status: p.status || 'active'
        });
        setEditingId(p.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this placement drive?')) return;
        try { await api.delete(`/admin/placements/${id}`); fetchPlacements(); }
        catch (err) { alert('Delete failed'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-[#adaaaa] font-medium">{placements.length} placement{placements.length !== 1 ? 's' : ''}</p>
                <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ company_name: '', role: '', salary: '', deadline: '', location: '', status: 'active' }); }} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                    <Plus size={16} /> Add Placement
                </button>
            </div>

            {showForm && (
                <AdminForm title={editingId ? 'Edit Placement' : 'New Placement'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
                    <FormInput label="Company Name" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} required />
                    <FormInput label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} required />
                    <FormInput label="Salary (LPA)" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} />
                    <FormInput label="Deadline" type="date" value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} required />
                    <FormInput label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
                </AdminForm>
            )}

            <div className="space-y-3">
                {placements.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:bg-[#262626] transition-all">
                        <div>
                            <p className="text-sm font-bold text-white">{p.company_name} — {p.role}</p>
                            <p className="text-xs text-[#adaaaa]">{p.salary} LPA • {p.location} • Deadline: {new Date(p.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(p)} className="p-2 bg-[#262626] hover:bg-[#fd9d27] text-[#adaaaa] hover:text-[#4a2c00] rounded-lg transition-all"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-[#262626] hover:bg-[#ff7351] text-[#adaaaa] hover:text-white rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ──── Announcements Management ────
const AnnouncementsSection = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', tag: 'general' });

    const fetchData = useCallback(async () => {
        try { const res = await api.get('/announcements'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) { await api.put(`/admin/announcements/${editingId}`, form); }
            else { await api.post('/admin/announcements', form); }
            setShowForm(false); setEditingId(null);
            setForm({ title: '', content: '', tag: 'general' }); fetchData();
        } catch (err) { alert(err.response?.data?.message || 'Operation failed'); }
    };

    const handleEdit = (a) => {
        setForm({ title: a.title, content: a.content, tag: a.tag || 'general' });
        setEditingId(a.id); setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this announcement?')) return;
        try { await api.delete(`/admin/announcements/${id}`); fetchData(); }
        catch (err) { alert('Delete failed'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-[#adaaaa] font-medium">{items.length} announcement{items.length !== 1 ? 's' : ''}</p>
                <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', tag: 'general' }); }} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                    <Plus size={16} /> New Announcement
                </button>
            </div>

            {showForm && (
                <AdminForm title={editingId ? 'Edit Announcement' : 'New Announcement'} onClose={() => setShowForm(false)} onSubmit={handleSubmit}>
                    <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">Content</label>
                        <textarea className="cf-input resize-none" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
                    </div>
                    <FormInput label="Tag" value={form.tag} onChange={(v) => setForm({ ...form, tag: v })} placeholder="e.g., academic, event, urgent" />
                </AdminForm>
            )}

            <div className="space-y-3">
                {items.map(a => (
                    <div key={a.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:bg-[#262626] transition-all">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-bold text-white">{a.title}</p>
                                {a.tag && <span className="text-[10px] font-bold px-2 py-0.5 bg-[#fd9d27]/10 text-[#fd9d27] rounded-full">{a.tag}</span>}
                            </div>
                            <p className="text-xs text-[#adaaaa] line-clamp-1">{a.content}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(a)} className="p-2 bg-[#262626] hover:bg-[#fd9d27] text-[#adaaaa] hover:text-[#4a2c00] rounded-lg transition-all"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete(a.id)} className="p-2 bg-[#262626] hover:bg-[#ff7351] text-[#adaaaa] hover:text-white rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ──── Mess Menu Management ────
const MessSection = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });

    const fetchMenu = useCallback(async () => {
        try { const res = await api.get('/mess/weekly'); setMenu(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchMenu(); }, [fetchMenu]);

    const handleSave = async (id) => {
        try {
            await api.put(`/admin/mess/${id}`, editForm);
            setEditingId(null);
            fetchMenu();
        } catch (err) { alert('Update failed'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    return (
        <div className="space-y-3">
            {menu.map(day => (
                <div key={day.id} className="p-5 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)]">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-white">{day.day_of_week}</h4>
                        {editingId === day.id ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleSave(day.id)} className="p-1.5 bg-[#c0fe71]/10 hover:bg-[#c0fe71]/20 text-[#c0fe71] rounded-lg transition-all"><Save size={14} /></button>
                                <button onClick={() => setEditingId(null)} className="p-1.5 bg-[#262626] hover:bg-[#1a1919] text-[#adaaaa] rounded-lg transition-all"><X size={14} /></button>
                            </div>
                        ) : (
                            <button onClick={() => { setEditingId(day.id); setEditForm({ breakfast: day.breakfast, lunch: day.lunch, dinner: day.dinner }); }} className="p-1.5 bg-[#262626] hover:bg-[#fd9d27] text-[#adaaaa] hover:text-[#4a2c00] rounded-lg transition-all"><Edit3 size={14} /></button>
                        )}
                    </div>
                    {editingId === day.id ? (
                        <div className="grid grid-cols-3 gap-3">
                            <div><label className="block text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-1">Breakfast</label><input className="cf-input text-sm" value={editForm.breakfast} onChange={(e) => setEditForm({ ...editForm, breakfast: e.target.value })} /></div>
                            <div><label className="block text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-1">Lunch</label><input className="cf-input text-sm" value={editForm.lunch} onChange={(e) => setEditForm({ ...editForm, lunch: e.target.value })} /></div>
                            <div><label className="block text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-1">Dinner</label><input className="cf-input text-sm" value={editForm.dinner} onChange={(e) => setEditForm({ ...editForm, dinner: e.target.value })} /></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div><span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Breakfast</span><p className="text-[#adaaaa] mt-1">{day.breakfast}</p></div>
                            <div><span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Lunch</span><p className="text-[#adaaaa] mt-1">{day.lunch}</p></div>
                            <div><span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Dinner</span><p className="text-[#adaaaa] mt-1">{day.dinner}</p></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// ──── Materials Moderation ────
const MaterialsSection = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaterials = useCallback(async () => {
        try { const res = await api.get('/materials'); setMaterials(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

    const handleDelete = async (id) => {
        if (!confirm('Remove this material?')) return;
        try { await api.delete(`/admin/materials/${id}`); fetchMaterials(); }
        catch (err) { alert('Delete failed'); }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>;

    return (
        <div className="space-y-3">
            <p className="text-sm text-[#adaaaa] font-medium">{materials.length} material{materials.length !== 1 ? 's' : ''} uploaded</p>
            {materials.map(m => (
                <div key={m.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:bg-[#262626] transition-all">
                    <div>
                        <p className="text-sm font-bold text-white">{m.title}</p>
                        <p className="text-xs text-[#adaaaa]">
                            {m.subject} • Sem {m.semester} • {m.category || 'Notes'} • By {m.uploader_name} • {m.download_count} downloads
                        </p>
                    </div>
                    <button onClick={() => handleDelete(m.id)} className="p-2 bg-[#262626] hover:bg-[#ff7351] text-[#adaaaa] hover:text-white rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
            ))}
        </div>
    );
};

// ──── Shared: Admin Form Wrapper ────
const AdminForm = ({ title, onClose, onSubmit, children }) => (
    <div className="p-6 rounded-2xl bg-[#1a1919] border border-[#fd9d27]/20">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-[#262626] rounded-lg text-[#494847] hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
            {children}
            <button type="submit" className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
                <Save size={14} /> Save
            </button>
        </form>
    </div>
);

// ──── Shared: Form Input ────
const FormInput = ({ label, value, onChange, type = 'text', required = false, placeholder = '' }) => (
    <div>
        <label className="block text-sm font-bold text-[#adaaaa] mb-2">{label}</label>
        <input
            type={type} className="cf-input" value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required} placeholder={placeholder}
        />
    </div>
);

export default AdminPanel;
