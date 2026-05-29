import React from 'react';
import { Award, Code2, Edit3, Plus, ExternalLink, Film, Image as ImageIcon } from 'lucide-react';
import { ProjectItem } from '../types';
import AnimateIn from './AnimateIn';

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
  return (
    <section id="proyectos-portfolio" className="py-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1a5f7a] border-b-2 border-[#1a5f7a] pb-1 uppercase tracking-wide flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#1a5f7a]" />
          Proyectos desarrollados
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Añadir Proyecto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((project) => (
          <AnimateIn 
            key={project.id}
            type={project.animation}
            triggerKey={JSON.stringify(project)}
            className="relative group border border-gray-200 rounded-2xl p-5 bg-white shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
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
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
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
        ))}

        {items.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10 italic md:col-span-2">No hay proyectos agregados.</p>
        )}
      </div>
    </section>
  );
}
