/* eslint-disable @typescript-eslint/no-unused-vars */
window.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // tabs

     let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }


    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });


    // timer

    let deadline = '2023-10-28';

    function getTimeRemaining(endTime) {
        let t = Date.parse(endTime) -  Date.parse(new Date()),
            seconds = Math.floor((t/1000) %  60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor((t/(1000*60*60)));

            // hours = Math.floor((t/1000/60/60) % 24)
            // days = Math.floor((t/(1000*60*60*24)))
        
        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endTime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endTime);

            function addZero(num) {
                if (num <= 9) {
                    return '0' + num;
                } else return num;
            }
            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    setClock('timer', deadline);

    // Modal

    let more = document.querySelectorAll('.description-btn, .more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');


    more.forEach(function(more) {
        more.addEventListener('click', function() {
            overlay.style.display = 'block';
            this.classList.add('more-splash');
            document.body.style.overflow = 'hidden'; // это нужно для того, чтобы не было прокрутки страницы, когда открыто модальное окно
        })
    });
    
    

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        more.forEach(function(more) {
            more.classList.remove('more-splash');
        })
        
    });


    // Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        let formData = new FormData(form);

        let obj = {};
        formData.forEach(function(value, key) {
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if(request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    });

    // Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');


    showSlides(slideIndex);
    function showSlides(n) {

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');

        // другой способ записи
        // for (let i = 0; i < slides.length; i++) {
        //     slides[i].style.display = 'none';
        // } 

        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex= n);
    }

    prev.addEventListener('click', function() {
        plusSlides(-1);
    });

    next.addEventListener('click', function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event) {
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i - 1]) {
                currentSlide(i);
            }
        }
    });

    // Calc

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

        totalValue.innerHTML = 0;

        persons.addEventListener('change', function() {
            personsSum = +this.value;
            total = (daysSum + personsSum)*4000;

            if(restDays.value == '') {
                totalValue.innerHTML = 0;
            } else if (persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });

        restDays.addEventListener('change', function() {
            daysSum = +this.value;
            total = (daysSum + personsSum)*4000;

            if(persons.value == '') {
                totalValue.innerHTML = 0;
            } else if (restDays.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });

        place.addEventListener('change', function() {
            if(restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                let a = total;
                totalValue.innerHTML = a * this.options[this.selectedIndex].value;
            }
        });
});






// function sendForm(elem) {
//     elem.addEventListener('submit', function(e) {
//         e.preventDefault();
//         elem.appendChild(statusMessage);
//         let formData= new FormData(elem);

//         function postData(data) {

//             return new Promise(function(resolve, reject) {
//                 let request = new XMLHttpRequest();

//                 request.open('POST', 'server.php');

//                 request.setRequestHeader('Content-type', 'applicatio/json; charset=utf-8');

//                 request.onreadystatechange = function() {
//                     if(request.readyState < 4) {
//                         resolve();
//                     } else if (request.readyState === 4) {
//                         if (request.status == 200 && request.status < 300) {
//                             resolve();
//                         }
//                         else {
//                             reject()
//                         }
//                     }
//                 }

//                 request.send(data);
//             })
//         } // End postData

//         function clearInput() {
//             for (let i = 0; i < input.length; i++) {
//                  input[i].value = '';
//             }
//         }

//         postData(formData)
//             .then(()=> statusMessage.innerHTML = message.loading)
//             .then(()=> {
//                 //thanksModal.style.display = 'block';
//                 //mainModal.style.display = 'none';
//                 statusMessage.innerHTML = '';
//             })
//             .catch(()=> statusMessage.innerHTML = message.failure)
//             .then(clearInput)
//     })
// }

// sendForm(form);
// // sendForm(formBottom);