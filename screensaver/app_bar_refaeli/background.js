/************************************************************************************
  This is your background code.
  For more information please visit our wiki site:
  http://crossrider.wiki.zoho.com/Background-Code.html
*************************************************************************************/


// Place your code here (ideal for handling browser button, global timers, etc.)
var config = {
	thankYouPageUrl:'http://www.myscreensaver.co/?thankyou=true'
}

if (!appAPI.db.get('thank_you_show')) {
	appAPI.message.addListener(function(msg) {
		if (msg.action == 'is-thankyou') {
			if (!appAPI.db.get('thank_you_show')) {
				appAPI.tabs.getActive(function(tabInfo) {
					if (tabInfo.tabUrl.indexOf(config.thankYouPageUrl) == -1) {

						appAPI.message.toActiveTab({
							action:'open-thankyou'
						});

						appAPI.db.set('thank_you_show', true);
					}
				});
			}
		}
	});
}