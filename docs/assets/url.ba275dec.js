function a(t,r){const e=new URL(window.document.URL);r===void 0?e.searchParams.delete(t):e.searchParams.set(t,r),window.history.replaceState(null,"",e.toString())}export{a as u};
