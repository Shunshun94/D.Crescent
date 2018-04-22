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
		this.bindEvents();
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
				`Lv. <span class="${this.id}-skill-level ${this.clazz}-skill-level">${skill.lv}</span>　` +
				`<button class="${this.id}-skill-exec ${this.clazz}-skill-exec" id="${this.id}-skill-exec-${num}">判定する</button></div>`;
	}
	
	bindEvents() {
		this.getElementsByClass('skill-exec').click((e) => {
			const index = Number($(e.target).attr('id').split('-').pop());
			const check = new io.github.shunshun94.HiyokoCross.CheckDto({
				dice: this.data.base, hit: this.data.skills[index].lv, name: this.data.skills[index].name
			});
			this.fireEvent(check.getCheckEvent());
			this.fireEvent(check.getSimplerCostEvent());
			
		});
	}
};

io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_NAME = ['cost', 'dice', 'hit', 'critical', 'attack'];
io.github.shunshun94.HiyokoCross.CheckDto.TXT_PARAMS_NAME =['name', 'text', 'notes']
