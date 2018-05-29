# CloudGenera "CloudDemand" Plugin

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [What's in the box?](#whats-in-the-box)
- [Components In Use](#components-in-use)
- [Basic Use Cases and Examples](#basic-use-cases-and-examples)
  - [Live Examples](#live-examples)
- **[Getting Started](#getting-started)**
- [Next Steps: Building Partner API Endpoints](#next-steps-building-partner-api-endpoints)
  - [API Authorization](#api-authorization)
  - [Back-end: Creating Your Partner API Endpoints](#back-end-creating-your-partner-api-endpoints)
    - [Partner API Example](#partner-api-example)
  - [Front-end: Update API path in CloudDemand Web Interface](#front-end-update-base-api-path-in-clouddemand-web-interface)
- [Known Issues](#known-issues)
  - [Internet Explorer Support](#internet-explorer-support)
- [Release History](#release-history)

## Overview

CloudDemand is a web service that leverages CloudGenera’s powerful CloudRank™ analytics engine to make decisions about available cloud options, on-the-fly.

Through a series of simple questions, CloudDemand maps application use cases (ie. Candidates) to permutations of size, scale, service level and security considerations (ie. Scenarios), and produces a ranked output of recommended service provider options.

Because CloudDemand is API driven, you have complete flexibility in deciding how to customize the "look-and-feel" of your CloudDemand front-end experience. Several examples are provided, but feel free to customize, modify, and pick apart our code in whatever way best suits your need.

![clouddemand-screenshot1](https://user-images.githubusercontent.com/13589229/33610199-c3ee185c-d998-11e7-8cb6-03c50d6add4f.png)

![clouddemand-screenshot2](https://user-images.githubusercontent.com/13589229/33610200-c3fe7cf6-d998-11e7-92c1-a3ebbcc747b3.png)

## Requirements

1.	You must have a valid CloudGenera API key to use the CloudDemand plugin. If you do not have a valid API key, please contact your CloudGenera account representative to obtain one.

2.	You must have the ability to create several API endpoints, which are:
  - Accessible from your CloudDemand installation (whether standalone or inline)
  - Able to communicate with external CloudGenera API endpoints

## What's in the box?

| Filename | Description |
| -------- | ----------- |
| clouddemand-example1.html | CloudDemand example template |
| scripts/accounting.min.js | Currency formatting library |
| scripts/clouddemand.js | Required CloudDemand library |
| scripts/justgage.js | Animated gauges library |
| scripts/raphael-2.1.4.min.js | Vector graphics library |
| backend-examples/node/app.js | Example partner API written in NodeJs |

## Components In Use

For ease of use and extensibility, the CloudDemand plugin and example templates were built using standard web development frameworks and components.

| Component | Description |
| -------- | ----------- |
| [jQuery](https://jquery.com/) | jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. |
| [Bootstrap](https://getbootstrap.com/) | Bootstrap is an open source toolkit for building responsive, mobile-first projects on the web with HTML, CSS, and JS. |
| [FontAwesome](http://fontawesome.io/) | Font Awesome gives you scalable vector icons that can instantly be customized — size, color, drop shadow, and anything that can be done with the power of CSS. |
| [accounting.js](http://openexchangerates.github.io/accounting.js/) | accounting.js is a tiny JavaScript library by Open Exchange Rates, providing simple and advanced number, money and currency formatting. |
| [JustGage](http://justgage.com/) | JustGage is a handy JavaScript plugin for generating and animating nice & clean gauges. |
| [Raphael](http://dmitrybaranovskiy.github.io/raphael/) | Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web. |

## Basic Use Cases and Examples

The CloudDemand plugin enables you to generate demand and capture leads for cloud. Depending on comfort level, most partners tend to leverage the CloudDemand plugin in two ways:

1.	**Standalone:** Partners customize the provided CloudDemand example template(s) to their liking with branding, verbiage and other cosmetic changes, and then use the customized template as a standalone landing page.

2.	**Inline:** Partners incorporate the CloudDemand form and scorecard elements into an existing web experience, using the CloudDemand example template(s) source code as reference material.

### Live Examples
  - [CloudGenera’s CloudDemand Landing Page](https://cloudgenera.com/clouddemand)
  - [CloudDemand Example Template #1](https://cloudgenera.com/clouddemand/example-1)

---

## Getting Started

Getting started with the CloudDemand plugin is quick and easy. You can use the CloudDemand example template(s) to understand how the CloudDemand plugin works, and assess what level of customization will be required to meet your objectives.

1. Clone this repository, or [download](https://github.com/cloudgenera/cloudgenera-clouddemand-plugin/archive/master.zip) and extract this project.

2. Edit the file `scripts/clouddemand.js`, and find the following code block:
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

3. Uncomment the following line, and replace the text `YOUR-API-KEY-GOES-HERE` with your API key:
```javascript
//opts.headers = {'X-Api-Key':'YOUR-API-KEY-GOES-HERE'};
```

4. Save your changes to `scripts/clouddemand.js`.

5. In a browser window, open the file `clouddemand-example1.html`, and validate that:
   - the CloudDemand dropdown menus populate with options
   - you can generate a scorecard by clicking on the "Generate Scorecard" button

---

## Next Steps: Building Partner API Endpoints

Before deploying your CloudDemand implementation to a production environment, you'll need to establish your own CloudDemand API endpoints to proxy API requests originating from your CloudDemand web interface to the CloudGenera API.

As a best practice, proxying your API requests to the CloudGenera API allows you to include your API key server-side, so your API key isn't exposed in client-side code.

A working API example has also been provided for reference.

### API Authorization

On each outbound request from your Partner API to the CloudGenera API, your Partner API key must be included in the request header, like so:

```javascript
"X-Api-Key": "YOUR-API-KEY-GOES-HERE"
```

### Back-end: Creating Your Partner API Endpoints

1. Choose or define an API base URL to use (ex. https://mydomain.com/api/clouddemand). In the next step, the required Partner API endpoints should be accessible from this API base URL.

2. Create the following API endpoints:

| Partner API Endpoints | Calls to CloudGenera API Endpoints |
| ----------------- | ------------------------------ |
| `GET` /bundles      | `GET` /partner/bundles    |
| `GET` /categories      | `GET` /partner/categories    |
| `GET` /categories/:uuid      | `GET` /partner/categories/:uuid    |
| `GET` /candidate/:uuid      | `GET` /partner/candidate/:uuid    |
| `POST` /candidate/:uuid/scenario/:uuid      | `POST` /partner/candidate/:uuid/scenario/:uuid    |
| `POST` /send-report/:uuid      | `POST` /partner/send-report/:uuid    |

For reference, the CloudGenera API base URL is https://cloudgenera.com/api/v1/

#### Partner API Example

A basic working example of the above API endpoints can be found in the `backend-examples/node` directory. Installations of NodeJs and NPM are required. To use:

1. Run `npm install`

2. Edit `app.js`, and add your Partner API key to the following line:

```javascript
var cgPartnerApiKey = "YOUR PARTNER API KEY GOES HERE";
```

3. Run `node app.js`

### Front-end: Update Base API Path in CloudDemand Web Interface

After creating your Partner API endpoints, you'll need to update the `baseApiPath` reference in your CloudDemand web interface to reflect the new base API path that you've created.

  - **IF you're using a CloudDemand example template**, edit the template file and customize the following line with your chosen API base URL (from "Back-end: Creating Your Partner API Endpoints"):

  Find:
```javascript
var baseApiPath = 'https://cloudgenera.com/api/v1/partner/';
```

   Change to (as an example):
```javascript
var baseApiPath = 'https://mydomain.com/api/clouddemand/';
```

  - **IF you've created your own custom CloudDemand html files**, then update the previous references to `https://cloudgenera.com/api/v1/partner/` with the new base API path that you've created.

---

## Known Issues

Issues that are currently known about with workarounds.

#### Internet Explorer Support

As of release v1.1.3, the CloudDemand plugin offers basic compatibility with Internet Explorer 11. While the plugin (specifically the clouddemand.js library) may work in prior versions of Internet Explorer, versions of Internet Explorer prior to version 11 are not supported.

## Release History

View the [changelog](./CHANGELOG.md) for a summary of each release.
