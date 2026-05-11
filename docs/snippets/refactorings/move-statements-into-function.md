### Apply: 44 — Move Statements into Function

**Target state:** Setup or follow-up that happens around every call to a function moves inside the function, so the caller's contract shrinks.

**Why apply it:** One fewer thing to remember at the call site; consistency is enforced by the function's definition, not by convention.

**Pitfall:** If the moved statements aren't always wanted, the function grows a flag argument — verify every caller really needs the moved behavior.

```js
// Avoid:
log("start fetch");
const data = fetch(url);
log("start fetch");
const data2 = fetch(url2);

// Prefer:
function fetchLogged(url) {
  log("start fetch");
  return fetch(url);
}
```

**Removes smells:** Duplicated Code
