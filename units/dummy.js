var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.ErotionManage = io.github.shunshun94.HiyokoCross.ErotionManage || class {
	constructor(dummy, sheet){
		this.setCurrentEnroach(sheet['侵蝕率'] || sheet.subStatus.erotion);
		this.erotionEffects = [
			{border: 60, dice:0, effect:0, original: 0},
			{border: 80, dice:1, effect:0, original: 0},
			{border:100, dice:2, effect:0, original: 1},
			{border:130, dice:3, effect:1, original: 2},
			{border:150, dice:4, effect:1, original: 2},
			{border:160, dice:4, effect:1, original: 3},
			{border:190, dice:4, effect:2, original: 3},
			{border:200, dice:4, effect:2, original: 3},
			{border:220, dice:5, effect:2, original: 4},
			{border:260, dice:5, effect:3, original: 4},
			{border:300, dice:6, effect:3, original: 4},
			{border:999, dice:7, effect:3, original: 4}
		];
	}
	setCurrentEnroach(val) {
		this.erotion = val;
	}
	getCurrentEnroach() {
		return this.erotion;
	}
	getEnroachBonus() {
		const cands = this.erotionEffects.filter((effect) => {
			return effect.border > this.erotion;
		});
		if(cands.length) {
			return cands[0];
		} else {
			return {dice:7, effect:3, original: 4};
		}
	}
	updateLoisCount(count) {/* NULL */}
}
io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS = {
		UPDATE_EROTION_VALUE: 'io-github-shunshun94-HiyokoCross-ErotionManage-EVENTS-UPDATE_EROTION_VALUE',
		ADD_EROTION_VALUE: 'io-github-shunshun94-HiyokoCross-ErotionManage-EVENTS-ADD_EROTION_VALUE',
		RESURRECT_REQUEST: 'io-github-shunshun94-HiyokoCross-ErotionManage-EVENTS-RESURRECT_REQUEST'
};
io.github.shunshun94.HiyokoCross.CheckList = io.github.shunshun94.HiyokoCross.CheckList || class {constructor() {}};
io.github.shunshun94.HiyokoCross.Lois = io.github.shunshun94.HiyokoCross.Lois || class {constructor() {}};
io.github.shunshun94.HiyokoCross.Lois.UPDATE_LOIS_REQUEST = 'io-github-shunshun94-HiyokoCross-Lois-UPDATE_LOIS_REQUEST';
io.github.shunshun94.HiyokoCross.Lois.SEND_MESSAGE_REQUEST = 'io-github-shunshun94-HiyokoCross-Lois-SEND_MESSAGE_REQUEST';
io.github.shunshun94.HiyokoCross.Lois.KEEP_STORE = 'io-github-shunshun94-HiyokoCross-Lois-KEEP_STORE';
io.github.shunshun94.HiyokoCross.Lois.UPDATE_LOIS_STORAGE = 'io-github-shunshun94-HiyokoCross-Lois-UPDATE_LOIS_STORAGE';
