import React, { useState, useEffect } from 'react';
import { Utensils, Coffee, Sun, Moon } from 'lucide-react';
import api from '../services/api';

const MessModule = () => {
    const [weeklyMenu, setWeeklyMenu] = useState([]);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/mess/weekly');
                setWeeklyMenu(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMenu();
    }, []);

    return (
        <div className="animate-fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {weeklyMenu.map((day) => (
                    <div 
                        key={day.id} 
                        className={`p-5 rounded-2xl border transition-all ${
                            day.day_of_week === today 
                            ? 'bg-[#fd9d27]/5 border-[#fd9d27]/30 ambient-glow' 
                            : 'bg-[#1a1919] border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)]'
                        }`}
                    >
                        <h3 className={`text-sm font-black mb-6 uppercase tracking-widest ${
                            day.day_of_week === today ? 'text-[#fd9d27]' : 'text-[#494847]'
                        }`}>
                            {day.day_of_week}
                        </h3>

                        <div className="space-y-5">
                            <MealSection icon={<Coffee size={14}/>} label="Breakfast" items={day.breakfast} />
                            <MealSection icon={<Sun size={14}/>} label="Lunch" items={day.lunch} />
                            <MealSection icon={<Moon size={14}/>} label="Dinner" items={day.dinner} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MealSection = ({ icon, label, items }) => (
    <div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-2">
            <span className="text-[#fd9d27]">{icon}</span> <span>{label}</span>
        </div>
        <p className="text-xs text-white font-medium leading-relaxed">{items || 'Not updated'}</p>
    </div>
);

export default MessModule;