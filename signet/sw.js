// A service worker whose only job is to remove itself.
//
// The old copy of the app registered one at this scope, and it serves
// navigations from its own cache — so replacing index.html alone would never
// reach anyone who had already visited. The old worker checks this file for
// updates, finds this, and installs it; this then clears the caches it made,
// unregisters, and reloads every open tab onto the redirect page.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.includes("/signet/")).map((k) => caches.delete(k)));
      await self.registration.unregister();
      const open = await self.clients.matchAll({ type: "window" });
      for (const client of open) client.navigate(client.url);
    })(),
  );
});
