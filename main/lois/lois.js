var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.Lois = class extends com.hiyoko.component.ApplicationBase  {
	constructor($html, sheet) {
		super($html);
		this.sheet = sheet;
		if(! Boolean(this.sheet)) {
			throw 'io.github.shunshun94.HiyokoCross.Lois Requires TWO arguments.' + 
			'1st, base element. 2nd, character sheet data.';
		}
		this.eventBind();
		this.buildComponents();
	}
	
	updateInitiativeTable() {
		const data = this.getData();
		this.fireEvent({
			type: 'tofRoomRequest',
			method: 'updateCharacter',
			args: [{
				targetName: this.sheet.name,
				'ロイス': data.lois.filter((lois) => {
					return !(lois.titus || lois.type === 'Dロイス');
				}).length
			}]
		});
	}

	getData() {
		var result = {};
		result.lois = this.table.getTableValue().map((lois) => {
			return {
				name: lois[0],
				type: lois[1] ? 'Dロイス' : '',
				Pfeel: lois[2],
				Nfeel: lois[3],
				isSLois: lois[4],
				titus: lois[5],
				used: lois[6]
			}
		});
		return result;
	}

	buildComponents() {
		this.$html.empty();
		this.$html.append(`<table border="1" id="${this.id}-loises">` + '</table>');
		const $loises = this.getElementById('loises');
		this.table = new io.github.shunshun94.HiyokoCross.LoisList($loises);
	}
	
	eventBind() {
		this.$html.on(io.github.shunshun94.HiyokoCross.LoisList.EVENTS.SEND_MESSAGE, (e) => {
			e.name = this.sheet.name;
			this.fireEvent({
				type: 'tofRoomRequest',
				method: 'sendChat',
				args: [e]
			});
		});

		this.$html.on(io.github.shunshun94.HiyokoCross.LoisList.EVENTS.UPDATE_REQUEST, (e) => {
			this.updateInitiativeTable(e);
		});
		
		this.$html.on('getStorage', (e) => {
			const list = this.sheet.lois.map((lois) => {
				return [lois.name, (lois.type === 'Dロイス'), lois.Pfeel, lois.Nfeel, lois.isSLois, lois.titus, lois.used]
			});
			e.callback(list);
		});
	}
};