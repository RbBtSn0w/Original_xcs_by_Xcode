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
	"_XCS.WebUI.WindowTitle": "Xcode Server",
	"_XCS.WebUI.WindowTitle.WithBot": "Xcode Server - %@ Bots",
	"_XCS.WebUI.WindowTitle.WithBotAndIntegration": "Xcode Server - %@ - Integration %@",
	"_XCS.WebUI.Yes": "Yes",
	"_XCS.WebUI.No": "No",
	"_XCS.WebUI.Version.Sdk": "SDKs: %@",
	"_XCS.WebUI.Version.Ios": "iOS %@",
	"_XCS.WebUI.Version.Osx": "OS X %@",
	"_XCS.WebUI.Version.OsxServer": "OS X Server %@",
	"_XCS.WebUI.Version.Xcode": "Xcode %@",
	
	"_XCS.WebUI.BuildResults.unknown": "Internal error",
	"_XCS.WebUI.BuildResults.canceled": "Canceled",
	"_XCS.WebUI.BuildResults.succeeded": "Succeeded",
	"_XCS.WebUI.BuildResults.build-errors": "Finished with errors",
	"_XCS.WebUI.BuildResults.test-failures": "Failed tests",
	"_XCS.WebUI.BuildResults.warnings": "Finished with warnings",
	"_XCS.WebUI.BuildResults.analyzer-warnings": "Finished with analyzer warnings",
	"_XCS.WebUI.BuildResults.build-failed": "Build failed",
	"_XCS.WebUI.BuildResults.checkout-error": "Checkout error",
	"_XCS.WebUI.BuildResults.internal-error": "Internal Error",
	"_XCS.WebUI.BuildResults.internal-checkout-error": "Internal error",
	"_XCS.WebUI.BuildResults.internal-build-error": "Internal error",
	"_XCS.WebUI.BuildResults.internal-processing-error": "Internal error",
	
	"_XCS.PlaceHolder.NotBots.NoBotsConfigured": "No Bots Configured",
	"_XCS.PlaceHolder.NotBots.CreateNewBot": "Create a new bot in Xcode from the product menu.",
	
	"_XCS.BotList.Button.About": "About",

	"_XCS.BotDetail.Header.History.Popup.Logs": "Logs",
	"_XCS.BotDetail.Header.IntegrateNow": "Integrate Now",
	
	"_XCS.BotDetail.BotList.Empty.Latest": "No Integrations",
	"_XCS.BotDetail.BotList.Empty.Failed": "No Failed Integrations",
	"_XCS.BotDetail.BotList.Empty.Succeeded": "No Successful Integrations",
	"_XCS.BotDetail.BotList.Empty.Flagged": "No Flagged Integrations",
	"_XCS.BotDetail.BotList.Empty.Contributed": "No Integrations",
	
	"_XCS.BotDetail.Summary.iOS": "iOS",
	"_XCS.BotDetail.Summary.Mac": "Mac",
	"_XCS.BotDetail.Summary.Download": "Download",
	"_XCS.BotDetail.Summary.Install": "Install",
	"_XCS.BotDetail.Summary.InstallProfile": "Install",
	"_XCS.BotDetail.Summary.IntegrationNumber": "Integration %@",
	"_XCS.BotDetail.Summary.PopUpTitle": "%@ (%@) - Integration %@",
	"_XCS.BotDetail.Summary.SummaryResults": "Summary Results",
	"_XCS.BotDetail.Summary.Contributors": "Contributors",
	"_XCS.BotDetail.Summary.ContributorsNumber": "Contributors (%@)",
	"_XCS.BotDetail.Summary.ContributorsSummaryTitle.uniqueContributor.uniqueCommit": "%@ contributor (%@ new commit)",
	"_XCS.BotDetail.Summary.ContributorsSummaryTitle.uniqueContributor.multipleCommits": "%@ contributor (%@ new commits)",
	"_XCS.BotDetail.Summary.ContributorsSummaryTitle.multipleContributors.uniqueCommit": "%@ contributors (%@ new commit)",
	"_XCS.BotDetail.Summary.ContributorsSummaryTitle.multipleContributors.multipleCommits": "%@ contributors (%@ new commits)",
	"_XCS.BotDetail.Summary.ContributorsCommitsMessages.Timestamps": "Commit %@ %@",
	"_XCS.BotDetail.Summary.ContributorsCommitsMessages.Empty": "No commits",
	"_XCS.BotDetail.Summary.HostnameInstallAlert": "For securitiy reasons, apps can only be installed when visiting your server through its canonical hostname (%@).",
	"_XCS.BotDetail.Summary.DownloadLogsLabel": "Download",
	"_XCS.BotDetail.Summary.OpenXcodeLabel": "Open in Xcode",
	"_XCS.BotDetail.Summary.ProductLabel": "Product",
	"_XCS.BotDetail.Summary.ArchiveLabel": "Archive",
	
	"_XCS.Header.BigScreen": "Big Screen",
	"_XCS.Header.LogIn": "Log In",
	"_XCS.Header.LogOut": "Log Out",
	"_XCS.Header.Back": "Back",
	"_XCS.Header.Filter.Showing": "Show: %@",
	"_XCS.Header.Filter.Latest": "Latest",
	"_XCS.Header.Filter.Contributed": "Contributed",
	"_XCS.Header.Filter.Failed": "Failed",
	"_XCS.Header.Filter.Succeeded": "Succeeded",
	"_XCS.Header.Filter.Flagged": "Flagged",
	"_XCS.Header.Filter.Label": "Filter Integrations",
	"_XCS.Header.Filter.Cancel.Label": "Cancel",
	
	"_XCS.BrowserTitle.BotSummary": "Xcode - All Bots",
	"_XCS.BrowserTitle.BigScreen": "Xcode - Big Screen",
	"_XCS.BrowserTitle.BotDetail": "Xcode - %@1 %@2",
	"_XCS.ProductTitle": "Xcode",

	// Do not localize these help links.
	"_XCS.Help.Desktop.URL": "https://help.apple.com/xcode/mac/1.0/",
	"_XCS.Help.iPad.URL": "https://help.apple.com/xcode/ipad/1.0/",
	
	// WAI ARIA - Accessiblity
	"_XCS.Accessibility.Button.Delete": "Delete",
	"_XCS.Accessibility.Navigation.IntegrationMenu": "Integration Menu",
	"_XCS.Accessibility.Label.Devices": "Devices",
	"_XCS.Accessibility.Label.LastIntegration": "Latest Integration",
	"_XCS.Accessibility.Label.NextIntegration": "Next Integration",
	"_XCS.Accessibility.Label.LatestDownloads": "Latest Downloads",
	"_XCS.Accessibility.Label.ListStatusView": "List Status View",
	"_XCS.Accessibility.Label.Downloads": "Downloads",
	"_XCS.Accessibility.Label.IntegrateNumber": "Integrate number",
	"_XCS.Accessibility.Label.Header": "Header",
	"_XCS.Accessibility.Label.Details": "Details",
	"_XCS.Accessibility.Label.DeviceInfo": "Device Info",
	"_XCS.Accessibility.Label.TestResultsList": "Test results list",
	"_XCS.Accessibility.Label.TestSucceed": "Tests succeed",
	"_XCS.Accessibility.Label.Fail": "Fail",
	"_XCS.Accessibility.Label.Success": "Success",
	"_XCS.Accessibility.Label.TabNavigation": "Tab Navigation",
	"_XCS.Accessibility.Label.Content": "Content",
	"_XCS.Accessibility.Label.TestsResult": "Tests Result",
	"_XCS.Accessibility.Label.ResultSummary": "Result Summary",
	"_XCS.Accessibility.Label.IntegrationResult": "Integration Result",
	"_XCS.Accessibility.Label.IntegrationResult": "History",
	"_XCS.Accessibility.Label.BotSummary": "Bot Summary"
});
