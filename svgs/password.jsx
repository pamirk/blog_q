import * as React from "react";

function SvgPassword(props) {
    return <svg width={20} height={20} fill="var(--color,#000)" viewBox="0 0 20 20" {...props}>
        <path fillRule="nonzero"
              d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10C19.994 4.48 15.52.006 10 0zm0 17.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm0-11.25a2.492 2.492 0 0 0-1.25 4.652v2.848h2.5v-2.848A2.493 2.493 0 0 0 10 6.25z"/>
    </svg>;
}

export default SvgPassword;