export default function longToDate(val) {
	var date = new Date(val); //입력 파라메터로 Date 객체를 생성
	var yyyy = date.getFullYear().toString(); // '연도'
	var mm = (date.getMonth() + 1).toString(); // '월'
	var dd = date.getDate().toString(); // '일'
	var Str = '';
	Str += yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
	return Str;
}
