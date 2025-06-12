import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import { useAIGeneration } from '../../hooks/useAIGeneration.js';
import { Sparkles, Wand2, Target, ArrowRight } from 'lucide-react';

const AIGenerationSection = () => {
  const { state, dispatch } = useResume();
  const { generateFromDescription } = useAIGeneration();
  const [jobTitle, setJobTitle] = useState('');

  const handleGenerateResume = async () => {
    if (state.skillsDescription.trim()) {
      await generateFromDescription(state.skillsDescription, jobTitle);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">AI Resume Generator</h2>
        </div>
        <p className="text-gray-600">
          Describe your skills and experience in plain text, and our AI will generate a professional resume for you.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4 text-gray-400" />
              <span>Target Job Title (Optional)</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Frontend Developer, Marketing Manager, Data Analyst"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Wand2 className="h-4 w-4 text-gray-400" />
              <span>Describe Your Skills & Experience</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={state.skillsDescription}
              onChange={(e) => dispatch({ type: 'UPDATE_SKILLS_DESCRIPTION', payload: e.target.value })}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Tell us about your skills, experience, achievements, and what makes you unique. For example: 'I have 5 years of experience in web development using React and Node.js. I've led teams of 3-5 developers and successfully delivered 15+ projects. I'm passionate about creating user-friendly interfaces and have experience with agile methodologies...'"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Minimum 100 characters for better results
              </p>
              <span className="text-xs text-gray-400">
                {state.skillsDescription.length} characters
              </span>
            </div>
          </div>

          <button
            onClick={handleGenerateResume}
            disabled={state.isGenerating || state.skillsDescription.length < 50}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            {state.isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Your Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Resume with AI</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <h3 className="text-sm font-medium text-purple-900">Smart Analysis</h3>
            </div>
            <p className="text-xs text-purple-700">
              AI analyzes your description to identify key skills and experiences
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <h3 className="text-sm font-medium text-blue-900">Professional Format</h3>
            </div>
            <p className="text-xs text-blue-700">
              Automatically formats content into professional resume sections
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <h3 className="text-sm font-medium text-green-900">ATS Optimized</h3>
            </div>
            <p className="text-xs text-green-700">
              Ensures your resume passes through applicant tracking systems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerationSection;