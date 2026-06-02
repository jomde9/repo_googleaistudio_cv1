import React from 'react';
import { Download, Printer, FileText, CheckCircle, RefreshCw, Palette } from 'lucide-react';
import { CVData } from '../types';

type ActiveTheme = 'frostedGlass' | 'original' | 'techDark' | 'editorialEmerald';

interface CVExporterProps {
  currentData: CVData;
  activeTheme: ActiveTheme;
  setActiveTheme: (theme: ActiveTheme) => void;
  onReloadEffects: () => void;
}

export default function CVExporter({
  currentData,
  activeTheme,
  setActiveTheme,
  onReloadEffects
}: CVExporterProps) {

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const tokenizedName = currentData.personalInfo.fullName
      .replace(/\s+/g, '_')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents for filenames
    const filename = `${tokenizedName}_CV_Config.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="cv-exporter-panel" className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5 print:hidden">
      {/* 1. Personalización de Diseño y Efectos */}
      <div className="space-y-3 pb-4 border-b border-gray-150">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Palette className="w-4.5 h-4.5 text-indigo-600" />
            Personalización del Tema y Efectos ✨
          </h3>
          <button
            type="button"
            onClick={onReloadEffects}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0f4f8] hover:bg-blue-100 text-[#1a5f7a] font-bold text-xs rounded-xl border border-blue-150 cursor-pointer transition-all active:scale-95"
            title="Reiniciar animaciones de entrada de todo el CV"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1a5f7a] animate-spin-slow" />
            Recargar Efectos Visuales
          </button>
        </div>
        
        <p className="text-xs text-gray-500">
          Cambie el esquema de colores, fuentes y fondos de su currículum interactivo en tiempo real:
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setActiveTheme('frostedGlass')}
            className={`px-3 py-1.7 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeTheme === 'frostedGlass'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-450/20'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            💎 Efecto Cristal (Default)
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('original')}
            className={`px-3 py-1.7 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeTheme === 'original'
                ? 'bg-[#1a5f7a] text-white shadow-md ring-2 ring-sky-400/20'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            📄 Clásico Documental
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('techDark')}
            className={`px-3 py-1.7 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeTheme === 'techDark'
                ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-705 ring-2 ring-slate-400/20'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            👾 Cibernético Oscuro
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('editorialEmerald')}
            className={`px-3 py-1.7 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeTheme === 'editorialEmerald'
                ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-450/20'
                : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            🌿 Esmeralda Orgánico
          </button>
        </div>
      </div>

      {/* 2. Herramientas de Exportación y Descarga */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-blue-600" />
            Herramientas de Exportación y Descarga
          </h3>
          <p className="text-xs text-gray-500">
            Guarde su currículum de forma segura como documento digital PDF o comparta su archivo de configuración.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Print Button (Links to static PDF) */}
          <a
            href="/assets/Curriculum_Vitae_Jose_Manuel_Diaz_Esqueda.pdf"
            download="Curriculum_Vitae_Jose_Manuel_Diaz_Esqueda.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01] text-center"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar en PDF
          </a>

          {/* Export JSON Button */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Exportar Currículum (JSON)
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Consejo de uso:</span> El currículum se guarda automáticamente de manera local en este navegador. Al presionar <strong>Imprimir / Guardar en PDF</strong>, asegúrese de activar la opción <em>"Gráficos de fondo"</em> en la configuración de su navegador para una óptima preservación de los colores y estilos en papel.
        </div>
      </div>
    </div>
  );
}

