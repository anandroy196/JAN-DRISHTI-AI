export type Language = 'en' | 'hi' | 'pa';

export interface Translations {
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  exploreFunds: string;
  reportProblem: string;
  navHome: string;
  navMyComplaints: string;
  navFunds: string;
  navProjects: string;
  navMonitoring: string;
  navWaste: string;
  navPollution: string;
  navSchools: string;
  navHospitals: string;
  navMap: string;
  navGrievances: string;
  navNeeds: string;
  navAnalytics: string;
  navRoleConsole: string;
  aiAssistant: string;
  statTotalSanctioned: string;
  statFundsReleased: string;
  statRecordedSpent: string;
  statDeliveries: string;
  statActiveProjects: string;
  statAuditScore: string;
  statusOngoing: string;
  statusCompleted: string;
  statusDelayed: string;
  filterAll: string;
  searchPlaceholder: string;
  details: string;
  close: string;
  save: string;
  submit: string;
  languageSelectTitle: string;
  languageSelectSub: string;
  login: string;
  register: string;
  logout: string;
  confidentialComplaint: string;
  wasteManaged: string;
  wasteUnmanaged: string;
  wasteScheduled: string;
  aqiLevel: string;
  weeklySchoolInspection: string;
  weeklyHospitalInspection: string;

  // Dedicated My Complaints & Tracking keys
  myComplaintsTitle: string;
  myComplaintsSubtitle: string;
  trackComplaint: string;
  noComplaintsFound: string;
  noComplaintsSub: string;
  referenceId: string;
  submissionDate: string;
  lastUpdated: string;
  currentStatus: string;
  assignedDepartment: string;
  actionTaken: string;
  viewTimeline: string;
  feedback: string;
  submitFeedback: string;
  loading: string;
  tryAgain: string;
  copyReferenceId: string;
  idCopied: string;

  // Status Codes
  statusSubmitted: string;
  statusReceived: string;
  statusUnderReview: string;
  statusAssigned: string;
  statusInProgress: string;
  statusResolved: string;
  statusRejected: string;
  statusReopened: string;
  statusEscalated: string;

  // Form Fields
  complaintTitleLabel: string;
  complaintCategoryLabel: string;
  complaintDescLabel: string;
  complaintDistrictLabel: string;
  complaintBlockLabel: string;
  complaintPanchayatLabel: string;
  complaintPhotoLabel: string;
  complaintGpsLabel: string;
  complaintNameLabel: string;
  complaintPhoneLabel: string;
  submittingComplaint: string;
  complaintSuccessTitle: string;
  complaintSuccessMsg: string;

  // Roles
  roleCitizen: string;
  roleOfficial: string;
  roleAdmin: string;
  roleSuperadmin: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'JanDrishti AI',
    tagline: 'Every Rupee Accountable. Every Citizen Empowered.',
    heroHeadline: 'Your Voice. Your Village. Your Development.',
    heroSubtext: 'Explore public development projects, understand recorded expenditure, monitor waste, pollution, schools & hospitals, and track citizen grievances in real-time.',
    exploreFunds: 'Explore Public Funds',
    reportProblem: 'Report a Problem',
    navHome: 'Home',
    navMyComplaints: 'My Complaints',
    navFunds: 'Fund Explorer',
    navProjects: 'Projects',
    navMonitoring: 'AI Vision Lab',
    navWaste: 'Waste Management',
    navPollution: 'Pollution Monitor',
    navSchools: 'Schools Audit',
    navHospitals: 'Hospital Maintenance',
    navMap: 'Village Map',
    navGrievances: 'Grievance Portal',
    navNeeds: 'Citizen Voice',
    navAnalytics: 'Analytics',
    navRoleConsole: 'Role Console',
    aiAssistant: 'AI Assistant',
    statTotalSanctioned: 'Total Sanctioned Outlay',
    statFundsReleased: 'Funds Released to Works',
    statRecordedSpent: 'Recorded Voucher Expenditure',
    statDeliveries: 'Active Works',
    statActiveProjects: 'Active Rural Works',
    statAuditScore: 'Data Completeness',
    statusOngoing: 'Ongoing',
    statusCompleted: 'Completed',
    statusDelayed: 'Delayed',
    filterAll: 'All Categories',
    searchPlaceholder: 'Search scheme, code, village, or grievance ID...',
    details: 'View Details',
    close: 'Close',
    save: 'Save Record',
    submit: 'Submit Grievance',
    languageSelectTitle: 'Choose Your Preferred Language',
    languageSelectSub: 'Select language for citizen navigation, forms, and official alerts.',
    login: 'Sign In',
    register: 'Citizen Register',
    logout: 'Sign Out',
    confidentialComplaint: 'Mark as Confidential Report (Anti-Misconduct)',
    wasteManaged: 'Managed & Verified',
    wasteUnmanaged: 'Unmanaged / Overdue',
    wasteScheduled: 'Collection Scheduled',
    aqiLevel: 'Air Quality Index',
    weeklySchoolInspection: 'Weekly School Maintenance Status',
    weeklyHospitalInspection: 'Healthcare Facility Infrastructure Status',

