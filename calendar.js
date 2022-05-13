var eventsFilter = [true, true, true];
var calendar = null;
var data = [];/*
	{ eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', colorId: 0, color: 'homevisit', date: moment('02-15-2022 11:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', colorId: 0, color: 'homevisit', date: moment('03-15-2022 11:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', colorId: 0, color: 'homevisit', date: moment('03-15-2022 12:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Interview - Jr. Web Developer', calendar: 'Work', colorId: 1, color: 'clinicvisit', date: moment('03-15-2022 02:00 PM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Demo New App to the Board', calendar: 'Work', colorId: 2, color: 'telehealth', date: moment('03-16-2022 00:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Demo New App to the Board', calendar: 'Work', colorId: 2, color: 'telehealth', date: moment('03-16-2022 02:00 AM', 'MM-DD-YYYY hh:mm A')  },
	{ eventName: 'Demo New App to the Board', calendar: 'Work', colorId: 2, color: 'telehealth', date: moment('03-15-2022 04:00 PM', 'MM-DD-YYYY hh:mm A')  },
];*/
var filteredData = data;
var selectedTime = null;
var selectedButton = null;
const homevisitServices = ['4079544000001108308', '4079544000001181380', '4079544000001466102'];
const clinicvisitServices = ['407954400000169421', '4079544000001923082'];
const telehealthServices = ['4079544000002014024', '4079544000002045184', '4079544000002045202', '4079544000002045214', ' ', '4079544000002153884', '4079544000002206538', '4079544000002258192', '4079544000002296068'];
var localInstance;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

