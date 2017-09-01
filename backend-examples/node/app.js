'use strict';

//*******************************************************************
//
// Declare required Application Libraries
//
//*******************************************************************

var bodyParser = require('body-parser'),
    express = require('express'),
    router = express.Router(),
    request = require('request'),
    http = require('http');

// Instantiate Express
var app = express();

// Bind Express libraries
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define Express HTTP Server configuration
var httpPort = 55555;
var httpOptions = {};

//------------------------------------------------------------------
// API Configuration
//------------------------------------------------------------------

var cgPartnerApiKey = "YOUR PARTNER API KEY GOES HERE";
var cgPartnerBaseApi = "https://cloudgenera.com/api/v1/partner";

var optRequest = {
  url: cgPartnerBaseApi,
  headers: {
    "X-Api-Key": cgPartnerApiKey
  }
};

//*******************************************************************
//
// Establish Express Routing Configurations
//
//*******************************************************************

//------------------------------------------------------------------
// ROUTES: [GET] /cg-partner/?
//------------------------------------------------------------------

app.get('/cg-partner/test', function(req, res) {
  res.send("I'm alive on channel 5!");
});

app.get('/cg-partner/bundles', function(req, res) {
  request.get({
    url: optRequest.url + '/bundles',
    headers: optRequest.headers
  }).pipe(res);
});

app.get('/cg-partner/categories', function(req, res) {
  request.get({
    url: optRequest.url + '/categories',
    headers: optRequest.headers
  }).pipe(res);
});

app.get('/cg-partner/categories/:uuid', function(req, res) {
  request.get({
    url: optRequest.url + '/categories/' + req.params.uuid,
    headers: optRequest.headers
  }).pipe(res);
});

app.get('/cg-partner/candidate/:uuid', function(req, res) {
  request.get({
    url: optRequest.url + '/candidate/' + req.params.uuid,
    headers: optRequest.headers
  }).pipe(res);
});

//------------------------------------------------------------------
// ROUTE: [POST] /cg-partner/?
//------------------------------------------------------------------

app.post('/cg-partner/candidate/:candidateUuid/scenario/:scenarioUuid', function(req, res) {
  request.post({
    url: optRequest.url + '/candidate/' + req.params.candidateUuid + '/scenario/' + req.params.scenarioUuid,
    headers: optRequest.headers,
    form: req.body
  }).pipe(res);
});

app.post('/cg-partner/send-report/:scorecardUuid', function(req, res) {
  request.post({
    url: optRequest.url + '/send-report/' + req.params.scorecardUuid,
    headers: optRequest.headers,
    form: req.body
  }).pipe(res);
});

//*******************************************************************
//
// Start Express Server Listeners
//
//*******************************************************************

// Start Express HTTP Server
var httpServer = http.createServer(app);
httpServer.listen(httpPort, '0.0.0.0', function() {
  console.log("Express HTTP Server listening on port: " + httpPort);
});
