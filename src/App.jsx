import React, { useState } from 'react';
import { ResumeProvider } from './context/ResumeContext.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ResumePreview from './components/ResumePreview.jsx';
import PersonalInfoSection from './components/sections/PersonalInfoSection.jsx';
import AIGenerationSection from './components/sections/AIGenerationSection.jsx';
import SummarySection from './components/sections/SummarySection.jsx';
import ExperienceSection from './components/sections/ExperienceSection.jsx';
import EducationSection from './components/sections/EducationSection.jsx';
import SkillsSection from './components/sections/SkillsSection.jsx';
import ProjectsSection from './components/sections/ProjectsSection.jsx';
import TemplateSection from './components/sections/TemplateSection.jsx';
import ATSSection from './components/sections/ATSSection.jsx';

const sectionComponents = {
  personal: PersonalInfoSection,
  ai: AIGenerationSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  template: TemplateSection,
  ats: ATSSection
};

function App() {
  const [activeSection, setActiveSection] = useState('ai');

  const ActiveComponent = sectionComponents[activeSection] || AIGenerationSection;

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <div className="flex-1 flex">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <ActiveComponent />
            </div>
            
            {/* Resume Preview */}
            <div className="w-1/2 border-l border-gray-200">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
}

export default App;