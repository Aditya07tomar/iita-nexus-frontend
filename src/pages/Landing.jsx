import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Utensils, Bus, Briefcase, MessageSquare, ChevronDown, ArrowRight } from 'lucide-react';
import { useScrollAnimationGroup } from '../hooks/useScrollAnimation';

/* ── Smooth scroll helper ── */
function smoothScrollTo(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const start = window.scrollY;
  const end = el.getBoundingClientRect().top + window.scrollY - 80;
  const distance = end - start;
  const duration = 900;
  let startTime = null;

  function ease(t) {
    if (t < 0.5) return 16 * t * t * t * t * t;
    return 1 + 16 * (--t) * t * t * t * t;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── FAQ Accordion ── */
const FaqAccordion = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "What is CampusFlow?", a: "CampusFlow is an intelligent campus management platform that unifies mess menus, transit tracking, career placements, and an AI assistant into one seamless experience for students." },
    { q: "How does the AI Assistant work?", a: "Our AI is powered by Google Gemini and trained on campus-specific data. Ask it about mess menus, bus timings, placement deadlines, or any campus query." },
    { q: "Is CampusFlow free to use?", a: "Yes! CampusFlow is completely free for all registered students. Sign up with your campus email to get started." },
    { q: "Can I track real-time bus schedules?", a: "Absolutely. Our Transit Tracker shows live bus departure times and routes, refreshing every minute so you never miss a shuttle." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-[#1a1919] rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(253,157,39,0.08)]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
          >
            <span className="text-white font-bold text-lg hover:text-[#fd9d27] transition-colors">{faq.q}</span>
            <ChevronDown
              size={20}
              className={`text-[#494847] transition-transform duration-300 ${open === i ? 'rotate-180 text-[#fd9d27]' : ''}`}
            />
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? '200px' : '0' }}
          >
            <p className="px-6 pb-6 text-[#adaaaa] leading-relaxed text-sm">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Landing Page ── */
const Landing = () => {
  const heroRef = useRef(null);
  const observe = useScrollAnimationGroup();

  // Mouse-reactive dotted background
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    heroRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const features = [
    { icon: <Utensils size={24} />, color: '#fd9d27', title: 'Mess Menus', desc: 'Weekly meal schedules synced with the central mess committee. Never miss a meal.' },
    { icon: <Bus size={24} />, color: '#c0fe71', title: 'Transit Tracker', desc: 'Real-time campus shuttle tracking with live departure countdowns.' },
    { icon: <Briefcase size={24} />, color: '#71ceff', title: 'Career Bridge', desc: 'Browse active placement drives, check eligibility, and apply in one click.' },
    { icon: <MessageSquare size={24} />, color: '#fd9d27', title: 'AI Assistant', desc: 'Powered by Gemini. Ask about menus, timings, placements, or anything campus.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] text-[#adaaaa] font-sans overflow-x-hidden">

      {/* ═══ NAVBAR ═══ */}
      <header className="sticky top-0 z-50 w-full cf-glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fd9d27]/10 flex items-center justify-center ambient-glow">
              <Zap className="w-5 h-5 text-[#fd9d27]" fill="#fd9d27" strokeWidth={0} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">CampusFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['features', 'preview', 'faq'].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); smoothScrollTo(id); }}
                className="relative px-3 py-2 text-sm font-medium text-[#adaaaa] hover:text-white transition-all group"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-[#fd9d27] rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <Link
            to="/login"
            className="bg-[#fd9d27] text-[#4a2c00] px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(253,157,39,0.3)] active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* ═══ HERO ═══ */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden pt-16 pb-20 md:pt-32 md:pb-36"
        >
          {/* Dotted background */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#494847_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          <div
            className="absolute inset-0 z-0 bg-[radial-gradient(#fd9d27_2px,transparent_2px)] [background-size:24px_24px] opacity-80 transition-opacity duration-300"
            style={{ WebkitMaskImage: `radial-gradient(circle 250px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black, transparent)` }}
          />

          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fd9d27]/5 rounded-full blur-[120px] -z-10 animate-float" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c0fe71]/5 rounded-full blur-[100px] -z-10 animate-float-delayed" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 md:gap-8">
            {/* Text */}
            <div className="flex-1 text-center md:text-left animate-fade-up">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                Your Campus<br />
                Life, <span className="text-[#fd9d27] italic">Unified</span> &<br />
                Intelligent.
              </h1>
              <p className="text-base md:text-lg text-[#adaaaa] max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed">
                The smart toolkit for modern students. Mess menus, transit tracking, career placements, and an AI assistant — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up stagger-3" style={{ animationFillMode: 'both' }}>
                <Link to="/register" className="btn-primary px-8 py-4 text-sm text-center">
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn-ghost px-8 py-4 text-sm text-center">
                  Sign In →
                </Link>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="flex-1 relative h-[380px] md:h-[450px] w-full max-w-lg pointer-events-none">
              {/* Card 1 — Mess */}
              <div className="absolute top-2 left-4 md:left-8 w-48 h-56 rounded-2xl bg-[#1a1919] p-5 text-white ambient-glow animate-float">
                <div className="text-[10px] font-bold opacity-60 mb-2 tracking-widest uppercase">TODAY'S MENU</div>
                <div className="text-3xl font-black text-[#fd9d27] mb-1">Dinner</div>
                <div className="text-xs opacity-50">Paneer Butter Masala</div>
                <div className="mt-5 flex gap-1.5 items-end h-20">
                  {[85, 60, 90, 45, 75, 95, 70].map((h, i) => (
                    <div key={i} className="w-full bg-[#262626] rounded-t-sm" style={{ height: '100%' }}>
                      <div className="w-full bg-[#fd9d27] rounded-t-sm transition-all" style={{ height: `${h}%`, marginTop: `${100 - h}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2 — Transit */}
              <div className="absolute top-10 right-2 md:right-4 w-52 h-48 rounded-2xl bg-[#262626] p-5 text-white animate-float-delayed">
                <div className="text-[10px] font-bold opacity-60 mb-2 tracking-widest uppercase">NEXT SHUTTLE</div>
                <div className="text-4xl font-black text-[#c0fe71] mb-1">18:30</div>
                <div className="text-xs opacity-50 mb-4">Gate 3 Express</div>
                <div className="flex justify-between">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${i < 5 ? 'bg-[#c0fe71] text-[#3b6100] led-dot' : 'bg-[#131313] text-[#adaaaa]'}`}>
                        {i < 5 ? '✓' : ''}
                      </div>
                      <span className="text-[8px] opacity-40">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3 — AI */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-44 rounded-2xl bg-[#131313] p-5 text-white animate-float-slow">
                <div className="text-[10px] font-bold opacity-60 mb-2 tracking-widest uppercase">AI ASSISTANT</div>
                <div className="text-3xl font-black text-[#71ceff] mb-1">Online</div>
                <div className="text-xs opacity-50 mb-4">Powered by Gemini</div>
                <div className="w-full bg-[#262626] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#71ceff] rounded-full" style={{ width: '72%', boxShadow: '0 0 8px rgba(113,206,255,0.6)' }} />
                </div>
                <div className="text-[10px] opacity-40 mt-2 font-bold">Ready to assist</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section className="w-full py-10 bg-[#131313]">
          <div ref={observe} className="scroll-animate max-w-5xl mx-auto px-6 text-center">
            <p className="text-xs tracking-[0.2em] text-[#adaaaa] font-bold uppercase mb-6">
              Built for students at leading institutions
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale">
              {['IIITA', 'IIT-D', 'NIT-T', 'BITS', 'VIT'].map((u) => (
                <span key={u} className="text-lg md:text-xl font-black tracking-widest text-white">{u}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES MARQUEE ═══ */}
        <section id="features" className="w-full py-24 bg-[#131313] overflow-hidden">
          <div ref={observe} className="scroll-animate max-w-6xl mx-auto px-6 text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
              Everything You Need
            </h2>
            <p className="text-[#adaaaa] max-w-lg mx-auto text-lg">
              Built around how modern students actually navigate campus life.
            </p>
          </div>

          <div className="relative w-full flex overflow-hidden py-4">
            <div className="flex animate-marquee min-w-max">
              {[0, 1].map((track) => (
                <div key={track} className="flex gap-6 pr-6">
                  {features.map((f, i) => (
                    <div key={`${track}-${i}`} className="w-[300px] shrink-0 bg-[#1a1919] rounded-2xl p-6 hover:bg-[#262626] hover:shadow-[0_0_40px_rgba(253,157,39,0.08)] transition-all cursor-pointer group">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all"
                        style={{ backgroundColor: `${f.color}15`, color: f.color }}
                      >
                        {f.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
                      <p className="text-sm text-[#adaaaa] leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ DASHBOARD PREVIEW ═══ */}
        <section id="preview" className="w-full py-24 px-6 bg-[#0e0e0e]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div ref={observe} className="scroll-animate flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
                A Dashboard that<br /><span className="text-[#fd9d27] italic">Knows You.</span>
              </h2>
              <p className="text-[#adaaaa] max-w-md mb-10 leading-relaxed text-lg mx-auto md:mx-0">
                One glance and you know exactly where you stand. Mess schedules, transit countdowns, career updates, and AI insights — all unified.
              </p>
              <div className="flex flex-col gap-4 max-w-sm mx-auto md:mx-0">
                {[
                  { label: 'Live Transit Tracking', color: '#fd9d27' },
                  { label: 'Weekly Mess Planner', color: '#c0fe71' },
                  { label: 'AI-Powered Assistant', color: '#71ceff' },
                ].map((item, i) => (
                  <div
                    key={i}
                    ref={observe}
                    className="scroll-animate flex items-center gap-4 bg-[#1a1919] p-3 rounded-xl"
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-white font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="flex-1 w-full max-w-lg relative">
              <div className="absolute inset-0 bg-[#fd9d27]/5 blur-[80px] rounded-full" />
              <div ref={observe} className="scroll-animate relative rounded-2xl bg-[#131313] p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 bg-[#1a1919] rounded-xl p-4">
                    <div className="text-xs text-[#adaaaa] mb-1 font-bold tracking-widest uppercase">Next Meal</div>
                    <div className="text-2xl font-black text-white">Dinner</div>
                    <div className="text-[10px] text-[#c0fe71] mt-1 font-bold">Paneer Butter Masala</div>
                  </div>
                  <div className="flex-1 bg-[#1a1919] rounded-xl p-4">
                    <div className="text-xs text-[#adaaaa] mb-1 font-bold tracking-widest uppercase">Next Bus</div>
                    <div className="text-2xl font-black text-white">18:30</div>
                    <div className="text-[10px] text-[#c0fe71] mt-1 font-bold">Gate 3 Express</div>
                  </div>
                </div>
                <div className="bg-[#1a1919] rounded-xl p-4">
                  <div className="text-xs text-[#adaaaa] mb-4 font-bold tracking-widest uppercase">Weekly Activity</div>
                  <div className="flex items-end gap-2 h-24">
                    {[55, 80, 45, 90, 65, 70, 85].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-sm transition-all" style={{ height: `${v}%`, background: i === 3 ? '#fd9d27' : '#262626', boxShadow: i === 3 ? '0 0 40px rgba(253,157,39,0.08)' : 'none' }} />
                        <span className="text-[9px] font-bold text-[#adaaaa]">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Placement: Google SDE', tag: 'Open', tagColor: 'bg-[#c0fe71]/10 text-[#c0fe71]' },
                    { name: 'Bus to City Center', tag: 'Live', tagColor: 'bg-[#fd9d27]/10 text-[#fd9d27]' },
                    { name: 'AI Campus Query', tag: 'Ready', tagColor: 'bg-[#71ceff]/10 text-[#71ceff]' },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#1a1919] rounded-xl p-3">
                      <div className="w-4 h-4 rounded border-2 border-[#494847] flex-shrink-0" />
                      <span className="text-sm text-white font-bold flex-1">{task.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${task.tagColor}`}>{task.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="w-full py-24 px-6 bg-[#131313]">
          <div ref={observe} className="scroll-animate max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
              Ready to Simplify<br />Your Campus Life?
            </h2>
            <p className="text-[#adaaaa] max-w-xl mx-auto mb-10 leading-relaxed text-lg">
              Join thousands of students who manage their campus experience smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary px-8 py-4 text-sm font-bold inline-flex items-center justify-center gap-2">
                Create Free Account <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-ghost px-8 py-4 text-sm font-bold inline-flex items-center justify-center gap-2">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="w-full py-24 px-6 bg-[#0e0e0e] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#fd9d27]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div ref={observe} className="scroll-animate text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
                Frequently Asked <span className="text-[#fd9d27] italic">Questions</span>
              </h2>
              <p className="text-[#adaaaa] max-w-lg mx-auto text-lg">
                Everything you need to know about CampusFlow.
              </p>
            </div>
            <FaqAccordion />
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="w-full py-12 bg-[#131313]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fd9d27]/10 flex items-center justify-center font-bold text-[#fd9d27] text-xs ambient-glow">
                <Zap size={14} fill="#fd9d27" strokeWidth={0} />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">CampusFlow</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-[#adaaaa]">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-xs font-bold text-[#494847]">© {new Date().getFullYear()} CampusFlow</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
