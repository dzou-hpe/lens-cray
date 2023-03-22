import { Renderer } from "@k8slens/extensions";
import React from "react";

export class SessionDetails extends React.Component<Renderer.Component.KubeObjectDetailsProps<Renderer.K8sApi.ConfigMap>> {

    render() {
        const iufData = this.props.object.data;
        const res = []

        for (const [key, value] of Object.entries(iufData)) {
            const iufObj = JSON.parse(value)
            console.log("DEBUG=====:  " + JSON.stringify(iufObj))
            res.push(
                <div>
                    <Renderer.Component.DrawerTitle>Session - {this.props.object.getName()}</Renderer.Component.DrawerTitle>
                    <Renderer.Component.DrawerItem name="Input Parameters">
                        {JSON.stringify(iufObj?.input_parameters)}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Site Parameters">
                        {JSON.stringify(iufObj?.site_parameters)}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Workflows">
                        {
                            iufObj.workflows[0].id
                        }
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerItem name="Stage">
                        {iufObj?.stage}
                    </Renderer.Component.DrawerItem>
                    <Renderer.Component.DrawerTitle>Products</Renderer.Component.DrawerTitle>
                    {iufObj.products.map((product: any) => {
                        return <Renderer.Component.DrawerItem name={product.name}>
                            {product.version}
                        </Renderer.Component.DrawerItem>
                    })}
                </div>
            )
        }

        return <div>{res}</div>;
    }
}
