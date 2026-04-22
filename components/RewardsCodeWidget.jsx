import React from "react";
import { Card } from "./HiMaterial";

export default function RewardsCodeWidget({ code, imageSrc }) {
  return (
    <Card title="Your rewards code">
      <img
        src={imageSrc}
        alt="Rewards QR/Barcode"
        className="img-fluid roundedImage"
      />
      <p className="mb-0">
        <i>{code}</i>
      </p>
    </Card>
  );
}
