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
		this.bindEvents();
	}

	updateValue() {
		this.fireEvent({
			type: io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.UPDATE_EROTION_VALUE,
			value: Number(this.getElementById('value').val())
		})
	}

	throwEntry() {
		if(confirm('シーン登場します。よろしいですか?')) {
			this.fireEvent({
				type: io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.ADD_EROTION_VALUE,
				cost: '1d10 登場'
			});
		}
	}

	throwImpulse() {
		if(confirm('衝動判定による侵蝕率上昇を行います。よろしいですか?')) {
			this.fireEvent({
				type: io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.ADD_EROTION_VALUE,
				cost: '2d10 衝動判定実施'
			});
		}
	}

	throwGeneshift() {
		if(confirm('ジェネシフトを行います。よろしいですか?')) {
			this.fireEvent({
				type: io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.ADD_EROTION_VALUE,
				cost: `${this.getElementById('geneshift-value').val()}d10 ジェネシフト`
			});
		}
	}

	bindEvents() {
		this.getElementById('value').change((e) => {this.updateValue();});
		this.getElementById('entry').click((e) => {this.throwEntry();});
		this.getElementById('impulse').click((e) => {this.throwImpulse();});
		this.getElementById('geneshift-exec').click((e) => {this.throwGeneshift();});
	}
	
	buildComponents() {
		const base1 = $(`<div></div>`);
		base1.append(`<span>侵蝕率：<input type="number" id="${this.id}-value"/> / ロイス残数： <span id="${this.id}-lois"></span></span><br/>`);
		base1.append(`<span>侵蝕率ボーナス：<span id="${this.id}-bonus"></span></span>`);
		this.$html.append(base1);
		this.updateLoisCount()
		this.setCurrentEnroach(this.sheet['侵蝕率'] || this.sheet.subStatus.erotion);
		
		const base2 = $(`<div></div>`);
		let max = 1;
		for(var key in this.sheet.status) {
			const statusValue = Number(this.sheet.status[key]);
			max = (max < statusValue) ? statusValue : max;
		}

		base2.append(`<button id="${this.id}-entry">シーン登場する</button><br/>`);
		base2.append(`<button id="${this.id}-impulse">衝動判定による侵蝕率上昇</button><br/>`)
		base2.append(`<span id="${this.id}-geneshift">ジェネシフト： <input type="number" value="1" min="1" max="${max}" id="${this.id}-geneshift-value"/><button id="${this.id}-geneshift-exec">ジェネシフトする</button></span>`);
		this.$html.append(base2);
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

io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS = {
	UPDATE_EROTION_VALUE: 'io-github-shunshun94-HiyokoCross-ErotionManage-EVENTS-UPDATE_EROTION_VALUE',
	ADD_EROTION_VALUE: 'io-github-shunshun94-HiyokoCross-ErotionManage-EVENTS-ADD_EROTION_VALUE'
};
