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
    { href: "#rolunk", label: "RÓLUNK" },
    { href: "#szolgaltatasok", label: "SZOLGÁLTATÁSOK" },
    { href: "#karbantartas", label: "KARBANTARTÁS" },
    { href: "#velemenyek", label: "VÉLEMÉNYEK" },
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
    { src: "/hero-gallery/FB_IMG_1769003406743.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769003436565.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769003446276.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769003490309.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769003527053.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769003563158.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769337123974.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769337165156.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769338707900.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769338841605.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769338868092.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769338884707.webp", position: "center" },
    { src: "/hero-gallery/FB_IMG_1769338940174.webp", position: "center" },
    { src: "/hero-gallery/IMG_20230901_123819.webp", position: "center" },
    { src: "/hero-gallery/IMG_20230922_144348.webp", position: "center" },
    { src: "/hero-gallery/IMG_20230927_131342.webp", position: "right bottom" },
    { src: "/hero-gallery/IMG_20240412_142224.webp", position: "center" },
    { src: "/hero-gallery/IMG_20240412_142309.webp", position: "center" },
    { src: "/hero-gallery/IMG_20240412_142448.webp", position: "center" },
    { src: "/hero-gallery/IMG_20240624_132640.webp", position: "center" },
    { src: "/hero-gallery/IMG_20240624_141653.webp", position: "center" },
    { src: "/hero-gallery/IMG_20250618_191244.webp", position: "center" },
    { src: "/hero-gallery/IMG_20250726_172854.webp", position: "center" },
    { src: "/hero-gallery/IMG_20250731_093135.webp", position: "center" },
    { src: "/hero-gallery/IMG_20251003_125313.webp", position: "center" },
    { src: "/hero-gallery/IMG_20251211_094143.webp", position: "center" },
    { src: "/hero-gallery/klima_szereles.webp", position: "right bottom" },
  ];

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = [...images, ...images, ...images];

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [cursorStyle, setCursorStyle] = useState<"grab" | "grabbing">("grab");

  // Auto-scroll animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 1; // pixels per frame

    // Wait for images to load and get proper dimensions
    const startAnimation = () => {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      if (scrollWidth <= clientWidth) {
        // Content not ready yet, retry
        requestAnimationFrame(startAnimation);
        return;
      }

      const oneThird = scrollWidth / 3;
      container.scrollLeft = oneThird;

      const animate = () => {
        if (!isDraggingRef.current && container) {
          container.scrollLeft += scrollSpeed;

          // Reset to beginning for infinite loop
          if (container.scrollLeft >= oneThird * 2) {
            container.scrollLeft = oneThird;
          }
        }
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Small delay to ensure DOM is ready
    setTimeout(startAnimation, 100);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    setCursorStyle("grabbing");
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setCursorStyle("grab");
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setCursorStyle("grab");
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section className="section-black pt-8 pb-16 overflow-hidden">
      <div
        ref={containerRef}
        className={`gallery-scroll-container ${cursorStyle === "grabbing" ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="gallery-scroll-track">
          {duplicatedImages.map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-hidden rounded-lg relative select-none"
            >
              <Image
                src={img.src}
                alt={`Munkáink ${(index % images.length) + 1}`}
                fill
                sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                className="object-cover pointer-events-none"
                style={{ objectPosition: img.position }}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
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
      desc: "Több éves tapasztalattal vállaljuk klímaberendezések szakszerű beszerelését otthonába, irodájába, nyaralójába. Tiszta, pormentes munkavégzés.",
    },
    {
      number: "02",
      title: "KARBANTARTÁS",
      desc: "A telepített berendezések karbantartásáról is gondoskodunk a klíma élettartamának növelése és hatékony működése érdekében. Szűrőcsere, hűtőközeg ellenőrzés, teljesítmény optimalizálás. Utólagos csepptálca fűtés beszerelése a kültéri egységbe.",
    },
    {
      number: "03",
      title: "TISZTÍTÁS",
      desc: "Professzionális klímatisztítás, az egészséges levegő és optimális működés érdekében. Beltéri és kültéri egység tisztítása, fertőtlenítése.",
    },
    {
      number: "04",
      title: "JAVÍTÁS",
      desc: "Vállaljuk a klímaberendezések garancia időn belüli és kívüli javítását is. Gyors kiszállás, hibaelhárítás, alkatrész garancia.",
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
// ABOUT US
// ============================================
function AboutUs() {
  const features = [
    {
      title: "Minőségi munkavégzés",
      desc: "Pontos, precíz munkavégzés minőségi anyagokkal és szerszámokkal, minden előírást betartva számlával, garanciával.",
    },
    {
      title: "Klíma márkák",
      desc: "Elsősorban Gree, Syen, Polar, Aux klímaberendezéseket forgalmazunk, de minden márkát be tudunk szerezni ha az ügyfél úgy kívánja.",
    },
    {
      title: "Versenyképes árak",
      desc: "Helyszíni felmérést követően pontos árajánlatot adunk. Nálunk nincsenek rejtett költségek, csakis versenyképes árak.",
    },
    {
      title: "Személyre szabva",
      desc: "Minden ügyfelünk esetében személyre szabott javaslatot teszünk. Minden esetben az Ön igényeinek legmegfelelőbb klímaberendezést fogjuk javasolni.",
    },
  ];

  return (
    <section id="rolunk" className="section-white py-20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        {/* 100% Elégedettség pecsét - csak desktop */}
        <div className="hidden md:block absolute top-0 right-4 md:right-8 lg:right-0">
          <Reveal delay={0.3}>
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Kör */}
                  <circle cx="50" cy="50" r="45" fill="white" stroke="#1a1a1a" strokeWidth="4" />
                  {/* Zöld pipa */}
                  <path
                    d="M30 50 L45 65 L70 35"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-neutral-900">100%</span>
                <span className="text-xs md:text-sm uppercase tracking-wider text-neutral-600">Elégedettségi garancia</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="text-display text-[clamp(2rem,6vw,4rem)] mb-6">
            RÓLUNK
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="max-w-3xl mb-12">
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-4">
              Vállalkozásunk 2022 szeptemberében egyéni vállalkozásként alakult, majd 2024 augusztusától Kft-ként is működik.
            </p>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-6">
              Több száz telepített készülékkel és elégedett ügyféllel büszkélkedhetünk.
            </p>
            <p className="text-neutral-400 text-base md:text-lg">
              Nemzeti Klímavédelmi Hatóságnál ellenőrizhető F Gáz azonosító: <span className="font-bold text-neutral-900">1000000073393</span>
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Reveal key={index} delay={0.2 + index * 0.1}>
              <div className="border border-neutral-200 p-6 rounded-lg hover:border-neutral-400 transition-colors">
                <h3 className="text-display text-lg md:text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm">
                  {feature.desc}
                </p>
              </div>
            </Reveal>
          ))}
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
    "/gallery/FB_IMG_1769003446276.webp",
    "/gallery/FB_IMG_1769003490309.webp",
  ];

  return (
    <section id="karbantartas" className="section-black py-20 relative noise">
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
// REVIEWS
// ============================================
function Reviews() {
  const reviews = [
    {
      name: "Marianna Kunyikné Járó",
      initial: "M",
      color: "bg-[#a08060]",
      text: "Szakszerű tanácsadást kaptunk a felméréssel együtt. A beszerelést pontosan a megbeszélt időben, gyorsan, precízen végezték. Tisztaságot hagytak maguk után. Igényesek, közvetlenek, ezek alapján szívesen ajánlom őket!",
    },
    {
      name: "Alíz Szabó",
      initial: "A",
      color: "bg-[#5c6bc0]",
      text: "Szívesen ajánlom a vállalkozást mindenkinek! A felmérés, árajánlat és a leegyeztetett időpontban a kivitelezés a megbeszéltek alapján alakult. Az igényeink, kéréseink figyelembe lettek véve, amit köszönünk!",
    },
    {
      name: "Gábor Pócza",
      initial: "G",
      color: "bg-[#fb8c00]",
      text: "Szakszerű, gyors beszerelés, precíz munkavégzés! Munkájukra igényes, udvarias megbízható szakemberek! Megbeszélt időpontra pontos érkezés! Kitűnő munkát végeztek, mindenkinek tudom ajánlani Őket!",
    },
  ];

  return (
    <section id="velemenyek" className="section-white py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-display text-[clamp(2rem,6vw,4rem)] mb-4">
            VÉLEMÉNYEK
          </h2>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-8 md:mb-12">
            <span className="text-xl md:text-2xl font-bold text-neutral-900">5/5</span>
            <div className="flex text-yellow-500 text-xl md:text-2xl">
              {"★★★★★".split("").map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="text-neutral-500 text-sm md:text-base">Ügyfeleink visszajelzései</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {reviews.map((review, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="bg-neutral-100 p-4 md:p-6 rounded-lg h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${review.color} flex items-center justify-center text-white font-semibold text-sm md:text-base`}>
                    {review.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm md:text-base">{review.name}</p>
                    <div className="flex text-yellow-500 text-sm">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed flex-1">
                  {review.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="text-center">
            <a
              href="https://www.google.com/maps/place/Klíma+Plus/@47.2558924,17.1436291,17z/data=!3m1!4b1!4m12!1m5!8m4!1e1!2s104535717481138910716!3m1!1e1!3m5!1s0x2b3a6da7a0a459b7:0xb66c4fb40d394472!8m2!3d47.2558888!4d17.146204!16s%2Fg%2F11twzdstdx?hl=hu&entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neutral-300 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-medium hover:bg-neutral-100 transition-colors"
            >
              ÖSSZES VÉLEMÉNY
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
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
    { number: "02", title: "FELMÉRÉS", desc: "Celldömölk és környékén ingyenes helyszíni felmérés." },
    { number: "03", title: "KIVITELEZÉS", desc: "Szakszerű telepítés, tisztítás vagy javítás." },
    { number: "04", title: "GARANCIA", desc: "Akár 10 év garanciával." },
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
    <section id="kapcsolat" className="section-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <p className="text-neutral-400 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 md:mb-6">
            Kapcsolat
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={phoneLink}
            className="text-display text-[clamp(1.3rem,7vw,5rem)] leading-none hover:text-neutral-500 transition-colors inline-block mb-3 md:mb-4"
          >
            {phoneNumber}
          </a>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-col items-center justify-center gap-1 md:gap-6 mb-6 md:mb-8">
            <a
              href="mailto:klimaplushungary@gmail.com"
              className="text-neutral-500 hover:text-neutral-900 text-sm md:text-xl transition-colors"
            >
              klimaplushungary@gmail.com
            </a>
            <a
              href="mailto:klimapluscell@gmail.com"
              className="text-neutral-500 hover:text-neutral-900 text-sm md:text-xl transition-colors"
            >
              klimapluscell@gmail.com
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-neutral-500 text-sm md:text-base mb-6 md:mb-8">
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

  const navItems = [
    { href: "#rolunk", label: "Rólunk" },
    { href: "#szolgaltatasok", label: "Szolgáltatások" },
    { href: "#karbantartas", label: "Karbantartás" },
    { href: "#velemenyek", label: "Vélemények" },
    { href: "#kapcsolat", label: "Kapcsolat" },
  ];

  return (
    <footer className="section-black relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        {/* Top section - Large logo */}
        <div className="text-center mb-12 md:mb-16">
          <a href="#" className="inline-block mb-6">
            <img
              src="/logo-white.svg"
              alt="Klíma Plus"
              className="h-6 md:h-8 w-auto mx-auto"
            />
          </a>
          <p className="text-white/40 text-sm md:text-base max-w-md mx-auto">
            Több száz telepített készülék és elégedett ügyfél. Professzionális klímaszolgáltatás Nyugat-Dunántúlon.
          </p>
        </div>

        {/* Middle section - Nav & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12 md:mb-16">
          {/* Navigation */}
          <div className="text-center md:text-left">
            <h4 className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">Navigáció</h4>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h4 className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">Kapcsolat</h4>
            <div className="flex flex-col gap-2">
              <a href={phoneLink} className="text-white text-lg md:text-xl font-semibold hover:text-blue-400 transition-colors">
                {phoneNumber}
              </a>
              <a href="mailto:klimaplushungary@gmail.com" className="text-white/60 hover:text-white text-sm transition-colors">
                klimaplushungary@gmail.com
              </a>
              <a href="mailto:klimapluscell@gmail.com" className="text-white/60 hover:text-white text-sm transition-colors">
                klimapluscell@gmail.com
              </a>
              <p className="text-white/40 text-sm">Celldömölk, Vas vármegye</p>
            </div>
          </div>

          {/* Social */}
          <div className="text-center md:text-right">
            <h4 className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">Közösségi média</h4>
            <a
              href="https://www.facebook.com/profile.php?id=100085385665566"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm">Facebook</span>
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs md:text-sm">
              © {currentYear} Klíma Plus Cell Kft. Minden jog fenntartva.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-white/20 text-xs">F Gáz azonosító: 1000000073393</span>
              <div className="text-white/30 text-xs">
                <span>Készítette: </span>
                <a href="tel:+36308952632" className="hover:text-white/50 transition-colors">Király Ruben</a>
              </div>
            </div>
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
      <AboutUs />
      <Services />
      <MaintenanceGallery />
      <Reviews />
      <ServiceArea />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
