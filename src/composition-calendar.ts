/**
 * @class Calendar
 * @description คอมโพเนนต์ปฏิทินที่รองรับการเลือกวันที่แบบ Single Date และ Date Range
 * สามารถปรับแต่งภาษา (ไทย/อังกฤษ), รูปแบบปี (พ.ศ./ค.ศ.), และสไตล์การแสดงผลได้
 */

// Custom error types
class CalendarError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CalendarError'
    }
}

export class DateValidationError extends CalendarError {
    constructor(message: string) {
        super(message)
        this.name = 'DateValidationError'
    }
}
