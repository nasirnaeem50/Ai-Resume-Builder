import React from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import { FileText, Lightbulb } from 'lucide-react';

const SummarySection = () => {
  const { state, dispatch } = useResume();

  const handleSummaryChange = (value) => {
    dispatch({ type: 'UPDATE_SUMMARY', payload: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
        <p className="text-gray-600">Write a compelling summary that highlights your key strengths and career objectives</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-4">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span>Professional Summary</span>
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={state.resume.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Write a compelling 3-4 sentence summary that highlights your key strengths, experience, and career objectives. For example: 'Experienced software engineer with 5+ years of experience in full-stack development. Proven track record of leading cross-functional teams and delivering scalable solutions. Passionate about creating user-centric applications and driving innovation in fast-paced environments.'"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Recommended: 50-200 words
            </p>
            <span className="text-xs text-gray-400">
              {state.resume.summary.split(' ').filter(word => word.length > 0).length} words
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-medium text-indigo-900">What to Include</h3>
            </div>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Years of experience in your field</li>
              <li>• Key skills and areas of expertise</li>
              <li>• Notable achievements or results</li>
              <li>• Career goals and what you bring to employers</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Writing Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start with your job title or professional identity</li>
              <li>• Use action words and quantify achievements</li>
              <li>• Tailor to the specific job you're applying for</li>
              <li>• Keep it concise but impactful</li>
            </ul>
          </div>
        </div>

        {state.resume.summary.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Preview</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {state.resume.summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarySection;