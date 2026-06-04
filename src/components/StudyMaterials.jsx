import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Upload, Search, Download, Trash2, X, FileText, ChevronDown } from 'lucide-react';
import api from '../services/api';

// ──── Constants ────
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const CATEGORIES = [
    'Notes', 'Previous Year Papers', 'Midsem Papers', 'Endsem Papers',
    'Assignments', 'Lab Resources', 'Coding Resources',
    'Placement Preparation', 'GATE Resources'
];
const ALLOWED_TYPES = '.pdf,.ppt,.pptx,.doc,.docx,.zip';

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
};

// Category badge color mapping
const getCategoryColor = (category) => {
    const colors = {
        'Notes': '#fd9d27',
        'Previous Year Papers': '#ff7351',
        'Midsem Papers': '#c0fe71',
        'Endsem Papers': '#71ceff',
        'Assignments': '#fd9d27',
        'Lab Resources': '#c0fe71',
        'Coding Resources': '#71ceff',
        'Placement Preparation': '#fd9d27',
        'GATE Resources': '#ff7351'
    };
    return colors[category] || '#fd9d27';
};

// ══════════════════════════════════════════
// StudyMaterials — Main Component
// ══════════════════════════════════════════
const StudyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Filter & search state
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch materials
    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (semesterFilter) params.semester = semesterFilter;
            if (subjectFilter) params.subject = subjectFilter;
            if (categoryFilter) params.category = categoryFilter;
            if (searchQuery.trim()) params.search = searchQuery.trim();

            const res = await api.get('/materials', { params });
            setMaterials(res.data);

            const subjects = [...new Set(res.data.map(m => m.subject))].sort();
            setAvailableSubjects(subjects);
        } catch (err) {
            console.error('Failed to fetch materials:', err);
        } finally {
            setLoading(false);
        }
    }, [semesterFilter, subjectFilter, categoryFilter, searchQuery]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleDownload = async (material) => {
        try {
            const res = await api.get(`/materials/download/${material.id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', material.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            fetchMaterials();
        } catch (err) {
            alert('Download failed. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this material?')) return;
        try {
            await api.delete(`/materials/${id}`);
            fetchMaterials();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed.');
        }
    };

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Study Materials Hub</h2>
                    <p className="text-[#adaaaa] text-sm font-medium mt-1">
                        {materials.length} resource{materials.length !== 1 ? 's' : ''} available
                    </p>
                </div>
                <button onClick={() => setShowUploadModal(true)} className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                    <Upload size={16} /> Upload Material
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#494847]" size={18} />
                    <input
                        className="cf-input pl-10 rounded-xl"
                        placeholder="Search by title, subject, or description..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <FilterSelect value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} label="All Semesters">
                    {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </FilterSelect>
                <FilterSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="All Categories">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </FilterSelect>
                <FilterSelect value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} label="All Subjects">
                    {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </FilterSelect>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
            ) : materials.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1919] rounded-2xl border border-[rgba(73,72,71,0.15)]">
                    <BookOpen size={48} className="mx-auto mb-4 text-[#494847]" />
                    <p className="text-[#adaaaa] font-medium">No materials found</p>
                    <p className="text-[#494847] text-sm mt-1">Try adjusting your filters or upload the first resource!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {materials.map((m) => (
                        <MaterialCard key={m.id} material={m} currentUser={currentUser} onDownload={handleDownload} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            {showUploadModal && (
                <UploadModal onClose={() => setShowUploadModal(false)} onSuccess={() => { setShowUploadModal(false); fetchMaterials(); }} />
            )}
        </div>
    );
};

// ──── Filter Select Component ────
const FilterSelect = ({ value, onChange, label, children }) => (
    <div className="relative">
        <select value={value} onChange={onChange} className="cf-input pr-10 rounded-xl appearance-none cursor-pointer min-w-[150px]">
            <option value="">{label}</option>
            {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#494847] pointer-events-none" size={16} />
    </div>
);

// ──── Material Card ────
const MaterialCard = ({ material, currentUser, onDownload, onDelete }) => {
    const canDelete = currentUser.id === material.uploaded_by || currentUser.role === 2;
    const ext = material.file_name.split('.').pop().toUpperCase();
    const catColor = getCategoryColor(material.category);

    return (
        <div className="p-5 rounded-2xl bg-[#1a1919] border border-[rgba(73,72,71,0.15)] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#fd9d27]/10 flex items-center justify-center">
                    <FileText size={22} className="text-[#fd9d27]" />
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#71ceff]/10 text-[#71ceff] rounded-full uppercase tracking-widest">Sem {material.semester}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                        {material.category || 'Notes'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#262626] text-[#adaaaa] rounded-full uppercase tracking-widest">{ext}</span>
                </div>
            </div>
            <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{material.title}</h3>
            <p className="text-xs text-[#fd9d27] font-semibold mb-2">{material.subject}</p>
            {material.description && <p className="text-xs text-[#adaaaa] leading-relaxed mb-4 line-clamp-2">{material.description}</p>}
            <div className="flex items-center justify-between text-[10px] text-[#494847] font-bold uppercase tracking-widest mb-4">
                <span>By {material.uploader_name}</span>
                <span>{formatDate(material.created_at)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[rgba(73,72,71,0.15)]">
                <div className="flex items-center gap-3 text-xs text-[#adaaaa]">
                    <span>{formatFileSize(material.file_size)}</span>
                    <span className="flex items-center gap-1"><Download size={12} /> {material.download_count}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onDownload(material)} className="p-2 bg-[#262626] hover:bg-[#fd9d27] text-[#adaaaa] hover:text-[#4a2c00] rounded-lg transition-all" title="Download"><Download size={16} /></button>
                    {canDelete && (
                        <button onClick={() => onDelete(material.id)} className="p-2 bg-[#262626] hover:bg-[#ff7351] text-[#adaaaa] hover:text-white rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ──── Upload Modal ────
const UploadModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ title: '', description: '', semester: '', subject: '', category: 'Notes' });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!file) { setError('Please select a file'); return; }
        if (!formData.title || !formData.semester || !formData.subject) { setError('Title, semester, and subject are required'); return; }

        setUploading(true);
        try {
            const payload = new FormData();
            payload.append('file', file);
            Object.entries(formData).forEach(([key, val]) => payload.append(key, val));
            await api.post('/materials/upload', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-[#1a1919] border border-[rgba(73,72,71,0.15)] rounded-2xl p-8 animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Upload Study Material</h3>
                    <button onClick={onClose} className="p-2 hover:bg-[#262626] rounded-xl transition-colors text-[#494847] hover:text-white"><X size={20} /></button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-[#ff7351]/10 border border-[#ff7351]/30 text-[#ff7351] text-sm rounded-xl text-center font-medium">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">Title</label>
                        <input className="cf-input" placeholder="e.g., DSA Notes — Sorting" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">Description (optional)</label>
                        <textarea className="cf-input resize-none" rows={3} placeholder="Brief description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Semester</label>
                            <select className="cf-input appearance-none cursor-pointer" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required>
                                <option value="">Select</option>
                                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#adaaaa] mb-2">Subject</label>
                            <input className="cf-input" placeholder="e.g., DSA" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">Category</label>
                        <select className="cf-input appearance-none cursor-pointer" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#adaaaa] mb-2">File</label>
                        <input type="file" accept={ALLOWED_TYPES} onChange={(e) => setFile(e.target.files[0])} className="cf-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#fd9d27]/10 file:text-[#fd9d27] file:cursor-pointer cursor-pointer" required />
                        {file && <p className="text-xs text-[#adaaaa] mt-2">Selected: <span className="text-white font-medium">{file.name}</span> ({formatFileSize(file.size)})</p>}
                        <p className="text-[10px] text-[#494847] mt-1 font-bold uppercase tracking-widest">PDF, PPT, PPTX, DOC, DOCX, ZIP • Max 50 MB</p>
                    </div>
                    <button type="submit" disabled={uploading} className="w-full py-4 btn-primary text-sm mt-2 disabled:opacity-50 flex items-center justify-center gap-2">
                        {uploading ? <><div className="spinner" /> Uploading...</> : <><Upload size={16} /> Upload Material</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudyMaterials;
