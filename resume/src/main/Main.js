import React, { useState, useRef } from 'react';
import './Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faInfoCircle, faPen, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

function Main() {
  const [sections, setSections] = useState([
    { id: 1, title: 'Profile Summary', description: 'This section provides a summary of your profile.', enabled: true },
    { id: 2, title: 'Academic and Cocurricular Achievements', description: 'This section highlights your academic and cocurricular achievements.', enabled: true },
    { id: 3, title: 'Summer Internship Experience', description: 'This section showcases your summer internship experience.', enabled: true },
    { id: 4, title: 'Work Experience', description: 'This section displays your work experience.', enabled: true },
    { id: 5, title: 'Projects', description: 'This section showcases your projects.', enabled: true },
    { id: 6, title: 'Certifications', description: 'This section lists your certifications.', enabled: true },
    { id: 7, title: 'Leadership Positions', description: 'This section highlights your leadership positions.', enabled: true },
    { id: 8, title: 'Extracurricular', description: 'This section showcases your extracurricular activities.', enabled: true },
    { id: 9, title: 'Education', description: 'This section displays your education details.', enabled: true },
  ]);

  const [editedSection, setEditedSection] = useState(null);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [showDescription, setShowDescription] = useState(null);

  const dragItem = useRef(null);
  const dragNode = useRef(null);

  const handleDragStart = (e, section) => {
    dragItem.current = section;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      dragNode.current.classList.add('dragging');
    }, 0);
  };

  const handleDragEnter = (e, targetSection) => {
    const newSections = [...sections];
    const section = dragItem.current;
    const targetIndex = newSections.findIndex((item) => item.id === targetSection.id);
    newSections.splice(newSections.indexOf(section), 1);
    newSections.splice(targetIndex, 0, section);
    setSections(newSections);
  };

  const handleDragEnd = () => {
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
    document.querySelectorAll('.profile-section').forEach((node) => {
      node.classList.remove('dragging');
    });
  };

  const handleEditClick = (section) => {
    setEditedSection(section);
  };

  const handleNameChange = (e) => {
    const newSections = [...sections];
    const editedIndex = newSections.findIndex((item) => item.id === editedSection.id);
    newSections[editedIndex].title = e.target.value;
    setSections(newSections);
    setSaveEnabled(true);
  };

  const handleToggle = (section) => {
    const newSections = [...sections];
    const toggledIndex = newSections.findIndex((item) => item.id === section.id);
    newSections[toggledIndex].enabled = !newSections[toggledIndex].enabled;
    setSections(newSections);
    setSaveEnabled(true);
  };

  const handleInfoClick = (section) => {
    setShowDescription(section.id === showDescription ? null : section.id);
  };

  const handleSaveAndNext = () => {
    if (editedSection) {
      const currentSection = sections.find((section) => section.id === editedSection.id);
      if (currentSection) {
        handleInfoClick(currentSection);
      }
    }

    if (saveEnabled) {
      const newSections = [...sections];
      const editedIndex = newSections.findIndex((item) => item.id === editedSection.id);
      newSections[editedIndex].title = editedSection.title;
      setSections(newSections);
      setSaveEnabled(false);
    }

    setEditedSection(null);
  };

  return (
    <div>
      <h2>Select your sections</h2>
      <nav>
        {sections.map((section) => (
          <div
            key={section.id}
            className={`profile-section ${editedSection === section ? 'editing' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, section)}
            onDragEnter={(e) => handleDragEnter(e, section)}
          >
            <div className='icon-container'>
              <div className='drop'>
                <FontAwesomeIcon icon={faBars} />
              </div>
              <div
                className='info-icon'
                onClick={() => handleInfoClick(section)}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              {editedSection === section ? (
                <>
                  <input
                    type='text'
                    className='sections'
                    value={section.title}
                    onChange={handleNameChange}
                    autoFocus
                  />
                  <div className='edit' onClick={() => handleEditClick(section)}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                  <div className={`toggle-${section.enabled ? 'on' : 'off'}`} onClick={() => handleToggle(section)}>
                    <FontAwesomeIcon icon={section.enabled ? faToggleOn : faToggleOff} />
                  </div>
                  <div className='save' onClick={handleSaveAndNext}>
                    Save
                  </div>
                </>
              ) : (
                <>
                  <div className={`sections ${section.enabled ? '' : 'disabled'}`}>{section.title}</div>
                  <div className='edit' onClick={() => handleEditClick(section)}>
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                  <div className={`toggle-${section.enabled ? 'on' : 'off'}`} onClick={() => handleToggle(section)}>
                    <FontAwesomeIcon icon={section.enabled ? faToggleOn : faToggleOff} />
                  </div>
                </>
              )}
            </div>
            {section.id === showDescription && (
              <div className='description'>{section.description}</div>
            )}
          </div>
        ))}
        <div className={`save box ${saveEnabled ? '' : 'disabled'}`} onClick={handleSaveAndNext} disabled={!saveEnabled}>
          Save and Next
        </div>
      </nav>
    </div>
  );
}

export default Main;
