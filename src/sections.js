/**
 * sections.js
 * Renders portfolio content dynamically from portfolioData.js,
 * manages interactive UI states (copy email, contact form mailto, depth markers,
 * audio toggle button, project card hover/click synchronization).
 */

import { profileData, skillsData, projectsData, timelineData } from "./data/portfolioData.js";
import { projectModal } from "./modal.js";
import { oceanAudio } from "./audio.js";

export function initSections(sceneInstance) {
  renderHero();
  renderSkills();
  renderProjects(sceneInstance);
  renderTimeline();
  setupContactFeatures();
  setupDepthTracker();
  setupAudioToggle();
  setupSmoothScroll();
  setupMobileNav();
}

function renderHero() {
  const chipsContainer = document.getElementById("hero-focus-chips");
  if (!chipsContainer) return;

  chipsContainer.innerHTML = "";
  profileData.focusAreas.forEach(area => {
    const chip = document.createElement("span");
    chip.className = "focus-chip";
    chip.innerHTML = `<span class="chip-dot"></span>${area}`;
    chipsContainer.appendChild(chip);
  });
}

function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = "";

  skillsData.forEach(cat => {
    const groupCard = document.createElement("div");
    groupCard.className = "glass-card skill-group-card";

    const title = document.createElement("h3");
    title.className = "skill-group-title";
    title.textContent = cat.category;

    const desc = document.createElement("p");
    desc.className = "skill-group-desc";
    desc.textContent = cat.description;

    const chipsWrapper = document.createElement("div");
    chipsWrapper.className = "skill-chips-wrapper";

    cat.skills.forEach(skill => {
      const bubble = document.createElement("div");
      bubble.className = "skill-bubble";
      bubble.setAttribute("tabindex", "0");
      bubble.setAttribute("role", "listitem");
      bubble.innerHTML = `
        <span class="bubble-glow"></span>
        <span class="bubble-text">${skill}</span>
      `;
      chipsWrapper.appendChild(bubble);
    });

    groupCard.appendChild(title);
    groupCard.appendChild(desc);
    groupCard.appendChild(chipsWrapper);
    container.appendChild(groupCard);
  });
}

function renderProjects(sceneInstance) {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  container.innerHTML = "";

  projectsData.forEach(project => {
    const card = document.createElement("article");
    card.className = "glass-card project-card";
    card.dataset.projectId = project.id;
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Inspect ${project.title} project details`);

    const depthBadge = document.createElement("div");
    depthBadge.className = "card-depth-badge";
    depthBadge.innerHTML = `<span class="orb-indicator" style="background: ${project.orbColor}; box-shadow: 0 0 10px ${project.orbColor}"></span>${project.depth}`;

    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title;

    const subtitle = document.createElement("p");
    subtitle.className = "project-subtitle";
    subtitle.textContent = project.subtitle;

    const desc = document.createElement("p");
    desc.className = "project-description";
    desc.textContent = project.description;

    const techWrap = document.createElement("div");
    techWrap.className = "project-tech-tags";
    project.tech.forEach(t => {
      const tag = document.createElement("span");
      tag.className = "tech-tag";
      tag.textContent = t;
      techWrap.appendChild(tag);
    });

    const actions = document.createElement("div");
    actions.className = "project-card-actions";

    const viewDetailsBtn = document.createElement("button");
    viewDetailsBtn.type = "button";
    viewDetailsBtn.className = "btn btn-primary btn-sm";
    viewDetailsBtn.innerHTML = `
      <span>Inspect Details</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    `;

    const fallbackGithub = profileData.socialLinks.github || "https://github.com/9902327bh-ui";
    const repoUrl = (project.github && project.github.trim()) ? project.github.trim() : fallbackGithub;
    githubLink.href = repoUrl;
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";
    githubLink.className = "btn btn-glass btn-sm";
    githubLink.setAttribute("aria-label", `View ${project.title} on GitHub`);
    githubLink.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
      <span>GitHub</span>
    `;

    // Prevent clicking github button from triggering card modal
    githubLink.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    actions.appendChild(viewDetailsBtn);
    actions.appendChild(githubLink);

    card.appendChild(depthBadge);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(desc);
    card.appendChild(techWrap);
    card.appendChild(actions);

    // Click on card or view details opens modal
    const openCardModal = () => {
      projectModal.open(project.id);
    };

    card.addEventListener("click", openCardModal);
    viewDetailsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openCardModal();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCardModal();
      }
    });

    // Hover sync with 3D scene orb
    if (sceneInstance) {
      card.addEventListener("pointerenter", () => {
        sceneInstance.highlightOrbById(project.id);
      });
      card.addEventListener("pointerleave", () => {
        sceneInstance.highlightOrbById(null);
      });
    }

    container.appendChild(card);
  });
}

function renderTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container) return;

  container.innerHTML = "";

  timelineData.forEach((item, index) => {
    const entry = document.createElement("div");
    entry.className = "timeline-item";

    entry.innerHTML = `
      <div class="timeline-marker">
        <span class="timeline-dot"></span>
        <span class="timeline-depth-label">${index % 2 === 0 ? "DEPTH 60m" : "DEPTH 85m"}</span>
      </div>
      <div class="timeline-content glass-card">
        <div class="timeline-header">
          <span class="timeline-category-tag">${item.category}</span>
          <span class="timeline-period">${item.period}</span>
        </div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-institution">${item.institution}</p>
        <div class="timeline-highlight">
          <span class="highlight-badge">${item.highlight}</span>
        </div>
        <p class="timeline-details">${item.details}</p>
      </div>
    `;

    container.appendChild(entry);
  });
}

function setupContactFeatures() {
  // Copy email button
  const copyBtn = document.getElementById("copy-email-btn");
  const emailVal = profileData.socialLinks.email;

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(emailVal);
        const originalContent = copyBtn.innerHTML;
        copyBtn.classList.add("copied");
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Copied!</span>
        `;
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.innerHTML = originalContent;
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = emailVal;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        copyBtn.innerHTML = "<span>Copied!</span>";
        setTimeout(() => {
          copyBtn.innerHTML = `<span>Copy Email</span>`;
        }, 2000);
      }
    });
  }

  // Contact Form Mailto Handler
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-feedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.elements["name"]?.value.trim();
      const email = contactForm.elements["email"]?.value.trim();
      const subject = contactForm.elements["subject"]?.value.trim() || `Portfolio Inquiry from ${name}`;
      const message = contactForm.elements["message"]?.value.trim();

      if (!name || !email || !message) {
        alert("Please fill in all required fields (Name, Email, and Message).");
        return;
      }

      // Build mailto URI
      const bodyText = `Hello Bharath,\n\n${message}\n\nBest regards,\n${name}\nContact: ${email}`;
      const mailtoUrl = `mailto:${encodeURIComponent(profileData.socialLinks.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      // Open mail client
      window.location.href = mailtoUrl;

      // Show friendly confirmation
      if (formSuccess) {
        formSuccess.classList.add("active");
        formSuccess.textContent = "Your email client is opening. Thank you for reaching out!";
        setTimeout(() => {
          formSuccess.classList.remove("active");
        }, 6000);
      }

      contactForm.reset();
    });
  }
}

function setupDepthTracker() {
  const depthDisplay = document.getElementById("current-depth-badge");
  const depthMeterFill = document.getElementById("depth-meter-fill");
  const depthGaugeValue = document.getElementById("depth-gauge-val");

  const markers = [
    { threshold: 0.00, text: "SURFACE // 0 m", depthInt: 0 },
    { threshold: 0.20, text: "SHALLOWS // 10 m", depthInt: 10 },
    { threshold: 0.45, text: "REEF // 30 m", depthInt: 30 },
    { threshold: 0.70, text: "DEEP // 60 m", depthInt: 60 },
    { threshold: 0.90, text: "SEABED // 100 m", depthInt: 100 },
  ];

  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    // Approximate depth in meters
    const currentMeters = Math.round(clampedProgress * 100);

    let activeMarker = markers[0];
    for (let i = 0; i < markers.length; i++) {
      if (clampedProgress >= markers[i].threshold) {
        activeMarker = markers[i];
      }
    }

    if (depthDisplay) {
      depthDisplay.textContent = activeMarker.text;
    }

    if (depthGaugeValue) {
      depthGaugeValue.textContent = `${currentMeters} m`;
    }

    if (depthMeterFill) {
      depthMeterFill.style.height = `${clampedProgress * 100}%`;
    }
  }, { passive: true });
}

function setupAudioToggle() {
  const audioBtn = document.getElementById("audio-toggle-btn");
  if (!audioBtn) return;

  const audioIcon = audioBtn.querySelector(".audio-icon");
  const audioLabel = audioBtn.querySelector(".audio-label");

  audioBtn.addEventListener("click", async () => {
    const isPlaying = await oceanAudio.toggle();
    if (isPlaying) {
      audioBtn.classList.add("playing");
      audioBtn.setAttribute("aria-pressed", "true");
      if (audioLabel) audioLabel.textContent = "Ocean Sound: On";
    } else {
      audioBtn.classList.remove("playing");
      audioBtn.setAttribute("aria-pressed", "false");
      if (audioLabel) audioLabel.textContent = "Ocean Sound: Off";
    }
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function setupMobileNav() {
  const navToggle = document.getElementById("mobile-nav-toggle");
  const navLinks = document.getElementById("navbar-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("open");
    });

    // Close nav on click of link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
      });
    });
  }
}
