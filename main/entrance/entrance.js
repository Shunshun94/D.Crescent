var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Entrance = class extends com.hiyoko.component.ApplicationBase {
	constructor($html) {
		super($html);
		this.buildDom();
		this.buildComponents();
		this.bindEvents();
	}
	
	buildTofUrl(e) {
		document.location = `./dcrescent.html?sheet=${this.getElementById('sheet-input').val()}&url=${e.value.url}&room=${e.value.room.no}&pass=${e.value.password.password}`;
	}
	buildDiscordUrl(e) {
		document.location = `./dcrescent.html?system=DoubleCross&sheet=${this.getElementById('sheet-input').val()}&url=${e.value.url}&room=${e.value.room}&dicebot=${e.value.dicebot}`
	}
	buildDummyUrl(e) {
		document.location = `./dcrescent.html?sheet=${this.getElementById('sheet-input').val()}`;
	}
	
	bindEvents() {
		this.getElementById('sheet-input').change((e) => {
			if(this.getElementById('sheet-input').val()) {
				this.getElementById('sheet > button').show();
			} else {
				this.getElementById('sheet > button').hide();
			}
		});
		this.getElementById('sheet-tof').click((e) => {
			this.getElementById('init').show();
			this.getElementById('tof').show(com.hiyoko.component.InputFlow.Child.SPEED);
			this.getElementById('sheet').hide(com.hiyoko.component.InputFlow.Child.SPEED);
		});
		this.getElementById('sheet-discord').click((e) => {
			this.getElementById('init').show();
			this.getElementById('discord').show(com.hiyoko.component.InputFlow.Child.SPEED);
			this.getElementById('sheet').hide(com.hiyoko.component.InputFlow.Child.SPEED);
		});
		this.getElementById('sheet-dummy').click((e) => {
			this.buildDummyUrl({value:{}})
		});
		this.getElementById('tof').on(com.hiyoko.component.InputFlow.Events.Finish, (e) => {
			this.buildTofUrl(e);
		});
		this.getElementById('discord').on(com.hiyoko.component.InputFlow.Events.Finish, (e) => {
			this.buildDiscordUrl(e);
		});
		this.getElementById('init').click((e) => {
			location.reload();
		});
	}
	
	buildDom() {
		this.$html.append(`<button id="${this.id}-init">シート URL から入力しなおす</button><hr/>`);
		this.$html.append(
			`<div id="${this.id}-sheet"><p>` +
			`キャラクターシートの URL： <input list="${this.id}-sheet-list" id="${this.id}-sheet-input" type="text" /></p>` +
			`<datalist id="${this.id}-sheet-list"></datalist>` +
			`<button id="${this.id}-sheet-tof">どどんとふに接続</button><br/>` +
			`<button id="${this.id}-sheet-discord">Discord に接続</button><br/>` +
			`<button id="${this.id}-sheet-dummy">動作確認する</button>` +
			`</div>`
		)
		this.$html.append(
				`<div id="${this.id}-tof">` +
				`<div id="${this.id}-tof-url"><h2>使うどどんとふを選択してください</h2>`+
				`<div id="${this.id}-tof-url-StaticInput"><h3>リストから選択</h3>` +
				`<select id="${this.id}-tof-url-StaticInput-List"></select><br/>` +
				`<button id="${this.id}-tof-url-StaticInput-Hide">URL を手入力する場合はこちらから</button></div>` +
				`<div id="${this.id}-tof-url-FreeInput"><h3>URL を手入力</h3>` +
				`<input type="text" id="${this.id}-tof-url-FreeInput-Url" /><br/>` +
				`<button id="${this.id}-tof-url-FreeInput-Hide">リストから選択する場合はこちらから</button>` +
				`</div><br/><button id="${this.id}-tof-url-Next">次へ</button></div>` +
				`<div id="${this.id}-tof-room"><button id="${this.id}-tof-room-back">戻る</button>` +
				`<div id="${this.id}-tof-room-list"></div></div>` +
				`<div id="${this.id}-tof-password"><button id="${this.id}-tof-password-back">戻る</button><br/>` +
				`入室パスワード<input id="${this.id}-tof-password-password" type="text" /><br/>` +
				`<button id="${this.id}-tof-password-next">次へ</button></div>` +
				`<div id="${this.id}-tof-option">` +
				`<button id="${this.id}-tof-option-back">戻る</button><br/>` +
				`<button id="${this.id}-tof-option-next">入力完了</button>` +
				`</div></div>`
		);
		this.$html.append(`<div id="${this.id}-discord"></div>`);
		this.getElementById('init').hide();
		this.getElementById('tof-url-FreeInput').hide();
		this.getElementById('tof').hide();
		this.getElementById('discord').hide();
		this.getElementById('sheet > button').hide();
		com.hiyoko.util.forEachMap(JSON.parse(localStorage.getItem('com-hiyoko-sample-dx3sheetparse-index') || '{}'), (v, k) => {
			$(`#${this.id}-sheet-list`).append(`<option value="${k}">${v}</option>`);
		});
	}
	
	buildComponents() {
		this.tof = new com.hiyoko.DodontoF.V2.Entrance(this.getElementById('tof'));
		this.discord = new io.github.shunshun94.trpg.discord.Entrance(this.getElementById('discord'));
	}
}