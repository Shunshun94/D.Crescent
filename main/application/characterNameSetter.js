var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Applications = io.github.shunshun94.HiyokoCross.Applications || {};
io.github.shunshun94.HiyokoCross.Applications.CharacterNameSetter = class extends com.hiyoko.component.ApplicationBase {
	constructor($dom ,opt = {}) {
		super($dom, opt);
		this.$html.append(`<div id="${this.id}-back"></div>`);
		this.$html.append(`<div id="${this.id}-list"></div>`);
		this.disable();
		this.list = this.getElementById('list');
	}
	generateNewButton(name) {
		return `<button value="${name}" class="${this.id}-list-name">新しく ${name} のコマを作る</button>`;
	}
	generateSelectButton(name) {
		return `<button value="${name}" class="${this.id}-list-name">既存の ${name} のコマを使う</button>`;
	}
	kick(characterData, nameList, characterListFromPlatform, resolve, reject, self) {
		this.list.empty();
		if(nameList.indexOf(characterData.name) > -1) {
			this.list.append(this.generateSelectButton(characterData.name));
		} else {
			this.list.append(this.generateNewButton(characterData.name));
		}
		this.list.append('<hr/>');
		this.list.append(nameList.filter((name)=> {
			return name !== characterData.name;
		}).map((name) => {
			return this.generateSelectButton(name);
		}).join(''));
		this.getElementsByClass('list-name').click((e) => {
			characterData.name = $(e.target).val();
			io.github.shunshun94.trpg.sheetApplyer(characterData, nameList, characterListFromPlatform, resolve, reject, self);
			this.disable();
		});
	}
};