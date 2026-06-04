import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import api from '../services/api';

// ══════════════════════════════════════════
// NotificationBell — Dropdown notification center
// Used in the Dashboard header bar
// ══════════════════════════════════════════
const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch unread count on mount and periodically
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/count');
            setUnreadCount(res.data.count);
        } catch (err) {
            // Silently fail — don't break the header
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_status: 1 } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Mark as read failed:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read_status: 1 })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Mark all as read failed:', err);
        }
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
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button onClick={handleToggle} className="text-[#494847] hover:text-white transition-colors relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#fd9d27] rounded-full led-dot border-2 border-[#0e0e0e] flex items-center justify-center text-[8px] font-bold text-[#4a2c00]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-10 w-80 bg-[#131313] border border-[rgba(73,72,71,0.15)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="p-4 border-b border-[rgba(73,72,71,0.15)] flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="text-[10px] font-bold text-[#fd9d27] hover:underline flex items-center gap-1">
                                <CheckCheck size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-8"><div className="spinner" /></div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <Bell size={24} className="mx-auto mb-2 text-[#494847]" />
                                <p className="text-[#adaaaa] text-sm font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-[rgba(73,72,71,0.08)] hover:bg-[#1a1919] transition-colors cursor-pointer ${!n.read_status ? 'bg-[#fd9d27]/[0.03]' : ''}`}
                                    onClick={() => !n.read_status && handleMarkAsRead(n.id)}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!n.read_status && <div className="w-2 h-2 rounded-full bg-[#fd9d27] flex-shrink-0" />}
                                                <p className="text-sm font-bold text-white truncate">{n.title}</p>
                                            </div>
                                            <p className="text-xs text-[#adaaaa] mt-1 line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-[#494847] font-bold mt-1">{formatTime(n.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
