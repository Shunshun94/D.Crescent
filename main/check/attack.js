var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Attack = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opts = {}) {
		super($html, opts);
		const visible = opts.visible || false;
		if(! Boolean(visible)) {
			this.$html.hide();
		}
		this.buildDom();
		this.bindEvent();
	}
	
	activate(value, dto) {
		this.value = value;
		this.dto = dto;
		
		this.disable();
		this.getElementById('name').text(dto.name);
		if(value === -1) {
			this.getElementById('exec').hide();
			this.getElementById('value').text('ファンブル');
		} else {
			this.getElementById('exec').show();
			this.getElementById('value').text(value);
		}
		this.enable(400);
	}
	
	bindEvent() {
		this.getElementById('exec').click((e) => {
			this.disable(400);
			this.fireEvent(this.dto.getAttackEvent(this.value));
		});
		this.getElementById('cancel').click((e) => {
			this.disable(400);
		});
	}
	
	buildDom() {
		this.$html.append(`<span>直前の判定 (<span id="${this.id}-name"></span>) の達成値： <span id="${this.id}-value"></span><br/></span>`);
		this.$html.append(`<button id="${this.id}-exec">ダメージロールする</button><button id="${this.id}-cancel">ダメージロールしない</button>`);
	}
};