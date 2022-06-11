import * as React from "react";

function SvgPlusMinusToggle(props) {
  return <svg width="12px" height="12px" viewBox="0 0 12 12" {...props}><g fill="var(--color,#000)"><path d="M0 5h12v2H0z" /><path d="M5 0h2v12H5z" /></g></svg>;
}

export default SvgPlusMinusToggle;