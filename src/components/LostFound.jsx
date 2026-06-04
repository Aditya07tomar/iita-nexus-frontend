import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const STATUS_COLORS = {
    open: { bg: 'bg-[#c0fe71]/10', text: 'text-[#c0fe71]' },
    claimed: { bg: 'bg-[#fd9d27]/10', text: 'text-[#fd9d27]' },
    closed: { bg: 'bg-[#494847]/10', text: 'text-[#494847]' }
};

const LostFound = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ type: 'lost', title: '', description: '', location: '', contact: '' });
    const [formError, setFormError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const params = { status: 'open' };
            if (typeFilter) params.type = typeFilter;
            if (searchQuery.trim()) params.search = searchQuery.trim();
            const res = await api.get('/lost-found', { params });
            setItems(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [typeFilter, searchQuery]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.title.trim()) { setFormError('Title is required'); return; }
        try {
            await api.post('/lost-found', form);
            setShowForm(false);
            setForm({ type: 'lost', title: '', description: '', location: '', contact: '' });
            fetchItems();
        } catch (err) { setFormError(err.response?.data?.message || 'Failed to report'); }
    };

    const handleStatusUpdate = async (id, status) => {
        try { await api.put(`/lost-found/${id}/status`, { status }); fetchItems(); }
        catch (err) { alert('Update failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try { await api.delete(`/lost-found/${id}`); fetchItems(); }
        catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Lost & Found</h2>
                    <p className="text-[#adaaaa] text-sm font-medium mt-1">Help reunite lost items with their owners</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                    <Plus size={16} /> Report Item
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                    <input className="cf-input pl-10 rounded-xl" placeholder="Search items..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    {['', 'lost', 'found'].map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${typeFilter === t ? 'bg-[#fd9d27]/10 text-[#fd9d27]' : 'bg-[#1a1919] text-[#adaaaa] hover:bg-[#262626]'}`}>
                            {t === '' ? 'All' : t === 'lost' ? '🔍 Lost' : '📦 Found'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-lg bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-8 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Report Item</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#262626] rounded-xl text-[#494847] hover:text-white"><X size={20} /></button>
                        </div>
                        {formError && <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl font-medium">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-3">
                                {['lost', 'found'].map(t => (
                                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${form.type === t ? (t === 'lost' ? 'bg-[#ff7351]/10 text-[#ff7351] border border-[#ff7351]/30' : 'bg-[#c0fe71]/10 text-[#c0fe71] border border-[#c0fe71]/30') : 'bg-[#262626] text-[#adaaaa]'}`}>
                                        {t === 'lost' ? '🔍 I Lost Something' : '📦 I Found Something'}
                                    </button>
                                ))}
                            </div>
                            <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Item Name</label><input className="cf-input" placeholder="e.g., Blue Water Bottle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                            <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Description</label><textarea className="cf-input resize-none" rows={3} placeholder="Color, brand, any identifying marks..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Location</label><input className="cf-input" placeholder="e.g., Library 2nd Floor" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Contact</label><input className="cf-input" placeholder="Phone or email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                            </div>
                            <button type="submit" className="w-full py-4 btn-primary text-sm">Submit Report</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Items Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1919] rounded-2xl border border-[rgba(73,72,71,0.15)]">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-[#494847]" />
                    <p className="text-[#adaaaa] font-medium">No items reported</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => {
                        const color = item.type === 'lost' ? '#ff7351' : '#c0fe71';
                        const canModify = currentUser.id === item.user_id || currentUser.role === 2;
                        return (
                            <div key={item.id} className="p-5 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest" style={{ backgroundColor: `${color}15`, color }}>{item.type}</span>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${STATUS_COLORS[item.status]?.bg} ${STATUS_COLORS[item.status]?.text}`}>{item.status}</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                                {item.description && <p className="text-xs text-[#adaaaa] mb-2 line-clamp-2">{item.description}</p>}
                                {item.location && <p className="text-xs text-[#494847] flex items-center gap-1 mb-1"><MapPin size={12} /> {item.location}</p>}
                                <div className="flex justify-between items-center text-[10px] text-[#494847] font-bold uppercase tracking-widest mt-3 pt-3 border-t border-[rgba(73,72,71,0.15)]">
                                    <span>By {item.posted_by}</span>
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                {canModify && item.status === 'open' && (
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleStatusUpdate(item.id, 'claimed')} className="flex-1 text-xs font-bold py-2 bg-[#fd9d27]/10 text-[#fd9d27] rounded-lg hover:bg-[#fd9d27]/20 transition-all">
                                            <CheckCircle size={12} className="inline mr-1" /> Mark Claimed
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-xs font-bold py-2 px-3 bg-[#262626] text-[#adaaaa] rounded-lg hover:bg-[#ff7351] hover:text-white transition-all">✕</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LostFound;
