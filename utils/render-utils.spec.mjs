import { afterEach } from "node:test";
import { renderVividComponent, renderVividComponentTemplate } from "./render-utils.mjs";
import { describe, expect, it } from "vitest";

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
describe('render-utils', () => {
    let testElement;
    beforeEach(() => {
        testElement = document.createElement('test-element');
        document.body.appendChild(testElement);
    });

    afterEach(() => {
        testElement.remove();
    });
    
    describe('renderVividComponentTemplate', () => {
        it('should return a string with the element', async () => {
            const template = `<test-element></test-element>`;
            const componentTemplateString = await renderVividComponentTemplate(template)
            
            const resultsWrapper = getRenderedElement(componentTemplateString);
            const resultedElement = resultsWrapper.children[0];
            expect(resultedElement.tagName).toEqual(testElement.tagName);
        });
    
        it('should return the shadowed content inside a template string with shadowrootmode', async () => {
            const template = `<test-element></test-element>`;
            const componentTemplateString = await renderVividComponentTemplate(template)
            
            const resultsWrapper = getRenderedElement(componentTemplateString);
            const testElementTemplate = resultsWrapper.children[0].children[0];
            
            expect(testElementTemplate.tagName).toEqual('TEMPLATE');
            expect(testElementTemplate.getAttribute('shadowrootmode')).toEqual('open');
            expect(removeNewlinesAndSpaces(testElementTemplate.innerHTML)).toEqual(removeNewlinesAndSpaces(shadowContent));
        });
    
        it('should return a string with the light content', async () => {
            const template = `<test-element>${lightContent}</test-element>`;
            const componentTemplateString = await renderVividComponentTemplate(template);
            const resultsWrapper = getRenderedElement(componentTemplateString);
            const resultedElement = resultsWrapper.children[0];
            expect(removeNewlinesAndSpaces(resultedElement.children[0].outerHTML)).toEqual(removeNewlinesAndSpaces(lightContent));
        });

        it('should import the vivid component', async () => {
            const importSpy = vi.fn();
            vi.doMock('@vonage/vivid/card', async (importOriginal) => {
                importSpy();
                return await importOriginal();
            });
            const template = `<vwc-card headline="Vivid Card Component"
                                        subtitle="Subtitle"></vwc-card>`;
            await renderVividComponentTemplate(template);
            expect(importSpy).toHaveBeenCalledOnce();
        });

        it('should avoid importing a component without the given prefix', async () => {
            const importSpy = vi.fn();
            vi.doMock('@vonage/vivid/card', async (importOriginal) => {
                importSpy();
                return await importOriginal();
            });
            const template = `<vwc-card headline="Vivid Card Component"
                                        subtitle="Subtitle"></vwc-card>`;
            await renderVividComponentTemplate(template, 'test');
            expect(importSpy).toHaveBeenCalledTimes(0);
        });
    });
});