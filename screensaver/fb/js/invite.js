var FriendsDialog = (function () {
	var config = {
		min_selected:9,
		max_selected:40,
		selectRandomFriends:40,
		initalLoadingImages:20,
		second_action_text:'',
		personal_message:'',
		friends_list:[],
		selected_list:[],
		action_botton_text:'Continue',
		cancel_botton_text:'Skip',
		action_botton_function:'friendsScreenSaver.invite',
		cancel_botton_function:'friendsScreenSaver.skip',
		search_default:'Start Typing a Name',
		title_text:'Choose all your friends that you want to see on your screensaver',
		no_selected_friends:'You have no selected friends.',
		too_many_friends:'Too many friends selected.',
		too_few_friends:'Select at least 9 friends to view animation',
		tab_all:'All Friends',
		tab_selected:'Selected',
		find_friends_label:'Find Friends:',
		personal_message_label:'Add a personal message:',
		action_text:'',
		iconsPendingStatus:[]
	}, thi$, lastScrollHeightLoaded = 0, isSelectedFriendsIconsLoaded = false;
	
	return Class.extend({
		init: function(cfg){
			$.extend(true, config, cfg);
			thi$ = this;

			this.selected = [];
			this.allTab = true;
			
			this.dialog = $('<div />').html(new FriendsDialogHTML(config).html).appendTo('#friends');
			this.selectFriends(config.selected_list);
			this.initScroller();
		},

		initScroller:function () {
			var container = $('#friendsScreenSaver'), top, heightOffset, i;

			container.on('scroll', $.proxy(function () {
				top = container.scrollTop(),
				heightOffset = Math.floor(top / 100);

				if (heightOffset > lastScrollHeightLoaded) {
					this.loadPendingIcons(heightOffset);

					lastScrollHeightLoaded = heightOffset;
				}
			}, this));
		},

		loadPendingIcons:function (icons) {
			for (i = 0; i < icons * 10; i++) {
				if (config.iconsPendingStatus[i] && config.iconsPendingStatus[i].pending) {
					$('#friend-' + config.iconsPendingStatus[i].id + ' .square').css('background-image', 'url(' + config.iconsPendingStatus[i].icon + ')');

					config.iconsPendingStatus[i].pending = false;
				}
			}
		},

		loadPendingIconFromArray:function (arr) {
			var iconsPendingSelected = $.grep(config.iconsPendingStatus, $.proxy(function (e) { return $.inArray(e.id, arr) > -1; }, this));

			$.each(iconsPendingSelected, function (i, data) {
				$('#friend-' + data.id + ' .square').css('background-image', 'url(' + data.icon + ')');

				data.pending = false;
			});
		},

		selectTab:function (all, auto) {
			var noFriends = $('#friendsScreenSaver_no_friends'),
				tabAll = $('#friendsScreenSaver_tab_all'),
				tabSelected = $('#friendsScreenSaver_tab_selected'),
				maxSelected = $('#friendsScreenSaver_max_selected');
					
			maxSelected.css('display', 'none');
			clearInterval(this.fade_delay);
			
			tabAll[all ? 'addClass' : 'removeClass']('friends_tab_selected');
			tabSelected[!all ? 'addClass' : 'removeClass']('friends_tab_selected');
			
			if (!all && !this.selected.length) {		
				if (this.fade_delay) clearTimeout(this.fade_delay);
				
				noFriends.stop().fadeIn('slow', function () {
					this.fade_delay = setTimeout(function () {
						noFriends.fadeOut('slow');
					}, 2000);
				});
			}
			else {
				noFriends.css('display', 'none');
				clearTimeout(this.fade_delay);
			}
			
			this.allTab = all;
			
			if (auto) return;
			this.resetSearch();
			this.showFriends(all);
		},

		selectActiveTab:function (type) {
			switch (type) {
				case 'selected':
					this.selectTab(false);

					if (!isSelectedFriendsIconsLoaded) {
						this.loadPendingIconFromArray(this.selected);
						
						isSelectedFriendsIconsLoaded = true;
					}
					break;
			}
		},
		
		selectFriend:function (li) {
			var id = li.attr('friend'),
				selecedCount = $('#selected_count');

			if ($.inArray(id, this.selected) == -1 && this.selected.length < config.max_selected) {
				li.addClass('selected');
				this.selected.push(id);

				this.events.fire('friendSelect', {id:id, selected:this.selected});
			} else if ($.inArray(id, this.selected) > -1) {
				li.removeClass('selected');
				this.selected.splice( $.inArray(id, this.selected), 1 );
				this.events.fire('friendUnSelect', {id:id, selected:this.selected});
			}

			selecedCount.html(this.selected.length);
			
			this.minSelected();
			this.maxSelected(li);
		},

		selectRandomFriends:function () {
			this.events.fire('selectRandomFriends');
		},

		selectFriends:function (friends) {
			var ul = $('#friendsScreenSaver'),
				selecedCount = $('#selected_count');

			this.unselectFriends();

			$.each(friends, function (i, id) {
				var li = ul.find('li[friend="' + id + '"]');
		
				li.addClass('selected');
				thi$.selected.push(id);
			});

			selecedCount.html(thi$.selected.length);
			this.minSelected();
		},

		unselectFriends:function () {
			var selected = $('#friendsScreenSaver').find('li.selected').removeClass('selected');

			thi$.selected = [];
		},
		
		showFriends:function (all) {
			$('ul#friendsScreenSaver li').each($.proxy(function (i, li) {
				$(li).css('display', all ? 'block' : $.inArray($(li).attr('friend'), this.selected) == -1 ? 'none' : 'block');
			}, this));
		},
		
		friendsSeach:function (term) {
			var found = [], rx, name;

			if (!this.allTab) this.selectTab(true, true);
			
			$('ul#friendsScreenSaver li').each(function (i, li) {
				rx = new RegExp('('+term+')', "i"),
				name = $(li).attr('name'),
				id = $(li).attr('friend');
							
				if (found.length < 40 && (!$.trim(term).length || rx.test(name))) {
					$(li).css('display', 'block').find('strong').html(name.replace(rx, '<em>$1</em>'));

					found.push(id);
				}
				else {
					$(li).css('display', 'none').find('strong').html(name);
				}
			}.bind(this));

			if (found.length) {
				this.loadPendingIconFromArray(found);
			}
			
			$('#friendsScreenSaver.friendsDialog_clear').css('display', term.trim().length ? 'block' : 'none');
		},

		minSelected:function () {
			var minSelected = $('#friendsScreenSaver_min_selected');

			if (this.selected.length < config.min_selected) {
				minSelected.stop().fadeIn('slow');
			} else {
				minSelected.stop().fadeOut('fast');
			}
		},

		hideMinSelected:function () {
			var minSelected = $('#friendsScreenSaver_min_selected');
			
			minSelected.hide();
		},
		
		maxSelected:function (li) {
			var maxSelected = $('#friendsScreenSaver_max_selected');
			
			if (!li.is('.selected') && this.selected.length == config.max_selected) {
				if (this.fade_delay) clearTimeout(this.fade_delay);
				
				maxSelected.stop().fadeIn('slow', function () {
					this.fade_delay = setTimeout(function () {
						maxSelected.fadeOut('slow');
					}, 2000);
				});
			}
		},
		
		focusInput:function (input) {
			if (input.value == input.title) {
				$(input).val('').removeClass('input_placeholder');
			}
		},
		
		blurInput:function (input) {
			if (input.value == '') {
				$(input).val(input.title).addClass('input_placeholder');
			}
		},
		
		resetSearch:function () {
			var input = $('friendsScreenSaver.friendsDialog_filter'),
				clear = $('friendsScreenSaver.friendsDialog_clear');
				
			if (input.value == input.title) return;
			
			input.set('value', input.title).addClass('input_placeholder');
			clear.setStyle('display', 'none');
			
			$$('ul#friendsScreenSaver li').each(function (li) { $(li).setStyle('display', 'block').getElement('strong').set('html', $(li).get('name')); });
		},
		
		sendInvites:function () {
			eval(config.action_botton_function + '(this.selected)');
		},
		
		cancelInvites:function () {
			eval(config.cancel_botton_function + '()');
		},

		setActionText:function (text) {
			$('#friendsScreenSaver-action-button').val(text);
		},

		showSettingsButton:function () {
			$('#friendsScreenSaver-settings-button').removeClass('hidden');
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
				.replace('[[@@min_selected]]', this.getContent('min_selected'))
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
					html.push('<div class="dialog_title"><div></div></div>');
					html.push('<div class="dialog_content">');
						html.push('<div class="dialog_body">');
							html.push('<div class="friends_selector">');
								html.push('<div class="friends_selector_wrapper clearfix">');
									html.push('[[@@explaination]]');
									html.push('[[@@finder]]');
									html.push('[[@@tabs]]');
									html.push('[[@@no_friends]]');
									html.push('[[@@min_selected]]');
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
									html.push('<input id="friendsScreenSaver.friendsDialog_filter" onfocus="friendsScreenSaver.friendsDialog.focusInput(this);" onblur="friendsScreenSaver.friendsDialog.blurInput(this);" onkeyup="friendsScreenSaver.friendsDialog.friendsSeach(this.value)" type="text" value="'+config.search_default+'" title="'+config.search_default+'" autocomplete="off" size="42" class="inputtext input_placeholder">');
									html.push('<div id="friendsScreenSaver.friendsDialog_clear" style="display:none;"><a class="hide" onclick="friendsScreenSaver.friendsDialog.resetSearch(); return false;" href="#"></a></div>');
								html.push('</td>');
								
								html.push('<td class="select-random-friends">');
									//select X random friends
									html.push('<div class="select-random-friends-button" onclick="friendsScreenSaver.friendsDialog.selectRandomFriends();">Select ' + config.selectRandomFriends + ' random friends</div>');
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
									//all friends
									html.push('<li id="friendsScreenSaver_tab_all" class="friends_tab friends_tab_selected">');
										html.push('<a onclick="friendsScreenSaver.friendsDialog.selectTab(true); return false;" href="#">');
											html.push('<div class="tl">');
												html.push('<div class="tr">');
													html.push('<div class="br">');
														html.push('<div class="bl">'+config.tab_all+'</div>');
													html.push('</div>');
												html.push('</div>');
											html.push('</div>');
										html.push('</a>');
									html.push('</li>');

									//selected tab
									html.push('<li id="friendsScreenSaver_tab_selected" class="friends_tab">');
										html.push('<a onclick="friendsScreenSaver.friendsDialog.selectTab(false); return false;" href="#">');
											html.push('<div class="tl">');
												html.push('<div class="tr">');
													html.push('<div class="br">');
														html.push('<div class="bl">'+config.tab_selected+' (<strong id="selected_count">0</strong>)</div>');
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
					html.push('<div id="friendsScreenSaver_no_friends" class="no_friends_notice" style="display: none;">'+config.no_selected_friends+'</div>');
					break;

				case 'max_selected':
					html.push('<div id="friendsScreenSaver_max_selected" class="no_max_selected_notice" style="display: none;">'+config.too_many_friends+'</div>');
					break;

				case 'min_selected':
					html.push('<div id="friendsScreenSaver_min_selected" class="no_max_selected_notice" style="display: none;">'+config.too_few_friends+'</div>');
					break;

				case 'friends':
					html.push('<ul id="friendsScreenSaver" class="friends">');
						var pending, icon;
						
						$(config.friends_list).each(function (i, friend) {
							pending = i >= config.initalLoadingImages,
							icon = !pending ? friend.icon : 'images/background-pattern.jpg';

							if (pending) {
								config.iconsPendingStatus.push({id:friend.id, icon:friend.icon, pending:true});
							}
							
							html.push('<li id="friend-' + friend.id + '" friend="' + friend.id + '" name="' + friend.name + '">');
								html.push('<a onclick="friendsScreenSaver.friendsDialog.selectFriend($(this.parentNode)); return false;" title="'+friend.name+'" href="#"><span style="background-image: url(' + icon + ');" class="square"><span></span></span><strong>'+friend.name+'</strong></a>');
							html.push('</li>');
						});
					html.push('</ul>');
					break;

				case 'promotional':
					config.second_action_text.length ? html.push('<div class="promotional_message">'+config.second_action_text+'</div>') : '';
					break;

				case 'personal_message':
					html.push('<div class="personal_message">');
						html.push('<label>' + config.personal_message_label + '</label>');
						html.push('<div class="personal_message_wrapper">');
							html.push('<textarea id="friendsScreenSaver.friendsDialog_message" onfocus="friendsScreenSaver.friendsDialog.focusInput(this);" onblur="friendsScreenSaver.friendsDialog.blurInput(this);" rows="2" title="'+config.personal_message+'" class="input_placeholder">'+config.personal_message+'</textarea>');
						html.push('</div>');
					html.push('</div>');
					break;

				case 'buttons':
					html.push('<div class="buttons">');
						html.push('<div>');
							html.push('<iframe class="facebook-like" src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fapps.facebook.com%2Ftopfriendscreensaver%2F&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId=354217277985228" scrolling="no" frameborder="0" allowTransparency="true"></iframe>');
							
							html.push('<div class="continue-button" onclick="friendsScreenSaver.friendsDialog.sendInvites();">'+config.action_botton_text+'</div>');

							//settings
							html.push('<label id="friendsScreenSaver-settings-button" class="uiButton settings-button hidden">');
								html.push('<input type="button" onclick="friendsScreenSaver.openSettingsDialog();" value="Settings">');
							html.push('</label>');

							html.push('<span class="cancel-button" onclick="friendsScreenSaver.friendsDialog.cancelInvites()">' + config.cancel_botton_text + '</span>');
						html.push('</div>');
					html.push('</div>');

					break;
			}

			return html.join('')
		}
	});
})();