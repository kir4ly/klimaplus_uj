"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Phone, ArrowDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const phoneNumber = "+36 70 256 6448";
const phoneLink = "tel:+36702566448";

// Animated CTA Button Component
function CTAButton({ children, href, className = "" }: { children: React.ReactNode; href: string; className?: string }) {
  return (
    <a href={href} className={`cta-button ${className}`}>
      {children}
    </a>
  );
}

// Scroll-triggered animation wrapper
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// HEADER
// ============================================
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#szolgaltatasok", label: "SZOLGÁLTATÁSOK" },
    { href: "#rolunk", label: "RÓLUNK" },
    { href: "#kapcsolat", label: "KAPCSOLAT" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-[#0a0a0a]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="-ml-2">
            <img
              src="/logo-white.svg"
              alt="Klíma Plus"
              className="h-4 w-auto"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white/70 hover:text-white text-sm tracking-widest hover-underline transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <CTAButton href={phoneLink}>
              {phoneNumber}
            </CTAButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden pb-8"
          >
            <nav className="flex flex-col gap-6 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white text-sm tracking-widest"
                >
                  {item.label}
                </a>
              ))}
              <CTAButton href={phoneLink}>
                {phoneNumber}
              </CTAButton>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

// ============================================
// SNOWFLAKES
// ============================================
function Snowflakes() {
  // Hópelyhek csak a széleken, header alatti területen (top 20%+)
  const snowflakes = [
    // Bal oldal (top 20%-tól kezdve)
    { left: 2, top: 25, size: 18, opacity: 0.4 },
    { left: 6, top: 32, size: 12, opacity: 0.25 },
    { left: 3, top: 42, size: 22, opacity: 0.5 },
    { left: 10, top: 38, size: 8, opacity: 0.2 },
    { left: 8, top: 50, size: 16, opacity: 0.35 },
    { left: 1, top: 58, size: 14, opacity: 0.3 },
    { left: 14, top: 45, size: 10, opacity: 0.2 },
    { left: 5, top: 65, size: 20, opacity: 0.45 },
    { left: 12, top: 55, size: 12, opacity: 0.25 },
    { left: 18, top: 35, size: 14, opacity: 0.3 },
    { left: 4, top: 72, size: 16, opacity: 0.35 },
    { left: 9, top: 78, size: 10, opacity: 0.2 },
    { left: 2, top: 85, size: 24, opacity: 0.5 },
    { left: 15, top: 68, size: 12, opacity: 0.25 },
    { left: 7, top: 92, size: 18, opacity: 0.4 },
    { left: 20, top: 48, size: 8, opacity: 0.15 },
    { left: 11, top: 95, size: 14, opacity: 0.3 },
    { left: 3, top: 98, size: 16, opacity: 0.35 },
    { left: 17, top: 82, size: 10, opacity: 0.2 },
    { left: 22, top: 28, size: 12, opacity: 0.25 },
    { left: 19, top: 62, size: 14, opacity: 0.3 },
    { left: 24, top: 40, size: 10, opacity: 0.2 },
    { left: 13, top: 88, size: 16, opacity: 0.35 },
    { left: 21, top: 75, size: 12, opacity: 0.25 },
    // Jobb oldal (top 20%-tól kezdve)
    { left: 76, top: 28, size: 18, opacity: 0.4 },
    { left: 82, top: 35, size: 12, opacity: 0.25 },
    { left: 78, top: 45, size: 22, opacity: 0.5 },
    { left: 88, top: 32, size: 8, opacity: 0.2 },
    { left: 84, top: 52, size: 16, opacity: 0.35 },
    { left: 92, top: 25, size: 14, opacity: 0.3 },
    { left: 79, top: 58, size: 10, opacity: 0.2 },
    { left: 96, top: 38, size: 20, opacity: 0.45 },
    { left: 86, top: 48, size: 12, opacity: 0.25 },
    { left: 90, top: 42, size: 14, opacity: 0.3 },
    { left: 77, top: 68, size: 16, opacity: 0.35 },
    { left: 94, top: 55, size: 10, opacity: 0.2 },
    { left: 83, top: 62, size: 24, opacity: 0.5 },
    { left: 98, top: 65, size: 12, opacity: 0.25 },
    { left: 80, top: 78, size: 18, opacity: 0.4 },
    { left: 91, top: 72, size: 8, opacity: 0.15 },
    { left: 87, top: 85, size: 14, opacity: 0.3 },
    { left: 95, top: 75, size: 16, opacity: 0.35 },
    { left: 78, top: 92, size: 10, opacity: 0.2 },
    { left: 85, top: 95, size: 20, opacity: 0.45 },
    { left: 93, top: 88, size: 12, opacity: 0.25 },
    { left: 97, top: 98, size: 14, opacity: 0.3 },
    { left: 81, top: 82, size: 10, opacity: 0.2 },
    { left: 89, top: 30, size: 16, opacity: 0.35 },
    { left: 76, top: 50, size: 12, opacity: 0.25 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block">
      {snowflakes.map((flake, i) => (
        <div
          key={i}
          className="absolute text-white"
          style={{
            left: `${flake.left}%`,
            top: `${flake.top}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

// ============================================
// HERO
// ============================================
function Hero() {
  return (
    <section className="section-black pt-28 md:pt-40 pb-8 relative overflow-hidden noise">
      <Snowflakes />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Main Title - Logo */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <img
              src="/logo-white.svg"
              alt="Klíma Plus"
              className="w-full max-w-[280px] md:max-w-[500px] lg:max-w-[700px] mx-auto h-auto"
            />
            <p className="text-base md:text-xl lg:text-2xl text-white/60 tracking-[0.2em] md:tracking-[0.4em] uppercase mt-4 md:mt-6 font-light">
              Klímatechnika
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 mt-8"
          >
            <p className="text-white/70 text-base md:text-lg lg:text-xl mb-2 md:mb-3 px-4 md:px-0">
              Légkondicionáló szerelés és karbantartás
            </p>
            <p className="text-white/40 text-xs md:text-sm lg:text-base px-4 md:px-0">
              Teljeskörű klímaszolgáltatás Vas, Veszprém, Győr-Moson-Sopron és Zala megyében.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <CTAButton href={phoneLink}>
              HÍVJON MOST
            </CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// GALLERY
// ============================================
function Gallery() {
  const images = [
    "/gallery/2023-07-04 (4).webp",
    "/gallery/FB_IMG_1769003372137.webp",
    "/gallery/FB_IMG_1769003384335.webp",
    "/gallery/FB_IMG_1769003406743.webp",
    "/gallery/FB_IMG_1769003436565.webp",
    "/gallery/FB_IMG_1769003446276.webp",
    "/gallery/FB_IMG_1769003490309.webp",
    "/gallery/FB_IMG_1769003511687.webp",
    "/gallery/FB_IMG_1769003527053.webp",
    "/gallery/FB_IMG_1769003563158.webp",
    "/gallery/FB_IMG_1769003607194.webp",
    "/gallery/FB_IMG_1769003769244.webp",
    "/gallery/FB_IMG_1769003782114.webp",
    "/gallery/IMG_20250618_191244.webp",
    "/gallery/IMG_20250726_172854.webp",
    "/gallery/IMG_20250731_093135.webp",
    "/gallery/IMG_20251003_125313.webp",
  ];

  const duplicatedImages = [...images, ...images];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="section-black pt-8 pb-16 overflow-hidden">
      <div
        ref={containerRef}
        className={`flex gap-4 overflow-x-auto scrollbar-hide cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${!isDragging ? 'animate-scroll' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-60 h-44 md:w-72 md:h-52 lg:w-96 lg:h-64 overflow-hidden rounded-lg relative select-none"
          >
            <Image
              src={src}
              alt={`Munkáink ${(index % images.length) + 1}`}
              fill
              sizes="(max-width: 768px) 240px, (max-width: 1024px) 288px, 384px"
              className="object-cover pointer-events-none"
              loading="lazy"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// SERVICES
// ============================================
function Services() {
  const services = [
    {
      number: "01",
      title: "TELEPÍTÉS",
      desc: "Klímaberendezések szakszerű beszerelése otthonába vagy irodájába, teljes körű ügyintézéssel. Helyszíni felmérés, szakszerű kivitelezés, garancia.",
    },
    {
      number: "02",
      title: "KARBANTARTÁS",
      desc: "Rendszeres karbantartás a klíma élettartamának növelése és hatékony működése érdekében. Szűrőcsere, hűtőközegellenőrzés, teljesítmény optimalizálás.",
    },
    {
      number: "03",
      title: "TISZTÍTÁS",
      desc: "Professzionális klímatisztítás az egészséges levegő és optimális működés biztosítására. Beltéri egység, kültéri egység, fertőtlenítés.",
    },
    {
      number: "04",
      title: "JAVÍTÁS",
      desc: "Gyors és megbízható hibaelhárítás minden típusú klímaberendezéshez. Gyors kiszállás, minden márka, alkatrészgarancia.",
    },
  ];

  return (
    <section id="szolgaltatasok" className="section-white py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-display text-[clamp(2rem,6vw,4rem)] mb-12">
            SZOLGÁLTATÁSOK
          </h2>
        </Reveal>

        <div className="space-y-0">
          {services.map((service, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="group border-t border-neutral-200 py-6 md:py-8 flex items-center gap-6 md:gap-12 cursor-default hover:bg-neutral-100 transition-colors px-4 -mx-4">
                <span className="text-display text-3xl md:text-5xl text-neutral-300 group-hover:text-neutral-900 transition-colors">
                  {service.number}
                </span>
                <div className="flex-1">
                  <h3 className="text-display text-xl md:text-2xl mb-1 group-hover:translate-x-4 transition-transform">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 text-sm">{service.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-neutral-200" />
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAINTENANCE GALLERY
// ============================================
function MaintenanceGallery() {
  const images = [
    "/gallery/FB_IMG_1769003511687.webp",
    "/gallery/FB_IMG_1769003607194.webp",
    "/gallery/FB_IMG_1769003782114.webp",
    "/gallery/FB_IMG_1769336721705.webp",
    "/gallery/FB_IMG_1769336751344.webp",
    "/gallery/FB_IMG_1769336957384.webp",
    "/gallery/IMG_20251211_094143.webp",
  ];

  return (
    <section id="rolunk" className="section-black py-20 relative noise">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <h2 className="text-display text-[clamp(2rem,6vw,4rem)] text-white mb-4">
            KARBANTARTÁS
          </h2>
          <p className="text-white/50 text-base mb-12 max-w-2xl">
            Professzionális klíma karbantartás és tisztítás. Rendszeres karbantartással meghosszabbíthatja klímája élettartamát és biztosíthatja a hatékony működést.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="aspect-square overflow-hidden rounded-lg relative">
                <Image
                  src={src}
                  alt={`Karbantartás ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SERVICE AREA
// ============================================
function ServiceArea() {
  const areas = ["VAS VÁRMEGYE", "VESZPRÉM VÁRMEGYE", "GYŐR-MOSON-SOPRON VÁRMEGYE", "ZALA VÁRMEGYE"];

  return (
    <section className="section-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-display text-[clamp(2rem,6vw,4rem)] mb-2">
            NYUGAT-DUNÁNTÚL
          </h2>
          <p className="text-neutral-500 text-base mb-8">
            Szolgáltatási területünk
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6">
            {areas.map((area, index) => (
              <span
                key={index}
                className="text-display text-base md:text-lg lg:text-2xl text-neutral-400 hover:text-neutral-900 transition-colors cursor-default"
              >
                {area}
                {index < areas.length - 1 && (
                  <span className="hidden md:inline text-neutral-300 mx-3 md:mx-6">/</span>
                )}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// PROCESS
// ============================================
function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const steps = [
    { number: "01", title: "KAPCSOLATFELVÉTEL", desc: "Hívjon fel és egyeztessünk" },
    { number: "02", title: "FELMÉRÉS", desc: "Ingyenes helyszíni felmérés" },
    { number: "03", title: "KIVITELEZÉS", desc: "Szakszerű telepítés, tisztítás vagy javítás." },
    { number: "04", title: "GARANCIA", desc: "A garancia a készüléktől függ." },
  ];

  return (
    <section className="section-black py-20 relative noise">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal>
          <h2 className="text-display text-[clamp(2rem,6vw,4rem)] text-white mb-12">
            FOLYAMAT
          </h2>
        </Reveal>

        <div ref={containerRef} className="relative max-w-3xl">
          {/* Progress Line */}
          <div className="absolute left-6 md:left-10 top-0 bottom-0 w-px bg-white/10" />
          <motion.div
            className="absolute left-6 md:left-10 top-0 w-px bg-white origin-top"
            style={{ scaleY: scrollYProgress, height: "100%" }}
          />

          <div className="space-y-10">
            {steps.map((step, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="flex gap-6 md:gap-12 pl-16 md:pl-24 relative">
                  <div className="absolute left-0 top-0 w-12 md:w-20 text-display text-2xl md:text-4xl text-white/20">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-display text-xl md:text-2xl text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-white/50 text-sm">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CONTACT
// ============================================
function Contact() {
  return (
    <section id="kapcsolat" className="section-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.3em] uppercase mb-6">
            Kapcsolat
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={phoneLink}
            className="text-display text-[clamp(1.5rem,8vw,5rem)] leading-none hover:text-neutral-500 transition-colors inline-block mb-8"
          >
            {phoneNumber}
          </a>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-neutral-500 text-base mb-8">
            Celldömölk, Vas vármegye
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <CTAButton href={phoneLink}>
            INGYENES KONZULTÁCIÓ
          </CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-black py-12 md:py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Logo & Description */}
          <div>
            <img
              src="/logo-white.svg"
              alt="Klíma Plus"
              className="h-6 w-auto mb-4"
            />
            <p className="text-white/50 text-sm leading-relaxed">
              Professzionális klímaszolgáltatás Nyugat-Dunántúlon. Telepítés, karbantartás, tisztítás és javítás.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider">NAVIGÁCIÓ</h4>
            <nav className="flex flex-col gap-2">
              <a href="#szolgaltatasok" className="text-white/50 hover:text-white text-sm transition-colors">
                Szolgáltatások
              </a>
              <a href="#rolunk" className="text-white/50 hover:text-white text-sm transition-colors">
                Rólunk
              </a>
              <a href="#kapcsolat" className="text-white/50 hover:text-white text-sm transition-colors">
                Kapcsolat
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider">KAPCSOLAT</h4>
            <div className="flex flex-col gap-2">
              <a
                href={phoneLink}
                className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {phoneNumber}
              </a>
              <p className="text-white/50 text-sm">
                Celldömölk, Vas vármegye
              </p>
              <p className="text-white/50 text-sm">
                Vas, Veszprém, Győr-Moson-Sopron, Zala
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © {currentYear} Klíma Plus Cell Kft. Minden jog fenntartva.
            </p>
            <p className="text-white/30 text-xs">
              Weboldal készítés: Király Benedek
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN
// ============================================
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Gallery />
      <Services />
      <MaintenanceGallery />
      <ServiceArea />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
