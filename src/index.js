/* eslint-disable prefer-destructuring */
/* eslint-disable no-loop-func */
import './style/main.css';
import './style/reset.css';
import obj from './js/values';
import pows from '../test/pow';

console.log(pows());

let {
  q, token, database, number, index, numberSidesOnDisplay, check, flag, flag2,
} = obj;

const main = document.createElement('main');
document.body.appendChild(main);
main.classList.add('main');

const header = document.createElement('header');
main.appendChild(header);

const inputWrapper = document.createElement('div');
header.appendChild(inputWrapper);
inputWrapper.classList.add('input-wrapper');

const searchIcon = document.createElement('div');
inputWrapper.appendChild(searchIcon);
searchIcon.classList.add('search-icon');

const input = document.createElement('input');
inputWrapper.appendChild(input);
input.classList.add('input');

const section = document.createElement('section');
main.appendChild(section);
section.classList.add('section');

const nav = document.createElement('nav');
main.appendChild(nav);
nav.classList.add('nav');

const ul = document.createElement('ul');
nav.appendChild(ul);
ul.classList.add('ul');

const drawNav = () => {
  ul.innerHTML = '';
  for (let i = index + 1; i <= index + 4; i += 1) {
    const li = document.createElement('li');
    ul.appendChild(li);
    li.classList.add('li');
    li.textContent = i;
  }
  if (flag === true && flag2 !== true) {
    ul.childNodes[2].classList.add('selected');
  } else {
    ul.childNodes[!(index > 0) ? 0 : 1].classList.add('selected');
  }
};

const drawArticle = () => {
  section.innerHTML = '';
  let views;
  if (window.innerWidth >= 1201) {
    numberSidesOnDisplay = 4;
  }
  if (window.innerWidth >= 701 && window.innerWidth <= 1200) {
    numberSidesOnDisplay = 2;
  }
  for (let i = number; i < number + numberSidesOnDisplay; i += 1) {
    if (database.items[i]) {
      const article = document.createElement('article');
      section.appendChild(article);
      article.classList.add('article');

      const divVideo = document.createElement('div');
      article.appendChild(divVideo);
      divVideo.classList.add('video');
      const img = document.createElement('img');
      divVideo.appendChild(img);
      img.setAttribute('src', database.items[i].snippet.thumbnails.medium.url);
      img.classList.add('img');

      const titleHref = document.createElement('a');
      divVideo.appendChild(titleHref);
      titleHref.textContent = database.items[i].snippet.title;
      titleHref.classList.add('title');
      titleHref.setAttribute('href', `https://www.youtube.com/watch?v=${database.items[i].id.videoId}`);
      titleHref.setAttribute('target', '_blank');

      const divInf = document.createElement('div');
      article.appendChild(divInf);
      divInf.classList.add('inf');

      const divAuthor = document.createElement('div');
      divInf.appendChild(divAuthor);
      divAuthor.classList.add('author');

      const imgAuthor = document.createElement('div');
      divAuthor.appendChild(imgAuthor);
      imgAuthor.classList.add('img-author');
      const pAuthor = document.createElement('p');
      divAuthor.appendChild(pAuthor);
      pAuthor.textContent = database.items[i].snippet.channelTitle;
      pAuthor.classList.add('by-line');

      const divDate = document.createElement('div');
      divInf.appendChild(divDate);
      divDate.classList.add('date');

      const imgDate = document.createElement('div');
      divDate.appendChild(imgDate);
      imgDate.classList.add('img-date');
      const pDate = document.createElement('p');
      divDate.appendChild(pDate);

      const { publishedAt } = database.items[i].snippet;
      pDate.textContent = publishedAt.split('T')[0];
      pDate.classList.add('by-line');

      const divViews = document.createElement('div');
      divInf.appendChild(divViews);
      divViews.classList.add('views');

      const imgViews = document.createElement('div');
      divViews.appendChild(imgViews);
      imgViews.classList.add('img-views');
      const pViews = document.createElement('p');
      divViews.appendChild(pViews);
      fetch(`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyA3f3zqPSweU2j72W6MjtCWPDNzaaFYI2s&id=${database.items[i].id.videoId}&part=snippet,statistics`)
        .then(data => data.json())
        .then((data) => {
          views = data;
          pViews.textContent = views.items[0].statistics.viewCount;
        });
      pViews.classList.add('by-line');
      const pDescription = document.createElement('p');
      article.appendChild(pDescription);
      pDescription.classList.add('description');
      pDescription.textContent = database.items[i].snippet.description;
    }
  }
};

const makeRequest = () => {
  index = 0;
  number = 0;
  check = 0;
  section.innerHTML = '';
  ul.innerHTML = '';
  if (q.length) {
    fetch(`https://content.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${q}&order=viewCount&key=AIzaSyA3f3zqPSweU2j72W6MjtCWPDNzaaFYI2s&type=video`)
      .then(data => data.json())
      .then((data) => {
        database = data;
        token = data.nextPageToken;
        drawArticle();
        drawNav();
      });
  }
};

input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    q = e.target.value;
    makeRequest();
  }
});

ul.addEventListener('click', (e) => {
  flag = false;
  flag2 = false;
  if (e.target !== document.querySelector('nav') && e.target !== document.querySelector('ul')) {
    Array.from(document.querySelectorAll('li')).forEach(item => item.classList.remove('selected'));
    e.target.classList.add('selected');
    index = Array.from(document.querySelectorAll('li')).indexOf(e.target) + check;
    if (index === 0) flag2 = true;
    number = index * numberSidesOnDisplay;
    if (e.target === ul.lastChild) {
      fetch(`https://content.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${q}&order=viewCount&key=AIzaSyA3f3zqPSweU2j72W6MjtCWPDNzaaFYI2s&pageToken=${token}&type=video`)
        .then(data => data.json())
        .then((data) => {
          database.items = [...database.items, ...data.items];
          token = data.nextPageToken;
          index -= 1;
          drawArticle();
          drawNav();
          index += 1;
        });
      check += 2;
    }
    if (e.target === ul.firstChild && flag2 !== true) {
      flag = true;
      index -= 2;
      check -= 2;
      drawArticle();
      drawNav();
    } else {
      drawArticle();
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 320 && window.innerWidth <= 700) {
    switch (index) {
      case 0: break;
      case 1: break;
      case 2: index += 1; break;
      case 3: index *= 2; index -= 1; break;
      default: index *= 2; index -= 1; break;
    }
    numberSidesOnDisplay = 1;
  }
  if (window.innerWidth >= 701 && window.innerWidth <= 1200) {
    switch (index) {
      case 0: break;
      case 1: index = 0; break;
      case 2: index = 1; break;
      case 3: index = Math.floor(index /= 2); index += 1; break;
      default: index = Math.floor(index /= 2); index -= 1; break;
    }
    numberSidesOnDisplay = 2;
  }
  number = index * numberSidesOnDisplay;
  drawArticle();
  drawNav();
});
