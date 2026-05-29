import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Edit3, Plus, Laptop, Tag, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ExternalLink, X, RotateCw, Globe, ArrowUpRight, Sparkles, Play, Pause,
  Code, GraduationCap, Briefcase, Wrench, Layers, Sliders, Flame, Check, HelpCircle
} from 'lucide-react';
import { SoftwareCategory } from '../types';
import AnimateIn from './AnimateIn';

interface SkillsViewProps {
  skillsText: string;
  softwareCategories: SoftwareCategory[];
  isEditing: boolean;
  onEditSkillsText: () => void;
  onEditSoftwareCategory: (category: SoftwareCategory) => void;
  onAddSoftwareCategory: () => void;
  experienceContent?: React.ReactNode;
}

// Interactive educational web screenshot targets with descriptions
const CATEGORY_SHOWCASES: Record<string, { name: string; url: string; image: string; desc: string; }[]> = {
  soft_1: [
    {
      name: 'Certificación en Microsoft Office',
      url: 'https://www.microsoft.com/es-mx/microsoft-365',
      image: '/src/assets/images/office365_cloud_1779736162502.png',
      desc: 'Certificación profesional que avala competencia experta en el uso de herramientas de productividad líderes de Microsoft (Word, Excel Avanzado y PowerPoint).'
    },
    {
      name: 'Excel avanzado',
      url: 'https://www.microsoft.com/es-mx/microsoft-365/excel',
      image: '/src/assets/images/excel_screenshot_1779734040319.png',
      desc: 'Planificador de hojas de cálculo con tablas dinámicas, automatización de datos mediante macros, análisis y gráficos de alta precisión.'
    },
    {
      name: 'Open Office',
      url: 'https://www.openoffice.org/es/',
      image: '/src/assets/images/openoffice_screenshot_1779739230761.png',
      desc: 'Suite de productividad y oficina libre de código abierto con procesador de textos de grado educativo, hoja de cálculo y diagramación.'
    },
    {
      name: 'Libre Ofice',
      url: 'https://www.libreoffice.org',
      image: '/src/assets/images/libreoffice_screenshot_1779734966577.png',
      desc: 'Suite ofimática libre líder de código abierto para gestionar textos, hojas de cálculo, presentaciones y bases de datos con compatibilidad absoluta.'
    },
    {
      name: 'Google Docs',
      url: 'https://docs.google.com',
      image: '/src/assets/images/google_docs_suite_1779736306233.png',
      desc: 'Procesador de textos colaborativo basado en la nube que permite estructurar portafolios de evidencias grupales e interconexión escolar.'
    },
    {
      name: 'Canva',
      url: 'https://www.canva.com',
      image: '/src/assets/images/canva_dashboard_screenshot_1779736639537.png',
      desc: 'Suite creativa en línea para diseño rápido de reportes interactivos, infografías profesionales e identidades visuales didácticas.'
    },
    {
      name: 'Prezi',
      url: 'https://prezi.com',
      image: '/src/assets/images/prezi_screenshot_1779737055350.png',
      desc: 'Plataforma interactiva de presentaciones con zooms dinámicos y narrativa visual no lineal, ideal para captar atención en cursos.'
    },
    {
      name: 'Genialy',
      url: 'https://genial.ly',
      image: '/src/assets/images/genially_screenshot_1779737073630.png',
      desc: 'Herramienta de diseño interactivo para crear infografías animadas, contenidos interactivos, laboratorios de gamificación y material didáctico.'
    },
    {
      name: 'QR',
      url: 'https://es.qr-code-generator.com',
      image: '/src/assets/images/qr_screenshot_1779734950843.png',
      desc: 'Generación, rastreo y personalización de Códigos QR interactivos para enlazar recursos dinámicos, actividades gamificadas y portafolios escolares.'
    }
  ],
  soft_2: [
    {
      name: 'MOODLE',
      url: 'https://moodle.org',
      image: '/src/assets/images/moodle_screenshot_1779726805076.png',
      desc: 'Entorno de aprendizaje virtual y aula digital para gestionar clases en línea, estructurar cursos y alojar recursos interactivos de forma oficial.',
    },
    {
      name: 'Thatquiz',
      url: 'https://www.thatquiz.org',
      image: '/src/assets/images/thatquiz_screenshot_1779738352962.png',
      desc: 'Canal educativo ágil de exámenes autoevaluados de matemáticas, geografía y ciencias que permite medir el avance de los alumnos en tiempo real.',
    },
    {
      name: 'Google Classroom',
      url: 'https://classroom.google.com',
      image: '/src/assets/images/classroom_screenshot_1779738366742.png',
      desc: 'Centralizador pedagógico interactivo de Google para compartir tareas, interactuar vía foro con estudiantes y archivar portafolios de evidencias.',
    },
    {
      name: 'ClassDojo',
      url: 'https://www.classdojo.com',
      image: '/src/assets/images/classdojo_screenshot_1779738382193.png',
      desc: 'Comunidad escolar participativa de recompensas y asignación de estrellas digitales formativas representadas por avatares interactivos.',
    },
    {
      name: 'Tinkercad',
      url: 'https://www.tinkercad.com',
      image: '/src/assets/images/tinkercad_screenshot_1779726839847.png',
      desc: 'Plataforma en la nube de diseño 3D, simulación en tiempo real de circuitos electrónicos con microcontroladores Arduino y codificación lógica.',
    },
    {
      name: 'Scratch',
      url: 'https://scratch.mit.edu',
      image: '/src/assets/images/scratch_screenshot_1779726822365.png',
      desc: 'Entorno global del MIT de programabilidad visual mediante ensamble de bloques lógicos para diseñar juegos y animaciones dinámicas.',
    },
    {
      name: 'AppInventor',
      url: 'https://appinventor.mit.edu',
      image: '/src/assets/images/appinventor_screenshot_1779738396872.png',
      desc: 'Generador visual intuitivo de lógica de bloques móviles para la concepción y empaquetado de aplicaciones Android funcionales.',
    },
    {
      name: 'Kahoot',
      url: 'https://kahoot.com',
      image: '/src/assets/images/kahoot_screenshot_1779726856154.png',
      desc: 'Universo didáctico lúdico de trivias competitivas y cuestionarios interactivos de opción múltiple para gamificación inside the classroom.',
    },
    {
      name: 'Blooket',
      url: 'https://www.blooket.com',
      image: '/src/assets/images/blooket_screenshot_1779738411507.png',
      desc: 'Plataforma de juego competitivo educativo que transforma los cuestionarios en misiones de acumulación de puntos y acción inmersiva.',
    },
    {
      name: 'MathQuiz',
      url: 'https://mathquiz.io',
      image: '/src/assets/images/mathquiz_screenshot_1779738431443.png',
      desc: 'Evaluador digital interactivo para la práctica ágil de aritmética, álgebra y estimaciones mentales complejas a contrarreloj.',
    },
    {
      name: 'Wayground',
      url: 'https://wayground.com',
      image: '/src/assets/images/wayground_screenshot_1779738445330.png',
      desc: 'Entorno interactivo para simular experimentos y explorar teorías de ingeniería industrial y lógica analítica.',
    },
    {
      name: 'Socrative',
      url: 'https://socrative.com',
      image: '/src/assets/images/socrative_screenshot_1779738458499.png',
      desc: 'Herramienta ágil de quizzes rápidos, ticket de salida formativo y encuestas colaborativas con reportes inmediatos descargables.',
    },
    {
      name: 'DeckToys',
      url: 'https://deck.toys',
      image: '/src/assets/images/decktoys_screenshot_1779738472218.png',
      desc: 'Creador de rutas pedagógicas gamificadas basadas en mapas de retos y desafíos virtuales para aprendizaje guiado.',
    },
    {
      name: 'Mobbyt',
      url: 'https://mobbyt.com',
      image: '/src/assets/images/mobbyt_screenshot_1779738488213.png',
      desc: 'Servicio web para programar videojuegos educativos sencillos y compartirlos instantáneamente en una comunidad internacional.'
    }
  ],
  soft_3: [
    {
      name: 'Python',
      url: 'https://www.python.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f8fafc" /><g transform="translate(320, 180) scale(2.2)"><path d="M-20,-30 C-40,-30 -40,-10 -20,-10 L-10,-10 L-10,0 C-10,20 10,20 10,0 L10,-10 L0,-10 C-15,-10 -15,-20 -15,-25 Z" fill="%2338bdf8" /><path d="M20,30 C40,30 40,10 20,10 L10,10 L10,0 C10,-20 -15,-20 -15,0 L-15,10 L0,10 C15,10 15,20 15,25 Z" fill="%23f59e0b" /><circle cx="-7" cy="-20" r="3" fill="white" /><circle cx="7" cy="20" r="3" fill="white" /></g></svg>',
      desc: 'Lenguaje de propósito general centrado en la legibilidad del código. Empleado activamente para guiones de automatización, análisis predictivo de datos e IA.'
    },
    {
      name: 'Arduino IDE',
      url: 'https://www.arduino.cc',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23ecfdf5" /><g transform="translate(320, 180) scale(2.2)" fill="none" stroke="%2300979d" stroke-width="8"><path d="M-22,0 C-38,-16 -54,0 -38,16 C-22,32 -6,0 -22,0 Z M22,0 C38,-16 54,0 38,16 C22,32 6,0 22,0 Z" /><text x="-22" y="5" fill="%2300979d" font-family="sans-serif" font-size="14" font-weight="bold" stroke="none" text-anchor="middle">+</text><text x="22" y="4" fill="%2300979d" font-family="sans-serif" font-size="14" font-weight="bold" stroke="none" text-anchor="middle">-</text></g></svg>',
      desc: 'Interfaz oficial para estructurar y subir código de control binariizado a microcontroladores y sensores con un enfoque altamente práctico.'
    },
    {
      name: 'HTML',
      url: 'https://developer.mozilla.org/es/docs/Web/HTML',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fff7ed" /><g transform="translate(320, 180) scale(2.2)"><path d="M-30,-45 L30,-45 L25,18 L0,30 L-25,18 Z" fill="%23e34f26" /><path d="M0,-45 L25,-45 L20,18 L0,30 Z" fill="%23f06529" /><path d="M-15,-20 L0,-20 L0,-10 L-14,-10 L-13,5 L0,5 L0,15 L-10,11 L-11,2 Z" fill="%23ebebeb" /><path d="M15,-20 L0,-20 L0,-10 L15,-10 L14,5 L0,5 L0,15 L10,11 L11,2 Z" fill="%23ffffff" /></g></svg>',
      desc: 'Lenguaje de marcación base de la web semántica, habilitando la maquetación y la entrega estructurada de información multiplataforma.'
    },
    {
      name: 'CSS',
      url: 'https://developer.mozilla.org/es/docs/Web/CSS',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0f9ff" /><g transform="translate(320, 180) scale(2.2)"><path d="M-30,-45 L30,-45 L25,18 L0,30 L-25,18 Z" fill="%231572b6" /><path d="M0,-45 L25,-45 L20,18 L0,30 Z" fill="%2333a9dc" /><path d="M-15,-20 L0,-20 L0,-10 L-14,-10 L-13,5 L0,5 L0,15 L-10,11 L-11,2 Z" fill="%23ebebeb" /><path d="M15,-20 L0,-20 L0,-10 L15,-10 L14,5 L0,5 L0,15 L10,11 L11,2 Z" fill="%23ffffff" /></g></svg>',
      desc: 'Estándar de estilos en cascada para refinar tipografías, grillas responsivas y transiciones interactivas en todo tipo de pantallas.'
    },
    {
      name: 'PHP',
      url: 'https://v3.php.net',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f5f3ff" /><g transform="translate(320, 180) scale(2.5)"><ellipse cx="0" cy="0" rx="36" ry="20" fill="%23777bb4" /><ellipse cx="0" cy="0" rx="31" ry="16" fill="%234f5b93" /><text x="0" y="6" fill="%23ffffff" font-family="sans-serif" font-size="18" font-weight="900" font-style="italic" text-anchor="middle">php</text></g></svg>',
      desc: 'Lenguaje de programación del lado del servidor idóneo para el desarrollo web dinámico y la interconexión con sistemas de gestión de bases de datos.'
    },
    {
      name: 'SQL',
      url: 'https://www.mysql.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f8fafc" /><g transform="translate(320, 180) scale(2.2)" fill="none" stroke="%2338bdf8" stroke-width="4"><ellipse cx="0" cy="-20" rx="30" ry="12" fill="%230284c7" stroke="%230284c7" /><path d="M-30,-20 L-30,0 A30,12 0 0,0 30,0 L30,-20" fill="%230369a1" stroke="%230369a1" /><path d="M-30,0 L-30,20 A30,12 0 0,0 30,20 L30,0" fill="%23075985" stroke="%23075985" /><ellipse cx="0" cy="0" rx="30" ry="12" /><ellipse cx="0" cy="20" rx="30" ry="12" /></g></svg>',
      desc: 'Lenguaje estándar de consulta estructurada para administrar, consultar y salvaguardar información almacenada en bases de datos relacionales.'
    },
    {
      name: 'JavaScript',
      url: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fef08a" /><g transform="translate(320, 180) scale(2.4)"><rect x="-24" y="-24" width="48" height="48" fill="%23f7df1e" rx="4" /><text x="14" y="16" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="950" text-anchor="end">JS</text></g></svg>',
      desc: 'Lenguaje de scripting dinámico para configurar animaciones enriquecidas en frontend e itinerarios interactivos en navegadores modernos.'
    },
    {
      name: 'Java',
      url: 'https://www.java.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fffaf8" /><g transform="translate(320, 180) scale(2.0)"><path d="M-30,-15 L20,-15 Q20,15 10,25 Q0,30 -10,30 Q-20,30 -30,20 Z" fill="%23f37021" /><path d="M20,-7 C30,-7 30,10 20,10" fill="none" stroke="%23f37021" stroke-width="5" stroke-linecap="round" /><path d="M-15,-35 Q-10,-22 -15,-10" fill="none" stroke="%235382a1" stroke-width="4" stroke-linecap="round" /><path d="M-2,-38 Q3,-25 -2,-13" fill="none" stroke="%23f37021" stroke-width="4" stroke-linecap="round" /><path d="M10,-35 Q15,-22 10,-10" fill="none" stroke="%235382a1" stroke-width="4" stroke-linecap="round" /></g></svg>',
      desc: 'Paradigma robusto orientado a objetos idóneo para capacitar estudiantes en lógica computacional estructurada y portabilidad universal de software.'
    },
    {
      name: 'AppInventor',
      url: 'https://appinventor.mit.edu',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23faf5ff" /><g transform="translate(320, 170) scale(2.0)"><rect x="-20" y="-10" width="40" height="40" rx="10" fill="%23a4c639" /><circle cx="-20" cy="10" r="10" fill="%23a4c639" /><circle cx="20" cy="10" r="10" fill="%23a4c639" /><rect x="-18" y="35" width="8" height="15" rx="4" fill="%23a4c639" /><rect x="10" y="35" width="8" height="15" rx="4" fill="%23a4c639" /><path d="M-15,-10 A15,15 0 0,1 15,-10" fill="%23a4c639" /><circle cx="-7" cy="-17" r="2" fill="white" /><circle cx="7" cy="-17" r="2" fill="white" /><line x1="-10" y1="-22" x2="-14" y2="-28" stroke="%23a4c639" stroke-width="2.5" /><line x1="10" y1="-22" x2="14" y2="-28" stroke="%23a4c639" stroke-width="2.5" /></g></svg>',
      desc: 'Entorno de desarrollo visual de bloques diseñado por el MIT para aproximar a los alumnos al desarrollo rápido de aplicaciones móviles para Android.'
    },
    {
      name: 'C#',
      url: 'https://learn.microsoft.com/es-es/dotnet/csharp/',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fdf4ff" /><g transform="translate(320, 180) scale(2.4)"><polygon points="0,-25 22,-12 22,12 0,25 -22,12 -22,-12" fill="%239333ea" /><text x="0" y="7" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="950" text-anchor="middle">C#</text></g></svg>',
      desc: 'Lenguaje moderno y orientado a objetos de Microsoft, robusto y muy empleado en entornos empresariales, simulación docente y videojuegos con Unity.'
    },
    {
      name: 'C++',
      url: 'https://isocpp.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0fdf4" /><g transform="translate(320, 180) scale(2.4)"><circle cx="0" cy="0" r="25" fill="%23004482" /><text x="0" y="6" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="950" text-anchor="middle">C++</text></g></svg>',
      desc: 'Lenguaje de alto rendimiento híbrido diseñado para brindar control directo sobre recursos de hardware, embebidos avanzados y velocidad de compilación.'
    },
    {
      name: 'TypeScript',
      url: 'https://www.typescriptlang.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0f9ff" /><g transform="translate(320, 180) scale(2.4)"><rect x="-24" y="-24" width="48" height="48" fill="%233178c6" rx="4" /><text x="14" y="16" fill="%23ffffff" font-family="sans-serif" font-size="18" font-weight="950" text-anchor="end">TS</text></g></svg>',
      desc: 'Superset tipado de JavaScript que añade tipado estático y herramientas avanzadas para el desarrollo a gran escala.'
    },
    {
      name: 'Rust',
      url: 'https://www.rust-lang.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fdf4ff" /><g transform="translate(320, 180) scale(2.2)"><circle cx="0" cy="0" r="22" fill="none" stroke="%23000000" stroke-width="4" stroke-dasharray="4,2" /><polygon points="0,-16 11,-8 11,8 0,16 -11,8 -11,-8" fill="none" stroke="%23000000" stroke-width="3" /><text x="0" y="7" fill="%23000000" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">R</text></g></svg>',
      desc: 'Lenguaje de programación enfocado en la seguridad de memoria, concurrencia y alto rendimiento, ideal para sistemas.'
    },
    {
      name: 'Go',
      url: 'https://go.dev',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0fdfa" /><g transform="translate(320, 180) scale(2.2)"><text x="0" y="8" fill="%2300add8" font-family="sans-serif" font-size="24" font-weight="950" font-style="italic" text-anchor="middle">Go</text></g></svg>',
      desc: 'Lenguaje de programación de código abierto desarrollado por Google, diseñado para construir software simple, confiable y eficiente.'
    },
    {
      name: 'Kotlin',
      url: 'https://kotlinlang.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23faf5ff" /><g transform="translate(320, 180) scale(2.2)"><polygon points="-20,20 20,20 0,0" fill="%237f52ff" /><polygon points="-20,-20 -20,20 0,0" fill="%23f88909" /><polygon points="20,20 0,0 20,-20 -20,-20" fill="%23e10071" opacity="0.85" /></g></svg>',
      desc: 'Lenguaje de programación pragmático de tipado estático de JetBrains, altamente usado para el desarrollo ágil de aplicaciones Android.'
    },
    {
      name: 'Swift',
      url: 'https://www.swift.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fff7ed" /><g transform="translate(320, 180) scale(2.2)"><path d="M-20,15 C-10,15 10,5 20,-10 C10,-15 -10,-15 -20,-5 C-15,5 -5,10 -20,15 Z" fill="%23f05138" /><path d="M-10,5 C0,0 12,-10 18,-18 C8,-15 -8,-10 -15,-2 C-12,5 -5,8 -10,5 Z" fill="%23f05138" opacity="0.85" /></g></svg>',
      desc: 'Lenguaje rápido, seguro e intuitivo de Apple para el desarrollo nativo de aplicaciones iOS, macOS, watchOS y tvOS.'
    },
    {
      name: 'Ruby',
      url: 'https://www.ruby-lang.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fff5f5" /><g transform="translate(320, 180) scale(2.2)"><polygon points="-20,-5 0,-20 20,-5 10,15 -10,15" fill="%23cc342d" /><polygon points="-10,15 10,15 0,20" fill="%239e1a14" /><polygon points="0,-20 10,-5 -10,-5" fill="%23e54b44" /></g></svg>',
      desc: 'Lenguaje de programación dinámico y de código abierto enfocado en la simplicidad y la productividad con una sintaxis elegante.'
    },
    {
      name: 'Git',
      url: 'https://git-scm.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fdf2f8" /><g transform="translate(320, 180) scale(2.2)"><rect x="-20" y="-20" width="40" height="40" rx="6" fill="%23f03c2e" transform="rotate(45)" /><circle cx="0" cy="10" r="4" fill="white" /><circle cx="0" cy="-10" r="4" fill="white" /><circle cx="10" cy="0" r="4" fill="white" /><line x1="0" y1="-10" x2="0" y2="10" stroke="white" stroke-width="4" /><line x1="0" y1="0" x2="10" y2="0" stroke="white" stroke-width="4" /></g></svg>',
      desc: 'Sistema de control de versiones distribuido gratuito y de código abierto diseñado para manejar proyectos grandes y pequeños con rapidez.'
    },
    {
      name: 'Visual C',
      url: 'https://learn.microsoft.com/es-es/cpp/windows/visual-cpp-in-visual-studio',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%231e1e24" /><g transform="translate(320, 180) scale(2.2)"><polygon points="-15,-20 15,-20 20,-10 20,10 15,20 -15,20 -20,10 -20,-10" fill="%235c2d91" /><text x="0" y="7" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="900" text-anchor="middle">VC++</text></g></svg>',
      desc: 'Entorno de desarrollo integral y compilador de Microsoft optimizado para la creación de aplicaciones nativas de alto rendimiento en C/C++.'
    },
    {
      name: 'Basic',
      url: 'https://es.wikipedia.org/wiki/BASIC',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%230f172a" /><g transform="translate(320, 180) scale(2.0)"><text x="0" y="8" fill="%2338bdf8" font-family="monospace" font-size="24" font-weight="900" text-anchor="middle">BASIC</text></g></svg>',
      desc: 'Lenguaje de programación de alto nivel clásico, idóneo para adiestrar estudiantes en lógica de flujo secuencial y algoritmos estructurados.'
    },
    {
      name: 'Visual Basic',
      url: 'https://learn.microsoft.com/es-es/dotnet/visual-basic/',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0f7ff" /><g transform="translate(320, 180) scale(2.4)"><rect x="-24" y="-24" width="48" height="48" fill="%231070b4" rx="4" /><text x="0" y="7" fill="%23ffffff" font-family="sans-serif" font-size="16" font-weight="950" text-anchor="middle">VB</text></g></svg>',
      desc: 'Plataforma guiada por eventos para el desarrollo rápido de interfaces y aplicaciones de sobremesa mediante el de Microsoft.'
    },
    {
      name: 'Delphi',
      url: 'https://www.embarcadero.com/es/products/delphi',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%237a1a1a" /><g transform="translate(320, 180) scale(2.2)"><circle cx="0" cy="0" r="24" fill="%23ffffff" /><text x="0" y="7" fill="%237a1a1a" font-family="sans-serif" font-size="18" font-weight="950" font-style="italic" text-anchor="middle">D</text></g></svg>',
      desc: 'Entorno de desarrollo rápido de aplicaciones (RAD) basado en el lenguaje Object Pascal, célebre por su eficiencia extrema en la compilación.'
    },
    {
      name: 'Pascal',
      url: 'https://es.wikipedia.org/wiki/Pascal_(lenguaje_de_comprobaci%C3%B3n)',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0fdf4" /><g transform="translate(320, 180) scale(2.4)"><ellipse cx="0" cy="0" rx="32" ry="18" fill="%2316a34a" /><text x="0" y="6" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="900" text-anchor="middle">Pascal</text></g></svg>',
      desc: 'Lenguaje de programación imperativo clásico y fuertemente tipado, estructurado idealmente para la formación de hábitos limpios en computación.'
    },
    {
      name: 'ASM',
      url: 'https://es.wikipedia.org/wiki/Lenguaje_ensamblador',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23020617" /><g transform="translate(320, 180) scale(2.0)"><text x="0" y="8" fill="%2322c55e" font-family="monospace" font-size="20" font-weight="950" text-anchor="middle">MOV AX, 1</text></g></svg>',
      desc: 'Lenguaje ensamblador de bajo nivel específico para cada arquitectura de microprocesador, otorgando un control absoluto del hardware.'
    },
    {
      name: 'WinASM',
      url: 'https://github.com/WinAsm-Studio/WinAsm',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%231e3a8a" /><g transform="translate(320, 180) scale(2.2)"><rect x="-24" y="-12" width="48" height="24" fill="%233b82f6" rx="4" /><text x="0" y="5" fill="%23ffffff" font-family="sans-serif" font-size="9" font-weight="900" text-anchor="middle">WinASM</text></g></svg>',
      desc: 'Entorno de desarrollo ágil (IDE) para escribir aplicaciones de 32-bits y drivers directamente en lenguaje ensamblador para Windows.'
    },
    {
      name: 'TASM',
      url: 'https://es.wikipedia.org/wiki/Turbo_Assembler',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%231e293b" /><g transform="translate(320, 180) scale(2.2)"><text x="0" y="8" fill="%23f59e0b" font-family="monospace" font-size="22" font-weight="950" text-anchor="middle">TASM</text></g></svg>',
      desc: 'El célebre Turbo Assembler de Borland para PC, valorado por su extraordinaria velocidad de ensamble y soporte de modo real de 16-bits.'
    },
    {
      name: 'Matlab',
      url: 'https://es.mathworks.com/products/matlab.html',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fffbeb" /><g transform="translate(320, 180) scale(2.2)"><path d="M-30,10 Q-10,-30 10,15 T30,-15" fill="none" stroke="%23ea580c" stroke-width="4" /><text x="0" y="22" fill="%23b45309" font-family="sans-serif" font-size="10" font-weight="950">MATLAB</text></g></svg>',
      desc: 'Entorno de computación científica y simulación enfocado en álgebra matricial, análisis de datos, visualización y algoritmos de ingeniería.'
    },
    {
      name: 'Linux',
      url: 'https://www.linux.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%2318181b" /><g transform="translate(320, 180) scale(2.2)"><circle cx="0" cy="4" r="22" fill="%23e4e4e7" /><circle cx="0" cy="5" r="18" fill="black" /><circle cx="0" cy="6" r="14" fill="%23ffffff" /><circle cx="-4" cy="3" r="2" fill="black" /><circle cx="4" cy="3" r="2" fill="black" /><path d="M-6,11 Q0,16 6,11" fill="none" stroke="black" stroke-width="1.5" /><ellipse cx="0" cy="18" rx="8" ry="3" fill="%23f97316" /></g></svg>',
      desc: 'Sistema operativo libre, robusto y de código abierto, constituyendo el estándar mundial para servidores locales y en la nube.'
    },
    {
      name: 'Unix',
      url: 'https://es.wikipedia.org/wiki/Unix',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%234c1d95" /><g transform="translate(320, 180) scale(2.2)"><text x="0" y="8" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="950" letter-spacing="1">UNIX</text></g></svg>',
      desc: 'Sistema operativo multiusuario y multitarea original, sobre el cual se asientan las bases del software moderno, redes e internet.'
    },
    {
      name: 'Windows',
      url: 'https://www.microsoft.com/es-mx/windows',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%2300bcf2" /><g transform="translate(320, 180) scale(2.2)"><g fill="%23ffffff"><rect x="-21" y="-21" width="19" height="19" /><rect x="2" y="-21" width="19" height="19" /><rect x="-21" y="2" width="19" height="19" /><rect x="2" y="2" width="19" height="19" /></g></g></svg>',
      desc: 'Sistema operativo de Microsoft enfocado en la interfaz gráfica intuitiva, garantizando la compatibilidad de software de usuario final.'
    },
    {
      name: 'VHDL',
      url: 'https://es.wikipedia.org/wiki/VHDL',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23065f46" /><g transform="translate(320, 180) scale(2.2)"><rect x="-24" y="-14" width="48" height="28" fill="none" stroke="%2334d399" stroke-width="2" /><text x="0" y="4" fill="%2334d399" font-family="monospace" font-size="11" font-weight="950" text-anchor="middle">VHDL</text></g></svg>',
      desc: 'Lenguaje de descripción de hardware de altísima precisión, idóneo para modelar, simular y programar matrices de puertas lógicas (FPGAs).'
    }
  ],
  soft_4: [
    {
      name: 'Google AI Studio',
      url: 'https://aistudio.google.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%230b0e14" /><rect width="640" height="40" fill="%23131722" /><circle cx="20" cy="20" r="8" fill="%231a73e8" /><path d="M 18,17 l4,3 -4,3 z" fill="white" /><text x="35" y="24" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Google AI Studio</text><rect x="520" y="8" width="100" height="24" rx="12" fill="%231a73e8" /><text x="570" y="24" fill="white" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">Obtener API Key</text><rect x="15" y="55" width="150" height="290" rx="6" fill="%23131722" stroke="%23232936" /><text x="25" y="75" fill="%2394a3b8" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">PROMPT DE SISTEMA</text><rect x="25" y="85" width="130" height="80" rx="4" fill="%230b0e14" /><text x="32" y="102" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9">Eres un docente de fisica interactivo. Explica con analogias cotidianas.</text><text x="25" y="195" fill="%2394a3b8" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">PARAMETROS</text><text x="25" y="215" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9">Modelo: gemini-1.5-flash</text><rect x="25" y="240" width="130" height="4" rx="2" fill="%23232936" /><circle cx="85" cy="242" r="5" fill="%231a73e8" /><text x="25" y="260" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9">Temperatura: 1.0</text><rect x="180" y="55" width="445" height="290" rx="6" fill="%23131722" stroke="%23232936" /><text x="195" y="80" fill="%231a73e8" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Prueba de Prompt (Chat)</text><rect x="195" y="100" width="415" height="45" rx="4" fill="%231d2331" /><text x="205" y="118" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Usuario:</text><text x="205" y="132" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9.5">Dame una analogia para el voltaje y la resistencia.</text><rect x="195" y="155" width="415" height="120" rx="4" fill="%230b0e14" /><text x="205" y="173" fill="%234ade80" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Modelo (Gemini):</text><text x="205" y="192" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9">1. Voltaje (Presion del agua): Es la fuerza de empuje.</text><text x="205" y="210" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9">2. Corriente (Caudal de agua): La cantidad de liquido que pasa.</text><text x="205" y="228" fill="%23cbd5e1" font-family="system-ui, sans-serif" font-size="9">3. Resistencia (Estrechamiento del tubo): Lo que frena el agua.</text><rect x="195" y="285" width="415" height="35" rx="18" fill="%231d2331" stroke="%23232936" /><text x="215" y="307" fill="%2394a3b8" font-family="system-ui, sans-serif" font-size="10">Escribe para chatear con el modelo...</text></svg>',
      desc: 'Entorno de desarrollo agil y prototipado rapido de Google para experimentar con modelos Gemini, ajustar prompts de sistema y exportar codigo limpio.'
    },
    {
      name: 'Cloude',
      url: 'https://claude.ai',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23faf8f5" /><rect width="180" height="360" fill="%23f7f4ed" /><rect x="15" y="20" width="150" height="30" rx="15" fill="%23e8e1d5" /><text x="75" y="38" fill="%23382f25" font-family="serif" font-size="11" font-weight="bold">Claude 3.5 Sonnet</text><text x="25" y="85" fill="%236e5f4f" font-family="sans-serif" font-size="9" font-weight="bold">ACTIVIDADES RECIENTES</text><rect x="25" y="100" width="130" height="22" rx="4" fill="%23e8e1d5" opacity="0.6" /><text x="35" y="114" fill="%23382f25" font-family="sans-serif" font-size="9.5">⚿ Programabilidad Arduino</text><text x="35" y="140" fill="%236e5f4f" font-family="sans-serif" font-size="9.5">📝 Rubrica de Evaluacion</text><text x="35" y="165" fill="%236e5f4f" font-family="sans-serif" font-size="9.5">⚗️ Experimento Termografia</text><rect x="180" y="0" width="460" height="40" fill="%23faf8f5" /><line x1="180" y1="40" x2="640" y2="40" stroke="%23e8e1d5" stroke-width="1" /><circle cx="210" cy="20" r="12" fill="%23d16b54" /><text x="206" y="24" fill="white" font-family="serif" font-weight="bold" font-size="11">C</text><text x="230" y="25" fill="%23382f25" font-family="serif" font-weight="bold" font-size="12">Conversacion Educativa</text><circle cx="215" cy="80" r="10" fill="%23e8e1d5" /><text x="211" y="84" fill="%23382f25" font-family="sans-serif" font-size="9" font-weight="bold">D</text><text x="235" y="75" fill="%23382f25" font-family="sans-serif" font-size="10" font-weight="bold">Docente</text><text x="235" y="90" fill="%234f4335" font-family="sans-serif" font-size="10">Dame un ejercicio de cinematica con solucion explicada paso a paso.</text><circle cx="215" cy="140" r="10" fill="%23d16b54" /><text x="212" y="144" fill="white" font-family="serif" font-size="9">C</text><text x="235" y="135" fill="%23d16b54" font-family="serif" font-weight="bold" font-size="10">Claude (IA)</text><rect x="235" y="150" width="370" height="130" rx="6" fill="%23ffffff" stroke="%23e8e1d5" /><text x="250" y="172" fill="%23382f25" font-family="sans-serif" font-size="11" font-weight="bold">Problema: Altura de caida libre</text><text x="250" y="195" fill="%234f4335" font-family="sans-serif" font-size="9.5">Un objeto se deja caer desde un puente y tarda 3 segundos en tocar el agua.</text><text x="250" y="215" fill="%234f4335" font-family="sans-serif" font-size="9.5">Formula: y = (1/2) * g * t²</text><text x="250" y="235" fill="%234f4335" font-family="sans-serif" font-size="9.5">Sustitucion: y = 0.5 * 9.81 m/s² * (3s)²</text><text x="250" y="255" fill="%231a5f20" font-family="sans-serif" font-size="10" font-weight="bold">Solucion: y = 44.15 metros de altura.</text><rect x="200" y="300" width="410" height="35" rx="18" fill="white" stroke="%23e8e1d5" stroke-width="1.5" /><text x="220" y="322" fill="%238c857b" font-family="sans-serif" font-size="11">Haz una pregunta de seguimiento a Claude...</text></svg>',
      desc: 'Asistente de inteligencia artificial avanzado desarrollado por Anthropic con altisima capacidad de razonamiento logico, redaccion estructurada y depuracion de codigo.'
    },
    {
      name: 'Meta AI',
      url: 'https://www.meta.ai',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23090a10" /><circle cx="320" cy="180" r="280" fill="%230c142b" opacity="0.3" /><path d="M 320,110 C 270,110 250,150 280,180 C 310,210 330,150 320,110 Z M 320,110 C 370,110 390,150 360,180 C 330,210 310,150 320,110 Z" fill="none" stroke="url(%23glowingRing)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" /><defs><linearGradient id="glowingRing" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300b4db" /><stop offset="50%" stop-color="%230083b0" /><stop offset="100%" stop-color="%23bdc3c7" /></linearGradient></defs><text x="320" y="225" fill="%23ffffff" font-family="sans-serif" font-size="18" font-weight="950" text-anchor="middle" letter-spacing="1">Meta AI</text><text x="320" y="242" fill="%2300b4db" font-family="sans-serif" font-size="10.5" text-anchor="middle" font-weight="bold">Potenciado por LLaMA</text><rect x="140" y="265" width="360" height="35" rx="18" fill="%23131722" stroke="%23232936" stroke-width="1.5" /><text x="170" y="287" fill="%2394a3b8" font-family="sans-serif" font-size="11">Pregunta lo que sea...</text><circle cx="475" cy="282" r="6" fill="%2300b4db" /><rect x="60" y="45" width="200" height="90" rx="8" fill="%23131722" opacity="0.75" stroke="%23232936" /><text x="75" y="70" fill="%23ffffff" font-family="sans-serif" font-size="10" font-weight="bold">Generacion de Imagenes</text><text x="75" y="90" fill="%2300b4db" font-family="sans-serif" font-size="9">Meta AI imagina: "Un atomo animado"</text><rect x="200" y="100" width="30" height="25" rx="4" fill="%2300b4db" opacity="0.8" /><text x="215" y="115" fill="white" font-family="sans-serif" font-weight="bold" font-size="10" text-anchor="middle">✓</text><rect x="380" y="45" width="200" height="90" rx="8" fill="%23131722" opacity="0.75" stroke="%23232936" /><text x="395" y="70" fill="%23ffffff" font-family="sans-serif" font-size="10" font-weight="bold">Busqueda en Tiempo Real</text><text x="395" y="90" fill="%23818c8c" font-family="sans-serif" font-size="8.5">"Resultados de Google y Bing..."</text><text x="395" y="110" fill="%2300b4db" font-family="sans-serif" font-size="9">✓ Respuestas precisas y citadas.</text></svg>',
      desc: 'Asistente de IA inteligente de Meta basado en el modelo LLaMA, ideal para automatizar resoluciones conceptuales, estructurar tareas escolares y responder consultas en tiempo real.'
    },
    {
      name: 'Gemini',
      url: 'https://gemini.google.com',
      image: '/src/assets/images/gemini_screenshot_1779734072167.png',
      desc: 'Inteligencia artificial multimodal avanzada de Google para formular código, estructurar proyectos docentes y optimizar el proceso de aprendizaje.'
    },
    {
      name: 'ChatGPT',
      url: 'https://chatgpt.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23202123" /><rect width="160" height="360" fill="%23171717" /><rect x="10" y="15" width="140" height="30" rx="4" fill="none" stroke="%234d4d4f" stroke-width="1" /><text x="25" y="34" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">+ New chat</text><rect x="10" y="60" width="140" height="25" rx="4" fill="%23212121" /><circle cx="20" cy="72" r="4" fill="%2310a37f" /><text x="32" y="76" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="10">Plan de Clase - Algebra</text><circle cx="20" cy="102" r="4" fill="%23a2a2a2" /><text x="32" y="106" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="10">Cuestionario Fracciones</text><circle cx="20" cy="132" r="4" fill="%23a2a2a2" /><text x="32" y="136" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="10">Dinamica de Integracion</text><rect x="160" y="0" width="480" height="40" fill="%23202123" /><text x="180" y="25" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">ChatGPT 4o</text><line x1="160" y1="40" x2="640" y2="40" stroke="%233f3f46" stroke-width="1" /><circle cx="195" cy="80" r="12" fill="%235436da" /><text x="191" y="84" fill="white" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">U</text><text x="220" y="75" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Docente</text><text x="220" y="92" fill="%23d1d1d6" font-family="system-ui, sans-serif" font-size="11">¿Como puedo introducir las ecuaciones cuadratica a alumnos de secundaria?</text><rect x="160" y="115" width="480" height="150" fill="%232f3136" opacity="0.4" /><circle cx="195" cy="140" r="12" fill="%2310a37f" /><path d="M191 137 h8 v6 h-8 z" fill="white" /><text x="220" y="135" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">ChatGPT</text><text x="220" y="155" fill="%23ececf1" font-family="system-ui, sans-serif" font-size="11" font-weight="600">Aqui tienes un enfoque didactico y dinamico:</text><text x="220" y="175" fill="%23d1d1d6" font-family="system-ui, sans-serif" font-size="10.5">1. Contexto real: Usa el tiro parabolico de un balon.</text><text x="220" y="195" fill="%23d1d1d6" font-family="system-ui, sans-serif" font-size="10.5">2. Visualizacion geometrica: Construye cuadrados fisicamente.</text><text x="220" y="215" fill="%23d1d1d6" font-family="system-ui, sans-serif" font-size="10.5">3. Transicion formal: Introduce ax2 + bx + c = 0 como un rompecabezas.</text><rect x="180" y="300" width="440" height="35" rx="18" fill="%2340414f" stroke="%23565869" stroke-width="1" /><text x="200" y="322" fill="%238e8ea0" font-family="system-ui, sans-serif" font-size="11">Escribe un mensaje para ChatGPT...</text></svg>',
      desc: 'Conversador inteligente experto y asistente virtual desarrollado por OpenAI para resolución de dudas complejas, redacción y código.'
    },
    {
      name: 'NotebookLM',
      url: 'https://notebooklm.google',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f8f9fa" /><rect width="640" height="45" fill="%23ffffff" /><line x1="0" y1="45" x2="640" y2="45" stroke="%23e9ecef" stroke-width="1" /><circle cx="25" cy="22" r="10" fill="%231a73e8" /><text x="20" y="26" fill="white" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">N</text><text x="45" y="26" fill="%23202124" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">NotebookLM</text><rect x="150" y="10" width="200" height="25" rx="12" fill="%23f1f3f4" /><text x="165" y="26" fill="%235f6368" font-family="system-ui, sans-serif" font-size="10">Clases de Estructuras e Ingenieria...</text><rect x="0" y="45" width="160" height="315" fill="%23f1f3f4" /><text x="15" y="70" fill="%235f6368" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" letter-spacing="1">FUENTES (2)</text><rect x="10" y="85" width="140" height="40" rx="6" fill="%23ffffff" stroke="%23dadce0" stroke-width="1" /><rect x="18" y="93" width="12" height="15" rx="1" fill="%23ea4335" /><text x="20" y="104" fill="white" font-family="system-ui, sans-serif" font-size="8" font-weight="bold">PDF</text><text x="36" y="100" fill="%23202124" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Lectura_Tension.pdf</text><text x="36" y="112" fill="%2370757a" font-family="system-ui, sans-serif" font-size="8">12 paginas • Guia teorica</text><rect x="10" y="132" width="140" height="40" rx="6" fill="%23ffffff" stroke="%23dadce0" stroke-width="1" /><rect x="18" y="140" width="12" height="15" rx="1" fill="%234285f4" /><text x="20" y="151" fill="white" font-family="system-ui, sans-serif" font-size="8" font-weight="bold">DOC</text><text x="36" y="147" fill="%23202124" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Notas_Clase.docx</text><text x="36" y="159" fill="%2370757a" font-family="system-ui, sans-serif" font-size="8">Apuntes del docente</text><rect x="160" y="45" width="300" height="315" fill="%23ffffff" /><text x="180" y="75" fill="%23185abc" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Guia de Estudio Generada</text><rect x="180" y="90" width="260" height="200" rx="8" fill="%23e8f0fe" stroke="%23d2e3fc" stroke-width="1" /><text x="195" y="115" fill="%231b66c4" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Resumen de Conceptos Clave</text><text x="195" y="135" fill="%23202124" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">1. Esfuerzo de Tension s</text><text x="208" y="150" fill="%235f6368" font-family="system-ui, sans-serif" font-size="9.5">Fuerza aplicada perpendicularmente.</text><text x="195" y="170" fill="%23202124" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">2. Modulo de Young E</text><text x="208" y="185" fill="%235f6368" font-family="system-ui, sans-serif" font-size="9.5">Mide la rigidez de un material elastico.</text><text x="195" y="210" fill="%231b66c4" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Preguntas sugeridas</text><text x="195" y="230" fill="%23202124" font-family="system-ui, sans-serif" font-size="9.5">- Explica la diferencia entre deformacion plastica y elastica.</text><rect x="460" y="45" width="180" height="315" fill="%23f8f9fa" /><line x1="460" y1="45" x2="460" y2="360" stroke="%23e9ecef" stroke-dasharray="3,3" /><text x="475" y="75" fill="%23202124" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Audio de Fondo</text><rect x="475" y="90" width="150" height="100" rx="8" fill="%23ffffff" stroke="%23dadce0" stroke-width="1" /><circle cx="550" cy="140" r="16" fill="%231a73e8" /><path d="M546 135 l10 5 -10 5 z" fill="white" /><text x="485" y="210" fill="%23202124" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Conversacion de Audio</text><text x="485" y="225" fill="%235f6368" font-family="system-ui, sans-serif" font-size="9">Genera una discusion tipo podcast.</text></svg>',
      desc: 'Asistente personal con IA de Google capaz de estructurar cuadernos de estudio, notas de clase complejas y resúmenes inteligentes a partir de PDFs o vídeos del curso.'
    },
    {
      name: 'Perplexity',
      url: 'https://www.perplexity.ai',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23191a1a" /><text x="30" y="40" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="16" font-weight="900">Perplexity</text><text x="50" y="80" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="14" font-weight="600">¿Que son las ondas electromagneticas y como se clasifican?</text><text x="50" y="110" fill="%23818c8c" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" letter-spacing="1">FUENTES</text><g transform="translate(50, 120)"><rect x="0" y="0" width="110" height="24" rx="4" fill="%23202222" stroke="%232a2e2e" /><text x="8" y="15" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">1</text><text x="20" y="15" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="9" font-weight="600">Wikipedia</text><rect x="120" y="0" width="110" height="24" rx="4" fill="%23202222" stroke="%232a2e2e" /><text x="128" y="15" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">2</text><text x="140" y="15" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="9" font-weight="600">NASA Science</text><rect x="240" y="0" width="110" height="24" rx="4" fill="%23202222" stroke="%232a2e2e" /><text x="248" y="15" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">3</text><text x="260" y="15" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="9" font-weight="600">Khan Academy</text></g><text x="50" y="170" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="12" font-weight="700">Respuesta Integrada</text><rect x="50" y="180" width="540" height="110" rx="8" fill="%23202222" opacity="0.6" stroke="%232a2e2e" /><text x="65" y="202" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="10.5">Las ondas electromagneticas son perturbaciones de energia que se propagan.</text><text x="65" y="222" fill="%23e8ecec" font-family="system-ui, sans-serif" font-size="10.5">Se clasifican segun su frecuencia en el espectro electromagnetico:</text><text x="80" y="242" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="10">• Ondas de radio y microondas [1]</text><text x="80" y="260" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="10">• Infrarrojo, luz visible y ultravioleta [2]</text><text x="80" y="278" fill="%2321c2a0" font-family="system-ui, sans-serif" font-size="10">• Rayos X y rayos gamma [3]</text><rect x="50" y="305" width="540" height="35" rx="18" fill="%23202222" stroke="%232d3131" stroke-width="1.5" /><text x="70" y="327" fill="%23818c8c" font-family="system-ui, sans-serif" font-size="11">Haz una pregunta de seguimiento...</text></svg>',
      desc: 'Buscador asombroso enriquecido con respuesta conversacional estructurada basada en citas y fuentes verificadas de internet en vivo.'
    },
    {
      name: 'NanoBanana',
      url: 'https://nanobanana.im',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fffef0" /><rect width="640" height="50" fill="%23ffe259" /><text x="30" y="32" fill="%23333333" font-family="system-ui, sans-serif" font-size="18" font-weight="900" letter-spacing="0.5">NanoBanana 🍌</text><text x="500" y="30" fill="%23333333" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Panel del Profesor</text><rect x="20" y="70" width="120" height="270" rx="10" fill="%23ffffff" stroke="%23f0ebc4" stroke-width="1.5" /><text x="35" y="100" fill="%238c8541" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">MATEMATICAS</text><rect x="30" y="115" width="100" height="25" rx="5" fill="%23fff9d6" /><text x="40" y="131" fill="%234d4400" font-family="system-ui, sans-serif" font-size="10.5" font-weight="bold">Algebra I</text><text x="35" y="165" fill="%238c8541" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">CIENCIAS</text><text x="40" y="190" fill="%23666666" font-family="system-ui, sans-serif" font-size="10.5">Cinematica</text><text x="40" y="215" fill="%23666666" font-family="system-ui, sans-serif" font-size="10.5">Dinamica</text><rect x="160" y="70" width="460" height="270" rx="10" fill="%23ffffff" stroke="%23f0ebc4" stroke-width="1.5" /><text x="180" y="100" fill="%23333333" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Generador de Problemas de Algebra</text><rect x="180" y="120" width="420" height="150" rx="8" fill="%23faf9f0" stroke="%23f2edbe" /><text x="195" y="145" fill="%236b642e" font-family="monospace" font-size="12" font-weight="bold">Problema Propuesto (Ecuacion Lineal):</text><text x="195" y="175" fill="%232b2812" font-family="sans-serif" font-size="11.5">"Determina el valor de x en la ecuacion: 3(x - 5) + 4 = 19"</text><text x="195" y="210" fill="%238c8230" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Desglose de solucion (Explicacion IA):</text><text x="210" y="230" fill="%235c572b" font-family="system-ui, sans-serif" font-size="9.5">Paso 1: Aplica distribucion: 3x - 15 + 4 = 19 =&gt; 3x - 11 = 19</text><text x="210" y="248" fill="%235c572b" font-family="system-ui, sans-serif" font-size="9.5">Paso 2: Suma 11 a ambos lados: 3x = 30 =&gt; x = 10</text><rect x="180" y="290" width="130" height="30" rx="15" fill="%234caf50" /><text x="202" y="309" fill="white" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Exportar a PDF</text><rect x="325" y="290" width="150" height="30" rx="15" fill="%23ffe259" stroke="%23dbbe34" /><text x="345" y="309" fill="%23333333" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Regenerar con IA</text></svg>',
      desc: 'Plataforma educativa con IA diseñada para personalizar materiales ágiles de matemáticas, ciencias e ingeniería y generar ejercicios interactivos alineados con el aula.'
    },
    {
      name: 'Photomath',
      url: 'https://photomath.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23fcfcfc" /><rect x="195" y="10" width="250" height="340" rx="20" fill="%231e1e24" stroke="%23e15a24" stroke-width="3" /><rect x="205" y="30" width="230" height="290" rx="10" fill="%23ffffff" /><rect x="215" y="40" width="210" height="120" rx="5" fill="%23f0f0f0" /><line x1="215" y1="100" x2="425" y2="100" stroke="%23ff4105" stroke-dasharray="2,2" /><text x="255" y="90" fill="%231e1e24" font-family="monospace" font-size="18" font-weight="bold">2x² - 8x + 6 = 0</text><path d="M 225,50 L 225,45 L 230,45" fill="none" stroke="%23ff4105" stroke-width="2" /><path d="M 415,50 L 415,45 L 410,45" fill="none" stroke="%23ff4105" stroke-width="2" /><path d="M 225,145 L 225,150 L 230,150" fill="none" stroke="%23ff4105" stroke-width="2" /><path d="M 415,145 L 415,150 L 410,150" fill="none" stroke="%23ff4105" stroke-width="2" /><rect x="205" y="30" width="230" height="25" fill="%23ff4105" /><text x="215" y="46" fill="white" font-family="sans-serif" font-size="10.5" font-weight="900">photomath</text><rect x="215" y="175" width="210" height="135" rx="8" fill="%23fff8f5" stroke="%23ffe5db" stroke-width="1.5" /><text x="225" y="195" fill="%23ff4105" font-family="system-ui, sans-serif" font-size="10.5" font-weight="bold">✓ Solucion paso a paso:</text><text x="225" y="215" fill="%23333333" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">Ecuacion original desglosada</text><text x="225" y="235" fill="%23666666" font-family="system-ui, sans-serif" font-size="8.5">1. Divide por 2: x² - 4x + 3 = 0</text><text x="225" y="250" fill="%23666666" font-family="system-ui, sans-serif" font-size="8.5">2. Factoriza: (x - 3)(x - 1) = 0</text><text x="225" y="265" fill="%23666666" font-family="system-ui, sans-serif" font-size="8.5">3. Raices encontradas:</text><rect x="225" y="275" width="35" height="15" rx="3" fill="%23ffefea" stroke="%23ffd9cc" /><text x="231" y="286" fill="%23ff4105" font-family="system-ui, sans-serif" font-size="8.5" font-weight="bold">x1 = 3</text><rect x="268" y="275" width="35" height="15" rx="3" fill="%23ffefea" stroke="%23ffd9cc" /><text x="274" y="286" fill="%23ff4105" font-family="system-ui, sans-serif" font-size="8.5" font-weight="bold">x2 = 1</text></svg>',
      desc: 'Herramienta con IA de reconocimiento visual que desglosa la resolución de problemas de cálculo, álgebra y aritmética paso a paso con animaciones explicativas.'
    },
    {
      name: 'Socratic',
      url: 'https://socratic.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%232d1d4c" /><circle cx="320" cy="180" r="280" fill="%234b3f72" opacity="0.4" /><circle cx="320" cy="65" r="22" fill="%23ffffff" /><circle cx="312" cy="62" r="6" fill="%232d1d4c" /><circle cx="328" cy="62" r="6" fill="%232d1d4c" /><polygon points="317,70 323,73 320,80" fill="%23ffb81c" /><text x="320" y="105" fill="white" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle" letter-spacing="1">SOCRATIC</text><text x="320" y="122" fill="%23d2c9ff" font-family="system-ui, sans-serif" font-size="10" text-anchor="middle" font-weight="bold">by Google</text><rect x="140" y="145" width="360" height="35" rx="18" fill="%23ffffff" /><text x="170" y="167" fill="%23666666" font-family="system-ui, sans-serif" font-size="11">¿Cual es la funcion del ciclo de Krebs en biologia?</text><circle cx="475" cy="162" r="6" fill="%234b3f72" /><rect x="100" y="195" width="440" height="135" rx="10" fill="%23ffffff" /><rect x="100" y="195" width="440" height="30" fill="%2300bcd4" rx="10" /><rect x="100" y="210" width="440" height="15" fill="%2300bcd4" /><text x="115" y="215" fill="white" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Biologia Celular • Explicacion</text><text x="115" y="245" fill="%232d1d4c" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Ciclo de Krebs (Ciclo del Acido Citrico)</text><text x="115" y="265" fill="%23444444" font-family="system-ui, sans-serif" font-size="10">Es una ruta metabolica clave realizada en la matriz mitocondrial.</text><text x="115" y="285" fill="%23444444" font-family="system-ui, sans-serif" font-size="10">Su funcion fundamental es:</text><text x="125" y="305" fill="%2300bcd4" font-family="system-ui, sans-serif" font-size="9.5" font-weight="bold">• Liberar energia almacenada a traves de la oxidacion del acetil-CoA.</text><text x="125" y="320" fill="%2300bcd4" font-family="system-ui, sans-serif" font-size="9.5" font-weight="bold">• Proveer precursores de aminoacidos y coenzimas (NADH, FADH₂).</text></svg>',
      desc: 'Iniciativa educativa de Google que guía de manera esquemática la solución conceptual de tareas científicas y matemáticas usando IA.'
    },
    {
      name: 'Microsoft Math Solver',
      url: 'https://math.microsoft.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f3f4f6" /><rect width="640" height="40" fill="%23ffffff" /><rect x="15" y="10" width="20" height="20" rx="4" fill="%230078d4" /><text x="21" y="24" fill="white" font-family="monospace" font-size="14" font-weight="bold">+</text><text x="45" y="25" fill="%23202124" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Microsoft Math Solver</text><line x1="0" y1="40" x2="640" y2="40" stroke="%23e5e7eb" stroke-width="1" /><rect x="10" y="50" width="280" height="300" rx="8" fill="%23ffffff" stroke="%23e5e7eb" /><text x="25" y="75" fill="%230078d4" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">RESOLVEDOR MATEMATICO</text><rect x="25" y="85" width="250" height="35" rx="5" fill="%23f9fafb" stroke="%23d1d5db" /><text x="35" y="107" fill="%23111827" font-family="monospace" font-size="13" font-weight="bold">y = sin(x) * x / 2</text><g transform="translate(25, 135)"><rect x="0" y="0" width="45" height="25" rx="3" fill="%23f3f4f6" /><text x="15" y="16" fill="%23374151" font-family="monospace" font-size="10">x²</text><rect x="50" y="0" width="45" height="25" rx="3" fill="%23f3f4f6" /><text x="65" y="16" fill="%23374151" font-family="monospace" font-size="10">√</text><rect x="100" y="0" width="45" height="25" rx="3" fill="%23f3f4f6" /><text x="112" y="16" fill="%23374151" font-family="monospace" font-size="10">sin</text><rect x="150" y="0" width="45" height="25" rx="3" fill="%23f3f4f6" /><text x="162" y="16" fill="%23374151" font-family="monospace" font-size="10">cos</text><rect x="200" y="0" width="50" height="25" rx="3" fill="%230078d4" /><text x="212" y="16" fill="white" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">Grafico</text></g><rect x="25" y="175" width="250" height="160" rx="5" fill="%23f0f7ff" stroke="%23c2e0ff" /><text x="35" y="195" fill="%23004e8c" font-family="system-ui, sans-serif" font-size="10.5" font-weight="bold">Analisis Grafico:</text><text x="35" y="215" fill="%23374151" font-family="system-ui, sans-serif" font-size="9.5">• Raices reales: x = 0</text><text x="35" y="235" fill="%23374151" font-family="system-ui, sans-serif" font-size="9.5">• Paridad: Impar f(-x) = -f(x)</text><text x="35" y="255" fill="%23374151" font-family="system-ui, sans-serif" font-size="9.5">• Derivada dy/dx:</text><text x="45" y="275" fill="%230078d4" font-family="monospace" font-size="9.5">(sin(x) + x*cos(x)) / 2</text><rect x="300" y="50" width="330" height="300" rx="8" fill="%23ffffff" stroke="%23e5e7eb" /><text x="315" y="75" fill="%23374151" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">Visualizacion Grafica en 2D</text><line x1="315" y1="200" x2="615" y2="200" stroke="%23d1d5db" stroke-width="1.5" /><line x1="465" y1="65" x2="465" y2="335" stroke="%23d1d5db" stroke-width="1.5" /><path d="M 315,200 Q 350,120 390,200 T 465,200 T 540,200 T 615,200" fill="none" stroke="%232563eb" stroke-width="2.5" /><path d="M 315,237 L 615,162" fill="none" stroke="%23ef4444" stroke-width="1" stroke-dasharray="3,3" /><path d="M 315,163 L 615,238" fill="none" stroke="%23ef4444" stroke-width="1" stroke-dasharray="3,3" /><circle cx="465" cy="200" r="4" fill="%23ef4444" /><text x="475" y="195" fill="%23ef4444" font-family="system-ui, sans-serif" font-size="8.5" font-weight="bold">Origen (0,0)</text></svg>',
      desc: 'Resolvedor inteligente gratuito basado en IA de Microsoft que asiste en el análisis gráfico, cómputo matricial e integrales con desglose didáctico completo.'
    }
  ],
  soft_5: [
    {
      name: 'SolidWorks',
      url: 'https://www.solidworks.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%230f172a" /><rect width="640" height="35" fill="%231e293b" /><circle cx="16" cy="18" r="5" fill="%23ef4444" /><circle cx="32" cy="18" r="5" fill="%23f59e0b" /><circle cx="48" cy="18" r="5" fill="%2310b981" /><text x="70" y="22" fill="%2394a3b8" font-family="sans-serif" font-size="11" font-weight="bold">SOLIDWORKS - [Pieza_Mecanica.SLDPRT]</text><rect x="0" y="35" width="150" height="325" fill="%231e293b" stroke="%23334155" /><text x="12" y="55" fill="%2338bdf8" font-family="sans-serif" font-size="9" font-weight="bold">ÁRBOL DE DISEÑO (3D)</text><g transform="translate(12, 75)" fill="%23f8fafc" font-family="sans-serif" font-size="10"><text x="0" y="10">⚙️ Pieza_Mecanica</text><text x="10" y="28" fill="%2394a3b8">📋 Historial</text><text x="10" y="46">📖 Alzado (X-Y)</text><text x="10" y="64">📖 Planta (X-Z)</text><text x="10" y="82" fill="%2338bdf8" font-weight="bold">⚿ Extruir-Base1</text><text x="20" y="100" fill="%2394a3b8">↳ ✏️ Croquis1</text></g><rect x="160" y="45" width="470" height="305" rx="4" fill="%23020617" stroke="%231e293b" /><g transform="translate(400, 190)"><polygon points="-100,30 0,70 100,20 0,-20" fill="%23334155" stroke="%2364748b" stroke-width="2" /><path d="M -30,-15 C -30,-30 30,-50 30,-35 L 30,30 C 30,45 -30,20 -30,5 Z" fill="%23475569" stroke="%2394a3b8" stroke-width="1.5" /><ellipse cx="0" cy="-35" rx="30" ry="10" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5" /><ellipse cx="0" cy="-35" rx="15" ry="5" fill="%23020617" stroke="%23475569" /><line x1="-100" y1="30" x2="-100" y2="45" stroke="%231e293b" /><line x1="0" y1="70" x2="0" y2="85" stroke="%231e293b" /><polygon points="-100,45 0,85 100,35 100,20" fill="%231e293b" opacity="0.5" /><line x1="-30" y1="5" x2="-80" y2="30" stroke="%230ea5e9" stroke-width="1" stroke-dasharray="3,2" /><text x="-70" y="15" fill="%2338bdf8" font-family="monospace" font-size="9">R=30.00</text></g></svg>',
      desc: 'Potente software de diseño mecánico paramétrico y simulación de esfuerzos para mecanizado guiado e impresión tridimensional de alta ingeniería.'
    },
    {
      name: 'AutoCAD',
      url: 'https://www.autodesk.com/products/autocad',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%2318191d" /><rect width="640" height="35" fill="%23212228" stroke="%232d2f36" /><rect x="10" y="6" width="22" height="22" rx="3" fill="%23ef4444" /><text x="16" y="22" fill="white" font-family="sans-serif" font-size="13" font-weight="bold">A</text><text x="40" y="20" fill="%2394a3b8" font-family="sans-serif" font-size="10.5">AutoCAD 2026 - [Plano_Planta.dwg]</text><rect x="10" y="45" width="480" height="270" rx="4" fill="%230c0d10" stroke="%232d2f36" /><g stroke="%231e293b" stroke-width="0.5" opacity="0.5"><line x1="10" y1="100" x2="490" y2="100" /><line x1="10" y1="160" x2="490" y2="160" /><line x1="10" y1="220" x2="490" y2="220" /><line x1="10" y1="280" x2="490" y2="280" /><line x1="100" y1="45" x2="100" y2="315" /><line x1="200" y1="45" x2="200" y2="315" /><line x1="300" y1="45" x2="300" y2="315" /><line x1="400" y1="45" x2="400" y2="315" /></g><g stroke="%234ade80" stroke-width="2.5" fill="none"><rect x="50" y="80" width="380" height="180" /><line x1="180" y1="80" x2="180" y2="260" /><line x1="180" y1="160" x2="300" y2="160" /></g><g stroke="%23eab308" stroke-width="1.5" fill="none"><line x1="80" y1="260" x2="80" y2="220" /><path d="M 80,220 A 40,40 0 0,1 120,260" stroke-dasharray="2,2" /></g><g stroke="%2306b6d4" stroke-width="1" fill="%2306b6d4" font-family="monospace" font-size="9"><line x1="50" y1="65" x2="430" y2="65" /><path d="M 50,62 L 50,68 M 430,62 L 430,68" /><text x="230" y="60" text-anchor="middle">15.00 m</text></g><g stroke="%23ffffff" stroke-width="0.8"><line x1="250" y1="45" x2="250" y2="315" stroke-dasharray="2,1" opacity="0.4" /><line x1="10" y1="150" x2="490" y2="150" stroke-dasharray="2,1" opacity="0.4" /><rect x="246" y="146" width="8" height="8" fill="none" stroke="%23f97316" /><circle cx="250" cy="150" r="2" fill="%23f97316" /></g><rect x="500" y="45" width="130" height="270" rx="4" fill="%23212228" stroke="%232d2f36" /><text x="510" y="65" fill="%2338bdf8" font-family="sans-serif" font-size="9" font-weight="bold">HERRAMIENTAS</text><g transform="translate(510, 80)" fill="%23cbd5e1" font-family="sans-serif" font-size="9"><text x="0" y="15">✏️ Línea (L)</text><text x="0" y="35">⭕ Círculo (C)</text><text x="0" y="55">📐 Acotación</text><text x="0" y="75" fill="%234ade80">● Capa: MUROS</text></g><rect x="10" y="322" width="620" height="28" rx="3" fill="%231e222a" stroke="%232d2f36" /><text x="20" y="340" fill="%2338bdf8" font-family="monospace" font-size="10" font-weight="bold">COMANDO: </text><text x="85" y="340" fill="white" font-family="monospace" font-size="10">_LINEA Precise primer punto:</text></svg>',
      desc: 'Herramienta histórica líder en dibujo técnico automatizado para planificar planos civiles, industriales y ensambles de ingeniería.'
    },
    {
      name: 'Tinkercad',
      url: 'https://www.tinkercad.com',
      image: '/src/assets/images/tinkercad_screenshot_1779726839847.png',
      desc: 'Plataforma interactiva en la nube para el diseño en modelado 3D, simulación de circuitos eléctricos interactivos y codificación en bloques lógicos.'
    },
    {
      name: 'SinuMERIK',
      url: 'https://www.siemens.com/es/es/productos/tecnologias/cnc/operator-software/sinutrain.html',
      image: '/src/assets/images/sinumerik_screenshot_1779735807090.png',
      desc: 'Control CNC premium e inteligente de Siemens para guiar el mecanizado exacto, fresado estructural avanzado y programación de torno de alta precisión.'
    },
    {
      name: 'Cura',
      url: 'https://ultimaker.com/software/ultimaker-cura',
      image: '/src/assets/images/cura_screenshot_1779735768183.png',
      desc: 'Impresionante software de laminación (slicer) 3D de código abierto idóneo para preparar modelos, definir densidades de filamento y lanzar impresiones 3D.'
    },
    {
      name: 'ReconstructMe',
      url: 'https://reconstructme.net',
      image: '/src/assets/images/reconstructme_screenshot_1779735785777.png',
      desc: 'Poderoso software de reconstrucción en tiempo real de modelos tridimensionales interactivos empleando sensores de cámara de profundidad estándar.'
    },
    {
      name: 'Proteus',
      url: 'https://www.labcenter.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23111622" /><rect width="640" height="35" fill="%231a2232" /><rect x="10" y="8" width="18" height="18" rx="3" fill="%232563eb" /><text x="15" y="21" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">P</text><text x="35" y="20" fill="%23cbd5e1" font-family="sans-serif" font-size="10.5">Proteus 9 - [Simple_LED_Blink.pdsprj]</text><rect x="10" y="45" width="480" height="270" rx="4" fill="%23090d16" stroke="%232d3d52" /><g fill="%23334155" opacity="0.3"><circle cx="50" cy="80" r="1" /><circle cx="100" cy="80" r="1" /><circle cx="150" cy="80" r="1" /><circle cx="200" cy="80" r="1" /><circle cx="250" cy="80" r="1" /><circle cx="300" cy="80" r="1" /><circle cx="350" cy="80" r="1" /><circle cx="400" cy="80" r="1" /><circle cx="450" cy="80" r="1" /><circle cx="50" cy="140" r="1" /><circle cx="100" cy="140" r="1" /><circle cx="150" cy="140" r="1" /><circle cx="200" cy="140" r="1" /><circle cx="250" cy="140" r="1" /><circle cx="300" cy="140" r="1" /><circle cx="350" cy="140" r="1" /><circle cx="400" cy="140" r="1" /><circle cx="450" cy="140" r="1" /><circle cx="50" cy="200" r="1" /><circle cx="100" cy="200" r="1" /><circle cx="150" cy="200" r="1" /><circle cx="200" cy="200" r="1" /><circle cx="250" cy="200" r="1" /><circle cx="300" cy="200" r="1" /><circle cx="350" cy="200" r="1" /><circle cx="400" cy="200" r="1" /><circle cx="450" cy="200" r="1" /><circle cx="50" cy="260" r="1" /><circle cx="100" cy="260" r="1" /><circle cx="150" cy="260" r="1" /><circle cx="200" cy="260" r="1" /><circle cx="250" cy="260" r="1" /><circle cx="300" cy="260" r="1" /><circle cx="350" cy="260" r="1" /><circle cx="400" cy="260" r="1" /><circle cx="450" cy="260" r="1" /></g><g transform="translate(180, 100)"><rect width="100" height="120" fill="%231e293b" stroke="%233b82f6" stroke-width="2" /><text x="50" y="20" fill="%2338bdf8" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">ATMEGA328P</text><line x1="-15" y1="40" x2="0" y2="40" stroke="%2394a3b8" /><text x="3" y="43" fill="%2394a3b8" font-family="monospace" font-size="8">7 VCC</text><line x1="-15" y1="80" x2="0" y2="80" stroke="%2394a3b8" /><text x="3" y="83" fill="%2394a3b8" font-family="monospace" font-size="8">8 GND</text><line x1="100" y1="60" x2="115" y2="60" stroke="%233b82f6" /><text x="65" y="63" fill="%2394a3b8" font-family="monospace" font-size="8">PB0/D8 14</text></g><g transform="translate(295, 150)"><line x1="0" y1="10" x2="20" y2="10" stroke="%233b82f6" stroke-width="1.5" /><path d="M 20,10 L 24,5 L 32,15 L 40,5 L 48,15 L 56,5 L 64,15 L 68,10" fill="none" stroke="%23f43f5e" stroke-width="1.5" /><line x1="68" y1="10" x2="88" y2="10" stroke="%233b82f6" stroke-width="1.5" /><text x="25" y="-3" fill="%23cbd5e1" font-family="monospace" font-size="8">R1 [220R]</text></g><g transform="translate(383, 160)"><polygon points="0,-10 0,10 15,0" fill="none" stroke="%23f59e0b" stroke-width="1.5" /><line x1="15" y1="-10" x2="15" y2="10" stroke="%23f59e0b" stroke-width="1.5" /><line x1="15" y1="0" x2="30" y2="0" stroke="%233b82f6" /><line x1="30" y1="0" x2="30" y2="40" stroke="%233b82f6" /><text x="-15" y="-15" fill="%23cbd5e1" font-family="monospace" font-size="8">LED1-BLUE</text></g><g transform="translate(413, 200)"><line x1="0" y1="0" x2="0" y2="15" stroke="%233b82f6" /><line x1="-10" y1="15" x2="10" y2="15" stroke="%233b82f6" /><line x1="-6" y1="20" x2="6" y2="20" stroke="%233b82f6" /><text x="15" y="20" fill="%2394a3b8" font-family="monospace" font-size="8">GND</text></g><rect x="500" y="45" width="130" height="270" rx="4" fill="%231e293b" stroke="%232d3d52" /><text x="510" y="65" fill="%2338bdf8" font-family="sans-serif" font-size="9" font-weight="bold">DISPOSITIVOS</text><g transform="translate(510, 85)" fill="%23cbd5e1" font-family="sans-serif" font-size="10"><text x="0" y="15">⚙️ MCU U1</text><text x="0" y="35">〰️ Resistencia</text><text x="0" y="55">💡 LED Azul</text><text x="0" y="75">🔌 Batería</text></g><rect x="10" y="320" width="135" height="35" rx="3" fill="%230f172a" stroke="%2322c55e" /><polygon points="20,328 32,337 20,346" fill="%2322c55e" /><text x="40" y="340" fill="%2322c55e" font-family="monospace" font-size="10" font-weight="bold">SIM ACTIVA</text></svg>',
      desc: 'Suite de simulación SPICE líder de circuitos analógicos y digitales, con ejecución interactiva de microcontroladores y diseño avanzado de PCB.'
    },
    {
      name: 'Fritzing',
      url: 'https://fritzing.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%231e2430" /><rect width="640" height="35" fill="%231b1c21" /><rect x="12" y="8" width="18" height="18" rx="4" fill="%238a2025" /><text x="17" y="21" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">F</text><text x="38" y="21" fill="%23cbd5e1" font-family="sans-serif" font-size="10.5">Fritzing [Protoboard] - Blink_Arduino.fz</text><rect x="10" y="45" width="480" height="270" rx="4" fill="%23111622" stroke="%23243144" /><g transform="translate(30, 160)"><rect x="0" y="0" width="440" height="120" rx="6" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1.5" /><line x1="20" y1="12" x2="420" y2="12" stroke="%23ef4444" stroke-width="1.5" /><line x1="20" y1="108" x2="420" y2="108" stroke="%233b82f6" stroke-width="1.5" /><g fill="%23475569" opacity="0.8"><circle cx="60" cy="25" r="1.5" /><circle cx="80" cy="25" r="1.5" /><circle cx="100" cy="25" r="1.5" /><circle cx="120" cy="25" r="1.5" /><circle cx="140" cy="25" r="1.5" /><circle cx="160" cy="25" r="1.5" /><circle cx="68" cy="50" r="1.5" /><circle cx="88" cy="50" r="1.5" /><circle cx="108" cy="50" r="1.5" /><circle cx="128" cy="50" r="1.5" /><circle cx="148" cy="50" r="1.5" /><circle cx="168" cy="50" r="1.5" /><circle cx="68" cy="70" r="1.5" /><circle cx="88" cy="70" r="1.5" /><circle cx="108" cy="70" r="1.5" /><circle cx="128" cy="70" r="1.5" /><circle cx="148" cy="70" r="1.5" /><circle cx="168" cy="70" r="1.5" /><circle cx="60" cy="95" r="1.5" /><circle cx="80" cy="95" r="1.5" /><circle cx="100" cy="95" r="1.5" /><circle cx="120" cy="95" r="1.5" /><circle cx="140" cy="95" r="1.5" /><circle cx="160" cy="95" r="1.5" /></g><line x1="10" y1="60" x2="430" y2="60" stroke="%23cfd8dc" /></g><g transform="translate(40, 55)"><rect width="180" height="90" rx="5" fill="%23005f73" stroke="%230a9396" stroke-width="1.5" /><rect x="70" y="30" width="85" height="15" fill="%231a1a1a" /><text x="112" y="40" fill="%2394a3b8" font-family="sans-serif" font-size="7" font-weight="bold" text-anchor="middle">ATMEGA328P</text><rect x="-5" y="12" width="30" height="22" fill="%23b0bec5" /><text x="65" y="65" fill="white" font-family="sans-serif" font-weight="bold" font-size="9">Arduino</text><text x="110" y="65" fill="white" font-family="sans-serif" font-size="7">UNO</text></g><path d="M 120, 135 C 100,190 120,210 90, 185" fill="none" stroke="%23ef4444" stroke-width="2" /><path d="M 140, 135 C 150,210 170,230 230, 268" fill="none" stroke="%233b82f6" stroke-width="2" /><rect x="500" y="45" width="130" height="270" rx="4" fill="%231b1c21" stroke="%23243144" /><text x="510" y="65" fill="%23cbd5e1" font-family="sans-serif" font-size="9" font-weight="bold">COMPONENTES</text><g transform="translate(510, 85)" fill="%23cbd5e1" font-family="sans-serif" font-size="10"><text x="0" y="15">🔌 Arduino UNO</text><text x="0" y="35">⬜ Protoboard</text><text x="0" y="55">💡 LED Rojo</text></g></svg>',
      desc: 'CAD de electrónica enfocado a la divulgación, facilitando diagramar prototipos desde la vista física típica de cables y protoboard.'
    },
    {
      name: 'Blender',
      url: 'https://www.blender.org',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23131416" /><rect width="640" height="28" fill="%23202124" stroke="%232b2c2e" stroke-width="0.5" /><g fill="%238a8e95" font-family="sans-serif" font-size="8" font-weight="500"><text x="12" y="17">File</text><text x="36" y="17">Edit</text><text x="60" y="17">Select</text><text x="96" y="17">Modify</text><text x="134" y="17">Display</text><text x="174" y="17">Window</text><text x="216" y="17">Assets</text><text x="254" y="17">Poly Modeling</text><text x="325" y="17">Arnold</text></g><text x="575" y="17" fill="%238a8e95" font-family="sans-serif" font-size="8">Workspace: Model</text><rect x="0" y="28" width="640" height="20" fill="%232c2d30" stroke="%233a3b3e" stroke-width="0.5" /><g fill="%23b0b5be" font-family="sans-serif" font-size="8" font-weight="bold"><text x="12" y="41">🛠️ Select</text><text x="75" y="41">📐 Measure</text><text x="140" y="41">🌀 Sculpting</text><text x="205" y="41">🧬 Rigging</text><text x="260" y="41">🎬 Animation</text></g><rect x="0" y="48" width="112" height="292" fill="%231a1b1d" stroke="%232b2c2e" stroke-width="0.5" /><text x="10" y="62" fill="%23a0a6b0" font-family="sans-serif" font-size="8" font-weight="bold" letter-spacing="0.5">OUTLINER</text><g fill="%238a8e95" font-family="sans-serif" font-size="8" transform="translate(10, 75)"><text x="0" y="12">👁️ transp_cam</text><text x="0" y="28">👁️ persp_view</text><text x="0" y="44" fill="%2338bdf8" font-weight="bold">📂 Geo_Group</text><text x="10" y="60" fill="%23f8fafc">↳ 👤 Bust_Mesh</text><text x="10" y="76">↳ 🔗 Skeleton_Rig</text><text x="0" y="92">📂 Lights_Group</text><text x="10" y="108">↳ 💡 Key_Light</text></g><rect x="538" y="48" width="102" height="292" fill="%231a1b1d" stroke="%232b2c2e" stroke-width="0.5" /><text x="548" y="62" fill="%23a0a6b0" font-family="sans-serif" font-size="8" font-weight="bold" letter-spacing="0.5">ATTRIBUTES</text><rect x="546" y="80" width="86" height="40" rx="3" fill="%232c2d30" stroke="%233a3b3e" /><text x="552" y="93" fill="%2338bdf8" font-family="monospace" font-size="7.5" font-weight="bold">Bust_Mesh_Pose</text><text x="552" y="105" fill="%238a8e95" font-family="monospace" font-size="7">Subdivisions: 4</text><text x="552" y="115" fill="%238a8e95" font-family="monospace" font-size="7">Shading: Smooth</text><rect x="0" y="340" width="640" height="20" fill="%23202124" stroke="%232b2c2e" stroke-width="0.5" /><g fill="%238a8e95" font-family="monospace" font-size="8"><text x="10" y="353">Frame: 20</text><line x1="100" y1="340" x2="100" y2="360" stroke="%233a3b3e" /><line x1="200" y1="340" x2="200" y2="360" stroke="%233a3b3e" /><line x1="300" y1="340" x2="300" y2="360" stroke="%233a3b3e" /><line x1="400" y1="340" x2="400" y2="360" stroke="%233a3b3e" /><line x1="500" y1="340" x2="500" y2="360" stroke="%233a3b3e" /><rect x="195" y="340" width="10" height="20" fill="%23ef4444" opacity="0.6" /><text x="150" y="353" fill="white">10</text><text x="210" y="353" fill="%23ef4444" font-weight="bold">20</text><text x="250" y="353">30</text><text x="350" y="353">40</text></g><rect x="112" y="48" width="426" height="292" fill="%232b2d30" /><g stroke="%233d4044" stroke-width="1" opacity="0.6"><line x1="112" y1="280" x2="538" y2="280" /><line x1="325" y1="48" x2="325" y2="340" /><line x1="112" y1="310" x2="538" y2="230" /><line x1="112" y1="230" x2="538" y2="310" /><circle cx="325" cy="280" r="120" fill="none" stroke="%233d4044" stroke-dasharray="4,4" /></g><g transform="translate(160, 60)"><path d="M 40,160 C 50,110 90,105 130,125 C 135,130 150,140 140,165 C 120,185 85,195 40,160 Z" fill="%235a5f68" stroke="%233a3e43" stroke-width="1.5" /><path d="M 68,140 Q 82,125 96,134 Q 102,154 84,166 Q 66,158 68,140 Z" fill="%231a0808" stroke="%233a1e1e" /><rect x="76" y="132" width="10" height="3" fill="%23eeece2" /><rect x="80" y="156" width="8" height="2" fill="%23eeece2" /><circle cx="60" cy="120" r="2" fill="%239e9e9e" /><circle cx="104" cy="118" r="2" fill="%239e9e9e" /><path d="M 0,260 C 15,185 55,165 95,185 L 140,290 L 0,290 Z" fill="%234b4f57" stroke="%233a3e43" /><path d="M 95,185 L 210,225 L 230,195 L 130,145 Z" fill="%23535861" stroke="%233a3e43" /><path d="M 185,195 L 225,210 L 235,175 L 195,165 Z" fill="%231a1b1d" stroke="%232d3035" /><path d="M 210,185 C 230,105 300,145 290,215 C 270,245 210,235 210,185 Z" fill="%2343474e" stroke="%2331343a" /><ellipse cx="225" cy="155" rx="14" ry="11" fill="%236e747f" stroke="%234b4f57" /><rect x="245" y="115" width="28" height="20" rx="9" fill="%235a5f68" stroke="%233a3e43" transform="rotate(-15, 259, 125)" /><rect x="265" y="130" width="32" height="22" rx="11" fill="%23666b75" stroke="%23454950" transform="rotate(-5, 281, 141)" /><rect x="270" y="160" width="30" height="22" rx="11" fill="%235e636c" stroke="%233f4247" transform="rotate(10, 285, 171)" /><rect x="255" y="190" width="26" height="20" rx="9" fill="%2351555c" stroke="%23373a3f" transform="rotate(25, 268, 200)" /><ellipse cx="205" cy="145" rx="42" ry="11" fill="none" stroke="%2338bdf8" stroke-width="1.5" transform="rotate(-20, 205, 145)" /><path d="M 35,115 L 75,95 Q 115,115 75,135 Z" fill="none" stroke="%2300ffa3" stroke-width="0.7" opacity="0.5" /></g><g font-family="monospace" font-size="8.5" fill="%23eeeeee" opacity="0.85"><text x="122" y="65">Verts:    1,292,575</text><text x="122" y="77">Edges:    2,502,155</text><text x="122" y="89">Faces:    1,213,331</text><text x="122" y="101">Tris:     2,500,480</text><text x="122" y="113">UVs:      676,611</text></g><g font-family="monospace" font-size="8" fill="%23a0a6b0" text-anchor="end" opacity="0.85"><text x="528" y="65">Backfaces: N/A</text><text x="528" y="75">Smoothness: N/A</text><text x="528" y="85">Instance: N/A</text><text x="528" y="95">Selected Objects: 1</text></g><g transform="translate(130, 310)" stroke-width="1.5"><line x1="0" y1="0" x2="15" y2="0" stroke="%23ef4444" /><text x="18" y="3" fill="%23ef4444" font-family="sans-serif" font-size="7">X</text><line x1="0" y1="0" x2="0" y2="-15" stroke="%2322c55e" /><text x="-3" y="-18" fill="%2322c55e" font-family="sans-serif" font-size="7">Y</text><line x1="0" y1="0" x2="-10" y2="10" stroke="%233b82f6" /><text x="-16" y="15" fill="%233b82f6" font-family="sans-serif" font-size="7">Z</text><text x="-25" y="-5" fill="%2394a3b8" font-family="sans-serif" font-weight="bold" font-size="7">persp</text></g></svg>',
      desc: 'Poderosa herramienta libre para modelado de figuras en 3D orgánicas, sombreado fotorrealista e ilustración integrada para laboratorios mecánicos.'
    }
  ],
  soft_6: [
    {
      name: 'Tinkercad',
      url: 'https://www.tinkercad.com',
      image: '/src/assets/images/tinkercad_screenshot_1779726839847.png',
      desc: 'Plataforma interactiva en la nube para el diseño en modelado 3D, simulación de circuitos electrónicos interactivos y codificación en bloques lógicos.'
    },
    {
      name: 'FluidSim',
      url: 'https://www.festo-didactic.com/int-es/servicios/fluidsim',
      image: '/src/assets/images/fluidsim_screenshot_1779734090740.png',
      desc: 'Simulador neumático e hidráulico oficial de la corporación Festo para calcular corrientes, flujos, presiones y probar diagramas lógicos en vivo.'
    },
    {
      name: 'SinuTrain',
      url: 'https://www.siemens.com/es/es/productos/tecnologias/cnc/operator-software/sinutrain.html',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23272d32" /><rect x="10" y="10" width="380" height="340" rx="4" fill="%231a1f22" stroke="%233e464c" /><g transform="translate(400, 10)"><rect width="230" height="340" rx="4" fill="%231a1f22" stroke="%233e464c" /><text x="15" y="30" fill="%2300b0ca" font-family="monospace" font-size="12" font-weight="bold">CNC PANEL</text><rect x="15" y="50" width="60" height="40" rx="3" fill="%23565f66" /><text x="25" y="75" fill="white" font-family="monospace" font-size="12" font-weight="bold">START</text><rect x="85" y="50" width="60" height="40" rx="3" fill="%23d9534f" /><text x="98" y="75" fill="white" font-family="monospace" font-size="12" font-weight="bold">STOP</text><g transform="translate(15, 110)"><rect x="0" y="0" width="40" height="40" rx="3" fill="%233e464c" /><text x="14" y="25" fill="white" font-family="monospace" font-size="14">X</text><rect x="50" y="0" width="40" height="40" rx="3" fill="%233e464c" /><text x="64" y="25" fill="white" font-family="monospace" font-size="14">Y</text><rect x="100" y="0" width="40" height="40" rx="3" fill="%233e464c" /><text x="114" y="25" fill="white" font-family="monospace" font-size="14">Z</text></g></g><text x="30" y="35" fill="%230099ae" font-family="sans-serif" font-size="14" font-weight="bold">SINUTRAIN Siemens CNC</text><line x1="20" y1="50" x2="380" y2="50" stroke="%233e464c" /><text x="30" y="75" fill="%23ffffff" font-family="monospace" font-size="11">PROGRAMA: _FRESADO_ALU_01</text><rect x="30" y="90" width="340" height="120" rx="4" fill="%23111417" stroke="%232b3136" /><text x="45" y="115" fill="%235bc0de" font-family="monospace" font-size="11">N10 G90 G54 F200 S1200 T1 M3</text><text x="45" y="135" fill="%23f0ad4e" font-family="monospace" font-size="11">N20 G00 X10.0 Y10.0 Z5.0</text><text x="45" y="155" fill="%23ffffff" font-family="monospace" font-size="11">N30 G01 Z-2.0 F100</text><text x="45" y="175" fill="%23ffffff" font-family="monospace" font-size="11">N40 G02 X30.0 Y30.0 CR=18.0</text><text x="45" y="195" fill="%235cb85c" font-family="monospace" font-size="11">N50 M30 (FIN DE PROGRAMA)</text><rect x="30" y="225" width="160" height="110" rx="4" fill="%23111417" stroke="%232b3136" /><text x="40" y="245" fill="%235cb85c" font-family="monospace" font-size="10" font-weight="bold">POSICION ACTUAL:</text><text x="40" y="270" fill="%23ffffff" font-family="monospace" font-size="12">X: +10.000 mm</text><text x="40" y="295" fill="%23ffffff" font-family="monospace" font-size="12">Y: +10.000 mm</text><text x="40" y="320" fill="%23ffffff" font-family="monospace" font-size="12">Z: +5.000  mm</text><rect x="200" y="225" width="170" height="110" rx="4" fill="%23111417" stroke="%232b3136" /><line x1="285" y1="230" x2="285" y2="330" stroke="%232b3136" stroke-dasharray="2,2" /><line x1="205" y1="280" x2="365" y2="280" stroke="%232b3136" stroke-dasharray="2,2" /><path d="M 210,300 L 260,250 Q 285,225 310,250 T 360,300" fill="none" stroke="%235bc0de" stroke-width="2" /></svg>',
      desc: 'Simulación precisa del control SINUMERIK para capacitar estudiantes en el ingreso autónomo de código G de fresadora y torno mediante emulación.'
    },
    {
      name: 'Automation Studio',
      url: 'https://www.famictech.com/es/',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f3f4f6" /><rect width="640" height="40" fill="%232c3e50" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="13" font-weight="bold">Automation Studio™ - Pneumatic Circuit</text><circle cx="25" cy="20" r="10" fill="%23e74c3c" /><rect x="0" y="40" width="140" height="320" fill="%23ffffff" stroke="%23d1d5db" /><text x="15" y="65" fill="%237f8c8d" font-family="sans-serif" font-size="10" font-weight="bold">BIBLIOTECA</text><g transform="translate(15, 80)"><rect x="0" y="0" width="110" height="40" rx="3" fill="%23f8f9fa" stroke="%23e2e8f0" /><text x="10" y="25" fill="%232c3e50" font-family="sans-serif" font-size="10">Piston Doble Efecto</text><rect x="0" y="50" width="110" height="40" rx="3" fill="%23f8f9fa" stroke="%23e2e8f0" /><text x="10" y="75" fill="%232c3e50" font-family="sans-serif" font-size="10">Valvula 5/2 Electrica</text><rect x="0" y="100" width="110" height="40" rx="3" fill="%23f8f9fa" stroke="%23e2e8f0" /><text x="10" y="125" fill="%232c3e50" font-family="sans-serif" font-size="10">Unidad de Aire FRL</text></g><rect x="150" y="50" width="480" height="300" rx="6" fill="%23ffffff" stroke="%23cbd5e1" /><g fill="none" stroke="%23f1f5f9" stroke-width="1"><line x1="150" y1="80" x2="630" y2="80" /><line x1="150" y1="110" x2="630" y2="110" /><line x1="150" y1="140" x2="630" y2="140" /><line x1="150" y1="170" x2="630" y2="170" /><line x1="150" y1="200" x2="630" y2="200" /><line x1="150" y1="230" x2="630" y2="230" /><line x1="150" y1="260" x2="630" y2="260" /><line x1="150" y1="290" x2="630" y2="290" /><line x1="180" y1="50" x2="180" y2="350" /><line x1="220" y1="50" x2="220" y2="350" /><line x1="260" y1="50" x2="260" y2="350" /><line x1="300" y1="50" x2="300" y2="350" /><line x1="340" y1="50" x2="340" y2="350" /><line x1="380" y1="50" x2="380" y2="350" /><line x1="420" y1="50" x2="420" y2="350" /><line x1="460" y1="50" x2="460" y2="350" /><line x1="500" y1="50" x2="500" y2="350" /><line x1="540" y1="50" x2="540" y2="350" /><line x1="580" y1="50" x2="580" y2="350" /></g><g transform="translate(250, 70)"><rect x="0" y="0" width="160" height="30" rx="3" fill="none" stroke="%232c3e50" stroke-width="2" /><rect x="40" y="-10" width="80" height="15" fill="none" stroke="%232c3e50" stroke-width="2" /><line x1="80" y1="-10" x2="80" y2="40" stroke="%232c3e50" stroke-width="2.5" /><rect x="40" y="40" width="80" height="10" fill="none" stroke="%232c3e50" stroke-width="2" /><line x1="10" y1="15" x2="150" y2="15" stroke="%233498db" stroke-width="3" /></g><g transform="translate(280, 190)"><rect x="0" y="0" width="100" height="50" fill="%23ecf0f1" stroke="%232c3e50" stroke-width="2" /><line x1="20" y1="15" x2="40" y2="35" stroke="%2327ae60" stroke-width="2" /><line x1="40" y1="35" x2="20" y2="35" stroke="%2327ae60" stroke-width="2" /><line x1="40" y1="35" x2="40" y2="15" stroke="%2327ae60" stroke-width="2" /><line x1="80" y1="35" x2="60" y2="15" stroke="%2327ae60" stroke-width="2" /><line x1="60" y1="15" x2="80" y2="15" stroke="%2327ae60" stroke-width="2" /><line x1="60" y1="15" x2="60" y2="35" stroke="%2327ae60" stroke-width="2" /></g><path d="M 290,120 L 290,190" fill="none" stroke="%233498db" stroke-width="2.5" /><path d="M 370,120 L 370,190" fill="none" stroke="%23e74c3c" stroke-width="2.5" /><g transform="translate(310, 290)"><polygon points="0,20 -15,40 15,40" fill="none" stroke="%232c3e50" stroke-width="2" /><line x1="0" y1="0" x2="0" y2="20" stroke="%232c3e50" stroke-width="2" /><text x="-25" y="-5" fill="%2327ae60" font-family="monospace" font-size="10" font-weight="bold">P=6.0 bar</text></g><path d="M 330,240 L 330,290" fill="none" stroke="%233498db" stroke-width="2.5" /></svg>',
      desc: 'Entorno profesional de diseño y simulación para planificar automatismos completos neumáticos, hidráulicos, eléctricos y lógica de PLC.'
    },
    {
      name: 'Labview',
      url: 'https://www.ni.com/es-mx/shop/labview.html',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23eae7dc" /><rect width="640" height="40" fill="%233b3b3b" /><text x="50" y="25" fill="%23ffffff" font-family="sans-serif" font-size="12" font-weight="bold">LabVIEW - SignalAcquisitionAndFilter.vi Block Diagram</text><rect x="15" y="10" width="20" height="20" rx="3" fill="%23f1c40f" /><text x="21" y="24" fill="%233b3b3b" font-family="sans-serif" font-size="12" font-weight="bold">LV</text><rect x="10" y="50" width="620" height="300" rx="4" fill="%23ffffff" stroke="%23bdc3c7" /><g fill="none" stroke="%23f3f3f3" stroke-width="1"><line x1="10" y1="80" x2="630" y2="80" /><line x1="10" y1="110" x2="630" y2="110" /><line x1="10" y1="140" x2="630" y2="140" /><line x1="10" y1="170" x2="630" y2="170" /><line x1="10" y1="200" x2="630" y2="200" /><line x1="10" y1="230" x2="630" y2="230" /><line x1="10" y1="260" x2="630" y2="260" /><line x1="10" y1="290" x2="630" y2="290" /><line x1="10" y1="320" x2="630" y2="320" /><line x1="80" y1="50" x2="80" y2="350" /><line x1="180" y1="50" x2="180" y2="350" /><line x1="280" y1="50" x2="280" y2="350" /><line x1="380" y1="50" x2="380" y2="350" /><line x1="480" y1="50" x2="480" y2="350" /><line x1="580" y1="50" x2="580" y2="350" /></g><g transform="translate(40, 100)"><rect width="180" height="150" rx="6" fill="%23dbdbdb" opacity="0.3" stroke="%2334495e" stroke-width="2" stroke-dasharray="2,2" /><text x="10" y="20" fill="%232c3e50" font-family="sans-serif" font-size="10" font-weight="bold">WHILE LOOP</text><g transform="translate(140, 110)"><rect width="25" height="25" fill="%23ffffff" stroke="%23e74c3c" stroke-width="2" /><text x="7" y="18" fill="%23e74c3c" font-family="sans-serif" font-size="14" font-weight="bold">i</text></g></g><g transform="translate(70, 140)"><rect width="45" height="45" rx="4" fill="%23f1c40f" stroke="%23d35400" stroke-width="2" /><text x="6" y="24" fill="%232c3e50" font-family="sans-serif" font-size="9" font-weight="bold">DAQ Assist</text><rect x="5" y="28" width="35" height="12" fill="%23ffffff" stroke="%23d35400" /><text x="8" y="37" fill="%2334495e" font-family="monospace" font-size="8">AI0-AI3</text></g><g transform="translate(240, 140)"><rect width="45" height="45" rx="4" fill="%239b59b6" stroke="%238e44ad" stroke-width="2" /><text x="8" y="24" fill="white" font-family="sans-serif" font-size="9" font-weight="bold">LowPass</text><rect x="5" y="28" width="35" height="12" fill="%23ffffff" stroke="%238e44ad" /><text x="8" y="37" fill="%2334495e" font-family="monospace" font-size="8">100Hz</text></g><path d="M 115,162 L 240,162" fill="none" stroke="%23ff6600" stroke-width="3" stroke-dasharray="14,2" /><text x="130" y="154" fill="%23ff6600" font-family="monospace" font-size="9" font-weight="bold">Waveform</text><g transform="translate(420, 120)"><rect width="180" height="100" rx="4" fill="%232c3e50" stroke="%237f8c8d" stroke-width="1.5" /><rect x="10" y="25" width="160" height="65" fill="%231a252f" /><path d="M 10,70 L 40,40 L 70,80 L 100,30 L 130,70 L 170,50" fill="none" stroke="%232ecc71" stroke-width="2" /><text x="15" y="18" fill="white" font-family="sans-serif" font-size="9">Filtro de Senial Activo</text></g><path d="M 285,162 L 350,162 L 350,170 L 420,170" fill="none" stroke="%23ff6600" stroke-width="3" stroke-dasharray="14,2" /></svg>',
      desc: 'Plataforma icónica de programación visual mediante diagramas de bloques idónea para la adquisición de señales de sensores físicos.'
    },
    {
      name: 'LogixPro',
      url: 'http://thelearningpit.com/lp/logixpro.html',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23eceff1" /><rect width="640" height="40" fill="%230277bd" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">LogixPro-500 Allen-Bradley Ladder Logic Simulator</text><rect x="15" y="10" width="20" height="20" rx="3" fill="%23ffffff" /><text x="19" y="24" fill="%230277bd" font-family="sans-serif" font-size="11" font-weight="900">LP</text><rect x="10" y="50" width="380" height="300" rx="4" fill="%23ffffff" stroke="%23cfd8dc" /><line x1="30" y1="70" x2="30" y2="330" stroke="%23b0bec5" stroke-width="3" /><line x1="370" y1="70" x2="370" y2="330" stroke="%23b0bec5" stroke-width="3" /><g transform="translate(30, 100)"><line x1="0" y1="0" x2="340" y2="0" stroke="%2337474f" stroke-width="2" /><g transform="translate(50, -10)"><path d="M 0,0 L 0,20 M 10,0 L 10,20" stroke="%2337474f" stroke-width="2" /><line x1="-15" y1="10" x2="0" y2="10" stroke="%2337474f" stroke-width="2" /><line x1="10" y1="10" x2="25" y2="10" stroke="%2337474f" stroke-width="2" /><text x="-15" y="-5" fill="%230277bd" font-family="monospace" font-size="9" font-weight="bold">I:1/0 (Start)</text></g><g transform="translate(130, -10)"><path d="M 0,0 L 0,20 M 10,0 L 10,20 M 0,20 L 10,0" stroke="%2337474f" stroke-width="2" /><text x="-15" y="-5" fill="%23c62828" font-family="monospace" font-size="9" font-weight="bold">I:1/1 (Stop)</text></g><g transform="translate(260, -10)"><path d="M 0,10 A 10,10 0 0,1 20,10 A 10,10 0 0,1 0,10" fill="none" stroke="%232e7d32" stroke-width="2" /><text x="-25" y="-5" fill="%232e7d32" font-family="monospace" font-size="9" font-weight="bold">O:2/0 (Run)</text></g></g><g transform="translate(30, 180)"><line x1="0" y1="0" x2="340" y2="0" stroke="%2337474f" stroke-width="2" /><g transform="translate(50, -10)"><path d="M 0,0 L 0,20 M 10,0 L 10,20" stroke="%2337474f" stroke-width="2" /><text x="-15" y="-5" fill="%230277bd" font-family="monospace" font-size="9" font-weight="bold">O:2/0 (Seal-in)</text></g></g><rect x="400" y="50" width="230" height="300" rx="4" fill="%2337474f" stroke="%23cfd8dc" /><text x="415" y="75" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">Silo &amp; Conveyor Simulator</text><rect x="440" y="100" width="100" height="80" rx="4" fill="%2378909c" /><ellipse cx="490" cy="180" rx="40" ry="10" fill="%23546e7a" /><rect x="415" y="240" width="200" height="15" rx="3" fill="%23263238" /><circle cx="430" cy="247" r="6" fill="%23cfd8dc" /><circle cx="515" cy="247" r="6" fill="%23cfd8dc" /><circle cx="600" cy="247" r="6" fill="%23cfd8dc" /><rect x="480" y="210" width="40" height="30" rx="3" fill="%23ff8f00" /><text x="495" y="228" fill="white" font-family="sans-serif" font-size="10" font-weight="bold">Box</text></svg>',
      desc: 'Simulador gráfico de entrenamiento Allen-Bradley para simular cintas transportadoras, semáforos, elevadores y entender lógica Ladder.'
    },
    {
      name: 'RSLogix',
      url: 'https://www.rockwellautomation.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23b0bec5" /><rect width="640" height="40" fill="%231e3d59" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">RSLogix 500 - MainProgram (Ladder Logic Editor)</text><rect x="0" y="40" width="150" height="320" fill="%23ffffff" stroke="%2390a4ae" /><text x="15" y="65" fill="%23546e7a" font-family="sans-serif" font-size="9" font-weight="bold">PROJECT TREE</text><g transform="translate(15, 80)"><rect x="0" y="0" width="120" height="20" rx="2" fill="%23eceff1" /><text x="8" y="13" fill="%23263238" font-family="sans-serif" font-size="9">Controller Configuration</text><text x="8" y="38" fill="%2337474f" font-family="sans-serif" font-size="9">⚙️ Processor Status</text><text x="8" y="63" fill="%2337474f" font-family="sans-serif" font-size="9">📁 Program Files</text><text x="20" y="83" fill="%231e3d59" font-family="sans-serif" font-size="9" font-weight="bold">↪ LAD 2 - Main</text><text x="8" y="108" fill="%2337474f" font-family="sans-serif" font-size="9">📁 Data Files</text></g><rect x="160" y="50" width="470" height="300" rx="4" fill="%23ffffff" stroke="%2390a4ae" /><line x1="180" y1="70" x2="180" y2="330" stroke="%23b0bec5" stroke-width="2.5" /><line x1="610" y1="70" x2="610" y2="330" stroke="%23b0bec5" stroke-width="2.5" /><g transform="translate(180, 100)"><line x1="0" y1="0" x2="430" y2="0" stroke="%2337474f" stroke-width="1.5" /><g transform="translate(40, -10)"><path d="M 0,0 L 0,20 M 8,0 L 8,20" stroke="%2337474f" stroke-width="1.5" /><text x="-25" y="-5" fill="%231e3d59" font-family="monospace" font-size="8" font-weight="bold">XIC I:0/1 [START]</text></g><g transform="translate(140, -10)"><path d="M 0,0 L 0,20 M 8,0 L 8,20 M 0,20 L 8,0" stroke="%2337474f" stroke-width="1.5" /><text x="-25" y="-5" fill="%231e3d59" font-family="monospace" font-size="8" font-weight="bold">XIO I:0/2 [STOP]</text></g><g transform="translate(240, -10)"><rect x="0" y="3" width="30" height="15" rx="3" fill="%23eceff1" stroke="%2337474f" /><text x="-25" y="-5" fill="%231e3d59" font-family="monospace" font-size="8" font-weight="bold">EQU N7:0 12</text></g><g transform="translate(360, -10)"><path d="M 0,10 A 10,10 0 0,1 20,10 A 10,10 0 0,1 0,10" fill="none" stroke="%232e7d32" stroke-width="1.5" /><text x="-15" y="-5" fill="%232e7d32" font-family="monospace" font-size="8" font-weight="bold">OTE O:0/1</text></g></g><g transform="translate(180, 200)"><line x1="0" y1="0" x2="430" y2="0" stroke="%2337474f" stroke-width="1.5" /><g transform="translate(40, -10)"><path d="M 0,0 L 0,20 M 8,0 L 8,20" stroke="%2337474f" stroke-width="1.5" /><text x="-25" y="-5" fill="%231e3d59" font-family="monospace" font-size="8" font-weight="bold">XIC O:0/1 [SEAL]</text></g><g transform="translate(220, -10)"><rect width="120" height="25" rx="3" fill="%23fffde7" stroke="%23fbc02d" /><text x="5" y="15" fill="%23000000" font-family="monospace" font-size="8.5">TON T4:0 Base:1.0 Acc:0</text></g></g></svg>',
      desc: 'Software de programación líder de PLCs Allen-Bradley de Rockwell Automation, empleado para diseñar y operar robustos circuitos de control industrial de relés.'
    },
    {
      name: 'Zelio',
      url: 'https://www.se.com/es/es/product-range/542-zelio-soft/',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f5f6f8" /><rect width="640" height="40" fill="%233d4044" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">Zelio Soft 2 - Schneider Electric (Smart Relay)</text><rect x="15" y="10" width="20" height="20" rx="3" fill="%232e7d32" /><text x="21" y="24" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">Z</text><rect x="10" y="50" width="620" height="300" rx="4" fill="%23ffffff" stroke="%23dcdfe6" /><g fill="none" stroke="%23ebeef5" stroke-width="1"><line x1="10" y1="100" x2="630" y2="100" /><line x1="10" y1="150" x2="630" y2="150" /><line x1="10" y1="200" x2="630" y2="200" /><line x1="10" y1="250" x2="630" y2="250" /><line x1="10" y1="300" x2="630" y2="300" /><line x1="110" y1="50" x2="110" y2="350" /><line x1="210" y1="50" x2="210" y2="350" /><line x1="310" y1="50" x2="310" y2="350" /><line x1="410" y1="50" x2="410" y2="350" /><line x1="510" y1="50" x2="510" y2="350" /></g><g transform="translate(10, 100)"><line x1="0" y1="0" x2="620" y2="0" stroke="%23171a1c" stroke-width="1.5" /><g transform="translate(50, -10)"><circle cx="10" cy="10" r="10" fill="white" stroke="%23333333" stroke-width="1.5" /><text x="6" y="14" fill="%232e7d32" font-family="sans-serif" font-size="11" font-weight="bold">I1</text><line x1="-15" y1="10" x2="0" y2="10" stroke="%23333333" stroke-width="1.5" /><line x1="20" y1="10" x2="35" y2="10" stroke="%23333333" stroke-width="1.5" /></g><g transform="translate(150, -10)"><circle cx="10" cy="10" r="10" fill="white" stroke="%23333333" stroke-width="1.5" /><text x="6" y="14" fill="%232e7d32" font-family="sans-serif" font-size="11" font-weight="bold">i2</text><line x1="5" y1="5" x2="15" y2="15" stroke="%23fb8c00" stroke-width="1.5" /></g><g transform="translate(530, -10)"><rect width="40" height="20" rx="3" fill="%23e8f5e9" stroke="%232e7d32" stroke-width="1.5" /><text x="12" y="14" fill="%232e7d32" font-family="sans-serif" font-size="11" font-weight="bold">[Q1</text></g></g><g transform="translate(10, 200)"><line x1="0" y1="0" x2="620" y2="0" stroke="%23171a1c" stroke-width="1.5" /><g transform="translate(50, -10)"><circle cx="10" cy="10" r="10" fill="white" stroke="%23333333" stroke-width="1.5" /><text x="6" y="14" fill="%232e7d32" font-family="sans-serif" font-size="11" font-weight="bold">Q1</text></g><g transform="translate(250, -15)"><rect width="100" height="30" rx="3" fill="%23e8f4fd" stroke="%231e88e5" stroke-width="1.5" /><text x="10" y="18" fill="%231e88e5" font-family="sans-serif" font-size="10" font-weight="bold">Temporizador T1</text></g></g></svg>',
      desc: 'Herramienta de simulación de relés inteligentes Zelio de Schneider Electric, ideal para asimilar conceptos de lógica secuencial de contactores.'
    },
    {
      name: 'Twido',
      url: 'https://www.se.com/es/es/work/support/product-support/twidosuite.jsp',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23eaeceb" /><rect width="640" height="40" fill="%230f2f21" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">TwidoSuite v2.3 - PLC Programming Environment</text><rect x="15" y="10" width="20" height="20" rx="3" fill="%2339b54a" /><text x="21" y="24" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">T</text><rect x="10" y="50" width="620" height="40" rx="4" fill="%2339b54a" /><text x="20" y="74" fill="white" font-family="sans-serif" font-size="10" font-weight="bold">1. DESCRIBIR</text><text x="160" y="74" fill="white" font-family="sans-serif" font-size="10" font-weight="bold">2. CONFIGURAR</text><rect x="290" y="55" width="140" height="30" rx="3" fill="%23ffffff" /><text x="300" y="74" fill="%230f2f21" font-family="sans-serif" font-size="10" font-weight="bold">3. PROGRAMAR (LAD)</text><text x="470" y="74" fill="white" font-family="sans-serif" font-size="10" font-weight="bold">4. CONECTAR</text><rect x="10" y="95" width="620" height="255" rx="4" fill="%23ffffff" stroke="%23cbd2ce" /><line x1="30" y1="120" x2="30" y2="330" stroke="%2339b54a" stroke-width="2" /><line x1="610" y1="120" x2="610" y2="330" stroke="%23cfdfd6" stroke-width="2" /><g transform="translate(30, 160)"><line x1="0" y1="0" x2="580" y2="0" stroke="%2343544c" stroke-width="1.5" /><g transform="translate(40, -10)"><path d="M 0,0 L 0,20 M 6,0 L 6,20" stroke="%2343544c" stroke-width="1.5" /><text x="-25" y="-5" fill="%2339b54a" font-family="monospace" font-size="8.5" font-weight="bold">%25I0.0 [START]</text></g><g transform="translate(160, -10)"><path d="M 0,0 L 0,20 M 6,0 L 6,20" stroke="%2343544c" stroke-width="1.5" /><path d="M 0,20 L 6,0" stroke="%23d35400" stroke-width="1.5" /><text x="-25" y="-5" fill="%23d35400" font-family="monospace" font-size="8.5" font-weight="bold">%25I0.2 [STOP]</text></g><g transform="translate(500, -10)"><path d="M 0,10 A 10,10 0 0,1 20,10 A 10,10 0 0,1 0,10" fill="none" stroke="%2339b54a" stroke-width="1.5" /><text x="-15" y="-5" fill="%2339b54a" font-family="monospace" font-size="8.5" font-weight="bold">%25Q0.0 [CONTACTOR]</text></g></g></svg>',
      desc: 'Entorno de configuración gráfica TwidoSuite para programar controladores lógicos compactos mediante diagramas Ladder sencillos y listas de instrucciones.'
    },
    {
      name: 'Logo',
      url: 'https://www.siemens.com/es/es/productos/automatizacion/sistemas-de-control/plc/logo.html',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f6f8fb" /><rect width="640" height="40" fill="%231a3038" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">LOGO! Soft Comfort - Function Block Diagram (FBD)</text><circle cx="25" cy="20" r="10" fill="%230099ae" /><text x="21" y="24" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">L</text><rect x="10" y="50" width="620" height="300" rx="4" fill="%23fffee0" stroke="%231a3038" stroke-opacity="0.2" /><g fill="none" stroke="%23f6f5d0" stroke-width="1"><line x1="10" y1="80" x2="630" y2="80" /><line x1="10" y1="120" x2="630" y2="120" /><line x1="10" y1="160" x2="630" y2="160" /><line x1="10" y1="200" x2="630" y2="200" /><line x1="10" y1="240" x2="630" y2="240" /><line x1="10" y1="280" x2="630" y2="280" /></g><g transform="translate(30, 100)"><rect width="35" height="25" rx="3" fill="%23ffffff" stroke="%23333333" /><text x="8" y="16" fill="%231a3038" font-family="monospace" font-size="10" font-weight="bold">I1</text><text x="-15" y="-5" fill="%230099ae" font-family="sans-serif" font-size="8" font-weight="bold">Start Button</text></g><g transform="translate(30, 200)"><rect width="35" height="25" rx="3" fill="%23ffffff" stroke="%23333333" /><text x="8" y="16" fill="%231a3038" font-family="monospace" font-size="10" font-weight="bold">I2</text><text x="-15" y="-5" fill="%23d35400" font-family="sans-serif" font-size="8" font-weight="bold">Stop Sensor</text></g><g transform="translate(180, 130)"><rect width="80" height="70" rx="3" fill="%23eceff1" stroke="%2337474f" stroke-width="1.5" /><rect width="80" height="15" fill="%2337474f" rx="1" /><text x="5" y="11" fill="white" font-family="sans-serif" font-size="8" font-weight="bold">B001 - AND Block</text><text x="35" y="45" fill="%2337474f" font-family="sans-serif" font-size="14" font-weight="bold">&amp;</text></g><path d="M 65,112 L 130,112 L 130,150 L 180,150" fill="none" stroke="%231a73e8" stroke-width="2" /><path d="M 65,212 L 130,212 L 130,180 L 180,180" fill="none" stroke="%231a73e8" stroke-width="2" /><g transform="translate(360, 140)"><rect width="80" height="50" rx="3" fill="%23eceff1" stroke="%2337474f" stroke-width="1.5" /><rect width="80" height="15" fill="%2337474f" rx="1" /><text x="5" y="11" fill="white" font-family="sans-serif" font-size="8" font-weight="bold">B002 - RS Latch</text><text x="30" y="38" fill="%2337474f" font-family="sans-serif" font-size="11" font-weight="bold">S  R</text></g><path d="M 260,165 L 360,165" fill="none" stroke="%231a73e8" stroke-width="2" /><g transform="translate(540, 152)"><rect width="35" height="25" rx="3" fill="%23ffffff" stroke="%23333333" /><text x="8" y="16" fill="%231a3038" font-family="monospace" font-size="10" font-weight="bold">Q1</text><text x="5" y="38" fill="%232e7d32" font-family="sans-serif" font-size="8" font-weight="bold">Motor</text></g><path d="M 440,165 L 540,165" fill="none" stroke="%231a73e8" stroke-width="2" /></svg>',
      desc: 'Software LOGO! Soft Comfort para programar microcontroladores industriales Siemens en lógica de bloques de funciones lógicas (FBD).'
    },
    {
      name: 'SYSWIN',
      url: 'https://industrial.omron.es',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23c0c0c0" /><rect width="640" height="30" fill="%23000080" /><text x="15" y="20" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">Syswin 3.4 - Project: CONVEYOR.SWN - [LDR: Block 1]</text><rect x="612" y="5" width="20" height="20" fill="%23c0c0c0" stroke="white" /><text x="618" y="18" fill="black" font-family="sans-serif" font-size="10" font-weight="bold">X</text><rect x="10" y="40" width="620" height="30" fill="%23c0c0c0" stroke="white" /><text x="20" y="58" fill="black" font-family="sans-serif" font-size="11">File  Edit  Find  PLC  Tools  Window  Help</text><rect x="10" y="75" width="620" height="275" fill="%23ffffff" stroke="%23808080" /><line x1="40" y1="90" x2="40" y2="330" stroke="%23000080" stroke-width="2" /><line x1="600" y1="90" x2="600" y2="330" stroke="%23808080" stroke-dasharray="2,2" /><g transform="translate(40, 130)"><line x1="0" y1="0" x2="560" y2="0" stroke="black" stroke-width="1.5" /><g transform="translate(30, -15)"><line x1="0" y1="5" x2="0" y2="25" stroke="black" stroke-width="2" /><line x1="8" y1="5" x2="8" y2="25" stroke="black" stroke-width="2" /><text x="-25" y="-5" fill="black" font-family="monospace" font-size="11" font-weight="bold">000.00 (START_PB)</text></g><g transform="translate(180, -15)"><line x1="0" y1="5" x2="0" y2="25" stroke="black" stroke-width="2" /><line x1="8" y1="5" x2="8" y2="25" stroke="black" stroke-width="2" /><line x1="0" y1="25" x2="8" y2="5" stroke="red" stroke-width="1.5" /><text x="-25" y="-5" fill="black" font-family="monospace" font-size="11" font-weight="bold">000.01 (EMERGENCY)</text></g><g transform="translate(450, -15)"><path d="M 0,15 A 10,10 0 0,1 20,15 A 10,10 0 0,1 0,15" fill="none" stroke="black" stroke-width="2" /><text x="-20" y="-5" fill="black" font-family="monospace" font-size="11" font-weight="bold">010.00 (MOTOR_ON)</text></g></g><g transform="translate(40, 220)"><line x1="0" y1="0" x2="560" y2="0" stroke="black" stroke-width="1.5" /><g transform="translate(30, -15)"><line x1="0" y1="5" x2="0" y2="25" stroke="black" stroke-width="2" /><line x1="8" y1="5" x2="8" y2="25" stroke="black" stroke-width="2" /><text x="-20" y="-5" fill="black" font-family="monospace" font-size="11" font-weight="bold">010.00 (SEAL_IN)</text></g></g></svg>',
      desc: 'Software utilitario clásico de programación Ladder para autómatas de la marca Omron, propicio para el adiestramiento inicial de cableado digital.'
    },
    {
      name: 'CoDeSys',
      url: 'https://www.codesys.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23efeff4" /><rect width="640" height="40" fill="%232b579a" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">CODESYS V3.5 - [PLC_PRG (PRG-LD)]</text><rect x="15" y="10" width="20" height="20" rx="3" fill="%23ff9900" /><text x="21" y="24" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">C</text><rect x="0" y="40" width="160" height="320" fill="%23ffffff" stroke="%23ccc" /><text x="15" y="65" fill="%23666" font-family="sans-serif" font-size="10" font-weight="bold">DEVICES</text><g transform="translate(15, 80)"><text x="5" y="15" fill="black" font-family="sans-serif" font-size="10">⚙️ CODESYS Control Win V3</text><text x="20" y="35" fill="black" font-family="sans-serif" font-size="10">📁 PLC Logic</text><text x="35" y="55" fill="black" font-family="sans-serif" font-size="10">📁 Application</text><text x="50" y="75" fill="%232b579a" font-family="sans-serif" font-size="10" font-weight="bold">📝 PLC_PRG (PRG)</text><text x="50" y="95" fill="black" font-family="sans-serif" font-size="10">📊 Task Configuration</text></g><rect x="170" y="50" width="460" height="300" rx="4" fill="%23ffffff" stroke="%23ccc" /><rect x="170" y="50" width="460" height="60" fill="%23f7f7f7" stroke="%23ccc" /><text x="185" y="70" fill="%23000000" font-family="monospace" font-size="9.5">PROGRAM PLC_PRG</text><text x="185" y="85" fill="%232b579a" font-family="monospace" font-size="9.5">VAR</text><text x="205" y="100" fill="%23666" font-family="monospace" font-size="9.5">xEngageStage : BOOL; xStopProcess : BOOL; xRelayOutput : BOOL;</text><text x="185" y="115" fill="%232b579a" font-family="monospace" font-size="9.5">END_VAR</text><line x1="170" y1="125" x2="630" y2="125" stroke="%23ccc" /><text x="185" y="145" fill="%23666" font-family="sans-serif" font-size="10" font-weight="bold">Network 1 - Main Trigger</text><line x1="200" y1="170" x2="200" y2="280" stroke="%232b579a" stroke-width="2" /><line x1="600" y1="170" x2="600" y2="280" stroke="%232b579a" stroke-width="2" /><line x1="200" y1="210" x2="600" y2="210" stroke="black" stroke-width="1.5" /><g transform="translate(250, 195)"><line x1="0" y1="5" x2="0" y2="25" stroke="black" stroke-width="2" /><line x1="8" y1="5" x2="8" y2="25" stroke="black" stroke-width="2" /><text x="-25" y="-5" fill="%232b579a" font-family="monospace" font-size="9" font-weight="bold">xEngageStage</text></g><g transform="translate(360, 195)"><line x1="0" y1="5" x2="0" y2="25" stroke="black" stroke-width="2" /><line x1="8" y1="5" x2="8" y2="25" stroke="black" stroke-width="2" /><line x1="0" y1="25" x2="8" y2="5" stroke="red" stroke-width="1.5" /><text x="-25" y="-5" fill="red" font-family="monospace" font-size="9" font-weight="bold">xStopProcess</text></g><g transform="translate(500, 195)"><path d="M 0,15 A 10,10 0 0,1 20,15 A 10,10 0 0,1 0,15" fill="none" stroke="black" stroke-width="2" /><text x="-20" y="-5" fill="%232b579a" font-family="monospace" font-size="9" font-weight="bold">xRelayOutput</text></g></svg>',
      desc: 'Entorno universal IEC 61131-3 libre para la simulación avanzada de PLCs, pantallas HMI independientes y diseño lógico multitarea.'
    },
    {
      name: 'FlexSim',
      url: 'https://www.flexsim.com/',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%230f172a" /><rect width="640" height="40" fill="%231e293b" /><circle cx="20" cy="20" r="6" fill="%23ef4444" /><circle cx="36" cy="20" r="6" fill="%23f59e0b" /><circle cx="52" cy="20" r="6" fill="%2310b981" /><text x="75" y="24" fill="%2394a3b8" font-family="sans-serif" font-size="11" font-weight="bold">FlexSim 2026 - [Warehouse_Optimization_Model.fsm *]</text><rect x="0" y="40" width="150" height="320" fill="%231e293b" stroke="%23334155" /><text x="15" y="65" fill="%2338bdf8" font-family="sans-serif" font-size="9" font-weight="bold" letter-spacing="1">BIBLIOTECA 3D</text><g transform="translate(15, 80)"><rect width="120" height="32" rx="4" fill="%23334155" stroke="%23475569" /><polygon points="10,16 22,10 22,22" fill="%23f97316" /><text x="32" y="20" fill="%23f8fafc" font-family="sans-serif" font-size="10">Source (Entrada)</text><rect y="42" width="120" height="32" rx="4" fill="%23334155" stroke="%23475569" /><rect x="10" y="52" width="12" height="12" rx="1" fill="%233b82f6" /><rect x="24" y="52" width="12" height="12" rx="1" fill="%233b82f6" /><text x="42" y="62" fill="%23f8fafc" font-family="sans-serif" font-size="10">Queue (Cola)</text><rect y="84" width="120" height="32" rx="4" fill="%23334155" stroke="%23475569" /><rect x="10" y="94" width="20" height="12" rx="1" fill="%2310b981" /><circle cx="20" cy="100" r="3" fill="white" /><text x="38" y="104" fill="%23f8fafc" font-family="sans-serif" font-size="10">Processor (Torno)</text><rect y="126" width="120" height="32" rx="4" fill="%23334155" stroke="%23475569" /><line x1="10" y1="142" x2="30" y2="142" stroke="%23a855f7" stroke-width="4" stroke-dasharray="2,2" /><text x="38" y="146" fill="%23f8fafc" font-family="sans-serif" font-size="10">Conveyor (Cinta)</text><rect y="168" width="120" height="32" rx="4" fill="%23334155" stroke="%23475569" /><rect x="10" y="179" width="18" height="10" rx="2" fill="%23eab308" /><circle cx="14" cy="190" r="2" fill="black" /><circle cx="24" cy="190" r="2" fill="black" /><text x="38" y="188" fill="%23f8fafc" font-family="sans-serif" font-size="10">AGV (Vehiculo)</text></g><rect x="160" y="50" width="470" height="300" rx="6" fill="%23020617" stroke="%23334155" stroke-width="2" /><g stroke="%231e293b" stroke-width="1" opacity="0.4"><line x1="160" y1="310" x2="630" y2="75" /><line x1="160" y1="250" x2="590" y2="50" /><line x1="160" y1="190" x2="470" y2="50" /><line x1="160" y1="130" x2="350" y2="50" /><line x1="220" y1="350" x2="630" y2="165" /><line x1="340" y1="350" x2="630" y2="225" /><line x1="460" y1="350" x2="630" y2="275" /><line x1="160" y1="90" x2="630" y2="310" /><line x1="160" y1="150" x2="570" y2="350" /><line x1="160" y1="210" x2="450" y2="350" /><line x1="160" y1="270" x2="330" y2="350" /><line x1="210" y1="50" x2="630" y2="210" /><line x1="330" y1="50" x2="630" y2="165" /><line x1="450" y1="50" x2="630" y2="115" /></g><g transform="translate(190, 110)"><line x1="10" y1="0" x2="10" y2="120" stroke="%2364748b" stroke-width="3" /><line x1="50" y1="20" x2="50" y2="140" stroke="%2364748b" stroke-width="3" /><line x1="90" y1="10" x2="90" y2="130" stroke="%23475569" stroke-width="2" /><polygon points="10,40 50,60 90,50 50,30" fill="%23475569" opacity="0.8" stroke="%2364748b" /><polygon points="10,80 50,100 90,90 50,70" fill="%23475569" opacity="0.8" stroke="%2364748b" /><polygon points="10,120 50,140 90,130 50,110" fill="%23475569" opacity="0.8" stroke="%2364748b" /><g transform="translate(20, 32)"><polygon points="10,10 25,18 40,13 25,5" fill="%232563eb" /><polygon points="10,10 25,18 25,30 10,22" fill="%231d4ed8" /><polygon points="25,18 40,13 40,25 25,30" fill="%231e40af" /></g><g transform="translate(15, 72)"><polygon points="10,10 25,18 40,13 25,5" fill="%23ea580c" /><polygon points="10,10 25,18 25,30 10,22" fill="%23c2410c" /><polygon points="25,18 40,13 40,25 25,30" fill="%239a3412" /></g><g transform="translate(42, 62)"><polygon points="10,10 22,16 34,12 22,6" fill="%2316a34a" /><polygon points="10,10 22,16 22,26 10,20" fill="%2315803d" /><polygon points="22,16 34,12 34,22 22,26" fill="%2314532d" /></g></g><g transform="translate(320, 180)"><polygon points="0,40 160,110 240,75 80,5" fill="%23334155" stroke="%23475569" stroke-width="2.5" /><polygon points="0,40 160,110 160,120 0,50" fill="%231e293b" /><polygon points="160,110 240,75 240,85 160,120" fill="%231e293b" /><line x1="20" y1="46" x2="95" y2="13" stroke="%2364748b" stroke-width="2" /><line x1="40" y1="56" x2="115" y2="23" stroke="%2364748b" stroke-width="2" /><line x1="60" y1="65" x2="135" y2="32" stroke="%2364748b" stroke-width="2" /><line x1="80" y1="74" x2="155" y2="41" stroke="%2364748b" stroke-width="2" /><line x1="100" y1="83" x2="175" y2="50" stroke="%2364748b" stroke-width="2" /><line x1="120" y1="92" x2="195" y2="59" stroke="%2364748b" stroke-width="2" /><line x1="140" y1="101" x2="215" y2="68" stroke="%2364748b" stroke-width="2" /><g transform="translate(140, 50)"><polygon points="10,10 25,17 40,11 25,4" fill="%23ca8a04" /><polygon points="10,10 25,17 25,27 10,20" fill="%23a16207" /><polygon points="25,17 40,11 40,21 25,27" fill="%23854d0e" /><path d="M 25,-4 L 35,-12" fill="none" stroke="%2322c55e" stroke-width="2.5" marker-end="url(%23arrow)" /></g><g transform="translate(40, 10)"><polygon points="10,10 25,17 40,11 25,4" fill="%23dc2626" /><polygon points="10,10 25,17 25,27 10,20" fill="%23b91c1c" /><polygon points="25,17 40,11 40,21 25,27" fill="%23991b1b" /></g></g><g transform="translate(480, 130)"><ellipse cx="20" cy="40" rx="15" ry="7" fill="%23475569" stroke="%2364748b" /><rect x="12" y="15" width="16" height="25" fill="%23334155" stroke="%23475569" /><line x1="20" y1="20" x2="5" y2="-10" stroke="%23eab308" stroke-width="6" stroke-linecap="round" /><circle cx="20" cy="20" r="5" fill="%231e293b" /><line x1="5" y1="-10" x2="35" y2="-25" stroke="%23eab308" stroke-width="4" stroke-linecap="round" /><circle cx="5" cy="-10" r="4" fill="%231e293b" /><circle cx="35" cy="-25" r="3" fill="black" /><line x1="35" y1="-25" x2="35" y2="-12" stroke="%2364748b" stroke-width="2" /><rect x="30" y="-12" width="10" height="7" fill="%23a855f7" /></g><g transform="translate(450, 70)"><rect width="160" height="70" rx="4" fill="%231e293b" opacity="0.9" stroke="%230ea5e9" stroke-width="1.5" /><text x="10" y="18" fill="%2338bdf8" font-family="sans-serif" font-size="9" font-weight="bold">FLEXSIM DASHBOARD</text><text x="10" y="36" fill="%23f8fafc" font-family="monospace" font-size="10">Throughput: 1,424 pcs/hr</text><text x="10" y="52" fill="%23f8fafc" font-family="monospace" font-size="10">AGV State: ACTIVE (94%)</text><rect x="125" y="42" width="6" height="15" fill="%2310b981" /><rect x="134" y="32" width="6" height="25" fill="%2310b981" /><rect x="143" y="22" width="6" height="35" fill="%2338bdf8" /></g><defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="%2322c55e" /></marker></defs></svg>',
      desc: 'Modelador logístico e industrial en tres dimensiones para auditar colas de procesos, cuellos de botella y flujos operativos eficientemente.'
    },
    {
      name: 'Arena',
      url: 'https://www.arenasimulation.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%23f0f4f8" /><rect width="640" height="40" fill="%230d47a1" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">Rockwell Arena - [Model1.doe - Discrete Event Simulator]</text><rect x="15" y="10" width="20" height="20" rx="3" fill="white" /><text x="19" y="24" fill="%230d47a1" font-family="sans-serif" font-size="13" font-weight="900">A</text><rect x="0" y="40" width="140" height="320" fill="%23ffffff" stroke="%23b0bec5" /><text x="15" y="65" fill="%231565c0" font-family="sans-serif" font-size="9" font-weight="bold">BASIC PROCESS</text><g transform="translate(15, 80)"><rect x="0" y="0" width="110" height="25" rx="3" fill="%23e3f2fd" stroke="%2342a5f5" /><text x="10" y="16" fill="%230d47a1" font-family="sans-serif" font-size="9" font-weight="bold">⚙️ Create (Llegada)</text><rect x="0" y="35" width="110" height="25" rx="3" fill="%23e8f5e9" stroke="%2366bb6a" /><text x="10" y="51" fill="%231b5e20" font-family="sans-serif" font-size="9" font-weight="bold">⚙️ Process (Servicio)</text><rect x="0" y="70" width="110" height="25" rx="3" fill="%23fffde7" stroke="%23ffee58" /><text x="10" y="86" fill="%23f57f17" font-family="sans-serif" font-size="9" font-weight="bold">🔶 Decide (Ruta)</text><rect x="0" y="105" width="110" height="25" rx="3" fill="%23ffebee" stroke="%23ef5350" /><text x="10" y="121" fill="%23b71c1c" font-family="sans-serif" font-size="9" font-weight="bold">⚙️ Dispose (Salida)</text></g><rect x="150" y="50" width="480" height="300" rx="6" fill="%23ffffff" stroke="%23cfd8dc" /><g fill="none" stroke="%23eceff1" stroke-width="1"><line x1="150" y1="80" x2="630" y2="80" /><line x1="150" y1="120" x2="630" y2="120" /><line x1="150" y1="160" x2="630" y2="160" /><line x1="150" y1="200" x2="630" y2="200" /><line x1="150" y1="240" x2="630" y2="240" /><line x1="150" y1="280" x2="630" y2="280" /><line x1="180" y1="50" x2="180" y2="350" /><line x1="240" y1="50" x2="240" y2="350" /><line x1="300" y1="50" x2="300" y2="350" /><line x1="360" y1="50" x2="360" y2="350" /><line x1="420" y1="50" x2="420" y2="350" /><line x1="480" y1="50" x2="480" y2="350" /><line x1="540" y1="50" x2="540" y2="350" /></g><g transform="translate(170, 150)"><rect width="70" height="40" rx="3" fill="%23e3f2fd" stroke="%230d47a1" stroke-width="1.5" /><text x="8" y="24" fill="%230d47a1" font-family="sans-serif" font-size="10" font-weight="bold">Create 1</text></g><g transform="translate(290, 150)"><rect width="80" height="40" rx="3" fill="%23e8f5e9" stroke="%231b5e20" stroke-width="1.5" /><text x="12" y="24" fill="%231b5e20" font-family="sans-serif" font-size="10" font-weight="bold">Process 1</text><text x="5" y="-5" fill="%231565c0" font-family="monospace" font-size="9" font-weight="bold">Queue: 2</text></g><g transform="translate(420, 145)"><polygon points="30,0 60,25 30,50 0,25" fill="%23fffde7" stroke="%23f57f17" stroke-width="1.5" /><text x="15" y="29" fill="%23f57f17" font-family="sans-serif" font-size="9" font-weight="bold">Decide 1</text></g><g transform="translate(530, 150)"><rect width="70" height="40" rx="3" fill="%23ffebee" stroke="%23b71c1c" stroke-width="1.5" /><text x="10" y="24" fill="%23b71c1c" font-family="sans-serif" font-size="10" font-weight="bold">Dispose 1</text></g><path d="M 240,170 L 290,170" fill="none" stroke="black" stroke-width="1.5" /><path d="M 370,170 L 420,170" fill="none" stroke="black" stroke-width="1.5" /><path d="M 480,170 L 530,170" fill="none" stroke="black" stroke-width="1.5" /></svg>',
      desc: 'Simulador robusto de eventos discretos para el análisis detallado de colas, tiempos de ciclo, operaciones fabriles de ensamble y logística avanzada.'
    },
    {
      name: 'Promodel',
      url: 'https://www.promodel.com',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%"><rect width="640" height="360" fill="%231e293b" /><rect width="640" height="40" fill="%230f172a" /><text x="50" y="25" fill="white" font-family="sans-serif" font-size="12" font-weight="bold">ProModel Optimization Suite - AssemblyFloor.mod</text><circle cx="25" cy="20" r="10" fill="%2310b981" /><text x="21" y="24" fill="white" font-family="sans-serif" font-size="11" font-weight="bold">P</text><rect x="10" y="50" width="620" height="300" rx="4" fill="%230f172a" stroke="%23ffbb00" stroke-opacity="0.2" /><g transform="translate(30, 70)"><text x="10" y="20" fill="%2310b981" font-family="sans-serif" font-size="12" font-weight="bold">LOCACIONES (LOCATIONS)</text><rect x="10" y="30" width="580" height="240" rx="6" fill="%231e293b" stroke="%23334155" /><path d="M 50,150 L 550,150" fill="none" stroke="%23475569" stroke-width="8" /><polygon points="60,110 90,130 30,130" fill="%2310b981" /><text x="35" y="100" fill="white" font-family="sans-serif" font-size="9">Pallet_In</text><rect x="160" y="110" width="60" height="30" fill="none" stroke="%23f43f5e" stroke-width="3" /><circle cx="190" cy="125" r="8" fill="%23f43f5e" /><text x="165" y="100" fill="white" font-family="sans-serif" font-size="9">Lathe_Process</text><rect x="340" y="110" width="60" height="30" fill="none" stroke="%233b82f6" stroke-width="3" /><text x="345" y="100" fill="white" font-family="sans-serif" font-size="9">Mill_Assemble</text><circle cx="510" cy="125" r="16" fill="%2310b981" /><text x="495" y="100" fill="white" font-family="sans-serif" font-size="9">Inspection</text><path d="M 60,150 L 160,125" fill="none" stroke="%2310b981" stroke-width="2" stroke-dasharray="3,3" /><path d="M 220,125 L 340,125" fill="none" stroke="%233b82f6" stroke-width="2" stroke-dasharray="3,3" /><path d="M 400,125 L 494,125" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-dasharray="3,3" /><rect x="25" y="210" width="180" height="50" rx="3" fill="%230f172a" stroke="%23334155" /><text x="35" y="228" fill="%2394a3b8" font-family="sans-serif" font-size="8.5" font-weight="bold">PROCESAMIENTO (PROCESSING)</text><text x="35" y="245" fill="white" font-family="monospace" font-size="9">Entity: Part1 =&gt; Loc: Lathe</text></g></svg>',
      desc: 'Plataforma industrial para la simulación dinámica de procesos mecánicos, flujos fabriles automatizados y cadenas de suministro críticas.'
    }
  ]
};

