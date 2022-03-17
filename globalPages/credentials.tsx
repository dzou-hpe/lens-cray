import { Renderer } from "@k8slens/extensions";
import React from "react";

export class CredentialsPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const doodleStyle = {
      width: "200px",
    };
    return (
      <div className="flex column gaps align-flex-start">
        <h1>Credentials</h1>
      </div>
    );
  }
}
