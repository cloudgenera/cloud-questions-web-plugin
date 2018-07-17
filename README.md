# CloudGenera "CloudDemand" Plugin

## Table of Contents

- [Overview](#overview)
  - [Requirements](#requirements)
  - [What's in the box?](#whats-in-the-box)
  - [Components In Use](#components-in-use)
- **[Getting Started](#getting-started)**
  - [Simple Setup](#simple-setup)
  - [Basic Use Cases](#basic-use-cases)
  - [Live Examples](#live-examples)
- [Known Issues](#known-issues)
  - [Internet Explorer Support](#internet-explorer-support)
- [Release History](#release-history)
  - [Upgrading to CloudDemand 2.0](#upgrading-to-clouddemand-20)

## Overview

CloudDemand is a web service that leverages CloudGenera’s powerful CloudRank™ analytics engine to make decisions about available cloud options, on-the-fly.

Through a series of simple questions, CloudDemand maps application use cases (ie. Candidates) to permutations of size, scale, service level and security considerations (ie. Scenarios), and produces a ranked output of recommended service provider options.

Because CloudDemand is API driven, you have complete flexibility in deciding how to customize the "look-and-feel" of your CloudDemand front-end experience. Several examples are provided, but feel free to customize, modify, and pick apart our code in whatever way best suits your need.

![clouddemand-screenshot1](https://user-images.githubusercontent.com/13589229/33610199-c3ee185c-d998-11e7-8cb6-03c50d6add4f.png)

![clouddemand-screenshot2](https://user-images.githubusercontent.com/13589229/33610200-c3fe7cf6-d998-11e7-92c1-a3ebbcc747b3.png)

### Requirements

1. You must have a valid CloudDemand "partner code" to use the CloudDemand plugin. If you do not have a valid partner code, please contact your CloudGenera account representative to obtain one, or [click here](#https://cloudgenera.com/contact-us) to contact CloudGenera directly.

2. If using Internet Explorer in conjunction with the CloudDemand plugin, you must use Internet Explorer version 11 or higher. Prior versions of Internet Explorer are not supported. See [Known Issues](#known-issues).

### What's in the box?

| Filename | Description |
| -------- | ----------- |
| clouddemand-example1.html | CloudDemand example template |
| scripts/accounting.min.js | Currency formatting library |
| scripts/clouddemand.js | Required CloudDemand library |
| scripts/justgage.js | Animated gauges library |
| scripts/raphael-2.1.4.min.js | Vector graphics library |

### Components In Use

For ease of use and extensibility, the CloudDemand plugin and example templates were built using standard web development frameworks and components.

| Component | Description |
| -------- | ----------- |
| [jQuery (v3.x)](https://jquery.com/) | jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. |
| [Bootstrap (v3.x)](https://getbootstrap.com/) | Bootstrap is an open source toolkit for building responsive, mobile-first projects on the web with HTML, CSS, and JS. |
| [FontAwesome](http://fontawesome.io/) | Font Awesome gives you scalable vector icons that can instantly be customized — size, color, drop shadow, and anything that can be done with the power of CSS. |
| [accounting.js](http://openexchangerates.github.io/accounting.js/) | accounting.js is a tiny JavaScript library by Open Exchange Rates, providing simple and advanced number, money and currency formatting. |
| [JustGage](http://justgage.com/) | JustGage is a handy JavaScript plugin for generating and animating nice & clean gauges. |
| [Raphael](http://dmitrybaranovskiy.github.io/raphael/) | Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web. |

---

## Getting Started

Getting started with the CloudDemand plugin is quick and easy. You can use the CloudDemand example template(s) to understand how the CloudDemand plugin works, and assess what level of customization will be required to meet your business objectives.

### Simple Setup

1. Clone this repository, or [download](https://github.com/cloudgenera/cloudgenera-clouddemand-plugin/archive/master.zip) and extract this project.

2. Edit the file `clouddemand-example1.html`, and find the following code block:
```javascript
  <!-- CloudDemand Invocation -->
  <script>
    $(document).ready(function () {
      $().CloudDemandInit('XXXXXXXXXXXXXXXXXXXX'); // Your partner code goes here
    });
  </script>
```

3. Replace the placeholder text `XXXXXXXXXXXXXXXXXXXX` with your CloudDemand Partner Code, for example:
```javascript
  <!-- CloudDemand Invocation -->
  <script>
    $(document).ready(function () {
      $().CloudDemandInit('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // Your partner code goes here
    });
  </script>
```

4. Save your changes to `clouddemand-example1.html`.

5. In a browser window, open the file `clouddemand-example1.html`, and validate that:
   - CloudDemand dropdown menus populate with options
   - You can generate a scorecard by clicking on the "Generate Scorecard" button
   - You can send yourself a report from the generated scorecard

### Basic Use Cases

The CloudDemand plugin enables you to generate demand and capture leads for cloud. Depending on comfort level, most partners tend to implement the CloudDemand plugin in two ways:

1.	**Standalone:** Partners customize the provided CloudDemand example template(s) to their liking with branding, verbiage and other cosmetic changes, and then use the customized template as a standalone landing page.

2.	**Inline:** Partners incorporate the CloudDemand form and scorecard elements into an existing web experience, using the CloudDemand example template(s) source code as reference material.

### Live Examples

If you're having trouble or need a little inspiration, check out a few live CloudDemand implementations.

| Example Source | Link |
| -------- | ----------- |
| CloudGenera | [Try CloudDemand!](https://cloudgenera.com/clouddemand) |
| CloudGenera | [CloudDemand Example Template #1](https://cloudgenera.com/clouddemand/example-1) |
| Brookey & Company | [Cloud Assist](https://www.brookeyco.com/clouddemand) |
| Hewlett Packard Enterprise | [Make cloud decisions in minutes, not months](https://h41403.www4.hpe.com/campaign/cloud-provider-quiz.html) |
| Techpower IT Solutions | [Are You Cloud Ready?](https://www.techpowerusa.com/clouddemand/) |

---

## Known Issues

Issues that are currently known about with workarounds.

### Internet Explorer Support

As of release v1.1.3, the CloudDemand plugin offers basic compatibility with Internet Explorer 11 and later versions. While the plugin (specifically the clouddemand.js library) may work in prior versions of Internet Explorer, versions of Internet Explorer prior to version 11 are not supported.

---

## Release History

View the [changelog](./CHANGELOG.md) for a summary of each release.

### Upgrading to CloudDemand 2.0

View the [Upgrading to CloudDemand 2.0](./UPGRADE-1.x-2.0.md) guide.
