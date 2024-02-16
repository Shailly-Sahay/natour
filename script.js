'use script';

'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

message.classList.add('cookie-message');

message.textContent =
  'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';

header.prepend(message);
header.append(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.backgroundColor = '#37383d';

// Smooth scrolling

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--login')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED COMPONENT

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // ACTIVATE
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// FADING OF LINKS IN NAVBAR
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');
    const logo = clicked.closest('.nav').querySelector('img');

    logo.style.opacity = this;
    siblings.forEach(el => {
      if (el !== clicked) el.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// STICKY NAVBAR
const navHeight = nav.getBoundingClientRect();
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight.height}px`,
  threshold: 0,
});
headerObserver.observe(header);

// REVEALING ELEMENTS ON SCROLLING

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('.section');
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING IMAGES -- REALLY GREAT FOR PERFORMANCE

const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace the src with data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img');

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// ********************************
// NOTES
// // ********************************

const sliderComp = function () {
  // SLIDER
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // Variables for the functionality if the btns
  let currSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions

  // 1. Function for shifting of slides
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // 2. Right btn functionality
  const nextSlide = function () {
    if (currSlide === maxSlide) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  // 3. Left btn functionality
  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlide;
    } else currSlide--;
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  // 4. Creation of dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = 'dots__dot' data-slide = '${i}'></button>`
      );
    });
  };

  // 5. Current dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //6. Initialization
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event handlers
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
};

sliderComp();

document;
