export function updateURLParameter(param: string, newValue: string) {
  const url = new URL(window.document.URL);
  url.searchParams.set(param, newValue);
  window.history.replaceState(null, "", url.toString());
}
