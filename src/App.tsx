import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Edit, Eye, Smartphone, Layout, HelpCircle, GraduationCap, ArrowUpRight, Check, AlertCircle, RefreshCw, Upload, RotateCcw, ChevronDown, ChevronUp, Settings } from 'lucide-react';

// Subcomponents
import HeaderView from './components/HeaderView';
import ExperienceView from './components/ExperienceView';
import SkillsView from './components/SkillsView';
import ProjectsView from './components/ProjectsView';
import ConferencesView from './components/ConferencesView';
import CVExporter from './components/CVExporter';
import EditModal from './components/EditModal';

// Initial Data & Types
import { initialCVData } from './data/initialCV';
import { CVData, ExperienceItem, SoftwareCategory, ProjectItem, ConferenceItem, PersonalInfo, AnimationType, Hyperlink, MediaItem } from './types';

type ActiveTheme = 'frostedGlass' | 'original' | 'techDark' | 'editorialEmerald';

interface EditState {
  type: 'personal' | 'experience' | 'software' | 'project' | 'conference' | 'skills_text';
  id?: string; // empty for personal/skills_text
  title: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'combo';
    value: string;
    options?: { value: string; label: string }[];
  }[];
  hyperlink?: Hyperlink;
  animation?: AnimationType;
  media?: MediaItem;
}

