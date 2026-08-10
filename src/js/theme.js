function toggleTheme() {
  var next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
  sendGiscusTheme(next);
}

function sendGiscusTheme(theme) {
  var iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe) return;
  iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: theme } } }, "https://giscus.app");
}
