export function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
}
//# sourceMappingURL=utils.js.map