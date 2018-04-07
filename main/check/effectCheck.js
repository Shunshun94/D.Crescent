var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.EffectCheck = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, data) {
		super($html);
		this.clazz = this.$html.attr('class');
		this.data = data;
		this.buildComponents();
	}
	buildComponents () {
		this.$html.append(
				`<h3 class="${this.clazz}-header"><span class="${this.id}-name ${this.clazz}-name">エフェクト</span></h3>`);
		this.$html.append(this.data.map((skill, i) => {return this.generateEffectDom(skill, i)}));
	}
	
	generateEffectDom (skill, num) {
		return 	`<div class="${this.id}-effect ${this.clazz}-skill" id="${this.id}-skill-${num}">` +
				`<span class="${this.id}-effect-name ${this.clazz}-skill-name">${skill.name}</span> (` +
				`Lv. <span class="${this.id}-effect-level ${this.clazz}-skill-level">${skill.level}</span>)`+
				`<div class="${this.id}-effect-spec">` +
					`タイミング:<span class="${this.id}-effect-spec-timing">${skill.timing || ''}</span> / ` +
					`対象:<span class="${this.id}-effect-spec-target">${skill.target || ''}</span> /` +
					`射程:<span class="${this.id}-effect-spec-range">${skill.range || ''}</span> /` +
					`技能:<span class="${this.id}-effect-spec-type">${skill.type || ''}</span> /` +
					`難易度:<span class="${this.id}-effect-spec-judge">${skill.judge || ''}</span> /` +
					`侵蝕率:<span class="${this.id}-effect-spec-cost">${skill.cost || ''}</span>` +
				`</div><div class="${this.id}-combo-note">${skill.notes || ''}</div></div>`;
	}
};