Steps to Test SAP DMC API Using a Custom Node.js Application

1. Clone the Node.js project from the GitHub repository to your local machine.

2. Navigate to the cloned project directory and install the required dependencies:

        npm install
        npm i axios
		
3. Configure API Credentials
    Open the index.js file and update the following credentials with your actual values:

        const clientId = '<your-client-id>';
        const clientSecret = '<your-client-secret>';
        const tokenUrl = '<your-auth-url>/oauth/token';
        const dmcBaseUrl = '<your-public-api-endpoint>';
		
        🔐 Tip: These values can be retrieved from your SAP BTP subaccount (RITS DMC) under Instances and Subscriptions. Look for the SAP Digital Manufacturing service and view its service key for client ID, secret, and URLs.

4. Update the DMC API Endpoint
        In the index.js file, locate the following line:

        const dmcApiUrl = `${dmcBaseUrl}<url/path>&async=false`;
        Replace <url/path> with the actual API path of your deployed Production Process Design from the Manage Service Registry.
        Example:
            const dmcApiUrl = `${dmcBaseUrl}/pe/api/v1/process/processDefinitions/start?key=REG_28c653a2-8694-4893-b5a5-9dca3f760765&async=false`;
        Also, ensure to pass any required input parameters for the selected API.

5. Deploy the Node.js Application
   
        Push the Node.js application to Cloud Foundry using:
        cf push <application-name>
       💡 You can find the application name in your package.json file under the name field.
        Example:  cf push callingdmcapiincustomnodejs
		
7. Test the Service in Postman
       Once deployed, the app will be accessible via a Cloud Foundry URL.
       Copy the app URL and append your endpoint defined in the index.js file.
       For example, if you defined the endpoint like:

        app.post('/api/startProcess')
        Your full API URL will be: https://callingdmcapiincustomnodejs.cfapps.us10-001.hana.ondemand.com/api/startProcess
		
8. Open Postman and test using:

    Method: POST
   
    Headers:  Content-Type: application/json
   
    Request Body (raw > JSON):
                            {
                                "plant": "Plant Name"
                            }
7. View the Response
        Click Send in Postman to trigger the Node.js service. The service will:
   
        Request an OAuth token,
        Call the SAP DMC API,
        Return the API response.
   
    You should see the actual response from the DMC service in the Postman response panel.
