// 此文件只定义常量这件事

// appid
const  APP_ID = 'wxa71a114b7686a1dc';  //正式环境appid
// const  APP_ID='wx6fa3d2b769624571'; //测试环境appid

// 请求的基本url地址
let BASE_URL = "http://www.zjsmjcschool.com/api/weixin"; //正式环境
// let BASE_URL = "http://39.98.43.172:81/api/weixin"; //测试环境

// 绑定接口队列
const GET_USER_INFO="/getUserInfo";
const GET_USER_INFO_LIST="/getUserInfoList";
const GET_STUDEN_INFO="/getStudentInfo";
const GET_PARENT_STUDENT_LIST="/getParentStudentList";
const GET_TEACHER_INFO="/getTeacherInfo";
const ADD_PARENT_BIND_STUDENT="/addParentBindStudent";
const SET_PARENT_STUDENT_LOGIN_INFO="/setParentStudentLoginInfo";
const REMOVE_PARENT_BIND_STUDENT="/removeParentBindStudent";
const SET_LOGIN_INFO= "/setLoginInfo";
const REMOVE_BIND_USER="/removeBindUser";

// common队列
const COM_FIELD_LIST="/common/getFieldList";
const COM_AREA_SCHOOL_CLASSES_LIST ="/common/getAreaSchoolClassesList";
const COM_UPLOAD_FILD = "/common/uploadFile";
const COM_UPLOAD_AVTER = "/uploadStudentIcon"

// 获取微信签名接口
const SIGN_INFO = "/signInfo";

// 绑定接口
const BOUND_VERIFY_CODE = "/getPhoneVerifyCode";
const BOUND_SAVE_BIND = "/saveCodeBindUser";

// 学生证模块的接口地址
const CRAD_BIND_INFO = "/student/card/base/bind/info";
const CARD_AND_LOCATION = "/student/card/query/cardAndLocation";
const CARD_PARAM = "/student/card/query/cardParam";
const CARD_SPEAKER = "/student/card/terminal/speaker";
const CARD_CLOSE = "/student/card/terminal/close";
const CARD_REBOOT = "/student/card/terminal/reboot";
const CARD_MOVEMENT = "/student/card/movement/switch";
const CARD_SOS = "/student/card/sos/switch";
const CARD_STANDBY = "/student/card/mode/standby/set";
const CARD_DISTURB = "/student/card/query/disturb/list";
const CARD_DISTURB_REMOVE = "/student/card/disturb/remove";
const CARD_DISTURB_SWITCH = "/student/card/class/switch";
const CARD_DISTURB_SET = "/student/card/disturb/set";
const CARD_WHITE_LIST = "/student/card/query/white/list";
const CARD_MONITOR = "/student/card/monitor";
const CARD_STEP = "/student/card/query/card/step/list";
const CARD_SMS = "/student/card/query/card/sms/list";
const CARD_ACTUAL = "/student/card/query/actual";
const CARD_MODE_SET = "/student/card/mode/location/set";
const CARD_STATION = "/student/card/station/list";
const CARD_STATION_SWICTH = "/student/card/station/switch";
const CARD_STATION_DELETE = "/student/card/station/delete";
const CARD_FENCE_SWITCH="/student/card/fence/switch";
const CARD_FENCE_DELETE="/student/card/fence/delete";
const CARD_FENCE_HANDLER="/student/card/white/handle";
const CARD_FENCE_LIST="/student/card/fence/list";
const CARD_QUERY_LOCUS = "/student/card/query/locus";
const CARD_QUERY_FOOTPRINT="/student/card/query/footprint";
const CARD_ELECTR_LIST ="/student/card/query/card/electricity/list"
const CARD_SMS_LIST ="/student/card/query/card/sms/list";
const CARD_SMS_DELETE = "/student/card/query/card/sms/delete";
const CARD_SMS_READ = "/student/card/query/card/sms/read";
const CARD_FENCE_SET = "/student/card/fence/set";
const CARD_STATION_SET = "/student/card/station/set";

// 课程表模块
const GET_SYSLLABUS_BY_PARENT="/syllabus/getSyllabusByParent";
// const GET_SYSLLABUS_BY_TEACHER="/syllabus/getSyllabusByTeacher";

// 通讯录接口
const GET_ADDRESS_BOOK_BY_PARENT="/addressBook/getAddressBookByParent";

// 作业模块接口
const GET_ASSGIGN_RECORD_LIST = "/assignment/getAssignmentRecordList";

// 消息模块接口
const NEWS_ADMIN_TYPE_LIST = "/message/getAdminMessageTypeList";
const NEWS_ADMIN_DATE_LIST = "/message/getMyMessageList";

// 校园新闻
const MATION_TYPE_LIST ="/message/getInformationTypeList";
const MATION_DATA_LIST ="/message/getInformationList";
const MATION_CAROUSE_LIST ="/message/getInformationCarouselList";

// 考勤接口
const ATTEND_STUDENT_MONTH = "/attend/getStudentMonthStatistics";
const ATTEND_STUDENT_DAY = "/attend/getStudentStatisticsDay";
const ATTEND_STUDENT_DATEIL = "/attend/getListByStudentMonth";


export {
	APP_ID,
	GET_USER_INFO,
	GET_STUDEN_INFO,
	COM_FIELD_LIST,
	GET_PARENT_STUDENT_LIST,
	BASE_URL,
	SIGN_INFO,
	CRAD_BIND_INFO,
	COM_AREA_SCHOOL_CLASSES_LIST,
	ADD_PARENT_BIND_STUDENT,
	SET_PARENT_STUDENT_LOGIN_INFO,
	REMOVE_PARENT_BIND_STUDENT,
	GET_SYSLLABUS_BY_PARENT,
	GET_ADDRESS_BOOK_BY_PARENT,
	GET_USER_INFO_LIST,
	SET_LOGIN_INFO,
	REMOVE_BIND_USER,
	COM_UPLOAD_FILD,
	CARD_AND_LOCATION,
	CARD_PARAM,
	CARD_SPEAKER,
	CARD_CLOSE,
	CARD_REBOOT,
	CARD_MOVEMENT,
	CARD_SOS,
	CARD_STANDBY,
	CARD_DISTURB,
	CARD_DISTURB_REMOVE,
	CARD_DISTURB_SWITCH,
	CARD_DISTURB_SET,
	CARD_WHITE_LIST,
	CARD_MONITOR,
	CARD_STEP,
	CARD_SMS,
	CARD_ACTUAL,
	CARD_MODE_SET,
	CARD_STATION,
	CARD_STATION_SWICTH,
	CARD_STATION_DELETE,
	CARD_FENCE_SWITCH,
	CARD_FENCE_DELETE,
	CARD_FENCE_HANDLER,
	CARD_FENCE_LIST,
	CARD_QUERY_LOCUS,
	GET_ASSGIGN_RECORD_LIST,
	NEWS_ADMIN_TYPE_LIST,
	NEWS_ADMIN_DATE_LIST,
	MATION_TYPE_LIST,
	MATION_DATA_LIST,
	MATION_CAROUSE_LIST,
	CARD_QUERY_FOOTPRINT,
	CARD_ELECTR_LIST,
	CARD_SMS_LIST,
	CARD_SMS_DELETE,
	CARD_SMS_READ,
	BOUND_VERIFY_CODE,
	BOUND_SAVE_BIND,
	ATTEND_STUDENT_MONTH,
	ATTEND_STUDENT_DAY,
	ATTEND_STUDENT_DATEIL,
	CARD_FENCE_SET,
	CARD_STATION_SET,
	COM_UPLOAD_AVTER
}