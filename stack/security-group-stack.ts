import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { generateARN } from "~/util/generateARN";
import { baseTags, awsEnv } from "~/env";

interface SubStackProps extends StackProps {
  vpc: ec2.CfnVPC;
}

export class SecurityGroup {
  public readonly ec2SecurityGroup: ec2.CfnSecurityGroup;
  public readonly endpointSecurityGroup: ec2.CfnSecurityGroup;

  constructor(scope: Construct, props: SubStackProps) {
    /**
     * EC2 Security Group
     */
    this.ec2SecurityGroup = new ec2.CfnSecurityGroup(scope, generateARN("ec2SecurityGroup"), {
      vpcId: props.vpc.attrVpcId,
      groupDescription: "EC2 SecurityGroup",
      groupName: generateARN("ec2SecurityGroup"),
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("ec2SecurityGroup")}
      ]
    });

    /**
     * Endpoint Security Group
     */
    this.endpointSecurityGroup = new ec2.CfnSecurityGroup(scope, generateARN("endpointSecurityGroup"), {
      vpcId: props.vpc.attrVpcId,
      groupDescription: "Endpoint SecurityGroup",
      groupName: generateARN("endpointSecurityGroup"),
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("endpointSecurityGroup")}
      ]
    });

    /**
     * EC2 Security Group Egress
     */
    new ec2.CfnSecurityGroupEgress(scope, "EC2EgressSSM", {
      groupId: this.ec2SecurityGroup.attrGroupId,
      ipProtocol: "tcp",
      destinationSecurityGroupId: this.endpointSecurityGroup.attrGroupId,
      fromPort: 443,
      toPort: 443
    });

    /**
     * EC2 Security Group Egress
     */
    new ec2.CfnSecurityGroupEgress(scope, "EC2EgressS3", {
      groupId: this.ec2SecurityGroup.attrGroupId,
      ipProtocol: "tcp",
      destinationPrefixListId: ec2.Peer.prefixList(awsEnv.managedPrefixList.s3).uniqueId,
      fromPort: 443,
      toPort: 443
    });

    /**
     * Endpoint Security Group Ingress
     */
    new ec2.CfnSecurityGroupIngress(scope, "endpointIngress", {
      groupId: this.endpointSecurityGroup.attrGroupId,
      ipProtocol: "tcp",
      cidrIp: props.vpc.attrCidrBlock,
      fromPort: 443,
      toPort: 443
    });
  }
}