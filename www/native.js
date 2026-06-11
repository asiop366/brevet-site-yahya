(function () {
  function initNative() {
    const cap = window.Capacitor;
    if (!cap?.isNativePlatform?.()) return;

    document.documentElement.classList.add("is-native");
    document.body.classList.add("is-native");

    const plugins = cap.Plugins || {};
    if (plugins.SplashScreen) {
      plugins.SplashScreen.hide().catch(function () {});
    }

    const theme = localStorage.getItem("brevet2026-theme") || "noir";
    syncNativeTheme(theme);
  }

  window.syncNativeTheme = function (themeId) {
    const cap = window.Capacitor;
    if (!cap?.isNativePlatform?.()) return;

    const plugins = cap.Plugins || {};
    const light = themeId === "carnet";
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--meta-theme").trim()
      || (light ? "#F4EFE6" : "#0F0E0D");

    if (plugins.StatusBar) {
      plugins.StatusBar.setStyle({ style: light ? "LIGHT" : "DARK" }).catch(function () {});
      plugins.StatusBar.setBackgroundColor({ color: bg }).catch(function () {});
    }
  };

  window.nativeHaptic = function (kind) {
    const Haptics = window.Capacitor?.Plugins?.Haptics;
    if (!Haptics) return;
    if (kind === "success") {
      Haptics.impact({ style: "LIGHT" }).catch(function () {});
    } else {
      Haptics.notification({ type: "ERROR" }).catch(function () {});
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNative);
  } else {
    initNative();
  }
})();
