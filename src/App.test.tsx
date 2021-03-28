import { url } from "./url";

let alreadyRunning = false;
const webdriver = require("selenium-webdriver");

const fs = require('fs');
const fetch = require("node-fetch");

describe('something', () => {
  let driverSimple = undefined;
  if (!alreadyRunning) {
    alreadyRunning = true;

    const capabilityName = 'goog:chromeOptions'; // Switch to 'moz:firefoxOptions' if desired
  
    // Set up the commandline options for launching the driver.
    // In this example, I'm using various headless options.
    const browserOptions = {
      args: ['--disable-gpu', '--no-sandbox'],
    };
    //if (headless) {
    //  browserOptions.args.unshift('--headless');
    //}
    // Set up the browser capabilities.
    // Some lines could be condensed into one-liners if that's your preferred style.
    
    let browserCapabilities = webdriver.Capabilities.chrome();
    browserCapabilities = browserCapabilities.set(capabilityName, browserOptions);

    const builder = new webdriver.Builder().forBrowser('chrome');
    // Setting the proxy-server option is needed to info chrome to use proxy
    const chrome = require('selenium-webdriver/chrome');
    let option = new chrome.Options();

    // let proxyAddress = '86.145.14.192:8080';
    // option = option.addArguments(`--proxy-server=${proxyAddress}`);

    driverSimple = builder.withCapabilities(browserCapabilities).setChromeOptions(option).build();
  }
  if (driverSimple == undefined) {
    return;
  }
  const driver = driverSimple;
  jest.setTimeout(100000); // allow time for all these tests to run


  it('something', () => {
    return new Promise<void>(async (resolve, reject) => {
      expect(1).toBeCloseTo(1);
      resolve();
    });
  });

  afterAll(async () => {
    await driver.quit();
  });
});
