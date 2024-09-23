import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "~/stack/vpc-stack";
import { VpcEndpoint } from "~/stack/vpc-endpoint-stack";
import { SecurityGroup } from "~/stack/security-group-stack";
import { Role } from "~/stack/role-stack";

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this);

    const sg = new SecurityGroup(this, {
      vpc: vpc.vpc,
    });

    new VpcEndpoint(this, {
      vpc: vpc.vpc,
      endpointSubnet: vpc.endpointSubnet,
      endpointSecurityGroup: sg.endpointSecurityGroup,
      routeTable: vpc.routeTable,
    });

    const role = new Role(this);
  }
}