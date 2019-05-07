window.addEventListener('DOMContentLoaded', () => {

    'use strict';

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

    info.addEventListener('click', (event) => {
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

    // Timer
    // Задали дату окончания
    let deadline = '2019-05-10';

    // Определяем сколько осталось часов, минут и секнд до даты
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date());

        if (t > 0) {
            let seconds = Math.floor((t/1000) % 60),
                minutes = Math.floor((t/1000/60) % 60),
                hours = Math.floor((t/1000/60/60) % 24),
                days = Math.floor(t/1000/60/60/24);

            return {
                'total' : t + '',
                'days' : days + '',
                'hours' : hours + '',
                'minutes' : minutes + '',
                'seconds' : seconds + ''
            };
        } else {
            return {
                'total' : '0',
                'days' : '0',
                'hours' : '0',
                'minutes' : '0',
                'seconds' : '0'
            }
        }   
    }

    // Задаем часы
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            days = timer.querySelector('.days'),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            for (let key in t) {
                if (t[key].length < 2 && key != 'days') {
                    t[key] = '0' + t[key];
                }
            }
            switch (t.days) {
                case '0':
                    t.days = '';
                    break;
                case '1':
                    t.days += ' day';
                    break;
                default:
                    t.days += ' days';
                    break;
            }

            days.textContent = t.days;
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);

    // Плавная прокрутка пунктов меню
    let menuPanel = document.querySelector('ul'),
        menuItems = document.querySelectorAll('li > a'),
        overlay = document.querySelector('.overlay'),
        refs = [
            document.querySelector('.info-header'),
            document.querySelector('.slider-title'),
            document.querySelector('.counter-title'),
            document.querySelector('.contact-form')
        ];

    menuItems.forEach((item) => {
        item.classList.add('menu-item');
    });

    menuPanel.addEventListener('click', (event) => {
        event.preventDefault();
        if (!overlay.classList.contains('activeOverlay')) {
            let target = event.target;

            if (target && target.classList.contains('menu-item')) {
                
                // давно придуманный велосипед
                // for (let i = 0; i < menuItems.length; i++) {
                //     if (target == menuItems[i]) {
                //         document.querySelector(menuItems[i].getAttribute('href')).scrollIntoView({
                //             behavior: 'smooth',
                //             block: 'start'
                //         });
                //     }
                // }
    
                // мой велосипед (смещается начальное положение, если кликнуть на кнопку, пока идет предыдущее движение)
                for (let i = 0; i < menuItems.length; i++) {
                    if (target == menuItems[i]) {
                        let margin = 20,
                            startDistance = refs[i].getBoundingClientRect().top - menuPanel.clientHeight - margin;
                    
                        if (i == 0) {
                            margin = 60;
                        }

                        function moveBySteps(distance, time, interval, numStep, id) {
                            let colSteps = Math.floor(time/interval) + 1;
                        
                            if (colSteps%2 == 0) {
                                colSteps += 1;
                            }
                        
                            let coord = [],
                                num = Math.floor(colSteps/2) + 1;
                        
                            coord[colSteps] = parseFloat(distance);
                            coord[1] = 0;
                            coord[num] = parseFloat(distance/2);
                        
                            let acceleration = parseFloat((4 * distance)/Math.pow(time, 2));
                        
                            for (let i = 2; i < (Math.floor(colSteps/2) + 1); i++) {
                                coord[i] = parseFloat(acceleration * Math.pow(((i - 1) * interval), 2)/2);
                            }
                        
                            let dif = num;
                        
                            for (let i = (num + 1); i < colSteps; i++) {
                                coord[i] = parseFloat( coord[i - 1] + (coord[dif] - coord[dif - 1]) );
                                dif--;
                            }
                                        
                            let delta = 0,
                                steps = [];

                            for (let i = 1; i < colSteps; i++) {
                                steps[i] = Math.floor(coord[i + 1] - coord[i] + delta);
                                delta = parseFloat(parseFloat(coord[i + 1] - coord[i] + delta) - steps[i]);
                            }
                        
                            if (steps[numStep] !== undefined) {
                                scrollBy(0, steps[numStep]);
                            } else {
                                clearInterval(id);
                            }
                        }
        
                        function moveByStepsAnimation() {
                            let n = 1,
                                t = 1000,
                                int = 10,
                                idi = setInterval(function() {
                                    moveBySteps(startDistance, t, int, n, idi);
                                    n++;
                                }, int);
                        }

                        moveByStepsAnimation();
                    }
                } 
            }
        }
    });

    // Модальные окна
    let more = document.querySelector('.more'),
        close = document.querySelector('.popup-close'),
        popup = document.querySelector('.overlay > *'),
        tabBtns = document.querySelectorAll('.description-btn'),
        fade = document.querySelectorAll('.fade')[8];

    document.body.addEventListener('click', (event) => {
        for (let i = 0; i < tabBtns.length; i++) {
            
            if (event.target && (event.target == more || event.target == tabBtns[i])) {
                event.preventDefault();
                more.classList.remove('more-splash');
                tabBtns[i].classList.remove('more-splash');
                fade.classList.remove('fade');
    
                if (/Msie|Edge/i.test(navigator.userAgent)) {
                    more.classList.add('more-splash');
                    tabBtns[i].classList.add('more-splash');
                    fade.classList.add('fade');
                } else if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                    //js анимация
                    overlay.style.top = '50%';
                    overlay.style.left = '50%';
                    overlay.style.width = '0%';
                    overlay.style.height = '0%';
                    popup.style.left = '-50%';
                    let shadow = 10;

                    if (event.target == more) {
                        more.style.boxShadow = `0 0 ${shadow}px #c78030`;
                    }
                    if (event.target == tabBtns[i]) {
                        tabBtns[i].style.boxShadow = `0 0 ${shadow}px #c78030`;
                    }
    
                    function overlayAnimation (pos1, pos2, int) {
                        let id = setInterval(frameOverlay, int);
    
                        function frameOverlay() {
                            let plus = 1;
    
                            overlay.style.top = `${parseInt(overlay.style.top) - plus}%`;
                            overlay.style.left = `${parseInt(overlay.style.left) - plus}%`;
                            overlay.style.width = `${parseInt(overlay.style.width) + 2 * plus}%`;
                            overlay.style.height = `${parseInt(overlay.style.height) + 2 * plus}%`;
                            if (event.target == more) {
                                more.style.boxShadow = `0 0 ${++shadow}px #c78030`;
                            }
                            if (event.target == tabBtns[i]) {
                                tabBtns[i].style.boxShadow = `0 0 ${++shadow}px #c78030`;
                            }

                            if (parseInt(overlay.style.top) <= pos1) {
                                clearInterval(id);

                                id = setInterval(framePopup, int);

                                function framePopup() {
                                    let plus = 1;

                                    popup.style.left = `${parseInt(popup.style.left) + 2 * plus}%`;
                                
                                    if (parseInt(popup.style.left) >= pos2) {
                                        clearInterval(id);
                                        if (event.target == more) {
                                            shadow = 0;
                                            more.style.boxShadow = `0 0 ${shadow}px #c78030`;                                        }
                                        if (event.target == tabBtns[i]) {
                                            shadow = 0;
                                            tabBtns[i].style.boxShadow = `0 0 ${shadow}px #c78030`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (event.target == more) {
                        overlayAnimation(3, 44, 20);
                    }
                    if (event.target == tabBtns[i]) {
                        overlayAnimation(0, 50, 5);
                        shadow = 10;
                        tabBtns[i].style.boxShadow = `0 0 ${shadow}px #c78030`;
                    }
                }

                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                overlay.classList.add('activeOverlay');
            }
        }
    });

    // скрываем при нажатии на крестик
    close.addEventListener('click', () => {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].classList.remove('more-splash');
        }
        document.body.style.overflow = '';
        overlay.classList.remove('activeOverlay');
    });
    // скрываем при нажатии в область вне модального окна
    overlay.addEventListener('click', (event) => {
        if (event.target && !popup.contains(event.target)) {
            overlay.style.display = 'none';
            more.classList.remove('more-splash');
            for (let i = 0; i < tabBtns.length; i++) {
                tabBtns[i].classList.remove('more-splash');
            }
            document.body.style.overflow = '';
            overlay.classList.remove('activeOverlay');
        }
    });

    //Ограничение ввода в поля телефон
    let siteInputs = document.querySelectorAll('input[name="phone"]');
    for (let i = 0; i < siteInputs.length; i++) {
        siteInputs[i].addEventListener('input', () => {
            let str = siteInputs[i].value;
            while (/[^\+\d]/.test(str)) {
                str = str.replace(/[^\+\d]/g, '');
                siteInputs[i].value = str;
            }
        });
    }

    // Формы AJAX
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        contactForm = document.getElementById('form'),
        input = form.getElementsByTagName('input'),
        contactInput = contactForm.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');    

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();

        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/x-www-urlencoded');

        let formData = new FormData(form);
        request.send(formData);

        request.addEventListener('readystatechange', () => {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.falure;
            }
        });

        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactForm.appendChild(statusMessage);
        statusMessage.style.color = '#fff';
        statusMessage.style.marginTop = '15px';

        let request = new XMLHttpRequest();

        request.open('POST', 'server.php');
        request.setRequestHeader('Content-Type', 'application/x-www-urlencoded');

        let formData = new FormData(contactForm);
        request.send(formData);

        request.addEventListener('readystatechange', () => {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.falure;
            }
        });

        for (let i = 0; i < contactInput.length; i++) {
            contactInput[i].value = '';
        }
    });
});