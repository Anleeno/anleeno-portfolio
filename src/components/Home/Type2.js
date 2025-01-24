import React from "react";
import Typewriter from "typewriter-effect";

function Type2() {
  return (
    <Typewriter
      options={{
        strings: [
          "Hobies: ",
          "Music",
          "Reading",
          "Anime",
          "Science Fiction",
          "Philosophy",
          "Meditation",
          "Photography"
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type2;
