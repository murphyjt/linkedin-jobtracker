import classes from "./progress.module.css"

export default function Progress({value}: { value: number }) {
  return (
    <progress className={classes.progress} value={value}/>
  )
}
