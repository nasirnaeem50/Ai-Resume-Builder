import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import { useAIGeneration } from '../../hooks/useAIGeneration.js';
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  Search,
  BarChart3
} from 'lucide-react';

const ATSSection = () => {
  const { state } = useResume();
  const { optimizeForATS } = useAIGeneration();
  const [jobDescription, setJobDescription] = useState('');

  const handleOptimize = async () => {
    if (jobDescription.trim()) {
      await optimizeForATS(jobDescription);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">ATS Optimization</h2>
        </div>
        <p className="text-gray-600">
          Optimize your resume to pass through Applicant Tracking Systems (ATS) and reach human recruiters.
        </p>
      </div>

      {/* Current ATS Score */}
      {state.atsScore.score > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Your ATS Score
            </h3>
            <div className={`px-4 py-2 rounded-full ${getScoreBgColor(state.atsScore.score)}`}>
              <span className={`text-lg font-bold ${getScoreColor(state.atsScore.score)}`}>
                {state.atsScore.score}/100
              </span>
              <span className={`text-sm ml-2 ${getScoreColor(state.atsScore.score)}`}>
                {getScoreLabel(state.atsScore.score)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  state.atsScore.score >= 80 ? 'bg-green-500' :
                  state.atsScore.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${state.atsScore.score}%` }}
              ></div>
            </div>
          </div>

          {/* Suggestions */}
          {state.atsScore.suggestions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                Optimization Suggestions
              </h4>
              <ul className="space-y-2">
                {state.atsScore.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          {state.atsScore.keywords.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Search className="h-4 w-4 mr-2 text-purple-500" />
                Recommended Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {state.atsScore.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Job Description Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Optimize for Specific Job
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Paste the job description here to get personalized ATS optimization suggestions..."
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={state.isGenerating || !jobDescription.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {state.isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Target className="h-5 w-5" />
                <span>Analyze & Optimize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ATS Tips */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Optimization Tips</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Use Standard Headings</h4>
                <p className="text-sm text-gray-600">Stick to common section headers like "Experience", "Education", "Skills"</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Include Relevant Keywords</h4>
                <p className="text-sm text-gray-600">Mirror language from job descriptions but avoid keyword stuffing</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Use Simple Formatting</h4>
                <p className="text-sm text-gray-600">Avoid complex graphics, tables, or unusual fonts that ATS can't read</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Quantify Achievements</h4>
                <p className="text-sm text-gray-600">Include numbers, percentages, and metrics to show impact</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Use Standard File Format</h4>
                <p className="text-sm text-gray-600">Save as PDF or Word document for best compatibility</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Include Contact Information</h4>
                <p className="text-sm text-gray-600">Make sure your phone and email are easily findable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSSection;