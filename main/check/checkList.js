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
	
	getCharacterAsyn() {
		return new Promise((resolve, reject) => {
			this.fireEvent({
				type: 'tofRoomRequest', method: 'getCharacters',
				resolve: (result) => {
					const characterCandidate = result.characters.filter((character) => {
						return character.name === this.sheet.name
					});
					if(characterCandidate.length) {
						resolve(characterCandidate[0]);
					} else {
						if(reject) {
							reject({
								result: `${this.sheet.name}のデータが見つかりませんでした`,
								detail: 'list にサーバからの返り値があります', list: result
							});
						} else {
							alert(`${this.sheet.name}のデータが見つかりませんでした`);						
						}
					}
				}, reject: (error) => {
					if(reject) {
						reject(error);
					} else {
						alert(`${this.sheet.name}の情報を取得するのに失敗しました\n理由： ${error.result}`);						
					}
				}
			});
		});
	}
	
	sendChatAsyn(params) {
		return new Promise((resolve, reject) => {
			if(! Boolean(params.message)) {
				if(reject) {
					reject({
						result: 'メッセージがないのでチャットの送信ができませんでした',
						detail: params
					});
				} else {
					alert('メッセージがないのでチャットの送信ができませんでした');
					return;
				}
			}
			const key = io.github.shunshun94.HiyokoCross.CheckList.generateRndString();
			params.message += ` ${key}`;
			
			const getChatEvent = this.getAsyncEvent('tofRoomRequest', {
				method: 'getChat'
			}).done((result) => {
				const sendMessage = result.chatMessageDataLog.filter((msg) => {
					return msg[1].message.indexOf(key) > -1;
				});
				if(sendMessage.length) {
					const regexpResult = io.github.shunshun94.HiyokoCross.CheckList.CHECK_RESULT_REGEXP.exec(sendMessage[0][1].message);
					if(regexpResult) {
						resolve(Number(regexpResult[1]));
					} else {
						// ファンブルとか
						resolve(-1);
					}
				} else {
					if(reject) {
						reject({
							result: '送信したメッセージが見つかりませんでした',
							detail: params
						});
					} else {
						alert('送信したメッセージが見つかりませんでした');
					}
				}
			}).fail((result) => {
				console.warn(result);
				if(reject) {
					reject(result);
				} else {
					alert(`チャットの受信に失敗しました\n理由: ${result.result}`);
				}
			});

			const sendChatEvent = this.getAsyncEvent('tofRoomRequest', {
				method: 'sendChat', args:[params]
			}).done((result) => {
				this.fireEvent(getChatEvent);
			}).fail((result) => {
				console.warn(result);
				if(reject) {
					reject(result);
				} else {
					alert(`チャットの送信に失敗しました\n理由: ${result.result}`);
				}
			});
			this.fireEvent(sendChatEvent);
		});
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
	
	buildEvents() {
		this.$html.on(io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS.SEND_CHAT, (e) => {
			e.type = 'tofRoomRequest';
			e.args[0].name = this.sheet.name;
			this.fireEvent(e);
		});
		
		this.$html.on(io.github.shunshun94.HiyokoCross.EffectCheck.EVENTS.SEND_COST, (e) => {			
			this.getCharacterAsyn().then((data) => {
				this.sendChatAsyn({
					name: this.sheet.name, message: `c(${data.counters['侵蝕率']}+${e.cost})`
				}).then((result) => {
					this.fireEvent({
						type: 'tofRoomRequest',
						method: 'updateCharacter',
						args: [{
							targetName: this.sheet.name,
							'侵蝕率': result
						}]
					});
				});
			});
		});
	}
}

io.github.shunshun94.HiyokoCross.CheckList.CHECK_RESULT_REGEXP = new RegExp(" → ([0-9]+)$");
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
