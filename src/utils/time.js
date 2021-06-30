export default function timeSet(seconds) {
	var hour = parseInt(seconds / 3600);
	var min = parseInt((seconds % 3600) / 60);
	if (hour > 0) {
		return hour + '시간' + min + '분';
	} else {
		return min + '분';
	}
}
