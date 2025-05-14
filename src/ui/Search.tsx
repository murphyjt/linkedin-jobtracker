import {useRef, useState, type ChangeEvent, useEffect} from "react";
import {SearchResults} from "./SearchResults.tsx";

interface SearchProps {
  values: Set<string>;
}

export default function Search({values}: SearchProps) {
  const [term, setTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTerm(event.target.value);
  }

  useEffect(() => {
    ref.current?.focus();
  }, [values]);

  return (
    <>
      <input id="search" type="search" placeholder="Search" className="full-width"
             value={term} ref={ref} onChange={handleChange}/>
      {term && <SearchResults values={values} term={term}/>}
      {!term && (
        <>
          <button onClick={() => setShowAll(!showAll)}>{showAll ? "Hide" : "Show"} all</button>
          {showAll && <SearchResults values={values} term=""/>}
        </>
      )}
    </>
  )
}
