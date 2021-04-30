# Manual Testing

## Prerequisite for All Tests

A production build of the App. Checkout README.md for project setup.

The latest version of Google Chrome on Windows/macOS/Linux.

## Test: PWA

Goal: check whether the app can be installed as PWA app.

Operation:
1. Run the app in Google Chrome.
2. Install the PWA app.

Expected result:
Google Chrome can detect this webpage as a PWA app and provide options to install.

## Test: Icon

Prerequisite: Finish the previous test

Goal: Check whether the app has a proper icon

Operation: None

Expected result:
A yellow logo with "VF" in the center should be displayed as the app icon

## Test: Chrome Lighthouse audit

Prerequisite: Finish the previous test

Goal: Check whether the app passes necessary Chrome Lighthouse audit.

Operation:
1. Open the app in web mode (Not from PWA)
2. Open the developer tools in Chrome, click on "Lighthouse" tab
3. Choose "mobile" as the emulating device
4. Run the audit

Expected result:
In the "Progressive Web App" result, 
except "Redirects HTTP traffics to HTTPS", 
all others should be green.
