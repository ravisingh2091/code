const biometricDevice = require('./biometricDevice');
const board = require('./board');
const branch = require('./branch');
const calendar = require('./calendar');
const calendarClass = require('./calendarClass');
const calendarHoliday = require('./calendarHoliday');
const certificate = require('./certificate');
const classes = require('./class');
const classSubject = require('./classSubject');
const classTeacher = require('./classTeacher');
const countries = require('./countries');
const cron = require('./cron');
const driver = require('./driver');
const employee = require('./employee');
const employeeAttendance = require('./employeeAttendance');
const employeeDevice = require('./employeeDevice');
const exam = require('./exam');
const examMark = require('./examMark');
const examSchedule = require('./examSchedule');
const examSection = require('./examSection');
const feeCarryForward = require('./feeCarryForward');
const feeCategory = require('./feeCategory');
const feeClass = require('./feeClass');
const feeDiscount = require('./feeDiscount');
const feeHead = require('./feeHead');
const feeInvoice = require('./feeInvoice');
const feePayment = require('./feePayment');
const feeStructure = require('./feeStructure');
const fuelConsumption = require('./fuelConsumption');
const grade = require('./grade');
const holiday = require('./holiday');
const homework = require('./homework');
const house = require('./house');
const message = require('./message');
const modules = require('./modules');
const msgAllocation = require('./msgAllocation');
const nationality = require('./nationality');
const nonExamMark = require('./nonExamMark');
const noticeBoard = require('./noticeBoard');
const occupation = require('./occupation');
const oneToOne = require('./oneToOne');
const parent = require('./parent');
const parentDevice = require('./parentDevice');
const pattern = require('./pattern');
const qualification = require('./qualification');
const religion = require('./religion');
const route = require('./route');
const routeStop = require('./routeStop');
const routeVehicle = require('./routeVehicle');
const school = require('./school');
const section = require('./section');
const sectionMark = require('./sectionMark');
const sectionName = require('./sectionName');
const session = require('./session');
const states = require('./states');
const stops = require('./stops');
const stream = require('./stream');
const student = require('./student');
const studentAttendance = require('./studentAttendance');
const studentSection = require('./studentSection');
const subject = require('./subject');
const subTestMark = require('./subTestMark');
const supplementarySchedule = require('./supplementarySchedule');
const term = require('./term');
const termMark = require('./termMark');
const test = require('./test');
const testMark = require('./testMark');
const timetable = require('./timetable');
const transportAllocation = require('./transportAllocation');
const transportComm = require('./transportComm');
const transportDiscount = require('./transportDiscount');
const transportInvoice = require('./transportInvoice');
const transportPayment = require('./transportPayment');
const user = require('./user');
const userType = require('./userType');
const vehicle = require('./vehicle');
const weekOff = require('./weekOff');

const extraExpenditure= require('./extraExpenditure')

const extraacccountingsetting = require('./extraacccountingsetting');

const extraCollection= require('./extraCollection')
function routes(server) {
    biometricDevice(server);
    board(server);
    branch(server);
    calendar(server);
    calendarClass(server);
    calendarHoliday(server);
    certificate(server);
    classes(server);
    classSubject(server);
    classTeacher(server);
    countries(server);
    cron(server);
    driver(server);
    employee(server);
    employeeAttendance(server);
    employeeDevice(server);
    exam(server);
    examMark(server);
    examSchedule(server);
    examSection(server);
    feeCarryForward(server);
    feeCategory(server);
    feeClass(server);
    feeDiscount(server);
    feeHead(server);
    feeInvoice(server);
    feePayment(server);
    feeStructure(server);
    fuelConsumption(server);
    grade(server);
    holiday(server);
    homework(server);
    house(server);
    message(server);
    modules(server);
    msgAllocation(server);
    nationality(server);
    nonExamMark(server);
    noticeBoard(server);
    occupation(server);
    oneToOne(server);
    parent(server);
    parentDevice(server);
    pattern(server);
    qualification(server);
    religion(server);
    route(server);
    routeStop(server);
    routeVehicle(server);
    school(server);
    section(server);
    sectionMark(server);
    sectionName(server);
    session(server);
    states(server);
    stops(server);
    stream(server);
    student(server);
    studentAttendance(server);
    studentSection(server);
    subject(server);
    subTestMark(server);
    supplementarySchedule(server);
    term(server);
    termMark(server);
    test(server);
    testMark(server);
    timetable(server);
    transportAllocation(server);
    transportComm(server);
    transportDiscount(server);
    transportInvoice(server);
    transportPayment(server);
    user(server);
    userType(server);
    vehicle(server);
    weekOff(server);
    extraacccountingsetting(server);
    extraExpenditure(server);
    extraCollection(server);
}

module.exports = routes;
