import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { env, baseTags } from "~/env";
import { generateARN } from "~/util/generateARN";

export class Vpc {
  public readonly vpc: ec2.CfnVPC;
  public readonly routeTable: ec2.CfnRouteTable;
  public readonly ec2Subnet: ec2.CfnSubnet;
  public readonly endpointSubnet: ec2.CfnSubnet;

  constructor(scope: Construct) {
    /**
     * VPC
     */
    this.vpc = new ec2.CfnVPC(scope, generateARN("myVPC"), {
      cidrBlock: env.vpc.cidrBlock,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("myVPC")}
      ]
    });

    /**
     * Route Table
     */
    this.routeTable = new ec2.CfnRouteTable(scope, generateARN("myRouteTable"), {
      vpcId: this.vpc.attrVpcId,
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("myRouteTable")}
      ]
    });

    /**
     * Subnet
     */
    this.ec2Subnet = new ec2.CfnSubnet(scope, generateARN("ec2Subnet", env.azs["a"]), {
      vpcId: this.vpc.attrVpcId,
      availabilityZone: env.azs["a"],
      cidrBlock: env.vpc.subnet.ec2,
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("ec2Subnet", env.azs["a"])}
      ]
    });

    this.endpointSubnet = new ec2.CfnSubnet(scope, generateARN("endpointSubnet", env.azs["a"]), {
      vpcId: this.vpc.attrVpcId,
      availabilityZone: env.azs["a"],
      cidrBlock: env.vpc.subnet.endpoint,
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("endpointSubnet", env.azs["a"])}
      ]
    });

    /**
     * Associate Subneto To RouteTable
     */
    new ec2.CfnSubnetRouteTableAssociation(scope, "associateEC2Subnet", {
      routeTableId: this.routeTable.attrRouteTableId,
      subnetId: this.ec2Subnet.attrSubnetId,
    });

    new ec2.CfnSubnetRouteTableAssociation(scope, "associateEndpointSubnet", {
      routeTableId: this.routeTable.attrRouteTableId,
      subnetId: this.endpointSubnet.attrSubnetId,
    });

  }
}