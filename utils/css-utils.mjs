export function extractCSSFromAdoptedStylesheets(adoptedStyleSheets) {
    return adoptedStyleSheets.reduce((acc, styleSheet) => {
        return acc + Array.from(styleSheet.cssRules).reduce((rulesAcc, rule) => {
            return rulesAcc + rule.cssText;
        }, '')
    }, '');
}