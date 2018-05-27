// How often the counter should be updated, in seconds
const INTERVAL = 1;

// Global variable storing the host name of currently viewed web page
var hostname;

// Set hostname if URL has http or https scheme
var setHostname = function(url) {
  url = new URL(url);
  if (/https?:/.test(url.protocol)) {
    hostname = url.hostname;
  }
};

// Set start date/time if not set
chrome.storage.local.get('since', function(items) {
  if (!items.since) {
    var since = (new Date).toUTCString();
    chrome.storage.local.set({since: since});
  }
});

// Update hostname when switching tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    setHostname(tabs[0].url);
  });
});

// Update hostname when URL in tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url !== undefined) {
    setHostname(changeInfo.url);
  }
});

// Update counter every <INTERVAL> seconds if hostname is set
setInterval(function() {
  chrome.windows.getCurrent(function(browser) {
    if (browser.focused && hostname) {
      var visits = {};
      visits[hostname] = 0;

      chrome.storage.local.get(visits, function(items) {
        visits[hostname] = items[hostname] + INTERVAL;
        chrome.storage.local.set(visits, function() {
          console.log(visits);
        });
      });
    }
  });
}, 1000 * INTERVAL);
