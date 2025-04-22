const readyObserver = new MutationObserver(async (_, self) => {
    if (queryResultsContainer() && queryNextButton()) {
        self.disconnect()
        await run()
    }
});

readyObserver.observe(document.body, {
    childList: true,
    subtree: true,
});

async function run() {
    const companies = await readCompanies()

    await scrapePage(companies);

    const nextButton = queryNextButton()!

    if (nextButton.disabled) {
        return done(companies)
    }

    const pageObserver = new MutationObserver(async (_, self) => {
        // On "Next", the container changes to a skeleton and then to the results
        console.debug("Page changed");

        await scrapePage(companies);

        const nextButton = queryNextButton();

        if(!nextButton) {
            // Probably the skeleton page. Do nothing.
            return;
        }

        if (nextButton.disabled) {
            self.disconnect();
            return done(companies);
        }

        console.debug("Clicking next button...");
        nextButton.click();
    });

    pageObserver.observe(queryResultsContainer()!, {
        childList: true,
        subtree: true,
    });

    console.debug("Clicking next button...");
    nextButton.click();
}

async function scrapePage(companies: Set<string>) {
    queryCompanies().forEach((company) => {
        companies.add(company.innerText);
        console.debug("Found " + company.innerText);
    });
}

//region Helpers

function queryNextButton() {
    return document.querySelector<HTMLButtonElement>("button[aria-label=Next]");
}

function queryResultsContainer() {
    return document.querySelector(".workflow-results-container");
}

function queryCompanies() {
    return document.querySelectorAll<HTMLDivElement>("div.mb1:nth-child(1) > div:nth-child(2)")
}

async function readCompanies(): Promise<Set<string>> {
    const contents = await chrome.storage.local.get({applied_companies: []})
    return new Set<string>(contents["applied_companies"]);
}

async function saveCompanies(companies: Set<string>) {
    await chrome.storage.local.set({applied_companies: Array.from(companies)});
}

async function done(companies: Set<string>) {
    await saveCompanies(companies)
    console.debug("✅ Done loading all pages");
    // await chrome.runtime.sendMessage({type: "doneScraping", success: true})
}

//endregion
