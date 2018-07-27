var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.CheckOptionTableBase = class extends com.hiyoko.component.ApplicationBase {
	constructor($dom, sheet) {
		super($dom, sheet);
		this.clazz = this.$html.attr('class');
		this.effects = sheet.effects;
		this.items = sheet.items;
		this.defaultLength = this.effects.length + this.items.length;

		this.buildDoms();
		this.bindEvents();
		this.buildComponents();
	}
	
	insertEffects() {
		this.options.clear();
		this.effects.forEach((effect) => {
			this.options.addMember();
			this.options.setLine([false, effect.name, 0, 0, 0, 0, effect.cost, effect.notes]);
		});
		this.items.forEach((item) => {
			this.options.addMember();
			this.options.setLine([false, item.name, 0, 0, 0, 0, 0, '']);
		});
		JSON.parse(localStorage.getItem('io-github-shunshun94-HiyokoCross-CheckOption') || '[]').forEach((data) => {
			this.options.addMember();
			this.options.setLine(data);
		});
	}
	saveOptions(e) {
		const list = e.value.slice(this.defaultLength);
		localStorage.setItem('io-github-shunshun94-HiyokoCross-CheckOption', JSON.stringify(list));
	}

	buildDoms() {
		this.$html.append(`<h3 class="${this.clazz}-header">修正値管理　<button id="${this.id}-toggle">簡易設定 / 詳細設定 切替</button></h3>`);
		this.$html.append(`<div id="${this.id}-simple" border="1">
				ダイス： <input class="${this.id}-simple-number" type="number" value="0" size="5" /> /
				達成値： <input class="${this.id}-simple-number" type="number" value="0" /> /
				クリ値： <input class="${this.id}-simple-number" type="number" value="0" /> /
				攻撃力： <input class="${this.id}-simple-number" type="number" value="0" /> /
				侵蝕率： <input class="${this.id}-simple-number" type="number" value="0" /> /
				補足説明： <input class="${this.id}-simple-text" type="text" value="" /> /
				<button id="${this.id}-simple-reset">リセット</button>
		</div>`)
		this.$html.append(`<table id="${this.id}-table" border="1"></table>`);
	}
	
	bindEvents() {
		this.getElementById('toggle').click((e) => {
			this.getElementById('table').toggle(300);
			this.getElementById('simple').toggle(300);
		});
		this.getElementById('simple-reset').click((e) => {
			this.getElementsByClass('simple-number').val('0');
			this.getElementsByClass('simple-text').val('');
		});
		this.getElementById('table').on('setStorage', (e) => {this.saveOptions(e);});
		this.getElementById('table').on('getStorage', (e) => {
			this.storageId = e.id;
			e.callback(null);
		});
	}
	
	buildComponents() {
		this.options = new io.github.shunshun94.HiyokoCross.CheckOptionTable(this.getElementById('table'));
		this.insertEffects();
	}
	
	getValues() {
		if(this.options.isEnabled()) {
			return this.options.getTableValue().filter((line) => {
				return line[0];
			}).map((line) => {
				return new io.github.shunshun94.HiyokoCross.CheckDto({
					cost: line[6],
					dice: line[2],
					hit: line[3],
					critical: line[4],
					attack: line[5],
					name: line[1],
					notes: line[7]
				});
			});
		} else {
			const $values = this.getElementsByClass('simple-number');
			return [
				{
					cost: $($values[4]).val(),
					dice: $($values[0]).val(),
					hit: $($values[1]).val(),
					critical: $($values[2]).val(),
					attack: $($values[3]).val(),
					name: '各種修正値',
					notes: this.getElementsByClass('simple-number').val()
				}
			];
		}

	}
}

io.github.shunshun94.HiyokoCross.CheckOptionTable = class extends com.hiyoko.component.TableBase {
	constructor($table, opts) {
		super($table, opts);
		this.$html = $($table);
		this.id = this.$html.attr('id');
		this.renderTable(io.github.shunshun94.HiyokoCross.CheckOptionTable.COLS);
	}

	bindSharedEvent() {
		// Disabled sortable
		this.getElementById('add').click(this.addMember.bind(this));
		this.getElementById('remove').click(function(e) {
			this.getElementsByClass('member:last').remove();
			this.setStorage('data', this.getTableValue());
			if(this.calcTotal) {
				this.setTotal(this.calcTotal());
			}
		}.bind(this));
		
		this.$html.change(function(e) {
			var $tr = $(e.target);
			var num = Number($tr.attr('name'));
			var inputValue = $tr.val();
			
			while(! $tr.hasClass(this.memberClass)) {
				$tr = $tr.parent();
			}
			
			var inputTrigger = (this[this.cols[num].inputTrigger] || this.defaultInputTrigger).bind(this);
			
			inputTrigger(inputValue, $tr, function(){
				var vals = this.getLine($tr);
				var $tds = $tr.children();
				this.cols.forEach(function(v, i){
					if(v.type === 'auto') {
						$($tds[i]).text(this[v.func](vals));
					}
				}.bind(this));
				
				if(this.calcTotal) {
					this.setTotal(this.calcTotal(e));
				}
				this.setStorage('data', this.getTableValue());
			}.bind(this));
		}.bind(this));
	}
};

io.github.shunshun94.HiyokoCross.CheckOptionTable.COLS = [
	{title:'有効', type:'check'}, {title:'名称', type:'text'},
	{title:'ダイス', type: 'number'}, {title:'達成値', type:'number'},
	{title:'クリ値', type: 'number'}, {title:'攻撃力', type: 'number'},
	 {title:'侵蝕率', type: 'text'},{title:'説明', type: 'text'}
];
