import { Renderer } from "@k8slens/extensions";
import { computed, makeObservable } from "mobx";
const { apiManager, KubeObjectStore } = Renderer.K8sApi;

export class NodesStore extends KubeObjectStore<Renderer.K8sApi.Node> {
  api = Renderer.K8sApi.nodesApi;

  constructor() {
    super();

    makeObservable(this);
  }

  @computed get masterNodes() {
    return this.items.filter((node) => node.getRoleLabels().includes("master"));
  }

  @computed get workerNodes() {
    return this.items.filter(
      (node) => !node.getRoleLabels().includes("master")
    );
  }

}
