"use strict";
let currentBlockRules = [];
const urlDecisionCache = new Map();
let totalBlockedConnections = 0;
browser.storage.local.get('totalBlockedConnections').then(result => {
if (result.totalBlockedConnections !== undefined) {
totalBlockedConnections = result.totalBlockedConnections;
}
});
function saveCounter() {
browser.storage.local.set({ totalBlockedConnections }).catch(e => {
console.warn('Flago: Failed to save counter:', e);
});
}
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === 'getCounter') {
sendResponse({ count: totalBlockedConnections });
return true;
} 
if (message.action === 'resetCounter') {
totalBlockedConnections = 0;
saveCounter();
sendResponse({ success: true });
browser.runtime.sendMessage({
action: 'counterUpdated',
count: totalBlockedConnections
}).catch(() => {});
return true;
}
});
async function fetchBlockList() {
const url = "\u0068\u0074\u0074\u0070\u0073\u003A\u002F\u002F\u0077\u0077\u0077\u002E\u0073\u0065\u0072\u0067\u0065\u0079\u002D\u0061\u0069\u0074\u0069\u006C\u0069\u006E\u002E\u006E\u0065\u0074\u002E\u0072\u0075\u002F\u0065\u0078\u0074\u0065\u006E\u0073\u0069\u006F\u006E\u0073\u0053\u0079\u0073\u002F\u0066\u0069\u006C\u0074\u0065\u0072\u0073\u002E\u0074\u0078\u0074";
const headers = new Headers();
headers.set(atob("WC1BdXRob3I="), atob("U2VyZ2V5IEFpdGlsaW4gLSB3d3cuc2VyZ2V5LWFpdGlsaW4ubmV0LnJ1"));
headers.set(atob("WC1Qcm9qZWN0LUFib3V0"), atob("RmxhZ28gLSB3d3cuc2VyZ2V5LWFpdGlsaW4ubmV0LnJ1L3Byb2VrdHkvZmxhZ28vIChieS4gU2VyZ2V5IEFpdGlsaW4p"));
headers.set(atob("QWNjZXB0"), atob("dGV4dC9wbGFpbg=="));
const response = await fetch(url, {
method: "GET",
headers,
cache: "no-cache"
});
const text = await response.text();
const lines = text.split(/\r?\n/);
const rules = [];
for (const rawLine of lines) {
const line = rawLine.trim();
if (!line || line.startsWith("#")) continue;
try {
rules.push(new RegExp(line, "i"));
} catch (e) {
console.warn(`Flago: Bad RegExp "${line}" – skipped`);
}
}
return rules;
}
async function updateBlockRules() {
urlDecisionCache.clear();
currentBlockRules = await fetchBlockList();
}
function shouldBlockUrl(url) {
if (urlDecisionCache.has(url)) {
return urlDecisionCache.get(url);
}
const shouldBlock = currentBlockRules.some(rule => rule.test(url));
urlDecisionCache.set(url, shouldBlock);
return shouldBlock;
}
browser.runtime.onInstalled.addListener(async details => {
if (["install", "update"].includes(details.reason)) {
await updateBlockRules();
}
});
updateBlockRules();
setInterval(updateBlockRules, 3 * 60 * 60 * 1000);
browser.webRequest.onBeforeRequest.addListener(
details => {
if (shouldBlockUrl(details.url)) {
setTimeout(() => {
totalBlockedConnections++;
saveCounter();
browser.runtime.sendMessage({
action: 'counterUpdated',
count: totalBlockedConnections
}).catch(() => {});
}, 0);
return { cancel: true };
}
return {};
},
{
urls: ["<all_urls>"],
types: ["main_frame", "sub_frame", "script", "stylesheet", "image", "object", "xmlhttprequest", "websocket", "ping", "beacon", "csp_report", "imageset", "speculative", "other"]
},
["blocking"]
);
