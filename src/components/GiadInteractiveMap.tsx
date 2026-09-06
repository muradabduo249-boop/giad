// Source: Google Maps Platform Code Assist
import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ExternalLink, Layers, Compass, Copy, Check, Info } from 'lucide-react';

export interface LocationItem {
  id: 'hq' | 'industrial';
  titleAr: string;
  titleEn: string;
  addressAr: string;
  descriptionAr: string;
  coordinates: { lat: number; lng: number };
  zoom: number;
  badgeAr: string;
}

export const GIAD_LOCATIONS: LocationItem[] = [
  {
    id: 'hq',
    titleAr: 'المقر الرئيسي — برج جياد الإداري',
    titleEn: 'GIAD Executive Headquarters (Giad Tower)',
    addressAr: 'الخرطوم، الجريف غرب، شارع مدني السريع، برج جياد — السودان',
    descriptionAr: 'المقر الرئيسي لمجلس الإدارة والإدارات التنفيذية، إدارة التسويق والعقود، ومركز استقبال كبار المستثمرين والعملاء.',
    coordinates: { lat: 15.5684, lng: 32.5572 },
    zoom: 15,
    badgeAr: 'المقر الإداري والتنفيذي',
  },
  {
    id: 'industrial',
    titleAr: 'مدينة جياد الصناعية (المجمع الهندسي المتكامل)',
    titleEn: 'GIAD Industrial City Manufacturing Complex',
    addressAr: 'الكيلو 50 طريق الخرطوم - مدني السريع، ولاية الجزيرة، السودان',
    descriptionAr: 'قاعدة التصنيع الهندسي الكبرى: مصانع تجميع السيارات، شاحنات النقل الثقيل، الجرارات، مكابس تشكيل المعادن، ومصانع الكابلات.',
    coordinates: { lat: 14.9833, lng: 33.0167 },
    zoom: 14,
    badgeAr: 'مجمع المصانع والإنتاج',
  },
];

export const GiadInteractiveMap: React.FC = () => {
  const [selectedId, setSelectedId] = useState<'hq' | 'industrial'>('hq');
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const currentLocation = GIAD_LOCATIONS.find((loc) => loc.id === selectedId) || GIAD_LOCATIONS[0];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const handleCopyCoordinates = () => {
    const text = `${currentLocation.coordinates.lat.toFixed(4)}, ${currentLocation.coordinates.lng.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const getGoogleMapsDirectionsUrl = (loc: LocationItem) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}&destination_place_id=GIAD`;
  };

  const getEmbedMapUrl = (loc: LocationItem) => {
    return `https://maps.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&hl=ar&z=${loc.zoom}&output=embed`;
  };

  return (
    <div id="giad-interactive-map-container" className="rounded-2xl border border-slate-200 bg-[#F8FAFC] overflow-hidden shadow-sm">
      {/* Header Bar with Location Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0084CA]/10 text-[#0084CA]">
                <Navigation className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1F36] font-sans">
                الموقع الجغرافي وخريطة المرافق
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              استكشف المقر الإداري بالخرطوم ومجمع مدينة جياد الصناعية التابعة للمجموعة
            </p>
          </div>

          {/* Location Selector Tabs */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-slate-200 shrink-0">
            {GIAD_LOCATIONS.map((loc) => {
              const isActive = loc.id === selectedId;
              return (
                <button
                  key={loc.id}
                  id={`map-tab-${loc.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedId(loc.id);
                    setShowInfoWindow(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-[#004B87] shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-[#0A1F36]'
                  }`}
                >
                  {loc.id === 'hq' ? 'برج جياد (الخرطوم)' : 'مدينة جياد الصناعية'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Display Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-100">
        {apiKey ? (
          /* Full Google Maps Platform JS SDK with Advanced Markers & Usage Attribution */
          <APIProvider apiKey={apiKey} solutionChannel="GMP_visgl_rgm">
            <Map
              key={currentLocation.id}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={currentLocation.coordinates}
              defaultZoom={currentLocation.zoom}
              gestureHandling="cooperative"
              disableDefaultUI={false}
              style={{ width: '100%', height: '100%' }}
            >
              {GIAD_LOCATIONS.map((loc) => (
                <AdvancedMarker
                  key={loc.id}
                  position={loc.coordinates}
                  title={loc.titleAr}
                  onClick={() => {
                    setSelectedId(loc.id);
                    setShowInfoWindow(true);
                  }}
                >
                  <Pin
                    background={loc.id === selectedId ? '#004B87' : '#64748B'}
                    borderColor="#0A1F36"
                    glyphColor="#ffffff"
                    scale={loc.id === selectedId ? 1.15 : 0.95}
                  />
                </AdvancedMarker>
              ))}

              {showInfoWindow && (
                <InfoWindow
                  position={currentLocation.coordinates}
                  onCloseClick={() => setShowInfoWindow(false)}
                >
                  <div className="p-2.5 max-w-xs text-right font-sans dir-rtl">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0084CA]/10 text-[#004B87] mb-1">
                      {currentLocation.badgeAr}
                    </span>
                    <h4 className="font-bold text-sm text-[#0A1F36]">{currentLocation.titleAr}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {currentLocation.addressAr}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={getGoogleMapsDirectionsUrl(currentLocation)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#004B87] hover:text-[#0084CA]"
                      >
                        <span>فتح الاتجاهات</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* Live Interactive Google Maps Embed with Direct Interactive Controls */
          <div className="w-full h-full relative">
            <iframe
              id="google-maps-embed-frame"
              title={`خريطة ${currentLocation.titleAr}`}
              src={getEmbedMapUrl(currentLocation)}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* Floating Location Quick Info Overlay */}
        <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:max-w-md p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-right z-10 font-sans">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#004B87]">
                <MapPin className="w-3.5 h-3.5 text-[#0084CA] shrink-0" />
                <span>{currentLocation.titleAr}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                {currentLocation.addressAr}
              </p>
            </div>
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0084CA]/10 text-[#004B87] border border-[#0084CA]/20">
              {currentLocation.badgeAr}
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <button
              id="copy-coords-btn"
              type="button"
              onClick={handleCopyCoordinates}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-[#004B87] transition font-mono text-[11px]"
              title="نسخ الإحداثيات الجغرافية"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoords ? 'تم النسخ' : `${currentLocation.coordinates.lat.toFixed(4)}°N, ${currentLocation.coordinates.lng.toFixed(4)}°E`}</span>
            </button>

            <a
              id="google-maps-directions-link"
              href={getGoogleMapsDirectionsUrl(currentLocation)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#004B87] hover:text-[#0084CA] transition"
            >
              <span>الحصول على الاتجاهات</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#0084CA] shrink-0" />
          <span>مسار الوصول: عبر طريق الخرطوم - مدني السريع، متصل بمطار الخرطوم وموانئ وموانئ التصدير القومية.</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span>Google Maps Platform Grounded</span>
        </div>
      </div>
    </div>
  );
};
