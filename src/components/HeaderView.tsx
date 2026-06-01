import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Edit3, User, Calendar, CreditCard, Award, Languages, GraduationCap, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { PersonalInfo } from '../types';

interface HeaderViewProps {
  info: PersonalInfo;
  isEditing: boolean;
  onEditInfo: () => void;
  onUpdatePhoto: (photoBase64: string) => void;
}

export default function HeaderView({
  info,
  isEditing,
  onEditInfo,
  onUpdatePhoto
}: HeaderViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdatePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdatePhoto('');
  };

  // Fallback high-fidelity SVG Avatar with integrated electronic circuits motif 
  const FallbackAvatar = () => (
    <svg viewBox="0 0 120 120" className="w-full h-full text-indigo-700 bg-linear-to-br from-slate-100 to-indigo-50">
      <defs>
        <pattern id="circuits" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="#cbd5e1" strokeWidth="0.5" fill="none" opacity="0.3"/>
          <circle cx="10" cy="10" r="1.5" fill="#94a3b8" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuits)" />
      {/* Dynamic background glow */}
      <circle cx="60" cy="60" r="45" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" opacity="0.8" />
      {/* Human executive shape representation */}
      <circle cx="60" cy="46" r="20" fill="#475569" />
      <path d="M26 94 C 26 74, 40 68, 60 68 C 80 68, 94 74, 94 94 Z" fill="#334155" />
      {/* Tie & Collar decoration */}
      <path d="M52 68 L60 82 L68 68 Z" fill="#f8fafc" />
      <path d="M57 74 L60 98 L63 74 Z" fill="#1e293b" />
      {/* Micro-chip or electronics accent on background */}
      <rect x="15" y="15" width="12" height="12" rx="2" fill="#818cf8" opacity="0.7" />
      <line x1="21" y1="9" x2="21" y2="15" stroke="#6366f1" strokeWidth="1.5" />
      <line x1="21" y1="27" x2="21" y2="33" stroke="#6366f1" strokeWidth="1.5" />
      <text x="21" y="24" fontSize="7" fontFamily="monospace" fill="#ffffff" textAnchor="middle" fontWeight="bold">JS</text>
    </svg>
  );

  return (
    <section id="datos-personales-header" className="relative group border-b-2 border-[#1a5f7a] pb-6 mb-4">
      {/* Main layouts for degree titles */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[#1a5f7a] font-bold text-lg md:text-xl tracking-tight block">
            {info.title}
          </span>
          <span className="text-gray-500 font-semibold text-xs md:text-sm block">
            {info.subtitle}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditInfo();
                }}
                className="p-1 px-2.5 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" /> Editar Datos Personales
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-1 px-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" /> Subir foto
              </button>
              {info.photoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(e);
                  }}
                  className="p-1 px-2.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar foto
                </button>
              )}
            </div>
          )}
          <div className="text-right text-[11px] font-mono text-gray-400 hidden md:block">
            CV Actualizado: {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-4 items-start">
        {/* Photo Upload & Display Frame */}
        <div className="w-full lg:w-48 flex-shrink-0 flex flex-col items-center">
          <div className="relative w-40 h-48 lg:w-44 lg:h-52 rounded-xl overflow-hidden border border-gray-300 shadow-md bg-white group/photo">
            {(() => {
              const profileSrc = (!info.photoUrl || info.photoUrl === "" || info.photoUrl === "/assets/images/jose_manuel_photo.png" || info.photoUrl === "/src/assets/images/jose_manuel_photo.png" || info.photoUrl === "/assets/images/Imagen CV.jpg" || info.photoUrl === "/src/assets/images/Imagen CV.jpg" || info.photoUrl.includes("Imagen%20CV") || info.photoUrl.includes("Imagen CV") || info.photoUrl.includes("jose_manuel_photo") || info.photoUrl === "/assets/images/Imagen_CV.jpg")
                ? "/assets/images/Imagen_CV.jpg"
                : info.photoUrl;
              return profileSrc ? (
                <img
                  src={profileSrc}
                  alt={info.fullName}
                  className="w-full h-full object-cover"
                  id="profile-picture-img"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <FallbackAvatar />
              );
            })()}

            {/* Quick action photo upload overlay */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-all duration-150 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 px-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1 shadow cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Subir foto
                </button>
                {info.photoUrl && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="p-1 px-2 text-[10px] bg-red-600 hover:bg-red-750 text-white font-bold rounded flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Eliminar
                  </button>
                )}
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          {isEditing && (
            <span className="text-[10px] text-gray-400 italic mt-1 text-center w-full block">Mueva el cursor sobre la foto para cambiarla</span>
          )}
        </div>

        {/* Name and Direct Contacts block */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
              {info.fullName}
            </h1>
          </div>

          {/* Core Contacts row matching original details */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-800">
              <MapPin className="w-4 h-4 text-[#1a5f7a] flex-shrink-0" />
              <div>
                <span className="block font-bold text-gray-500 uppercase text-[9px]">Domicilio</span>
                <span className="font-semibold text-gray-800">{info.domicilio}</span>
              </div>
            </div>
          </div>

          <div className="hidden">

            <div className="flex items-center gap-2 text-xs text-gray-800">
              <a 
                href={`https://wa.me/${info.celular.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:scale-110 active:scale-95 transition-transform duration-100 text-[#25D366] hover:text-[#128C7E] flex-shrink-0"
                title="Enviar mensaje de WhatsApp"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 flex-shrink-0 fill-current"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.017-5.092-2.87-6.948C16.612 1.98 14.15 1.95 12.01 1.95c-5.444 0-9.87 4.414-9.873 9.831 0 1.93.535 3.812 1.549 5.496l-1.015 3.714 3.811-.998zm12.923-6.417c-.332-.165-1.962-.968-2.265-1.077-.302-.11-.523-.165-.742.165-.219.33-.848 1.077-1.04 1.298-.19.22-.383.247-.714.082-.332-.164-1.4-.515-2.667-1.644-.985-.878-1.65-1.962-1.843-2.292-.193-.33-.02-.508.145-.672.15-.147.33-.385.495-.578.165-.192.219-.33.329-.55.11-.22.055-.412-.027-.577-.082-.165-.742-1.787-1.016-2.447-.267-.642-.539-.553-.742-.553-.19.001-.412.001-.632.001-.22 0-.578.082-.88.412-.302.33-1.155 1.127-1.155 2.747 0 1.62 1.182 3.19 1.346 3.41.165.22 2.327 3.55 5.637 4.977.787.34 1.4.542 1.88.694.79.25 1.51.215 2.078.13.633-.095 1.962-.801 2.238-1.574.275-.772.275-1.433.192-1.574-.083-.14-.302-.22-.633-.385z" />
                </svg>
              </a>
              <div>
                <span className="block font-bold text-gray-500 uppercase text-[9px]">Celular / WhatsApp</span>
                <a 
                  href={`https://wa.me/${info.celular.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-semibold hover:underline text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {info.celular}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-800">
              <a 
                href={`mailto:${info.email}`} 
                className="hover:scale-110 active:scale-95 transition-transform duration-100 text-[#EA4335] hover:text-[#B21F1F] flex-shrink-0"
                title="Enviar correo electrónico por Gmail"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 flex-shrink-0 fill-current"
                >
                  <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 5.62-9-5.62V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.85.65-1.5 1.5-1.5H3l9 5.62L21 3h1.5c.85 0 1.5.65 1.5 1.5z" />
                </svg>
              </a>
              <div>
                <span className="block font-bold text-gray-500 uppercase text-[9px]">E-mail</span>
                <a 
                  href={`mailto:${info.email}`} 
                  className="font-semibold hover:underline text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {info.email}
                </a>
              </div>
            </div>
          </div>

          {/* Subgrid of personal attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Edad</span>
              <span className="font-semibold text-gray-800">{info.edad}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg col-span-2">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Nacimiento</span>
              <span className="font-semibold text-gray-800 line-clamp-1">{info.nacimiento}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Estado Civil</span>
              <span className="font-semibold text-gray-800">{info.estadoCivil}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Cédula Prof.</span>
              <span className="font-bold text-[#1a5f7a]">{info.cedulaProfesional}</span>
            </div>

            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">CURP</span>
              <span className="font-semibold text-gray-800 tracking-wider font-mono text-[11px]">{info.curp}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">RFC</span>
              <span className="font-semibold text-gray-800 tracking-wider font-mono text-[11px]">{info.rfc}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Pasaporte</span>
              <span className="font-semibold text-gray-800">{info.pasaporte}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Visa Americana</span>
              <span className="font-semibold text-gray-800">{info.visaAmericana}</span>
            </div>
            <div className="p-2 border border-gray-150 rounded-lg">
              <span className="block font-bold text-gray-550 text-[10px] uppercase">Licencia</span>
              <span className="font-semibold text-gray-800">{info.licenciaChofer}</span>
            </div>
          </div>

          {/* Languages & Advanced Studies blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="flex gap-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <Languages className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-900 block text-xs uppercase tracking-wide">Idiomas (Inglés)</span>
                <span className="text-gray-800 font-semibold text-xs leading-relaxed">{info.ingles}</span>
              </div>
            </div>

            <div className="flex gap-2 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <GraduationCap className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 block text-xs uppercase tracking-wide">Postgrado</span>
                <span className="text-gray-800 font-semibold text-xs leading-relaxed">{info.postgrado}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
