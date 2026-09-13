const explorer = document.querySelector<HTMLElement>("[data-explorer]");
if (explorer) {
  const controls = [
    ...explorer.querySelectorAll<HTMLAnchorElement>("[data-select-part]"),
  ];
  const details = [...explorer.querySelectorAll<HTMLElement>("[data-detail]")];
  const leaders = [...explorer.querySelectorAll<SVGGElement>("[data-leader]")];
  const status = explorer.querySelector<HTMLElement>(
    "[data-selection-status]",
  )!;

  const select = (id: string, focus = false) => {
    const selected = details.find((detail) => detail.dataset.detail === id);
    if (!selected) return;
    details.forEach((detail) => {
      detail.hidden = detail !== selected;
    });
    controls.forEach((control) => {
      if (control.dataset.selectPart === id)
        control.setAttribute("aria-current", "true");
      else control.removeAttribute("aria-current");
    });
    leaders.forEach((leader) =>
      leader.classList.toggle("is-selected", leader.dataset.leader === id),
    );
    status.textContent = `Valgt: ${selected.querySelector("h3")!.textContent}.`;
    if (focus) selected.focus({ preventScroll: true });
  };

  const selectFromHash = () => {
    const id = location.hash.startsWith("#part-") ? location.hash.slice(6) : "";
    select(
      details.some((detail) => detail.dataset.detail === id)
        ? id
        : details[0]!.dataset.detail!,
    );
  };

  controls.forEach((control) => {
    control.addEventListener("click", (event) => {
      // Preserve open-in-new-tab and other native link gestures.
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      const id = control.dataset.selectPart!;
      if (location.hash !== `#part-${id}`)
        history.pushState(null, "", `#part-${id}`);
      select(id);
      // List choices on small screens should reveal the inspection panel.
      if (
        control.classList.contains("part-key-link") &&
        matchMedia("(max-width: 780px)").matches
      ) {
        select(id, true);
        details
          .find((detail) => detail.dataset.detail === id)!
          .scrollIntoView({ block: "nearest", behavior: "instant" });
      }
    });
  });
  window.addEventListener("hashchange", selectFromHash);
  window.addEventListener("popstate", selectFromHash);
  selectFromHash();
  explorer.dataset.enhanced = "true";
}
