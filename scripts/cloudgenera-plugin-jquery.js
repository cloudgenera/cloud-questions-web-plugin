;(function ($) {
    var defaultOptions = {
            debugEnabled: false,
            baseUrl: 'https://cloudgenera.com/api/v1/marketing/',
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
            formId: 'main-form',
            containerClass: 'col-md-6 clearfix',
            formElementWrapperClass: 'form-group',
            formElementClasses: 'form-control',
            bundlesContainerClass: 'h5',
            bundlesContainerLabel: 'Which concerns, if any, are important for your application workload?',
            buttonClasses: 'pull-right btn-primary',
            buttonWrapperClass: 'form-group clearfix',
            fields: [
                {
                    label: 'driving',
                    text: 'What is driving your interest in cloud computing?',
                    default: {
                        val: '',
                        text: ''
                    },
                    additionalOptions: [
                        {
                            val: 'new',
                            text: 'New products or service introduction'
                        },
                        {
                            val: 'existing',
                            text: 'Looking for alternatives to existing operations'
                        }
                    ]
                },
                {
                    label: 'category',
                    text: 'Which cloud implementation best represents your workload?',
                    default: {
                        val: '',
                        text: 'Loading...'
                    },
                    additionalOptions: []
                },
                {
                    label: 'candidate',
                    text: 'Which cloud candidate best represents your workload?',
                    default: {
                        val: '',
                        text: 'Loading...'
                    },
                    additionalOptions: []
                },
                {
                    label: 'scenario',
                    text: 'Which scenario best represents your workload?',
                    default: {
                        val: '',
                        text: 'Loading...'
                    },
                    additionalOptions: []
                }
            ]
        },
        opts,
        scorecardCallback,
        finalScorecard = {},
        containerHtml = [];

    var buildContent = function () {
        var f,
            buttonString = '<button type="submit" id="score"';

        // open container
        if (opts.containerClass !== '') {
            containerHtml.push('<div class="' + opts.containerClass + '">');
        } else {
            containerHtml.push('<div>');
        }

        // Add select elements
        for (var i = 0; i < opts.fields.length; i++) {
            f = opts.fields[i];
            containerHtml.push(buildElement(f))
        }

        containerHtml.push(addBundlesContainer());

        // Open button wrapper.
        if (opts.buttonWrapperClass !== '') {
            containerHtml.push('<div class="' + opts.buttonWrapperClass + ' cg-error-container">')
        } else {
            containerHtml.push('<div>');
        }

        if (opts.buttonClasses !== '') {
            buttonString += ' class="' + opts.buttonClasses + '"';
        }

        buttonString += '>Score</button>';
        containerHtml.push(buttonString);

        // Close button wrapper.
        containerHtml.push('</div>');

        if (opts.debugEnabled) {
            if (opts.formElementWrapperClass !== '') {
                containerHtml.push('<div class="' + opts.formElementWrapperClass + '">')
            } else {
                containerHtml.push('<div>')
            }

            containerHtml.push('<label for="output">Scoring JSON</label>');
            containerHtml.push('<textarea cols="50" rows="30" class="form-control" id="output" readonly></textarea>');

            containerHtml.push('</div>');
        }

        // close container
        containerHtml.push('</div>');

        return containerHtml.join('\n');
    };

    var buildElement = function (field) {
        var html = [],
            additional;

        if (opts.formElementWrapperClass !== '') {
            html.push('<div class="' + opts.formElementWrapperClass + '">')
        } else {
            html.push('<div>')
        }

        html.push('<label for="' + field.label + '">' + field.text + '</label>');

        if (opts.formElementClasses !== '') {
            html.push('<select id="' + field.label + '" name="' + field.label + '" class="' + opts.formElementClasses + '">')
        } else {
            html.push('<select id="' + field.label + '" name="' + field.label + '">')
        }

        html.push('<option value="' + field.default.val + '">' + field.default.text + '</option>');

        for (var i = 0; i < field.additionalOptions.length; i++) {
            additional = field.additionalOptions[i];
            html.push('<option value="' + additional.val + '">' + additional.text + '</option>');
        }

        html.push('</select>');

        html.push('</div>');

        return html.join('\n');
    };

    var addBundlesContainer = function () {
        var html = [];

        // Open bundles container
        if (opts.formElementWrapperClass !== '') {
            html.push('<div class="' + opts.formElementWrapperClass + '">')
        } else {
            html.push('<div>')
        }

        // Open bundles label
        if (opts.bundlesContainerClass !== '') {
            html.push('<p class="' + opts.bundlesContainerClass + '">' + opts.bundlesContainerLabel + '</p>')
        } else {
            html.push('<p>' + opts.bundlesContainerLabel + '</p>')
        }

        html.push('<div id="' + opts.bundlesDestination + '">');
        html.push('<p id="bundles-loading"></p>');
        html.push('</div>');

        // Close bundle container
        html.push('</div>');

        return html.join('\n');
    };

    // Ajax functions
    var getCategories = function () {
        $.ajax({
            url: opts.baseUrl + opts.urls.categories,
            success: function (data) {
                var questions = data.categories,
                    selectDest = $('#' + opts.categoriesDestination),
                    temp = [],
                    q;

                temp.push('<option value=""></option>');

                for (var i = 0; i < questions.length; i++) {
                    q = questions[i];
                    temp.push('<option value="' + q.uuid + '">' + q.category + '</option>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                return err;
            }
        });
    };

    var getBundles = function () {
        $.ajax({
            url: opts.baseUrl + opts.urls.bundles,
            success: function (data) {
                var bundles = data.bundles,
                    selectDest = $('#' + opts.bundlesDestination),
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
                return err;
            }
        });
    };

    var getCandidate = function (uuid) {
        var requestUrl = opts.baseUrl + opts.urls.candidates;

        requestUrl = requestUrl.replace('{' + opts.uuidVar + '}', uuid);

        $.ajax({
            url: requestUrl,
            success: function (data) {
                var candidates = data.candidates,
                    selectDest = $('#' + opts.candidatesDestination),
                    temp = [],
                    c;

                temp.push('<option value=""></option>');

                for (var i = 0; i < candidates.length; i++) {
                    c = candidates[i];
                    temp.push('<option value="' + c.uuid + '">' + c.candidateName + '</option>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                return err;
            }
        });
    };

    var getScenarios = function (uuid) {
        var requestUrl = opts.baseUrl + opts.urls.candidate;

        requestUrl = requestUrl.replace('{' + opts.uuidVar + '}', uuid);

        $.ajax({
            url: requestUrl,
            success: function (data) {
                var scenarios = data.scenarios,
                    selectDest = $('#' + opts.scenariosDestination),
                    temp = [],
                    s;

                temp.push('<option value=""></option>');

                for (var i = 0; i < scenarios.length; i++) {
                    s = scenarios[i];
                    temp.push('<option value="' + s.uuid + '">' + s.name + '</option>');
                }

                selectDest.html(temp.join('\n'));
            },
            error: function (jqXHR, textStatus, err) {
                return err;
            }
        });
    };

    var score = function (candidateUuid, scenarioUuid) {
        var myData = {},
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

        $.ajax({
            url: requestUrl,
            method: 'POST',
            data: myData,
            type: 'JSON',
            success: function (data) {
                finalScorecard = JSON.stringify(data);

                if (opts.debugEnabled) {
                    $('#output').text(finalScorecard)
                }

                scorecardCallback(finalScorecard);
            },
            error: function (jqXHR, textStatus, err) {
                scorecardCallback(err);
            }
        });
    };

    var validateForm = function () {
        var $questions = $('#' + opts.categoriesDestination),
            $candidates = $('#' + opts.candidatesDestination),
            $scenarios = $('#' + opts.scenariosDestination);

        return typeof $questions.val() !== 'undefined'
            && typeof $candidates.val() !== 'undefined'
            && typeof $scenarios.val() !== 'undefined'
            && $questions.val() !== ''
            && $candidates.val() !== ''
            && $scenarios.val() !== ''
    };

    var validateAndScore = function (candidateUuid, scenarioUuid) {
        var $errDest = $('.cg-error-container'),
            errorHtml = '<div class="error">You are missing one or more selected elements.</div>';

        $errDest.find('.error').remove();

        if (validateForm()) {
            score(candidateUuid, scenarioUuid);
        } else {
            $errDest.append(errorHtml);
        }
    };

    var submitMainForm = function () {
        var candidateUuid = $('#' + opts.candidatesDestination).val(),
            scenarioUuid = $('#' + opts.scenariosDestination).val();

        validateAndScore(candidateUuid, scenarioUuid);
    };

    // Can create using CloudGeneraPartner("baseUrl", scorecardCallback) or CloudGeneraPartner({}, scorecardCallback) for defaults
    $.fn.CloudGeneraPartner = function (options, scCallback, debug) {
        opts = defaultOptions;

        if (typeof options === 'string') {
            opts.baseUrl = options
        } else {
            options = options || {};

            $.each(options, function (i, v) {
                opts[i] = v;
            });
        }

        if (typeof debug === 'boolean') {
            opts.debugEnabled = debug
        } else {
            opts.debugEnabled = false;
        }

        scorecardCallback = scCallback;

        var baseHtml = buildContent();

        this.append(baseHtml);

        getCategories();
        getBundles();

        $(document).on('change', '#' + opts.categoriesDestination, function () {
            getCandidate($('#' + opts.categoriesDestination).val());
        });

        $(document).on('change', '#' + opts.candidatesDestination, function () {
            getScenarios($('#' + opts.candidatesDestination).val());
        });

        $(document).on('click', '#score', function (e) {
            e.preventDefault();
            submitMainForm()
        });
    };
})(jQuery);