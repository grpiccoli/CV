import './main.scss';
import { Timeline } from './Timeline';

/**
 * Initializes the toggle logic for the print menu.
 */
const togglePrintMenu = (): void => {
  const printToggle = document.getElementById('print-toggle');
  const printMenu = document.getElementById('print-menu');
  if (!printToggle || !printMenu) return;

  printToggle.addEventListener('click', (): void => {
    const display = printMenu.style.display;
    printMenu.style.display = (!display || display === 'none') ? 'block' : 'none';
  });
};

/**
 * Initializes the section toggles.
 * Each checkbox is wired to show or hide its associated section.
 */
const initSectionToggles = (): void => {
  const sections: Record<string, HTMLElement | null> = {
    'toggle-about': document.getElementById('about'),
    'toggle-experience': document.getElementById('experience'),
    'toggle-certifications': document.getElementById('certifications'),
    'toggle-education': document.getElementById('education'),
    'toggle-academic': document.getElementById('academic-experience'),
    'toggle-publications': document.getElementById('publications'),
    'toggle-references': document.getElementById('references')
  };

  Object.keys(sections).forEach((toggleId) => {
    const checkbox = document.getElementById(toggleId) as HTMLInputElement | null;
    const sectionElement = sections[toggleId];
    if (checkbox && sectionElement) {
      checkbox.addEventListener('change', function (): void {
        sectionElement.style.display = this.checked ? '' : 'none';
      });
    }
  });
};

/**
 * Initializes the navigation toggle logic.
 */
const initNavigationToggle = (): void => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (): void => {
      navMenu.classList.toggle('open');
    });
  }
};

/**
 * Applies timeline logic to each selected timeline container.
 * Uses the Timeline class for encapsulation.
 */
const initTimelines = (): void => {
  document.querySelectorAll<HTMLElement>("#experience, #academic-experience").forEach((element) => {
    new Timeline(element);
  });
};

/**
 * Main initialization on DOM content loaded.
 */
const init = (): void => {
    togglePrintMenu();
    initSectionToggles();
    initNavigationToggle();
    initTimelines();
};

document.addEventListener('DOMContentLoaded', init);