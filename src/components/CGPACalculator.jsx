import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RotateCcw, TrendingUp } from 'lucide-react';

// ══════════════════════════════════════════
// CGPACalculator — Pure client-side CGPA/SGPA tool
// No backend needed — runs entirely in the browser
// ══════════════════════════════════════════

const GRADE_POINTS = {
    'A+': 10, 'A': 10, 'A-': 9,
    'B': 8, 'B-': 7,
    'C': 6, 'C-': 5,
    'D': 4,
    'F': 0
};

const GRADES = Object.keys(GRADE_POINTS);

const CGPACalculator = () => {
    const [mode, setMode] = useState('sgpa'); // 'sgpa' or 'cgpa'
    
    // SGPA state
    const [subjects, setSubjects] = useState([
        { name: '', credits: '', grade: 'A' }
    ]);

    // CGPA state
    const [semesters, setSemesters] = useState([
        { sgpa: '', credits: '' }
    ]);

    // ──── SGPA Calculator ────
    const addSubject = () => setSubjects([...subjects, { name: '', credits: '', grade: 'A' }]);
    const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
    const updateSubject = (i, field, value) => {
        const updated = [...subjects];
        updated[i][field] = value;
        setSubjects(updated);
    };

    const calculateSGPA = () => {
        let totalCredits = 0, totalPoints = 0;
        for (const sub of subjects) {
            const c = parseFloat(sub.credits);
            if (isNaN(c) || c <= 0) continue;
            totalCredits += c;
            totalPoints += c * (GRADE_POINTS[sub.grade] || 0);
        }
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    // ──── CGPA Calculator ────
    const addSemester = () => setSemesters([...semesters, { sgpa: '', credits: '' }]);
    const removeSemester = (i) => setSemesters(semesters.filter((_, idx) => idx !== i));
    const updateSemester = (i, field, value) => {
        const updated = [...semesters];
        updated[i][field] = value;
        setSemesters(updated);
    };

    const calculateCGPA = () => {
        let totalCredits = 0, totalPoints = 0;
        for (const sem of semesters) {
            const c = parseFloat(sem.credits);
            const s = parseFloat(sem.sgpa);
            if (isNaN(c) || isNaN(s) || c <= 0) continue;
            totalCredits += c;
            totalPoints += c * s;
        }
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const resetAll = () => {
        setSubjects([{ name: '', credits: '', grade: 'A' }]);
        setSemesters([{ sgpa: '', credits: '' }]);
    };

    const sgpa = calculateSGPA();
    const cgpa = calculateCGPA();

    // Color based on GPA value
    const getGPAColor = (gpa) => {
        const val = parseFloat(gpa);
        if (val >= 9) return '#c0fe71';
        if (val >= 7) return '#fd9d27';
        if (val >= 5) return '#71ceff';
        return '#ff7351';
    };

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">CGPA Calculator</h2>
                    <p className="text-[#adaaaa] text-sm font-medium mt-1">Calculate your SGPA & CGPA instantly</p>
                </div>
                <button onClick={resetAll} className="px-4 py-2 bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-xl text-sm text-[#adaaaa] hover:text-white hover:bg-[#262626] transition-all flex items-center gap-2">
                    <RotateCcw size={14} /> Reset
                </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
                {['sgpa', 'cgpa'].map(m => (
                    <button key={m} onClick={() => setMode(m)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-[#fd9d27]/10 text-[#fd9d27] border border-[#fd9d27]/30' : 'bg-[#1a1919] text-[#adaaaa] hover:bg-[#262626]'}`}>
                        {m === 'sgpa' ? '📊 SGPA Calculator' : '📈 CGPA Calculator'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="lg:col-span-2 space-y-3">
                    {mode === 'sgpa' ? (
                        <>
                            {/* Subject Headers */}
                            <div className="grid grid-cols-[1fr_80px_100px_40px] gap-3 px-4">
                                <span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Subject</span>
                                <span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Credits</span>
                                <span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Grade</span>
                                <span></span>
                            </div>
                            {subjects.map((sub, i) => (
                                <div key={i} className="grid grid-cols-[1fr_80px_100px_40px] gap-3 items-center p-3 bg-[#1a1919] rounded-xl border border-[rgba(73,72,71,0.15)]">
                                    <input className="cf-input text-sm" placeholder={`Subject ${i + 1}`} value={sub.name} onChange={(e) => updateSubject(i, 'name', e.target.value)} />
                                    <input type="number" className="cf-input text-sm text-center" placeholder="3" value={sub.credits} onChange={(e) => updateSubject(i, 'credits', e.target.value)} min="1" max="10" />
                                    <select className="cf-input text-sm appearance-none cursor-pointer" value={sub.grade} onChange={(e) => updateSubject(i, 'grade', e.target.value)}>
                                        {GRADES.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>)}
                                    </select>
                                    {subjects.length > 1 && (
                                        <button onClick={() => removeSubject(i)} className="p-2 text-[#494847] hover:text-[#ff7351] transition-colors"><Trash2 size={14} /></button>
                                    )}
                                </div>
                            ))}
                            <button onClick={addSubject} className="w-full py-3 bg-[#1a1919] border border-dashed border-[rgba(73,72,71,0.3)] rounded-xl text-sm text-[#adaaaa] hover:text-[#fd9d27] hover:border-[#fd9d27]/30 transition-all flex items-center justify-center gap-2">
                                <Plus size={16} /> Add Subject
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Semester Headers */}
                            <div className="grid grid-cols-[1fr_120px_120px_40px] gap-3 px-4">
                                <span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Semester</span>
                                <span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">SGPA</span>
                                <span className="text-[10px] font-bold text-[#494847] uppercase tracking-widest">Credits</span>
                                <span></span>
                            </div>
                            {semesters.map((sem, i) => (
                                <div key={i} className="grid grid-cols-[1fr_120px_120px_40px] gap-3 items-center p-3 bg-[#1a1919] rounded-xl border border-[rgba(73,72,71,0.15)]">
                                    <span className="text-sm font-bold text-white pl-2">Semester {i + 1}</span>
                                    <input type="number" className="cf-input text-sm text-center" placeholder="8.50" value={sem.sgpa} onChange={(e) => updateSemester(i, 'sgpa', e.target.value)} step="0.01" min="0" max="10" />
                                    <input type="number" className="cf-input text-sm text-center" placeholder="24" value={sem.credits} onChange={(e) => updateSemester(i, 'credits', e.target.value)} min="1" max="40" />
                                    {semesters.length > 1 && (
                                        <button onClick={() => removeSemester(i)} className="p-2 text-[#494847] hover:text-[#ff7351] transition-colors"><Trash2 size={14} /></button>
                                    )}
                                </div>
                            ))}
                            <button onClick={addSemester} className="w-full py-3 bg-[#1a1919] border border-dashed border-[rgba(73,72,71,0.3)] rounded-xl text-sm text-[#adaaaa] hover:text-[#fd9d27] hover:border-[#fd9d27]/30 transition-all flex items-center justify-center gap-2">
                                <Plus size={16} /> Add Semester
                            </button>
                        </>
                    )}
                </div>

                {/* Result Card */}
                <div className="p-8 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] flex flex-col items-center justify-center text-center sticky top-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#fd9d27]/10 flex items-center justify-center mb-6">
                        <TrendingUp size={28} className="text-[#fd9d27]" />
                    </div>
                    <p className="text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-2">
                        Your {mode.toUpperCase()}
                    </p>
                    <p className="text-6xl font-black tracking-tight mb-2" style={{ color: getGPAColor(mode === 'sgpa' ? sgpa : cgpa) }}>
                        {mode === 'sgpa' ? sgpa : cgpa}
                    </p>
                    <p className="text-xs text-[#adaaaa]">out of 10.00</p>

                    {/* Grade scale reference */}
                    <div className="mt-8 w-full space-y-1.5">
                        <p className="text-[10px] font-bold text-[#494847] uppercase tracking-widest mb-3">Grade Reference</p>
                        <div className="grid grid-cols-3 gap-1">
                            {GRADES.map(g => (
                                <div key={g} className="text-center py-1.5 bg-[#262626] rounded-lg">
                                    <span className="text-xs font-bold text-white">{g}</span>
                                    <span className="text-[10px] text-[#494847] ml-1">= {GRADE_POINTS[g]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CGPACalculator;
