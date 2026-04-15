import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';
import Lenis from 'lenis';
import { ArrowRight, Code2, Cpu, Globe, Layers, Zap, Languages, Menu, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import Background3D from './components/Background3D';
import Logo from './components/Logo';
import { HoraMedLogo, ArenaCupLogo, DoughLabLogo, GuataLogo } from './components/ProjectLogos';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

gsap.registerPlugin(ScrollTrigger);

const translations = {
  en: {
    nav: { 
      about: "About", 
      work: "Work", 
      services: "Services", 
      contact: "Contact"
    },
    hero: {
      title: "Where digital ceases to be ordinary.",
      subtitle: "We develop digital experiences that elevate brands, refine journeys, and transform ambition into product.",
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
        { title: "Digital Ecosystems", desc: "Building the future with robust and scalable digital solutions." },
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
      title: "What we've launched. What's already in motion.",
      subtitle: "Digital products that have already taken shape in the real world, alongside new platforms under development within the 1001Labs ecosystem.",
      finishedTitle: "Finished Products",
      inProductionTitle: "In Production",
      items: [
        { 
          id: "horamed", 
          title: "HoraMed", 
          category: "Healthcare", 
          desc: "Medication management and health routine platform, created to make care simpler, safer and smarter for users and families.",
          longDesc: "HoraMed is a comprehensive healthcare solution designed to bridge the gap between patients and their medication routines. It features smart notifications, family sharing capabilities, and detailed health tracking metrics. Built with privacy and accessibility at its core, it ensures that managing health is never a burden.",
          link: "https://horamed.com",
          status: "Finished"
        },
        { 
          id: "arenacup", 
          title: "ArenaCup", 
          category: "Sports", 
          desc: "High-performance platform for tournament organization, real-time tracking and competition management with fluidity, clarity and scale.",
          longDesc: "ArenaCup redefines how sports tournaments are managed. From local leagues to international competitions, our platform provides real-time scoring, automated brackets, and deep statistical analysis. It's built for speed and reliability, ensuring that organizers can focus on the game while we handle the data.",
          link: "https://arenacup.io",
          status: "Finished"
        },
        { 
          id: "doughlabpro", 
          title: "DoughLab Pro", 
          category: "Food Tech", 
          desc: "Digital laboratory for baking and pizza, with advanced calculations, fermentation control, dough management and technical tools for precision production.",
          longDesc: "DoughLab Pro is the ultimate companion for professional bakers and pizza enthusiasts. It offers precision hydration calculations, fermentation curve tracking, and ingredient management. Whether you're running a high-volume bakery or perfecting a home recipe, DoughLab Pro brings scientific accuracy to the art of baking.",
          link: "https://doughlab.pro",
          status: "Finished"
        },
        { 
          id: "pilotis", 
          title: "PILOTIS", 
          category: "Arch Tech", 
          desc: "Management platform for architecture and design offices, integrating briefing, proposal, contract, project, financial and documents in a single flow.",
          longDesc: "PILOTIS is the backbone for modern architecture firms. It streamlines the entire project lifecycle, from the initial client briefing to the final financial reconciliation. By centralizing all documents and communications, it allows designers to focus on creativity while maintaining operational excellence.",
          link: "https://pilotis.arch",
          status: "In production"
        },
        { 
          id: "guata", 
          title: "Guata", 
          category: "Travel Tech", 
          desc: "Smart tourism app with dynamic itineraries, location-based contextual content and adaptable journeys for urban and cultural discovery.",
          longDesc: "Guata transforms how you explore cities. Using advanced geolocation and AI, it crafts personalized travel experiences that adapt to your interests and the time of day. Discover hidden gems and local stories through an immersive, context-aware interface.",
          link: "https://guata.app",
          status: "In production"
        },
        { 
          id: "heridata", 
          title: "Heridata", 
          category: "Heritage Tech", 
          desc: "Intelligence platform for cultural heritage, connecting collections, maps, documents, images and structured data in a robust consultation and management experience.",
          longDesc: "Heridata is a digital sanctuary for cultural heritage. It provides a robust framework for archiving and exploring historical data, linking diverse media types with structured metadata. It's an essential tool for researchers, curators, and anyone passionate about preserving the past.",
          link: "https://heridata.org",
          status: "In production"
        },
        { 
          id: "arumo", 
          title: "Arumo", 
          category: "Fin Tech", 
          desc: "Financial organization micro-SaaS with a clear interface, strategic vision and focus on transforming financial routine into practical and actionable reading.",
          longDesc: "Arumo simplifies personal and small business finance. It strips away the complexity of traditional accounting, offering a clean, intuitive dashboard that highlights what truly matters. Turn your financial data into actionable insights with Arumo's strategic vision.",
          link: "https://arumo.finance",
          status: "In production"
        }
      ]
    },
    footer: "ALL RIGHTS RESERVED.",
    common: {
      next: "Next Section",
      backToTop: "Back to Top"
    }
  },
  pt: {
    nav: { 
      about: "Sobre", 
      work: "Trabalho", 
      services: "Serviços", 
      contact: "Contato"
    },
    hero: {
      title: "Onde o digital deixa de ser comum.",
      subtitle: "Desenvolvemos experiências digitais que elevam marcas, refinam jornadas e transformam ambição em produto.",
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
        { title: "Ecossistemas Digitais", desc: "Construindo o futuro com soluções digitais robustas e escaláveis." },
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
      title: "O que já lançamos. O que já está em movimento.",
      subtitle: "Produtos digitais que já ganharam forma no mundo real, ao lado de novas plataformas em desenvolvimento dentro do ecossistema da 1001Labs.",
      finishedTitle: "Produtos Finalizados",
      inProductionTitle: "Em Produção",
      items: [
        { 
          id: "horamed", 
          title: "HoraMed", 
          category: "Saúde", 
          desc: "Plataforma de gestão de medicamentos e rotina de saúde, criada para tornar o cuidado mais simples, seguro e inteligente para usuários e famílias.",
          longDesc: "O HoraMed é uma solução abrangente de saúde projetada para aproximar pacientes de suas rotinas de medicação. Possui notificações inteligentes, compartilhamento familiar e métricas detalhadas de acompanhamento de saúde. Construído com privacidade e acessibilidade no centro, garante que a gestão da saúde nunca seja um fardo.",
          link: "https://horamed.com",
          status: "Finalizado"
        },
        { 
          id: "arenacup", 
          title: "ArenaCup", 
          category: "Esportes", 
          desc: "Plataforma de alta performance para organização de torneios, acompanhamento em tempo real e gestão de competições com fluidez, clareza e escala.",
          longDesc: "O ArenaCup redefine como os torneios esportivos são gerenciados. De ligas locais a competições internacionais, nossa plataforma oferece pontuação em tempo real, chaves automatizadas e análise estatística profunda. É construído para velocidade e confiabilidade, garantindo que os organizadores possam focar no jogo enquanto cuidamos dos dados.",
          link: "https://arenacup.io",
          status: "Finalizado"
        },
        { 
          id: "doughlabpro", 
          title: "DoughLab Pro", 
          category: "Food Tech", 
          desc: "Laboratório digital para panificação e pizza, com cálculos avançados, controle de fermentação, gestão de massas e ferramentas técnicas para produção com precisão.",
          longDesc: "O DoughLab Pro é o companheiro definitivo para padeiros profissionais e entusiastas de pizza. Oferece cálculos de hidratação de precisão, rastreamento de curvas de fermentação e gestão de ingredientes. Seja você dono de uma padaria de alto volume ou aperfeiçoando uma receita caseira, o DoughLab Pro traz precisão científica para a arte da panificação.",
          link: "https://doughlab.pro",
          status: "Finalizado"
        },
        { 
          id: "pilotis", 
          title: "PILOTIS", 
          category: "Arch Tech", 
          desc: "Plataforma de gestão para escritórios de arquitetura e design, integrando briefing, proposta, contrato, projeto, financeiro e documentos em um fluxo único.",
          longDesc: "O PILOTIS é a espinha dorsal para escritórios de arquitetura modernos. Ele otimiza todo o ciclo de vida do projeto, desde o briefing inicial com o cliente até a reconciliação financeira final. Ao centralizar todos os documentos e comunicações, permite que os designers foquem na criatividade enquanto mantêm a excelência operacional.",
          link: "https://pilotis.arch",
          status: "Em produção"
        },
        { 
          id: "guata", 
          title: "Guata", 
          category: "Travel Tech", 
          desc: "Aplicativo de turismo inteligente com roteiros dinâmicos, conteúdo contextual por localização e jornadas adaptáveis para descoberta urbana e cultural.",
          longDesc: "O Guata transforma como você explora cidades. Usando geolocalização avançada e IA, ele cria experiências de viagem personalizadas que se adaptam aos seus interesses e à hora do dia. Descubra joias escondidas e histórias locais através de uma interface imersiva e consciente do contexto.",
          link: "https://guata.app",
          status: "Em produção"
        },
        { 
          id: "heridata", 
          title: "Heridata", 
          category: "Heritage Tech", 
          desc: "Plataforma de inteligência para patrimônio cultural, conectando acervos, mapas, documentos, imagens e dados estruturados em uma experiência robusta de consulta e gestão.",
          longDesc: "O Heridata é um santuário digital para o patrimônio cultural. Ele fornece uma estrutura robusta para arquivamento e exploração de dados históricos, vinculando diversos tipos de mídia com metadados estruturados. É uma ferramenta essencial para pesquisadores, curadores e qualquer pessoa apaixonada por preservar o passado.",
          link: "https://heridata.org",
          status: "Em produção"
        },
        { 
          id: "arumo", 
          title: "Arumo", 
          category: "Fin Tech", 
          desc: "Micro-SaaS de organização financeira com interface clara, visão estratégica e foco em transformar rotina financeira em leitura prática e acionável.",
          longDesc: "O Arumo simplifica as finanças pessoais e de pequenos negócios. Ele elimina a complexidade da contabilidade tradicional, oferecendo um painel limpo e intuitivo que destaca o que realmente importa. Transforme seus dados financeiros em insights acionáveis com a visão estratégica do Arumo.",
          link: "https://arumo.finance",
          status: "Em produção"
        }
      ]
    },
    footer: "TODOS OS DIREITOS RESERVADOS.",
    common: {
      next: "Próxima Seção",
      backToTop: "Voltar ao Topo"
    }
  }
};

const NextSectionLink = ({ href, label, className = "" }: { href: string; label: string; className?: string }) => (
  <div className={`flex justify-center mt-24 reveal ${className}`}>
    <a 
      href={href} 
      className="group flex flex-col items-center gap-4 text-[10px] font-bold tracking-[0.4em] text-gray-500 hover:text-white transition-all duration-500 uppercase"
    >
      <span className="opacity-60 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-500">{label}</span>
      <div className="relative w-[1px] h-16 bg-gradient-to-b from-white/40 to-transparent overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out" />
      </div>
    </a>
  </div>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'en' | 'pt'>('pt');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div id="top" ref={containerRef} className="relative text-white selection:bg-indigo-500/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-[200]"
        style={{ scaleX }}
      />
      <Background3D />
      
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 md:px-16 py-0 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-2 z-50">
          <Logo className="scale-75 origin-left" showBackground={false} />
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
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden scroll-snap-align-start">
        <div className="text-center z-10 max-w-5xl mx-auto">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 leading-[0.9] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            {t.hero.title}
          </h1>
          <p className="hero-subtitle text-base md:text-lg text-gray-400/80 max-w-2xl mx-auto mb-12 leading-relaxed px-4 font-light tracking-wider italic border-l border-white/10">
            {t.hero.subtitle}
          </p>
          <div className="hero-cta flex flex-col md:flex-row gap-4 justify-center items-center">
          </div>
        </div>
        <NextSectionLink href="#about" label={t.common.next} className="absolute bottom-12 left-1/2 -translate-x-1/2 mt-0" />
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 max-w-7xl mx-auto scroll-mt-[66px]">
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">{t.about.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">{t.about.highlight}</span></h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
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
        <NextSectionLink href="#work" label={t.common.next} />
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 px-8 max-w-7xl mx-auto scroll-mt-[66px]">
        <div className="reveal text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">{t.work.title}</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t.work.subtitle}
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-8" />
        </div>

        {/* Finished Products */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-2xl font-bold tracking-tight uppercase text-amber-500">{t.work.finishedTitle}</h3>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.work.items.filter(item => item.status === (lang === 'pt' ? 'Finalizado' : 'Finished')).map((project, i) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="reveal group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl shadow-black/50 cursor-pointer"
              >
                <img 
                  src={`https://picsum.photos/seed/${project.id === 'horamed' ? 'medical' : project.id === 'arenacup' ? 'stadium' : project.id === 'doughlabpro' ? 'bread' : project.id}/800/1000`} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                  {project.id === 'horamed' && <HoraMedLogo className="w-full max-w-[120px] text-white drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
                  {project.id === 'arenacup' && <ArenaCupLogo className="w-full max-w-[120px] text-white drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
                  {project.id === 'doughlabpro' && <DoughLabLogo className="w-full max-w-[240px] drop-shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-10">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold mb-4 tracking-[0.2em] uppercase border border-amber-500/20">
                      {project.category}
                    </span>
                    <h3 className="text-4xl font-black tracking-tighter mb-4">{project.title}</h3>
                    <p className="text-base text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-500 line-clamp-3 leading-relaxed font-light">
                      {project.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Production Products */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-2xl font-bold tracking-tight uppercase text-indigo-500">{t.work.inProductionTitle}</h3>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.work.items.filter(item => item.status === (lang === 'pt' ? 'Em produção' : 'In production')).map((project, i) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="reveal group relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer"
              >
                <img 
                  src={`https://picsum.photos/seed/${project.id === 'guata' ? 'nature' : project.id}/600/600`} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                  {project.id === 'guata' && <GuataLogo className="w-1/2 text-indigo-500 drop-shadow-2xl opacity-60 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-indigo-400 text-[9px] font-mono mb-1 tracking-[0.2em] uppercase">{project.category}</span>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{project.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <NextSectionLink href="#services" label={t.common.next} />
      </section>
      <section id="services" className="py-32 px-8 bg-white/5 backdrop-blur-3xl scroll-mt-[66px]">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.services.title}</h2>
            <p className="text-gray-400 max-w-lg mx-auto">{t.services.subtitle}</p>
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
        <NextSectionLink href="#contact" label={t.common.next} />
      </section>
      <section id="contact" className="py-32 px-8 scroll-mt-[66px]">
        <div className="reveal max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter">{t.contact.title} <br /> {t.contact.highlight}</h2>
          <p className="text-xl text-gray-400 mb-12">{t.contact.subtitle}</p>
          <a href="mailto:hello@1001labs.com" className="inline-block px-12 py-6 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xl rounded-full hover:from-rose-500 hover:to-amber-500 transition-all hover:scale-105 shadow-xl shadow-rose-500/20">
            {t.contact.cta}
          </a>
        </div>
        <NextSectionLink href="#top" label={t.common.backToTop} className="mt-32" />
      </section>

      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-600 text-sm tracking-widest uppercase">
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
                    {selectedProject.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{selectedProject.title}</h2>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
                    <span className={`w-2 h-2 rounded-full ${selectedProject.status === 'Finished' || selectedProject.status === 'Finalizado' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                    {selectedProject.status}
                  </div>
                </div>

                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p className="text-lg font-medium text-white/90">{selectedProject.desc}</p>
                  <p className="text-base font-light">{selectedProject.longDesc}</p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                  {selectedProject.link && (
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all group"
                    >
                      {lang === 'en' ? 'Visit Live Site' : 'Visitar Site'}
                      <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full transition-all border border-white/10"
                  >
                    {lang === 'en' ? 'Close' : 'Fechar'}
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
