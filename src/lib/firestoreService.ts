import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Product,
  NewsItem,
  JobOpening,
  ContactMessage,
  QuotationRequest,
  JobApplication,
} from '../types';
import { PRODUCTS, NEWS_ITEMS, JOB_OPENINGS, GIAD_INFO } from '../data/giadData';

export interface SiteSettings {
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  phoneUnified: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  hqAddressAr: string;
  industrialCityAr: string;
  workHoursAr: string;
  statStaff: string;
  statCompanies: string;
  statSectors: string;
  statYear: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  nameAr: GIAD_INFO.nameAr,
  nameEn: GIAD_INFO.nameEn,
  taglineAr: GIAD_INFO.taglineAr,
  phoneUnified: '1993',
  phonePrimary: '+249 183 234567',
  phoneSecondary: '+249 183 234568',
  email: GIAD_INFO.email,
  hqAddressAr: GIAD_INFO.hqAddressAr,
  industrialCityAr: GIAD_INFO.industrialCityAr,
  workHoursAr: GIAD_INFO.workHoursAr,
  statStaff: '+10,000',
  statCompanies: '+15',
  statSectors: '6',
  statYear: '1993',
};

// Seed initial collections if empty
export async function seedInitialDataIfEmpty() {
  try {
    // 1. Products
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      for (const prod of PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          createdAt: serverTimestamp(),
        });
      }
    }

    // 2. News
    const newsSnap = await getDocs(collection(db, 'news'));
    if (newsSnap.empty) {
      for (const news of NEWS_ITEMS) {
        await setDoc(doc(db, 'news', news.id), {
          ...news,
          createdAt: serverTimestamp(),
        });
      }
    }

    // 3. Jobs
    const jobsSnap = await getDocs(collection(db, 'jobs'));
    if (jobsSnap.empty) {
      for (const job of JOB_OPENINGS) {
        await setDoc(doc(db, 'jobs', job.id), {
          ...job,
          createdAt: serverTimestamp(),
        });
      }
    }

    // 4. Site Settings
    const settingsDoc = doc(db, 'site_settings', 'general');
    await setDoc(settingsDoc, DEFAULT_SITE_SETTINGS, { merge: true });

    // 5. Initial Seed for Quotation Requests if empty
    const quotesSnap = await getDocs(collection(db, 'quotation_requests'));
    if (quotesSnap.empty) {
      const sampleQuote: QuotationRequest = {
        id: `quote-seed-1`,
        productName: 'جرار جياد ماسي فيرجسون 290',
        productId: 'prod-tractor-mf290',
        clientName: 'م. إبراهيم كمال الدسوقي',
        companyName: 'مشروع الجزيرة الزراعي - قسم الميكنة',
        phone: '+249 912 345678',
        email: 'i.desouqi@aljaziraproject.sd',
        quantity: '5 وحدات مع الملحقات الحقلية',
        notes: 'نرجو تزويدنا بعرض سعر رسمي مع جدول الصيانة وشروط السداد المعتمدة للمشاريع التنموية.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        adminNotes: 'طلب هام يحتاج مراجعة إدارة التسويق الزراعي',
      };
      await setDoc(doc(db, 'quotation_requests', sampleQuote.id), sampleQuote);
    }

    // 6. Initial Seed for Contact Inquiries if empty
    const contactSnap = await getDocs(collection(db, 'contact_messages'));
    if (contactSnap.empty) {
      const sampleMsg: ContactMessage = {
        id: `msg-seed-1`,
        name: 'د. طارق الفاتح',
        email: 'tariq.fateh@consulting-eng.com',
        phone: '+249 923 889900',
        subject: 'استفسار عن توريد كابلات الجهد المتوسط لمشروع مجمع تجاري',
        message: 'السلام عليكم ورحمة الله، نود الاستفسار عن توفر كابلات نحاسية معزولة جهد 11 ك.ف وفق مواصفات هيئة الكهرباء والكميات المتاحة للتسليم الفوري.',
        status: 'unread',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      };
      await setDoc(doc(db, 'contact_messages', sampleMsg.id), sampleMsg);
    }

    // 7. Initial Seed for Job Applications if empty
    const appsSnap = await getDocs(collection(db, 'job_applications'));
    if (appsSnap.empty) {
      const sampleApp: JobApplication = {
        id: `app-seed-1`,
        jobId: 'job-1',
        jobTitle: 'مهندس جودة ومطابقة صناعية',
        fullName: 'عمر صديق عبد الرحمن',
        email: 'omar.siddiq@gmail.com',
        phone: '+249 900 112233',
        qualification: 'بكالوريوس هندسة ميكانيكية - جامعة الخرطوم (مرتبة الشرف)',
        yearsExp: '4 سنوات في مراقبة الجودة وضبط المعايير ISO',
        coverNote: 'أتقدم لشغل هذه الوظيفة إيماناً بالدور الوطني الرائد لمجموعة جياد، ولدي خبرة متقدمة في فحوصات الجودة والمعايرة والتحكم الإحصائي في العمليات.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      };
      await setDoc(doc(db, 'job_applications', sampleApp.id), sampleApp);
    }
  } catch (err) {
    console.warn('Firebase seeding or initial sync notice:', err);
  }
}

