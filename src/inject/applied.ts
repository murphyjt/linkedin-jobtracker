import {EventType, loadCompanies, saveCompanies} from "../common.ts";

export function scrape() {
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

  // Amount of progress per company processed, including duplicates
  let epsilon = 0
  // Float in the range [0, 1]
  let progress = 0;

  async function run() {
    // Up to 10 jobs per page
    let pageCount = 1;
    try {
      pageCount = Number.parseInt(queryLastPageButton()!.textContent!, 10);
    } catch (_) {
    }

    epsilon = 1 / (pageCount * 10);
    progress = 0;

    const companies = await loadCompanies()

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

      if (!nextButton) {
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
    for (const company of queryCompanies()) {
      companies.add(company.innerText);
      console.debug("Found " + company.innerText);
      progress = Math.min(progress + epsilon, 1);
      await chrome.runtime.sendMessage({type: EventType.Progress, value: progress})
    }
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

  function queryLastPageButton() {
    return document.querySelector<HTMLButtonElement>("li[data-test-pagination-page-btn]:last-child button");
  }

  async function done(companies: Set<string>) {
    await saveCompanies(companies)
    console.debug("✅ Done loading all pages");
    await chrome.runtime.sendMessage({type: EventType.Progress, value: 1})
    await chrome.runtime.sendMessage({type: EventType.End, success: true})
  }

//endregion
}

scrape();
