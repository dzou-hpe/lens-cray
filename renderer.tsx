import { Renderer } from "@k8slens/extensions";
import { ExampleIcon, DashboardPage, CredentialsPage } from "./clusterPages";
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
      id: "credentials",
      components: {
        Page: () => <CredentialsPage extension={this} />,
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
      target: { pageId: "credentials" },
      title: "Credentials",
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
