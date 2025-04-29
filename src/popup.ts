import "./popup.css";

async function template() {
    const companies = await getCompanies();
    return companies.length ? `Found ${companies.length} companies` : "";
}

async function getCompanies() {
    const contents = await chrome.storage.local.get({applied_companies: []})
    return contents["applied_companies"];
}

(async function init() {
    document.getElementById("message")!.innerText = await template();
})()

document.getElementById("sync")?.addEventListener("click", async () => {
    chrome.runtime.onMessage.addListener(async function listener(message) {
        if (message.type === "DONE_SCRAPING") {
            chrome.runtime.onMessage.removeListener(listener);
            document.getElementById("message")!.innerText = await template();
            document.getElementById("sync")!.innerText = 'Sync';
            document.querySelector<HTMLButtonElement>("#sync")!.disabled = false;
        }
    });
    document.querySelector<HTMLButtonElement>("#sync")!.disabled = true;
    document.getElementById("message")!.innerHTML = "";
    document.getElementById("sync")!.innerHTML = '<span class="loading-dots">Syncing<span class="dots"></span></span>';
    await chrome.runtime.sendMessage({type: "START_SCRAPING"});
});
