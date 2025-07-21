"use strict";
const express = require('express');
//const cors = require ('cors');
var Readable = require('stream').Readable;
const bodyParser = require("body-parser");
//const dotenv = require('dotenv');
//const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json())
var hana = require("@sap/hana-client");
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
const axios = require('axios');
const qs = require('qs');

const clientId = 'sb-5a4cc893-075b-4847-aa0c-64ac8e5341eb!b5357|dmc-services-quality!b330';
const clientSecret = 'h6fLBaZ8fs1PScAUhpMTlQoG0+8=';
const tokenUrl = 'https://ritsdmc-az12fc9w.authentication.eu20.hana.ondemand.com/oauth/token';
const dmcBaseUrl = 'https://api.test.eu20.dmc.cloud.sap';

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin,x-csrf-token, X-Requested-With,x-dme-plant,x-dme-industry-type,x-features,X-Sap-Cid, contentType,Content-Type, Accept, Authorization");
    next();
});



app.post('/api/startProcess', async (req, res) => {
    try {
        // Get plant from body or query
        const plant = req.body.plant || req.query.plant;

        if (!plant) {
            return res.status(400).send("Missing 'plant' parameter");
        }
        // Step 1: Get OAuth token
        const tokenResponse = await axios.post(tokenUrl, qs.stringify({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        console.log("Access Token URL: ", accessToken);
        // Step 2: Call the actual DMC process API
        const dmcApiUrl = `${dmcBaseUrl}/pe/api/v1/process/processDefinitions/start?key=REG_28c653a2-8694-4893-b5a5-9dca3f760765&async=false`;

        const processResponse = await axios.post(dmcApiUrl, {
            plant: plant
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Process Start Response:", JSON.stringify(processResponse.data, null, 2));
        console.log("finalOutCome: ", processResponse.data.finalOutCome);
        res.status(200).json({
            message: "Process started successfully",
            data: processResponse.data
        });
    } catch (error) {
        console.error("Error starting process:", error?.response?.data || error.message);
        res.status(500).json({
            error: error?.response?.data || "Internal Server Error"
        });
    }
});

