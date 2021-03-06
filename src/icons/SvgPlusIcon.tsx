import * as React from "react";

function SvgPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      {...props}
    >
      <path d="M8 14.857h-.016a1.143 1.143 0 100 2.286h16.031a1.143 1.143 0 100-2.286h-.017z" />
      <path d="M17.143 8v-.016a1.143 1.143 0 10-2.286 0v.017V8v16.015a1.143 1.143 0 102.286 0v-.017.001z" />
      <path d="M16 0C7.177 0 .001 7.177.001 15.999S7.178 31.998 16 31.998c8.823 0 15.999-7.177 15.999-15.999S24.822 0 16 0zm0 2.286c7.588 0 13.714 6.127 13.714 13.714S23.588 29.714 16 29.714 2.286 23.588 2.286 16 8.412 2.286 16 2.286z" />
    </svg>
  );
}

export default SvgPlusIcon;

