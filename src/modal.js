/**
 * modal.js
 * Accessible modal controller using native <dialog> element.
 * Handles keyboard trapping, escape dismissal, backdrop click, and focus restoration.
 */

import { projectsData } from "./data/portfolioData.js";

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

    // Close on backdrop click (click directly on dialog element)
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

    // Handle Escape key cleanly
    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.close();
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

    if (this.githubBtn) {
      this.githubBtn.href = project.github || "https://github.com/9902327bh-ui";
    }

    // Open dialog
    if (typeof this.dialog.showModal === "function") {
      this.dialog.showModal();
    } else {
      this.dialog.setAttribute("open", "");
    }

    document.body.classList.add("modal-open");
    if (this.closeBtn) {
      this.closeBtn.focus();
    }
  }

  close() {
    if (!this.dialog) return;

    if (typeof this.dialog.close === "function") {
      this.dialog.close();
    } else {
      this.dialog.removeAttribute("open");
    }

    document.body.classList.remove("modal-open");

    // Restore focus
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === "function") {
      this.previouslyFocused.focus();
    }
  }
}

export const projectModal = new ProjectModal();
