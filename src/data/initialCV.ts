import { CVData } from '../types';

export const initialCVData: CVData = {
  personalInfo: {
    title: "Ingeniero en Electrónica",
    subtitle: "(Titulado Universidad Autónoma de Aguascalientes)",
    fullName: "José Manuel Díaz Esqueda",
    photoUrl: "/assets/images/Imagen_CV.jpg", // We can use a nice custom SVG/CSS avatar as default or fallback
    domicilio: "Miguel Hidalgo 126, Ojacaliente, Calvillo, Ags. C.P.20834",
    celular: "(+52) 449 898 6174",
    email: "jomde9@gmail.com",
    edad: "40 años",
    nacimiento: "México, D.F. 9 de Julio de 1985",
    estadoCivil: "Soltero",
    curp: "DIEM850709HDFZSN09",
    rfc: "DIEM850709DK6",
    pasaporte: "Si",
    visaAmericana: "Si",
    licenciaChofer: "Si",
    cedulaProfesional: "6427736",
    ingles: "80%, Certificado SEP-Harmon Hall, TOEIC",
    postgrado: "Cursando Maestría en Sistemas Embebidos en INFOTEC (CONACYT)"
  },
  habilidadesText: "Enfoque de la enseñanza basada en proyectos y resolución de problemas. Amplio manejo de las TICs. Robótica. Programación en distintos lenguajes, manejo de múltiples softwares, programación de aplicaciones Android, programación y uso de microprocesadores y tarjetas de desarrollo Raspberry, Beaglebone, Arduino; manejo circuitos integrados, motores y servomotores, microcontroladores, electrónica de potencia, neumática, mecánica, diseño en 3D, diseño y fabricación de partes mecánicas en impresoras 3D y mecanizado en CNC, manejo y fabricación en torno y fresadora, soldadura en arco, MIG y TIG, manejo y uso de herramienta industrial, análisis, solución y prevención de conflictos, habilidades de negociación, colaboración, instrucción, metodologías de manufactura, procesos industriales.",
  experiences: [
    {
      id: "exp_1",
      period: "2013-Actual",
      company: "Automotriz Díaz",
      role: "Gerente General",
      functions: "Administración de la empresa, planificación, desarrollo y ejecución de negocios, jefe de personal y subcontrataciones, atención al cliente, compras, ventas y transacciones, funciones de oficina, administración de documentos y finanzas, mantenimiento de los vehículos.",
      animation: "fade-in"
    },
    {
      id: "exp_2",
      period: "2018-2022",
      company: "CBTIS195",
      role: "Docente",
      functions: "Impartición de las asignaturas MOCCEE (Mantiene en operación los circuitos de control electromagnético y electrónico), MIERI (Mantiene Instalaciones Eléctricas Residenciales e Industriales), REA (Repara equipos de Automatización), FRPMUMHCCNC (Fabrica y repara piezas metálicas utilizando máquinas herramienta convencionales y CNC), SPMNF (Suelda Piezas Metálicas no Ferrosas), IPPM (Interpreta planos de piezas mecánicas), REAA (Repara equipos de aire acondicionado), IER (Instala Equipos de Refrigeración), Calculo Integral, Construye-T, tutorías.",
      animation: "fade-in"
    },
    {
      id: "exp_3",
      period: "2019-2020",
      company: "Universidad Autónoma de Aguascalientes",
      role: "Docente",
      functions: "Impartición de las asignaturas Organización computacional, Electrónica, Circuitos lógicos, Instrumentación electrónica.",
      animation: "fade-in"
    },
    {
      id: "exp_4",
      period: "2019-2020",
      company: "Universidad Cuauhtémoc Aguascalientes",
      role: "Docente",
      functions: "Impartición de Calculo Integral, Física I, Física II, Investigación de Operaciones, Sistemas Operativos.",
      animation: "fade-in"
    },
    {
      id: "exp_5",
      period: "2016-2019",
      company: "Universidad Tecnológica de Calvillo",
      role: "Docente",
      functions: "Impartición de las asignaturas de Matemáticas Propedéutico, Funciones Matemáticas, Algebra Lineal, Probabilidad y Estadística, Estadística para Negocios, Estadística para Ingeniería, Calculo Diferencial, Calculo Integral, Investigación de Operaciones, Termodinámica, Electricidad y Magnetismo, Sistemas Eléctricos, Electrónica Digital, Instalaciones Eléctricas, Principios de Programación, Automatización de Procesos, Mantenimiento a procesos de manufactura, Simulación de Procesos, Ingeniería de Procesos, Ingeniería de Materiales, Diseño y Manufactura Avanzados, Logística de Materiales, Gestión del Mantenimiento, Manufactura Esbelta, Seguridad y Medio Ambiente, Integradora y Asesor en Estadías.",
      animation: "fade-in"
    },
    {
      id: "exp_6",
      period: "2012-2013",
      company: "Flextronics",
      role: "Ingeniero de manufactura",
      functions: "Planeación, implementación y supervisión a procesos de manufactura. Incluyendo elaboración de documentos, dibujos, Instrucciones de Proceso, documentación al cliente, etc.; planeación de producto y producción, mejoras al proceso, implantación de Kaisen, 5s, etc.; entrenamiento a operarios, validaciones de estandarización y calidad, estructuración de línea de producción, diagnóstico y corrección de fallas en producto y herramientas de producción, etc.",
      animation: "fade-in"
    },
    {
      id: "exp_7",
      period: "2010-2011",
      company: "Universidad Politécnica de Aguascalientes",
      role: "Docente",
      functions: "Impartición de las asignaturas de Matemáticas, Algebra y Lineal, Electricidad y magnetismo, Electrónica Automotriz, Electrónica I, II y III, Control Lógico Programable (PLC), Programación.",
      animation: "fade-in"
    },
    {
      id: "exp_8",
      period: "2010-2010",
      company: "Mahema Maquinados de Precisión",
      role: "Ingeniero en desarrollo e integración de proyectos",
      functions: "Desarrollo de Software y Hardware, programación de PLC, integración en proyectos y maquinaria automatizada.",
      animation: "fade-in"
    }
  ],
  softwareCategories: [
    {
      id: "soft_1",
      name: "Ofimático",
      tools: "Certificación en Microsoft Office, Excel avanzado, Open Office, Libre Ofice, Google Docs, Canva, Prezi, Genialy, QR, etc.",
      animation: "none"
    },
    {
      id: "soft_2",
      name: "TICs y Plataformas Educativas",
      tools: "MOODLE, Thatquiz, Google Classroom, ClassDojo, Thinkercad, Scratch, AppInventor, Kahoot, Blooket, MathQuiz, Wayground, Socrative, DeckToys, Mobbyt, etc.",
      animation: "none"
    },
    {
      id: "soft_4",
      name: "IAs",
      tools: "ChatGPT, Gemini, NotebookLM, Perplexity, NanoBanana, Photomath, Socratic, Microsoft Math Solver, etc.",
      animation: "none"
    },
    {
      id: "soft_5",
      name: "Diseño",
      tools: "SolidWorks, AutoCAD, Tinkercad, Sinumerik, Blender, Cura, ReconstructMe, Proteus, Fritzing, etc.",
      animation: "none"
    },
    {
      id: "soft_6",
      name: "Automatización y Simulación",
      tools: "Tinkercad, FluidSim, SinuTrain, Automation Studio, Labview, LogixPro, RSLogix, Zelio, Twido, Logo, SYSWIN, CoDeSys, FlexSim, Arena, Promodel",
      animation: "none"
    },
    {
      id: "soft_3",
      name: "Programación",
      tools: "Python, HTML, CSS, PHP, SQL, JavaScript, Java, AppInventor, Arduino IDE, C#, C++, Visual C, Basic, Visual Basic, Delphi, Pascal, ASM, WinASM, TASM, Matlab, Linux, Unix, Windows, VHDL, etc.",
      animation: "none"
    }
  ],
  projects: [
    {
      id: "proj_1",
      title: "Robot Paralelo Delta",
      description: "Desarrollo y construcción de robot manipulador Delta con nuevos algoritmos y métodos de control y de cinemática inversa, concepto nuevo con superioridad absoluta con respecto a los algoritmos existentes.",
      prize: "Segundo lugar en Concurso de Innovación Tecnológica por Algoritmos y Métodos de Control",
      animation: "slide-up"
    },
    {
      id: "proj_2",
      title: "Robot Didáctico Chipo",
      description: "Desarrollo y construcción de robot manipulador con arquitectura Arduino y componentes de fácil acceso. Enfocado a desarrollo didáctico según niveles educativos distintos. Control mediante aplicación Android que simula joypad y mediante movimientos del celular o del Nintendo Wii Nunchuck.",
      prize: "Finalista Concurso Nacional CONIES 2018",
      animation: "slide-up"
    },
    {
      id: "proj_3",
      title: "Control Inteligente para Invernadero",
      description: "Desarrollo y construcción de sistema de control para monitoreo y control remoto y automático de variables como temperatura, humedad, PH, riego, ventilación, etc. Implementación mediante Arduino o PLC, y control mediante aplicación Android por Bluetooth o GSM.",
      animation: "slide-up"
    }
  ],
  conferences: [
    {
      id: "conf_1",
      type: "Concurso",
      title: "Estatal de Misiones Espaciales (2018-2019)",
      institution: "Universidad: UTC",
      description: "Asesor principal en concurso de desarrollo, lanzamiento, operación y telemetría de satélite CanSat",
      animation: "none"
    },
    {
      id: "conf_2",
      type: "Capacitación",
      title: "Manufactura Avanzada",
      institution: "Universidad: UTC",
      description: "Maquinado CNC, Diseño 3D, Impresión 3D, Cortadora laser, soldadura arco, MIG, TIG, torno",
      animation: "none"
    },
    {
      id: "conf_3",
      type: "Congreso",
      title: "Expo Creatividad",
      institution: "Universidad: UTC",
      description: "Asesor y organizador en concurso de implementación comercial y de patentes",
      animation: "none"
    },
    {
      id: "conf_4",
      type: "Capacitación",
      title: "Mejoras LEAN",
      institution: "Empresa: Flextronics",
      description: "Capacitación en LEAN, 5s, Shingijutsu, etc, proyecto Kaisen ganador: implementación Pay After Use",
      animation: "none"
    },
    {
      id: "conf_5",
      type: "Capacitación",
      title: "Curso de robótica",
      institution: "Empresa: Fanuc Robotics",
      description: "Curso intensivo de capacitación en para manejo, programación y diagnóstico de diversos modelos de robot",
      animation: "none"
    },
    {
      id: "conf_6",
      type: "Capacitación",
      title: "Software, PLCs y dispositivos Festo",
      institution: "Empresa: Festo",
      description: "Capacitación en manejo y programación de diversos dispositivos incluyendo PLCs, válvulas, actuadores, etc",
      animation: "none"
    },
    {
      id: "conf_7",
      type: "Congreso",
      title: "Mecafest",
      institution: "Universidad: UPA",
      description: "Asesor y organizador en concurso de proyectos innovadores y de implementación",
      animation: "none"
    }
  ]
};
