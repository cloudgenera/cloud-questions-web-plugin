# Upgrading to CloudDemand 2.0

CloudDemand 2.0 introduces breaking changes to 1.x installations. As such, the following manual steps may be taken to remediate changes in existing CloudDemand installations.

**IMPORTANT NOTE:**

**IF your CloudDemand installation is highly customized** and deviates greatly from the original code, we recommended that you perform all the changes listed below.

**IF your CloudDemand installation is NOT highly customized**, we recommend that you simply:
  - Download the latest version of `scripts/clouddemand.js` into your existing CloudDemand installation, being mindful of any small customizations you want to carryover to the updated library.

  - Perform ONLY the steps in the [CloudDemand HTML Front-end Changes](#clouddemand-html-front-end-changes) section.

## CloudDemand HTML Front-end Changes

### Change #1

Update references to the CloudDemand invocation in your CloudDemand front-end page, template, or blade.

  Find:
  ```javascript
<!-- Required CloudDemand INIT invocation -->
<script>
  $(document).ready(function () {
    var baseApiPath = 'https://cloudgenera.com/api/v1/partner/';
    $().CloudDemandInit(baseApiPath);
  });
</script>
  ```

  Replace with:
  ```javascript
<!-- CloudDemand Invocation -->
<script>
  $(document).ready(function () {
    $().CloudDemandInit('XXXXXXXXXXXXXXXXXXXX'); // Your partner code goes here
  });
</script>
  ```
  Where `XXXXXXXXXXXXXXXXXXXX` is your CloudDemand partner code. If you do not have a CloudDemand partner code, please contact your CloudGenera account representative to obtain one.

## CloudDemand Javascript Library Updates

The following changes are to be made in the CloudDemand core javascript library `scripts/clouddemand.js`.

### Change #1
By default, CloudDemand should now communicate with the CloudDemand Partner Proxy service, instead of making direct calls to the CloudGenera API.

  Find:
  ```javascript
  const defaultOptions = {
          debugEnabled: false,
          baseUrl: 'https://cloudgenera.com/api/v1/partner/',
          uuidVar: 'uuid',
          candidateUuidVar: 'candidateUuid',
          scenarioUuidVar: 'scenarioUuid',
          scorecardUuidVar: 'scorecardUuid',
          bundlesDestination: 'bundles',
          categoriesDestination: 'category',
          candidatesDestination: 'candidate',
          scenariosDestination: 'scenario',
          urls: {
              categories: 'categories',
              candidates: 'categories/{uuid}',
              candidate: 'candidate/{uuid}',
              bundles: 'bundles',
              score: 'candidate/{candidateUuid}/scenario/{scenarioUuid}',
              report: 'send-report/{scorecardUuid}'
          },
          headers: {}
        };
  ```

  Replace with:
  ```javascript
  const defaultOptions = {
          baseUrl: 'https://{partnerId}.cloudgenera.com/partner/api/v1/clouddemand/',
          uuidVar: 'uuid',
          partnerIdVar: 'partnerId',
          candidateUuidVar: 'candidateUuid',
          scenarioUuidVar: 'scenarioUuid',
          scorecardUuidVar: 'scorecardUuid',
          bundlesDestination: 'bundles',
          categoriesDestination: 'category',
          candidatesDestination: 'candidate',
          scenariosDestination: 'scenario',
          urls: {
              categories: 'categories',
              candidates: 'categories/{uuid}',
              candidate: 'candidate/{uuid}',
              bundles: 'bundles',
              score: 'candidate/{candidateUuid}/scenario/{scenarioUuid}',
              report: 'send-report/{scorecardUuid}'
          },
          headers: {}
        };
  ```

### Change #2

Make sure POST data is properly formatted JSON and contentType is correctly set.

  Find:
  ```javascript
  $.ajax({
      url: requestUrl,
      headers: opts.headers,
      method: 'POST',
      data: myData,
      type: 'JSON',
      success: function (data) {
          resetScoreButton();

          // Generate Scorecard and open modal
          generateScorecard(data);
          $("#scorecard-modal").modal();
      },
      error: function (jqXHR, textStatus, err) {
          alertHandler("error", "There was a problem generating the scorecard. " + err);
          resetScoreButton();
      }
  });
  ```

  Replace with:
  ```javascript
  myData = JSON.stringify(myData);

  $.ajax({
      url: requestUrl,
      headers: opts.headers,
      method: 'POST',
      data: myData,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
          resetScoreButton();

          // Generate Scorecard and open modal
          generateScorecard(data);
          $("#scorecard-modal").modal();
      },
      error: function (jqXHR, textStatus, err) {
          alertHandler("error", "There was a problem generating the scorecard. " + err);
          resetScoreButton();
      }
  });
  ```  

### Change #3

Make sure POST data is properly formatted JSON and contentType is correctly set. Better notifications.

  Find:
  ```javascript
  var requestBody = {"emailTo": email};

  $.ajax({
      url: requestUrl,
      headers: opts.headers,
      method: 'POST',
      data: requestBody,
      type: 'JSON',
      success: function (data) {
        alertHandler("success", "A detailed report was sent to " + email);
        resetSendReportButton();
      },
      error: function (jqXHR, textStatus, err) {
        alertHandler("error", "There was a problem sending the report.");
        resetSendReportButton();
      }
  });
  ```

  Replace with:
  ```javascript
  var requestBody = JSON.stringify({ emailTo: email });

  $.ajax({
      url: requestUrl,
      headers: opts.headers,
      method: 'POST',
      data: requestBody,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        alertHandler("success", "A detailed report was sent to " + email);
        resetSendReportButton();
      },
      error: function (jqXHR, textStatus, err) {
        if (jqXHR.status === 200) {
          alertHandler("success", "A detailed report was sent to " + email);
        } else {
          alertHandler("error", "There was a problem sending the report.");
        }
        resetSendReportButton();
      }
  });
  ```  

### Change #4

Fixes IE 11 compatibility issues. IE 11 and prior versions do not support Javascript template literals.

  Find:
  ```javascript
  // Parse returned Scorecard object
  for (var i = 0; i < scores.length; i++) {
      var generateHtml;
      var index = i;
      var score = scores[i];

      // Normalize CloudRank score
      score.cloud_rank = Math.ceil(score.rank / 4);

      // Generate Service Provider names section
      generateHtml = `
        <div class="col-sm-4">
          <h3 class="text-center">` + score.service_provider + `</h3>
        </div>`;
      $('#scorecard-providers').append(generateHtml);

      // Generate CloudRank score and gauge
      generateHtml = `
        <div class="col-sm-4" style="margin: 0px; padding: 0px;">
          <div id="score-dial-` + index + `" style="width=100%; margin-top: -50px; padding: 0px;"></div>
        </div>`;
      $('#scorecard-cloudrank-score').append(generateHtml);
      renderDial(index, score.cloud_rank);

      // Generate Service Level Fit score section
      generateHtml = `
        <div class="col-sm-4">
          <h4>Service Level Fit</h4>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width:` + score.sla + `%;" aria-valuenow="` + score.sla + `" aria-valuemin="0" aria-valuemax="100">
                <span>` + score.sla + `</span>
              </div>
            </div>
          </div>
        </div>`;
      $('#scorecard-service-level-fit').append(generateHtml);

      // Generate Security Fit score section
      generateHtml = `
        <div class="col-sm-4">
          <h4>Security Fit</h4>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width:` + score.com + `%;" aria-valuenow="` + score.com + `" aria-valuemin="0" aria-valuemax="100">
              <span>` + score.com + `</span>
            </div>
          </div>
        </div>`;
      $('#scorecard-security-fit').append(generateHtml);

      // Generate Technology Fit score section
      generateHtml = `
        <div class="col-sm-4">
          <h4>Technology Fit</h4>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width:` + score.tech + `%;" aria-valuenow="` + score.tech + `" aria-valuemin="0" aria-valuemax="100">
              <span>` + score.tech + `</span>
            </div>
          </div>
        </div>`;
      $('#scorecard-technology-fit').append(generateHtml);

      // Generate Total Cost of Ownership section
      generateHtml = `
        <div class="col-sm-4">
          <h3>Total Cost of Ownership</h3>
          <div class="row">
            <div class="col-sm-12">
              <h5>` + score.service_provider + `</h5>
            </div>
            <div class="col-sm-5">
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ` + ((score.tco/maxCost) * 100) + `%;" aria-valuenow="` + ((score.tco/maxCost) * 100) + `" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="col-sm-7">
              <p>` + formatCurrency(score.tco) + `</p>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <h5>Build your own</h5>
            </div>
            <div class="col-sm-5">
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ` + ((byoCost/maxCost) * 100) + `%;"  aria-valuenow="` + ((byoCost/maxCost) * 100) + `" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="col-sm-7">
              <p>` + formatCurrency(byoCost) + `</p>
            </div>
          </div>
        </div>
      `;
      $('#scorecard-tco').append(generateHtml);
  }
  ```

  Replace with:
  ```javascript
  // Parse returned Scorecard object
  for (var i = 0; i < scores.length; i++) {
      var generateHtml;
      var index = i;
      var score = scores[i];

      // Normalize CloudRank score
      score.cloud_rank = Math.ceil(score.rank / 4);

      // Generate Service Provider names section
      generateHtml = ' \
        <div class="col-sm-4"> \
          <h3 class="text-center">' + score.service_provider + '</h3> \
        </div>';
      $('#scorecard-providers').append(generateHtml);

      // Generate CloudRank score and gauge
      generateHtml = ' \
        <div class="col-sm-4" style="margin: 0px; padding: 0px;"> \
          <div id="score-dial-' + index + '" style="width=100%; margin-top: -50px; padding: 0px;"></div> \
        </div>';
      $('#scorecard-cloudrank-score').append(generateHtml);
      renderDial(index, score.cloud_rank);

      // Generate Service Level Fit score section
      generateHtml = ' \
        <div class="col-sm-4"> \
          <h4>Service Level Fit</h4> \
            <div class="progress"> \
              <div class="progress-bar" role="progressbar" style="width:' + score.sla + '%;" aria-valuenow="' + score.sla + '" aria-valuemin="0" aria-valuemax="100"> \
                <span>' + score.sla + '</span> \
              </div> \
            </div> \
          </div> \
        </div>';
      $('#scorecard-service-level-fit').append(generateHtml);

      // Generate Security Fit score section
      generateHtml = ' \
        <div class="col-sm-4"> \
          <h4>Security Fit</h4> \
          <div class="progress"> \
            <div class="progress-bar" role="progressbar" style="width:' + score.com + '%;" aria-valuenow="' + score.com + '" aria-valuemin="0" aria-valuemax="100"> \
              <span>' + score.com + '</span> \
            </div> \
          </div> \
        </div>';
      $('#scorecard-security-fit').append(generateHtml);

      // Generate Technology Fit score section
      generateHtml = ' \
        <div class="col-sm-4"> \
          <h4>Technology Fit</h4> \
          <div class="progress"> \
            <div class="progress-bar" role="progressbar" style="width:' + score.tech + '%;" aria-valuenow="' + score.tech + '" aria-valuemin="0" aria-valuemax="100"> \
              <span>' + score.tech + '</span> \
            </div> \
          </div> \
        </div>';
      $('#scorecard-technology-fit').append(generateHtml);

      // Generate Total Cost of Ownership section
      generateHtml = ' \
        <div class="col-sm-4"> \
          <h3>Total Cost of Ownership</h3> \
          <div class="row"> \
            <div class="col-sm-12"> \
              <h5>' + score.service_provider + '</h5> \
            </div> \
            <div class="col-sm-5"> \
              <div class="progress"> \
                <div class="progress-bar" role="progressbar" style="width: ' + ((score.tco/maxCost) * 100) + '%;" aria-valuenow="' + ((score.tco/maxCost) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div> \
              </div> \
            </div> \
            <div class="col-sm-7"> \
              <p>' + formatCurrency(score.tco) + '</p> \
            </div> \
          </div> \
          <div class="row"> \
            <div class="col-sm-12"> \
              <h5>Build your own</h5> \
            </div> \
            <div class="col-sm-5"> \
              <div class="progress"> \
                <div class="progress-bar" role="progressbar" style="width: ' + ((byoCost/maxCost) * 100) + '%;"  aria-valuenow="' + ((byoCost/maxCost) * 100) + '" aria-valuemin="0" aria-valuemax="100"></div> \
              </div> \
            </div> \
            <div class="col-sm-7"> \
              <p>' + formatCurrency(byoCost) + '</p> \
            </div> \
          </div> \
        </div>';
      $('#scorecard-tco').append(generateHtml);
  }
  ```  

### Change #5

Allows CloudDemandInit function to accept CloudDemand Partner Code. Part of changeset to implement new CloudDemand Partner Proxy service.

  Find:
  ```javascript
  $.fn.CloudDemandInit = function(options) {
      opts = defaultOptions;

      if (typeof options === 'string') {
          opts.baseUrl = options
      } else {
          options = options || {};

          $.each(options, function(i, v) {
              opts[i] = v;
          });
      }

      forTestingPurposesOnly();

      setupAndLoad();
  };
  ```

  Replace with:
  ```javascript
  $.fn.CloudDemandInit = function(id, baseUrlOverride) {
      opts = defaultOptions;

      if (typeof id === 'string') {
        opts.baseUrl = opts.baseUrl.replace('{' + opts.partnerIdVar + '}', id);
      } else {
        alertHandler("error", "Invalid argument passed to CloudDemandInit function. Argument must be a string.");
      }

      // Override opts.baseUrl value if valid argument is passed
      if (typeof baseUrlOverride === 'string') {
        opts.baseUrl = baseUrlOverride;
      }

      setupAndLoad();
  };
  ```

### Change #6

Removal of the forTestingPurposesOnly() function.

  Find and Remove:
  ```javascript
  function forTestingPurposesOnly() {
      //--------------------------
      // FOR TESTING PURPOSES ONLY:
      //--------------------------
      // 1) Uncomment the line below and add your API key just to see if things are working.
      // 2) When you're done testing, remove your API key from code and re-comment the line.
      // 3) Seriously, remove your API key from code before you deploy to production. Just sayin'.

      //opts.headers = {'X-Api-Key':'YOUR-API-KEY-GOES-HERE'};
  }
  ```
