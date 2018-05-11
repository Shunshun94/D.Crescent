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
	
	getSheetId() {
		return this.getElementById('sheet-input').val().replace('=', '%EQUAL%');
	}
	
	buildTofUrl(e) {
		document.location = `./dcrescent.html?sheet=${this.getSheetId()}&url=${e.value.url}&room=${e.value.room.no}&pass=${e.value.password.password}`;
	}
	buildDiscordUrl(e) {
		document.location = `./dcrescent.html?system=DoubleCross&sheet=${this.getSheetId()}&url=${e.value.url}&room=${e.value.room}&dicebot=${e.value.dicebot}`
	}
	buildDummyUrl(e) {
		document.location = `./dcrescent.html?system=DoubleCross&sheet=${this.getSheetId()}&dicebot=${this.getElementById('dummy-bcdice-url').val()}`;
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
			this.getElementById('init').show();
			this.getElementById('dummy').show(com.hiyoko.component.InputFlow.Child.SPEED);
			this.getElementById('sheet').hide(com.hiyoko.component.InputFlow.Child.SPEED);
		});
		this.getElementById('tof').on(com.hiyoko.component.InputFlow.Events.Finish, (e) => {
			this.buildTofUrl(e);
		});
		this.getElementById('discord').on(com.hiyoko.component.InputFlow.Events.Finish, (e) => {
			this.buildDiscordUrl(e);
		});
		this.getElementById('dummy-bcdice-next').click((e) => {
			this.buildDummyUrl({value:{}});
		});
		this.getElementById('init').click((e) => {
			location.reload();
		});
	}
	
	buildDom() {
		this.$html.append(`<button id="${this.id}-init">シート URL から入力しなおす</button><hr/>`);

		let buttons = '';
		for(var key in io.github.shunshun94.HiyokoCross.Entrance.PLATFORMS) {
			const platform = io.github.shunshun94.HiyokoCross.Entrance.PLATFORMS[key];
			buttons += 	`<button id="${this.id}-sheet-${key}"><span class="${this.id}-sheet-button-label">${platform.label}</span><br/>` +
						`　　<span class="${this.id}-sheet-button-text">${platform.text}</span></button><br/>`;
		}

		this.$html.append(
			`<div id="${this.id}-sheet">` +
			'<p><a href="https://character-sheets.appspot.com/dx3/">キャラクターシート倉庫</a>または' +
			'<a href="https://charasheet.vampire-blood.net/list_dx3.html">キャラクター保管所</a>で作成したキャラクターの URL を入力してください<br/>' +
			'例<br/>　　<strong>https://charasheet.vampire-blood.net/414826</strong> ※https://charasheet.vampire-blood.net/mefc3348c304ce3d8bc934ce1edebf56a では不可<br/>' +
			'　　<strong>https://character-sheets.appspot.com/dx3/edit.html?key=ahVzfmNoYXJhY3Rlci1zaGVldHMtbXByFgsSDUNoYXJhY3RlckRhdGEY4tbYAQw</strong></p>' +
			`<p>キャラクターシートの URL： <input list="${this.id}-sheet-list" id="${this.id}-sheet-input" type="text" /></p>` +
			`<datalist id="${this.id}-sheet-list"></datalist>` + buttons + '</div>'
		);
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
		this.$html.append(	`<div id="${this.id}-dummy"><div id="${this.id}-dummy-bcdice">`+
							`<p>BCDice-API についてはこちら： <a href="https://github.com/ysakasin/bcdice-api/blob/master/README.md">bcdice-api/README.md at master · ysakasin/bcdice-api</a></p>` +
							`<p>BCDiceAPI の URL：` +
							`<input list="${this.id}-dummy-bcdice-list" placeholder="https://www.example.com/bcdice-api" id="${this.id}-dummy-bcdice-url" type="text" />` +
							`<button id="${this.id}-dummy-bcdice-next">入力完了</button>` +
							`<datalist id="${this.id}-dummy-bcdice-list"></datalist></div></div>`);
		this.getElementById('init').hide();
		
		this.getElementById('tof-url-FreeInput').hide();
		this.getElementById('tof').hide();

		this.getElementById('dummy').hide();
		const list = JSON.parse(localStorage.getItem(io.github.shunshun94.trpg.discord.Entrance.BCDice.UrlList) || '[]');
		this.getElementById('dummy-bcdice-list').append(list.map((url) => {
			return `<option value="${url}"></option>`;
		}).join(''));

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

io.github.shunshun94.HiyokoCross.Entrance.PLATFORMS = {
	tof: {
		label: 'どどんとふに接続する',
		text: 'ブラウザ上で動作するオンラインセッションプラットフォーム、どどんとふに接続します。任意のどどんとふサーバ上に部屋をあらかじめ用意しておく必要があります'
	},
	discord: {
		label: 'Discord に接続する',
		text: 'ブラウザおよびアプリで動作するゲーマー向けチャット・音声通話ツール Discord に接続します。あらかじめBot ユーザの作成と BCDice-API サーバを用意しておく必要があります'
	},
	dummy: {
		label: '動作確認する',
		text: 'ブラウザ上で本アプリの動作を確認します。達成値やダメージ値はダミーの値しか計算されませんが、外部に影響を与えることなくどのようにアプリが動作するのかを確認できます'
	}
};