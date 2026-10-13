/* Section rule between the hero and the market snapshot.
   Was a 34px mesh-pattern band; it carried no information and read as noise,
   so it is now the same slim brand rule used on the directory cards. */
export function Gauge() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: "6px",
        background: "linear-gradient(90deg, var(--band) 0 72%, var(--red) 72% 100%)",
      }}
    />
  );
}
