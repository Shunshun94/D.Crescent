var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Talk = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, character) {
		super($html, character)
		this.character = character;
		this.initialize();
		this.bindEvents();	
	}
	initialize () {
		this.$html.append(`<div id="${this.id}-toggle">💬チャット</div>`);
		this.$html.append(`<div id="${this.id}-chat"></div>`);
		this.chat = new com.hiyoko.DodontoF.V2.ChatClient(this.getElementById('chat'), {displayLimit: 20, name: this.character.name, color: this.character.color, system: 'DoubleCross'}); 
		this.chat.disable();
	};
	bindEvents() {
		this.getElementById('toggle').click(function(e) {
			if(this.getElementById('chat').css('display') !== 'none') {
				this.getElementById('toggle').text('💬チャット');
			} else {
				this.getElementById('toggle').text('×閉じる');
			}

			this.getElementById('chat').toggle(300);
		}.bind(this));
	}
};
