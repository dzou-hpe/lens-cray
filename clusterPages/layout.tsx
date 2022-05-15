import { Renderer } from "@k8slens/extensions";
import { makeAutoObservable } from "mobx";
import { Observer } from "mobx-react";
import React from "react";
import ForceGraph2D from "react-force-graph-2d";

class SlsStore {
  nodes: any[] = [];
  links: any[] = [];
  extension: Renderer.LensExtension;

  constructor(extension: Renderer.LensExtension) {
    makeAutoObservable(this);
    this.extension = extension;
    this.loadData();
  }

  async loadData() {
    const apiPath = `/api-kube/api/v1/namespaces/services/services/http:cray-sls:80/proxy/v1/hardware`;
    const clusterId = Renderer.Catalog.catalogEntities.activeEntity.getId();
    const apiUrl = `http://${clusterId}.localhost:${location.port}`;

    const res = await fetch(apiUrl + apiPath, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json();
    let n = 0;
    resJson.forEach((obj: any) => {
      this.nodes.push({
        id: n,
        // value: obj,
        // group: obj.Type,
      });
      n += 1;
      // this.links.push({
      //   source: obj.Xname,
      //   target: obj.Parent,
      // });
    });
    console.log(
      JSON.stringify({
        nodes: this.nodes,
        links: this.links,
      })
    );
  }
}

// Build a "user interface" that uses the observable state.
export const LayoutPage = (props: any) => {
  const { extension } = props;
  const slsStore = new SlsStore(extension);
  return (
    <Observer>
      {() => (
        <div>
          <ForceGraph2D
            graphData={{
              nodes: slsStore.nodes,
              links: [{ source: 1, target: 3 }],
            }}
            width={400}
            height={600}
          />
        </div>
      )}
    </Observer>
  );
};
