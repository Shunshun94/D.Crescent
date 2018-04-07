var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.SkillCheck = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, data) {
		super($html);
		this.clazz = this.$html.attr('class');
		this.data = data;
		this.buildComponents();
	}
	buildComponents () {
		this.$html.append(
				`<h3 class="${this.clazz}-header"><span class="${this.id}-name ${this.clazz}-name">${this.data.name}</span>： ` +
				`<span class="${this.id}-value ${this.clazz}-value">${this.data.base}</span></h3>`);
		this.$html.append(this.data.skills.map((skill, i) => {return this.generateSkillDom(skill, i)}));
	}
	
	generateSkillDom (skill, num) {
		return 	`<div class="${this.id}-skill ${this.clazz}-skill" id="${this.id}-skill-${num}">` +
				`<span class="${this.id}-skill-name ${this.clazz}-skill-name">${skill.name}</span>: ` +
				`Lv. <span class="${this.id}-skill-level ${this.clazz}-skill-level">${skill.lv}</span></div>`;
	}
};