import { Renderer } from "@k8slens/extensions";
import path from "path";
import React from "react";

export function ExampleIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon
      {...props}
      material="pages"
      tooltip={path.basename(__filename)}
    />
  );
}

export class DashboardPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const doodleStyle = {
      width: "200px",
    };
    return (
      <div className="flex column gaps align-flex-start">
        <h1>Dashboard</h1>
      </div>
    );
  }
}
