var app = angular.module('cgPartner', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

app.controller('cgPartnerCtrl', function($scope, $timeout, $window) {

    $window.scope = $scope;
    $scope.scorecard = {};
    $scope.scores = {};
    $scope.sendReportButtonText = "Send";

    $scope.renderScorecard = function(scorecardObj) {

      $scope.scorecard = scorecardObj.scorecard;
      $scope.scores = scorecardObj.scorecard.scores;

      $scope.totalCost = $scope.scorecard.total_cost;
      $scope.byoCost = $scope.scorecard.total_cost;

      $scope.scorecard.scores.sort(scoreSort);

      angular.forEach($scope.scorecard.scores, function (score) {
        score.cloud_rank = Math.ceil(score.rank / 4);
      });

      // Call functions to calculate the highest TCO value from the Scorecard scores
      $scope.maxTco = 0;
      getMaxTco($scope.scorecard.scores, $scope.byoCost, $scope.maxTco);

      // We need this timeout to ensure we don't start the rendering process until the element has been completely rendered
      $scope.$apply();
      $timeout($scope.render(), 0);
    };

    function scoreSort(a, b) {
      var a_rank = Math.ceil(a.rank / 4);
      var b_rank = Math.ceil(b.rank / 4);

      return b_rank - a_rank;
    }

    function getMaxTco(scores, byoCost, maxTco) {
      if (byoCost > 0) {
        angular.forEach(scores, function(score) {
          if (score.tco > maxTco) maxTco = score.tco;
        });
        if (byoCost > maxTco) maxTco = byoCost;
      }
      // Update $scope.maxTco with the new TCO value
      $scope.maxTco = maxTco;
    }

    $scope.maxTCO = function() {
      var tcoMax = $scope.totalCost;

      for(var i = 0; i < $scope.scorecard.scores.length; i++){
        if($scope.scorecard.scores[i].tco > tcoMax) {
          tcoMax = $scope.scorecard.scores[i].tco;
        }
      }

      return tcoMax;
    };

    $scope.formatCurrency = function(value) {
      var currencyValue = value,
          currencyValueFormatted;

      // Use accounting.js "formatMoney()" to format the currency value
      currencyValueFormatted = accounting.formatMoney(currencyValue, {
        symbol: "$",
        precision: 2,
        thousand: ","
      });

      // Return the formatted currency value
      return currencyValueFormatted;
    }

    function renderArch(ctx, x, y, radius, start, slice, color) {
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, start, slice);
      ctx.closePath();
      ctx.fill();
    }

    function renderText(ctx, text, size, y, x, color, bold) {
      if (bold) {
        ctx.font = 'bold ' + size + ' Arial';
      } else {
        ctx.font = size + ' Arial';
      }

      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, y, x);
    }

    function renderDial(canvas, score, scoreIndex) {
      var ctx  = canvas.getContext('2d');
      var dial = $(canvas);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dial.outerHeight(dial.outerWidth() * 0.5);

      var x = canvas.height;
      var y = canvas.width / 2;
      var outerRadius = x;
      var innerRadius = outerRadius - (outerRadius * 0.2);

      var start = 0;
      var slice = (2 * Math.PI) * (score.cloud_rank / 100);
      var arcBump = ((2 * Math.PI) - slice) / 2;
      slice = slice + arcBump;

      var scoreColor = '#777';
      var textColor  = 'rgb(25, 53, 97)';
      var shadeColor = '#F5F5F5';

      if (scoreIndex === 0) {
        scoreColor = '#3289C6';
      } else if (scoreIndex === 1) {
        scoreColor = '#193561';
      } else if (scoreIndex === 2) {
        scoreColor = '#86CEE1';
      }

      renderArch(ctx, x, y, outerRadius, start, slice, scoreColor);
      renderArch(ctx, x, y, outerRadius, slice, 2 * Math.PI, shadeColor);
      renderArch(ctx, x, y, innerRadius, 0, 2 * Math.PI, 'white');

      renderText(ctx, score.cloud_rank, '6rem', y, canvas.height - 45, scoreColor, true);
      renderText(ctx, 'CloudRank™',     '2rem', y, canvas.height - 1,  textColor);
    }

    $scope.render = function() {
      if ($scope.scorecard.scores) {
        angular.forEach($scope.scorecard.scores, function (score) {
          var selector = '.cloud-rank-score[data-provider="' + score.service_provider + '"] > canvas.dial';
          var canvas   = $(selector).get(0);
          var scoreIndex = $scope.scorecard.scores.indexOf(score);

          if (canvas) {
            renderDial(canvas, score, scoreIndex);
          }
        });
      }
    }

    $scope.sendReport = function(email) {
      $scope.sendReportStatus = {
        "status": null,
        "message": null
      };

      if (email) {
        var requestUrl = $scope.baseApiPath + "send-report/" + $scope.scorecard.id;
        var requestBody = {
          "emailTo": email
        };

        $scope.sendReportButtonText = "Sending...";

        $.ajax({
            url: requestUrl,
            method: 'POST',
            data: requestBody,
            type: 'JSON',
            success: function (data) {
              $timeout(function() {
                $scope.sendReportButtonText = 'Send';
                $scope.sendReportStatus = {
                  "status": "success",
                  "message": "The detailed report was successfully sent."
                };
              }, 0);
            },
            error: function (jqXHR, textStatus, err) {
              $timeout(function() {
                $scope.sendReportButtonText = 'Send';
                $scope.sendReportStatus = {
                  "status": "error",
                  "message": err
                };
              }, 0);
            }
        });

      }

    }

    $scope.setBaseApiPath = function(path) {
      $scope.baseApiPath = path;
    }

    $(document).ready(function() {
      $(window).on("resize", function() {
        $scope.render();
      });
      $('#cg-partner-scorecard').on("shown.bs.modal", function() {
        $scope.render();
      });
    });

});
