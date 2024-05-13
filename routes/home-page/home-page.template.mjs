
import { getFileContents } from '../../utils/file-utils.mjs';
import { renderVividComponentTemplate } from '../../utils/render-utils.mjs';

const coreStyles= await getFileContents('./node_modules/@vonage/vivid/styles/core/all.css');
const themeStyles  = await getFileContents('./node_modules/@vonage/vivid/styles/tokens/theme-light.css');

const buttonTemplate = await renderVividComponentTemplate(`
    <vwc-button label="Click to Hydrate me"
                connotation="alert"
                appearance="filled"></vwc-button>
`);

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