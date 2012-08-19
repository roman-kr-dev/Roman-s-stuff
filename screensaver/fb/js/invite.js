var FriendsDialog = (function () {
	var config = {
		max_selected:3,
		second_action_text:'',
		personal_message:'',
		friends_list:[],
		action_botton_text:'Send Invitations',
		cancel_botton_text:'Cancel',
		action_botton_function:'send_invites',
		cancel_botton_function:'selector_cancel',
		search_default:'Start Typing a Name',
		title_text:'Invite Friends',
		no_selected_friends:'You have no selected friends.',
		too_many_friends:'Too many friends selected.',
		tab_all:'All',
		tab_selected:'Selected',
		find_friends_label:'Find Friends:',
		personal_message_label:'Add a personal message:',
		action_text:''
	};
	
	return Class.extend({
		init: function(cfg){
			$.extend(true, config, cfg);

			this.selected = [];
			this.allTab = true;
			
			this.dialog = $('<div />').html(new FriendsDialogHTML(config).html).appendTo('#friends');
		},

		selectTab:function (all, auto) {
			var noFriends = $('#fbinvite_no_friends'),
				tabAll = $('#fbinvite_tab_all'),
				tabSelected = $('#fbinvite_tab_selected'),
				maxSelected = $('#fbinvite_max_selected');
			
			if (this.allTab == all) return;
			
			maxSelected.css('display', 'none');
			clearInterval(this.fade_delay);
			
			tabAll[all ? 'addClass' : 'removeClass']('friends_tab_selected');
			tabSelected[!all ? 'addClass' : 'removeClass']('friends_tab_selected');
			
			if (!all && !this.selected.length) {		
				noFriends.css({
					'display':'block',
					'opacity':1
				});

				this.fade_delay = function () { new Fx.Tween(noFriends).start('opacity', 0).chain(function () { noFriends.setStyle('display', 'none'); }); }.delay(2000);
			}
			else {
				noFriends.css('display', 'none');
				clearInterval(this.fade_delay);
			}
			
			this.allTab = all;
			
			if (auto) return;
			this.resetSearch();
			this.showFriends(all);
		},
		
		selectFriend:function (li) {
			var id = li.attr('friend') * 1,
				selecedCount = $('#fbinvite_selected_count');
			
			if (this.selected.indexOf(id) == -1 && this.selected.length < config.max_selected) {
				li.addClass('selected');
				this.selected.push(id);
				this.events.fire('friendSelect', id);
			}
			else if (this.selected.indexOf(id) > -1) {
				li.removeClass('selected');
				this.selected.splice( $.inArray(id, this.selected), 1 );
				this.events.fire('friendUnSelect', id);
			}

			console.log(id, this.selected)

			selecedCount.html(this.selected.length);
			
			this.maxSelected(li);
		},
		
		showFriends:function (all) {
			$('ul#fbinvite_friends li').each($.proxy(function (i, li) {
				$(li).css('display', all ? 'block' : this.selected.indexOf($(li).attr('friend') * 1) == -1 ? 'none' : 'block');
			}, this));
		},
		
		friendsSeach:function (term) {
			if (!this.allTab) this.selectTab(true, true);
			
			$('ul#fbinvite_friends li').each(function (i, li) {
				var rx = new RegExp('('+term+')', "i"),
					name = $(li).attr('name');
						
				if (!$.trim(term).length || rx.test(name)) $(li).css('display', 'block').find('strong').html(name.replace(rx, '<em>$1</em>'));
				else $(li).css('display', 'none').find('strong').html(name);
			}.bind(this));
			
			$('#fbinvite_clear').css('display', term.trim().length ? 'block' : 'none');
		},
		
		maxSelected:function (li) {
			var maxSelected = $('fbinvite_max_selected');
			
			if (!li.is('.selected') && this.selected.length == config.max_selected) {
				maxSelected.css({
					'display':'block',
					'opacity':1
				});

				maxSelected.stop();
				this.fade_delay = function () { new Fx.Tween(maxSelected).start('opacity', 0).chain(function () { maxSelected.setStyle('display', 'none'); }); }.delay(2000);
			}
		},
		
		focusInput:function (input) {
			if (input.value == input.title) $(input).val('').removeClass('input_placeholder');
		},
		
		blurInput:function (input) {
			if (input.value == '') $(input).set('value', input.title).addClass('input_placeholder');
		},
		
		resetSearch:function () {
			var input = $('fbinvite_filter'),
				clear = $('fbinvite_clear');
				
			if (input.value == input.title) return;
			
			input.set('value', input.title).addClass('input_placeholder');
			clear.setStyle('display', 'none');
			
			$$('ul#fbinvite_friends li').each(function (li) { $(li).setStyle('display', 'block').getElement('strong').set('html', $(li).get('name')); });
		},
		
		sendInvites:function () {
			var message = $('fbinvite_message');
			
			if (window[config.action_botton_function]) window[config.action_botton_function](this.selected, message.value == message.title ? '' : message.value);
		},
		
		cancelInvites:function () {
			this.close();
			
			if (window[config.cancel_botton_function]) window[config.cancel_botton_function]();
		}
	});
})();

