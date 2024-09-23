import { StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { generateARN } from "~/util/generateARN";

interface SubStackProps extends StackProps {
  ec2Role: iam.CfnRole;
}

export class Ec2 {
  public readonly ec2: ec2.Instance;

  constructor(scope: Construct, props: SubStackProps) {
    const instanceProfile = new iam.CfnInstanceProfile(scope, 'myInstanceProfile', {
      roles: [
        props.ec2Role.attrArn,
      ],
    });
  }
}