// Fix image paths for production deployment where they reside in /public/assets/images
Object.keys(CATEGORY_SHOWCASES).forEach(catId => {
  CATEGORY_SHOWCASES[catId] = CATEGORY_SHOWCASES[catId].map(item => ({
    ...item,
    image: item.image.startsWith('/src/assets/images/') 
      ? item.image.replace('/src/assets/images/', '/assets/images/') 
      : item.image
  }));
});

// Skills Category definitions
export const SKILLS_CATEGORIES = [
  {
    name: 'Docencia y Desarrollo Educativo',
    icon: GraduationCap,
    subcategories: [
      'Aplicación de metodologías de enseñanza basadas en proyectos (ABP) y resolución de problemas.',
      'Desarrollo de proyectos educativos en programación, automatización, robótica e Internet de las Cosas (IoT).',
      'Capacidad para impartir instrucción técnica y práctica en entornos educativos y de capacitación.',
      'Diseño de experiencias de aprendizaje orientadas a la innovación y al desarrollo tecnológico.'
    ],
    color: 'emerald'
  },
  {
    name: 'Programación y Tecnologías de la Información',
    icon: Code,
    subcategories: [
      'Desarrollo de software y sistemas web en diversos lenguajes (Python, PHP, HTML/CSS, JS/TS).',
      'Aplicación de programación orientada a objetos (Java, C#) y entornos de alto rendimiento (C/C++).',
      'Programación a nivel de firmware y bajo nivel utilizando ensamblador (ASM, TASM) y descripción de hardware en VHDL.',
      'Diseño de bases de datos relacionales mediante SQL y administración de sistemas en Linux/Unix.'
    ],
    color: 'amber'
  },
  {
    name: 'Electrónica y Sistemas Embebidos',
    icon: Cpu,
    subcategories: [
      'Diseño y desarrollo de arquitecturas de sistemas embebidos.',
      'Instrumentación electrónica, sensores y circuitos de acondicionamiento de señales analógicas y digitales.',
      'Diseño y simulación de circuitos híbridos, lógicos y microcomputadoras de placa única (Beaglebone, Raspberry Pi, Arduino).',
      'Implementación de electrónica de potencia, control de motores (AC/DC) y servomotores de precisión.'
    ],
    color: 'blue'
  },
  {
    name: 'Automatización, Robótica e IoT',
    icon: Sliders,
    subcategories: [
      'Programación de Controladores Lógicos Programables (PLC) mediante diagramas Ladder y bloques de funciones (Logo, Syswin, CoDeSys).',
      'Simulación y emulación tridimensional de procesos y celdas de manufactura automatizada (FlexSim, Arena, Promodel).',
      'Diseño e integración de sistemas de control electromagnético y neumático para maquinaria industrial (FluidSim).',
      'Interconexión de sensores complejos y actuadores inalámbricos para ecosistemas IoT (Internet de las Cosas).'
    ],
    color: 'indigo'
  },
  {
    name: 'Diseño, Manufactura y Fabricación',
    icon: Layers,
    subcategories: [
      'Diseño asistido por computadora (CAD) en 3D para la concepción de refacciones y moldes de precisión (Tinkercad).',
      'Fabricación y prototipado rápido mediante tecnologías de impresión 3D / manufactura aditiva.',
      'Programación y mecanizado de precisión de piezas mecánicas utilizando software CNC (SinuTrain).',
      'Operación regulada de máquinas herramientas convencionales como torno, fresadora y rectificadora.'
    ],
    color: 'rose'
  },
  {
    name: 'Soldadura y Herramientas Industriales',
    icon: Wrench,
    subcategories: [
      'Aplicación experta de técnicas de soldadura en arco eléctrico ordinario y especializado.',
      'Especialización en métodos de soldadura avanzada MIG (Metal Inert Gas) y TIG (Tungsten Inert Gas) para alta resistencia.',
      'Soldadura, unión y reparación de piezas metálicas no ferrosas (aluminio, cobre, bronce).',
      'Uso seguro e implementación de herramientas convencionales, manuales y mecánicas industriales en taller.'
    ],
    color: 'sky'
  },
  {
    name: 'Gestión y Habilidades Profesionales',
    icon: Briefcase,
    subcategories: [
      'Gestión de negocios, administración de finanzas comerciales, auditoría y control de documentos clave.',
      'Dirección y entrenamiento de cuadrillas de personal operativo, compras de insumos y negociación con proveedores.',
      'Planificación e implementación de filosofías de manufactura esbelta (Lean Manufacturing, Kaizen, 5S).',
      'Análisis de fallas estructurales, resolución pacífica de conflictos corporativos e instrucción metódica de equipos.'
    ],
    color: 'violet'
  }
];

