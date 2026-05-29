import React, { useRef } from 'react';
import { Download, Upload, RotateCcw, Printer, FileText, CheckCircle } from 'lucide-react';
import { CVData } from '../types';

interface CVExporterProps {
  currentData: CVData;
  onImportData: (data: CVData) => void;
  onResetData: () => void;
}

export default function CVExporter({
  currentData,
  onImportData,
  onResetData
}: CVExporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          // Simple validation
          if (parsed && parsed.personalInfo && parsed.experiences && parsed.softwareCategories && parsed.projects) {
            onImportData(parsed as CVData);
            alert('¡El currículum se ha importado con éxito!');
          } else {
            alert('Error: El formato del archivo JSON no coincide con un diseño de Currículum válido.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON: ' + (err as Error).message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="cv-exporter-panel" className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-blue-600" />
          Herramientas de Exportación y Descarga
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Guarde su currículum de forma segura como documento digital PDF o comparta su archivo de configuración.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Print Button */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01]"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Guardar en PDF
        </button>

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

      <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Consejo de uso:</span> El currículum se guarda automáticamente de manera local en este navegador. Al presionar <strong>Imprimir / Guardar en PDF</strong>, asegúrese de activar la opción <em>"Gráficos de fondo"</em> en la configuración de su navegador para una óptima preservación de los colores y estilos en papel.
        </div>
      </div>
    </div>
  );
}
