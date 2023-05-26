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

if (typeof apple_loc_strings == "undefined") {
	apple_loc_strings = {version:'1.0'};
}

var populateStrings = function(obj) {
	for (aProperty in obj) {
		apple_loc_strings[aProperty] = obj[aProperty];
	}
};

populateStrings({
	"XCS.BrowserTitle.BigScreen": "Xcode - Big Screen",
	"XCS.BigScreen.Empty.Label": "No Bots Configured",
	"XCS.BigScreen.EntityView.Integration.Label": "Integration %@",
	"XCS.BigScreen.EntityView.Committers.Singular.Label": "1 Committer",
	"XCS.BigScreen.EntityView.Committers.Plural.Label": "%@ Committers",
	"XCS.BigScreen.Status.PerformingIntegration": "Performing Integration %@ Now",
	"XCS.BigScreen.Status.IntegrationCompleted": "Integration %@ built at %@",
	"XCS.BigScreen.Status.Running": "%@ is running…",
	"XCS.BigScreen.Commits.Empty.Placeholder": "No Commits",
	"XCS.BigScreen.Commits.Hidden.Placeholder": "Commit Messages Hidden",
	"XCS.BigScreen.Devices.Empty.Placeholder": "No Devices",
	"XCS.BigScreen.Settings.Label": "Big Screen Settings",
	"XCS.BigScreen.Settings.SortBy.Label": "Sort by",
	"XCS.BigScreen.Settings.SortBy.Importance.Label": "Importance",
	"XCS.BigScreen.Settings.SortBy.Name.Label": "Name",
	"XCS.BigScreen.Settings.SortBy.Time.Label": "Time",
	"XCS.BigScreen.Settings.Commits.Label": "Show commit messages",
	"XCS.BigScreen.Settings.Commits.Yes.Label": "Yes",
	"XCS.BigScreen.Settings.Commits.No.Label": "No",
	"XCS.BigScreen.Settings.Button.Cancel": "Cancel",
	"XCS.BigScreen.Settings.Button.Save": "Save",
	"XCS.BigScreen.Settings.Button.Reload": "Reload",
	"XCS.BigScreen.Settings.Failure.Title.Default": "Xcode Server is unavailable",
	"XCS.BigScreen.Settings.Failure.Title.UnsupportedBrowser": "Unsupported Browser",
	"XCS.BigScreen.Settings.Failure.DefaultMessage": "Xcode Server is unavailable.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.DefaultMessageIncludingMinutes.Singular": "Xcode Server has been unreachable for 1 minute.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.DefaultMessageIncludingMinutes.Plural": "Xcode Server has been unreachable for %@ minutes.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.DefaultMessageIncludingHours.Singular": "Xcode Server has been unreachable for 1 hour.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.DefaultMessageIncludingHours.Plural": "Xcode Server has been unreachable for %@ hours.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.DefaultMessageIncludingDays.Singular": "Xcode Server has been unreachable for 1 day.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.DefaultMessageIncludingDays.Plural": "Xcode Server has been unreachable for %@ days.  Big Screen will automatically try to reconnect every 60 seconds.  If you would like to manually reconnect, click Reload.",
	"XCS.BigScreen.Settings.Failure.QueuePause": "Big Screen has stopped responding to bot run status updates and must be reloaded.",
	"XCS.BigScreen.Settings.Failure.UnsupportedBrowser": "Big Screen is designed to work only on Safari, Google Chrome, and other WebKit-based web browsers.",
	"XCS.BigScreen.Performance": "Performance"
});