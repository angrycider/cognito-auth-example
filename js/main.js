//AWS IDs
var constRegion = 'us-east-1';
var constIdentityPoolId = 'us-east-1:XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
var constUserPoolId = 'us-east-1_XXXXXXXXXXX';
var constClientId = 'XXXXXXXXXXXXXXXXXXXXXXXX';
var constCognitoProviderId = 'cognito-idp.' + constRegion + '.amazonaws.com/' + constUserPoolId;

var userPool;

var initUserPool = function(awsRegion, awsIdentityPoolId, awsUserPoolId, awsClientId){
	AWS.config.region = awsRegion; 
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: awsIdentityPoolId 
    });

    AWSCognito.config.region = constRegion;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: awsIdentityPoolId 
    });

    // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
    AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})

    var poolData = { 
        UserPoolId : awsUserPoolId,
        ClientId : awsClientId
    };
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
};

$( document ).ready(function() {
    
    //Initialize our userPool to be used everywhere else.
    userPool = initUserPool(constRegion,
    				constIdentityPoolId,
    				constUserPoolId,
    				constClientId)

    
    $('#btn_create_account').click(function(e){
	    $('.form-signin').hide();
	    $('.form-signup').show();
    });

    $('#btn_sign_up').click(function(e){

	    var attributeList = [];

	    var dataEmail = {
	        Name : 'email',
	        Value : $('#inputEmail').val()
	    };
	    var dataPhoneNumber = {
	        Name : 'phone_number',
	        Value : $('#inputMobile').val()
	    };
	    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
	    var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

	    attributeList.push(attributeEmail);
	    attributeList.push(attributePhoneNumber);

	    userPool.signUp($('#inputEmail').val(), $('#inputPassword').val(), attributeList, null, function(err, result){
	        if (err) {
	            alert(err);
	            return;
	        }
	        cognitoUser = result.user;
	        console.log('user name is ' + cognitoUser.getUsername());
	        $('.form-signup').hide();
	        $('.form-validate').show();
	    });
    });

	$('#btn_verify').click(function(e){

	    var userData = {
	        Username : $('#inputEmail').val(),
	        Pool : userPool
	    };

	    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
	    cognitoUser.confirmRegistration($('#inputCode').val(), true, function(err, result) {
	        if (err) {
	            alert(err);
	            return;
	        }
	        console.log('call result: ' + result);
	       	$('.form-validate').hide();
	        $('.form-signin').show();
	    });

	});

	$('#btn_sign_in').click(function(e){

		var authenticationData = {
	        Username : $('#inputUsername2').val(),
	        Password : $('#inputPassword2').val(),
	    };
	    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

	    var userData = {
	        Username : $('#inputUsername2').val(),
	        Pool : userPool
	    };
	    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	    cognitoUser.authenticateUser(authenticationDetails, {
	        onSuccess: function (result) {
	        	var jwtToken = result.getAccessToken().getJwtToken();
	            console.log('access token: ' + jwtToken);

				//Use the AWS Identity Pool JWT Token to request temporary token from AWS Cognito Identity
				var logins = {};
				logins[constCognitoProviderId] = result.idToken.jwtToken;
				AWS.config.credentials = new AWS.CognitoIdentityCredentials({
					IdentityPoolId: constIdentityPoolId,
					IdentityId: AWS.config.credentials.identityId,
					Logins: logins
				});

				AWS.config.credentials.get(function (err) {
					// now I'm using authenticated credentials
					if(err)
					{
					  	console.log('error in autheticatig AWS'+err);
					}
					else
					{
					  	//Now we have something we can use.
					  	console.log('cognito identity: ' + AWS.config.credentials.identityId);
	        			$('.success').show();
	        			$('.form-signin').hide();
					}
				});

	        },

	        onFailure: function(err) {
	            alert(err);
	        },

	    });

	});

	$('#forgot-password').click(function(e){
		
		var userData = {
	        Username : $('#inputUsername2').val(),
	        Pool : userPool
	    };
    	var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.forgotPassword({
	        onSuccess: function (result) {
	            console.log('call result: ' + result);
	            alert("You password has been reset, please login with your new password.");
	        },
	        onFailure: function(err) {
	            alert(err);
	        },
	        inputVerificationCode() {
	            var verificationCode = prompt('Please input verification code ' ,'');
	            var newPassword = prompt('Enter new password ' ,'');
	            cognitoUser.confirmPassword(verificationCode, newPassword, this);
	        }
	    });


		
	});

	$('#reset-password').click(function(e){

	    var oldPassword = prompt('Please input old password ' ,'');
	    var newPassword = prompt('Please input new password ' ,'');

	    var data = { UserPoolId : constUserPoolId,
	        ClientId : constClientId
	    };
	    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
	    var cognitoUser = userPool.getCurrentUser();

	    if (cognitoUser != null) {
	        cognitoUser.getSession(function(err, session) {
	            if (err) {
	                alert(err);
	                return;
	            }
	            console.log('session validity: ' + session.isValid());

				cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
			        if (err) {
			            alert(err);
			            return;
			        }
			        console.log('call result: ' + result);
			        alert("Password successfully changed.");
			    });
	        });
	    }

	});

	$('#logout').click(function(e){
	    var data = { UserPoolId : constUserPoolId,
	        ClientId : constClientId
	    };
	    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
	    var cognitoUser = userPool.getCurrentUser();

	    if (cognitoUser != null) {
	        cognitoUser.getSession(function(err, session) {
	            if (err) {
	                alert(err);
	                return;
	            }
	            console.log('session validity: ' + session.isValid());
				cognitoUser.signOut();
				$('.form-signin').show();
				$('.success').hide();	
	        });
	    }

	});

});


