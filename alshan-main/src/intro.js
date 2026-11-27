(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;
  var root = document.documentElement;
  var path = location.pathname.replace(/\/+$/, '') || '/';
  var forced = /[?&]intro=1/.test(location.search);
  var seen = false; try { seen = !!sessionStorage.getItem('introSeen'); } catch (e) {}
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function abort() { root.classList.remove('intro-pending'); if (intro.parentNode) intro.parentNode.removeChild(intro); }
  if (path !== '/' || reduce || (seen && !forced)) { abort(); return; }

  var SPEED = 1;
  var EASE_OUT = 'cubic-bezier(.16,1,.3,1)';
  var EASE_IO = 'cubic-bezier(.76,0,.24,1)';
  var EASE_SOFT = 'cubic-bezier(.33,1,.68,1)';
  var FAR = 'cubic-bezier(.3,.3,.2,1)';
  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stageLockup'), word = $('stageWord'), bg = $('introBg'), mark = $('stageMark'), rule = $('rule');
  var pL = $('pL'), pR = $('pR'), pB = $('pB');
  var anims = [], timers = [], started = false;

  function t(ms) { return ms * SPEED; }
  function go(el, kf, opt) { var a = el.animate(kf, Object.assign({ fill: 'both' }, opt)); anims.push(a); return a; }
  function at(ms, fn) { timers.push(setTimeout(fn, t(ms))); }
  var guard = setTimeout(function () { if (!started) abort(); }, 4500);

  function run(brand) {
    if (started) return; started = true; clearTimeout(guard);
    var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (brand) brand.classList.add('pending');
    intro.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('intro-pending'); }); });
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}

    var k = 908 / mark.getBoundingClientRect().width;
    var X = (window.innerWidth / 2 + 160) * k, Y = (window.innerHeight / 2 + 160) * k;
    go(pL, [{ transform: 'translate(' + (-X) + 'px, ' + (Y * .12) + 'px) rotate(-24deg)', opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: t(1300), easing: FAR });
    go(pR, [{ transform: 'translate(' + X + 'px, ' + (-Y * .12) + 'px) rotate(22deg)', opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: t(1300), delay: t(120), easing: FAR });
    go(pB, [{ transform: 'translate(0px, ' + (-Y) + 'px) rotate(-36deg)', opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: t(1300), delay: t(240), easing: FAR });
    go(mark, [{ transform: 'scale(1)' }, { transform: 'scale(1.045)', offset: .5 }, { transform: 'scale(1)' }], { duration: t(320), delay: t(1500), easing: 'ease-in-out' });

    word.style.width = 'auto'; word.style.marginLeft = '0';
    var W = word.getBoundingClientRect().width;
    word.style.width = ''; word.style.marginLeft = '';
    go(word, [{ width: '0px', marginLeft: '0em', opacity: 0 }, { opacity: 1, offset: .25 }, { width: W + 'px', marginLeft: '.6em', opacity: 1 }], { duration: t(900), delay: t(1580), easing: EASE_IO });
    go(rule, [{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 1, offset: .65 }, { transform: 'scaleX(1)', opacity: 0 }], { duration: t(1050), delay: t(2280), easing: EASE_SOFT });

    at(2730, function () {
      if (brand) brand.classList.remove('pending');
      var s = stage.getBoundingClientRect();
      if (brand) brand.classList.add('pending');
      var h = brand ? brand.getBoundingClientRect() : s;
      var sc = h.width / s.width, dx = h.left - s.left, dy = h.top - s.top;
      go(stage, [{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sc + ')' }], { duration: t(850), easing: EASE_IO });
      go(bg, [{ opacity: 1 }, { opacity: 0 }], { duration: t(700), delay: t(250), easing: 'cubic-bezier(.4,0,.6,1)' });
      reveals.forEach(function (el, i) {
        var line = el.getAttribute('data-reveal') === 'line';
        var from = line ? { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(-35%)', opacity: 0 } : { transform: 'translateY(-16px)', opacity: 0 };
        var to = line ? { clipPath: 'inset(0 0 0% 0)', transform: 'none', opacity: 1 } : { transform: 'none', opacity: 1 };
        go(el, [from, to], { duration: t(800), delay: t(380 + i * 120), easing: EASE_OUT, fill: 'backwards' });
      });
    });

    at(3590, function () {
      if (brand) brand.classList.remove('pending');
      intro.hidden = true;
      anims = anims.filter(function (a) {
        if (a.effect && a.effect.target && reveals.indexOf(a.effect.target) > -1) return true;
        a.cancel(); return false;
      });
    });
  }

  function whenBrand(cb) {
    var t0 = performance.now();
    (function poll() {
      var b = document.getElementById('brand');
      if (b || performance.now() - t0 > 1500) cb(b); else requestAnimationFrame(poll);
    })();
  }
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 800); })]).then(function () { whenBrand(run); });
})();
