import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  resume: {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      profileImage: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: 'modern'
  },
  atsScore: {
    score: 0,
    suggestions: [],
    keywords: []
  },
  isGenerating: false,
  skillsDescription: ''
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('resumeState');
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const resumeReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      newState = {
        ...state,
        resume: {
          ...state.resume,
          personalInfo: { ...state.resume.personalInfo, ...action.payload }
        }
      };
      break;
    case 'UPDATE_SUMMARY':
      newState = {
        ...state,
        resume: { ...state.resume, summary: action.payload }
      };
      break;
    case 'UPDATE_EXPERIENCE':
      newState = {
        ...state,
        resume: { ...state.resume, experience: action.payload }
      };
      break;
    case 'UPDATE_EDUCATION':
      newState = {
        ...state,
        resume: { ...state.resume, education: action.payload }
      };
      break;
    case 'UPDATE_SKILLS':
      newState = {
        ...state,
        resume: { ...state.resume, skills: action.payload }
      };
      break;
    case 'UPDATE_PROJECTS':
      newState = {
        ...state,
        resume: { ...state.resume, projects: action.payload }
      };
      break;
    case 'UPDATE_TEMPLATE':
      newState = {
        ...state,
        resume: { ...state.resume, template: action.payload }
      };
      break;
    case 'UPDATE_ATS_SCORE':
      newState = {
        ...state,
        atsScore: action.payload
      };
      break;
    case 'SET_GENERATING':
      newState = {
        ...state,
        isGenerating: action.payload
      };
      break;
    case 'UPDATE_SKILLS_DESCRIPTION':
      newState = {
        ...state,
        skillsDescription: action.payload
      };
      break;
    case 'GENERATE_RESUME':
      newState = {
        ...state,
        resume: { 
          ...state.resume, 
          ...action.payload,
          projects: action.payload.projects || state.resume.projects
        }
      };
      break;
    case 'RESET_RESUME':
      newState = initialState;
      break;
    default:
      return state;
  }

  localStorage.setItem('resumeState', JSON.stringify(newState));
  return newState;
};

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, loadState());

  useEffect(() => {
    localStorage.setItem('resumeState', JSON.stringify(state));
  }, [state]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};