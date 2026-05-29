import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Edit3, Plus, ExternalLink, Play } from 'lucide-react';
import { ExperienceItem } from '../types';
import AnimateIn from './AnimateIn';

// Collapsible function description for responsive devices (hover on mouse, tap & scroll-away on touch)
function CollapsibleFunctions({ functions }: { functions: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    if (!isExpanded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsExpanded(false);
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
  }, [isExpanded]);

  const handleTouchStart = () => {
    isTouchDevice.current = true;
    setIsExpanded(true);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice.current) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice.current) {
      setIsExpanded(false);
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
      className={`text-gray-800 text-sm leading-relaxed transition-all duration-300 relative cursor-pointer ${
        isExpanded 
          ? 'bg-blue-50/40 p-3 rounded-xl border border-blue-100 shadow-xs' 
          : 'hover:bg-gray-50 p-1.5 -m-1.5 rounded-lg'
      }`}
    >
      <span className="font-bold text-gray-800">Funciones: </span>
      <span className={isExpanded ? '' : 'line-clamp-3'}>
        {functions}
      </span>
      {!isExpanded && (
        <span className="text-[11px] text-blue-600 font-semibold block mt-1 hover:underline">
          Ver funciones completas...
        </span>
      )}
    </div>
  );
}

interface ExperienceViewProps {
  items: ExperienceItem[];
  isEditing: boolean;
  onEditItem: (item: ExperienceItem) => void;
  onAddItem: () => void;
}

export default function ExperienceView({
  items,
  isEditing,
  onEditItem,
  onAddItem
}: ExperienceViewProps) {
  return (
    <section id="experiencia-profesional" className="py-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1a5f7a] border-b-2 border-[#1a5f7a] pb-1 uppercase tracking-wide flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#1a5f7a]" />
          Experiencia profesional
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Añadir Experiencia
          </button>
        )}
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <AnimateIn 
            key={item.id} 
            type={item.animation}
            triggerKey={JSON.stringify(item)}
            className="relative group transition-all"
          >
            {/* Editor Click Overlay & Highlights */}
            {isEditing && (
              <div 
                onClick={() => onEditItem(item)}
                className="absolute -inset-2 rounded-xl border border-dashed border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 flex items-start justify-end p-2"
              >
                <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-blue-600 text-white rounded-lg shadow-xs">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </span>
              </div>
            )}

            {/* Layout representation matching original document details */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 pt-2">
              {/* Period timeline */}
              <div className="md:w-36 flex-shrink-0">
                <span className="font-bold text-gray-900 text-[15px]">{item.period}</span>
              </div>

              {/* Main Info */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-bold text-gray-900 text-[16px]">
                    {item.company}
                  </h3>
                  <span className="font-semibold text-white text-[15px] experience-role">
                    {item.role}
                  </span>
                </div>

                <CollapsibleFunctions functions={item.functions} />

                {/* Hyperlinks */}
                {item.link && (
                  <div className="pt-1">
                    <a 
                      href={item.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#1a5f7a] hover:text-[#0b3c5d] font-semibold underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {item.link.label}
                    </a>
                  </div>
                )}

                {/* Embedded Media */}
                {item.media && item.media.url && (
                  <div className="mt-3 rounded-xl overflow-hidden max-w-lg border border-gray-100 shadow-sm bg-gray-50 p-2">
                    {item.media.type === 'video' ? (
                      <div className="aspect-video relative">
                        <iframe
                          src={item.media.url}
                          title={item.media.caption || "Video de Experiencia"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                    ) : (
                      <img
                        referrerPolicy="no-referrer"
                        src={item.media.url}
                        alt={item.media.caption || "Imagen de Experiencia"}
                        className="w-full h-auto rounded-lg object-cover max-h-72"
                      />
                    )}
                    {item.media.caption && (
                      <p className="text-[11px] font-medium text-gray-500 mt-1 text-center italic">{item.media.caption}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AnimateIn>
        ))}

        {items.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6 italic">No hay registros de experiencia agregados.</p>
        )}
      </div>
    </section>
  );
}
