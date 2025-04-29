chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "START_SCRAPING") {
        chrome.tabs.create({
            url: "https://www.linkedin.com/my-items/saved-jobs/?cardType=APPLIED",
            active: false
        }, async (newTab) => {
            const newTabId = newTab.id;
            if (!newTabId) {
                console.warn("Failed to open tab");
                return;
            }

            console.log("Tab opened:", newTabId);

            chrome.runtime.onMessage.addListener(async function listener(message, sender) {
                if (message.type === "DONE_SCRAPING" && sender.tab && sender.tab.id === newTabId) {
                    chrome.runtime.onMessage.removeListener(listener);
                    await chrome.tabs.remove(newTabId);
                }
            });

            await chrome.scripting.executeScript({
                target: {tabId: newTabId},
                files: ["applied.js"],
            });
        });
    }
});
