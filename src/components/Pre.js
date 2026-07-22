import React from "react";

function Pre(props) {
  return (
    <div id={props.load ? "preloader" : "preloader-none"} aria-hidden="true">
      <div className="preloader-reveal">
        <span className="preloader-reveal-lens">
          <span className="preloader-reveal-caustic" />
          <span className="preloader-reveal-focus" />
        </span>
      </div>
    </div>
  );
}

export default Pre;
