import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { 
  Menu as MenuIcon, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  ChevronRight, 
  Star, 
  Clock, 
  Utensils, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Motion Helpers ---

const Magnetic = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove as any);
      el.addEventListener("mouseleave", reset);
      return () => {
        el.removeEventListener("mousemove", handleMouseMove as any);
        el.removeEventListener("mouseleave", reset);
      };
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);

    const handleHover = () => setIsHovered(true);
    const handleUnhover = () => setIsHovered(false);

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleUnhover);
    });

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleUnhover);
      });
    };
  }, []);

  const cursorX = useSpring(mousePosition.x - 16, { stiffness: 500, damping: 30 });
  const cursorY = useSpring(mousePosition.y - 16, { stiffness: 500, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        scale: isHovered ? 2.5 : 1,
        backgroundColor: isHovered ? "rgba(197, 160, 89, 0.2)" : "transparent",
      }}
    >
      <div className={cn("w-1 h-1 bg-gold rounded-full transition-all", isHovered && "scale-0")} />
    </motion.div>
  );
};

const Reveal = ({ children, width = "fit-content", delay = 0, direction = "up" }: { children: ReactNode, width?: "fit-content" | "100%", delay?: number, direction?: "up" | "down" | "left" | "right", key?: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div variants={variants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
        {children}
      </motion.div>
    </div>
  );
};

const TiltCard = ({ children, className }: { children: ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);
    x.set(deltaY * 10); // rotation around X axis (up/down)
    y.set(deltaX * -10); // rotation around Y axis (left/right)
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: x, rotateY: y, transformStyle: "preserve-3d" }}
      className={cn("perspective-1000", className)}
    >
      {children}
    </motion.div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Esperienza', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Contatti', href: '#contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed w-full z-[100] transition-all duration-700",
        isScrolled ? "glass-nav py-4" : "bg-transparent py-8"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
        <a href="#home" className="text-3xl font-serif tracking-tighter text-white font-bold group">
          M<span className="text-gold transition-all duration-500 group-hover:tracking-[0.2em]">ARIZZ</span>O
        </a>
        
        <div className="hidden md:flex space-x-12 items-center">
          {navLinks.map((link, i) => (
            <motion.a 
              key={link.name} 
              href={link.href} 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
              className="text-[10px] uppercase tracking-[0.3em] font-medium hover:text-gold transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
          <Magnetic>
            <a href="#contact" className="glass-button py-3 px-8 text-[10px]">
              Prenota Ora
            </a>
          </Magnetic>
        </div>

        <button className="md:hidden text-gold" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 w-full bg-dark z-[99] md:hidden flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-4xl serif tracking-tight text-white hover:text-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="glass-button w-64" onClick={() => setIsMobileMenuOpen(false)}>Prenota</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layers */}
      <motion.div style={{ scale, opacity }} className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" 
          alt="Atmosphere" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark" />
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)" />
      </motion.div>

      {/* Floating Particles/Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-10 w-64 h-64 border border-gold/10 rounded-full blur-2xl pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-6 mt-20">
        <Reveal delay={0.2} direction="down">
          <span className="text-gold uppercase tracking-[0.5em] text-[10px] mb-6 block font-bold">
            Milan Centrale • Dal 2006
          </span>
        </Reveal>
        
        <div className="overflow-hidden mb-8">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-7xl md:text-[10rem] serif leading-[0.85] tracking-tighter"
          >
            L'ARTE DEL <br />
            <span className="italic text-gold block mt-2">Piacere</span>
          </motion.h1>
        </div>

        <Reveal delay={0.8}>
          <p className="text-sm md:text-base text-paper/40 mb-12 max-w-xl mx-auto font-light leading-relaxed tracking-wider uppercase">
            Un viaggio sensoriale dove la tradizione incontra l'innovazione, 
            curato dalla visione del Maestro Mario.
          </p>
        </Reveal>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Magnetic>
            <a href="#menu" className="glass-button">Scopri il Menu</a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50 hover:text-gold transition-colors flex items-center gap-2 group">
              Prenota il tuo posto <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Scroll for Experience</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-gold/50 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const { scrollYProgress } = useScroll();
  const x1 = useTransform(scrollYProgress, [0.1, 0.4], [0, -100]);
  const x2 = useTransform(scrollYProgress, [0.1, 0.4], [0, 100]);

  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      {/* Decorative Text */}
      <motion.div 
        style={{ x: x1 }}
        className="absolute top-20 -left-20 text-[20vw] serif text-white/[0.02] whitespace-nowrap pointer-events-none select-none"
      >
        L'ECCELLENZA MILANESE
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <TiltCard className="relative">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="aspect-[4/5] overflow-hidden group rounded-lg"
          >
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
              alt="Chef Mario" 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:grayscale group-hover:brightness-50 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-10 -right-10 glass-card p-12 hidden lg:block"
          >
            <p className="serif text-7xl text-gold leading-none">20+</p>
            <p className="text-[10px] uppercase tracking-[0.3em] mt-4 font-bold">Chef's Legacy Years</p>
          </motion.div>
        </TiltCard>
        
        <div className="relative z-10">
          <Reveal>
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] mb-6 block font-bold">Chi Siamo</span>
          </Reveal>
          <Reveal delay={0.2}>
            <h3 className="text-5xl md:text-7xl serif mb-12 leading-[1.1] tracking-tight">
              La Visione di un <br /> <span className="italic text-gold">Maestro del Gusto</span>
            </h3>
          </Reveal>
          <div className="space-y-8 text-paper/50 font-light leading-relaxed tracking-wide">
            <Reveal delay={0.4}>
              <p className="text-lg">
                Marizzo non è un semplice ristorante, è una dichiarazione d'amore alla cucina italiana 
                ambientata nel dinamico skyline di Milano Centrale.
              </p>
            </Reveal>
            <Reveal delay={0.6}>
              <p>
                Ogni piatto curato da Mario è un'opera d'arte equilibrata tra la precisione ancestrale 
                della pizza napoletana e la raffinatezza metropolitana della cucina milanese contemporanea.
              </p>
            </Reveal>
          </div>
          
          <div className="grid grid-cols-2 gap-12 mt-16 pt-12 border-t border-white/5">
            <Reveal delay={0.8}>
              <div className="flex flex-col gap-4">
                <Award className="text-gold w-6 h-6" />
                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em]">Cucina D'autore</h4>
                <p className="text-xs text-white/30 leading-relaxed uppercase tracking-tighter">Solo ingredienti selezionati dai presidi Slow Food.</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="flex flex-col gap-4">
                <Utensils className="text-gold w-6 h-6" />
                <h4 className="font-bold text-[10px] uppercase tracking-[0.2em]">Ambiente Immersivo</h4>
                <p className="text-xs text-white/30 leading-relaxed uppercase tracking-tighter">Un'atmosfera cinematografica che avvolge ogni senso.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('Featured');
  const categories = ['Featured', 'Pizza', 'Cucina', 'Vini'];
  
  const menuItems = [
    { name: "Margherita Reale", desc: "Pomodoro San Marzano, Mozzarella di Bufala, Basilico fresco", price: "18€", cat: "Pizza" },
    { name: "Risotto Noir", desc: "Acquerello, Nero di Seppia, Gambero Rosso di Mazara, Oro", price: "32€", cat: "Featured" },
    { name: "Costoletta Metropoli", desc: "Tradizione milanese, tripla panatura, sale di Maldon", price: "38€", cat: "Cucina" },
    { name: "Pizza d'Autunno", desc: "Crema di zucca, porcini, speck croccante, provola affumicata", price: "22€", cat: "Pizza" },
  ];

  return (
    <section id="menu" className="py-32 px-6 bg-[#030303]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
          <div className="max-w-2xl">
            <Reveal>
              <span className="text-gold uppercase tracking-[0.4em] text-[10px] mb-6 block font-bold">Il Gusto</span>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-5xl md:text-8xl serif tracking-tighter">Le Collezioni</h3>
            </Reveal>
          </div>
          
          <div className="flex mt-8 md:mt-0 gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, i) => (
              <Reveal key={cat} delay={0.2 + i * 0.1}>
                <button 
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.3em] pb-2 transition-all relative font-bold",
                    activeCategory === cat ? "text-gold" : "text-white/20 hover:text-white"
                  )}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="cat-indicator" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid gap-1 border-white/5">
          {menuItems.map((item, idx) => (
            <motion.div 
              key={idx}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group flex flex-col md:flex-row justify-between items-start md:items-center py-12 border-b border-white/5 hover:bg-white/[0.02] transition-all px-8 -mx-8 relative overflow-hidden"
            >
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[8px] border border-gold/30 text-gold px-2 py-0.5 rounded-full uppercase tracking-widest">{item.cat}</span>
                  <h4 className="text-2xl md:text-4xl serif group-hover:text-gold transition-all duration-500">{item.name}</h4>
                </div>
                <p className="text-sm text-white/30 font-light tracking-wide max-w-lg italic">{item.desc}</p>
              </div>
              <div className="relative z-10 text-right mt-4 md:mt-0">
                <span className="text-3xl serif text-white/10 group-hover:text-gold transition-colors block">{item.price}</span>
                <button className="text-[8px] uppercase tracking-[0.4em] text-gold opacity-0 group-hover:opacity-100 transition-opacity mt-2">Dettagli</button>
              </div>
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gold/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
            </motion.div>
          ))}
        </div>

        <motion.div 
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          className="mt-24 text-center"
        >
          <Magnetic>
            <button className="glass-button">Sfoglia l'intera Galleria Gastronomica</button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2132&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <section className="flex flex-col h-[160vh] gap-1 px-1 bg-dark overflow-hidden">
      {images.map((img, i) => {
        const { scrollYProgress } = useScroll();
        const y = useTransform(scrollYProgress, [0.6 + i * 0.1, 1], ["0%", "-50%"]);
        
        return (
          <div key={i} className="flex-1 relative overflow-hidden group">
            <motion.img 
              style={{ y }}
              src={img} 
              alt="Culinary" 
              className="absolute inset-0 w-full h-[150%] object-cover transition-all duration-1000 group-hover:grayscale group-hover:brightness-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[15vw] serif text-white/5 uppercase select-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">0{i+1}</span>
            </div>
            <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4">
              <span className="w-10 h-[1px] bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-white">Momenti Marizzo</span>
            </div>
          </div>
        )
      })}
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-32 items-stretch">
        <div className="flex flex-col justify-between py-10">
          <div>
            <Reveal>
              <span className="text-gold uppercase tracking-[0.4em] text-[10px] mb-6 block font-bold">Unisciti a Noi</span>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-6xl md:text-[6rem] serif leading-[0.9] tracking-tighter mb-12">
                RESERVE YOUR <br /> <span className="italic text-gold">STORY.</span>
              </h3>
            </Reveal>
            
            <div className="grid gap-12 mt-20">
              <Reveal delay={0.4}>
                <div className="group cursor-pointer">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-2 group-hover:text-gold transition-colors">Digital Location</p>
                  <p className="text-2xl serif">Via Vitruvio, 43, 20124 Milano</p>
                </div>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="group cursor-pointer">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-2 group-hover:text-gold transition-colors">Auditory Path</p>
                  <p className="text-2xl serif">+39 123 456 789</p>
                </div>
              </Reveal>
              <Reveal delay={0.6}>
                <div className="group cursor-pointer flex gap-8">
                  <Instagram className="text-white/20 hover:text-gold transition-colors" />
                  <Facebook className="text-white/20 hover:text-gold transition-colors" />
                </div>
              </Reveal>
            </div>
          </div>
          
          <Reveal delay={1}>
            <div className="mt-20 flex items-center gap-6">
              <div className="w-20 h-20 border border-gold/20 rounded-full flex items-center justify-center">
                <Clock className="text-gold animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Symphony Hours</p>
                <p className="text-white/40 text-sm">Mon - Sun: 12:00-15:00 • 19:00-23:30</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="bg-white p-10 md:p-16 shadow-2xl text-dark">
          <h4 className="serif text-4xl mb-12">Prenota il tuo tavolo</h4>
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-dark/40">Nome</label>
                <input type="text" className="w-full border-b border-dark/10 py-2 focus:border-gold outline-none transition-colors text-dark" placeholder="Il tuo nome" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-dark/40">Email</label>
                <input type="email" className="w-full border-b border-dark/10 py-2 focus:border-gold outline-none transition-colors text-dark" placeholder="email@esempio.it" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-dark/40">Data</label>
                <input type="date" className="w-full border-b border-dark/10 py-2 focus:border-gold outline-none transition-colors text-dark" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-dark/40">Persone</label>
                <select className="w-full border-b border-dark/10 py-2 focus:border-gold outline-none transition-colors bg-transparent text-dark">
                  <option>2 Persone</option>
                  <option>3 Persone</option>
                  <option>4 Persone</option>
                  <option>5+ Persone</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-dark/40">Messaggio / Note</label>
              <textarea className="w-full border-b border-dark/10 py-2 focus:border-gold outline-none transition-colors h-24 resize-none text-dark" placeholder="Allergie, occasioni speciali..."></textarea>
            </div>
            <Magnetic>
              <button className="bg-gold text-dark w-full py-5 text-[10px] tracking-[0.4em] font-bold uppercase transition-all hover:bg-black hover:text-white">Invia Richiesta</button>
            </Magnetic>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-32 px-6 border-t border-white/5 relative overflow-hidden bg-dark">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <Reveal>
          <h2 className="text-[12vw] serif text-gold/10 tracking-tighter mb-10 select-none">MARIZZO</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-20 w-full text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Philosophy</span>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Bringing the essence of Italian artistry to the heart of the metropolis through 
              elevated culinary storytelling.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <Magnetic>
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group cursor-pointer hover:border-gold transition-colors">
                <ChevronRight className="rotate-[-90deg] group-hover:text-gold transition-colors" />
              </div>
            </Magnetic>
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/20">Return to Atmosphere</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6 text-xs uppercase tracking-widest text-paper/20">
            <a href="#" className="hover:text-gold transition-colors">Digital Identity</a>
            <a href="#" className="hover:text-gold transition-colors">Privacy Sanctum</a>
            <p className="mt-8 text-[8px] tracking-[0.2em]">© 2026 Crafted for Marizzo Milano</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-dark text-paper selection:bg-gold selection:text-dark">
      <CustomCursor />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        <div className="relative">
          {/* Section dividers */}
          <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-dark to-transparent z-10 pointer-events-none" />
          <About />
          <MenuSection />
        </div>
        
        <Gallery />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
