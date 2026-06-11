(function () {
  function initNative() {
    const cap = window.Capacitor;
    if (!cap?.isNativePlatform?.()) return;

    document.documentElement.classList.add("is-native");
    document.body.classList.add("is-native");

    const plugins = cap.Plugins || {};
    if (plugins.StatusBar) {
      plugins.StatusBar.setStyle({ style: "LIGHT" }).catch(function () {});
      plugins.StatusBar.setBackgroundColor({ color: "#F4EFE6" }).catch(function () {});
    }
    if (plugins.SplashScreen) {
      plugins.SplashScreen.hide().catch(function () {});
    }
  }

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
