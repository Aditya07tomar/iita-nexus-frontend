import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, Tag } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Mess Food', 'Hostel', 'Faculty', 'Library', 'Labs', 'Transport', 'Website', 'Other'];

const FeedbackForm = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ category: 'Other', title: '', message: '', rating: 5 });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchFeedback = async () => {
        try {
            const res = await api.get('/feedback');
            setFeedbackList(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchFeedback(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.title.trim() || !form.message.trim()) { setError('Title and message are required'); return; }
        setSubmitting(true);
        try {
            await api.post('/feedback', form);
            setSuccess('Feedback submitted successfully!');
            setForm({ category: 'Other', title: '', message: '', rating: 5 });
            fetchFeedback();
        } catch (err) { setError(err.response?.data?.message || 'Submission failed'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Campus Feedback</h2>
                <p className="text-[#adaaaa] text-sm font-medium mt-1">Share your thoughts to help improve campus life</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="p-6 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)]">
                    <h3 className="text-base font-bold text-white mb-4">Submit Feedback</h3>
                    {error && <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl font-medium">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-[#c0fe71]/10 border border-[#c0fe71]/30 text-[#c0fe71] text-sm rounded-xl font-medium">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Category</label>
                            <select className="cf-input appearance-none cursor-pointer" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Title</label>
                            <input className="cf-input" placeholder="Brief summary of your feedback" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Message</label>
                            <textarea className="cf-input resize-none" rows={4} placeholder="Describe your feedback in detail..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(r => (
                                    <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })} className={`p-2 rounded-lg transition-all ${form.rating >= r ? 'text-[#fd9d27]' : 'text-[#494847]'}`}>
                                        <Star size={24} fill={form.rating >= r ? '#fd9d27' : 'transparent'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={submitting} className="w-full py-4 btn-primary text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                            {submitting ? <><div className="spinner" /> Submitting...</> : <><Send size={16} /> Submit Feedback</>}
                        </button>
                    </form>
                </div>

                {/* Previous Feedback */}
                <div className="space-y-3">
                    <h3 className="text-base font-bold text-white">Your Previous Feedback</h3>
                    {loading ? (
                        <div className="flex justify-center py-12"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
                    ) : feedbackList.length === 0 ? (
                        <div className="text-center py-12 bg-[#1a1919] rounded-2xl border border-[rgba(73,72,71,0.15)]">
                            <MessageSquare size={32} className="mx-auto mb-3 text-[#494847]" />
                            <p className="text-[#adaaaa] text-sm font-medium">No feedback submitted yet</p>
                        </div>
                    ) : (
                        feedbackList.map(f => (
                            <div key={f.id} className="p-4 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)]">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold px-2 py-1 bg-[#71ceff]/10 text-[#71ceff] rounded-full uppercase tracking-widest">{f.category}</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <Star key={r} size={10} className={f.rating >= r ? 'text-[#fd9d27]' : 'text-[#494847]'} fill={f.rating >= r ? '#fd9d27' : 'transparent'} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-[#494847] font-bold">{new Date(f.created_at).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">{f.title}</h4>
                                <p className="text-xs text-[#adaaaa] line-clamp-2">{f.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
