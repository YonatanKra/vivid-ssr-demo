import 'global-jsdom/register';

function fixFastJsDOMCollision() {
    HTMLElement.prototype.dispatchEvent = _ => {};
}
fixFastJsDOMCollision();

function getAllNestedShadowRootsParents(element) {
    const nestedShadowRoots = [];

    function traverseShadowRoot(node) {
        if (node.shadowRoot) {
            nestedShadowRoots.push(node);
            node.shadowRoot.querySelectorAll('*').forEach(child => {
                traverseShadowRoot(child);
            });
        } else {
            Array.from(node.querySelectorAll('*')).forEach(child => traverseShadowRoot(child));
        }
    }

    traverseShadowRoot(element);
    return Array.from(new Set(nestedShadowRoots));
}

function getShadowRootTemplate(component) {
    return `
    <template shadowrootmode="open">
        ${component.shadowRoot.innerHTML}
    </template>
    `;
}

function stringToElement(str) {
    const element = document.createElement('div');
    element.innerHTML = str;
    return element.children[0];
}

async function loadVividComponent(componentName) {
    await import (`@vonage/vivid/${componentName}`);
}

async function loadVividComponents(components) {
    if (!components) return;
    for (let i = 0; i < components.length; i++) {
        await loadVividComponent(components[i]);
    }
}

function getPrefixedComponentsInTemplate(htmlTemplate, prefix) {
    const regex = new RegExp(`<${prefix}-\\w+\\b[^\\s|>]*`, 'g');
    return htmlTemplate.match(regex)?.map(component => component.replace(`<${prefix}-`, ''));
}


export async function renderVividComponentTemplate(templateString, prefix='vwc') {
    await loadVividComponents(getPrefixedComponentsInTemplate(templateString, prefix));

    const element = document.createElement('div');
    document.body.appendChild(element);
    element.innerHTML = templateString;
    await new Promise(res => setTimeout(res, 0))
    const shadowNodes = getAllNestedShadowRootsParents(element);
    for (let i = shadowNodes.length - 1; i >= 0; i--) {
        const node = shadowNodes[i];
        node.appendChild(stringToElement(getShadowRootTemplate(node)));
    }

    element.remove();
    return element.innerHTML;
};