// -------------------------------------------------------------
// Realtime Subscriptions
// -------------------------------------------------------------

// Products
export function subscribeProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, 'products');
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(PRODUCTS);
        return;
      }
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      onUpdate(list);
    },
    (err) => {
      console.error('Products listener error, falling back to local:', err);
      onUpdate(PRODUCTS);
      if (onError) onError(err);
    }
  );
}

// News
export function subscribeNews(
  onUpdate: (news: NewsItem[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, 'news');
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(NEWS_ITEMS);
        return;
      }
      const list: NewsItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as NewsItem);
      });
      onUpdate(list);
    },
    (err) => {
      console.error('News listener error, falling back to local:', err);
      onUpdate(NEWS_ITEMS);
      if (onError) onError(err);
    }
  );
}

// Jobs
export function subscribeJobs(
  onUpdate: (jobs: JobOpening[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, 'jobs');
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(JOB_OPENINGS);
        return;
      }
      const list: JobOpening[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as JobOpening);
      });
      onUpdate(list);
    },
    (err) => {
      console.error('Jobs listener error, falling back to local:', err);
      onUpdate(JOB_OPENINGS);
      if (onError) onError(err);
    }
  );
}

// Site Settings
export function subscribeSiteSettings(
  onUpdate: (settings: SiteSettings) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, 'site_settings', 'general');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate({ ...DEFAULT_SITE_SETTINGS, ...docSnap.data() } as SiteSettings);
      } else {
        onUpdate(DEFAULT_SITE_SETTINGS);
      }
    },
    (err) => {
      console.error('Settings listener error:', err);
      onUpdate(DEFAULT_SITE_SETTINGS);
      if (onError) onError(err);
    }
  );
}

