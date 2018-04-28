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
		this.buildEvents();
	}
	
	buildAttack() {
		this.$html.append(`<div id="${this.id}-attack" class="${this.id}-attack"></div>`);
		return new io.github.shunshun94.HiyokoCross.Attack(this.getElementById('attack'));
	};
	
	buildOptionTable() {
		this.$html.append(`<div id="${this.id}-options" class="${this.id}-check"></div>`);
		return new io.github.shunshun94.HiyokoCross.CheckOptionTableBase(this.getElementById('options'), this.sheet);
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
		this.attack = this.buildAttack();
		this.options = this.buildOptionTable();
		this.checks = this.buildSkillChecksComponents();
		this.checks.push(this.buildComboChecksComponent());
		this.checks.push(this.buildEffectChecksComponent());
	}
	
	updateCost(e) {
		const checkMerged = e.checkDetail.append(this.options.getValues());
		e.cost = checkMerged.cost;
		e.type = io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Cost;
		this.fireEvent(e);
	}

	buildEvents() {
		this.$html.on(io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS.SEND_CHAT, (e) => {
			e.type = 'tofRoomRequest';
			e.args[0].name = this.sheet.name;
			this.fireEvent(e);
		});
		
		this.$html.on(io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS.SEND_COST, (e) => {this.updateCost(e)});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.AttackEvent, (e) => {
			e.args[0].name = this.sheet.name;
			e.type = io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Attack;
			this.fireEvent(e);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.SimplerCostEvent, (e) => {this.updateCost(e)});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.CheckEvent, (e) => {
			const checkMerged = e.checkDetail.append(this.options.getValues());
			e.type = io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Check;
			e.args[0].name = this.sheet.name;
			e.args[0].message = checkMerged.getCheckChat();
			e.resolve = (value) => {
				this.attack.activate(value, checkMerged);
			};
			e.reject = (error) => {
				alert(`判定実施に失敗しました。\n理由： ${error.result}`);
				console.error(error);
			};
			this.fireEvent(e);
		});
	}
}

io.github.shunshun94.HiyokoCross.CheckList.CHECK_RESULT_REGEXP = new RegExp("→ ([0-9]+)$");
io.github.shunshun94.HiyokoCross.CheckList.STATUS = ['body', 'sense', 'mind', 'society'];
io.github.shunshun94.HiyokoCross.CheckList.STATUS_JP = ['肉体', '感覚', '精神', '社会'];
io.github.shunshun94.HiyokoCross.CheckList.generateRndString = () => {
	let randomString = '';
	const baseString ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i = 0; i < 8; i++) {
		randomString += baseString.charAt( Math.floor( Math.random() * baseString.length));
	}
	return `#HiyokoCross-${randomString}`;
};

io.github.shunshun94.HiyokoCross.CheckList.EVENTS = {
	Check: 'io-github-shunshun94-HiyokoCross-CheckList-EVENTS-Check',
	Cost: 'io-github-shunshun94-HiyokoCross-CheckList-EVENTS-Cost',
	Attack: 'io-github-shunshun94-HiyokoCross-CheckList-EVENTS-Attack'
};
