import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, Tag, DollarSign, ShoppingBag } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Books', 'Electronics', 'Cycles', 'Calculators', 'Hostel Items', 'Stationery', 'Other'];

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Other', contact: '' });
    const [formError, setFormError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (categoryFilter) params.category = categoryFilter;
            if (searchQuery.trim()) params.search = searchQuery.trim();
            const res = await api.get('/marketplace', { params });
            setListings(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [categoryFilter, searchQuery]);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.title.trim() || !form.price) { setFormError('Title and price are required'); return; }
        try {
            await api.post('/marketplace', form);
            setShowForm(false);
            setForm({ title: '', description: '', price: '', category: 'Other', contact: '' });
            fetchListings();
        } catch (err) { setFormError(err.response?.data?.message || 'Failed to create listing'); }
    };

    const handleMarkSold = async (id) => {
        try { await api.put(`/marketplace/${id}`, { status: 'sold' }); fetchListings(); }
        catch (err) { alert('Update failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this listing?')) return;
        try { await api.delete(`/marketplace/${id}`); fetchListings(); }
        catch (err) { alert('Delete failed'); }
    };

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Student Marketplace</h2>
                    <p className="text-[#adaaaa] text-sm font-medium mt-1">Buy and sell within campus</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                    <Plus size={16} /> Create Listing
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                    <input className="cf-input pl-10 rounded-xl" placeholder="Search listings..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                </div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="cf-input rounded-xl min-w-[160px] appearance-none cursor-pointer">
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative w-full max-w-lg bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-8 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Create Listing</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#262626] rounded-xl text-[#494847] hover:text-white"><X size={20} /></button>
                        </div>
                        {formError && <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl font-medium">{formError}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Item Name</label><input className="cf-input" placeholder="e.g., Engineering Mathematics Textbook" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                            <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Description</label><textarea className="cf-input resize-none" rows={3} placeholder="Condition, details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Price (₹)</label><input type="number" className="cf-input" placeholder="500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                                <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Category</label><select className="cf-input appearance-none cursor-pointer" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                            </div>
                            <div><label className="block text-sm font-bold text-[#adaaaa] mb-2">Contact</label><input className="cf-input" placeholder="Phone or WhatsApp" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                            <button type="submit" className="w-full py-4 btn-primary text-sm">Post Listing</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
            ) : listings.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1919] rounded-2xl border border-[rgba(73,72,71,0.15)]">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-[#494847]" />
                    <p className="text-[#adaaaa] font-medium">No listings yet</p>
                    <p className="text-[#494847] text-sm mt-1">Be the first to list something!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map(item => {
                        const canModify = currentUser.id === item.user_id || currentUser.role === 2;
                        return (
                            <div key={item.id} className="p-5 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold px-2 py-1 bg-[#71ceff]/10 text-[#71ceff] rounded-full uppercase tracking-widest">{item.category}</span>
                                    <span className="text-xl font-black text-[#c0fe71]">₹{item.price}</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                                {item.description && <p className="text-xs text-[#adaaaa] mb-3 line-clamp-2">{item.description}</p>}
                                {item.contact && <p className="text-xs text-[#fd9d27] font-medium mb-2">📱 {item.contact}</p>}
                                <div className="flex justify-between items-center text-[10px] text-[#494847] font-bold uppercase tracking-widest pt-3 border-t border-[rgba(73,72,71,0.15)]">
                                    <span>By {item.seller_name}</span>
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                {canModify && (
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => handleMarkSold(item.id)} className="flex-1 text-xs font-bold py-2 bg-[#c0fe71]/10 text-[#c0fe71] rounded-lg hover:bg-[#c0fe71]/20 transition-all">Mark as Sold</button>
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

export default Marketplace;