const THEME_CONFIG: Record<string, {
  color: string;
  badgeBgActive: string;
  badgeBgHover: string;
  badgeTextActive: string;
  badgeTextHover: string;
  badgeBorderActive: string;
  badgeBorderHover: string;
  bulletColor: string;
  iconClassName: string;
}> = {
  soft_1: {
    color: 'emerald',
    badgeBgActive: 'bg-emerald-600 text-white border-emerald-600',
    badgeBgHover: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-emerald-800',
    badgeBorderActive: 'border-emerald-600',
    badgeBorderHover: 'border-emerald-200',
    bulletColor: 'bg-emerald-500',
    iconClassName: 'text-emerald-500'
  },
  soft_2: {
    color: 'blue',
    badgeBgActive: 'bg-blue-600 text-white border-blue-600',
    badgeBgHover: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-blue-800',
    badgeBorderActive: 'border-blue-600',
    badgeBorderHover: 'border-blue-200',
    bulletColor: 'bg-blue-500',
    iconClassName: 'text-blue-500'
  },
  soft_3: {
    color: 'amber',
    badgeBgActive: 'bg-amber-600 text-white border-amber-600',
    badgeBgHover: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-amber-800',
    badgeBorderActive: 'border-amber-600',
    badgeBorderHover: 'border-amber-200',
    bulletColor: 'bg-amber-500',
    iconClassName: 'text-amber-500'
  },
  soft_4: {
    color: 'indigo',
    badgeBgActive: 'bg-indigo-600 text-white border-indigo-600',
    badgeBgHover: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-indigo-800',
    badgeBorderActive: 'border-indigo-600',
    badgeBorderHover: 'border-indigo-200',
    bulletColor: 'bg-indigo-500',
    iconClassName: 'text-indigo-500'
  },
  soft_5: {
    color: 'rose',
    badgeBgActive: 'bg-rose-600 text-white border-rose-600',
    badgeBgHover: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:text-rose-800',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-rose-800',
    badgeBorderActive: 'border-rose-600',
    badgeBorderHover: 'border-rose-200',
    bulletColor: 'bg-rose-500',
    iconClassName: 'text-rose-500'
  },
  soft_6: {
    color: 'sky',
    badgeBgActive: 'bg-sky-600 text-white border-sky-600',
    badgeBgHover: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:text-sky-800',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-sky-800',
    badgeBorderActive: 'border-sky-600',
    badgeBorderHover: 'border-sky-200',
    bulletColor: 'bg-sky-500',
    iconClassName: 'text-sky-500'
  }
};

