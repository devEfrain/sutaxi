window.addEventListener('load', function(){
    /*Registramos el service worker*/
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('Success !'))
          .catch(err => console.warn('Unable', err))
    }    
});