var FriendsDialogHTML = (function () {
	var config = {};

	return Class.extend({
		init: function(cfg){
			config = cfg;

			this.html = this.getDialog()
				.replace('[[@@title]]', config.title_text)
				.replace('[[@@explaination]]', this.getContent('explaination'))
				.replace('[[@@finder]]', this.getContent('finder'))
				.replace('[[@@tabs]]', this.getContent('tabs'))
				.replace('[[@@no_friends]]', this.getContent('no_friends'))
				.replace('[[@@max_selected]]', this.getContent('max_selected'))
				.replace('[[@@friends]]', this.getContent('friends'))
				//.replace('[[@@promotional]]', this.getContent('promotional'))
				//.replace('[[@@personal_message]]', this.getContent('personal_message'))
				.replace('[[@@buttons]]', this.getContent('buttons'));
		},

		getDialog:function () {
			var html = [];
			
			html.push('<div class="fb_dialog_popup">');
				html.push('<div class="pop_content">');
					html.push('<h2 class="dialog_title"><span>[[@@title]]</span></h2>');
					html.push('<div class="dialog_content">');
						html.push('<div class="dialog_body">');
							html.push('<div class="friends_selector">');
								html.push('<div class="friends_selector_wrapper clearfix">');
									html.push('[[@@explaination]]');
									html.push('[[@@finder]]');
									html.push('[[@@tabs]]');
									html.push('[[@@no_friends]]');
									html.push('[[@@max_selected]]');
									html.push('[[@@friends]]');
									//html.push('[[@@promotional]]');
									//html.push('[[@@personal_message]]');
									html.push('[[@@buttons]]');
								html.push('</div>');
							html.push('</div>');
						html.push('</div>');
					html.push('</div>');
				html.push('</div>');
			html.push('</div>');

			return html.join('');
		},

		getContent:function (content) {
			var html = [];
			
			switch (content) {
				case 'explaination':
					config.action_text.length ? html.push('<div class="explaination">'+config.action_text+'</div>') : '';
					break;

				case 'finder':
					html.push('<div class="finder" id="fk">');
						html.push('<table width="100%">');
							html.push('<tr>');
								html.push('<td>');
									html.push('<label>');
										html.push(config.find_friends_label);
									html.push('</label>');
									html.push('<input id="fbinvite_filter" onfocus="fbinvite.focusInput(this);" onblur="fbinvite.blurInput(this);" onkeyup="fbinvite.friendsSeach(this.value)" type="text" value="'+config.search_default+'" title="'+config.search_default+'" autocomplete="off" size="42" class="inputtext input_placeholder">');
									html.push('<div id="fbinvite_clear" style="display:none;"><a class="hide" onclick="fbinvite.resetSearch(); return false;" href="#"></a></div>');
								html.push('</td>');
							html.push('</tr>');
						html.push('</table>');
					html.push('</div>');
					break;

				case 'tabs':
					html.push('<div class="filters clearfix">');
						html.push('<div class="sel_filters">');
							html.push('<div class="clearfix">');
								html.push('<ul class="friends_tabs">');
									html.push('<li id="fbinvite_tab_all" class="friends_tab friends_tab_selected">');
										html.push('<a onclick="fbinvite.selectTab(true); return false;" href="#">');
											html.push('<div class="tl">');
												html.push('<div class="tr">');
													html.push('<div class="br">');
														html.push('<div class="bl">'+config.tab_all+'</div>');
													html.push('</div>');
												html.push('</div>');
											html.push('</div>');
										html.push('</a>');
									html.push('</li>');
									html.push('<li id="fbinvite_tab_selected" class="friends_tab">');
										html.push('<a onclick="fbinvite.selectTab(false); return false;" href="#">');
											html.push('<div class="tl">');
												html.push('<div class="tr">');
													html.push('<div class="br">');
														html.push('<div class="bl">'+config.tab_selected+' (<strong id="fbinvite_selected_count">0</strong>)</div>');
													html.push('</div>');
												html.push('</div>');
											html.push('</div>');
										html.push('</a>');
									html.push('</li>');
								html.push('</ul>');
							html.push('</div>');
						html.push('</div>');
					html.push('</div>');
					break;

				case 'no_friends':
					html.push('<div id="fbinvite_no_friends" class="no_friends_notice" style="display: none;">'+config.no_selected_friends+'</div>');
					break;

				case 'max_selected':
					html.push('<div id="fbinvite_max_selected" class="no_max_selected_notice" style="display: none;">'+config.too_many_friends+'</div>');
					break;

				case 'friends':
					html.push('<ul id="fbinvite_friends" class="friends">');
						$(config.friends_list).each(function (i, friend) {
							html.push('<li friend="'+friend.id+'" name="'+friend.name+'">');
								html.push('<a onclick="fbinvite.selectFriend($(this.parentNode)); return false;" title="'+friend.name+'" href="#"><span style="background-image: url('+friend.picture.data.url+');" class="square"><span></span></span><strong>'+friend.name+'</strong></a>');
							html.push('</li>');
						});
					html.push('</ul>');
					break;

				case 'promotional':
					config.second_action_text.length ? html.push('<div class="promotional_message">'+config.second_action_text+'</div>') : '';
					break;

				case 'personal_message':
					html.push('<div class="personal_message">');
						html.push('<label>'+config.personal_message_label+'</label>');
						html.push('<div class="personal_message_wrapper">');
							html.push('<textarea id="fbinvite_message" onfocus="fbinvite.focusInput(this);" onblur="fbinvite.blurInput(this);" rows="2" title="'+config.personal_message+'" class="input_placeholder">'+config.personal_message+'</textarea>');
						html.push('</div>');
					html.push('</div>');
					break;

				case 'buttons':
					html.push('<div class="buttons">');
						html.push('<div>');
							html.push('<label class="uiButton uiButtonConfirm uiButtonLarge">');
								html.push('<input type="button" onclick="fbinvite.sendInvites();" value="'+config.action_botton_text+'">');
							html.push('</label>');

							html.push('<label class="uiButton uiButtonLarge">');
								html.push('<input type="button" onclick="fbinvite.cancelInvites()" value="'+config.cancel_botton_text+'">');
							html.push('</label>');
						html.push('</div>');
					html.push('</div>');

					break;
			}

			return html.join('')
		}
	});
})();