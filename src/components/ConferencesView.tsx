import React from 'react';
import { Calendar, GraduationCap, Edit3, Plus, ExternalLink, Award, Users, ShieldCheck } from 'lucide-react';
import { ConferenceItem } from '../types';
import AnimateIn from './AnimateIn';

interface ConferencesViewProps {
  items: ConferenceItem[];
  isEditing: boolean;
  onEditItem: (item: ConferenceItem) => void;
  onAddItem: () => void;
}

export default function ConferencesView({
  items,
  isEditing,
  onEditItem,
  onAddItem
}: ConferencesViewProps) {
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Concurso':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Award className="w-3.5 h-3.5" />
            Concurso
          </span>
        );
      case 'Capacitación':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Capacitación
          </span>
        );
      case 'Congreso':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Users className="w-3.5 h-3.5" />
            Congreso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-750 border border-gray-200">
            Otro
          </span>
        );
    }
  };

  return (
    <section id="congresos-capacitaciones" className="py-6 min-h-[150px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1a5f7a] border-b-2 border-[#1a5f7a] pb-1 uppercase tracking-wide flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#1a5f7a]" />
          Congresos y Capacitaciones
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Añadir Actividad
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <AnimateIn 
            key={item.id}
            type={item.animation}
            triggerKey={JSON.stringify(item)}
            className="relative group border border-gray-200 hover:border-gray-300 rounded-2xl p-4 bg-white hover:shadow-xs transition-all flex flex-col justify-between"
          >
            {isEditing && (
              <div 
                onClick={() => onEditItem(item)}
                className="absolute inset-0 rounded-2xl border border-dashed border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 flex items-start justify-end p-2.5"
              >
                <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-blue-600 text-white rounded-lg shadow-xs">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </span>
              </div>
            )}

            <div>
              {/* Top Row: Type Indicator & Institution */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2.5">
                {getTypeBadge(item.type)}
                <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {item.institution}
                </span>
              </div>

              {/* Title & Description of Congress or Training */}
              <h3 className="font-bold text-gray-900 text-[14px] tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-gray-800 text-[13px] leading-relaxed">
                {item.description}
              </p>

              {/* Media Preview in small scale */}
              {item.media && item.media.url && (
                <div className="mt-2.5 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 p-1">
                  {item.media.type === 'video' ? (
                    <div className="aspect-video relative max-h-32">
                      <iframe
                        src={item.media.url}
                        title={item.title}
                        allowFullScreen
                        className="w-full h-full rounded"
                      />
                    </div>
                  ) : (
                    <img
                      referrerPolicy="no-referrer"
                      src={item.media.url}
                      alt={item.title}
                      className="w-full h-auto rounded object-cover max-h-32"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Hyperlink */}
            {item.link && (
              <div className="pt-2.5 mt-2.5 border-t border-gray-100 flex justify-end">
                <a 
                  href={item.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#1a5f7a] hover:text-[#0b3c5d] font-semibold hover:underline"
                >
                  {item.link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </AnimateIn>
        ))}

        {items.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6 italic col-span-full">No hay congresos o capacitaciones registradas.</p>
        )}
      </div>
    </section>
  );
}
