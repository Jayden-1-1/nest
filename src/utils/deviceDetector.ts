// Comprehensive Device Recognition & Adaptation Engine for iPhone (11-17 Pro/Max) and Android

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'desktop';
  modelName: string;
  family: string;
  screenCutout: 'dynamic-island' | 'notch' | 'punch-hole' | 'none';
  hasDynamicIsland: boolean;
  hasNotch: boolean;
  isStandalone: boolean;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  dpr: number;
  recommendedTopInset: number;
  recommendedBottomInset: number;
}

export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      platform: 'desktop',
      modelName: 'Desktop Web',
      family: 'Desktop',
      screenCutout: 'none',
      hasDynamicIsland: false,
      hasNotch: false,
      isStandalone: false,
      screenWidth: 1920,
      screenHeight: 1080,
      viewportWidth: 1920,
      viewportHeight: 1080,
      dpr: 1,
      recommendedTopInset: 0,
      recommendedBottomInset: 0,
    };
  }

  const ua = navigator.userAgent || '';
  const dpr = window.devicePixelRatio || 1;
  const sw = Math.min(window.screen.width, window.screen.height);
  const sh = Math.max(window.screen.width, window.screen.height);
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Standalone / PWA detection (iOS "Add to Home Screen" or Android PWA installed mode)
  const isIosStandalone = (window.navigator as any).standalone === true;
  const isMediaStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isStandalone = isIosStandalone || isMediaStandalone;

  // Detect iOS (iPhone / iPad / iPod)
  const isIPhone =
    /iPhone/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && sw < 500);

  const isIPad =
    /iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && sw >= 500);

  // Detect Android
  const isAndroid = /Android/i.test(ua);

  // iPhone identification based on logical points & DPR
  if (isIPhone) {
    let modelName = 'iPhone';
    let family = 'iPhone';
    let screenCutout: 'dynamic-island' | 'notch' | 'none' = 'notch';
    let topInset = 47;
    let bottomInset = 34;

    // iPhone 16 Pro Max / 17 Pro Max (440 x 956 pt, DPR 3)
    if (sw >= 435 && sh >= 950) {
      modelName = 'iPhone 16 / 17 Pro Max';
      family = 'iPhone Pro Max (6.9")';
      screenCutout = 'dynamic-island';
      topInset = 59;
    }
    // iPhone 16 Pro / 17 Pro (402 x 874 pt, DPR 3)
    else if (sw >= 398 && sw <= 410 && sh >= 870 && sh <= 880) {
      modelName = 'iPhone 16 / 17 Pro';
      family = 'iPhone Pro (6.3")';
      screenCutout = 'dynamic-island';
      topInset = 59;
    }
    // iPhone 14 Pro Max / 15 Plus / 15 Pro Max / 16 Plus (430 x 932 pt, DPR 3)
    else if (sw >= 425 && sw <= 435 && sh >= 925 && sh <= 940) {
      modelName = 'iPhone 14 / 15 Pro Max & Plus';
      family = 'iPhone Dynamic Island (6.7")';
      screenCutout = 'dynamic-island';
      topInset = 54;
    }
    // iPhone 14 Pro / 15 / 15 Pro / 16 (393 x 852 pt, DPR 3)
    else if (sw >= 390 && sw <= 396 && sh >= 850 && sh <= 856) {
      modelName = 'iPhone 14 Pro / 15 / 16';
      family = 'iPhone Dynamic Island (6.1")';
      screenCutout = 'dynamic-island';
      topInset = 54;
    }
    // iPhone 12 Pro Max / 13 Pro Max / 14 Plus (428 x 926 pt, DPR 3)
    else if (sw >= 425 && sw <= 430 && sh >= 920 && sh <= 930) {
      modelName = 'iPhone 12 / 13 Pro Max / 14 Plus';
      family = 'iPhone Notch (6.7")';
      screenCutout = 'notch';
      topInset = 47;
    }
    // iPhone 11 / XR (414 x 896 pt, DPR 2)
    else if (sw === 414 && sh === 896 && dpr < 2.5) {
      modelName = 'iPhone 11 / XR';
      family = 'iPhone Liquid Retina (6.1")';
      screenCutout = 'notch';
      topInset = 48;
    }
    // iPhone 11 Pro Max / XS Max (414 x 896 pt, DPR 3)
    else if (sw === 414 && sh === 896 && dpr >= 2.5) {
      modelName = 'iPhone 11 Pro Max / XS Max';
      family = 'iPhone Super Retina (6.5")';
      screenCutout = 'notch';
      topInset = 44;
    }
    // iPhone 12 / 12 Pro / 13 / 13 Pro / 14 (390 x 844 pt, DPR 3)
    else if (sw >= 388 && sw <= 392 && sh >= 840 && sh <= 848) {
      modelName = 'iPhone 12 / 13 / 14';
      family = 'iPhone Notch (6.1")';
      screenCutout = 'notch';
      topInset = 47;
    }
    // iPhone 11 Pro / X / XS (375 x 812 pt, DPR 3)
    else if (sw === 375 && sh === 812 && dpr >= 2.5) {
      modelName = 'iPhone 11 Pro / X / XS';
      family = 'iPhone Compact Notch (5.8")';
      screenCutout = 'notch';
      topInset = 44;
    }
    // iPhone 12 mini / 13 mini (360-375 x 780-812 pt)
    else if (sw <= 375 && sh >= 770 && sh <= 812) {
      modelName = 'iPhone 12 / 13 mini';
      family = 'iPhone mini';
      screenCutout = 'notch';
      topInset = 50;
    }
    // iPhone SE / 8 (375 x 667 pt, Home button)
    else if (sh <= 670) {
      modelName = 'iPhone SE / 8';
      family = 'iPhone Classic';
      screenCutout = 'none';
      topInset = 20;
      bottomInset = 0;
    } else {
      // Modern iPhone fallback
      modelName = 'Apple iPhone';
      family = 'iPhone';
      screenCutout = 'dynamic-island';
      topInset = 54;
      bottomInset = 34;
    }

    return {
      platform: 'ios',
      modelName,
      family,
      screenCutout,
      hasDynamicIsland: screenCutout === 'dynamic-island',
      hasNotch: screenCutout === 'notch',
      isStandalone,
      screenWidth: sw,
      screenHeight: sh,
      viewportWidth: vw,
      viewportHeight: vh,
      dpr,
      recommendedTopInset: topInset,
      recommendedBottomInset: bottomInset,
    };
  }

  // Android device detection
  if (isAndroid) {
    let modelName = 'Android Device';
    let family = 'Android';

    if (/Samsung|SM-|Galaxy/i.test(ua)) {
      if (/Ultra|S24|S23|S22|S21/i.test(ua)) {
        modelName = 'Samsung Galaxy S-Series';
      } else {
        modelName = 'Samsung Galaxy';
      }
      family = 'Samsung OneUI';
    } else if (/Pixel/i.test(ua)) {
      modelName = 'Google Pixel';
      family = 'Pixel Experience';
    } else if (/Xiaomi|Redmi|POCO/i.test(ua)) {
      modelName = 'Xiaomi / Redmi';
      family = 'HyperOS / MIUI';
    } else if (/OnePlus/i.test(ua)) {
      modelName = 'OnePlus';
      family = 'OxygenOS';
    }

    return {
      platform: 'android',
      modelName,
      family,
      screenCutout: 'punch-hole',
      hasDynamicIsland: false,
      hasNotch: false,
      isStandalone,
      screenWidth: sw,
      screenHeight: sh,
      viewportWidth: vw,
      viewportHeight: vh,
      dpr,
      recommendedTopInset: 32,
      recommendedBottomInset: 20,
    };
  }

  // iPad / Tablet
  if (isIPad) {
    return {
      platform: 'ios',
      modelName: 'Apple iPad',
      family: 'iPadOS',
      screenCutout: 'none',
      hasDynamicIsland: false,
      hasNotch: false,
      isStandalone,
      screenWidth: sw,
      screenHeight: sh,
      viewportWidth: vw,
      viewportHeight: vh,
      dpr,
      recommendedTopInset: 24,
      recommendedBottomInset: 20,
    };
  }

  // Desktop / Laptop
  return {
    platform: 'desktop',
    modelName: 'Desktop Browser',
    family: 'Desktop',
    screenCutout: 'none',
    hasDynamicIsland: false,
    hasNotch: false,
    isStandalone: false,
    screenWidth: sw,
    screenHeight: sh,
    viewportWidth: vw,
    viewportHeight: vh,
    dpr,
    recommendedTopInset: 0,
    recommendedBottomInset: 0,
  };
}

/**
 * Injects CSS variables and DOM data attributes for seamless responsive styling
 */
export function applyDeviceAdaptations(): DeviceInfo {
  const info = detectDevice();
  const root = document.documentElement;

  root.setAttribute('data-device-platform', info.platform);
  root.setAttribute('data-device-model', info.modelName);
  root.setAttribute('data-screen-cutout', info.screenCutout);
  root.setAttribute('data-is-standalone', info.isStandalone ? 'true' : 'false');

  // Set CSS variables
  root.style.setProperty('--device-top-inset', `${info.recommendedTopInset}px`);
  root.style.setProperty('--device-bottom-inset', `${info.recommendedBottomInset}px`);

  return info;
}
