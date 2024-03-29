/**
 * Convert a hex color like #336699 to an array of RGB values.
 */
function hexToRGB(hexColor) {
    // Remove # from arg.
    let hex = hexColor.slice(1);
    // Convert 3-character hex values to 6.
    if (hex.length === 3) {
        hex = hex.replace(/([A-f0-9])/g, '$1$1');
    }
    const parsedColor = parseInt(hex, 16), R = parsedColor >> 16, G = parsedColor >> 8 & 0x00FF,
        B = parsedColor & 0x0000FF;
    return [R, G, B];
}
export default hexToRGB;

// exports.default = hexToRGB;
//# sourceMappingURL=hexToRGB.js.map