"use strict";
function removeAllHeightRatioElements() {
let totalRemoved = 0;
function findHeightRatioElements() {
const allElements = document.querySelectorAll('*');
return Array.from(allElements).filter(element => {
const style = element.getAttribute('style');
return style && style.includes('--height-ratio');
});
}
function removeElements() {
const elements = findHeightRatioElements();
elements.forEach(element => {
element.remove();
totalRemoved++;
});
if (elements.length > 0) {
console.log("1");
}
return elements.length;
}
removeElements();
const observer = new MutationObserver((mutations) => {
let shouldCheck = false;
mutations.forEach(mutation => {
if (mutation.addedNodes.length > 0 || 
(mutation.type === 'attributes' && mutation.attributeName === 'style')) {
shouldCheck = true;
}
});
if (shouldCheck) {
setTimeout(removeElements, 50);
}
});
observer.observe(document.body, {
childList: true,
subtree: true,
attributes: true,
attributeFilter: ['style']
});
console.log("1");
return {
stop: () => observer.disconnect(),
getCount: () => totalRemoved,
refresh: removeElements
};
}
const heightRatioRemover = removeAllHeightRatioElements();
