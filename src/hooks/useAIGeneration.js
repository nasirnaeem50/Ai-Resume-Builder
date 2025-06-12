import { useCallback } from 'react';
import { useResume } from '../context/ResumeContext.jsx';

export const useAIGeneration = () => {
  const { dispatch } = useResume();

  const generateFromDescription = useCallback(async (description, jobTitle = '') => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    
    try {
      // Simulate AI generation (replace with actual OpenAI API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedResume = await mockAIGeneration(description, jobTitle);
      dispatch({ type: 'GENERATE_RESUME', payload: generatedResume });
      
      // Generate ATS score
      const atsScore = calculateATSScore(generatedResume);
      dispatch({ type: 'UPDATE_ATS_SCORE', payload: atsScore });
      
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  }, [dispatch]);

  const optimizeForATS = useCallback(async (jobDescription) => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    
    try {
      // Simulate ATS optimization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions = [
        'Add more relevant keywords from the job description',
        'Include quantifiable achievements with numbers',
        'Use action verbs to start bullet points',
        'Ensure consistent formatting throughout',
        'Include relevant technical skills'
      ];
      
      const keywords = extractKeywords(jobDescription);
      
      dispatch({ 
        type: 'UPDATE_ATS_SCORE', 
        payload: { 
          score: Math.floor(Math.random() * 30) + 70,
          suggestions,
          keywords
        }
      });
      
    } catch (error) {
      console.error('Error optimizing for ATS:', error);
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  }, [dispatch]);

  return {
    generateFromDescription,
    optimizeForATS
  };
};

// Mock AI generation function (replace with actual OpenAI API)
const mockAIGeneration = async (description, jobTitle) => {
  const skills = extractSkillsFromDescription(description);
  const experience = generateExperienceFromDescription(description, jobTitle);
  
  return {
    summary: `Experienced professional with expertise in ${skills.slice(0, 3).map(s => s.name).join(', ')}. Proven track record of delivering high-quality results and driving business growth. Passionate about leveraging technology to solve complex problems and create value.`,
    skills,
    experience
  };
};

const extractSkillsFromDescription = (description) => {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 'SQL',
    'Project Management', 'Communication', 'Leadership', 'Problem Solving',
    'Data Analysis', 'Marketing', 'Sales', 'Customer Service'
  ];
  
  const foundSkills = [];
  const words = description.toLowerCase().split(/\s+/);
  
  commonSkills.forEach((skill, index) => {
    if (words.some(word => word.includes(skill.toLowerCase()))) {
      foundSkills.push({
        id: `skill-${index}`,
        name: skill,
        level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][Math.floor(Math.random() * 4)],
        category: getCategoryForSkill(skill)
      });
    }
  });
  
  return foundSkills;
};

const getCategoryForSkill = (skill) => {
  const techSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'HTML', 'CSS', 'SQL'];
  const softSkills = ['Communication', 'Leadership', 'Problem Solving'];
  const businessSkills = ['Project Management', 'Marketing', 'Sales', 'Customer Service'];
  
  if (techSkills.includes(skill)) return 'Technical';
  if (softSkills.includes(skill)) return 'Soft Skills';
  if (businessSkills.includes(skill)) return 'Business';
  return 'Other';
};

const generateExperienceFromDescription = (description, jobTitle) => {
  return [{
    id: 'exp-1',
    company: 'Previous Company',
    position: jobTitle || 'Professional',
    startDate: '2022-01',
    endDate: '2024-01',
    current: false,
    description: 'Responsible for various tasks and responsibilities that align with the described experience.',
    achievements: [
      'Improved efficiency by implementing new processes',
      'Collaborated with cross-functional teams to deliver projects',
      'Mentored junior team members and provided guidance'
    ]
  }];
};

const calculateATSScore = (resume) => {
  let score = 60; // Base score
  
  if (resume.summary && resume.summary.length > 50) score += 10;
  if (resume.skills && resume.skills.length > 3) score += 10;
  if (resume.experience && resume.experience.length > 0) score += 15;
  
  return {
    score: Math.min(score, 95),
    suggestions: [
      'Add more quantifiable achievements',
      'Include relevant keywords from job descriptions',
      'Ensure consistent formatting'
    ],
    keywords: ['leadership', 'management', 'development', 'analysis', 'communication']
  };
};

const extractKeywords = (jobDescription) => {
  const keywords = ['leadership', 'management', 'development', 'analysis', 'communication', 'teamwork'];
  return keywords.filter(() => Math.random() > 0.5);
};