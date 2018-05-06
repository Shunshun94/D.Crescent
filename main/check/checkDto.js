var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.CheckDto = class {
	constructor(data) {
		io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_NAME.forEach((name, i) => {
			const tmp = data[name] || io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_DEFAULT[i];
			try {
				this[name] = this.isNumber(tmp) ? tmp : tmp.replace(/d(!?10)?/gm, 'd10');
			} catch(e) {
				throw {
					detail: e, currentName: name, value: tmp, input: data
				}
			}
		});
		io.github.shunshun94.HiyokoCross.CheckDto.TXT_PARAMS_NAME.forEach((name, i)=> {
			this[name] = data[name] || io.github.shunshun94.HiyokoCross.CheckDto.TXT_PARAMS_DEFAULT[i];
		});
	}

	append(checkDto) {
		if(Array.isArray(checkDto)) {
			return checkDto.reduce((acc, current) => {
				return acc.append(current);
			}, this);
		} else {
			let data = {};
			io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_NAME.forEach((name) => {
				data[name] = (this[name] + '+' + checkDto[name]).replace('+-', '-');
			});
			data.name = `${this.name}, ${checkDto.name}`;
			data.text = `${this.text}`;
			data.notes = `${this.notes}\n${checkDto.notes}`;
			return new io.github.shunshun94.HiyokoCross.CheckDto(data);			
		}
	}

	isNumber(x) {
		// copy from http://aoking.hatenablog.jp/entry/20120217/1329452700
		if( typeof(x) != 'number' && typeof(x) != 'string' )
			return false;
		else
			return (x == parseFloat(x) && isFinite(x));
	}
	
	getCheckChat() {
		return 	`(${this.dice})DX+${this.hit}@(${this.critical})` +
				` ${this.name} ${this.text ? '|' : ''} ${this.text}\n${this.notes}`;
	}

	getCheckEvent(name = '', eventType = io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.CheckEvent) {
		const message = this.getCheckChat();
		return {
			type: eventType,
			method: 'sendChat',
			args: [{
				name: name,
				message: message
			}],
			checkDetail: this
		};
	}

	getAttackEvent(value, name = '', eventType = io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.AttackEvent) {
		if(Number(value)) {
			const dices = 1 + Math.floor(Number(value) / 10);
			const message = `${dices}d10+${this.attack} ${this.name} ${this.text ? '|' : ''} ${this.text}\n${this.notes}`;
			return {
				type: eventType,
				method: 'sendChat',
				args: [{
					name: name,
					message: message
				}],
				checkDetail: this
			};
		} else {
			throw 'Last check result must be given as number. given last result value: ${value}';
		}
	}

	getSimplerCostEvent(eventType = io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.SimplerCostEvent) {
		if(/[1-9]/.exec(this.cost)) {
			return {
				type: eventType,
				cost: this.cost,
				warn: false,
				checkDetail: this
			};
		} else {
			return {
				type: eventType,
				cost: this.cost,
				warn: `This check (${this.name}) is no cost action.`,
				checkDetail: this
			};
		}
	}

	getCostEvent(currentValue = 0, name = '', eventType = io.github.shunshun94.HiyokoCross.CheckDto.EVENTS.CostEvent) {
		let text = '';
		if(String(this.cost).indexOf('d10') > -1) {
			if(currentValue) {
				text = `${currentValue}+${this.cost} ${this.name} | 侵蝕率上昇`;
			} else {
				text = `${this.cost} ${this.name} | 侵蝕率上昇`;
			}
		} else {
			if(currentValue) {
				text = `${currentValue}+${this.cost}+1d1-1 ${this.name} | 侵蝕率上昇`;
			} else {
				text = `${this.cost}+1d1-1 ${this.name} | 侵蝕率上昇`;
			}
		}
		if(/[1-9]/.exec(text)) {
			return {
				type: eventType,
				method: 'sendChat',
				args: [{
					name: name,
					message: text
				}],
				checkDetail: this
			};
		} else {
			console.log('This check is no cost action.', this);
			throw `This check (${this.name}) is no cost action.`
		}
	}
};

io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_NAME = ['cost', 'dice', 'hit', 'critical', 'attack'];
io.github.shunshun94.HiyokoCross.CheckDto.NUM_PARAMS_DEFAULT = [0,0,0,10,0];
io.github.shunshun94.HiyokoCross.CheckDto.TXT_PARAMS_NAME =['name', 'text', 'notes']
io.github.shunshun94.HiyokoCross.CheckDto.TXT_PARAMS_DEFAULT = ['', '', ''];
io.github.shunshun94.HiyokoCross.CheckDto.EVENTS = {
	CheckEvent: 'io-github-shunshun94-HiyokoCross-CheckDto-EVENTS-CheckEvent',
	AttackEvent: 'io-github-shunshun94-HiyokoCross-CheckDto-EVENTS-AttackEvent',
	CostEvent: 'io-github-shunshun94-HiyokoCross-CheckDto-EVENTS-CostEvent',
	SimplerCostEvent: 'io-github-shunshun94-HiyokoCross-CheckDto-EVENTS-SimplerCostEvent'
};
