export const lists = [
    {
        english: 'January',
        en: 'Jan',
        th: 'ม.ค.',
        thai: 'มกราคม',
        month_value: '01',
        days: 31,
        year: 0,
    },
    {
        english: 'February',
        en: 'Feb',
        th: 'ก.พ.',
        thai: 'กุมภาพันธ์',
        month_value: '02',
        days: 27,
        year: 0,
    },
    {
        english: 'March',
        en: 'Mar',
        th: 'มี.ค.',
        thai: 'มีนาคม',
        month_value: '03',
        days: 31,
        year: 0,
    },
    {
        english: 'April',
        en: 'Apr',
        th: 'เม.ย.',
        thai: 'เมษายน',
        month_value: '04',
        days: 30,
        year: 0,
    },
    {
        english: 'May',
        en: 'May',
        th: 'พ.ค.',
        thai: 'พฤษภาคม',
        month_value: '05',
        days: 31,
        year: 0,
    },
    {
        english: 'June',
        en: 'June',
        th: 'มิ.ย.',
        thai: 'มิถุนายน',
        month_value: '06',
        days: 30,
        year: 0,
    },
    {
        english: 'July',
        en: 'July',
        th: 'ก.ค.',
        thai: 'กรกฎาคม',
        month_value: '07',
        days: 31,
        year: 0,
    },
    {
        english: 'August',
        en: 'Aug',
        th: 'ส.ค.',
        thai: 'สิงหาคม',
        month_value: '08',
        days: 31,
        year: 0,
    },
    {
        english: 'September',
        en: 'Sept',
        th: 'ก.ย.',
        thai: 'กันยายน',
        month_value: '09',
        days: 30,
        year: 0,
    },
    {
        english: 'October',
        en: 'Oct',
        th: 'ต.ค.',
        thai: 'ตุลาคม',
        month_value: '10',
        days: 31,
        year: 0,
    },
    {
        english: 'November',
        en: 'Nov',
        th: 'พ.ย.',
        thai: 'พฤศจิกายน',
        month_value: '11',
        days: 30,
        year: 0,
    },
    {
        english: 'December',
        en: 'Dec',
        th: 'ธ.ค.',
        thai: 'ธันวาคม',
        month_value: '12',
        days: 31,
        year: 0,
    },
]

export const css = ` 
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

[calendar="root"] {
    --font-family: 'Arial', sans-serif;
    --background: #f3f8fe;
    --picker: #0ea5e9;
    --text-picker: #fff;
    --dateRadius: 50%;
    --disabled: #c3c2c8; /* disabled */
    --current: #ffdfd2;
    --text: #151426;
    --text-week: #1e293b;
    --borderRadius: .75rem;
    --border: none;
    --width: 300px;


    --shadow: none;
    --text-current: #ffffff; /* text current */
    --week-line: #cbd5e1; 

    min-width: 250px;
    max-width: var(--width);

}
[calendar="container"] {
   
    font-family: var(--font-family);
    box-shadow: var(--shadow);
    border-radius: var(--borderRadius);
    border: var(--border);
    width: inherit;
    height: max-content;
    background-color: var(--background);
}
[calendar="header"] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    padding: 0;
}
[calendar="header"] .title {
    padding: 0px;
    cursor: pointer;
    border-radius: 0.625rem;
    position: relative;
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
}
.calendar__body {
    padding: 0px;
}
[calendar="body-week"] {
    font-weight: 400;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    color: var(--text);
    font-size: 1rem;
    border-top: 1px solid var(--week-line);
    border-bottom: 1px solid var(--week-line);
}
[calendar="body-week"] div {
    color: var(--text-week);
    height: 36px;
    background: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
}
[calendar="body-day"] {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    color: var(--text);
}
[calendar="body-day"] div {
    display: grid;
    place-items: center;
    padding: 0px;
    position: relative;
    cursor: pointer;
    width: 100%;
    aspect-ratio: 1/1;
    font-size: 1rem;
    transform: scale(1.005, 0.95);
}

div[calendar='disabled'] {
    cursor: no-drop !important;
    background-color: inherit;
    opacity: 0.3;
    text-decoration: line-through;
    pointer-events: none;
    color: var(--text);
}
.d_before,
.d_after {
    color: var(--disabled);
    cursor: pointer;
}
.current_date {
    background-color: var(--current);
    color: var(--text-current);
    font-size: 20px;
    font-weight: 700;
    border-radius: var(--dateRadius);
}

.picker_date[data_type='DAY'] {
    background-color: var(--picker);
    border-radius: var(--dateRadius);
    border: 2px solid #ebf0fc;
    color: var(--text-picker);
}

.first, .last {
    background-color: var(--picker);
    border-radius: var(--dateRadius);
    border: 2px solid #ebf0fc;
    color: var(--text-picker);
    isolation: isolate;
    z-index:1;
    position: relative;
}

.between:not(:is(.first,.last)) {
    position: relative;
    border-radius: 0%;
    color: var(--text-picker);
    background-color: var(--picker);
    border-radius: var(--dateRadius);
    opacity: 0.75;
}

.current_date.between {
    color: var(--text-color);
    
}




.calendar__icon-arrow {
    width: 42px;
    height: 42px;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 16px;
}
.calendar__icon-arrow:has(.right) {
    justify-content: flex-end;
}
.calendar--arrow {
    border: solid var(--text);
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
}

.right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}

.left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}

.up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}

.down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}

`
