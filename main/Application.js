var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Application = class extends com.hiyoko.component.ApplicationBase {
	constructor($dom, sheet, opts = {}) {
		super($dom, opts);
		this.client = opts.client || new io.github.shunshun94.trpg.dummy.Room($(`#${this.id}-log`));
		this.sheet = sheet;
		this.max = 0;
		this.appendCharacter();
		this.buildComponents(opts);
		this.bindEvents();
	}

	buildComponents() {
		this.$html.append(`<div id="${this.id}-checklist"></div>`);
		this.checkList = new io.github.shunshun94.HiyokoCross.CheckList(this.getElementById('checklist'), this.sheet);
		this.$html.append(`<div id="${this.id}-lois"></div>`);
		this.$html.append(`<div id="${this.id}-erotion"></div>`);
		this.erotion = new io.github.shunshun94.HiyokoCross.ErotionManage(this.getElementById('erotion'), this.sheet);
	}

	bindEvents() {
		this.$html.on(io.github.shunshun94.HiyokoCross.Application.EVENTS.TofEvent, (event) => {
			this.client[event.method].apply(this.client, event.args).done(event.resolve).fail(event.reject);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Check, (event) => {
			event.args[0].message = this.erotion.getRnroachBonus() + '+' + event.args[0].message;
			this.sendChatAsyn(event.args[0]).then((result) => {
				this.max = (result > this.max) ? result : this.max;
				((event.resolve) || (console.log))(result);
			}, (event.reject) || (console.log));
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Cost, (event) => {
			if(/[1-9]/.exec(event.cost)) {
				const text = (String(event.cost).indexOf('d10') > -1) ?
						`${this.erotion.getCurrentEnroach()} + ${event.cost} | 侵蝕率上昇` :
						`C(${this.erotion.getCurrentEnroach()} + ${event.cost}) | 侵蝕率上昇`;
				this.sendChatAsyn({message: text}).then((result) => {
					this.erotion.setCurrentEnroach(result);
					((event.resolve) || (console.log))(result);
				}, (event.reject) || (console.log));
			}
		});
	}

	sendChatAsyn(params) {
		if(! Boolean(params.name)) {
			params.name = this.sheet.name;
		}
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
			const getChatEvent = this.getAsyncEvent(io.github.shunshun94.HiyokoCross.Application.EVENTS.TofEvent, {
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

			const sendChatEvent = this.getAsyncEvent(io.github.shunshun94.HiyokoCross.Application.EVENTS.TofEvent, {
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

	appendCharacter() {
		this.client.addCharacter({
			name: this.sheet.name,
			HP: this.sheet.subStatus.HP,
			'侵蝕率': this.sheet.subStatus.erotion,
			'財産ポイント': this.sheet.subStatus.property,
			'ロイス': this.sheet.lois.filter((lois) => {
				return !(lois.titus || lois.type === 'Dロイス');
			}).length
		});
		this.fireEvent({
			type: io.github.shunshun94.HiyokoCross.Application.EVENTS.AppendCharacterEvent,
			character: this.sheet
		});
	}
};

io.github.shunshun94.HiyokoCross.Application.EVENTS = {
	TofEvent: 'tofRoomRequest',
	AppendCharacterEvent: 'io-github-shunshun94-HiyokoCross-Application-EVENTS-appendCharacterEvent'
};



io.github.shunshun94.HiyokoCross.ErotionManage = io.github.shunshun94.HiyokoCross.ErotionManage || class {
	constructor(dummy, sheet){this.erotion = sheet.subStatus.erotion;}
	setCurrentEnroach(val) {
		this.erotion = val;
	}
	getCurrentEnroach() {
		return this.erotion;
	}
	getRnroachBonus() {
		return 0;
	}
}
io.github.shunshun94.HiyokoCross.CheckList = io.github.shunshun94.HiyokoCross.CheckList || class {constructor() {}};
io.github.shunshun94.HiyokoCross.Lois = io.github.shunshun94.HiyokoCross.Lois || class {constructor() {}};