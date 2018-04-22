var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.ComboCheck = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, data) {
		super($html);
		this.combos = data;
		this.clazz = this.$html.attr('class');
		this.buildComponents();
		this.bindEvents();
	}
	buildComponents () {
		this.$html.append(
				`<h3 class="${this.clazz}-header"><span class="${this.id}-name ${this.clazz}-name">武器・コンボ</span></h3>`);
		this.$html.append(this.combos.map((combo, i) => {return this.generateComboDom(combo, i)}));
	}
	
	generateComboDom (combo, num) {
		return 	`<div class="${this.id}-combo ${this.clazz}-skill" id="${this.id}-combo-${num}">` +
				`<span class="${this.id}-combo-name　${this.clazz}-skill-name">${combo.name}</span>　` +
				`<button class="${this.id}-combo-exec ${this.clazz}-skill-exec" id="${this.id}-combo-exec-${num}">判定する</button>` +
				`<div class="${this.id}-combo-spec">` +
					`ダイス<span class="${this.id}-combo-spec-dice">${combo.dice}</span> / ` +
					`命中<span class="${this.id}-combo-spec-hit">${combo.hit}</span> /` +
					`C値<span class="${this.id}-combo-spec-critical">${combo.critical}</span> /` +
					`攻撃力<span class="${this.id}-combo-spec-attack">${combo.attack}</span> /` +
					`ガード値<span class="${this.id}-combo-spec-guard">${combo.guard}</span> /` +
					`侵蝕率<span class="${this.id}-combo-spec-cost">${combo.cost}</span>` +
				`</div>` +
				`<div class="${this.id}-combo-note">${combo.notes || ''}</div></div>`;
	}
	
	clickExec(e) {
		const $combo = $(e.target).parent();
		const num = Number($combo.attr('id').split('-').pop());
		const check = new io.github.shunshun94.HiyokoCross.CheckDto(this.combos[num]);

		this.fireEvent(check.getCheckEvent());
		this.fireEvent(check.getSimplerCostEvent());
	}
	
	bindEvents() {
		this.getElementsByClass('combo-exec').click((e) => {this.clickExec(e);});
	}
}; 