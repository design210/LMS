function timestampToyymmdd(timestamp, kind) {
	var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
		ampm = 'AM',
		time;

	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	switch (kind) {
		case 'kr-ymdhma': // ie: 2013-02-18, 8:35 AM
			time = yyyy + '년' + mm + '월' + dd + '일' + h + ':' + min + ' ' + ampm;
			break;
		case 'yyyy-mm-dd': // ie: 2013-02-18
			time = yyyy + '-' + mm + '-' + dd;
			break;
	}

	return time;
}
export { timestampToyymmdd };
