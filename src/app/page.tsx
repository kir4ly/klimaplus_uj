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
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-600 hover:text-[#2563eb] font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2563eb] transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={phoneLink}
              className="group flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-500 px-5 py-2.5 rounded-xl font-semibold border-2 border-red-500 shadow-md transition-all duration-300"
            >
              <Phone className="w-4 h-4 fill-red-500 transition-transform group-hover:rotate-12" />
              {phoneNumber}
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
                  className="text-slate-700 hover:text-[#5DA9E9] font-medium py-2 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={phoneLink}
                className="flex items-center justify-center gap-2 bg-[#5DA9E9] hover:bg-[#4A96D6] text-white px-5 py-2.5 rounded-xl font-semibold mt-2 transition-all duration-300"
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

      {/* Static Snowflakes - randomly scattered on sides */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(70)].map((_, i) => {
          // Pseudo-random positioning using prime numbers for variation
          const seed1 = (i * 31 + 7) % 100;
          const seed2 = (i * 47 + 13) % 100;
          const seed3 = (i * 23 + 5) % 100;

          // Left side (0-30%) or right side (70-100%)
          const isLeft = i < 35;
          const horizontalPos = isLeft
            ? 2 + (seed1 * 0.28)
            : 70 + (seed1 * 0.28);

          const topPosition = 3 + (seed2 * 0.9);
          const size = 8 + (seed3 % 5) * 4;
          const opacity = 0.25 + (seed3 % 4) * 0.12;
          const rotation = (seed1 * 3.6);

          return (
            <div
              key={i}
              className="absolute text-[#5DA9E9]"
              style={{
                left: `${horizontalPos}%`,
                top: `${topPosition}%`,
                opacity: opacity,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <Snowflake style={{ width: `${size}px`, height: `${size}px` }} />
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-full text-sm font-semibold mb-8 border-2 border-slate-200 shadow-md"
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
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <a
              href={phoneLink}
              className="group flex items-center justify-center gap-3 bg-white hover:bg-red-50 text-red-500 px-10 py-4 rounded-2xl text-xl font-bold border-2 border-red-500 shadow-lg transition-all duration-300"
            >
              <Phone className="w-6 h-6 fill-red-500 transition-transform group-hover:rotate-12" />
              Hívjon Most!
            </a>
          </motion.div>

        </div>
      </div>

    </section>
  );
}

function Gallery() {
  const images = [
    "/gallery/2023-07-04 (2).webp",
    "/gallery/2023-07-04 (3).webp",
    "/gallery/2023-07-04 (4).webp",
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
              <div className="flex items-center justify-center gap-4 group bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md hover:border-[#5DA9E9] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5DA9E9] to-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
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
          <span className="inline-block text-[#5DA9E9] font-semibold text-sm uppercase tracking-wider mb-4">
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
              <div className="group bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-md hover:border-[#5DA9E9] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 card-hover h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5DA9E9] to-[#3b82f6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-slate-500 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-[#5DA9E9]" />
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
            <span className="inline-block text-[#5DA9E9] font-semibold text-sm uppercase tracking-wider mb-4">
              Miért minket?
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
              Klíma Plus Cell Kft.
            </h2>
            <p className="text-xl text-slate-500 mb-8 leading-relaxed">
              Elkötelezettek vagyunk a minőségi munkavégzés és az ügyfél-elégedettség iránt.
              Tapasztalt csapatunk minden projektnél a legmagasabb színvonalat képviseli.
            </p>

            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#5DA9E9] to-[#3b82f6] rounded-2xl text-white">
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
                <div className="group p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-md hover:border-[#5DA9E9] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5DA9E9] to-[#3b82f6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <reason.icon className="w-6 h-6 text-white" />
                  </div>
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
  const areas = ["Vas vármegye", "Veszprém vármegye", "Győr-Moson-Sopron vármegye", "Zala vármegye"];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-[#5DA9E9]" />
            <span className="text-[#5DA9E9] font-semibold text-sm uppercase tracking-wider">
              Szolgáltatási terület
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">
            NYUGAT-<span className="gradient-text">DUNÁNTÚL</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl">
            Szolgáltatásainkat az alábbi megyékben vállaljuk. Gyors kiszállás, megbízható munka.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {areas.map((area, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg hover:border-[#5DA9E9] hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#5DA9E9] flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">{area}</h3>
              </div>
            ))}
          </div>
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
          className="w-20 h-20 flex-shrink-0 rounded-full bg-gradient-to-br from-[#5DA9E9] to-[#3b82f6] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/30 relative z-10"
          style={{ scale: stepProgress, opacity: stepOpacity }}
        >
          {index + 1}
        </motion.div>

        {/* Content */}
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-800 flex items-center justify-center">
              <step.icon className="w-6 h-6 text-slate-800" />
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
          <span className="inline-block text-[#5DA9E9] font-semibold text-sm uppercase tracking-wider mb-4">
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
            className="absolute left-10 top-10 w-0.5 bg-[#5DA9E9] origin-top"
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
      className="py-24 bg-gradient-to-br from-[#5DA9E9] via-[#2563eb] to-[#0ea5e9] text-white relative overflow-hidden"
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
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Wave SVG separator */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%]">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#0f172a"/>
        </svg>
      </div>

      {/* Decorative snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        {[...Array(20)].map((_, i) => {
          const seed1 = (i * 37 + 11) % 100;
          const seed2 = (i * 53 + 17) % 100;
          const size = 40 + (seed1 % 8) * 20;
          return (
            <Snowflake
              key={i}
              className="absolute text-white"
              style={{
                left: `${seed1}%`,
                top: `${seed2}%`,
                width: size,
                height: size,
              }}
            />
          );
        })}
      </div>

      <div className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Brand section */}
            <div className="lg:col-span-5">
                            {/* Contact cards */}
              <div className="flex gap-4 mb-8">
                <a
                  href={phoneLink}
                  className="group flex items-center gap-4 bg-slate-800/50 hover:bg-[#5DA9E9] px-5 py-4 rounded-2xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#5DA9E9] group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone className="w-5 h-5 text-white group-hover:text-[#5DA9E9] transition-colors" />
                  </div>
                  <div>
                    <p className="text-slate-500 group-hover:text-blue-100 text-sm transition-colors">Hívjon most</p>
                    <p className="text-white font-bold">{phoneNumber}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-slate-800/50 px-5 py-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-[#5DA9E9] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">Székhely</p>
                    <p className="text-white font-bold">Celldömölk</p>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Professzionális klímaszolgáltatás Nyugat-Dunántúlon. Telepítés, karbantartás, javítás - minden egy kézből.
              </p>
            </div>

            {/* Quick links */}
            <div className="lg:col-span-3 lg:col-start-7">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[#5DA9E9]" />
                Navigáció
              </h3>
              <nav className="flex flex-col gap-3">
                {[
                  { href: "#szolgaltatasok", label: "Szolgáltatások" },
                  { href: "#rolunk", label: "Rólunk" },
                  { href: "#folyamat", label: "Folyamat" },
                  { href: "#kapcsolat", label: "Kapcsolat" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-slate-400 hover:text-[#5DA9E9] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[#5DA9E9]" />
                Szolgáltatások
              </h3>
              <nav className="flex flex-col gap-3">
                {["Klíma telepítés", "Karbantartás", "Tisztítás", "Javítás"].map((service) => (
                  <span key={service} className="text-slate-400 flex items-center gap-2">
                    <Snowflake className="w-3 h-3 text-[#5DA9E9]" />
                    {service}
                  </span>
                ))}
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Klíma Plus Cell Kft. Minden jog fenntartva.
              </p>

            </div>
          </div>
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
