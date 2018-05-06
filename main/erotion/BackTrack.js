var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.ErotionManage = io.github.shunshun94.HiyokoCross.ErotionManage || {};
io.github.shunshun94.HiyokoCross.ErotionManage.BackTrack = class extends com.hiyoko.component.ApplicationBase {
	constructor($dom, sheet) {
		 super($dom);
		 this.memoriesCount = (sheet.memory || []).filter((memory) => {return memory.name;}).length;
		 this.loisCount = sheet.lois.filter((lois) => {
				return !(lois.titus || lois.type === 'Dロイス');
			}).length;
		 this.buildComponents();
		 this.bindEvents();
	}
	
	update(opt_loisCount) {
		const lois = opt_loisCount || this.loisCount;
		this.loisCount = lois;
		const bonus = Number(this.getElementById('bonus').val());
		
		this.clearTable();
		this.appendTableLine(lois, bonus);
		if(lois > 2) {
			this.appendTableLine(lois - 1, bonus);
		}
		if(lois > 1) {
			this.appendTableLine(lois - 2, bonus);	
		}
	}
	
	bindEvents() {
		this.getElementById('bonus').change((e) => {
			this.update();
		});
	}
	
	clearTable() {
		this.getElementsByClass('table-tr').remove();
	}
	
	appendTableLine(loisCount, bonus) {
		const sd = [
			Math.sqrt(io.github.shunshun94.HiyokoCross.ErotionManage.BackTrack.variance * (loisCount     + bonus)),
			Math.sqrt(io.github.shunshun94.HiyokoCross.ErotionManage.BackTrack.variance * (loisCount * 2 + bonus)),
			Math.sqrt(io.github.shunshun94.HiyokoCross.ErotionManage.BackTrack.variance * (loisCount * 3 + bonus))
		];
		const ave = [
			99 + (loisCount     + bonus) * 5.5 + this.memoriesCount * 10,
			99 + (loisCount * 2 + bonus) * 5.5 + this.memoriesCount * 10,
			99 + (loisCount * 3 + bonus) * 5.5 + this.memoriesCount * 10
		];
		let $tr = $(`<tr class="${this.id}-table-tr"><th>${loisCount}</th></tr>`);
		$tr.append(`<td>${Math.floor(ave[0]-sd[0]*2)} / ${Math.floor(ave[1]-sd[1]*2)} / ${Math.floor(ave[2]-sd[2]*2)}</td>`);
		$tr.append(`<td>${Math.floor(ave[0]-sd[0])} / ${Math.floor(ave[1]-sd[1])} / ${Math.floor(ave[2]-sd[2])}</td>`);
		$tr.append(`<td>${Math.floor(ave[0])} / ${Math.floor(ave[1])} / ${Math.floor(ave[2])}</td>`);
		$tr.append(`<td>${Math.floor(ave[0]+sd[0])} / ${Math.floor(ave[1]+sd[1])} / ${Math.floor(ave[2]+sd[2])}</td>`);

		this.getElementById('table').append($tr);
	}
	
	buildComponents() {
		this.$html.append(	`<span>バックトラック時 Eロイス・Dロイス等による<br/>ボーナス・ペナルティダイス：<input type="number" value="0" id="${this.id}-bonus" /></span><hr/>`);
		this.$html.append(	`<table border="1" id="${this.id}-table"><caption>バックトラック成功目安表 ${(this.memoriesCount) ? '- メモリー計算済' : ''}(1倍振 / 2倍振 / 2倍振 + 追加振)</caption>`+
							`<tr><th>ロイス</th><td>95%成功</td><td>68%成功</td><td>期待値で成功</td><td>32%成功</td></tr></table>`);
		this.update();
	}
};
io.github.shunshun94.HiyokoCross.ErotionManage.BackTrack.variance = 8.25;

