import { Renderer } from "@k8slens/extensions";
import { ExampleIcon, ExamplePage } from "./src/example-page";
import React from "react";

export default class ExampleExtension extends Renderer.LensExtension {
  clusterPages = [
    {
      id: "dashboard", // hello-world:foo
      components: {
        Page: () => <ExamplePage extension={this} />,
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

  async onActivate() {}
}
