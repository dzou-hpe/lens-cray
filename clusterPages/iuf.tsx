import { Renderer } from "@k8slens/extensions";
import path from "path";
import React from "react";
import { IufSessions } from "../components/iuf";

export function IufIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon
      {...props}
      material="pages"
      tooltip={path.basename(__filename)}
    />
  );
}

export class IufPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  render() {
    const apiPath = `/api-kube/api/v1/namespaces/argo/pods/http:cray-nls-argo-workflows-server-84c864f6c7-g276p:2746/proxy/workflows`;
    const clusterId = Renderer.Catalog.catalogEntities.activeEntity.getId();
    const apiUrl = `https://${clusterId}.lens.app:${location.port}`;
    return (
      <div className="flex column gaps">
        <IufSessions />
      </div>
    );
  }
}
