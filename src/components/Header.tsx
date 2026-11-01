import React, { useState, useEffect, useRef } from 'react';
import { UserRole, UserProfile } from '../types';
import { useI18n } from '../i18nContext';
import {
  UserCheck,
  Languages,
  ChevronDown,
  Trash2,
  Wind,
  GraduationCap,
  HeartPulse,
  Vote,
  LogIn,
  FileText,
  Menu,
  X,
  MessageSquareCode,
  Home,
  Coins,
  Building2,
  Activity,
  MapPin,
  AlertCircle,
  BarChart3,
  LayoutDashboard,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenRoleModal: () => void;
  onOpenAssistantModal: () => void;
  onOpenGrievanceForm: () => void;
  onOpenLanguageModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenRoleModal,
  onOpenAssistantModal,
  onOpenGrievanceForm,
  onOpenLanguageModal,
  onOpenAuthModal
}) => {
  const { t, language } = useI18n();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Core links that stay visible on desktop
  const primaryNavItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'my_complaints', label: t('navMyComplaints'), icon: FileText, highlight: true },
    { id: 'funds', label: t('navFunds'), icon: Coins },
    { id: 'projects', label: t('navProjects'), icon: Building2 },
  ];

  // Everything else lives in the "More" menu (desktop) / drawer (tablet + mobile)
  const exploreItems = [
    { id: 'monitoring', label: t('navMonitoring'), icon: Activity, desc: 'AI vision audits of site progress' },
    { id: 'map', label: t('navMap'), icon: MapPin, desc: 'Projects and grievances on the map' },
  ];

  const auditDropdownItems = [
    { id: 'waste', label: t('navWaste'), icon: Trash2, desc: 'Verification & clearance audits' },
    { id: 'pollution', label: t('navPollution'), icon: Wind, desc: 'Air & water AQI analysis' },
    { id: 'schools', label: t('navSchools'), icon: GraduationCap, desc: 'Sanitation & safety audits' },
    { id: 'hospitals', label: t('navHospitals'), icon: HeartPulse, desc: 'Hygiene & bio-waste audits' },
    { id: 'needs', label: t('navNeeds'), icon: Vote, desc: 'Community proposals & voice' },
  ];

  const secondaryNavItems = [
    { id: 'grievances', label: t('navGrievances'), icon: AlertCircle, desc: 'Lodge or track citizen complaints' },
    { id: 'analytics', label: t('navAnalytics'), icon: BarChart3, desc: 'Statistical expenditure insights' },
    { id: 'dashboards', label: t('navRoleConsole'), icon: LayoutDashboard, desc: 'Role-based statutory consoles' },
  ];

  const moreGroups = [
    { title: 'Explore', items: exploreItems },
    { title: 'Specialized Civic Audits', items: auditDropdownItems },
    { title: 'Public Redressal & Consoles', items: secondaryNavItems },
  ];

  const drawerGroups = [
    { title: 'Core Portals', items: primaryNavItems },
    ...moreGroups,
  ];

  const moreLabel = language === 'hi' ? 'और देखें' : language === 'pa' ? 'ਹੋਰ' : 'More';
  const isMoreTabActive = moreGroups.some((g) => g.items.some((item) => item.id === currentTab));

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'admin':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'official':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  const getLanguageLabel = (short = false) => {
    switch (language) {
      case 'hi':
        return short ? 'हि' : 'हिन्दी';
      case 'pa':
        return short ? 'ਪੰ' : 'ਪੰਜਾਬੀ';
      default:
        return short ? 'EN' : 'English';
    }
  };

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
  };

  // Close the "More" menu on outside click / Escape (a fixed overlay cannot be used here because
  // the header's backdrop-filter makes it the containing block of fixed descendants).
  useEffect(() => {
    if (!isMoreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setIsMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMoreOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMoreOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const navBtn = (isActive: boolean, highlight?: boolean) =>
    `relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
      isActive
        ? 'text-slate-950 font-bold bg-slate-100'
        : highlight
        ? 'text-emerald-700 font-semibold hover:bg-emerald-50'
        : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50'
    }`;

  const drawerBtn = (isActive: boolean) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left min-w-0 transition-colors ${
      isActive
        ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
        : 'text-slate-700 hover:bg-slate-100 border border-transparent'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Row layout: [brand] [nav (grows, right-aligned)] [actions]. Every zone can shrink (min-w-0)
            except the brand mark and the action buttons, so nothing can paint over a neighbour. */}
        <div className="flex items-center gap-2 sm:gap-3 h-16 min-w-0">

          {/* Zone 1: Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 min-w-0 shrink-0 text-left group rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="JanDrishti AI Home"
          >
            <span className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 shadow-xs shrink-0">
              <span className="font-mono text-sm tracking-tighter font-bold">JD</span>
            </span>
            <span className="min-w-0">
              <span className="block text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight whitespace-nowrap">
                {t('appName')}
              </span>
              <span className="hidden 2xl:block text-[10px] text-slate-500 font-medium leading-tight max-w-[220px] truncate">
                {t('tagline')}
              </span>
            </span>
          </button>

          {/* Zone 2: Desktop navigation (xl and up). Four core links inline, everything else in "More". */}
          <nav
            aria-label="Primary"
            className="hidden xl:flex flex-1 min-w-0 items-center justify-end gap-0.5"
          >
            {primaryNavItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={navBtn(isActive, item.highlight)}
                >
                  <Icon className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                  {isActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-emerald-600 rounded-full" />}
                </button>
              );
            })}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
                aria-controls="header-more-menu"
                className={navBtn(isMoreTabActive)}
              >
                <span>{moreLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
                {isMoreTabActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-emerald-600 rounded-full" />}
              </button>

              {isMoreOpen && (
                <div
                  id="header-more-menu"
                  className="absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-5rem)] overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                >
                  {moreGroups.map((group) => (
                    <div key={group.title} className="py-1">
                      <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {group.title}
                      </div>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`w-full px-4 py-2 text-left flex items-start gap-3 min-w-0 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 ${
                              isActive ? 'bg-emerald-50/70 text-emerald-900 font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`}
                              aria-hidden="true"
                            />
                            <span className="min-w-0">
                              <span className="block text-sm leading-tight">{item.label}</span>
                              <span className="block text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Spacer so actions stay on the right when the desktop nav is hidden */}
          <div className="flex-1 min-w-0 xl:hidden" />

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenLanguageModal}
              title="Change Language (English / हिन्दी / ਪੰਜਾਬੀ)"
              aria-label="Select Language"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Languages className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{getLanguageLabel(true)}</span>
            </button>

            <button
              onClick={onOpenAssistantModal}
              title="Open Multilingual Assistant (English, Hindi, Punjabi)"
              aria-label="AI Multilingual Assistant"
              className="inline-flex items-center gap-1.5 p-2 2xl:px-2.5 2xl:py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageSquareCode className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span className="hidden 2xl:inline">{t('aiAssistant')}</span>
            </button>

            <button
              onClick={onOpenRoleModal}
              title="Click to switch role persona"
              className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border rounded-lg whitespace-nowrap transition-colors ${getRoleBadgeStyle(currentUser.role)}`}
            >
              <UserCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="capitalize">{currentUser.role}</span>
            </button>

            <button
              onClick={onOpenAuthModal}
              title="Sign In / Register Citizen Account"
              aria-label="Sign in or register"
              className="hidden sm:inline-flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={onOpenGrievanceForm}
              className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              {t('reportProblem')}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="xl:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="header-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer (below xl) */}
      {isMobileMenuOpen && (
        <div
          id="header-mobile-menu"
          className="xl:hidden border-t border-slate-200 bg-white shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
        >
          <div className="max-w-7xl mx-auto p-4 space-y-4">

            {/* Persona + actions */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0">
                    {currentUser.full_name ? currentUser.full_name.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-slate-900 block leading-tight truncate">
                      {currentUser.full_name || 'Citizen User'}
                    </span>
                    <span className="text-[11px] text-slate-500 capitalize block truncate">
                      {currentUser.role} · {currentUser.department || 'Gram Sabha'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenRoleModal(); }}
                  className={`shrink-0 px-2.5 py-1.5 text-xs font-medium border rounded-md whitespace-nowrap ${getRoleBadgeStyle(currentUser.role)}`}
                >
                  Switch Role
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenGrievanceForm(); }}
                  className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  <span>{t('reportProblem')}</span>
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenAuthModal(); }}
                  className="py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            </div>

            {/* Every page, grouped */}
            {drawerGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {group.title}
                </span>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-1.5 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={drawerBtn(isActive)}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} aria-hidden="true" />
                        <span className="min-w-0 truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Language & assistant */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenLanguageModal(); }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <Languages className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                <span>Language: {getLanguageLabel(false)}</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAssistantModal(); }}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <MessageSquareCode className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>{t('aiAssistant')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
