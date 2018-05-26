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
		const $separator = `<hr class="${this.clazz}-border"/>`;
		this.$html.append(
				`<h3 class="${this.clazz}-header"><span class="${this.id}-name ${this.clazz}-name">${this.data.name}</span>： ` +
				`<span class="${this.id}-value ${this.clazz}-value">${this.data.base}</span>　<button id="${this.id}-toggle">開閉</button></h3>`);
		this.$html.append(this.data.skills.map((skill, i) => {return this.generateSkillDom(skill, i)}).join($separator));
		this.$html.append($separator);
		this.$html.append(
				`<div class="${this.id}-skill ${this.clazz}-skill" id="${this.id}-skill-${this.data.skills.length}">` + 
				`<span class="${this.id}-skill-name ${this.clazz}-skill-name">${this.data.name}で判定</span> `+
				`<span class="${this.id}-skill-level ${this.clazz}-skill-level" style="display:none;">0</span>` +
				`<button class="${this.id}-skill-exec ${this.clazz}-skill-exec" id="${this.id}-skill-exec-${this.data.skills.length}">判定する</button></div>`);
	}
	
	generateSkillDom (skill, num) {
		const $dummy = $('<div></div>');
		const $base = $(`<div class="${this.id}-skill ${this.clazz}-skill" id="${this.id}-skill-${num}"></div>`);
		const $name = $(`<span class="${this.id}-skill-name ${this.clazz}-skill-name"></span>`);
		$name.text(skill.name);
		$base.append($name);
		$base.append(': Lv. ');
		const $lv = $(`<span class="${this.id}-skill-level ${this.clazz}-skill-level"></span>`);
		$lv.text(skill.lv);
		$base.append($lv);
		$base.append(' ');
		$base.append(`<button class="${this.id}-skill-exec ${this.clazz}-skill-exec" id="${this.id}-skill-exec-${num}">判定する</button>`);
		$dummy.append($base);
		return $dummy.html();
	}

	bindEvents() {
		this.getElementsByClass('skill-exec').click((e) => {
			const index = Number($(e.target).attr('id').split('-').pop());
			const skill = this.data.skills[index] || {
				lv: 0, name: this.data.name
			};
			const check = new io.github.shunshun94.HiyokoCross.CheckDto({
				dice: this.data.base, hit: skill.lv, name: skill.name
			});
			this.fireEvent(check.getCheckEvent());
			this.fireEvent(check.getSimplerCostEvent());
		});
		this.getElementById('toggle').click((e) => {this.getElementsByClass('skill').toggle(300);});
	}
};

io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_NAME = ['cost', 'dice', 'hit', 'critical', 'attack'];
io.github.shunshun94.HiyokoCross.CheckDto.TXT_PARAMS_NAME =['name', 'text', 'notes']
