'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////////////
// 1- Button Smooth scrooling
const section1 = document.querySelector('.section');
const btnScrollTo = document.querySelector('.btn--scroll-to');
btnScrollTo.addEventListener('click', e => {
  e.preventDefault();
  section1.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'end',
  });
});

//2-Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//3- Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//4- Tabbed components

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', e => {
  //using event delegation
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; // if clicked anywhere in empty space between the buttons

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//5-New fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //fade animation on buttons
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//add fade animation on mouse hover
nav.addEventListener('mouseover', handleHover.bind(0.5)); //passing args with help of bind method

//remove fade animation on mouse gover
nav.addEventListener('mouseout', handleHover.bind(1));

// //6- STicky navigation
// const initialCoords = section1.getBoundingClientRect(); //gives top value of the section
// //console.log(initialCoords);
// window.addEventListener('scroll', () => {
//   // console.log(window.scrollY); //current scroll position
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//                                OR

// 7- intersection observer api
// const obsCallback = (enteries, observer) => {
//   //called when target element is intersecting the threshold or the viewport
//   enteries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null, //observe action performed on this element
//   threshold: 0.1, //obsCallback will be triggered when 10% of the section is visible to the viewport  // or percentage that we want to be visible in the viewport
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);

const headCallback = (enteries, observer) => {
  enteries.forEach(entry => {
    //console.log(entry.isIntersecting);

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  });
};

const headOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //so that it doesnt oerlap into new section
};

const headerObserver = new IntersectionObserver(headCallback, headOptions);
headerObserver.observe(header);

//

//

//8- Reveal elements on scroll
const allSections = document.querySelectorAll('.section');

const sectionCallback = (enteries, observer) => {
  const [entry] = enteries;

  // console.log(entry);
  // console.log(entry.target.className);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //for improved performance unobserve the selected element
};

const sectionOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(
  sectionCallback,
  sectionOptions
);

