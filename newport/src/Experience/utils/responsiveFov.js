// Three.js `camera.fov` is always the VERTICAL field of view, so a narrow
// portrait viewport (small aspect = width/height) gets a much narrower
// HORIZONTAL fov than a wide desktop one even with the same fov number —
// content positioned assuming a landscape-ish view gets cropped sideways.
//
// This widens the vertical fov on narrow viewports so the HORIZONTAL
// framing stays roughly what it was at `baseAspect`, clamped to
// `maxFovDeg` so it doesn't turn into a fisheye lens on extreme ratios
// (very tall/narrow phones). At or above baseAspect, returns baseFovDeg
// unchanged — desktop framing is untouched.
export function getResponsiveFov(baseFovDeg, baseAspect, currentAspect, maxFovDeg = 85) {
  if (!currentAspect || currentAspect >= baseAspect) return baseFovDeg;

  const baseVFovRad = (baseFovDeg * Math.PI) / 180;
  const hFovRad = 2 * Math.atan(Math.tan(baseVFovRad / 2) * baseAspect);
  const newVFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) / currentAspect);
  const newVFovDeg = (newVFovRad * 180) / Math.PI;

  return Math.min(newVFovDeg, maxFovDeg);
}

// Same idea as getResponsiveFov, but for scenes where the content is spread
// wide enough (e.g. Profile's name/role text) that even a fov widened up to
// maxFovDeg still crops it sideways on a tall phone. Once fov hits its cap,
// this returns a distanceScale > 1 so the camera can be dollied back along
// its existing view ray (pulled away from its look-at target) to reveal the
// remaining horizontal framing that fov alone couldn't — trading "smaller
// on screen" for "not cut off", which content going off-screen never gets
// back from. At/above baseAspect (or before the fov cap is hit) this
// returns distanceScale: 1, i.e. no change to camera position.
export function getResponsiveFraming(baseFovDeg, baseAspect, currentAspect, maxFovDeg = 85) {
  if (!currentAspect || currentAspect >= baseAspect) {
    return { fovDeg: baseFovDeg, distanceScale: 1 };
  }

  const baseVFovRad = (baseFovDeg * Math.PI) / 180;
  const hFovRad = 2 * Math.atan(Math.tan(baseVFovRad / 2) * baseAspect);
  const idealVFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) / currentAspect);
  const idealVFovDeg = (idealVFovRad * 180) / Math.PI;

  if (idealVFovDeg <= maxFovDeg) {
    return { fovDeg: idealVFovDeg, distanceScale: 1 };
  }

  const maxVFovRad = (maxFovDeg * Math.PI) / 180;
  const distanceScale = Math.tan(idealVFovRad / 2) / Math.tan(maxVFovRad / 2);
  return { fovDeg: maxFovDeg, distanceScale };
}
