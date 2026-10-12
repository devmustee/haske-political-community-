/**
 * Runs scroll reveals from a tiny inline script in <head>, so content
 * appears as soon as it scrolls into view, without waiting for the page's
 * JavaScript bundle to download and hydrate (seconds on a slow phone).
 *
 * It adds `js` to <html> only when it can do the revealing itself; the
 * hiding CSS in globals.css is scoped to `.js`, so if this script never runs,
 * nothing is hidden. Under reduced motion it doesn't add `js` at all.
 * <Reveal> keeps its own observer for content rendered later in the browser.
 */
const SCRIPT = `(function(){try{
var d=document.documentElement;
if(!window.IntersectionObserver||!window.MutationObserver||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
d.classList.add("js");
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px"});
function scan(n){if(n.classList&&n.classList.contains("reveal"))io.observe(n);if(n.querySelectorAll)n.querySelectorAll(".reveal").forEach(function(r){io.observe(r)})}
var mo=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(scan)})});
mo.observe(d,{childList:true,subtree:true});
addEventListener("load",function(){setTimeout(function(){mo.disconnect()},5000)});
}catch(e){document.documentElement.classList.remove("js")}})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
