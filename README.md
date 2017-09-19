# Hartford Smart Email

## Overview

This application consists of an API to categorize Emails and a UI to view emails and perform ADHOC testing.  The service calls another service called 'Message-Classifier' that uses Watson Conversation to classify messages.  The Service then calls Watson NLU (using a WKS Model ID) to determine Entities in the email.  If there is a 'ground_truth' defined in the document, then it can be used in the UI to analyze the success of the processing.

The data is subsequently stored in a CloudantDB.

# Required Services

This application requires 2 services to be created.  You can reuse services by binding existing services to this application.

- IBM Cloudant noSql Database
- Watson Natural Language Understanding
- Message-Classifier (message-classifier microservice located in this Git Group)

# Setup Instructions

The setup is done in 3 primary steps.  You will download the code, configure the code and then deploy the code to Bluemix.  If you would
like to run the code locally, there will be one more step to configure the credentials locally.

> The name of this application is *smartemail-hig* and is deployed to the 'Smart Email/SmartEmailDev' org/space in Bluemix.  The name must be unique within Bluemix, otherwise it won't deploy.  If you deploy this to any other Org or Space, you need to rename the app.

## Prerequisites
The application requires the following applications

1. Node (6.9+) Application runtime environment
2. NPM (3.10+) Server side dependency management
3. Gulp (3.9+) `npm install -g gulp`
4. Angular CLI (1.0.0+) `npm install -g @angular/cli`

Note: Please read the upgrade instructions for Angular CLI when you upgrade or install the component.

## Downloading the code

1. Clone the app to your local environment from your terminal using the following command:
  `
  git clone git@git.ng.bluemix.net:hig/smart-email.git
  `
2. `cd` into this newly created directory

### Configuration files

There are 2 configuration files that are required by the application.

The `env-vars.json` and  `vcap-local.json`. These file contains your service credentials required to run the application locally.  If the app is run on Bluemix, the app will use the VCAP service information on Bluemix. They are setup to use the services defined in Smart Email/SmartEmailDev in Bluemix.

## Deploying the application to Bluemix

To proceed, you need the Bluemix CLI tools.  Download & Install them following the directions here:  http://clis.ng.bluemix.net/ui/home.html

The application is already deployed to Bluemix and you can Update the application as noted below. This is for if you deploy it from scratch to a different space.

1. Log into Bluemix with your own credentials.
`
bx login -a api.ng.bluemix.net -u yourusername -o 'Smart Email' -s 'SmartEmailDEV'
`
2. Push the App to the space
`
bx app push
`
3. For a NEW Deployment, the above command will fail and the app will not start. You need to bind the connections:

### Creating and Binding the connections
1. From the Bluemix Dashboard, select the newly created application.
2.  Select Connections on the left.

### Create the following services using the procedure below

> Cloudant NoSql Database (Existing is:  Cloudant NoSQL DB-o9)
> Natural Language Understanding (Existing is:  SmartEmail-NLU)

1. Click on the Connect new button.
2. Search for the service you would like to create.
3. Create the service using the free, light or standard plans.
4. Bind it to your application.
5. Re-stage the application.

## Building the application

For the application to run on Bluemix or locally, it needs to be build first.  To do that, the Prerequisites needs to be met and install must have been executed successfully.

From the App folder, run the command `gulp build`.

This will build the code into a folder called dist that will contain 3 sub-folders.  If any error occurred, then the build wasn't successful and is probably a dependency issue or install that wasn't ran or successful.

## Running the app locally

To run the application locally (your own computer), you have to install additional Node.js modules and configure the application with the same credentials provisioned on Bluemix.

### Installing the server and client dependencies
The server dependencies are controlled and defined in [the main package.json](./package.json).

The client dependencies are controlled and defined in [the client package.json](./client/package.json).

To install all required dependencies to both build the application and execute the application, execute the following script from the project root.

Linux/Unix/MacOs

```
sh ./install.sh
```
or Windows

```
./install.bat
```

Alternatively, the dependencies can be installed manually with the following commands from project root

```
npm install
```

(cd client/ && npm install)

## The Local VCAP file

The vcap-local.json file consist of your Bluemix service credentials when you run the application locally.

This file must be updated with your service credentials before the application can be executed.

