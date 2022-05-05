import { Renderer, Common } from "@k8slens/extensions";
import path from "path";
import React from "react";
import kebabCase from "lodash/kebabCase";
import upperFirst from "lodash/upperFirst";
import { K8sNodes } from "../components/nodes";
import { PostgresqlClusters } from "../components/postgres";
import { EtcdClusters } from "../components/etcd";

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
    return (
      <div className="flex column gaps">
        <K8sNodes />

        <PostgresqlClusters />
        <EtcdClusters />
      </div>
    );
  }
}
