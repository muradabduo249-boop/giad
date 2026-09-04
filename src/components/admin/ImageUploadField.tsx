import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Camera,
  Trash2,
  CheckCircle2,
  Smartphone,
  Laptop,
} from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  helperText?: string;
}

/**
 * Compresses an image client-side to ensure fast loading and strict Firestore doc size limits.
 */
const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP, GIF)');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImage(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Error processing image:', err);
      setErrorMessage('حدث خطأ أثناء معالجة الصورة، يرجى المحاولة مجدداً');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // reset input value so selecting the same file triggers change
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-white text-[#004B87] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>رفع من الجهاز</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
              activeMode === 'url'
                ? 'bg-white text-[#004B87] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>رابط ويب</span>
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Upload Mode UI */}
      {activeMode === 'upload' ? (
        <div className="space-y-2">
          {value ? (
            /* Image Preview Card */
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2 overflow-hidden group">
              <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-900/5 flex items-center justify-center">
                <img
                  src={value}
                  alt="معاينة صورة المنتج"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#004B87]" />
                    <span>تغيير الصورة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  تم تحميل الصورة بنجاح وجاهزة للحفظ
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#004B87] hover:underline font-bold"
                  >
                    استبدال
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="text-red-600 hover:underline font-bold"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Dropzone / File Picker */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-2xl border-2 border-dashed p-6 transition-all text-center ${
                isDragging
                  ? 'border-[#004B87] bg-sky-50/70 scale-[0.99]'
                  : 'border-slate-300 hover:border-[#0084CA] bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              {isProcessing ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-3 border-sky-200 border-t-[#004B87] animate-spin" />
                  <p className="text-xs font-bold text-slate-700">جارِ معالجة وضغط الصورة بجودة عالية...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#004B87] flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800">
                      اختر صورة من هاتفك أو جهاز الحاسوب
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      اسحب وأفلت ملف الصورة هنا، أو استخدم الأزرار أدناه
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
                    >
                      <Laptop className="w-4 h-4" />
                      <span>اختيار من المعرض / الملفات</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#0084CA]" />
                      <span>التقاط بالكاميرا</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <Smartphone className="w-3 h-3" />
                    <span>يدعم JPG, PNG, WebP مع ضغط ذكي تلقائي للحفاظ على سرعة الموقع</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Manual URL Mode */
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
            placeholder="https://images.unsplash.com/... أو رابط مباشر للصورة"
          />
          {value && (
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              <img
                src={value}
                alt="معاينة"
                className="w-full h-full object-cover"
                onError={() => setErrorMessage('تعذر تحميل الصورة من الرابط المدخل')}
              />
            </div>
          )}
        </div>
      )}

      {/* Error notification if any */}
      {errorMessage && (
        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-[11px] font-bold text-red-600 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
