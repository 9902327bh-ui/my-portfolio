/**
 * main.js
 * Portfolio entry point. Orchestrates Three.js scene, GSAP ScrollTrigger,
 * accessible modal, and section UI interactions.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OceanScene } from "./scene.js";
import { initSections } from "./sections.js";
import { projectModal } from "./modal.js";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Initialize Accessible Modal
  projectModal.init();

  // 2. Initialize Three.js 3D Ocean Scene
  const canvasContainer = document.getElementById("canvas-container");
  let oceanScene = null;
  if (canvasContainer) {
    oceanScene = new OceanScene(canvasContainer);
  }

  // 3. Initialize Section rendering & UI hooks
  initSections(oceanScene);

  // 4. Connect GSAP ScrollTrigger to 3D Scene camera & depth
  if (oceanScene) {
    ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        oceanScene.updateScroll(self.progress);
      }
    });
  }

  // 5. Soft gentle reveals for glass cards and sections
  if (!isReducedMotion) {
    // Reveal section headers
    gsap.utils.toArray(".section-header").forEach(header => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 35,
        duration: 0.9,
        ease: "power2.out"
      });
    });

    // Reveal glass cards with soft staggered float-up
    gsap.utils.toArray(".glass-card").forEach(card => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }

  // 6. Dismiss loading screen with a tranquil wave fade
  const loader = document.getElementById("loader");
  if (loader) {
    const hideLoader = () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.inOut",
        onComplete: () => {
          loader.style.display = "none";
          // Trigger gentle entrance for hero content
          gsap.from(".hero-content > *", {
            opacity: 0,
            y: 25,
            stagger: 0.12,
            duration: 1,
            ease: "power2.out"
          });
        }
      });
    };

    // Hide loader when window is fully ready or fallback after 1.2s
    if (document.readyState === "complete") {
      setTimeout(hideLoader, 400);
    } else {
      window.addEventListener("load", () => {
        setTimeout(hideLoader, 400);
      });
      // Safety fallback in case of delayed font/resource fetch
      setTimeout(hideLoader, 2500);
    }
  }
});