const getTheme = (catId: string) => {
  return THEME_CONFIG[catId] || {
    color: 'blue',
    badgeBgActive: 'bg-blue-600 text-white border-blue-600',
    badgeBgHover: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    badgeTextActive: 'text-white',
    badgeTextHover: 'text-blue-800',
    badgeBorderActive: 'border-blue-600',
    badgeBorderHover: 'border-blue-200',
    bulletColor: 'bg-blue-500',
    iconClassName: 'text-blue-500'
  };
};

// Collapsible widget for the general skills abstract (collapses to 2 lines when showSkillsDiv is false, interactive hover/tap expand)
function CollapsibleSkillsAbstract({ 
  skillsText, 
  forceExpanded 
}: { 
  skillsText: string; 
  forceExpanded: boolean;
}) {
  const [isHoveredOrTapped, setIsHoveredOrTapped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useRef(false);

  const isCurrentlyExpanded = forceExpanded || isHoveredOrTapped;

  useEffect(() => {
    if (!isHoveredOrTapped) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsHoveredOrTapped(false);
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isHoveredOrTapped]);

  const handleTouchStart = () => {
    isTouchDevice.current = true;
    setIsHoveredOrTapped(true);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice.current) {
      setIsHoveredOrTapped(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice.current) {
      setIsHoveredOrTapped(false);
    }
  };

  const handleMouseMove = () => {
    isTouchDevice.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      className={`p-4 bg-gray-50 border border-gray-200 rounded-xl leading-relaxed text-gray-800 text-sm transition-all duration-300 relative cursor-pointer ${
        isCurrentlyExpanded 
          ? 'shadow-xs border-blue-200 bg-blue-50/10' 
          : 'hover:bg-gray-100/60'
      }`}
    >
      <div className={isCurrentlyExpanded ? '' : 'line-clamp-2'}>
        {skillsText}
      </div>
      {!isCurrentlyExpanded && (
        <span className="text-[11px] text-blue-600 font-semibold block mt-1 hover:underline">
          Ver resumen completo...
        </span>
      )}
    </div>
  );
}

interface SkillsVideoScreenProps {
  videoId: string;
  poster?: string;
}

const SkillsVideoScreen: React.FC<SkillsVideoScreenProps> = ({ 
  videoId,
  poster = "/assets/images/profesor_docencia_y_desarrollo_educativo.png" 
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [originUrl, setOriginUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }
  }, []);

  // Build high reliability YouTube embed parameters
  // autoplay=1 and mute=1 enables reliable autoplay on all modern browsers
  // loop=1 together with playlist=VIDEO_ID enables reliable infinite loop playback
  // enablejsapi=1 enables using postMessage API control
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&disablekb=1${originUrl ? `&origin=${encodeURIComponent(originUrl)}` : ""}`;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isPlaying) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "*"
        );
        setIsPlaying(false);
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "*"
        );
        setIsPlaying(true);
      }
    }
  };

  const handleMuteUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "unMute", args: [] }),
          "*"
        );
        setIsMuted(false);
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "mute", args: [] }),
          "*"
        );
        setIsMuted(true);
      }
    }
  };

  return (
    <div 
      className="w-full h-full min-h-[380px] rounded-2xl border border-gray-200/80 overflow-hidden relative shadow-sm bg-neutral-950 flex items-center justify-center cursor-pointer group select-none"
      onClick={handlePlayPause}
    >
      {/* Aspect locked device simulator style layout */}
      <div className="w-full h-full max-h-[350px] flex items-center justify-center pointer-events-none">
        <div className="w-[190px] h-full max-h-[338px] aspect-[9/16] relative overflow-hidden rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="Meta AI Short Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            className="w-full h-full absolute inset-0 border-0 scale-[1.05]"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Hover action bar for volume status */}
      <div 
        className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleMuteUnmute}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white border border-white/10 text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 outline-none"
        >
          {isMuted ? "Sound Off" : "Sound On"}
        </button>
      </div>
    </div>
  );
};

const COLOR_CLASSES: Record<string, {
  bg: string;
  border: string;
  text: string;
  accent: string;
  badge: string;
  fill: string;
}> = {
  emerald: {
    bg: "bg-emerald-50/20",
    border: "border-emerald-500/15",
    text: "text-emerald-950",
    accent: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    fill: "bg-emerald-500"
  },
  amber: {
    bg: "bg-amber-50/20",
    border: "border-amber-500/15",
    text: "text-amber-950",
    accent: "text-amber-600",
    badge: "bg-amber-50 text-amber-900 border-amber-200/50",
    fill: "bg-amber-500"
  },
  blue: {
    bg: "bg-blue-50/20",
    border: "border-blue-500/15",
    text: "text-blue-900",
    accent: "text-blue-600",
    badge: "bg-blue-50 text-blue-800 border-blue-200/50",
    fill: "bg-blue-500"
  },
  indigo: {
    bg: "bg-indigo-50/20",
    border: "border-indigo-500/15",
    text: "text-indigo-900",
    accent: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-800 border-indigo-200/50",
    fill: "bg-indigo-500"
  },
  rose: {
    bg: "bg-rose-50/20",
    border: "border-rose-500/15",
    text: "text-rose-900",
    accent: "text-rose-600",
    badge: "bg-rose-50 text-rose-800 border-rose-200/50",
    fill: "bg-rose-500"
  },
  sky: {
    bg: "bg-sky-50/20",
    border: "border-sky-500/15",
    text: "text-sky-900",
    accent: "text-sky-600",
    badge: "bg-sky-50 text-sky-800 border-sky-200/50",
    fill: "bg-sky-500"
  },
  violet: {
    bg: "bg-violet-50/20",
    border: "border-violet-500/15",
    text: "text-violet-900",
    accent: "text-violet-600",
    badge: "bg-violet-50 text-violet-800 border-violet-200/50",
    fill: "bg-violet-500"
  }
};

const getCategoryMetadata = (index: number) => {
  const meta = [
    {
      title: "Docencia & Innovación",
      tagline: "Pedagogía Técnica",
      highlights: [
        "Metodologías Activas (ABP)",
        "Docencia Basada en Retos",
        "Diseño Curricular de TI",
        "Evaluación de Competencias"
      ],
      xpBadge: "Experiencia Senior",
      statLabel: "Proyectos Educativos",
      statVal: "+45"
    },
    {
      title: "Arquitectura & Software",
      tagline: "Desarrollo Fullstack & TI",
      highlights: [
        "Código Limpio y Escalable",
        "Desarrollo Web e Integración",
        "Firmware y Bajo Nivel (ASM)",
        "Administración de Unix/Linux"
      ],
      xpBadge: "Ingeniería de Software",
      statLabel: "Sistemas & Apps",
      statVal: "+60"
    },
    {
      title: "Sistemas Inteligentes",
      tagline: "Hardware & Control",
      highlights: [
        "Arquitectura de Embebidos",
        "Acondicionamiento de Señal",
        "Microcomputadoras de Placa Única",
        "Electrónica de Potencia"
      ],
      xpBadge: "Diseño de Hardware",
      statLabel: "Circuitos Integrados",
      statVal: "+30"
    },
    {
      title: "Automatización e Industria",
      tagline: "Procesos y Robótica",
      highlights: [
        "Programación PLC Avanzada",
        "Simulación 3D (FlexSim/Arena)",
        "Ecosistemas IoT e Industriales",
        "Control Neumático y Eléctrico"
      ],
      xpBadge: "Sistemas de Control",
      statLabel: "Modelos Optimizados",
      statVal: "+25"
    },
    {
      title: "Diseño & Fabricación 3D",
      tagline: "Prototipado e Ingeniería",
      highlights: [
        "Diseño CAD 3D Avanzado",
        "Manufactura Aditiva (Impresión)",
        "Programación de Tornos CNC",
        "Operación de Máquinas Taller"
      ],
      xpBadge: "Diseño Industrial",
      statLabel: "Prototipos Físicos",
      statVal: "+40"
    },
    {
      title: "Soldadura & Planta",
      tagline: "Procesos Termomecánicos",
      highlights: [
        "Metalurgia Avanzada",
        "Soldadura MIG / TIG Experta",
        "Mecanizado de Precisión",
        "Normas de Seguridad Industrial"
      ],
      xpBadge: "Taller & Estructuras",
      statLabel: "Uniones y Ensamble",
      statVal: "Pro"
    },
    {
      title: "Operaciones & Liderazgo",
      tagline: "Gestión Organizacional",
      highlights: [
        "Lean Manufacturing / 5S",
        "Coordinación de Personal",
        "Negociación con Proveedores",
        "Análisis y Prevención de Fallas"
      ],
      xpBadge: "Liderazgo Técnico",
      statLabel: "Equipos Dirigidos",
      statVal: "Sólido"
    }
  ];
  return meta[index] || {
    title: "Especialidad Técnica",
    tagline: "Habilidades Profesionales",
    highlights: ["Competencia demostrada", "Fundamentos integrales", "Desarrollo tecnológico", "Soluciones de ingeniería"],
    xpBadge: "Especialista",
    statLabel: "Actividades",
    statVal: "100%"
  };
};

export default function SkillsView({
  skillsText,
  softwareCategories,
  isEditing,
  onEditSkillsText,
  onEditSoftwareCategory,
  onAddSoftwareCategory,
  experienceContent
}: SkillsViewProps) {
  
  const [showSkillsDiv, setShowSkillsDiv] = useState<boolean>(false);
  const [categoryIndices, setCategoryIndices] = useState<Record<string, number>>({
    soft_1: 0,
    soft_2: 0,
    soft_3: 0,
    soft_4: 0,
    soft_5: 0,
    soft_6: 0,
  });
  const [activePopupSite, setActivePopupSite] = useState<{ name: string; url: string; image: string; desc: string; } | null>(null);
  const [activeCatIndex, setActiveCatIndex] = useState<number>(0);
  const [activeVideoTab, setActiveVideoTab] = useState<'loop' | 'embed'>('loop');

  // State for editable custom category subcategories
  const [customSubcategories, setCustomSubcategories] = useState<string[][]>(() => {
    const saved = localStorage.getItem('esqueda_custom_subcategories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === SKILLS_CATEGORIES.length) {
          return parsed;
        }
      } catch (e) {
        console.error("Error al cargar subcategorías de habilidades:", e);
      }
    }
    return SKILLS_CATEGORIES.map(cat => cat.subcategories);
  });

  const handleRestoreDefaultSubcategories = () => {
    const defaults = SKILLS_CATEGORIES.map(cat => cat.subcategories);
    setCustomSubcategories(defaults);
    localStorage.setItem('esqueda_custom_subcategories', JSON.stringify(defaults));
  };


  const getInteractiveAnimationContent = (catName: string, subText: string | null = null) => {
    const canonicalName = catName.toLowerCase();
    const canonicalSub = subText ? subText.toLowerCase() : '';

    // If we have an active hover on a subcategory/competency description, render a highly contextual diagnostic animation component
    if (subText) {
      // 1. EMBEBIDOS / MICROCONTROLADORES / HARDWARE / firmware / etc.
      if (canonicalSub.includes('embebidos') || canonicalSub.includes('microcomputadoras') || canonicalSub.includes('arduino') || canonicalSub.includes('raspberry') || canonicalSub.includes('firmware') || canonicalSub.includes('periféricos')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-blue-50/30 border-2 border-blue-500/45 text-blue-900 select-none">
            {/* PCB track emulation */}
            <svg className="absolute inset-0 w-full h-full stroke-blue-500/10 fill-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 15 15 L 90 15 L 110 35 L 190 35" strokeWidth="1.5" />
              <path d="M 40 140 L 40 90 L 110 90 L 140 120" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-blue-400 flex items-center justify-center shadow-md">
              <Cpu className="w-6 h-6 text-blue-400 rotate-180" />
            </div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3 mb-1 font-mono">
              Firmware & Hardware
            </span>
            <p className="text-[10.5px] text-blue-800 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 2. MOTORES / POTENCIA / CONTROL / SERVOS
      if (canonicalSub.includes('potencia') || canonicalSub.includes('motores') || canonicalSub.includes('servomotores') || canonicalSub.includes('control') || canonicalSub.includes('buses')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-amber-50/30 border-2 border-amber-500/45 text-amber-900 select-none">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 border border-amber-400 shadow-md">
              <RotateCw className="w-6 h-6 text-amber-500" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-3 mb-1 font-mono">
              Control & Actuadores
            </span>
            <p className="text-[10.5px] text-amber-850 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 3. INSTRUMENTACIÓN / SENSADO / CIRCUITOS / ANALÓGICA / ADQUISICIÓN
      if (canonicalSub.includes('instrumentación') || canonicalSub.includes('sensores') || canonicalSub.includes('señales') || canonicalSub.includes('circuitos') || canonicalSub.includes('adquisición') || canonicalSub.includes('analógica')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-cyan-50/35 border-2 border-cyan-500/45 text-cyan-900 select-none">
            {/* Animated Wave */}
            <svg className="w-28 h-10 stroke-cyan-600 fill-none mb-1" viewBox="0 0 100 40">
              <path d="M0,20 Q12.5,0 25,20 T50,20 T75,20 T100,20" strokeWidth="2.5" />
            </svg>
            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-2 mb-1 font-mono">
              Instrumentación & Signal
            </span>
            <p className="text-[10.5px] text-cyan-850 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 4. PROGRAMACIÓN / ALGORITMOS / POO / C++ / PYTHON / TI
      if (canonicalSub.includes('programación') || canonicalSub.includes('desarrollo') || canonicalSub.includes('arquitecturas') || canonicalSub.includes('código') || canonicalSub.includes('algoritmos') || canonicalSub.includes('poo') || canonicalSub.includes('sistemas')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-indigo-50/30 border-2 border-indigo-500/45 text-indigo-900 font-mono select-none">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-indigo-400 text-indigo-400 mb-2">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 font-mono">
              Ingeniería de Software
            </span>
            <p className="text-[10.5px] text-indigo-850 font-bold max-w-[210px] text-center leading-normal font-sans italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 5. DOCENCIA / CURSOS / METODOLOGÍAS / PEDAGOGÍA / ACADEMIA
      if (canonicalSub.includes('docencia') || canonicalSub.includes('conocimiento') || canonicalSub.includes('pedagogía') || canonicalSub.includes('academia') || canonicalSub.includes('cursos') || canonicalSub.includes('enseñanza') || canonicalSub.includes('mentoría')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-emerald-50/30 border-2 border-emerald-500/45 text-emerald-900 select-none">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-emerald-400 text-emerald-400 mb-2">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-606 uppercase tracking-widest mb-1 font-mono">
              Pedagogía & Mentoría
            </span>
            <p className="text-[10.5px] text-emerald-850 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 6. CAD / CNC / MECANIZADO / DISEÑO INDUSTRIAL / MANUFACTURA
      if (canonicalSub.includes('cad') || canonicalSub.includes('cnc') || canonicalSub.includes('manufactura') || canonicalSub.includes('mecanizado') || canonicalSub.includes('diseño') || canonicalSub.includes('3d') || canonicalSub.includes('fabricación') || canonicalSub.includes('maquinado') || canonicalSub.includes('computarizado')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-rose-50/30 border-2 border-rose-500/45 text-rose-900 select-none">
            <div className="w-10 h-10 relative flex items-center justify-center border border-dashed border-rose-400 rounded bg-slate-900 mb-2">
              <Layers className="w-5 h-5 text-rose-450" />
            </div>
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1 font-mono">
              Modelado CAD & CNC
            </span>
            <p className="text-[10.5px] text-rose-850 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 7. SOLDADURA / METALMECÁNICA / TALLERES
      if (canonicalSub.includes('soldadura') || canonicalSub.includes('herramientas') || canonicalSub.includes('metalúrgica') || canonicalSub.includes('taller') || canonicalSub.includes('mecanizamiento') || canonicalSub.includes('metalmecánica')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-sky-50/30 border-2 border-sky-500/45 text-sky-900 select-none">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border border-sky-450 text-sky-405 mb-2">
              <Wrench className="w-5 h-5 rotate-45" />
            </div>
            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1 font-mono">
              PROCESOS DE SOLDADURA & TALLER
            </span>
            <p className="text-[10.5px] text-sky-850 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // 8. GESTIÓN / LIDERAZGO / MEJORA CONTINUA / LEAN
      if (canonicalSub.includes('gestión') || canonicalSub.includes('liderazgo') || canonicalSub.includes('auditoría') || canonicalSub.includes('resolución') || canonicalSub.includes('calidad') || canonicalSub.includes('5s') || canonicalSub.includes('lean') || canonicalSub.includes('esbelta') || canonicalSub.includes('recursos')) {
        return (
          <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-violet-50/30 border-2 border-violet-500/45 text-violet-900 select-none">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-violet-400 text-violet-400 mb-2">
              <Sliders className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1 font-mono">
              Mejora Continua & Kaizen
            </span>
            <p className="text-[10.5px] text-violet-850 font-bold max-w-[210px] text-center leading-normal italic">
              "{subText}"
            </p>
          </div>
        );
      }

      // Fallback contextual default subcategory preview
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-blue-50/30 border-2 border-blue-500/35 text-blue-900 select-none">
          <Sparkles className="w-8 h-8 text-blue-600 mb-2" />
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 font-mono">
            {catName}
          </span>
          <p className="text-[10.5px] text-blue-800 font-bold max-w-[210px] text-center leading-normal italic">
            "{subText}"
          </p>
        </div>
      );
    }

    // --- CATEGORY LEVEL FALLBACK ANIMATIONS (When hovered on categories buttons, tabs, etc) ---

    // Emerald / Docencia
    if (canonicalName.includes('docencia') || canonicalName.includes('educativo')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-emerald-50/20 border border-emerald-500/20 text-emerald-950 select-none">
          <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-10 select-none text-[8.5px] leading-tight text-emerald-600">
            <div>💡 Aprendizaje Activo</div>
            <div>📂 Plan de Trabajo Anual</div>
            <div>🎓 Desarrollo Profesional</div>
            <div>📈 Evaluación Continua</div>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <GraduationCap className="w-12 h-12 text-emerald-600 mb-3" />
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
              Docencia & Pedagogía
            </span>
            <p className="text-[11px] text-emerald-800 font-semibold max-w-[200px] leading-relaxed">
              Planificación educativa, metodologías de enseñanza-aprendizaje, mentoría y desarrollo académico integral.
            </p>
          </div>
        </div>
      );
    }
    
    // Amber/Yellow / Programación y TI
    if (canonicalName.includes('programación') || canonicalName.includes('tecnologías')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-amber-50/20 border border-amber-500/20 text-amber-900 font-mono text-left select-none">
          <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-15 select-none text-[8.5px] leading-tight text-amber-600">
            <div>import {'{ useState }'} from 'react';</div>
            <div>const [state, setState] = useState(null);</div>
            <div>const runAlgorithm = (data) =&gt; {'{'}</div>
            <div>&nbsp;&nbsp;return data.filter(item =&gt; item.active);</div>
            <div>{'};'}</div>
            <div>export default function App() {'{'} ... {'}'}</div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <Code className="w-12 h-12 text-amber-600 mb-3" />
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1 font-sans">
              Desarrollo & Algoritmos
            </span>
            <p className="text-[11px] text-amber-705 font-semibold max-w-[200px] leading-relaxed font-sans text-center">
              Código limpio, orientado a objetos, sistemas de bajo nivel y arquitectura fullstack moderna.
            </p>
          </div>
        </div>
      );
    }
    
    // Blue / Electrónica
    if (canonicalName.includes('electrónica') || canonicalName.includes('embebidos')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-blue-50/20 border border-blue-500/20 text-blue-900 select-none">
          {/* Electrical PCB grid paths */}
          <svg className="absolute inset-0 w-full h-full stroke-blue-500/10 fill-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 20 L 100 20 L 120 40 L 200 40" strokeWidth="1.5" />
            <path d="M 50 150 L 50 100 L 120 100 L 150 130" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 180 180 L 140 140 L 80 140" strokeWidth="1.5" />
          </svg>
          
          {/* Microcontroller simulation */}
          <div className="relative z-10 w-20 h-20 rounded-xl bg-slate-900 border-2 border-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Cpu className="w-10 h-10 text-blue-400 rotate-180" />
            {/* SMD Pin indicators */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 flex gap-1">
              <span className="w-1.5 h-1 bg-blue-400/80 rounded-b" />
              <span className="w-1.5 h-1 bg-blue-400/80 rounded-b" />
              <span className="w-1.5 h-1 bg-blue-400/80 rounded-b" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 flex gap-1">
              <span className="w-1.5 h-1 bg-blue-400/80 rounded-t" />
              <span className="w-1.5 h-1 bg-blue-400/80 rounded-t" />
              <span className="w-1.5 h-1 bg-blue-400/80 rounded-t" />
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 flex flex-col gap-1">
              <span className="h-1.5 w-1 bg-blue-400/80 rounded-r" />
              <span className="h-1.5 w-1 bg-blue-400/80 rounded-r" />
              <span className="h-1.5 w-1 bg-blue-400/80 rounded-r" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 flex flex-col gap-1">
              <span className="h-1.5 w-1 bg-blue-400/80 rounded-l" />
              <span className="h-1.5 w-1 bg-blue-400/80 rounded-l" />
              <span className="h-1.5 w-1 bg-blue-400/80 rounded-l" />
            </div>
          </div>
          
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest mt-4 mb-1 relative z-10">
            Sistemas Embebidos
          </span>
          <p className="text-[11px] text-blue-700 font-semibold max-w-[200px] text-center leading-relaxed relative z-10">
            Firmware, microarquitecturas, instrumentación de precisión y buses de datos industriales.
          </p>
        </div>
      );
    }
    
    // Indigo / Automatización y Robótica
    if (canonicalName.includes('automatización') || canonicalName.includes('robótica')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-indigo-50/20 border border-indigo-500/20 text-indigo-900 select-none">
          <div className="relative flex items-center justify-center w-24 h-24 mb-3">
            {/* Gears rotation */}
            <div 
              className="absolute text-indigo-400/40" 
              style={{ transformOrigin: 'center', width: '60px', height: '60px' }}
            >
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,35 C41.7,35 35,41.7 35,50 C35,58.3 41.7,65 50,65 C58.3,65 65,58.3 65,50 C65,41.7 58.3,35 50,35 Z M50,43 C53.9,43 57,46.1 57,50 C57,53.9 53.9,57 50,57 C46.1,57 43,53.9 43,50 C43,46.1 46.1,43 50,43 Z" />
                <rect x="44" y="10" width="12" height="20" rx="3" />
                <rect x="44" y="70" width="12" height="20" rx="3" />
                <rect x="10" y="44" width="20" height="12" rx="3" />
                <rect x="70" y="44" width="20" height="12" rx="3" />
                <g transform="rotate(45, 50, 50)">
                  <rect x="44" y="10" width="12" height="20" rx="3" />
                  <rect x="44" y="70" width="12" height="20" rx="3" />
                  <rect x="10" y="44" width="20" height="12" rx="3" />
                  <rect x="70" y="44" width="20" height="12" rx="3" />
                </g>
              </svg>
            </div>
            
            <div 
              className="absolute text-indigo-500" 
              style={{ transformOrigin: 'center', width: '38px', height: '38px', top: '42px', left: '10px' }}
            >
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,30 C39,30 30,39 30,50 C30,61 39,70 50,70 C61,70 70,61 70,50 C70,39 61,30 50,30 Z M50,42 C54.4,42 58,45.6 58,50 C58,54.4 54.4,58 50,58 C45.6,58 42,54.4 42,50 C42,45.6 45.6,42 50,42 Z" />
                <rect x="45" y="5" width="10" height="18" rx="2" />
                <rect x="45" y="77" width="10" height="18" rx="2" />
                <rect x="5" y="45" width="18" height="10" rx="2" />
                <rect x="77" y="45" width="18" height="10" rx="2" />
                <g transform="rotate(45, 50, 50)">
                  <rect x="45" y="5" width="10" height="18" rx="2" />
                  <rect x="45" y="77" width="10" height="18" rx="2" />
                  <rect x="5" y="45" width="18" height="10" rx="2" />
                  <rect x="77" y="45" width="18" height="10" rx="2" />
                </g>
              </svg>
            </div>
            <Sliders className="w-8 h-8 text-indigo-600 relative z-20" />
          </div>
          
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1 relative z-10">
            Automatización e IoT
          </span>
          <p className="text-[11px] text-indigo-700 font-semibold max-w-[200px] text-center leading-relaxed relative z-10">
            Programación de PLCs, integración de celdas robóticas, simulación de procesos y telemetría.
          </p>
        </div>
      );
    }
    
    // Rose / Diseño y Manufactura
    if (canonicalName.includes('diseño') || canonicalName.includes('manufactura') || canonicalName.includes('fabricación')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-rose-50/20 border border-rose-500/20 text-rose-900 select-none">
          {/* Wireframe Box */}
          <div className="w-16 h-16 relative flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-rose-400 rounded-lg" />
            <div className="absolute inset-2 border border-rose-300 opacity-60 rounded" />
            <Layers className="w-6 h-6 text-rose-500" />
          </div>
          
          <span className="text-xs font-black text-rose-600 uppercase tracking-widest mt-4 mb-1 relative z-10">
            CAD/CAM & Control Numérico
          </span>
          <p className="text-[11px] text-rose-700 font-semibold max-w-[200px] text-center leading-relaxed relative z-10">
            Diseño industrial tridimensional, prototipado aditivo y mecanizado computarizado CNC de alta precisión.
          </p>
        </div>
      );
    }
    
    // Sky / Soldadura
    if (canonicalName.includes('soldadura') || canonicalName.includes('herramientas')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-sky-50/20 border border-sky-500/20 text-sky-900 select-none">
          {/* Center piece */}
          <div className="w-16 h-16 rounded-full bg-sky-400/10 border-2 border-sky-400 flex items-center justify-center">
            <Wrench className="w-8 h-8 text-sky-500 rotate-45" />
          </div>
          
          {/* Static particles */}
          <div className="absolute w-2 h-2 rounded-full bg-amber-400 opacity-90" style={{ top: '35%', left: '42%' }} />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-80" style={{ top: '55%', right: '40%' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-sky-305 opacity-60" style={{ bottom: '38%', left: '52%' }} />
          
          <span className="text-xs font-black text-sky-600 uppercase tracking-widest mt-4 mb-1 relative z-10">
            Metalmecánica & Talleres
          </span>
          <p className="text-[11px] text-sky-700 font-semibold max-w-[200px] text-center leading-relaxed relative z-10">
            Metalurgia, técnicas avanzadas de soldadura estructuradas MIG/TIG, y maquinado manual de taller.
          </p>
        </div>
      );
    }
    
    // Violet / Gestión
    if (canonicalName.includes('gestión') || canonicalName.includes('profesionales')) {
      return (
        <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-violet-50/20 border border-violet-500/20 text-violet-900 select-none">
          {/* Strategic Venn flowchart with bubbles */}
          <div className="relative w-24 h-16 flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full border-2 border-violet-500 bg-violet-50/20 flex items-center justify-center text-violet-500 font-bold text-[10px]">Lean</div>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-400 bg-indigo-50/20 -ml-3 flex items-center justify-center text-indigo-500 font-bold text-[10px]">Líder</div>
          </div>
          
          <span className="text-xs font-black text-violet-600 uppercase tracking-widest mb-1 relative z-10 font-sans">
            Dirección & Manufactura Esbelta
          </span>
          <p className="text-[11px] text-violet-700 font-semibold max-w-[200px] text-center leading-relaxed relative z-10">
            Administración de recursos, Kaizen, 5S, auditoría comercial y resolución estratégica de problemas corporativos.
          </p>
        </div>
      );
    }

    // Fallback default polished generic skill animation
    return (
      <div className="relative w-full h-full min-h-[180px] flex flex-col justify-center items-center overflow-hidden p-6 rounded-2xl bg-blue-50/20 border border-blue-500/10 text-blue-900 select-none">
        <Sparkles className="w-10 h-10 text-blue-500 mb-3" />
        <span className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">
          {catName}
        </span>
        <p className="text-[11px] text-blue-700 font-semibold max-w-[200px] text-center">
          Competencia técnica avanzada y adaptativa orientada al liderazgo tecnológico e innovación del currículum.
        </p>
      </div>
    );
  };

  // Helper to split software string by commas to show beautiful modern tags
  const renderSoftwareBadges = (toolsString: string, isSpecialCategory: boolean = false, catId: string = '') => {
    if (!toolsString) return null;
    const list = toolsString.split(/,/).map(item => item.trim()).filter(Boolean);
    const showcases = CATEGORY_SHOWCASES[catId] || [];
    const theme = getTheme(catId);
    
    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {list.map((tool, idx) => {
          // Check if this tool is mapped to any educational web showcase
          const foundIndex = showcases.findIndex(
            site => site.name.toLowerCase() === tool.toLowerCase() || 
            (site.name.toLowerCase() === 'tinkercad' && tool.toLowerCase() === 'thinkercad') ||
            (site.name.toLowerCase() === 'tinkercad' && tool.toLowerCase() === 'tinkercad') ||
            (site.name.toLowerCase() === 'labview' && tool.toLowerCase() === 'labview') ||
            (tool.toLowerCase().includes(site.name.toLowerCase()) || site.name.toLowerCase().includes(tool.toLowerCase()))
          );
          const isMatched = isSpecialCategory && foundIndex !== -1;
          const currentActiveIdx = categoryIndices[catId] || 0;
          const isActive = isMatched && currentActiveIdx === foundIndex;

          return (
            <span 
              key={idx}
              id={`tool-badge-${catId}-${tool.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                if (isMatched) {
                  setCategoryIndices(prev => ({
                    ...prev,
                    [catId]: foundIndex
                  }));
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full transition-all duration-200 cursor-pointer ${
                isMatched
                  ? isActive
                    ? `${theme.badgeBgActive} shadow-sm scale-105 font-semibold`
                    : `${theme.badgeBgHover}`
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Tag className={`w-2.5 h-2.5 ${isMatched ? theme.iconClassName : 'text-gray-400'}`} />
              {tool}
            </span>
          );
        })}
      </div>
    );
  };

  const handleNextSlide = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    const list = CATEGORY_SHOWCASES[catId] || [];
    if (list.length === 0) return;
    setCategoryIndices(prev => ({
      ...prev,
      [catId]: ((prev[catId] || 0) + 1) % list.length
    }));
  };

  const handlePrevSlide = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    const list = CATEGORY_SHOWCASES[catId] || [];
    if (list.length === 0) return;
    setCategoryIndices(prev => ({
      ...prev,
      [catId]: ((prev[catId] || 0) - 1 + list.length) % list.length
    }));
  };

  return (
    <section id="habilidades-y-software" className="py-6 border-b border-gray-200">
      
      {/* 1. Habilidades Block */}
      <div className="mb-8 relative group">
        <div className="flex items-center justify-between mb-4">
          <h2 
            id="section-habilidades-title" 
            onClick={() => setShowSkillsDiv(!showSkillsDiv)}
            className="text-xl font-bold text-[#1a5f7a] border-b-2 border-[#1a5f7a] pb-1 uppercase tracking-wide flex items-center gap-2 cursor-pointer select-none hover:opacity-85 active:scale-98 transition-all"
            role="button"
            aria-expanded={showSkillsDiv}
            title={showSkillsDiv ? "Ocultar resumen" : "Mostrar resumen"}
          >
            <Cpu className="w-5 h-5 text-[#1a5f7a]" />
            <span>Habilidades</span>
            {showSkillsDiv ? (
              <ChevronUp className="w-4 h-4 ml-1 text-[#1a5f7a]" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1 text-[#1a5f7a]" />
            )}
          </h2>
        </div>

        {isEditing && (
          <button 
            onClick={onEditSkillsText}
            className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm z-20 cursor-pointer transition-all duration-200"
          >
            <Edit3 className="w-3.5 h-3.5" /> Editar Resumen de Habilidades
          </button>
        )}

        <div className="flex flex-col gap-5">
          {/* General abstract of skills */}
          <CollapsibleSkillsAbstract skillsText={skillsText} forceExpanded={showSkillsDiv} />
 
          {/* New Interactive Skills Category Visualizer */}
          <div className="border border-gray-150/80 rounded-2xl p-5 bg-white shadow-xs">
            <span className="text-[11px] font-bold text-[#145e75] uppercase tracking-wider mb-3 block flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Áreas de Especialidad Temática y Competencias
            </span>
 
            {/* Category tabs on top */}
            <div className="flex flex-wrap gap-2 mb-6">
              {SKILLS_CATEGORIES.map((cat, idx) => {
                const IconComponent = cat.icon;
                const isActive = activeCatIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveCatIndex(idx)}
                    className={`flex items-center gap-1.7 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#1a5f7a] border-[#1a5f7a] text-white shadow-sm ring-1 ring-offset-1 ring-[#1a5f7a]/30 scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100/80 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0 font-bold" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
 
            {/* Grid layout: Subcategories list on the left, Specialty Card on the right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Subcategories list of current category */}
              <div className="md:col-span-7 flex flex-col justify-start">
                <div className="mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1a5f7a]" />
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">
                    {SKILLS_CATEGORIES[activeCatIndex].name}
                  </h4>
                </div>
  
                <div className="space-y-3">
                  {(customSubcategories[activeCatIndex] || SKILLS_CATEGORIES[activeCatIndex].subcategories).map((sub, sIdx) => (
                    <div 
                      key={sIdx}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        isEditing
                          ? 'border-blue-200 bg-blue-50/10 focus-within:border-blue-400 focus-within:bg-blue-50/20'
                          : 'border-gray-100 bg-gray-50/40 hover:bg-gray-50/80 hover:border-blue-250/30 hover:shadow-2xs'
                      }`}
                    >
                      <div className="mt-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-blue-50 text-[#1a5f7a] shrink-0">
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </div>
                      {isEditing ? (
                        <textarea
                          value={sub}
                          onChange={(e) => {
                            const updated = customSubcategories.map((catSubs, cIdx) => {
                              if (cIdx === activeCatIndex) {
                                const newSubs = [...catSubs];
                                newSubs[sIdx] = e.target.value;
                                return newSubs;
                              }
                              return catSubs;
                            });
                            setCustomSubcategories(updated);
                            localStorage.setItem('esqueda_custom_subcategories', JSON.stringify(updated));
                          }}
                          rows={2}
                          style={{ minHeight: '3rem' }}
                          className="flex-1 text-xs text-gray-800 leading-normal font-medium bg-transparent border-0 focus:ring-0 focus:outline-none resize-y p-0 outline-none w-full"
                          placeholder="Describa la competencia temática..."
                        />
                      ) : (
                        <p className="text-xs text-gray-700 leading-normal font-medium">
                          {sub}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRestoreDefaultSubcategories}
                      className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-750 hover:underline cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3" /> Restaurar predeterminados de todas las categorías
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: New Specialty Card added on the right side of the subcategories div */}
              <div className="md:col-span-5 flex items-stretch">
                {(() => {
                  const currentCategory = SKILLS_CATEGORIES[activeCatIndex];
                  const colorConfig = COLOR_CLASSES[currentCategory.color] || COLOR_CLASSES.blue;
                  const catMeta = getCategoryMetadata(activeCatIndex);
                  const ActiveIcon = currentCategory.icon;
                  
                  return activeCatIndex === 0 ? (
                    <SkillsVideoScreen key="_lNXi_C7HI8" videoId="_lNXi_C7HI8" poster="/assets/images/profesor_docencia_y_desarrollo_educativo.png" />
                  ) : activeCatIndex === 1 ? (
                    <SkillsVideoScreen key="nKiZs4sm4aU" videoId="nKiZs4sm4aU" poster="/assets/images/visual_studio_editor_1779735547869.png" />
                  ) : activeCatIndex === 2 ? (
                    <SkillsVideoScreen key="Lyzgk6pM-Mo" videoId="Lyzgk6pM-Mo" poster="/assets/images/arduino_screenshot_1779734057686.png" />
                  ) : activeCatIndex === 3 ? (
                    <SkillsVideoScreen key="LQPnPizEc4Y" videoId="LQPnPizEc4Y" poster="/assets/images/fluidsim_screenshot_1779734090740.png" />
                  ) : activeCatIndex === 4 ? (
                    <SkillsVideoScreen key="guh2z1uMDoM" videoId="guh2z1uMDoM" poster="/assets/images/cura_screenshot_1779735768183.png" />
                  ) : activeCatIndex === 5 ? (
                    <SkillsVideoScreen key="1lR4HPQtvjE" videoId="1lR4HPQtvjE" poster="/assets/images/cura_screenshot_1779735768183.png" />
                  ) : activeCatIndex === 6 ? (
                    <SkillsVideoScreen key="61pZJziOO6w" videoId="61pZJziOO6w" poster="/assets/images/excel_screenshot_1779734040319.png" />
                  ) : (
                    <div className={`w-full flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 ${colorConfig.bg} ${colorConfig.border} ${colorConfig.text} overflow-hidden relative shadow-sm`}>
                      {/* Ambient background deco */}
                      <div className="absolute -right-6 -top-6 opacity-5 select-none pointer-events-none">
                        <ActiveIcon className="w-32 h-32" />
                      </div>
                      
                      <div>
                        {/* Type/XP Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg border ${colorConfig.badge}`}>
                            {catMeta.xpBadge}
                          </span>
                          <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorConfig.fill} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${colorConfig.fill}`}></span>
                          </span>
                        </div>

                        {/* Title and Tagline */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`p-2 rounded-xl bg-white/70 border ${colorConfig.border} shadow-2xs shrink-0 flex items-center justify-center`}>
                            <ActiveIcon className={`w-5 h-5 ${colorConfig.accent}`} />
                          </div>
                          <div>
                            <h5 className="text-[14px] font-bold tracking-tight leading-snug">
                              {catMeta.title}
                            </h5>
                            <span className="text-[10.5px] font-semibold text-gray-500 block uppercase tracking-wide">
                              {catMeta.tagline}
                            </span>
                          </div>
                        </div>

                        {/* Highlights list */}
                        <div className="space-y-2 mt-2">
                          <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-gray-400 block">
                            Enfoque Clave y Conceptos
                          </span>
                          <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                            {catMeta.highlights.map((highlight, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${colorConfig.fill} shrink-0`} />
                                <span className="text-xs font-semibold text-gray-700 leading-none">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Factoid panel at the bottom */}
                      <div className="mt-5 pt-3.5 border-t border-dashed border-gray-200/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                            Métrica Clave
                          </span>
                          <span className="text-xs font-black text-gray-700 leading-tight">
                            {catMeta.statLabel}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-xl bg-white/85 border ${colorConfig.border} font-bold text-sm tracking-tight ${colorConfig.accent} flex items-center justify-center shadow-2xs`}>
                          {catMeta.statVal}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {experienceContent}

      {/* 2. Software Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 id="software-sistemas-subtitle" className="text-[17px] font-bold text-[#1a5f7a] uppercase tracking-wide flex items-center gap-2">
            <Laptop className="w-5 h-5 text-[#1a5f7a]" />
            Colección Software & Sistemas
          </h4>
          {isEditing && (
            <button
              type="button"
              onClick={onAddSoftwareCategory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Añadir Categoría
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {softwareCategories.map((cat) => (
            <AnimateIn 
              key={cat.id}
              type={cat.animation}
              triggerKey={JSON.stringify(cat)}
              className="relative group p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 hover:shadow-xs transition-all duration-200 py-3 flex flex-col justify-between"
            >
              {isEditing && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSoftwareCategory(cat);
                  }}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs z-20 cursor-pointer transition-all duration-200"
                >
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
              )}

              <div className="w-full flex flex-col h-full justify-between">
                {/* 
                  VISOR DE SCREENSHOTS DE PLATAFORMAS WEB (For any category with showcases)
                */}
                {CATEGORY_SHOWCASES[cat.id] && CATEGORY_SHOWCASES[cat.id].length > 0 && (
                  <div id={`slider-${cat.id}`} className="mb-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${getTheme(cat.id).bulletColor} animate-pulse`}></span>
                      Galería de {cat.name}:
                    </p>
                    <div className="relative aspect-video w-full rounded-lg bg-slate-900 overflow-hidden border border-gray-200 group/slider shadow-inner">
                      {/* Left sliding button */}
                      <button 
                        type="button"
                        onClick={(e) => handlePrevSlide(e, cat.id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white z-20 cursor-pointer backdrop-blur-xs border border-white/10 opacity-80 group-hover/slider:opacity-100 transition-all shadow-xs"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Web Screenshot viewer area */}
                      <div 
                        onClick={() => {
                          const idx = categoryIndices[cat.id] || 0;
                          const site = CATEGORY_SHOWCASES[cat.id][idx];
                          setActivePopupSite(site);
                        }}
                        className="w-full h-full cursor-zoom-in group/img relative"
                        title="Ver de manera emergente"
                      >
                        <img 
                          src={CATEGORY_SHOWCASES[cat.id][categoryIndices[cat.id] || 0]?.image} 
                          alt={`Screenshot of ${CATEGORY_SHOWCASES[cat.id][categoryIndices[cat.id] || 0]?.name}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none transition-transform duration-500 group-hover/img:scale-103"
                        />
                        {/* Interactive overlay on hover */}
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 z-10 flex flex-col justify-end p-3 text-white">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`inline-flex items-center gap-1 text-[11px] ${getTheme(cat.id).badgeBgActive} font-bold px-2 py-0.5 rounded-full self-start shadow-sm`}>
                              <ExternalLink className="w-3 h-3" /> Abrir emergente
                            </span>
                            <a 
                              href={CATEGORY_SHOWCASES[cat.id][categoryIndices[cat.id] || 0]?.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-all shadow-sm"
                            >
                              Visitar sitio real <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-[11px] line-clamp-2 opacity-95 text-gray-100">
                            {CATEGORY_SHOWCASES[cat.id][categoryIndices[cat.id] || 0]?.desc}
                          </p>
                        </div>
                        {/* URL and quick visit badges always active in the slider corners */}
                        <div className="absolute top-2 left-2 z-20 flex gap-2">
                          <a 
                            href={CATEGORY_SHOWCASES[cat.id][categoryIndices[cat.id] || 0]?.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.7 rounded-md cursor-pointer transition-all shadow-md select-none border border-blue-500/10"
                          >
                            Visitar <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/65 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md select-none border border-white/10 pointer-events-none z-10">
                          {CATEGORY_SHOWCASES[cat.id][categoryIndices[cat.id] || 0]?.name.toLowerCase()}
                        </div>
                      </div>

                      {/* Right sliding button */}
                      <button 
                        type="button"
                        onClick={(e) => handleNextSlide(e, cat.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white z-20 cursor-pointer backdrop-blur-xs border border-white/10 opacity-80 group-hover/slider:opacity-100 transition-all shadow-xs"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Slide Info & indicator dots inside the bar */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2 py-1 rounded-full z-10">
                        {CATEGORY_SHOWCASES[cat.id].map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryIndices(prev => ({
                                ...prev,
                                [cat.id]: dotIdx
                              }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                              (categoryIndices[cat.id] || 0) === dotIdx 
                                ? 'bg-blue-400 scale-125' 
                                : 'bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <span className="font-bold text-gray-900 text-sm block border-b pb-1 mb-1.5 uppercase text-xs tracking-wider flex items-center gap-1">
                    <Laptop className={`w-3.5 h-3.5 ${getTheme(cat.id).iconClassName}`} />
                    {cat.name}
                  </span>
                  {renderSoftwareBadges(cat.tools, !!CATEGORY_SHOWCASES[cat.id], cat.id)}
                </div>
              </div>
            </AnimateIn>
          ))}
          
          {softwareCategories.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6 italic md:col-span-2">No hay categorías de software agregadas.</p>
          )}
        </div>
      </div>

      {/* 
        INTERACTIVE POPUP MODAL (MINI WEB-BROWSER EMULATOR) 
      */}
      {activePopupSite && (
        <div 
          id="browser-popup-modal"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fade-in"
          onClick={() => setActivePopupSite(null)}
        >
          {/* Modal chassis */}
          <div 
            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full border border-gray-200 flex flex-col transform transition-all scale-100 animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* macOS styled window bar */}
            <div className="bg-slate-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              {/* Traffic light indicator circles */}
              <div className="flex items-center gap-1.5">
                <button onClick={() => setActivePopupSite(null)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              {/* URL Address Bar Emulator */}
              <div className="flex-1 max-w-sm mx-4 bg-white border border-gray-300 px-3 py-1 rounded-lg text-xs text-gray-600 flex items-center justify-center gap-1.5 select-all">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-mono truncate">{activePopupSite.url}</span>
                <RotateCw className="w-3 h-3 text-gray-400 ml-auto animate-spin-slow cursor-pointer" />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setActivePopupSite(null)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated iframe preview content with high-res shot */}
            <div className="w-full aspect-video bg-neutral-900 relative group overflow-hidden border-b border-gray-200 select-none">
              <img 
                src={activePopupSite.image} 
                alt={`${activePopupSite.name} Full preview`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-200 flex items-center justify-center" />
            </div>

            {/* Explanation card section */}
            <div className="p-5 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    {activePopupSite.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium font-mono">{activePopupSite.url}</p>
                </div>
                
                {/* CTA Action button */}
                <a 
                  href={activePopupSite.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-4 py-2 font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-md cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-0"
                >
                  Visitar sitio real <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              <div className="h-px bg-gray-100 my-3" />

              <p className="text-sm text-gray-700 leading-relaxed font-sans">
                {activePopupSite.desc}
              </p>
            </div>

            {/* Footer with hint */}
            <div className="bg-slate-50 border-t border-gray-150 px-5 py-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              La página web abre directamente en una nueva pestaña segura al dar clic al botón de visita.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

