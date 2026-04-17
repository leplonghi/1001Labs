import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useRef, useState, useEffect } from 'react';
import Lenis from 'lenis';
import { ArrowRight, Code2, Cpu, Globe, Layers, Zap, Languages, Menu, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import Background3D from './components/Background3D';
import Logo from './components/Logo';
import { HoraMedLogo, ArenaCupLogo, DoughLabLogo, GuataLogo } from './components/ProjectLogos';
import CustomCursor from './components/CustomCursor';
import Magnetic from './components/Magnetic';
import { translations } from './data/translations';
import { projects } from './data/projects';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

gsap.registerPlugin(ScrollTrigger);

const ProjectInquiry: React.FC<{ lang: 'en' | 'pt', isOpen: boolean, onClose: () => void }> = ({ lang, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const t = translations[lang].inquiry;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setStep(1);
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-xl bg-zinc-900 border border-white/10 p-12 rounded-[3rem] relative shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {!submitted ? (
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-indigo-500 tracking-[0.4em] uppercase">Step 0{step} / 03</span>
                    <h2 className="text-3xl font-black tracking-tight">{t.title}</h2>
                  </div>
                  {step > 1 && (
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-[0.2em]"
                    >
                      <ArrowRight size={14} className="rotate-180" />
                      {t.back}
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <p className="text-lg text-gray-400">{t.step1.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[t.step1.opt1, t.step1.opt2, t.step1.opt3, t.step1.opt4].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => setStep(2)}
                            className="p-6 text-left bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 transition-all font-bold"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <p className="text-lg text-gray-400">{t.step2.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[t.step2.opt1, t.step2.opt2, t.step2.opt3, t.step2.opt4].map((opt) => (
                          <button 
                            key={opt}
                            onClick={() => setStep(3)}
                            className="p-6 text-left bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500/50 transition-all font-bold"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.form 
                      key="step3"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <p className="text-lg text-gray-400">{t.step3.question}</p>
                      <input 
                        required
                        type="email"
                        placeholder={t.step3.placeholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors text-xl font-bold"
                      />
                      <button 
                        type="submit"
                        className="w-full p-6 bg-indigo-500 text-white rounded-2xl font-black text-xl hover:bg-indigo-600 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                      >
                        {t.step3.cta}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                  <Zap size={40} />
                </div>
                <h2 className="text-3xl font-black mb-4">{t.success}</h2>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NextSectionLink = ({ href, label, className = "" }: { href: string; label: string; className?: string }) => (
  <div className={`flex justify-center ${className}`}>
    <Magnetic strength={0.5}>
      <a 
        href={href} 
        className="group flex flex-col items-center gap-6 text-[10px] font-bold tracking-[0.5em] text-gray-500 hover:text-white transition-all duration-700 uppercase"
      >
        <span className="opacity-40 group-hover:opacity-100 group-hover:tracking-[0.8em] transition-all duration-700 ease-out">{label}</span>
        <div className="relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors duration-700">
          <ArrowRight size={14} className="rotate-90 group-hover:translate-y-1 transition-transform duration-700" />
          <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/20 group-hover:scale-150 transition-all duration-1000" />
        </div>
      </a>
    </Magnetic>
  </div>
);

const ProjectCard: React.FC<{ project: any, lang: 'en' | 'pt', onClick: () => void, isSmall?: boolean }> = ({ project, lang, onClick, isSmall = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - (left + width / 2)) / 15);
    mouseY.set((e.clientY - (top + height / 2)) / 15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateY: springX, 
        rotateX: useTransform(springY, (v) => -v),
        transformStyle: 'preserve-3d' 
      }}
      className={`reveal group relative ${isSmall ? 'aspect-square rounded-3xl' : 'aspect-[4/5] rounded-[2.5rem]'} overflow-hidden bg-white/5 border border-white/10 shadow-2xl shadow-black/50 cursor-pointer perspective-1000`}
    >
      <motion.img 
        style={{ 
          y: scrollY,
          x: useTransform(springX, (v) => -v * 0.5)
        }}
        src={`https://picsum.photos/seed/${project.id === 'horamed' ? 'medical' : project.id === 'arenacup' ? 'stadium' : project.id === 'doughlabpro' ? 'bread' : project.id === 'guata' ? 'nature' : project.id}/800/1000`} 
        alt={project.title} 
        className={`absolute top-[-20%] left-0 w-full h-[140%] object-cover ${isSmall ? 'opacity-10 grayscale group-hover:grayscale-0' : 'opacity-30'} group-hover:opacity-60 transition-all duration-700 group-hover:scale-110`}
        referrerPolicy="no-referrer"
      />
      <div className={`absolute inset-0 flex items-center justify-center ${isSmall ? 'p-8' : 'p-12'} pointer-events-none`}>
        {project.id === 'horamed' && <HoraMedLogo className="w-full max-w-[120px] text-white drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
        {project.id === 'arenacup' && <ArenaCupLogo className="w-full max-w-[120px] text-white drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
        {project.id === 'doughlabpro' && <DoughLabLogo className="w-full max-w-[240px] drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
        {project.id === 'pilotis' && <div className="text-4xl font-black tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity text-white">PILOTIS</div>}
        {project.id === 'guata' && <GuataLogo className="w-full max-w-[120px] text-white drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
        {project.id === 'heridata' && <div className="text-4xl font-black tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity uppercase text-white">Heridata</div>}
        {project.id === 'arumo' && <div className="text-4xl font-black tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity uppercase text-white">Arumo</div>}
      </div>
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end ${isSmall ? 'p-6' : 'p-10'}`}>
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-white text-[10px] font-bold mb-4 tracking-[0.2em] uppercase border border-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-colors">
            {lang === 'en' ? project.category.en : project.category.pt}
          </span>
          <h3 className={`${isSmall ? 'text-2xl' : 'text-4xl'} font-black tracking-tighter mb-4`}>{project.title}</h3>
          <p className={`text-base text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-500 line-clamp-3 leading-relaxed font-light ${isSmall ? 'text-sm' : ''}`}>
            {lang === 'en' ? project.desc.en : project.desc.pt}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useGSAP(() => {
    // Hero animations
    const tl = gsap.timeline();
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.8')
    .from('.hero-cta', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, '-=0.5');

    // Scroll reveal for sections
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((section) => {
      // Title animation
      const title = section.querySelector('h2');
      if (title) {
        gsap.from(title, {
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
        });
      }

      // Content/Subtitle animation
      const content = section.querySelector('p');
      if (content) {
        gsap.from(content, {
          scrollTrigger: {
            trigger: content,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2
        });
      }
      
      // Stagger items (cards, grid elements)
      const items = section.querySelectorAll('.stagger-item');
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: items[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.4
        });
      }
    });

    // Parallax effect for the 3D background - Intensifies with depth
    gsap.to('#bg-3d-canvas', {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
      y: 350,
      scale: 1.6,
      rotate: 12,
      opacity: 0.7,
      ease: 'power2.in', // This makes the effect intensify as scroll progresses
    });

    // Layered parallax for sections to create depth
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((section, i) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: (i % 2 === 0 ? -80 : -120), // Different speeds for different sections
        skewY: (i % 2 === 0 ? 1 : -1), // Slight skew for fluidity
        ease: 'none',
      });
    });
  }, { scope: containerRef, dependencies: [lang] });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div id="top" ref={containerRef} className="relative text-white selection:bg-indigo-500/30">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-rose-500 to-amber-500 origin-top z-[200]"
        style={{ scaleY: scrollYProgress }}
      />
      <Background3D />
      <CustomCursor />
      <div className="noise-overlay" />
      
      <nav className="fixed top-0 left-0 w-full h-20 z-[100] px-8 md:px-16 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-2 z-50">
          <Magnetic strength={0.4}>
            <Logo className="scale-75 origin-left" showBackground={false} />
          </Magnetic>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase items-center">
          <a href="#about" className="hover:text-indigo-400 transition-colors">{t.nav.about}</a>
          <a href="#work" className="hover:text-amber-400 transition-colors">{t.nav.work}</a>
          <a href="#services" className="hover:text-emerald-400 transition-colors">{t.nav.services}</a>
          <a href="#contact" className="hover:text-rose-400 transition-colors">{t.nav.contact}</a>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10"
          >
            <Languages size={16} />
            <span className="text-xs font-bold">{lang.toUpperCase()}</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4 z-50">
          <button 
            onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10"
          >
            <Languages size={16} />
            <span className="text-xs font-bold">{lang.toUpperCase()}</span>
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[90] md:hidden flex flex-col items-center justify-center p-8 pt-24"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
              <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-600/20 blur-[120px] rounded-full" />
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              {[
                { href: "#about", label: t.nav.about, color: "text-indigo-400" },
                { href: "#work", label: t.nav.work, color: "text-amber-400" },
                { href: "#services", label: t.nav.services, color: "text-emerald-400" },
                { href: "#contact", label: t.nav.contact, color: "text-rose-400" }
              ].map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative flex flex-col items-center py-2"
                >
                  <span className="text-[9px] font-mono text-gray-600 mb-1 tracking-[0.2em]">0{i + 1}</span>
                  <span className={`text-2xl font-black tracking-tight uppercase transition-colors ${link.color}`}>
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="w-8 h-[1px] bg-white/20" />
              <div className="flex gap-6 text-[10px] font-bold tracking-[0.3em] text-gray-600">
                <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
                <a href="#" className="hover:text-white transition-colors">TWITTER</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="text-center z-10 max-w-5xl mx-auto">
          <h1 className="hero-title glitch-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] mb-20 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 leading-[1.2] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform cursor-default select-none" data-text={t.hero.title}>
            {t.hero.title}
          </h1>
          <p className="hero-subtitle text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed px-4 font-light tracking-wider italic border-l border-white/20 mt-8">
            {t.hero.subtitle}
          </p>
          <div className="hero-cta flex flex-col md:flex-row gap-6 justify-center items-center">
            <Magnetic strength={0.2}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsInquiryOpen(true)}
                className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-neutral-100 transition-colors flex items-center gap-3 group relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">{t.hero.cta1}</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <motion.a 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                href="#work" 
                className="px-10 py-5 bg-white/5 backdrop-blur-md text-white font-bold rounded-full border border-white/10 transition-all flex items-center gap-2 group"
              >
                {t.hero.cta2}
                <div className="w-1 h-1 rounded-full bg-white opacity-40 group-hover:scale-[3] group-hover:bg-indigo-400 transition-all" />
              </motion.a>
            </Magnetic>
          </div>
        </div>
        <NextSectionLink href="#about" label={t.common.next} className="absolute bottom-12 left-1/2 -translate-x-1/2 mt-0" />
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex flex-col justify-start pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black mb-16 tracking-tighter leading-snug uppercase">
                {t.about.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-500 to-rose-500 animate-gradient-x">
                  {t.about.highlight}
                </span>
              </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {t.about.desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              <div className="stagger-item">
                <h3 className="text-4xl font-bold text-emerald-500 mb-2">100+</h3>
                <p className="text-sm text-gray-400 uppercase tracking-widest">{t.about.stat1}</p>
              </div>
              <div className="stagger-item">
                <h3 className="text-4xl font-bold text-amber-500 mb-2">15</h3>
                <p className="text-sm text-gray-400 uppercase tracking-widest">{t.about.stat2}</p>
              </div>
            </div>
          </div>
          <div className="stagger-item relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900/40 to-rose-900/40 border border-white/10 flex items-center justify-center p-12 group">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/800/800')] opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[url('http://assets.iceable.com/img/noise-transparent.png')] opacity-10 pointer-events-none" />
            <Layers size={120} className="text-indigo-400 animate-pulse relative z-10" />
          </div>
        </div>
        </div>
        <NextSectionLink href="#work" label={t.common.next} className="mt-24" />
      </section>

      {/* Work Section */}
      <section id="work" className="min-h-screen flex flex-col justify-start pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="reveal text-center mb-32">
            <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter uppercase leading-snug opacity-20">
              {t.work.selected} <br /> <span className="text-white opacity-100">{t.work.highlight}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              {t.work.subtitle}
            </p>
          </div>

        {/* Finished Products */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-2xl font-bold tracking-tight uppercase text-amber-500">
              <span className="text-white/20 mr-2">01</span>
              {t.work.finishedTitle}
            </h3>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(item => item.tag === 'finished').map((project) => (
              <div key={project.id} className="stagger-item">
                <ProjectCard 
                  project={project} 
                  lang={lang} 
                  onClick={() => setSelectedProject(project)} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* In Production Products */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-2xl font-bold tracking-tight uppercase text-indigo-500">
              <span className="text-white/20 mr-2">02</span>
              {t.work.inProductionTitle}
            </h3>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.filter(item => item.tag === 'production').map((project) => (
              <div key={project.id} className="stagger-item">
                <ProjectCard 
                  project={project} 
                  lang={lang} 
                  onClick={() => setSelectedProject(project)} 
                  isSmall
                />
              </div>
            ))}
          </div>
        </div>
        </div>
        <NextSectionLink href="#services" label={t.common.next} className="mt-24" />
      </section>
      {/* Services Section */}
      <section id="services" className="min-h-screen flex flex-col justify-start pt-20 pb-32 px-8 bg-[#050505] relative overflow-hidden">
        <div className="scanlines" />
        <div className="max-w-7xl mx-auto w-full relative z-20">
          <div className="reveal text-center mb-32">
            <span className="text-[10px] font-mono text-indigo-500 tracking-[0.5em] uppercase mb-4 block">{t.services.label}</span>
            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-snug">{t.services.title}</h2>
            <p className="text-gray-300 max-w-lg mx-auto font-light leading-relaxed">{t.services.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden">
            {t.services.items.map((service, i) => (
              <div key={i} className="stagger-item p-12 bg-black hover:bg-white/5 transition-colors group relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20">0{i + 1}</div>
                <div className="w-12 h-12 border border-dashed border-white/20 rounded-full flex items-center justify-center mb-8 group-hover:border-indigo-500/50 transition-colors">
                  <div className="text-white/40 group-hover:text-indigo-400 transition-colors">
                    {i === 0 ? <Cpu size={20} /> : i === 1 ? <Globe size={20} /> : i === 2 ? <Zap size={20} /> : i === 3 ? <Code2 size={20} /> : i === 4 ? <Layers size={20} /> : <ArrowRight size={20} />}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight uppercase">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{service.desc}</p>
                
                {/* Hardware-like detail */}
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(dot => (
                      <div key={dot} className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-indigo-500/40 transition-colors" />
                    ))}
                  </div>
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{t.services.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <NextSectionLink href="#contact" label={t.common.next} className="mt-24" />
      </section>
      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex flex-col justify-center pt-20 pb-32 px-8 bg-black">
        <div className="reveal max-w-7xl mx-auto w-full text-center">
          <span className="text-[10px] font-mono text-rose-500 tracking-[0.5em] uppercase mb-12 block">{t.contact.evolve}</span>
          <h2 className="text-7xl md:text-[12vw] font-black mb-20 tracking-tighter uppercase leading-snug mix-blend-difference">
            {t.contact.title.split(' ')[0]} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">{t.contact.title.split(' ')[1]}</span>
          </h2>
          <p className="text-xl text-gray-400 mb-20 max-w-2xl mx-auto font-light leading-relaxed">{t.contact.subtitle}</p>
          
          <Magnetic strength={0.2}>
            <a href="mailto:hello@1001labs.com" className="stagger-item inline-flex items-center gap-4 px-16 py-8 bg-white text-black font-black text-2xl rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] group">
              {t.contact.cta}
              <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </Magnetic>
        </div>
        <NextSectionLink href="#top" label={t.common.backToTop} className="mt-48" />
      </section>

      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-400 text-sm tracking-widest uppercase">
        <p>&copy; 2026 1001LABS. {t.footer}</p>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-md border border-white/10"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-black/20">
                <img 
                  src={`https://picsum.photos/seed/${selectedProject.id === 'horamed' ? 'medical' : selectedProject.id === 'arenacup' ? 'stadium' : selectedProject.id === 'doughlabpro' ? 'bread' : selectedProject.id === 'guata' ? 'nature' : selectedProject.id}/1200/1600`} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                  {selectedProject.id === 'horamed' && <HoraMedLogo className="w-full max-w-[180px] text-white drop-shadow-2xl" />}
                  {selectedProject.id === 'arenacup' && <ArenaCupLogo className="w-full max-w-[180px] text-white drop-shadow-2xl" />}
                  {selectedProject.id === 'doughlabpro' && <DoughLabLogo className="w-full max-w-[320px] drop-shadow-2xl" />}
                  {selectedProject.id === 'guata' && <GuataLogo className="w-full max-w-[180px] text-indigo-500 drop-shadow-2xl" />}
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold mb-4 tracking-[0.2em] uppercase border border-indigo-500/20">
                    {lang === 'en' ? selectedProject.category.en : selectedProject.category.pt}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{selectedProject.title}</h2>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
                    <span className={`w-2 h-2 rounded-full ${selectedProject.tag === 'finished' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                    {lang === 'en' ? selectedProject.status.en : selectedProject.status.pt}
                  </div>
                </div>

                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p className="text-lg font-medium text-white/90">{lang === 'en' ? selectedProject.desc.en : selectedProject.desc.pt}</p>
                  <p className="text-base font-light">{lang === 'en' ? selectedProject.longDesc.en : selectedProject.longDesc.pt}</p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                  {selectedProject.link && (
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all group"
                    >
                      {t.modal.visit}
                      <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full transition-all border border-white/10"
                  >
                    {t.modal.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
