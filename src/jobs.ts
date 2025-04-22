loadCompanies().then(companies => {
    const pageReadyObserver = new MutationObserver((_, self) => {
        console.debug("Page changed")
        if (queryList()) {
            self.disconnect()
            // Debouncing induces a double-render effect, so no debouncing for now
            const listObserver = new MutationObserver(debounce(() => {
                console.debug("List changed (debounced)");
                markAppliedCompanies();
            }, 0));

            listObserver.observe(queryList()!, {
                childList: true,
                subtree: true,
            });

            markAppliedCompanies()
        }
    });

    pageReadyObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    function markAppliedCompanies() {
        for (const jobCard of queryJobCards()) {
            if (companies.has(queryCompany(jobCard)?.innerText!) && !queryCompany(jobCard)?.querySelector("img[alt='Applied Checkmark']")) {
                queryCompany(jobCard)!.style.display = "flex";
                queryCompany(jobCard)!.style.alignItems = "center";
                queryCompany(jobCard)!.prepend(check.cloneNode(true));
            }
            if (companies.has(queryCompany(jobCard)?.innerText!) && !queryLogo(jobCard)?.textContent?.includes(marker.innerText)) {
                queryLogo(jobCard)?.appendChild(appliedContainer.cloneNode(true));
            }
        }
    }
});

const appliedContainer = document.createElement("div");

const check = document.createElement("img");
check.src = chrome.runtime.getURL("assets/checkmark.svg");
check.alt = "Applied Checkmark";

const marker = document.createElement("div");
marker.innerText = "Applied";
marker.setAttribute("class", "artdeco-entity-lockup__caption job-card-container__footer-item");
appliedContainer.appendChild(marker);

//region Helpers

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    } as T;
}

async function loadCompanies() {
    const container = await chrome.storage.local.get({applied_companies: []});
    return new Set<string>(container["applied_companies"]);
}

function queryList() {
    return document.querySelector<HTMLDivElement>(".scaffold-layout__list ul");
}

function queryJobCards() {
    return document.querySelectorAll<HTMLDivElement>('[data-view-name=job-card]');
}

function queryCompany(jobCard: HTMLElement) {
    // TODO: Use better selector - maybe .artdeco-entity-lockup__subtitle
    return jobCard.querySelector<HTMLDivElement>("div > div:first-child > div:nth-child(2) > div:nth-child(2)");
}

function queryLogo(jobCard: HTMLElement) {
    return jobCard.querySelector(".job-card-list__logo");
}

//endregion
