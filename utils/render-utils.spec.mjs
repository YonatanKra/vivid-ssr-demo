import { afterEach } from "node:test";
import { renderVividComponent, renderVividComponentTemplate } from "./render-utils.mjs";

const shadowContent = `
    <div>I'm in the Shadow</div>
    <style></style>
`;
const lightContent = `
    <div>I'm in the light</div>
`;

class TestElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = shadowContent;
    }
}
customElements.define('test-element', TestElement);

function removeNewlinesAndSpaces(str) {
    return str.replace(/[\n\r\s]+/g, '');
}

function getRenderedElement(componentTemplateString) {
    const resultsWrapper = document.createElement('div');
    resultsWrapper.innerHTML = componentTemplateString;
    return resultsWrapper;
}
describe('renderVividComponent', () => {
    let testElement;
    beforeEach(() => {
        testElement = document.createElement('test-element');
        document.body.appendChild(testElement);
    });

    afterEach(() => {
        testElement.remove();
    });

    it('should return a string with the element', () => {
        const componentTemplateString = renderVividComponent(testElement)
        
        const resultsWrapper = getRenderedElement(componentTemplateString);
        const resultedElement = resultsWrapper.children[0];
        expect(resultedElement.tagName).toEqual(testElement.tagName);
    });

    it('should return the shadowed content inside a template string with shadowrootmode', () => {
        const componentTemplateString = renderVividComponent(testElement);
        
        const resultsWrapper = getRenderedElement(componentTemplateString);
        const testElementTemplate = resultsWrapper.children[0].children[0];
        
        expect(testElementTemplate.tagName).toEqual('TEMPLATE');
        expect(testElementTemplate.getAttribute('shadowrootmode')).toEqual('open');
        expect(removeNewlinesAndSpaces(testElementTemplate.innerHTML)).toEqual(removeNewlinesAndSpaces(shadowContent));
    });

    it('should return a string with the light content', () => {
        testElement.innerHTML = lightContent;
        const componentTemplateString = renderVividComponent(testElement)
        const resultsWrapper = getRenderedElement(componentTemplateString);
        const resultedElement = resultsWrapper.children[0];
        expect(removeNewlinesAndSpaces(resultedElement.children[0].outerHTML)).toEqual(removeNewlinesAndSpaces(lightContent));
    });
});

