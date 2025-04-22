import "./popup.css";

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
