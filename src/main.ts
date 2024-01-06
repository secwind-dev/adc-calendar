export interface StateElement {
    tag: string
    props?: Record<string, any> | null
    children?: string | StateElement[]
    methods?: {
        click?: (...arg: any) => void
        change?: Fn
        input?: Fn
    }
    el?: HTMLElement
}
type Fn = (...arg: any) => void
interface Weeks {
    th: string
    en: string
}
class ElementRender {
    protected id: string
    constructor(id: string) {
        this.id = id

        console.log(`Calendar id="${this.id}" Started !!`)
    }
    protected startInit() {
        this.stop()
        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style')

        style.textContent = css

        const shadow = this.rootEl()

        shadow.appendChild(style)
        shadow.setAttribute('calendar', 'root')
    }

    stop() {
        // ลบทิ้งเพ่อสร้างใหม่ หรือ การสั่งปิด calendar
        let check_for_update = this.rootEl().querySelector(
            `[calendar="container"]`
        )
        if (check_for_update) {
            check_for_update.remove()
        }
    }

    protected setStyle(shadow: HTMLElement, style: Record<string, any>) {
        /////////////  set css root  ////////////////
        const keys = Object.keys(style!)

        keys.forEach((k) => {
            if (k in style!)
                shadow.style.setProperty(`--${k}`, (style! as any)[k]) +
                    '!important'
        })
        ////////////x  set css root  x///////////////
    }

    protected rootEl(): HTMLElement {
        const root = document.querySelector(this.id) as HTMLElement
        return root
    }

    protected createBox(box: HTMLElement, vNode: StateElement) {
        const el = (vNode.el = document.createElement(vNode.tag))

        if (vNode.props) {
            for (const key in vNode.props) {
                const value = vNode.props[key]
                el.setAttribute(key, value)
            }
        }
        if (vNode.children) {
            if (typeof vNode.children === 'string') {
                el.textContent = vNode.children
            } else {
                vNode.children.forEach((child) => {
                    this.createBox(el, child)
                })
            }
        }
        if (vNode.methods) {
            for (const key in vNode.methods) {
                const fn = vNode.methods[
                    key as keyof StateElement['methods']
                ] as Fn
                el.addEventListener(key, (event) => fn(event))
            }
        }

        box.appendChild(el)
    }

    private getLists() {
        return [
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
    }
    protected onCheckDisabled(date: Date, min: Date, max: Date) {
        const checkDateDiff_Min = this.onDateDiff(min, date) < 0
        const checkDateDiff_Max = this.onDateDiff(date, max) < 0
        return checkDateDiff_Min || checkDateDiff_Max
    }
    protected onWeeks(type: 'th' | 'en'): string[] {
        const weeks = {
            th: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
            en: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
        }

        return weeks[type]
    }

    protected checkSameDate(a: Date, b: Date) {
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        )
    }

    protected onBeforeAfterDay(date: Date): [number, number] {
        let first_day = new Date(date.getFullYear(), date.getMonth(), 1)
        let last_day = new Date(
            date.getFullYear(),
            date.getMonth(),
            this.getMonth(date).days
        )

        return [first_day.getDay(), 7 - (last_day.getDay() + 1)] // ช่องว่างก่อนเริ่มวันที่ 1,ช่องว่างหลังสิ้นเดือน
    }

    protected onDateDiff(a: Date, b: Date) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
        return Math.floor((utc2 - utc1) / _MS_PER_DAY)
    }

    protected getYear(date: Date) {
        const _getFebDays = (year: number) => {
            let isLeapYear =
                (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
                (year % 100 === 0 && year % 400 === 0)
            return isLeapYear ? 29 : 28
        }
        const items: ReturnType<typeof this.getLists> = []
        this.getLists().forEach((m, i) => {
            m.year = date.getFullYear()
            if (i === 1) {
                m.days = _getFebDays(date.getFullYear())
            }

            items.push(m)
        })
        return items
    }
    protected getMonth(date: Date) {
        const year = this.getYear(date)

        return year[date.getMonth()]
    }
}

const css = ` 
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
    opacity: 0.5;
    pointer-events: none;
    text-decoration: line-through;
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
    border-radius: 50%;
}

.picker_date[data_type='DAY'] {
    background-color: var(--picker);
    border-radius: 50%;
    border: 2px solid #ebf0fc;
    color: var(--text-picker);
}

.first, .last {
    background-color: var(--picker);
    border-radius: 50%;
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
    border-radius: 50%;
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

export default ElementRender
