"use strict";
const getMonthsDiff = (startDate, endDate) => (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
const setLeft = (element, startDate, timelineMargin, timelineWidth, monthsDiff, isEnd) => {
    const dateStr = element.dataset.date;
    if (!dateStr)
        return 0;
    const elementDate = new Date(dateStr);
    const elementDiff = getMonthsDiff(startDate, elementDate);
    const elementLeft = timelineWidth * elementDiff / monthsDiff + (isEnd ? timelineMargin : 0);
    element.style.left = (isEnd ? elementLeft : (elementLeft - 8)) + 'px';
    return elementLeft;
};
const configTimeline = (startDate, endDate, selector, timelineMargin, timelineWidth) => {
    const monthsDiff = getMonthsDiff(startDate, endDate);
    document.querySelectorAll(`${selector} .timeline`).forEach((date) => {
        const startElement = date.querySelector(".timeline-date.start");
        const startElementLeft = setLeft(startElement, startDate, timelineMargin, timelineWidth, monthsDiff, false);
        const endElement = date.querySelector(".timeline-date.end");
        const endElementLeft = setLeft(endElement, startDate, timelineMargin, timelineWidth, monthsDiff, true);
        const blockElement = date.querySelector('.timeline-block');
        blockElement.style.left = (startElementLeft + timelineMargin) + 'px';
        blockElement.style.width = (endElementLeft - startElementLeft - timelineMargin) + 'px';
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const printToggle = document.getElementById('print-toggle'), printMenu = document.getElementById('print-menu');
    printToggle.addEventListener('click', () => {
        printMenu.style.display = (printMenu.style.display === 'none' || !printMenu.style.display) ? 'block' : 'none';
    });
    const sections = {
        'toggle-about': document.getElementById('about'),
        'toggle-experience': document.getElementById('experience'),
        'toggle-certifications': document.getElementById('certifications'),
        'toggle-education': document.getElementById('education'),
        'toggle-academic': document.getElementById('academic-experience'),
        'toggle-publications': document.getElementById('publications'),
        'toggle-references': document.getElementById('references')
    };
    Object.keys(sections).forEach((toggleId) => {
        const checkbox = document.getElementById(toggleId);
        checkbox.addEventListener('change', () => {
            sections[toggleId].style.display = checkbox.checked ? '' : 'none';
        });
    });
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
    const maxWidth = parseInt(window.getComputedStyle(document.querySelector('.container')).getPropertyValue('max-width'));
    const timelineMargin = parseInt(window.getComputedStyle(document.querySelector('.timeline-date')).getPropertyValue('width'));
    const timelineWidth = maxWidth - timelineMargin * 2;
    configTimeline(new Date("Jan 2013"), new Date("Jan 2025"), ".experience", timelineMargin, timelineWidth);
    configTimeline(new Date("Mar 2008"), new Date("Jul 2024"), "#academic-experience", timelineMargin, timelineWidth);
});