// Quotation Requests Subscription
export function subscribeQuotationRequests(
  onUpdate: (quotes: QuotationRequest[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, 'quotation_requests');
  return onSnapshot(
    q,
    (snapshot) => {
      const list: QuotationRequest[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as QuotationRequest);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (err) => {
      console.error('Quotations listener error:', err);
      if (onError) onError(err);
    }
  );
}

// Contact Messages Subscription
export function subscribeContactMessages(
  onUpdate: (messages: ContactMessage[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, 'contact_messages');
  return onSnapshot(
    q,
    (snapshot) => {
      const list: ContactMessage[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as ContactMessage);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (err) => {
      console.error('Contact messages listener error:', err);
      if (onError) onError(err);
    }
  );
}

// Job Applications Subscription
export function subscribeJobApplications(
  onUpdate: (applications: JobApplication[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, 'job_applications');
  return onSnapshot(
    q,
    (snapshot) => {
      const list: JobApplication[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as JobApplication);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (err) => {
      console.error('Job applications listener error:', err);
      if (onError) onError(err);
    }
  );
}

// -------------------------------------------------------------
// Client Submissions (From Visitors / Customers)
// -------------------------------------------------------------

// Submit Quotation Request
export async function submitQuotationRequest(data: Omit<QuotationRequest, 'id' | 'createdAt' | 'status'>) {
  const id = `quote-${Date.now()}`;
  const newQuote: QuotationRequest = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const ref = doc(db, 'quotation_requests', id);
  await setDoc(ref, newQuote);
  return newQuote;
}

// Submit Contact Message
export async function submitContactMessage(data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) {
  const id = `msg-${Date.now()}`;
  const newMsg: ContactMessage = {
    ...data,
    id,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };
  const ref = doc(db, 'contact_messages', id);
  await setDoc(ref, newMsg);
  return newMsg;
}

// Submit Job Application
export async function submitJobApplication(data: Omit<JobApplication, 'id' | 'createdAt' | 'status'>) {
  const id = `app-${Date.now()}`;
  const newApp: JobApplication = {
    ...data,
    id,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  const ref = doc(db, 'job_applications', id);
  await setDoc(ref, newApp);
  return newApp;
}

// -------------------------------------------------------------
// Admin Updates & Deletions
// -------------------------------------------------------------

// Quotations Actions
export async function updateQuotationStatus(
  quoteId: string,
  status: QuotationRequest['status'],
  adminNotes?: string
) {
  const ref = doc(db, 'quotation_requests', quoteId);
  const updatePayload: Record<string, any> = { status, updatedAt: serverTimestamp() };
  if (adminNotes !== undefined) {
    updatePayload.adminNotes = adminNotes;
  }
  await updateDoc(ref, updatePayload);
}

export async function deleteQuotationRequest(quoteId: string) {
  const ref = doc(db, 'quotation_requests', quoteId);
  await deleteDoc(ref);
}

// Contact Messages Actions
export async function updateContactMessageStatus(
  messageId: string,
  status: ContactMessage['status'],
  adminNotes?: string
) {
  const ref = doc(db, 'contact_messages', messageId);
  const updatePayload: Record<string, any> = { status, updatedAt: serverTimestamp() };
  if (adminNotes !== undefined) {
    updatePayload.adminNotes = adminNotes;
  }
  await updateDoc(ref, updatePayload);
}

export async function deleteContactMessage(messageId: string) {
  const ref = doc(db, 'contact_messages', messageId);
  await deleteDoc(ref);
}

// Job Applications Actions
export async function updateJobApplicationStatus(
  applicationId: string,
  status: JobApplication['status'],
  adminNotes?: string
) {
  const ref = doc(db, 'job_applications', applicationId);
  const updatePayload: Record<string, any> = { status, updatedAt: serverTimestamp() };
  if (adminNotes !== undefined) {
    updatePayload.adminNotes = adminNotes;
  }
  await updateDoc(ref, updatePayload);
}

export async function deleteJobApplication(applicationId: string) {
  const ref = doc(db, 'job_applications', applicationId);
  await deleteDoc(ref);
}

// Products CRUD
export async function saveProduct(product: Product) {
  const ref = doc(db, 'products', product.id);
  await setDoc(ref, {
    ...product,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string) {
  const ref = doc(db, 'products', productId);
  await deleteDoc(ref);
}

// News CRUD
export async function saveNewsItem(news: NewsItem) {
  const ref = doc(db, 'news', news.id);
  await setDoc(ref, {
    ...news,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNewsItem(newsId: string) {
  const ref = doc(db, 'news', newsId);
  await deleteDoc(ref);
}

// Jobs CRUD
export async function saveJobOpening(job: JobOpening) {
  const ref = doc(db, 'jobs', job.id);
  await setDoc(ref, {
    ...job,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteJobOpening(jobId: string) {
  const ref = doc(db, 'jobs', jobId);
  await deleteDoc(ref);
}

// Site Settings
export async function saveSiteSettings(settings: SiteSettings) {
  const ref = doc(db, 'site_settings', 'general');
  await setDoc(
    ref,
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
