# Voice of the Customer Application Accelerator

## Overview

This Watson Accelerator demonstrates how multiple channels of communication with customers can be analyzed by Watson to
provide a high level view of the sentiment towards products, services and brand.  This information can be used for
proactive responses to customer demands and issue resolution, training of staff or allocation.

# Description

This Accelerator requires Watson Discovery Service, Cloudant.  You can also, optionally, use Watson Knowledge Studio and
Watson Conversation API for custom enrichments.

The Accelerator provides you with the ability to load your own content into WDS.

# Required Services

This Accelerator requires 2 services to be created.  You can reuse services by binding existing services to this application.

- IBM Cloudant noSql Database
- Watson Discovery Service

# Content Preparation

As with all Cognitive solutions, the preparation of the content for Watson is the most important part of the development
process.  This Accelerator required that the content is prepared in a certain format before it is loaded into WDS.  This
Accelerator accepts JSON that is either on your local file system or in a Cloudant database.  There are only 2 fields
required in the JSON for the app to function.

1. text - The content of the customer statement.  This should be something where the customer states the problem or review the product.
2. contact_date - The date when the customer made the statement.  Should be in ISO format YYYY-MM-DDTHH:MM:SSZ.

# Setup Instructions

![](./images/wsl_steps_basic.png)

The setup is done in 3 primary steps.  You will download the code, configure the code and then deploy the code to Bluemix.  If you would
like to run the code locally, there will be one more step to configure the credentials locally.

> Think of a name for your application.  The name must be unique within Bluemix, otherwise it won't deploy.  This name will be used in a number of steps to get the application up and running.

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
  git clone https://github.ibm.com/Watson-Solutions-Lab/voice-of-the-customer-starter-app.git
  `
2. `cd` into this newly created directory
3. Edit the manifest.yml file and replace the name and host values ```voice-of-the-customer-starter-app``` with our own unique name you came up with.
4. Save the manifest.yml file.
5. Edit the package.json file and modify the application name as well.

### Configuration files

There are 2 sample configuration files that are required by the application.

The `env-vars-example.json` file should be copied to `env-vars.json` before the application is executed locally or on Bluemix.

The `vcap-local-example.json` file should be copied to `vcap-local.json` before the application is executed locally.  This file contains your service credentials required to run the application locally.  If the app is run on Bluemix, the app will use the VCAP service information on Bluemix.  The sample file is a skeleton of what is required, but, you have to fill in the details.

## Setting up Bluemix

1. If you do not already have a Bluemix account, [sign up here](https://console.ng.bluemix.net/registration).
2. Log into Bluemix with your own credentials.
3. Create a new application by clicking on the Create App button on the Bluemix Dashboard.
4. On the left navigation, select Cloud Foundry Apps.
5. Click on the SDK for Node.js option on the right.
6. Enter your unique application name you though of before and click the Create button.
7. Wait until the application is started and available.
8. From the Bluemix Dashboard, select the newly created application.
9. Select Connections on the left.

### Create the following services using the procedure below

> Cloudant NoSql Database
> Watson Discovery Service

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

To run the application locally (your own computer), you have to install additional Node.js modules and configure the application with some credentials that is provisioned on Bluemix.

### Starting the application
There are a few quick steps required to stand up the application. In general, the required tasks are.

1. Install the server and client dependencies
2. Commission the required services
3. Configure the environment variables in manifest.yml (cloud deployment) or .env (local deployment)
4. Build and run or deploy

#### Installing the server and client dependencies
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

## Accessing the Application

There are 3 specific users required for this application.

1. The Field Technician is the persona that will log in, few the orders, search for solutions and work on order.  This persona will use the credentials `watson\p@ssw0rd` to log in.
2. The second persona is the Device that will send events via IoT to the application.  With this credentials, you will have access to the IoT Sender feature to initiate the devices sending events to the platform.  This persona will use the credentials `iot-device\d3v1ce` to log in.
3. The third persona is the administrator and is only to load and setup the data required to customize the application for your own needs.  You can log in with this persona using credentials `admin\@dm1n`.

The user names and passwords can be modified in the /server/boot/init-access.js file.
