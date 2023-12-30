# Welcome ADC-Calendar!

Calendar ที่สามารถแสดง yyyy/mm/dd ในรูปแบบ ภาษาไทยและอังกฤษ

# ✨จุดเด่น

-   สามารถกำหนดปี เป็น ค.ศ. หรือ พ.ศ.
-   ใช้ได้ร่วมกับทุก framework JS,TS,(React,Vue,Angular ฯลฯ),PHP Laravel
-   baseเป็น js pureใช้ง่ายและไม่ติด dependencies ใดๆสามารถช้ได้ไปตลอด
-   ui สวยงาม และ สามารถ custom เองได้หลายวิธี
-   วิธีใช้เข้าใจได้ง่ายเรียนรู้ได้ง่าย

## Installation

[Link](https://www.npmjs.com/package/adc-directive) adc-directive
[Link](https://www.npmjs.com/package/adc-calendar) adc-calendar

```sh
npm i adc-calendar
```

## Code Example

```sh
import {swCalendar} from 'adc-calendar'
//////////. short State. /////////
const calendar = new swCalendar('#calendar',{
	value: new Date(),
	nextDate:(res) => {
		console.log('event ตอนกดเปลี่ยนวันที่ :>> ',  res)
	},
})
//////////. full State. /////////
const calendar = new swCalendar('#calendar',{
	value:  new Date('2024-11-01'),
	min:  new Date(),
	max:  new Date('2024-11-31'),
	nextDate: (res) => {
		console.log('event ตอนกดเปลี่ยนวันที่ :>> ',  res)
	},
	nextMonth:  (res)  =>  {
		console.log('event ตอนกดเปลี่ยนเดือน :>> ',  res)
	},
})
calendar.render()
```

## State Key

object สำหรับสร้าง calendar
| Key | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| value | Date | | ค่าวันที่เริ่มต้นวันที่
| lang | en/th | en | default เดือนอังกฤษ or [en,english,th,thai]
| year | en/th | en | default ปีอังกฤษ or [en,th]
| min | Date | new Date | default วันที่ปัจจุบัน หรือ ห้ามเลือกต่ำกว่า default
| max |Date | nerver | default วันที่ไม่มีกำหนด หรือ ห้ามเลือกมากกว่า default
| nextDate |func | undefined | func เมื่อเกิดการกดเลือกวันที่
| nextMonth |func | undefined | func เมื่อเกิดการกดเปลี่ยนเดือน

## Methods

| Name Fn  | Description                 |
| -------- | --------------------------- |
| render() | คำสั่งแสดง calendar ui      |
| stop()   | คำสั่งทำลาย calendar ui     |
| update() | คำสั่ง update(date min max) |

## Custom Calendar

สามารถ custom ได้ 3 ระดับ

> globals.css ทำให้ calendar ui เป็น Template เดียวกันทั้ง project
> local.css ทำให้ calendar ui เป็น Template เดียวกันเฉพาะไฟล์นั้นๆ
> state.style ทำให้สามารถสร้าง template ได้หลายรูปแบบ

**ติดตั้ง code in file. \***.css

```sh
	[calendar='root'] {
		--font-family: 'Arial', sans-serif  !important;
		--background: #f3f8fe  !important;
		--picker: #0ea5e9  !important;
		--text-picker: #fff  !important;
		--current: #ffdfd2  !important;
		--text-current: #ffffff  !important;
		--text: #151426  !important;
		--text-week: #1e293b  !important;
		--borderRadius: 1.2rem  !important;
		--border: none  !important;
		--width: 500px  !important;
		--shadow: none  !important;
	}
```

| Key          | Description                              |
| ------------ | ---------------------------------------- |
| font-family  | font calendar                            |
| background   | color background                         |
| picker       | color bg สำหรับตอนกดเลือกวันที่          |
| text-picker  | color font สำหรับตอนกดเลือกวันที่        |
| current      | color bg แสดงวันที่ปัจจุบัน              |
| text-current | color font แสดงวันที่ปัจจุบัน            |
| text-week    | color font สัปดาห์                       |
| borderRadius | borderRadius calendar                    |
| border       | กรอบ exam => 2px solid black !important; |
| width        | max-width calendar                       |
| shadow       | shadow calendar                          |
