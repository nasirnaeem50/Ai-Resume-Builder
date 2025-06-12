import React, { useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Upload, User, X, Link, Image as ImageIcon } from 'lucide-react';

const ProfileImage = ({ size = 'medium', editable = false }) => {
  const { state, dispatch } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  };

  const borderClasses = {
    small: 'border-2',
    medium: 'border-3',
    large: 'border-4',
    xlarge: 'border-4'
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateProfileImage(event.target.result);
      setUploadError('');
      setIsEditing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    // Basic URL validation
    if (!imageUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
      setUploadError('Please enter a valid image URL');
      return;
    }

    updateProfileImage(imageUrl);
    setIsEditing(false);
    setUploadError('');
  };

  const updateProfileImage = (image) => {
    dispatch({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { profileImage: image }
    });
  };

  const removeImage = () => {
    updateProfileImage('');
    setIsEditing(false);
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {state.resume.personalInfo.profileImage ? (
        <>
          <img
            src={state.resume.personalInfo.profileImage}
            alt="Profile"
            className={`rounded-full object-cover w-full h-full ${borderClasses[size]} border-white shadow-md ${
              editable ? 'cursor-pointer hover:opacity-90' : ''
            }`}
            onClick={() => editable && setIsEditing(true)}
          />
          {editable && (
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </>
      ) : (
        <div
          className={`bg-gray-200 rounded-full flex items-center justify-center text-gray-400 w-full h-full ${
            editable ? 'cursor-pointer hover:bg-gray-300' : ''
          }`}
          onClick={() => editable && setIsEditing(true)}
        >
          <User className="h-8 w-8" />
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Update Profile Image</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload from device</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <form onSubmit={handleUrlSubmit}>
                  <label className="block text-sm font-medium mb-2">Or enter image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/profile.jpg"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Link className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
              
              {uploadError && (
                <div className="text-red-500 text-sm mt-2">{uploadError}</div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsEditing(false);
                  setUploadError('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;