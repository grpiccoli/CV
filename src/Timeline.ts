interface TimelineDate {
    element: HTMLElement;
    dateStr: string;
    elementDate: Date;
    isStart: boolean;
}

interface TimelineElements {
    start: TimelineDate;
    end: TimelineDate;
    block: HTMLElement;
}

interface DateData {
    leftValue: string;
    computedValue: string;
}

export class Timeline {
    private parentElement: HTMLElement;

    constructor(parentElement: HTMLElement) {
        this.parentElement = parentElement;
        this.configure();
    }

    // Computes the difference in months between two dates.
    private getMonthsDiff(start: Date, end: Date): number {
        return (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
    }

    // Determines a base percentage position for an element date relative to a minimum date.
    private computeNumericPosition(elementDate: Date, minDate: Date, monthsDiff: number): number {
        const elementDiff = this.getMonthsDiff(minDate, elementDate);
        return elementDiff / monthsDiff;
    }

    // Forms a CSS calc() expression based on the calculated percentage.
    private formatPosition(basePercent: number, dateWidth: number, isStart: boolean): DateData {
        // E.g. "0.5 * (100% - 20px)" with an offset to adjust the position.
        const leftExpression = `${basePercent} * (100% - ${dateWidth * 2}px)`;
        const offset = isStart ? ' - 0.3em' : ` + ${dateWidth}px + 0.3em`;
        const leftValue = `calc(${leftExpression}${offset})`;
        const computedValue = `${leftExpression} ${isStart ? '+' : '-'} ${dateWidth}px`;
        return { leftValue, computedValue };
    }

    // Updates a timeline date element's position using helper functions.
    private updateElementPosition(
        timelineDate: TimelineDate,
        minDate: Date,
        dateWidth: number,
        monthsDiff: number
    ): DateData {
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
    private getElementDate(element: HTMLElement, isStart: boolean): TimelineDate {
        const dataDate = element.dataset['date'];
        const elementDate = dataDate ? new Date(dataDate) : new Date();
        const dateStr = elementDate.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' });
        return { element, dateStr, elementDate, isStart };
    }

    // Factory method to get a TimelineElements group from a timeline container.
    private createTimelineElement(dateElem: HTMLElement): TimelineElements {
        const startElement = dateElem.querySelector<HTMLElement>(".timeline-date.start");
        const endElement = dateElem.querySelector<HTMLElement>(".timeline-date.end");
        const blockElement = dateElem.querySelector<HTMLElement>('.timeline-block');

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
    private computeTimelineMetrics(dates: NodeListOf<HTMLElement>): {
        dateWidth: number;
        minDate: Date;
        maxDate: Date;
        timelines: TimelineElements[];
    } {
        let dateWidth: number | undefined;
        let minDate: Date | undefined;
        let maxDate: Date | undefined;
        const timelines: TimelineElements[] = [];

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
            } else {
                if (timeline.start.elementDate < (minDate as Date)) {
                    minDate = timeline.start.elementDate;
                }
                if (timeline.end.elementDate > (maxDate as Date)) {
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
    private configureTimelineBlock(timeline: TimelineElements, minDate: Date, dateWidth: number, monthsDiff: number): void {
        const startData = this.updateElementPosition(timeline.start, minDate, dateWidth, monthsDiff);
        const endData = this.updateElementPosition(timeline.end, minDate, dateWidth, monthsDiff);

        timeline.block.style.left = `calc(${startData.computedValue})`;
        timeline.block.style.width = `calc(${endData.computedValue} - ${startData.computedValue})`;
    }

    // Main configuration method wraps all logic in a try/catch for robustness.
    private configure(): void {
        const dates = this.parentElement.querySelectorAll<HTMLElement>('.timeline');
        if (dates.length === 0) return;

        try {
            const { dateWidth, minDate, maxDate, timelines } = this.computeTimelineMetrics(dates);
            const monthsDiff = this.getMonthsDiff(minDate, maxDate) || 1;

            timelines.forEach((timeline) => {
                this.configureTimelineBlock(timeline, minDate, dateWidth, monthsDiff);
            });
        } catch (error) {
            console.error("Timeline configuration error: ", error);
        }
    }
}