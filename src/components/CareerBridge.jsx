import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, MapPin, Calendar, ArrowRight, DollarSign, RefreshCw, Filter } from 'lucide-react';
import api from '../services/api';

const CareerBridge = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    const fetchJobs = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const res = await api.get('/placements');
            setJobs(res.data);
        } catch (err) { console.error(err); }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
        // Auto-refresh every 30 seconds so admin changes appear dynamically
        const interval = setInterval(() => fetchJobs(), 30000);
        return () => clearInterval(interval);
    }, [fetchJobs]);

    const filteredJobs = jobs.filter(job => {
        if (filter === 'all') return true;
        return job.status?.toLowerCase() === filter;
    });

    const filterCounts = {
        all: jobs.length,
        open: jobs.filter(j => j.status?.toLowerCase() === 'open').length,
        closed: jobs.filter(j => j.status?.toLowerCase() === 'closed').length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                    {['all', 'open', 'closed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                filter === f
                                    ? 'bg-[#fd9d27]/10 text-[#fd9d27]'
                                    : 'bg-[#1a1919] text-[#adaaaa] hover:bg-[#262626] hover:text-white'
                            }`}
                        >
                            {f === 'all' ? '📋' : f === 'open' ? '🟢' : '🔴'} {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className="text-[10px] font-black bg-[rgba(73,72,71,0.15)] px-1.5 py-0.5 rounded-md">{filterCounts[f]}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => fetchJobs(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#1a1919] text-[#adaaaa] hover:bg-[#262626] hover:text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1919] rounded-2xl border border-[rgba(73,72,71,0.15)]">
                    <Briefcase size={48} className="mx-auto mb-4 text-[#494847]" />
                    <p className="text-[#adaaaa] font-medium text-lg mb-2">No placement drives found</p>
                    <p className="text-[#494847] text-sm">
                        {filter !== 'all' ? `No ${filter} drives available. Try switching filters.` : 'Check back later for new opportunities.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="p-6 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#262626] border border-[rgba(73,72,71,0.15)] flex items-center justify-center text-[#fd9d27] font-black text-xl">
                                    {job.company_name[0]}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    job.status?.toLowerCase() === 'open' 
                                        ? 'bg-[#c0fe71]/10 text-[#c0fe71] led-dot' 
                                        : 'bg-[#494847]/20 text-[#494847]'
                                }`}>
                                    {job.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{job.role}</h3>
                            <p className="text-[#adaaaa] font-medium mb-4">{job.company_name}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-[#494847] text-xs font-bold">
                                    <DollarSign size={14} className="text-[#fd9d27]" /> <span>{job.salary || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#494847] text-xs font-bold">
                                    <MapPin size={14} className="text-[#71ceff]" /> <span>{job.location || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#494847] text-xs font-bold col-span-2">
                                    <Calendar size={14} className="text-[#c0fe71]" /> <span>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>

                            <button className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3 text-sm ${
                                job.status?.toLowerCase() === 'open'
                                    ? 'bg-[#262626] hover:bg-[#fd9d27] text-white hover:text-[#4a2c00]'
                                    : 'bg-[#1a1919] border border-[rgba(73,72,71,0.15)] text-[#494847] cursor-not-allowed'
                            }`} disabled={job.status?.toLowerCase() !== 'open'}>
                                {job.status?.toLowerCase() === 'open' ? 'Apply Now' : 'Closed'} <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Auto-refresh indicator */}
            <p className="text-center text-[10px] text-[#494847] font-bold uppercase tracking-widest">
                Auto-refreshes every 30s • {jobs.length} total drive{jobs.length !== 1 ? 's' : ''}
            </p>
        </div>
    );
};

export default CareerBridge;