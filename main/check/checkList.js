var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.CheckList = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, sheet) {
		super($html);
		this.sheet = sheet;
		if(! Boolean(this.sheet)) {
			throw 'io.github.shunshun94.HiyokoCross.CheckList Requires TWO arguments.' + 
			'1st, base element. 2nd, character sheet data.';
		}
		
		this.checks = [];
		
		this.$html.empty();
		this.$html.append('<h2>判定の管理</h2>')
		this.buildComponents();
	}
	
	buildSkillChecksComponents() {
		var status = {};
		this.$html.append(io.github.shunshun94.HiyokoCross.CheckList.STATUS.map((name) => {
			return `<div id="${this.id}-check-${name}" class="${this.id}-check"></div>`
		}));
		
		io.github.shunshun94.HiyokoCross.CheckList.STATUS.forEach((name, i) => {
			status[name] = {name: io.github.shunshun94.HiyokoCross.CheckList.STATUS_JP[i], base: this.sheet.status[name], skills: []};
		});
		for(var name in this.sheet.skills) {
			var value = this.sheet.skills[name];
			value.name = name;
			status[value.status].skills.push(value);
		}
		return io.github.shunshun94.HiyokoCross.CheckList.STATUS.map((name) => {
			new io.github.shunshun94.HiyokoCross.SkillCheck(this.getElementById(`check-${name}`), status[name]);
		});
	}
	
	buildComboChecksComponent() {
		this.$html.append(`<div id="${this.id}-check-combo" class="${this.id}-check"></div>`);
		return new io.github.shunshun94.HiyokoCross.ComboCheck(this.getElementById(`check-combo`), this.sheet.weapons);
	}
	
	buildEffectChecksComponent() {
		this.$html.append(`<div id="${this.id}-check-effect" class="${this.id}-check"></div>`);
		return new io.github.shunshun94.HiyokoCross.EffectCheck(this.getElementById(`check-effect`), this.sheet.effects);
	}
	
	buildComponents () {
		this.checks = this.buildSkillChecksComponents();
		this.checks.push(this.buildComboChecksComponent());
		this.checks.push(this.buildEffectChecksComponent());
	}
}

io.github.shunshun94.HiyokoCross.CheckList.STATUS = ['body', 'sense', 'mind', 'society'];
io.github.shunshun94.HiyokoCross.CheckList.STATUS_JP = ['肉体', '感覚', '精神', '社会'];
