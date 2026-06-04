import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import api from '../services/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filter === 'upcoming') params.upcoming = 'true';
                const res = await api.get('/events', { params });
                setEvents(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchEvents();
    }, [filter]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            day: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        };
    };

    const getCategoryColor = (cat) => {
        const map = {
            academic: '#71ceff', cultural: '#fd9d27', sports: '#c0fe71',
            tech: '#ff7351', workshop: '#fd9d27', general: '#adaaaa'
        };
        return map[cat?.toLowerCase()] || '#fd9d27';
    };

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Campus Events</h2>
                    <p className="text-[#adaaaa] text-sm font-medium mt-1">{events.length} event{events.length !== 1 ? 's' : ''} listed</p>
                </div>
                <div className="flex gap-2">
                    {['upcoming', 'all'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-[#fd9d27]/10 text-[#fd9d27]' : 'bg-[#1a1919] text-[#adaaaa] hover:bg-[#262626]'}`}>
                            {f === 'upcoming' ? '📅 Upcoming' : '📋 All Events'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1919] rounded-2xl border border-[rgba(73,72,71,0.15)]">
                    <Calendar size={48} className="mx-auto mb-4 text-[#494847]" />
                    <p className="text-[#adaaaa] font-medium">No events scheduled</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map(event => {
                        const date = formatDate(event.event_date);
                        const catColor = getCategoryColor(event.category);
                        const isPast = new Date(event.event_date) < new Date();

                        return (
                            <div key={event.id} className={`flex rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] overflow-hidden hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all ${isPast ? 'opacity-60' : ''}`}>
                                {/* Date Block */}
                                <div className="w-20 flex-shrink-0 bg-[#262626] flex flex-col items-center justify-center py-4">
                                    <span className="text-[10px] font-bold text-[#fd9d27] uppercase tracking-widest">{date.month}</span>
                                    <span className="text-3xl font-black text-white">{date.day}</span>
                                </div>
                                {/* Content */}
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-base font-bold text-white">{event.title}</h3>
                                            {event.organizer && <p className="text-xs text-[#fd9d27] font-semibold">{event.organizer}</p>}
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                                            {event.category}
                                        </span>
                                    </div>
                                    {event.description && <p className="text-xs text-[#adaaaa] leading-relaxed mb-3 line-clamp-2">{event.description}</p>}
                                    <div className="flex items-center gap-4 text-[10px] text-[#494847] font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {date.time}</span>
                                        {event.location && <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Events;
