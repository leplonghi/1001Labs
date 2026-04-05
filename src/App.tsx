import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Code2, Cpu, Globe, Layers, Zap, Languages, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Background3D from './components/Background3D';
import Logo from './components/Logo';
import { GoogleGenAI } from "@google/genai";

gsap.registerPlugin(ScrollTrigger);

const translations = {
  en: {
    nav: { about: "About", work: "Work", services: "Services", contact: "Contact" },
    hero: {
      title: "FUTURE IS NOW",
      subtitle: "We build immersive digital experiences that push the boundaries of what's possible. Blending art, technology, and human emotion.",
      cta1: "Start a Project",
      cta2: "Explore 360 Universe",
      generating: "Generating...",
      back: "Back to Grid"
    },
    about: {
      title: "Redefining the",
      highlight: "Digital Frontier",
      desc: "1001Labs is a creative powerhouse dedicated to crafting high-end digital solutions. We don't just build websites; we build ecosystems that live and breathe.",
      stat1: "Projects Delivered",
      stat2: "Global Awards"
    },
    services: {
      title: "Our Expertise",
      subtitle: "From concept to deployment, we handle every aspect of the modern digital experience.",
      items: [
        { title: "AI Integration", desc: "Leveraging neural networks to create smarter, adaptive user interfaces." },
        { title: "Web3 Ecosystems", desc: "Building the decentralized future with robust blockchain solutions." },
        { title: "High Performance", desc: "Optimized to the core for lightning-fast interactions and smooth 60fps." },
        { title: "Custom Dev", desc: "Tailor-made codebases built for scalability and long-term growth." },
        { title: "UI/UX Design", desc: "Award-winning design systems that prioritize user flow and emotion." },
        { title: "Strategy", desc: "Data-driven insights to guide your brand through the digital noise." }
      ]
    },
    contact: {
      title: "LET'S CREATE",
      highlight: "SOMETHING EPIC",
      subtitle: "Ready to take your digital presence to the next dimension?",
      cta: "GET IN TOUCH"
    },
    work: {
      items: [
        { id: "horamed", title: "HoraMed", category: "HEALTHCARE", desc: "Intelligent scheduling and patient management ecosystem." },
        { id: "arenacup", title: "ArenaCup", category: "SPORTS", desc: "High-performance platform for tournament organization and live tracking." },
        { id: "doughlabpro", title: "DoughLab Pro", category: "FOOD TECH", desc: "Advanced production control for industrial bakeries and labs." }
      ]
    },
    footer: "ALL RIGHTS RESERVED."
  },
  pt: {
    nav: { about: "Sobre", work: "Trabalho", services: "Serviços", contact: "Contato" },
    hero: {
      title: "O FUTURO É AGORA",
      subtitle: "Construímos experiências digitais imersivas que desafiam os limites do possível. Misturando arte, tecnologia e emoção humana.",
      cta1: "Iniciar Projeto",
      cta2: "Explorar Universo 360",
      generating: "Gerando...",
      back: "Voltar para Grade"
    },
    about: {
      title: "Redefinindo a",
      highlight: "Fronteira Digital",
      desc: "A 1001Labs é uma potência criativa dedicada a criar soluções digitais de alto nível. Não apenas construímos sites; construímos ecossistemas que vivem e respiram.",
      stat1: "Projetos Entregues",
      stat2: "Prêmios Globais"
    },
    services: {
      title: "Nossa Especialidade",
      subtitle: "Do conceito à implantação, cuidamos de todos os aspectos da experiência digital moderna.",
      items: [
        { title: "Integração de IA", desc: "Aproveitando redes neurais para criar interfaces de usuário mais inteligentes e adaptáveis." },
        { title: "Ecossistemas Web3", desc: "Construindo o futuro descentralizado com soluções robustas de blockchain." },
        { title: "Alta Performance", desc: "Otimizado ao máximo para interações ultrarrápidas e fluidez de 60fps." },
        { title: "Dev Customizado", desc: "Bases de código sob medida construídas para escalabilidade e crescimento a longo prazo." },
        { title: "Design UI/UX", desc: "Sistemas de design premiados que priorizam o fluxo do usuário e a emoção." },
        { title: "Estratégia", desc: "Insights baseados em dados para guiar sua marca através do ruído digital." }
      ]
    },
    contact: {
      title: "VAMOS CRIAR",
      highlight: "ALGO ÉPICO",
      subtitle: "Pronto para levar sua presença digital para a próxima dimensão?",
      cta: "ENTRE EM CONTATO"
    },
    work: {
      items: [
        { id: "horamed", title: "HoraMed", category: "SAÚDE", desc: "Ecossistema inteligente de agendamento e gestão de pacientes." },
        { id: "arenacup", title: "ArenaCup", category: "ESPORTES", desc: "Plataforma de alta performance para organização de torneios e acompanhamento ao vivo." },
        { id: "doughlabpro", title: "DoughLab Pro", category: "FOOD TECH", desc: "Controle avançado de produção para padarias industriais e laboratórios." }
      ]
    },
    footer: "TODOS OS DIREITOS RESERVADOS."
  }
};

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'en' | 'pt'>('pt');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = translations[lang];

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
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });
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
        ease: 'none',
      });
    });
  }, { scope: containerRef, dependencies: [lang] });

  return (
    <div ref={containerRef} className="relative text-white selection:bg-indigo-500/30">
      <Background3D />
      
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-8 py-4 md:py-6 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2 z-50">
          <Logo className="scale-75 origin-left" />
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
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="text-center z-10">
          <h1 className="hero-title text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[0.9]">
            {t.hero.title}
          </h1>
          <p className="hero-subtitle text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            {t.hero.subtitle}
          </p>
          <div className="hero-cta flex flex-col md:flex-row gap-4 justify-center items-center">
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-8 tracking-tight">{t.about.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">{t.about.highlight}</span></h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-6">
              {t.about.desc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-4xl font-bold text-emerald-500 mb-2">100+</h3>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{t.about.stat1}</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-amber-500 mb-2">15</h3>
                <p className="text-sm text-gray-500 uppercase tracking-widest">{t.about.stat2}</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900/40 to-rose-900/40 border border-white/10 flex items-center justify-center p-12 group">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/800/800')] opacity-20 group-hover:opacity-40 transition-opacity duration-700 mix-blend-overlay" />
            <Layers size={120} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="reveal text-center mb-20">
          <h2 className="text-5xl font-bold mb-6">{t.nav.work}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.work.items.map((project, i) => (
            <div key={project.id} className="reveal group relative aspect-[4/5] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
              <img 
                src={`https://picsum.photos/seed/${project.id}/800/1000`} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <span className="text-amber-400 text-[10px] font-mono mb-2 tracking-[0.2em] uppercase">{project.category}</span>
                <h3 className="text-3xl font-black tracking-tighter mb-2">{project.title}</h3>
                <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-8 bg-white/5 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">{t.services.title}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t.services.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {t.services.items.map((service, i) => (
              <div key={i} className="reveal p-10 rounded-3xl bg-black/40 border border-white/5 hover:border-indigo-500/50 transition-all group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                  i % 3 === 0 ? 'bg-indigo-600/20 text-indigo-400' : 
                  i % 3 === 1 ? 'bg-emerald-600/20 text-emerald-400' : 
                  'bg-rose-600/20 text-rose-400'
                }`}>
                  {i === 0 ? <Cpu /> : i === 1 ? <Globe /> : i === 2 ? <Zap /> : i === 3 ? <Code2 /> : i === 4 ? <Layers /> : <ArrowRight />}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-8">
        <div className="reveal max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter">{t.contact.title} <br /> {t.contact.highlight}</h2>
          <p className="text-2xl text-gray-400 mb-12">{t.contact.subtitle}</p>
          <a href="mailto:hello@1001labs.com" className="inline-block px-12 py-6 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xl rounded-full hover:from-rose-500 hover:to-amber-500 transition-all hover:scale-105 shadow-xl shadow-rose-500/20">
            {t.contact.cta}
          </a>
        </div>
      </section>

      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-600 text-sm tracking-widest uppercase">
        <p>&copy; 2026 1001LABS. {t.footer}</p>
      </footer>
    </div>
  );
}
