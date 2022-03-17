import { Renderer, Common } from "@k8slens/extensions";
import path from "path";
import React from "react";
import kebabCase from "lodash/kebabCase";
import upperFirst from "lodash/upperFirst";
import { K8sNodes } from "../components/nodes";

export function ExampleIcon(props: Renderer.Component.IconProps) {
  return (
    <Renderer.Component.Icon
      {...props}
      material="pages"
      tooltip={path.basename(__filename)}
    />
  );
}

export class DashboardPage extends React.Component<{
  extension: Renderer.LensExtension;
}> {
  renderConditions(node: Renderer.K8sApi.Node) {
    if (!node.status.conditions) {
      return null;
    }

    return node.getActiveConditions().map((condition) => {
      const { type } = condition;
      const tooltipId = `node-${node.getName()}-condition-${type}`;

      return (
        <div
          key={type}
          id={tooltipId}
          className={Common.Util.cssNames("condition", kebabCase(type))}
        >
          {type}
          <Renderer.Component.Tooltip
            targetId={tooltipId}
            formatters={{ tableView: true }}
          >
            {Object.entries(condition).map(([key, value]) => (
              <div key={key} className="flex gaps align-center">
                <div className="name">{upperFirst(key)}</div>
                <div className="value">{value}</div>
              </div>
            ))}
          </Renderer.Component.Tooltip>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="flex column gaps">
        <K8sNodes />
      </div>
    );
  }
}
