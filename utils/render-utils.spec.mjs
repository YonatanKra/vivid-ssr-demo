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
        this.dispatchEvent(new CustomEvent('test', {bubbles: true, composed: true}));
    }
}

class TestElementContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `<test-element></test-element>`;
    }
}
customElements.define('test-element', TestElement);
customElements.define('test-element-container', TestElementContainer);

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

        function createImportSpy(importString) {
            const importSpy = vi.fn();
            vi.doMock(importString, async (importOriginal) => {
                importSpy();
                return await importOriginal();
            });
            return importSpy;
        }

        it('should import the vivid components', async () => {
            const cardImportSpy = createImportSpy('@vonage/vivid/card');
            const audioImportSpy = createImportSpy('@vonage/vivid/audio-player');
            const buttonImportSpy = createImportSpy('@vonage/vivid/button');

            const template = `<vwc-card headline="Vivid Card Component"
                                        subtitle="Subtitle"></vwc-card>
                                        <vwc-audio-player></vwc-audio-player>
                                        <vwc-button></vwc-button>`;
            await renderVividComponentTemplate(template);
            expect(cardImportSpy).toHaveBeenCalledOnce();
            expect(audioImportSpy).toHaveBeenCalledOnce();
            expect(buttonImportSpy).toHaveBeenCalledOnce();
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

        it('should render sub elements with shadowDOM with a template', async () => {
            const template = `<test-element-container><div>Lighted Part</div></test-element-container>`;
            const componentTemplateString = await renderVividComponentTemplate(template);            
            const resultsWrapper = getRenderedElement(componentTemplateString);
            const firstTemplate = resultsWrapper.querySelector('template[shadowrootmode="open"]');
            const secondTemplate = firstTemplate.content.querySelector('template[shadowrootmode="open"]');
            expect(secondTemplate.tagName).toEqual('TEMPLATE');
            expect(secondTemplate.getAttribute('shadowrootmode')).toEqual('open');
        });

        it('should render components that dispatch events on load', async () => {
            const template = `<test-element-container></test-element-container>`;
            expect(await renderVividComponentTemplate(template)).toMatchInlineSnapshot(`
              "<test-element-container><template shadowrootmode="open">
                      <test-element><template shadowrootmode="open">
                      
                  <div>I'm in the Shadow</div>
                  <style></style>

                  </template></test-element>
                  </template></test-element-container>"
            `);
        });
    });
});

