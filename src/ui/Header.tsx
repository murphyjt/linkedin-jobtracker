import icon from "./icon.svg?inline";

export default function Header() {
  return (
    <header>
      <img src={icon} alt="" height="24px" width="24px"/>
      <h1>LinkedIn JobTracker</h1>
    </header>
  );
}
