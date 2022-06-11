// Define window.dataLayer on client-side only.
if ('object' === typeof window) {
    window.dataLayer = window.dataLayer || [];
}

const gtm = data => window.dataLayer.push(data);
export default gtm;