
import { getFileContents } from '../../utils/file-utils.mjs';
import { renderVividComponentTemplate } from '../../utils/render-utils.mjs';

const coreStyles= await getFileContents('./node_modules/@vonage/vivid/styles/core/all.css');
const themeStyles  = await getFileContents('./node_modules/@vonage/vivid/styles/tokens/theme-light.css');

const buttonTemplate = await renderVividComponentTemplate(`
<vwc-audio-player
    connotation="cta"
	src="https://download.samplelib.com/mp3/sample-6s.mp3"
></vwc-audio-player>
<vwc-button
    icon="arrow-bold-right-line"
    shape="pill"
    label="Hydrate Us!"
    appearance="outlined"
></vwc-button>
<vwc-card
	headline="Vivid Card Component"
	subtitle="Extra text below the card headline"
>
	<vwc-button
		slot="footer"
		icon="arrow-bold-right-line"
		shape="pill"
		label="Card Action"
		appearance="outlined"
	></vwc-button>
</vwc-card>
`);

const homePageTemplate = `
    <style>
        ${coreStyles}
        ${themeStyles}
    </style>
    <div class="vvd-root">
        ${buttonTemplate.replace('disabled', '')}
    </div>
    <script type="module">
        console.log('Listening');
        const button = document.querySelector('vwc-button');
        button.addEventListener('click', e => {
            import ('https://unpkg.com/@vonage/vivid@latest/button');
            import ('https://unpkg.com/@vonage/vivid@latest/card');
            import ('https://unpkg.com/@vonage/vivid@latest/audio-player');
            button.label = 'Dehydration Complete';
            button.connotation = 'success';
        });
    </script>
`;

export function getHomePageTemplate() {
    return `${homePageTemplate}`;
}