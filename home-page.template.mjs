
import 'global-jsdom/register';
import '@vonage/vivid/button';
import { getStyles } from './utils.mjs';

const coreStyles= await getStyles();
const themeStyles  = await getStyles('./node_modules/@vonage/vivid/styles/tokens/theme-light.css');

const button = document.createElement('vwc-button');
button.setAttribute('label', 'Dehydrate Me Please');
button.setAttribute('connotation', 'alert');
button.setAttribute('appearance', 'filled');
document.body.append(button);

const buttonOuterHTML = button.outerHTML;
const shadowRootAppendageIndex = buttonOuterHTML.indexOf('</vwc-button>');
const buttonTemplate = buttonOuterHTML.slice(0, shadowRootAppendageIndex) + 
    `<template shadowrootmode="open">
        ${button.shadowRoot.innerHTML}
    </template>` +
    buttonOuterHTML.slice(shadowRootAppendageIndex);

const homePageTemplate = `
    <style>
        ${coreStyles}
        ${themeStyles}
    </style>
    <div class="vvd-root">
        ${buttonTemplate}
    </div>
    <script type="module">
        console.log('Listening');
        const button = document.querySelector('vwc-button');
        button.addEventListener('click', e => {
            import ('https://unpkg.com/@vonage/vivid@latest/button');
            button.label = 'Dehydration Complete';
            button.connotation = 'success';
        });
    </script>
`;

export function getHomePageTemplate() {
    return `${homePageTemplate}`;
}