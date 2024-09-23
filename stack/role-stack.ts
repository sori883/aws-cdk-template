import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { generateARN } from "~/util/generateARN";
import { baseTags, awsEnv } from "~/env";
import { ec2TrustPolicy } from "~/trustPolicy/ec2-trust-policy";

export class Role {
  public readonly ec2Role: iam.CfnRole;

  constructor(scope: Construct) {
    this.ec2Role = new iam.CfnRole(scope, "EC2Role", {
      assumeRolePolicyDocument: ec2TrustPolicy,
      roleName: generateARN("ec2Policy"),
      managedPolicyArns: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(awsEnv.ManagedPolicy.AmazonSSMManagedInstanceCore).managedPolicyArn
      ],
      tags: [
        ...baseTags,
        {key: "Name", value: generateARN("ec2Policy")}
      ]
    });
  }
}