declare const pdfMake: any;

const getMonthsDiff = (startDate: Date, endDate: Date) =>
  (endDate.getFullYear() - startDate.getFullYear()) * 12 +
  (endDate.getMonth() - startDate.getMonth());

const setLeft = (
  element: HTMLElement,
  startDate: Date,
  timelineMargin: number,
  timelineWidth: number,
  monthsDiff: number,
  isEnd: boolean
): number => {
  const dateStr = element.dataset.date;
  if (!dateStr) return 0;
  const elementDate = new Date(dateStr);
  const elementDiff = getMonthsDiff(startDate, elementDate);
  const elementLeft = timelineWidth * elementDiff / monthsDiff + (isEnd ? timelineMargin : 0);
  element.style.left = (isEnd ? elementLeft : (elementLeft - 8)) + 'px';
  return elementLeft;
};

const configTimeline = (
  startDate: Date,
  endDate: Date,
  selector: string,
  timelineMargin: number,
  timelineWidth: number
) => {
  const monthsDiff = getMonthsDiff(startDate, endDate);
  document.querySelectorAll<HTMLElement>(`${selector} .timeline`).forEach((date: HTMLElement) => {
    const startElement = date.querySelector(".timeline-date.start") as HTMLElement;
    const startElementLeft = setLeft(startElement, startDate, timelineMargin, timelineWidth, monthsDiff, false);
    const endElement = date.querySelector(".timeline-date.end") as HTMLElement;
    const endElementLeft = setLeft(endElement, startDate, timelineMargin, timelineWidth, monthsDiff, true);
    const blockElement = date.querySelector('.timeline-block') as HTMLElement;
    blockElement.style.left = (startElementLeft + timelineMargin) + 'px';
    blockElement.style.width = (endElementLeft - startElementLeft - timelineMargin) + 'px';
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const printToggle = document.getElementById('print-toggle') as HTMLElement,
        printMenu = document.getElementById('print-menu') as HTMLElement;
  printToggle.addEventListener('click', () => {
    printMenu.style.display = (printMenu.style.display === 'none' || !printMenu.style.display) ? 'block' : 'none';
  });
  
  const sections = {
    'toggle-about': document.getElementById('about') as HTMLElement,
    'toggle-experience': document.getElementById('experience') as HTMLElement,
    'toggle-certifications': document.getElementById('certifications') as HTMLElement,
    'toggle-education': document.getElementById('education') as HTMLElement,
    'toggle-academic': document.getElementById('academic-experience') as HTMLElement,
    'toggle-publications': document.getElementById('publications') as HTMLElement,
    'toggle-references': document.getElementById('references') as HTMLElement
  };
  
  (Object.keys(sections) as Array<keyof typeof sections>).forEach((toggleId) => {
    const checkbox = document.getElementById(toggleId) as HTMLInputElement;
    checkbox.addEventListener('change', () => {
      sections[toggleId].style.display = checkbox.checked ? '' : 'none';
    });
  });
  
  const navToggle = document.getElementById('nav-toggle') as HTMLElement;
  const navMenu = document.getElementById('nav-menu') as HTMLElement;
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  
  const maxWidth = parseInt(window.getComputedStyle(document.querySelector('.container') as Element).getPropertyValue('max-width'));
  const timelineMargin = parseInt(window.getComputedStyle(document.querySelector('.timeline-date') as Element).getPropertyValue('width'));
  const timelineWidth = maxWidth - timelineMargin * 2;
  configTimeline(new Date("Jan 2013"), new Date("Jan 2025"), ".experience", timelineMargin, timelineWidth);
  configTimeline(new Date("Mar 2008"), new Date("Jul 2024"), "#academic-experience", timelineMargin, timelineWidth);
});