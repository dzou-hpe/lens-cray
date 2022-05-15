import { Renderer } from "@k8slens/extensions";
import React, { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

// Build a "user interface" that uses the observable state.
export const LayoutPage = (props: any) => {
  const { extension } = props;
  const [state, setState] = useState({ nodes: [], links: [] });
  useEffect(() => {
    const apiPath = `/api-kube/api/v1/namespaces/services/services/http:cray-sls:80/proxy/v1/hardware`;
    const clusterId = Renderer.Catalog.catalogEntities.activeEntity.getId();
    const apiUrl = `http://${clusterId}.localhost:${location.port}`;

    fetch(apiUrl + apiPath, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      const nodes: any[] = [];
      const links: any[] = [];
      res.json().then((resJson) => {
        // add nodes
        resJson.forEach((obj: any) => {
          nodes.push({
            id: obj.Xname,
            group:
              obj.Type + "-" + obj.ExtraProperties?.Role ||
              "" + "-" + obj.ExtraProperties?.SubRole ||
              "" + "-" + obj.ExtraProperties?.Brand ||
              "",
            value: obj,
          });
        });

        // add links
        resJson.forEach((obj: any) => {
          if (nodes.findIndex((node) => node.Xname === obj.Parent) === -1) {
            nodes.push({
              id: obj.Parent,
              group: "missing",
            });
          }
          links.push({
            source: obj.Xname,
            target: obj.Parent,
          });
        });

        setState({ nodes, links });
      });
    });
  }, []);

  const sidebarWidth =
    (
      document.querySelectorAll(
        '[data-testid="cluster-sidebar"]'
      )[0] as HTMLElement
    )?.offsetWidth || 200;
  const sidebarHeight =
    (
      document.querySelectorAll(
        '[data-testid="cluster-sidebar"]'
      )[0] as HTMLElement
    )?.offsetHeight || 200;
  return (
    <ForceGraph2D
      graphData={state}
      width={window.innerWidth - 70 - sidebarWidth}
      height={sidebarHeight - 100}
      linkWidth={(link) => 4}
      nodeAutoColorBy="group"
      backgroundColor="white"
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const label: string =
          node?.value?.Type || "" + ` (${node.id as string})`;
        const fontSize = 24 / globalScale;

        const r = 1.3;

        if (node.value) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI, false);
          ctx.strokeStyle = node.color;
          ctx.stroke();
          ctx.fillStyle = node.color;
          ctx.fill();
          ctx.closePath();
        }

        // draw label
        ctx.textAlign = "center";
        ctx.font = `${fontSize}px Arial`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y + r + 10 / globalScale);
      }}
    />
  );
};
