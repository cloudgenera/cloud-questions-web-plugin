## CloudGenera "Cloud Questions" Web Plugin

### Part 1: Back-end Integration Steps

1) Choose or define an API base URL to use (ex. https://mydomain.com/cg-partner). In the next step, the required Partner API endpoints should be accessible from this API base URL.

2) Create the following API endpoints:

| Partner Endpoints | Calls to CloudGenera Endpoints |
| ----------------- | ------------------------------ |
| GET /bundles      | GET /api/v1/partner/bundles    |
| GET /categories      | GET /api/v1/partner/categories    |
| GET /categories/{uuid}      | GET /api/v1/partner/categories/{uuid}    |
| GET /candidate/{uuid}      | GET /api/v1/partner/candidate/{uuid}    |
| POST /candidate/{uuid}/scenario/{uuid}      | POST /api/v1/partner/candidate/{uuid}/scenario/{uuid}    |
| POST /send-report/{uuid}      | POST /api/v1/partner/send-report/{uuid}    |

For reference, the CloudGenera API base URL is https://cloudgenera.com/

A working example of the aforementioned endpoints can be found in the backend-examples/node directory. Installations of NodeJs and NPM are required. Edit app.js, and add your Partner API key to the line:

```javascript
var cgPartnerApiKey = "YOUR PARTNER API KEY GOES HERE";
```

**API Authentication**

On each outbound request from the Partner API to the CloudGenera API, your Partner API key must be included in the request header, like so:

```
"x-api-key": "PARTNER_API_KEY"
```

If you do not have an API key, please work with your CloudGenera sales representative to obtain one.

---

### Part 2: Front-end Integration Steps

1) Extract and stage the following source files in a web accessible directory:

| Filename | Description |
| -------- | ----------- |
| cloudgenera-sample-report.pdf | Sample CloudAssist detailed report |
| cloudgenera-scorecard-modal.html | Customizable template for Scorecard modal |
| index.html | Bare-bones example “Cloud Questions” landing page |
| scripts/cloudgenera-plugin-angular.js | Required Angular source plugin |
| scripts/cloudgenera-plugin-jquery.js | Required jQuery source plugin |
| styles/cloudgenera-partner.css | Customizable stylesheet for Scorecard modal |

2) Insert the following code in the `<head>` section of your document. Update paths to source files as appropriate.

```html
<!-- Load required stylesheets -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
    integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="styles/cloudgenera-partner.css">

<!-- Load required libraries and plugins -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
    integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.14/angular.min.js"></script>
<script src="scripts/accounting.min.js"></script>
<script src="scripts/cloudgenera-plugin-jquery.js"></script>
<script src="scripts/cloudgenera-plugin-angular.js"></script>

<!-- Instruct Angular to search current path for ng-include partials -->
<base href=".">
```

3) Insert the following code into the `<body>` section of your document:

```html
<!-- START: CloudGenera Partner Content Container -->
<div id="cg-partner-content-container" ng-app="cgPartner" ng-controller="cgPartnerCtrl">

  <div>
    <div id="cg-partner-questions" class="clearfix"></div>
  </div>

  <div>
    <div id="cg-partner-scorecard" class="modal fade">
      <div class="modal-dialog modal-lg">
        <div ng-include="'cloudgenera-scorecard-modal.html'"></div>
      </div>
    </div>
  </div>

  <script>
    $(document).ready(function () {
      var baseApiPath = 'https://cloudgenera.com/api/v1/marketing/';

      var scorecardResults = function(scorecard) {
        var s = JSON.parse(scorecard);
        scope.setBaseApiPath(baseApiPath);
        scope.renderScorecard(s);
        $('#cg-partner-scorecard').modal();
      };

      $('#cg-partner-questions').CloudGeneraPartner(baseApiPath, scorecardResults, false);
      scope.render();
    });
  </script>

</div>
<!-- END: CloudGenera Partner Content Container -->
```

4) Customize the following line with your chosen API base URL (from Back-end Integration Steps above):

Find:
```javascript
var baseApiPath = 'https://cloudgenera.com/api/v1/marketing/';
```

Change to (as an example):
```javascript
var baseApiPath = 'https://mydomain.com/cg-partner/';
```
