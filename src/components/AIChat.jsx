import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Zap, Clock, Trash2, Search, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const AIChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am CampusFlow AI. Ask me about today\'s mess menu or campus timings!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom() }, [messages]);

    // ──── Chat ────
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/chat', { question: input });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
        } finally {
            setLoading(false);
        }
    };

    // ──── History ────
    const fetchHistory = async (search = '') => {
        setHistoryLoading(true);
        try {
            const params = {};
            if (search.trim()) params.search = search.trim();
            const res = await api.get('/ai/history', { params });
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleOpenHistory = () => {
        setShowHistory(true);
        fetchHistory();
    };

    const handleSearchHistory = (val) => {
        setHistorySearch(val);
        clearTimeout(window._chatSearchTimer);
        window._chatSearchTimer = setTimeout(() => fetchHistory(val), 400);
    };

    const handleDeleteEntry = async (id) => {
        try {
            await api.delete(`/ai/history/${id}`);
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Clear all chat history?')) return;
        try {
            await api.delete('/ai/history');
            setHistory([]);
        } catch (err) {
            console.error('Clear failed:', err);
        }
    };

    const handleReopenConversation = (entry) => {
        setMessages([
            { role: 'user', text: entry.question },
            { role: 'bot', text: entry.answer }
        ]);
        setShowHistory(false);
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`fixed inset-y-0 right-0 w-96 bg-[#131313] border-l border-[rgba(73,72,71,0.15)] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="p-4 border-b border-[rgba(73,72,71,0.15)] flex justify-between items-center cf-glass">
                <div className="flex items-center gap-3">
                    {showHistory && (
                        <button onClick={() => setShowHistory(false)} className="p-1.5 hover:bg-[#1a1919] rounded-lg transition-colors text-[#494847] hover:text-white">
                            <ArrowLeft size={16} />
                        </button>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-[#fd9d27]/10 flex items-center justify-center">
                        <Zap size={16} className="text-[#fd9d27]" fill="#fd9d27" strokeWidth={0} />
                    </div>
                    <div>
                        <span className="font-bold text-white text-sm">{showHistory ? 'Chat History' : 'CampusFlow AI'}</span>
                        {!showHistory && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#c0fe71] led-dot" />
                                <span className="text-[10px] text-[#adaaaa] font-bold">Online</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {!showHistory && (
                        <button onClick={handleOpenHistory} className="p-2 hover:bg-[#1a1919] rounded-xl transition-colors text-[#494847] hover:text-[#fd9d27]" title="Chat History">
                            <Clock size={16} />
                        </button>
                    )}
                    <button onClick={onClose} className="p-2 hover:bg-[#1a1919] rounded-xl transition-colors text-[#494847] hover:text-white">
                        <X size={18}/>
                    </button>
                </div>
            </div>

            {showHistory ? (
                /* ──── History View ──── */
                <div className="h-[calc(100%-65px)] flex flex-col">
                    <div className="p-3 border-b border-[rgba(73,72,71,0.15)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#494847]" size={14} />
                            <input className="cf-input pl-9 py-2 text-sm rounded-lg" placeholder="Search conversations..." value={historySearch} onChange={(e) => handleSearchHistory(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {historyLoading ? (
                            <div className="flex justify-center py-12"><div className="spinner" /></div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <Clock size={32} className="mx-auto mb-3 text-[#494847]" />
                                <p className="text-[#adaaaa] text-sm font-medium">No conversations yet</p>
                            </div>
                        ) : (
                            <div className="p-3 space-y-2">
                                {history.map((entry) => (
                                    <div key={entry.id} className="p-3 bg-[#1a1919] rounded-xl hover:bg-[#262626] transition-all cursor-pointer group" onClick={() => handleReopenConversation(entry)}>
                                        <p className="text-sm text-white font-medium line-clamp-1 mb-1">{entry.question}</p>
                                        <p className="text-xs text-[#adaaaa] line-clamp-2 mb-2">{entry.answer}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-[#494847] font-bold">{formatTime(entry.created_at)}</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteEntry(entry.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#ff7351]/20 rounded text-[#494847] hover:text-[#ff7351] transition-all">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {history.length > 0 && (
                        <div className="p-3 border-t border-[rgba(73,72,71,0.15)]">
                            <button onClick={handleClearAll} className="w-full text-center text-xs text-[#ff7351] font-bold py-2 hover:bg-[#ff7351]/10 rounded-lg transition-colors">
                                Clear All History
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* ──── Chat View ──── */
                <>
                    <div className="h-[calc(100%-130px)] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-[#fd9d27] text-[#4a2c00] font-medium' 
                                        : 'bg-[#1a1919] border border-[rgba(73,72,71,0.15)] text-[#adaaaa]'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-2 text-xs text-[#fd9d27]">
                                <div className="spinner" />
                                <span className="font-bold">Thinking...</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t border-[rgba(73,72,71,0.15)] cf-glass absolute bottom-0 w-full">
                        <div className="relative">
                            <input 
                                className="cf-input pr-12 rounded-xl py-3"
                                placeholder="Ask anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#fd9d27] rounded-lg hover:shadow-[0_0_20px_rgba(253,157,39,0.3)] transition-all text-[#4a2c00]">
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default AIChat;