    myComplaintsTitle: 'My Reported Grievances',
    myComplaintsSubtitle: 'Track real-time progress and official actions on problems you have reported.',
    trackComplaint: 'Track Complaint',
    noComplaintsFound: 'No Complaints Found',
    noComplaintsSub: 'You have not submitted any complaints yet or no records match your filter.',
    referenceId: 'Reference ID',
    submissionDate: 'Submitted On',
    lastUpdated: 'Last Updated',
    currentStatus: 'Current Status',
    assignedDepartment: 'Assigned Department',
    actionTaken: 'Latest Official Action',
    viewTimeline: 'View Timeline & Tracking',
    feedback: 'Citizen Feedback & Rating',
    submitFeedback: 'Submit Review',
    loading: 'Loading data...',
    tryAgain: 'Try Again',
    copyReferenceId: 'Copy Reference ID',
    idCopied: 'Copied to clipboard!',

    statusSubmitted: 'Submitted',
    statusReceived: 'Received',
    statusUnderReview: 'Under Review',
    statusAssigned: 'Department Assigned',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusRejected: 'Rejected',
    statusReopened: 'Reopened',
    statusEscalated: 'Escalated',

    complaintTitleLabel: 'Issue Title / Short Summary',
    complaintCategoryLabel: 'Category',
    complaintDescLabel: 'Detailed Description & Landmark',
    complaintDistrictLabel: 'District',
    complaintBlockLabel: 'Block / Tehsil',
    complaintPanchayatLabel: 'Gram Panchayat / Locality',
    complaintPhotoLabel: 'Upload Site Photograph',
    complaintGpsLabel: 'Geo-Coordinates (GPS)',
    complaintNameLabel: 'Your Full Name',
    complaintPhoneLabel: 'Your Mobile Contact',
    submittingComplaint: 'Submitting and verifying grievance...',
    complaintSuccessTitle: 'Grievance Registered Successfully',
    complaintSuccessMsg: 'Your report has been saved to the database. Use your reference ID to track lifecycle progress.',

