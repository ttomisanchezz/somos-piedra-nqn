import React, { useEffect, useState, useRef, useMemo } from 'react';
import { TextureOverlay } from '@/components/ui/texture-overlay';
import { TextureButton } from '@/components/ui/texture-button';
import { CutoutCard, CutoutCardMedia, CutoutCardImage, CutoutCardContent, CutoutCardFooter, CutoutCardAction, CutoutCardInsetLabel, cutoutCardSurfaceClassName } from '@/components/ui/cutout-card';
import { EdgeBlur } from '@/components/ui/edge-blur';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Expandable, ExpandableTrigger, ExpandableContent } from '@/components/ui/expandable';
import { FamilyDrawerRoot, FamilyDrawerPortal, FamilyDrawerOverlay, FamilyDrawerContent, FamilyDrawerAnimatedWrapper, FamilyDrawerAnimatedContent, FamilyDrawerClose } from '@/components/ui/family-drawer';
import { cn } from '@/lib/utils';
import { MinimalCard } from '@/components/ui/minimal-card';
import { ExpandableScreen, ExpandableScreenContent, useExpandableScreen } from '@/components/ui/expandable-screen';

// ---------- Icons ----------
const Icon = ({ children, size = 24, strokeWidth = 2, className = '', ...rest }) =>
<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
className={className} {...rest}>{children}</svg>;

