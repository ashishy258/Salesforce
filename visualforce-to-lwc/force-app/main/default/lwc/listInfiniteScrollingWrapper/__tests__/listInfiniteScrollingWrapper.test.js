import { createElement } from 'lwc';
import ListInfiniteScrollingWrapper from 'c/listInfiniteScrollingWrapper';

describe('c-list-infinite-scrolling-wrapper', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
    it('shows inner component using c-example-wrapper', () => {
        // Create initial element
        const element = createElement('c-list-infinite-scrolling-wrapper', {
            is: ListInfiniteScrollingWrapper
        });
        document.body.appendChild(element);

        const exampleEl = element.shadowRoot.querySelector('c-example-wrapper');
        expect(exampleEl).not.toBeNull();

        const innerEl = exampleEl.querySelector('c-list-infinite-scrolling');
        expect(innerEl).not.toBeNull();
    });
});
