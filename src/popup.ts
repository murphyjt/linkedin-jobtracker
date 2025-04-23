import "./popup.css";

import MessageSender = chrome.runtime.MessageSender;

function messageHandler(message: any, sender: MessageSender) {
    if (message.type === "doneScraping" && sender.tab?.id) {
        void chrome.tabs.remove(sender.tab.id);
        console.log("Closed scraping tab");
    }
}

chrome.runtime.onMessage.addListener(messageHandler);

chrome.tabs.create({
    url: "https://www.linkedin.com/my-items/saved-jobs/?cardType=APPLIED",
    active: false
}, async (tab) => {
    if (!tab.id) {
        console.warn("Failed to open tab");
        return;
    }

    console.log("Tab opened:", tab.id);

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["applied.js"],
    });
});
