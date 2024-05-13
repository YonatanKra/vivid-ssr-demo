import 'global-jsdom/register';

async function renderVividComponent(component, vwcPrefix = 'vwc') {
    const tagName = component.tagName.toLowerCase();
    const componentName = tagName.slice(tagName.indexOf('-') + 1);
    if (tagName.indexOf(vwcPrefix) === 0) {
        await import (`@vonage/vivid/${componentName}`);
    }
    
    document.body.appendChild(component);

    const componentOuterHTML = component.outerHTML;
    const closingTag = `</${tagName}>`;
    const shadowRootAppendageIndex = componentOuterHTML.indexOf(closingTag);
    return `
        ${componentOuterHTML.slice(0, shadowRootAppendageIndex)}
            <template shadowrootmode="open">
                ${component.shadowRoot.innerHTML}
            </template>
        ${closingTag}`;
};

export async function renderVividComponentTemplate(templateString, prefix='vwc') {
    const element = document.createElement('div');
    element.innerHTML = templateString;
    document.body.appendChild(element);
    element.remove();
    return renderVividComponent(element.children[0], prefix);
};