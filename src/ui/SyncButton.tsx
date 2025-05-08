interface SyncButtonProps {
  onClick: () => Promise<void>;
  isSyncing: boolean;
}

export default function SyncButton({onClick, isSyncing}: SyncButtonProps) {
  return (
    <button id="sync" onClick={onClick} disabled={isSyncing}>
      <span>{isSyncing ? "Syncing" : "Sync"}</span>
    </button>
  )
}
