export interface Hyperlink {
  label: string;
  url: string;
}

export interface MediaItem {
  type: 'video' | 'image';
  url: string; // YouTube video URL or image address
  caption?: string;
}

export type AnimationType = 'none' | 'fade-in' | 'slide-up' | 'pulse' | 'bounce' | 'zoom-in';

export interface PersonalInfo {
  title: string;
  subtitle: string;
  fullName: string;
  photoUrl: string;
  domicilio: string;
  celular: string;
  email: string;
  edad: string;
  nacimiento: string;
  estadoCivil: string;
  curp: string;
  rfc: string;
  pasaporte: string;
  visaAmericana: string;
  licenciaChofer: string;
  cedulaProfesional: string;
  ingles: string;
  postgrado: string;
}

export interface ExperienceItem {
  id: string;
  period: string; // e.g., "2013-Actual"
  company: string;
  role: string;
  functions: string;
  link?: Hyperlink;
  animation?: AnimationType;
  media?: MediaItem;
}

export interface SoftwareCategory {
  id: string;
  name: string; // e.g. "Ofimático", "Programación"
  tools: string; // comma-separated or raw string
  link?: Hyperlink;
  animation?: AnimationType;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  prize?: string; // Optional award/prize text
  link?: Hyperlink;
  animation?: AnimationType;
  media?: MediaItem;
}

export interface ConferenceItem {
  id: string;
  type: 'Concurso' | 'Capacitación' | 'Congreso';
  title: string;
  institution: string; // UTC, Flextronics, etc.
  description: string; // details
  link?: Hyperlink;
  animation?: AnimationType;
  media?: MediaItem;
}

export interface CVData {
  personalInfo: PersonalInfo;
  habilidadesText: string;
  experiences: ExperienceItem[];
  softwareCategories: SoftwareCategory[];
  projects: ProjectItem[];
  conferences: ConferenceItem[];
}
