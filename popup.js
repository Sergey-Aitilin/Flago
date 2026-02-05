"use strict";
function getCounter() {
return new Promise((resolve) => {
browser.runtime.sendMessage({ action: 'getCounter' })
.then(response => {
resolve(response.count || 0);
})
.catch(() => {
browser.storage.local.get('totalBlockedConnections')
.then(result => {
resolve(result.totalBlockedConnections || 0);
})
.catch(() => resolve(0));
});
});
}
async function updateCounterDisplay() {
try {
const count = await getCounter();
const counterElement = document.getElementById('totalCounter');
if (counterElement) {
counterElement.textContent = count;
}
} catch (error) {
console.error('Flago popup: Error updating counter:', error);
}
}
function resetCounter() {
browser.runtime.sendMessage({ action: 'resetCounter' })
.then(response => {
if (response && response.success) {
updateCounterDisplay();
}
})
.catch(error => {
console.error('Flago popup: Error resetting counter:', error);
});
}
browser.runtime.onMessage.addListener((message) => {
if (message.action === 'counterUpdated') {
const counterElement = document.getElementById('totalCounter');
if (counterElement) {
counterElement.textContent = message.count || 0;
}
}
});
browser.storage.onChanged.addListener((changes, areaName) => {
if (areaName === 'local' && changes.totalBlockedConnections) {
const counterElement = document.getElementById('totalCounter');
if (counterElement) {
counterElement.textContent = changes.totalBlockedConnections.newValue || 0;
}
}
});
document.addEventListener('DOMContentLoaded', () => {
updateCounterDisplay();
const updateInterval = setInterval(updateCounterDisplay, 2000);
const resetButton = document.getElementById('resetButton');
if (resetButton) {
resetButton.addEventListener('click', resetCounter);
}
window.addEventListener('unload', () => {
clearInterval(updateInterval);
});
});
(function() {
const yearElement = document.querySelector("#chi");
if (yearElement) {
yearElement.textContent = new Date().getFullYear();
}
})();
document.addEventListener('DOMContentLoaded', function() {
function handleButtonClick(paramName, buttonId) {
const button = document.getElementById(buttonId);
if (!button) return;
button.addEventListener('click', async function() {
try {
const tabs = await browser.tabs.query({ 
active: true, 
currentWindow: true 
});
if (!tabs || tabs.length === 0 || !tabs[0].url) {
return;
}             
const currentUrl = encodeURIComponent(tabs[0].url);
const targetUrl = `https://www.sergey-aitilin.net.ru/proekty/flago/exten?${paramName}=${currentUrl}`;
await browser.tabs.create({ url: targetUrl });
} catch (error) {
console.error('Flago popup: Error opening tab:', error);
}
});
}
handleButtonClick('soobshit-o-polomke', 'soobshit-o-polomke');
handleButtonClick('zablokirovannaya-reklama-zanimaet-mesto', 'zablokirovannaya-reklama-zanimaet-mesto');
handleButtonClick('ya-vizhu-reklamu', 'ya-vizhu-reklamu');
handleButtonClick('soobshit-o-fishinge', 'soobshit-o-fishinge');
});
(function(){
"use strict";
document.addEventListener('DOMContentLoaded', function() {
const LinkForOpeningNewVBlock = document.getElementById('LinkForOpeningNewVBlock');
const closeNewVBlock = document.getElementById('closeNewVBlock');
const ThisNewVBlock = document.getElementById('ThisNewVBlock');
if (LinkForOpeningNewVBlock && ThisNewVBlock) {
LinkForOpeningNewVBlock.addEventListener('click', function(e) {
e.preventDefault();
ThisNewVBlock.classList.remove('hidden');
});
}
if (closeNewVBlock && ThisNewVBlock) {
closeNewVBlock.addEventListener('click', function() {
ThisNewVBlock.classList.add('hidden');
});
}
});
})();
