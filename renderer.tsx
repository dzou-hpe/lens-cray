import { Renderer } from "@k8slens/extensions";
import { ExampleIcon, DashboardPage } from "./globalPages/dashboard";
import React from "react";

export default class LensCrayExtension extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "dashboard",
      components: {
        Page: () => <DashboardPage extension={this} />,
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
  ];

  async onActivate() {
    console.log("cray plugin activated");
  }
}
