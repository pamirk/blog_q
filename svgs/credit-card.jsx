import * as React from "react";

function SvgCreditCard(props) {
    return <svg width={16} height={16} viewBox="0 0 16 16" fill="var(--color,#000)" {...props}>
        <path fillRule="nonzero"
              d="M14 2H2a2.006 2.006 0 0 0-2 2v8a2.006 2.006 0 0 0 2 2h12a2.006 2.006 0 0 0 2-2V4a2.006 2.006 0 0 0-2-2zm0 10H2V8h12v4zm0-6H2V4h12v2zm-9 5h2a1 1 0 0 0 0-2H5a1 1 0 1 0 0 2z"/>
    </svg>;
}

export default SvgCreditCard;