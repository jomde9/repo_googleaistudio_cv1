import React, { useState, useRef } from 'react';
import { Award, Code2, Edit3, Plus, ExternalLink, Film, Image as ImageIcon, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ProjectItem } from '../types';
import AnimateIn from './AnimateIn';
import RobotArmSimulator from './RobotArmSimulator';
import DeltaRobotSimulator from './DeltaRobotSimulator';
import GreenhouseSimulator from './GreenhouseSimulator';

interface ProjectsViewProps {
  items: ProjectItem[];
  isEditing: boolean;
  onEditItem: (item: ProjectItem) => void;
  onAddItem: () => void;
}

export default function ProjectsView({
  items,
  isEditing,
  onEditItem,
  onAddItem
}: ProjectsViewProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

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

  return (
    <section id="proyectos-portfolio" className="py-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-[#1a5f7a] border-b-2 border-[#1a5f7a] pb-1 uppercase tracking-wide flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#1a5f7a]" />
          Proyectos desarrollados
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Slider Pagination Controls in header */}
          {items.length > 1 && (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 p-1 rounded-xl shadow-3xs select-none">
              <button
                type="button"
                onClick={prevSlide}
                className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-3xs flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
                title="Siguiente proyecto a la izquierda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono font-black text-[#1a5f7a] px-2">
                {activeIndex + 1} de {items.length}
              </span>
              <button
                type="button"
                onClick={nextSlide}
                className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-3xs flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-all cursor-pointer"
                title="Siguiente proyecto a la derecha"
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
              Añadir Proyecto
            </button>
          )}
        </div>
      </div>

      {/* Gallery viewport panel supporting drag gestures */}
      <div 
        className="relative px-2 select-none"
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('a') || target.closest('iframe') || target.closest('canvas') || target.closest('input')) {
            return;
          }
          handleDragStart(e.clientX);
        }}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('a') || target.closest('iframe') || target.closest('canvas') || target.closest('input')) {
            return;
          }
          if (e.touches && e.touches[0]) handleDragStart(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (e.touches && e.touches[0]) handleDragMove(e.touches[0].clientX);
        }}
        onTouchEnd={handleDragEnd}
      >
        <div className="w-full max-w-3xl mx-auto cursor-grab active:cursor-grabbing">
          {items.length > 0 ? (
            (() => {
              const project = items[activeIndex];
              return (
                <AnimateIn 
                  key={project.id}
                  type={project.animation}
                  triggerKey={JSON.stringify(project)}
                  className="relative group border border-gray-200 rounded-2xl p-5 bg-white shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between min-h-[460px]"
                >
                  {isEditing && (
                    <div 
                      onClick={() => onEditItem(project)}
                      className="absolute inset-0 rounded-2xl border border-dashed border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-10 flex items-start justify-end p-3"
                    >
                      <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-xs">
                        <Edit3 className="w-4 h-4" /> Editar Proyecto
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {project.id === "proj_1" && (
                      <div className="mb-4">
                        <DeltaRobotSimulator />
                      </div>
                    )}
                    {project.id === "proj_2" && (
                      <div className="mb-4">
                        <RobotArmSimulator />
                      </div>
                    )}
                    {project.id === "proj_3" && (
                      <div className="mb-4">
                        <GreenhouseSimulator />
                      </div>
                    )}
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Main Description */}
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Award / Prize container, beautifully styled */}
                    {project.prize && (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 hover:bg-amber-100/50 text-amber-900 border-l-4 border-amber-500 rounded-r-lg transition-colors text-xs font-medium">
                        <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>{project.prize}</span>
                      </div>
                    )}

                    {/* Embedded Media Player */}
                    {project.media && project.media.url && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 shadow-xs bg-gray-50 p-1">
                        {project.media.type === 'video' ? (
                          <div className="aspect-video relative">
                            <iframe
                              src={project.media.url}
                              title={project.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full rounded-lg"
                            />
                          </div>
                        ) : (
                          <img
                            referrerPolicy="no-referrer"
                            src={project.media.url}
                            alt={project.title}
                            className="w-full h-auto rounded-lg object-cover max-h-48"
                          />
                        )}
                        {project.media.caption && (
                          <p className="text-[10px] font-medium text-gray-500 mt-1 pb-1 text-center italic">{project.media.caption}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hyperlink at footer of card */}
                  {project.link && (
                    <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">Enlace externo</span>
                      <a 
                        href={project.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#1a5f7a] hover:text-[#0b3c5d] font-semibold hover:underline"
                      >
                        {project.link.label}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </AnimateIn>
              );
            })()
          ) : (
            <p className="text-center text-sm text-gray-400 py-10 italic">No hay proyectos agregados.</p>
          )}
        </div>

        {/* Floating Left & Right arrows for quick navigation */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-[-8px] md:left-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full border border-gray-150 bg-white hover:bg-white text-gray-600 hover:text-[#1a5f7a] flex items-center justify-center shadow-lg active:scale-95 hover:scale-103 transition-all cursor-pointer z-35"
              title="Proyecto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-[-8px] md:right-[-18px] top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full border border-gray-150 bg-white hover:bg-white text-gray-600 hover:text-[#1a5f7a] flex items-center justify-center shadow-lg active:scale-95 hover:scale-103 transition-all cursor-pointer z-35"
              title="Siguiente proyecto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Swipe instructions under gallery */}
      {items.length > 1 && (
        <div className="text-center mt-4 text-[10.5px] font-bold text-gray-400 select-none flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Arrastra horizontalmente con el cursor o usa los botones para navegar de uno en uno</span>
        </div>
      )}
    </section>
  );
}
