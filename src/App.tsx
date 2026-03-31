import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Award
} from 'lucide-react';

// --- Components ---

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
    { name: 'Chi Siamo', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Contatti', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-3xl font-serif tracking-tighter text-gold font-bold">MARIZZO</a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm uppercase tracking-widest hover:text-gold transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" className="btn-primary py-2 px-6 text-xs">Prenota</a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gold" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-dark border-b border-white/10 md:hidden flex flex-col p-6 space-y-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg serif tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
          alt="Restaurant Interior" 
          className="w-full h-full object-cover opacity-40 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block"
        >
          Dal 2006 a Milano Centrale
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl serif mb-8 leading-tight"
        >
          L'Essenza della <br /> <span className="italic text-gold">Cucina Italiana</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-paper/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Scopri il sapore autentico della tradizione milanese e la vera pizza napoletana, 
          creata con passione da Mario e il suo team.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#menu" className="btn-primary">Esplora il Menu</a>
          <a href="#contact" className="btn-outline">Prenota un Tavolo</a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"></div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-paper text-dark">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-sm">
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
              alt="Chef Mario" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 bg-gold p-8 hidden lg:block">
            <p className="serif text-4xl text-dark leading-none">20+</p>
            <p className="text-xs uppercase tracking-widest mt-2">Anni di Esperienza</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-gold uppercase tracking-widest text-sm mb-4">La Nostra Storia</h2>
          <h3 className="text-5xl serif mb-8 leading-tight">La Passione di Mario <br />per l'Eccellenza</h3>
          <div className="space-y-6 text-lg text-dark/70 font-light leading-relaxed">
            <p>
              Marizzo non è solo un ristorante, è il sogno di Mario che prende vita nel cuore di Milano. 
              Con oltre 20 anni di esperienza nelle cucine più prestigiose d'Italia, Mario ha deciso di 
              portare la sua visione di "semplicità raffinata" a Milano Centrale.
            </p>
            <p>
              Ogni ingrediente è selezionato personalmente: dalla farina macinata a pietra per le nostre 
              pizze, ai pomodori San Marzano DOP, fino al pesce freschissimo che arriva ogni mattina. 
              La nostra missione è farvi sentire a casa, offrendovi un'esperienza gastronomica indimenticabile.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="flex items-start gap-4">
              <Award className="text-gold w-8 h-8 shrink-0" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider">Qualità Certificata</h4>
                <p className="text-xs text-dark/60 mt-1">Solo ingredienti DOP e locali.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Utensils className="text-gold w-8 h-8 shrink-0" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider">Cucina Aperta</h4>
                <p className="text-xs text-dark/60 mt-1">Guarda i nostri chef all'opera.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuSection = () => {
  const menuItems = [
    { name: "Margherita Reale", desc: "Pomodoro San Marzano, Mozzarella di Bufala, Basilico fresco, Olio EVO", price: "14€", category: "Pizza" },
    { name: "Tartufo & Porcini", desc: "Crema di tartufo bianco, funghi porcini freschi, fior di latte", price: "18€", category: "Pizza" },
    { name: "Risotto alla Milanese", desc: "Riso Carnaroli, Zafferano in pistilli, midollo e riduzione di vitello", price: "22€", category: "Cucina" },
    { name: "Tagliata di Manzo", desc: "Controfiletto di manzo, rucola selvatica, scaglie di Grana 36 mesi", price: "26€", category: "Cucina" },
    { name: "Diavola Gourmet", desc: "Pomodoro, fior di latte, salame piccante calabrese, nduja di Spilinga", price: "16€", category: "Pizza" },
    { name: "Tiramisù Marizzo", desc: "La ricetta segreta di Mario con mascarpone artigianale", price: "9€", category: "Dolci" },
  ];

  return (
    <section id="menu" className="py-24 px-6 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-gold uppercase tracking-widest text-sm mb-4">Il Gusto dell'Italia</h2>
          <h3 className="text-5xl serif mb-6">Le Nostre Specialità</h3>
          <div className="w-24 h-[1px] bg-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {menuItems.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-between items-start border-b border-white/10 pb-6 group cursor-pointer"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gold/50 uppercase tracking-tighter">{item.category}</span>
                  <h4 className="text-xl serif group-hover:text-gold transition-colors">{item.name}</h4>
                </div>
                <p className="text-sm text-paper/50 font-light italic">{item.desc}</p>
              </div>
              <span className="serif text-xl text-gold">{item.price}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-paper/60 mb-8 italic">Il nostro menu cambia stagionalmente per garantire la freschezza degli ingredienti.</p>
          <button className="btn-outline">Scarica il Menu Completo (PDF)</button>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2132&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 h-[400px] md:h-[600px]">
      {images.map((img, i) => (
        <div key={i} className="relative overflow-hidden group">
          <img 
            src={img} 
            alt={`Gallery ${i}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <Instagram className="text-white w-8 h-8" />
          </div>
        </div>
      ))}
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-paper text-dark">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-gold uppercase tracking-widest text-sm mb-4">Contatti & Prenotazioni</h2>
          <h3 className="text-5xl serif mb-8">Vieni a Trovarci</h3>
          
          <div className="space-y-8 mt-12">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-full">
                <MapPin className="text-gold" />
              </div>
              <div>
                <p className="font-bold uppercase text-xs tracking-widest">Indirizzo</p>
                <p className="text-lg serif">Via Vitruvio, 43, 20124 Milano MI (Centrale)</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-full">
                <Phone className="text-gold" />
              </div>
              <div>
                <p className="font-bold uppercase text-xs tracking-widest">Telefono</p>
                <p className="text-lg serif">+39 123 456 789</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-full">
                <Mail className="text-gold" />
              </div>
              <div>
                <p className="font-bold uppercase text-xs tracking-widest">Email</p>
                <p className="text-lg serif">mario@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-full">
                <Clock className="text-gold" />
              </div>
              <div>
                <p className="font-bold uppercase text-xs tracking-widest">Orari</p>
                <p className="text-lg serif">Lun - Dom: 12:00 - 15:00 | 19:00 - 23:30</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
            <a href="#" className="w-10 h-10 border border-dark/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 border border-dark/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className="bg-white p-10 shadow-2xl shadow-dark/5">
          <h4 className="serif text-3xl mb-8">Prenota il tuo tavolo</h4>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Nome</label>
                <input type="text" className="w-full border-b border-dark/20 py-2 focus:border-gold outline-none transition-colors" placeholder="Il tuo nome" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Email</label>
                <input type="email" className="w-full border-b border-dark/20 py-2 focus:border-gold outline-none transition-colors" placeholder="email@esempio.it" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Data</label>
                <input type="date" className="w-full border-b border-dark/20 py-2 focus:border-gold outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Persone</label>
                <select className="w-full border-b border-dark/20 py-2 focus:border-gold outline-none transition-colors bg-transparent">
                  <option>2 Persone</option>
                  <option>3 Persone</option>
                  <option>4 Persone</option>
                  <option>5+ Persone</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold">Messaggio / Note</label>
              <textarea className="w-full border-b border-dark/20 py-2 focus:border-gold outline-none transition-colors h-24 resize-none" placeholder="Allergie, occasioni speciali..."></textarea>
            </div>
            <button className="btn-primary w-full mt-4">Invia Richiesta</button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-dark border-t border-white/5 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl serif text-gold mb-6">MARIZZO</h2>
        <p className="text-paper/40 text-sm mb-8">© 2026 Marizzo Ristorante Pizzeria. Tutti i diritti riservati. <br /> Creato con passione per la cucina italiana.</p>
        <div className="flex justify-center space-x-6 text-xs uppercase tracking-widest text-paper/60">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Termini & Condizioni</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-dark text-paper selection:bg-gold selection:text-dark">
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}
