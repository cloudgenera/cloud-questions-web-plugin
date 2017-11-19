## CloudGenera "CloudDemand" Plugin

### What's in the box?

| Filename | Description |
| -------- | ----------- |
| clouddemand-example1.html | CloudDemand example template |
| scripts/accounting.min.js | Currency formatting library |
| scripts/clouddemand.js | Required CloudDemand library |
| scripts/justgage.js | Animated gauges library |
| scripts/raphael-2.1.4.min.js | Vector graphics library |

---

### Part 1: Back-end Integration Steps

1) Choose or define an API base URL to use (ex. https://mydomain.com/api/clouddemand). In the next step, the required Partner API endpoints should be accessible from this API base URL.

2) Create the following API endpoints:

| Partner API Endpoints | Calls to CloudGenera API Endpoints |
| ----------------- | ------------------------------ |
| GET /bundles      | GET /partner/bundles    |
| GET /categories      | GET /partner/categories    |
| GET /categories/{uuid}      | GET /partner/categories/{uuid}    |
| GET /candidate/{uuid}      | GET /partner/candidate/{uuid}    |
| POST /candidate/{uuid}/scenario/{uuid}      | POST /partner/candidate/{uuid}/scenario/{uuid}    |
| POST /send-report/{uuid}      | POST /partner/send-report/{uuid}    |

For reference, the CloudGenera API base URL is https://cloudgenera.com/api/v1

A working example of the aforementioned endpoints can be found in the backend-examples/node directory. Installations of NodeJs and NPM are required. Edit app.js, and add your Partner API key to the following line:

```javascript
var cgPartnerApiKey = "YOUR PARTNER API KEY GOES HERE";
```

**API Authentication**

On each outbound request from the Partner API to the CloudGenera API, your Partner API key must be included in the request header, like so:

```
"X-Api-Key": "PARTNER_API_KEY"
```

If you do not have an API key, please work with your CloudGenera sales representative to obtain one.

---

### Part 2: Front-end Integration Steps

1) Edit the file `clouddemand-example1.html`, and customize the following line with your chosen API base URL (from Back-end Integration Steps above):

Find:
```javascript
var baseApiPath = 'https://cloudgenera.com/api/v1/partner/';
```

Change to (as an example):
```javascript
var baseApiPath = 'https://mydomain.com/api/clouddemand/';
```

2) Open `clouddemand-example1.html` in a browser window, and verify that basic functionality is working.

3) Use the CloudDemand example templates as the starting point to create a customized CloudDemand experience with your organization's branding.

4) Stage your finalized source files in a web accessible directory.
