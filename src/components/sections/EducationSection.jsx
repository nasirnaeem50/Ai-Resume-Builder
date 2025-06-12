import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import { Plus, GraduationCap, Calendar, School, Trash2, Edit3 } from 'lucide-react';

const EducationSection = () => {
  const { state, dispatch } = useResume();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    graduationDate: '',
    gpa: ''
  });

  const handleAddEducation = () => {
    const newEducation = {
      id: `edu-${Date.now()}`,
      ...formData
    };
    
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: [...state.resume.education, newEducation]
    });
    
    resetForm();
  };

  const handleUpdateEducation = () => {
    const updatedEducation = state.resume.education.map(edu =>
      edu.id === editingId ? { ...edu, ...formData } : edu
    );
    
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: updatedEducation
    });
    
    resetForm();
    setEditingId(null);
  };

  const handleDeleteEducation = (id) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: state.resume.education.filter(edu => edu.id !== id)
    });
  };

  const handleEditEducation = (education) => {
    setFormData(education);
    setEditingId(education.id);
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">Add your educational background and qualifications</p>
      </div>

      {/* Education List */}
      {state.resume.education.length > 0 && (
        <div className="space-y-4">
          {state.resume.education.map((edu) => (
            <div key={edu.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-green-600 font-medium">{edu.field}</p>
                  <p className="text-gray-700 flex items-center mt-1">
                    <School className="h-4 w-4 mr-1 text-gray-400" />
                    {edu.institution}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {edu.graduationDate}
                    </span>
                    {edu.gpa && (
                      <span>GPA: {edu.gpa}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEducation(edu)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
          {editingId ? 'Edit Education' : 'Add New Education'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution *
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Harvard University, MIT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree *
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Bachelor of Science, Master of Arts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field of Study *
            </label>
            <input
              type="text"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Computer Science, Business Administration"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Graduation Date *
            </label>
            <input
              type="month"
              value={formData.graduationDate}
              onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPA (Optional)
            </label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 3.8/4.0, 85%"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={editingId ? handleUpdateEducation : handleAddEducation}
            disabled={!formData.institution || !formData.degree || !formData.field || !formData.graduationDate}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {editingId ? 'Update Education' : 'Add Education'}
          </button>
          
          {editingId && (
            <button
              onClick={() => {
                resetForm();
                setEditingId(null);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-900 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-green-700">
            List your most recent and relevant education first. Include honors, relevant coursework, 
            or academic achievements if they're relevant to your target job.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;