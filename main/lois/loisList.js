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
			{title:'Sロイス', type:'check', inputTrigger: this.handleSLois.bind(this)},
			{title:'タイタス', type:'check', inputTrigger: this.handleTitus.bind(this)},
			{title:'昇華', type:'check', inputTrigger: this.handleSublimation.bind(this)}
		]);
		this.bindEvents();
	}
	
	sendMessage(msg) {
		this.fireEvent({
			type: `${this.id}-sendMessage`,
			message: msg
		});
	}
	
	appendNewLois() {
		const addResult = this.addMember();
		const newLoisName = window.prompt("誰にロイスを取得しますか?", "");
		if(newLoisName) {
			this.setLine([newLoisName, false, '', '', false, false, false], addResult);
			this.sendMessage(`${newLoisName}に対してロイスを取得しました`);
		} else {
			this.getElementsByClass('member:last').remove();
		}
	}
	
	bindSharedEvent() {
		this.getElementById('add').click(this.appendNewLois.bind(this));
		this.getElementById('remove').remove();
		
		this.$html.change((e) => {
			var $tr = $(e.target);
			var num = Number($tr.attr('name'));
			var inputValue = $tr.val();
			
			while(! $tr.hasClass(this.memberClass)) {
				$tr = $tr.parent();
			}
			
			if(this.cols[num].inputTrigger) {
				this.cols[num].inputTrigger(inputValue, $tr);
			}
		});
		
		this.getElementById('body').sortable();
		
		
	}
	
	handleSublimation(val, line) {
		const lineInfo = this.getLine(line);
		if(! line.find('.display-loises-member-6 > input').prop('checked')) {
			if(window.confirm('昇華されたタイタスを戻すことは原則としてできません。\n本当に昇華されたタイタスを未昇華に戻しますか?')) {
				this.sendMessage(`[特例的処理] ${lineInfo[0]} への昇華されたタイタスを未昇華の状態に戻しました。`); 
			} else {
				line.find('.display-loises-member-6 > input').prop('checked', true);
			}
			return;
		}
		
		if(! lineInfo[5]) {
			alert('ロイスのまま昇華することはできません。昇華する前にタイタスにしてください');
			line.find('.display-loises-member-6 > input').prop('checked', false);
			return;
		}
		
		if(lineInfo[4]) {
			this.sendMessage(`${lineInfo[0]} へのタイタス (Sロイス) を昇華しました。`); 
		} else {
			this.sendMessage(`${lineInfo[0]} へのタイタスを昇華しました。`); 
		}
	}
	
	handleTitus(val, line) {
		const lineInfo = this.getLine(line);
		const revertTitus = () => {
			line.find('.display-loises-member-5 > input').prop('checked', false);
		}
		if(! line.find('.display-loises-member-5 > input').prop('checked')) {
			if(lineInfo[6]) {
				alert('ロイスに戻そうにもすでに昇華済です。\n何らかの特例的処理で戻す場合は先に昇華を解除してください');
				line.find('.display-loises-member-5 > input').prop('checked', true);
				return;
			}
			if(window.confirm('タイタスをロイスに戻すことは原則としてできません。\n本当にタイタスをロイスにもどしますか?')) {
				this.sendMessage(`[特例的処理] ${lineInfo[0]} へのタイタスをロイスに戻しました。`); 
			} else {
				line.find('.display-loises-member-5 > input').prop('checked', true);
			}
			return;
		}
		
		if(lineInfo[1]) {
			alert('Dロイスをタイタスにすることはできません');
			revertTitus();
		}
		
		if(lineInfo[4]) {
			if(window.confirm('Sロイスをタイタスにした場合、\n昇華する際により強力な効果を発揮しますが、もらえる経験点が減少します。\n本当にタイタスにしてよいですか?')) {
				this.sendMessage(`Sロイス：${lineInfo[0]} をタイタスにしました。`); 
			} else {
				revertTitus();
			}
			return;
		}
		this.sendMessage(`ロイス：${lineInfo[0]} をタイタスにしました。`); 
	}
	
	handleSLois(val, line) {
		const lineInfo = this.getLine(line);
		if(! line.find('.display-loises-member-4 > input').prop('checked')) {
			if(lineInfo[5]) {
				alert('普通のロイスに戻そうにも既にタイタスになっています。\n何らかの特例処理で戻す場合は先にタイタスから戻してください')
				line.find('.display-loises-member-4 > input').prop('checked', true);
				return;
			}
			if(window.confirm('Sロイスを普通のロイスに戻すことは原則としてできません。\n本当にSロイスを普通のロイスにもどしますか?')) {
				this.sendMessage(`[特例的処理] ロイス ${lineInfo[0]} を S ロイスから通常のロイスに戻しました。`); 
			} else {
				line.find('.display-loises-member-4 > input').prop('checked', true);
			}
			return;
		}
		
		const revertSLois = () => {
			line.find('.display-loises-member-4 > input').prop('checked', false);
		}
		
		const hasSLois = Boolean($('.display-loises-member-4 > input').filter((i, $elem) => {
			return $($elem).prop('checked');
		}).length > 1);

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
		this.sendMessage(`ロイス：${lineInfo[0]} を S ロイスに指定しました。`); 
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
			return false;
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
		return this.getElementsByClass('member:last');
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