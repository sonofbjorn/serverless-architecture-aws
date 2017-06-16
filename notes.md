## Chapter 4: Setting up your cloud
Focus of chapter:
* security model and identity mgmt
* logging, alerting, and custom metrics
* monitoring and estimating AWS costs

### Security Model and Identity Management

#### Creating and Managing IAM users
* IAM user: an entity in AWS that identifies a human user, application, or service
* IAM users created to work on behalf of app or svc are sometimes referred to as *service accounts*
* Best practice to enable MFA for any user who accesses AWS console
* Can create temporary security credentials

#### Creating groups
* Groups represent a collection of IAM users - easy way to specify permissions for multiple users at once

#### Creating roles
* Role is a set of permissions that a user, application, or service can assume for a period of time
* Common use case is to allow AWS services to communication, e.g. allow lambda to access S3
* Delegation is important concept associated with roles. Delegation is concerned with granting of permissions to a third party to allow access to a particular resource.
* Federation is process of creating a trust relationship between an external identity provider and enterprise identity system that supports SAML 2.0 and AWS
  * Allows user to log in via external identity provider and assume and IAM role with temp credentials

#### Resources
* Permissions in AWS are either identity-based or resource-based
  * Identity-based: specify what an IAM user or role may do
  * Resource-based: specify what an AWS resource (e.g S3 bucket or SNS topic) is allowed to do or who can access it
* Cross-account access with a resource-based policy has advantage role. With a resource that is accessed through a resource-based policy, user still works in the trusted acct and does not have to give up user permissions in place of the role permissions. IOW, the user continues to have access to resources in the trusted account while maintaining access to the resource in the trusting account.
* Resource-based policies only supported in S3 buckets, SNS topics, SQS queues, Glacier vaults, OpsWorks stacks, and Lambda functions

#### Permissions and policies
* Policy is collection of permissions
* Policies can be applied to user, group or role
* Managed policies:
  * apply to users, groups, and roles, but *not* resources
  * Standalone
  * some created and maintained by AWS
  * can create and maintain customer-managed policies
  * great for reusability and change mgmt
  * changes made to policy are automatically applied to all IAM users, roles, and groups the policy is attached to
* Inline policies:
  * created and attached directly to specific user, group, or role
  * when an entity is deleted, so are its inline policies (not standalone entity)
  * resource-based policies are always inline
* Policies are specified using JSON notation with elements:
  * http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html
  * Statement array: contains one or more statements that specify the actual permissions that make up the policy
  * Effect: either "Allow" or "Deny"
  * Action: action or array of actions on the resource that should be allowed or denied
  * Resource: object or objects that the statement applies to; can be specific or include wildcards
  * Principal: IAM user, account, or service that is allowed or denied access to the resource (used in roles to specify who can assume the role or in resource-based policies)
  * Statement ID (Sid): required in policies for certain AWS services, such as SNS
  * Condition: allows you to specify rules that dictate when a policy should apply

#### Logging and Alerting
* CloudWatch: 
  * AWS component for monitoring resources and services running on AWS
  * settings alarms based on a wide range of metrics
  * viewing statistics on the performance of resources
  * Can be helpful for logging from serverless system
* CloudTrail:
  * AWS service that records API calls
  * records info such as identity of caller, source IP, and event
  * effective way to generate logs and gather info about what AWS services are doing and who's invoking them

#### Setting up logging
* in traditional architectures, log agents are installed on EC2 instances and used to log to CloudWatch
* Lambda logs to CloudWatch automatically
* CloudWatch logs are stored indefinitely by default. Can configure retention policy to purge logs

#### Searching log data
Filter and pattern syntax: http://amzn.to/1miUFTd

#### S3 and logging
* S3 is able to track access requests and log info separately from CloudWatch
* S3 logs store info like bucket name, request time, action, response status
* Logs make take several hours to appear
* Need to create another bucket to store logs and enable logging for bucket

#### Alarms
* CloudWatch alarms monitor metrics (duration, errors, invocations, throttles) and performs action (e.g. sending a message to SNS)
* Alarm has 3 possible states: OK, Insufficient Data, Alarm
* Billing alarms can be configured globally or per service

#### Monitoring and optimizing costs
* CloudCheckr (cloudcheckr.com) can help track costs, send alerts, and even suggest savings by analyzing services and resources in use
* Trusted Advisor: Amazon service suggesting improvements to perf, fault tolerance, security, cost optimization; free version is very limited
* Cost Explorer: useful, albeit high-level, reporting and analytics tool built into AWS; can be enabled in My Billing Dashboard

#### Estimating cost
* Simple Monthly Calculator: web app developed by Amazon to help model costs for many of its services (http://calculator.s3.amazonaws.com/index.html)
  * Simple is a misnomer, but it can be useful for estimates
* Serverless calculator (http://serverlesscalc.com/): tool built to help estimate Lambda costs

## Chapter 5: Authentication and authorization
* Can use AWS Cognito or Auth0 services for authentication and authorization
* Good explanation of delegation token: https://auth0.com/docs/tokens/delegation
* Cognito is fine but has some deficiencies.
* Auth0 can be labeled a universal identity platform
  * AWS integration in Auth0: https://auth0.com/docs/integrations/aws
* 