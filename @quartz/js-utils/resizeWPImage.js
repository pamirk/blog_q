/**
 * Resize an image from our WordPress media library (powered by Photon).
 *
 * @param  {string} url
 * @param  {int}    width
 * @param  {int}    height
 * @param  {bool}   crop
 * @param  {int}    quality
 * @return {string}
 */
function resizeWPImage(url, width, height, crop = false, quality = 75) {
    const { origin, pathname } = new URL(url);
    let resizedUrl = `${origin}${pathname}?quality=${quality}&strip=all`;
    if (width) {
        resizedUrl += `&w=${width}`;
    }
    if (height) {
        resizedUrl += `&h=${height}`;
    }
    if (crop) {
        resizedUrl += '&crop=1';
    }
    return resizedUrl;
}
export default resizeWPImage;
//# sourceMappingURL=resizeWPImage.js.map