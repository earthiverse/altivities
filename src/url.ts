export function updateURLParameter(
  param: string,
  newValue: string | undefined
) {
  const url = new URL(window.document.URL);
  if (newValue === undefined) {
    url.searchParams.delete(param);
  } else {
    url.searchParams.set(param, newValue);
  }
  window.history.replaceState(null, "", url.toString());
}
