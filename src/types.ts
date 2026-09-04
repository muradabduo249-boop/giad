export interface Sector {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  descriptionAr: string;
  fullOverviewAr: string;
  capabilities: string[];
  keyProducts: string[];
  image: string;
  badgeAr: string;
}

export interface Company {
  id: string;
  nameAr: string;
  nameEn: string;
  industryAr: string;
  shortDescriptionAr: string;
  fullBioAr: string;
  establishedYear: number;
  locationAr: string;
  keyProjects: string[];
  websiteUrl: string;
  image: string;
  logoText: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'vehicles' | 'trucks' | 'agricultural' | 'cables' | 'metal' | 'services';
  categoryAr: string;
  shortDescriptionAr: string;
  image: string;
  specs: { labelAr: string; valueAr: string }[];
  applicationsAr: string[];
  featured?: boolean;
}

export interface NewsItem {
  id: string;
  titleAr: string;
  date: string;
  categoryAr: string;
  excerptAr: string;
  contentAr: string;
  image: string;
  readTimeAr: string;
  featured?: boolean;
}

export interface TimelineMilestone {
  year: string;
  titleAr: string;
  descriptionAr: string;
}

export interface JobOpening {
  id: string;
  titleAr: string;
  departmentAr: string;
  locationAr: string;
  typeAr: string;
  experienceAr: string;
  descriptionAr: string;
  requirements: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
  adminNotes?: string;
}

export interface QuotationRequest {
  id: string;
  productName: string;
  productId?: string;
  clientName: string;
  companyName?: string;
  phone: string;
  email: string;
  quantity?: string;
  notes?: string;
  status: 'pending' | 'in_progress' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
  adminNotes?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  yearsExp: string;
  coverNote: string;
  cvUrl?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
  createdAt: string;
  adminNotes?: string;
}