    roleCitizen: 'Citizen',
    roleOfficial: 'Gram Pradhan / Official',
    roleAdmin: 'BDO / District Admin',
    roleSuperadmin: 'State SuperAdmin'
  },
  hi: {
    appName: 'जनदृष्टि AI',
    tagline: 'हर रुपया जवाबदेह। हर नागरिक सशक्त।',
    heroHeadline: 'आपकी आवाज। आपका गांव। आपका विकास।',
    heroSubtext: 'सार्वजनिक विकास कार्यों की जांच करें, सरकारी व्यय समझें, कचरा, प्रदूषण, स्कूल और अस्पताल रखरखाव की निगरानी करें और अपनी शिकायतों की स्थिति रियल-टाइम देखें।',
    exploreFunds: 'सरकारी फंड देखें',
    reportProblem: 'समस्या की शिकायत करें',
    navHome: 'होम',
    navMyComplaints: 'मेरी शिकायतें',
    navFunds: 'फंड एक्सप्लोरर',
    navProjects: 'परियोजनाएं',
    navMonitoring: 'AI दृष्टि लैब',
    navWaste: 'कचरा प्रबंधन',
    navPollution: 'प्रदूषण निगरानी',
    navSchools: 'विद्यालय ऑडिट',
    navHospitals: 'अस्पताल रखरखाव',
    navMap: 'स्मार्ट ग्राम मैप',
    navGrievances: 'शिकायत पोर्टल',
    navNeeds: 'नागरिक आवाज',
    navAnalytics: 'विश्लेषण',
    navRoleConsole: 'प्रशासनिक कंसोल',
    aiAssistant: 'AI सहायक',
    statTotalSanctioned: 'कुल स्वीकृत विकास निधि',
    statFundsReleased: 'जारी की गई धनराशि',
    statRecordedSpent: 'दर्ज किया गया खर्च',
    statDeliveries: 'सक्रिय कार्य',
    statActiveProjects: 'सक्रिय ग्रामीण परियोजनाएं',
    statAuditScore: 'डेटा पूर्णता स्कोर',
    statusOngoing: 'प्रगति पर',
    statusCompleted: 'पूर्ण',
    statusDelayed: 'विलंबित',
    filterAll: 'सभी श्रेणियां',
    searchPlaceholder: 'योजना, कोड, गांव या शिकायत संख्या खोजें...',
    details: 'विवरण देखें',
    close: 'बंद करें',
    save: 'रिकॉर्ड सहेजें',
    submit: 'शिकायत जमा करें',
    languageSelectTitle: 'अपनी पसंदीदा भाषा चुनें',
    languageSelectSub: 'नागरिक नेविगेशन, फॉर्म और सरकारी अलर्ट के लिए भाषा चुनें।',
    login: 'लॉग इन',
    register: 'नागरिक पंजीकरण',
    logout: 'लॉग आउट',
    confidentialComplaint: 'गोपनीय रिपोर्ट (भ्रष्टाचार / कदाचार विरोधी)',
    wasteManaged: 'प्रबंधित एवं सत्यापित',
    wasteUnmanaged: 'अप्रबंधित / लंबित',
    wasteScheduled: 'उठाव निर्धारित',
    aqiLevel: 'वायु गुणवत्ता सूचकांक (AQI)',
    weeklySchoolInspection: 'साप्ताहिक स्कूल रखरखाव स्थिति',
    weeklyHospitalInspection: 'स्वास्थ्य सुविधा अधोसंरचना स्थिति',

    myComplaintsTitle: 'मेरी दर्ज की गई शिकायतें',
    myComplaintsSubtitle: 'आपके द्वारा दर्ज की गई समस्याओं और उन पर प्रशासनिक कार्रवाई की स्थिति देखें।',
    trackComplaint: 'शिकायत की स्थिति देखें',
    noComplaintsFound: 'कोई शिकायत नहीं मिली',
    noComplaintsSub: 'आपने अभी तक कोई शिकायत दर्ज नहीं की है या फ़िल्टर के अनुसार कोई परिणाम नहीं है।',
    referenceId: 'शिकायत संदर्भ संख्या',
    submissionDate: 'दर्ज करने की तिथि',
    lastUpdated: 'अंतिम अपडेट',
    currentStatus: 'वर्तमान स्थिति',
    assignedDepartment: 'जिम्मेदार विभाग',
    actionTaken: 'नवीनतम प्रशासनिक कार्रवाई',
    viewTimeline: 'प्रगति एवं टाइमलाइन देखें',
    feedback: 'नागरिक प्रतिक्रिया एवं रेटिंग',
    submitFeedback: 'समीक्षा जमा करें',
    loading: 'डेटा लोड हो रहा है...',
    tryAgain: 'फिर से प्रयास करें',
    copyReferenceId: 'आईडी कॉपी करें',
    idCopied: 'कॉपी हो गया!',

    statusSubmitted: 'दर्ज की गई',
    statusReceived: 'प्राप्त हुई',
    statusUnderReview: 'समीक्षा जारी',
    statusAssigned: 'विभाग सौंपा गया',
    statusInProgress: 'कार्य प्रगति पर',
    statusResolved: 'समाधान हो गया',
    statusRejected: 'अस्वीकृत',
    statusReopened: 'दोबारा खोली गई',
    statusEscalated: 'उच्च स्तर पर प्रेषित',

    complaintTitleLabel: 'समस्या का शीर्षक / संक्षिप्त विवरण',
    complaintCategoryLabel: 'श्रेणी',
    complaintDescLabel: 'विस्तृत विवरण एवं पहचान स्थल',
    complaintDistrictLabel: 'ज़िला',
    complaintBlockLabel: 'ब्लॉक / तहसील',
    complaintPanchayatLabel: 'ग्राम पंचायत / मोहल्ला',
    complaintPhotoLabel: 'समस्या की फोटो संलग्न करें',
    complaintGpsLabel: 'स्थान निर्देशांक (GPS)',
    complaintNameLabel: 'आपका पूरा नाम',
    complaintPhoneLabel: 'मोबाइल नंबर',
    submittingComplaint: 'शिकायत दर्ज एवं सत्यापित की जा रही है...',
    complaintSuccessTitle: 'शिकायत सफलतापूर्वक दर्ज हुई',
    complaintSuccessMsg: 'आपकी शिकायत सुरक्षित कर ली गई है। संदर्भ संख्या सुरक्षित रखें।',

    roleCitizen: 'नागरिक',
    roleOfficial: 'ग्राम प्रधान / अधिकारी',
    roleAdmin: 'बीडीओ / ज़िला प्रशासक',
    roleSuperadmin: 'राज्य मुख्य प्रशासक'
  },
  pa: {
    appName: 'ਜਨਦ੍ਰਿਸ਼ਟੀ AI',
    tagline: 'ਹਰ ਰੁਪਈਆ ਜਵਾਬਦੇਹ। ਹਰ ਨਾਗਰਿਕ ਸਮਰੱਥ।',
    heroHeadline: 'ਤੁਹਾਡੀ ਆਵਾਜ਼। ਤੁਹਾਡਾ ਪਿੰਡ। ਤੁਹਾਡਾ ਵਿਕਾਸ।',
    heroSubtext: 'ਸਰਕਾਰੀ ਵਿਕਾਸ ਪ੍ਰੋਜੈਕਟਾਂ ਦੀ ਪੜਤਾਲ ਕਰੋ, ਖਰਚ ਹੋਏ ਫੰਡਾਂ ਦਾ ਹਿਸਾਬ ਸਮਝੋ, ਕੂੜਾ, ਪ੍ਰਦੂਸ਼ਣ, ਸਕੂਲ ਅਤੇ ਹਸਪਤਾਲ ਰੱਖ-ਰਖਾਵ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਆਪਣੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਸਥਿਤੀ ਦੇਖੋ।',
    exploreFunds: 'ਸਰਕਾਰੀ ਫੰਡ ਦੇਖੋ',
    reportProblem: 'ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ',
    navHome: 'ਮੁੱਖ ਪੰਨਾ',
    navMyComplaints: 'ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ',
    navFunds: 'ਫੰਡ ਐਕਸਪਲੋਰਰ',
    navProjects: 'ਪ੍ਰੋਜੈਕਟ',
    navMonitoring: 'AI ਵਿਜ਼ਨ ਲੈਬ',
    navWaste: 'ਕੂੜਾ ਪ੍ਰਬੰਧਨ',
    navPollution: 'ਪ੍ਰਦੂਸ਼ਣ ਨਿਗਰਾਨੀ',
    navSchools: 'ਸਕੂਲ ਆਡਿਟ',
    navHospitals: 'ਹਸਪਤਾਲ ਸੰਭਾਲ',
    navMap: 'ਪਿੰਡ ਦਾ ਨਕਸ਼ਾ',
    navGrievances: 'ਸ਼ਿਕਾਇਤ ਪੋਰਟਲ',
    navNeeds: 'ਨਾਗਰਿਕ ਆਵਾਜ਼',
    navAnalytics: 'ਵਿਸ਼ਲੇਸ਼ਣ',
    navRoleConsole: 'ਰੋਲ ਕੰਸੋਲ',
    aiAssistant: 'AI ਸਹਾਇਕ',
    statTotalSanctioned: 'ਕੁੱਲ ਮਨਜ਼ੂਰ ਫੰਡ',
    statFundsReleased: 'ਜਾਰੀ ਹੋਈ ਰਕਮ',
    statRecordedSpent: 'ਦਰਜ ਕੀਤਾ ਗਿਆ ਖਰਚਾ',
    statDeliveries: 'ਚੱਲ ਰਹੇ ਕੰਮ',
    statActiveProjects: 'ਸਰਗਰਮ ਪੇਂਡੂ ਪ੍ਰੋਜੈਕਟ',
    statAuditScore: 'ਆਡਿਟ ਪੂਰਨਤਾ ਸਕੋਰ',
    statusOngoing: 'ਚਾਲੂ',
    statusCompleted: 'ਸੰਪੰਨ',
    statusDelayed: 'ਦੇਰੀ ਨਾਲ',
    filterAll: 'ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ',
    searchPlaceholder: 'ਸਕੀਮ, ਕੋਡ, ਪਿੰਡ ਜਾਂ ਸ਼ਿਕਾਇਤ ਨੰਬਰ ਲੱਭੋ...',
    details: 'ਵੇਰਵਾ ਦੇਖੋ',
    close: 'ਬੰਦ ਕਰੋ',
    save: 'ਰਿਕਾਰਡ ਸੁਰੱਖਿਅਤ ਕਰੋ',
    submit: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    languageSelectTitle: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    languageSelectSub: 'ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ ਅਤੇ ਸਰਕਾਰੀ ਰਿਪੋਰਟਾਂ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ।',
    login: 'ਲਾਗ ਇਨ',
    register: 'ਨਾਗਰਿਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    logout: 'ਲਾਗ ਆਊਟ',
    confidentialComplaint: 'ਗੁਪਤ ਰਿਪੋਰਟ (ਭ੍ਰਿਸ਼ਟਾਚਾਰ ਵਿਰੋਧੀ)',
    wasteManaged: 'ਸੰਭਾਲਿਆ ਅਤੇ ਪ੍ਰਮਾਣਿਤ',
    wasteUnmanaged: 'ਬਿਨਾਂ ਸੰਭਾਲ / ਬਕਾਇਆ',
    wasteScheduled: 'ਚੁੱਕਣ ਦਾ ਸਮਾਂ ਨਿਰਧਾਰਿਤ',
    aqiLevel: 'ਹਵਾ ਗੁਣਵੱਤਾ ਸੂਚਕਾਂਕ (AQI)',
    weeklySchoolInspection: 'ਹਫਤਾਵਾਰੀ ਸਕੂਲ ਰੱਖ-ਰਖਾਵ ਸਥਿਤੀ',
    weeklyHospitalInspection: 'ਸਿਹਤ ਕੇਂਦਰ ਸੁਵਿਧਾ ਸਥਿਤੀ',

    myComplaintsTitle: 'ਮੇਰੀਆਂ ਦਰਜ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ',
    myComplaintsSubtitle: 'ਤੁਹਾਡੇ ਵੱਲੋਂ ਦਰਜ ਕੀਤੀਆਂ ਸਮੱਸਿਆਵਾਂ ਉੱਤੇ ਸਰਕਾਰੀ ਕਾਰਵਾਈ ਦੀ ਲਾਈਵ ਸਥਿਤੀ ਵੇਖੋ।',
    trackComplaint: 'ਸ਼ਿਕਾਇਤ ਦੀ ਸਥਿਤੀ ਦੇਖੋ',
    noComplaintsFound: 'ਕੋਈ ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ',
    noComplaintsSub: 'ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਕੋਈ ਸ਼ਿਕਾਇਤ ਦਰਜ ਨਹੀਂ ਕੀਤੀ ਹੈ।',
    referenceId: 'ਰੈਫਰੈਂਸ ਨੰਬਰ',
    submissionDate: 'ਦਰਜ ਕਰਨ ਦੀ ਮਿਤੀ',
    lastUpdated: 'ਆਖਰੀ ਅਪਡੇਟ',
    currentStatus: 'ਮੌਜੂਦਾ ਸਥਿਤੀ',
    assignedDepartment: 'ਜ਼ਿੰਮੇਵਾਰ ਵਿਭਾਗ',
    actionTaken: 'ਤਾਜ਼ਾ ਕਾਰਵਾਈ',
    viewTimeline: 'ਪ੍ਰਗਤੀ ਅਤੇ ਟਾਈਮਲਾਈਨ ਵੇਖੋ',
    feedback: 'ਨਾਗਰਿਕ ਪ੍ਰਤੀਕਿਰਿਆ',
    submitFeedback: 'ਪ੍ਰਤੀਕਿਰਿਆ ਦਰਜ ਕਰੋ',
    loading: 'ਡਾਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    tryAgain: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
    copyReferenceId: 'ਆਈਡੀ ਕਾਪੀ ਕਰੋ',
    idCopied: 'ਕਾਪੀ ਹੋ ਗਿਆ!',

    statusSubmitted: 'ਦਰਜ ਕੀਤੀ ਗਈ',
    statusReceived: 'ਪ੍ਰਾਪਤ ਹੋਈ',
    statusUnderReview: 'ਸਮੀਖਿਆ ਅਧੀਨ',
    statusAssigned: 'ਵਿਭਾਗ ਸੌਂਪਿਆ ਗਿਆ',
    statusInProgress: 'ਕੰਮ ਜਾਰੀ ਹੈ',
    statusResolved: 'ਹੱਲ ਹੋ ਗਿਆ',
    statusRejected: 'ਰੱਦ ਕੀਤੀ ਗਈ',
    statusReopened: 'ਮੁੜ ਖੋਲ੍ਹੀ ਗਈ',
    statusEscalated: 'ਅਗਾਂਹ ਭੇਜੀ ਗਈ',

    complaintTitleLabel: 'ਸਮੱਸਿਆ ਦਾ ਸਿਰਲੇਖ / ਸੰਖੇਪ ਵੇਰਵਾ',
    complaintCategoryLabel: 'ਸ਼੍ਰੇਣੀ',
    complaintDescLabel: 'ਪੂਰਾ ਵੇਰਵਾ ਅਤੇ ਨੇੜਲੀ ਥਾਂ',
    complaintDistrictLabel: 'ਜ਼ਿਲ੍ਹਾ',
    complaintBlockLabel: 'ਬਲਾਕ / ਤਹਿਸੀਲ',
    complaintPanchayatLabel: 'ਗ੍ਰਾਮ ਪੰਚਾਇਤ / ਇਲਾਕਾ',
    complaintPhotoLabel: 'ਸਮੱਸਿਆ ਦੀ ਫੋਟੋ ਲਗਾਓ',
    complaintGpsLabel: 'ਥਾਂ ਦੇ ਨਿਰਦੇਸ਼ਾਂਕ (GPS)',
    complaintNameLabel: 'ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਂ',
    complaintPhoneLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    submittingComplaint: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
    complaintSuccessTitle: 'ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਈ',
    complaintSuccessMsg: 'ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਹੋ ਗਈ ਹੈ। ਸਥਿਤੀ ਜਾਂਚ ਲਈ ਰੈਫਰੈਂਸ ਨੰਬਰ ਸੰਭਾਲ ਕੇ ਰੱਖੋ।',

    roleCitizen: 'ਨਾਗਰਿਕ',
    roleOfficial: 'ਸਰਪੰਚ / ਅਧਿਕਾਰੀ',
    roleAdmin: 'ਬੀਡੀਓ / ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਸ਼ਾਸਕ',
    roleSuperadmin: 'ਮੁੱਖ ਰਾਜ ਪ੍ਰਸ਼ਾਸਕ'
  }
};
