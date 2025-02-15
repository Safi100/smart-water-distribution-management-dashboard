import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound = () => {
  return (
    <div className="wrapper d-flex align-items-center flex-column">
      <DotLottieReact
        src="https://lottie.host/5b099634-3ce4-48e0-a069-805ec1a59632/6BYeFRgrQm.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "400px", maxWidth: "400px" }}
      />
      <h2>Page not found!</h2>
      <p>
        Return to{" "}
        <a href="/" className="text-primary">
          home page
        </a>
      </p>
    </div>
  );
};

export default NotFound;
