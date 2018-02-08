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
	
	buildComponents() {
		this.$html.empty();
		this.$html.append(`<table border="1" id="${this.id}-loises">` + '</table>');
		const $loises = this.getElementById('loises');
		this.table = new io.github.shunshun94.HiyokoCross.LoisList($loises);
	}
	
	eventBind() {
		this.$html.on(`${this.id}-loises-sendMessage`, (e) => {
			console.log(`CHAT INFO: ${e.message}`);
		});
		
		this.$html.on('getStorage', (e) => {
			const list = this.sheet.lois.map((lois) => {
				return [lois.name, (lois.type === 'Dロイス'), lois.Pfeel, lois.Nfeel, lois.isSLois, lois.titus, lois.used]
			});
			e.callback(list);
		});
	}
};