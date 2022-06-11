import {useEffect, useRef, useState} from 'react';

/**
 * Simple wrapper around IntersectionObserver for our limited use cases. No
 * polyfills. Observers and callbacks are held in static properties so that
 * observers can be reused and the observer callbacks can be accessed.
 *
 * @option {DOMElement} el              DOM element to observe.
 * @option {object}     observerOptions IntersectionObserver options.
 * @option {function}   onIntersect     Callback to call on intersect. Will
 *                                      receive the IntersectionObserverEntry.
 */
export class IntersectionObserverWrapper {
    static callbacks: { el: HTMLElement; fn: (el: HTMLElement) => void }[] = [];
    static observers: { instance: IntersectionObserver, signature: string }[] = [];
    el: HTMLElement;
    observer: IntersectionObserver;

    constructor(
        options: {
            el: HTMLElement | null;
            observerOptions: {
                rootMargin?: string;
            };
            onIntersect: (entry: any) => void;
        }
    ) {
        if (!options.el) {
            throw new Error('An element must be provided to the IntersectionObserver.');
        }

        this.el = options.el;
        this.observer = IntersectionObserverWrapper.getObserver(options);

        // Start observing.
        this.start();
    }

    static getObserver(options) {
        const {el, observerOptions, onIntersect: fn} = options;

        // Add callback with reference to the observed element.
        this.callbacks.push({el, fn});

        // Reuse observers that use the same options.
        const signature = JSON.stringify(observerOptions);
        const observer = this.observers.find(observer => signature === observer.signature);

        if (observer) {
            return observer.instance;
        }

        const instance = new IntersectionObserver(this.onIntersect.bind(this), observerOptions);
        this.observers.push({instance, signature});

        return instance;
    }

    // When an observer fires an intersection event, it will fire for all entries.
    static onIntersect(entries) {
        entries.forEach(entry => {
            // Find the callbacks that correspond with this entry and call them.
            this.callbacks.filter(cb => cb.el === entry.target).forEach(cb => cb.fn(entry));
        });
    }

    // Clear out any callbacks for this element.
    static onStop(el) {
        this.callbacks = this.callbacks.filter(cb => el !== cb.el);
    }

    start() {
        this.observer.observe(this.el);
    }

    stop() {
        this.observer.unobserve(this.el);
        IntersectionObserverWrapper.onStop(this.el);
    }
}

/**
 * Hook to provide "in-view" state for an element. Changines from false to true
 * when the user scrolls the element into view.
 *
 * @return {array[function, boolean]}  1. React ref, MUST be passed to DOM element.
 *                                     2. Whether the element is in view.
 */
export default function useInView(
    options: {
        /** Whether the element should be visible by default. See note below. */
        initialVisibility?: boolean;
        /** Whether the element should continue to be observed after the first intersection. */
        persistent?: boolean;
        /** The only configurable IntersectionObserver option.
         * Note that rootMargin requires a unit, e.g., "100px". */
        rootMargin?: string;
        /** Any custom functionality we need to run using the visibility ref. */
        refFunc?: (HTMLElement) => void;
    } = {}
): [((el: HTMLElement | null) => void), boolean] {
    // Keep a reference to the observer so that we can stop listening on unmount.
    const observerRef = useRef<IntersectionObserverWrapper>();

    // Set initialVisibility to true for elements that you think might be above-
    // the-fold (e.g., the first few items in a list). If true, the element will
    // not be observed.
    //
    // Otherwise it is set to FALSE by default, including on SSR! Therefore DON'T
    // use the value of inView to visually hide UI (e.g., "opactiy: 0"), because
    // it will NOT be visible on the SSR (bad for SEO and bad for a11y).
    const {initialVisibility = false} = options;
    const [inView, setInView] = useState(initialVisibility);

    // rootMargin is the only supported IntersectionObserver option, for now.
    const {rootMargin = '0px'} = options;
    const observerOptions = {
        rootMargin,
        threshold: [0],
    };

    const stopObserving = () => observerRef.current?.stop();

    // We're using a traditional callback ref here because we cannot start
    // observing until the ref is fulfilled with a DOM element. If we need custom
    // functionality using the ref, we can apply it here.
    const elementRef = (el: HTMLElement | null) => {
        if (options.refFunc) {
            options.refFunc(el);
        }

        // Already in view or already set up observer? Bail.
        if (inView || observerRef.current) {
            return;
        }

        // When the element intersects, set in-view. If we only want to
        // observe once, stop observing immediately. If we want to continue
        // observing, set inView to false when the intersection is over. For our
        // purposes, we don't care about thresholds.
        const onIntersect = entry => {
            const {persistent} = options;

            if (entry.isIntersecting) {
                setInView(true);

                if (!persistent) {
                    stopObserving();
                }
            } else {
                if (persistent) {
                    setInView(false);
                }
            }
        };

        // Start observing.
        const wrapperOptions = {el, observerOptions, onIntersect};
        observerRef.current = new IntersectionObserverWrapper(wrapperOptions);
    };

    // Stop observing on unmount.
    useEffect(() => stopObserving, []);

    return [elementRef, inView];
}
