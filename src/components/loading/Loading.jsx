import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./loading.css";
const Loading = () => {
  return (
    <div className="loading">
      <DotLottieReact
        src="https://lottie.host/74c26c88-c19c-45ea-a0b8-91290a23b276/JDFvc1ilE7.lottie"
        loop
        autoplay
        style={{ width: "400px", height: "400px" }}
      />
    </div>
  );
};

export default Loading;
