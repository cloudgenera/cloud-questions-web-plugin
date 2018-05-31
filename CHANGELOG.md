# CHANGELOG

## 2.0.0 (2018-05-31)

**IMPORTANT:** CloudDemand 2.0 introduces breaking changes to 1.x installations. You may manually upgrade to CloudDemand 2.0 by following the instructions in the [Upgrading to CloudDemand 2.0](./UPGRADE-1.x-2.0.md) guide.

* Introduction of the CloudDemand Partner Proxy service. CloudDemand users are no longer required to establish their own backend API endpoints to connect to the CloudDemand data service.
* Simplified use and placement of CloudDemandInit() function in CloudDemand example template(s)
* Removal of legacy backend API example code

---

## 1.1.3 (2018-05-29) - Final Release for 1.x series

* Added CHANGELOG
* Updated README
* Fix: Handle false trigger of error callback when sending report
* Fix: Ensure POST data is sent as type 'application/json'; better error notifications
* Fix: Basic IE 11 compatibility

---

## 1.1.2 (2018-05-24)

* Rollup of documentation updates

---

## 1.1.1 (2017-12-07)

* Rollup of documentation updates

---

## 1.1.0 (2017-11-19)

* Updated README
* Added example CloudDemand UI template
* Refactor clouddemand.js to use modern libraries and frameworks
* Retire legacy code

---

## 1.0 (2017-11-16)

* Initial release
