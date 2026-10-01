/**
 * modal.js
 * Accessible modal controller using native <dialog> element.
 * Handles keyboard focus trapping, Escape dismissal, backdrop click, and focus restoration.
 */

import { projectsData } from "./data/projects.js";
import { profileData } from "./data/portfolioData.js";

class ProjectModal {
  constructor() {
    this.dialog = null;
    this.closeBtn = null;
    this.titleEl = null;
    this.subtitleEl = null;
    this.depthEl = null;
    this.descEl = null;
    this.featuresListEl = null;
    this.techContainerEl = null;
    this.githubBtn = null;
    this.previouslyFocused = null;
  }

  init() {
    this.dialog = document.getElementById("project-modal");
    if (!this.dialog) return;

    this.closeBtn = this.dialog.querySelector(".modal-close-btn");
    this.titleEl = this.dialog.querySelector("#modal-title");
    this.subtitleEl = this.dialog.querySelector("#modal-subtitle");
    this.depthEl = this.dialog.querySelector("#modal-depth");
    this.descEl = this.dialog.querySelector("#modal-description");
    this.featuresListEl = this.dialog.querySelector("#modal-features");
    this.techContainerEl = this.dialog.querySelector("#modal-tech-chips");
    this.githubBtn = this.dialog.querySelector("#modal-github-link");

    // Close on button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    // Close on backdrop click (click directly on dialog element background)
    this.dialog.addEventListener("click", (e) => {
      const rect = this.dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        this.close();
      }
    });

    // Native cancel event (triggered by Escape in dialog)
    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.close();
    });

    // Keyboard handlers: explicit Escape key and Focus Trap
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.close();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = this.dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          el => !el.hasAttribute("disabled") && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !this.dialog.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !this.dialog.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  open(projectId) {
    if (!this.dialog) this.init();
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    this.previouslyFocused = document.activeElement;

    // Populate data
    if (this.titleEl) this.titleEl.textContent = project.title;
    if (this.subtitleEl) this.subtitleEl.textContent = project.subtitle;
    if (this.depthEl) this.depthEl.textContent = project.depth || "REEF // 30 m";
    if (this.descEl) this.descEl.textContent = project.description;

    if (this.featuresListEl) {
      this.featuresListEl.innerHTML = "";
      (project.keyFeatures || []).forEach(feature => {
        const li = document.createElement("li");
        li.textContent = feature;
        this.featuresListEl.appendChild(li);
      });
    }

    if (this.techContainerEl) {
      this.techContainerEl.innerHTML = "";
      (project.tech || []).forEach(t => {
        const chip = document.createElement("span");
        chip.className = "tech-chip";
        chip.textContent = t;
        this.techContainerEl.appendChild(chip);
      });
    }

    // Individual repo link with profile fallback
    const fallbackGithub = (profileData && profileData.socialLinks && profileData.socialLinks.github) || "https://github.com/9902327bh-ui";
    const repoUrl = (project.github && project.github.trim()) ? project.github.trim() : fallbackGithub;
    if (this.githubBtn) {
      this.githubBtn.href = repoUrl;
    }

    // Open dialog modal
    if (typeof this.dialog.showModal === "function") {
      this.dialog.showModal();
    } else {
      this.dialog.setAttribute("open", "");
    }

    document.body.classList.add("modal-open");

    // Focus close button initially
    setTimeout(() => {
      if (this.closeBtn) {
        this.closeBtn.focus();
      }
    }, 50);
  }

  close() {
    if (!this.dialog) return;

    if (typeof this.dialog.close === "function") {
      this.dialog.close();
    } else {
      this.dialog.removeAttribute("open");
    }

    document.body.classList.remove("modal-open");

    // Restore focus to previously focused trigger element
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === "function") {
      this.previouslyFocused.focus();
    }
  }
}

export const projectModal = new ProjectModal();
