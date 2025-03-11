/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Timeline.ts":
/*!*************************!*\
  !*** ./src/Timeline.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Timeline: () => (/* binding */ Timeline)
/* harmony export */ });
class Timeline {
    parentElement;
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.configure();
    }
    // Computes the difference in months between two dates.
    getMonthsDiff(start, end) {
        return (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
    }
    // Determines a base percentage position for an element date relative to a minimum date.
    computeNumericPosition(elementDate, minDate, monthsDiff) {
        const elementDiff = this.getMonthsDiff(minDate, elementDate);
        return elementDiff / monthsDiff;
    }
    // Forms a CSS calc() expression based on the calculated percentage.
    formatPosition(basePercent, dateWidth, isStart) {
        // E.g. "0.5 * (100% - 20px)" with an offset to adjust the position.
        const leftExpression = `${basePercent} * (100% - ${dateWidth * 2}px)`;
        const offset = isStart ? ' - 0.3em' : ` + ${dateWidth}px + 0.3em`;
        const leftValue = `calc(${leftExpression}${offset})`;
        const computedValue = `${leftExpression} ${isStart ? '+' : '-'} ${dateWidth}px`;
        return { leftValue, computedValue };
    }
    // Updates a timeline date element's position using helper functions.
    updateElementPosition(timelineDate, minDate, dateWidth, monthsDiff) {
        timelineDate.element.innerText = timelineDate.dateStr;
        // Validate that the date is valid.
        if (isNaN(timelineDate.elementDate.getTime())) {
            throw new Error("Invalid date found for timeline element.");
        }
        const basePercent = this.computeNumericPosition(timelineDate.elementDate, minDate, monthsDiff);
        const { leftValue, computedValue } = this.formatPosition(basePercent, dateWidth, timelineDate.isStart);
        timelineDate.element.style.left = leftValue;
        return { leftValue, computedValue };
    }
    // Retrieves a TimelineDate from an HTML element.
    getElementDate(element, isStart) {
        const dataDate = element.dataset['date'];
        const elementDate = dataDate ? new Date(dataDate) : new Date();
        const dateStr = elementDate.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' });
        return { element, dateStr, elementDate, isStart };
    }
    // Factory method to get a TimelineElements group from a timeline container.
    createTimelineElement(dateElem) {
        const startElement = dateElem.querySelector(".timeline-date.start");
        const endElement = dateElem.querySelector(".timeline-date.end");
        const blockElement = dateElem.querySelector('.timeline-block');
        if (!startElement || !endElement || !blockElement) {
            throw new Error("Missing timeline sub-element in: " + dateElem.outerHTML);
        }
        return {
            start: this.getElementDate(startElement, true),
            end: this.getElementDate(endElement, false),
            block: blockElement
        };
    }
    // Computes common metrics required for setting up timeline elements.
    computeTimelineMetrics(dates) {
        let dateWidth;
        let minDate;
        let maxDate;
        const timelines = [];
        dates.forEach((dateElem) => {
            const timeline = this.createTimelineElement(dateElem);
            // Only compute width and baseline dates once.
            if (dateWidth === undefined) {
                const computedStyle = window.getComputedStyle(timeline.start.element);
                const widthValue = parseInt(computedStyle.width, 10);
                if (isNaN(widthValue)) {
                    throw new Error("Unable to parse width from computed style.");
                }
                dateWidth = widthValue;
                minDate = timeline.start.elementDate;
                maxDate = timeline.end.elementDate;
            }
            else {
                if (timeline.start.elementDate < minDate) {
                    minDate = timeline.start.elementDate;
                }
                if (timeline.end.elementDate > maxDate) {
                    maxDate = timeline.end.elementDate;
                }
            }
            timelines.push(timeline);
        });
        if (dateWidth === undefined || minDate === undefined || maxDate === undefined) {
            throw new Error("Could not compute timeline metrics");
        }
        return { dateWidth, minDate, maxDate, timelines };
    }
    // Sets the CSS for the block element based on the start and end timeline dates.
    configureTimelineBlock(timeline, minDate, dateWidth, monthsDiff) {
        const startData = this.updateElementPosition(timeline.start, minDate, dateWidth, monthsDiff);
        const endData = this.updateElementPosition(timeline.end, minDate, dateWidth, monthsDiff);
        timeline.block.style.left = `calc(${startData.computedValue})`;
        timeline.block.style.width = `calc(${endData.computedValue} - ${startData.computedValue})`;
    }
    // Main configuration method wraps all logic in a try/catch for robustness.
    configure() {
        const dates = this.parentElement.querySelectorAll('.timeline');
        if (dates.length === 0)
            return;
        try {
            const { dateWidth, minDate, maxDate, timelines } = this.computeTimelineMetrics(dates);
            const monthsDiff = this.getMonthsDiff(minDate, maxDate) || 1;
            timelines.forEach((timeline) => {
                this.configureTimelineBlock(timeline, minDate, dateWidth, monthsDiff);
            });
        }
        catch (error) {
            console.error("Timeline configuration error: ", error);
        }
    }
}


/***/ }),

/***/ "./src/main.scss":
/*!***********************!*\
  !*** ./src/main.scss ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.scss */ "./src/main.scss");
/* harmony import */ var _Timeline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Timeline */ "./src/Timeline.ts");


/**
 * Initializes the toggle logic for the print menu.
 */
const togglePrintMenu = () => {
    const printToggle = document.getElementById('print-toggle');
    const printMenu = document.getElementById('print-menu');
    if (!printToggle || !printMenu)
        return;
    printToggle.addEventListener('click', () => {
        const display = printMenu.style.display;
        printMenu.style.display = (!display || display === 'none') ? 'block' : 'none';
    });
};
/**
 * Initializes the section toggles.
 * Each checkbox is wired to show or hide its associated section.
 */
const initSectionToggles = () => {
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
        const sectionElement = sections[toggleId];
        if (checkbox && sectionElement) {
            checkbox.addEventListener('change', function () {
                sectionElement.style.display = this.checked ? '' : 'none';
            });
        }
    });
};
/**
 * Initializes the navigation toggle logic.
 */
const initNavigationToggle = () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }
};
/**
 * Applies timeline logic to each selected timeline container.
 * Uses the Timeline class for encapsulation.
 */
const initTimelines = () => {
    document.querySelectorAll("#experience, #academic-experience").forEach((element) => {
        new _Timeline__WEBPACK_IMPORTED_MODULE_1__.Timeline(element);
    });
};
/**
 * Main initialization on DOM content loaded.
 */
const init = () => {
    togglePrintMenu();
    initSectionToggles();
    initNavigationToggle();
    initTimelines();
};
document.addEventListener('DOMContentLoaded', init);

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map