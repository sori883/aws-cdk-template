import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { generateARN } from "~/util/generateARN";

interface SubStackProps extends StackProps {
  vpc: ec2.CfnVPC;
  endpointSubnet: ec2.CfnSubnet;
  endpointSecurityGroup: ec2.CfnSecurityGroup;
  routeTable: ec2.CfnRouteTable;
}

export class VpcEndpoint {
  public readonly ssmEndpoint: ec2.CfnVPCEndpoint;
  public readonly ssmMessageEndpoint: ec2.CfnVPCEndpoint;
  public readonly ec2MessageEndpoint: ec2.CfnVPCEndpoint;
  public readonly s3Endpoint: ec2.CfnVPCEndpoint;

  constructor(scope: Construct, props: SubStackProps) {
    this.ssmEndpoint = new ec2.CfnVPCEndpoint(scope, generateARN("ssm"), {
      serviceName: ec2.InterfaceVpcEndpointAwsService.SSM.name,
      vpcId: props.vpc.attrVpcId,
      subnetIds: [props.endpointSubnet.attrSubnetId],
      vpcEndpointType: ec2.VpcEndpointType.INTERFACE,
      securityGroupIds: [props.endpointSecurityGroup.attrGroupId],
    });

    this.ssmMessageEndpoint = new ec2.CfnVPCEndpoint(scope, generateARN("ssmMessage"), {
      serviceName: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES.name,
      vpcId: props.vpc.attrVpcId,
      subnetIds: [props.endpointSubnet.attrSubnetId],
      vpcEndpointType: ec2.VpcEndpointType.INTERFACE,
      securityGroupIds: [props.endpointSecurityGroup.attrGroupId],
    });

    this.ec2MessageEndpoint = new ec2.CfnVPCEndpoint(scope, generateARN("ec2Message"), {
      serviceName: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES.name,
      vpcId: props.vpc.attrVpcId,
      subnetIds: [props.endpointSubnet.attrSubnetId],
      vpcEndpointType: ec2.VpcEndpointType.INTERFACE,
      securityGroupIds: [props.endpointSecurityGroup.attrGroupId],
    });

    this.s3Endpoint = new ec2.CfnVPCEndpoint(scope, generateARN("s3"), {
      serviceName: ec2.GatewayVpcEndpointAwsService.S3.name,
      vpcId: props.vpc.attrVpcId,
      vpcEndpointType: ec2.VpcEndpointType.GATEWAY,
      routeTableIds: [props.routeTable.attrRouteTableId]
    });
  }
}