1. On the Bluemix Application page, select the Connections option on the left.
2. Select each of the services you provisioned earlier and view the credentials.
3. Copy the credentials using the 'copy' icon.
4. Edit the vcap-local.json file.
5. Paste the content of the clipboard into the vcap.local file.
6. The structure of this file consist of a service name and a json object, but the pasted value is wrapped in another ```{ }``` that should be removed.
7. A sample of what it should look like below;

```
{
  "cloudantNoSQLDB": [
    {
      "credentials": {
        ...
      },
      "syslog_drain_url": null,
      "label": "cloudantNoSQLDB",
      "provider": null,
      "plan": "Lite",
      "name": "Cloudant NoSQL DB-ss",
      "tags": [
        "data_management",
        "ibm_created",
        "ibm_dedicated_public"
      ]
    }
  ],
  "document_conversion": [
    {
      ...
    }
  ]
}
```

8. Once all the credentials are in place, the application can be starter with ```gulp develop```.
### Note For UI Development, run ```gulp develop-server``` to run only the server and in client directory, run ```npm start``` to run the UI server. The UI will be available at http://localhost:4200. All the REST requests from the UI will be proxied to localhost:3000. This is configured in client/proxy-config.json.

## Posting data to the application

In order to _Process_ an email, you need to convert the Email to a JSON object in the following format:

`
{ "id": "someemailid",
  "source_email" : {
      "body": "Complete email"
  }
}
`
And then POST the email to the /api/SmartEmail/categorize endpoint.  It is easy to use 'Postman' (https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)

Using 'Postman', you can POST to the endpoint:

http://smartemail-hig.bluemix.net/api/SmartEmail/categorize

1.  Set the Type to 'POST'
2.  Set the Endpoint to: http://smartemail-hig.bluemix.net/api/SmartEmail/categorize
3.  Configure the _Authorization_ Tab:  
     Type:  Basic Authorization
     Username: hartford
     Password: h@rtf0rd

4.  Configure the _Body_ Tab:
    Select _Raw_ and make sure the type is _JSON(application/json)_
    *Paste the JSON formatted Email into the Text Box*

5.  Press 'Send'


As an example, the following could be POSTed using the above Technique
`
{
    "id": "COI1_887",
    "source_email": {
        "body": "From: Anne Harper [mailto:aharper@MMinteractive.com] \nSent: Tuesday, July 05, 2016 2:17 PM\nTo: agency.service@thehartford.com\nSubject: RE: Request for Attachment: MM INTERACTIVE, INC.- 76WEGDW5266\n\nCould you please email me copies of the SANDAG insurance certificates?\n\nThank you,\nAnne Harper\n\nFrom: agency.service@thehartford.com [mailto:agency.service@thehartford.com] \nSent: Friday, August 7, 2015 4:07 AM\nTo: aharper@MMinteractive.com\nSubject: Request for Attachment: MM INTERACTIVE, INC.- 76WEGDW5266\n\n \n   \n\n\nAugust 7, 2015\n\nAccount Name : MM INTERACTIVE, INC. \n\nComments : \n\nPer Your Request.\n\nPlease do not reply back to this email. You may contact us directly at the phone number or e-mail address noted below.\n\nThank you. \n\nYour Hartford Services Team,\n\n(877)853-2582 (Agency Callers)\n(866)467-8730 (Policyholders)\nAgency.Services@TheHartford.com (All Customers)\n\n\n************************************************************\nThis communication, including attachments, is for the exclusive use of addressee and may contain proprietary, confidential and/or privileged information.  If you are not the intended recipient, any use, copying, disclosure, dissemination or distribution is strictly prohibited.  If you are not the intended recipient, please notify the sender immediately by return e-mail, delete this communication and destroy all copies.\n************************************************************",
        "subject": "RE: Request for Attachment: MM INTERACTIVE, INC.- 76WEGDW5266"
    }
}
`

### Ground Truth

If you have Ground Truth (What you expect Watson to find then it should be provided in the initial POST as well):

`
{ "id": "someemailid",
  "source_email" : {
      "body": "Complete email"
  },
  "ground_truth": {
    "transaction_types": [
       {
         "transaction_type" : "Request_for_CERT"
       }
    ],
    "extracted_entities" : [
      {
        "text":"text to find",
        "type":"type of entity"
      }
    ]
  }
}
`

### Adding/changing users

The user names and passwords can be modified in the /server/boot/init-access.js file.
