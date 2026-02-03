"use strict";
class DOMBlocker {
constructor() {
this.observer = null;
this.blockedSelectors = [
'[aria-label="Информepы"]',
'[aria-label="Установите Яндекс Браузер"]',
'[class^="reasoning-"]',
'[class^="Modal"]',
'[class^="Distribution-Popup"]',
'[data-container="outer"]',
'[id="distr-pcode-container"]',
'[aria-label="Рекламный баннер"]',
'[id^="yandex_rtb_"]',
'[class="adsbygoogle"]',
'[class="ads"]',
'[class^="ads"]',
'.new-main-banners',
'.main-page__banner-info',
'.banners-zones-container',
'rambler-info-banner',
'[rambler-info-banner]',
'yandex-metrica-id',
'[yandex-metrica-id]',
'[data-madv="all"]',
'[data-widget="bannerCarousel"]',
'[class^="dzen-desktop--base-button__"]',
'[class^="dzen-desktop--corner-banner__"]',
'[id^="auto-slide-ad-"]',
'[id^="DistributionPopupDesktopRenew__"]',
'[id=^"adfox_"]',
'.content__section--adv',
'[target="_tab_without_morda"]'
];
this.init();
}
shouldBlock(element) {
try {
if (!element || !element.matches) {
return false;
}
if (element.hasAttributes()) {
const attrs = element.attributes;
for (let i = 0; i < attrs.length; i++) {
const attr = attrs[i];
if (attr.name.startsWith('data-') && attr.value === 'dzenpro-banner') {
return true;
}
}
}
return this.blockedSelectors.some(selector => {
try {
return element.matches(selector);
} catch (e) {
return false;
}
});
} catch (error) {
return false;
}
}
blockElement(element) {
if (!element.hasAttribute('data-blocked')) {
element.style.display = 'none';
element.style.visibility = 'hidden';
element.setAttribute('disabled', 'true');
element.setAttribute('data-blocked', 'true');
element.style.pointerEvents = 'none';
element.style.userSelect = 'none';
}
}
blockAllElements() {
const allElements = document.querySelectorAll('*');
allElements.forEach(element => {
if (this.shouldBlock(element)) {
this.blockElement(element);
}
});
this.blockedSelectors.forEach(selector => {
try {
document.querySelectorAll(selector).forEach(element => {
this.blockElement(element);
});
} catch (e) {
}
});
}
handleMutations(mutations) {
for (const mutation of mutations) {
if (mutation.addedNodes.length > 0) {
mutation.addedNodes.forEach(node => {
if (node.nodeType === 1) { 
if (this.shouldBlock(node)) {
this.blockElement(node);
}
node.querySelectorAll('*').forEach(child => {
if (this.shouldBlock(child)) {
this.blockElement(child);
}
});
}
});
}
if (mutation.type === 'attributes') {
if (this.shouldBlock(mutation.target)) {
this.blockElement(mutation.target);
}
}
}
}
init() {
this.blockAllElements();
this.observer = new MutationObserver(this.handleMutations.bind(this));
this.observer.observe(document.documentElement, {
childList: true,
subtree: true,
attributes: true,
attributeFilter: ['class', 'aria-label', 'data-*']
});
setInterval(() => this.blockAllElements(), 2000);
}
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DOMBlocker());
} else {
    new DOMBlocker();
}
