import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Project, AnalyticsData, District } from './types';
import { fetchProjects, fetchAnalytics, fetchDistricts, loginRole } from './api';
import { I18nProvider, useI18n } from './i18nContext';

import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { MyComplaintsSection } from './components/MyComplaintsSection';
import { FundExplorerSection } from './components/FundExplorerSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AiMonitoringSection } from './components/AiMonitoringSection';
import { VillageMapSection } from './components/VillageMapSection';
import { GrievancesSection } from './components/GrievancesSection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { RoleDashboardsSection } from './components/RoleDashboardsSection';
import { WasteManagementSection } from './components/WasteManagementSection';
import { PollutionMonitoringSection } from './components/PollutionMonitoringSection';
import { SchoolMaintenanceSection } from './components/SchoolMaintenanceSection';
import { HospitalMaintenanceSection } from './components/HospitalMaintenanceSection';
import { CitizenVoiceSection } from './components/CitizenVoiceSection';

import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectTransparencyReportModal } from './components/ProjectTransparencyReportModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { MultilingualAssistantModal } from './components/MultilingualAssistantModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { AuthModal } from './components/AuthModal';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';

function AppContent() {
  const { language, setLanguage } = useI18n();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);

  // Current Logged-In Persona
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 1,
    username: 'citizen',
    email: 'citizen@jandrishti.org',
    full_name: 'Harpreet Singh',
    phone: '+91 98721 00001',
    role: 'citizen',
    designation: 'Resident Activist',
    department: 'Gram Sabha Bhaini Sahib'
  });

  // Modals State
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [reportProjectId, setReportProjectId] = useState<number | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [initialGrievanceTrackId, setInitialGrievanceTrackId] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [pData, aData, dData] = await Promise.all([
        fetchProjects(),
        fetchAnalytics(),
        fetchDistricts()
      ]);
      setProjects(pData);
      setAnalytics(aData);
      setDistricts(dData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      const res = await loginRole(newRole);
      setCurrentUser(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenGrievanceForm = () => {
    setCurrentTab('grievances');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Bar Header adhering to Top Bar Contract without orange banner */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenAssistantModal={() => setIsAssistantOpen(true)}
        onOpenGrievanceForm={handleOpenGrievanceForm}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <HomeSection
            analytics={analytics}
            projects={projects}
            onNavigateToTab={setCurrentTab}
            onSelectProject={setSelectedProjectId}
            onOpenGrievanceForm={handleOpenGrievanceForm}
          />
        )}

        {currentTab === 'my_complaints' && (
          <MyComplaintsSection
            currentUser={currentUser}
            onOpenReportForm={handleOpenGrievanceForm}
            onSelectComplaintForTracking={(id) => {
              setInitialGrievanceTrackId(id);
              setCurrentTab('grievances');
            }}
          />
        )}

        {currentTab === 'funds' && (
          <FundExplorerSection
            onSelectProject={setSelectedProjectId}
            onOpenReportModal={setReportProjectId}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsSection
            projects={projects}
            onSelectProject={setSelectedProjectId}
            onOpenReportModal={setReportProjectId}
            currentUserRole={currentUser.role}
            onOpenCreateProjectModal={() => setIsCreateProjectOpen(true)}
          />
        )}

        {currentTab === 'monitoring' && (
          <AiMonitoringSection
            onSelectProject={setSelectedProjectId}
          />
        )}

        {currentTab === 'map' && (
          <VillageMapSection
            onSelectProject={setSelectedProjectId}
            onOpenGrievanceForm={handleOpenGrievanceForm}
          />
        )}

        {currentTab === 'waste' && (
          <WasteManagementSection
            districts={districts}
            currentUserRole={currentUser.role}
          />
        )}

        {currentTab === 'pollution' && (
          <PollutionMonitoringSection
            districts={districts}
            currentUserRole={currentUser.role}
          />
        )}

        {currentTab === 'schools' && (
          <SchoolMaintenanceSection
            currentUserRole={currentUser.role}
          />
        )}

        {currentTab === 'hospitals' && (
          <HospitalMaintenanceSection
            currentUserRole={currentUser.role}
          />
        )}

        {currentTab === 'needs' && (
          <CitizenVoiceSection
            currentUserRole={currentUser.role}
          />
        )}

        {currentTab === 'grievances' && (
          <GrievancesSection
            currentUserRole={currentUser.role}
            initialTrackId={initialGrievanceTrackId}
            onNavigateToMyComplaints={() => setCurrentTab('my_complaints')}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsSection
            onSelectProject={setSelectedProjectId}
          />
        )}

        {currentTab === 'dashboards' && (
          <RoleDashboardsSection
            currentUser={currentUser}
            onSelectRole={handleRoleChange}
            onSelectProject={setSelectedProjectId}
            onNavigateToTab={setCurrentTab}
            onOpenGrievanceForm={handleOpenGrievanceForm}
            onOpenReportModal={setReportProjectId}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <ProjectDetailModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onOpenReportModal={(id) => {
          setSelectedProjectId(null);
          setReportProjectId(id);
        }}
        currentUserRole={currentUser.role}
        onProjectUpdated={loadAllData}
      />

      <ProjectTransparencyReportModal
        projectId={reportProjectId}
        onClose={() => setReportProjectId(null)}
      />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectRole={handleRoleChange}
      />

      <MultilingualAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        districts={districts}
        onProjectCreated={loadAllData}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserLoggedIn={(u) => {
          setCurrentUser(u);
        }}
        currentUser={currentUser}
      />

      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />

    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
