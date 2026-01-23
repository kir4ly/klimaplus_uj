"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  CheckCircle,
  Wrench,
  Wind,
  Sparkles,
  Settings,
  Users,
  Award,
  ThumbsUp,
  FileCheck,
  PhoneCall,
  ClipboardCheck,
  Hammer,
  Headphones,
  ChevronRight,
  Menu,
  X,
  Snowflake,
  Sun,
  Zap,
} from "lucide-react";

const phoneNumber = "+36 70 256 6448";
const phoneLink = "tel:+36702566448";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#szolgaltatasok", label: "Szolgáltatások" },
    { href: "#rolunk", label: "Rólunk" },
    { href: "#folyamat", label: "Folyamat" },
    { href: "#kapcsolat", label: "Kapcsolat" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass shadow-lg shadow-blue-500/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Klima Plus"
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-600 hover:text-[#4A90D9] font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A90D9] transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={phoneLink}
              className="group flex items-center gap-2 bg-[#4A90D9] hover:bg-[#3A7BC8] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300"
            >
              <Phone className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span className="hidden sm:inline">{phoneNumber}</span>
              <span className="sm:hidden">Hívás</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pb-6"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-[#4A90D9] font-medium py-2 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={phoneLink}
                className="flex items-center justify-center gap-2 bg-[#4A90D9] hover:bg-[#3A7BC8] text-white px-5 py-2.5 rounded-xl font-semibold mt-2 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                {phoneNumber}
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
        >
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full"
        >
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100/30 to-transparent rounded-full blur-3xl" />
        </motion.div>
      </div>

      {/* Floating Icons */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[15%] text-[#4A90D9]"
        >
          <Snowflake className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-48 right-[20%] text-[#4A90D9]/70"
        >
          <Snowflake className="w-20 h-20" />
        </motion.div>
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[10%] text-[#4A90D9]/60"
        >
          <Snowflake className="w-12 h-12" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#4A90D9] px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <MapPin className="w-4 h-4" />
            Celldömölk és környéke
          </motion.div>

          {/* Main Logo Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6"
          >
            <img
              src="/hero-logo-cropped.png"
              alt="Klima Plus - Klíma technika"
              className="w-full max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl text-slate-800 font-bold mb-4 max-w-3xl mx-auto"
          >
            Professzionális klímamegoldások
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-xl sm:text-2xl text-slate-500 font-medium mb-2 max-w-3xl mx-auto"
          >
            Légkondicionáló szerelés és karbantartás
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto"
          >
            Teljeskörű klímaszolgáltatás Vas, Veszprém, Győr-Moson-Sopron és Zala megyében.
            <br />
            <span className="text-[#4A90D9] font-semibold">
              Rejtett költségek nélkül, rövid határidővel!
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href={phoneLink}
              className="group flex items-center gap-3 bg-[#4A90D9] hover:bg-[#3A7BC8] text-white px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            >
              <Phone className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Hívjon Most!
            </a>
            <a
              href="#szolgaltatasok"
              className="group flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl text-base font-semibold border border-slate-200 transition-all duration-300"
            >
              Szolgáltatások
            </a>
          </motion.div>

        </div>
      </div>

    </section>
  );
}

function Gallery() {
  const images = [
    "/gallery/FB_IMG_1769003372137.jpg",
    "/gallery/FB_IMG_1769003384335.jpg",
    "/gallery/FB_IMG_1769003406743.jpg",
    "/gallery/FB_IMG_1769003436565.jpg",
    "/gallery/FB_IMG_1769003446276.jpg",
    "/gallery/FB_IMG_1769003490309.jpg",
    "/gallery/FB_IMG_1769003511687.jpg",
    "/gallery/FB_IMG_1769003527053.jpg",
    "/gallery/FB_IMG_1769003563158.jpg",
    "/gallery/FB_IMG_1769003607194.jpg",
    "/gallery/FB_IMG_1769003769244.jpg",
    "/gallery/FB_IMG_1769003782114.jpg",
    "/gallery/IMG_20250618_191244.jpg",
    "/gallery/IMG_20250726_172854.jpg",
    "/gallery/IMG_20250731_093135.jpg",
    "/gallery/IMG_20251003_125313.jpg",
  ];

  // Duplicate for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <section className="pb-16 bg-slate-50 overflow-hidden">

      {/* Scrolling gallery */}
      <div className="relative">
        <div className="flex gap-5 animate-scroll hover:[animation-play-state:paused]">
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 h-56 md:w-96 md:h-72 rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={src}
                alt={`Klíma szerelés ${(index % images.length) + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* Hint text */}
        <p className="text-center text-slate-400 text-sm mt-8 uppercase tracking-wider">
          Vigye rá az egeret a megállításhoz
        </p>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Shield,
      title: "10 év garancia",
      description: "Készülékekre",
    },
    {
      icon: CheckCircle,
      title: "Rejtett költségek nélkül",
      description: "Átlátható árazás",
    },
    {
      icon: Clock,
      title: "Rövid határidő",
      description: "Gyors kivitelezés",
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="flex items-center justify-center gap-4 group">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-[#4A90D9]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-slate-500">{feature.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: Wrench,
      title: "Telepítés",
      description:
        "Klímaberendezések szakszerű beszerelése otthonába vagy irodájába, teljes körű ügyintézéssel.",
      features: ["Helyszíni felmérés", "Szakszerű kivitelezés", "Garancia"],
    },
    {
      icon: Settings,
      title: "Karbantartás",
      description:
        "Rendszeres karbantartás a klíma élettartamának növelése és hatékony működése érdekében.",
      features: ["Szűrőcsere", "Hűtőközegellenőrzés", "Teljesítmény optimalizálás"],
    },
    {
      icon: Sparkles,
      title: "Tisztítás",
      description:
        "Professzionális klímatisztítás az egészséges levegő és optimális működés biztosítására.",
      features: ["Beltéri egység", "Kültéri egység", "Fertőtlenítés"],
    },
    {
      icon: Wind,
      title: "Javítás",
      description: "Gyors és megbízható hibaelhárítás minden típusú klímaberendezéshez.",
      features: ["Gyors kiszállás", "Minden márka", "Alkatrészgarancia"],
    },
  ];

  return (
    <section id="szolgaltatasok" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.4) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-[#4A90D9] font-semibold text-sm uppercase tracking-wider mb-4">
            Szolgáltatásaink
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
            Teljes körű <span className="gradient-text">klímaszolgáltatás</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            A felméréstől a karbantartásig mindent egy kézből
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 card-hover h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A90D9] to-[#3b82f6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-500 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-[#4A90D9]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const reasons = [
    { icon: Users, title: "Tapasztalt csapat", desc: "Maximális odafigyelés" },
    { icon: Shield, title: "10 év garancia", desc: "Készülékekre" },
    { icon: CheckCircle, title: "Átlátható árazás", desc: "Nincs rejtett költség" },
    { icon: Clock, title: "Rövid határidő", desc: "Gyors kivitelezés" },
    { icon: FileCheck, title: "Teljes ügyintézés", desc: "Mindent mi intézünk" },
    { icon: Award, title: "Megbízhatóság", desc: "100% elégedettség" },
  ];

  return (
    <section id="rolunk" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <span className="inline-block text-[#4A90D9] font-semibold text-sm uppercase tracking-wider mb-4">
              Miért minket?
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
              Klíma Plus Cell Kft.
            </h2>
            <p className="text-xl text-slate-500 mb-8 leading-relaxed">
              Elkötelezettek vagyunk a minőségi munkavégzés és az ügyfél-elégedettség iránt.
              Tapasztalt csapatunk minden projektnél a legmagasabb színvonalat képviseli.
            </p>

            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#4A90D9] to-[#3b82f6] rounded-2xl text-white">
              <ThumbsUp className="w-12 h-12" />
              <div>
                <p className="text-3xl font-black">100%</p>
                <p className="text-blue-100">Elégedett ügyfél</p>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-4">
            {reasons.map((reason, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="group p-6 rounded-2xl bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300">
                  <reason.icon className="w-10 h-10 text-[#4A90D9] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-slate-800 mb-1">{reason.title}</h3>
                  <p className="text-sm text-slate-500">{reason.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceArea() {
  const areas = ["Vas megye", "Veszprém megye", "Győr-Moson-Sopron megye", "Zala megye"];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
            Szolgáltatási körzet
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Széles körzetben <span className="text-blue-400">vállaljuk</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {areas.map((area, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 text-center">
                <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-semibold">{area}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <p className="text-slate-400 mb-8">
            Székhely: <span className="text-white font-semibold">Celldömölk</span> – innen
            indulunk minden helyszínre
          </p>
          <a
            href={phoneLink}
            className="inline-flex items-center gap-2 bg-[#4A90D9] hover:bg-[#3A7BC8] text-white px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            Kérjen ingyenes felmérést!
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
  totalSteps,
  scrollYProgress,
}: {
  step: { icon: React.ComponentType<{ className?: string }>; title: string; description: string };
  index: number;
  totalSteps: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // First step is always active, others activate when line reaches them
  const stepProgress = useTransform(
    scrollYProgress,
    [Math.max(0, (index - 0.5) / totalSteps), index / totalSteps],
    index === 0 ? [1.15, 1.15] : [1, 1.15]
  );
  const stepOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, (index - 0.5) / totalSteps), index / totalSteps],
    index === 0 ? [1, 1] : [0.5, 1]
  );

  return (
    <AnimatedSection delay={index * 0.15}>
      <div className="relative flex items-start gap-6 group">
        {/* Step Number */}
        <motion.div
          className="w-20 h-20 flex-shrink-0 rounded-full bg-gradient-to-br from-[#4A90D9] to-[#3b82f6] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/30 relative z-10"
          style={{ scale: stepProgress, opacity: stepOpacity }}
        >
          {index + 1}
        </motion.div>

        {/* Content */}
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <step.icon className="w-6 h-6 text-[#4A90D9]" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
          </div>
          <p className="text-slate-500 ml-16">{step.description}</p>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const steps = [
    {
      icon: PhoneCall,
      title: "Kapcsolatfelvétel",
      description: "Hívjon fel vagy írjon nekünk, és egyeztetjük az időpontot.",
    },
    {
      icon: ClipboardCheck,
      title: "Helyszíni felmérés",
      description: "Ingyenesen felmérjük a helyszínt és elkészítjük az ajánlatot.",
    },
    {
      icon: Hammer,
      title: "Kivitelezés",
      description: "Szakszerű beszerelés, tisztán és precízen, rövid idő alatt.",
    },
    {
      icon: Headphones,
      title: "Garancia & támogatás",
      description: "10 év garancia és folyamatos ügyfélszolgálati támogatás.",
    },
  ];

  return (
    <section id="folyamat" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block text-[#4A90D9] font-semibold text-sm uppercase tracking-wider mb-4">
            Folyamat
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
            Hogyan <span className="gradient-text">dolgozunk?</span>
          </h2>
        </AnimatedSection>

        <div ref={containerRef} className="relative max-w-2xl mx-auto">
          {/* Background line (gray) */}
          <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-blue-100" />

          {/* Animated progress line (blue) */}
          <motion.div
            className="absolute left-10 top-10 w-0.5 bg-[#4A90D9] origin-top"
            style={{ scaleY: scrollYProgress, height: "calc(100% - 80px)" }}
          />

          <div className="flex flex-col gap-20">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                step={step}
                index={index}
                totalSteps={steps.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="kapcsolat"
      className="py-24 bg-gradient-to-br from-[#4A90D9] via-[#2563eb] to-[#0ea5e9] text-white relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-10"
        >
          <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-white/20 rounded-full" />
        </motion.div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Vegye fel velünk a kapcsolatot!
          </h2>
          <p className="text-xl text-blue-100 mb-12">Kérjen ingyenes árajánlatot még ma!</p>

          <a
            href={phoneLink}
            className="inline-flex items-center gap-4 text-4xl md:text-5xl font-black hover:scale-105 transition-transform duration-300 mb-8"
          >
            <div className="p-4 bg-white/20 rounded-full animate-pulse-glow">
              <Phone className="w-10 h-10" />
            </div>
            {phoneNumber}
          </a>

          <div className="flex items-center justify-center gap-2 text-lg text-blue-100 mb-12">
            <MapPin className="w-6 h-6" />
            Celldömölk
          </div>

          <a
            href={phoneLink}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 px-6 py-3 rounded-xl text-base font-semibold border-2 border-white/50 transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            Hívjon most ingyenes konzultációért!
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img src="/logo.png" alt="Klima Plus" className="h-8 w-auto" />
          </div>

          <div className="text-center md:text-left">
            <p className="font-semibold text-lg">Klíma Plus Cell Kft.</p>
            <p className="text-slate-400">Celldömölk</p>
          </div>

          <a
            href={phoneLink}
            className="flex items-center gap-2 text-[#3b82f6] hover:text-blue-400 transition-colors font-semibold"
          >
            <Phone className="w-5 h-5" />
            {phoneNumber}
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Klíma Plus Cell Kft. Minden jog fenntartva.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Gallery />
      <Features />
      <Services />
      <WhyUs />
      <ServiceArea />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
