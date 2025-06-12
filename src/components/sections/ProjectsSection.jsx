import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectsSection = () => {
  const { state, dispatch } = useResume();
  const [expandedProject, setExpandedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    id: '',
    name: '',
    description: '',
    technologies: [],
    link: '',
    startDate: '',
    endDate: '',
    current: false
  });
  const [newTech, setNewTech] = useState('');

  // Ensure projects is always an array
  const projects = state.resume.projects || [];

  const handleAddProject = () => {
    const projectId = Date.now().toString();
    dispatch({
      type: 'UPDATE_PROJECTS',
      payload: [...projects, { ...newProject, id: projectId }]
    });
    setNewProject({
      id: '',
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
      current: false
    });
  };

  const handleUpdateProject = (project) => {
    dispatch({
      type: 'UPDATE_PROJECTS',
      payload: projects.map(p => 
        p.id === project.id ? project : p
      )
    });
    setExpandedProject(null);
  };

  const handleDeleteProject = (id) => {
    dispatch({
      type: 'UPDATE_PROJECTS',
      payload: projects.filter(p => p.id !== id)
    });
  };

  const handleAddTechnology = () => {
    if (newTech.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (tech) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter(t => t !== tech)
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
      <p className="text-gray-600">
        Showcase your portfolio projects to highlight your skills and experience.
      </p>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  {project.startDate} - {project.current ? 'Present' : project.endDate}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedProject === project.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {expandedProject === project.id && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => handleUpdateProject({
                        ...project,
                        name: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Link
                    </label>
                    <input
                      type="text"
                      value={project.link}
                      onChange={(e) => handleUpdateProject({
                        ...project,
                        link: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleUpdateProject({
                      ...project,
                      description: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={project.startDate}
                      onChange={(e) => handleUpdateProject({
                        ...project,
                        startDate: e.target.value
                      })}
                      className="w-full p-2 border rounded"
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={project.endDate}
                        onChange={(e) => handleUpdateProject({
                          ...project,
                          endDate: e.target.value,
                          current: false
                        })}
                        className="w-full p-2 border rounded"
                        placeholder="MM/YYYY"
                        disabled={project.current}
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={project.current}
                          onChange={(e) => handleUpdateProject({
                            ...project,
                            current: e.target.checked,
                            endDate: e.target.checked ? '' : project.endDate
                          })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Present</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Add New Project</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Link
              </label>
              <input
                type="text"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ 
                    ...newProject, 
                    endDate: e.target.value,
                    current: false
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="MM/YYYY"
                  disabled={newProject.current}
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newProject.current}
                    onChange={(e) => setNewProject({ 
                      ...newProject, 
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : newProject.endDate
                    })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Present</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newProject.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                className="flex-1 p-2 border rounded-l"
                placeholder="Add technology"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="px-3 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProject}
            disabled={!newProject.name}
            className={`flex items-center justify-center w-full py-2 px-4 rounded-lg ${!newProject.name ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            <Plus className="mr-2" size={18} />
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;