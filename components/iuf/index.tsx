import { Renderer } from "@k8slens/extensions";
import { makeObservable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
export * from "./session-details"
export * from "./argo"



enum columnId {
  name = "name",
  namespace = "namespace",
  activity = "activity",
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
export class IufSessions extends React.Component<{}> {
  constructor() {
    super({});
    makeObservable(this);
  }
  render() {
    const store: Renderer.K8sApi.ConfigMapsStore = Renderer.K8sApi.apiManager.getStore(
      Renderer.K8sApi.configMapApi
    ) as unknown as Renderer.K8sApi.ConfigMapsStore;
    const configMap = store.getByLabel(["type=iuf_session"]);

    if (!configMap) {
      return null;
    }


    return (
      <div style={{ minHeight: "400px", height: "20vh" }}>
        <Renderer.Component.KubeObjectListLayout
          isConfigurable
          key={`iuf_activity`}
          tableId="iuf_activity"
          className="ConfigMaps"
          items={configMap}
          store={store}
          sortingCallbacks={{
            [columnId.name]: configMap => configMap.getName(),
            [columnId.namespace]: configMap => configMap.getNs(),
            [columnId.activity]: configMap => {
              const labels = configMap.getLabels()
              let res = ""
              for (const label in labels) {
                if (label.includes("iuf_activity_ref=")) {
                  res = label.split("=")[1]
                  break
                }
              }
              return res
            }
          }}
          searchFilters={[(configMap) => configMap.getSearchFields()]}
          renderHeaderTitle="IUF Sessions"
          // customizeHeader={({ searchProps, ...headerPlaceholders }) => ({
          //   searchProps: {
          //     ...searchProps,
          //     placeholder: `${crd.getResourceKind()} search ...`,
          //   },
          //   ...headerPlaceholders,
          // })}
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
            { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
            { title: "Activity", className: "namespace", sortBy: columnId.activity, id: columnId.activity },
          ]}
          renderTableContents={configMap => [
            configMap.getName(),
            configMap.getNs(),
            configMap.getLabels().find((label) => { return label.includes("iuf_activity_ref=") }).split("=")[1]

          ]}
          failedToLoadMessage={
            <>
              <p>Failed to load IUF</p>
              {/* {!version.served && (
                <p>
                  Prefered version ({crd.getGroup()}/{version.name}) is not
                  served
                </p>
              )} */}
            </>
          }
        />
      </div>
    );
  }
}
