/* global moment */
/* eslint no-unused-vars: ["off"] */

// Локализация
const labels = {
    uk: ['Київ', 'Харків', 'Львів', 'Одеса', 'Дніпро'],
    en: ['Kyiv', 'Kharkiv', 'Lviv', 'Odessa', 'Dnipro']
}

let locale = location.search.substr(-2);
locale = (labels[locale] !== undefined) ? locale : 'uk';

moment.locale(locale);

const lang = labels[locale];

const cities = [lang[0], lang[1], lang[2], lang[3], lang[4]];
const matrix = [
    [0,          cities[0], cities[1], cities[2], cities[3], cities[4]],
    [cities[0],  0,         480,       543,       488,       496],
    [cities[1],  480,       0,         1015,      719,       221],
    [cities[2],  543,       1015,      0,         800,       1030],
    [cities[3],  488,       719,       800,       0,         525],
    [cities[4],  496,       221,       1030,      525,       0]
];

const input = () => {
    const dialog = prompt('Яку кількість потягів показати?');
    if (!isNaN(parseFloat(dialog))) {
        return amount(dialog);
    } else {
        alert('Введіть будь-ласка цифрове значення');
        return input();
    }    
}

const amount = max => {
    const N = cities.length;
    const tr_am = 2 * (N * (N - 1) / 2);
    return (max < tr_am) ? max : tr_am; 
};

const generate = amount => {
    
    const rand_int = (min, max, not) => {
        const rnd = Math.floor(Math.random() * (max - min)) + min;
        return (rnd === not) ? rand_int(min, max, not) : rnd;
    }
    
    const rand_letter = () => {
        const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        return letters[Math.floor(Math.random() * letters.length)];
    }

    const tr_index = () => {
        return rand_int(100, 1000) + rand_letter().toUpperCase();
    }

    const tr_data = () => {

        // Город отправления
        const tr_dep_idx = rand_int(1, matrix.length);
        const tr_departure = matrix[0][tr_dep_idx];

        // Город прибытия
        const tr_arr_idx = rand_int(1, matrix.length, tr_dep_idx);
        const tr_arrival = matrix[tr_arr_idx][0];

        // День недели отправления поезда
        const today_idx = moment().weekday();
        const tr_date_dep_idx = rand_int(today_idx, today_idx+7);
        const tr_date_dep = moment().weekday(tr_date_dep_idx).hour(rand_int(0, 24)).minute(rand_int(0, 60));
        const tr_date_dep_wday = moment.weekdays(tr_date_dep.isoWeekday());

        // Дата отправления
        const tr_date_dep_label = tr_date_dep.calendar();


        /* Время до пункта назначения */
        const avg_speed = rand_int(80, 121);
        const dist_between = matrix[tr_arr_idx][tr_dep_idx];
        const time_to_arrival = dist_between / avg_speed;
        
        // Дату прибытия
        const tr_date_arrival = tr_date_dep.clone().add(time_to_arrival, 'h');
        const tr_date_arrival_label = tr_date_arrival.calendar();
        
        // Стоимость
        const tr_cost_k = 40.251
        const tr_cost = (time_to_arrival * tr_cost_k).toFixed(2);

        // Выводим результат
        return [tr_departure, tr_arrival, tr_date_dep_wday, tr_date_dep_label, tr_date_arrival_label, tr_cost];
    }

    let data = [];

    for (let i = 0; i < amount; i++) {
        data.push([tr_index(), tr_data()])
    }

    show(data);
}

const show = (data) => {
    const header = ['Пункт відправлення', 'Пункт прибуття', 'День тижня', 'Відправлення', 'Прибуття', 'Вартість'];

    class Trip {
        constructor(arr) {
            for (let i = 0; i < arr.length; i++) {
                this[header[i]] = arr[i];
            }
        }
    }

    let trips = {};

    for (let i = 0; i < data.length; i++) {
        trips[data[i][0]] = new Trip(data[i][1]);
    }

    console.table(trips);
}

const init = () => {
    const train_amount = input();
    generate(train_amount);
}

init();