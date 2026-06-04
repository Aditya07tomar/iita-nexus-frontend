import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, ArrowRight, DollarSign } from 'lucide-react';
import api from '../services/api';

const CareerBridge = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/placements');
                setJobs(res.data);
            } catch (err) { console.error(err); }
        };
        fetchJobs();
    }, []);

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                    <div key={job.id} className="p-6 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#262626] border border-[rgba(73,72,71,0.15)] flex items-center justify-center text-[#fd9d27] font-black text-xl">
                                {job.company_name[0]}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                job.status === 'Open' 
                                    ? 'bg-[#c0fe71]/10 text-[#c0fe71] led-dot' 
                                    : 'bg-[#fd9d27]/10 text-[#fd9d27]'
                            }`}>
                                {job.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{job.role}</h3>
                        <p className="text-[#adaaaa] font-medium mb-4">{job.company_name}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2 text-[#494847] text-xs font-bold">
                                <DollarSign size={14} className="text-[#fd9d27]" /> <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#494847] text-xs font-bold">
                                <MapPin size={14} className="text-[#71ceff]" /> <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#494847] text-xs font-bold col-span-2">
                                <Calendar size={14} className="text-[#c0fe71]" /> <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-[#262626] hover:bg-[#fd9d27] text-white hover:text-[#4a2c00] font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3 text-sm">
                            Apply Now <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerBridge;