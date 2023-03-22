import { Renderer } from "@k8slens/extensions";
import { ExampleIcon, DashboardPage, LayoutPage, IufPage, IufIcon } from "./clusterPages";
import React from "react";
import { NodeMenu, NodeMenuProps } from "./components/nodeMenuExt";
import { SessionDetails } from "./components/iuf";

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
    {
      id: "iuf",
      components: {
        Page: () => <IufPage extension={this} />,
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
    {
      parentId: "cray",
      target: { pageId: "iuf" },
      title: "IUF",
      components: {
        Icon: IufIcon,
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

  kubeObjectDetailItems = [
    {
      kind: "ConfigMap",
      apiVersions: ["v1"],
      priority: 1,
      components: {
        Details: (props: Renderer.Component.KubeObjectDetailsProps<Renderer.K8sApi.ConfigMap>) => (
          <SessionDetails {...props} />
        )
      }
    }
  ]

  async onActivate() {
    console.log("cray plugin activated");
  }
}
