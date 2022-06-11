import {useRef} from 'react';
import useDeepCompareEffect from 'helpers/hooks/useDeepCompareEffect';
import {getRelativeLink} from 'helpers/urls';

// shamelessly repurposed from the 'useTrackingOnInnerHtmlLinkClick' hook:
export function useInnerHTMLSegmentLinkTracking(props: {
    /** Function that will fire on link clicks inside your component */
    trackingFunction: (props: { anchor_text?: string; url?: string }) => void;
    /** Additional properties to pass into the above link click `trackingFunction` */
    context?: any;
    /** If true, will ignore clicks on internal links that lead to qz.com pages */
    ignoreInternalLinks?: boolean;
}) {
    const ref = useRef<HTMLElement>(null);

    useDeepCompareEffect(() => {
        // Store a reference for the cleanup function.
        const el = ref.current;

        function trackLinkClick(evt) {
            // Not a link? Nothing to track.
            if ('a' !== evt.target?.nodeName.toLowerCase()) {
                return;
            }

            // check to make sure it's an external link and not a qz.com + friends link
            const isExternal = !getRelativeLink(evt.target?.href);

            if (isExternal || !props.ignoreInternalLinks) {
                // Pass event properties into the segment event function
                props.trackingFunction({
                    anchor_text: evt.target?.innerText,
                    url: evt.target?.href,
                    ...props.context,
                });
            }
        }

        // Listen for link clicks on the container element and fire the tracking
        // action (but do not stop propagation of the event). Also listen for a user
        // opening the context-menu (right-clicking, but also possible via the
        // keyboard). This doesn't necessarily mean they opened in a new tab, but is
        // a good-enough proxy.
        el?.addEventListener('click', trackLinkClick);
        el?.addEventListener('contextmenu', trackLinkClick);
        el?.addEventListener('tap', trackLinkClick);

        // Clean up.
        return () => {
            el?.removeEventListener('click', trackLinkClick);
            el?.removeEventListener('contextmenu', trackLinkClick);
            el?.removeEventListener('tap', trackLinkClick);

        };
    }, [props]);

    return ref;
}
