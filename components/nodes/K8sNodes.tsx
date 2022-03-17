import { Renderer, Common } from "@k8slens/extensions";
import React from "react";
import kebabCase from "lodash/kebabCase";
import upperFirst from "lodash/upperFirst";

export class K8sNodes extends React.Component<{}> {
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
    const nodesStore: Renderer.K8sApi.NodesStore =
      Renderer.K8sApi.apiManager.getStore(
        Renderer.K8sApi.nodesApi
      ) as unknown as Renderer.K8sApi.NodesStore;

    enum columnId {
      name = "name",
      conditions = "condition",
      roles = "roles",
      age = "age",
      version = "version",
      kernelVersion = "kernerlVersion",
    }
    return (
      <div style={{ minHeight: "300px", height: "20vh" }}>
        <Renderer.Component.KubeObjectListLayout
          isConfigurable
          tableId="nodes"
          className="Nodes"
          store={nodesStore}
          isReady={nodesStore.isLoaded}
          isSelectable={false}
          hasDetailsView={false}
          detailsItem={undefined}
          sortingCallbacks={{
            [columnId.name]: (node) => node.getName(),
            [columnId.conditions]: (node) => node.getNodeConditionText(),
            [columnId.roles]: (node) => node.getRoleLabels(),
            [columnId.age]: (node) => node.getTimeDiffFromNow(),
            [columnId.version]: (node) => node.getKubeletVersion(),
            [columnId.kernelVersion]: (node) =>
              node.status.nodeInfo.kernelVersion,
          }}
          searchFilters={[
            (node) => node.getSearchFields(),
            (node) => node.getRoleLabels(),
            (node) => node.getKubeletVersion(),
            (node) => node.status.nodeInfo.kernelVersion,
            (node) => node.getNodeConditionText(),
          ]}
          renderHeaderTitle="Kubernetes Nodes"
          renderTableHeader={[
            {
              title: "Name",
              className: "name",
              sortBy: columnId.name,
              id: columnId.name,
            },
            {
              title: "Roles",
              className: "name",
              sortBy: columnId.roles,
              id: columnId.roles,
            },
            {
              title: "Version",
              className: "version",
              sortBy: columnId.version,
              id: columnId.version,
            },
            {
              title: "Kernel Version",
              className: "name",
              sortBy: columnId.kernelVersion,
              id: columnId.kernelVersion,
            },
            {
              title: "Conditions",
              className: "conditions",
              sortBy: columnId.conditions,
              id: columnId.conditions,
            },
            {
              title: "Age",
              className: "age",
              sortBy: columnId.age,
              id: columnId.age,
            },
          ]}
          renderTableContents={(node) => {
            return [
              node.getName(),
              node.getRoleLabels(),
              node.status.nodeInfo.kubeletVersion,
              node.status.nodeInfo.kernelVersion,
              this.renderConditions(node),
              node.getAge(),
            ];
          }}
        />
      </div>
    );
  }
}
