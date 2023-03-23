import { Common, Renderer } from "@k8slens/extensions";
import { Navigation } from "@k8slens/extensions/dist/src/extensions/renderer-api";
import { createTerminalTab, terminalStore } from "@k8slens/extensions/dist/src/extensions/renderer-api/components";
import { Icon } from "@k8slens/extensions/dist/src/renderer/components/icon";
import { MenuItem } from "@k8slens/extensions/dist/src/renderer/components/menu";
import { count } from "console";
import React, { useEffect, useState } from "react";
export * from "./session-details";
export interface ArgoProps { }

export function Argo(props: ArgoProps) {


  const [forwardedPort, setForwardedPort] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const apiPath = `/api/pods/port-forward/argo/services/argo-server-internal?port=2746&forwardPort=0`;
    const clusterId = Renderer.Catalog.catalogEntities.activeEntity.getId();
    const apiUrl = `https://${clusterId}.lens.app:${location.port}`;

    fetch(apiUrl + apiPath, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((p) =>
        p.json().then((res) => {


          setForwardedPort(res.port)
        })
      )
      .catch(console.error);
  });



  return (
    forwardedPort === 0 ? <>wait for port</> :
      <>
        <Renderer.Component.Button
          primary
          label="Open Argo"
          onClick={() => Common.Util.openExternal(`http://localhost:${forwardedPort}`)}
        />

      </>
  );
}