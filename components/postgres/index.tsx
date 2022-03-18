import { Renderer } from "@k8slens/extensions";
import React from "react";
import { value } from "jsonpath";
import { makeObservable, observable } from "mobx";
import { observer } from "mobx-react";

enum columnId {
  name = "name",
  namespace = "namespace",
  status = "status",
  pods = "pods",
}

export function parseJsonPath(jsonPath: string) {
  function convertToIndexNotation(key: string, firstItem = false) {
    if (key.match(/[\\-]/g)) {
      // check if found '\' and '-' in key
      if (key.includes("[")) {
        // handle cases where key contains [...]
        const keyToConvert = key.match(/^.*(?=\[)/g); // get the text from the key before '['

        if (keyToConvert && keyToConvert[0].match(/[\\-]/g)) {
          // check if that part contains illegal characters
          return key.replace(keyToConvert[0], `['${keyToConvert[0]}']`); // surround key with '[' and ']'
        } else {
          return `.${key}`; // otherwise return as is with leading '.'
        }
      }

      return `['${key}']`;
    } else {
      // no illegal characters found, do not touch
      const prefix = firstItem ? "" : ".";

      return `${prefix}${key}`;
    }
  }
  let pathExpression = jsonPath;

  if (jsonPath.match(/[\\-]/g)) {
    // search for '\' and '-'
    const [first, ...rest] = jsonPath.split(/(?<=\w)\./); // split jsonPath by '.' (\. cases are ignored)

    pathExpression = `${convertToIndexNotation(first, true)}${rest
      .map((value) => convertToIndexNotation(value))
      .join("")}`;
  }

  // strip '\' characters from the result
  return pathExpression.replace(/\\/g, "");
}
@observer
export class PostgresqlClusters extends React.Component<{}> {
  constructor() {
    super({});
    makeObservable(this);
  }
  render() {
    const store: Renderer.K8sApi.CRDStore = Renderer.K8sApi.apiManager.getStore(
      Renderer.K8sApi.crdApi
    ) as unknown as Renderer.K8sApi.CRDStore;
    const crd = store.getByGroup("acid.zalan.do", "postgresqls");

    if (!crd) {
      return null;
    }

    const isNamespaced = crd.isNamespaced();
    const version = crd.getPreferedVersion();

    return (
      <div style={{ minHeight: "400px", height: "20vh" }}>
        <Renderer.Component.KubeObjectListLayout
          isConfigurable
          key={`crd_resources_${crd.getResourceApiBase()}`}
          tableId="crd_resources"
          className="CrdResources"
          store={Renderer.K8sApi.apiManager.getStore(crd.getResourceApiBase())}
          sortingCallbacks={{
            [columnId.name]: (customResource) => customResource.getName(),
            [columnId.namespace]: (customResource) => customResource.getNs(),
            [columnId.status]: (customResource) =>
              customResource.status.PostgresClusterStatus,
          }}
          searchFilters={[(customResource) => customResource.getSearchFields()]}
          renderHeaderTitle={crd.getResourceKind()}
          customizeHeader={({ searchProps, ...headerPlaceholders }) => ({
            searchProps: {
              ...searchProps,
              placeholder: `${crd.getResourceKind()} search ...`,
            },
            ...headerPlaceholders,
          })}
          renderTableHeader={[
            {
              title: "Name",
              className: "name",
              sortBy: columnId.name,
              id: columnId.name,
            },
            isNamespaced && {
              title: "Namespace",
              className: "namespace",
              sortBy: columnId.namespace,
              id: columnId.namespace,
            },
            isNamespaced && {
              title: "Pods",
              className: "pods",
              sortBy: columnId.pods,
              id: columnId.pods,
            },
            isNamespaced && {
              title: "Status",
              className: "status",
              sortBy: columnId.status,
              id: columnId.status,
            },
          ]}
          renderTableContents={(crdInstance) => {
            return [
              crdInstance.getName(),
              isNamespaced && crdInstance.getNs(),
              crdInstance.spec.numberOfInstances,
              <div
                style={{
                  color:
                    crdInstance.status.PostgresClusterStatus === "Running"
                      ? "#4caf50"
                      : "#ce3933",
                }}
              >
                {crdInstance.status.PostgresClusterStatus}
              </div>,
            ];
          }}
          failedToLoadMessage={
            <>
              <p>Failed to load {crd.getPluralName()}</p>
              {!version.served && (
                <p>
                  Prefered version ({crd.getGroup()}/{version.name}) is not
                  served
                </p>
              )}
            </>
          }
        />
      </div>
    );
  }
}
