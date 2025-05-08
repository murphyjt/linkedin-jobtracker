// @ts-ignore
import scriptPath from "./inject/applied.ts?script";
import {EventType} from "./common.ts";

const url = "https://www.linkedin.com/my-items/saved-jobs/?cardType=APPLIED";

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === EventType.Start) {
        chrome.tabs.create({
            url,
            active: false
        }, async (newTab) => {
            const newTabId = newTab.id;
            if (!newTabId) {
                console.warn("Failed to open tab");
                return;
            }

            console.log("Tab opened:", newTabId);

            chrome.runtime.onMessage.addListener(async function listener(message, sender) {
                if (message.type === EventType.End && sender.tab && sender.tab.id === newTabId) {
                    chrome.runtime.onMessage.removeListener(listener);
                    await chrome.tabs.remove(newTabId);
                }
            });

            await chrome.scripting.executeScript({
                target: {tabId: newTabId},
                files: [scriptPath],
            });
        });
    }
});
