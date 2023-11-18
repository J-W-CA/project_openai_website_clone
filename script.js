let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  controller = new ScrollMagic.Controller();

  document.querySelectorAll('.slide').forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-img');
    const img = slide.querySelector('img');
    const revealText = slide.querySelector('.reveal-text');

    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' },
    });

    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
    slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
    })
      .setTween(slideTl)
      .addTo(controller);

    const pageTl = gsap.timeline();
    const nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];

    pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');

    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

function detailAnimation() {
  controller = new ScrollMagic.Controller();

  document.querySelectorAll('.detail-slide').forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    const nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    const nextImg = nextSlide.querySelector('img');

    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, '-=1');
    slideTl.fromTo(nextImg, { x: '90%' }, { x: '0%' });

    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addTo(controller);
  });
}

function cursor(e) {
  const { pageX, pageY } = e;
  gsap.to('.cursor', { duration: 0.5, left: pageX, top: pageY });
}

function activeCursor(e) {
  const item = e.target;
  const cursor = document.querySelector('.cursor');

  if (item.id === 'logo' || item.classList.contains('burger')) {
    cursor.classList.add('nav-active');
  } else {
    cursor.classList.remove('nav-active');
  }

  if (item.classList.contains('explore')) {
    cursor.classList.add('explore-active');
    gsap.to('.title-swipe', 1, { y: '0%' });
  } else {
    cursor.classList.remove('explore-active');
    gsap.to('.title-swipe', 1, { y: '100%' });
  }
}

function navToggle(e) {
  const { target } = e;

  if (!target.classList.contains('active')) {
    target.classList.add('active');
    gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: 'black' });
    gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'black' });
    gsap.to('#logo', 1, { color: 'black' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' });
    document.body.classList.add('hide');
  } else {
    target.classList.remove('active');
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: 'white' });
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'white' });
    gsap.to('#logo', 1, { color: 'white' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
    document.body.classList.remove('hide');
  }
}

// Event Listeners
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
document.querySelector('.burger').addEventListener('click', navToggle);

// Initialize Barba.js
barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        animateSlides();
        document.querySelector('#logo').href = './index.html';
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: 'fashion',
      beforeEnter() {
        document.querySelector('#logo').href = '../index.html';
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        const done = this.async();
        gsap.timeline({ defaults: { ease: 'power2.inOut' } })
          .to(current.container, { opacity: 0 })
          .to('.swipe', { x: '0%', onComplete: done }, '-=0.5');
      },
      enter({ next }) {
        const done = this.async();
        window.scrollTo(0, 0);
        gsap.timeline({ defaults: { ease: 'power2.inOut' } })
          .to('.swipe', { x: '100%', stagger: 0.2, onComplete: done })
          .fromTo(next.container, { opacity: 0 }, { opacity: 1 })
          .fromTo('.nav-header', { y: '-100%' }, { y: '0%' }, '-=1.5');
      },
    },
  ],
});
