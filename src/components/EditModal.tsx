import React, { useState, useEffect } from 'react';
import { X, Link2, Play, Sparkles, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { AnimationType, Hyperlink, MediaItem } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  onSave: (data: {
    fields: Record<string, string>;
    hyperlink?: Hyperlink;
    animation?: AnimationType;
    media?: MediaItem;
  }) => void;
  onDelete?: () => void; // Optional delete action for lists
}

// Convert common YouTube URLs into embed links
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

export default function EditModal({
  isOpen,
  onClose,
  title,
  fields: initialFields,
  hyperlink: initialHyperlink,
  animation: initialAnimation,
  media: initialMedia,
  onSave,
  onDelete
}: EditModalProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [hasLink, setHasLink] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [animationSelected, setAnimationSelected] = useState<AnimationType>('none');
  
  // Media states
  const [hasMedia, setHasMedia] = useState(false);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Map initial text fields
      const values: Record<string, string> = {};
      initialFields.forEach(f => {
        values[f.key] = f.value;
      });
      setFieldValues(values);

      // Map dynamic hyperlink
      if (initialHyperlink && initialHyperlink.url) {
        setHasLink(true);
        setLinkLabel(initialHyperlink.label || 'Ver más');
        setLinkUrl(initialHyperlink.url);
      } else {
        setHasLink(false);
        setLinkLabel('');
        setLinkUrl('');
      }

      // Map animation
      setAnimationSelected(initialAnimation || 'none');

      // Map media
      if (initialMedia && initialMedia.url) {
        setHasMedia(true);
        setMediaType(initialMedia.type || 'video');
        setMediaUrl(initialMedia.url);
        setMediaCaption(initialMedia.caption || '');
      } else {
        setHasMedia(false);
        setMediaType('video');
        setMediaUrl('');
        setMediaCaption('');
      }
    }
  }, [isOpen, initialFields, initialHyperlink, initialAnimation, initialMedia]);

  if (!isOpen) return null;

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const finalHyperlink: Hyperlink | undefined = hasLink && linkUrl.trim()
      ? { label: linkLabel.trim() || 'Visitar enlace', url: linkUrl.trim() }
      : undefined;

    const finalMedia: MediaItem | undefined = hasMedia && mediaUrl.trim()
      ? {
          type: mediaType,
          url: mediaType === 'video' ? getYouTubeEmbedUrl(mediaUrl.trim()) : mediaUrl.trim(),
          caption: mediaCaption.trim()
        }
      : undefined;

    onSave({
      fields: fieldValues,
      hyperlink: finalHyperlink,
      animation: animationSelected,
      media: finalMedia
    });
    onClose();
  };

  return (
    <div id="edit-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        id="edit-modal-content"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Text Fields */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 tracking-wider uppercase border-b pb-1">Campos de Texto</h4>
            {initialFields.map(field => (
              <div key={field.key} className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={fieldValues[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={fieldValues[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={fieldValues[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Hyperlinks Control */}
          <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLink}
                  onChange={(e) => setHasLink(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700 tracking-wider uppercase flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-blue-500" /> Añadir Hipervínculo
                </span>
              </label>
            </div>
            {hasLink && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">Texto del enlace</span>
                  <input
                    type="text"
                    placeholder="Ej. Visitar sitio web, Ver proyecto..."
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">URL del Destino</span>
                  <input
                    type="url"
                    placeholder="Ej. https://github.com/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Core Animation Config */}
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Animación de entrada
            </h4>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500">Elija la animación decorativa interactiva para este elemento:</span>
              <select
                value={animationSelected}
                onChange={(e) => setAnimationSelected(e.target.value as AnimationType)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="none">Sin animación (Estático)</option>
                <option value="fade-in">Aparición gradual (Fade In)</option>
                <option value="slide-up">Desplamiento hacia arriba (Slide Up)</option>
                <option value="zoom-in">Enfoque de aumento (Zoom In)</option>
                <option value="bounce">Rebote elástico (Bounce Spring)</option>
                <option value="pulse">Latido constante (Pulse Loop)</option>
              </select>
            </div>
          </div>

          {/* Multimedia Insertion */}
          <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasMedia}
                  onChange={(e) => setHasMedia(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700 tracking-wider uppercase flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-rose-500" /> Incrustar Video o Imagen (Multimedia)
                </span>
              </label>
            </div>
            {hasMedia && (
              <div className="space-y-3 pt-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`flex-1 py-1 px-3 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      mediaType === 'video'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" /> Video de YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex-1 py-1 px-3 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      mediaType === 'image'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Imagen Externa URL
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">
                    {mediaType === 'video' ? 'Enlace de Youtube' : 'Dirección de la Imagen (URL)'}
                  </span>
                  <input
                    type="url"
                    placeholder={mediaType === 'video' ? 'Ej. https://www.youtube.com/watch?v=...' : 'Ej. https://mi-imagen.png'}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                  <span className="text-[10px] text-gray-400">
                    {mediaType === 'video' 
                      ? 'Admite enlaces de YouTube convencionales. Se convertirá automáticamente en reproductor.' 
                      : 'Proporcione un enlace HTTPS directo a la imagen hospedada.'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">Descripción / Epígrafe</span>
                  <input
                    type="text"
                    placeholder="Ej. Demostración en funcionamiento"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Está seguro de que desea eliminar este elemento por completo?')) {
                    onDelete();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Item
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-150 rounded-xl transition-all border border-gray-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md cursor-pointer transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
