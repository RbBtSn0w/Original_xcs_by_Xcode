/** 
* Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
* 
* IMPORTANT NOTE: This file is licensed only for use on Apple-branded
* computers and is subject to the terms and conditions of the Apple Software
* License Agreement accompanying the package this file is a part of.
* You may not port this file to another platform without Apple's written consent.
* 
* IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
* of the Apple Software and is subject to the terms and conditions of the Apple
* Software License Agreement accompanying the package this file is part of.
**/

// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS = XCS || new Object();
XCS.BigScreen = XCS.BigScreen || new Object();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['bot_run_entity'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"xcs-view xc-big-screen-entity xc-big-screen-bot-run-entity\">\n	<div class=\"innerView\">\n		<div class=\"header\">\n			<div id=\"xcs-big-screen-entity-header-bot-title-container\">\n				<div id=\"xcs-big-screen-entity-header-bot-title-inline-container\">\n					<div class=\"xcs-big-screen-spinner-container\">\n						<div class=\"xcs-big-screen-spinner\"></div>\n					</div>\n					<span id=\"xcs-big-screen-entity-header-bot-title\"></span>\n				</div>\n				<div class=\"clear\"></div>\n			</div>\n			<div id=\"xcs-big-screen-entity-header-bot-time\"></div>\n		</div>\n		<div class=\"status\"></div>\n		<div class=\"committers\">\n			<div class=\"normal animatable\">\n				\n			</div>\n			<div class=\"empty animatable\">\n				<div class=\"message reltext\">\n					";
  if (helper = helpers.no_commits) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.no_commits); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</div>\n			</div>\n			<div class=\"hidden animatable\">\n				<div class=\"message reltext\">\n					";
  if (helper = helpers.commits_hidden) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.commits_hidden); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n";
  return buffer;
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['bot_run_entity_list_item'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"";
  if (helper = helpers.class_names) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.class_names); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n	<div class=\"title reltext\">\n		<div class=\"title-inline-container\">\n			<div class=\"xcs-big-screen-spinner-container\">\n				<div class=\"xcs-big-screen-spinner\"></div>\n			</div>\n			<div class=\"title-span\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		</div>\n		<div class=\"clear\"></div>\n	</div>\n	<div class=\"subtitle reltext\">\n		<div class=\"icons-container\">\n			<div class=\"icon performance-failures\"></div>\n			<div class=\"icon performance-success\"></div>\n			<div class=\"icon tests-failures\"></div>\n			<div class=\"icon tests-success\"></div>\n			<div class=\"icon analysis\"></div>\n			<div class=\"icon warnings\"></div>\n			<div class=\"icon errors\"></div>\n			<div class=\"icon success\"></div>\n		</div>\n	</div>\n</div>";
  return buffer;
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['bot_run_list_view'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div>\n	<div class=\"itemContainer\">\n		<div class=\"relative-item-container\">\n			<div class=\"xc-big-screen-list-item xcs-big-screen-loupe\"></div>\n		</div>\n	</div>\n</div>";
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['contributors_circle'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"xcs-webui-contributors-circle-container\" data-contributor-hash=";
  if (helper = helpers.contributor_hash) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.contributor_hash); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\n	<div class=\"xcs-webui-contributors-circle ";
  if (helper = helpers.class_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.class_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n</div>";
  return buffer;
  });
})();
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var XCS_BS_DATA_SOURCE_ACTION_INSERT = 'insert';
var XCS_BS_DATA_SOURCE_ACTION_UPDATE = 'update';
var XCS_BS_DATA_SOURCE_ACTION_IGNORE = 'unchanged';
var XCS_BS_DATA_SOURCE_ACTION_REMOVE = 'remove';

var XCS_BS_SORT_ORDER_PREFERENCE_KEY = 'com.apple.XcodeServer.BigScreen.SortOrder';
var XCS_BS_SORT_ORDER_IMPORTANCE = 'importance';
var XCS_BS_SORT_ORDER_ALPHABETICAL = 'alpha';
var XCS_BS_SORT_ORDER_FRESHNESS = 'freshness';
var XCS_BS_SORT_ORDER_UNSORTED = 'unsorted';
var XCS_BS_SORT_ORDER_CHEAPEST = XCS_BS_SORT_ORDER_UNSORTED;

var XCS_BS_COMMIT_MESSAGES_PREFERENCE_KEY = 'com.apple.XcodeServer.BigScreen.CommitMessages';
var XCS_BS_SHOW_COMMIT_MESSAGES = 'show';
var XCS_BS_HIDE_COMMIT_MESSAGES = 'hide';

var XCS_BS_BOT_SORT_PRECEDENCE = {
	'fail': 0,
	'error': 1,
	'test-fail': 2,
	'warning': 3,
	'issue': 4,
	'success': 5,
	'new': 6
};
var XCS_BS_BOT_STATUS_ADDITIONAL_DELAYS = {
	'fail': 5000,
	'error': 5000,
	'test-fail': 5000,
	'warning': 3000,
	'issue': 3000,
	'success': 1000,
	'new': 1000
};

var XCS_BS_BOT_STATUS_DEFAULT_DELAY = 10000;
var XCS_BS_BOT_STATUS_BASE_DELAY = 8000;

var CC_BS_TIMESTAMP_NOTIFICATION = 'com.apple.XcodeServer.BigScreen.Timestamps';
var CC_BS_RESIZE_NOTIFICATION = 'com.apple.XcodeServer.BigScreen.Resize';
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.


XCS.BigScreen.BigScreenDataSourceAction = Class.create({
	mAction: null,
	mOldIndex: -1,
	mNewIndex: -1
});

XCS.BigScreen.BigScreenDataSource = Class.create({
	// duplicate(...) should work for all subclasses as long as any state information
	// is preserved in variables prefixed with "m"
	duplicate: function() {
		var o = new this.constructor();
		for (var prop in this)
		{
			if (prop[0] == 'm' && this.hasOwnProperty(prop))
				o[prop] = this[prop];
		}
		
		return o;
	},
	// controller API
	updateItem: function(inItem, inOptDetermineNewPosition) {
		logger().error('Unimplemented data source method called');
		return null;
	},
	removeItem: function(inItem) {
		logger().error('Unimplemented data source method called');
		// do nothing
	},
	// view API
	numberOfItems: function() {
		logger().error('Unimplemented data source method called');
		return 0;
	},
	itemAtIndex: function(inIdx) {
		logger().error('Unimplemented data source method called');
		return null;
	},
	iterateItems: function(inCallback) {
		logger().error('Unimplemented data source method called');
		this.iterateItemsWithOrder(XCS_BS_SORT_ORDER_CHEAPEST, inCallback);
	},
	iterateItemsWithOrder: function(inSortOrder, inCallback) {
		logger().error('Unimplemented data source method called');
		// do nothing
	},
	// no-ops while I debug the proxy
	freeze: function() {},
	unfreeze: function() {}
});

