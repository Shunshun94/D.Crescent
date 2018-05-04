var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.ErotionManage = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, sheet){
		super($html);
		this.sheet = sheet;
		this.loisCount = this.sheet.lois.filter((lois) => {
			return !(lois.titus || lois.type === 'Dロイス');
		}).length;
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
		this.isOriginal = sheet.lois.filter((lois) => {
			return lois.name.indexOf('起源種') > -1;
		}).length;
		this.buildComponents();
	}
	buildComponents() {
		const base1 = $(`<div></div>`);
		base1.append(`<span>侵蝕率：<input type="number" id="${this.id}-value"/> / ロイス残数： <span id="${this.id}-lois"></span></span><br/>`);
		base1.append(`<span>侵蝕率ボーナス：<span id="${this.id}-bonus"></span></span>`);
		this.$html.append(base1);
		this.updateLoisCount()
		this.setCurrentEnroach(this.sheet['侵蝕率'] || this.sheet.subStatus.erotion);
	}
	
	setCurrentBonus(opt_bonus) {
		const bonus = opt_bonus || this.getEnroachBonus();
		if(this.isOriginal) {
			this.getElementById('bonus').text(` (起源種) エフェクトレベル ＋${bonus.original}`);
		} else {
			this.getElementById('bonus').text(` エフェクトレベル ＋${bonus.effect} / ダイスボーナス ＋${bonus.dice}`);
		}
	}

	setCurrentEnroach(val) {
		this.getElementById('value').val(val);
		this.setCurrentBonus();
	}
	getCurrentEnroach() {
		return this.getElementById('value').val();
	}
	getEnroachBonus(opt_erotion) {
		const erotion = Number(opt_erotion || this.getCurrentEnroach());
		const cands = this.erotionEffects.filter((effect) => {
			return effect.border >erotion;
		});
		if(cands.length) {
			return cands[0];
		} else {
			return {dice:7, effect:3, original: 4};
		}
	}
	updateLoisCount(opt_count) {
		this.loisCount = opt_count || this.loisCount;
		this.getElementById('lois').text(this.loisCount);
	}
};