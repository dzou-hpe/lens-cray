import { Renderer } from "@k8slens/extensions";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
// Build a "user interface" that uses the observable state.
export const LayoutPage = (props: any) => {
  const { extension } = props;
  const [state, setState] = useState({ nodes: [], links: [] });
  const fgRef = useRef();
  useEffect(() => {
    const apiPath = `/api-kube/api/v1/namespaces/services/services/http:cray-sls:80/proxy/v1/hardware`;
    const clusterId = Renderer.Catalog.catalogEntities.activeEntity.getId();
    const apiUrl = `https://${clusterId}.lens.app:${location.port}`;

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
          if (nodeTypeCheck(obj)) {
            nodes.push({
              id: obj.Xname,
              group: obj.TypeString + obj?.ExtraProperties?.Role || "",
              value: obj,
            });
          }
        });

        // add links
        resJson.forEach((obj: any) => {
          if (nodeTypeCheck(obj)) {
            // parse xnames
            const xnames = obj.Xname.match(/[a-z]\d*/gm);
            // handle xnames
            let currentName = "";
            xnames.forEach((xname: string) => {
              if (currentName) {
                links.push({
                  source: currentName,
                  target: currentName + xname,
                });
              }
              currentName += xname;
              if (nodes.findIndex((node) => node.id === currentName) === -1) {
                nodes.push({
                  id: currentName,
                  group: "missing",
                });
              }
            });

            if (nodes.findIndex((node) => node.id === obj.Parent) === -1) {
              nodes.push({
                id: obj.Parent,
                group: "missing",
              });
            }
            links.push({
              source: obj.Xname,
              target: obj.Parent,
            });

            if (obj?.Children?.length > 0) {
              obj.Children.forEach((child: string) => {
                if (nodes.findIndex((node) => node.id === child) === -1) {
                  nodes.push({
                    id: child,
                    group: "missing",
                  });
                }
                links.push({
                  source: obj.Xname,
                  target: child,
                });
              });
            }
          }
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
      ref={fgRef}
      width={window.innerWidth - 70 - sidebarWidth}
      height={sidebarHeight - 100}
      linkWidth={(link) => 4}
      nodeAutoColorBy="group"
      backgroundColor="white"
      onNodeClick={(node: any) => {
        console.log(node.value);
      }}
      nodeVal="value"
      linkDirectionalParticles={1}
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const label: string = getDisplayName(node);

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
        ctx.fillText(label, node.x, node.y + 2 * r + 10 / globalScale);
      }}
      nodePointerAreaPaint={(node: any, color, ctx) => {
        const r = 1.3;

        if (node.value) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI, false);
          ctx.strokeStyle = color;
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.fill();
          ctx.closePath();
        }
      }}
    />
  );
};
function getDisplayName(node: any): string {
  if (node.group === "missing") {
    return "";
  }

  if (node?.value?.ExtraProperties?.Role === "Management") {
    return `${node?.value?.ExtraProperties?.SubRole} -  ${node?.value?.ExtraProperties.Aliases[0]}`;
  }

  if (node?.value?.ExtraProperties?.Role === "Compute") {
    return `${node?.value?.ExtraProperties?.Role} -  ${node?.value?.ExtraProperties.Aliases[0]}`;
  }

  if (node?.value?.ExtraProperties?.Role === "Application") {
    return `${node?.value?.ExtraProperties?.SubRole} -  ${node?.value?.ExtraProperties.Aliases[0]}`;
  }

  if (node?.value?.TypeString === "MgmtHLSwitch") {
    return `${node?.value?.ExtraProperties?.Brand} -  ${node?.value?.ExtraProperties.Aliases[0]}`;
  }

  if (node?.value?.TypeString === "Cabinet") {
    return `${node?.value?.Class} Cabinet`;
  }

  if (node?.value?.TypeString === "RouterBMC") {
    return `BMC - Router`;
  }

  if (node?.value?.TypeString === "ChassisBMC") {
    return `BMC - Chassis`;
  }

  return node.id;
}
function nodeTypeCheck(obj: any) {
  return (
    obj.TypeString !== "MgmtSwitchConnector" && obj.TypeString !== "MgmtSwitch"
  );
}
