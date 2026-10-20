export type Tone = "light" | "dark";

/**
 * The tone of whatever sits at a point in the viewport. Sections that are dark or photographic
 * carry data-tone="dark"; anything else counts as light. Elements inside `ignore` (the control
 * asking) are skipped so it reads the page behind it.
 */
export function toneAt(x: number, y: number, ignore?: Element | null): Tone {
  const stack = document.elementsFromPoint(x, y);
  const behind = stack.find((n) => !(ignore && ignore.contains(n)) && n.closest("[data-tone]"));
  return behind?.closest("[data-tone]")?.getAttribute("data-tone") === "dark" ? "dark" : "light";
}
