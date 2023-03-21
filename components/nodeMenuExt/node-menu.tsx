import React from "react";
import { Common, Renderer } from "@k8slens/extensions";

type Node = Renderer.K8sApi.Node;

const {
  Component: {
    terminalStore,
    createTerminalTab,
    ConfirmDialog,
    MenuItem,
    Icon,
  },
  Navigation,
} = Renderer;
const { App } = Common;

export interface NodeMenuProps
  extends Renderer.Component.KubeObjectMenuProps<Node> {}

export function NodeMenu(props: NodeMenuProps) {
  const { object: node, toolbar } = props;

  if (!node) {
    return null;
  }

  const nodeName = node.getName();
  const kubectlPath = App.Preferences.getKubectlPath() || "kubectl";

  const getXname = async () => {
    const apiPath = `/api-kube/api/v1/namespaces/services/services/http:cray-sls:80/proxy/v1/search/hardware?extra_properties.Role=Management`;
    const clusterId = Renderer.Catalog.catalogEntities.activeEntity.getId();
    const apiUrl = `https://${clusterId}.lens.app:${location.port}`;

    const res = await fetch(apiUrl + apiPath, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json();

    const xname = resJson.find((obj: any) => {
      return obj?.ExtraProperties?.Aliases[0]?.includes(nodeName);
    });

    return xname.Xname;
  };

  const sendToTerminal = (command: string) => {
    const shell = createTerminalTab({
      title: `ConMan: ${nodeName}`,
    });

    terminalStore.sendCommand(command, {
      enter: true,
      tabId: shell.id,
    });

    Navigation.hideDetails();
  };

  const conman = async () => {
    const xname = await getXname();
    sendToTerminal(
      `
        export CONPOD=$(${kubectlPath} get pods -n services | grep "cray-console-node" | head -1 | awk '{print $1}') && \
        export CONSOLE_POD=$(${kubectlPath} exec -it -n services $CONPOD -c cray-console-node -- sh -c "curl -s -X GET -H \\\"Content-Type: application/json\\\" -d {\\\\\\\"xname\\\\\\\":\\\\\\\"${xname}\\\\\\\"} http://cray-console-operator/console-operator/v0/getNodePod | jq -r '.podname'") && \
        export CONSOLE_POD=$(echo $CONSOLE_POD | tr -d '\\n\\r' | xargs ) && \
        ${kubectlPath} exec -it -n services $CONSOLE_POD -c cray-console-node -- conman -j ${xname}
    `
    );
  };

  return (
    <>
      <MenuItem onClick={conman}>
        <Icon
          svg="ssh"
          interactive={toolbar}
          tooltip={toolbar && "Node ConMan"}
        />
        <span className="title">ConMan</span>
      </MenuItem>
    </>
  );
}