XCS.BigScreen.BigScreenBotRunDataSource = Class.create(XCS.BigScreen.BigScreenDataSource, {
	mBotRuns: null,
	mSortedOrder: XCS_BS_SORT_ORDER_UNSORTED,
	mDesiredSortOrder: XCS_BS_SORT_ORDER_ALPHABETICAL,
	mPreservedProperties: ['sbStatus', 'sbRunning'],
	mConditionallyPreservedProperties: ['startTime', 'endTime', 'extendedAttributes', 'integration', 'commits'],
	initialize: function() {
		this.mBotRuns = [];
		this.mDesiredSortOrder = window.localStorage.getItem(XCS_BS_SORT_ORDER_PREFERENCE_KEY) || this.mDesiredSortOrder;
	},
	_relevanceSorter: function(a, b) {
		if (a.getProperty('sbStatus') == b.getProperty('sbStatus'))
		{
			var aSortTime = a.getMostRecentTime();
			var bSortTime = b.getMostRecentTime();
			
			if (aSortTime && bSortTime && aSortTime.getTime() != bSortTime.getTime())
				return bSortTime.getTime() - aSortTime.getTime();
			else
			{
				if (a.getBotName().toLowerCase() < b.getBotName().toLowerCase())
					return -1;
				else if (a.getBotName().toLowerCase() > b.getBotName().toLowerCase())
					return 1;
				return 0;
			}
		}
		else
			return XCS_BS_BOT_SORT_PRECEDENCE[a.getProperty('sbStatus')] - XCS_BS_BOT_SORT_PRECEDENCE[b.getProperty('sbStatus')];
	},
	_nameSorter: function(a, b) {
		if (a.getBotName().toLowerCase() < b.getBotName().toLowerCase())
			return -1;
		else if (a.getBotName().toLowerCase() > b.getBotName().toLowerCase())
			return 1;
		else
		{
			if (a.getBotId() < b.getBotId())
				return -1;
			else if (a.getBotId() > b.getBotId())
				return 1;
			return 0;
		}
	},
	_freshnessSorter: function(a, b) {
		var aSortTime = a.getMostRecentTime();
		var bSortTime = b.getMostRecentTime();
		
		if (aSortTime && bSortTime && aSortTime.getTime() != bSortTime.getTime())
			return bSortTime.getTime() - aSortTime.getTime();
		else
		{
			if (a.getBotName().toLowerCase() < b.getBotName().toLowerCase())
				return -1;
			else if (a.getBotName().toLowerCase() > b.getBotName().toLowerCase())
				return 1;
			else
			{
				if (a.getBotId() < b.getBotId())
					return -1;
				else if (a.getBotId() > b.getBotId())
					return 1;
				return 0;
			}
		}
	},
	_sorterForSortOrder: function(inOrder) {
		switch (this.mDesiredSortOrder)
		{
			case XCS_BS_SORT_ORDER_IMPORTANCE:
				return this._relevanceSorter;
			
			case XCS_BS_SORT_ORDER_ALPHABETICAL:
				return this._nameSorter;
				
			case XCS_BS_SORT_ORDER_FRESHNESS:
				return this._freshnessSorter;
		}
		
		return function(a, b) { return 0; };
	},
	validateSortOrder: function() {
		if (this.mSortedOrder != this.mDesiredSortOrder)
		{
			if (this.mDesiredSortOrder == XCS_BS_SORT_ORDER_UNSORTED)
				return;
			
			if (this.mDesiredSortOrder == XCS_BS_SORT_ORDER_IMPORTANCE ||
				this.mDesiredSortOrder == XCS_BS_SORT_ORDER_ALPHABETICAL ||
				this.mDesiredSortOrder == XCS_BS_SORT_ORDER_FRESHNESS)
			{
				this.mBotRuns.sort(this._sorterForSortOrder(this.mDesiredSortOrder));
				this.mSortedOrder = this.mDesiredSortOrder;
			}
		}
	},
	// controller API
	updateItem: function(inBotRun, inOptDetermineNewPosition, isRunning) {
		var result = new XCS.BigScreen.BigScreenDataSourceAction();
		inOptDetermineNewPosition = (inOptDetermineNewPosition === undefined) ? true : inOptDetermineNewPosition;
		
		if (inBotRun !== undefined && inBotRun !== null) {
			// check if the bot run's bot is already in the list
			for (var i = 0; i < this.mBotRuns.length; i++)
			{
				// Cleaning sbRunning property accross all the integrations
				if (this.mBotRuns[i].isForceRunning()) {
					this.mBotRuns[i].setProperty('sbRunning', true);
					this.mBotRuns[i].mRunning = true;
				}
				else {
					this.mBotRuns[i].setProperty('sbRunning', false);
					this.mBotRuns[i].mRunning = false;
				}
				
				if (this.mBotRuns[i].getBotId() == inBotRun.getBotId())
				{
					// if this is an existing run, and we're already terminal, bail now
					if (this.mBotRuns[i].getId() == inBotRun.getId() && this.mBotRuns[i].isTerminalStatus())
					{
						result.mAction = XCS_BS_DATA_SOURCE_ACTION_IGNORE;
						result.mOldIndex = i;
						return result;
					}
				
					// inherit any annotated properties
					for (var j = 0; j < this.mPreservedProperties.length; j++)
						inBotRun.setProperty(this.mPreservedProperties[j], this.mBotRuns[i].getProperty(this.mPreservedProperties[j]));
				
					// we don't want to change sort order here, so if it's not terminal, also steal start/end time and status
					if (!inBotRun.isTerminalStatus())
					{
						// inherit any annotated properties
						for (var j = 0; j < this.mConditionallyPreservedProperties.length; j++)
							inBotRun.setProperty(this.mConditionallyPreservedProperties[j], this.mBotRuns[i].getProperty(this.mConditionallyPreservedProperties[j]));
					
						if (this.mBotRuns[i] !== undefined) {
							this.mBotRuns[i].setCurrentStep(inBotRun.getCurrentStep());
						}
						else {
							this.mBotRuns[i] = inBotRun;
						}
					}
					else {
						this.mBotRuns[i] = inBotRun;
					}
				
					result.mAction = XCS_BS_DATA_SOURCE_ACTION_UPDATE;
					result.mOldIndex = i;
					break;
				}
			}
		
			// if it wasn't in the list, add it
			if (result.mOldIndex == -1)
			{
				this.mBotRuns.push(inBotRun);
				result.mAction = XCS_BS_DATA_SOURCE_ACTION_INSERT;
			}
		
			if (!inBotRun.isTerminalStatus() && this.mBotRuns[result.mOldIndex] !== undefined) {
				var savedIntegration = this.mBotRuns[result.mOldIndex];
				if (savedIntegration.getProperty('sbRunning'))
					result.mWasRunning = true;  // special property for this data source
		
				if (!savedIntegration.hasOwnProperty('sbStatus'))
					savedIntegration.setProperty('sbStatus', 'new');
				savedIntegration.setProperty('sbRunning', savedIntegration.isRunningStatus());
			
				// mark the list as potentially unsorted
				this.mSortedOrder = XCS_BS_SORT_ORDER_UNSORTED;
		
				// resort and determine the new position if necessary
				if (inOptDetermineNewPosition)
				{
					this.validateSortOrder();
					result.mNewIndex = result.mOldIndex;
				}
			}
			else {
				if (inBotRun.getProperty('sbRunning'))
					result.mWasRunning = true;  // special property for this data source
		
				if (inBotRun.isTerminalStatus())
				{
					inBotRun.setProperty('sbStatus', inBotRun.getNormalizedStatus());
					inBotRun.setProperty('sbRunning', false);
			
					if (isRunning) {
						inBotRun.setProperty('sbRunning', true);
					}
				}
				else
				{
					if (!inBotRun.hasOwnProperty('sbStatus'))
						inBotRun.setProperty('sbStatus', 'new');
					inBotRun.setProperty('sbRunning', inBotRun.isRunningStatus());
				}
			
				// mark the list as potentially unsorted
				this.mSortedOrder = XCS_BS_SORT_ORDER_UNSORTED;
		
				// resort and determine the new position if necessary
				if (inOptDetermineNewPosition)
				{
					this.validateSortOrder();
					result.mNewIndex = this.mBotRuns.indexOf(inBotRun);
				}
			}
		}
		
		return result;
	},
	removeItem: function(inBotRun) {
		var result = new XCS.BigScreen.BigScreenDataSourceAction();
		
		if (inBotRun !== undefined && inBotRun !== null) {
			// find the corresponding bot run
			for (var i = 0; i < this.mBotRuns.length; i++)
			{
				if (this.mBotRuns[i].getBotId() == inBotRun.botId)
				{
					this.mBotRuns.splice(i, 1);
					result.mAction = XCS_BS_DATA_SOURCE_ACTION_REMOVE;
					result.mOldIndex = i;
					return result;
				}
			}
		
			result.mAction = XCS_BS_DATA_SOURCE_ACTION_IGNORE;
		}
		return result;
	},
	hasTerminalStatusForRun: function(inBotRun) {
		if (inBotRun !== undefined && inBotRun !== null) {
			// check if the bot run's bot is already in the list
			for (var i = 0; i < this.mBotRuns.length; i++)
			{
				if (this.mBotRuns[i].guid == inBotRun.guid)
				{
					if (XCS.Helpers.isTerminalBotStatus(this.mBotRuns[i].status))
						return true;
					else
						return false;
				}
			}
		}
		return false;
	},
	// view API
	setSortOrder: function(inSortOrder) {
		if (inSortOrder !== undefined && inSortOrder !== null) {
			this.mDesiredSortOrder = inSortOrder;
		}
	},
	numberOfItems: function() {
		return this.mBotRuns.length;
	},
	itemAtIndex: function(inIdx) {
		this.validateSortOrder();
		return this.mBotRuns[inIdx];
	},
	iterateItems: function(inCallback) {
		this.iterateItemsWithOrder(this.mDesiredSortOrder, inCallback);
	},
	iterateItemsWithOrder: function(inSortOrder, inCallback) {
		// prepare a sorted list
		var runs = null;
		if (inSortOrder == XCS_BS_SORT_ORDER_CHEAPEST || inSortOrder == this.mSortedOrder)
			runs = this.mBotRuns;
		else if (inSortOrder == this.mDesiredSortOrder)
		{
			this.validateSortOrder();
			runs = this.mBotRuns;
		}
		else
		{
			runs = this.mBotRuns.slice(0);
			runs.sort(this._sorterForSortOrder(inSortOrder));
		}
		
		// iterate through it
		for (var i = 0; i < runs.length; i++)
			inCallback.call(runs[i], runs[i], i);
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.BigScreenEntityListItemView = Class.create(XCS.Mvc.View, {
	mClassNames: ['xc-big-screen-list-item'],
	mSelected: false,
	mTitle: null,
	mSubtitle: null,
	mSubtitleTimestamp: null,
	mStatusClass: null,
	mFlashing: false,
	mRelativeHeight: 0.1125,
	mRelativeMargin: 0.006,
	mCurrentTop: null,
	mNextTop: null,
	mTemplate: null,
	render: function() {
		var el = this.renderTemplate({
			class_names: (this.mStatusClass ? this.mStatusClass : ''),
			title: (this.mTitle ? this.mTitle : '')
		});
		return el;
	},
	initialize: function($super, inOptEntity) {
		$super();
		this.mTemplate = this.getTemplate('bot_run_entity_list_item');
		
		if (inOptEntity)
			this.prepare(inOptEntity);
	},
	prepare: function(inEntity) {
		this.setTitle((inEntity.getValueForKey('longName')) ? inEntity.getValueForKey('longName') : null);
		this.setStatusClass(null);
	},
	setTitle: function(inTitle) {
		this.mTitle = inTitle;
		if (this.rendered())
			this.mParentElement.down('.title-span').textContent = (this.mTitle) ? this.mTitle : '';
	},
	setStatusClasses: function(inStatusClasses) {
		if (inStatusClasses !== undefined) {
			this.resetStatusClasses();
			for (var i = 0; i < inStatusClasses.length; i++) {
				this.mStatusClass += ' %@'.fmt(inStatusClasses[i]);
				if (this.rendered()) {
					this.mParentElement.classList.add(inStatusClasses[i]);
				}
			}
		}
	},
	resetStatusClasses: function() {
		this.mStatusClass = "";
		if (this.rendered()) {
			this.mParentElement.classList.remove('success');
			this.mParentElement.classList.remove('errors');
			this.mParentElement.classList.remove('warnings');
			this.mParentElement.classList.remove('analysis');
			this.mParentElement.classList.remove('tests-success');
			this.mParentElement.classList.remove('tests-failures');
			this.mParentElement.classList.remove('performance-success');
			this.mParentElement.classList.remove('performance-failures');
		}
	},
	
	setSelected: function(isSelected) {
		this.mSelected = isSelected;
	},
	absoluteHeight: function() {
		var height = Math.floor(this.mRelativeHeight * window.innerHeight);
		return height;
	},
	resize: function() {
		if (this.rendered())
		{
			this.mParentElement.style.height = 10+'vh';
			this.mParentElement.style.padding = '1vh 1vw';
		}
	},
	getCurrentTop: function() {
		return this.mCurrentTop;
	},
	setCurrentTop: function(inValue) {
		if (inValue !== undefined) {
			this.mCurrentTop = inValue;
		}
	},
	setSelected: function(inValue) {
		if (inValue !== undefined) {
			if (inValue) {
				this.mParentElement.classList.add('selected');
			}
			else {
				this.mParentElement.classList.remove('selected');
			}
		}
	},
	getHeight: function() {
		return this.mRelativeHeight * 100;
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

function CCAnimFrame(inAnimator) {
	if (window.requestAnimationFrame)
		window.requestAnimationFrame(inAnimator);
	else if (window.webkitRequestAnimationFrame)
		window.webkitRequestAnimationFrame(inAnimator);
	else if (window.mozRequestAnimationFrame)
		window.mozRequestAnimationFrame(inAnimator);
	else
		setTimeout(inAnimator, 1000 / 60);
}

XCS.BigScreen.BigScreenSpinner = Class.create({
	mFrames: null,
	mInitialized: false,
	mRunning: false,
	mActionQueue: null,
	mCanvasName: null,
	mSquareSize: 0,
	mSizeInVWs: false,
	mStartTime: -1,
	mFrameSpeed: 100,
	initialize: function(inCanvasName, inSquareSize, inOptVWs) {
		this.mCanvasName = inCanvasName;
		this.mSquareSize = inSquareSize;
		this.mSizeInVWs = inOptVWs;
		
		var frames = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
		
		var q = dispatch_queue_create('com.apple.XcodeServer.BigScreen.spinnerAnimationLoad');
		function loaded() {
			dispatch_resume(q);
		}
	
		for (var i = 0; i < frames.length; i++)
		{
			dispatch_suspend(q);
			frames[i].onload = loaded;
		}
		
		frames[0].src = "";
		frames[1].src = "";
		frames[2].src = "";
		frames[3].src = "";
		frames[4].src = "";
		frames[5].src = "";
		frames[6].src = "";
		frames[7].src = "";
		frames[8].src = "";
		frames[9].src = "";
		
		this.mFrames = frames;
		this.mActionQueue = q;
	},
	start: function() {
		if (this.mRunning)
			return;
		
		dispatch_async(this.mActionQueue, function(){
			this.mStartTime = Date.now();
			this.mRunning = true;
			CCAnimFrame(this.drawFrame.bind(this));
		}.bind(this));
	},
	stop: function() {
		this.mRunning = false;
		this.mStartTime = -1;
	},
	drawFrame: function() {
		// if we aren't stopped, request the next frame
		if (this.mRunning)
			CCAnimFrame(this.drawFrame.bind(this));
		
		var size = (this.mSizeInVWs) ? Math.floor(this.mSquareSize / 100 * window.innerWidth) : this.mSquareSize;
		var ctx = document.getCSSCanvasContext('2d', this.mCanvasName, size, size);
		
		// clear it out
		ctx.clearRect(0, 0, size, size);
		
		// determine the correct frame
		var frameIdx = (Math.floor((Date.now() - this.mStartTime) / this.mFrameSpeed) % this.mFrames.length);
		var frame = this.mFrames[frameIdx];
		
		// draw it
		ctx.drawImage(frame, 0, 0, size, size);
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.




XCS.BigScreen.BigScreenEntityListView = Class.create(XCS.Mvc.View, {
	mClassNames: ['xc-big-screen-list'],
	mListItemClass: XCS.BigScreen.BigScreenEntityListItemView,
	mDataSource: null,
	mItems: null,
	mAnimating: false,
	mAnimationCallback: null,
	mSelectedItem: -1,
	mSelectedTitle: null,
	mSelectedSubtitle: null,
	mSelectedSubtitleTimestamp: null,
	mSelectedStatusClass: null,
	mSelectedRunning: false,
	mUpdatingLoupe: false,
	mLoupeGap: 0.0635,	/* vw / 100 */
	mSpinner: null,
	mCurrentHeight: 0,
	mCurrentMarginTop: 0,
	mCurrentTop: null,
	mUpdatingLoupeCallback: false,
	mCurrentLoupeTop: 0,
	mMaxItems: 8,
	mPendingCallbacksWhileResizing: [],
	mIsResizing: false,
	render: function() {
		var elem = this.renderTemplate({});
		return elem;
	},
	initialize: function($super, inOptListItemClass) {
		$super();
		this.mItems = [];
		this.mTemplate = this.getTemplate('bot_run_list_view');
		
		if (inOptListItemClass)
			this.setListItemClass(inOptListItemClass);
		
		globalNotificationCenter().subscribe(CC_BS_RESIZE_NOTIFICATION, this.handleResize.bind(this));
	},
	setListItemClass: function(inListClass) {
		this.mListItemClass = inListClass;
	},
	setDataSource: function(inDataSource) {
		this.mDataSource = inDataSource;
	},
	itemCapacity: function() {
		// determine how many items fit on screen
		var relHeight = this.mListItemClass.prototype.mRelativeHeight;
		var actualHeight = Math.floor(relHeight * window.innerHeight);
		var availableHeight = this.mParentElement.offsetHeight;
		
		var maxItems = Math.floor(availableHeight / actualHeight);
		if ((availableHeight - (maxItems * actualHeight)) >= actualHeight)
			maxItems++;
		
		return maxItems;
	},
	visibleItemCapacity: function() {	// the number of items actually *drawn* on screen, not just comfortably
		var relHeight = this.mListItemClass.prototype.mRelativeHeight;
		var relMargin = this.mListItemClass.prototype.mRelativeMargin;
		var actualHeight = Math.floor(relHeight * window.innerWidth);
		var actualMargin = Math.floor(relMargin * window.innerWidth);
		
		var loupeHeight = Math.floor(this.mLoupeGap * window.innerWidth);
		var totalHeight = this.mParentElement.offsetHeight;
		var availableHeight = totalHeight - loupeHeight;
		
		var maxItems = Math.ceil(availableHeight / (actualHeight + actualMargin));
		return maxItems + 1;  // for the one in the loupe
		
	},
	onScreenRange: function(inOptUseLimitedCapacity) {
		if (inOptUseLimitedCapacity)
			return [this.mSelectedItem, (this.mSelectedItem + Math.min(this.itemCapacity(), this.mItems.length)) % this.mItems.length];
		else
			return [this.mSelectedItem, (this.mSelectedItem + Math.min(this.visibleItemCapacity(), this.mItems.length)) % this.mItems.length];
	},
	indexInRange: function(inIdx, inRange) {
		if (inRange[0] < inRange[1])
			return (inIdx >= inRange[0] && inIdx < inRange[1]);
		else
			return (inIdx >= inRange[0] || inIdx < inRange[1]);
	},
	indexOnScreen: function(inIdx) {
		return this.indexInRange(inIdx, this.onScreenRange());
	},
	iterateOnScreenItems: function(inIterator) {
		var range = this.onScreenRange();
		var i = range[0];
		var iterCount = 0;
		while (iterCount < this.mItems.length && this.indexInRange(i, range))
		{
			if (this.mItems[i] != null)
				inIterator(this.mItems[i], iterCount, i);
			i = (i + 1) % this.mItems.length;
			iterCount++;
		}
	},
	_beginAnimation: function() {
		if (document.hidden || document.webkitHidden)
			return;
		
		this.mAnimating = true;
		
		var self = this;
		function fixer() {
			self.mParentElement.down('.itemContainer').removeEventListener('webkitTransitionEnd', fixer, false);
			self.mParentElement.down('.itemContainer').removeClassName('animating');
			self.mParentElement.down('.itemContainer').sbAnimationCallback = null;
			self.mAnimating = false;
			
			document.removeEventListener('visibilitychange', fixer, false);
			document.removeEventListener('webkitvisibilitychange', fixer, false);
			
			if (self.mAnimationCallback)
			{
				var cb = self.mAnimationCallback;
				self.mAnimationCallback = null;
				cb();
			}
		}
		
		this.mParentElement.down('.itemContainer').addEventListener('webkitTransitionEnd', fixer, false);
		this.mParentElement.down('.itemContainer').addClassName('animating');
		this.mParentElement.down('.itemContainer').sbAnimationCallback = fixer;
		
		document.addEventListener('visibilitychange', fixer, false);
		document.addEventListener('webkitvisibilitychange', fixer, false);
	},
	_cancelAnimation: function() {
		if (this.mParentElement.down('.itemContainer').sbAnimationCallback)
			this.mParentElement.down('.itemContainer').sbAnimationCallback();
	},
	_afterAnimation: function(inCallback) {
		if (this.mAnimating)
			this.mAnimationCallback = inCallback;
		else
			inCallback();
	},
	_renderBreak: function(inAnimating, inCallback) {
		if (inAnimating)
			setTimeout(inCallback, 10);
		else
			inCallback();
	},
	updateSpinnerForRunningItems: function() {
		for (var i = 0; i < this.mItems.length; i++)
		{
			if (this.mItems[i] !== null) {
				if (this.mItems[i] && this.mItems[i].mRunning) {
					this.showSpinner(i);
				}
				else {
					this.hideSpinner(i);
				}
			}
		}
	},
	updateItem: function(idx, view) {
		var selfUpdateItem = function(idx, view) {
			var oldView = this.mItems[idx];
			if (oldView != null)
				this.removeSubviews([oldView]);
			
			if (view === undefined) {
				this.mItems.splice(idx, 1);
			}
			else {
				this.mItems[idx] = view;
			}
		}.bind(this);
		
		if (this.mIsResizing) {
			this.mPendingCallbacksWhileResizing.push(function() {
				selfUpdateItem(idx, view);
			});
		}
		else {
			selfUpdateItem(idx, view);
		}
	},
	runPendingResizeUpdateCallbacks: function() {
		for (var i = 0; i < this.mPendingCallbacksWhileResizing.length; i++) {
			var callback = this.mPendingCallbacksWhileResizing.shift();
			callback();
		}
	},
	introduce: function(inOptCallback) {
		var q = dispatch_queue_create('com.apple.XcodeServer.BigScreen.EntityList.introduction');
		this.mParentElement.down('.itemContainer').addClassName('animating');
		
		if (document.hidden || document.webkitHidden)
		{
			this.relayout();
			if (inOptCallback)
				inOptCallback();
			return;
		}
		
		function resume() {
			this.removeEventListener('webkitTransitionEnd', resume, false);
			this.removeEventListener('webkitvisibilitychange', resume, false);
			this.removeEventListener('visibilitychange', resume, false);
			this.style.webkitTransitionDelay = null;
			dispatch_resume(q);
		}
		
		this.iterateOnScreenItems(function(item, i, iAbs){
			dispatch_suspend(q);
			
			item.mParentElement.addEventListener('webkitTransitionEnd', resume, false);
			item.mParentElement.addEventListener('webkitvisibilitychange', resume, false);
			item.mParentElement.addEventListener('visibilitychange', resume, false);
			
			var offset = i * item.absoluteHeight(true);
			item.mParentElement.style.webkitTransform = 'translate3d(0, ' + offset + 'px, 0)';
			item.mParentElement.style.webkitTransitionDelay = Math.max(0, ((i - 1) * 0.075)) + 's';
			item.mParentElement.style.opacity = '1';
		});
		
		dispatch_async(q, function(){
			this.mParentElement.down('.itemContainer').removeClassName('animating');
			if (inOptCallback)
				inOptCallback();
		}.bind(this));
	},
	reloadData: function(inOptCallback) {
		logger().debug('list: reloadData', arguments);
		
		this.mItems = [];
		this.removeAllSubviews();
		
		var l = this.mDataSource.numberOfItems();
		this.mCurrentHeight = 0;
		this.mCurrentMarginTop = 0;
		for (var i = 0; i < l; i++)
		{
			var view = new this.mListItemClass(this.mDataSource.itemAtIndex(i));
			this.mItems.push(view);
			this.addSubview(view, '.relative-item-container');
			this.mCurrentHeight += view.getHeight();
			this.mCurrentMarginTop += view.getHeight() / 2;
		}
		
		this.mSelectedItem = (l > 0) ? 0 : -1;
		if (this.mItems[this.mSelectedItem] !== undefined) {
			this.mItems[this.mSelectedItem].setSelected(true);
		}
		this.relayout();
		this.updateSpinnerForRunningItems();
		
		if (inOptCallback)
			inOptCallback();
	},
	reloadItemAtIndex: function(inIdx, inOptCallback) {
		logger().debug('list: reloadItemAtIndex', arguments);
		var item = this.mDataSource.itemAtIndex(inIdx);
		
		// otherwise, do the update only if it's on-screen
		if (this.mItems[inIdx])
		{
			this.mItems[inIdx].prepare(item);
			this.updateSpinnerForRunningItems();
		}
		
		if (inOptCallback)
			inOptCallback();
	},
	moveItemAtIndex: function(inOldIdx, inNewIdx, inOptAnimate, inOptCallback) {
		logger().debug('list: moveItemAtIndex', arguments);
		
		if (this.mItems.length < 2)
		{
			if (inOptCallback)
				inOptCallback();
			return;  // this was probably a bug to begin with
		}
		
		// update flash index
		if (this.mFlashIdx > -1)
		{
			if (inOldIdx == this.mFlashIdx)
				this.mFlashIdx = inNewIdx;
			else if (inOldIdx < this.mFlashIdx && inNewIdx > this.mFlashIdx)
				this.mFlashIdx--;
			else if (inNewIdx == this.mFlashIdx || (inOldIdx > this.mFlashIdx && inNewIdx < this.mFlashIdx))
				this.mFlashIdx++;
		}
		
		// calculate screen ranges
		var currentScreenRange = this.onScreenRange();
		var newScreenRange = [currentScreenRange[0], currentScreenRange[1]];
		if (inOldIdx == currentScreenRange[0])
		{
			newScreenRange[0] = inNewIdx;
			newScreenRange[1] = (inNewIdx + Math.min(this.visibleItemCapacity(), this.mItems.length)) % this.mItems.length;
		}
		else if (inNewIdx == currentScreenRange[0] || (inOldIdx > currentScreenRange[0] && inNewIdx < currentScreenRange[0]))
		{
			newScreenRange[0] = (newScreenRange[0] + 1) % this.mItems.length;
			newScreenRange[1] = (newScreenRange[1] + 1) % this.mItems.length;
		}
		else if (inOldIdx < currentScreenRange[0] && inNewIdx > currentScreenRange[0])
		{
			newScreenRange[0] = (newScreenRange[0] - 1);
			if (newScreenRange[0] < 0)
				newScreenRange[0] = this.mItems.length - 1;
			newScreenRange[1] = (newScreenRange[1] - 1);
			if (newScreenRange[1] < 0)
				newScreenRange[1] = this.mItems.length - 1;
		}
		
		// if both old and new positions are off-screen, reorder array, update selection, then bail
		var oldOffScreen = (!this.indexInRange(inOldIdx, currentScreenRange));
		var newOffScreen = (!this.indexInRange(inNewIdx, newScreenRange));
		if (oldOffScreen && newOffScreen)
		{
			// fix array
			var view = this.mItems.splice(inOldIdx, 1)[0];
			this.mItems.splice(inNewIdx, 0, view);
			
			// fix selection
			this.mSelectedItem = newScreenRange[0];
			
			if (inOptCallback)
				inOptCallback();
			
			return;
		}
		
		// simulate the move
		var newItemsList = this.mItems.slice(0);
		var view = newItemsList.splice(inOldIdx, 1)[0];
		newItemsList.splice(inNewIdx, 0, view);
		
		// check for on-screen missing views, create them, and add them to both arrays
		var l = Math.min(this.visibleItemCapacity(), this.mItems.length);
		for (var i = 0; i < l; i++)
		{
			var j = (newScreenRange[0] + i) % this.mItems.length;
			if (newItemsList[j] == null)
			{
				// create a view
				var newView = new this.mListItemClass(this.mDataSource.itemAtIndex(j));
				newItemsList[j] = newView;
				this.addSubview(newView, '.itemContainer');
				
				// determine old index
				var oldIndex = j;
				if (j == inNewIdx)
					oldIndex = inOldIdx;
				else if (inNewIdx < j && inOldIdx >= j)
					oldIndex--;
				else if (inOldIdx < j && inNewIdx > j)
					oldIndex++;
				
				this.updateItem(oldIndex, newView);
			}
		}
		
		// ANIMATING: call relayout
		if (inOptAnimate)
			this.relayout();
		
		// RENDER BREAK
		this._renderBreak(inOptAnimate, function(){
			// TODO: ANIMATING: mark targeted item as "mover" (will lower z-index, send to back)
			view = this.mItems[inOldIdx];
			
			// update the array and selection index
			this.mItems = newItemsList;
			this.mSelectedItem = newScreenRange[0];
			
			// update the contents of the view
			view.prepare(this.mDataSource.itemAtIndex(inNewIdx));
			this.updateSpinnerForRunningItems();
			
			// if inNewIdx is new selection, update selection info
			if (this.mSelectedItem == inNewIdx)
				this.updateLoupe(view.mTitle, view.mSubtitle, view.mSubtitleTimestamp, view.mStatusClass, view.mRunning, view.mFlashing);
			
			// ANIMATING: call _beginAnimation
			if (inOptAnimate)
				this._beginAnimation();
			
			// call relayout
			var thingsMoved = this.relayout();
			if (inOptAnimate && !thingsMoved)
				this._cancelAnimation();
			
			// NOT ANIMATING: call cleanup
			if (!inOptAnimate)
				this.cleanup();
			
			this._afterAnimation(function(){
				if (inOptCallback)
					inOptCallback();
			});
		}.bind(this));
	},
	insertItemAtIndex: function(inIdx, inOptAnimate, inOptCallback) {
		logger().debug('list: insertItemAtIndex', arguments);
		
		// insert null at inIdx in array
		this.mItems.splice(inIdx, 0, null);
		var view = new this.mListItemClass(this.mDataSource.itemAtIndex(inIdx));
		this.mCurrentHeight += view.getHeight();
		this.mCurrentMarginTop += view.getHeight() / 2;
		
		// ANIMATING: call _beginAnimation, relayout
		if (inOptAnimate)
		{
			this._beginAnimation();
			this.mIsResizing = true;
			this.relayout();
		}
		
		// call _afterAnimation
		this._afterAnimation(function(){
			// create new view, insert into array, add as subview
			this.updateItem(inIdx, view);
			this.addSubview(view, '.relative-item-container');
			this.mIsResizing = false;
			this.runPendingResizeUpdateCallbacks();
			this.updateSpinnerForRunningItems();
			
			// ANIMATING: set opacity to 0 (or other pre-animation state), relayout
			if (inOptAnimate)
			{
				view.mParentElement.style.opacity = '0';
				this.relayout();
			}
					
			// RENDER BREAK
			this._renderBreak(inOptAnimate, function(){
				// ANIMATING: call _beginAnimation
				if (inOptAnimate)
					this._beginAnimation();
				
				// ANIMATING: set opacity to 1 (or other post-animation state)
				view.mParentElement.style.opacity = '1';
				
				this._afterAnimation(function(){
					if (inOptCallback)
						inOptCallback();
				});
			}.bind(this));
		}.bind(this));
	},
	removeItemAtIndex: function(inIdx, inOptAnimate, inOptCallback) {
		logger().debug('list: removeItemAtIndex', arguments);
		
		// if it's the selected one, fade it out, remove it, call advanceSelection
		if (this.mSelectedItem == inIdx)
		{
			// ANIMATING: call _beginAnimation
			if (inOptAnimate)
				this._beginAnimation();

			// remove the view from the list
			this.updateItem(inIdx);
			if (this.mItems[0] !== undefined) {
				this.mCurrentHeight -= this.mItems[0].getHeight();
				this.mCurrentMarginTop -= this.mItems[0].getHeight() / 2;
			}
			else {
				this.mCurrentHeight = 0;
				this.mCurrentMarginTop = 0;
				this.mCurrentTop = null;
			}
			
			this.relayout();
			
			// call advance selection to finish things up
			this.advanceSelection(inOptAnimate, function(){
				if (inOptCallback)
					inOptCallback();
			}.bind(this));
		}
		
		// otherwise, do a normal fade out
		else
		{
			// update selection index
			if (inIdx < this.mSelectedItem)
				this.mSelectedItem = (this.mSelectedItem == 0) ? (this.mItems.length - 1) : this.mSelectedItem - 1;
			
			// ANIMATING: set opacity to 1 (or other pre-animation state)
			if (inOptAnimate)
				this.mItems[inIdx].mParentElement.style.opacity = '1';
			
			// RENDER BREAK
			this._renderBreak(inOptAnimate, function(){
				// ANIMATING: call _beginAnimation, set opacity to 0 (or other post-animation state)
				if (inOptAnimate)
				{
					this._beginAnimation();
					this.mIsResizing = true;
					this.mItems[inIdx].mParentElement.style.opacity = '0';
				}
				
				// call _afterAnimation
				this._afterAnimation(function(){
					// splice array appropriately, remove view from superview
					this.updateItem(inIdx);
					if (this.mItems[0] !== undefined) {
						this.mCurrentHeight -= this.mItems[0].getHeight();
						this.mCurrentMarginTop -= this.mItems[0].getHeight() / 2;
					}
					else {
						this.mCurrentHeight = 0;
						this.mCurrentMarginTop = 0;
					}
					
					this.mIsResizing = false;
					this.runPendingResizeUpdateCallbacks();
					
					// RENDER BREAK
					this._renderBreak(inOptAnimate, function(){
						// ANIMATING: call _beginAnimation
						if (inOptCallback)
							this._beginAnimation();
					
						// call relayout
						this.relayout();
		
						// NOT ANIMATING: call cleanup
						if (!inOptAnimate)
							this.cleanup();
						
						this._afterAnimation(function(){
							this.updateSpinnerForRunningItems();
							
							if (inOptCallback)
								inOptCallback();
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		}
	},
	advanceSelection: function(inOptAnimate, inOptCallback) {
		// RENDER BREAK
		this._renderBreak(inOptAnimate, function(){
			// ANIMATING: call _beginAnimation
			if (inOptAnimate)
				this._beginAnimation();
			
			// update mSelectedItem
			if (this.mItems[this.mSelectedItem] !== undefined) {
				this.mItems[this.mSelectedItem].setSelected(false);
			}
			
			this.mSelectedItem = (this.mSelectedItem + 1) % this.mItems.length;
			if (this.mItems.length !== undefined) {
				while (this.mItems[this.mSelectedItem] == null) {
					this.mSelectedItem = (this.mSelectedItem + 1) % this.mItems.length;
				}
			}
			
			if (this.mItems[this.mSelectedItem] !== undefined) {
				this.mItems[this.mSelectedItem].setSelected(true);
			}
			
			// update selection information
			var item = this.mItems[this.mSelectedItem];
			if (item !== undefined && item !== null) {
				this.updateLoupe(item, inOptCallback);
			}
		}.bind(this));
	},
	selectItemAtIndex: function(inIdx) {
		// TODO: implement (maybe)
		logger().error('selectItemAtIndex called on entity list view, which is currently not supported');
	},
	relayout: function() {
		// note: relayout does not remove any views; that is done in cleanup (for animation purposes)
		var itemsContainer = this.mParentElement.querySelector('.itemContainer');
		
		
		if (this.mItems.length > this.mMaxItems) {
			if (this.mCurrentTop === null) {
				this.mCurrentTop = 0;
			}
		}
		else {
			this.mCurrentTop = null;
		}
		
		itemsContainer.style.height = '%@vh'.fmt(this.mCurrentHeight);
		if (this.mCurrentTop !== null) {
			itemsContainer.style.top = 0;
			itemsContainer.style.marginTop = 0;
		}
		else {
			itemsContainer.style.top = '50%';
			itemsContainer.style.marginTop = '-%@vh'.fmt(this.mCurrentMarginTop);
		}
		
		
		for (var i = 0; i < this.mItems.length; i++)
		{
			var pos = i;
			if (this.mItems[i] != null)
			{
				// resize the view
				var view = this.mItems[i];
				view.resize();
				
				// determine layout coordinates
				
				var top = pos * view.absoluteHeight(true);
				this.mItems[i].setCurrentTop(top);
				view.mParentElement.style.webkitTransform = 'translate3d(0, ' + top + 'px, 0)';
			}
		}
		
		
	},
	cleanup: function() {
		// delay a bit so we don't impact animation smoothness
		setTimeout(this._cleanup.bind(this), 750);
	},
	_cleanup: function() {
		// TODO: strip off any animation classes
	
		// if a view is off-screen, purge it
		var screenRange = this.onScreenRange();
		for (var i = 0; i < this.mItems.length; i++)
		{
			if (!this.indexInRange(i, screenRange))
				this.updateItem(i, null);
		}
	},
	tidy: function() {
		this.relayout();
	},
	handleResize: function() {
		// add any views we need to
		for (var i = 0; i < this.mItems.length; i++)
		{
			var view = new this.mListItemClass(this.mDataSource.itemAtIndex(i));
			this.addSubview(view, '.relative-item-container');
			this.updateItem(i, view);
		}
		
		this.updateSpinnerForRunningItems();
		this.relayout();
	},
	updateLoupe: function(inItem, inOptCallback) {
		if (inItem !== undefined) {
			var loupe = this.mParentElement.down('.xcs-big-screen-loupe');		
			var el = this.mParentElement;
			var self = this;
			var revealTimer = null;
			var top = inItem.getCurrentTop();
			
			function updater() {
				loupe.removeEventListener('webkitTransitionEnd', updater, false);
				document.removeEventListener('visibilitychange', updater, false);
				document.removeEventListener('webkitvisibilitychange', updater, false);
				self.mUpdatingLoupe = false;
			}

			if ((this.mUpdatingLoupe && top === this.mCurrentLoupeTop) || document.hidden || document.webkitHidden)
				updater();
			else
			{
				loupe.addEventListener('webkitTransitionEnd', updater, false);
				
				if (this.mItems.length > this.mMaxItems) {
					if (this.mSelectedItem === 0) {
						this.mCurrentTop = 0;
						this.mParentElement.querySelector('.itemContainer').style.top = '-%@vh'.fmt(this.mCurrentTop);
						// this.mParentElement.querySelector('.itemContainer').style.webkitTransform = 'translate(0, -%@vh)'.fmt(this.mCurrentTop);
					}
					else if (this.mSelectedItem === (this.mItems.length - 1)) {
						// Move loupe to last item
					}
					else if (this.mSelectedItem > (this.mMaxItems - 2)) {
						this.mCurrentTop += this.mItems[this.mSelectedItem].getHeight();
						this.mParentElement.querySelector('.itemContainer').style.top = '-%@vh'.fmt(this.mCurrentTop);
						// this.mParentElement.querySelector('.itemContainer').style.webkitTransform = 'translate(0, -%@vh)'.fmt(this.mCurrentTop);
					}
				}
				
				this.mCurrentLoupeTop = top;
				loupe.style.webkitTransform = 'translate(0, ' + this.mCurrentLoupeTop + 'px)';
				this.mUpdatingLoupe = true;
				if (this.mUpdatingLoupeCallback) {
					clearTimeout(revealTimer);
				}
				this.mUpdatingLoupeCallback = true;
				revealTimer = setTimeout(function() {
					this.mUpdatingLoupeCallback = false;
					clearTimeout(revealTimer);
					if (inOptCallback !== undefined) {
						inOptCallback();
					}
				}, 1000);
				document.addEventListener('visibilitychange', updater, false);
				document.addEventListener('webkitvisibilitychange', updater, false);
			}
		}
	},
	updateLoupeNoSwap: function(inTitle, inSubtitle, inSubtitleTimestamp, inStatusClass, inRunning, inFlashing) {
		var loupe = this.mParentElement.down('.loupe');
		
		this.mSelectedTitle = inTitle;
		this.mSelectedSubtitleTimestamp = inSubtitleTimestamp;
		this.mSelectedStatusClass = inStatusClass;
		this.mSelectedRunning = inRunning;
		if (inRunning)
			loupe.querySelector('.xcs-big-screen-spinner-container').classList.add('active');
		else
			loupe.querySelector('.xcs-big-screen-spinner-container').classList.remove('active');
		
		loupe.className = ['loupe', this.mSelectedStatusClass, (this.mSelectedRunning) ? 'running' : '', (inFlashing) ? 'flash' : ''].join(' ');
		loupe.down('.title-span').textContent = this.mSelectedTitle;
	},
	showSpinner: function(inItemIx) {
		if (inItemIx !== undefined) {
			this.mItems[inItemIx].mParentElement.classList.add('active');
		}
	},
	hideSpinner: function(inItemIx) {
		if (inItemIx !== undefined) {
			this.mItems[inItemIx].mParentElement.classList.remove('active');
		}
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.BigScreenEntityView = Class.create(XCS.Mvc.View, {
	mClassNames: ['xc-big-screen-entity'],
	initialize: function($super, inOptEntity) {
		$super();
		if (inOptEntity)
			this.prepare(inOptEntity);
	},
	prepare: function(inEntity) {
		// do nothing
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.




XCS_HIDDEN_COMMIT_MESSAGES = "Hidden commit message.";

XCS.BigScreen.BigScreenBotRunListItemView = Class.create(XCS.BigScreen.BigScreenEntityListItemView, {
	mClassNames: ['xc-big-screen-list-item', 'xc-big-screen-bot-run-list-item'],
	mRunning: false,
	render: function($super) {
		var el = $super();
		
		el.appendChild(Builder.node('div', {className: 'sbSpinner'}));
		if (this.mRunning)
			el.addClassName('running');
		
		return el;
	},
	prepare: function(inEntity) {
		this.setTitle(inEntity.getBotName());
		
		if (inEntity.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
			var statusClasses = [];
			var hasErrors = false;
		
		
			if (inEntity && ((inEntity.getErrorCount() !== 0 && inEntity.getErrorCount() !== null) || (inEntity.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && !inEntity.isBuildSuccessFull()) )) {
				statusClasses.push('errors');
				hasErrors = true;
			}
			if (inEntity && inEntity.getWarningCount() !== 0 && inEntity.getWarningCount() !== null) {
				statusClasses.push('warnings');
				hasErrors = true;
			}
			if (inEntity && inEntity.getAnalyzerWarningCount() !== 0 && inEntity.getAnalyzerWarningCount() !== null) {
				statusClasses.push('analysis');
				hasErrors = true;
			}
			if (inEntity && inEntity.getTestsCount() !== null && inEntity.getTestsCount() !== 0 && inEntity.getTestFailureCount() !== null && inEntity.getTestFailureCount() === 0) {
				statusClasses.push('tests-success');
				hasErrors = true;
			}
			if (inEntity && inEntity.getTestsCount() !== null && inEntity.getTestsCount() !== 0 && inEntity.getTestFailureCount() !== null && inEntity.getTestFailureCount() !== 0) {
				statusClasses.push('tests-failures');
				hasErrors = true;
			}
			if (inEntity && inEntity.getImprovedPerformanceTestCount() !== null && inEntity.getRegressedPerformanceTestCount() !== null && inEntity.getImprovedPerformanceTestCount() !== 0 && inEntity.getImprovedPerformanceTestCount() > 0 && inEntity.getRegressedPerformanceTestCount() === 0) {
				statusClasses.push('performance-success');
				hasErrors = true;
			}
			if (inEntity && inEntity.getRegressedPerformanceTestCount() !== null && inEntity.getRegressedPerformanceTestCount() !== 0 && inEntity.getRegressedPerformanceTestCount() > 0) {
				statusClasses.push('performance-failures');
				hasErrors = true;
			}
		
			if (!hasErrors && inEntity.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
				statusClasses.push('success');
			}
		
			this.setStatusClasses(statusClasses);
		}
		
		this.setRunning(inEntity.getProperty('sbRunning'));
		
	},
	setRunning: function(inRunning) {
		this.mRunning = inRunning;
		if (this.rendered())
		{
			if (this.mRunning)
				this.mParentElement.addClassName('running');
			else
				this.mParentElement.removeClassName('running');
		}
	}
});

XCS.BigScreen.BigScreenBotRunEntityView = Class.create(XCS.BigScreen.BigScreenEntityView, {
	mClassNames: ['xc-big-screen-entity', 'xc-big-screen-bot-run-entity', 'updating', 'preshow'],
	mEntity: null,
	mUpdating: true,
	mUpdatingCommit: false,
	mCommitSwapTimer: null,
	mCommits: null,
	mTemplate: null,
	mCommitCircles: null,
	render: function() {
		var elem = this.renderTemplate({
			no_commits: 'XCS.BigScreen.Commits.Empty.Placeholder'.loc(),
			commits_hidden: 'XCS.BigScreen.Commits.Hidden.Placeholder'.loc()
		});
		return elem;
	},
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('bot_run_entity');
		this.mIntegrationStatus = new XCS.Views.IntegrationStatus();
		this.addSubview(this.mIntegrationStatus, '.status');
		
		this.mCommitCircles = [];
		globalNotificationCenter().subscribe(CC_BS_RESIZE_NOTIFICATION, this.handleResize.bind(this));
	},
	prepare: function(inIntegration) {
		if (this.rendered())
		{				
			// Setting to show / hide commit messages
			this.showCommits = window.localStorage.getItem(XCS_BS_COMMIT_MESSAGES_PREFERENCE_KEY) || XCS_BS_SHOW_COMMIT_MESSAGES;
			this.mCommitCircles = [];
			
			var el = this.mParentElement;
			var header = this.mParentElement.querySelector('.header');
			var self = this;
			var updater = function() {
				// clean up, if necessary
				header.removeEventListener('webkitTransitionEnd', updater, false);
				document.removeEventListener('visbilityChange', updater, false);
				document.removeEventListener('webkitvisibilitychange', updater, false);
				
				el.querySelector('#xcs-big-screen-entity-header-bot-title').innerHTML = inIntegration.getBotName().escapeHTML().titleCase();
				el.querySelector('#xcs-big-screen-entity-header-bot-time').innerHTML = globalLocalizationManager().localizedTimeShift(inIntegration.getMostRecentTime());
				
				var spinner = el.querySelector('#xcs-big-screen-entity-header-bot-title-inline-container .xcs-big-screen-spinner');
				var parentNode = el.parentElement;
				if (parentNode.classList.contains('one-bot')) {
					if (inIntegration.getProperty('sbRunning')) {
						spinner.classList.add('running');
					}
					else {
						spinner.classList.remove('running');
					}
				}
				else {
					spinner.classList.remove('running');
				}
				
				this.mIntegrationStatus.update(inIntegration);
				
				var showCommitContributors = function() {
					this.mParentElement.classList.add('updating-commits');
					
					if (this.showCommits == "hide") {
						el.down('.committers .title').textContent = 'XCS.BigScreen.EntityView.Committers.Plural.Label'.loc(0);
						el.down('.committers').addClassName('hide');
						self.mCommits = null;
					} else {
						self.mCommits = inIntegration.getCommitsByContributors();
						var commitersContainer = el.querySelector('.committers .normal');
						commitersContainer.innerHTML = "";
						var contributorsCount = 0;
						var commits = inIntegration.getCommits();
						var issuesByContributor = inIntegration.getIssuesByContributors();
						var commitsCount = 0;
						
						var aggContributorCommitsCount = null;
						var aggErrors = null;
						var aggWarnings = null;
						var aggAnalysis = null;
			
						if (commits !== null && commits.length) {
							commitsCount = commits.length;
						}
					
						for (var key in self.mCommits) {
							var contributorCommits = self.mCommits[key];
							var contributorName = "";
							var contributorInitials = "";
							var contributorPicture = "";
							var contributorCommitsCount = 0;
							var contributorHash = "";
							contributorsCount++;
							var commitsInfo = [];
				
							if (contributorsCount == 1) {
								this.mSelectedContributor = key;
							}
						
							
							if (contributorCommits && contributorCommits.length) {
								for (var i = 0; i < contributorCommits.length; i++) {
									var commit = contributorCommits[i];
									if (i == 0) {
										contributorName = commit.getAuthorFirstName();
										contributorHash = commit.getContributorHash();
										contributorInitials = commit.getAuthorInitials();
									}
									contributorCommitsCount++;
									commitsInfo.push(commit.getCommitMessageInfo());
								}
							}

							if (contributorsCount <= 5) {
								var errors = null;
								var warnings = null;
								var analysis = null;
								if (issuesByContributor !== null) {
									if (issuesByContributor[contributorHash] !== undefined) {
										errors = ((issuesByContributor[contributorHash].errors !== undefined) ? (issuesByContributor[contributorHash].errors / commitsCount * 100) : null);
										warnings = ((issuesByContributor[contributorHash].warnings !== undefined) ? (issuesByContributor[contributorHash].warnings / commitsCount * 100) : null);
										analysis = ((issuesByContributor[contributorHash].analysis !== undefined) ? (issuesByContributor[contributorHash].analysis / commitsCount * 100) : null);
									}
								}
							
								// Add contributors circles
								var contributorView = new XCS.BigScreen.ContributorCircle({
									color: '#FFF',
									value: (contributorCommitsCount / commitsCount * 100),
									label: contributorName,
									initials: contributorInitials,
									contributor_hash: key,
									errors: errors,
									warnings: warnings,
									analysis: analysis
								});
								contributorView.forceRender();
								commitersContainer.appendChild(contributorView.mParentElement);
								this.mCommitCircles.push(contributorView);
							}
							else {
								if (issuesByContributor !== null) {
									aggContributorCommitsCount += contributorCommitsCount;
									if (issuesByContributor[contributorHash] !== undefined) {
										aggErrors += ((issuesByContributor[contributorHash].errors !== undefined) ? (issuesByContributor[contributorHash].errors / commitsCount * 100) : null);
										aggWarnings += ((issuesByContributor[contributorHash].warnings !== undefined) ? (issuesByContributor[contributorHash].warnings / commitsCount * 100) : null);
										aggAnalysis += ((issuesByContributor[contributorHash].analysis !== undefined) ? (issuesByContributor[contributorHash].analysis / commitsCount * 100) : null);
									}
								}
							}
						}
						
						if (contributorsCount > 5) {
							// Add aggregate contributors circles
							var contributorView = new XCS.BigScreen.ContributorCircle({
								color: '#FFF',
								value: (aggContributorCommitsCount / commitsCount * 100),
								label: '',
								initials: '+',
								contributor_hash: '',
								errors: aggErrors,
								warnings: aggWarnings,
								analysis: aggAnalysis
							});
							contributorView.forceRender();
							commitersContainer.appendChild(contributorView.mParentElement);
							this.mCommitCircles.push(contributorView);
						}
					}
					
					this.mParentElement.classList.remove('updating-commits');
					if (!this.mParentElement.classList.contains('updating')) {
						setTimeout(this.renderValuesInCommitCirlces.bind(this), 700);
					}
				}.bind(this);
				
				
				if (inIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && inIntegration.getCommitsByContributors() !== null) {
					showCommitContributors();
				}
				else {
					var commitersContainer = el.querySelector('.committers .normal');
					commitersContainer.innerHTML = "";
				}
				
				//self.removeAllSubviews();
				
				// do an animation if necessary
				if (el.hasClassName('preshow') && !(document.hidden || document.webkitHidden))
				{
					setTimeout(function(){
						el.removeClassName('preshow');
					}, 200);
				}
			}.bind(this);
			
			if (this.mUpdating || this.mEntity.getBotId() == inIntegration.getBotId() || document.hidden || document.webkitHidden) {
				updater();
			}
			else {
				header.addEventListener('webkitTransitionEnd', updater, false);
				this.mParentElement.classList.add('updating');
				this.mParentElement.classList.add('updating-commits');
				this.mUpdating = true;
				
				document.addEventListener('visibilitychange', updater, false);
				document.addEventListener('webkitvisibilitychange', updater, false);
			}
			
			this.mEntity = inIntegration;
		}
	},
	handleResize: function() {
		// this.resizeStatusElement();
	},
	resizeStatusElement: function() {
		if (this.rendered())
		{
			// calculate new dimensions
			var containerEl = this.mParentElement.down('.status');
			var statusEl = this.mParentElement.down('.xc-bot-run-summary');
			var innerRatio = statusEl.offsetWidth / statusEl.offsetHeight;
			var outerRatio = containerEl.offsetWidth / containerEl.offsetHeight;
			
			var newWidth = statusEl.offsetWidth;
			var newHeight = statusEl.offsetHeight;
			
			if (innerRatio >= outerRatio)
			{
				newWidth = containerEl.offsetWidth;
				newHeight = newWidth / innerRatio;
			}
			else
			{
				newHeight = containerEl.offsetHeight;
				newWidth = newHeight * innerRatio;
			}
			
			// vertically center it
			var offset = Math.floor((containerEl.offsetHeight - statusEl.offsetHeight) / 2);
			
			// determine the correct scale
			var scale = newWidth / statusEl.offsetWidth;
			if (!this.mEntity || !this.mEntity.expandedStatusInfo || (this.mEntity.expandedStatusInfo.tests.passed == 0 && this.mEntity.expandedStatusInfo.tests.failed == 0))
				scale *= 0.9;
			
			// apply transform
			statusEl.style.webkitTransform = 'translateY(' + offset + 'px) scale(' + scale + ')';
		}
	},
	show: function() {
		// show it
		this.mParentElement.classList.remove('updating');
		this.mParentElement.classList.remove('updating-commits');
		setTimeout(this.renderValuesInCommitCirlces.bind(this), 700);
		this.mUpdating = false;
	},
	renderValuesInCommitCirlces: function() {
		for (var i = 0; i < this.mCommitCircles.length; i++) {
			var commitCircle = this.mCommitCircles[i];
			if (commitCircle !== undefined && commitCircle !== null) {
				commitCircle.animateValues();
			}
		}
	}
});

XCS.BigScreen.BigScreenBotsView = Class.create(XCS.Mvc.View, {
	mClassNames: ['xc-big-screen-bots'],
	mSelectionTimer: null,
	mSelectionTimerStartTime: -1,
	mSelectionTimerDuration: -1,
	mDataSource: null,
	mListView: null,
	mEntityView: null,
	mCurrentBotRun: null,
	mPaused: false,
	mTimeLeftAfterPause: -1,
	mResizePauseTimer: null,
	initialize: function($super) {
		$super();
		
		// create the list view
		this.mListView = new XCS.BigScreen.BigScreenEntityListView(XCS.BigScreen.BigScreenBotRunListItemView);
		this.addSubview(this.mListView);
		
		// create the entity view
		this.mEntityView = new XCS.BigScreen.BigScreenBotRunEntityView();
		this.addSubview(this.mEntityView);
		
		// resync everything when we come back from being occluded, just in case
		document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this), false);
		document.addEventListener('webkitvisibilitychange', this.handleVisibilityChange.bind(this), false);
		globalNotificationCenter().subscribe(CC_BS_RESIZE_NOTIFICATION, this.handleResize.bind(this));
	},
	introduce: function(inOptCallback) {
		setTimeout(function(){
			this.mListView.introduce(function(){
				if (inOptCallback)
					inOptCallback();
			});
		}.bind(this), 400);
	},
	setDataSource: function(inDataSource) {
		this.mDataSource = inDataSource;
		this.mListView.setDataSource(inDataSource);
	},
	reloadData: function(inOptContinuation) {
		dispatch_async(this.mSuperview.mAnimationQueue, function(){
			this._reloadData(inOptContinuation);
		}.bind(this));
	},
	_reloadData: function(inOptContinuation) {
		logger().debug('_reloadData', arguments);
		this.mListView.reloadData();
		if (this.mDataSource.numberOfItems() > 0) {
			if (this.mDataSource.numberOfItems() === 1) {
				this.mParentElement.classList.add('one-bot');
			}
			else {
				this.mParentElement.classList.remove('one-bot');
			}
			
			this.mEntityView.prepare(this.mDataSource.itemAtIndex(0));
			this.mEntityView.show();
		}
			
			
		
		if (inOptContinuation)
			inOptContinuation.ready();
	},
	insertRunAtIndex: function(inBotRun, inIndex, inOptContinuation) {
		dispatch_async(this.mSuperview.mAnimationQueue, function(){
			this._insertRunAtIndex(inBotRun, inIndex, true, inOptContinuation);
		}.bind(this));
	},
	_insertRunAtIndex: function(inBotRun, inIndex, inOptAnimate, inOptContinuation) {
		logger().debug('_insertRunAtIndex', arguments);
		
		var q = this.mSuperview.mAnimationQueue;
		
		dispatch_suspend(q);
		this.mListView.insertItemAtIndex(inIndex, inOptAnimate, function(){
			dispatch_resume(q);
			if (this.mDataSource.numberOfItems() == 2) // meaning we only had one before
				this.resetSelectionTimer();
			if (inOptContinuation)
				inOptContinuation.ready();
		}.bind(this));
	},
	updateRunWithIndices: function(inBotRun, inOldIndex, inNewIndex, inOptContinuation) {
		dispatch_async(this.mSuperview.mAnimationQueue, function(){
			this._updateRunWithIndices(inBotRun, inOldIndex, inNewIndex, true, inOptContinuation);
		}.bind(this));
	},
	_updateRunWithIndices: function(inBotRun, inOldIndex, inNewIndex, inOptAnimate, inOptContinuation) {
		logger().debug('_updateRunWithIndices', arguments);
		var entity = this.mDataSource.itemAtIndex(inNewIndex);
		
		if (inOldIndex == inNewIndex)
		{
			this.mListView.reloadItemAtIndex(inNewIndex);
			if (this.mListView.mSelectedItem == inNewIndex)
				this.mEntityView.prepare(entity);
			if (inOptContinuation)
				inOptContinuation.ready();
		}
		else
		{
			var q = this.mSuperview.mAnimationQueue;
		
			dispatch_suspend(q);
			this.mListView.moveItemAtIndex(inOldIndex, inNewIndex, inOptAnimate, function(){
				if (this.mListView.mSelectedItem == inNewIndex)
					this.mEntityView.prepare(entity);
				
				dispatch_resume(q);
				if (inOptContinuation)
					inOptContinuation.ready();
			}.bind(this));
		}
	},
	removeRunAtIndex: function(inBotRun, inIndex, inOptContinuation) {
		dispatch_async(this.mSuperview.mAnimationQueue, function(){
			this._removeRunAtIndex(inBotRun, inIndex, true, inOptContinuation);
		}.bind(this));
	},
	_removeRunAtIndex: function(inBotRun, inIndex, inOptAnimate, inOptContinuation) {
		logger().debug('_removeRunAtIndex', arguments);
		
		var q = this.mSuperview.mAnimationQueue;
		
		dispatch_suspend(q);
		this.mListView.removeItemAtIndex(inIndex, inOptAnimate, function(){
			dispatch_resume(q);
			if (this.mDataSource.numberOfItems() <= 1)
				this.stopSelectionTimer();
			if (inOptContinuation)
				inOptContinuation.ready();
		}.bind(this));
	},
	runStartedOrChanged: function(inBotRun, inIdx, inOptContinuation) {
		if (XCS.Helpers.isTerminalBotStatus(inBotRun.status))
		{
			if (inBotRun.guid == this.mCurrentBotRun)
				this.mCurrentBotRun = null;
		}
		else
			this.mCurrentBotRun = inBotRun.guid;
		
		if (inOptContinuation)
			inOptContinuation.ready();
	},
	resetSelectionTimer: function(inOptDelay) {
		this.stopSelectionTimer();
		if (this.mDataSource.numberOfItems() > 1)
		{
			this.mSelectionTimer = setTimeout(this.swapSelection.bind(this), (inOptDelay) ? inOptDelay : XCS_BS_BOT_STATUS_DEFAULT_DELAY);
			this.mSelectionTimerStartTime = Date.now();
			this.mSelectionTimerDuration = (inOptDelay) ? inOptDelay : XCS_BS_BOT_STATUS_DEFAULT_DELAY;
			// this.mPageControl.setPageTimer(this.mPages[this.mPageControl.mActivePage].pageDuration);
		}
	},
	stopSelectionTimer: function() {
		if (this.mSelectionTimer != null)
		{
			clearTimeout(this.mSelectionTimer);
			this.mSelectionTimer = null;
			this.mSelectionTimerStartTime = -1;
			this.mSelectionTimerDuration = -1;
		}
	},
	swapSelection: function() {
		dispatch_async(this.mSuperview.mAnimationQueue, function(){
			this._swapSelection(true);
		}.bind(this));
	},
	_swapSelection: function(inOptAnimate) {
		var selection = (this.mListView.mSelectedItem + 1) % this.mDataSource.numberOfItems();
		var entity = this.mDataSource.itemAtIndex(selection);
		
		dispatch_suspend(this.mSuperview.mAnimationQueue);
		this.stopSelectionTimer();
		this.mEntityView.prepare(entity);
		this.mListView.advanceSelection(inOptAnimate, function(){
			this.mEntityView.show();
			dispatch_resume(this.mSuperview.mAnimationQueue);
			this.resetSelectionTimer(this.calculateDelayForEntity(entity));
		}.bind(this));
	},
	calculateDelayForEntity: function(inEntity) {
		var delay = XCS_BS_BOT_STATUS_BASE_DELAY;
		return delay;
	},
	handleVisibilityChange: function() {
		if (document.hidden || document.webkitHidden)
			return this.pause();
		
		this.resume();
	},
	handleResize: function() {
		if (this.mResizePauseTimer)
			clearTimeout(this.mResizePauseTimer);
		
		this.mResizePauseTimer = setTimeout(this.resume.bind(this), 750);
		this.pause();
	},
	pause: function() {
		if (!this.mPaused)
		{
			logger().info('Pausing Big Screen due to occlusion or resize');
			this.mPaused = true;
			
			if (this.mSelectionTimerDuration != -1 && this.mSelectionTimerStartTime != -1)
				this.mTimeLeftAfterPause = this.mSelectionTimerDuration - (Date.now() - this.mSelectionTimerStartTime);
			else
				this.mTimeLeftAfterPause = -1;
			
			this.stopSelectionTimer();
		}
	},
	resume: function() {
		if (this.mPaused)
		{
			logger().info('Resuming Big Screen');
			this.mPaused = false;
		
			this.mListView.tidy();
		
			if (this.mDataSource.numberOfItems() > 0)
			{
				this.mListView.relayout();
				var entity = this.mDataSource.itemAtIndex(this.mListView.mSelectedItem);
				this.mEntityView.prepare(entity);
				this.resetSelectionTimer((this.mTimeLeftAfterPause != -1) ? this.mTimeLeftAfterPause : this.calculateDelayForEntity(entity));
			}
			else
				this.mEntityView.prepare(null);
		}
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.BigScreenControlPanelView = Class.create(XCS.Mvc.View, {
	mClassName: 'xc-big-screen-control-panel',
	render: function() {
		return Builder.node('div', [
			Builder.node('div', {className: 'titlebar'}, [
				Builder.node('div', {className: 'leftControls'}, [
					Builder.node('div', {className: 'button exit'}, [
						Builder.node('div', {className: 'icon'})
					])
				]),
				Builder.node('div', {className: 'title'}, document.domain),
				Builder.node('div', {className: 'rightControls'}, [
					Builder.node('div', {className: 'button settings'}, [
						Builder.node('div', {className: 'icon'})
					]),
					Builder.node('div', {className: 'button fullscreen'}, [
						Builder.node('div', {className: 'icon'})
					])
				])
			]),
			Builder.node('div', {className: 'shield'}),
			Builder.node('div', {className: 'settingsPanel'}, [
				Builder.node('h1', {className: 'title'}, 'XCS.BigScreen.Settings.Label'.loc()),
				Builder.node('div', {className: 'settingGroup sort'}, [
					Builder.node('div', {className: 'label'}, 'XCS.BigScreen.Settings.SortBy.Label'.loc()),
					Builder.node('div', {className: 'options'}, [
						Builder.node('div', {className: 'radioButton importance', 'data-value': 'importance'}, [
							Builder.node('div', {className: 'circle'}, [
								Builder.node('div', {className: 'dot'})
							]),
							Builder.node('label', 'XCS.BigScreen.Settings.SortBy.Importance.Label'.loc())
						]),
						Builder.node('div', {className: 'radioButton alpha', 'data-value': 'alpha'}, [
							Builder.node('div', {className: 'circle'}, [
								Builder.node('div', {className: 'dot'})
							]),
							Builder.node('label', 'XCS.BigScreen.Settings.SortBy.Name.Label'.loc())
						]),
						Builder.node('div', {className: 'radioButton freshness', 'data-value': 'freshness'}, [
							Builder.node('div', {className: 'circle'}, [
								Builder.node('div', {className: 'dot'})
							]),
							Builder.node('label', 'XCS.BigScreen.Settings.SortBy.Time.Label'.loc())
						])
					])
				]),
				Builder.node('div', {className: 'settingGroup commits'}, [
					Builder.node('div', {className: 'label'}, 'XCS.BigScreen.Settings.Commits.Label'.loc()),
					Builder.node('div', {className: 'options'}, [
						Builder.node('div', {className: 'radioButton show', 'data-value': 'show'}, [
							Builder.node('div', {className: 'circle'}, [
								Builder.node('div', {className: 'dot'})
							]),
							Builder.node('label', 'XCS.BigScreen.Settings.Commits.Yes.Label'.loc())
						]),
						Builder.node('div', {className: 'radioButton hide', 'data-value': 'hide'}, [
							Builder.node('div', {className: 'circle'}, [
								Builder.node('div', {className: 'dot'})
							]),
							Builder.node('label', 'XCS.BigScreen.Settings.Commits.No.Label'.loc())
						])
					])
				]),
				Builder.node('div', {className: 'controls'}, [
					Builder.node('div', {className: 'button cancel'}, 'XCS.BigScreen.Settings.Button.Cancel'.loc()),
					Builder.node('div', {className: 'button save'}, 'XCS.BigScreen.Settings.Button.Save'.loc())
				])
			]),
			Builder.node('div', {className: 'failurePanel'}, [
				Builder.node('h1', {className: 'title'}, 'XCS.BigScreen.Settings.Failure.Title.Default'.loc()),
				Builder.node('div', {className: 'message'}, 'XCS.BigScreen.Settings.Failure.DefaultMessage'.loc()),
				Builder.node('div', {className: 'controls'}, [
					Builder.node('div', {className: 'button reload'}, 'XCS.BigScreen.Settings.Button.Reload'.loc())
				])
			])
		]);
	},
	initialize: function($super) {
		$super();
		this.forceRender();
		
		this.mParentElement.down('.titlebar .button.settings').addEventListener('click', this.showSettings.bind(this), false);
		this.mParentElement.down('.titlebar .button.exit').addEventListener('click', this.exitBigScreen.bind(this), false);
		this.mParentElement.down('.titlebar .button.fullscreen').addEventListener('click', this.toggleFullscreen.bind(this), false);
		
		this.mParentElement.down('.settingsPanel .button.cancel').addEventListener('click', this.cancelSettings.bind(this), false);
		this.mParentElement.down('.settingsPanel .button.save').addEventListener('click', this.saveSettings.bind(this), false);
		
		this.mParentElement.down('.failurePanel .button.reload').addEventListener('click', this.reloadBigScreen.bind(this), false);
		
		this.mParentElement.select('.radioButton').forEach(function(el){
			el.addEventListener('click', this.selectRadioButton.bind(this), false);
		}.bind(this));
		
		document.addEventListener('webkitfullscreenchange', this.handleFullScreenChange.bind(this), false);
	},
	toggleFullscreen: function() {
		var el = this.mSuperview.mParentElement;
		if (!document.webkitFullscreenElement)
		{
			el.webkitRequestFullscreen();
			document.body.addClassName('fullscreen');
		}
		else
		{
			document.webkitCancelFullScreen();
			document.body.removeClassName('fullscreen');
		}
	},
	handleFullScreenChange: function(e) {
		if (!document.webkitFullscreenElement)
			document.body.removeClassName('fullscreen');
		else
			document.body.addClassName('fullscreen');
	},
	exitBigScreen: function() {
		window.location.href = '/xcode/bots'; // TODO: this is definitely not the best way to do this
	},
	reloadBigScreen: function() {
		window.location.reload();
	},
	validateSettings: function() {
		this.mParentElement.select('.radioButton.selected').forEach(function(el){
			el.removeClassName('selected');
		});
		
		var sortClass = window.localStorage.getItem(XCS_BS_SORT_ORDER_PREFERENCE_KEY) || XCS_BS_SORT_ORDER_IMPORTANCE;
		var commitMessagesClass = window.localStorage.getItem(XCS_BS_COMMIT_MESSAGES_PREFERENCE_KEY) || XCS_BS_SHOW_COMMIT_MESSAGES;
		this.mParentElement.down('.settingGroup.sort .radioButton.' + sortClass).addClassName('selected');
		this.mParentElement.down('.settingGroup.commits .radioButton.' + commitMessagesClass).addClassName('selected');
	},
	showSettings: function() {
		this.mSuperview.stopMouseTimer();
		this.mParentElement.addClassName('showSettingsPrep');
		this.validateSettings();
		
		var self = this;
		setTimeout(function(){
			self.mParentElement.addClassName('showSettings');
		}, 10);
	},
	dismissSettings: function() {
		var parEl = this.mParentElement;
		function fixer() {
			parEl.removeClassName('showSettingsPrep');
			parEl.removeClassName('settingsExit');
			this.removeEventListener('webkitTransitionEnd', fixer, false);
		}
		
		this.mSuperview.resetMouseTimer();
		parEl.down('.shield').addEventListener('webkitTransitionEnd', fixer, false);
		parEl.removeClassName('showSettings');
		parEl.addClassName('settingsExit');
	},
	cancelSettings: function() {
		this.dismissSettings();
	},
	saveSettings: function() {
		var sortValue = this.mParentElement.down('.settingGroup.sort .radioButton.selected').readAttribute('data-value');
		var commitMessageValue = this.mParentElement.down('.settingGroup.commits .radioButton.selected').readAttribute('data-value');
		
		window.localStorage.setItem(XCS_BS_SORT_ORDER_PREFERENCE_KEY, sortValue);
		window.localStorage.setItem(XCS_BS_COMMIT_MESSAGES_PREFERENCE_KEY, commitMessageValue);
		if (this.mSuperview !== undefined && this.mSuperview.mBotsView !== null) {
			var botsView = this.mSuperview.mBotsView;
			botsView.reloadData();
			botsView.resetSelectionTimer();
		}
		this.dismissSettings();
	},
	mUnreachableMinuteTimer: null,
	mUnreachableMinuteCounter: 0,
	showFailure: function(inOptMessage, inOptTitle, inOptShowButton) {
		this.mParentElement.addClassName('showFailurePrep');
		this.mSuperview.mParentElement.addClassName('titlebarDisabled');
		
		this.mUnreachableMinuteCounter = 0;
		clearInterval(this.mUnreachableMinuteTimer);
		
		if (!inOptMessage) {
			setInterval(function() {
				this.mUnreachableMinuteCounter += 1;
				var message = 'XCS.BigScreen.Settings.Failure.DefaultMessage'.loc();
				if (this.mUnreachableMinuteCounter < 60) {
					var minutes = this.mUnreachableMinuteCounter;
					message = "XCS.BigScreen.Settings.Failure.DefaultMessageIncludingMinutes.%@".fmt(minutes == 1 ? "Singular" : "Plural").loc(minutes);
				} else if (this.mUnreachableMinuteCounter < (60 * 24)) {
					var hours = Math.floor(this.mUnreachableMinuteCounter / 60);
					message = "XCS.BigScreen.Settings.Failure.DefaultMessageIncludingHours.%@".fmt(hours == 1 ? "Singular" : "Plural").loc(hours);
				} else {
					var days = Math.floor(this.mUnreachableMinuteCounter / (60 * 24));
					message = "XCS.BigScreen.Settings.Failure.DefaultMessageIncludingDays.%@".fmt(days == 1 ? "Singular" : "Plural").loc(days);
				}
				this.mParentElement.down('.failurePanel .message').textContent = message;
			}.bind(this), 60 * 1000);
		}
		
		if (!inOptMessage)
			inOptMessage = 'XCS.BigScreen.Settings.Failure.DefaultMessage'.loc();
		this.mParentElement.down('.failurePanel .message').textContent = inOptMessage;
		
		if (!inOptTitle)
			inOptTitle = 'XCS.BigScreen.Settings.Failure.Title.Default'.loc();
		this.mParentElement.down('.failurePanel .title').textContent = inOptTitle;
		
		if (inOptShowButton === undefined)
			inOptShowButton = true;
		
		if (!inOptShowButton)
			this.mParentElement.down('.failurePanel .controls').hide();
		else
			this.mParentElement.down('.failurePanel .controls').show();
		
		var self = this;
		setTimeout(function(){
			self.mParentElement.addClassName('showFailure');
		}, 10);
	},
	hideFailure: function() {
		this.mUnreachableMinuteCounter = 0;
		clearInterval(this.mUnreachableMinuteTimer);
		
		if (this.mParentElement.hasClassName('showFailure')) {
			this.mParentElement.removeClassName('showFailurePrep');
			this.mSuperview.mParentElement.removeClassName('titlebarDisabled');
			this.mParentElement.removeClassName('showFailure');
		}
	},
	selectRadioButton: function(e) {
		var button = e.target.up('.radioButton');
		var container = e.target.up('.settingGroup');
		
		if (button.hasClassName('disabled'))
			return;
		
		container.select('.radioButton.selected').forEach(function(el){
			el.removeClassName('selected');
		});
		
		button.addClassName('selected');
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.BigScreenEmptyView = Class.create(XCS.Mvc.View, {
	mClassNames: ['xc-big-screen-empty'],
	render: function() {
		return Builder.node('div', [
			Builder.node('div', {className: 'icon'}),
			Builder.node('div', {className: 'message reltext'}, 'XCS.BigScreen.Empty.Label'.loc())
		]);
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.BigScreenView = Class.create(XCS.Mvc.View, XCS.Keyboard.Mixins.Responder, {
	mClassNames: ['xc-big-screen', 'preload', 'titlebarDisabled'],
	mController: null,
	mAnimationQueue: null,
	mMouseTimer: null,
	mLastMouseCoords: null,
	mControlPanel: null,
	mTitlebarFirstLoad: false,
	mLoadCompletionCallback: null,
	mBotsView: null,
	mEmptyView: null,
	initialize: function($super, inController) {
		$super();
		this.forceRender();
		this.mController = inController;
		this.becomeFirstResponder();
		
		// create a dispatch queue
		this.mAnimationQueue = dispatch_queue_create('com.apple.XcodeServer.BigScreenView.animations');
		
		// this.mPageSizeHelper = new XCS.BigScreen.BigScreenPageInnerView();
		// this.mPageSizeHelper.mParentElement.style.zIndex = '-10';
		// this.addSubview(this.mPageSizeHelper);
		
		// setup a control panel
		this.mControlPanel = new XCS.BigScreen.BigScreenControlPanelView();
		this.addSubview(this.mControlPanel);
		
		// setup listeners for window resize and mouse move
		this.mLastMouseCoords = {x: -1, y: -1};
		document.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
		window.addEventListener('resize', this.handleWindowResize.bind(this), false);
		
		// reset timers
		this.resetMouseTimer();
		
		// block the animation queue until the initial load completes
		dispatch_suspend(this.mAnimationQueue);
		dispatch_async(this.mAnimationQueue, function(){
			dispatch_suspend(this.mAnimationQueue);
			
			if (this.mLoadCompletionCallback)
			{
				this.mLoadCompletionCallback();
				this.mLoadCompletionCallback = null;
			}
			
			// TODO: address this once we have multiple screens
			if (this.mBotsView)
			{
				this.mBotsView._reloadData();
			}
			
			// enable the titlebar after 3 seconds
			setTimeout(function(){
				this.mTitlebarFirstLoad = true;
				this.mParentElement.addClassName('titlebarFirstLoad');
				this.mParentElement.removeClassName('titlebarDisabled');
			}.bind(this), 3000);
			
			var self = this;
			function fixer(){
				this.removeEventListener('webkitTransitionEnd', fixer, false);
				this.removeClassName('ready');
				if (self.mBotsView && self.mBotsView.mDataSource.numberOfItems() > 0)
				{
					self.mBotsView.resetSelectionTimer(self.mBotsView.calculateDelayForEntity());
					dispatch_resume(self.mAnimationQueue);
				}
				else	
					dispatch_resume(self.mAnimationQueue);
			}
			
			this.mParentElement.addEventListener('webkitTransitionEnd', fixer, false);
			this.mParentElement.removeClassName('preload');
			this.mParentElement.addClassName('ready');
			if (document.hidden || document.webkitHidden)
				fixer.call(this.mParentElement);
		}.bind(this));
	},
	completeInitialLoad: function(inCallback) {
		this.mLoadCompletionCallback = inCallback;
		
		if (this.mController.mBotRunDataSource.numberOfItems() > 0)
			this.loadBotsView();
		else
			this.loadEmptyView();
		
		dispatch_resume(this.mAnimationQueue);
	},
	reload: function(inOptContinuation) {
		var q = this.mAnimationQueue;
		dispatch_suspend(q);
		
		function continuation() {
			this.removeEventListener('webkitTransitionEnd', continuation, false);
			dispatch_resume(q);
		}
		
		this.mParentElement.addEventListener('webkitTransitionEnd', continuation, false);
		this.mParentElement.addClassName('preload');
		
		dispatch_async(this.mAnimationQueue, function(){
			if (this.mController.mBotRunDataSource.numberOfItems() > 0)
			{
				this.purgeEmptyView();
				this.loadBotsView();
				this.mBotsView._reloadData();
			}
			else
			{
				this.purgeBotsView();
				this.loadEmptyView();
			}
			
			var self = this;
			function fixer(){
				this.removeEventListener('webkitTransitionEnd', fixer, false);
				this.removeClassName('ready');
				if (self.mBotsView && self.mBotsView.mDataSource.numberOfItems() > 0)
					self.mBotsView.resetSelectionTimer(self.mBotsView.calculateDelayForEntity(self.mBotsView.mDataSource.itemAtIndex(0)));
				dispatch_resume(self.mAnimationQueue);
				inOptContinuation.ready();
			}
			
			this.mParentElement.addEventListener('webkitTransitionEnd', fixer, false);
			this.mParentElement.removeClassName('preload');
			this.mParentElement.addClassName('ready');
			if (document.hidden || document.webkitHidden)
				fixer.call(this.mParentElement);
		}.bind(this));
		
		if (document.hidden || document.webkitHidden)
			continuation.call(this.mParentElement);
	},
	loadBotsView: function() {
		if (!this.mBotsView)
		{
			this.mBotsView = new XCS.BigScreen.BigScreenBotsView();
			this.mBotsView.setDataSource(this.mController.mBotRunDataSource);
			this.addSubview(this.mBotsView);
		}
		
		return this.mBotsView;
	},
	purgeBotsView: function() {
		if (this.mBotsView)
		{
			this.removeSubviews([this.mBotsView]);
			this.mBotsView = null;
		}
	},
	loadEmptyView: function() {
		if (!this.mEmptyView)
		{
			this.mEmptyView = new XCS.BigScreen.BigScreenEmptyView();
			this.addSubview(this.mEmptyView);
		}
		
		return this.mEmptyView;
	},
	purgeEmptyView: function() {
		if (this.mEmptyView)
		{
			this.removeSubviews([this.mEmptyView]);
			this.mEmptyView = null;
		}
	},
	handleWindowResize: function() {
		// this code exists to work around a WebKit bug where variable-size text
		// doesn't get resized with the browser window
		var els = document.querySelectorAll('.xc-big-screen .reltext, .xc-big-screen-control-panel .title, .xc-big-screen-control-panel .button, .xc-big-screen-control-panel .label, .xc-big-screen-control-panel label, .xc-big-screen-control-panel .message');
		for (var i = 0; i < els.length; i++)
			els[i].style.zIndex = '1';
		
		// anything with pixel dimensions will also need a resize
		globalNotificationCenter().publish(CC_BS_RESIZE_NOTIFICATION, this);
	},
	handleMouseMove: function(e) {
		if (e.screenX != this.mLastMouseCoords.x || e.screenY != this.mLastMouseCoords.y)
		{
			this.mLastMouseCoords = {x: e.screenX, y: e.screenY};
			
			if (this.mMouseTimer == null)
				return;
			
			this.resetMouseTimer();
			this.showMouseUI();
		}
	},
	stopMouseTimer: function() {
		if (this.mMouseTimer != null && this.mMouseTimer !== 1)
		{
			clearTimeout(this.mMouseTimer);
			this.mMouseTimer = null;
		}
	},
	resetMouseTimer: function() {
		this.stopMouseTimer();
		this.mMouseTimer = setTimeout(this.hideMouseUI.bind(this), 2000);
	},
	showMouseUI: function() {
		document.body.removeClassName('nomouse');
		
		if (this.mTitlebarFirstLoad)
		{
			this.mTitlebarFirstLoad = false;
			this.mParentElement.removeClassName('titlebarFirstLoad');
		}
	},
	hideMouseUI: function() {
		this.mMouseTimer = null; // disable mouse moves
		document.body.addClassName('nomouse');
		
		if (this.mTitlebarFirstLoad)
		{
			this.mTitlebarFirstLoad = false;
			this.mParentElement.removeClassName('titlebarFirstLoad');
		}
		
		setTimeout(function() {
			this.mMouseTimer = 1; // enable mouse moves
		}.bind(this), 10);
	},
	handleKeyboardNotification: function(inMessage, inObject, inOptExtras) {
		if (inMessage == XCS.Keyboard.NOTIFICATION_DID_KEYBOARD_SPACE)
		{
			this.mControlPanel.toggleFullscreen();
			inOptExtras.event.preventDefault();
			inOptExtras.event.stopPropagation();
		}
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Clock = Class.create(XCS.Mvc.View, {
	mDate: null,
	mHours: null,
	mMinutes: null,
	mSeconds: null,
	mHourNeedle: null,
	mMinutesNeedle: null,
	initialize: function($super, inDate) {
		$super();
		if (inDate !== undefined) {
			this.mDate = inDate;
			this.mHours = this.mDate.getHours();
			this.mMinutes = this.mDate.getMinutes();
			this.mSeconds = this.mDate.getSeconds();
		}
	},
	render: function() {
		var dimension = 50;
		var positionX = dimension / 2;
		var positionY = dimension / 2;
		var radius = (dimension / 2) -2;
		
		
		var elem = document.createElement('div');
		elem.classList.add('xcs-clock');
		
		var page = Raphael(elem, "100%", "100%");
		page.setViewBox(0, 0, dimension, dimension);
		var outterCircle = page.circle(positionX, positionY, radius);
		outterCircle.attr({'stroke': '#FFF', 'stroke-width': '1.5px'});

		this.mHourNeedle = page.rect(positionX - 0.5, positionY, 1, (dimension / 2 * 0.30));
		this.mHourNeedle.attr({stroke: '#FFF', fill: '#FFF', 'stroke-width': '1.5px'});
		
		this.mMinutesNeedle = page.rect(positionX - 0.5, positionY, 1, (dimension / 2 * 0.70));
		this.mMinutesNeedle.attr({stroke: '#FFF', fill: '#FFF', 'stroke-width': '1.5px'});
		
		var hourNeedleTrandformString = 'r%@,%@,%@'.fmt(180 + (30 * (this.mHours%12 + this.mMinutes/60)), positionX, positionY);
		var minutesNeedleTransformString = 'r%@,%@,%@'.fmt(180 + (6 * this.mMinutes), positionX, positionY);
		this.mHourNeedle.transform(hourNeedleTrandformString);
        this.mMinutesNeedle.transform(minutesNeedleTransformString);
		
		return elem;
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.ContributorCircle = Class.create(XCS.Mvc.View, {
	mClassName: null,
	mDimension: null,
	mCirle: null,
	mCount: null,
	mRadius: null,
	mSelected: false,
	mErrors: null,
	mWarnings: null,
	mAnalysis: null,
	mPage: null,
	initialize: function($super, inParams) {
		if (inParams === undefined) {
			var inParams = {};
		}
		
		$super();
		this.mClassName = (inParams['class_name'] || "");
		this.mColor = (inParams['color'] || "#000");
		this.mValue = (inParams['value'] || null);
		this.mErrors = (inParams['errors'] || null);
		this.mWarnings = (inParams['warnings'] || null);
		this.mAnalysis = (inParams['analysis'] || null);
		this.mBackground = (inParams['background'] || true);
		this.mBackgroundColor = (inParams['background_color'] || "#CCC");
		this.mTemplate = this.getTemplate('contributors_circle');
		this.mLabel = (inParams['label'] || null);
		this.mPicture = (inParams['picture'] || null);
		this.mInitials = (inParams['initials'] || "");
		this.mContributorHash = (inParams['contributor_hash'] || "");
		
		this.mCirclesConfiguration = [];
		this.mCircles = [];
		
		if (this.mValue !== null) {
			this.mCirclesConfiguration.push({
				value: this.mValue,
				color: '#FFF'
			});
		}
		
		if (this.mErrors !== null) {
			this.mCirclesConfiguration.push({
				value: this.mErrors,
				color: 'rgb(255, 59, 48)'
			});
		}
		if (this.mWarnings !== null) {
			this.mCirclesConfiguration.push({
				value: this.mWarnings,
				color: 'rgb(255, 204, 0)'
			});
		}
		if (this.mAnalysis !== null) {
			this.mCirclesConfiguration.push({
				value: this.mAnalysis,
				color: 'rgb(13, 122, 255)'
			});
		}
		
	},
	render: function() {
		var elem = this.renderTemplate({
			class_name: this.mClassName,
			id: this.Id,
			contributor_hash: this.mContributorHash
		});
		this.createCircles(elem);
		return elem;
	},
	createCircles: function(inElem) {
		if (inElem !== undefined) {
			var elem = inElem.querySelector('.xcs-webui-contributors-circle');
			var dimension = 50;
			this.mPage = Raphael(elem, "100%", "100%");
			this.mPage.setViewBox(0, 0, dimension, dimension);

			var positionStart = dimension / 2;
			var positionX = dimension / 2;
			
			var positionY = (((dimension / 2) - ((dimension / 2) * 0.3)) + 4);
			this.mRadius = (positionStart - 2) * 0.7;
			
			if (this.mLabel !== null) {
				this.mPage.text(25, 29, this.mLabel).attr({"font-size": 8, "font-family": "HelveticaNeue-Light", fill: "#787878", "letter-spacing": "0.3px"});
			}
			
			this.mPage.customAttributes.arc = function (value, total, R) {
				var alpha = 360 / total * value;
				var a = (90 - alpha) * Math.PI / 180;
				var x = positionX + R * Math.cos(a);
				var y = positionY - R * Math.sin(a);
				var path;
				if (total == value) {
					path = [["M", positionX, positionY - R], ["A", R, R, 0, 1, 1, (positionX - 0.1), positionY - R]];
				} else {
					path = [["M", positionX, positionY - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
				}
				return {path: path};
			}.bind(this);
			
			if (this.mBackground) {
				this.mPage.circle(positionX, positionY, this.mRadius).attr({stroke: 'rgb(75, 75, 75)', "stroke-width": "1px"});
			}
			
			this.mPage.text(25, 12.5, this.mInitials).attr({"font-size": 9, "font-family": "Helvetica Neue", "font-weight": "lighter", "letter-spacing": "1.5px", fill: "#FFF"});
		}
	},
	updateValue: function(inCircle, inValue, inRadius) {
		if (this.mValue !== null && inCircle !== null && inRadius !== null) {
			inCircle.animate({arc: [inValue, 100, inRadius]}, 500, "<");
		}
	},
	setSelected: function(inValue) {
		if (inValue !== undefined && inValue) {
			this.mSelected = true;
		}
		else {
			this.mSelected = false;
		}
		this.updateSelectionView();
	},
	updateSelectionView: function() {
		var diamond = this.mParentElement.querySelector('.xcs-webui-contributors-circle-diamond');
		if (this.mSelected) {
			diamond.style.display = 'none';
		}
		else {
			diamond.style.display = 'block';
		}
	},
	animateValues: function() {
		for (var i = 0; i < this.mCirclesConfiguration.length; i++) {
			var configuration = this.mCirclesConfiguration[i];
			var params = {
				stroke: configuration.color,
				"stroke-width": "1px"
			}
			var value = configuration.value;
			var radius = (this.mRadius * (1 + i/10));
			var circle = this.mPage.path().attr(params).attr({arc: [0, 100, radius]});
			this.updateValue(circle, value, radius);
		}
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.BigScreen.BigScreenController = Class.create(XCS.Mvc.ViewController, {
	mBigScreenQueue: null,
	main: function($super) {
		XCS.RouteHelpers.setBodyClassName('big-screen');
		XCS.RouteHelpers.setTopLevelClassNames(true);
		XCS.RouteHelpers.setContentPrimaryFullWidth(true, false);
		XCS.RouteHelpers.setBrowserWindowTitle("XCS.BrowserTitle.BigScreen".loc());
		
		// if we aren't on a supported browser, bail immediately
		if (!browser().isWebKit())
		{
			this.mView = new XCS.BigScreen.BigScreenView(this);
			this.mView.mControlPanel.showFailure('XCS.BigScreen.Settings.Failure.UnsupportedBrowser'.loc(), 'XCS.BigScreen.Settings.Failure.Title.UnsupportedBrowser'.loc(), false);
			this.mView.mParentElement.removeClassName('preload');
			this.mView.mParentElement.addClassName('ready');
			mainView.addSubview(this.view(), '#main', true);
			return;
		}
		
		// inject a viewport tag if necessary
		if (browser().isMobileSafari())
		{
			var viewportTag = document.createElement('meta');
			viewportTag.name = 'viewport';
			viewportTag.content = 'width=device-width, initial-scale=1, maximum-scale=1';
			document.head.appendChild(viewportTag);
		}
		
		if (browser().isMobile()) {
			XCS.setMeta('viewport', 'initial-scale=1.0, width=device-width, user-scalable=no');
		}
		
		// link callbacks to activity stream
		var connectionDroppedPopupTimer = null;
		var connectionLostDelay = 60 * 1000;
		var connectionLostCallback = function() {
			clearTimeout(connectionDroppedPopupTimer);
			if (this.mView && this.mView.mBotsView) {
				this.mView.mBotsView.stopSelectionTimer();
			}
			if (this.mView && this.mView.mControlPanel) {
				this.mView.mControlPanel.showFailure();
			}
		}.bind(this);

		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_CONNECT, function() {
			clearTimeout(connectionDroppedPopupTimer);
			if (this.mView && this.mView.mBotsView) {
				this.mView.mBotsView.resetSelectionTimer();
			}
			if (this.mView && this.mView.mControlPanel) {
				this.mView.mControlPanel.hideFailure();
			}
		}.bind(this));
		
		globalNotificationCenter().batchSubscribe([XCS.ActivityStream.NOTIFICATION_DID_DISCONNECT, XCS.ActivityStream.NOTIFICATION_DID_FAIL_CONNECT, XCS.ActivityStream.NOTIFICATION_DID_ERROR], function() {
			connectionDroppedPopupTimer = setTimeout(connectionLostCallback, connectionLostDelay);
		}.bind(this));

		// create the view and data source
		this.mView = new XCS.BigScreen.BigScreenView(this);
		mainView.addSubview(this.view(), '#content-primary', true);
		this.mBotRunDataSource = new XCS.BigScreen.BigScreenBotRunDataSource();
		
		// setup a timestamp update timer
		var nextFire = (60 * 1000) - (Date.now() % (1000 * 60));
		if (nextFire < 1000)
			nextFire += 60000;
		this.mTimestampUpdateTimer = setTimeout(this.updateTimestamps.bind(this), nextFire);
		
		// react to status changes for bot runs we are displaying
		this.mActivityQueue = new XCS.ActivityQueue(true);
		this.mActivityQueue.subscribe(this.handleIntegrationActivityStreamUpdate.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_NEW_INTEGRATION_STATUS, this.mActivityQueue.push.bind(this.mActivityQueue));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_REMOVED_STATUS, this.mActivityQueue.push.bind(this.mActivityQueue));
		
		// load any past bot runs 
		this.mBigScreenQueue = dispatch_queue_create('big_screen', true);
		
		dispatch_async(this.mBigScreenQueue, function(manager) {
			var errBack = function(inResponse) {
				logger().error(inResponse);
				dispatch_execute_final(this.mBigScreenQueue);
			}.bind(this);
			
			var callback = function(inBots) {
				var ids = [];
				if (inBots !== undefined && inBots.length > 0) {
					for (var i = 0; i < inBots.length; i++) {
						var bot = inBots[i];
						ids.push(bot.getId());
					}
					
					manager.next(ids);
				}
				else {
					dispatch_execute_final(this.mBigScreenQueue);
				}
			}.bind(this);
			
			xcs_proxy().getBots(callback, errBack);
		}.bind(this));
		
		dispatch_async(this.mBigScreenQueue, function(manager) {
			if (manager && manager.data && manager.data.length && manager.data[0]) {
				var botIds = manager.data[0];
				var botIdCount = botIds.length;
				var responses = 0;
				var integrationsArray = [];
				
				var errBack = function(inResponse) {
					logger().error(inResponse);
					responses++;
					if (responses == botIdCount) {
						manager.next(integrationsArray);
					}
				};
				
				var callback = function(inIntegration) {
					if (inIntegration !== undefined && inIntegration !== null) {
						integrationsArray.push(inIntegration);
					}

					responses++;
					if (responses == botIdCount) {
						manager.next(integrationsArray);
					}
				}
				
				for (var i = 0; i < botIds.length; i++) {
					xcs_proxy().getLastestNonFatalIntegrationForBot(botIds[i], callback, errBack);
				}
			}
		});
		
		this.getRunningIntegrations();
		
		this.getCommitsAndIssuesForIntegration();
		
		dispatch_async(this.mBigScreenQueue, function(manager) {
			if (manager && manager.data && manager.data.length && manager.data[0]) {
				var integrations = manager.data[0];
				
				var completionQueue = dispatch_queue_create('com.apple.XcodeServer.BigScreen.initialLoadCompletion');
				
				for (var i = 0; i < integrations.length; i++) {
					dispatch_suspend(completionQueue);
					this.mBotRunDataSource.updateItem(integrations[i], false, false);
					dispatch_resume(completionQueue);
				}
			}
			manager.next();
		}.bind(this));
		
		dispatch_final(this.mBigScreenQueue, function(manager){
			this.mView.completeInitialLoad(function(){
				this.mInitialLoadCompleted = true;
			}.bind(this));
		}.bind(this));
	},
	mActivityQueue: null,
	mView: null,
	mBotRunDataSource: null,
	mInitialLoadCompleted: false,
	mTimestampUpdateTimer: null,
	mCyclesWithoutStreamUpdates: 0,
	view: function() {
		return this.mView;
	},
	handleIntegrationActivityStreamUpdate: function(inActivity, inContinuation) {
		var id = (inActivity && inActivity._id);
		var currentStep = (inActivity && inActivity.currentStep);
		var notification = (inActivity && inActivity.action);
		
		if (id)
		{	
			if (notification == XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_REMOVED_STATUS)
				this.processBotDeletion(id, inContinuation);
			else
			{
				this.getIntegrationById(id);
				this.getCommitsAndIssuesForIntegration();
				
				dispatch_async(this.mBigScreenQueue, function(manager) {
					if (dispatch_queue_size(this.mBigScreenQueue) === 0) {
						dispatch_resume(this.mBigScreenQueue);
					}
					var integrationsArray = (manager && manager.data && manager.data[0]);
					var integration = (integrationsArray && integrationsArray[0]);
					this.processNewBotRun(integration, inContinuation);
				}.bind(this));
			}
		}
	},
	processNewBotRun: function(inIntegration, inContinuation) {
		var botsView = this.mView.mBotsView;
		
		// update the data source
		var action = this.mBotRunDataSource.updateItem(inIntegration, (this.mInitialLoadCompleted && botsView != null));
	
		// determine what to do with this information
		if (this.mInitialLoadCompleted && botsView != null && action.mAction != XCS_BS_DATA_SOURCE_ACTION_IGNORE)
		{
			if (action.mAction == XCS_BS_DATA_SOURCE_ACTION_INSERT)
				this.mView.reload(inContinuation);
			else if (action.mAction == XCS_BS_DATA_SOURCE_ACTION_UPDATE)
				botsView.updateRunWithIndices(inIntegration, action.mOldIndex, action.mNewIndex, inContinuation);
			else
				botsView.reloadData(inContinuation);
			
			if (action.mNewIndex > -1)
				botsView.runStartedOrChanged(inIntegration, action.mNewIndex);
		}
		else if (botsView == null && action.mAction == XCS_BS_DATA_SOURCE_ACTION_INSERT && this.mBotRunDataSource.numberOfItems() == 1)
			this.mView.reload(inContinuation);
		else
			inContinuation.ready();
	},
	processBotDeletion: function(theEntityGUID, inContinuation) {
		var botsView = this.mView.mBotsView;
		var theEntity = {botId: theEntityGUID};
		
		// update the data source with a fake entity
		var action = this.mBotRunDataSource.removeItem(theEntity);
		
		// update the relevant views
		if (this.mInitialLoadCompleted && botsView != null && action.mAction == XCS_BS_DATA_SOURCE_ACTION_REMOVE && this.mBotRunDataSource.numberOfItems() > 0)
			this.mView.reload(inContinuation);
		else if (botsView != null && action.mAction == XCS_BS_DATA_SOURCE_ACTION_REMOVE && this.mBotRunDataSource.numberOfItems() == 0)
			this.mView.reload(inContinuation);
		else
			inContinuation.ready();
	},
	updateTimestamps: function() {
		globalNotificationCenter().publish(CC_BS_TIMESTAMP_NOTIFICATION, this);
		
		// calculate the next fire date
		var nextFire = (60 * 1000) - (Date.now() % (1000 * 60));
		if (nextFire < 1000)
			nextFire += 60000;
		this.mTimestampUpdateTimer = setTimeout(this.updateTimestamps.bind(this), nextFire);
	},
	getIntegrationById: function(inIntegrationId) {
		if (inIntegrationId !== undefined) {
			if (dispatch_queue_size(this.mBigScreenQueue) === 0) {
				dispatch_resume(this.mBigScreenQueue);
			}

			dispatch_async(this.mBigScreenQueue, function(manager) {
				var integrationArray = [];
				var callback = function(inIntegration) {
					integrationArray.push(inIntegration);
					manager.next(integrationArray);
				};
				
				var errBack = function() {
					manager.next(integrationArray);
				}
				
				xcs_proxy().getIntegration(inIntegrationId, callback.bind(this), errBack);
			});
		}
	},
	getCommitsAndIssuesForIntegration: function() {
		if (dispatch_queue_size(this.mBigScreenQueue) === 0) {
			dispatch_resume(this.mBigScreenQueue);
		}
		
		dispatch_async(this.mBigScreenQueue, function(manager) {
			var integrationsArray = (manager && manager.data && manager.data[0]);
			var expectedResponses = 0;
			var responseCount = 0;
			
			if (integrationsArray !== undefined && integrationsArray !== null && integrationsArray.length) {
				for (var i = 0; i < integrationsArray.length; i++) {
					(function(i) {
						var integration = integrationsArray[i];
					
						if (integration !== undefined && integration !== null && integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING) && integration.getCommits() === null) {
							var integrationId = integration.getId();
							expectedResponses++;
				
							var errback = function() {
								responseCount++;
								if (responseCount === expectedResponses) {
									manager.next(integrationsArray);
								}
							};
				
							var callback = function(inCommits) {
								if (inCommits !== undefined) {
									integration.setCommits(inCommits);
								}
						
								// Make sur we fetech all the data we need before rendering
								responseCount++;
								if (responseCount === expectedResponses) {
									manager.next(integrationsArray);
								}
							}.bind(this);
					
							// if we already have commits
							if (integration.getCommits() !== null) {
								responseCount++;
							}
							else {
								// if not then let's query the server
								xcs_proxy().getCommitsForIntegration(integrationId, callback, errback);
							}
						}
					
						if (expectedResponses === responseCount) {
							manager.next(integrationsArray);
						}
					
					})(i);
				}
			}
			else {
				manager.next(integrationsArray);
			}
		});
		
		
		dispatch_async(this.mBigScreenQueue, function(manager) {
			var integrationsArray = (manager && manager.data && manager.data[0]);
			var expectedResponses = 0;
			var responseCount = 0;
			
			if (integrationsArray !== undefined && integrationsArray !== null && integrationsArray.length) {
				for (var i = 0; i < integrationsArray.length; i++) {
					(function(i) {
						var integration = integrationsArray[i];
					
						// and that intgegration has reached the triggers step
						if (integration !== undefined && integration !== null && integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && integration.getResultDetails() === null) {
							var integrationId = integration.getId();
							expectedResponses++;
				
							var errback = function() {
								responseCount++;
								if (responseCount === expectedResponses) {
									manager.next(integrationsArray);
								}
							};
				
							var callback = function(inIssues) {
								if (inIssues !== undefined) {
									integration.setResultDetails(inIssues);
								}
								responseCount++;
								if (responseCount === expectedResponses) {
									manager.next(integrationsArray);
								}
							}.bind(this);
					
							// if we already have commits
							if (integration.getResultDetails() !== null) {
								responseCount++;
							}
							else {
								// if not then let's query the server
								xcs_proxy().getIssuesForIntegration(integrationId, callback, errback);
							}
						}
				
						if (expectedResponses === responseCount) {
							manager.next(integrationsArray);
						}
					})(i);
				}
			}
			else {
				manager.next(integrationsArray);
			}
		});
	},
	getRunningIntegrations: function() {
		dispatch_async(this.mBigScreenQueue, function(manager) {
			var integrationsArray = manager && manager.data && manager.data[0];
			
			var callback = function(inIntegrations) {
				manager.next(integrationsArray, inIntegrations)
			}
			var errBack = function() {
				manager.next(integrationsArray, []);
			}
			
			xcs_proxy().getRunningIntegrations(callback, errBack);
		}.bind(this));
		
		dispatch_async(this.mBigScreenQueue, function(manager) {
			var integrationsArray = manager && manager.data && manager.data[0];
			var inRunningIntegrations = manager && manager.data && manager.data[1];
			var loopCount = inRunningIntegrations.length;
			var count = 0;
			
			if (inRunningIntegrations.length > 0) {
				for (var i = 0; i < inRunningIntegrations.length; i++) {
					(function(i) {
						var integrationUpdate = inRunningIntegrations[i];
						var integrationId = integrationUpdate && integrationUpdate._id;
						var botId = integrationUpdate && integrationUpdate.bot && integrationUpdate.bot._id;
						var currentStep = integrationUpdate && integrationUpdate.currentStep;
						
						var errback = function() {
							count++;
							if (count == loopCount) {
								manager.next(integrationsArray);
							}
						};
	
						var callback = function(inIntegration) {
							if (inIntegration !== undefined) {
								
								for (var j = 0; j < integrationsArray.length; j++) {
									var nonFatalIntegration = integrationsArray[j];
									if (nonFatalIntegration.getBotId() === botId) {
										nonFatalIntegration.setForceRunning(true);
										integrationsArray[j] = nonFatalIntegration;
									}
								}
								
								count++;
								if (count == loopCount) {
									manager.next(integrationsArray);
								}
							}
						}.bind(this);
						
						
						if (currentStep === XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING || currentStep === XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) {
							count++;
							if (count == loopCount) {
								manager.next(integrationsArray);
							}
						}
						else {
							if (integrationId !== null && integrationId !== undefined) {
								xcs_proxy().getIntegration(integrationId, callback, errback);
							}
							else {
								count++;
								if (count == loopCount) {
									manager.next(integrationsArray);
								}
							}
						}
					}.bind(this))(i);
				}
			}
			else {
				manager.next(integrationsArray);
			}
		}.bind(this));
	}
});
// Copyright (c) 2009-2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.






XCS.BigScreen.Routes = XCS.BigScreen.Routes || new Object();

XCS.BigScreen.Routes.XCODE_BIG_SCREEN_ROUTE = "/xcode/bigscreen" + XCS.Routes.TrailingSlashOptionalQueryParam;

var GlobalBotRunActivityStreamSharedInstance;
var bigscreen = null;

XCS.BigScreen.Application = Class.create(XCS.Application, {
	mApplicationIdentifier: "xcs",
	createApplication: function($super) {
		$super();
		
		var url = "http://%@:20399".fmt(document.domain);
		this.mActivityStream = new XCS.ActivityStream.Socket({mURL: url});
		
		// Route the initial request.
		this.routeInitialRequestAfterRender();
	},
	bigScreenControllerRoute: function(inRouteInvocation) {
		bigScreen = new XCS.BigScreen.BigScreenController();
		bigScreen.configure(inRouteInvocation);
	},
	computeRoutes: function() {
		return [
			[XCS.BigScreen.Routes.XCODE_BIG_SCREEN_ROUTE, this.bigScreenControllerRoute]
		];
	}
});


// Warn about disabled cookies.
if (!navigator.cookieEnabled) {
	alert("_Cookies.NoCookiesUnsupported".loc());
}

// Called once the document object is available.

var d;
document.observe("dom:loaded", function() {
	d = document;
	// Signal any shared instances and delegates to be created.
	globalNotificationCenter().publish('PAGE_INITIALIZE_FINISHED', document);
});

if (typeof(testEnv) === "undefined") {
	new XCS.BigScreen.Application();
}
;