!function () {
    var today = moment();

    /*
    function checkboxTicked(e) {
        var checked = e.target.checked;
        var value = e.target.value;
        eventsFilter[value] = checked;
    	
        var tempData = [];
        data.forEach((value, index) => {
            if (eventsFilter[data[index].colorId]) {
                tempData.push(data[index]);
            }
        });
        filteredData = tempData;
    	
        localInstance.draw();
    };*/
    function initMap() {
        var lat = localStorage.getItem('locLat');
        var long = localStorage.getItem('locLong');
        const map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(lat, long),
            zoom: 8,
        });

        drawMarkers(map);
        setSelected(clinics[selected]);
    }

    function Calendar(selector, events) {
        localInstance = this;
        console.log('A1')
        var checkbox1 = document.querySelector('#homevisit');
        var checkbox2 = document.querySelector('#clinicvisit');
        var checkbox3 = document.querySelector('#telehealth');
        checkbox1.value = 0;
        checkbox2.value = 1;
        checkbox3.value = 2;
        checkbox1.onclick = this.checkboxTicked;
        checkbox2.onclick = this.checkboxTicked;
        checkbox3.onclick = this.checkboxTicked;

        document.querySelector(selector).innerHTML = '';
        this.el = document.querySelector(selector);
        this.events = events;
        this.current = moment().date(1);

        var tempDate = this.current;

        var date = tempDate.toDate();
        month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            day2 = '15';
        day3 = '29';
        year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        date = [year, month, day].join('-');
        date2 = [year, month, day2].join('-');
        date3 = [year, month, day3].join('-');

        var dates = [date, date2, date3];

        for (var i = 0; i < 3; i++) {
            this.callServices(dates[i]);
        }

        //this.draw();
        this.drawSchedule();

        /*
        var current = document.querySelector('.today');
        if(current) {
            var self = this;
            window.setTimeout(function() {
                self.openDay(current);
            }, 500);
        }*/

        var btn = document.querySelector('#submit');
        btn.addEventListener('click', submit);
    }

    Calendar.prototype.checkboxTicked = function (e) {
        var checked = e.target.checked;
        var value = e.target.value;
        eventsFilter[value] = checked;

        var tempData = [];
        data.forEach((value, index) => {
            if (eventsFilter[data[index].colorId]) {
                tempData.push(data[index]);
            }
        });
        filteredData = tempData;

        document.getElementById('loader').style.display = 'block';
        document.getElementById('calendar').style.display = 'none';
        localInstance.draw();

        new Calendar('#calendar', filteredData);
    }

    Calendar.prototype.draw = function () {
        //Create Header
        this.drawHeader();

        //Draw Month
        this.drawMonth();
    }

    Calendar.prototype.drawHeader = function () {
        var self = this;
        if (!this.header) {
            //Create the header elements
            this.header = createElement('div', 'header');
            this.header.className = 'header';

            this.title = createElement('h1');

            var right = createElement('div', 'right');
            this.rightText = createElement('h1');
            right.appendChild(this.rightText);
            right.addEventListener('click', function () { self.nextMonth(); });

            var left = createElement('div', 'left');
            this.leftText = createElement('h1');
            left.appendChild(this.leftText);
            left.addEventListener('click', function () { self.prevMonth(); });

            var days = createElement('div', 'days');
            var line = createElement('hr', 'line');
            var S1 = createElement('div', 'day-letter');
            S1.appendChild(document.createTextNode('S'));
            var M = createElement('div', 'day-letter');
            M.appendChild(document.createTextNode('M'));
            var T1 = createElement('div', 'day-letter');
            T1.appendChild(document.createTextNode('T'));
            var W = createElement('div', 'day-letter');
            W.appendChild(document.createTextNode('W'));
            var T2 = createElement('div', 'day-letter');
            T2.appendChild(document.createTextNode('T'));
            var F = createElement('div', 'day-letter');
            F.appendChild(document.createTextNode('F'));
            var S2 = createElement('div', 'day-letter');
            S2.appendChild(document.createTextNode('S'));
            days.appendChild(S1);
            days.appendChild(M);
            days.appendChild(T1);
            days.appendChild(W);
            days.appendChild(T2);
            days.appendChild(F);
            days.appendChild(S2);
            days.appendChild(line);

            //Append the Elements
            this.header.appendChild(this.title);
            this.header.appendChild(right);
            this.header.appendChild(left);
            this.el.appendChild(this.header);
            this.el.appendChild(days)
        }

        this.title.innerHTML = this.current.format('MMMM YYYY');
        var now = new Date(this.current);
        if (now.getMonth() == 11) {
            var nextMonth = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }
        if (now.getMonth() == 0) {
            var lastMonth = new Date(now.getFullYear() - 1, 11, 1);
        } else {
            var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        }
        this.rightText.innerHTML = `${nextMonth.toLocaleString('default', { month: 'long' })} ${nextMonth.getFullYear()}`;
        this.leftText.innerHTML = `${lastMonth.toLocaleString('default', { month: 'long' })} ${lastMonth.getFullYear()}`;
    }

    Calendar.prototype.drawMonth = function () {
        var self = this;

        if (this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
            this.oldMonth.addEventListener('webkitAnimationEnd', function () {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = createElement('div', 'month');
                self.backFill();
                self.currentMonth();
                self.fowardFill();
                self.el.appendChild(self.month);
                window.setTimeout(function () {
                    self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
                }, 16);
            });
        } else {
            this.month = createElement('div', 'month');
            this.el.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.fowardFill();
            this.month.className = 'month new';
        }
    }

    Calendar.prototype.backFill = function () {
        var clone = this.current.clone();
        var dayOfWeek = clone.day();

        if (!dayOfWeek) { return; }

        clone.subtract('days', dayOfWeek + 1);

        for (var i = dayOfWeek; i > 0; i--) {
            this.drawDay(clone.add('days', 1), true);
        }
    }

    Calendar.prototype.fowardFill = function () {
        var clone = this.current.clone().add('months', 1).subtract('days', 1);
        var dayOfWeek = clone.day();

        if (dayOfWeek === 6) { return; }

        for (var i = dayOfWeek; i < 6; i++) {
            this.drawDay(clone.add('days', 1), true);
        }
    }

    Calendar.prototype.currentMonth = function () {
        var clone = this.current.clone();

        while (clone.month() === this.current.month()) {
            this.drawDay(clone);
            clone.add('days', 1);
        }
    }

    Calendar.prototype.getWeek = function (day) {
        if (!this.week || day.day() === 0) {
            this.week = createElement('div', 'week');
            this.month.appendChild(this.week);
        }
    }

    Calendar.prototype.drawDay = function (day, dontFill) {
        var self = this;
        this.getWeek(day);

        //Outer Day
        var outer = createElement('div', this.getDayClass(day));
        outer.addEventListener('click', function () {
            self.openDay(this);
        });

        //Day Name
        //var name = createElement('div', 'day-name', day.format('ddd'));

        //Day Number
        var todaysEvents = [];
        for (var i = 0; i < this.events.length; i++) {
            var val = this.events[i];
            var date1 = JSON.stringify(day._d).substring(1, 11);
            var date2 = val.detroitDate.split(' ')[0];
            if (date1 === date2) {
                todaysEvents.push(val);
            }
            /*if (val.date.isSame(day, 'day')) {
                todaysEvents.push(val);
            }*/
        }

        /*
        var todaysEvents = this.events.reduce(function(memo, ev) {
            if(ev.date.isSame(day, 'day')) {
                memo.push(ev);
            }
            return memo;
        }, []);
*/
        if (todaysEvents.length === 0) {
            var number = createElement('div', 'day-number-no-event', day.format('D'));
        } else {
            var number = createElement('div', 'day-number', day.format('D'));
        }


        //Events    
        var events = createElement('div', 'day-events');
        this.drawEvents(day, events);

        if (!dontFill) {
            //outer.appendChild(name);
            outer.appendChild(number);
            outer.appendChild(events);
        }
        this.week.appendChild(outer);
    }

    Calendar.prototype.drawEvents = function (day, element) {
        var date1 = JSON.stringify(this.current).substring(1, 8);
        var date2 = JSON.stringify(day._d).substring(1, 8);
        if (date1 === date2) {
            var todaysEvents = this.events.reduce(function (memo, ev) {
                /*
                if(ev.date.isSame(day, 'day')) {
                    memo.push(ev);
                }
                */
                var date3 = JSON.stringify(day._d).substring(1, 11);
                var date4 = ev.detroitDate.split(' ')[0];
                if (date3 === date4) {
                    memo.push(ev);
                }
                return memo;
            }, []);

            var generalEvents = [];
            var colors = [];
            for (index = 0; index < todaysEvents.length; index++) {
                if (!colors.includes(todaysEvents[index].color)) {
                    generalEvents.push(todaysEvents[index]);
                    colors.push(todaysEvents[index].color);
                }
            };

            generalEvents.forEach(function (ev) {
                var evSpan = createElement('span', ev.color);
                element.appendChild(evSpan);
            });
        }
    }

    function selectSched(e) {
        val = JSON.parse(e.target.value);

        //document.querySelector('#chosenSChed').value = selectedTime;
        localStorage.setItem('schedDateTime', val.date);
        localStorage.setItem('staffId', val.staffId);

        //console.log(val);

        if (selectedButton) {
            if (selectedButton.className === 'homevisitSchedFocus') {
                selectedButton.classList.add('homevisitSched');
                selectedButton.classList.remove('homevisitSchedFocus');
            } else if (selectedButton.className === 'clinicvisitSchedFocus') {
                selectedButton.classList.add('clinicvisitSched');
                selectedButton.classList.remove('clinicvisitSchedFocus');
                selected = val.clinicNo;
                localStorage.setItem('currClinic', selected);
                setSelected(clinics[val.clinicNo]);
            } else if (selectedButton.className === 'telehealthSchedFocus') {
                selectedButton.classList.add('telehealthSched');
                selectedButton.classList.remove('telehealthSchedFocus');
            }
        }

        localStorage.setItem('staffId', val.staffId);
        localStorage.setItem('serviceId', val.serviceId);
        localStorage.setItem('date', val.detroitDate);

        selectedButton = e.srcElement;
        if (selectedButton.className === 'homevisitSched') {
            selectedButton.classList.remove('homevisitSched');
            selectedButton.classList.add('homevisitSchedFocus');
            localStorage.setItem('schedType', 'homevisit');
            var confirm = document.getElementById('confirm');
            confirm.href = '/contact-info';
        } else if (selectedButton.className === 'clinicvisitSched') {
            selectedButton.classList.remove('clinicvisitSched');
            selectedButton.classList.add('clinicvisitSchedFocus');
            localStorage.setItem('schedType', 'clinicvisit');
            var confirm = document.getElementById('confirm');
            confirm.href = '/contact-info';
        } else if (selectedButton.className === 'telehealthSched') {
            selectedButton.classList.remove('telehealthSched');
            selectedButton.classList.add('telehealthSchedFocus');
            localStorage.setItem('schedType', 'telehealth');
            var confirm = document.getElementById('confirm');
            confirm.href = '/contact-info';
        }

        document.getElementById('confirm').classList.remove('btn-disabled');
    }

    Calendar.prototype.getDayClass = function (day) {
        classes = ['day'];
        if (day.month() !== this.current.month()) {
            classes.push('other');
        } else if (today.isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    }

    Calendar.prototype.createSchedButton = function (type, val) {
        var btn = createElement('button');

        var time = val.detroitDate.split(' ')[1].substring(0, 5);

        btn.innerHTML = time; // .date.format('HH:mm');
        btn.classList.add(type);
        btn.addEventListener('click', selectSched);
        btn.type = 'button';
        btn.value = JSON.stringify(val);
        return btn;
    }

    Calendar.prototype.removeSChedule = function () {
        var homevisitSched = document.querySelector('#homevisitSched');
        homevisitSched.innerHTML = '';
        document.getElementById('homevisitSchedContainer').setAttribute('style', 'display:none');
        var clinicvisitSched = document.querySelector('#clinicvisitSched');
        clinicvisitSched.innerHTML = '';
        document.getElementById('clinicvisitSchedContainer').setAttribute('style', 'display:none');
        var telehealthSched = document.querySelector('#telehealthSched');
        telehealthSched.innerHTML = '';
        document.getElementById('telehealthSchedContainer').setAttribute('style', 'display:none');

        document.querySelector('#today').innerHTML = '';
    }

    Calendar.prototype.drawSchedule = function (schedule) {
        var homevisitSched = document.querySelector('#homevisitSched');
        homevisitSched.innerHTML = '';
        document.getElementById('homevisitSchedContainer').setAttribute('style', 'display:none');
        var clinicvisitSched = document.querySelector('#clinicvisitSched');
        clinicvisitSched.innerHTML = '';
        document.getElementById('clinicvisitSchedContainer').setAttribute('style', 'display:none');
        var telehealthSched = document.querySelector('#telehealthSched');
        telehealthSched.innerHTML = '';
        document.getElementById('telehealthSchedContainer').setAttribute('style', 'display:none');

        var done = [];
        var done2 = [];
        var done3 = [];
        for (i = 0; i < schedule.length; i++) {
            var ev = schedule[i];
            var btn = null;
            var time1 = JSON.stringify(ev.detroitDate).split(' ')[1];
            var date1 = JSON.stringify(ev.detroitDate).split(' ')[0];

            if (ev.colorId === 0) {
                if (!done.includes(time1)) {
                    done.push(time1);
                    btn = this.createSchedButton('homevisitSched', ev);
                    /*if (new Date(ev.date._d).getTime() === new Date(selectedTime).getTime()) {
                        btn.classList.remove('homevisitSched');
                        btn.classList.add('homevisitSchedFocus');
                        selectedButton = btn;
                    }*/
                    if (ev.detroitDate === localStorage.getItem('date') && localStorage.getItem('schedType') === 'homevisit') {
                        btn.classList.remove('homevisitSched');
                        btn.classList.add('homevisitSchedFocus');
                        selectedButton = btn;
                    }
                    document.getElementById('homevisitSchedContainer').setAttribute('style', 'display:visible');
                    homevisitSched.appendChild(btn);
                }
            } else if (ev.colorId === 1) {
                console.log(ev.clinicNo)
                console.log('===');
                console.log(selected);
                if (!done2.includes(time1) && ev.clinicNo === selected) {
                    done2.push(time1);
                    btn = this.createSchedButton('clinicvisitSched', ev);
                    /*if (new Date(ev.date._d).getTime() === new Date(selectedTime).getTime()) {
                        btn.classList.remove('clinicvisitSched');
                        btn.classList.add('clinicvisitSchedFocus');
                        selectedButton = btn;
                    }*/
                    if (ev.detroitDate === localStorage.getItem('date') && localStorage.getItem('schedType') === 'clinicvisit') {
                        btn.classList.remove('clinicvisitSched');
                        btn.classList.add('clinicvisitSchedFocus');
                        selectedButton = btn;
                    }
                    document.getElementById('clinicvisitSchedContainer').setAttribute('style', 'display:visible');
                    clinicvisitSched.appendChild(btn);
                }
            } else if (ev.colorId === 2) {
                if (!done3.includes(time1)) {
                    done3.push(time1);
                    btn = this.createSchedButton('telehealthSched', ev);
                    /*if (new Date(ev.date._d).getTime() === new Date(selectedTime).getTime()) {
                        btn.classList.remove('telehealthSched');
                        btn.classList.add('telehealthSchedFocus');
                        selectedButton = btn;
                    }*/
                    if (ev.detroitDate === localStorage.getItem('date') && localStorage.getItem('schedType') === 'telehealth') {
                        btn.classList.remove('telehealthSched');
                        btn.classList.add('telehealthSchedFocus');
                        selectedButton = btn;
                    }
                    document.getElementById('telehealthSchedContainer').setAttribute('style', 'display:visible');
                    telehealthSched.appendChild(btn);
                }
            }
        }




        /*
        if (selectedButton) {
            if (selectedButton.className === 'homevisitSchedFocus') {
                selectedButton.classList.add('homevisitSched');
                selectedButton.classList.remove('homevisitSchedFocus');
            } else if (selectedButton.className === 'clinicvisitSchedFocus') {
                selectedButton.classList.add('clinicvisitSched');
                selectedButton.classList.remove('clinicvisitSchedFocus');
            } else if (selectedButton.className === 'telehealthSchedFocus') {
                selectedButton.classList.add('telehealthSched');
                selectedButton.classList.remove('telehealthSchedFocus');
            }
        }
        */
    }

    Calendar.prototype.openDay = function (el) {
        var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
        var day = this.current.clone().date(dayNumber);

        document.querySelector('#today').innerHTML = day.format('MMMM DD');

        //this.selected.removeChild(this.selected);
        //currentOpened.parentNode.removeChild(currentOpened);
        if (this.selected !== undefined) {
            this.selected.classList.remove('day-selected');
        }
        this.selected = el;
        el.classList.add('day-selected');

        var schedule = [];
        var date1 = JSON.stringify(day._d).substring(1, 11);
        filteredData.forEach((value, index) => {
            var date2 = value.detroitDate.split(' ')[0];
            if (date1 === date2) {
                schedule.push(value);
            }
        });

        this.drawSchedule(schedule);
    }

    Calendar.prototype.renderEvents = function (events, ele) {
        //Remove any events in the current details element
        var currentWrapper = ele.querySelector('.events');
        var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

        events.forEach(function (ev) {
            var div = createElement('div', 'event');
            var square = createElement('div', 'event-category ' + ev.color);
            var span = createElement('span', '', ev.eventName);

            div.appendChild(square);
            div.appendChild(span);
            wrapper.appendChild(div);
        });

        if (!events.length) {
            var div = createElement('div', 'event empty');
            var span = createElement('span', '', 'No Events');

            div.appendChild(span);
            wrapper.appendChild(div);
        }

        if (currentWrapper) {
            currentWrapper.className = 'events out';
            currentWrapper.addEventListener('webkitAnimationEnd', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('oanimationend', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('msAnimationEnd', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('animationend', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
        } else {
            ele.appendChild(wrapper);
        }
    }

    Calendar.prototype.nextMonth = function () {
        this.current.add('months', 1);
        var tempDate = this.current;

        var date = tempDate.toDate();
        month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            day2 = '15';
        day3 = '29';
        year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        date = [year, month, day].join('-');
        date2 = [year, month, day2].join('-');
        date3 = [year, month, day3].join('-');

        var dates = [date, date2, date3];

        //this.callServices(date2);
        for (var i = 0; i < 3; i++) {
            this.callServices(dates[i]);
        }

        this.next = true;
        this.draw();
    }

    Calendar.prototype.prevMonth = function () {
        this.current.subtract('months', 1);
        this.next = false;
        this.draw();
    }

    window.Calendar = Calendar;

    function createElement(tagName, className, innerText) {
        var ele = document.createElement(tagName);
        if (className) {
            ele.className = className;
        }
        if (innerText) {
            ele.innerText = ele.textContent = innerText;
        }
        return ele;
    }

    Calendar.prototype.callServices = function (date) {
        $.ajax({
            type: 'GET',
            url: 'https://rld1z7xwl9.execute-api.us-west-1.amazonaws.com/dev/calendar',
            data: {
                'service_id': '',
                'start_date': date,
                //'customer_address': '5204 S San Juan Pl, Chandler, AZ 85249, USA',
                //'customer_zipcode': '85249',
                'customer_address': localStorage.getItem('address'),
                'customer_zipcode': localStorage.getItem('zipcode'),
            },
            crossDomain: true,
            success: function (e) {
                var scheds = [];

                for (var i = 0; i < e.length; i++) {
                    var service_id = e[i].service_id[0];

                    var colorId;
                    var color;
                    if (homevisitServices.includes(service_id)) {
                        colorId = 0;
                        color = 'homevisit';
                        for (var j = 0; j < e[i].availability.length; j++) {
                            var availability = e[i].availability[j];
                            for (var k = 0; k < availability.staff_availability.length; k++) {
                                var staff_availability = availability.staff_availability[k];
                                var staff_id = availability.staff_id;
                                if (staff_availability.time_slots.length !== 0 && staff_availability.time_slots[0] !== 'Slots Not Available') {
                                    var date_slot = staff_availability.date;
                                    for (var l = 0; l < staff_availability.time_slots.length; l++) {
                                        var time_slot = staff_availability.time_slots[l];
                                        var tempDate = new Date(date_slot + ' ' + time_slot + ' -04:00').toLocaleString('en-US', { timeZone: localStorage.getItem('timezone') })

                                        var sched = {
                                            eventName: '',
                                            calendar: 'Work',
                                            staffId: staff_id,
                                            serviceId: service_id,
                                            colorId: colorId,
                                            color: color,
                                            date: moment(tempDate),
                                            detroitDate: date_slot + ' ' + time_slot + ':00',
                                        };
                                        scheds.push(sched);
                                    }
                                }
                            }
                        }

                        data.push.apply(data, scheds);
                        filteredData = data;
                        document.getElementById('loader').style.display = 'none';
                        document.getElementById('calendar').style.display = 'block';
                        localInstance.draw();
                    } else if (clinicvisitServices.includes(service_id)) {
                        colorId = 1;
                        color = 'clinicvisit';
                        var name = e[i].title;
                        var address = e[i].availability[0].staff_address;
                        var clinicLat;
                        var clinicLong;
                        var schedules = e[i];

                        var data2 = {
                            'service_id': service_id,
                            'name': name,
                            'address': address,
                            'lat': clinicLat,
                            'long': clinicLong,
                        };

                        function getLatLong(data2) {
                            return $.ajax({
                                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                                data: {
                                    'sensor': false,
                                    'address': data2.address,
                                    'key': 'AIzaSyBp9ieCh2YkSSJbnsVlzRBd3dZq5OxQ50g',
                                },
                            });
                        }

                        getLatLong(data2).then(response => {
                            data2.lat = response.results[0].geometry.location.lat;
                            data2.long = response.results[0].geometry.location.lng;

                            var distance = schedules.availability[0].distance.distance;
                            data2.distance = distance;
                            var clinicNo;
                            var duplicate = false;
                            for (var i = 0; i < clinics.length; i++) {
                                var val = clinics[i];
                                if (val.lat === data2.lat && val.long === data2.long) {
                                    duplicate = true;
                                    clinicNo = i;
                                    break;
                                }
                            }

                            if (!duplicate) {
                                clinics.push(data2);
                                clinicNo = clinics.length - 1;
                            }

                            for (var j = 0; j < schedules.availability.length; j++) {
                                var availability = schedules.availability[j];
                                for (var k = 0; k < availability.staff_availability.length; k++) {
                                    var staff_availability = availability.staff_availability[k];
                                    var staff_id = availability.staff_id;
                                    if (staff_availability.time_slots.length !== 0 && staff_availability.time_slots[0] !== 'Slots Not Available') {
                                        var date_slot = staff_availability.date;
                                        for (var l = 0; l < staff_availability.time_slots.length; l++) {
                                            var time_slot = staff_availability.time_slots[l];
                                            var tempDate = new Date(date_slot + ' ' + time_slot + ' -04:00').toLocaleString('en-US', { timeZone: localStorage.getItem('timezone') })

                                            var sched = {
                                                eventName: '',
                                                calendar: 'Work',
                                                staffId: staff_id,
                                                serviceId: service_id,
                                                colorId: 1,
                                                color: 'clinicvisit',
                                                date: moment(tempDate),
                                                detroitDate: date_slot + ' ' + time_slot + ':00',
                                                clinicNo: clinicNo,
                                                distance: distance,
                                            };
                                            scheds.push(sched);
                                        }
                                    }
                                }
                            }

                            data.push.apply(data, scheds);
                            filteredData = data;
                            document.getElementById('loader').style.display = 'none';
                            document.getElementById('calendar').style.display = 'block';
                            localInstance.draw();
                            drawMarkers(map);
                        });
                    } else if (telehealthServices.includes(service_id)) {
                        colorId = 2;
                        color = 'telehealth';
                        for (var j = 0; j < e[i].availability.length; j++) {
                            var availability = e[i].availability[j];
                            for (var k = 0; k < availability.staff_availability.length; k++) {
                                var staff_availability = availability.staff_availability[k];
                                var staff_id = availability.staff_id;
                                if (staff_availability.time_slots.length !== 0 && staff_availability.time_slots[0] !== 'Slots Not Available') {
                                    var date_slot = staff_availability.date;
                                    for (var l = 0; l < staff_availability.time_slots.length; l++) {
                                        var time_slot = staff_availability.time_slots[l];
                                        var tempDate = new Date(date_slot + ' ' + time_slot + ' -04:00').toLocaleString('en-US', { timeZone: localStorage.getItem('timezone') })

                                        var sched = {
                                            eventName: '',
                                            calendar: 'Work',
                                            staffId: staff_id,
                                            serviceId: service_id,
                                            colorId: colorId,
                                            color: color,
                                            date: moment(tempDate),
                                            detroitDate: date_slot + ' ' + time_slot + ':00',
                                        };
                                        scheds.push(sched);
                                    }
                                }
                            }
                        }

                        data.push.apply(data, scheds);
                        filteredData = data;
                        document.getElementById('loader').style.display = 'none';
                        document.getElementById('calendar').style.display = 'block';
                        localInstance.draw();
                    } else {
                    }
                }
            },
            dataType: 'json',
        });
    }

}();

calendar = new Calendar('#calendar', filteredData);
