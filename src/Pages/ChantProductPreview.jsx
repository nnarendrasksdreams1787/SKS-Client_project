import React from "react";
import Chant from "../Components/Users/Chant";
import "../CSS/Chant.css";

export default function ChantProductPreview() {
  return (
    <div className="chant-product-preview">
      {/* <div className="chant-preview-banner">
        <strong>Chant Counter System — Live Preview</strong>
        <p>
          Explore the Chant experience. Purchase the product
          to unlock all features.
        </p>
      </div> */}

      <Chant previewMode={true} />
    </div>
  );
}