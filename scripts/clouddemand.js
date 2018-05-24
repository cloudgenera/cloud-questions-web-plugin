/**
 * CloudDemand - Capture cloud leads using the CloudGenera cloud decision engine
 * Check http://github.com/cloudgenera for official releases
 * @author CloudGenera
 **/
;(function ($) {
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

    var scorecardId;

    var getCategories = function () {
        $.ajax({
            url: opts.baseUrl + opts.urls.categories,
            headers: opts.headers,
            success: function (data) {
                var categories = data.categories,
                    selectDest = $('#category'),
                    temp = [],
                    c;

                temp.push('<option value="">Select an option...</option>');

                for (var i = 0; i < categories.length; i++) {
                    c = categories[i];
                    temp.push('<option value="' + c.uuid + '">' + c.category + '</option>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                alertHandler("error", "There was a problem accessing api endpoints. " + err);
            }
        });
    };

    var getBundles = function () {
        $.ajax({
            url: opts.baseUrl + opts.urls.bundles,
            headers: opts.headers,
            success: function (data) {
                var bundles = data.bundles,
                    selectDest = $('#bundles'),
                    temp = [],
                    innerBundles;

                for (var i = 0; i < bundles.length; i++) {
                    innerBundles = bundles[i].bundles;
                    temp.push('<div class="bundle-section clearfix">');
                    temp.push('<p class="h4">' + bundles[i].name + '</p>');
                    for (var t = 0; t < innerBundles.length; t++) {
                        temp.push('<div class="checkbox">');
                        temp.push('<label>');
                        temp.push('<input type="checkbox" class="concerns" data-key="' + bundles[i].key + '" value="' + innerBundles[t].uuid + '">' + innerBundles[t].bundleName);
                        temp.push('</label>');
                        temp.push('</div>');
                    }
                    temp.push('</div>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                alertHandler("error", "There was a problem accessing api endpoints. " + err);
            }
        });
    };

    var getCandidate = function (uuid) {
        var requestUrl = opts.baseUrl + opts.urls.candidates;

        requestUrl = requestUrl.replace('{' + opts.uuidVar + '}', uuid);

        $.ajax({
            url: requestUrl,
            headers: opts.headers,
            success: function (data) {
                var candidates = data.candidates,
                    selectDest = $('#candidate'),
                    temp = [],
                    c;

                temp.push('<option value="">Select an option...</option>');

                for (var i = 0; i < candidates.length; i++) {
                    c = candidates[i];
                    temp.push('<option value="' + c.uuid + '">' + c.candidateName + '</option>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                alertHandler("error", "There was a problem accessing api endpoints. " + err);
            }
        });
    };

    var getScenarios = function (uuid) {
        var requestUrl = opts.baseUrl + opts.urls.candidate;

        requestUrl = requestUrl.replace('{' + opts.uuidVar + '}', uuid);

        $.ajax({
            url: requestUrl,
            headers: opts.headers,
            success: function (data) {
                var scenarios = data.scenarios,
                    selectDest = $('#scenario'),
                    temp = [],
                    s;

                temp.push('<option value="">Select an option...</option>');

                for (var i = 0; i < scenarios.length; i++) {
                    s = scenarios[i];
                    temp.push('<option value="' + s.uuid + '">' + s.name + '</option>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                alertHandler("error", "There was a problem accessing api endpoints. " + err);
            }
        });
    };

    var validateForm = function () {
        return typeof $('#category').val() !== 'undefined'
            && typeof $('#candidate').val() !== 'undefined'
            && typeof $('#scenario').val() !== 'undefined'
    };

    var score = function (candidateUuid, scenarioUuid) {
        var output = $('#output'),
            myData = {},
            requestUrl = opts.baseUrl + opts.urls.score;

        requestUrl = requestUrl.replace('{' + opts.candidateUuidVar + '}', candidateUuid);
        requestUrl = requestUrl.replace('{' + opts.scenarioUuidVar + '}', scenarioUuid);

        $('.concerns:checked').each(function () {
            var $this = $(this),
                key = $this.data('key'),
                val = $this.val();

            if (typeof myData[key] === 'undefined') {
                myData[key] = [];
            }

            myData[key].push(val);
        });

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

        function resetScoreButton() {
          $('#btn-score').removeAttr('disabled').text('Generate Scorecard, again');
          $('#btn-score').remove("score-wait");
        }
    };

    var validateAndScore = function (candidateUuid, scenarioUuid) {
        if (validateForm()) {
            $('#btn-score').attr('disabled', 'disabled').text('Generating Scorecard...');
            $('#btn-score').append('&nbsp;<i id="score-wait" class="fa fa-spinner fa-pulse fa-fw"></i>');
            score(candidateUuid, scenarioUuid);
        } else {
            alertHandler("warning", "Invalid form entries.");
        }
    };

    var setupAndLoad = function () {
        getCategories();
        getBundles();

        $(document).on('change', '#category', function () {
            getCandidate($('#category').val());
        });

        $(document).on('change', '#candidate', function () {
            getScenarios($('#candidate').val());
        });

        $(document).on('submit', '#main-form', function (e) {
            e.preventDefault();
            validateAndScore($('#candidate').val(), $('#scenario').val());
        });

        $(document).on('click', '#btn-send-report', function () {
            sendScorecardReport($('#input-email').val(), scorecardId);
        });

        $(document).on('click', '#main-alert-close', function() {
           $('#main-alert-inner').hide();
        })
    };

    var generateScorecard = function(scorecardObj) {
        // Set scorecardId on parent scope
        scorecardId = scorecardObj.scorecard.id;

        var scorecard = scorecardObj.scorecard;
        var scores = scorecard.scores;
        scores.sort(scoreSort);

        var byoCost = scorecard.total_cost;
        var maxCost = getMaxTco(scores, byoCost);

        // Reset generated Scorecard content from previous runs
        $('#scorecard-providers').empty();
        $('#scorecard-cloudrank-score').empty();
        $('#scorecard-service-level-fit').empty();
        $('#scorecard-security-fit').empty();
        $('#scorecard-technology-fit').empty();
        $('#scorecard-tco').empty();

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
    };

    var sendScorecardReport = function (email, scorecardId) {

      $('#btn-send-report').attr('disabled', 'disabled').text('Sending...');
      $('#btn-send-report').append('&nbsp;<i id="report-wait" class="fa fa-spinner fa-pulse fa-fw"></i>');

      if (email) {
        var requestUrl = opts.baseUrl + opts.urls.report;
        requestUrl = requestUrl.replace('{' + opts.scorecardUuidVar + '}', scorecardId);

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
      }
      else {
        alertHandler("warning", "Please enter a valid email address.");
        resetSendReportButton();
      }

      function resetSendReportButton() {
        // Reset "send report" button status
        $('#btn-send-report').removeAttr('disabled').text('Send It!');
        $('#btn-send-report').remove("report-wait");
      }

    };

    function scoreSort(a, b) {
      var a_rank = Math.ceil(a.rank / 4);
      var b_rank = Math.ceil(b.rank / 4);

      return b_rank - a_rank;
    }

    function getMaxTco(scores, byoCost) {
      var tmpArray = [];
      var tmpMaxTco;

      for (var i = 0; i < scores.length; i++) {
        tmpArray.push(scores[i].tco);
      }
      tmpArray.push(byoCost);
      tmpArray = tmpArray.filter(Number);

      tmpMaxTco = Math.max.apply(null, tmpArray);

      return tmpMaxTco;
    };

    function formatCurrency(value) {
      var currencyValue = value;
      var currencyValueFormatted;

      // Use accounting.js "formatMoney()" to format the currency value
      currencyValueFormatted = accounting.formatMoney(currencyValue, {
        symbol: "$",
        precision: 2,
        thousand: ","
      });

      // Return the formatted currency value
      return currencyValueFormatted;
    }

    function renderDial(dIndex, dValue) {
      var dial = [];
      dial[dIndex] = new JustGage({
        id: "score-dial-" + dIndex,
        value: dValue,
        min: 0,
        max: 100,
        width: 200,
        height: 100,
        title: "",
        label: "CloudRank™",
        hideMinMax: true,
        relativeGaugeSize: true,
        counter: true,
        levelColors: ['#BF0000', '#BF0000', '#BF0000', '#BF0000', '#BF0000', '#FF8300', '#FF8300', '#DFDF00', '#47DF00', '#47DF00'],
        levelColorsGradient: true
      });
    };

    function alertHandler(alertType, alertMessage) {
      var ac, am;

      switch (alertType) {
        case "error":
          ac = "alert-danger";
          am = "<strong>Error: </strong> ";
          break;
        case "warning":
          ac = "alert-warning";
          am = "<strong>Warning: </strong> ";
          break;
        case "success":
          ac = "alert-success";
          am = "<strong>Success: </strong> ";
          break;
        case "info":
        default:
          ac = "alert-info";
          am = "<strong>Info: </strong> ";
      }

      $('#main-alert').removeClass('hidden').show();
      $('#main-alert-inner').removeClass().addClass('alert ' + ac).show();
      $('#main-alert-text').empty().html(am + alertMessage);
    }

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

    function forTestingPurposesOnly() {
        //--------------------------
        // FOR TESTING PURPOSES ONLY:
        //--------------------------
        // 1) Uncomment the line below and add your API key just to see if things are working.
        // 2) When you're done testing, remove your API key from code and re-comment the line.
        // 3) Seriously, remove your API key from code before you deploy to production. Just sayin'.

        //opts.headers = {'X-Api-Key':'YOUR-API-KEY-GOES-HERE'};
    }

})(jQuery);
