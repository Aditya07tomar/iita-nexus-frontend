import React, { useState, useEffect } from 'react';
import { Bus, Clock } from 'lucide-react';
import api from '../services/api';

const TransitCard = () => {
    const [nextBus, setNextBus] = useState(null);

    const fetchBusData = async () => {
        try {
            const res = await api.get('/bus/next');
            if (res.data.length > 0) setNextBus(res.data[0]);
        } catch (err) {
            console.error("Bus fetch failed", err);
        }
    };

    useEffect(() => {
        fetchBusData();
        const interval = setInterval(fetchBusData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all">
            <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-[#fd9d27]/10 rounded-xl">
                    <Bus className="text-[#fd9d27]" size={22}/>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-[#c0fe71]/10 text-[#c0fe71] rounded-full uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c0fe71] led-dot" />
                    Live
                </span>
            </div>
            <h3 className="text-[#494847] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Next Campus Shuttle</h3>
            <p className="text-3xl font-black text-white mb-1 tracking-tight">
                {nextBus ? nextBus.departure_time.slice(0, 5) : "--:--"}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[#fd9d27] text-sm font-medium">
                <Clock size={14}/>
                <span>{nextBus ? `To ${nextBus.route_name}` : "No more buses today"}</span>
            </div>
        </div>
    );
};

export default TransitCard;