import { readFile } from 'fs';

export function extractCSSFromAdoptedStylesheets(adoptedStyleSheets) {
    return adoptedStyleSheets.reduce((acc, styleSheet) => {
        return acc + Array.from(styleSheet.cssRules).reduce((rulesAcc, rule) => {
            return rulesAcc + rule.cssText;
        }, '')
    }, '');
}

export async function getFileContents(filePath = './node_modules/@vonage/vivid/styles/core/all.css') {
    return new Promise((res, rej) => {
        readFile(filePath, (err, content) => {
            if (err) {
                rej(err);
                return;
            }
            res(content);
        })
    });
}   