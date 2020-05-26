timer = null;
keyword = null;
interval = null;
size = null;
counter = null;
elemImageCurrent = null;
elemImagePreload = null;
elemFrame = null;
elemConfigurationModal = null;
elemConfigurationKeyword = null;
elemConfigurationInterval = null;

function init() {
  elemFrame = document.getElementById('elem-div-frame');
  elemWelcome = document.getElementById('elem-div-welcome');
  elemConfigurationModal = document.getElementById('elem-div-configuration-modal');
  elemConfigurationKeyword = document.getElementById('elem-inp-configuration-keyword');
  elemConfigurationInterval = document.getElementById('elem-inp-configuration-interval');
  
  keyword = localStorage.getItem('web-frame-keyword');
  interval = parseInt(localStorage.getItem('web-frame-interval')) || 0;

  counter = 0;
  size = getWidth() + 'x' + getHeight();
}

function tap (event) {
  switch (event.target.id) {
    case 'elem-btn-welcome-start':
      start();
      return;
    case 'elem-btn-configuration-next':
      next();
      return;
    case 'elem-inp-configuration-keyword':
    case 'elem-inp-configuration-interval':
      return;
  }
  
  if (! configurationIsOpen()) {
    openConfiguration();
  } else {
    closeConfiguration();
  }
}

function start() {
  if (elemWelcome) {
    elemFrame.removeChild(elemWelcome);
    elemWelcome = null;
  }

  if (!elemImageCurrent) {
    elemImageCurrent = create();
    elemImagePreload = create();
    // @TODO fix order or duplicate
  }

  if (interval > 0) {
    // @TODO why does this not work ????
    console.log('start timer');
    setInterval(function(){ console.log("Hello"); }, 1000);
    timer = setInterval(function(){ 
      console.log('next');
      next();
     }, parseInt( parseInt(interval) * 1000) );
    console.log(timer);
  }
}

function stop() {
  clearInterval(timer);
}

function next() {
  // @TODO does not preload next image
  if (elemImageCurrent) {
    elemImageCurrent.classList.add('transparent');
    setTimeout(function() {
      elemFrame.removeChild(elemImageCurrent);
      elemImageCurrent = elemImagePreload;
      elemImagePreload = create();
    }, 1500);
  } else {
    elemImageCurrent = elemImagePreload;
    elemImagePreload = create();
  }
}

function configurationIsOpen() {
  return elemConfigurationModal.style.display === 'block'
}

function openConfiguration() {
  stop();
  elemConfigurationKeyword.value = keyword;
  elemConfigurationInterval.value = interval;
  elemConfigurationModal.style.display = 'block';
}

function closeConfiguration() {
  if ( keyword !== elemConfigurationKeyword.value ) {
    keyword = elemConfigurationKeyword.value;
    localStorage.setItem('web-frame-keyword', keyword);
    // @TODO replace current image
    // @TODO replace preload image
  }
  if ( interval !== parseInt(elemConfigurationInterval.value) ) {
    interval = parseInt(elemConfigurationInterval.value);
    localStorage.setItem('web-frame-interval', interval);
  }
  elemConfigurationModal.style.display = 'none';
  start();
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function create() {
  counter += 1;
  const img = new Image();
  img.id = `elem-img-${counter}`;
  img.src = `https://source.unsplash.com/${size}/?${keyword}#${counter}`;
  if (elemImageCurrent) {
    elemFrame.insertBefore(img, elemImageCurrent);
  } else {
    elemFrame.appendChild(img);
  }
  return img;
}
