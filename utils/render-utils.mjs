import 'global-jsdom/register';

export function renderVividComponent(component, attributes) {
    for (const attribute in attributes) {
        component.setAttribute(attribute, attributes[attribute]);
    }
    document.body.appendChild(component);

    const componentOuterHTML = component.outerHTML;
    const shadowRootAppendageIndex = componentOuterHTML.indexOf('</vwc-button>');
    return componentOuterHTML.slice(0, shadowRootAppendageIndex) + 
        `<template shadowrootmode="open">
            ${component.shadowRoot.innerHTML}
        </template>` +
        componentOuterHTML.slice(shadowRootAppendageIndex);
};