export default function App() {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false); // Start in visualizer/preview mode by default!
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>('frostedGlass');
  const [editingItem, setEditingItem] = useState<EditState | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showEditionPanel, setShowEditionPanel] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Trigger animations reload key
  const [animationTriggerKey, setAnimationTriggerKey] = useState<number>(0);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('esqueda_cv_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo && parsed.experiences) {
          // Migrate old image paths, empty photoUrl or space-containing paths
          let migrated = false;
          if (!parsed.personalInfo.photoUrl || parsed.personalInfo.photoUrl === "" || parsed.personalInfo.photoUrl === "/assets/images/Imagen CV.jpg" || parsed.personalInfo.photoUrl === "/assets/images/jose_manuel_photo.png" || parsed.personalInfo.photoUrl.includes("jose_manuel_photo") || parsed.personalInfo.photoUrl.includes("Imagen CV") || parsed.personalInfo.photoUrl.includes("Imagen%20CV")) {
            parsed.personalInfo.photoUrl = "/assets/images/Imagen_CV.jpg";
            migrated = true;
          } else if (parsed.personalInfo.photoUrl.startsWith('/src/assets/images/')) {
            parsed.personalInfo.photoUrl = parsed.personalInfo.photoUrl.replace('/src/assets/images/', '/assets/images/');
            migrated = true;
          }

          // Re-order softwareCategories if soft_3 is present to ensure it's at the end
          if (Array.isArray(parsed.softwareCategories)) {
            const categories = [...parsed.softwareCategories];
            const soft3Index = categories.findIndex((cat: any) => cat.id === 'soft_3');
            if (soft3Index !== -1 && soft3Index !== categories.length - 1) {
              const [soft3] = categories.splice(soft3Index, 1);
              categories.push(soft3);
              parsed.softwareCategories = categories;
              migrated = true;
            }
          }

          if (migrated) {
            localStorage.setItem('esqueda_cv_data', JSON.stringify(parsed));
          }
          setCvData(parsed);
        }
      } catch (e) {
        console.error("No se pudo cargar el CV desde localStorage, usando datos predeterminados.");
      }
    }
  }, []);

  // Save to localStorage helper
  const saveCVState = (newData: CVData) => {
    setCvData(newData);
    localStorage.setItem('esqueda_cv_data', JSON.stringify(newData));
    triggerToast('¡Cambios guardados localmente! ✔');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const triggerReloadAnimations = () => {
    setAnimationTriggerKey(prev => prev + 1);
    triggerToast('Efectos de transición reiniciados ✨');
  };

  const handleUpdatePhoto = (photoBase64: string) => {
    const updated = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        photoUrl: photoBase64
      }
    };
    saveCVState(updated);
  };

  const handleImportJSONApp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed && parsed.personalInfo && parsed.experiences && parsed.softwareCategories && parsed.projects) {
            saveCVState(parsed as CVData);
            triggerToast('¡El currículum se ha importado con éxito! ✨');
          } else {
            alert('Error: El formato del archivo JSON no coincide con un currículum válido.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON: ' + (err as Error).message);
        }
      };
      reader.readAsText(file);
    }
  };

  // ----- MODAL EDITING HANDLERS -----

  const openPersonalEdit = () => {
    const info = cvData.personalInfo;
    setEditingItem({
      type: 'personal',
      title: 'Editar Información de Datos Personales',
      fields: [
        { key: 'fullName', label: 'Nombre Completo', type: 'text', value: info.fullName },
        { key: 'title', label: 'Título Profesional Principal', type: 'text', value: info.title },
        { key: 'subtitle', label: 'Institución / Universidad de egreso', type: 'text', value: info.subtitle },
        { key: 'domicilio', label: 'Domicilio Completo', type: 'text', value: info.domicilio },
        { key: 'celular', label: 'Número de Celular', type: 'text', value: info.celular },
        { key: 'email', label: 'Correo Eléctrónico (E-mail)', type: 'text', value: info.email },
        { key: 'edad', label: 'Edad', type: 'text', value: info.edad },
        { key: 'nacimiento', label: 'Fecha y Lugar de Nacimiento', type: 'text', value: info.nacimiento },
        { key: 'estadoCivil', label: 'Estado Civil', type: 'text', value: info.estadoCivil },
        { key: 'cedulaProfesional', label: 'Cédula Profesional', type: 'text', value: info.cedulaProfesional },
        { key: 'curp', label: 'CURP', type: 'text', value: info.curp },
        { key: 'rfc', label: 'RFC', type: 'text', value: info.rfc },
        { key: 'pasaporte', label: 'Pasaporte (Ej. Si / No)', type: 'text', value: info.pasaporte },
        { key: 'visaAmericana', label: 'Visa Americana (Ej. Si / No)', type: 'text', value: info.visaAmericana },
        { key: 'licenciaChofer', label: 'Licencia de Chofer (Ej. Si / No / Tipo)', type: 'text', value: info.licenciaChofer },
        { key: 'ingles', label: 'Certificación e Idioma Inglés', type: 'text', value: info.ingles },
        { key: 'postgrado', label: 'Maestría / Estudios Avanzados', type: 'textarea', value: info.postgrado }
      ]
    });
  };

  const openSkillsTextEdit = () => {
    setEditingItem({
      type: 'skills_text',
      title: 'Editar Resumen de Habilidades Técnicas',
      fields: [
        { key: 'text', label: 'Párrafo de Habilidades', type: 'textarea', value: cvData.habilidadesText }
      ]
    });
  };

  const openExperienceEdit = (item: ExperienceItem) => {
    setEditingItem({
      type: 'experience',
      id: item.id,
      title: 'Editar Puesto Profesional',
      fields: [
        { key: 'period', label: 'Periodo (Ej. 2013-Actual)', type: 'text', value: item.period },
        { key: 'company', label: 'Empresa / Institución', type: 'text', value: item.company },
        { key: 'role', label: 'Puesto o Rol desempeñado', type: 'text', value: item.role },
        { key: 'functions', label: 'Funciones detalladas', type: 'textarea', value: item.functions }
      ],
      hyperlink: item.link,
      animation: item.animation,
      media: item.media
    });
  };

  const openSoftwareCatEdit = (cat: SoftwareCategory) => {
    setEditingItem({
      type: 'software',
      id: cat.id,
      title: 'Editar Categoría de Software',
      fields: [
        { key: 'name', label: 'Nombre de la Categoría', type: 'text', value: cat.name },
        { key: 'tools', label: 'Herramientas asociadas (separadas por comas)', type: 'textarea', value: cat.tools }
      ],
      link: cat.link,
      animation: cat.animation
    });
  };

  const openProjectEdit = (proj: ProjectItem) => {
    setEditingItem({
      type: 'project',
      id: proj.id,
      title: 'Editar Proyecto Universitario / Industrial',
      fields: [
        { key: 'title', label: 'Título del Proyecto', type: 'text', value: proj.title },
        { key: 'description', label: 'Descripción de Metodología y Tecnologías', type: 'textarea', value: proj.description },
        { key: 'prize', label: 'Reconocimiento / Premio Especial (Opcional)', type: 'text', value: proj.prize || '' }
      ],
      hyperlink: proj.link,
      animation: proj.animation,
      media: proj.media
    });
  };

  const openConferenceEdit = (conf: ConferenceItem) => {
    setEditingItem({
      type: 'conference',
      id: conf.id,
      title: 'Editar Congreso, Curso o Capacitación',
      fields: [
        { 
          key: 'type', 
          label: 'Tipo de Evento', 
          type: 'select', 
          value: conf.type,
          options: [
            { value: 'Concurso', label: 'Concurso' },
            { value: 'Capacitación', label: 'Capacitación' },
            { value: 'Congreso', label: 'Congreso / Foro' }
          ]
        },
        { key: 'title', label: 'Título de la Capacitación o Certificado', type: 'text', value: conf.title },
        { key: 'institution', label: 'Entidad / Universidad que avala', type: 'text', value: conf.institution },
        { key: 'description', label: 'Descripción detallada de hitos', type: 'textarea', value: conf.description }
      ],
      hyperlink: conf.link,
      animation: conf.animation,
      media: conf.media
    });
  };

  // ----- SAVE HANDLERS FROM MODAL -----

  const handleSaveModal = (data: {
    fields: Record<string, string>;
    hyperlink?: Hyperlink;
    animation?: AnimationType;
    media?: MediaItem;
  }) => {
    if (!editingItem) return;

    const { fields, hyperlink, animation, media } = data;

    if (editingItem.type === 'personal') {
      const updated = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          ...fields
        } as PersonalInfo
      };
      saveCVState(updated);
    } 
    
    else if (editingItem.type === 'skills_text') {
      const updated = {
        ...cvData,
        habilidadesText: fields.text
      };
      saveCVState(updated);
    } 
    
    else if (editingItem.type === 'experience') {
      const updatedList = cvData.experiences.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            period: fields.period,
            company: fields.company,
            role: fields.role,
            functions: fields.functions,
            link: hyperlink,
            animation,
            media
          };
        }
        return item;
      });
      saveCVState({ ...cvData, experiences: updatedList });
    } 
    
    else if (editingItem.type === 'software') {
      const updatedList = cvData.softwareCategories.map(cat => {
        if (cat.id === editingItem.id) {
          return {
            ...cat,
            name: fields.name,
            tools: fields.tools,
            link: hyperlink,
            animation
          };
        }
        return cat;
      });
      saveCVState({ ...cvData, softwareCategories: updatedList });
    } 
    
    else if (editingItem.type === 'project') {
      const updatedList = cvData.projects.map(proj => {
        if (proj.id === editingItem.id) {
          return {
            ...proj,
            title: fields.title,
            description: fields.description,
            prize: fields.prize || undefined,
            link: hyperlink,
            animation,
            media
          };
        }
        return proj;
      });
      saveCVState({ ...cvData, projects: updatedList });
    } 
    
    else if (editingItem.type === 'conference') {
      const updatedList = cvData.conferences.map(conf => {
        if (conf.id === editingItem.id) {
          return {
            ...conf,
            type: fields.type as any,
            title: fields.title,
            institution: fields.institution,
            description: fields.description,
            link: hyperlink,
            animation,
            media
          };
        }
        return conf;
      });
      saveCVState({ ...cvData, conferences: updatedList });
    }

    setEditingItem(null);
  };

  // ----- INTERACTIVE APPEND LIST HANDLERS -----

  const handleAddExperienceItem = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      period: "2026-Siguiente",
      company: "Nueva Empresa o Consultor",
      role: "Especialista en Automatización / Enlace",
      functions: "Describa aquí las tareas fundamentales que estuvo administrando, lenguajes de programación y certificaciones aplicadas en este puesto.",
      animation: "fade-in"
    };

    const updated = {
      ...cvData,
      experiences: [newItem, ...cvData.experiences] // Put on top
    };
    saveCVState(updated);
    triggerToast("Puesto de experiencia añadido con éxito");
    // Auto-open editing modal for the newly added item to guide the user
    openExperienceEdit(newItem);
  };

  const handleAddSoftwareCategory = () => {
    const newCat: SoftwareCategory = {
      id: `soft_${Date.now()}`,
      name: "Nueva Categoría Temática",
      tools: "Elemento A, Elemento B, Elemento C",
      animation: "none"
    };

    const updated = {
      ...cvData,
      softwareCategories: [...cvData.softwareCategories, newCat]
    };
    saveCVState(updated);
    triggerToast("Categoría temática de software añadida");
    openSoftwareCatEdit(newCat);
  };

  const handleAddProjectItem = () => {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: "Nuevo Robot / Sistema de Control",
      description: "Describa detalladamente el software y hardware involucrado (ej. microcontroladores Microchip, lenguajes C++, servomotores industriales y sistemas distribuídos).",
      animation: "slide-up"
    };

    const updated = {
      ...cvData,
      projects: [...cvData.projects, newProj]
    };
    saveCVState(updated);
    triggerToast("Casillero de proyecto de desarrollo añadido");
    openProjectEdit(newProj);
  };

  const handleAddConferenceItem = () => {
    const newConf: ConferenceItem = {
      id: `conf_${Date.now()}`,
      type: "Capacitación",
      title: "Nuevo Certificado o Seminario Académico",
      institution: "Universidad o Entidad",
      description: "Describa las horas del curso, capacidades integradas y nivel de validez.",
      animation: "none"
    };

    const updated = {
      ...cvData,
      conferences: [...cvData.conferences, newConf]
    };
    saveCVState(updated);
    triggerToast("Acreditación o congreso añadido");
    openConferenceEdit(newConf);
  };

  // ----- INTERACTIVE DELETE WORKFLOWS -----

  const handleDeleteItem = () => {
    if (!editingItem || !editingItem.id) return;

    if (editingItem.type === 'experience') {
      const filtered = cvData.experiences.filter(item => item.id !== editingItem.id);
      saveCVState({ ...cvData, experiences: filtered });
    } else if (editingItem.type === 'software') {
      const filtered = cvData.softwareCategories.filter(cat => cat.id !== editingItem.id);
      saveCVState({ ...cvData, softwareCategories: filtered });
    } else if (editingItem.type === 'project') {
      const filtered = cvData.projects.filter(proj => proj.id !== editingItem.id);
      saveCVState({ ...cvData, projects: filtered });
    } else if (editingItem.type === 'conference') {
      const filtered = cvData.conferences.filter(conf => conf.id !== editingItem.id);
      saveCVState({ ...cvData, conferences: filtered });
    }
    
    setEditingItem(null);
    triggerToast("Item eliminado satisfactoriamente");
  };

  // ----- THEME STYLES CONVERTER -----

  const getThemeClass = (): { bg: string; resumePage: string; accentColor: string; titleBorder: string } => {
    switch (activeTheme) {
      case 'frostedGlass':
        return {
          bg: 'theme-frosted-glass bg-linear-to-br from-[#090e1a] to-[#110e2f] text-slate-100',
          resumePage: 'bg-white/[0.02] backdrop-blur-[20px] border border-white/8 text-slate-100 shadow-2xl',
          accentColor: '[#6366f1]',
          titleBorder: 'border-indigo-500/30'
        };
      case 'techDark':
        return {
          bg: 'bg-[#0f172a] text-slate-200',
          resumePage: 'bg-[#1e293b] text-slate-300 border-indigo-950 shadow-indigo-950/20',
          accentColor: '[#06b6d4]',
          titleBorder: 'border-cyan-500'
        };
      case 'editorialEmerald':
        return {
          bg: 'bg-[#fcfaf2] text-slate-800',
          resumePage: 'bg-white text-slate-800 border-emerald-900/10 shadow-emerald-950/5',
          accentColor: '[#047857]',
          titleBorder: 'border-emerald-600'
        };
      case 'original':
      default:
        return {
          bg: 'bg-gray-100 text-gray-900',
          resumePage: 'bg-white text-gray-900 border-gray-150 shadow-gray-250/20',
          accentColor: '[#1a5f7a]',
          titleBorder: 'border-[#1a5f7a]'
        };
    }
  };

  const themeTheme = getThemeClass();

  return (
    <div className={`min-h-screen ${themeTheme.bg} font-sans pb-16 transition-colors duration-300 relative`}>
      {activeTheme === 'frostedGlass' && <div className="mesh-bg" />}
      
      {/* 1. Global Admin and Settings Header Toolbar (Hidden during Print) */}
      <nav id="cv-editorial-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs px-4 py-1.5 print:hidden transition-all text-center">
        <div id="nav-container" className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          {/* Quick instructions and project brand */}
          <div className="flex items-center gap-1.5">
            <div className="p-0.5 px-1 bg-blue-50 text-blue-600 rounded-md">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-center">
              <span className="font-bold text-gray-900 text-xs">
                Currículum de José Manuel Esqueda
              </span>
              <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-[10px] text-gray-500 font-medium">
                Página web interactiva (Habilite la sección "Edición" abajo para personalizar)
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Top-level User Notice of Self-Persistence */}
      {isEditingMode && (
        <div className="max-w-4xl mx-auto px-4 mt-6 print:hidden">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-xs shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <span className="font-bold">¡Está en Modo Edición!</span> Mueva el cursor del ratón y <strong>haga clic en cualquier sección o tarjeta</strong> del documento para agregar hipervínculos, embeber videos demostrativos, elegir transiciones fluidas de entrada, o reescribir cualquier texto que desee cambiar. Sus modificaciones se conservan de forma automática.
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Printable CV Page Layout Frame */}
      <main id="cv-main-container" className="max-w-4xl mx-auto px-4 mt-8 print:mt-0">
        <article 
          className={`relative border rounded-2xl shadow-xl p-8 lg:p-12 transition-colors duration-300 ${themeTheme.resumePage}`}
        >
          {/* Subtle overlay decorative watermark for print-like feel on desktop */}
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-gray-300 opacity-50 block uppercase print:hidden">
            Documento de Ingeniería Electrónica
          </div>

          {/* Sub Header Section */}
          <HeaderView 
            info={cvData.personalInfo} 
            isEditing={isEditingMode}
            onEditInfo={openPersonalEdit}
            onUpdatePhoto={handleUpdatePhoto}
          />

          {/* Skills & Software categorizations */}
          <SkillsView 
            skillsText={cvData.habilidadesText}
            softwareCategories={cvData.softwareCategories}
            isEditing={isEditingMode}
            onEditSkillsText={openSkillsTextEdit}
            onEditSoftwareCategory={openSoftwareCatEdit}
            onAddSoftwareCategory={handleAddSoftwareCategory}
            experienceContent={
              <ExperienceView 
                items={cvData.experiences}
                isEditing={isEditingMode}
                onEditItem={openExperienceEdit}
                onAddItem={handleAddExperienceItem}
              />
            }
          />

          {/* Projects Portfolio Section (with responsive live youtube players support!) */}
          <ProjectsView
            items={cvData.projects}
            isEditing={isEditingMode}
            onEditItem={openProjectEdit}
            onAddItem={handleAddProjectItem}
          />

          {/* Conferences, events and training certifications */}
          <ConferencesView 
            items={cvData.conferences}
            isEditing={isEditingMode}
            onEditItem={openConferenceEdit}
            onAddItem={handleAddConferenceItem}
          />

          {/* Footer of the CV */}
          <footer className="mt-8 pt-6 border-t border-gray-150 text-center text-xs text-gray-400">
            <p className="font-semibold">{cvData.personalInfo.fullName} — {cvData.personalInfo.title}</p>
            <p className="mt-1">Página Web Interactiva — Autogenerada a partir de Hoja de Vida Original</p>
          </footer>
        </article>
      </main>

      {/* 4. Downloader and physical configuration console (Hidden during Print) */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <CVExporter
          currentData={cvData}
          onImportData={saveCVState}
          onResetData={() => {
            setCvData(initialCVData);
            localStorage.setItem('esqueda_cv_data', JSON.stringify(initialCVData));
            triggerToast('Currículum restaurado a valores por defecto');
          }}
        />
      </div>

      {/* 5. Sección de Edición (Collapsible, Hidden during print) */}
      <div className="max-w-4xl mx-auto px-4 mt-6 print:hidden">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Título de la sección como botón para expandir/colapsar */}
          <button
            type="button"
            onClick={() => setShowEditionPanel(!showEditionPanel)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100/80 active:bg-gray-100 transition-all font-bold text-gray-800 cursor-pointer text-sm"
          >
            <div className="flex items-center gap-2 text-indigo-650">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span className="uppercase tracking-wider font-bold text-gray-900">Edición</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
              <span>{showEditionPanel ? 'Ocultar controles' : 'Mostrar controles'}</span>
              {showEditionPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* Contenido colapsable */}
          {showEditionPanel && (
            <div className="p-5 border-t border-gray-150 bg-slate-50/50 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Modo de Vista */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Modo de Visualización
                  </span>
                  <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-xs inline-flex gap-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingMode(true)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        isEditingMode
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Modo Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingMode(false)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        !isEditingMode
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Vista previa
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-550 leading-normal">
                    Active el modo editor para modificar textos, fotos y enlaces, o vista previa para ver el diseño final como se publicará.
                  </p>
                </div>

                {/* 2. Temas Visuales */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Personalización del Tema
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTheme('frostedGlass')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeTheme === 'frostedGlass'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Efecto Cristal 💎
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTheme('original')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeTheme === 'original'
                          ? 'bg-[#1a5f7a] text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Clásico Documental
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTheme('techDark')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeTheme === 'techDark'
                          ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cibernético Oscuro
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTheme('editorialEmerald')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeTheme === 'editorialEmerald'
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Esmeralda Orgánico
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-550 leading-normal">
                    Cambie toda la paleta cromática de fondo y tipografía de este currículum interactivo.
                  </p>
                </div>
              </div>

              {/* Fila inferior: Importar, Restaurar, Recargar Animaciones */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Mantenimiento de Archivos y Animaciones
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4 text-gray-500" />
                    Importar Currículum (JSON)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Desea restaurar todos los datos originales del curriculum de José Manuel Díaz Esqueda? Esto borrará sus cambios locales.')) {
                        setCvData(initialCVData);
                        localStorage.setItem('esqueda_cv_data', JSON.stringify(initialCVData));
                        triggerToast('Currículum restaurado a valores por defecto');
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-red-500" />
                    Restaurar Datos de Origen
                  </button>

                  <button
                    type="button"
                    onClick={triggerReloadAnimations}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    Recargar Efectos Visuales
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportJSONApp}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Custom Form Editor Modal */}
      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title={editingItem.title}
          fields={editingItem.fields}
          hyperlink={editingItem.hyperlink}
          animation={editingItem.animation}
          media={editingItem.media}
          onSave={handleSaveModal}
          onDelete={editingItem.id ? handleDeleteItem : undefined} // Only show delete if it is a list item with ID
        />
      )}

      {/* 6. Dynamic Floating toast notification of autosavings states */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 print:hidden bg-gray-900 border border-gray-800 text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-2.5 transform transition-all duration-300 scale-102">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold whitespace-nowrap">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