allSections.forEach(section => {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

//
//9-Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const imgCallback = (enteries, observer) => {
  const [entry] = enteries;

  //console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //for slow networks, the image will display only when loaded completely
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgOptions = {
  root: null,
  threshold: 0.5,
  rootMargin: '200px', //the image will load 200pixels before the viewport element so that user doesnt know we are lazy loading an image
};
const imgObserver = new IntersectionObserver(imgCallback, imgOptions);
imgTargets.forEach(imgTarget => {
  imgObserver.observe(imgTarget);
});

//

//10- Slider component for last section
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector('.slider');

  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';
  //slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); //putting slides side by side

  /************************************************************** */
  //creating Dots for  the slider
  //Dots
  const dotContainer = document.querySelector('.dots');
  const createDots = () => {
    slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = slide => {
    document
      .querySelectorAll('dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //sliding next
  const goToSlide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = () => {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = () => {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = () => {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //keyboard event
  document.addEventListener('keydown', e => {
    console.log(e.key);

    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT_TED');
      // console.log(e.target.dataset.slide);
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/********************************************************************** */
//sliding next
// btnRight.addEventListener('click', () => {
//   if (curSlide === maxSlide - 1) curSlide = 0;
//   else curSlide++;

//   slides.forEach(
//     (s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`)
//   );
// });

// //creating and inserting elements

// //creating a cookie message
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = `We use cookies for improved functionality
// and analytics. <button class='btn btn--close-cookie'>Got it! </button>`;

// header.append(message);

// //deleting the cookie message
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', e => message.remove('cookie-message'));

// //styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// console.log(getComputedStyle(message).color);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// logo.alt = 'Beautiful sunny weather';
// console.log(logo.alt);

// logo.setAttribute('alt', 'xxxx');
// console.log(logo.designer);

// console.log(logo.dataset.versionNumber);

// // 1- Smooth scrooling
// const section1 = document.querySelector('.section');
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// btnScrollTo.addEventListener('click', e => {
//   e.preventDefault();
//   section1.scrollIntoView({
//     behavior: 'smooth',
//     block: 'center',
//     inline: 'end',
//   });
// });

// const section2 = document.querySelector('#section--2');
// const btnScrollTo2 = document.querySelector('.nav__link');

// btnScrollTo2.addEventListener('click', e => {
//   e.preventDefault();
//   section2.scrollIntoView({ behavior: 'instant' });
// });

// const h1 = document.querySelector('h1');
// const alertH1 = e => {
//   alert('Great you are reading the heading');
// };
// h1.addEventListener('mouseenter', alertH1);

// setTimeout(e => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);

//DOM traversing
// const h1 = document.querySelector('h1');

// //going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); //gives direct childrens
// console.log(h1.children); //give livecollection
// h1.firstElementChild;
// h1.firstElementChild.style.color = 'gray';
// h1.lastElementChild.style.color = 'orangered';

// //going downwards: parents

// console.log(h1.parentNode);
// h1.closest('.header').style.background = 'var(--gradient-primary)';

//Prototype in js

// const Person = function (firstName, birthYear) {
//   //by default 'prototype' will be joined with this function

//   this.firstName = firstName;
//   this.birthYear = birthYear;
// };
// console.log(Person.prototype);

// const p1 = new Person('shubham', 2002);
// const p2 = new Person('sunny', 2003);
// console.log(p1.__proto__ === Person.prototype);
// console.log(p1);

// Person.prototype.calcAge = birthYear =>
//   console.log('Age is:', 2024 - birthYear);

// p1.calcAge(2002);
// p2.calcAge(2003);

// p1.__proto__.car = 'Nexon';
// Person.prototype.addCar = 'Brezza';
// console.log(p1.__proto__.addCar);

// //1. New empty object is created {};
// //2. function is callled and this is set to empty obj, this={};
// //3. empty obj {}, is linked to prototype;
// //4. function automatically return  {}
// console.log(jonas.__proto__);
// console.log(Person.prototype);
console.log('****************************************************');

const arr = new Array(3, 6, 6, 4, 4, 7, 8, 9, 9, 9);
console.log(arr.__proto__);
console.log(Array.prototype === arr.__proto__);

Array.prototype.unqiue = function () {
  // return [...new Set(this)];
  const s = new Set(this);
  return [...s];
};
console.log(arr.unqiue());

//implementing car object

const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} is going at ${this.speed}KM/H`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} is going at ${this.speed}KM/H`);
};

const bmw = new Car('BMW', 120);
// console.log(car1.make, car1.speed);
bmw.accelerate();
bmw.brake();
bmw.accelerate();
bmw.accelerate();
bmw.brake();
// const car2 = new Car('Mercedes', 95);
// console.log(car2.make, car2.speed);
// car2.accelerate(95);
// car2.brake(95);

// const [...detail] = [car1.make, car1.speed];
// console.log(details);

//ES6 classes         2 ways:-
//1-class expressions
// const Davis = class {
//   constructor(firstName, birthYear) {
//     this.firstName = firstName;
//     this.birthYear = birthYear;
//   }

//   calcAge() {
//     console.log(2024 - this.birthYear);
//   }
//   greet() {
//     console.log(`Hey, ${this.firstName}`);
//   }
// };

//2-class declaration            //use this
// class PersonCl {
//   constructor(firstName, birthYear) {
//     this.firstName = firstName;
//     this.birthYear = birthYear;
//   }

//   calcAge() {
//     console.log(2024 - this.birthYear);
//   }
//   greet() {
//     console.log(`Hey, ${this.firstName}`);
//   }
// }

// const jessica = new PersonCl('jessica', 2002);
// console.log(jessica);

// jessica.calcAge();
// console.log(jessica.__proto__ === PersonCl.prototype);

// PersonCl.prototype.vehicle = function () {
//   console.log('Car is brezza');
// };
// jessica.vehicle();
// //1- classes works only in Strict mode
// //2- classes are first calss citizens i.e they can be passed and returned using functions
// //3- classes are hoisted  i.e they cannot be used until they are declared

// const account = {
//   owner: 'jonas',
//   movements: [100, 200, 300, 400, 500],

//   get latest() {
//     return this.movements.slice(-1).pop;
//   },

//   set latest(mov) {
//     this.movements.push(mov);
//   },
// };

// console.log(account.latest);
// console.log(account.movements);

// class PersonCl {
//   constructor(firstName, birthYear) {
//     this.firstName = firstName;
//     this.birthYear = birthYear;
//   }
//   calcAge() {
//     console.log('age is', 2024 - this.birthYear);
//   }

//   get randomFunc() {
//     return 2024 - this.birthYear;
//   }
// }

// const jessica = new PersonCl('jessica', 2003);
// console.log(jessica);
// console.log(jessica.randomFunc);

// console.log(jessica.__proto__ === PersonCl.prototype);

// PersonCl.prototype.greet = function () {
//   console.log(`Hello ${this.firstName}!`);
// };
// jessica.greet();

//Setters and Getters
// const account = {
//   owner: 'shubham bhatt',
//   movements: [10, 20, 30, 69],

//   get latest() {
//     return this.movements.slice(-1).pop();
//   },

//   set latest(mov) {
//     this.movements.push(mov);
//   },
// };

// console.log(account.latest);

// account.latest = 6969;
// console.log(account.movements);

//Object.create

// const PersonProto = {
//   init(firstName, birthYear) {
//     this.firstName = firstName;
//     this.birthYear = birthYear;
//   },
//   calcAge() {
//     console.log(this.birthYear - 2024);
//   },
// };

// const steven = Object.create(PersonProto);
// console.log(steven);

// const jonas = Object.create(PersonProto);
// jonas.init('jonas', 1965);
// jonas.calcAge();

// //Excersice

// class speed {
//   constructor(carName, speed) {
//     this.carName = carName;
//     this.speed = speed;
//   }

//   accelerate() {
//     this.speed += 10;
//     console.log(`${this.carName}going at speed ${this.speed} Km/H`);
//   }
//   brake() {
//     this.speed -= 5;
//     console.log(`${this.carName}going at speed ${this.speed} Km/H`);
//   }

//   get speedUS() {
//     return this.speed / 1.6;
//   }

//   set speedUS(s) {
//     this.s = s * 1.6;
//   }
// }

// const brezza = new speed('brezza', 60);
// brezza.accelerate();
// brezza.accelerate();
// brezza.accelerate();
// brezza.brake();

// brezza.speedUs = 50;
// console.log(brezza);

// **********************Pure Inheritance*************************

const Person = function (firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;
};

Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

const Student = function (firstName, birthYear, course) {
  // this.firstName = firstName;
  // this.birthYear = birthYear;
  // Person(firstName, birthYear); //regular func call 'this' is set to undefinde. So we also set this keyword using call( func)
  Person.call(this, firstName, birthYear);
  this.course = course;
};

//linking the prototype manually
Student.prototype = Object.create(Person.prototype); //student.prototype inherits from person.prototype

Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName} and I studey in ${this.course}`);
};

const mike = new Student('Mike', 2020, 'Computer Science');
Student.prototype.constructor = Student;
mike.introduce();
mike.calcAge();

console.log(mike instanceof Student);
console.log(mike instanceof Person);

//******************************************************** */
//Inhertiance using ES6 classes
class PersonCl {
  constructor(fullname, birthYear) {
    this.fullname = fullname;
    this.birthYear = birthYear;
  }

  calcAge() {
    console.log(2037 - this.birthYear);
  }
  greet() {
    console.log(`Hey ${this.fullname}`);
  }

  get age() {
    return 2037 - this.birthYear;
  }

  // set fullname(name) {
  //   if (name.includes(' ')) this.fullname = name;
  //   else alert(`${name} is not full name!`);
  // }

  // get fullname() {
  //   return this.fullname;
  // }

  static hey() {
    console.log('Hey there');
  }
}

class student1 extends PersonCl {
  constructor(fullname, birthYear, course) {
    super(fullname, birthYear); //super keyword will always be used before. As this allows the use of this keyword further
    this.course = course;
  }

  introduce() {
    console.log(`Hey there ${this.fullname} and i study ${this.course}`);
  }

  calcAge() {
    console.log(2037 - this.birthYear + 10);
  }
}

const martha = new student1('Matha jones', 2012, 'computer science');
martha.introduce();
martha.calcAge();

const jonas = new student1('Jonas', 2000, 'Psychology');
const shubham = new student1('shubham bhatt', 2002);

shubham.introduce();
shubham.calcAge();

//Using object.create()
//Most easiest way
const PersonProto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  init(firstname, birthYear) {
    this.firstName = firstname;
    this.birthYear = birthYear;
  },
};

const StudentProto = Object.create(PersonProto);
StudentProto.init = function (firstname, birthYear, course) {
  PersonProto.init.call(this, firstname, birthYear);
  this.course = course;
};
console.log(StudentProto.init);

StudentProto.introduce = function () {
  console.log(`Hi there i am ${this.firstName}`);
};

const jay = Object.create(StudentProto);
jay.init('JAY', 2002);
jay.introduce();
jay.calcAge();

//

//Encapsulation- keeping some data private in class so that it is not accessed from outside world

// 4  ways to be provided in fututre :
// 1- public fields
// 2- private fields
// 3- public methods
// 4- public methods

class Account {
  //1-public field
  locale = navigator.language;
  //2-private field
  #movements = [];
  #pin;
  constructor(name, currency, pin) {
    this.name = name;
    this.currency = currency;
    this.#pin = pin;

    console.log(`thanks for opening an account ${this.owner}`);
  }

  //3-public methods
  deposit(val) {
    this.#movements.push(val);
    return this; //in case of chaining
  }
  withdrawl(val) {
    this.deposit(-val);
    return this; //in case of chaining
  }
  getMovements() {
    return this.#movements;
  }

  requestLoan(val) {
    if (this._approveLoan(val)) {
      this.deposit(val);
      console.log(`Loan amount of ${val} sanctioned`);
      return this; //in case of chaining
    }
  }

  //4-private methods
  // #approveLoan(val) {
  //   return true;
  // }

  //protected method
  _approveLoan(val) {
    return true;
  }
}

const acc1 = new Account('shubhaam', 'INR', 6969);
// console.log(acc1);
// acc1.movements.push(1000);
// acc1.movements.push(-250);
acc1.deposit(1000);
acc1.deposit(1250);
console.log(acc1);

console.log(acc1.getMovements());
// console.log(acc1.#movements);
// console.log(acc1.#pin);
// console.log(acc1.#approveLoan(100));

//Note: '#" is for private data  and "_" is for protected data

//Chaining
acc1.deposit(300).deposit(500).withdrawl(35).requestLoan(6969).withdrawl(4000);
console.log(acc1.getMovements());

////////////////
// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

const request = new XMLHttpRequest();
request.open('GET', 'https://restcountries.com/v3.1/name/india');
request.send();

request.addEventListener('load', function () {
  const [data] = JSON.parse(this.responseText);
  console.log(data);
});
