# cognito-auth-example

All of the information used for this example is based on the following: [https://github.com/aws/amazon-cognito-identity-js](https://github.com/aws/amazon-cognito-identity-js)

### Step 1

<div>Create and AWS User Pool (under the Cognito Icon within the management console.) &nbsp;Use the default settings. You will want to create an **App**&nbsp;and take note of the highlighted items in the screenshots below. &nbsp;These are used to configure javascript with the necessary identifiers for your User and Identity Pools:</div><div>
</div>
<div>
</div>

![User Pool Attributes](https://raw.githubusercontent.com/angrycider/cognito-auth-example/master/img/userPool-Attributes.png)
<div>
</div>
![User Pool Verifications](https://raw.githubusercontent.com/angrycider/cognito-auth-example/master/img/userPool-Verifications.png)<div>
</div>
![User Pool IDs](https://raw.githubusercontent.com/angrycider/cognito-auth-example/master/img/userPoolID.png)<div>
</div>
![User Pool Client ID](https://raw.githubusercontent.com/angrycider/cognito-auth-example/master/img/clientId.png)<div>
</div>
<div>
</div>

### Step 2

<div>Create your Federated Identity Pool.  For the most part you can use the defaults, but when you configure Cognito Provider, you will need to use the IDs you captured in Step 1\.  Also make note of the highlighted IDs as you will need those when configuring javascript.</div><div>
</div>

![Edit Identity Pool](https://raw.githubusercontent.com/angrycider/cognito-auth-example/master/img/editIdentityPool.png)
<div>
</div>
![Identity Pool Ids](https://raw.githubusercontent.com/angrycider/cognito-auth-example/master/img/editFederatedIdentity.png)<div>
</div>

### Step 3

<div>Update the constants at the top of js/main.js with the IDs you collected above.</div><div>
</div>

### TODO
<div>

*   <span style="line-height: 19.5px;">Needs field validation - Required Fields, Confirm Password, etc.</span>
*   <span style="line-height: 19.5px;">Need field formatting. &nbsp;For example the phone number needs to be entered as +1 1234567890...need to accept different formats and translate to whats needed.</span>
*   <span style="line-height: 19.5px;">Demonstrate what to do with Final Token...can be used to hit DynamoDB Web Services etc.</span>
*   <span style="line-height: 19.5px;">Demonstrate how to read/update attributes.</span></div>