const MessageCircle = (p) => <Icon {...p}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></Icon>;
const ArrowRight = (p) => <Icon {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
const ArrowLeft = (p) => <Icon {...p}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></Icon>;
const MapPin = (p) => <Icon {...p}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></Icon>;
const HardHat = (p) => <Icon {...p}><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z" /><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" /><path d="M4 15v-3a6 6 0 0 1 6-6" /><path d="M14 6a6 6 0 0 1 6 6v3" /></Icon>;
const Ruler = (p) => <Icon {...p}><path d="M21.3 8.7 8.7 21.3a2.41 2.41 0 0 1-3.4 0l-2.6-2.6a2.41 2.41 0 0 1 0-3.4L15.3 2.7a2.41 2.41 0 0 1 3.4 0l2.6 2.6a2.41 2.41 0 0 1 0 3.4Z" /><path d="m7.5 10.5 2 2" /><path d="m10.5 7.5 2 2" /><path d="m13.5 4.5 2 2" /><path d="m4.5 13.5 2 2" /></Icon>;
const Check = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
const Clock = (p) => <Icon {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
const Phone = (p) => <Icon {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></Icon>;
const Star = (p) => <Icon {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>;
const Plus = (p) => <Icon {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Icon>;
const Minus = (p) => <Icon {...p}><path d="M5 12h14" /></Icon>;
const X = (p) => <Icon {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>;
const Instagram = (p) => <Icon {...p}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></Icon>;
const Facebook = (p) => <Icon {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></Icon>;

// ---------- Reveal hook (fade-up on scroll) ----------
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

// ---------- Data ----------
const WHATSAPP_NUMBER = '5492994637323'; // vivero / Instagram
const WHATSAPP_NEGOCIO = '542994590936'; // consultas comerciales principales

const buildWhatsAppLink = (m, number = WHATSAPP_NEGOCIO) => `https://wa.me/${number}?text=${encodeURIComponent(m)}`;
const heroWhatsAppLink = buildWhatsAppLink('Hola Somos Piedra, vi su página y quería hacer una consulta sobre piedras. ¿Me pueden orientar?');

const INSTAGRAM_URL = 'https://www.instagram.com/viverosomospiedra/';
// TODO: reemplazar por URL real de Facebook
const FACEBOOK_URL = '#';
const igWaLink = buildWhatsAppLink('Hola Somos Piedra, vengo del Instagram y quería consultar por productos. ¿Me pueden orientar?', WHATSAPP_NUMBER);

// Cards del feed @viverosomospiedra — 4 fotos editoriales del vivero
const igCards = [
{ cat: 'Vivero', titulo: 'Nuestro vivero', copy: 'Plantas, macetas y deco al atardecer en San Lorenzo y Güemes, Cinco Saltos.', img: '/fotos/real/ig-vivero-dusk.png', featured: true },
{ cat: 'Césped', titulo: 'Césped en panes', copy: 'Panes verdes recién cortados, listos para colocar.', img: '/fotos/real/ig-cesped-panes.png' },
{ cat: 'Sustratos', titulo: 'Tierra fértil', copy: 'Tierra fértil.', img: '/fotos/real/ig-tierra-bolsas.png' },
{ cat: 'Plantas', titulo: 'Flores & plantas', copy: 'Variedad de florales y plantines de temporada.', img: '/fotos/real/ig-plantas-flores.png' }];


// Hero: fachada de piedra natural en paisaje patagónico — obra premium Somos Piedra
const HERO_IMAGE_URL = '/fotos/real/hero-home-fondo.png';
const HERO_IMAGE_SRCSET = null;

const trustItems = [
{ icon: MapPin, titulo: 'Neuquén y zona', text: 'Entregas coordinadas según volumen y distancia. Si querés, también te lo cargamos sin costo adicional.' },
{ icon: MessageCircle, titulo: 'Asesoramiento real', text: 'Te ayudamos a elegir según uso, estilo y presupuesto.' },
{ icon: HardHat, titulo: 'Grandes proyectos', text: 'Stock y capacidad para abastecer frentes, locales y proyectos de gran escala.' },
{ icon: Ruler, titulo: 'Cotización por m²', text: 'Calculamos cantidad y precio aproximado.' }];


const productos = [
{ categoria: 'Revestimientos', tipo: 'revestimiento', titulo: 'Revestimientos premium', descripcion: 'Placas y láminas para frentes, muros y paredes. Tonos verdes, grises y bronce.', usos: 'frente · muro · pared exterior', img: '/fotos/revestimientopreimum.png', mensajeWa: 'Hola, me interesan los revestimientos premium. ¿Qué opciones tienen y cuánto sale el m²?' },
{ categoria: 'Lajas', tipo: 'lajas', titulo: 'Lajas naturales', descripcion: 'Cortes naturales para pisos exteriores, frentes y caminos. Veteado real, no impreso.', usos: 'piso · frente · camino', img: '/fotos/real/laja-bariloche-topdown.webp', mensajeWa: 'Hola, me interesan las lajas naturales. ¿Qué opciones tienen y cuánto sale el m²?' },
{ categoria: 'Decorativas', tipo: 'decorativa', titulo: 'Piedras decorativas', descripcion: 'Granzas, canto rodado y piedra partida para canteros, caminos y jardines.', usos: 'jardín · cantero · detalle', img: '/fotos/real/piedras-decorativas-hero.png', mensajeWa: 'Hola, quiero piedra decorativa para mi jardín. ¿Qué variedades manejan?' },
{ categoria: 'Frentes', tipo: 'frente', titulo: 'Piedra para frentes', descripcion: 'Materiales con peso visual y resistencia para fachadas que envejecen bien.', usos: 'fachada · entrada · muro', img: '/fotos/real/frente-cream-familia.jpg', mensajeWa: 'Hola, busco piedra para revestir el frente de mi casa. ¿Qué me recomiendan?' },
{ categoria: 'Pisos exteriores', tipo: 'piso', titulo: 'Pisos exteriores', descripcion: 'Lajas Riojana y opciones antideslizantes que aguantan heladas.', usos: 'patio · galería · entrada', img: '/fotos/real/piso-exterior-rojizo.png', mensajeWa: 'Hola, quiero hacer un piso exterior con piedra. ¿Qué materiales tienen?' },
{ categoria: 'Piedra natural', tipo: 'natural', titulo: 'Piedra natural de la región', descripcion: 'Variedades de la región y de importación, cortes a medida para tu proyecto.', usos: 'obra · proyecto · custom', img: '/fotos/real/revestimiento-split-1.jpg', mensajeWa: 'Hola, necesito piedra natural para un proyecto. ¿Pueden cortar a medida?' }];


const filtros = [
{ id: 'todos', label: 'Todos' },
{ id: 'lajas', label: 'Lajas' },
{ id: 'revestimiento', label: 'Revestimientos' },
{ id: 'decorativa', label: 'Decorativas' },
{ id: 'frente', label: 'Frentes' },
{ id: 'piso', label: 'Pisos' },
{ id: 'natural', label: 'Naturales' }];


const aplicaciones = [
{ titulo: 'Frentes', copy: 'Piedras con presencia visual y bajo mantenimiento.', img: '/fotos/real/frente-cream-familia.jpg' },
{ titulo: 'Jardines', copy: 'Texturas naturales para canteros, caminos y detalles.', img: '/fotos/real/jardines-hero.png' },
{ titulo: 'Frentes y exteriores', copy: 'Revestimientos durables para fachadas, galerías y muros exteriores.', img: '/fotos/real/interior-piedra-irregular.jpg' },
{ titulo: 'Pisos exteriores', copy: 'Opciones resistentes para sol, heladas y tránsito.', img: '/fotos/real/piso-laja-riojana-rojizo.jpg' },
{ titulo: 'Quinchos', copy: 'Calidez visual y resistencia al fuego. La piedra que envejece bien.', img: '/fotos/hogar-cuarcita-1.jpg' },
{ titulo: 'Hogares y chimeneas', copy: 'Piedra riojana para hogares y chimeneas.', img: '/fotos/hogaresychimeneas.png' },
{ titulo: '', copy: 'Piedras decorativas para jardines, muros y cercos.', img: '/fotos/real/muro-slate-jardin.jpg' },
{ titulo: 'Locales comerciales', copy: 'Materiales que comunican marca: sobrios, durables, premium.', img: '/fotos/fotofrente.jpeg' }];


const pasos = [
{ n: '01', titulo: 'Contanos qué querés hacer', copy: 'Frente, jardín, pared, piscina. Lo que tengas en mente.' },
{ n: '02', titulo: 'Enviá medidas o fotos', copy: 'Una foto por WhatsApp alcanza. Sin formularios eternos.' },
{ n: '03', titulo: 'Te recomendamos opciones', copy: 'Te mostramos 2 o 3 materiales que encajan con tu proyecto.' },
{ n: '04', titulo: 'Cotizamos y coordinamos', copy: 'Precio claro, disponibilidad y entrega a obra.' }];

const procesoWhatsAppLink = buildWhatsAppLink('Hola, quiero empezar a ver opciones para mi proyecto. ¿Me orientan?');

const galeria = [
{ img: '/fotos/real/hero-home-fondo.png', tag: 'Frente · Piedra natural' },
{ img: '/fotos/real/jardines-hero.png', tag: 'Jardín · Lajas + canto rodado' },
{ img: '/fotos/real/interior-piedra-irregular.jpg', tag: 'Interior · Pared irregular' },
{ img: '/fotos/real/piso-laja-riojana-rojizo.jpg', tag: 'Patio · Laja Riojana rojiza' },
{ img: '/fotos/real/muro-slate-jardin.jpg', tag: 'Muro · Slate en jardín' },
{ img: '/fotos/real/frente-slate-multi-garage.jpg', tag: 'Frente · Slate multicolor' },
{ img: '/fotos/real/laja-vereda-beige.jpg', tag: 'Vereda · Laja beige' },
{ img: '/fotos/real/frente-white-irregular.jpg', tag: 'Frente · Piedra blanca irregular' }];


// Reñas reales del perfil Google de Somos Piedra, Elija Piedra SAS (4.4 ★ · 22 opiniones)
const RESENAS_GOOGLE_URL = 'https://www.google.com/search?q=elija+piedra#lrd=0x960a330c7a0faaab:0xa0c9c9ee31346b72,1,,,,';
const resenas = [
{ autor: 'Nicolas Barroumeres', estrellas: 5, hace: 'Hace 1 año · Local Guide', texto: 'Genios!! Gracias Jesús y equipo. Hice un pedido de 30 bolsas, más de 1 tonelada de piedra un lunes y el martes 10am ya las tenía en el lugar. Gracias!!!' },
{ autor: 'Horacio Jankowski', estrellas: 4, hace: 'Hace 8 meses · Local Guide', texto: 'Buena atención y materiales variados.' },
{ autor: 'ivana', estrellas: 5, hace: 'Hace 1 año · Local Guide', texto: 'Tenían las piedras que buscaba para mi chimenea.' },
{ autor: 'Juan Carlos Delgadillo', estrellas: 5, hace: 'Hace 8 meses · Local Guide', texto: 'Variedad en piedras y buena atención.' },
{ autor: 'Marriel Kas', estrellas: 5, hace: 'Hace 2 años', texto: 'Muy buena atencion rapidos a la hora de la entrega lo recomiendo mucho.' },
{ autor: 'griselda saulino', estrellas: 4, hace: 'Hace 2 años · Local Guide', texto: 'Excelente atencion buena relacion precio /calidad.' },
{ autor: 'Santiago La Rosa', estrellas: 5, hace: 'Hace 2 años · Local Guide', texto: 'Bien atendido y asesorado. Buen precio.' },
{ autor: 'Tania Conti', estrellas: 5, hace: 'Hace 3 años · Local Guide', texto: 'Asesoramiento pertinente. Rapidez.' },
{ autor: 'marcelo pastor', estrellas: 5, hace: 'Hace 1 mes', texto: 'EXCELENTE ATENCIÓN Y ASESORAMIENTO. En 24 horas ya tenía los materiales en Centenario.' },
{ autor: 'Yanina Victoria Croceri', estrellas: 1, hace: 'Hace 2 años', texto: 'Mala experiencia. Según lo informado por el vendedor la piedra partida venía en bolsas de 45-50kg y cubría un espacio de 1 metro cuadrado con aproximadamente 4cm de espesor. Me trajeron bolsas de 30kg que apenas cubre una al lado de la otra...' }];


const faqs = [
{ q: '¿Hacen envíos en Neuquén y zona?', a: 'Sí, coordinamos entregas en Neuquén capital, Plottier, Centenario, Cipolletti y alrededores. El costo depende del volumen y la distancia, te lo confirmamos al cotizar. Si querés, también te lo cargamos sin costo adicional.' },
{ q: '¿Cuánto tarda una cotización?', a: 'Si nos pasás m² y zona por WhatsApp, te respondemos el mismo día hábil. Si necesitás visita al obra, coordinamos en 24-48 hs.' },
{ q: '¿Tienen mínimo de compra?', a: 'No tenemos un mínimo rígido. Para envíos a zona conviene combinar pedidos para optimizar el flete; te lo conversamos caso por caso.' },
{ q: '¿Cortan piedra a medida?', a: 'Sí, trabajamos cortes a medida en lajas y revestimientos según el proyecto. Necesitamos plano o medidas claras y un par de días de producción.' },
{ q: '¿Asesoran sin compromiso de compra?', a: 'Por supuesto. Si dudás entre dos materiales o no sabés qué te conviene, escribinos. Preferimos ayudarte a elegir bien antes que vender mal.' },
{ q: '¿Atienden a arquitectos y constructores?', a: 'Trabajamos con particulares, constructores y arquitectos. Manejamos condiciones para profesionales y obras de mayor volumen. Avisanos si vas a comprar para un proyecto y lo coordinamos.' }];


const checklist = [
'Tipo de proyecto (frente, jardín, pared...)',
'Metros cuadrados aproximados',
'Foto del espacio (si tenés)',
'Contanos qué material te interesa, cuál viste o para qué espacio lo necesitás',
'Ubicación / zona'];


// ---------- Subcomponents ----------

// Placeholder visual para categor\u00edas sin foto a\u00fan (s\u00f3lo c\u00edrculos + rect\u00e1ngulos)
function IGPlaceholder({ kind }) {
  const conf = {
    turf: { from: '#5A6B3F', to: '#6E8049' },
    tree: { from: '#4A5832', to: '#5A6B3F' },
    fountain: { from: '#7A6E5E', to: '#8D8170' }
  }[kind];
  const grassX = [6, 16, 26, 36, 46, 56, 66, 76, 86, 96, 106, 116, 126, 136, 146, 156, 166, 176, 186, 196];
  const grassH = [42, 56, 38, 50, 60, 44, 52, 58, 40, 55, 48, 62, 42, 55, 38, 50, 60, 45, 52, 40];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${conf.from} 0%, ${conf.to} 100%)` }}>
      {/* hatched texture */}
      <div className="absolute inset-0 opacity-25" style={{
        background: 'repeating-linear-gradient(135deg, rgba(245,240,230,0.10) 0 1px, transparent 1px 12px)'
      }} />
      {/* central icon-of-primitives */}
      <div className="absolute inset-0 flex items-center justify-center">
        {kind === 'turf' &&
        <svg viewBox="0 0 200 80" className="w-[70%] opacity-45" preserveAspectRatio="xMidYMid meet">
            {grassX.map((x, i) =>
            <rect key={i} x={x} y={80 - grassH[i]} width="2" height={grassH[i]} fill="#F5F0E6" />
            )}
          </svg>
        }
        {kind === 'tree' &&
        <svg viewBox="0 0 200 130" className="w-[60%] opacity-45" preserveAspectRatio="xMidYMid meet">
            <circle cx="48" cy="55" r="26" fill="#F5F0E6" />
            <rect x="46" y="72" width="4" height="42" fill="#F5F0E6" />
            <circle cx="115" cy="42" r="22" fill="#F5F0E6" />
            <rect x="113" y="58" width="4" height="56" fill="#F5F0E6" />
            <circle cx="168" cy="58" r="24" fill="#F5F0E6" />
            <rect x="166" y="76" width="4" height="40" fill="#F5F0E6" />
          </svg>
        }
        {kind === 'fountain' &&
        <svg viewBox="0 0 200 200" className="w-[60%] opacity-50" preserveAspectRatio="xMidYMid meet">
            <circle cx="100" cy="100" r="86" fill="none" stroke="#F5F0E6" strokeWidth="1" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="#F5F0E6" strokeWidth="1" />
            <circle cx="100" cy="100" r="42" fill="none" stroke="#F5F0E6" strokeWidth="1" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="#F5F0E6" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="6" fill="#F5F0E6" />
          </svg>
        }
      </div>
      {/* vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, transparent 30%, rgba(0,0,0,0.30) 100%)' }} />
      {/* tag */}
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-2 py-1 rounded text-[9.5px] font-mono uppercase tracking-[0.18em] text-white/85">
        <span className="w-1 h-1 rounded-full bg-[#A8B97F]" />
        Próximamente en el feed
      </span>
    </div>);

}

function Stars({ n, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
      <Star key={i} size={size} strokeWidth={1.2}
      className={i <= n ? 'text-[#C8923A]' : 'text-[#1F1A14]/15'}
      style={{ fill: i <= n ? '#D9A04A' : 'transparent' }} />
      )}
    </div>);

}

// Reveal wrapper (fade-up on scroll)
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  return (
    <Tag data-reveal style={{ transitionDelay: `${delay}ms` }} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>);

}

// ---------- Logo (recreado en SVG fiel al original) ----------
const SomosPiedraLogo = ({ size = 26, color = '#1F1A14', accent = '#5A6B3F', stoneLight = '#A8B97F', stoneMid = '#B8B8B8', showTagline = false, className = '' }) => {
  // Three stacked stones (left/right green, top center grey-light), then SOMOS PIEDRA wordmark
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} style={{ lineHeight: 1 }}>
      {/* Stone icon */}
      <svg width={size * 1.25} height={size * 1.05} viewBox="0 0 50 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* left stone (dark green, irregular) */}
        <path d="M2 25 L4 16 L13 12 L22 16 L20 28 L13 33 L5 31 Z" fill={accent} />
        {/* right stone (dark green, irregular) */}
        <path d="M28 26 L32 14 L42 13 L48 22 L46 32 L36 34 L29 31 Z" fill={accent} />
        {/* top center stone (light grey, irregular) */}
        <path d="M16 8 L20 2 L30 3 L34 9 L31 16 L21 16 L17 13 Z" fill={stoneMid} />
        {/* subtle highlights */}
        <path d="M4 17 L13 13 L20 16" stroke={stoneLight} strokeWidth="0.6" opacity="0.5" fill="none" />
        <path d="M30 15 L42 14 L46 21" stroke={stoneLight} strokeWidth="0.6" opacity="0.5" fill="none" />
      </svg>
      {/* Wordmark */}
      <span className="flex flex-col" style={{ lineHeight: 1 }}>
        <span className="font-display tracking-tight" style={{ fontStyle: 'italic', fontWeight: 600, fontSize: `${size * 0.85}px`, color, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
          Somos Piedra
        </span>
        {showTagline &&
        <span className="font-body uppercase mt-1" style={{ fontSize: `${size * 0.32}px`, letterSpacing: '0.18em', color: color === '#1F1A14' ? '#7A6E5E' : color, opacity: 0.7 }}>
            Revestimientos naturales y vivero
          </span>
        }
      </span>
    </span>);

};

// ---------- Reseñas: línea desplazándose horizontalmente ----------
function ResenasRail() {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // keep ref synced with state so the rAF closure always reads fresh value
  useEffect(() => {pausedRef.current = paused;}, [paused]);

  // Single timer, mounted once, never restarted. Uses setInterval (rAF gets
  // paused when the iframe is in a background pane, which silently kills the
  // animation). 60ms interval ≈ 16fps — visually smooth enough for a slow rail.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const STEP = 2.4; // px per tick → ~40px/s
    let lastProgressUpdate = 0;
    const id = setInterval(() => {
      const half = el.scrollWidth / 2;
      if (!pausedRef.current && half > 0) {
        let next = el.scrollLeft + STEP;
        if (next >= half) next -= half;
        el.scrollLeft = next;
      }
      const now = performance.now();
      if (now - lastProgressUpdate > 150 && half > 0) {
        lastProgressUpdate = now;
        setProgress(el.scrollLeft % half / half);
      }
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 z-10"
      style={{ background: 'linear-gradient(90deg, #F5F0E6 0%, rgba(245,240,230,0) 100%)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 z-10"
      style={{ background: 'linear-gradient(270deg, #F5F0E6 0%, rgba(245,240,230,0) 100%)' }} />

      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="resenas-rail flex gap-5 overflow-x-auto pb-6 -mx-6 px-6 md:-mx-10 md:px-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* duplicate the list for seamless marquee feel */}
        {[...resenas, ...resenas].map((r, i) =>
        <article key={i} className="shrink-0 w-[300px] md:w-[calc((100%-2.5rem)/3)] bg-white/60 backdrop-blur-sm border border-[#1F1A14]/8 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5A6B3F]/15 flex items-center justify-center font-display italic text-[#5A6B3F] text-lg">
                {r.autor[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-[14px] font-medium text-[#1F1A14] truncate">{r.autor}</div>
                <div className="font-body text-[11px] text-[#7A6E5E] truncate">{r.hace}</div>
              </div>
            </div>
            <Stars n={r.estrellas} />
            <p className="mt-4 font-body text-[14px] text-[#3D352B] leading-relaxed flex-1">“{r.texto}”</p>
            <div className="mt-5 pt-4 border-t border-[#1F1A14]/8 flex items-center gap-2">
              <span className="text-[10px] font-body uppercase tracking-[0.2em] text-[#7A6E5E]">Reseña en Google</span>
            </div>
          </article>
        )}
      </div>

      {/* Indicator + status */}
      <div className="mt-2 flex items-center gap-4">
        <span className="font-body text-[10px] uppercase tracking-[0.25em] text-[#7A6E5E] flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-[#7A6E5E]' : 'bg-[#5A6B3F]'}`}
          style={{ animation: paused ? 'none' : 'pulse 1.6s ease-in-out infinite' }} />
          {paused ? 'En pausa' : 'Desplazando'}
        </span>
        <div className="flex-1 h-px bg-[#1F1A14]/10 relative">
          <div className="absolute top-[-0.5px] left-0 bg-[#5A6B3F]" style={{ width: `${Math.max(6, progress * 100)}%`, transition: 'width 120ms linear', height: '2px' }} />
        </div>
      </div>
    </div>);

}

// ---------- Cotización: form interactivo + mini calculadora ----------
function CotizarForm() {
  const [modo, setModo] = useState('medidas'); // 'medidas' | 'no-se'
  const [tipo, setTipo] = useState('');
  const [largo, setLargo] = useState('');
  const [ancho, setAncho] = useState('');
  const [zona, setZona] = useState('');
  const [material, setMaterial] = useState('No estoy seguro, asesorame');
  const [descripcion, setDescripcion] = useState('');

  const m2 = useMemo(() => {
    const l = parseFloat(largo);const a = parseFloat(ancho);
    if (!l || !a) return null;
    return Math.round(l * a * 100) / 100;
  }, [largo, ancho]);

  const tipos = ['Frente', 'Jardín', 'Pared', 'Piso exterior', 'Piscina', 'Quincho', 'Otro'];
  const materiales = ['No estoy seguro, asesorame', 'Lajas', 'Revestimiento', 'Piedra decorativa', 'Adoquín'];

  const mensaje = useMemo(() => {
    const lines = ['Hola Somos Piedra, quiero cotizar un proyecto.'];
    if (tipo) lines.push(`• Tipo: ${tipo}`);
    if (modo === 'medidas' && m2) lines.push(`• Metros cuadrados: ${m2} m² (${largo} × ${ancho})`);
    if (modo === 'no-se') lines.push('• Todavía no tengo las medidas, necesito asesoramiento.');
    if (material) lines.push(`• Material: ${material}`);
    if (zona) lines.push(`• Zona: ${zona}`);
    if (modo === 'no-se' && descripcion) lines.push(`• Detalle: ${descripcion}`);
    lines.push('¿Me pueden pasar opciones y precio?');
    return lines.join('\n');
  }, [tipo, m2, largo, ancho, material, zona, modo, descripcion]);

  const link = buildWhatsAppLink(mensaje);

  const fieldLabel = 'block font-body text-[11px] uppercase tracking-[0.2em] text-[#A8B97F] mb-3';
  const pill = (active) => `font-body text-[13px] px-3.5 py-2 rounded-full transition border ${active ? 'bg-[#5A6B3F] border-[#5A6B3F] text-white' : 'bg-transparent border-[#F5F0E6]/25 text-[#F5F0E6]/85 hover:border-[#A8B97F] hover:text-[#A8B97F]'}`;

  return (
    <div className="bg-[#F5F0E6]/[0.03] border border-[#F5F0E6]/10 rounded-xl p-6 md:p-8">
      {/* Toggle: tengo medidas / no sé */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-[#F5F0E6]/[0.06] border border-[#F5F0E6]/10 mb-8 w-fit">
        <button type="button" onClick={() => setModo('medidas')}
          className={`font-body text-[12.5px] px-4 py-2 rounded-full transition ${modo === 'medidas' ? 'bg-[#5A6B3F] text-white shadow-sm' : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'}`}>
          Tengo medidas
        </button>
        <button type="button" onClick={() => setModo('no-se')}
          className={`font-body text-[12.5px] px-4 py-2 rounded-full transition ${modo === 'no-se' ? 'bg-[#5A6B3F] text-white shadow-sm' : 'text-[#F5F0E6]/70 hover:text-[#F5F0E6]'}`}>
          Todavía no sé
        </button>
      </div>

      {/* tipo de proyecto */}
      <label className={fieldLabel}>Tipo de proyecto</label>
      <div className="flex flex-wrap gap-2 mb-7">
        {tipos.map((t) =>
        <button key={t} type="button" onClick={() => setTipo(t)} className={pill(tipo === t)}>{t}</button>
        )}
      </div>

      {modo === 'medidas' ? (
        <>
          {/* calculadora m² */}
          <label className={fieldLabel}>Medidas aproximadas</label>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <div className="font-body text-[11px] text-[#F5F0E6]/55 mb-1.5">Largo</div>
              <div className="relative">
                <input type="number" inputMode="decimal" placeholder="0" value={largo}
                  onChange={(e) => setLargo(e.target.value)}
                  className="w-full bg-transparent border border-[#F5F0E6]/15 focus:border-[#A8B97F] outline-none rounded-lg px-4 py-3 pr-10 font-body text-[15px] text-[#F5F0E6] placeholder:text-[#F5F0E6]/30 transition" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-[12px] text-[#F5F0E6]/45">m</span>
              </div>
            </div>
            <div>
              <div className="font-body text-[11px] text-[#F5F0E6]/55 mb-1.5">Ancho</div>
              <div className="relative">
                <input type="number" inputMode="decimal" placeholder="0" value={ancho}
                  onChange={(e) => setAncho(e.target.value)}
                  className="w-full bg-transparent border border-[#F5F0E6]/15 focus:border-[#A8B97F] outline-none rounded-lg px-4 py-3 pr-10 font-body text-[15px] text-[#F5F0E6] placeholder:text-[#F5F0E6]/30 transition" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-[12px] text-[#F5F0E6]/45">m</span>
              </div>
            </div>
          </div>
          <div className="font-body text-[12px] text-[#F5F0E6]/50 mb-7 flex items-center gap-2">
            <Ruler size={13} strokeWidth={1.5} className="text-[#A8B97F]" />
            {m2 ? <>Total estimado: <span className="text-[#A8B97F] font-medium">{m2} m²</span></> : 'Te calculamos los m² automáticamente'}
          </div>
        </>
      ) : (
        <>
          <label className={fieldLabel}>Contanos brevemente</label>
          <textarea rows="3" placeholder="Ej: quiero revestir el frente de mi casa pero no sé las medidas exactas todavía..."
            value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-transparent border border-[#F5F0E6]/15 focus:border-[#A8B97F] outline-none rounded-lg px-4 py-3 font-body text-[14.5px] text-[#F5F0E6] placeholder:text-[#F5F0E6]/30 transition mb-3 resize-none" />
          <div className="font-body text-[12px] text-[#F5F0E6]/50 mb-7 flex items-start gap-2">
            <MessageCircle size={13} strokeWidth={1.5} className="text-[#A8B97F] mt-0.5 flex-shrink-0" />
            Coordinamos por WhatsApp. Si tenés fotos, las podés mandar directo en el chat.
          </div>
        </>
      )}

      {/* material */}
      <label className={fieldLabel}>Material que tenés en mente</label>
      <div className="flex flex-wrap gap-2 mb-7">
        {materiales.map((m) =>
        <button key={m} type="button" onClick={() => setMaterial(m)} className={pill(material === m)}>{m}</button>
        )}
      </div>

      {/* zona */}
      <label className={fieldLabel}>Zona / localidad</label>
      <input type="text" placeholder="Ej: Neuquén capital, Plottier, Cipolletti..."
        value={zona} onChange={(e) => setZona(e.target.value)}
        className="w-full bg-transparent border border-[#F5F0E6]/15 focus:border-[#A8B97F] outline-none rounded-lg px-4 py-3 font-body text-[15px] text-[#F5F0E6] placeholder:text-[#F5F0E6]/30 transition mb-8" />

      {/* preview msg */}
      <div className="rounded-lg bg-[#F5F0E6]/[0.04] border border-[#F5F0E6]/10 p-4 mb-6">
        <div className="font-body text-[10px] uppercase tracking-[0.2em] text-[#F5F0E6]/40 mb-2">Mensaje que vas a enviar</div>
        <pre className="font-body text-[12.5px] text-[#F5F0E6]/80 leading-relaxed whitespace-pre-wrap">{mensaje}</pre>
      </div>

      <a href={link} target="_blank" rel="noopener noreferrer"
        className="group w-full inline-flex items-center justify-center gap-2 bg-[#5A6B3F] hover:bg-[#4A5832] text-white font-medium text-[15px] px-7 py-4 rounded-full transition shadow-lg shadow-black/30">
        <MessageCircle size={17} />
        {modo === 'no-se' ? 'Hablar por WhatsApp ahora' : 'Enviar por WhatsApp'}
        <ArrowRight size={17} className="group-hover:translate-x-1 transition" />
      </a>
    </div>);

}

// ---------- Galería: hero editorial + expandable lightbox ----------
function GalleryTileInner({ g, extraClass }) {
  const { expand } = useExpandableScreen();
  return (
    <>
      <button
        onClick={expand}
        className={`relative rounded-xl overflow-hidden group cursor-pointer ${extraClass}`}>
        <img src={g.img} alt={g.tag} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]"
          style={{ filter: 'saturate(0.92)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="inline-block font-body text-[11px] uppercase tracking-[0.18em] text-white bg-black/35 backdrop-blur-md px-2.5 py-1.5 rounded-full">
            {g.tag}
          </span>
        </div>
      </button>
      <ExpandableScreenContent className="bg-[#1F1A14]">
        <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12">
          <img src={g.img} alt={g.tag}
            className="max-w-full max-h-[80vh] object-contain rounded-xl" />
          <div className="mt-5">
            <span className="inline-block font-body text-[12px] uppercase tracking-[0.2em] text-white/80 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              {g.tag}
            </span>
          </div>
        </div>
      </ExpandableScreenContent>
    </>
  );
}

function GaleriaSection() {
  const tile = (i, extraClass = '') => (
    <ExpandableScreen layoutId={`gallery-img-${i}`} contentRadius="20px" animationDuration={0.3}>
      <GalleryTileInner g={galeria[i]} extraClass={extraClass} />
    </ExpandableScreen>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridAutoRows: 'minmax(120px, 1fr)' }}>
      <div className="col-span-2 row-span-2 aspect-[4/5] md:aspect-auto relative">{tile(0, 'absolute inset-0')}</div>
      <div className="aspect-square relative">{tile(1, 'absolute inset-0')}</div>
      <div className="aspect-square relative">{tile(2, 'absolute inset-0')}</div>
      <div className="aspect-square relative">{tile(3, 'absolute inset-0')}</div>
      <div className="aspect-square relative">{tile(4, 'absolute inset-0')}</div>
      <div className="aspect-[4/5] relative col-span-2 md:col-span-1 md:row-span-2">{tile(5, 'absolute inset-0')}</div>
      <div className="aspect-square relative">{tile(6, 'absolute inset-0')}</div>
      <div className="aspect-square relative">{tile(7, 'absolute inset-0')}</div>
    </div>
  );
}

// ---------- FAQ ----------
function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="divide-y divide-[#1F1A14]/10 border-t border-b border-[#1F1A14]/10">
      {faqs.map((f, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i}>
            <button onClick={() => setOpenIdx(isOpen ? -1 : i)}
            className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left group">
              <span className={`font-display text-xl md:text-2xl tracking-tight transition ${isOpen ? 'text-[#5A6B3F]' : 'text-[#1F1A14] group-hover:text-[#5A6B3F]'}`} style={{ fontWeight: 500 }}>
                {f.q}
              </span>
              <span className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition ${isOpen ? 'bg-[#5A6B3F] border-[#5A6B3F] text-white' : 'border-[#1F1A14]/20 text-[#3D352B] group-hover:border-[#5A6B3F] group-hover:text-[#5A6B3F]'}`}>
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>
            <div className={`grid transition-all duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-7' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <p className="font-body text-[15px] text-[#3D352B] leading-relaxed max-w-2xl">
                  {f.a}
                </p>
              </div>
            </div>
          </div>);

      })}
    </div>);

}

// ---------- Catálogo con filtros ----------
function CatalogoSection() {
  const [filtro, setFiltro] = useState('todos');
  const [decorativaIdx, setDecorativaIdx] = useState(0);
  const decorativaVariantes = [
    { label: 'Blanca', img: '/fotos/branzablanca.jpeg' },
    { label: 'Roja', img: '/fotos/branzaroja.png' },
    { label: 'Gris', img: '/fotos/branzanegra.png' },
  ];
  const items = useMemo(
    () => filtro === 'todos' ? productos : productos.filter((p) => p.tipo === filtro),
    [filtro]
  );
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 md:mb-12">
        {filtros.map((f) =>
        <button key={f.id} onClick={() => setFiltro(f.id)}
        className={`font-body text-[13px] px-4 py-2 rounded-full transition border ${
        filtro === f.id ?
        'bg-[#1F1A14] border-[#1F1A14] text-[#F5F0E6]' :
        'bg-transparent border-[#1F1A14]/15 text-[#3D352B] hover:border-[#5A6B3F] hover:text-[#5A6B3F]'}`
        }>{f.label}</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((p) => {
          const isDecorativa = p.tipo === 'decorativa';
          const imgSrc = isDecorativa ? decorativaVariantes[decorativaIdx].img : p.img;
          return (
            <CutoutCard key={p.titulo} className={cn(cutoutCardSurfaceClassName, "bg-[#EDE5D4] flex flex-col")}>
              <a href={buildWhatsAppLink(p.mensajeWa)} target="_blank" rel="noopener noreferrer" className="flex flex-col flex-1">
                <CutoutCardMedia className="aspect-[4/5] bg-[#EDE5D4]">
                  <CutoutCardImage src={imgSrc} alt={p.titulo} style={{ filter: 'saturate(0.92)' }} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/cutout:opacity-100 transition duration-500" />
                  <CutoutCardInsetLabel className="bottom-3 left-3">
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#7A6E5E] bg-[#EDE5D4]/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {p.categoria}
                    </span>
                  </CutoutCardInsetLabel>
                  <CutoutCardAction revealOnHover className="bottom-3 right-3">
                    <span className="inline-flex items-center gap-1.5 font-body text-[12px] font-medium text-white bg-[#5A6B3F] px-3 py-1.5 rounded-full shadow-lg">
                      Consultar <ArrowRight size={12} />
                    </span>
                  </CutoutCardAction>
                </CutoutCardMedia>
                <CutoutCardContent className="p-6 flex flex-col gap-2.5 flex-1">
                  {isDecorativa && (
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {decorativaVariantes.map((v, i) => (
                        <button
                          key={v.label}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDecorativaIdx(i); }}
                          className={`font-body text-[11px] px-2.5 py-1 rounded-full transition border ${
                            decorativaIdx === i
                              ? 'bg-[#5A6B3F] border-[#5A6B3F] text-white'
                              : 'bg-transparent border-[#1F1A14]/20 text-[#7A6E5E] hover:border-[#5A6B3F] hover:text-[#5A6B3F]'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <h3 className="font-display text-[22px] text-[#1F1A14] leading-tight tracking-tight" style={{ fontWeight: 500 }}>{p.titulo}</h3>
                  <p className="font-body text-[14px] text-[#3D352B] leading-snug"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.descripcion}
                  </p>
                  <div className="font-body text-[12px] text-[#7A6E5E] tracking-wide mt-auto pt-2">{p.usos}</div>
                </CutoutCardContent>
                <CutoutCardFooter className="px-6 pb-5 pt-3 border-t border-[#1F1A14]/10">
                  <span className="font-body text-[13px] font-medium text-[#5A6B3F]">Consultar material</span>
                  <ArrowRight size={15} className="text-[#5A6B3F] group-hover/cutout:translate-x-1 transition" />
                </CutoutCardFooter>
              </a>
            </CutoutCard>
          );
        })}
      </div>
    </>);

}

// ---------- Main ----------
function SomosPiedraLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('top');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for contextual CTA
  useEffect(() => {
    const ids = ['productos', 'aplicaciones', 'instagram', 'opiniones', 'proceso', 'faq', 'cotizacion', 'ubicacion'];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return;
    const io = new IntersectionObserver((entries) => {
      // Pick the entry closest to top of viewport that's intersecting
      const visible = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const scrollToCotizacion = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const section = document.getElementById('cotizacion');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] font-body text-[#1F1A14]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300..600&display=swap');

        .font-display { font-family: 'Fraunces', Georgia, serif; }
        .font-hero { font-family: 'Cormorant Garamond', 'Fraunces', Georgia, serif; }
        .font-body { font-family: 'DM Sans', system-ui, sans-serif; }

        h1.display-hero { font-weight: 500; letter-spacing: -0.015em; line-height: 0.98; }
        h2.display-section { font-weight: 450; font-variation-settings: "opsz" 96; line-height: 1.04; }
        h3.display-card { font-weight: 400; font-variation-settings: "opsz" 36; }

        @keyframes kenBurns {
          0%   { transform: scale(1)    translate(0, 0); }
          100% { transform: scale(1.12) translate(-1%, -1.5%); }
        }
        .ken-burns { animation: kenBurns 24s ease-in-out infinite alternate; will-change: transform; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .fade-up { animation: fadeInUp 0.9s ease-out forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }

        /* scroll reveal */
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 900ms ease-out, transform 900ms ease-out; }
        .reveal.is-revealed { opacity: 1; transform: translateY(0); }

        /* hide scrollbar utility for trust rail on mobile */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }

        /* hide scrollbar on reseñas rail */
        .resenas-rail::-webkit-scrollbar { display: none; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      {/* NAV — slim, accessible, with mobile drawer */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 40 ? 'bg-[#F5F0E6]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(31,26,20,0.06),0_6px_20px_-12px_rgba(31,26,20,0.10)]' : 'bg-[#F5F0E6]/0 backdrop-blur-0 border-b border-transparent'}`} style={{ height: '64px' }}>
        <div className="h-full max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between gap-6">
          {/* Left: logo */}
          <a href="#top" onClick={(e) => {e.preventDefault();window.scrollTo({ top: 0, behavior: 'smooth' });}}
          className="flex items-center gap-3 group cursor-pointer flex-shrink-0" aria-label="Volver al inicio">
            <SomosPiedraLogo size={scrollY > 40 ? 22 : 24} color={scrollY > 40 ? '#1F1A14' : '#F5F0E6'} stoneMid={scrollY > 40 ? '#B8B8B8' : '#D4C9B5'} className="group-hover:opacity-80 transition" />
          </a>

          {/* Center: links (desktop only) */}
          <div className={`hidden lg:flex items-center gap-6 font-body text-[13px] flex-1 justify-center ${scrollY > 40 ? 'text-[#3D352B]' : 'text-white/85'}`}>
            <a href="#productos" className="hover:text-[#5A6B3F] transition py-2">Productos</a>
            <a href="#aplicaciones" className="hover:text-[#5A6B3F] transition py-2">Usos</a>
            <a href="#proceso" className="hover:text-[#5A6B3F] transition py-2">Proceso</a>
            <a href="#cotizacion" onClick={scrollToCotizacion} className="hover:text-[#5A6B3F] transition py-2">Cotización</a>
            <a href="#opiniones" className="hover:text-[#5A6B3F] transition py-2">Opiniones</a>
            <a href="#faq" className="hover:text-[#5A6B3F] transition py-2">FAQ</a>
            <a href="#ubicacion" className="hover:text-[#5A6B3F] transition py-2">Ubicación</a>
          </div>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="#cotizacion" onClick={scrollToCotizacion}
            className="flex items-center gap-1.5 bg-[#5A6B3F] hover:bg-[#4A5832] text-[#F5F0E6] text-[12.5px] font-medium px-4 py-2 rounded-full transition shadow-sm">
              <MessageCircle size={14} />
              <span className="hidden sm:inline">Consultar</span>
            </a>
            <button type="button" onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
              className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition ${scrollY > 40 ? 'text-[#1F1A14] hover:bg-[#1F1A14]/5' : 'text-white hover:bg-white/10'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — FamilyDrawer (bottom sheet) */}
      <FamilyDrawerRoot open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <FamilyDrawerPortal>
          <FamilyDrawerOverlay />
          <FamilyDrawerContent className="max-w-lg bg-[#F5F0E6]">
            <FamilyDrawerAnimatedWrapper className="px-5 pb-7 pt-3">
              <FamilyDrawerAnimatedContent>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <SomosPiedraLogo size={22} />
                    <FamilyDrawerClose>
                      <X size={16} />
                    </FamilyDrawerClose>
                  </div>
                  <nav className="flex flex-col gap-0.5 font-body text-[16px] text-[#1F1A14] mb-5">
                    {[
                      { href: '#productos', label: 'Productos' },
                      { href: '#aplicaciones', label: 'Usos' },
                      { href: '#proceso', label: 'Proceso' },
                      { href: '#cotizacion', label: 'Cotización' },
                      { href: '#opiniones', label: 'Opiniones' },
                      { href: '#faq', label: 'Preguntas frecuentes' },
                      { href: '#ubicacion', label: 'Ubicación' }
                    ].map((it) =>
                    <a key={it.href} href={it.href} onClick={() => setMobileMenuOpen(false)}
                      className="py-3 px-2 rounded-xl hover:bg-[#1F1A14]/5 transition flex items-center justify-between group">
                      <span>{it.label}</span>
                      <ArrowRight size={15} className="text-[#7A6E5E] group-hover:text-[#5A6B3F] group-hover:translate-x-0.5 transition" />
                    </a>
                    )}
                  </nav>
                  <div className="flex flex-col gap-2.5 border-t border-[#1F1A14]/10 pt-5">
                    <a href="#cotizacion" onClick={(e) => { setMobileMenuOpen(false); scrollToCotizacion(e); }}
                      className="inline-flex items-center justify-center gap-2 bg-[#5A6B3F] hover:bg-[#4A5832] text-white font-medium text-[14px] px-5 py-3 rounded-full transition">
                      <MessageCircle size={15} />
                      Pedir cotización
                    </a>
                    <a href={heroWhatsAppLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-[#1F1A14]/20 text-[#1F1A14] hover:border-[#5A6B3F] hover:text-[#5A6B3F] font-medium text-[13.5px] px-5 py-3 rounded-full transition">
                      WhatsApp directo
                    </a>
                  </div>
                </div>
              </FamilyDrawerAnimatedContent>
            </FamilyDrawerAnimatedWrapper>
          </FamilyDrawerContent>
        </FamilyDrawerPortal>
      </FamilyDrawerRoot>

      {/* HERO — ocupa exactamente 100dvh, sin que se vea la sección siguiente */}
      <section className="relative h-[100dvh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0" style={{ transform: `translate3d(0, ${scrollY * 0.20}px, 0)`, willChange: 'transform' }}>
          <div className="absolute inset-0 ken-burns">
            <img
              src={HERO_IMAGE_URL}
              alt="Fachada con revestimiento de piedra natural — obra Somos Piedra"
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.96) contrast(1.04)' }} />
          </div>
        </div>

        {/* Top scrim para legibilidad del nav */}
        <div className="absolute inset-x-0 top-0 h-32 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(31,26,20,0.55) 0%, rgba(31,26,20,0) 100%)'
        }} />
        {/* Center scrim sutil para el texto */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(31,26,20,0.25) 0%, rgba(31,26,20,0.12) 50%, rgba(31,26,20,0.10) 100%)'
        }} />
        {/* Left-focus radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(70% 60% at 26% 52%, rgba(31,26,20,0.42) 0%, rgba(31,26,20,0) 65%)'
        }} />
        {/* Soft blend hacia la sección trust */}
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(245,240,230,0) 0%, rgba(245,240,230,0.20) 50%, rgba(245,240,230,0.55) 100%)'
        }} />
        {/* EdgeBlur adicional en la transición hero → trust */}
        <EdgeBlur position="bottom" height={90} absolute />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 md:px-10 flex flex-col justify-center pt-16 pb-20">
          <div className="inline-flex self-start items-center gap-2 px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-md border border-white/22 mb-5 fade-up delay-100">
            <span className="w-1 h-1 rounded-full bg-[#A8B97F]"></span>
            <span className="text-[10.5px] font-body font-medium text-white tracking-[0.22em] uppercase">Piedra natural · Vivero · Neuquén</span>
          </div>

          <h1 className="display-hero font-display text-[34px] sm:text-[44px] md:text-[56px] lg:text-[64px] text-white leading-[1.06] tracking-[-0.012em] max-w-2xl fade-up delay-300" style={{ fontWeight: 400, fontVariationSettings: '"opsz" 96' }}>
            Piedra natural para tu obra.
          </h1>

          <p className="mt-3 max-w-lg font-hero text-[17px] sm:text-[19px] md:text-[21px] text-[#E8DFC9] leading-[1.35] tracking-[0.004em] fade-up delay-500" style={{ fontWeight: 400 }}>
            Asesoramiento, cotización y entrega en Neuquén.
          </p>

          <p className="mt-5 max-w-xl font-body font-light text-[14.5px] md:text-[16px] text-white/90 leading-relaxed fade-up delay-500">
            Revestimientos, lajas, piedras decorativas y vivero. Para hogares, frentes y grandes proyectos.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 fade-up delay-700">
            <TextureButton variant="brand" size="pill" onClick={scrollToCotizacion}>
              <MessageCircle size={16} />
              Pedir asesoramiento
              <ArrowRight size={16} />
            </TextureButton>
            <a href="#productos"
            className="inline-flex items-center justify-center gap-1.5 text-white font-medium text-[14px] md:text-[15px] px-2 py-3 transition hover:text-[#A8B97F] border-b border-white/40 self-start sm:self-center">
              Ver catálogo
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Proof points — más aire, separadores prolijos */}
          <div className="mt-9 md:mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 fade-up delay-700">
            <div className="flex items-center gap-2">
              <Stars n={4} size={13} />
              <span className="font-body text-[12.5px] text-white/95">
                <span className="font-semibold text-white">
                  <AnimatedNumber value={4.4} precision={1} format={(n) => n.toFixed(1).replace('.', ',')} />
                </span>
                <span className="text-white/60"> · </span>
                <AnimatedNumber value={22} /> reseñas Google
              </span>
            </div>
            <span className="hidden sm:block w-px h-3.5 bg-white/30"></span>
            <div className="flex items-center gap-1.5 font-body text-[12.5px] text-white/90">
              <MapPin size={13} strokeWidth={1.6} className="text-[#A8B97F]" />
              Belgrano 3090, Neuquén
            </div>
            <span className="hidden sm:block w-px h-3.5 bg-white/30"></span>
            <div className="flex items-center gap-1.5 font-body text-[12.5px] text-white/90">
              <HardHat size={13} strokeWidth={1.6} className="text-[#A8B97F]" />
              Envíos a toda la zona
            </div>
            <span className="hidden sm:block w-px h-3.5 bg-white/30"></span>
            <div className="flex items-center gap-1.5 font-body text-[12.5px] text-white/90">
              <Phone size={13} strokeWidth={1.6} className="text-[#A8B97F]" />
              2994152119
            </div>
          </div>
        </div>
      </section>

      {/* TRUST — sección independiente debajo del hero (sin overlap) */}
      <section className="relative bg-[#F5F0E6] pt-16 md:pt-24 pb-14 md:pb-20 px-5 md:px-10 border-b border-[#1F1A14]/10">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: scroll horizontal con snap. Desktop: grilla 4 columnas. */}
          <Reveal className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-5 px-5 md:mx-0 md:px-0 pb-3 md:pb-0 hide-scrollbar">
            {trustItems.map((item, i) =>
            <MinimalCard key={i}
              className="snap-start shrink-0 w-[78%] sm:w-[60%] md:w-auto hover:-translate-y-0.5 transition duration-300 bg-white hover:bg-white dark:bg-white dark:hover:bg-white dark:text-[#1F1A14]">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#EDE5D4] flex items-center justify-center">
                  <item.icon size={18} strokeWidth={1.6} className="text-[#5A6B3F]" />
                </div>
                <div>
                  <div className="font-body font-semibold text-[14.5px] md:text-[15px] text-[#1F1A14] leading-tight mb-1.5">{item.titulo}</div>
                  <p className="font-body text-[13px] md:text-[13.5px] text-[#3D352B]/85 leading-snug">{item.text}</p>
                </div>
              </div>
            </MinimalCard>
            )}
          </Reveal>
        </div>
      </section>

      {/* CATÁLOGO con filtros */}
      <section id="productos" className="px-6 md:px-10 py-24 md:py-32 max-w-7xl mx-auto">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-10 md:mb-12 items-end">
            <div>
              <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#7A6E5E] mb-4">Catálogo</div>
              <h2 className="display-section font-display text-[34px] md:text-[52px] leading-[1.04] tracking-[-0.02em] text-[#1F1A14]" style={{ fontWeight: 500 }}>
                Materiales seleccionados
              </h2>
            </div>
            <p className="font-body text-[15px] md:text-[16px] text-[#3D352B] leading-relaxed max-w-md md:justify-self-end">
              Cada piedra viene con guía de uso. Te decimos dónde rinde mejor, cómo se mantiene y con qué combina. Si dudás, te orientamos por WhatsApp.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <CatalogoSection />
        </Reveal>
      </section>

      {/* APLICACIONES */}
      <section id="aplicaciones" className="relative bg-[#1F1A14] text-[#F5F0E6] py-20 md:py-24 px-6 md:px-10">
        <TextureOverlay texture="diagonal" opacity={0.05} />
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#A8B97F] mb-4">Usos</div>
            <h2 className="display-section font-display text-[34px] md:text-[52px] leading-[1.04] tracking-[-0.02em] text-[#F5F0E6]" style={{ fontWeight: 500 }}>
              Cada espacio pide una piedra distinta
            </h2>
            <p className="mt-5 font-body text-[15px] md:text-[16px] text-[#F5F0E6]/65 leading-relaxed">
              Te mostramos qué tipo de material conviene según el uso real.
            </p>
          </Reveal>

          {/* Mobile: scroll horizontal. Desktop: masonry editorial con alturas variadas */}
          <Reveal delay={100} className="flex md:hidden gap-5 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-2">
            {aplicaciones.map((a, i) =>
            <div key={i} className="relative shrink-0 w-72 aspect-[3/4] rounded-2xl overflow-hidden snap-start group">
                <img src={a.img} alt={a.titulo} loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
              style={{ filter: 'brightness(0.78) saturate(0.92)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="display-card font-display text-[22px] text-white leading-tight mb-1.5" style={{ fontWeight: 500 }}>{a.titulo}</h3>
                  <p className="font-body text-[13px] text-white/85 leading-snug">{a.copy}</p>
                </div>
              </div>
            )}
          </Reveal>

          <Reveal delay={100} className="hidden md:grid grid-cols-12 gap-4 lg:gap-5 auto-rows-[140px]">
            {aplicaciones.map((a, i) => {
              // Editorial masonry: filas y columnas variables. 8 items.
              const spans = [
                'col-span-5 row-span-3', // 0 Frentes (grande vertical)
                'col-span-4 row-span-2', // 1 Jardines
                'col-span-3 row-span-2', // 2 Paredes
                'col-span-3 row-span-2', // 3 Pisos
                'col-span-4 row-span-2', // 4 Quinchos
                'col-span-5 row-span-3', // 5 Hogares (grande vertical)
                'col-span-4 row-span-2', // 6 Muros
                'col-span-3 row-span-2'  // 7 Locales
              ];
              return (
                <div key={i} className={`relative rounded-2xl overflow-hidden group ${spans[i] || 'col-span-3 row-span-2'}`}>
                  <img src={a.img} alt={a.titulo} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.78) saturate(0.92)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <h3 className="display-card font-display text-[20px] lg:text-[22px] text-white leading-tight mb-1" style={{ fontWeight: 500 }}>{a.titulo}</h3>
                    <p className="font-body text-[12.5px] lg:text-[13px] text-white/85 leading-snug">{a.copy}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="bg-[#EDE5D4] py-20 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#7A6E5E] mb-4">Proceso</div>
            <h2 className="display-section font-display text-[34px] md:text-[52px] leading-[1.04] tracking-[-0.02em] text-[#1F1A14]" style={{ fontWeight: 500 }}>
              No vendemos piedra. <span className="italic text-[#5A6B3F]">Resolvemos espacios.</span>
            </h2>
            <p className="mt-5 font-body text-[15px] md:text-[16px] text-[#3D352B] leading-relaxed">
              Cuatro pasos simples para que llegues al material correcto sin equivocarte.
            </p>
          </Reveal>

          {/* Desktop: grilla original */}
          <Reveal delay={100} className="hidden md:grid grid-cols-4 gap-8">
            {pasos.map((p, i) =>
            <div key={i} className="flex flex-col pt-5 border-t-2 border-[#5A6B3F]/40">
                <div className="font-display text-[64px] leading-none text-[#5A6B3F]/55 mb-5 tabular-nums" style={{ fontWeight: 500 }}>{p.n}</div>
                <h3 className="display-card font-display text-[22px] text-[#1F1A14] leading-tight mb-2.5" style={{ fontWeight: 500 }}>{p.titulo}</h3>
                <p className="font-body text-[14px] text-[#3D352B] leading-relaxed">{p.copy}</p>
              </div>
            )}
          </Reveal>

          {/* Mobile: accordion expandable */}
          <Reveal delay={100} className="md:hidden flex flex-col divide-y divide-[#1F1A14]/10 border-t border-[#1F1A14]/10">
            {pasos.map((p, i) =>
            <Expandable key={i} transitionDuration={0.35} easeType="easeOut">
                <ExpandableTrigger className="w-full py-5 flex items-center gap-4 cursor-pointer select-none">
                  <span className="font-display text-[28px] leading-none text-[#5A6B3F]/55 tabular-nums w-10 flex-shrink-0" style={{ fontWeight: 500 }}>{p.n}</span>
                  <h3 className="display-card font-display text-[20px] text-[#1F1A14] leading-tight flex-1 text-left" style={{ fontWeight: 500 }}>{p.titulo}</h3>
                  <Plus size={18} className="text-[#5A6B3F] flex-shrink-0" />
                </ExpandableTrigger>
                <ExpandableContent preset="slide-up">
                  <p className="font-body text-[14.5px] text-[#3D352B] leading-relaxed pb-5 pl-14">{p.copy}</p>
                </ExpandableContent>
              </Expandable>
            )}
          </Reveal>

          <Reveal delay={200} className="mt-12 md:mt-14 flex justify-center">
            <a href="#cotizacion" onClick={scrollToCotizacion}
            className="group inline-flex items-center justify-center gap-2 bg-[#5A6B3F] hover:bg-[#4A5832] text-white font-medium text-[15px] px-7 py-4 rounded-full transition shadow-lg shadow-black/10">
              <MessageCircle size={17} />
              Pedí tu cotización
              <ArrowRight size={17} className="group-hover:translate-x-1 transition" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* COTIZACIÓN — form interactivo */}
      <section id="cotizacion" className="relative bg-[#1F1A14] text-[#F5F0E6] py-24 md:py-32 px-6 md:px-10 scroll-mt-20">
        <TextureOverlay texture="paperGrain" opacity={0.08} />
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
          <Reveal>
            <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#A8B97F] mb-4">Cotización</div>
            <h2 className="display-section font-display text-[34px] md:text-[44px] leading-[1.04] tracking-[-0.02em] text-[#F5F0E6]" style={{ fontWeight: 500 }}>
              Pedí tu cotización <span className="italic text-[#A8B97F]">en minutos</span>
            </h2>
            <p className="mt-5 font-body text-[15px] md:text-[16px] text-[#F5F0E6]/65 leading-relaxed max-w-md">
              Completá lo que tengas. Te calculamos los m² y armamos el mensaje listo para mandarnos.
            </p>

            <ul className="mt-10 flex flex-col gap-4">
              {checklist.map((item, i) =>
              <li key={i} className="flex items-start gap-3.5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5A6B3F]/20 border border-[#A8B97F]/30 flex items-center justify-center mt-0.5">
                    <Check size={13} strokeWidth={2.5} className="text-[#A8B97F]" />
                  </div>
                  <span className="font-body text-[15px] text-[#F5F0E6]/85 leading-snug pt-0.5">{item}</span>
                </li>
              )}
            </ul>

            <div className="mt-8 pt-6 border-t border-[#F5F0E6]/10">
              <p className="font-body text-[12px] uppercase tracking-[0.18em] text-[#F5F0E6]/40 mb-3">O también escribinos a estos números:</p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2.5 font-body text-[13.5px]">
                  <span className="text-[#F5F0E6]/90 font-medium">2994152119</span>
                  <span className="text-[#F5F0E6]/30">—</span>
                  <span className="text-[#F5F0E6]/60">Dueño</span>
                </li>
                <li className="flex items-center gap-2.5 font-body text-[13.5px]">
                  <span className="text-[#F5F0E6]/90 font-medium">2994590936</span>
                  <span className="text-[#F5F0E6]/30">—</span>
                  <span className="text-[#F5F0E6]/60">Negocio <span className="text-[#F5F0E6]/40 text-[11.5px]">(solo WhatsApp)</span></span>
                </li>
                <li className="flex items-center gap-2.5 font-body text-[13.5px]">
                  <span className="text-[#F5F0E6]/90 font-medium">2994462548</span>
                  <span className="text-[#F5F0E6]/30">—</span>
                  <span className="text-[#F5F0E6]/60">Fijo</span>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <CotizarForm />
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM — inspiración real del feed */}
      <section id="instagram" className="bg-[#F5F0E6] py-20 md:py-28 px-6 md:px-10 border-t border-[#1F1A14]/8">
        <div className="max-w-7xl mx-auto">
          <Reveal className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 mb-10 md:mb-14 items-end">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <Instagram size={14} strokeWidth={1.6} className="text-[#5A6B3F]" />
                <span className="text-[10px] font-body uppercase tracking-[0.3em] text-[#7A6E5E]">Instagram · @viverosomospiedra</span>
              </div>
              <h2 className="display-section font-display text-[34px] md:text-[52px] leading-[1.04] tracking-[-0.02em] text-[#1F1A14]" style={{ fontWeight: 500 }}>
                Inspiración real,<br />
                <span className="italic text-[#5A6B3F]">productos reales.</span>
              </h2>
            </div>
            <p className="font-body text-[15px] md:text-[16px] text-[#3D352B] leading-relaxed md:max-w-md md:justify-self-end">
              Conocé algunos de nuestros productos, obras y soluciones desde nuestro Instagram.
            </p>
          </Reveal>

          {/* Editorial 1 + 3: featured a la izquierda, tres cards apiladas a la derecha */}
          <Reveal delay={100} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Featured (col 1 desktop) */}
            {(() => {
              const card = igCards[0];
              return (
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  className="group relative rounded-2xl overflow-hidden bg-[#EDE5D4] aspect-[4/5] md:aspect-auto md:h-full md:min-h-[520px] transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#1F1A14]/20">
                  <img src={card.img} alt={card.titulo} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    style={{ filter: 'saturate(0.95) contrast(1.02)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/12 backdrop-blur-md border border-white/22 px-2.5 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-[#A8B97F]" />
                    <span className="text-[10px] font-body uppercase tracking-[0.2em] text-white/90">{card.cat}</span>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/12 backdrop-blur-md border border-white/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition duration-300">
                    <Instagram size={14} strokeWidth={1.6} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="display-card font-display text-white leading-tight tracking-tight mb-2 text-[26px] md:text-[34px] lg:text-[40px]" style={{ fontWeight: 500 }}>
                      {card.titulo}
                    </h3>
                    <p className="font-body text-white/85 leading-snug text-[14px] md:text-[15px] max-w-md">
                      {card.copy}
                    </p>
                  </div>
                </a>);

            })()}

            {/* Right column: 3 smaller cards stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 md:gap-5">
              {igCards.slice(1).map((card, i) =>
              <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden bg-[#EDE5D4] aspect-[4/3] md:aspect-auto md:h-full md:min-h-0 transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#1F1A14]/20">
                  <img src={card.img} alt={card.titulo} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    style={{ filter: 'saturate(0.95) contrast(1.02)' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/5" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/12 backdrop-blur-md border border-white/22 px-2.5 py-1 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-[#A8B97F]" />
                    <span className="text-[10px] font-body uppercase tracking-[0.2em] text-white/90">{card.cat}</span>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/12 backdrop-blur-md border border-white/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition duration-300">
                    <Instagram size={12} strokeWidth={1.6} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="display-card font-display text-white leading-tight tracking-tight mb-1 text-[19px] md:text-[22px]" style={{ fontWeight: 500 }}>
                      {card.titulo}
                    </h3>
                    <p className="font-body text-white/85 leading-snug text-[12.5px] md:text-[13px]">
                      {card.copy}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </Reveal>

          {/* CTA dual */}
          <Reveal delay={200} className="mt-14 md:mt-16">
            <div className="grid md:grid-cols-[1.5fr_auto] gap-8 md:gap-10 items-center border-t border-[#1F1A14]/10 pt-10 md:pt-12">
              <div>
                <h3 className="font-display text-[24px] md:text-[28px] text-[#1F1A14] leading-tight tracking-tight" style={{ fontWeight: 500 }}>
                  ¿Te gustó algo del feed? <span className="italic text-[#5A6B3F]">Hablemos.</span>
                </h3>
                <p className="mt-2 font-body text-[14.5px] text-[#3D352B] leading-relaxed max-w-lg">
                  Seguí las entregas, productos del día y obras en marcha en Instagram. Si algo te interesa, te lo cotizamos directo por WhatsApp.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:justify-self-end">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-[#1F1A14] hover:bg-[#3D352B] text-[#F5F0E6] font-medium text-[14px] px-6 py-3.5 rounded-full transition shadow-md shadow-black/10">
                  <Instagram size={16} />
                  Ver Instagram
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition" />
                </a>
                <a href={igWaLink} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-[#5A6B3F] hover:bg-[#4A5832] text-white font-medium text-[14px] px-6 py-3.5 rounded-full transition shadow-md shadow-black/10">
                  <MessageCircle size={16} />
                  Consultar por WhatsApp
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* OPINIONES — rail */}
      <section id="opiniones" className="relative bg-[#F5F0E6] py-20 md:py-24 px-6 md:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal className="grid md:grid-cols-2 gap-10 md:gap-16 mb-10 md:mb-12 items-end">
            <div>
              <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#7A6E5E] mb-4">Opiniones</div>
              <h2 className="display-section font-display text-[34px] md:text-[52px] leading-[1.04] tracking-[-0.02em] text-[#1F1A14]" style={{ fontWeight: 500 }}>
                Lo que dicen<br />nuestros clientes
              </h2>
            </div>
            <div className="md:justify-self-end max-w-md">
              <div className="flex items-center gap-4 mb-3">
                <span className="font-display text-[44px] leading-none text-[#1F1A14]" style={{ fontWeight: 600 }}>
                  <AnimatedNumber value={4.4} precision={1} format={(n) => n.toFixed(1).replace('.', ',')} />
                </span>
                <div className="flex flex-col gap-1.5">
                  <Stars n={4} size={15} />
                  <span className="font-body text-[12px] text-[#7A6E5E]">22 opiniones en Google</span>
                </div>
              </div>
              <p className="font-body text-[14px] text-[#3D352B] leading-relaxed">
                Reseñas reales del local en Gral. Manuel Belgrano 3090, Neuquén. Cero filtros.
              </p>
              <a href={RESENAS_GOOGLE_URL} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[#5A6B3F] hover:text-[#3D352B] font-body text-[13px] border-b border-[#5A6B3F]/30 hover:border-[#3D352B] pb-0.5 transition">
                Ver todas en Google
                <ArrowRight size={14} />
              </a>
            </div>
          </Reveal>
        </div>
        <div className="max-w-7xl mx-auto">
          <Reveal delay={100}>
            <ResenasRail />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#EDE5D4] py-20 md:py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Reveal className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12 mb-10 md:mb-12 items-end">
            <div>
              <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#7A6E5E] mb-4">Preguntas</div>
              <h2 className="display-section font-display text-[30px] md:text-[42px] leading-[1.04] tracking-[-0.02em] text-[#1F1A14]" style={{ fontWeight: 500 }}>
                Dudas frecuentes antes de consultar
              </h2>
            </div>
            <p className="font-body text-[15px] text-[#3D352B] leading-relaxed">
              Las dudas más comunes que recibimos por WhatsApp. Si la tuya no está, escribinos igual: estamos para asesorarte.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <FaqSection />
          </Reveal>
        </div>
      </section>

      {/* UBICACIÓN — mapa SVG estilizado */}
      <section id="ubicacion" className="bg-[#F5F0E6] py-20 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <div className="text-[10px] font-body uppercase tracking-[0.3em] text-[#7A6E5E] mb-4">Ubicación</div>
            <h2 className="display-section font-display text-[34px] md:text-[44px] leading-[1.04] tracking-[-0.02em] text-[#1F1A14]" style={{ fontWeight: 500 }}>
              Estamos en Neuquén
            </h2>
            <p className="mt-6 font-body text-[15px] md:text-[16px] text-[#3D352B] leading-relaxed max-w-md">
              Atendemos en showroom y coordinamos entregas en toda la región.
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EDE5D4] flex items-center justify-center">
                  <MapPin size={16} strokeWidth={1.5} className="text-[#5A6B3F]" />
                </div>
                <div>
                  <div className="font-body text-[14px] text-[#1F1A14] leading-snug">Gral. Manuel Belgrano 3090</div>
                  <div className="font-body text-[13px] text-[#7A6E5E] leading-snug">Q8300 Neuquén Capital, Argentina</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EDE5D4] flex items-center justify-center">
                  <Clock size={16} strokeWidth={1.5} className="text-[#5A6B3F]" />
                </div>
                <div>
                  <div className="font-body text-[14px] text-[#1F1A14] leading-snug">Lun a Vie 8:30 – 18:00</div>
                  <div className="font-body text-[13px] text-[#7A6E5E] leading-snug">Sáb 9:00 – 13:00</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#EDE5D4] flex items-center justify-center">
                  <Phone size={16} strokeWidth={1.5} className="text-[#5A6B3F]" />
                </div>
                <div>
                  <div className="font-body text-[14px] text-[#1F1A14] leading-snug">WhatsApp</div>
                  <a href={heroWhatsAppLink} target="_blank" rel="noopener noreferrer"
                  className="font-body text-[13px] text-[#5A6B3F] hover:text-[#4A5832] transition leading-snug">
                    Escribinos por WhatsApp
                  </a>
                </div>
              </li>
            </ul>

            <a href="https://www.google.com/maps/search/Somos+Piedra+Belgrano+3090+Neuqu%C3%A9n" target="_blank" rel="noopener noreferrer"
            className="mt-10 group inline-flex items-center justify-center gap-2 bg-[#5A6B3F] hover:bg-[#4A5832] text-white font-medium text-[15px] px-6 py-3.5 rounded-full transition shadow-md shadow-black/10">
              <MapPin size={16} />
              Cómo llegar al showroom
              <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
            </a>
          </Reveal>

          <Reveal delay={100}>
            <a href="https://www.google.com/maps/search/Somos+Piedra+Belgrano+3090+Neuqu%C3%A9n" target="_blank" rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-square bg-[#1F1A14] group">
              {/* Foto real del frente del local — vivero en San Lorenzo y Güemes, Cinco Saltos */}
              <img src="/fotos/real/ubicacion-local-arboles.png" alt="Vivero Somos Piedra — frente del local con árboles y cartel sobre la avenida"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-700"
              style={{ filter: 'saturate(0.95) contrast(1.02)' }} />

              {/* Overlay sutil para que se lea el chip */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Chip ubicación */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-md">
                <MapPin size={14} className="text-[#5A6B3F]" />
                <span className="font-body text-[12px] font-medium text-[#1F1A14]">Belgrano 3090, Neuquén</span>
              </div>

              <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-md group-hover:bg-white transition">
                <span className="font-body text-[12px] font-medium text-[#1F1A14]">Abrir en Google Maps</span>
                <ArrowRight size={14} className="text-[#5A6B3F] group-hover:translate-x-0.5 transition" />
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1F1A14] text-[#F5F0E6] px-6 md:px-10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[1.6fr_1fr_1.2fr] gap-12 md:gap-16">
            <div className="max-w-sm">
              <SomosPiedraLogo size={28} color="#F5F0E6" stoneMid="#D4C9B5" showTagline={true} className="mb-5" />
              <p className="font-body font-light text-[14px] text-[#F5F0E6]/75 leading-relaxed">
                Piedra natural, lajas y revestimientos para obras y hogares en Neuquén. Asesoramos antes de vender.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <Stars n={4} size={13} />
                <span className="font-body text-[12px] text-[#F5F0E6]/65">4,4 · 22 reseñas en Google</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 font-body text-[13.5px]">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5F0E6]/45 mb-2">Navegar</span>
              <a href="#productos" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">Productos</a>
              <a href="#aplicaciones" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">Usos</a>
              <a href="#proceso" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">Proceso</a>
              <a href="#cotizacion" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">Cotización</a>
              <a href="#instagram" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">Instagram</a>
              <a href="#opiniones" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">Opiniones</a>
              <a href="#faq" className="text-[#F5F0E6]/80 hover:text-[#A8B97F] transition w-fit">FAQ</a>
            </div>
            <div className="flex flex-col gap-3 font-body text-[13.5px]">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#F5F0E6]/45 mb-2">Contacto</span>
              <div className="flex items-start gap-3">
                <MapPin size={14} strokeWidth={1.5} className="text-[#A8B97F] mt-1 flex-shrink-0" />
                <a href="https://www.google.com/maps/search/Somos+Piedra+Belgrano+3090+Neuqu%C3%A9n" target="_blank" rel="noopener noreferrer"
                  className="text-[#F5F0E6]/85 hover:text-[#A8B97F] transition leading-snug">
                  Gral. Manuel Belgrano 3090<br /><span className="text-[#F5F0E6]/55 text-[12.5px]">Neuquén Capital, Argentina</span>
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={14} strokeWidth={1.5} className="text-[#A8B97F] mt-1 flex-shrink-0" />
                <span className="text-[#F5F0E6]/85 leading-snug">
                  Lun a Vie 8:30 – 18:00<br /><span className="text-[#F5F0E6]/55 text-[12.5px]">Sáb 9:00 – 13:00</span>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle size={14} strokeWidth={1.5} className="text-[#A8B97F] mt-1 flex-shrink-0" />
                <a href={heroWhatsAppLink} target="_blank" rel="noopener noreferrer"
                  className="text-[#F5F0E6]/85 hover:text-[#A8B97F] transition leading-snug">
                  Escribinos por WhatsApp
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Instagram size={14} strokeWidth={1.5} className="text-[#A8B97F] mt-1 flex-shrink-0" />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                  className="text-[#F5F0E6]/85 hover:text-[#A8B97F] transition leading-snug">
                  @viverosomospiedra
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Facebook size={14} strokeWidth={1.5} className="text-[#A8B97F] mt-1 flex-shrink-0" />
                {/* TODO: reemplazar por URL real de Facebook */}
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
                  className="text-[#F5F0E6]/85 hover:text-[#A8B97F] transition leading-snug">
                  Somos Piedra
                </a>
              </div>
            </div>
          </div>
          <div className="mt-14 pt-6 border-t border-[#F5F0E6]/10 flex flex-col sm:flex-row justify-between gap-3">
            <p className="font-body text-[11px] text-[#F5F0E6]/45">© 2026 Somos Piedra · Elija Piedra SAS. Todos los derechos reservados.</p>
            <p className="font-body text-[11px] text-[#F5F0E6]/45">Gral. Manuel Belgrano 3090, Neuquén · Argentina</p>
          </div>
        </div>
      </footer>

      {/* Sticky contextual CTA — cambia copy según la sección visible. Oculto si ya está en cotización. */}
      {(() => {
        const ctaCopy = {
          top: 'Pedir asesoramiento',
          productos: 'Consultar materiales',
          aplicaciones: 'Pedir asesoramiento',
          instagram: 'Consultar lo del feed',
          opiniones: 'Pedí tu cotización',
          proceso: 'Empezar mi proyecto',
          faq: 'Hacer una consulta',
          ubicacion: 'Visitar el showroom'
        };
        const ctaMsg = {
          top: 'Hola Somos Piedra, quiero asesoramiento sobre un proyecto.',
          productos: 'Hola Somos Piedra, vi el catálogo y quiero consultar por algunos materiales.',
          aplicaciones: 'Hola Somos Piedra, vi los usos y quiero asesoramiento.',
          instagram: 'Hola Somos Piedra, vi el Instagram y quería consultar por productos.',
          opiniones: 'Hola Somos Piedra, quiero pedir una cotización.',
          proceso: 'Hola Somos Piedra, quiero empezar a ver opciones para mi proyecto.',
          faq: 'Hola Somos Piedra, tengo una consulta sobre piedras.',
          ubicacion: 'Hola Somos Piedra, quiero coordinar una visita al showroom.'
        };
        const sec = activeSection in ctaCopy ? activeSection : 'top';
        const copy = ctaCopy[sec];
        const link = buildWhatsAppLink(ctaMsg[sec]);
        const visible = scrollY > 350 && activeSection !== 'cotizacion';
        return (
          <a href={link} target="_blank" rel="noopener noreferrer" aria-label={copy}
            className={`fixed z-50 bg-[#5A6B3F] hover:bg-[#4A5832] text-white rounded-full shadow-xl shadow-black/30 transition-all duration-500 flex items-center gap-2.5
              bottom-5 right-5 md:bottom-7 md:right-7
              pl-5 pr-5 md:pl-5 md:pr-6 py-3.5
              ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <MessageCircle size={18} className="text-white flex-shrink-0" strokeWidth={2} />
            <span className="font-body font-medium text-[13.5px] hidden sm:inline whitespace-nowrap">{copy}</span>
            <ArrowRight size={15} className="hidden sm:inline opacity-80" />
          </a>
        );
      })()}
    </div>);

}

export default SomosPiedraLanding;
