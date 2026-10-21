/* Smith County Soccer v3 - shared vanilla JS */
(function(){
"use strict";
document.documentElement.classList.remove('no-js');
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// nav
var hdr=document.querySelector('header.site'),btn=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
if(btn&&menu){btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o);if(hdr)hdr.classList.add('solid')});
 menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false')})});}
function onScroll(){if(hdr)hdr.classList.toggle('scrolled',window.scrollY>30)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
// reveal
var rv=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window&&!RM){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});rv.forEach(function(el){io.observe(el)})}
else rv.forEach(function(el){el.classList.add('in')});
// parallax
var layers=document.querySelectorAll('[data-speed]');
if(layers.length&&!RM){var tick=false;function px(){var y=window.scrollY;if(y<window.innerHeight*1.3)layers.forEach(function(l){l.style.transform='translate3d(0,'+(y*parseFloat(l.dataset.speed))+'px,0)'});tick=false}
 window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(px)}},{passive:true});px();}
// carousel (infinite, autoplay, pause on hover/focus, arrows, swipe, keyboard)
document.querySelectorAll('.carousel').forEach(function(c){
 var vp=c.querySelector('.viewport'),tr=c.querySelector('.track');if(!tr)return;
 var orig=[].slice.call(tr.children);orig.forEach(function(n){var k=n.cloneNode(true);k.setAttribute('aria-hidden','true');tr.appendChild(k)});
 var pos=0,paused=false,speed=RM?0:0.45,last=null,setW=0;
 function measure(){var g=parseFloat(getComputedStyle(tr).gap)||0;setW=orig.reduce(function(s,n){return s+n.offsetWidth+g},0)}
 measure();window.addEventListener('resize',measure);
 function wrap(){if(setW){while(pos<=-setW)pos+=setW;while(pos>0)pos-=setW}tr.style.transform='translate3d('+pos+'px,0,0)'}
 function loop(t){if(last!=null&&!paused&&!drag)pos-=speed*Math.min(t-last,50)/16;last=t;wrap();requestAnimationFrame(loop)}
 var anim=null;function jump(d){var step=(orig[0].offsetWidth+(parseFloat(getComputedStyle(tr).gap)||0))*d;var from=pos,to=pos-step,s=null;paused=true;
  function a(t){if(!s)s=t;var p=Math.min((t-s)/(RM?1:450),1),e=1-Math.pow(1-p,3);pos=from+(to-from)*e;wrap();if(p<1)requestAnimationFrame(a);else paused=hover}requestAnimationFrame(a)}
 var hover=false;c.addEventListener('mouseenter',function(){hover=paused=true});c.addEventListener('mouseleave',function(){hover=paused=false});
 c.addEventListener('focusin',function(){hover=paused=true});c.addEventListener('focusout',function(){hover=paused=false});
 var pv=c.querySelector('.prev'),nx=c.querySelector('.next');if(pv)pv.addEventListener('click',function(){jump(-1)});if(nx)nx.addEventListener('click',function(){jump(1)});
 c.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')jump(-1);if(e.key==='ArrowRight')jump(1)});
 var drag=false,sx=0,sp=0;vp.addEventListener('pointerdown',function(e){drag=true;sx=e.clientX;sp=pos;vp.setPointerCapture(e.pointerId)});
 vp.addEventListener('pointermove',function(e){if(drag){pos=sp+(e.clientX-sx);wrap()}});
 ['pointerup','pointercancel'].forEach(function(ev){vp.addEventListener(ev,function(){drag=false})});
 requestAnimationFrame(loop);
});
// scrollytelling (about page)
var story=document.querySelector('.story');
if(story){var chs=[].slice.call(document.querySelectorAll('.chapter')),vis=[].slice.call(document.querySelectorAll('.svis')),dots=[].slice.call(document.querySelectorAll('.prog-dots a')),bar=document.querySelector('.readbar span');
 function setActive(i){chs.forEach(function(c,j){c.classList.toggle('active',j===i)});vis.forEach(function(v,j){v.classList.toggle('on',j===i)});dots.forEach(function(d,j){d.classList.toggle('on',j===i);if(j===i)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current')})}
 if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setActive(chs.indexOf(e.target))})},{rootMargin:'-45% 0px -45% 0px'});chs.forEach(function(c){so.observe(c)})}
 setActive(0);
 function prog(){var h=document.documentElement.scrollHeight-innerHeight;if(bar)bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')'}
 window.addEventListener('scroll',prog,{passive:true});prog();}
// year
document.querySelectorAll('[data-year]').forEach(function(n){n.textContent=new Date().getFullYear()});
})();
// stat counters (real values only)
(function(){var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches,els=document.querySelectorAll('[data-count]');if(RM||!('IntersectionObserver' in window))return;
els.forEach(function(el){var n=+el.dataset.count,p=el.dataset.prefix||'';el.textContent=p+'0';
 var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();var s=null;function f(t){if(!s)s=t;var k=Math.min((t-s)/1200,1);el.textContent=p+Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)},{threshold:.5});o.observe(el)})})();
