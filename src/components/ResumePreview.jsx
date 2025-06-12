import React, { useState, useMemo } from "react";
import { useResume } from "../context/ResumeContext";
import { Download, Loader2, Trash2 } from "lucide-react";
import ProfileImage from "./ProfileImage";
import { templates } from "./sections/TemplateSection";

const ResumePreview = () => {
  const { state, dispatch } = useResume();
  const { resume } = state;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const currentTemplate = useMemo(() => {
    return templates.find((t) => t.id === resume.template) || templates[0];
  }, [resume.template]);

  const styles = useMemo(() => {
    const convertColor = (colorArray) => {
      if (!colorArray || !Array.isArray(colorArray)) return colorArray;
      return `rgb(${colorArray.join(",")})`;
    };

    const headerBackground =
      convertColor(currentTemplate.headerColor) || "rgb(29, 78, 216)";
    const accentText =
      convertColor(currentTemplate.accentColor) || "rgb(29, 78, 216)";
    const borderLeft = `4px solid ${
      convertColor(currentTemplate.borderColor) || "rgb(59, 130, 246)"
    }`;

    return {
      container: "bg-white shadow-lg rounded-lg overflow-hidden",
      header: `p-8 text-white`,
      headerBackground,
      section: `border-l-4 pl-4`,
      borderLeft,
      accent: `font-medium`,
      accentText,
      profileImage: `border-4 border-white shadow-md rounded-full`,
    };
  }, [currentTemplate]);

  const shouldShowProfileImage = () => {
    return currentTemplate.hasProfileImage && resume.personalInfo.profileImage;
  };

  const getHeaderLayoutClass = () => {
    switch (currentTemplate.profileImagePosition) {
      case "header-left":
        return "flex-row";
      case "header-right":
        return "flex-row-reverse";
      case "header-center":
        return "flex-col items-center text-center";
      case "aside":
        return "flex-row";
      default:
        return "flex-row";
    }
  };

  const getProfileImageSize = () => {
    switch (currentTemplate.profileImagePosition) {
      case "header-center":
        return "large";
      case "aside":
        return "xlarge";
      default:
        return "medium";
    }
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const { jsPDF } = await import("jspdf");
      const html2canvas = await import("html2canvas");

      const element = document.getElementById("resume-preview");
      
      // Create a clone for PDF generation with fixed dimensions
      const clonedElement = element.cloneNode(true);
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.width = "210mm"; // A4 width
      clonedElement.style.height = "auto";
      clonedElement.style.fontSize = "12px"; // Base font size
      document.body.appendChild(clonedElement);

      // Function to convert oklch to rgb
      const convertOklchToRgb = (oklchValue) => {
        // Fallback to black if we can't convert
        if (!oklchValue.includes("oklch")) return oklchValue;
        return "rgb(0, 0, 0)"; // Default fallback
      };

      // Adjust styles for PDF
      const elements = clonedElement.querySelectorAll("*");
      elements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        
        // Fix color formats
        if (styles.color.includes("oklch")) {
          el.style.color = convertOklchToRgb(styles.color);
        }
        if (styles.backgroundColor.includes("oklch")) {
          el.style.backgroundColor = convertOklchToRgb(styles.backgroundColor);
        }
        if (styles.borderColor.includes("oklch")) {
          el.style.borderColor = convertOklchToRgb(styles.borderColor);
        }
        
        // Fix viewport units
        if (styles.fontSize.includes("vw") || styles.fontSize.includes("vh")) {
          el.style.fontSize = "12px";
        }
        
        // Fix relative units
        if (styles.fontSize.includes("rem")) {
          const remValue = parseFloat(styles.fontSize);
          el.style.fontSize = `${remValue * 16}px`; // Convert rem to px
        }

        // Ensure all text is visible and not clipped
        el.style.whiteSpace = "normal";
        el.style.overflow = "visible";
      });

      // Set a fixed width and scale for the PDF
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const scale = 2; // Higher scale for better quality

      const canvas = await html2canvas.default(clonedElement, {
        scale: scale,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: clonedElement.offsetWidth,
        windowWidth: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
      });

      document.body.removeChild(clonedElement);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calculate image dimensions to fit the PDF page
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add first page with the entire content
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      // Only add new pages if content exceeds one page
      const pageHeight = pdfHeight;
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight;
        let position = 0;
        
        // Add content to subsequent pages
        while (heightLeft > 0) {
          position = pageHeight - heightLeft;
          pdf.addPage();
          // Add the remaining part of the image to the new page
          pdf.addImage(
            imgData,
            "PNG",
            0,
            -position,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
          );
          heightLeft -= pageHeight;
        }
      }

      pdf.setProperties({
        title: `${resume.personalInfo.fullName || "Resume"} - ${resume.template} Template`,
        subject: "Professional Resume",
        author: resume.personalInfo.fullName || "",
      });

      pdf.save(`${resume.personalInfo.fullName || "resume"}_${new Date().toISOString().slice(0, 10)}.pdf`);
      showNotification("Resume downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      showNotification("Failed to generate PDF. Please try again.", "error");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleClearResume = () => {
    if (window.confirm("Are you sure you want to clear your resume? This action cannot be undone.")) {
      dispatch({ type: "RESET_RESUME" });
      showNotification("Resume has been cleared successfully.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Resume Preview - {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)} Template
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleClearResume}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Clear Resume"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Resume</span>
          </button>
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isGeneratingPDF
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            aria-label="Download PDF"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div id="resume-preview" className={`max-w-4xl mx-auto ${styles.container}`} style={{ fontSize: '1rem' }}>
          {/* Header Section */}
          <div className={`${styles.header} flex justify-between items-center`} style={{ backgroundColor: styles.headerBackground }}>
            <div className="flex items-center">
              {shouldShowProfileImage() && currentTemplate.profileImagePosition !== "aside" && (
                <div className="shrink-0">
                  <ProfileImage size={getProfileImageSize()} editable={false} />
                </div>
              )}
              <div className="flex-1 ml-4">
                <h1 className="text-3xl font-bold mb-2">
                  {resume.personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  {resume.personalInfo.email && (
                    <div className="flex items-center">
                      <a href={`mailto:${resume.personalInfo.email}`} aria-label="Email">
                        {resume.personalInfo.email}
                      </a>
                    </div>
                  )}
                  {resume.personalInfo.phone && (
                    <div className="flex items-center">
                      <a href={`tel:${resume.personalInfo.phone}`} aria-label="Phone">
                        {resume.personalInfo.phone}
                      </a>
                    </div>
                  )}
                  {resume.personalInfo.location && (
                    <div className="flex items-center">
                      <span>{resume.personalInfo.location}</span>
                    </div>
                  )}
                  {resume.personalInfo.linkedin && (
                    <div className="flex items-center">
                      <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {resume.personalInfo.website && (
                    <div className="flex items-center">
                      <a href={resume.personalInfo.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* Aside Profile Image */}
            {shouldShowProfileImage() && currentTemplate.profileImagePosition === "aside" && (
              <div className="w-1/4 p-6 flex flex-col items-center">
                <ProfileImage size="xlarge" editable={false} />
              </div>
            )}

            <div className={`p-6 md:p-8 space-y-8 ${shouldShowProfileImage() && currentTemplate.profileImagePosition === "aside" ? "w-3/4" : "w-full"}`}>
              {/* Summary Section */}
              {resume.summary && (
                <section>
                  <h2 className={`text-xl font-bold mb-3 pb-2 ${styles.section}`} style={{ borderLeft: styles.borderLeft, color: styles.accentText }}>
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
                </section>
              )}

              {/* Experience Section */}
              {resume.experience.length > 0 && (
                <section>
                  <h2 className={`text-xl font-bold mb-4 pb-2 ${styles.section}`} style={{ borderLeft: styles.borderLeft, color: styles.accentText }}>
                    Professional Experience
                  </h2>
                  <div className="space-y-6">
                    {resume.experience.map((exp) => (
                      <div key={exp.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                            <p className="font-medium" style={{ color: styles.accentText }}>{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                          </div>
                        </div>

                        {exp.description && (
                          <p className="text-gray-700 mb-3">{exp.description}</p>
                        )}
                        
                        {exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside text-gray-700 space-y-1.5">
                            {exp.achievements.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Section */}
              {resume.projects?.length > 0 && (
                <section>
                  <h2 className={`text-xl font-bold mb-4 pb-2 ${styles.section}`} style={{ borderLeft: styles.borderLeft, color: styles.accentText }}>
                    Projects
                  </h2>
                  <div className="space-y-6">
                    {resume.projects.map((project) => (
                      <div key={project.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium" 
                                style={{ color: styles.accentText }}
                              >
                                View Project
                              </a>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span>{project.startDate} - {project.current ? "Present" : project.endDate}</span>
                          </div>
                        </div>

                        {project.description && (
                          <p className="text-gray-700 mb-3">{project.description}</p>
                        )}
                        
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {resume.education.length > 0 && (
                <section>
                  <h2 className={`text-xl font-bold mb-4 pb-2 ${styles.section}`} style={{ borderLeft: styles.borderLeft, color: styles.accentText }}>
                    Education
                  </h2>
                  <div className="space-y-4">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-700">{edu.field}</p>
                          <p className="text-sm font-medium" style={{ color: styles.accentText }}>{edu.institution}</p>
                        </div>
                        <div className="mt-1 sm:mt-0 text-sm text-gray-500">
                          <p>Graduated: {edu.graduationDate}</p>
                          {edu.gpa && <p>GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills Section */}
              {resume.skills.length > 0 && (
                <section>
                  <h2 className={`text-xl font-bold mb-4 pb-2 ${styles.section}`} style={{ borderLeft: styles.borderLeft, color: styles.accentText }}>
                    Skills
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(resume.skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {})).map(([category, skills]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="font-medium text-gray-900">{category}</h3>
                        <div className="space-y-1.5">
                          {skills.map((skill) => (
                            <div key={skill.id} className="flex justify-between items-center">
                              <span className="text-gray-700">{skill.name}</span>
                              <div className="text-sm text-gray-500">
                                {skill.level}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;