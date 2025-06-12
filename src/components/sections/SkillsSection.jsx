import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import { Plus, Award, Tag, Trash2, Star } from 'lucide-react';

const skillCategories = [
  'Technical',
  'Programming',
  'Design',
  'Marketing',
  'Management',
  'Communication',
  'Languages',
  'Other'
];

const skillLevels = [
  { value: 'Beginner', label: 'Beginner', stars: 1 },
  { value: 'Intermediate', label: 'Intermediate', stars: 2 },
  { value: 'Advanced', label: 'Advanced', stars: 3 },
  { value: 'Expert', label: 'Expert', stars: 4 }
];

const SkillsSection = () => {
  const { state, dispatch } = useResume();
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate',
    category: 'Technical'
  });

  const handleAddSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      ...formData
    };
    
    dispatch({
      type: 'UPDATE_SKILLS',
      payload: [...state.resume.skills, newSkill]
    });
    
    setFormData({
      name: '',
      level: 'Intermediate',
      category: 'Technical'
    });
  };

  const handleDeleteSkill = (id) => {
    dispatch({
      type: 'UPDATE_SKILLS',
      payload: state.resume.skills.filter(skill => skill.id !== id)
    });
  };

  const groupedSkills = state.resume.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const renderStars = (level) => {
    const skillLevel = skillLevels.find(l => l.value === level);
    const stars = skillLevel ? skillLevel.stars : 2;
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-800',
      'Programming': 'bg-purple-100 text-purple-800',
      'Design': 'bg-pink-100 text-pink-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Management': 'bg-indigo-100 text-indigo-800',
      'Communication': 'bg-orange-100 text-orange-800',
      'Languages': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">Showcase your technical and soft skills with proficiency levels</p>
      </div>

      {/* Skills Display */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-purple-600" />
                {category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{skill.name}</h4>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{skill.level}</span>
                      {renderStars(skill.level)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-purple-600" />
          Add New Skill
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., JavaScript, Project Management"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {skillCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level *
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {skillLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddSkill}
          disabled={!formData.name.trim()}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-900 mb-2">💡 Skill Tips</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Be honest about your skill levels - employers value authenticity</li>
            <li>• Focus on skills relevant to your target job</li>
            <li>• Include both technical and soft skills for a well-rounded profile</li>
            <li>• Consider adding certifications or years of experience in descriptions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;