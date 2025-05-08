import {useEffect, useState} from "react";
import Header from "./Header.tsx";
import SyncButton from "./SyncButton.tsx";
import Search from "./Search.tsx";
import Progress from "./Progress.tsx";
import {EventType, loadCompanies} from "../common.ts";
import "./progress.module.css";

function getCompanyCountMessage(count: number) {
  return count > 0 ? `Found ${count} companies` : "";
}

export default function App() {
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState(new Set<string>);
  const [isSyncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    async function load() {
      const companies = await loadCompanies();
      setCompanies(companies);
      setMessage(getCompanyCountMessage(companies.size));
    }

    load().catch(console.error);
  }, []);

  async function handleSync() {
    chrome.runtime.onMessage.addListener(async function listener(message) {
      if (message.type === EventType.End) {
        chrome.runtime.onMessage.removeListener(listener);
        const companies = await loadCompanies();
        setTimeout(async () => {
          setCompanies(companies);
          setSyncing(false);
          setMessage(getCompanyCountMessage(companies.size));
        }, 300);
      } else if (message.type === EventType.Progress) {
        setProgress(message.value);
      }
    });
    setMessage("");
    setSyncing(true);
    setProgress(0);
    await chrome.runtime.sendMessage({type: EventType.Start});
  }

  return (
    <>
      <Header/>
      <main>
        <SyncButton onClick={handleSync} isSyncing={isSyncing}/>
        {isSyncing && <Progress value={progress}/>}
        {!isSyncing && <output id="message">{message}</output>}
      </main>
      <Search values={companies}/>
    </>
  )
}
