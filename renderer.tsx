import { Renderer } from "@k8slens/extensions";
import { ExampleIcon, DashboardPage, LayoutPage } from "./clusterPages";
import React from "react";
import { NodeMenu, NodeMenuProps } from "./components/nodeMenuExt";

export default class LensCrayExtension extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "dashboard",
      components: {
        Page: () => <DashboardPage extension={this} />,
      },
    },
    {
      id: "layout",
      components: {
        Page: () => <LayoutPage extension={this} />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: "cray",
      title: "Cray",
      components: {
        Icon: ExampleIcon,
      },
    },
    {
      parentId: "cray",
      target: { pageId: "dashboard" },
      title: "Dashboard",
      components: {
        Icon: ExampleIcon,
      },
    },
    {
      parentId: "cray",
      target: { pageId: "layout" },
      title: "System Layout",
      components: {
        Icon: ExampleIcon,
      },
    },
  ];

  kubeObjectMenuItems = [
    {
      kind: "Node",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: NodeMenuProps) => <NodeMenu {...props} />,
      },
    },
  ];

  async onActivate() {
    console.log("cray plugin activated");
  }
}
