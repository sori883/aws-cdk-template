import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";

export const env = {
  accountId: process.env.ACCOUNTID,
  projectName: "aws-cdk-template",
  prefix: "prod",
  region: "ap-northeast-1",
  azs: {
    a: "ap-northeast-1a",
    c: "ap-northeast-1c",
    d:"ap-northeast-1d"},
  vpc: {
    cidrBlock: "10.10.0.0/16",
    subnet: {
      ec2: "10.10.1.0/24",
      endpoint: "10.10.2.0/24",
    }
  },
  ec2: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    ami: ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2022_JAPANESE_FULL_BASE),
  },
};

export const baseTags: cdk.CfnTag[] = [
  { key: "environment", value: env.prefix },
  { key: "project", value: env.projectName },
  { key: "costcenter", value: "cdk" },
];

export const awsEnv = {
  regions: [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2", "ap-south-1", "ap-northeast-3",
    "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ca-central-1",
    "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1", "sa-east-1", 
    "af-south-1", "ap-east-1", "ap-south-2", "ap-southeast-3", "ap-southeast-5", 
    "ap-southeast-4", "ca-west-1", "eu-south-1", "eu-south-2", "eu-central-2", 
    "me-south-1", "me-central-1", "il-central-1"
  ],
  managedPrefixList: {
    s3: "pl-61a54008",
  },
  ManagedPolicy: {
    AmazonSSMManagedInstanceCore: "AmazonSSMManagedInstanceCore",
  }
}