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
		this.appendCharacter().then((sheets) => {
			this.sheet = sheets[0];
			this.buildComponents(opts);
			this.bindEvents();
		}, (err) => {
			console.error(err);
			alert(`キャラクターシートの連携に失敗しました。\n理由: ${err.result || err}\nリロードするか、前の画面に戻ってやりなおすか、ないしは開発者 Twitter にこのエラーメッセージのスクショを送ってください `);
		});
	}

	buildComponents() {
		this.$html.append(`<h1 id="${this.id}-header"></h1>`);
		this.client.getRoomInfo().then((result) => {
			this.getElementById('header').append(`<span id="${this.id}-header-name">${this.sheet.name}</span> @ <span id="${this.id}-header-room">${result.roomName}</span> - DCrescent`);
		});
		this.$html.append(`<div id="${this.id}-erotion"></div>`);
		this.erotion = new io.github.shunshun94.HiyokoCross.ErotionManage(this.getElementById('erotion'), this.sheet);
		this.$html.append(`<button id="${this.id}-toggle">判定 / ロイス切り替え</button>`);
		this.$html.append(`<div id="${this.id}-checklist"></div>`);
		this.checkList = new io.github.shunshun94.HiyokoCross.CheckList(this.getElementById('checklist'), this.sheet);
		this.$html.append(`<div id="${this.id}-lois"></div>`);
		this.loisList = new io.github.shunshun94.HiyokoCross.Lois(this.getElementById('lois'), this.sheet);
	}

	updateCost(event) {
		if(/[1-9]/.exec(event.cost)) {
			const text = (String(event.cost).indexOf('d10') > -1) ?
					`${this.erotion.getCurrentEnroach()}+${event.cost} | 侵蝕率上昇` :
					`${this.erotion.getCurrentEnroach()}+${event.cost}+1d1-1 | 侵蝕率上昇`;
			this.sendChatAsyn({message: text}).then((result) => {
				this.erotion.setCurrentEnroach(result);
				this.client.updateCharacter({
					targetName: this.sheet.name,
					'侵蝕率': result
				});
				((event.resolve) || (console.log))(result);
			}, (event.reject) || (console.log));
		}
	}

	updateLoisStorage() {
		const loisList = this.loisList.getData();
		com.hiyoko.util.updateLocalStorage(io.github.shunshun94.HiyokoCross.Lois.KEEP_STORE, this.sheet.name, loisList);
	}

	bindEvents() {
		this.getElementById('toggle').click((e) => {
			this.getElementById('checklist').toggle(400);
			this.getElementById('lois').toggle(400);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Check, (event) => {
			event.args[0].message = event.args[0].message.replace('(', `(${this.erotion.getEnroachBonus().dice}+`);
			this.sendChatAsyn(event.args[0]).then((result) => {
				this.max = (result > this.max) ? result : this.max;
				((event.resolve) || (console.log))(result);
			}, (event.reject) || (console.log));
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.Lois.UPDATE_LOIS_REQUEST, (event) => {
			const loisList = this.loisList.getData();
			const loisCount = loisList.lois.filter((lois) => {
				return !(lois.titus || lois.type === 'Dロイス');
			}).length;
			com.hiyoko.util.updateLocalStorage(io.github.shunshun94.HiyokoCross.Lois.KEEP_STORE, this.sheet.name, loisList);
			this.client.updateCharacter({
						targetName: this.sheet.name,
						'ロイス': loisCount
					}).then((ok)=>{
				this.erotion.updateLoisCount(loisCount)
			}, (err)=>{
				this.initiativeTableUpdateFailer(err);
			});
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.Lois.UPDATE_LOIS_STORAGE, (event) => {
			this.updateLoisStorage(event);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Cost, (event) => {
			this.updateCost(event);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.CheckList.EVENTS.Attack, (event) => {
			this.client.sendChat(event.args[0]);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.Lois.SEND_MESSAGE_REQUEST, (event) => {
			this.client.sendChat({
				name: this.sheet.name,
				message: event.message
			});
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.ADD_EROTION_VALUE, (event) => {
			this.updateCost(event);
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.UPDATE_EROTION_VALUE, (event) => {
			this.erotion.setCurrentEnroach(event.value);
			this.client.updateCharacter({
				targetName: this.sheet.name,
				'侵蝕率': event.value
			}).then((dummy) => {
				this.client.sendChat({
					name: this.sheet.name,
					message: `侵蝕率修正： ${event.value}`
				});
			}, (err) => {
				this.initiativeTableUpdateFailer(err);
			});
		});
		this.$html.on(io.github.shunshun94.HiyokoCross.ErotionManage.EVENTS.RESURRECT_REQUEST, (event) => {
			this.sendChatAsyn({
				name: this.sheet.name,
				message: `${this.erotion.getCurrentEnroach()}+1d10 | リザレクト`
			}).then((result) => {
				this.client.updateCharacter({
					targetName: this.sheet.name,
					'侵蝕率': result,
					'HP': result - Number(this.erotion.getCurrentEnroach())
				}).then((updateResult) => {
					this.erotion.setCurrentEnroach(result);
				}, (failed) => {
					this.initiativeTableUpdateFailer(failed);
				});
			});
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
			params.bot = 'DoubleCross';
			const getChatEvent = this.getAsyncEvent(io.github.shunshun94.HiyokoCross.Application.EVENTS.TofEvent, {
				method: 'getChat'
			}).done((result) => {
				const sendMessage = result.chatMessageDataLog.filter((msg) => {
					return msg[1].message.indexOf(key) > -1;
				});
				if(sendMessage.length) {
					const regexpResult = io.github.shunshun94.HiyokoCross.CheckList.CHECK_RESULT_REGEXP.exec(com.hiyoko.DodontoF.V2.fixChatMsg(sendMessage[0]).msg);
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
		const saveLoisMemoryData = com.hiyoko.util.getLocalStorage(io.github.shunshun94.HiyokoCross.Lois.KEEP_STORE, this.sheet.name);
		if(saveLoisMemoryData && window.confirm('前回プレイしたときのロイス情報が残っています。読み込みますか?')) {
			for(var key in saveLoisMemoryData) {
				this.sheet[key] = saveLoisMemoryData[key];
			}
		}
		
		this.$html.on(io.github.shunshun94.HiyokoCross.Application.EVENTS.TofEvent, (event) => {
			this.client[event.method].apply(this.client, event.args).done(event.resolve).fail(event.reject);
		});
		const characterManager = new io.github.shunshun94.trpg.CharacterManager(this.$html, {
			sheetHandler: {
				getSheet: (dummy, sheet) => {return new Promise(function(resolve, reject) {resolve(sheet)});}
			},
			sheetConverter: (sheet) => {
				return { 
					name: this.sheet.name,
					HP: this.sheet.subStatus.HP,
					'侵蝕率': this.sheet.subStatus.erotion,
					'財産ポイント': this.sheet.subStatus.property,
					'ロイス': this.sheet.lois.filter((lois) => {
						return !(lois.titus || lois.type === 'Dロイス');
					}).length
				};
			}
		});
		return characterManager.appendCharacters(this.sheet);
	}
	
	initiativeTableUpdateFailer(err) {
		console.error(err);
		alert(`イニシアティブ表の更新に失敗しました\n理由: ${err.result}`);
	}
};

io.github.shunshun94.HiyokoCross.Application.EVENTS = {
	TofEvent: 'tofRoomRequest',
	AppendCharacterEvent: 'io-github-shunshun94-HiyokoCross-Application-EVENTS-appendCharacterEvent'
};



io.github.shunshun94.HiyokoCross.ErotionManage = io.github.shunshun94.HiyokoCross.ErotionManage || class {
	constructor(dummy, sheet){
		this.setCurrentEnroach(sheet['侵蝕率'] || sheet.subStatus.erotion);
		this.erotionEffects = [
			{border: 60, dice:0, effect:0, original: 0},
			{border: 80, dice:1, effect:0, original: 0},
			{border:100, dice:2, effect:0, original: 1},
			{border:130, dice:3, effect:1, original: 2},
			{border:150, dice:4, effect:1, original: 2},
			{border:160, dice:4, effect:1, original: 3},
			{border:190, dice:4, effect:2, original: 3},
			{border:200, dice:4, effect:2, original: 3},
			{border:220, dice:5, effect:2, original: 4},
			{border:260, dice:5, effect:3, original: 4},
			{border:300, dice:6, effect:3, original: 4},
			{border:999, dice:7, effect:3, original: 4}
		];
	}
	setCurrentEnroach(val) {
		this.erotion = val;
		console.log(this.erotion);
	}
	getCurrentEnroach() {
		return this.erotion;
	}
	getEnroachBonus() {
		const cands = this.erotionEffects.filter((effect) => {
			return effect.border > this.erotion;
		});
		if(cands.length) {
			return cands[0];
		} else {
			return {dice:7, effect:3, original: 4};
		}
	}
	updateLoisCount(count) {/* NULL */}
}
io.github.shunshun94.HiyokoCross.CheckList = io.github.shunshun94.HiyokoCross.CheckList || class {constructor() {}};
io.github.shunshun94.HiyokoCross.Lois = io.github.shunshun94.HiyokoCross.Lois || class {constructor() {}};