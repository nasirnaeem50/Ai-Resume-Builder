import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Palette, Check, ArrowRight, Info, Sparkles, LayoutTemplate } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with subtle colors',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    color: 'border-blue-500',
    bestFor: ['Tech', 'Startups', 'Digital Roles'],
    icon: '💻',
    hasProfileImage: true,
    profileImagePosition: 'header-right'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout',
    preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
    color: 'border-gray-500',
    bestFor: ['Finance', 'Law', 'Government'],
    icon: '👔',
    hasProfileImage: false
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and eye-catching for creative roles',
    preview: 'bg-gradient-to-br from-purple-50 to-pink-100',
    color: 'border-purple-500',
    bestFor: ['Design', 'Marketing', 'Art'],
    icon: '🎨',
    hasProfileImage: true,
    profileImagePosition: 'header-center'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for leadership roles',
    preview: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    color: 'border-emerald-500',
    bestFor: ['Management', 'C-Level', 'Consulting'],
    icon: '👔',
    hasProfileImage: true,
    profileImagePosition: 'aside'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean with maximum whitespace',
    preview: 'bg-gradient-to-br from-white to-gray-50',
    color: 'border-gray-300',
    bestFor: ['Academic', 'Research', 'Writing'],
    icon: '📝',
    hasProfileImage: false
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-contrast with strong typography',
    preview: 'bg-gradient-to-br from-rose-50 to-orange-100',
    color: 'border-rose-500',
    bestFor: ['Sales', 'Entrepreneurs', 'Public Speakers'],
    icon: '🔊',
    hasProfileImage: true,
    profileImagePosition: 'header-left'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Balanced design for all industries',
    preview: 'bg-gradient-to-br from-slate-50 to-slate-100',
    color: 'border-slate-500',
    bestFor: ['Business', 'Consulting', 'Corporate'],
    icon: '💼',
    hasProfileImage: true,
    profileImagePosition: 'header-right'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Structured layout for technical professionals',
    preview: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    color: 'border-cyan-500',
    bestFor: ['Engineering', 'IT', 'Science'],
    icon: '🔧',
    hasProfileImage: true,
    profileImagePosition: 'aside'
  }
];

const TemplateSection = () => {
  const { state, dispatch } = useResume();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = selectedIndustry
    ? templates.filter(template => template.bestFor.includes(selectedIndustry))
    : templates;

  const handleTemplateChange = (templateId) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: templateId });
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const allIndustries = [...new Set(templates.flatMap(t => t.bestFor))];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
            <LayoutTemplate className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Template Designer</h2>
            <p className="text-gray-600 max-w-2xl">
              Select the perfect template for your resume. Our AI analyzes your content and recommends the best layout for your industry.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span>Industry-Specific Recommendations</span>
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedIndustry(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !selectedIndustry
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Templates
          </button>
          
          {allIndustries.map(industry => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedIndustry === industry
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`relative group bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-200 hover:shadow-md ${
              state.resume.template === template.id
                ? template.color + ' shadow-lg border-2'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {state.resume.template === template.id && (
              <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1.5 z-10">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <div 
              className={`h-40 rounded-t-xl ${template.preview} flex items-center justify-center cursor-pointer`}
              onClick={() => handlePreview(template)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{template.icon}</div>
                <div className="text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded-full">
                  Click to preview
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                <button
                  onClick={() => handleTemplateChange(template.id)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    state.resume.template === template.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {state.resume.template === template.id ? 'Selected' : 'Select'}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="flex items-center text-xs text-gray-500">
                <Info className="h-3 w-3 mr-1" />
                <span>Best for: {template.bestFor.join(', ')}</span>
              </div>
              {template.hasProfileImage && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Profile Image Supported
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Preview: {previewTemplate.name} Template</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className={`h-64 rounded-lg ${previewTemplate.preview} flex items-center justify-center mb-6`}>
                <div className="text-center">
                  <Palette className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <div className="text-lg font-medium text-gray-700">Template Preview</div>
                  {previewTemplate.hasProfileImage && (
                    <div className="mt-2 text-sm text-gray-600">
                      Profile image position: {previewTemplate.profileImagePosition}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Template Features</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Modern, clean layout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Optimized for ATS systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Responsive design</span>
                    </li>
                    {previewTemplate.hasProfileImage && (
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Profile image support</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.bestFor.map(industry => (
                      <span key={industry} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleTemplateChange(previewTemplate.id);
                    setShowPreview(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  Use This Template <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Choose the Right Template</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                <Info className="h-4 w-4" />
              </span>
              Industry Standards
            </h4>
            <p className="text-sm text-blue-700">
              Conservative fields like law and finance prefer classic designs, while creative industries appreciate more personality.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="bg-purple-100 p-1.5 rounded-lg text-purple-600">
                <Info className="h-4 w-4" />
              </span>
              Applicant Tracking Systems
            </h4>
            <p className="text-sm text-purple-700">
              All our templates are optimized for ATS readability with proper heading structures and clean formatting.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <span className="bg-green-100 p-1.5 rounded-lg text-green-600">
                <Info className="h-4 w-4" />
              </span>
              Content First
            </h4>
            <p className="text-sm text-green-700">
              The best template enhances your content without distracting from it. When in doubt, choose simpler designs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
 

};
 export { templates };


export default TemplateSection;