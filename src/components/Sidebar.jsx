import React from 'react';
import { useResume } from '../context/ResumeContext.jsx';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Palette,
  Target,
  Code2
} from 'lucide-react';

const sidebarSections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'projects', label: 'Projects', icon: Code2 },
  { id: 'template', label: 'Template', icon: Palette },
  { id: 'ats', label: 'ATS Score', icon: Target }
];

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { state } = useResume();
  
  const getSectionProgress = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return state.resume.personalInfo.fullName ? 100 : 0;
      case 'summary':
        return state.resume.summary ? 100 : 0;
      case 'experience':
        return state.resume.experience.length > 0 ? 100 : 0;
      case 'education':
        return state.resume.education.length > 0 ? 100 : 0;
      case 'skills':
        return state.resume.skills.length > 0 ? 100 : 0;
      case 'projects':
        return state.resume.projects?.length > 0 ? 100 : 0;
      case 'template':
        return 100;
      case 'ats':
        return state.atsScore.score > 0 ? 100 : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Build Your Resume</h2>
        
        <nav className="space-y-2">
          {sidebarSections.map((section) => {
            const Icon = section.icon;
            const progress = getSectionProgress(section.id);
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{section.label}</span>
                </div>
                
                {progress > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((sidebarSections.reduce((acc, section) => acc + getSectionProgress(section.id), 0) / sidebarSections.length))}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {Math.round((sidebarSections.reduce((acc, section) => acc + getSectionProgress(section.id), 0) / sidebarSections.length))}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;