import React, { useState, useEffect, useRef } from 'react';
import { Calendar, GraduationCap, Edit3, Plus, ExternalLink, Award, Users, ShieldCheck, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const dragStartRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleDragStart = (clientX: number) => {
    dragStartRef.current = clientX;
    isDraggingRef.current = true;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current || dragStartRef.current === null) return;
    const diff = clientX - dragStartRef.current;
    
    if (Math.abs(diff) > 65) {
      if (diff > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      dragStartRef.current = null;
      isDraggingRef.current = false;
    }
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    dragStartRef.current = null;
  };
  
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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-[#1a5f7a] border-b-2 border-[#1a5f7a] pb-1 uppercase tracking-wide flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#1a5f7a]" />
          Congresos y Capacitaciones
        </h2>

        {isMobile && items.length > 1 && (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 p-1 rounded-xl shadow-3xs select-none">
            <button
              type="button"
              onClick={prevSlide}
              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
              title="Anterior actividad"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono font-black text-[#1a5f7a] px-2.5">
              {activeIndex + 1} de {items.length}
            </span>
            <button
              type="button"
              onClick={nextSlide}
              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
              title="Siguiente actividad"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {isEditing && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer shadow-3xs"
          >
            <Plus className="w-4 h-4" />
            Añadir Actividad
          </button>
        )}
      </div>

      {isMobile ? (
        <div 
          className="relative px-2 select-none"
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('a') || target.closest('iframe') || target.closest('input')) return;
            handleDragStart(e.clientX);
          }}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button') || target.closest('a') || target.closest('iframe') || target.closest('input')) return;
            if (e.touches && e.touches[0]) handleDragStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            if (e.touches && e.touches[0]) handleDragMove(e.touches[0].clientX);
          }}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-full max-w-lg mx-auto cursor-grab active:cursor-grabbing">
            {items.length > 0 ? (
              (() => {
                const item = items[activeIndex];
                return (
                  <AnimateIn 
                    key={item.id}
                    type={item.animation}
                    triggerKey={JSON.stringify(item)}
                    className="relative group border border-gray-200 hover:border-gray-300 rounded-2xl p-5 bg-white shadow-xs transition-all flex flex-col justify-between min-h-[220px]"
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
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2.5">
                        {getTypeBadge(item.type)}
                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {item.institution}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-[14px] tracking-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-800 text-[13px] leading-relaxed">
                        {item.description}
                      </p>

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
                );
              })()
            ) : (
              <p className="text-center text-sm text-gray-400 py-6 italic">No hay congresos o capacitaciones registradas.</p>
            )}
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-150 bg-white/95 text-gray-600 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer z-20"
                title="Actividad anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-150 bg-white/95 text-gray-600 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer z-20"
                title="Siguiente actividad"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {items.length > 1 && (
            <div className="text-center mt-3 text-[10px] font-bold text-gray-400 select-none flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Arrastra lateralmente o usa las flechas para rotar</span>
            </div>
          )}
        </div>
      ) : (
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
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2.5">
                  {getTypeBadge(item.type)}
                  <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                    {item.institution}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-[14px] tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-800 text-[13px] leading-relaxed">
                  {item.description}
                </p>

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
      )}
    </section>
  );
}
