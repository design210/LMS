/**
 * 팝업 기본 옵션
 * @param {*} name 팝업명
 * @param {*} width 넓이로 px, % 붙임
 * @param {*} height 높이로 px, % 붙임
 * @param {*} resizable 크기 조절이 가능하지 여부
 * @param {*} clickToClose 클릭해서 창을 닫을 건지 여부
 */
export const getPopupOpt = function (name, width, height, resizable, clickToClose) {
	let opt = {
		name: name,
		width: width,
		height: height,
		resizable: resizable,
		clickToClose: !clickToClose ? false : clickToClose,
		draggable: '.popup-title', // true면 전체 팝업에서 적용되고 지정하면 해당 클래스가 있는 부분만 적용됨,
		// transition: "pop-out"
	};
	return opt;
};
