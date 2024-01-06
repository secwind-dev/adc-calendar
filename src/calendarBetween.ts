import Main, { StateElement } from './main'
type Box = StateElement & {
    children: StateElement[]
}

export interface CalenderState {
    lang?: 'thai' | 'en' | 'th' | 'english'
    nextDate?: (arg: any) => void // function
    nextMonth?: (arg: any) => void // function
    year?: 'en' | 'th'

    values: Date[]
    min?: Date // '2022-10-30'
    max?: Date // '2022-10-30'
    style?: Style
}
type Style = {
    ['font-family']?: string
    text?: string
    ['text-week']?: string
    current?: string
    picker?: string
    disabled?: string
    background?: string
    border?: string
    borderRadius?: string
    shadow?: string
    width?: string
}
let EnumStyle: Style = {
    ['font-family']: `'Arial', sans-serif`,
    picker: '#0ea5e9', // สีวันที่กดเลือก --picker
    disabled: '#c3c2c8', // สีวันที่ถูก disabled  --disabled
    background: '#f3f8fe', //--background
    text: '#151426', //สีตัวอักษร
    ['text-week']: '#1e293b', //สีตัวอักษร
    current: '#ffdfd2', // สีวันที่ปัจจุบัน --calendar_date_current
    border: 'none', //--border
    borderRadius: '1.2rem', //--borderRadius
    shadow: 'none',
    width: '300px',
}
class Calendar extends Main {
    /*------------------------------Set---------------------------------*/
    private category: 'DAY' | 'BETWEEN' = 'BETWEEN' // type day

    /*-------------x----------------Set-----------------x---------------*/

    private lang: 'thai' | 'en' | 'th' | 'english' = 'en'
    private nextDate?: ((arg: any) => void) | undefined
    private nextMonth?: ((arg: any) => void) | undefined
    private year: 'en' | 'th' = 'th'
    private min: Date = new Date()
    private max: Date = new Date('2200-01-01')

    private ui_value: Date
    private style?: Style = {}
    private values: Date[] = [new Date(), new Date()]

    private betweens: Array<Date | undefined> = [new Date(), new Date()]

    constructor(id: string, data: CalenderState) {
        super(id)
        const startDate = data.values[0] || new Date()
        const endDate = data.values[1] || new Date()
        this.values = [startDate, endDate]
        this.ui_value = this.getValues()[0]!

        this.betweens = this.values
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

    update(data: Partial<Pick<CalenderState, 'max' | 'min' | 'values'>>) {
        this.setState(data)
        this.render()
    }
    getState() {
        return {
            id: this.id,
            value: this.values,
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

        const dateBetweens = this.getDatesInRange().map((d) =>
            this.dateToString(d)
        )

        const clsBetween = (date: Date) => {
            const index = dateBetweens.indexOf(this.dateToString(date))
            let cls = []
            if (this.category == 'BETWEEN') {
                if (index !== -1) cls.push('between')
                if (index == 0) cls.push('first')
                if (index == dateBetweens.length - 1) cls.push('last')
            }

            return cls.join(' ')
        }

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
                    'd_before' + ` ${clsBetween(_date)}`,
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
                    current + ` ${clsBetween(_date)}`,
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
                    'd_after' + ` ${clsBetween(_date)}`,
                    this.onCheckDisabled(_date, this.min, this.max)
                )
            )
        }
        /*-------------x----------------set After-----------------x---------------*/
        days.children = [...beforeLists, ...dayLists, ...afterLists]
        return days
    }

    private getValues() {
        const startDate =
            this.values[0]! < this.values[1]! ? this.values[0] : this.values[1]
        const endDate =
            this.values[0]! > this.values[1]! ? this.values[0] : this.values[1]

        this.values = [startDate!, endDate!]
        return [startDate!, endDate!]
    }

    private getDatesInRange(): Date[] {
        const lists = []
        const [startDate, endDate] = this.getValues()
        const date = new Date(startDate.getTime())
        while (date <= endDate!) {
            lists.push(new Date(date))
            date.setDate(date.getDate() + 1)
        }

        return lists
    }

    private dateToString(date: Date) {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const currentDate = `${year}-${month}-${day}`
        return currentDate
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
        if (this.checkSameDate(date, this.betweens[0]!))
            data.props!['class'] += ' picker_date'

        return data
    }

    private onSortDate(a: Date, b: Date): Date[] {
        const startDate = a < b ? a : b
        const endDate = a > b ? a : b

        return [startDate, endDate]
    }

    private onDatePicker(date: Date): void {
        // event เมื่อ กดเลือกวันที่

        this.category = 'DAY'
        if (this.betweens[0] === undefined) {
            this.betweens[0] = date
            // this.is_end_process_between = false
        } else if (this.betweens[0] && this.betweens[1] === undefined) {
            // คือการออก event nextDate
            this.category = 'BETWEEN'
            this.betweens = this.onSortDate(this.betweens[0], date)
            this.values = [this.betweens[0]!, this.betweens[1]!]
            // this.is_end_process_between = true
            this.onSetOption('SET_VALUE_AND_UI', this.values)

            if (typeof this.nextDate == 'function') {
                this.nextDate(this.values)
            }
        } else if (this.betweens[0] && this.betweens[1]) {
            this.betweens[0] = date
            this.betweens[1] = undefined
            // this.is_end_process_between = false
        }

        this.render()
    }

    private onChangeMonth(type: 'LEFT' | 'RIGHT') {
        let year = this.ui_value.getFullYear()
        let _indexMonth =
            type === 'RIGHT'
                ? this.ui_value.getMonth() + 1
                : this.ui_value.getMonth() - 1
        if (this.ui_value.getMonth() === 11 && type === 'RIGHT') {
            // ถ้าเป็นเดือนธันวาคมให้ขึ้นปีใหม่
            year = this.ui_value.getFullYear() + 1
            _indexMonth = 0
        }
        if (this.ui_value.getMonth() === 0 && type === 'LEFT') {
            // ถ้าเป็นเดือนธันวาคมให้ขึ้นปีใหม่
            year = this.ui_value.getFullYear() - 1
            _indexMonth = 11
        }

        const newDate = new Date(year, _indexMonth, 1)

        this.onSetOption('SET_UI', [newDate, newDate])

        if (typeof this.nextMonth == 'function') {
            this.nextMonth(this.getMonth(newDate))
        }
        this.render()
    }

    private setState(
        data: Partial<Pick<CalenderState, 'max' | 'min' | 'values'>>
    ) {
        const [start, end] = this.getValues()
        if (data.min && data.min <= start) {
            this.min = data.min
        }
        if (data.max && data.max >= end) {
            this.max = data.max
        }

        // if  ถูกเรียกมาจากข้างนอกจริง เอาไว้เปลี่ยนค่า วันเดือน ปี ทั้ง ui และ state แล้วทำการ render calendar ใหม่
        if (data.values) {
            this.onSetOption('SET_VALUE_AND_UI', data.values)
        }
    }
    private onSetOption(type: 'SET_UI' | 'SET_VALUE_AND_UI', dates: Date[]) {
        //set หน้าปฏิทิน ว่าอยู่เดือนไหน หรือ set value
        if (type === 'SET_VALUE_AND_UI') {
            this.ui_value = dates[0]
            this.values = dates
        } else if (type === 'SET_UI') {
            // ตอนกดเปลี่ยนเดือน
            this.ui_value = dates[0]
        }
    }
}

export default Calendar
