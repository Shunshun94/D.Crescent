var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.EffectCheck = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, data) {
		super($html);
		this.clazz = this.$html.attr('class');
		this.effects = data;
		this.buildComponents();
		this.bindEvents();
	}
	
	updateEffectLevel (advantage) {
		this.getElementsByClass('skill-level').each((i, dom) => {
			const $dom = $(dom);
			const currentText = $dom.text();
			if($.isNumeric($dom.text())) {
				$dom.text(Number(currentText) + advantage);
			}
		});
	}

	resetEffectChecks () {
		$(`.${this.id}-effect-check`).prop('checked', false);
	}

	getCheckedEffectList () {
		let result = [];
		$(`.${this.id}-effect-check`).each((i, v) => {
			const $dom = $(v);
			if($dom.prop('checked')) {
				let effect = this.effects[$dom.val()];
				effect.level = $dom.parent().find(`.${this.id}-effect-level`).text();
				result.push(effect);
			}
		});
		return result;
	}
	
	sendChat (message) {
		this.fireEvent({
			type: io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS.SEND_CHAT,
			method: 'sendChat',
			args: [{
				message: message
			}]
		});
	}
	
	sendCost (cost) {
		this.fireEvent({
			type: io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS.SEND_COST,
			cost: cost
		});
	}

	buildComponents () {
		this.$html.append(
				`<h3 class="${this.clazz}-header"><span class="${this.id}-name ${this.clazz}-name">エフェクト</span>` +
				`<button id="${this.id}-toggle">開閉</button></h3>`);
		this.$html.append(this.effects.map((skill, i) => {return this.generateEffectDom(skill, i)}).join(`<hr class="${this.clazz}-border"/>`));
		this.$html.append(`<button id="${this.id}-exec">エフェクト行使 (判定は行われず侵蝕率のみ上昇します)</button>`);
	}

	useEffects(e) {
		const effects = this.getCheckedEffectList();
		const text = 'エフェクト行使: \n' + effects.map((effect) => {
			return `　　${effect.name}: ${effect.notes}`;
		}).join('\n');
		const totalCost = effects.map((effect) => {return (effect.cost || '0').replace(/d(!?10)?/gm, 'd10')}).join('+');
		this.sendChat(text);
		if(/[1-9]/.exec(totalCost)) {
			this.sendCost(totalCost);			
		} else {
			console.log(`侵蝕率上昇なし - ${totalCost}`);
		}
		this.resetEffectChecks();
	}

	bindEvents() {
		this.getElementById('exec').click((e) => {this.useEffects()});
		this.getElementById('toggle').click((e) => {
			this.getElementsByClass('effect').toggle(300);
			this.getElementById('exec').toggle(300);
		});
	}

	generateEffectDom (skill, num) {
		return 	`<div class="${this.id}-effect ${this.clazz}-skill" id="${this.id}-skill-${num}">` +
				`<input value="${num}" type="checkbox" class="${this.id}-effect-check" />` +
				`<span class="${this.id}-effect-name ${this.clazz}-skill-name">${skill.name}</span>` +
				`${skill.check ? '(' + skill.check + ')' : ''} (` +
				`Lv. <span class="${this.id}-effect-level ${this.clazz}-skill-level">${skill.level}</span>)`+
				`<div class="${this.id}-effect-spec">` +
					`タイミング:<span class="${this.id}-effect-spec-timing">${skill.timing || ''}</span> / ` +
					`対象:<span class="${this.id}-effect-spec-target">${skill.target || ''}</span> /` +
					`射程:<span class="${this.id}-effect-spec-range">${skill.range || ''}</span> /` +
					`技能:<span class="${this.id}-effect-spec-type">${skill.type || ''}</span> /` +
					`難易度:<span class="${this.id}-effect-spec-judge">${skill.judge || ''}</span> /` +
					`侵蝕率:<span class="${this.id}-effect-spec-cost">${skill.cost || ''}</span>` +
				`</div><div class="${this.id}-effect-note">${skill.notes || ''}</div></div>`;
	}
};

io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS = {
		SEND_CHAT: 'io-github-shunshun94-HiyokoCross-EffectCheck-EVENTS-SEND_CHAT',
		SEND_COST: 'io-github-shunshun94-HiyokoCross-EffectCheck-EVENTS-SEND_COST'
};
