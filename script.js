/* =========================================================================
   1. DEBUGGING & INITIALIZATION
   ========================================================================= */

// Verifies that the external file has successfully loaded into the DOM
console.log('script.js loaded');


/* =========================================================================
   2. HORIZONTAL TAB NAVIGATION ENGINE
   ========================================================================= */

/**
 * Handles showing, hiding, toggling, and switching between navigation tabs.
 * @param {string} sectionId - The ID of the content panel to show or toggle.
 */
function showTab(sectionId) {
  // Select target elements and state flags
  const clickedSection = document.getElementById(sectionId);
  const isAlreadyActive = clickedSection.classList.contains('active');
  const allSections = document.querySelectorAll('.tab-contents .content-panel');
  const allTabHeadings = document.querySelectorAll('.tabs h2');

  // SCENARIO A: User clicked an already open tab (Toggles it shut)
  if (isAlreadyActive) {
    // Clear active highlight states from all navigation tabs immediately
    allTabHeadings.forEach(heading => heading.classList.remove('active-tab'));
    
    // Inject CSS closing animation styles into the wrapper
    clickedSection.classList.add('fade-out');
    
    // Halt engine execution for 300ms to allow CSS transitions to finish painting
    setTimeout(() => {
      clickedSection.classList.remove('active', 'fade-out');
    }, 300);
  } 
  
  // SCENARIO B: User clicked a different tab (Switches panels or opens fresh)
  else {
    // Hard reset all layout panels by scrubbing open classes and animation states
    allSections.forEach(x => x.classList.remove('active', 'fade-out'));
    allTabHeadings.forEach(heading => heading.classList.remove('active-tab'));
    
    // Mount the target dashboard panel visually inside the grid layout
    clickedSection.classList.add('active');
    
    // Cycle through headings to locate the matching onclick trigger element
    allTabHeadings.forEach(heading => {
      if (heading.getAttribute('onclick') === `showTab('${sectionId}')`) {
        heading.classList.add('active-tab');
      }
    });

    // Lazy load the appropriate component dataset based on the current context
    if (sectionId === 'skills') {
      loadSkills();
    } else if (sectionId === 'projects') {
      loadProjects();
    }
  }
}


/* =========================================================================
   3. ASYNC DATA FETCH & RENDERING ENGINES
   ========================================================================= */

/**
 * Fetches skills data from JSON, splits items by category, and draws subheaders.
 */
function loadSkills() {
  const skillsList = document.querySelector('#skills ul');
  
  // Initialize dynamic fetch stream to external local repository data
  fetch('skills.json')
    .then(response => {
      if (!response.ok) throw new Error('Could not load skills data');
      return response.json();
    })
    .then(skillsArray => {
      // Clear out static loading elements or fallback layout markup strings
      skillsList.innerHTML = '';

      // Partition raw database objects cleanly into unique workspace categories
      const frontendSkills = skillsArray.filter(s => s.category === 'Frontend');
      const backendSkills = skillsArray.filter(s => s.category === 'Backend');

      // Internal layout factory helper to generate standardized dashed subheadings
      const createCategoryHeading = (titleText) => {
        const h3 = document.createElement('h3');
        h3.textContent = titleText;
        h3.className = 'skills-category-title';
        skillsList.appendChild(h3);
      };

      // Construct the Frontend segment block if array data objects exist
      if (frontendSkills.length > 0) {
        createCategoryHeading('Frontend');
        frontendSkills.forEach(skill => {
          const li = document.createElement('li');
          li.textContent = skill.name;
          skillsList.appendChild(li);
        });
      }

      // Construct the Backend segment block if array data objects exist
      if (backendSkills.length > 0) {
        createCategoryHeading('Backend');
        backendSkills.forEach(skill => {
          const li = document.createElement('li');
          li.textContent = skill.name;
          skillsList.appendChild(li);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      skillsList.innerHTML = '<li>Failed to load skills.</li>';
    });
}

/**
 * Fetches projects details from JSON and renders complex HTML layouts with dynamic tags.
 */
function loadProjects() {
  const projectsList = document.querySelector('#projects ul');
  
  // Initialize dynamic fetch stream to external local portfolio files
  fetch('projects.json')
    .then(response => {
      if (!response.ok) throw new Error('Could not load projects data');
      return response.json();
    })
    .then(projectsArray => {
      // Clear placeholder texts before rendering fresh project rows
      projectsList.innerHTML = '';

      // Build out row layout frameworks loop-by-loop
      projectsArray.forEach(project => {
        const li = document.createElement('li');
        li.className = 'project-card-item';

        // Check if an array of development stack tags was provided
        let tagsString = '';
        if (project.tags && project.tags.length > 0) {
          // Construct inline parenthetical elements styled with emphasis rules
          tagsString = ` (<em>${project.tags.join(', ')}</em>)`;
        }

        // Build composite inner card text block structures using template literals
        li.innerHTML = `
          <div class="project-content-block">
            <a href="${project.link}" target="_blank" rel="noopener noreferrer">
              <strong>${project.title}</strong>
            </a>: ${project.description}${tagsString}
          </div>
        `;
        
        // Output fresh DOM branches into the project section layout container
        projectsList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error:', error);
      projectsList.innerHTML = '<li>Failed to load projects.</li>';
    });
}


/* =========================================================================
   4. UNIVERSAL CLIPBOARD UTILITY & FALLBACKS
   ========================================================================= */

/**
 * Reads the raw href property from an element and saves it cleanly to the clipboard.
 * @param {string} linkId - The target anchor link ID to parse.
 * @param {string} toastId - The notification wrapper element ID to toggle.
 */
function copyTextToClipboard(linkId, toastId) {
  const linkElement = document.getElementById(linkId);
  const toast = document.getElementById(toastId);

  // Extract the destination string directly out of the element attribute
  let textToCopy = linkElement.getAttribute('href');

  // Strip native electronic mail system routing protocol keywords if discovered
  if (textToCopy.startsWith('mailto:')) {
    textToCopy = textToCopy.replace('mailto:', '');
  }

  // Branch execution context depending on modern security clearance flags
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        flashToastNotification(toast);
      })
      .catch(err => {
        console.error('Modern copy failed, trying desktop fallback...', err);
        runFallbackCopy(textToCopy, toast);
      });
  } else {
    // Route execution down to legacy element injection pipelines
    runFallbackCopy(textToCopy, toast);
  }
}

/**
 * Executes a legacy textarea injection hack to copy strings on older browsers.
 * @param {string} textToCopy - The raw parsed text string.
 * @param {HTMLElement} toastElement - The alert notification element.
 */
function runFallbackCopy(textToCopy, toastElement) {
  // Build and position a text entry utility block entirely outside window boundaries
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  
  // Highlight content streams ready for native browser execution controls
  textArea.select();

  try {
    // Invoke deprecated document execution commands inside older engines
    const successful = document.execCommand('copy');
    if (successful) {
      flashToastNotification(toastElement);
    } else {
      console.error('Fallback copy command execution failed.');
    }
  } catch (err) {
    console.error('Fallback engine exception thrown:', err);
  }

  // Safely scrub temporary nodes out of memory spaces
  document.body.removeChild(textArea);
}

/**
 * Triggers a temporary success notification bubble.
 * @param {HTMLElement} toast - The target toast notification element.
 */
function flashToastNotification(toast) {
  // Flip transparency settings to render elements visible to the human eye
  toast.className = 'toast-visible';
  
  // Schedule a disappearance routine to run automatically after 2000 milliseconds
  setTimeout(() => {
    toast.className = 'toast-hidden';
  }, 2000);
}
