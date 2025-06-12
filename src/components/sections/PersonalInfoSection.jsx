import React from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import ProfileImage from '../ProfileImage';

const PersonalInfoSection = () => {
  const { state, dispatch } = useResume();
  const { personalInfo } = state.resume;

  const handleInputChange = (field, value) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { [field]: value }
    });
  };

  const inputFields = [
    { key: 'fullName', label: 'Full Name', icon: User, type: 'text', required: true },
    { key: 'email', label: 'Email', icon: Mail, type: 'email', required: true },
    { key: 'phone', label: 'Phone', icon: Phone, type: 'tel', required: true },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text', required: true },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, type: 'url', required: false },
    { key: 'website', label: 'Website', icon: Globe, type: 'url', required: false }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {/* Profile Image Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <ProfileImage size="large" editable={true} />
            <p className="text-sm text-gray-500 text-center">
              Click image to upload or edit<br />
              Recommended size: 500×500px
            </p>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map((field) => {
                const Icon = field.icon;
                
                return (
                  <div key={field.key} className="space-y-2">
                    <label className="flex items-baseline gap-2 text-sm font-medium text-gray-700">
                      <div className="flex items-center h-4">
                        <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <span>{field.label}</span>
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={personalInfo[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-blue-700">
            {personalInfo.profileImage ? (
              <>
                A professional profile photo can increase profile views by 14x!<br />
                Make sure your photo is clear, well-lit, and shows only you.
              </>
            ) : (
              <>
                Adding a professional profile photo can increase response rates by 21%.<br />
                Use a clear headshot with a neutral background for best results.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;