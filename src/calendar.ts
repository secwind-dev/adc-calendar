import Main, { StateElement, Style } from './main'
import { addMonth } from 'adc-directive'
type Box = StateElement & {
    children: StateElement[]
}

export type CalenderState = {
    lang?: 'thai' | 'en' | 'th' | 'english'
    nextDate?: (arg: any) => void // function
    nextMonth?: (arg: any) => void // function
    year?: 'en' | 'th'
    value: Date // '2022-10-30'
    min?: Date // '2022-10-30'
    max?: Date // '2022-10-30'
    style?: Style
}

class Calendar extends Main {
    /*------------------------------Set---------------------------------*/
    private category = 'DAY' // type day

    /*-------------x----------------Set-----------------x---------------*/

    private lang: 'thai' | 'en' | 'th' | 'english' = 'en'
    private nextDate?: ((arg: Date) => void) | undefined
    private nextMonth?: ((arg: Date) => void) | undefined
    private year: 'en' | 'th' = 'th'
    private value: Date
    private min: Date = new Date()
    private max: Date = new Date('2200-01-01')

    private ui_value: Date
    private style?: Style = {}

    constructor(id: string, data: CalenderState) {
        super(id)
        this.value = data.value || new Date()
        this.ui_value = data.value || new Date()
        this.lang = data.lang || 'en'

        this.nextDate =
            typeof data.nextDate == 'function' ? data.nextDate : undefined
        this.nextMonth =
            typeof data.nextMonth == 'function' ? data.nextMonth : undefined

        this.year = data.year == 'th' ? 'th' : 'en' // พ.ศ.  ค.ศ.
        if (typeof data.style == 'object' && data.style != null) {
            this.style = Object.assign(this.style!, data.style)
        }
        this.setState(data)
    }

    render() {
        this.startInit()

        const shadow = this.rootEl()
        this.setStyle(shadow, this.style!)
        const container: Box = {
            tag: 'div',
            props: {
                calendar: `container`,
            },
            children: [],
        }

        container.children = [this.createHeader(), this.createBody()]
        this.createBox(shadow, container)
    }

    update(data: Partial<Pick<CalenderState, 'max' | 'min' | 'value'>>) {
        this.setState(data)
        this.render()
    }
    getState() {
        return {
            id: this.id,
            value: this.value,
            ui_value: this.ui_value,
            el: this.rootEl(),
        }
    }

