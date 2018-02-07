var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.HiyokoCross = io.github.shunshun94.HiyokoCross || {};
io.github.shunshun94.HiyokoCross.LoisList = class extends com.hiyoko.component.TableBase {
	constructor ($html) {
		super();
		this.$html = $($html);
		this.id = this.$html.attr('id');
		this.renderTable([
			{title:'名前', type:'text'},
			{title:'Dロイス', type:'check'},
			{title:'感情(P)', type:'text'},
			{title:'感情(N)', type:'text'},
			{title:'Sロイス', type:'check', inputTrigger: 'handleSLois'},
			{title:'タイタス', type:'check'},
			{title:'昇華', type:'check'}
		]);
		this.bindEvents();
	}
	
	handleSLois(val, line) {
		const revertSLois = () => {
			console.log(line.find('.display-loises-member-4 > input'));
			line.find('.display-loises-member-4 > input').prop('checked', false);
		}
		
		const hasSLois = Boolean($('.display-loises-member-4 > input').filter((i, $elem) => {
			return $($elem).prop('checked');
		}).length > 1);
		const lineInfo = this.getLine(line);			

		if(lineInfo[1]) {
			alert('DロイスをSロイスに指定することはできません')
			revertSLois();
			return;
		}
		if(lineInfo[5]) {
			alert('既にタイタスになっています')
			revertSLois();
			return;
		}
		if(hasSLois) {
			alert('Sロイスに指定できるロイスは1つまでです');
			revertSLois();
			return;
		}
		console.log(`${lineInfo[0]} を S ロイスに指定`); 
			
		
		
	}
	
	setLine(line, opt_$tr) {
		const vals = (opt_$tr || this.getElementsByClass('member:last')).children();
		this.cols.forEach(function(v, i){
			if(line[i] !== null && line[i] !== undefined) {
				if(v.type === 'text') {
					$($(vals[i]).find('input')[0]).val(line[i]);
				} else if (v.type === 'number') {
					$($(vals[i]).find('input')[0]).val(line[i]);
				} else if (v.type === 'check') {
					$($(vals[i]).find('input')[0]).attr('checked', line[i]);
				} else if (v.type === 'button') {
				} else if (v.type === 'auto') {
					$(vals[i]).text(line[i]);
				}
			}
		});
	}
	
	addMember() {
		if($(`.${this.memberClass}`).length === 7) {
			alert('ロイスは7つまでしか持てません');
			return;
		}
		
		var $member = $('<tr></tr>')
		$member.addClass(this.memberClass);
		
		this.cols.forEach((col, i) => {
			var $col = $('<td></td>');
			$col.addClass(this.memberClass + '-' + i);
			var $input = false;
			if(col.type === 'text') {
				$input = $('<input value="" type="text" name="' + i + '" class="com-hiyoko-component-table-base-member-text" />');
			} else if (col.type === 'number') {
				$input = $('<input value="0" type="number" name="' + i + '" class="com-hiyoko-component-table-base-member-number" />');
			} else if (col.type === 'check') {
				$input = $('<input type="checkbox" name="' + i + '" class="com-hiyoko-component-table-base-member-check" />');
			} else if (col.type === 'button') {
				$input = $('<input type="button" name="' + i + '" class="com-hiyoko-component-table-base-member-button" value="' + col.text + '" />');
			} else if (col.type === 'auto') {
				$col.css('background-color', '#E0E0E0');
			}
			
			if(col.autocomplete) {
				$input.attr({'autocomplete': 'on', 'list': col.autocomplete.attr('id')});
			}
			
			if($input) {
				$col.append($input);
			}
			$member.append($col);
		});
		this.getElementsByClass('util').before($member);
	}
	
	bindEvents () {
		this.$html.change((e) => {
			const targetElemParent = $(e.target).parent();
			const targetName = $(e.target).parent().parent().find('.display-loises-member-0 > input').val();
			if(targetElemParent.hasClass('display-loises-member-4')) {
//				console.log(targetName + 'を S ロイスに指定')
			}
		});
		
		
	}
};