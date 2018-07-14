var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Applications = io.github.shunshun94.HiyokoCross.Applications || {};
io.github.shunshun94.HiyokoCross.Applications.CharacterNameSetter = class extends com.hiyoko.component.ApplicationBase {
	constructor($dom ,opt = {}) {
		super($dom, opt);
		this.options = opt;
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
	generateFreeInputButton(name) {
		
	}
	generateColorButton(color, opt_name = '') {
		return `<button value="${color}" style="color:#${color}" class="${this.id}-list-color">この色 (#${color}) を使う${ opt_name ? ' ('+opt_name+'が使用中)' : '' }</button>`;
	}
	getNameColorList() {
		return new Promise((resolve, reject) => {
			this.fireEvent({
				type: 'tofRoomRequest',
				method: 'getChat',
				args: [],
				resolve: (result) => {
					resolve(com.hiyoko.DodontoF.V2.getNameColorPairs(result));
				},
				reject: reject
			});
		});
	}
	kick(characterData, nameList, characterListFromPlatform, resolve, reject, self) {
		const onNameClick = (e) => {
			characterData.name = $(e.target).val();
			if(this.options.color) {
				characterData.color = this.options.color; 
				io.github.shunshun94.trpg.sheetApplyer(characterData, nameList, characterListFromPlatform, resolve, reject, self);
				this.disable();
			}
			this.getNameColorList().then((list) => {
				const defaultColor = io.github.shunshun94.util.Color.getColorFromSheed(characterData.name).code.substr(1);
				this.list.empty();
				this.list.append(this.generateColorButton(defaultColor));
				for(var name in list) {
					for(var color in list[name]) {
						this.list.append(this.generateColorButton(io.github.shunshun94.util.Color.colorConvert(color).code.substr(1), name));
					}
				}
				this.getElementsByClass('list-color').click(onColorClick);
			}, (error) => {
				
			});
		};
		const onColorClick = (e) => {
			characterData.color = $(e.target).val(); 
			io.github.shunshun94.trpg.sheetApplyer(characterData, nameList, characterListFromPlatform, resolve, reject, self);
			this.disable();
		};
		
		this.list.empty();
		this.enable();
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
		
		this.getElementsByClass('list-name').click(onNameClick);
	}
};