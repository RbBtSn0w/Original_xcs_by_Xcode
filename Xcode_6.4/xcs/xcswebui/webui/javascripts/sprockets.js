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

XCS.WebUI = XCS.WebUI || new Object();
XCS.WebUI.Views = XCS.WebUI.Views || new Object();
XCS.WebUI.Utils = XCS.WebUI.Utils || new Object();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['bot_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"xcs-webui-bot-list-container\">\n	<div id=\"xcs-webui-bot-list-container-relative\">\n		<div id=\"xcs-webui-bot-list-loading\">\n			<div id=\"xcs-webui-bot-list-loading-spinner\" class=\"xcs-webui-loading-spinner\"></div>\n		</div>\n		<div id=\"xcs-webui-bot-list-overlay\"></div>\n		<div id=\"xcs-webui-bot-list\"></div>\n	</div>\n</div>";
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['bot_list_item'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"xcs-webui-bot-list-item\">\n	<div class=\"xcs-webui-bot-list-item-title-container\">\n		<div class=\"xcs-webui-bot-list-item-title-label\">\n			";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n			<div class=\"xcs-webui-bot-list-item-spinner-container\">\n				<div class=\"xcs-webui-bot-list-item-spinner xcs-webui-loading-spinner\"></div>\n			</div>\n		</div>\n	</div>\n	<a href=\"/xcode/bots/";
  if (helper = helpers.filter) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.filter); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"xcs-webui-bot-list-item-labels-container xcs-routable\" data-push-state=\"true\">\n		<div class=\"xcs-webui-bot-list-item-loading-container\">\n			<div class=\"xcs-webui-bot-list-item-loading-spinner xcs-webui-loading-spinner\"></div>\n		</div>\n		<div class=\"xcs-webui-bot-list-item-empty-container\">\n			<div class=\"xcs-webui-bot-list-item-empty-label\"></div>\n		</div>\n		<div class=\"xcs-webui-bot-list-item-name-container\">\n			<div class=\"xcs-webui-bot-list-item-name\">";
  if (helper = helpers.integration_number) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.integration_number); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		</div>\n		<div class=\"xcs-webui-bot-list-item-time\">";
  if (helper = helpers.time) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.time); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		<div class=\"xcs-webui-bot-list-item-status\"></div>\n	</a>\n</div>";
  return buffer;
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['bot_summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id='xcs-webui-bot-summary'>\n	<div id=\"xcs-webui-bot-summary-relative-container\">\n		<div id=\"xcs-webui-bot-summary-scrolling-container\">\n			<div id=\"xcs-webui-integration-top-summary-container\">\n				<div id=\"xcs-webui-integration-app-icon\"></div>\n				<div id=\"xcs-webui-integration-build-context\">\n					<div id=\"xcs-webui-integration-bot-name\"></div>\n					<div id=\"xcs-webui-integration-build-most-recent-time\"></div>\n					<div id=\"xcs-webui-integration-build-size\"></div>\n					<div id=\"xcs-webui-integration-build-badges-container\">\n						<div id=\"xcs-webui-integration-build-ios-badge\" class=\"badge\">";
  if (helper = helpers.ios_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ios_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n						<div id=\"xcs-webui-integration-build-mac-badge\" class=\"badge\">";
  if (helper = helpers.mac_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.mac_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n						<a id=\"xcs-webui-integration-build-download-logs\">\n							";
  if (helper = helpers.download_logs_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.download_logs_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n							<div class=\"xcs-webui-download-arrow\"></div>\n						</a>\n						<a id=\"xcs-webui-integration-build-open-xcode\">\n							";
  if (helper = helpers.open_xcode_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.open_xcode_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n							<div class=\"xcs-webui-download-arrow\"></div>\n						</a>\n						<div id=\"xcs-webui-integration-build-profile-badge\" class=\"badge\">";
  if (helper = helpers.install_profile_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.install_profile_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n						<div id=\"xcs-webui-integration-build-install-badge\" class=\"badge\">";
  if (helper = helpers.install_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.install_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n						<div id=\"xcs-webui-integration-mac-downloads-container\">\n							<a id=\"xcs-webui-integration-build-archive-badge\" class=\"badge\">";
  if (helper = helpers.archive_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.archive_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n							<a id=\"xcs-webui-integration-build-product-badge\" class=\"badge\">";
  if (helper = helpers.product_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.product_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n						</div>\n					</div>\n					<div id=\"xcs-webui-integration-build-flag\"></div>\n				</div>\n			</div>\n			<div class=\"xcs-webui-summary-title-container\">\n				<div class=\"xcs-webui-summary-title-label\">";
  if (helper = helpers.summary_result_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summary_result_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			</div>\n			<div id=\"xcs-webui-summary-integration-status\">\n				<div id=\"xcs-webui-integration-status-spinner\" class=\"xcs-webui-loading-spinner\"></div>\n				<div id=\"xcs-webui-summary-integration-status-container\"></div>\n			</div>\n			<div id=\"xcs-webui-summary-contributor-title-container\" class=\"xcs-webui-summary-title-container\">\n				<div class=\"xcs-webui-summary-title-label\">";
  if (helper = helpers.contributor_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.contributor_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			</div>\n			<div id=\"xcs-webui-integration-commits-container\">\n				<div id=\"xcs-webui-integration-commits-empty-label\">";
  if (helper = helpers.no_commits_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.no_commits_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n				<div id=\"xcs-webui-integration-commits-spinner\" class=\"xcs-webui-loading-spinner\"></div>\n				<div id=\"xcs-webui-integration-contributors-container\"></div>\n			</div>\n		</div>\n	</div>\n</div>";
  return buffer;
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
    + "\"></div>\n	<div class=\"xcs-webui-contributors-circle-diamond\"></div>\n</div>";
  return buffer;
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"xcs-webui-header-container\">\n	<div id=\"xcs-webui-header-relative-container\">\n		<div id=\"xcs-webui-header-bot-list-container\">\n			<div id=\"xcs-webui-sign-out-container\">\n				<a id=\"xcs-webui-sign-out-button\">";
  if (helper = helpers.log_out_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.log_out_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n				<a id=\"xcs-webui-sign-in-button\">";
  if (helper = helpers.log_in_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.log_in_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n			</div>\n			<div id=\"xcs-webui-header-filter-label-container\">\n				<div id=\"xcs-webui-header-filter-label-arrow\"></div>\n				<div id=\"xcs-webui-header-filter-label\">";
  if (helper = helpers.filter_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.filter_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			</div>\n			<a id=\"xcs-webui-bigscreen-button\" href=\"/xcode/bigscreen\">";
  if (helper = helpers.big_screen_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.big_screen_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n		</div>\n		<div id=\"xcs-webui-header-bot-summary-container\">\n			<a id=\"xcs-webui-back-button\" href=\"\" class=\"xcs-routable\" data-push-state=\"true\">\n				<div id=\"xcs-webui-back-button-arrow\"></div>\n				<div id=\"xcs-webui-back-button-label\">";
  if (helper = helpers.back_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.back_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			</a>\n			<div id=\"xcs-webui-header-bot-name\"></div>\n		</div>\n	</div>\n</div>";
  return buffer;
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['integrations_filter'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<a href=\"/xcode/bots/";
  if (helper = helpers.filter_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.filter_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"xcs-webui-bot-filter-item xcs-routable\" data-push-state=\"true\" data-filter-name=\"";
  if (helper = helpers.item_filter_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.item_filter_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n				<div class=\"xcs-webui-bot-filter-item-checkbox\"></div>\n				<div class=\"xcs-webui-bot-filter-item-label\">";
  if (helper = helpers.item_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.item_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			</a>\n			";
  return buffer;
  }

  buffer += "<div id=\"xcs-webui-header-filter-items-container\">\n	<div id=\"xcs-webui-header-filter-items-relative-container\">\n		<div id=\"xcs-webui-bot-filter-container-tip\"></div>\n		<div id=\"xcs-webui-bot-filter-item-title-container\">\n			<div id=\"xcs-webui-header-filter-item-background-blur\"></div>\n			<div id=\"xcs-webui-header-filter-item-cancel-button\">";
  if (helper = helpers.cancel_button) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.cancel_button); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			<div id=\"xcs-webui-bot-filter-item-title\">";
  if (helper = helpers.header_filter_label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.header_filter_label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		</div>\n		<div id=\"xcs-webui-bot-filter-items-touch-container\">\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.filter_item), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n</div>";
  return buffer;
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['no_bots_placeholder'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id='xcs-webui-no-bots-placeholder'>\n	<div id='xcs-webui-no-bots-container'>\n		<div id='xcs-webui-no-bots-icon'></div>\n		<div id='xcs-webui-no-bots-first-line'>";
  if (helper = helpers.no_bots_configured) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.no_bots_configured); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		<div id='xcs-webui-no-bots-second-line-container'>\n			<span id='xcs-webui-not-bots-create-new-bot'>";
  if (helper = helpers.create_new_bot) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.create_new_bot); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n			<a href='https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/xcode_guide-continuous_integration/ConfigureBots/ConfigureBots.html' target='_blank' id='xcs-webui-not-bots-create-new-bot-link'>\n				<div id='xcs-webui-not-bots-create-new-bot-link-icon'></div>\n			</a>\n		</div>\n	</div>\n</div>";
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

XCS.WebUI.Views.StatusCircle = Class.create(XCS.Mvc.View, {
	mClassName: null,
	mDimension: null,
	mCirle: null,
	mBackgroundCircle: null,
	mCount: null,
	mChangeCount: null,
	mRadius: null,
	mTotal: null,
	mPage: null,
	mChangeCounts: [],
	mChangeCountsUpdated: null,
	initialize: function($super, inParams) {
		if (inParams === undefined) {
			var inParams = {};
		}
		
		$super();
		this.mClassName = (inParams['class_name'] || "");
		this.mColor = (inParams['color'] || "#000");
		this.mValue = (inParams['value'] !== undefined ? inParams['value'] : null);
		this.mChangeValueUp = (inParams['change_value_up'] || null);
		this.mChangeValueDown = (inParams['change_value_down'] || null);
		this.mTotal = (inParams['total'] !== undefined ? inParams['total'] : null);
		this.mStrokeWidth = (inParams['strokeWidth'] || 1.5);;
		this.mBackground = (inParams['background'] || true);
		this.mBaseBackgroundColor = "#E8E8E8";
		this.mBackgroundColor = (inParams['background_color'] || this.mBaseBackgroundColor);
		this.mValueBackgroundColor = (inParams['value_background_color'] || null);
		this.mTemplate = this.getTemplate('status_circle');
		this.mLabel = (inParams['label'] || null);
		this.mChangeCounts = [];
		this.mChangeCountsUpdated = false;
	},
	render: function() {
		var elem = this.renderTemplate({
			class_name: this.mClassName,
			id: this.Id
		});
		this.createCircle(elem);
		return elem;
	},
	createCircle: function(inElem) {
		if (inElem !== undefined) {
			var dimension = 200;
			this.mPage = Raphael(inElem, "100%", "100%");
			this.mPage.setViewBox(0, 0, dimension, dimension);
			var positionStart = dimension / 2;
			var positionX = dimension / 2;
			
			if (this.mLabel !== null) {
				var positionY = (dimension / 2) - ((dimension / 2) * 0.3);
				this.mRadius = (positionStart - 2) * 0.7;
			} 
			else {
				var positionY = dimension / 2;
				this.mRadius = positionStart - 2;
			}
			
			var params = {
				stroke: this.mColor,
				"stroke-width": this.mStrokeWidth + "px"
			}
			
			var countFontSize = 63;
			var countPosition = 63
			if (this.mValue !== null) {
				var digits = this.mValue.toString().length;
				if (digits == 4) {
					countFontSize = 63;
					countPosition = 63;
				} else if (digits == 5) {
					countFontSize = 63;
					countPosition = 60;
				} else {
					countFontSize = 55;
					countPosition = 60;
				}
			}
			
			if (this.mLabel !== null) {
				this.mPage.text(100, 85, this.mLabel).attr({"font-size": 16, "font-family": "HelveticaNeue-Light", fill: "#4a4a4a"});
				this.mCount = this.mPage.text(100, 43, "").attr({"font-size": 58, "font-family": "Helvetica Neue", "font-weight": "100"});
			}
			else {
				this.mCount = this.mPage.text(100, countPosition, "").attr({"font-size": countFontSize, "font-family": "HelveticaNeue-Light"});
			}
			
			if (this.mValue === null) {
				this.mCount.attr({"text": "-"});
			}
			else {
				this.mCount.attr({"text": this.mValue.toString().escapeHTML()});
			}
			
			this.mPage.customAttributes.arc = function (value, total, R) {
				var alpha = 360 / total * value;
				var a = (90 - alpha) * Math.PI / 180;
				var x = positionX + this.mRadius * Math.cos(a);
				var y = positionY - this.mRadius * Math.sin(a);
				var path;
				if (total == value) {
					path = [["M", positionX, positionY - this.mRadius], ["A", R, R, 0, 1, 1, (positionX - 0.1), positionY - this.mRadius]];
				} else {
					path = [["M", positionX, positionY - this.mRadius], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
				}
				return {path: path};
			}.bind(this);
			
			if (this.mBackground) {
				this.mBackgroundCircle = this.mPage.circle(positionX, positionY, this.mRadius).attr({stroke: this.mBackgroundColor, "stroke-width": (this.mStrokeWidth/2)+"px"});
			}
			
			this.mCirle = this.mPage.path().attr(params).attr({arc: [0, 100, this.mRadius]});
			this.updateValue();
		}
	},
	setValue: function(inValue, inTotal, inChangeValueUp, inChangeValueDown) {
		var hasBeenUpdated = false;
		this.mChangeCountsUpdated = false;
		
		if (inValue !== undefined && this.mValue !== inValue) {
			if (inTotal !== undefined) {
				this.mTotal = inTotal;
			}
			else {
				this.mTotal = null;
			}
			
			this.mValue = inValue;
			hasBeenUpdated = true;
		}
		
		if ((inChangeValueUp !== this.mChangeValueUp) || (inChangeValueDown !== this.mChangeValueDown)) {
			if ((inChangeValueUp !== undefined) && (inChangeValueUp !== 0) && (inChangeValueUp !== null)) {
				this.mChangeCountsUpdated = true;
				this.mChangeValueUp = inChangeValueUp;
			}
			else if (inChangeValueUp === null) {
				this.mChangeCountsUpdated = false;
			}
			else {
				this.mChangeCountsUpdated = true;
				this.mChangeValueUp = null;
			}
			
			if ((inChangeValueDown !== undefined) && (inChangeValueDown !== 0) && (inChangeValueDown !== null)) {
				this.mChangeCountsUpdated = true;
				this.mChangeValueDown = inChangeValueDown;
			}
			else if (inChangeValueDown === null) {
				this.mChangeCountsUpdated = false;
			}
			else {
				this.mChangeCountsUpdated = true;
				this.mChangeValueDown = null;
			}
			hasBeenUpdated = true;
		}
		
		if (inValue === undefined) {
			this.reset();
		}
		else if (hasBeenUpdated) {
			this.updateValue(true);
		}
	},
	updateValue: function(inUpdatePosition) {
		if (this.mValue !== null && this.mCirle !== null) {
			
			if (inUpdatePosition !== undefined && inUpdatePosition) {
				var digits = this.mValue.toString().length;
				if (this.mLabel !== null) {
					var countFontSize = 54;
					var countPosition = 69;
				
					if (digits < 4) {
						countFontSize = 54;
						countPosition = 69;
					} else if (digits == 4) {
						countFontSize = 53;
						countPosition = 67;
					} else if (digits == 5) {
						countFontSize = 44;
						countPosition = 65;
					} else {
						countFontSize = 40;
						countPosition = 63;
					}
				}
				else {
					var countFontSize = 63;
					var countPosition = 100;
			
					if (digits == 4) {
						countFontSize = 63;
						countPosition = 100;
					} else if (digits == 5) {
						countFontSize = 63;
						countPosition = 100;
					} else {
						countFontSize = 55;
						countPosition = 100;
					}
				}
				
				this.mCount.attr({y: countPosition});
			}
			
			var renderedValue = 100;
			if (this.mTotal !== null) {
				renderedValue = this.mValue / this.mTotal * 100;
				
				if (renderedValue < 5) {
					renderedValue = 5;
				}
				
				if (this.mValueBackgroundColor !== null) {
					this.mBackgroundCircle.attr({stroke: this.mValueBackgroundColor});
				}
			}
			else {
				if (this.mValueBackgroundColor !== null) {
					this.mCirle.attr({stroke: this.mValueBackgroundColor});
				}
			}
			
			if (this.mLabel !== null) {
				
				var textNodes = [];
				if (this.mChangeValueUp !== null) {
					var changeText = "";
					if (this.mChangeValueUp > 0) {
						changeText = "+%@".fmt(this.mChangeValueUp.toString().escapeHTML());
						textNodes.push({
							color: this.mColor,
							text: changeText
						});
					}
					if (this.mChangeValueUp < 0) {
						changeText = "%@".fmt(this.mChangeValueUp.toString().escapeHTML());
						textNodes.push({
							color: '#BBB',
							text: changeText
						});
					}
				}
				
				if (this.mChangeValueDown !== null) {
					
					if (this.mChangeValueUp !== null) {
						var changeText = "|";
						textNodes.push({
							color: '#BBB',
							text: changeText
						});
					}
					
					var changeText = "";
					if (this.mChangeValueDown > 0) {
						changeText = "-%@".fmt(this.mChangeValueDown.toString().escapeHTML());
					}
					if (this.mChangeValueDown < 0) {
						changeText = "%@".fmt(this.mChangeValueDown.toString().escapeHTML());
					}
					textNodes.push({
						color: '#BBB',
						text: changeText
					});
				}
				
				if (this.mChangeValueUp === null && this.mChangeValueDown === null && this.mChangeCountsUpdated === true) {
					textNodes.push({
						color: '#BBB',
						text: "_XCS.BotDetail.Summary.Label.NoChange".loc().titleCase()
					});
				}
				
				var x = 0;
				var y = 185;
				var maxBox = 0;
				var midBox = 0;
				var nodeSizes = [];
				
				for (var j = 0; j < this.mChangeCounts.length; j++) {
					this.mChangeCounts[j].node.remove();
				}
				
				for (var i = 0; i < textNodes.length; i++) {
					var textNode = textNodes[i];
					var node = this.mPage.text(x, y, textNode.text);
					this.mChangeCounts[i] = node.attr({
						'text-anchor': 'start',
						'font-size' : 14,
						'font-family': 'HelveticaNeue-Light'
					});
					
					if (node.getBBox().width > maxBox) {
						nodeSizes.push(node.getBBox().width);
						maxBox = node.getBBox().width;
					}
					
					if (i === 1) {
						midBox = node.getBBox().width;
					}
				}
				
				if (midBox !== 0) {
					x = (2 * maxBox) + midBox + (2 * 4);
				}
				else {
					x = maxBox;
				}
				
				x = 100 - (x / 2);
				for (var j = 0; j < this.mChangeCounts.length; j++) {
					this.mChangeCounts[j].node.remove();
				}
				
				for (var i = 0; i < textNodes.length; i++) {
					var textNode = textNodes[i];
					var nodeWidth = maxBox;
					var currentNodeWidth = nodeSizes[i];
					var nodeDiffWidth = 0;
					
					if (i === 0 && currentNodeWidth < maxBox) {
						nodeDiffWidth = maxBox - currentNodeWidth; 
						nodeWidth = currentNodeWidth;
					}
					
					x = x + nodeDiffWidth;
					
					var node = this.mPage.text(x, y, textNode.text);
					
					this.mChangeCounts[i] = node.attr({
						'text-anchor': 'start',
						'font-size' : 14,
						'fill' : textNode.color,
						'font-family': 'HelveticaNeue-Light'
					});
					
					if (i == 1) {
						nodeWidth = midBox;
					}
					x = x + nodeWidth + 4;
				}
			}
			
			this.mCount.attr({"text": this.mValue.toString().escapeHTML()});
			this.mCirle.animate({arc: [renderedValue, 100, this.mRadius]}, 500, "<");
		}
	},
	reset: function() {
		if (this.mValue !== null) {
			this.mValue = null;
			this.mTotal = null;
			this.mChangeValue = null;
			for (var j = 0; j < this.mChangeCounts.length; j++) {
				this.mChangeCounts[j].node.remove();
			}
			this.mCount.attr({x: 100, y: 65, "text": "-"});
			this.mBackgroundCircle.attr({stroke: this.mBackgroundColor});
			this.mCirle.animate({arc: [0, 100, this.mRadius]}, 500, "<");
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

XCS.WebUI.Views.ContributorCircle = Class.create(XCS.Mvc.View, {
	mClassName: null,
	mDimension: null,
	mCirle: null,
	mCount: null,
	mRadius: null,
	mSelected: false,
	initialize: function($super, inParams) {
		if (inParams === undefined) {
			var inParams = {};
		}
		
		$super();
		this.mClassName = (inParams['class_name'] || "");
		this.mColor = (inParams['color'] || "#000");
		this.mValue = (inParams['value'] || null);
		this.mBackground = (inParams['background'] || true);
		this.mBackgroundColor = (inParams['background_color'] || "#CCC");
		this.mTemplate = this.getTemplate('contributors_circle');
		this.mLabel = (inParams['label'] || null);
		this.mPicture = (inParams['picture'] || null);
		this.mInitials = (inParams['initials'] || "");
		this.mContributorHash = (inParams['contributor_hash'] || "");
		
	},
	render: function() {
		var elem = this.renderTemplate({
			class_name: this.mClassName,
			id: this.Id,
			contributor_hash: this.mContributorHash
		});
		this.createCircle(elem);
		
		Event.observe(elem, 'click', this.handleCircleClicked.bind(this));
		return elem;
	},
	createCircle: function(inElem) {
		if (inElem !== undefined) {
			var elem = inElem.querySelector('.xcs-webui-contributors-circle');
			var dimension = 50;
			var page = Raphael(elem, "100%", "100%");
			page.setViewBox(0, 0, dimension, dimension);
			var positionStart = dimension / 2;
			var positionX = dimension / 2;
			
			if (this.mLabel !== null) {
				var positionY = (dimension / 2) - ((dimension / 2) * 0.2);
				this.mRadius = (positionStart - 2) * 0.8;
			} 
			else {
				var positionY = dimension / 2;
				this.mRadius = positionStart - 2;
			}
			
			var params = {
				stroke: this.mColor,
				"stroke-width": "1.5px"
			}
			
			if (this.mLabel !== null) {
				page.text(25, 23.5, this.mLabel).attr({"font-size": 6, "font-family": "HelveticaNeue-Light", fill: "#535353"});
			}
			
			page.customAttributes.arc = function (value, total, R) {
				var alpha = 360 / total * value;
				var a = (90 - alpha) * Math.PI / 180;
				var x = positionX + this.mRadius * Math.cos(a);
				var y = positionY - this.mRadius * Math.sin(a);
				var path;
				if (total == value) {
					path = [["M", positionX, positionY - this.mRadius], ["A", R, R, 0, 1, 1, (positionX - 0.1), positionY - this.mRadius]];
				} else {
					path = [["M", positionX, positionY - this.mRadius], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
				}
				return {path: path};
			}.bind(this);
			
			if (this.mBackground) {
				page.circle(positionX, positionY, this.mRadius).attr({stroke: "#E8E8E8", "stroke-width": "1.5px"});
			}
			
			if (this.mPicture !== null && this.mPicture != "") {
				// page.circle(positionX, positionY, this.mRadius-7).attr({"stroke-width": 0, fill: "url('"+this.mPicture+"')"});
				var circle = page.circle(positionX, positionY, this.mRadius-1.5).attr({"stroke-width": 0});
				var uuid = Raphael.createUUID();
				var pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
				var backgroundImage = page.image();

				pattern.setAttribute("id", uuid);
				pattern.setAttribute("x", 0);
				pattern.setAttribute("y", 0);
				pattern.setAttribute("height", 1);
				pattern.setAttribute("width", 1);
				pattern.setAttribute("patternContentUnits", "objectBoundingBox");
				
				backgroundImage.node.setAttribute("x", 0);
				backgroundImage.node.setAttribute("y", 0);
				backgroundImage.node.setAttribute("width", 1);
				backgroundImage.node.setAttribute("height", 1);
				backgroundImage.node.setAttribute("preserveAspectRatio", "none");
				backgroundImage.node.setAttribute("href", this.mPicture);
				
				pattern.appendChild(backgroundImage.node);
				page.defs.appendChild(pattern);
				circle.node.setAttribute("fill", "url(#"+pattern.id+")");
			}
			else {
				page.circle(positionX, positionY, this.mRadius-1.5).attr({"stroke-width": 0, fill: "#c0c0c0"});
				page.text(25, 12.8, this.mInitials).attr({"font-size": 15, "font-family": "Helvetica Neue", "font-weight": "100", fill: "#FFF"});
			}
			this.mCirle = page.path().attr(params).attr({arc: [0, 100, this.mRadius]});
			
			this.updateValue();
		}
	},
	setValue: function(inValue) {
		if (inValue !== undefined) {
			this.mValue = inValue;
			this.updateValue();
		}
	},
	updateValue: function() {
		if (this.mValue !== null && this.mCirle !== null) {
			this.mCirle.animate({arc: [this.mValue, 100, this.mRadius]}, 500, "<");
		}
	},
	handleCircleClicked: function(inEvent) {
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_CONTRIBUTOR_CIRCLE_CLICKED, this, {contributorHash: this.mContributorHash});
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

XCS.WebUI.Views.IntegrationsPaginatingListView = Class.create(XCS.Mvc.View, {
	mPaginationPosition: null,
	mPaginationChunkSize: null,
	mPaginationHasMore: null,
	mLoadMoreNode: null,
	mScrollingContainer: null,
	mScrollingContainerNodeSelector: null,
	mIntegrationsKeys: {},
	mBotId: null,
	mIsPullingForIntegrations: null,
	mTemplateData: null,
	mIntegrationListItemView: null,
	initialize: function($super) {
		$super()
		this.mPaginationPosition = null;
		this.mPaginationChunkSize = 10;
		this.mPaginationHasMore = false;
		this.mIsPullingForIntegrations = false;
		this.mBotId = null;
		if (this.mScrollingContainerNodeSelector === null) {
			this.mScrollingContainerNodeSelector = '.xcs-webui-bot-integrations-item-container';
		}
		this.mIntegrationsKeys = {};
		this.mActive = false;
	},
	render: function() {
		var elem = this.renderTemplate(this.mTemplateData);
		
		this.mLoadMoreNode = elem.querySelector('.xcs-webui-bot-integrations-item-load-more');
		this.mScrollingContainer = elem.querySelector(this.mScrollingContainerNodeSelector);
		this.listenForScrollEvents();
		return elem;
	},
	reset: function(inBot) {
		if (inBot !== undefined && inBot.getId() !== this.mBotId) {
			this.mBotId = inBot.getId();
			this.mPaginationPosition = null;
			this.clear();
			this.addIntegrations(inBot);
		}
	},
	addIntegrations: function(inBot) {
		if (inBot !== undefined && inBot.getId() !== this.mBotId) {
			this.reset(inBot);
			return;
		}
		
		var integrations = inBot.getIntegrations();
		var integrationsArray = [];
		
		if (integrations !== undefined && integrations !== null) {
				if (Object.keys(integrations).length) {
				for (var key in integrations) {
					var integration = integrations[key];
					integrationsArray.push(integration);
				}
			}

			integrationsArray.sort(function(a, b) {
				return b.getIntegrationNumber() - a.getIntegrationNumber();
			});

			for (var i = 0; i < integrationsArray.length; i++) {
				var integration = integrationsArray[i];
				if (this.mIntegrationsKeys[integration.getId()] === undefined) {
					this.addIntegration(integration);
				}
			}

			if (this.isLoadMoreVisible()) {
				this.handleContainerHasScrolled();
			}

			if (inBot.hasMoreIntegrations()) {
				this.mLoadMoreNode.classList.add('active');
			}
			else {
				this.mLoadMoreNode.classList.remove('active');
			}
		}
	},
	addIntegration: function(inIntegration, inToTheTop) {
		if (inIntegration !== undefined && inIntegration !== null) {
			this.mIntegrationsKeys[inIntegration.getId()] = null;
			if ((this.mPaginationPosition === null) || (inIntegration.getIntegrationNumber() <= this.mPaginationPosition)) {
				this.mPaginationPosition = inIntegration.getIntegrationNumber() - 1;
			}
			var integrationItem = new this.mIntegrationListItemView(inIntegration);
			if (inToTheTop !== undefined && inToTheTop) {
				this.addSubview(integrationItem, '.xcs-webui-bot-integrations-item-container', true);
			}
			else {
				this.addSubview(integrationItem, '.xcs-webui-bot-integrations-item-container', 'before', '.xcs-webui-bot-integrations-item-load-more');
			}
			
			if (this.mPaginationPosition !== 0) {
				this.listenForScrollEvents();
			}
		}
	},
	updateIntegration: function(inBot, inIntegration) {
		if (inBot !== undefined && inBot.getId() === this.mBotId) {
			var foundSubView = false;
			for (var i = 0; i < this.mSubviews.length; i++) {
				var subView = this.mSubviews[i];
				if (subView instanceof this.mIntegrationListItemView && inIntegration.getId() == subView.getIntegration().getId()) {
					foundSubView = true;
					subView.update(inIntegration);
				}
			}
			if (!foundSubView) {
				this.addIntegration(inIntegration, true)
			}
		}
	},
	clear: function() {
		this.mSubViews = [];
		this.mIntegrationsKeys = {};
		var integrationsItemRow = this.mParentElement.querySelectorAll('.xcs-webui-bot-integrations-item-container .xcs-webui-bot-integrations-item-row');
		for (var i = 0; i < integrationsItemRow.length; i++) {
			var integrationRow = integrationsItemRow[i];
			integrationRow.remove();
		}
	},
	getPaginationPosition: function() {
		return this.mPaginationPosition;
	},
	resetPaginationPosition: function() {
		this.mPaginationPosition = null;
	},
	getPaginationChunkSize: function() {
		return this.mPaginationChunkSize;
	},
	setPaginationHasMore: function(inValue) {
		if (inValue !== undefined) {
			this.mPaginationHasMore = inValue;
		}
	},
	handleContainerHasScrolled: function() {
		if (this.isLoadMoreVisible() && !this.mIsPullingForIntegrations) {
			this.stopListeningForScrollEvents();
			if (this.mPaginationPosition !== 0) {
				globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_LOAD_MORE_INTEGRATIONS, this);
			}
		}
	},
	isLoadMoreVisible: function() {
		var containerHeight = this.mScrollingContainer.getBoundingClientRect().height;
		var loadMorePosition = this.mLoadMoreNode.getBoundingClientRect().top - this.mScrollingContainer.getBoundingClientRect().top;
		
		if (loadMorePosition < containerHeight) {
			return true;
		}
		else {
			return false;
		}
	},
	listenForScrollEvents: function() {
		this.mIsPullingForIntegrations = false;
		Event.observe(this.mScrollingContainer, 'scroll', this.handleContainerHasScrolled.bind(this))
	},
	stopListeningForScrollEvents: function() {
		this.mIsPullingForIntegrations = true;
		Event.stopObserving(this.mScrollingContainer, 'scroll')
	}
})
;
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

XCS.WebUI.NOTIFICATION_CONTRIBUTOR_CIRCLE_CLICKED = "CONTRIBUTOR_CIRCLE_CLICKED";
XCS.WebUI.NOTIFICATION_INTEGRATION_ITEM_DOWNLOAD_POPUP_GEAR_CLICKED = "INTEGRATION_ITEM_DOWNLOAD_POPUP_GEAR_CLICKED";
XCS.WebUI.NOTIFICATION_WINDOW_HAS_BEEN_CLICKED = "WINDOW_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_LOAD_MORE_INTEGRATIONS = "LOAD_MORE_INTEGRATIONS";
XCS.WebUI.NOTIFICATION_INTEGRATION_FLAG_HAS_BEEN_CLICKED = "INTEGRATION_FLAG_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_INTEGRATION_SET_FLAG_HAS_FAILED = "INTEGRATION_SET_FLAG_HAS_FAILED";
XCS.WebUI.NOTIFICATION_SIGNOUT_HAS_BEEN_CLICKED = "SIGNOUT_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_SIGNIN_HAS_BEEN_CLICKED = "SIGNIN_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_FILTER_BUTTON_HAS_BEEN_CLICKED = "FILTER_BUTTON_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED = "FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_INTEGRATE_NOW_HAS_BEEN_CLICKED = "INTEGRATE_NOW_HAS_BEEN_CLICKED"

XCS.WebUI.WebUIController = Class.create(XCS.Mvc.ViewController, {
	mQueue: null,
	mBotsDict: {},
	mBotIdsDict: {},
	mCurrentBotId: null,
	mCurrentBotTinyId: null,
	mCurrentIntegrationId: null,
	mRoutePattern: null,
	mSelectedFilter: null,
	mServerHostname: null,
	main: function($super) {
		// Create views
		this.botListView = new XCS.WebUI.Views.BotListView();
		this.noBotsPlaceholder = new XCS.WebUI.Views.NoBotsPlaceholderView();
		this.headerView = new XCS.WebUI.Views.Header();
		this.integrationsFilter = new XCS.WebUI.Views.IntegrationsFilter();
		this.integrationSummaryView = new XCS.WebUI.Views.BotSummaryView();
		this.mQueue = dispatch_queue_create('webui_controller', true);
		this.mCurrentBotId = null;
		this.mCurrentBotTinyId = null;
		this.mSelectedFilter = null;
		
		// Add views to main
		mainView.addSubview(this.headerView);
		mainView.addSubview(this.integrationsFilter);
		mainView.addSubview(this.botListView);
		mainView.addSubview(this.noBotsPlaceholder);
		mainView.addSubview(this.integrationSummaryView);
		
		if (browser().isMobile()) {
			XCS.setMeta('viewport', 'minimum-scale=1.0, maximum-scale=1, width=device-width, user-scalable=no');
		}
		
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_NEW_INTEGRATION_STATUS, this.handleIntegrationActivityStreamUpdate.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_REMOVED_STATUS, this.handleBotHasBeenRemoved.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_CREATED_STATUS, this.handleBotHasBeenCreated.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_UPDATED_STATUS, this.handleBotHasBeenUpdated.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_SIGNOUT_HAS_BEEN_CLICKED, this.handleSignOutHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_SIGNIN_HAS_BEEN_CLICKED, this.handleSignInHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_INTEGRATION_FLAG_HAS_BEEN_CLICKED, this.handleIntegrationFlagHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_INTEGRATE_NOW_HAS_BEEN_CLICKED, this.handleIntegrationNowHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_FILTER_BUTTON_HAS_BEEN_CLICKED, this.handleFilterButtonHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED, this.handleFilterCancelButtonHasBeenClicked.bind(this));
		
		// Register Handlebars Helper
		Handlebars.registerHelper('newLinesToHTML', XCS.Tools.newLinesToHTML);
	},
	load: function(inFilter, inBotTinyId, inRoutePattern) {
		// Make sur that the queue is ready
		if (dispatch_queue_size(this.mQueue) == 0) {
		    dispatch_resume(this.mQueue);
		}
		
		// save route pattern
		this.mRoutePattern = inRoutePattern;
		
		// Clean integrations view
		this.cleanIntegrationViews();
		
		// Update UI views based on route pattern
		this.setActiveView();
		
		// Set integrations views as loading
		this.setIntegrationViewsLoading();
		
		// If bot list is empty
		if (this.botListView && this.botListView.mSubviews && this.botListView.mSubviews.length == 0 && inBotTinyId === undefined) {
			this.mCurrentBotTinyId = null;
			this.getBots(inBotTinyId);
			this.renderBotsInBotList();
		} 
		
		// If filter
		switch(inFilter) {
			case XCS.BotFilter.INTEGRATION_FILTER_LATEST.toLowerCase():
			default:
				this.mSelectedFilter = XCS.BotFilter.INTEGRATION_FILTER_LATEST;
				break;
			case XCS.BotFilter.INTEGRATION_FILTER_FAILED.toLowerCase():
				this.mSelectedFilter = XCS.BotFilter.INTEGRATION_FILTER_FAILED;
				break;
			case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED.toLowerCase():
				this.mSelectedFilter = XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED;
				break;
			case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED.toLowerCase():
				this.mSelectedFilter = XCS.BotFilter.INTEGRATION_FILTER_FLAGGED;
				break;
		}
		
		// If bot list is full and we have a bot id
		if (inBotTinyId !== undefined) {
			// Get botId for tinyId
			var botId = null;
			this.mCurrentBotTinyId = inBotTinyId;
			if (this.mBotIdsDict[inBotTinyId] !== undefined) {
				botId = this.mBotIdsDict[inBotTinyId];
				
				// If bot is in the list
				if (this.mCurrentBotId !== botId && this.mBotsDict[botId] !== undefined) {
					this.mCurrentBotId = botId;
				}
				else if (this.mBotsDict[botId] == undefined){
					this.getBots();
					this.renderBotsInBotList();
				}
			}
			else {
				this.getBots();
				this.renderBotsInBotList();
			}
		}
		
		// Update views with bot data
		this.renderBots();
		
		// Check if user is currently loggued in
		this.getUserAuthStatus();
		
		// Get current version
		this.getServerVersion();
		
		// Get Server Hostname
		this.getServerHostname();
		
		// Update filter views
		this.updateFilterViews();
		
		// Get integrations based on current filter
		this.getFilteredIntegrationForBots();
		
		// Get running integrations
		this.getRunningIntegrations();
		
		// Get commits and issues
		this.getCommitsAndIssuesForFilteredIntegrations();
		
		// Close Filter menu 
		this.closeFilterMenu();

		// update bot list view with integration data
		this.renderIntegrationsInBotList();	
		
		if (this.mRoutePattern === XCS.WebUI.Routes.SLASH_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_INDEX_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_ROUTE || XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE) {
			
		}
		if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE) {
			// Update detail views with integration data
			this.renderIntegrations();
			
			// Update views with commits data
			this.renderCommitsAndIssues();
		}

		// Update window title
		this.updateWindowTitle();

		// Update routes
		dispatch_async(this.mQueue, function(manager) {
			globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
			manager.next();
		}.bind(this));
		
		dispatch_final(this.mQueue, function(manager) {
			logger().debug("Final queue item fired");
		});
	},
	handleIntegrationActivityStreamUpdate: function(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			var integrationId = (inParams && inParams._id);
			var botId = (inParams && inParams.botId);
			var currentStep = (inParams && inParams.currentStep);
			// if we have the params that we need
			if (typeof(integrationId) == "string" && typeof(botId) == "string") {
				if (dispatch_queue_size(this.mQueue) === 0) {
					dispatch_resume(this.mQueue);
				}
				
				if (this.mBotsDict[botId] === undefined) {
					// Get bot data
					this.getBotById(botId);
					// Add bot to list view
					this.renderBotInBotList(botId);
				}
				// Fetch integration data
				this.getIntegration(integrationId);
				
				// Get integrations based on current filter
				this.getFilteredIntegrationForBots(botId);
				
				// Render integration data in bot list
				this.renderIntegrationInBotList(botId);

				// Update routes
				dispatch_async(this.mQueue, function(manager) {
					globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
					manager.next();
				}.bind(this));
			}
		}
	},
	handleBotHasBeenRemoved: function(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			var botId = (inParams && inParams._id);
			
			// remove from bot list
			this.botListView.removeBot(botId);
			
			// if currently displayed then change bot focus
			if (botId === this.mCurrentBotId) {
				var firstBotId = this.botListView.getSelectedBotId();
				var bot = this.mBotsDict[firstBotId];
				if (firstBotId !== null) {
					globalRouteHandler().routeURL('/xcode/bots/%@'.fmt(bot.getTinyId()), false, true, undefined, true);
				}
				else {
					// show no bots placeholder
					this.showNoBotsPlaceholder();
				}
			}
		
			// remove bot from storage
			if (this.mBotsDict[botId] !== undefined) {
				delete this.mBotsDict[botId];
			}
		}
	},
	handleBotHasBeenCreated: function(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			// Make sur that the queue is ready
			if (dispatch_queue_size(this.mQueue) == 0) {
			    dispatch_resume(this.mQueue);
			}
			
			var botId = (inParams && inParams._id);
			
			if (this.mBotsDict[botId] === undefined) {
				this.getBotById(botId);
				// Add bot to list view
				this.renderBotInBotList(botId);
			}
			
			// Update routes
			dispatch_async(this.mQueue, function(manager) {
				globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
				manager.next();
			}.bind(this));
		}
	},
	handleBotHasBeenUpdated: function(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			// Make sur that the queue is ready
			if (dispatch_queue_size(this.mQueue) == 0) {
			    dispatch_resume(this.mQueue);
			}
			
			var botId = (inParams && inParams._id);
			
			if (this.mBotsDict[botId] === undefined) {
				this.getBotById(botId);
				// update bots
				this.renderBotInBotList(botId);
				
				// Update window title
				this.updateWindowTitle();
			}
			
			// Update routes
			dispatch_async(this.mQueue, function(manager) {
				globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
				manager.next();
			}.bind(this));
		}
	},
	handleSignOutHasBeenClicked: function(inMessage, inObject, inParams) {
		var callback = function() {
			window.location = '/xcode';
		};
		
		var logoutCallback = function() {
			xcs_proxy().forceLogin(callback, callback);
		}
			
		xcs_proxy().logout(logoutCallback, logoutCallback);
	},
	handleSignInHasBeenClicked: function(inMessage, inObject, inParams) {
		var callback = function() {
			this.getUserAuthStatus();
		}.bind(this);
		xcs_proxy().login(callback, callback);
	},
	handleIntegrationFlagHasBeenClicked: function(inMessage, inObject, inParams) {
		var tag = (inParams['tag'] || null);
		var action = (inParams['action'] || null);
		var integrationId = (inParams['integrationId'] || null);
		var botId = (inParams['botId'] || null);
		if (tag !== undefined && tag !== null && action !== undefined && action !== null && integrationId !== undefined && integrationId !== null) {
			var errBack = function () {
				//globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_INTEGRATION_SET_FLAG_HAS_FAILED, undefined, inParams);
			}
			var callback = function(inResponse) {
				if (inResponse !== undefined && inResponse !== null && inResponse) {
					var bot = this.mBotsDict[botId];
					if (bot !== undefined && bot !== null) {
						var integration = bot.getIntegrationById(integrationId);
						if (action === 'add') {
							integration.addTag(tag);
						}
						else if (action === 'remove') {
							integration.removeTag(tag);
						}
					}
				}
			}.bind(this);
			
			if (action === 'add') {
				xcs_proxy().addTagsToIntegration(integrationId, [tag], callback, errBack);
			}
			else if (action === 'remove') {
				xcs_proxy().removeTagsFromIntegration(integrationId, [tag], callback, errBack);
			}
		}
	},
	handleIntegrationNowHasBeenClicked: function(inMessage, inObject, inParams) {
		var currentBotId = this.mCurrentBotId;
		var callback = function(inIntegration) {
			if (inIntegration !== undefined) {

			}
		}.bind(this);
		var errBack = function() {

			// check if user can create bot
		}.bind(this);
		
		xcs_proxy().integrateBot(currentBotId, callback, errBack);
	},
	handleFilterCancelButtonHasBeenClicked: function(inMessage, inObject, inParams) {
		this.integrationsFilter.close();
		this.headerView.updateFilterHeaderStatus();
	},
	handleFilterButtonHasBeenClicked: function(inMessage, inObject, inParams) {
		this.integrationsFilter.toggle();
		this.headerView.updateFilterHeaderStatus();
	},
	// clear bot list and detail view from data related views
	clearBots: function() {
		this._resetBotsDisct();
		if (this.botListView !== undefined) {
			this.botListView.clear();
		}
	},
	// update views with bot data
	updateViewsForBot: function(inBot) {
		this.botListView.update(inBot);
	},
	resetBotsDisct: function() {
		this.mBotsDict = {};
	},
	showNoBotsPlaceholder: function() {
		document.querySelector('body').classList.add('no-bots');
		this.disableAllViews();
		this.noBotsPlaceholder.setActive(true);
		this.botListView.loaded();
		XCS.RouteHelpers.setBrowserWindowTitle();
	},
	hideNoBotsPlaceholder: function() {
		document.querySelector('body').classList.remove('no-bots');
		this.noBotsPlaceholder.setActive(false);
		// Update UI views based on route pattern
		this.setActiveView();
	},
	// Actions
	setActiveView: function() {
		dispatch_async(this.mQueue, function(manager) {
			if (this.mRoutePattern !== undefined && this.mRoutePattern !== null) {
				switch(this.mRoutePattern) {
					case XCS.WebUI.Routes.XCODE_INDEX_ROUTE:
					case XCS.WebUI.Routes.SLASH_ROUTE:
					case XCS.WebUI.Routes.XCODE_BOTS_ROUTE:
					case XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE:
						this.disableAllViews();
						this.botListView.setActive(true);
						this.headerView.setHeaderFor('bot_list');
						break;
					case XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD:
					case XCS.WebUI.Routes.XCODE_BOT_ROUTE:
						this.disableAllViews();
						this.integrationSummaryView.setActive(true);
						this.headerView.setHeaderFor('bot_summary');
						break;
				}
			}
			manager.next();
		}.bind(this));
	},
	updateFilterViews: function() {
		this.integrationsFilter.close();
		this.headerView.updateFilterHeaderStatus(this.mSelectedFilter);
		this.integrationsFilter.setFilter(this.mSelectedFilter);
		this.botListView.updateFilter(this.mSelectedFilter);
		this.integrationSummaryView.updateFilter(this.mSelectedFilter);
		this.botListView.loading();
	},
	closeFilterMenu: function() {
		this.integrationsFilter.close();
	},
	disableAllViews: function() {
		this.botListView.setActive(false);
		this.integrationSummaryView.setActive(false);
	},
	renderBotsInBotList: function() {
		dispatch_async(this.mQueue, function(manager) {
			this.botListView.reset(this.mBotsDict, this.mSelectedFilter);
			if (Object.keys(this.mBotsDict).length) {
				// hide no bots placeholder
				this.hideNoBotsPlaceholder();
			}
			else {
				// show no bots placeholder
				this.showNoBotsPlaceholder();
			}
			
			manager.next();
			
		}.bind(this));
	},
	renderBotInBotList: function(inBotId) {
		dispatch_async(this.mQueue, function(manager) {
			if (inBotId !== undefined && this.mBotsDict[inBotId] !== undefined) {
				var bot = this.mBotsDict[inBotId];
				this.botListView.updateOrAddBot(bot, this.mSelectedFilter);
				// hide no bots placeholder
				this.hideNoBotsPlaceholder();

				if (Object.keys(this.mBotsDict).length == 1) {
					this.mCurrentBotId = bot.getId();
				}
				manager.next();
			}
			else {
				manager.next();
			}
			
		}.bind(this));
	},
	renderBots: function() {
		dispatch_async(this.mQueue, function(manager) {
			if (Object.keys(this.mBotsDict).length) {
				// Set selected bot
				if (this.mCurrentBotId === null && this.mCurrentBotTinyId !== null && this.mBotIdsDict[this.mCurrentBotTinyId] !== undefined) {
					this.mCurrentBotId = this.mBotIdsDict[this.mCurrentBotTinyId];
				}
				this.botListView.selectBot(this.mCurrentBotId);
				// Get bot view for selected bot
				this.mCurrentBotId = this.botListView.getSelectedBotId();
				var bot = this.mBotsDict[this.mCurrentBotId];
				this.botListView.loaded();
			}

			manager.next();
			
		}.bind(this));
	},
	renderIntegrationsInBotList: function() {
		dispatch_async(this.mQueue, function(manager) {
			// Update views with integration data
			for (var key in this.mBotsDict) {
				var bot = this.mBotsDict[key];
				var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
				this.botListView.update(bot, integration);
			}

			manager.next();
		}.bind(this));
	},
	renderIntegrationInBotList: function(inBotId) {
		dispatch_async(this.mQueue, function(manager) {
			if (inBotId !== undefined) {
				var bot = this.mBotsDict[inBotId];
				var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
				this.botListView.update(bot, integration);
			}
				
			manager.next();
		}.bind(this));
	},
	renderIntegrations: function() {
		dispatch_async(this.mQueue, function(manager) {
			// Update views with integration data
			var bot = this.mBotsDict[this.mCurrentBotId];
			var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
			this.headerView.updateBotName(bot.getName());
			this.integrationSummaryView.updateIntegrationViews(bot, integration, this.mServerHostname);
			manager.next();
		}.bind(this));
	},
	renderIntegration: function(inIntegrationId) {
		dispatch_async(this.mQueue, function(manager) {
			// Update views with integration data
			var bot = this.mBotsDict[this.mCurrentBotId];
			var integration = bot.getIntegrationById(inIntegrationId);
			manager.next();
		}.bind(this));
	},
	renderBotIntegrationsInIntegrationsView: function(manager) {
		dispatch_async(this.mQueue, function(manager) {
			// Update views with integration data
			var bot = this.mBotsDict[this.mCurrentBotId];
			
			manager.next();
		}.bind(this));
	},
	renderBotIntegrationsSummaries: function() {
		dispatch_async(this.mQueue, function(manager) {
			// Update views with bot integration summaries
			var integrationSummaries = (manager && manager.data && manager.data[0]);
			if (integrationSummaries !== undefined) {
				
			}
			manager.next();
		}.bind(this));
	},
	renderCommitsAndIssues: function() {
		dispatch_async(this.mQueue, function(manager) {
			// Update views with integration data
			var bot = this.mBotsDict[this.mCurrentBotId];
			var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
			this.integrationSummaryView.updateCommitsViews(integration);
			manager.next();
		}.bind(this));
	},
	cleanBotViews: function() {
		dispatch_async(this.mQueue, function(manager) {
			this.botListView.clear();
			manager.next();
		}.bind(this));
	},
	cleanIntegrationViews: function() {
		dispatch_async(this.mQueue, function(manager) {
			if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE) {
				this.headerView.clear();
				this.integrationSummaryView.clean();
			}
			manager.next();
		}.bind(this));
	},
	setIntegrationViewsLoading: function() {
		dispatch_async(this.mQueue, function(manager) {
			if (this.mRoutePattern === XCS.WebUI.Routes.SLASH_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_INDEX_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_ROUTE) {
				this.botListView.loading();
			}
			if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE && this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE) {
				this.botListView.loadingSubviews();
			}
			if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE) {
				this.integrationSummaryView.loading();
			}
			
			manager.next();
		}.bind(this));
	},
	updateWindowTitle: function() {
		// Update window title
		dispatch_async(this.mQueue, function(manager) {
			if (this.mCurrentBotId) {
				var bot = this.mBotsDict[this.mCurrentBotId];
				var botName = (bot.getName() && bot.getName().escapeHTML().titleCase());
				var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
				var integrationNumber = null;
				if (integration !== undefined && integration !== null) {
					integrationNumber = integration.getIntegrationNumber();
				}

				if (this.mRoutePattern === XCS.WebUI.Routes.SLASH_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_INDEX_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_ROUTE || (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE && this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE)) {
					XCS.RouteHelpers.setBrowserWindowTitle("_XCS.WebUI.WindowTitle.WithBot".loc(this.mSelectedFilter));
				}
				if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE) {
					XCS.RouteHelpers.setBrowserWindowTitle("_XCS.WebUI.WindowTitle.WithBotAndIntegration".loc(botName, integrationNumber));
				}
			}
			manager.next();
		}.bind(this));
	},
	// Data
	getUserAuthStatus: function() {
		// Make sur that the queue is ready
		if (dispatch_queue_size(this.mQueue) == 0) {
		    dispatch_resume(this.mQueue);
		}

		dispatch_async(this.mQueue, function(manager) {
			var loggedInCallback = function(isLoggedIn) {
				this.headerView.updateUserAuthStatusViews(isLoggedIn);
			}.bind(this);
			
			var errback = function() {
				logger().error("Could not determine user authentication status");
			};
			
			xcs_proxy().isLoggedIn(loggedInCallback, errback);
			
			manager.next();
		}.bind(this));
	},
	getServerVersion: function() {
		// Make sur that the queue is ready
		if (dispatch_queue_size(this.mQueue) == 0) {
		    dispatch_resume(this.mQueue);
		}
		
		dispatch_async(this.mQueue, function(manager) {
			var callback = function(inVersion) {
				this.botListView.updateVersionViews(inVersion);
			}.bind(this);
			
			var errback = function() {
				logger().error("Could not get server version");
			};
			xcs_proxy().getVersion(callback, errback);
			manager.next();
		}.bind(this));
	},
	getServerHostname: function() {
		// Make sur that the queue is ready
		if (dispatch_queue_size(this.mQueue) == 0) {
		    dispatch_resume(this.mQueue);
		}
		
		dispatch_async(this.mQueue, function(manager) {
			var callback = function(inHostname) {
				if (inHostname !== undefined && inHostname !== null) {
					this.mServerHostname = inHostname;
				}
			}.bind(this);
			
			var errback = function() {
				logger().error("Could not get server hostname");
			};
			
			xcs_proxy().getServerHostname(callback, errback);
			manager.next();
		}.bind(this));
	},
	getBots: function(inBotTinyId) {
		dispatch_async(this.mQueue, function(manager) {
			var errback = function() {
				manager.next();
			};
			
			var callback = function(inBots) {
				var botId = null;
				var botTinyId = null;
				var bot = null;
				if (inBots !== undefined) {
					for (var i = 0; i < inBots.length; i++) {
						bot = inBots[i];
						botId = bot.getId();
						botTinyId = bot.getTinyId();
						// set current bot id to bot tiny id requested
						if (inBotTinyId !== undefined && inBotTinyId == botTinyId) {
							this.mCurrentBotId = botId;
						}
						
						if (this.mBotsDict[botId] === undefined) {
							this.mBotsDict[botId] = bot;
							this.mBotIdsDict[botTinyId] = botId;
						}
						else {
							this.mBotsDict[botId].update(bot);
						}
					};
				}
				manager.next();
			}.bind(this);
			
			xcs_proxy().getBots(callback, errback);
		}.bind(this));
	},
	getBotById: function(inBotId) {
		dispatch_async(this.mQueue, function(manager) {
			var errback = function() {
				manager.next();
			};
			
			var callback = function(inBot) {
				if (inBot !== undefined) {
					var botId = inBot.getId();
					var botTinyId = inBot.getTinyId();
					if (this.mBotsDict[botId] === undefined) {
						this.mBotsDict[botId] = inBot;
						this.mBotIdsDict[botTinyId] = botId;
					}
					else {
						this.mBotsDict[botId].update(inBot);
					}
					
					manager.next(botId);
				}
				else {
					manager.next();
				}
			}.bind(this);
			
			xcs_proxy().getBotById(inBotId, callback, errback);
		}.bind(this));
	},
	getFilteredIntegrationForBots: function(inBotId) {
		dispatch_async(this.mQueue, function(manager) {
			
			var runningIntegration = null;
			if (inBotId !== undefined) {
				var bot = this.mBotsDict[inBotId];
				if (bot !== undefined && bot !== null) {
					runningIntegration = bot.getRunningIntegration();
				}
			}
			
			var callback = function(inIntegrations) {
				if (inIntegrations !== undefined && inIntegrations !== null) {
					for (var key in this.mBotsDict) {
						var localBot = this.mBotsDict[key];
						
						var botFound = false;
						for (var i = 0; i < inIntegrations.length; i++) {
							var integration = inIntegrations[i];
							if (integration !== undefined && integration !== null) {
								var botId = integration.getBotId();
								if (localBot !== undefined && localBot !== null && botId === localBot.getId()) {
									localBot.updateIntegration(integration, this.mSelectedFilter);
									botFound = true;
								}
							}
						}
						if (!botFound) {
							localBot.updateIntegration(null, this.mSelectedFilter);
						}
					}
				}
				manager.next();
			}.bind(this);
			var errBack = function() {
				manager.next();
			}
			
			if (runningIntegration === null) {
				switch(this.mSelectedFilter) {
					case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
					default:
						xcs_proxy().getLatestIntegrationForBots(callback, errBack);
						break;
					case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
						xcs_proxy().getLatestFailedIntegrationForBots(callback, errBack);
						break;
					case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
						xcs_proxy().getLatestSucceededIntegrationForBots(callback, errBack);
						break;
					case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
						xcs_proxy().getLatestFlaggedIntegrationForBots(callback, errBack);
						break;
				}
			}
			else {
				manager.next();
			}
		}.bind(this));
	},
	getLatestInterestingIntegrationForBot: function(inBotId, inPaginationCount) {
		var bot = this.mBotsDict[inBotId];

		var findLatestInterestingIntegration = function() {
			if (bot.getYoungestIntegration() === null) {
				return;
			}
			var paginationStart = bot.getYoungestIntegration().getIntegrationNumber();

			var errback = function() {
				return;
			};

			var callback = function(inIntegrations) {
				if (inIntegrations !== undefined) {
					var moreItemsAvailable = false;

					// Set flag for pagination
					if (inIntegrations.length > inPaginationCount) {
						inIntegrations.shift();
						bot.setHasMoreIntegrations(true);
					}
					else {
						bot.setHasMoreIntegrations(false);
					}

					bot.addIntegrations(inIntegrations);

					if (bot.getLatestInterestingIntegration() === null && bot.hasMoreIntegrations()) {
						findLatestInterestingIntegration();
					}
					else {
						return;
					}
				}
				else {
					return;
				}
			}.bind(this);

			xcs_proxy().getPrevIntegrationsForBotInRange(inBotId, paginationStart, inPaginationCount + 1, callback, errback);
		};

		if (bot.getLatestInterestingIntegration() === null) {
			findLatestInterestingIntegration();
		}
		else {
			return;
		}
	},
	getIntegration: function(inIntegationId) {
		dispatch_async(this.mQueue, function(manager) {
			var errback = function() {
				manager.next();
			};
			
			var callback = function(inIntegration) {
				if (inIntegration !== undefined) {
					var botId = inIntegration.getBotId();
					if (this.mBotsDict[botId] !== undefined) {
						var bot = this.mBotsDict[botId];
						bot.updateIntegration(inIntegration);
					}
				}
				manager.next();
			}.bind(this);
			
			xcs_proxy().getIntegration(inIntegationId, callback, errback);
		}.bind(this));
	},
	getLast24IntegrationSummariesForBot: function() {
		dispatch_async(this.mQueue, function(manager) {
			var errback = function() {
				manager.next();
			};
			
			var callback = function(inIntegrations) {
				if (inIntegrations !== undefined) {
					manager.next(inIntegrations);
				}
				else {
					manager.next();
				}
			}.bind(this);
			
			xcs_proxy().getLastNIntegrationSummariesForBot(this.mCurrentBotId, 24, callback, errback);
		}.bind(this));
	},
	getLastNIntegrationsForBot: function(inPaginationCount) {
		dispatch_async(this.mQueue, function(manager) {
			if (inPaginationCount !== undefined) {
				var errback = function() {
					manager.next();
				};
				
				var bot = this.mBotsDict[this.mCurrentBotId];
				var integrations = bot.getIntegrations();
				
				var callback = function(inIntegrations) {
					if (inIntegrations !== undefined) {
						var moreItemsAvailable = false;
					
						// Set flag for pagination
						if (inIntegrations.length > inPaginationCount) {
							inIntegrations.shift();
							bot.setHasMoreIntegrations(true);
						}
						else {
							bot.setHasMoreIntegrations(false);
						}
					
						bot.addIntegrations(inIntegrations);
						manager.next();
					}
					else {
						manager.next();
					}
				}.bind(this);
				
				// if we already have integrations, jump to next item in the queue
				if (integrations !== undefined && integrations !== null && Object.keys(integrations).length < inPaginationCount) {
					xcs_proxy().getLastNIntegrationForBot(this.mCurrentBotId, inPaginationCount +1, callback, errback);
				}
				else {
					manager.next();
				}
			} else {
				manager.next();
			}
		}.bind(this));
	},
	getLastNIntegrationsForBotsWithInteresting: function(inPaginationCount) {
		dispatch_async(this.mQueue, function(manager) {
			var maxCount = Object.keys(this.mBotsDict).length;
			var count = 0;
			
			var verifyBotHasLatestInterestingIntegration = function() {
				var maxCount = Object.keys(this.mBotsDict).length;
				var count = 0;
				
				for (var key in this.mBotsDict) {
					(function(key) {
						var bot = this.mBotsDict[key];
						var botId = bot.getId();

						if (bot.getLatestInterestingIntegration() === null) {
							this.getLatestInterestingIntegrationForBot(botId, inPaginationCount);
							count++;
						}
						else {
							count++;
						}

						if (count === maxCount) {
							manager.next();
						}

					}.bind(this))(key);
				}
			}.bind(this);
			
			
			for (var key in this.mBotsDict) {
				(function(key) {
					var bot = this.mBotsDict[key];
					var botId = bot.getId();
					var integrations = bot.getIntegrations();
					
					var errback = function() {
						count++;
						if (count == maxCount) {
							verifyBotHasLatestInterestingIntegration();
						}
					};
					
					var callback = function(inIntegrations) {
						count++;
						if (inIntegrations !== undefined) {
							var moreItemsAvailable = false;

							// Set flag for pagination
							if (inIntegrations.length > inPaginationCount) {
								inIntegrations.shift();
								bot.setHasMoreIntegrations(true);
							}
							else {
								bot.setHasMoreIntegrations(false);
							}

							bot.addIntegrations(inIntegrations);
						}

						if (count == maxCount) {
							verifyBotHasLatestInterestingIntegration();
						}
					}.bind(this);
					
					// if we already have integrations, jump to next item in the queue
					if (integrations === null || (Object.keys(integrations).length < inPaginationCount)) {
						xcs_proxy().getLastNIntegrationForBot(botId, inPaginationCount +1, callback, errback);
					}
					else {
						count++;
						if (count == maxCount) {
							verifyBotHasLatestInterestingIntegration();
						}
					}
				}.bind(this))(key);
			}
		}.bind(this));
	},
	getLatestNonFatalIntegrations: function() {
		dispatch_async(this.mQueue, function(manager) {
			var maxCount = Object.keys(this.mBotsDict).length;
			var count = 0;
			
			for (var key in this.mBotsDict) {
				(function(key) {
					var bot = this.mBotsDict[key];
					var botId = bot.getId();
			
					var errback = function() {
						count++;
						if (count === maxCount) {
							manager.next();
						}
					};
				
					var callback = function(inIntegration) {
						count++;
						 if (inIntegration !== undefined && this.mBotsDict[botId] !== undefined) {
							this.mBotsDict[botId].updateIntegration(inIntegration);
						}

						if (count === maxCount) {
							manager.next();
						}
					}.bind(this);
				
					// If we already have an interesting integrations
					if (bot.getLatestInterestingIntegration() !== null) {
						count++;
						if (count === maxCount) {
							manager.next();
						}
					}
					else {
						xcs_proxy().getLastestNonFatalIntegrationForBot(botId, callback, errback);
					}
				}.bind(this))(key);
			}
		}.bind(this));
	},
	getPrevIntegrationsForBotInRange: function(inPaginationStart, inPaginationCount) {
		dispatch_async(this.mQueue, function(manager) {
			if (inPaginationStart !== undefined && inPaginationCount !== undefined) {
				var errback = function() {
					manager.next();
				};
			
				var callback = function(inIntegrations) {
					if (inIntegrations !== undefined) {
						var bot = this.mBotsDict[this.mCurrentBotId];
						var moreItemsAvailable = false;
					
						// Set flag for pagination
						if (inIntegrations.length > inPaginationCount) {
							inIntegrations.shift();
							bot.setHasMoreIntegrations(true);
						}
						else {
							bot.setHasMoreIntegrations(false);
						}
					
						bot.addIntegrations(inIntegrations);
						manager.next(inIntegrations);
					}
					else {
						manager.next();
					}
				}.bind(this);
				
				var bot = this.mBotsDict[this.mCurrentBotId];
				var latestIntegration = bot.getLatestIntegration();
				var latestIntegrationNumber = null;
				if (latestIntegration !== undefined && latestIntegration !== null) {
					latestIntegrationNumber = latestIntegration.getIntegrationNumber();
				}
				
				if (latestIntegrationNumber !== null && inPaginationStart !== null && inPaginationCount !== null) {
					var neededCount = latestIntegrationNumber - inPaginationStart + inPaginationCount;
					var integrations = bot.getIntegrations();
					if (Object.keys(integrations).length >= neededCount) {
						manager.next();
					}
					else {
						xcs_proxy().getPrevIntegrationsForBotInRange(this.mCurrentBotId, inPaginationStart, inPaginationCount + 1, callback, errback);
					}
				}
				else if (latestIntegrationNumber === null && inPaginationStart !== null && inPaginationCount !== null){
					xcs_proxy().getPrevIntegrationsForBotInRange(this.mCurrentBotId, inPaginationStart, inPaginationCount + 1, callback, errback);
				}
				else {
					manager.next();
				}
			}
			else {
				manager.next();
			}
		}.bind(this));
	},
	getCommitsAndIssuesForIntegration: function(inIntegrationId) {
		dispatch_async(this.mQueue, function(manager) {
			var integration = this.mBotsDict[this.mCurrentBotId].getIntegrationFromFilter(this.mSelectedFilter);
			var expectedResponses = 0;
			var responseCount = 0;
			// if we have an integration
			if (integration !== undefined && integration !== null) {
				// and that intgegration has reached the triggers step
				if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING) && integration.getCommits() === null) {
					var integrationId = integration.getId();
					expectedResponses++;
				
					var errback = function() {
						responseCount++;
						if (responseCount === expectedResponses) {
							manager.next();
						}
					};
				
					var callback = function(inCommits) {
						if (inCommits !== undefined) {
							integration.setCommits(inCommits);
						}
						
						// Make sur we fetech all the data we need before rendering
						responseCount++;
						if (responseCount === expectedResponses) {
							manager.next();
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
				
				// and that integration has reached the triggers step
				if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && integration.getResultDetails() === null) {
					var integrationId = integration.getId();
					expectedResponses++;
				
					var errback = function() {
						responseCount++;
						if (responseCount === expectedResponses) {
							manager.next();
						}
					};
				
					var callback = function(inIssues) {
						if (inIssues !== undefined) {
							integration.setResultDetails(inIssues);
						}
						responseCount++;
						if (responseCount === expectedResponses) {
							manager.next();
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
					manager.next();
				}
				
			}
			else {
				manager.next();
			}
		}.bind(this));
	},
	getCommitsAndIssuesForFilteredIntegrations: function() {
		dispatch_async(this.mQueue, function(manager) {
			var maxCount = Object.keys(this.mBotsDict).length;
			var count = 0;
			
			if (maxCount == 0) {
				manager.next();
				return;
			}
		
			for (var key in this.mBotsDict) {
				(function(key) {
					var bot = this.mBotsDict[key];
					var botId = bot.getId();
					var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
					var expectedResponses = 0;
					var responseCount = 0;
					
					if (integration !== undefined && integration !== null) {
						// and that intgegration has reached the triggers step
						if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING) && integration.getCommits() === null) {
							var integrationId = integration.getId();
							expectedResponses++;
				
							var errback = function() {
								responseCount++;
								if (responseCount === expectedResponses) {
									count++;
								}
								if (count === maxCount) {
									manager.next();
								}
							};
				
							var callback = function(inCommits) {
								if (inCommits !== undefined) {
									integration.setCommits(inCommits);
								}
						
								// Make sur we fetech all the data we need before rendering
								responseCount++;
								if (responseCount === expectedResponses) {
									count++;
								}
								if (count === maxCount) {
									manager.next();
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
				
						// and that integration has reached the triggers step
						if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && integration.getResultDetails() === null) {
							var integrationId = integration.getId();
							expectedResponses++;
				
							var errback = function() {
								responseCount++;
								if (responseCount === expectedResponses) {
									count++;
								}
								if (count === maxCount) {
									manager.next();
								}
							};
				
							var callback = function(inIssues) {
								if (inIssues !== undefined) {
									integration.setResultDetails(inIssues);
								}
								responseCount++;
								if (responseCount === expectedResponses) {
									count++;
								}
								if (count === maxCount) {
									manager.next();
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
							count++;
						}
						if (count === maxCount) {
							manager.next();
						}
				
					}
					else {
						count++;
						if (count === maxCount) {
							manager.next();
						}
					}
				}.bind(this))(key);
			}
		}.bind(this));
	},
	getCommitsForIntegrations: function() {
		dispatch_async(this.mQueue, function(manager) {
			var integrations = this.mBotsDict[this.mCurrentBotId].getIntegrations();
			
			if (integrations !== undefined && integrations !== null) {
				var responseCount = 0;
				var integrationCount = Object.keys(integrations).length;
				
				if (integrationCount > 0) {
					for (var key in integrations) {
						(function(key) {
							var integration = integrations[key];
							var integrationId = integration.getId();
					
							var errback = function() {
								responseCount++;
								if (responseCount == integrationCount) {
									manager.next();
								}
							};
			
							var callback = function(inCommits) {
								if (inCommits !== undefined) {
									integration.setCommits(inCommits);
									responseCount++;
									if (responseCount == integrationCount) {
										manager.next();
									}
								}
							}.bind(this);
						
							if (integration.getCommits() === null && integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING)) {
								xcs_proxy().getCommitsForIntegration(integrationId, callback, errback);
							}
							else {
								responseCount++;
								if (responseCount == integrationCount) {
									manager.next();
								}
							}
						}.bind(this))(key);
					}
				}
				else {
					manager.next();
				}
			}
			else {
				manager.next();
			}
		}.bind(this));
	},
	getRunningIntegrations: function() {
		dispatch_async(this.mQueue, function(manager) {
			var callback = function(inIntegrations) {
				manager.next(inIntegrations)
			}
			var errBack = function() {
				manager.next();
			}
			
			xcs_proxy().getRunningIntegrations(callback, errBack);
		}.bind(this));
		
		dispatch_async(this.mQueue, function(manager) {
			var inIntegrations = manager && manager.data && manager.data[0];
			var loopCount = inIntegrations.length;
			var count = 0;
			
			if (inIntegrations.length > 0) {
				for (var i = 0; i < inIntegrations.length; i++) {
					(function(i) {
						var integrationUpdate = inIntegrations[i];
						var integrationId = integrationUpdate._id || null;
						var currentStep = integrationUpdate.currentStep || null;
			
						var errback = function() {
							count++;
							if (count == loopCount) {
								manager.next();
							}
						};
	
						var callback = function(inIntegration) {
							if (inIntegration !== undefined) {
								var botId = inIntegration.getBotId();
								var bot = this.mBotsDict[botId];
								var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
								if (integration !== null) {
									integration.setForceRunning(true);
								}
								else {
									integration = inIntegration;
								}
								bot.updateIntegration(integration);
								count++;
								if (count == loopCount) {
									manager.next();
								}
							}
						}.bind(this);
						
						if (currentStep === XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING || currentStep === XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) {
							count++;
							if (count == loopCount) {
								manager.next();
							}
						}
						else {
							if (integrationId !== null && integrationId !== undefined) {
								xcs_proxy().getIntegration(integrationId, callback, errback);
							}
							else {
								count++;
								if (count == loopCount) {
									manager.next();
								}
							}
						}
						
					}.bind(this))(i);
				}
			}
			else {
				manager.next();
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

XCS.WebUI.Views.BotSummaryView = Class.create(XCS.Mvc.View, {
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('bot_filter');
	},
	render: function() {
		var elem = this.renderTemplate({});
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

XCS.WebUI.Views.BotListView = Class.create(XCS.Mvc.View, {
	mOverlayTimer: null,
	mFilter: null,
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('bot_list');
		this.mOverlayTimer = null;
		this.mFilter = null;
	},
	mSelectedBotId: null,
	render: function() {
		var elem = this.renderTemplate({});
		return elem;
	},
	reset: function(inBots, inFilter) {
		if (inBots !== undefined && inFilter !== undefined) {
			this.clear();
			this.mFilter = inFilter;
			
			if (Object.keys(inBots).length) {
				var sortedBots = [];
				
				for (var key in inBots) {
					var bot = inBots[key];
					sortedBots.push(bot);
				}
				
				sortedBots.sort(function(a, b){
					var textA = a.getName().toUpperCase();
					var textB = b.getName().toUpperCase();
					if(textA < textB) return -1;
					if(textA > textB) return 1;
					return 0;
				});
				
				for (var i = 0; i < sortedBots.length; i++) {
					var bot = sortedBots[i];
					this.addBot(bot, this.mFilter);
				}
			}
		}
	},
	addBot: function(inBot, inFilter) {
		if (inBot !== undefined && inBot !== null && inFilter !== undefined && inFilter !== null) {
			var botListItem = new XCS.WebUI.Views.BotListItemView(inBot, undefined, inFilter);
			this.addSubview(botListItem, '#xcs-webui-bot-list');
		}
	},
	updateOrAddBot: function(inBot, inFilter) {
		if (inBot !== undefined && inBot !== null && inFilter !== undefined && inFilter !== null) {
			var isInList = false;
			
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botView = this.mSubviews[i];
				if (botView.getBot().getId() == inBot.getId()) {
					isInList = true;
					var isSelected = (this.mSelectedBotId === inBot.getId());
					botView.update(inBot, isSelected);
				}
			}
			if (!isInList) {
				var sortedBots = [];
			
				for (var i = 0; i < this.mSubviews.length; i++) {
					sortedBots.push(this.mSubviews[i].getBot());
				}
				sortedBots.push(inBot);
				
				sortedBots.sort(function(a, b) {
					var textA = a.getName().toUpperCase();
					var textB = b.getName().toUpperCase();
					if(textA < textB) return -1;
					if(textA > textB) return 1;
					return 0;
				});
				
				var position = null;
				for (var j = 0; j < sortedBots.length; j++) {
					var bot = sortedBots[j];
					if (bot.getId() === inBot.getId()) {
						position = j;
					}
				}
				
				var botListItem = new XCS.WebUI.Views.BotListItemView(inBot, undefined, inFilter);
				if (position !== null && position < sortedBots.length-1 && this.mSubviews[position] !== undefined) {
					this.addSubview(botListItem, '#xcs-webui-bot-list', 'before', "div[data-route-href='%@']".fmt(this.mSubviews[position].getUrl()));
				}
				else {
					this.addBot(bot, inFilter);
				}
			}
		}
	},
	clear: function() {
		this.removeAllSubviews();
		this.mParentElement.querySelector('#xcs-webui-bot-list').innerHTML = "";
	},
	selectBot: function(inBotId) {
		if (inBotId !== undefined && inBotId !== null) {
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botListItem = this.mSubviews[i];
				var bot = botListItem.mBot;
			
				if (bot.getId() == inBotId) {
					this.mSelectedBotId = bot.getId();
					botListItem.setSelected(true);
				}
				else {
					botListItem.setSelected(false);
				}
			}
		}
		else {
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botListItem = this.mSubviews[i];
				var bot = botListItem.mBot;
			
				if (i == 0) {
					this.mSelectedBotId = bot.getId();
					botListItem.setSelected(true);
				}
				else {
					botListItem.setSelected(false);
				}
			}
		}
	},
	getSelectedBotId: function() {
		return this.mSelectedBotId;
	},
	update: function(inBot, inIntegration) {
		if (inBot instanceof XCS.Bot) {
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botView = this.mSubviews[i];
		
				if (botView.getBot().getId() == inBot.getId()) {
					botView.update(inBot, inIntegration);
				}
			}
		}
		else {
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botId = this.mSubviews[i].mBot.getId();
				this.mSubviews[i].update(inBot[botId], inIntegration);
			}
		}
	},
	updateVersionViews: function(inVersion) {
		if (inVersion !== undefined && inVersion !== null) {
			var aboutContainer = this.mParentElement.querySelector('#xcs-webui-about-popup-container');
			if (aboutContainer) {
				aboutContainer.innerHTML = "";
				if (inVersion.sdkMac !== undefined) {
					aboutContainer.innerHTML += "_XCS.WebUI.Version.Sdk".loc(inVersion['sdkMac']) + "</br>";
				}
				if (inVersion.sdkiOS !== undefined) {
					aboutContainer.innerHTML += "_XCS.WebUI.Version.Ios".loc(inVersion['sdkiOS']) + "</br>";
				}
				aboutContainer.innerHTML += "_XCS.WebUI.Version.Osx".loc(inVersion['os']) + "</br>";
				aboutContainer.innerHTML += "_XCS.WebUI.Version.OsxServer".loc(inVersion['server']) + "</br>";
				aboutContainer.innerHTML += "_XCS.WebUI.Version.Xcode".loc(inVersion['xcode']) + "</br>";
			}
		}
	},
	updateFilter: function(inFilter) {
		if (inFilter !== undefined && inFilter !== null) {
			this.mFilter = inFilter;
		}
		
		for (var i = 0; i < this.mSubviews.length; i++) {
			var listItem = this.mSubviews[i];
			listItem.updateFilter(this.mFilter);
		}
	},
	removeBot: function(inBotId) {
		if (inBotId !== undefined) {
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botlistItem = this.mSubviews[i];
				
				if (botlistItem.getBot().getId() === inBotId) {
					this.removeSubviews([botlistItem]);
				}
				
				if (this.mSelectedBotId === inBotId) {
					var firstSubview = this.getFirstSubview();
					if (firstSubview !== null) {
						this.mSelectedBotId = firstSubview.getBot().getId();
					}
					else {
						this.mSelectedBotId = null;
					}
				}
			}
		}
	},
	handleAboutHasBeenClicked: function(inEvent) {
		var aboutContainer = this.mParentElement.querySelector('#xcs-webui-about-popup-container');
		aboutContainer.classList.toggle('active');
	},
	handleWebkitTransitionEnd: function(inEvent) {
		//this.hideOverlay();
	},
	handleBotListItemHasBeenClicked: function() {
		this.showOverlay();
	},
	setActive: function($super, inValue) {
		$super(inValue);
		if (this.mOverlayTimer !== null) {
			clearTimeout(this.mOverlayTimer);
			this.mOverlayTimer = null;
		}
		
		if (inValue === true) {
			this.mOverlayTimer = setTimeout(this.hideOverlay.bind(this), 500);
		}
		else {
			this.showOverlay();
		}
	},
	showOverlay: function() {
		this.mParentElement.classList.add('overlay');
	},
	hideOverlay: function() {
		this.mParentElement.classList.remove('overlay');
	},
	loading: function() {
		this.mParentElement.classList.add('loading');
	},
	loaded: function() {
		this.mParentElement.classList.remove('loading');
	},
	loadingSubviews: function() {
		for (var i = 0; i < this.mSubviews.length; i++) {
			var view = this.mSubviews[i];
			view.loading();
		}
	},
	loadedSubviews: function() {
		for (var i = 0; i < this.mSubviews; i++) {
			var view = this.mSubviews[i];
			view.loaded();
		}
	},
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

XCS.WebUI.Views.BotListItemView = Class.create(XCS.Mvc.View, {
	mSelected: null,
	mStatus: null,
	mIconsNode: null,
	mUrl: null,
	mFilter: null,
	initialize: function($super, inBot, inIntegration, inFilter ) {
		$super();
		if (inBot !== undefined) {
			this.mBot = inBot;
			this.mTemplate = this.getTemplate('bot_list_item');
			this.mIntegrationStatus = new XCS.Views.IntegrationStatus();
			this.addSubview(this.mIntegrationStatus, '.xcs-webui-bot-list-item-status');
		}
		if (inIntegration !== undefined) {
			this.mIntegration = inIntegration;
		}
		if (inFilter !== undefined) {
			this.mFilter = inFilter;
		}
	},
	render: function() {
		var time = "";
		var integrationNumber = "";
		this.mStatus = "";
		if (this.mIntegration !== undefined && this.mIntegration !== null) {
			time = globalLocalizationManager().localizedTimeShift(this.mIntegration.getMostRecentTime());
			integrationNumber = this.mIntegration.getIntegrationNumber();
			if (this.mIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
				this.mStatus = this.mIntegration.getResult();
			}
			else {
				this.mStatus = "loading";
			}
		}
		
		this.setUrl();
		var elem = this.renderTemplate({
			filter: this.mFilter,
			id: this.mBot.getTinyId(),
			name: this.mBot.getName(),
			integration_number: "_XCS.BotDetail.Summary.IntegrationNumber".loc(integrationNumber),
			time: time
		});
		
		elem.classList.add('loading');
		
		return elem;
	},
	setSelected: function(inBool) {
		if (inBool !== undefined && inBool) {
			this.mSelected = true;
			if (this.rendered()) {
				this.mParentElement.addClassName('selected');
			}
		}
		else {
			this.mSelected = false;
			if (this.rendered()) {
				this.mParentElement.removeClassName('selected');
			}
		}
	},
	getPlaceholderStringForCurrentFilter: function() {
		var currentFilter = application.mWebUIController.mSelectedFilter;
		return "_XCS.BotDetail.BotList.Empty.%@".fmt(currentFilter);
	},
	update: function(inBot, inIntegration) {
		this.mBot = inBot;
		
		if (inIntegration !== undefined && inIntegration !== null) {
			if (inIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
				this.mIntegration = inIntegration;
				
				var time = "";
				var integrationNumber = "";
				var step = "";
				var result = "";
				time = globalLocalizationManager().localizedTimeShift(inIntegration.getMostRecentTime());
				integrationNumber = inIntegration.getIntegrationNumber();
				this.mIntegrationStatus.update(inIntegration);
	
				this.updateUrl();
				this.updateSpinner();
				this.updateBotName();
	
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-name').innerHTML = "_XCS.BotDetail.Summary.IntegrationNumber".loc(integrationNumber);
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-time').innerHTML = time;
				// Enable access to summary page
				this.mParentElement.querySelector('a').setAttribute('href', this.mUrl);
				
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-empty-label').innerHTML = '';
				this.notEmpty();
				this.loaded();
			}
			else {
				this.updateSpinner(inIntegration);
			}
		}
		else {
			// Disable access to summary page
			this.mParentElement.querySelector('a').removeAttribute('href');
			this.mParentElement.querySelector('.xcs-webui-bot-list-item-empty-label').innerHTML = this.getPlaceholderStringForCurrentFilter().loc();
			this.updateSpinner();
			this.empty();
			this.loaded();
		}
	},
	updateUrl: function() {
		var aNode = this.mParentElement.querySelector('a');
		this.setUrl();
		aNode.setAttribute('href', this.mUrl);
	},
	setUrl: function() {
		if (this.mFilter !== null) {
			this.mUrl = '/xcode/bots/%@/%@'.fmt(this.mFilter.toLowerCase(), this.mBot.getTinyId());
		}
	},
	clearIcons: function() {
		this.mIconsNode.classList.remove('success');
		this.mIconsNode.classList.remove('errors');
		this.mIconsNode.classList.remove('warnings');
		this.mIconsNode.classList.remove('analysis');
		this.mIconsNode.classList.remove('tests-success');
		this.mIconsNode.classList.remove('tests-failures');
	},
	updateViewForBotSummary: function() {
		this.mParentElement.classList.remove('xcs-routable');
		this.mParentElement.removeAttribute('data-route-href');
		this.mParentElement.removeAttribute('data-push-state');
		this.mParentElement.querySelector('.xcs-webui-bot-list-item-title-container').remove();
	},
	updateSpinner: function(inIntegration) {
		var bot = this.mBot;
		var integration = this.mIntegration;
		
		if (inIntegration !== undefined && inIntegration !== null) {
			integration = inIntegration;
		}
		
		if (integration !== undefined && integration !== null) {
			if (integration.isRunningStatus()) {
				this.showSpinner();
			}
			else {
				this.hideSpinner();
			}
		}
		else {
			this.hideSpinner();
		}
	},
	updateBotName: function() {
		var botName = ((this.mBot.getName() && this.mBot.getName().escapeHTML().titleCase()) || "");
		this.mParentElement.setAttribute('data-bot-name', botName);
	},
	updateFilter: function(inFilter) {
		if (inFilter !== undefined && inFilter !== null) {
			this.mFilter = inFilter;
		}
		this.updateUrl();
	},
	showSpinner: function() {
		this.mParentElement.classList.add('running');
	},
	hideSpinner: function() {
		this.mParentElement.classList.remove('running');
	},
	getBot: function() {
		return this.mBot;
	},
	getUrl: function() {
		return this.mUrl;
	},
	loading: function() {
		this.mParentElement.classList.add('loading');
	},
	loaded: function() {
		this.mParentElement.classList.remove('loading');
	},
	isEmpty: function() {
		return this.mParentElement.classList.contains('empty');
	},
	empty: function() {
		this.mParentElement.classList.add('empty');
	},
	notEmpty: function() {
		this.mParentElement.classList.remove('empty');
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

XCS.WebUI.Views.BotSummaryView = Class.create(XCS.Mvc.View, {
	mCircleLabels: [],
	mContributors: {},
	mSelectedContributor: null,
	mHasCommitsInView: null,
	mFlag: null,
	mFlagTagLabel: null,
	mIntegration: null,
	mInstallProfileTimeout: null,
	mServerHostname: null,
	mFilter: null,
	mCloseTimeout: null,
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('bot_summary');
		this.mActive = false;
		this.mHasCommitsInView = false;
		this.mFlagTagLabel = 'flagged';
		this.mInstallProfileTimeout = null;
		this.mServerHostname = null;
		this.mFilter = null;
		this.mCloseTimeout = null;
		this.mLoadingTimeout = null;
	},
	render: function() {
		var elem =  this.renderTemplate({
			ios_label: "_XCS.BotDetail.Summary.iOS".loc(),
			mac_label: "_XCS.BotDetail.Summary.Mac".loc(),
			install_label: "_XCS.BotDetail.Summary.Install".loc(),
			install_profile_label: "_XCS.BotDetail.Summary.InstallProfile".loc(),
			summary_result_label: "_XCS.BotDetail.Summary.SummaryResults".loc(),
			contributor_label: "_XCS.BotDetail.Summary.Contributors".loc(),
			no_commits_label: "_XCS.BotDetail.Summary.ContributorsCommitsMessages.Empty".loc(),
			download_logs_label: "_XCS.BotDetail.Summary.DownloadLogsLabel".loc(),
			open_xcode_label: "_XCS.BotDetail.Summary.OpenXcodeLabel".loc(),
			product_label: "_XCS.BotDetail.Summary.ProductLabel".loc(),
			archive_label: "_XCS.BotDetail.Summary.ArchiveLabel".loc()
		});
		
		this.mFlag = elem.querySelector('#xcs-webui-integration-build-flag');
		var downloadBadge = elem.querySelector('#xcs-webui-integration-build-install-badge');
		var profileBadge = elem.querySelector('#xcs-webui-integration-build-profile-badge');
		
		if (browser().isMobile()) {
			Event.observe(elem, 'touchend', this.handleContainerHasBeenClicked.bind(this));
			Event.observe(this.mFlag, 'touchend', this.handleFlagButtonHasBeenClicked.bind(this));
			Event.observe(profileBadge, 'touchend', this.handleInstallProfileHasBeenClicked.bind(this));
			Event.observe(downloadBadge, 'touchend', this.handleInstallHasBeenClicked.bind(this));
			
			if (browser().isiPad()) {
				elem.style.display = 'none';
			}
		}
		else {
			Event.observe(elem, 'click', this.handleContainerHasBeenClicked.bind(this));
			Event.observe(this.mFlag, 'click', this.handleFlagButtonHasBeenClicked.bind(this));
			elem.style.display = 'none';
		}
		this.mCircleLabels = elem.querySelectorAll(".xcs-webui-integration-build-label");
		return elem;
	},
	updateIntegrationViews: function(inBot, inIntegration, inServerHostname) {
		// if we have an integration
		// and the current step is a least uploading 
		if (inIntegration !== undefined && inIntegration !== null && inIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING)) {
			
			// update bot summary
			this.mIntegration = inIntegration;
			
			if (inServerHostname !== undefined && inServerHostname !== null) {
				this.mServerHostname = inServerHostname;
			}
			
			var type = '';
			if (this.mIntegration.isMacApp()) {
				type = "_XCS.BotDetail.Summary.Mac".loc();
			}
			if (this.mIntegration.isIosApp()) {
				type = "_XCS.BotDetail.Summary.iOS".loc();
			}
			this.mParentElement.querySelector('#xcs-webui-integration-bot-name').innerHTML = this.mIntegration.getBotName().escapeHTML().titleCase();
			this.mParentElement.querySelector('#xcs-webui-integration-build-most-recent-time').innerHTML = globalLocalizationManager().localizedDateTime(this.mIntegration.getMostRecentTime());
			
			var macBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-mac-badge');
			var iosBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-ios-badge');
			var downloadBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-install-badge');
			var profileBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-profile-badge');
			var fileSizeNode = this.mParentElement.querySelector('#xcs-webui-integration-build-size');
			var summaryIntegrationStatusNode = this.mParentElement.querySelector('#xcs-webui-summary-integration-status');
			var summaryIntegrationStatusContainerNode = this.mParentElement.querySelector('#xcs-webui-summary-integration-status-container');
			var downloadLogs = this.mParentElement.querySelector('#xcs-webui-integration-build-download-logs');
			var openInXcode = this.mParentElement.querySelector('#xcs-webui-integration-build-open-xcode');
			var archiveNode = this.mParentElement.querySelector('#xcs-webui-integration-build-archive-badge');
			var productNode = this.mParentElement.querySelector('#xcs-webui-integration-build-product-badge');
			var ipaSize = '';
			
			this.mParentElement.querySelector('#xcs-webui-integration-build-download-logs').setAttribute('href', '/xcode/api/integrations/%@/assets'.fmt(this.mIntegration.getId()));
			this.mParentElement.querySelector('#xcs-webui-integration-build-open-xcode').setAttribute('href', 'xcbot://%@/botID/%@/integrationID/'.fmt(inServerHostname, this.mIntegration.getBotId(), this.mIntegration.getId()));
			
			// remove loading spinner
			summaryIntegrationStatusNode.classList.remove('loading');
			
			if (this.mIntegration.isMacApp()) {
				macBadge.classList.add('show');
				downloadBadge.classList.remove('show');
			
				if (inIntegration.hasArchive()) {
					ipaSize = XCS.Tools.getHumanReadableFileSize(inIntegration.getArchiveSize()).escapeHTML();
				}
			}
			else {
				macBadge.classList.remove('show');
				downloadBadge.classList.remove('show');
				
			}
			
			if (browser().isMobile() || browser().isiOS()) {
				downloadLogs.removeAttribute('href');
				downloadLogs.classList.remove('show');
				openInXcode.removeAttribute('href');
				openInXcode.classList.remove('show');
				archiveNode.classList.remove('show');
				archiveNode.removeAttribute('href');
				productNode.classList.remove('show');
				productNode.removeAttribute('href');
			}
			else {
				downloadLogs.setAttribute('href', '/xcode/api/integrations/%@/assets'.fmt(this.mIntegration.getId()));
				downloadLogs.classList.add('show');
				openInXcode.setAttribute('href', 'xcbot://%@/botID/%@/integrationID/'.fmt(inServerHostname, this.mIntegration.getBotId(), this.mIntegration.getId()));
				openInXcode.classList.add('show');
				
				if (this.mIntegration.hasArchive()) {
					archiveNode.setAttribute('href', '/xcode/api/assets/%@'.fmt(this.mIntegration.getArchiveRelativePath()));
					archiveNode.classList.add('show');
				}
				else {
					archiveNode.removeAttribute('href');
					archiveNode.classList.remove('show');
				}
				if (this.mIntegration.hasProduct()) {
					productNode.setAttribute('href', '/xcode/api/assets/%@'.fmt(this.mIntegration.getProductRelativePath()));
					productNode.classList.add('show');
				}
				else {
					productNode.removeAttribute('href');
					productNode.classList.remove('show');
				}
			}
		
			if (this.mIntegration.isIosApp()) {
				iosBadge.classList.add('show');
			
				if (inIntegration.hasIpa() && browser().isiOS()) {
					ipaSize = XCS.Tools.getHumanReadableFileSize(inIntegration.getIpaSize()).escapeHTML();
					if (document.cookie.indexOf('installedProfile=1') === -1) {
						profileBadge.classList.add('show');
					}
					else {
						downloadBadge.classList.add('show');
					}
				}
			}
			else {
				if (browser().isiOS()) {
					iosBadge.classList.remove('show');
					downloadBadge.classList.remove('show');
				}
			}
			
			fileSizeNode.innerHTML = ipaSize;
			
			var tags = this.mIntegration.getTags();
			if (tags !== null && tags.length && tags.indexOf(this.mFlagTagLabel) !== -1) {
				this.mFlag.classList.add('selected');
			}
			else {
				this.mFlag.classList.remove('selected');
			}
			this.mFlag.classList.add('show');
			
			
			summaryIntegrationStatusContainerNode.innerHTML = "";
			var botListItem = new XCS.WebUI.Views.BotListItemView(inBot);
			botListItem.forceRender();
			botListItem.updateViewForBotSummary();
			botListItem.update(inBot, inIntegration);
			summaryIntegrationStatusContainerNode.appendChild(botListItem.mParentElement);
		}
	},
	updateCommitsViews: function(inIntegration) {
		var commitsContainer = this.mParentElement.querySelector('#xcs-webui-integration-commits-container');
		var contributorsContainer = this.mParentElement.querySelector('#xcs-webui-integration-contributors-container');
		var contributorTitleContainer = this.mParentElement.querySelector('#xcs-webui-summary-contributor-title-container');
		var contributorTitle = this.mParentElement.querySelector('#xcs-webui-summary-contributor-title-container .xcs-webui-summary-title-label');
		
		// remove loading spinner
		commitsContainer.classList.remove('loading');
		
		if (inIntegration !== undefined && inIntegration !== null) {
			this.mContributors = inIntegration.getCommitsByContributors();
			var commits = inIntegration.getCommits();
			var contributorsCount = 0;
			var commitsCount = 0;
			var contributorsCommitInfo = [];
			
			if (commits !== null && commits.length) {
				commitsCount = commits.length;
			}
			
			contributorTitle.innerHTML = "_XCS.BotDetail.Summary.Contributors".loc();
			
			if (this.mContributors !== null && Object.keys(this.mContributors).length) {
				// Hide no commits placeholder
				this.noEmptyCommits();
				// Reset view container
				contributorsContainer.innerHTML = "";
				// Show container
				contributorsContainer.classList.add('show');
				// Add contributors
				for (var key in this.mContributors) {
					var contributorCommits = this.mContributors[key];
					var contributorName = "";
					var contributorInitials = "";
					var contributorPicture = "";
					var contributorCommitsCount = 0;
					contributorsCount++;
					var commitsInfo = [];
				
					if (contributorsCount == 1) {
						this.mSelectedContributor = key;
					}
				
					if (contributorCommits && contributorCommits.length) {
						for (var i = 0; i < contributorCommits.length; i++) {
							var commit = contributorCommits[i];
							if (i == 0) {
								contributorName = commit.getAuthorShortName();
								contributorInitials = commit.getAuthorInitials();
								contributorPicture = commit.getAuthor
							}
							contributorCommitsCount++;
							commitsInfo.push(commit.getCommitMessageInfo());
						}
					}
				
					// Add contributors circles
					var contributorView = new XCS.WebUI.Views.ContributorCircle({
						color: "#2c80f8",
						value: (contributorCommitsCount / commitsCount * 100),
						background: true,
						label: contributorName,
						initials: contributorInitials,
						picture: contributorPicture,
						contributor_hash: key
					});
					contributorView.forceRender();
					contributorsContainer.appendChild(contributorView.mParentElement);
				
					// 
					contributorsCommitInfo.push({
						contributor_hash: commit.getContributorHash(),
						commits: commitsInfo
					});
				}
				
				contributorTitle.innerHTML = "_XCS.BotDetail.Summary.ContributorsNumber".loc(contributorsCount);
			}
			else {
				// Hide container
				this.emptyCommits();
				this.mSelectedContributor = null;
				contributorsContainer.classList.remove('show');
			}
		}
		else {
			contributorsContainer.classList.remove('show');
			contributorTitleContainer.classList.remove('show');
		}
	},
	clean: function() {
		this.mParentElement.querySelector('#xcs-webui-integration-bot-name').innerHTML = '';
		this.mParentElement.querySelector('#xcs-webui-integration-build-most-recent-time').innerHTML = '';
		this.mParentElement.querySelector('#xcs-webui-integration-build-mac-badge').classList.remove('show');
		this.mParentElement.querySelector('#xcs-webui-integration-build-ios-badge').classList.remove('show');
		this.mParentElement.querySelector('#xcs-webui-integration-build-install-badge').classList.remove('show');
		this.mParentElement.querySelector('#xcs-webui-integration-build-profile-badge').classList.remove('show');
		this.mFlag.classList.remove('show');
		this.mParentElement.querySelector('#xcs-webui-integration-build-size').innerHTML = '';
		this.mParentElement.querySelector('#xcs-webui-summary-integration-status-container').innerHTML = '';
		this.mParentElement.querySelector('#xcs-webui-integration-build-install-badge').classList.remove('disabled');
		this.mParentElement.querySelector('#xcs-webui-integration-build-profile-badge').classList.remove('disabled');
		
		var downloadLogs = this.mParentElement.querySelector('#xcs-webui-integration-build-download-logs');
		var openInXcode = this.mParentElement.querySelector('#xcs-webui-integration-build-open-xcode');
		var archiveNode = this.mParentElement.querySelector('#xcs-webui-integration-build-archive-badge');
		var productNode = this.mParentElement.querySelector('#xcs-webui-integration-build-product-badge');
		downloadLogs.removeAttribute('href');
		downloadLogs.classList.remove('show');
		openInXcode.removeAttribute('href');
		openInXcode.classList.remove('show');
		archiveNode.classList.remove('show');
		archiveNode.removeAttribute('href');
		productNode.classList.remove('show');
		productNode.removeAttribute('href');
		
		// Commits are loaded out-of-band.
		this.mParentElement.querySelector('#xcs-webui-integration-commits-container').classList.add('loading');
		
		var contributorContainer = this.mParentElement.querySelector('#xcs-webui-integration-contributors-container');
		contributorContainer.innerHTML = '';
		contributorContainer.classList.remove('show');
		this.mParentElement.querySelector('#xcs-webui-summary-contributor-title-container .xcs-webui-summary-title-label').innerHTML = "_XCS.BotDetail.Summary.Contributors".loc();
		this.mParentElement.querySelector('#xcs-webui-summary-contributor-title-container .xcs-webui-summary-title-label').innerHTML = '';
	},
	loading: function() {
		this.mParentElement.querySelector('#xcs-webui-integration-commits-container').classList.add('loading');
		this.mParentElement.querySelector('#xcs-webui-summary-integration-status').classList.add('loading');
	},
	emptyCommits: function() {
		this.mParentElement.querySelector('#xcs-webui-integration-commits-container').classList.add('empty-commits');
	},
	noEmptyCommits: function() {
		this.mParentElement.querySelector('#xcs-webui-integration-commits-container').classList.remove('empty-commits');
	},
	toggleFlag: function() {
		this.mFlag.classList.toggle('selected');
	},
	handleContainerHasBeenClicked: function(inEvent) {
		if (inEvent !== undefined && inEvent !== null) {
			var node = inEvent.target;
			if (node === this.mParentElement) {
				globalRouteHandler().routeURL('/xcode/bots/%@'.fmt(this.mFilter.toLowerCase()), undefined, undefined, undefined, true, undefined);
				
				if (this.mCleanTimeout !== null) {
					clearTimeout(this.mCleanTimeout);
					this.mCleanTimeout = null;
				}
				
				this.mCleanTimeout = setTimeout(function(){
					this.clean();
					this.mCleanTimeout = null;
				}.bind(this), 250);
			}
		}
	},
	handleFlagButtonHasBeenClicked: function() {
		this.toggleFlag();
		var params = {
			tag: this.mFlagTagLabel,
			action: null,
			integrationId: this.mIntegration.getId(),
			botId: this.mIntegration.getBotId()
		};
		if (this.mFlag.classList.contains('selected')) {
			params['action'] = 'add';
		}
		else {
			params['action'] = 'remove';
		}
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_INTEGRATION_FLAG_HAS_BEEN_CLICKED, this, params);
	},
	handleInstallProfileHasBeenClicked: function(inEvent) {
		if (this.mInstallProfileTimeout !== null) {
			this.mInstallProfileTimeout = null;
		}
		
		var downloadBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-install-badge');
		var profileBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-profile-badge');
		
		if (!profileBadge.classList.contains('disabled')) {
			if (window.location.hostname.toLowerCase() === this.mServerHostname.toLowerCase()) {
				this.mInstallProfileTimeout = setTimeout(function(){
			
					if (document.cookie.indexOf('installedProfile=1') === -1) {
						profileBadge.classList.add('show');
						downloadBadge.classList.remove('show');
					}
					else {
						profileBadge.classList.remove('show');
						downloadBadge.classList.add('show');
					}
					this.mInstallProfileTimeout = null;
				}.bind(this), 2000);
				window.location = '/xcode/api/profiles/ota.mobileconfig';
			}
			else {
				this.disableInstallButton();
				alert("_XCS.BotDetail.Summary.HostnameInstallAlert".loc(this.mServerHostname));
			}
		}
	},
	handleInstallHasBeenClicked: function(inEvent) {
		var integrationId = this.mIntegration.getId();
		var ipaUrl = '/xcode/api/integrations/%@/install_product'.fmt(integrationId);
		var downloadBadge = this.mParentElement.querySelector('#xcs-webui-integration-build-install-badge');
		
		if (!downloadBadge.classList.contains('disabled')) {
			if (window.location.hostname.toLowerCase() === this.mServerHostname.toLowerCase()) {
				window.location = ipaUrl;
			}
			else {
				this.disableInstallButton();
				alert("_XCS.BotDetail.Summary.HostnameInstallAlert".loc(this.mServerHostname));
			}
		}
	},
	updateFilter: function(inFilter) {
		if (inFilter !== undefined && inFilter !== null) {
			this.mFilter = inFilter;
		}
	},
	setActive: function($super, inValue) {
		if (inValue !== undefined) {			
			if (!browser().isMobile() || (browser().isMobile() && browser().isiPad())) {
				if (inValue === true) {
					if (this.mCloseTimeout !== null) {
						clearTimeout(this.mCloseTimeout);
						this.mCloseTimeout = null;
					}
					this.mParentElement.style.display = 'block';
				}
				else {
					if (this.mCloseTimeout !== null) {
						clearTimeout(this.mCloseTimeout);
						this.mCloseTimeout = null;
					}
					this.mCloseTimeout = setTimeout(function() {
						this.mParentElement.style.display = 'none';
						this.mCloseTimeout = null;
					}.bind(this), 250);
				}
			}
			$super(inValue);
		}
	},
	disableInstallButton: function() {
		this.mParentElement.querySelector('#xcs-webui-integration-build-install-badge').classList.add('disabled');
		this.mParentElement.querySelector('#xcs-webui-integration-build-profile-badge').classList.add('disabled');
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

XCS.WebUI.Views.Header = Class.create(XCS.Mvc.View, {
	mCurrentFilter: null,
	mHeaderTransitionTimer: null,
	mBotListHeader: null,
	mBotSummaryHeader: null,
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('header');
		this.mCurrentFilter = XCS.BotFilter.INTEGRATION_FILTER_LATEST;
		this.mHeaderTransitionTimer = null;
	},
	render: function() {
		var elem = this.renderTemplate({
			log_out_label: "_XCS.Header.LogOut".loc(),
			log_in_label: "_XCS.Header.LogIn".loc(),
			big_screen_label: "_XCS.Header.BigScreen".loc(),
			back_label: "_XCS.Header.Back".loc(),
			filter_label: this.getCurrentFilterName()
		});
		
		if (this.mCurrentFilter !== null && this.mCurrentFilter !== XCS.BotFilter.INTEGRATION_FILTER_LATEST) {
			elem.classList.add('filtered');
		}
		else {
			elem.classList.remove('filtered');
		}
		
		this.mBotListHeader = elem.querySelector('#xcs-webui-header-bot-list-container');
		this.mBotSummaryHeader = elem.querySelector('#xcs-webui-header-bot-summary-container');
		var signOutNode = elem.querySelector('#xcs-webui-sign-out-button');
		var signInNode = elem.querySelector('#xcs-webui-sign-in-button');
		var filterNode = elem.querySelector('#xcs-webui-header-filter-label-container');
		
		if (browser().isMobile()) {
			Event.observe(signOutNode, 'touchend', this.handleSignOutHasBeenClicked);
			Event.observe(signInNode, 'touchend', this.handleSignInHasBeenClicked);
			Event.observe(filterNode, 'touchend', this.handleFilterHasBeenClicked.bind(this));
		}
		else {
			Event.observe(signOutNode, 'click', this.handleSignOutHasBeenClicked);
			Event.observe(signInNode, 'click', this.handleSignInHasBeenClicked);
			Event.observe(filterNode, 'click', this.handleFilterHasBeenClicked.bind(this));
		}
		return elem;
	},
	handleSignOutHasBeenClicked: function() {
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_SIGNOUT_HAS_BEEN_CLICKED);
	},
	handleSignInHasBeenClicked: function() {
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_SIGNIN_HAS_BEEN_CLICKED);
	},
	handleFilterHasBeenClicked: function() {
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_FILTER_BUTTON_HAS_BEEN_CLICKED);
	},
	setHeaderFor: function(inViewName) {
		if (inViewName !== undefined && inViewName !== null) {
			if (this.mHeaderTransitionTimer !== null) {
				clearTimeout(this.mHeaderTransitionTimer);
				this.mHeaderTransitionTimer = null;
			}
			
			switch(inViewName) {
				case 'bot_list':
					this.showBotListHader();
					this.mParentElement.classList.remove('bot-summary');
					this.mParentElement.classList.add('bot-list');
					this.mHeaderTransitionTimer = setTimeout(this.hideBotSummaryHeader.bind(this), 500);
					break;
				case 'bot_summary':
					this.showBotSummaryHeader();
					this.mParentElement.classList.remove('bot-list');
					this.mParentElement.classList.add('bot-summary');
					this.mHeaderTransitionTimer = setTimeout(this.hideBotListHeader.bind(this), 500);
					break;
			}
		}
	},
	showBotListHader: function() {
		this.mBotListHeader.classList.add('show');
	},
	hideBotListHeader: function() {
		this.mBotListHeader.classList.remove('show');
	},
	showBotSummaryHeader: function() {
		this.mBotSummaryHeader.classList.add('show');
	},
	hideBotSummaryHeader: function() {
		this.mBotSummaryHeader.classList.remove('show');
	},
	getCurrentFilterName: function() {
		if (this.mCurrentFilter !== null && this.mCurrentFilter !== undefined) {
			if (this.mCurrentFilter === XCS.BotFilter.INTEGRATION_FILTER_LATEST) {
				return "_XCS.Header.Filter.%@".fmt(this.mCurrentFilter).loc();
			}
			else {
				if (browser().isMobile()) {
					return "_XCS.Header.Filter.%@".fmt(this.mCurrentFilter).loc();
				}
				else {
					return "_XCS.Header.Filter.Showing".loc("_XCS.Header.Filter.%@".fmt(this.mCurrentFilter).loc());
				}
			}
		}
	},
	setCurrentFilterName: function(inFilterName) {
		if (inFilterName !== undefined && inFilterName !== null) {
			if (inFilterName === XCS.BotFilter.INTEGRATION_FILTER_LATEST || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_CONTRIBUTED || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_FAILED || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_FLAGGED) {
				this.mCurrentFilter = inFilterName;
			}
		}
	},
	updateFilterLabel: function() {
		var node = this.mParentElement.querySelector('#xcs-webui-header-filter-label');
		node.innerHTML = this.getCurrentFilterName();
	},
	updateFilterHeaderColorStatus: function() {
		if (this.mCurrentFilter !== null && this.mCurrentFilter !== XCS.BotFilter.INTEGRATION_FILTER_LATEST) {
			this.mParentElement.classList.add('filtered');
		}
		else {
			this.mParentElement.classList.remove('filtered');
		}
	},
	updateFilterHeaderStatus: function(inFilterName) {
		if(inFilterName !== undefined && inFilterName !== null) {
			this.setCurrentFilterName(inFilterName);
		}
		this.mParentElement.querySelector('#xcs-webui-back-button').setAttribute('href', '/xcode/bots/%@'.fmt(this.mCurrentFilter.toLowerCase()));
		this.updateFilterHeaderColorStatus();
		this.updateFilterLabel();
	},
	updateUserAuthStatusViews: function(inIsUserLoggerIn) {
		if (inIsUserLoggerIn !== undefined && inIsUserLoggerIn !== null) {
			var container = this.mParentElement.querySelector('#xcs-webui-sign-out-container');
			if (inIsUserLoggerIn) {
				container.classList.add('logged_in');
				container.classList.remove('logged_out');
			}
			else {
				container.classList.remove('logged_in');
				container.classList.add('logged_out');
			}
		}
	},
	updateBotName: function(inBotName) {
		if (inBotName !== undefined && inBotName !== null) {
			this.mParentElement.querySelector('#xcs-webui-header-bot-name').innerHTML = inBotName.escapeHTML();
		}
	},
	clear: function() {
		this.mParentElement.querySelector('#xcs-webui-header-bot-name').innerHTML = '';
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

XCS.WebUI.Views.IntegrationsFilter = Class.create(XCS.Mvc.View, {
	mCurrentFilterName: null,
	mCloseTimeout: null,
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('integrations_filter');
		this.mCurrentFilterName = XCS.BotFilter.INTEGRATION_FILTER_LATEST;
		this.mCloseTimeout = null;
	},
	render: function() {
		var elem = this.renderTemplate({
			header_filter_label: "_XCS.Header.Filter.Label".loc(),
			cancel_button: "_XCS.Header.Filter.Cancel.Label".loc(),
			filter_item: [
				{
					item_label: "_XCS.Header.Filter.Latest".loc(),
					item_filter_name: XCS.BotFilter.INTEGRATION_FILTER_LATEST,
					filter_url: XCS.BotFilter.INTEGRATION_FILTER_LATEST.toLowerCase()
				},
				{
					item_label: "_XCS.Header.Filter.Failed".loc(),
					item_filter_name: XCS.BotFilter.INTEGRATION_FILTER_FAILED,
					filter_url: XCS.BotFilter.INTEGRATION_FILTER_FAILED.toLowerCase()
				},
				{
					item_label: "_XCS.Header.Filter.Succeeded".loc(),
					item_filter_name: XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED,
					filter_url: XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED.toLowerCase()
				},
				{
					item_label: "_XCS.Header.Filter.Flagged".loc(),
					item_filter_name: XCS.BotFilter.INTEGRATION_FILTER_FLAGGED,
					filter_url: XCS.BotFilter.INTEGRATION_FILTER_FLAGGED.toLowerCase()
				}
			]
		});
		
		var cancelButton = elem.querySelector('#xcs-webui-header-filter-item-cancel-button');
		var filterItemsContaimer = elem.querySelector('#xcs-webui-bot-filter-items-touch-container');
		
		if (browser().isMobile()) {
			Event.observe(cancelButton, 'touchend', this.handleCancelButtonHasBeenClicked.bind(this));
			Event.observe(elem, 'touchend', this.handleContainerHasBeenClicked.bind(this));
			
			if (browser().isiPad()) {
				elem.style.display = 'none';
			}
		}
		else {
			Event.observe(cancelButton, 'click', this.handleCancelButtonHasBeenClicked.bind(this));
			Event.observe(elem, 'click', this.handleContainerHasBeenClicked.bind(this));
			elem.style.display = 'none';
		}
		return elem;
	},
	handleCancelButtonHasBeenClicked: function() {
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED);
	},
	handleContainerHasBeenClicked: function(inEvent) {
		if (inEvent !== undefined && inEvent.target !== undefined) {
			var node = inEvent.target;
			if (node === this.mParentElement) {
				globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED);
			}
		}
	},
	setFilter: function(inFilter) {
		if (inFilter !== undefined && inFilter !== null) {
			this.mCurrentFilterName = inFilter;
			this.clearAllFilterItems();
			var node = this.mParentElement.querySelector(".xcs-webui-bot-filter-item[data-filter-name='%@']".loc(inFilter));
			if (node !== undefined) {
				node.classList.add('selected');
			}
		}
	},
	getCurrentFilterName: function() {
		return this.mCurrentFilterName;
	},
	setCurrentFilterName: function(inFilterName) {
		if (inFilterName !== undefined && inFilterName !== null) {
			if (inFilterName === XCS.BotFilter.INTEGRATION_FILTER_LATEST || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_CONTRIBUTED || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_FAILED || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED || inFilterName === XCS.BotFilter.INTEGRATION_FILTER_FLAGGED) {
				this.mCurrentFilterName = inFilterName;
			}
		}
	},
	clearAllFilterItems: function() {
		var filterItems = this.mParentElement.querySelectorAll('.xcs-webui-bot-filter-item');
		for (var i = 0; i < filterItems.length; i++) {
			var item = filterItems[i];
			item.classList.remove('selected');
		}
	},
	open: function() {
		this.mParentElement.classList.add('opened');
		if (!browser().isMobile() || (browser().isMobile() && browser().isiPad())) {
			this.mParentElement.style.display = 'block';
		}
		
		if (this.mCurrentFilterName === XCS.BotFilter.INTEGRATION_FILTER_LATEST) {
			this.mParentElement.classList.add('filter-latest');
		}
		else {
			this.mParentElement.classList.remove('filter-latest');
		}
	},
	close: function() {
		this.mParentElement.classList.remove('opened');
		
		if (!browser().isMobile() || (browser().isMobile() && browser().isiPad())) {
			if (this.mCloseTimeout !== null) {
				clearTimeout(this.mCloseTimeout);
			}
			this.mCloseTimeout = setTimeout(function() {
				this.mParentElement.style.display = 'none';
				this.mCloseTimeout = null;
			}.bind(this), 250);
		}
		
	},
	toggle: function() {
		if (this.mParentElement.classList.contains('opened')) {
			this.close();
		}
		else {
			this.open();
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

XCS.WebUI.Views.NoBotsPlaceholderView = Class.create(XCS.Mvc.View, {
	initialize: function($super) {
		$super();
		this.mTemplate = this.getTemplate('no_bots_placeholder');
	},
	render: function() {
		return this.renderTemplate({
			no_bots_configured: "_XCS.PlaceHolder.NotBots.NoBotsConfigured".loc(),
			create_new_bot: "_XCS.PlaceHolder.NotBots.CreateNewBot".loc()
		});
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







XCS.WebUI.Routes = XCS.WebUI.Routes || new Object();

XCS.WebUI.Routes.SLASH_ROUTE = "/" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_INDEX_ROUTE = "/xcode" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOTS_ROUTE = "/xcode/bots" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE = "/xcode/bots/:filter" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOT_ROUTE = "/xcode/bots/:filter/:botTinyId" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD = "/xcode/bots/:filter/:botTinyId/.*" + XCS.Routes.TrailingSlashOptionalQueryParam;

XCS.WebUI.Routes.NOTIFICATION_MENU_ITEM_CLICKED = "NOTIFICATION_MENU_ITEM_CLICKED";

XCS.WebUI.Application = Class.create(XCS.Application, {
	mApplicationIdentifier: "xcs",
	mWebUIController: null,
	createApplication: function($super) {
		$super();
		
		var url = "http://%@:20399".fmt(document.domain);
		this.mActivityStream = new XCS.ActivityStream.Socket({mURL: url});

		this.mWebUIController = new XCS.WebUI.WebUIController();
				
		// Route the initial request.
		this.routeInitialRequestAfterRender();
	},
	webUIControllerRoute: function(inRouteInvocation) {
		if (inRouteInvocation !== undefined && inRouteInvocation.namedMatches) {
			var namedMatched = inRouteInvocation.namedMatches;
			var originalRoutePattern = inRouteInvocation.originalRoutePattern;
			var botTinyId = undefined;
			var filter = undefined;
			if (namedMatched.botTinyId !== undefined) {
				botTinyId = namedMatched.botTinyId;
			}
			if (namedMatched.filter !== undefined) {
				filter = namedMatched.filter;
			}
			this.mWebUIController.load(filter, botTinyId, originalRoutePattern);
		}
		
		this.mWebUIController.configure(inRouteInvocation);
	},
	computeRoutes: function() {
		return [
			[XCS.WebUI.Routes.SLASH_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_INDEX_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOTS_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOT_ROUTE, this.webUIControllerRoute.bind(this)]
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

var application = new XCS.WebUI.Application();