    private createHeader(): Box {
        const header: Box = {
            tag: 'div',
            props: {
                calendar: `header`,
            },
            children: [],
        }
        const arrow = (icon: 'LEFT' | 'RIGHT') => {
            const res: Box = {
                tag: 'div',
                props: {
                    class: 'calendar__icon-arrow',
                },
                methods: {
                    click: () => this.onChangeMonth(icon),
                },
                children: [
                    {
                        tag: 'span',
                        props: {
                            class: `calendar--arrow ${icon.toLocaleLowerCase()}`,
                        },
                    },
                ],
            }

            return res
        }
        const yearType = this.year === 'th' ? 543 : 0
        const month = this.getMonth(this.ui_value)[this.lang || 'th']
        const year = this.ui_value.getFullYear() + yearType
        const title: StateElement = {
            tag: 'div',
            props: {
                class: 'title',
            },
            children: `${month} ${year}`,
        }

        header.children = [arrow('LEFT'), title, arrow('RIGHT')]

        return header
    }
    private createBody(): Box {
        const body: Box = {
            tag: 'div',
            props: {
                calendar: `body`,
            },
            children: [],
        }

        body.children = [this.createWeeks(), this.createDays()]

        return body
    }
    private createWeeks(): Box {
        const weeks: Box = {
            tag: 'div',
            props: {
                calendar: `body-week`,
            },
            children: [],
        }
        let type_week: 'en' | 'th' = ['en', 'english'].includes(this.lang!)
            ? 'en'
            : 'th'

        this.onWeeks(type_week).forEach((v) => {
            weeks.children.push({
                tag: 'div',
                children: v,
            })
        })
        return weeks
    }
    private createDays(): Box {
        const days: Box = {
            tag: 'div',
            props: {
                calendar: `body-day`,
            },
            children: [],
        }
        const date = this.ui_value
        const [first_week, last_week] = this.onBeforeAfterDay(date)

        /*------------------------------set Before---------------------------------*/
        const _beforeDays = (): Date[] => {
            const lists: Date[] = []
            for (let i = 0; i < first_week; i++) {
                const index_month =
                    date.getMonth() === 0 ? 11 : date.getMonth() - 1
                const days = this.getYear(date)[index_month].days // เดือนก่อนหน้า
                const day = days - (first_week - 1) + i
                const _year =
                    date.getMonth() === 0
                        ? date.getFullYear() - 1
                        : date.getFullYear()

                lists.push(new Date(_year, index_month, day))
            }

            return lists
        }
        const beforeLists: Array<StateElement> = []
        const dayLists: Array<StateElement> = []
        const afterLists: Array<StateElement> = []
        _beforeDays().forEach((_date) => {
            beforeLists.push(
                this.createDate(
                    _date,
                    'd_before',
                    this.onCheckDisabled(_date, this.min, this.max)
                )
            )
        })
        /*-------------x----------------set Before-----------------x---------------*/
        /*------------------------------set Day---------------------------------*/
        for (let i = 0; i < this.getMonth(date).days; i++) {
            const _date = new Date(date.getFullYear(), date.getMonth(), i + 1)
            const current = this.checkSameDate(new Date(), _date)
                ? ' current_date'
                : ''
            dayLists.push(
                this.createDate(
                    _date,
                    current,
                    this.onCheckDisabled(_date, this.min, this.max)
                )
            )
        }
        /*-------------x----------------set Day-----------------x---------------*/
        /*------------------------------set After---------------------------------*/
        for (let i = 0; i < last_week; i++) {
            const _year =
                this.ui_value.getMonth() === 11
                    ? this.ui_value.getFullYear() + 1
                    : this.ui_value.getFullYear()
            const _month =
                this.ui_value.getMonth() === 11
                    ? 0
                    : this.ui_value.getMonth() + 1
            const _date = new Date(_year, _month, i + 1)
            afterLists.push(
                this.createDate(
                    _date,
                    'd_after',
                    this.onCheckDisabled(_date, this.min, this.max)
                )
            )
        }
        /*-------------x----------------set After-----------------x---------------*/
        days.children = [...beforeLists, ...dayLists, ...afterLists]
        return days
    }

    private createDate(
        date: Date,
        className: string,
        isDisabled: boolean = false
    ): StateElement {
        const data: StateElement = {
            tag: 'div',
            props: {
                class: className,
                data_type: this.category,
            },
            children: date.getDate() + '',
            methods: {
                click: () => this.onDatePicker(date),
            },
        }

        if (isDisabled) data.props!['data_calendar'] = 'disabled'
        if (this.checkSameDate(date, this.value))
            data.props!['class'] += ' picker_date'

        return data
    }

    private onDatePicker(date: Date): void {
        // event เมื่อ กดเลือกวันที่

        this.onSetOption('SET_VALUE_AND_UI', date)

        if (typeof this.nextDate == 'function') {
            this.nextDate(date)
        }
        this.render()
    }

    private onChangeMonth(type: 'LEFT' | 'RIGHT') {
        const uiValue = addMonth(this.ui_value, type === 'LEFT' ? -1 : 1)

        this.onSetOption('SET_UI', uiValue)

        if (typeof this.nextMonth == 'function') {
            this.nextMonth(uiValue)
        }
        this.render()
    }

    private setState(
        data: Partial<Pick<CalenderState, 'max' | 'min' | 'value'>>
    ) {
        if (data.min && data.min <= this.value) {
            this.min = data.min
        }
        if (data.max && data.max >= this.value) {
            this.max = data.max
        }

        // if  ถูกเรียกมาจากข้างนอกจริง เอาไว้เปลี่ยนค่า วันเดือน ปี ทั้ง ui และ state แล้วทำการ render calendar ใหม่
        if (data.value) {
            this.onSetOption('SET_VALUE_AND_UI', data.value)
        }
    }
    private onSetOption(type: 'SET_UI' | 'SET_VALUE_AND_UI', date: Date) {
        //set หน้าปฏิทิน ว่าอยู่เดือนไหน หรือ set value
        if (type === 'SET_VALUE_AND_UI') {
            this.ui_value = date
            this.value = date
        } else if (type === 'SET_UI') {
            // ตอนกดเปลี่ยนเดือน
            this.ui_value = date
        }
    }
}

export default Calendar
