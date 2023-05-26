// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
	"_Loading": "Loading…",
	"_UnsupportedBrowser.Warning": "Your browser is not supported.\n\nThe latest version of Safari, Chrome, Firefox or Internet Explorer is required to use Wiki Server and Xcode Server on OS X Server. You can also visit this page from an iPod touch, iPhone or iPad.",
	"_Errors.403": "You are not authorized to view this page.",
	"_Errors.404": "The page you're looking for can't be found.",
	"_Errors.500": "An unexpected error occurred. Try refreshing this page.",
	"_Errors.Calendar.Disabled": "Calendar is disabled for this server.  Contact your administrator for help.",
	"_Errors.Wiki.Calendar.Disabled": "Calendar is disabled. The owner of this wiki can enable Calendar in Wiki Settings.",
	"_Errors.Wiki.Calendar.Disabled.NonSSL": "Calendar requires a secure connection. Try visiting this page with a secure URL or contact your administrator for help.",
	"_Errors.Wiki.Blog.Disabled": "Blog is disabled. The owner of this wiki can enable Blog in Wiki Settings.",
	"_XCServer": "Xcode Server",
	"_Loading": "Loading…",
	"_General.Wikis": "Wikis",
	"_General.People": "People",
	"_General.Tags": "Tags",
	"_General.All.Wikis": "All Wikis",
	"_General.All.People": "All People",
	"_General.All.Tags": "All Tags",
	"_General.Documents": "Documents",
	"_General.No.Results.Found": "No results found",
	"_General.No.Wikis.Found": "No wikis found",
	"_General.No.People.Found": "No people found",
	"_General.Loading": "Loading…",
	"_General.Navigation": "Navigation",
	"_General.Home": "Home",
	"_General.Profile": "Profile",
	"_General.Error.NotFound": "Page not found",
	"_General.Error.PermissionDenied": "Permission denied",
	"_General.Error.Unknown": "An unknown error occurred",
	"_General.Save": "Save",
	"_General.Cancel": "Cancel",
	"_Project.Default.Title": "Untitled Project",
	"_Page.Default.Title": "Untitled Page",
	"_Blog.Default.Title": "Blog",
	"_Access.Role.own": "Owner",
	"_Access.Role.write": "Read & write",
	"_Access.Role.read": "Read only",
	"_Access.Role.none": "No access",
	"_Access.User.unauthenticated": "All unauthenticated users",
	"_Access.User.authenticated": "All logged in users",
	"_Access.Remove": "Remove",
	"_Access.Autocomplete.Placeholder": "Type a user or group name here",
	"_General.Unread.Toggle.Title": "Toggle unread",
	"_General.Favorite.Toggle.Title": "Toggle favorite",
	"_General.Load.More": "Load more…",
	"_General.No.Results.Found": "No results found",
	"_General.LastModified.Format": "%@2 updated %@1",
	"_General.LastActivity.Format": "Last activity %@",
	"_EntityTitle.PageTitle.Untitled": "Untitled",
	"_EntityTitle.LastModified": "%@2 updated %@1",
	"_EntityTitle.LastModified.Unauthenticated": "Unauthenticated",
	"_FilterBarView.Filters.Everything.Title": "Everything",
	"_FilterBarView.Filters.Everything.Tooltip": "Show everything",
	"_FilterBarView.Filters.Everywhere.Title": "Everywhere",
	"_FilterBarView.Filters.Everywhere.Tooltip": "Show everywhere",
	"_FilterBarView.Filters.Deleted.Title": "Deleted",
	"_FilterBarView.Filters.Deleted.Tooltip": "Show deleted items only",
	"_FilterBarView.Filters.Unread.Title": "Unread",
	"_FilterBarView.Filters.Unread.Tooltip": "Show unread only",
	"_FilterBarView.Filters.Favorites.Title": "Favorites",
	"_FilterBarView.Filters.Favorites.Tooltip": "Show favorites only",
	"_FilterBarView.SortBy": "Sort by",
	"_FilterBarView.SortKeys.Rank.Title": "Most relevant",
	"_FilterBarView.SortKeys.Rank.Tooltip": "Sort by most relevant items first",
	"_FilterBarView.SortKeys.Title.Title": "Title",
	"_FilterBarView.SortKeys.Title.Tooltip": "Sort by title",
	"_FilterBarView.SortKeys.MostRecent.Title": "Most recent",
	"_FilterBarView.SortKeys.MostRecent.Tooltip": "Show newest items first",
	"_FilterBarView.SortKeys.LeastRecent.Title": "Least recent",
	"_FilterBarView.SortKeys.LeastRecent.Tooltip": "Show oldest items first",
	"_FilterBarView.Filter": "Filter",
	"_QuickLook.Status.Preview.Loading": "Loading Preview…",
	"_QuickLook.Status.Preview.Missing": "This file has no preview. Try uploading it again.",
	"_QuickLook.Thumbnail.Page.Count": "Page %@ of %@",
	"_QuickLook.Thumbnail.Scroll.Up": "Show previous",
	"_QuickLook.Thumbnail.Scroll.Down": "Show next",
	"_Files.PreviewMissing": "No Preview Available",
	"_Files.Pagination.Page.Count": "Page %@ of %@",
	"_Files.Pagination.Load.More": "Load more…",
	"_Revisions.Controls.Cancel.Label": "Cancel",
	"_Revisions.Controls.Restore.Label": "Restore",
	"_Revisions.Controls.ShowChanges.Label": "Show Changes",
	"_Revisions.Controls.HideChanges.Label": "Hide Changes",	
	"_AvatarEditor.UploadFailed": "Could not upload image. Please try again.",
	"_AvatarEditor.Upload": "Upload…",
	"_AvatarEditor.Replace": "Replace…",
	"_Settings.Avatar.Projects.Label": "Wiki Icon",
	"_Settings.Avatar.People.Label": "My Icon",
	"_Settings.Avatar.UploadButton": "Upload…",
	"_Settings.Avatar.ReplaceButton": "Replace…",
	"_Settings.Avatar.DeleteButton": "Delete",
	"_Settings.Avatar.Placeholder": "Add image",
	"_Settings.Avatar.Remove": "Remove image",
	"_Settings.BannerImage.Label": "Custom Banner",
	"_Settings.BannerImage.Help": "Banner image height should be 124 pixels.",
	"_Settings.BackgroundImage.Label": "Custom Background",
	"_Settings.Save.Progress.Message": "Saving settings…",
	"_Settings.Save.Error.Message": "Settings could not be saved. Please try again.",
	"_Files.Upload.Dialog.Title": "Upload File",
	"_Files.Upload.Dialog.Label": "File",
	"_Files.Upload.Dialog.OK": "Upload",
	"_Files.Progress.Uploading": "Uploading…",
	"_PlusMenu.Project.File": "Upload File to \"%@\"…",
	"_PlusMenu.Private.File": "Upload File to My Documents…",
	"_Activity.No.Results.Found": "No activity found",
	"_Activity.All": "All Activity",
	"_Activity.My" : "My Activity",
	"_Activity.None" : "No Activity",
	"_Activity.ShortTitle" : "Activity",
	"_Activity.More.Count.Singular": "1 more update",
	"_Activity.More.Count.Plural": "%@ more updates",
	"_Activity.More.Hide": "Hide",
	"_Activity.MarkAllRead": "Mark all as read",
	// User performed action Today at 12:00 PM
	"_Activity.Action.TagAdded": "%@1 tagged with \"%@2\" %@3",
	"_Activity.Action.TagRemoved": "%@1 removed tag \"%@2\" %@3",
	"_Activity.Action.EntityCreated": "%@1 created %@2",
	"_Activity.Action.EntityUpdated": "%@1 edited %@2",
	"_Activity.Action.EntityRenamed": "%@1 renamed from \"%@2\" to \"%@3\" %@4",
	"_Activity.Action.EntityRemoved": "%@1 deleted %@2 %@3",
	"_Activity.Action.EntityMoved": "%@1 moved to \"%@2\" %@3",
	"_Activity.Action.RelationshipAdded": "%@1 related %@2 %@3",
	"_Activity.Action.RelationshipRemoved": "%@1 unrelated %@2 %@3",
	"_Activity.Action.CommentAdded": "%@1 commented \"%@2\" %@3",
	"_Activity.Action.CommentRemoved": "%@1 deleted comment \"%@2\" %@3",
	"_Activity.Action.CommentApproved": "%@1 approved comment \"%@2\" %@3",
	"_Activity.Action.BlogEnabled": "%@1 enabled blog %@2",
	"_Activity.Action.BlogDisabled": "%@1 disabled blog %@2",
	"_Activity.Action.CalendarEnabled": "%@1 enabled calendar %@2",
	"_Activity.Action.CalendarDisabled": "%@1 disabled calendar %@2",
	"_Activity.Action.Coalesced.TagAdded": "%@1 added %@2 tags %@3",
	"_Activity.Action.Coalesced.TagRemoved": "%@1 removed %@2 tags %@3",
	"_Activity.Action.Coalesced.EntityUpdated": "%@1 edited %@2 times %@3",	
	"_Activity.Action.Coalesced.RelationshipAdded": "%@1 related %@2 documents %@3",
	"_Activity.Action.Coalesced.RelationshipRemoved": "%@1 unrelated %@2 documents %@3",
	"_Activity.Action.Coalesced.CommentAdded": "%@1 added %@2 comments %@3",
	"_Activity.Action.Coalesced.CommentRemoved": "%@1 removed %@2 comments %@3",
	"_Activity.Action.Coalesced.CommentApproved": "%@1 approved %@2 comments %@3",
	"_ActionMenu.Help.Title":"Help",
	// Today at 12:00 PM
	"_DateTime.Unknown": "Unknown",
	"_DateTime.Format": "%@1 at %@2",
	"_DateTime.NoAt.Format": "%@1 %@2",
	"_DateTime.Short.Format": "%@1, %@2",
	"_Date.Month.Names": "January,February,March,April,May,June,July,August,September,October,November,December",
	"_Date.Short.Month.Names": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
	"_Date.Day.Names": "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
	"_Date.Short.Day.Names": "Sun,Mon,Tues,Wed,Thur,Fri,Sat",
	"_Date.Today": "Today",
	"_Date.Yesterday": "Yesterday",
	"_Date.Tomorrow": "Tomorrow",
	"_Date.Unknown": "Unknown date",
	// mm/dd/yyyy
	"_Date.Default.Format": "%@1/%@2/%@3",
	// Month Date
	"_Date.Short.Format": "%@1 %@2",
	// Month Date, Year
	"_Date.Long.Format": "%@1 %@2, %@3",
	"_Date.Long.WithTime.Format": "%@1 %@2, %@3 at %@4",
	"_Time.AM": "AM",
	"_Time.PM": "PM",
	// 7:30 AM
	"_Time.Default.Format": "%@1:%@2 %@3",
	"_Time.Unknown": "Unknown time",
	"_Duration.MoreThanADay": "More than a day",
	"_Duration.LessThanAMinute": "Less than a minute",
	"_Duration.SingleHourMinutes": "1 hour %@ minutes",
	"_Duration.SingleHourSingleMinutes": "1 hour 1 minute",
	"_Duration.PluralHourMinutes": "%@1 hours %@2 minutes",
	"_Duration.PluralHourSingleMinutes": "%@ hours 1 minute",
	"_Duration.Hours": "%@ hours",
	"_Duration.Minutes": "%@ minutes",
	"_Duration.Seconds": "%@ seconds",
	"_TimeDifference.SingleDaysAgo": "1 day ago",
	"_TimeDifference.PluralDaysAgo": "%@ days ago",
	"_TimeDifference.SingleHoursAgo": "1 hr ago",
	"_TimeDifference.PluralHoursAgo": "%@ hrs ago",
	"_TimeDifference.SingleMinutesAgo": "1 min ago",
	"_TimeDifference.PluralMinutesAgo": "%@ min ago",
	"_TimeDifference.LessThanAMinuteAgo": "Just now",
	"_TimeDifference.InSingleDays": "In 1 day",
	"_TimeDifference.InPluralDays": "In %@ days",
	"_TimeDifference.InSingleHours": "In 1 hr",
	"_TimeDifference.InPluralHours": "In %@ hrs",
	"_TimeDifference.InSingleMinutes": "In 1 min",
	"_TimeDifference.InPluralMinutes": "In %@ min",
	"_Revisions.Progress.Loading.Document.History": "Loading document history…",
	"_Revisions.Progress.Loading.Revision": "Loading revision…",
	"_Revisions.Progress.Loading.Revision.Changes": "Loading changes for revision…",
	"_Revisions.Notification.Revision.Changes.Failed": "Could not get changes for revision",
	"_Revisions.Progress.Restoring.Document": "Restoring previous version…",
	"_Revisions.Notification.Restore.Document.Success": "Previous version successfully restored",
	"_Revisions.Notification.Restore.Document.Failed": "Previous version could not be restored. Please try again.",
	"_Revisions.Placeholder.Empty.Revision": "Empty document",
	"_Revisions.Placeholder.No.Revisions.Found": "No history items",
	"_Revisions.Attachment.Download.Tooltip": "Download this attachment to your computer.",
	"_Search.SearchResults": "Search Results",
	"_Search.SearchResults.Keyword": "Search Results For \"%@\"",
	"_Search.SavedSearch.Save": "Save search",
	"_Search.SavedSearch.Untitled": "Untitled search",
	"_Search.SavedSearch.Save.Dialog.Title": "Save Search",
	"_Search.SavedSearch.Save.Dialog.Label": "Name:",
	"_Search.SavedSearch.Save.Dialog.OK": "Save",
	"_Search.SavedSearch.Save.Dialog.Progress": "Saving search…",
	"_Search.SavedSearch.Delete.Title": "Delete Saved Search",
	"_Search.SavedSearch.Delete.Description": "Are you sure you want to permanently delete this saved search? You cannot undo this action.",
	"_Search.SavedSearch.Loading": "Loading…",
	"_Search.SavedSearch.ErrorExecutingSearch": "Error executing saved search",
	"_Search.Show.More": "Show more (%@)…",
	"_Search.Load.More": "Load more…",
	"_Search.Owner.Title.Format": "in %@",
	"_Search.LastModified.Subtitle.Format": "%@2 updated %@1",
	"_Search.Tags.Subtitle": "Tags:",
	"_Search.MultipleSnippet.Divider": "...",
	"_Editor.Apple.Copyright.Notice": "Copyright &copy; 2011-2013 Apple Inc. All rights reserved.",
	"_Editor.Edit.Title": "Edit",
	"_Editor.Edit.Tooltip": "Edit this page",
	"_Editor.Save.Title": "Save",
	"_Editor.Save.Tooltip": "Save your changes to this page",
	"_Editor.Cancel.Title": "Cancel",
	"_Editor.Cancel.Tooltip": "Undo any changes you have made to this page",
	"_Editor.Undo.Title": "Undo",
	"_Editor.Undo.Tooltip": "Undo the last change you made to this page",
	"_Editor.Delete.Block": "Delete this content",
	"_Editor.Delete.Block.Selected": "Delete the selected content",
	"_Editor.Notifications.General.Error": "An error occurred. Please try again.",
	"_Editor.Notifications.Page.Saving": "Saving changes…",
	"_Editor.Notifications.Page.Checking.Status": "Checking page status…",
	"_Editor.Notifications.Page.Checking.Status.Error": "An error occurred saving this page. Please try again.",
	"_Editor.Notifications.Page.Edit.LoginError": "Your session expired. Please log in to edit the page.",
	"_Editor.Notifications.Page.Saved.Error": "Your changes could not be saved. Please try again.",
	"_Editor.Notifications.Page.Saved.LoginError": "Your session expired. Please log in to save your changes.",
	"_Editor.Unload.Warning": "Any changes to this page will not be saved.",
	// We have an explicit string here for cases where the browser does not automatically append the "Are you sure" text
	"_Editor.Unload.Full.Warning": "Are you sure you want to leave this page?\n\nAny changes to this page will not be saved.",
	"_Editor.Toolbar.Empty.Placeholder": "This toolbar is empty.",
	"_Editor.Toolbar.Block.Text.Title": "Text",
	"_Editor.Toolbar.Block.Text.Tooltip": "Add text to the page.",
	"_Editor.Toolbar.Block.File.Title": "File",
	"_Editor.Toolbar.Block.File.Tooltip": "Upload a file and add it to the page.",
	"_Editor.Toolbar.Block.Table.Title": "Table",
	"_Editor.Toolbar.Block.Table.Tooltip": "Add a table to the page.",
	"_Editor.Toolbar.Block.Sandbox.Title": "HTML Snippet",
	"_Editor.Toolbar.Block.Sandbox.Tooltip": "Add an HTML snippet to the page.",
	"_Editor.Block.Debug": "[Debug]",
	"_Editor.Block.Text.Toolbar.Formatting.Title": "Formatting",
	"_Editor.Block.Text.Toolbar.Formatting.Tooltip": "Show formatting options for text.",
	"_Editor.Block.Text.Toolbar.Formatting.Paragraph.Title": "Paragraph",
	"_Editor.Block.Text.Toolbar.Formatting.Paragraph.Tooltip": "Make text paragraph.",
	"_Editor.Block.Text.Toolbar.Formatting.BlockQuote.Title": "Block Quote",
	"_Editor.Block.Text.Toolbar.Formatting.BlockQuote.Tooltip": "Make text quotation.",
	"_Editor.Block.Text.Toolbar.Formatting.Monospace.Title": "Monospace",
	"_Editor.Block.Text.Toolbar.Formatting.Monospace.Tooltip": "Make text monospaced.",
	"_Editor.Block.Text.Toolbar.Formatting.LargeHeader.Title": "Large Header",
	"_Editor.Block.Text.Toolbar.Formatting.LargeHeader.Tooltip": "Make text large header.",
	"_Editor.Block.Text.Toolbar.Formatting.MediumHeader.Title": "Medium Header",
	"_Editor.Block.Text.Toolbar.Formatting.MediumHeader.Tooltip": "Make text medium header.",
	"_Editor.Block.Text.Toolbar.Formatting.SmallHeader.Title": "Small Header",
	"_Editor.Block.Text.Toolbar.Formatting.SmallHeader.Tooltip": "Make text small header.",
	"_Editor.Block.Text.Toolbar.Style.Title": "Style",
	"_Editor.Block.Text.Toolbar.Style.Tooltip": "Style options for text.",
	"_Editor.Block.Text.Toolbar.Style.Plain.Title": "Plain",
	"_Editor.Block.Text.Toolbar.Style.Plain.Tooltip": "No style.",
	"_Editor.Block.Text.Toolbar.Style.Bold.Title": "Bold",
	"_Editor.Block.Text.Toolbar.Style.Bold.Tooltip": "Make text bold.",
	"_Editor.Block.Text.Toolbar.Style.Italic.Title": "Italic",
	"_Editor.Block.Text.Toolbar.Style.Italic.Tooltip": "Make text italic.",
	"_Editor.Block.Text.Toolbar.Style.Underline.Title": "Underline",
	"_Editor.Block.Text.Toolbar.Style.Underline.Tooltip": "Make text underlined.",
	"_Editor.Block.Text.Toolbar.Style.Important.Title": "Important",
	"_Editor.Block.Text.Toolbar.Style.Important.Tooltip": "Make text important.",
	"_Editor.Block.Text.Toolbar.Style.Emphasis.Title": "Emphasis",
	"_Editor.Block.Text.Toolbar.Style.Emphasis.Tooltip": "Emphasize text.",
	"_Editor.Block.Text.Toolbar.Style.Highlight.Title": "Highlight",
	"_Editor.Block.Text.Toolbar.Style.Highlight.Tooltip": "Highlight text.",
	"_Editor.Block.Text.Style.Plain.Title": "Plain",
	"_Editor.Block.Text.Style.Plain.Description": "Text with no style.",
	"_Editor.Block.Text.Style.Bold.Title": "Bold",
	"_Editor.Block.Text.Style.Bold.Description": "Bold text.",
	"_Editor.Block.Text.Style.Italic.Title": "Italic",
	"_Editor.Block.Text.Style.Italic.Description": "Italic text.",
	"_Editor.Block.Text.Style.Underline.Title": "Underlined",
	"_Editor.Block.Text.Style.Underline.Description": "Underlined text.",
	"_Editor.Block.Text.Style.Important.Title": "Important",
	"_Editor.Block.Text.Style.Important.Description": "Extremely important text.",
	"_Editor.Block.Text.Style.Emphasis.Title": "Emphasized",
	"_Editor.Block.Text.Style.Emphasis.Description": "Emphasized text.",
	"_Editor.Block.Text.Style.Highlight.Title": "Highlighted",
	"_Editor.Block.Text.Style.Highlight.Description": "Highlighted text.",
	"_Editor.Block.Text.Toolbar.Alignment.Title": "Alignment",
	"_Editor.Block.Text.Toolbar.Alignment.Tooltip": "Alignment options for text.",
	"_Editor.Block.Text.Toolbar.Alignment.Left.Title": "Align Left",
	"_Editor.Block.Text.Toolbar.Alignment.Left.Tooltip": "Align text to the left.",
	"_Editor.Block.Text.Toolbar.Alignment.Right.Title": "Align Right",
	"_Editor.Block.Text.Toolbar.Alignment.Right.Tooltip": "Align text to the right.",
	"_Editor.Block.Text.Toolbar.Alignment.Center.Title": "Center",
	"_Editor.Block.Text.Toolbar.Alignment.Center.Tooltip": "Center text.",
	"_Editor.Block.Text.Toolbar.Alignment.Justify.Title": "Justify",
	"_Editor.Block.Text.Toolbar.Alignment.Justify.Tooltip": "Justify text (align to the left and the right).",
	"_Editor.Block.Text.Toolbar.Link.Title": "Link",
	"_Editor.Block.Text.Toolbar.Link.Tooltip": "Add a link to another page or external URL.",
	"_Editor.Block.Text.Toolbar.List.Style.Title": "List",
	"_Editor.Block.Text.Toolbar.List.Style.Tooltip": "Make text a list.",
	"_Editor.Block.Text.Toolbar.List.Style.Bulleted.Title": "• Bulleted",
	"_Editor.Block.Text.Toolbar.List.Style.Bulleted.Tooltip": "Make bulleted list.",
	"_Editor.Block.Text.Toolbar.List.Style.Numbered.Title": "1. Numbered",
	"_Editor.Block.Text.Toolbar.List.Style.Numbered.Tooltip": "Make numbered list.",
	"_Editor.Block.Text.Toolbar.List.Style.None.Title": "None",
	"_Editor.Block.Text.Toolbar.List.Style.None.Tooltip": "Remove list formatting.",
	"_Editor.Block.Text.Toolbar.List.Indentation.Title": "Indentation",
	"_Editor.Block.Text.Toolbar.List.Indentation.Tooltip": "Indentation options for list.",
	"_Editor.Block.Text.Toolbar.List.Indentation.Indent.Title": "Indent",
	"_Editor.Block.Text.Toolbar.List.Indentation.Indent.Tooltip": "Increase the indentation of this list item.",
	"_Editor.Block.Text.Toolbar.List.Indentation.Outdent.Title": "Outdent",
	"_Editor.Block.Text.Toolbar.List.Indentation.Outdent.Tooltip": "Decrease the indentation of this list item.",
	"_Editor.Links.Toolbar.Popup.New.Title": "New page…",
	"_Editor.Links.Toolbar.Popup.New.Tooltip": "Create a new page and link to it.",
	"_Editor.Links.Toolbar.Popup.Search.Title": "Search…",
	"_Editor.Links.Toolbar.Popup.Search.Tooltip": "Search for an existing page or file and link to it.",
	"_Editor.Links.Toolbar.Popup.Manual.Title": "Enter URL…",
	"_Editor.Links.Toolbar.Popup.Manual.Tooltip": "Create a link to an external URL.",
	"_Editor.Links.Toolbar.Popup.Unlink.Title": "Unlink",
	"_Editor.Links.Toolbar.Popup.Unlink.Tooltip": "Remove an existing link from the page.",
	"_Editor.Links.Toolbar.Popup.Recents": "Recents",
	"_Editor.Links.Toolbar.Popup.Recents.None.Placeholder": "No recent items",
	"_Editor.Links.Dialog.Add": "Add",
	"_Editor.Links.Dialog.Cancel": "Cancel",
	"_Editor.Links.Dialog.Manual.Title": "Add Link",
	"_Editor.Links.Dialog.Manual.Description": "Type a URL and name for your link.",
	"_Editor.Links.Dialog.Manual.Label.URL": "URL:",
	"_Editor.Links.Dialog.Manual.Label.LinkText": "Link Text:",
	"_Editor.Block.Text.Placeholder": "Replace this text with your own content",
	"_Editor.Block.Text.Debug.Dialog.Title": "Text Block Debug Mode",
	"_Editor.Block.Text.Debug.Dialog.HTML.Label": "Raw HTML",
	"_Editor.Block.Text.Debug.Dialog.Formatting.Label": "Formatting",
	"_Editor.Block.Text.Debug.Dialog.Alignment.Label": "Alignment",
	"_Editor.Block.Text.Debug.Dialog.Properties.Label": "Properties",
	"_Editor.Block.Text.Debug.Dialog.Cancel": "Cancel",
	"_Editor.Block.Text.Debug.Dialog.Update": "Update",
	"_Editor.Block.Text.Debug.CopyPaste.Title": "Text Block Copy/Paste Debug Console",
	"_Editor.Block.Text.Debug.CopyPaste.Clear.Title": "Clear",
	"_Editor.Block.Text.Debug.CopyPaste.Clear.Tooltip": "Clear here to clear the copy/paste debug panel.",
	"_Editor.Block.Text.Debug.CopyPaste.Toggle.Open.Title": "Open",
	"_Editor.Block.Text.Debug.CopyPaste.Toggle.Close.Title": "Close",
	"_Editor.Block.Text.Debug.CopyPaste.Toggle.Tooltip": "Click here to toggle this panel.",
	"_Editor.Block.Text.Debug.CopyPaste.Clipboard.Label": "Current copy/paste clipboard:",
	"_Editor.Block.Text.Debug.CopyPaste.Clipboard.Placeholder": "Clipboard is empty",
	"_Editor.Block.Table.Toolbar.Title": "Table",
	"_Editor.Block.Table.Toolbar.Tooltip": "Add a new table to the page.",
	"_Editor.Block.Table.Toolbar.Adjust.Title": "Add/remove row/column",
	"_Editor.Block.Table.Toolbar.Adjust.Tooltip": "Add or remove a row or column from this table.",
	"_Editor.Block.Table.Toolbar.Add.Row.Title": "Add row",
	"_Editor.Block.Table.Toolbar.Add.Row.Tooltip": "Add empty row to this table.",
	"_Editor.Block.Table.Toolbar.Remove.Row.Title": "Remove row",
	"_Editor.Block.Table.Toolbar.Remove.Row.Tooltip": "Remove row from this table.",
	"_Editor.Block.Table.Toolbar.Add.Column.Title": "Add column",
	"_Editor.Block.Table.Toolbar.Add.Column.Tooltip": "Add empty column to this table.",
	"_Editor.Block.Table.Toolbar.Remove.Column.Title": "Remove column",
	"_Editor.Block.Table.Toolbar.Remove.Column.Tooltip": "Remove column from this table.",
	"_Editor.Block.Table.Toolbar.Settings.Title": "Table Settings",
	"_Editor.Block.Table.Toolbar.Settings.Tooltip": "Modify settings for this table.",
	"_Editor.Block.Table.Dialog.Settings.Title": "Table Settings",
	"_Editor.Block.Table.Dialog.Settings.Gridlines.Label": "Show table gridlines",
	"_Editor.Block.Table.Dialog.Settings.Alternating.Label": "Alternate row colors",
	"_Editor.Block.Table.Dialog.Settings.OK": "Update",
	"_Editor.Block.Table.Dialog.Settings.Cancel": "Cancel",
	"_Editor.Block.Table.Popup.Column.Sort.Ascending.Title": "Sort Ascending",
	"_Editor.Block.Table.Popup.Column.Sort.Ascending.Tooltip": "Sort table by this column in ascending order.",
	"_Editor.Block.Table.Popup.Column.Sort.Descending.Title": "Sort Descending",
	"_Editor.Block.Table.Popup.Column.Sort.Descending.Tooltip": "Sort table by this column in descending order.",
	"_Editor.Block.Table.Popup.Column.Add.Before.Title": "Add Column Before",
	"_Editor.Block.Table.Popup.Column.Add.Before.Tooltip": "Add empty column before this column.",
	"_Editor.Block.Table.Popup.Column.Add.After.Title": "Add Column After",
	"_Editor.Block.Table.Popup.Column.Add.After.Tooltip": "Add empty column after this column.",
	"_Editor.Block.Table.Popup.Column.Delete.Title": "Delete Column",
	"_Editor.Block.Table.Popup.Column.Delete.Tooltip": "Delete this column.",
	"_Editor.Block.Table.Popup.Column.Header.Title": "Header Column",
	"_Editor.Block.Table.Popup.Column.Header.Tooltip": "Use header formatting for this table column.",
	"_Editor.Block.Table.Popup.Row.Add.Above.Title": "Add Row Above",
	"_Editor.Block.Table.Popup.Row.Add.Above.Tooltip": "Add empty row above this row.",
	"_Editor.Block.Table.Popup.Row.Add.Below.Title": "Add Row Below",
	"_Editor.Block.Table.Popup.Row.Add.Below.Tooltip": "Add empty row below this row.",
	"_Editor.Block.Table.Popup.Row.Delete.Title": "Delete Row",
	"_Editor.Block.Table.Popup.Row.Delete.Tooltip": "Delete this row.",
	"_Editor.Block.Table.Popup.Row.Header.Title": "Header Row",
	"_Editor.Block.Table.Popup.Row.Header.Tooltip": "Use header formatting for this table row.",
	"_Editor.Block.Table.Dialog.Delete.Title": "Delete table",
	"_Editor.Block.Table.Dialog.Delete.Description": "Are you sure you want to delete this table? You cannot undo this action.",
	"_Editor.Block.Table.Dialog.Delete.OK": "Delete",
	"_Editor.Block.Sandbox.Markup.Description": "Type or paste some HTML markup to get started.",
	"_Editor.Block.Sandbox.Edit.MatchStyle.Label": "Match styles",
	"_Editor.Block.Sandbox.Edit.MatchStyle.Tooltip": "Match the contents of this HTML snippet to style of the page.",
	"_Editor.Block.Sandbox.Edit.MatchStyle.Dialog.Title": "Match styles",
	"_Editor.Block.Sandbox.Edit.MatchStyle.Dialog.Description": "Are you sure you want to match the contents of this HTML snippet to the style of the page? The original HTML snippet will be removed.",
	"_Editor.Block.Sandbox.Edit.MatchStyle.Dialog.OK": "Match styles",
	"_Editor.Block.Sandbox.Edit.Done.Label": "Done",
	"_Editor.Block.Sandbox.Dialog.Delete.Title": "Delete HTML snippet",
	"_Editor.Block.Sandbox.Dialog.Delete.Description": "Are you sure you want to delete this HTML snippet? You cannot undo this action.",
	"_Editor.Block.File.Uploaded.Error": "Your file could not be uploaded. Please try again.",
	"_Editor.Block.Attachment.Download.Label": "Download Attachment.",
	"_Editor.Block.Attachment.Remove.Label": "Remove Attachment.",
	"_Editor.Block.Attachment.QuickLook.Label": "Quick Look Attachment.",
	"_Editor.Block.Attachment.Dialog.Delete.Title": "Delete attachment",
	"_Editor.Block.Attachment.Dialog.Delete.Description": "Are you sure you want to delete this attachment? You cannot undo this action.",
	"_Editor.Block.Image.Toolbar.Link.Title": "Link",
	"_Editor.Block.Image.Toolbar.Link.Tooltip": "Add a link to another page or external URL.",
	"_Editor.Block.Image.Loading.Placeholder": "Loading…",
	"_Editor.Block.Image.Dialog.Delete.Title": "Delete image",
	"_Editor.Block.Image.Dialog.Delete.Description": "Are you sure you want to delete this image? You cannot undo this action.",
	"_Editor.Block.Media.Preview.Missing": "This media file could not be previewed. Try uploading it again.",
	"_Editor.Block.Media.Dialog.Delete.Title": "Delete media",
	"_Editor.Block.Media.Dialog.Delete.Description": "Are you sure you want to delete this media file? You cannot undo this action.",
	"_Editor.Conflict.Edit.Outdated": "Another user updated this page while you were viewing it. Click OK to refresh and edit this page.",
	"_Editor.Conflict.Save.Override": "Another user modified this page after you started editing it. If you save your edits, they will override the changes made by the other user. Are you sure you want to override another user's changes?",
	"_Editor.Concurrent.Block.Locked.By": "%@ is editing",
	"_Editor.Concurrent.Block.Created.By": "%@ is editing here…",
	"_Editor.Concurrent.Block.Updated.Edited.By": "%@ finished editing. <span class='reveal'>Show changes…</span>",
	"_Editor.Concurrent.Block.Updated.Created.By": "%@ added content. <span class='reveal'>Show changes…</span>",
	"_Editor.Concurrent.Block.Deleted.By": "%@ has deleted this content.",
	"_Editor.Concurrent.Block.Locked.Error.LockStolen": "This content cannot be edited because %@ is already editing.",
	"_Editor.Concurrent.Block.Locked.Error.LockTimeout": "You have been inactive for too long. Other users may have edited this content and overridden your changes.",
	"_Editor.Concurrent.Page.Updated": "This page has been updated by %@. <span class='reveal'>Show changes…</span>",
	"_Editor.Migration.Progress.Migrating": "Updating page…",
	"_Editor.Migration.Progress.CopyPaste": "Loading…",
	"_Editor.Migration.Progress.MatchStyles": "Loading…",
	"_Editor.Autosave.Restore.Unsaved.Changes.Dialog.Title": "Unsaved changes",
	"_Editor.Autosave.Restore.Unsaved.Changes.Dialog.Description": "It looks like previous edits you made to this page have not yet been saved. To restore your changes to this page and continue editing, click Restore.",
	"_Editor.Autosave.Restore.Unsaved.Changes.Dialog.OK": "Restore",
	"_Editor.Autosave.Restore.Progress.Restoring": "Restoring your changes…",
	"_Editor.Version.Unsupported.Warning": "Sorry, this page cannot be edited because it was created using an unsupported version of the Wiki. If you need to edit this page, copy and paste its content into a new wiki page or blog post and delete this page.",
	"_GearMenu.Delete.Title": "Delete…",
	"_GearMenu.Delete.Project.Title": "Delete Wiki…",
	"_GearMenu.Delete.Page.Title": "Delete Page…",
	"_GearMenu.Delete.File.Title": "Delete File…",
	"_Dialogs.Delete.Title": "Delete",
	"_Dialogs.Delete.Project.Title": "Delete Wiki",
	"_Dialogs.Delete.Page.Title": "Delete Page",
	"_Dialogs.Delete.File.Title": "Delete File",
	"_Dialogs.Delete.Blog.Title": "Delete Blog Post",
	"_Dialogs.Delete.Description": "Are you sure you want to delete?",
	"_Dialogs.Delete.Page.Description": "Are you sure you want to delete this page?",
	"_Dialogs.Delete.Blog.Description": "Are you sure you want to delete this blog post?",
	"_Dialogs.Delete.File.Description": "Are you sure you want to delete this file?",
	"_Dialogs.Delete.Project.Description": "Are you sure you want to delete this Wiki?",
	"_Dialogs.Delete.OK": "Delete",
	"_Dialogs.Delete.Permanently": "Delete Permanently",
	"_Dialogs.Delete.Notification.Error": "An error occurred. Please try again.",
	"_Dialogs.Delete.Notification.NotDocumentOwner.Error": "Only the owner or an admin may delete this document.",
	"_Dialogs.Delete.Notification.NotProjectOwner.Error": "Only the owner of this wiki or an admin may delete this document.",
	
	"_Dialogs.Hide.Person.Title": "Hide Person",
	"_Dialogs.Hide.Person.Description": "Are you sure you want to hide this person?",
	"_Dialogs.Hide.OK": "Hide",
	"_Dialogs.Hide.Notification.Error": "Could not mark as hidden. Please try again.",
	"_Dialogs.Unhide.Person.Title": "Unhide Person",
	"_Dialogs.Unhide.Person.Description": "Are you sure you want to unhide this person?",
	"_Dialogs.Unhide.OK": "Unhide",
	"_Dialogs.Unhide.Notification.Error": "Could not unhide. Please try again.",
	"_Dialogs.OK": "OK",
	"_Dialogs.Cancel": "Cancel",
	"_Dialogs.Save": "Save",
	"_Dialogs.Done": "Done",
	"_Dialogs.LinkSearch.Search.Placeholder": "Wiki name, page title or file name",
	"_Dialogs.LinkSearch.Progress.Searching": "Searching…",
	"_Dialogs.LinkSearch.Title": "Search for an existing page or file",
	"_Dialogs.LinkSearch.Button.OK": "OK",
	"_Dialogs.LinkSearch.Description": "Type the name of an existing page or file, select it from the list, and click OK to create a new link.",
	"_Dialogs.NoEmailSet.Title": "Enter your e-mail address",
	"_Dialogs.NoEmailSet.Description": "You do not have an email address. To receive notification emails, you need to configure an email address in your account settings.",
	"_Dialogs.NoEmailSet.Settings": "Settings…",
	"_Dialogs.NewPage.Title": "New Page",
	"_Dialogs.NewPage.Label": "Page Title:",
	"_Dialogs.NewPage.Progress.Creating": "Creating new page…",
	"_Dialogs.NewPage.OK": "Add",
	"_Dialogs.NewPage.Progress.Failed": "New page could not be created. Please try again.",
	"_Dialogs.NewBlogpost.Title": "New Blog Post",
	"_Dialogs.NewBlogpost.Label": "Title:",
	"_Dialogs.NewBlogpost.Progress.Creating": "Creating new blog post…",
	"_Dialogs.NewBlogpost.OK": "Add",
	"_Dialogs.NewBlogpost.Progress.Failed": "New blog post could not be created. Please try again.",
	"_Dialogs.CreateWikiNamed.NotAllowed": "You do not have permission to create a new Wiki.  Try logging in as a different user.",
	// Do not localize these help links.
	"_Help.Desktop.URL": "http://help.apple.com/wikiuser/mac/4.0/",
	"_Help.iPad.URL": "http://help.apple.com/wikiuser/ipad/4.0/",
	"_Cookies.NoCookiesUnsupported": "You must have cookies enabled to use this website",
	"_Sharing.Sidebar.SharingWith":"Sharing with:",
	"_Sharing.Sidebar.Edit":"Edit",
	"_Sharing.Sidebar.EmptyPlaceholder":"Not shared",
	// Format.js localization.
    "_Dates.Months": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
    "_Dates.LongMonths": "January,February,March,April,May,June,July,August,September,October,November,December",
    "_Dates.Weekdays": "Sun,Mon,Tue,Wed,Thu,Fri,Sat,-",
    "_Dates.ShortWeekdays": "S,M,T,W,T,F,S",
    "_Dates.LongWeekdays": "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    "_Dates.AMPM": "AM,PM",
    "_Dates.DateFormats.MediumDate": "M j, Y",
    "_Dates.DateFormats.Hour": "g a",
    "_Dates.DateFormats.HourAndMinutes": "g:i a",
    "_Dates.DateFormats.LongMonthAndYear":"F, Y",
    "_Dates.DateFormats.MediumDateAndShortTime":"M j, Y g:i a",
    "_Dates.Noon":"Noon",
	
	// Common labels
	"_XC.Bot.Summary.Errors.Label": "Errors",
	"_XC.Bot.Summary.Warnings.Label": "Warnings",
	"_XC.Bot.Summary.AnalysisIssues.Label": "Analysis",
	"_XC.Bot.Summary.TestsTotal.Label": "Total Tests",
	"_XC.Bot.Summary.TestsPassed.Label": "Passed Tests",
	"_XC.Bot.Summary.TestsFailed.Label": "Failed Tests",
	"_XC.Bot.Summary.LastRun.LastIntegrationResults.Title": "Last Integration Results",
	"_XC.Bot.Summary.LastRun.Errors.Singular.Count": "1 Error",
	"_XC.Bot.Summary.LastRun.Errors.Plural.Count": "%@ Errors",
	"_XC.Bot.Summary.LastRun.Errors.None.Count": "No Errors",
	"_XC.Bot.Summary.LastRun.AnalysisIssues.Singular.Count": "1 Analysis Issue",
	"_XC.Bot.Summary.LastRun.AnalysisIssues.Plural.Count": "%@ Analysis Issues",
	"_XC.Bot.Summary.LastRun.AnalysisIssues.None.Count": "No Analysis Issues",
	"_XC.Bot.Summary.LastRun.Issues.Singular.Count": "1 Issue",
	"_XC.Bot.Summary.LastRun.Issues.Plural.Count": "%@ Issues",
	"_XC.Bot.Summary.LastRun.Issues.None.Count": "No Issues",
	"_XC.Bot.Summary.LastRun.Warnings.Singular.Count": "1 Warning",
	"_XC.Bot.Summary.LastRun.Warnings.Plural.Count": "%@ Warnings",
	"_XC.Bot.Summary.LastRun.Warnings.None.Count": "No Warnings",
	"_XC.Bot.Summary.LastRun.Test.Passes.Count": "%@ Tests Passed",
	"_XC.Bot.Summary.LastRun.Test.Failures.Count": "%@/%@ Tests Failed",
	"_XC.Bot.Summary.LastRun.Test.None.Count": "No Tests",
	"_XC.Bot.Summary.LastRun.Test.Summation.Count": "%@/%@ Tests",
	"_XC.Bot.Summary.Unexpected.Error": "An unexpected error occurred. Try reloading the page.",
    
    // Integration Status
    "_XCS.IntegrationStatus.TestTotalCount": "of %@",
    "_XCS.IntegrationStatus.Performance": "Performance",
    "_XCS.IntegrationStatus.CoverageCount": "%@% Coverage ",
    "_XCS.IntegrationStatus.CoverageDeltaCount": "%@%",
    "_XCS.IntegrationStatus.Coverage": "Coverage",
	
	// Bot Commit History
	"_XC.Bot.CommitHistory.Files.Modified.Singular": "%@ file modified",
	"_XC.Bot.CommitHistory.Files.Modified.Plural": "%@ files modified",
	"_XC.Bot.CommitHistory.Unexpected.Error": "Commits for this integration could not be displayed",
	"_XC.Bot.CommitHistory.Commit.NoMessage": "No commit message provided.",
	
	// WAI ARIA - Accessiblity
	"_Accessibility.Editor.AccessRoles": "Access Roles",
	"_Accessibility.Button.UploadImage": "Upload image",
	"_Accessibility.Button.Delete": "Delete image",
	"_Accessibility.CheckboxFavorite": "Favorite",
	"_Accessibility.Dialog.Title": "Settings",
	"_Accessibility.Dialog.UploadFile": "Choose File",
	"_Accessibility.MenuBar.Filter": "Filter",
	"_Accessibility.MenuBar.HistoryControls": "History Controls",
	"_Accessibility.View.BotList": "Bot List",
	"_Accessibility.View.ListView": "List View",
	"_Accessibility.View.SearchResult": "Search Result",
	"_Accessibility.Navigation.Main": "Main Navigation",
	"_Accessibility.Navigation.Secondary": "Secondary Navigation",
	"_Accessibility.Navigation.PageContent": "Page Content",
	"_Accessibility.Navigation.Label.SearchFor": "Search for",
	
	"_MenuItem.Gear": "Action menu…",
	"_MenuItem.LogIn": "Log in…",
	"_MenuItem.LogOut": "Log out…",
	"_MenuItem.Plus": "Add menu…",
	"_ActionMenu.About.Title": "About",
	"_Server.About.Dialog.Description.NoXcode": "Server %@, OS X %@",
	"_Server.About.Dialog.Description.Xcode": "Server %@, OS X %@, Xcode %@",
	"_Server.About.Dialog.Title": "About Server",
	"_NavPopover.Application.Xcode.Title": "Xcode",
	"_NavPopover.Application.Wiki.Title": "Wiki",
	"_NavPopover.Application.ChangePassword.Title": "Change Password",
	"_NavPopover.Application.WebCalendar.Title": "Web Calendar",
	"_PoliteLogin.Format": "%@1 to access more services",
	"_PoliteLogin.LogIn": "Log in",
	"_QuickSearch.Placeholder": "Search",
	"_QuickSearch.Header": "Quick Search",
	"_QuickSearch.Loading.Placeholder": "Loading…",
	"_QuickSearch.See.All.Results.Title": "Show all…",
	"_QuickSearch.Headers.RecentSearches": "Recent Searches",
	"_QuickSearch.Headers.SavedSearches": "Saved Searches",
	"_QuickSearch.RecentSearch.Delete": "Delete",
	"_QuickSearch.SavedSearch.Delete": "Delete",
	"_QuickSearch.SavedSearch.Untitled": "Untitled search",
	"_Sources.Me.Title": "My Profile",
	"_Sources.Me.Description": "Manage your profile.",
	"_Sources.MyActivity.Title": "My Activity",
	"_Sources.MyActivity.Description": "See your activity in real-time.",
	"_Sources.MyDocuments.Title": "My Documents",
	"_Sources.MyDocuments.Description": "View and edit your personal documents.",
	"_Sources.MyFavorites.Title": "My Favorites",
	"_Sources.MyFavorites.Description": "View the pages and people you care about most.",
	"_Sources.Activity.Title": "All Activity",
	"_Sources.Activity.Description": "Track real-time activity for people and wikis you care about.",
	"_Sources.Projects.Title": "All Wikis",
	"_Sources.Projects.Description": "Communicate and collaborate with team members.",
	"_Sources.People.Title": "All People",
	"_Sources.People.Description": "View other people's activity and blogs.",
	"_Sources.Home.Title": "Home",
	"_Sources.Home.Description": "View the server homepage.",
	"_Login.LoggedInUser": "Logged in (%@)",
	"_Login.Unexpected.Error": "Your login failed because of an unexpected error. Please try again.",
	"_Logout.Confirm.Dialog.Title": "Log Out",
	"_Logout.Confirm.Dialog.Description": "Are you sure you want to log out?",
	"_Logout.Confirm.Dialog.OK": "Log Out",
	"_Deleted.Placeholder.Title": "This content has been deleted",
	"_Deleted.Placeholder.NoPermissions.Subtitle": "Only administrators and users with permission to delete can restore it",
	"_Deleted.Placeholder.Restore.Subtitle": "Restore",
	"_Deleted.Progress.Restoring": "Restoring…",
	"_Deleted.Error.CouldNotRestore": "Could not restore content. Please try again.",
	"_Load.Error.CouldNotLoadIngoFromServer": "Could not load version information from the server. Please try again."
});
/** 
* Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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

// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Add inline notification support to functions as properties on an object.
// Signals this function as a responder to notifications with a given signature.
// By default, notifications are restricted to a XCS.Object instance only. Passing
// inOptAnyInstance as true will register this observer for all notification
// broadcasts for a given signature, regardless of scope.

var XCS = XCS || new Object();
XCS.Views = XCS.Views || new Object();
/*  Prototype JavaScript framework, version 1.7.1
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/


var Prototype = {

  Version: '1.7.1',

  Browser: (function(){
    var ua = navigator.userAgent;
    var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    return {
      IE:             !!window.attachEvent && !isOpera,
      Opera:          isOpera,
      WebKit:         ua.indexOf('AppleWebKit/') > -1,
      Gecko:          ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
      MobileSafari:   /Apple.*Mobile/.test(ua)
    }
  })(),

  BrowserFeatures: {
    XPath: !!document.evaluate,

    SelectorsAPI: !!document.querySelector,

    ElementExtensions: (function() {
      var constructor = window.Element || window.HTMLElement;
      return !!(constructor && constructor.prototype);
    })(),
    SpecificElementExtensions: (function() {
      if (typeof window.HTMLDivElement !== 'undefined')
        return true;

      var div = document.createElement('div'),
          form = document.createElement('form'),
          isSupported = false;

      if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
        isSupported = true;
      }

      div = form = null;

      return isSupported;
    })()
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

  emptyFunction: function() { },

  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;
/* Based on Alex Arnell's inheritance implementation. */

var Class = (function() {

  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function subclass() {};
  function create() {
    var parent = null, properties = $A(arguments);
    if (Object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);

    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && Object.isFunction(value) &&
          value.argumentNames()[0] == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);

        value.valueOf = (function(method) {
          return function() { return method.valueOf.call(method); };
        })(method);

        value.toString = (function(method) {
          return function() { return method.toString.call(method); };
        })(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    Methods: {
      addMethods: addMethods
    }
  };
})();
(function() {

  var _toString = Object.prototype.toString,
      _hasOwnProperty = Object.prototype.hasOwnProperty,
      NULL_TYPE = 'Null',
      UNDEFINED_TYPE = 'Undefined',
      BOOLEAN_TYPE = 'Boolean',
      NUMBER_TYPE = 'Number',
      STRING_TYPE = 'String',
      OBJECT_TYPE = 'Object',
      FUNCTION_CLASS = '[object Function]',
      BOOLEAN_CLASS = '[object Boolean]',
      NUMBER_CLASS = '[object Number]',
      STRING_CLASS = '[object String]',
      ARRAY_CLASS = '[object Array]',
      DATE_CLASS = '[object Date]',
      NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
        typeof JSON.stringify === 'function' &&
        JSON.stringify(0) === '0' &&
        typeof JSON.stringify(Prototype.K) === 'undefined';



  var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf',
   'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      if (p === 'toString') return false;
    }
    return true;
  })();

  function Type(o) {
    switch(o) {
      case null: return NULL_TYPE;
      case (void 0): return UNDEFINED_TYPE;
    }
    var type = typeof o;
    switch(type) {
      case 'boolean': return BOOLEAN_TYPE;
      case 'number':  return NUMBER_TYPE;
      case 'string':  return STRING_TYPE;
    }
    return OBJECT_TYPE;
  }

  function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  function inspect(object) {
    try {
      if (isUndefined(object)) return 'undefined';
      if (object === null) return 'null';
      return object.inspect ? object.inspect() : String(object);
    } catch (e) {
      if (e instanceof RangeError) return '...';
      throw e;
    }
  }

  function toJSON(value) {
    return Str('', { '': value }, []);
  }

  function Str(key, holder, stack) {
    var value = holder[key];
    if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    var _class = _toString.call(value);

    switch (_class) {
      case NUMBER_CLASS:
      case BOOLEAN_CLASS:
      case STRING_CLASS:
        value = value.valueOf();
    }

    switch (value) {
      case null: return 'null';
      case true: return 'true';
      case false: return 'false';
    }

    var type = typeof value;
    switch (type) {
      case 'string':
        return value.inspect(true);
      case 'number':
        return isFinite(value) ? String(value) : 'null';
      case 'object':

        for (var i = 0, length = stack.length; i < length; i++) {
          if (stack[i] === value) {
            throw new TypeError("Cyclic reference to '" + value + "' in object");
          }
        }
        stack.push(value);

        var partial = [];
        if (_class === ARRAY_CLASS) {
          for (var i = 0, length = value.length; i < length; i++) {
            var str = Str(i, value, stack);
            partial.push(typeof str === 'undefined' ? 'null' : str);
          }
          partial = '[' + partial.join(',') + ']';
        } else {
          var keys = Object.keys(value);
          for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i], str = Str(key, value, stack);
            if (typeof str !== "undefined") {
               partial.push(key.inspect(true)+ ':' + str);
             }
          }
          partial = '{' + partial.join(',') + '}';
        }
        stack.pop();
        return partial;
    }
  }

  function stringify(object) {
    return JSON.stringify(object);
  }

  function toQueryString(object) {
    return $H(object).toQueryString();
  }

  function toHTML(object) {
    return object && object.toHTML ? object.toHTML() : String.interpret(object);
  }

  function keys(object) {
    if (Type(object) !== OBJECT_TYPE) { throw new TypeError(); }
    var results = [];
    for (var property in object) {
      if (_hasOwnProperty.call(object, property))
        results.push(property);
    }

    if (IS_DONTENUM_BUGGY) {
      for (var i = 0; property = DONT_ENUMS[i]; i++) {
        if (_hasOwnProperty.call(object, property))
          results.push(property);
      }
    }

    return results;
  }

  function values(object) {
    var results = [];
    for (var property in object)
      results.push(object[property]);
    return results;
  }

  function clone(object) {
    return extend({ }, object);
  }

  function isElement(object) {
    return !!(object && object.nodeType == 1);
  }

  function isArray(object) {
    return _toString.call(object) === ARRAY_CLASS;
  }

  var hasNativeIsArray = (typeof Array.isArray == 'function')
    && Array.isArray([]) && !Array.isArray({});

  if (hasNativeIsArray) {
    isArray = Array.isArray;
  }

  function isHash(object) {
    return object instanceof Hash;
  }

  function isFunction(object) {
    return _toString.call(object) === FUNCTION_CLASS;
  }

  function isString(object) {
    return _toString.call(object) === STRING_CLASS;
  }

  function isNumber(object) {
    return _toString.call(object) === NUMBER_CLASS;
  }

  function isDate(object) {
    return _toString.call(object) === DATE_CLASS;
  }

  function isUndefined(object) {
    return typeof object === "undefined";
  }

  extend(Object, {
    extend:        extend,
    inspect:       inspect,
    toJSON:        NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
    toQueryString: toQueryString,
    toHTML:        toHTML,
    keys:          Object.keys || keys,
    values:        values,
    clone:         clone,
    isElement:     isElement,
    isArray:       isArray,
    isHash:        isHash,
    isFunction:    isFunction,
    isString:      isString,
    isNumber:      isNumber,
    isDate:        isDate,
    isUndefined:   isUndefined
  });
})();
Object.extend(Function.prototype, (function() {
  var slice = Array.prototype.slice;

  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }

  function merge(array, args) {
    array = slice.call(array, 0);
    return update(array, args);
  }

  function argumentNames() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }


  function bind(context) {
    if (arguments.length < 2 && Object.isUndefined(arguments[0]))
      return this;

    if (!Object.isFunction(this))
      throw new TypeError("The object is not callable.");

    var nop = function() {};
    var __method = this, args = slice.call(arguments, 1);

    var bound = function() {
      var a = merge(args, arguments), c = context;
      var c = this instanceof bound ? this : context;
      return __method.apply(c, a);
    };

    nop.prototype   = this.prototype;
    bound.prototype = new nop();

    return bound;
  }

  function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }

  function curry() {
    if (!arguments.length) return this;
    var __method = this, args = slice.call(arguments, 0);
    return function() {
      var a = merge(args, arguments);
      return __method.apply(this, a);
    }
  }

  function delay(timeout) {
    var __method = this, args = slice.call(arguments, 1);
    timeout = timeout * 1000;
    return window.setTimeout(function() {
      return __method.apply(__method, args);
    }, timeout);
  }

  function defer() {
    var args = update([0.01], arguments);
    return this.delay.apply(this, args);
  }

  function wrap(wrapper) {
    var __method = this;
    return function() {
      var a = update([__method.bind(this)], arguments);
      return wrapper.apply(this, a);
    }
  }

  function methodize() {
    if (this._methodized) return this._methodized;
    var __method = this;
    return this._methodized = function() {
      var a = update([this], arguments);
      return __method.apply(null, a);
    };
  }

  var extensions = {
    argumentNames:       argumentNames,
    bindAsEventListener: bindAsEventListener,
    curry:               curry,
    delay:               delay,
    defer:               defer,
    wrap:                wrap,
    methodize:           methodize
  };

  if (!Function.prototype.bind)
    extensions.bind = bind;

  return extensions;
})());



(function(proto) {


  function toISOString() {
    return this.getUTCFullYear() + '-' +
      (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
      this.getUTCDate().toPaddedString(2) + 'T' +
      this.getUTCHours().toPaddedString(2) + ':' +
      this.getUTCMinutes().toPaddedString(2) + ':' +
      this.getUTCSeconds().toPaddedString(2) + 'Z';
  }


  function toJSON() {
    return this.toISOString();
  }

  if (!proto.toISOString) proto.toISOString = toISOString;
  if (!proto.toJSON) proto.toJSON = toJSON;

})(Date.prototype);


RegExp.prototype.match = RegExp.prototype.test;

RegExp.escape = function(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  execute: function() {
    this.callback(this);
  },

  stop: function() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.execute();
        this.currentlyExecuting = false;
      } catch(e) {
        this.currentlyExecuting = false;
        throw e;
      }
    }
  }
});
Object.extend(String, {
  interpret: function(value) {
    return value == null ? '' : String(value);
  },
  specialChar: {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '\\': '\\\\'
  }
});

Object.extend(String.prototype, (function() {
  var NATIVE_JSON_PARSE_SUPPORT = window.JSON &&
    typeof JSON.parse === 'function' &&
    JSON.parse('{"test": true}').test;

  function prepareReplacement(replacement) {
    if (Object.isFunction(replacement)) return replacement;
    var template = new Template(replacement);
    return function(match) { return template.evaluate(match) };
  }

  function gsub(pattern, replacement) {
    var result = '', source = this, match;
    replacement = prepareReplacement(replacement);

    if (Object.isString(pattern))
      pattern = RegExp.escape(pattern);

    if (!(pattern.length || pattern.source)) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  }

  function sub(pattern, replacement, count) {
    replacement = prepareReplacement(replacement);
    count = Object.isUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
  }

  function scan(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
  }

  function truncate(length, truncation) {
    length = length || 30;
    truncation = Object.isUndefined(truncation) ? '...' : truncation;
    return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
  }

  function strip() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }

  function stripTags() {
    return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
  }

  function stripScripts() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  }

  function extractScripts() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
        matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  }

  function evalScripts() {
    return this.extractScripts().map(function(script) { return eval(script); });
  }

  function escapeHTML() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function unescapeHTML() {
    return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }


  function toQueryParams(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift()),
            value = pair.length > 1 ? pair.join('=') : pair[0];

        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
  }

  function toArray() {
    return this.split('');
  }

  function succ() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
  }

  function times(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
  }

  function camelize() {
    return this.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  }

  function capitalize() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  }

  function underscore() {
    return this.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/-/g, '_')
               .toLowerCase();
  }

  function dasherize() {
    return this.replace(/_/g, '-');
  }

  function inspect(useDoubleQuotes) {
    var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
      if (character in String.specialChar) {
        return String.specialChar[character];
      }
      return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
  }

  function unfilterJSON(filter) {
    return this.replace(filter || Prototype.JSONFilter, '$1');
  }

  function isJSON() {
    var str = this;
    if (str.blank()) return false;
    str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
    return (/^[\],:{}\s]*$/).test(str);
  }

  function evalJSON(sanitize) {
    var json = this.unfilterJSON(),
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    if (cx.test(json)) {
      json = json.replace(cx, function (a) {
        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      });
    }
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
  }

  function parseJSON() {
    var json = this.unfilterJSON();
    return JSON.parse(json);
  }

  function include(pattern) {
    return this.indexOf(pattern) > -1;
  }

  function startsWith(pattern) {
    return this.lastIndexOf(pattern, 0) === 0;
  }

  function endsWith(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.indexOf(pattern, d) === d;
  }

  function empty() {
    return this == '';
  }

  function blank() {
    return /^\s*$/.test(this);
  }

  function interpolate(object, pattern) {
    return new Template(this, pattern).evaluate(object);
  }

  return {
    gsub:           gsub,
    sub:            sub,
    scan:           scan,
    truncate:       truncate,
    strip:          String.prototype.trim || strip,
    stripTags:      stripTags,
    stripScripts:   stripScripts,
    extractScripts: extractScripts,
    evalScripts:    evalScripts,
    escapeHTML:     escapeHTML,
    unescapeHTML:   unescapeHTML,
    toQueryParams:  toQueryParams,
    parseQuery:     toQueryParams,
    toArray:        toArray,
    succ:           succ,
    times:          times,
    camelize:       camelize,
    capitalize:     capitalize,
    underscore:     underscore,
    dasherize:      dasherize,
    inspect:        inspect,
    unfilterJSON:   unfilterJSON,
    isJSON:         isJSON,
    evalJSON:       NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
    include:        include,
    startsWith:     startsWith,
    endsWith:       endsWith,
    empty:          empty,
    blank:          blank,
    interpolate:    interpolate
  };
})());

var Template = Class.create({
  initialize: function(template, pattern) {
    this.template = template.toString();
    this.pattern = pattern || Template.Pattern;
  },

  evaluate: function(object) {
    if (object && Object.isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return this.template.gsub(this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3],
          pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + String.interpret(ctx);
    });
  }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

var $break = { };

var Enumerable = (function() {
  function each(iterator, context) {
    try {
      this._each(iterator, context);
    } catch (e) {
      if (e != $break) throw e;
    }
    return this;
  }

  function eachSlice(number, iterator, context) {
    var index = -number, slices = [], array = this.toArray();
    if (number < 1) return array;
    while ((index += number) < array.length)
      slices.push(array.slice(index, index+number));
    return slices.collect(iterator, context);
  }

  function all(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = true;
    this.each(function(value, index) {
      result = result && !!iterator.call(context, value, index, this);
      if (!result) throw $break;
    }, this);
    return result;
  }

  function any(iterator, context) {
    iterator = iterator || Prototype.K;
    var result = false;
    this.each(function(value, index) {
      if (result = !!iterator.call(context, value, index, this))
        throw $break;
    }, this);
    return result;
  }

  function collect(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index, this));
    }, this);
    return results;
  }

  function detect(iterator, context) {
    var result;
    this.each(function(value, index) {
      if (iterator.call(context, value, index, this)) {
        result = value;
        throw $break;
      }
    }, this);
    return result;
  }

  function findAll(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (iterator.call(context, value, index, this))
        results.push(value);
    }, this);
    return results;
  }

  function grep(filter, iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];

    if (Object.isString(filter))
      filter = new RegExp(RegExp.escape(filter));

    this.each(function(value, index) {
      if (filter.match(value))
        results.push(iterator.call(context, value, index, this));
    }, this);
    return results;
  }

  function include(object) {
    if (Object.isFunction(this.indexOf))
      if (this.indexOf(object) != -1) return true;

    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  }

  function inGroupsOf(number, fillWith) {
    fillWith = Object.isUndefined(fillWith) ? null : fillWith;
    return this.eachSlice(number, function(slice) {
      while(slice.length < number) slice.push(fillWith);
      return slice;
    });
  }

  function inject(memo, iterator, context) {
    this.each(function(value, index) {
      memo = iterator.call(context, memo, value, index, this);
    }, this);
    return memo;
  }

  function invoke(method) {
    var args = $A(arguments).slice(1);
    return this.map(function(value) {
      return value[method].apply(value, args);
    });
  }

  function max(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index, this);
      if (result == null || value >= result)
        result = value;
    }, this);
    return result;
  }

  function min(iterator, context) {
    iterator = iterator || Prototype.K;
    var result;
    this.each(function(value, index) {
      value = iterator.call(context, value, index, this);
      if (result == null || value < result)
        result = value;
    }, this);
    return result;
  }

  function partition(iterator, context) {
    iterator = iterator || Prototype.K;
    var trues = [], falses = [];
    this.each(function(value, index) {
      (iterator.call(context, value, index, this) ?
        trues : falses).push(value);
    }, this);
    return [trues, falses];
  }

  function pluck(property) {
    var results = [];
    this.each(function(value) {
      results.push(value[property]);
    });
    return results;
  }

  function reject(iterator, context) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator.call(context, value, index, this))
        results.push(value);
    }, this);
    return results;
  }

  function sortBy(iterator, context) {
    return this.map(function(value, index) {
      return {
        value: value,
        criteria: iterator.call(context, value, index, this)
      };
    }, this).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  }

  function toArray() {
    return this.map();
  }

  function zip() {
    var iterator = Prototype.K, args = $A(arguments);
    if (Object.isFunction(args.last()))
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      return iterator(collections.pluck(index));
    });
  }

  function size() {
    return this.toArray().length;
  }

  function inspect() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }









  return {
    each:       each,
    eachSlice:  eachSlice,
    all:        all,
    every:      all,
    any:        any,
    some:       any,
    collect:    collect,
    map:        collect,
    detect:     detect,
    findAll:    findAll,
    select:     findAll,
    filter:     findAll,
    grep:       grep,
    include:    include,
    member:     include,
    inGroupsOf: inGroupsOf,
    inject:     inject,
    invoke:     invoke,
    max:        max,
    min:        min,
    partition:  partition,
    pluck:      pluck,
    reject:     reject,
    sortBy:     sortBy,
    toArray:    toArray,
    entries:    toArray,
    zip:        zip,
    size:       size,
    inspect:    inspect,
    find:       detect
  };
})();

function $A(iterable) {
  if (!iterable) return [];
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}


function $w(string) {
  if (!Object.isString(string)) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

Array.from = $A;


(function() {
  var arrayProto = Array.prototype,
      slice = arrayProto.slice,
      _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

  function each(iterator, context) {
    for (var i = 0, length = this.length >>> 0; i < length; i++) {
      if (i in this) iterator.call(context, this[i], i, this);
    }
  }
  if (!_each) _each = each;

  function clear() {
    this.length = 0;
    return this;
  }

  function first() {
    return this[0];
  }

  function last() {
    return this[this.length - 1];
  }

  function compact() {
    return this.select(function(value) {
      return value != null;
    });
  }

  function flatten() {
    return this.inject([], function(array, value) {
      if (Object.isArray(value))
        return array.concat(value.flatten());
      array.push(value);
      return array;
    });
  }

  function without() {
    var values = slice.call(arguments, 0);
    return this.select(function(value) {
      return !values.include(value);
    });
  }

  function reverse(inline) {
    return (inline === false ? this.toArray() : this)._reverse();
  }

  function uniq(sorted) {
    return this.inject([], function(array, value, index) {
      if (0 == index || (sorted ? array.last() != value : !array.include(value)))
        array.push(value);
      return array;
    });
  }

  function intersect(array) {
    return this.uniq().findAll(function(item) {
      return array.indexOf(item) !== -1;
    });
  }


  function clone() {
    return slice.call(this, 0);
  }

  function size() {
    return this.length;
  }

  function inspect() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }

  function indexOf(item, i) {
    if (this == null) throw new TypeError();

    var array = Object(this), length = array.length >>> 0;
    if (length === 0) return -1;

    i = Number(i);
    if (isNaN(i)) {
      i = 0;
    } else if (i !== 0 && isFinite(i)) {
      i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
    }

    if (i > length) return -1;

    var k = i >= 0 ? i : Math.max(length - Math.abs(i), 0);
    for (; k < length; k++)
      if (k in array && array[k] === item) return k;
    return -1;
  }


  function lastIndexOf(item, i) {
    if (this == null) throw new TypeError();

    var array = Object(this), length = array.length >>> 0;
    if (length === 0) return -1;

    if (!Object.isUndefined(i)) {
      i = Number(i);
      if (isNaN(i)) {
        i = 0;
      } else if (i !== 0 && isFinite(i)) {
        i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
      }
    } else {
      i = length;
    }

    var k = i >= 0 ? Math.min(i, length - 1) :
     length - Math.abs(i);

    for (; k >= 0; k--)
      if (k in array && array[k] === item) return k;
    return -1;
  }

  function concat(_) {
    var array = [], items = slice.call(arguments, 0), item, n = 0;
    items.unshift(this);
    for (var i = 0, length = items.length; i < length; i++) {
      item = items[i];
      if (Object.isArray(item) && !('callee' in item)) {
        for (var j = 0, arrayLength = item.length; j < arrayLength; j++) {
          if (j in item) array[n] = item[j];
          n++;
        }
      } else {
        array[n++] = item;
      }
    }
    array.length = n;
    return array;
  }


  function wrapNative(method) {
    return function() {
      if (arguments.length === 0) {
        return method.call(this, Prototype.K);
      } else if (arguments[0] === undefined) {
        var args = slice.call(arguments, 1);
        args.unshift(Prototype.K);
        return method.apply(this, args);
      } else {
        return method.apply(this, arguments);
      }
    };
  }


  function map(iterator) {
    if (this == null) throw new TypeError();
    iterator = iterator || Prototype.K;

    var object = Object(this);
    var results = [], context = arguments[1], n = 0;

    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object) {
        results[n] = iterator.call(context, object[i], i, object);
      }
      n++;
    }
    results.length = n;
    return results;
  }

  if (arrayProto.map) {
    map = wrapNative(Array.prototype.map);
  }

  function filter(iterator) {
    if (this == null || !Object.isFunction(iterator))
      throw new TypeError();

    var object = Object(this);
    var results = [], context = arguments[1], value;

    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object) {
        value = object[i];
        if (iterator.call(context, value, i, object)) {
          results.push(value);
        }
      }
    }
    return results;
  }

  if (arrayProto.filter) {
    filter = Array.prototype.filter;
  }

  function some(iterator) {
    if (this == null) throw new TypeError();
    iterator = iterator || Prototype.K;
    var context = arguments[1];

    var object = Object(this);
    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object && iterator.call(context, object[i], i, object)) {
        return true;
      }
    }

    return false;
  }

  if (arrayProto.some) {
    var some = wrapNative(Array.prototype.some);
  }


  function every(iterator) {
    if (this == null) throw new TypeError();
    iterator = iterator || Prototype.K;
    var context = arguments[1];

    var object = Object(this);
    for (var i = 0, length = object.length >>> 0; i < length; i++) {
      if (i in object && !iterator.call(context, object[i], i, object)) {
        return false;
      }
    }

    return true;
  }

  if (arrayProto.every) {
    var every = wrapNative(Array.prototype.every);
  }

  var _reduce = arrayProto.reduce;
  function inject(memo, iterator) {
    iterator = iterator || Prototype.K;
    var context = arguments[2];
    return _reduce.call(this, iterator.bind(context), memo);
  }

  if (!arrayProto.reduce) {
    var inject = Enumerable.inject;
  }

  Object.extend(arrayProto, Enumerable);

  if (!arrayProto._reverse)
    arrayProto._reverse = arrayProto.reverse;

  Object.extend(arrayProto, {
    _each:     _each,

    map:       map,
    collect:   map,
    select:    filter,
    filter:    filter,
    findAll:   filter,
    some:      some,
    any:       some,
    every:     every,
    all:       every,
    inject:    inject,

    clear:     clear,
    first:     first,
    last:      last,
    compact:   compact,
    flatten:   flatten,
    without:   without,
    reverse:   reverse,
    uniq:      uniq,
    intersect: intersect,
    clone:     clone,
    toArray:   clone,
    size:      size,
    inspect:   inspect
  });

  var CONCAT_ARGUMENTS_BUGGY = (function() {
    return [].concat(arguments)[0][0] !== 1;
  })(1,2);

  if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

  if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
  if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();
function $H(object) {
  return new Hash(object);
};

var Hash = Class.create(Enumerable, (function() {
  function initialize(object) {
    this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
  }


  function _each(iterator, context) {
    for (var key in this._object) {
      var value = this._object[key], pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator.call(context, pair);
    }
  }

  function set(key, value) {
    return this._object[key] = value;
  }

  function get(key) {
    if (this._object[key] !== Object.prototype[key])
      return this._object[key];
  }

  function unset(key) {
    var value = this._object[key];
    delete this._object[key];
    return value;
  }

  function toObject() {
    return Object.clone(this._object);
  }



  function keys() {
    return this.pluck('key');
  }

  function values() {
    return this.pluck('value');
  }

  function index(value) {
    var match = this.detect(function(pair) {
      return pair.value === value;
    });
    return match && match.key;
  }

  function merge(object) {
    return this.clone().update(object);
  }

  function update(object) {
    return new Hash(object).inject(this, function(result, pair) {
      result.set(pair.key, pair.value);
      return result;
    });
  }

  function toQueryPair(key, value) {
    if (Object.isUndefined(value)) return key;

    var value = String.interpret(value);

    value = value.gsub(/(\r)?\n/, '\r\n');
    value = encodeURIComponent(value);
    value = value.gsub(/%20/, '+');
    return key + '=' + value;
  }

  function toQueryString() {
    return this.inject([], function(results, pair) {
      var key = encodeURIComponent(pair.key), values = pair.value;

      if (values && typeof values == 'object') {
        if (Object.isArray(values)) {
          var queryValues = [];
          for (var i = 0, len = values.length, value; i < len; i++) {
            value = values[i];
            queryValues.push(toQueryPair(key, value));
          }
          return results.concat(queryValues);
        }
      } else results.push(toQueryPair(key, values));
      return results;
    }).join('&');
  }

  function inspect() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }

  function clone() {
    return new Hash(this);
  }

  return {
    initialize:             initialize,
    _each:                  _each,
    set:                    set,
    get:                    get,
    unset:                  unset,
    toObject:               toObject,
    toTemplateReplacements: toObject,
    keys:                   keys,
    values:                 values,
    index:                  index,
    merge:                  merge,
    update:                 update,
    toQueryString:          toQueryString,
    inspect:                inspect,
    toJSON:                 toObject,
    clone:                  clone
  };
})());

Hash.from = $H;
Object.extend(Number.prototype, (function() {
  function toColorPart() {
    return this.toPaddedString(2, 16);
  }

  function succ() {
    return this + 1;
  }

  function times(iterator, context) {
    $R(0, this, true).each(iterator, context);
    return this;
  }

  function toPaddedString(length, radix) {
    var string = this.toString(radix || 10);
    return '0'.times(length - string.length) + string;
  }

  function abs() {
    return Math.abs(this);
  }

  function round() {
    return Math.round(this);
  }

  function ceil() {
    return Math.ceil(this);
  }

  function floor() {
    return Math.floor(this);
  }

  return {
    toColorPart:    toColorPart,
    succ:           succ,
    times:          times,
    toPaddedString: toPaddedString,
    abs:            abs,
    round:          round,
    ceil:           ceil,
    floor:          floor
  };
})());

function $R(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function() {
  function initialize(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  }

  function _each(iterator, context) {
    var value = this.start;
    while (this.include(value)) {
      iterator.call(context, value);
      value = value.succ();
    }
  }

  function include(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }

  return {
    initialize: initialize,
    _each:      _each,
    include:    include
  };
})());



var Abstract = { };


var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }

    return returnValue;
  }
};

var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new XMLHttpRequest()},
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')}
    ) || false;
  },

  activeRequestCount: 0
};

Ajax.Responders = {
  responders: [],

  _each: function(iterator, context) {
    this.responders._each(iterator, context);
  },

  register: function(responder) {
    if (!this.include(responder))
      this.responders.push(responder);
  },

  unregister: function(responder) {
    this.responders = this.responders.without(responder);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (Object.isFunction(responder[callback])) {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) { }
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate:   function() { Ajax.activeRequestCount++ },
  onComplete: function() { Ajax.activeRequestCount-- }
});
Ajax.Base = Class.create({
  initialize: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      contentType:  'application/x-www-form-urlencoded',
      encoding:     'UTF-8',
      parameters:   '',
      evalJSON:     true,
      evalJS:       true
    };
    Object.extend(this.options, options || { });

    this.options.method = this.options.method.toLowerCase();

    if (Object.isHash(this.options.parameters))
      this.options.parameters = this.options.parameters.toObject();
  }
});
Ajax.Request = Class.create(Ajax.Base, {
  _complete: false,

  initialize: function($super, url, options) {
    $super(options);
    this.transport = Ajax.getTransport();
    this.request(url);
  },

  request: function(url) {
    this.url = url;
    this.method = this.options.method;
    var params = Object.isString(this.options.parameters) ?
          this.options.parameters :
          Object.toQueryString(this.options.parameters);

    if (!['get', 'post'].include(this.method)) {
      params += (params ? '&' : '') + "_method=" + this.method;
      this.method = 'post';
    }

    if (params && this.method === 'get') {
      this.url += (this.url.include('?') ? '&' : '?') + params;
    }

    this.parameters = params.toQueryParams();

    try {
      var response = new Ajax.Response(this);
      if (this.options.onCreate) this.options.onCreate(response);
      Ajax.Responders.dispatch('onCreate', this, response);

      this.transport.open(this.method.toUpperCase(), this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

      this.transport.onreadystatechange = this.onStateChange.bind(this);
      this.setRequestHeaders();

      this.body = this.method == 'post' ? (this.options.postBody || params) : null;
      this.transport.send(this.body);

      /* Force Firefox to handle ready state 4 for synchronous requests */
      if (!this.options.asynchronous && this.transport.overrideMimeType)
        this.onStateChange();

    }
    catch (e) {
      this.dispatchException(e);
    }
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState > 1 && !((readyState == 4) && this._complete))
      this.respondToReadyState(this.transport.readyState);
  },

  setRequestHeaders: function() {
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Prototype-Version': Prototype.Version,
      'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
    };

    if (this.method == 'post') {
      headers['Content-type'] = this.options.contentType +
        (this.options.encoding ? '; charset=' + this.options.encoding : '');

      /* Force "Connection: close" for older Mozilla browsers to work
       * around a bug where XMLHttpRequest sends an incorrect
       * Content-length header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType &&
          (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
            headers['Connection'] = 'close';
    }

    if (typeof this.options.requestHeaders == 'object') {
      var extras = this.options.requestHeaders;

      if (Object.isFunction(extras.push))
        for (var i = 0, length = extras.length; i < length; i += 2)
          headers[extras[i]] = extras[i+1];
      else
        $H(extras).each(function(pair) { headers[pair.key] = pair.value });
    }

    for (var name in headers)
      this.transport.setRequestHeader(name, headers[name]);
  },

  success: function() {
    var status = this.getStatus();
    return !status || (status >= 200 && status < 300) || status == 304;
  },

  getStatus: function() {
    try {
      if (this.transport.status === 1223) return 204;
      return this.transport.status || 0;
    } catch (e) { return 0 }
  },

  respondToReadyState: function(readyState) {
    var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

    if (state == 'Complete') {
      try {
        this._complete = true;
        (this.options['on' + response.status]
         || this.options['on' + (this.success() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }

      var contentType = response.getHeader('Content-type');
      if (this.options.evalJS == 'force'
          || (this.options.evalJS && this.isSameOrigin() && contentType
          && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
        this.evalResponse();
    }

    try {
      (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
      Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
    } catch (e) {
      this.dispatchException(e);
    }

    if (state == 'Complete') {
      this.transport.onreadystatechange = Prototype.emptyFunction;
    }
  },

  isSameOrigin: function() {
    var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
    return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
      protocol: location.protocol,
      domain: document.domain,
      port: location.port ? ':' + location.port : ''
    }));
  },

  getHeader: function(name) {
    try {
      return this.transport.getResponseHeader(name) || null;
    } catch (e) { return null; }
  },

  evalResponse: function() {
    try {
      return eval((this.transport.responseText || '').unfilterJSON());
    } catch (e) {
      this.dispatchException(e);
    }
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];








Ajax.Response = Class.create({
  initialize: function(request){
    this.request = request;
    var transport  = this.transport  = request.transport,
        readyState = this.readyState = transport.readyState;

    if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
      this.status       = this.getStatus();
      this.statusText   = this.getStatusText();
      this.responseText = String.interpret(transport.responseText);
      this.headerJSON   = this._getHeaderJSON();
    }

    if (readyState == 4) {
      var xml = transport.responseXML;
      this.responseXML  = Object.isUndefined(xml) ? null : xml;
      this.responseJSON = this._getResponseJSON();
    }
  },

  status:      0,

  statusText: '',

  getStatus: Ajax.Request.prototype.getStatus,

  getStatusText: function() {
    try {
      return this.transport.statusText || '';
    } catch (e) { return '' }
  },

  getHeader: Ajax.Request.prototype.getHeader,

  getAllHeaders: function() {
    try {
      return this.getAllResponseHeaders();
    } catch (e) { return null }
  },

  getResponseHeader: function(name) {
    return this.transport.getResponseHeader(name);
  },

  getAllResponseHeaders: function() {
    return this.transport.getAllResponseHeaders();
  },

  _getHeaderJSON: function() {
    var json = this.getHeader('X-JSON');
    if (!json) return null;

    try {
      json = decodeURIComponent(escape(json));
    } catch(e) {
    }

    try {
      return json.evalJSON(this.request.options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  },

  _getResponseJSON: function() {
    var options = this.request.options;
    if (!options.evalJSON || (options.evalJSON != 'force' &&
      !(this.getHeader('Content-type') || '').include('application/json')) ||
        this.responseText.blank())
          return null;
    try {
      return this.responseText.evalJSON(options.sanitizeJSON ||
        !this.request.isSameOrigin());
    } catch (e) {
      this.request.dispatchException(e);
    }
  }
});

Ajax.Updater = Class.create(Ajax.Request, {
  initialize: function($super, container, url, options) {
    this.container = {
      success: (container.success || container),
      failure: (container.failure || (container.success ? null : container))
    };

    options = Object.clone(options);
    var onComplete = options.onComplete;
    options.onComplete = (function(response, json) {
      this.updateContent(response.responseText);
      if (Object.isFunction(onComplete)) onComplete(response, json);
    }).bind(this);

    $super(url, options);
  },

  updateContent: function(responseText) {
    var receiver = this.container[this.success() ? 'success' : 'failure'],
        options = this.options;

    if (!options.evalScripts) responseText = responseText.stripScripts();

    if (receiver = $(receiver)) {
      if (options.insertion) {
        if (Object.isString(options.insertion)) {
          var insertion = { }; insertion[options.insertion] = responseText;
          receiver.insert(insertion);
        }
        else options.insertion(receiver, responseText);
      }
      else receiver.update(responseText);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
  initialize: function($super, container, url, options) {
    $super(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = { };
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.options.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(response) {
    if (this.options.decay) {
      this.decay = (response.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = response.responseText;
    }
    this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});

(function(GLOBAL) {

  var UNDEFINED;
  var SLICE = Array.prototype.slice;

  var DIV = document.createElement('div');


  function $(element) {
    if (arguments.length > 1) {
      for (var i = 0, elements = [], length = arguments.length; i < length; i++)
        elements.push($(arguments[i]));
      return elements;
    }

    if (Object.isString(element))
      element = document.getElementById(element);
    return Element.extend(element);
  }

  GLOBAL.$ = $;


  if (!GLOBAL.Node) GLOBAL.Node = {};

  if (!GLOBAL.Node.ELEMENT_NODE) {
    Object.extend(GLOBAL.Node, {
      ELEMENT_NODE:                1,
      ATTRIBUTE_NODE:              2,
      TEXT_NODE:                   3,
      CDATA_SECTION_NODE:          4,
      ENTITY_REFERENCE_NODE:       5,
      ENTITY_NODE:                 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE:                8,
      DOCUMENT_NODE:               9,
      DOCUMENT_TYPE_NODE:         10,
      DOCUMENT_FRAGMENT_NODE:     11,
      NOTATION_NODE:              12
    });
  }

  var ELEMENT_CACHE = {};

  function shouldUseCreationCache(tagName, attributes) {
    if (tagName === 'select') return false;
    if ('type' in attributes) return false;
    return true;
  }

  var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function(){
    try {
      var el = document.createElement('<input name="x">');
      return el.tagName.toLowerCase() === 'input' && el.name === 'x';
    }
    catch(err) {
      return false;
    }
  })();


  var oldElement = GLOBAL.Element;
  function Element(tagName, attributes) {
    attributes = attributes || {};
    tagName = tagName.toLowerCase();

    if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
      tagName = '<' + tagName + ' name="' + attributes.name + '">';
      delete attributes.name;
      return Element.writeAttribute(document.createElement(tagName), attributes);
    }

    if (!ELEMENT_CACHE[tagName])
      ELEMENT_CACHE[tagName] = Element.extend(document.createElement(tagName));

    var node = shouldUseCreationCache(tagName, attributes) ?
     ELEMENT_CACHE[tagName].cloneNode(false) : document.createElement(tagName);

    return Element.writeAttribute(node, attributes);
  }

  GLOBAL.Element = Element;

  Object.extend(GLOBAL.Element, oldElement || {});
  if (oldElement) GLOBAL.Element.prototype = oldElement.prototype;

  Element.Methods = { ByTag: {}, Simulated: {} };

  var methods = {};

  var INSPECT_ATTRIBUTES = { id: 'id', className: 'class' };
  function inspect(element) {
    element = $(element);
    var result = '<' + element.tagName.toLowerCase();

    var attribute, value;
    for (var property in INSPECT_ATTRIBUTES) {
      attribute = INSPECT_ATTRIBUTES[property];
      value = (element[property] || '').toString();
      if (value) result += ' ' + attribute + '=' + value.inspect(true);
    }

    return result + '>';
  }

  methods.inspect = inspect;


  function visible(element) {
    return $(element).style.display !== 'none';
  }

  function toggle(element, bool) {
    element = $(element);
    if (Object.isUndefined(bool))
      bool = !Element.visible(element);
    Element[bool ? 'show' : 'hide'](element);

    return element;
  }

  function hide(element) {
    element = $(element);
    element.style.display = 'none';
    return element;
  }

  function show(element) {
    element = $(element);
    element.style.display = '';
    return element;
  }


  Object.extend(methods, {
    visible: visible,
    toggle:  toggle,
    hide:    hide,
    show:    show
  });


  function remove(element) {
    element = $(element);
    element.parentNode.removeChild(element);
    return element;
  }

  var SELECT_ELEMENT_INNERHTML_BUGGY = (function(){
    var el = document.createElement("select"),
        isBuggy = true;
    el.innerHTML = "<option value=\"test\">test</option>";
    if (el.options && el.options[0]) {
      isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
    }
    el = null;
    return isBuggy;
  })();

  var TABLE_ELEMENT_INNERHTML_BUGGY = (function(){
    try {
      var el = document.createElement("table");
      if (el && el.tBodies) {
        el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
        var isBuggy = typeof el.tBodies[0] == "undefined";
        el = null;
        return isBuggy;
      }
    } catch (e) {
      return true;
    }
  })();

  var LINK_ELEMENT_INNERHTML_BUGGY = (function() {
    try {
      var el = document.createElement('div');
      el.innerHTML = "<link />";
      var isBuggy = (el.childNodes.length === 0);
      el = null;
      return isBuggy;
    } catch(e) {
      return true;
    }
  })();

  var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY ||
   TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;

  var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
    var s = document.createElement("script"),
        isBuggy = false;
    try {
      s.appendChild(document.createTextNode(""));
      isBuggy = !s.firstChild ||
        s.firstChild && s.firstChild.nodeType !== 3;
    } catch (e) {
      isBuggy = true;
    }
    s = null;
    return isBuggy;
  })();

  function update(element, content) {
    element = $(element);

    var descendants = element.getElementsByTagName('*'),
     i = descendants.length;
    while (i--) purgeElement(descendants[i]);

    if (content && content.toElement)
      content = content.toElement();

    if (Object.isElement(content))
      return element.update().insert(content);


    content = Object.toHTML(content);
    var tagName = element.tagName.toUpperCase();

    if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
      element.text = content;
      return element;
    }

    if (ANY_INNERHTML_BUGGY) {
      if (tagName in INSERTION_TRANSLATIONS.tags) {
        while (element.firstChild)
          element.removeChild(element.firstChild);

        var nodes = getContentFromAnonymousElement(tagName, content.stripScripts());
        for (var i = 0, node; node = nodes[i]; i++)
          element.appendChild(node);

      } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
        while (element.firstChild)
          element.removeChild(element.firstChild);

        var nodes = getContentFromAnonymousElement(tagName,
         content.stripScripts(), true);

        for (var i = 0, node; node = nodes[i]; i++)
          element.appendChild(node);
      } else {
        element.innerHTML = content.stripScripts();
      }
    } else {
      element.innerHTML = content.stripScripts();
    }

    content.evalScripts.bind(content).defer();
    return element;
  }

  function replace(element, content) {
    element = $(element);

    if (content && content.toElement) {
      content = content.toElement();
    } else if (!Object.isElement(content)) {
      content = Object.toHTML(content);
      var range = element.ownerDocument.createRange();
      range.selectNode(element);
      content.evalScripts.bind(content).defer();
      content = range.createContextualFragment(content.stripScripts());
    }

    element.parentNode.replaceChild(content, element);
    return element;
  }

  var INSERTION_TRANSLATIONS = {
    before: function(element, node) {
      element.parentNode.insertBefore(node, element);
    },
    top: function(element, node) {
      element.insertBefore(node, element.firstChild);
    },
    bottom: function(element, node) {
      element.appendChild(node);
    },
    after: function(element, node) {
      element.parentNode.insertBefore(node, element.nextSibling);
    },

    tags: {
      TABLE:  ['<table>',                '</table>',                   1],
      TBODY:  ['<table><tbody>',         '</tbody></table>',           2],
      TR:     ['<table><tbody><tr>',     '</tr></tbody></table>',      3],
      TD:     ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
      SELECT: ['<select>',               '</select>',                  1]
    }
  };

  var tags = INSERTION_TRANSLATIONS.tags;

  Object.extend(tags, {
    THEAD: tags.TBODY,
    TFOOT: tags.TBODY,
    TH:    tags.TD
  });

  function replace_IE(element, content) {
    element = $(element);
    if (content && content.toElement)
      content = content.toElement();
    if (Object.isElement(content)) {
      element.parentNode.replaceChild(content, element);
      return element;
    }

    content = Object.toHTML(content);
    var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

    if (tagName in INSERTION_TRANSLATIONS.tags) {
      var nextSibling = Element.next(element);
      var fragments = getContentFromAnonymousElement(
       tagName, content.stripScripts());

      parent.removeChild(element);

      var iterator;
      if (nextSibling)
        iterator = function(node) { parent.insertBefore(node, nextSibling) };
      else
        iterator = function(node) { parent.appendChild(node); }

      fragments.each(iterator);
    } else {
      element.outerHTML = content.stripScripts();
    }

    content.evalScripts.bind(content).defer();
    return element;
  }

  if ('outerHTML' in document.documentElement)
    replace = replace_IE;

  function isContent(content) {
    if (Object.isUndefined(content) || content === null) return false;

    if (Object.isString(content) || Object.isNumber(content)) return true;
    if (Object.isElement(content)) return true;
    if (content.toElement || content.toHTML) return true;

    return false;
  }

  function insertContentAt(element, content, position) {
    position   = position.toLowerCase();
    var method = INSERTION_TRANSLATIONS[position];

    if (content && content.toElement) content = content.toElement();
    if (Object.isElement(content)) {
      method(element, content);
      return element;
    }

    content = Object.toHTML(content);
    var tagName = ((position === 'before' || position === 'after') ?
     element.parentNode : element).tagName.toUpperCase();

    var childNodes = getContentFromAnonymousElement(tagName, content.stripScripts());

    if (position === 'top' || position === 'after') childNodes.reverse();

    for (var i = 0, node; node = childNodes[i]; i++)
      method(element, node);

    content.evalScripts.bind(content).defer();
  }

  function insert(element, insertions) {
    element = $(element);

    if (isContent(insertions))
      insertions = { bottom: insertions };

    for (var position in insertions)
      insertContentAt(element, insertions[position], position);

    return element;
  }

  function wrap(element, wrapper, attributes) {
    element = $(element);

    if (Object.isElement(wrapper)) {
      $(wrapper).writeAttribute(attributes || {});
    } else if (Object.isString(wrapper)) {
      wrapper = new Element(wrapper, attributes);
    } else {
      wrapper = new Element('div', wrapper);
    }

    if (element.parentNode)
      element.parentNode.replaceChild(wrapper, element);

    wrapper.appendChild(element);

    return wrapper;
  }

  function cleanWhitespace(element) {
    element = $(element);
    var node = element.firstChild;

    while (node) {
      var nextNode = node.nextSibling;
      if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue))
        element.removeChild(node);
      node = nextNode;
    }
    return element;
  }

  function empty(element) {
    return $(element).innerHTML.blank();
  }

  function getContentFromAnonymousElement(tagName, html, force) {
    var t = INSERTION_TRANSLATIONS.tags[tagName], div = DIV;

    var workaround = !!t;
    if (!workaround && force) {
      workaround = true;
      t = ['', '', 0];
    }

    if (workaround) {
      div.innerHTML = '&#160;' + t[0] + html + t[1];
      div.removeChild(div.firstChild);
      for (var i = t[2]; i--; )
        div = div.firstChild;
    } else {
      div.innerHTML = html;
    }

    return $A(div.childNodes);
  }

  function clone(element, deep) {
    if (!(element = $(element))) return;
    var clone = element.cloneNode(deep);
    if (!HAS_UNIQUE_ID_PROPERTY) {
      clone._prototypeUID = UNDEFINED;
      if (deep) {
        var descendants = Element.select(clone, '*'),
         i = descendants.length;
        while (i--)
          descendants[i]._prototypeUID = UNDEFINED;
      }
    }
    return Element.extend(clone);
  }

  function purgeElement(element) {
    var uid = getUniqueElementID(element);
    if (uid) {
      Element.stopObserving(element);
      if (!HAS_UNIQUE_ID_PROPERTY)
        element._prototypeUID = UNDEFINED;
      delete Element.Storage[uid];
    }
  }

  function purgeCollection(elements) {
    var i = elements.length;
    while (i--)
      purgeElement(elements[i]);
  }

  function purgeCollection_IE(elements) {
    var i = elements.length, element, uid;
    while (i--) {
      element = elements[i];
      uid = getUniqueElementID(element);
      delete Element.Storage[uid];
      delete Event.cache[uid];
    }
  }

  if (HAS_UNIQUE_ID_PROPERTY) {
    purgeCollection = purgeCollection_IE;
  }


  function purge(element) {
    if (!(element = $(element))) return;
    purgeElement(element);

    var descendants = element.getElementsByTagName('*'),
     i = descendants.length;

    while (i--) purgeElement(descendants[i]);

    return null;
  }

  Object.extend(methods, {
    remove:  remove,
    update:  update,
    replace: replace,
    insert:  insert,
    wrap:    wrap,
    cleanWhitespace: cleanWhitespace,
    empty:   empty,
    clone:   clone,
    purge:   purge
  });



  function recursivelyCollect(element, property, maximumLength) {
    element = $(element);
    maximumLength = maximumLength || -1;
    var elements = [];

    while (element = element[property]) {
      if (element.nodeType === Node.ELEMENT_NODE)
        elements.push(Element.extend(element));

      if (elements.length === maximumLength) break;
    }

    return elements;
  }


  function ancestors(element) {
    return recursivelyCollect(element, 'parentNode');
  }

  function descendants(element) {
    return Element.select(element, '*');
  }

  function firstDescendant(element) {
    element = $(element).firstChild;
    while (element && element.nodeType !== Node.ELEMENT_NODE)
      element = element.nextSibling;

    return $(element);
  }

  function immediateDescendants(element) {
    var results = [], child = $(element).firstChild;

    while (child) {
      if (child.nodeType === Node.ELEMENT_NODE)
        results.push(Element.extend(child));

      child = child.nextSibling;
    }

    return results;
  }

  function previousSiblings(element) {
    return recursivelyCollect(element, 'previousSibling');
  }

  function nextSiblings(element) {
    return recursivelyCollect(element, 'nextSibling');
  }

  function siblings(element) {
    element = $(element);
    var previous = previousSiblings(element),
     next = nextSiblings(element);
    return previous.reverse().concat(next);
  }

  function match(element, selector) {
    element = $(element);

    if (Object.isString(selector))
      return Prototype.Selector.match(element, selector);

    return selector.match(element);
  }


  function _recursivelyFind(element, property, expression, index) {
    element = $(element), expression = expression || 0, index = index || 0;
    if (Object.isNumber(expression)) {
      index = expression, expression = null;
    }

    while (element = element[property]) {
      if (element.nodeType !== 1) continue;
      if (expression && !Prototype.Selector.match(element, expression))
        continue;
      if (--index >= 0) continue;

      return Element.extend(element);
    }
  }


  function up(element, expression, index) {
    element = $(element);

    if (arguments.length === 1) return $(element.parentNode);
    return _recursivelyFind(element, 'parentNode', expression, index);
  }

  function down(element, expression, index) {
    element = $(element), expression = expression || 0, index = index || 0;

    if (Object.isNumber(expression))
      index = expression, expression = '*';

    var node = Prototype.Selector.select(expression, element)[index];
    return Element.extend(node);
  }

  function previous(element, expression, index) {
    return _recursivelyFind(element, 'previousSibling', expression, index);
  }

  function next(element, expression, index) {
    return _recursivelyFind(element, 'nextSibling', expression, index);
  }

  function select(element) {
    element = $(element);
    var expressions = SLICE.call(arguments, 1).join(', ');
    return Prototype.Selector.select(expressions, element);
  }

  function adjacent(element) {
    element = $(element);
    var expressions = SLICE.call(arguments, 1).join(', ');
    var siblings = Element.siblings(element), results = [];
    for (var i = 0, sibling; sibling = siblings[i]; i++) {
      if (Prototype.Selector.match(sibling, expressions))
        results.push(sibling);
    }

    return results;
  }

  function descendantOf_DOM(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    while (element = element.parentNode)
      if (element === ancestor) return true;
    return false;
  }

  function descendantOf_contains(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    if (!ancestor.contains) return descendantOf_DOM(element, ancestor);
    return ancestor.contains(element) && ancestor !== element;
  }

  function descendantOf_compareDocumentPosition(element, ancestor) {
    element = $(element), ancestor = $(ancestor);
    return (element.compareDocumentPosition(ancestor) & 8) === 8;
  }

  var descendantOf;
  if (DIV.compareDocumentPosition) {
    descendantOf = descendantOf_compareDocumentPosition;
  } else if (DIV.contains) {
    descendantOf = descendantOf_contains;
  } else {
    descendantOf = descendantOf_DOM;
  }


  Object.extend(methods, {
    recursivelyCollect:   recursivelyCollect,
    ancestors:            ancestors,
    descendants:          descendants,
    firstDescendant:      firstDescendant,
    immediateDescendants: immediateDescendants,
    previousSiblings:     previousSiblings,
    nextSiblings:         nextSiblings,
    siblings:             siblings,
    match:                match,
    up:                   up,
    down:                 down,
    previous:             previous,
    next:                 next,
    select:               select,
    adjacent:             adjacent,
    descendantOf:         descendantOf,

    getElementsBySelector: select,

    childElements:         immediateDescendants
  });


  var idCounter = 1;
  function identify(element) {
    element = $(element);
    var id = Element.readAttribute(element, 'id');
    if (id) return id;

    do { id = 'anonymous_element_' + idCounter++ } while ($(id));

    Element.writeAttribute(element, 'id', id);
    return id;
  }


  function readAttribute(element, name) {
    return $(element).getAttribute(name);
  }

  function readAttribute_IE(element, name) {
    element = $(element);

    var table = ATTRIBUTE_TRANSLATIONS.read;
    if (table.values[name])
      return table.values[name](element, name);

    if (table.names[name]) name = table.names[name];

    if (name.include(':')) {
      if (!element.attributes || !element.attributes[name]) return null;
      return element.attributes[name].value;
    }

    return element.getAttribute(name);
  }

  function readAttribute_Opera(element, name) {
    if (name === 'title') return element.title;
    return element.getAttribute(name);
  }

  var PROBLEMATIC_ATTRIBUTE_READING = (function() {
    DIV.setAttribute('onclick', Prototype.emptyFunction);
    var value = DIV.getAttribute('onclick');
    var isFunction = (typeof value === 'function');
    DIV.removeAttribute('onclick');
    return isFunction;
  })();

  if (PROBLEMATIC_ATTRIBUTE_READING) {
    readAttribute = readAttribute_IE;
  } else if (Prototype.Browser.Opera) {
    readAttribute = readAttribute_Opera;
  }


  function writeAttribute(element, name, value) {
    element = $(element);
    var attributes = {}, table = ATTRIBUTE_TRANSLATIONS.write;

    if (typeof name === 'object') {
      attributes = name;
    } else {
      attributes[name] = Object.isUndefined(value) ? true : value;
    }

    for (var attr in attributes) {
      name = table.names[attr] || attr;
      value = attributes[attr];
      if (table.values[attr])
        name = table.values[attr](element, value);
      if (value === false || value === null)
        element.removeAttribute(name);
      else if (value === true)
        element.setAttribute(name, name);
      else element.setAttribute(name, value);
    }

    return element;
  }

  function hasAttribute(element, attribute) {
    attribute = ATTRIBUTE_TRANSLATIONS.has[attribute] || attribute;
    var node = $(element).getAttributeNode(attribute);
    return !!(node && node.specified);
  }

  GLOBAL.Element.Methods.Simulated.hasAttribute = hasAttribute;

  function classNames(element) {
    return new Element.ClassNames(element);
  }

  var regExpCache = {};
  function getRegExpForClassName(className) {
    if (regExpCache[className]) return regExpCache[className];

    var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    regExpCache[className] = re;
    return re;
  }

  function hasClassName(element, className) {
    if (!(element = $(element))) return;

    var elementClassName = element.className;

    if (elementClassName.length === 0) return false;
    if (elementClassName === className) return true;

    return getRegExpForClassName(className).test(elementClassName);
  }

  function addClassName(element, className) {
    if (!(element = $(element))) return;

    if (!hasClassName(element, className))
      element.className += (element.className ? ' ' : '') + className;

    return element;
  }

  function removeClassName(element, className) {
    if (!(element = $(element))) return;

    element.className = element.className.replace(
     getRegExpForClassName(className), ' ').strip();

    return element;
  }

  function toggleClassName(element, className, bool) {
    if (!(element = $(element))) return;

    if (Object.isUndefined(bool))
      bool = !hasClassName(element, className);

    var method = Element[bool ? 'addClassName' : 'removeClassName'];
    return method(element, className);
  }

  var ATTRIBUTE_TRANSLATIONS = {};

  var classProp = 'className', forProp = 'for';

  DIV.setAttribute(classProp, 'x');
  if (DIV.className !== 'x') {
    DIV.setAttribute('class', 'x');
    if (DIV.className === 'x')
      classProp = 'class';
  }

  var LABEL = document.createElement('label');
  LABEL.setAttribute(forProp, 'x');
  if (LABEL.htmlFor !== 'x') {
    LABEL.setAttribute('htmlFor', 'x');
    if (LABEL.htmlFor === 'x')
      forProp = 'htmlFor';
  }
  LABEL = null;

  function _getAttr(element, attribute) {
    return element.getAttribute(attribute);
  }

  function _getAttr2(element, attribute) {
    return element.getAttribute(attribute, 2);
  }

  function _getAttrNode(element, attribute) {
    var node = element.getAttributeNode(attribute);
    return node ? node.value : '';
  }

  function _getFlag(element, attribute) {
    return $(element).hasAttribute(attribute) ? attribute : null;
  }

  DIV.onclick = Prototype.emptyFunction;
  var onclickValue = DIV.getAttribute('onclick');

  var _getEv;

  if (String(onclickValue).indexOf('{') > -1) {
    _getEv = function(element, attribute) {
      var value = element.getAttribute(attribute);
      if (!value) return null;
      value = value.toString();
      value = value.split('{')[1];
      value = value.split('}')[0];
      return value.strip();
    };
  }
  else if (onclickValue === '') {
    _getEv = function(element, attribute) {
      var value = element.getAttribute(attribute);
      if (!value) return null;
      return value.strip();
    };
  }

  ATTRIBUTE_TRANSLATIONS.read = {
    names: {
      'class':     classProp,
      'className': classProp,
      'for':       forProp,
      'htmlFor':   forProp
    },

    values: {
      style: function(element) {
        return element.style.cssText.toLowerCase();
      },
      title: function(element) {
        return element.title;
      }
    }
  };

  ATTRIBUTE_TRANSLATIONS.write = {
    names: {
      className:   'class',
      htmlFor:     'for',
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing'
    },

    values: {
      checked: function(element, value) {
        element.checked = !!value;
      },

      style: function(element, value) {
        element.style.cssText = value ? value : '';
      }
    }
  };

  ATTRIBUTE_TRANSLATIONS.has = { names: {} };

  Object.extend(ATTRIBUTE_TRANSLATIONS.write.names,
   ATTRIBUTE_TRANSLATIONS.read.names);

  var CAMEL_CASED_ATTRIBUTE_NAMES = $w('colSpan rowSpan vAlign dateTime ' +
   'accessKey tabIndex encType maxLength readOnly longDesc frameBorder');

  for (var i = 0, attr; attr = CAMEL_CASED_ATTRIBUTE_NAMES[i]; i++) {
    ATTRIBUTE_TRANSLATIONS.write.names[attr.toLowerCase()] = attr;
    ATTRIBUTE_TRANSLATIONS.has.names[attr.toLowerCase()]   = attr;
  }

  Object.extend(ATTRIBUTE_TRANSLATIONS.read.values, {
    href:        _getAttr2,
    src:         _getAttr2,
    type:        _getAttr,
    action:      _getAttrNode,
    disabled:    _getFlag,
    checked:     _getFlag,
    readonly:    _getFlag,
    multiple:    _getFlag,
    onload:      _getEv,
    onunload:    _getEv,
    onclick:     _getEv,
    ondblclick:  _getEv,
    onmousedown: _getEv,
    onmouseup:   _getEv,
    onmouseover: _getEv,
    onmousemove: _getEv,
    onmouseout:  _getEv,
    onfocus:     _getEv,
    onblur:      _getEv,
    onkeypress:  _getEv,
    onkeydown:   _getEv,
    onkeyup:     _getEv,
    onsubmit:    _getEv,
    onreset:     _getEv,
    onselect:    _getEv,
    onchange:    _getEv
  });


  Object.extend(methods, {
    identify:        identify,
    readAttribute:   readAttribute,
    writeAttribute:  writeAttribute,
    classNames:      classNames,
    hasClassName:    hasClassName,
    addClassName:    addClassName,
    removeClassName: removeClassName,
    toggleClassName: toggleClassName
  });


  function normalizeStyleName(style) {
    if (style === 'float' || style === 'styleFloat')
      return 'cssFloat';
    return style.camelize();
  }

  function normalizeStyleName_IE(style) {
    if (style === 'float' || style === 'cssFloat')
      return 'styleFloat';
    return style.camelize();
  }

  function setStyle(element, styles) {
    element = $(element);
    var elementStyle = element.style, match;

    if (Object.isString(styles)) {
      elementStyle.cssText += ';' + styles;
      if (styles.include('opacity')) {
        var opacity = styles.match(/opacity:\s*(\d?\.?\d*)/)[1];
        Element.setOpacity(element, opacity);
      }
      return element;
    }

    for (var property in styles) {
      if (property === 'opacity') {
        Element.setOpacity(element, styles[property]);
      } else {
        var value = styles[property];
        if (property === 'float' || property === 'cssFloat') {
          property = Object.isUndefined(elementStyle.styleFloat) ?
           'cssFloat' : 'styleFloat';
        }
        elementStyle[property] = value;
      }
    }

    return element;
  }


  function getStyle(element, style) {
    element = $(element);
    style = normalizeStyleName(style);

    var value = element.style[style];
    if (!value || value === 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }

    if (style === 'opacity') return value ? parseFloat(value) : 1.0;
    return value === 'auto' ? null : value;
  }

  function getStyle_Opera(element, style) {
    switch (style) {
      case 'height': case 'width':
        if (!Element.visible(element)) return null;

        var dim = parseInt(getStyle(element, style), 10);

        if (dim !== element['offset' + style.capitalize()])
          return dim + 'px';

        return Element.measure(element, style);

      default: return getStyle(element, style);
    }
  }

  function getStyle_IE(element, style) {
    element = $(element);
    style = normalizeStyleName_IE(style);

    var value = element.style[style];
    if (!value && element.currentStyle) {
      value = element.currentStyle[style];
    }

    if (style === 'opacity' && !STANDARD_CSS_OPACITY_SUPPORTED)
      return getOpacity_IE(element);

    if (value === 'auto') {
      if ((style === 'width' || style === 'height') && Element.visible(element))
        return Element.measure(element, style) + 'px';
      return null;
    }

    return value;
  }

  function stripAlphaFromFilter_IE(filter) {
    return (filter || '').replace(/alpha\([^\)]*\)/gi, '');
  }

  function hasLayout_IE(element) {
    if (!element.currentStyle.hasLayout)
      element.style.zoom = 1;
    return element;
  }

  var STANDARD_CSS_OPACITY_SUPPORTED = (function() {
    DIV.style.cssText = "opacity:.55";
    return /^0.55/.test(DIV.style.opacity);
  })();

  function setOpacity(element, value) {
    element = $(element);
    if (value == 1 || value === '') value = '';
    else if (value < 0.00001) value = 0;
    element.style.opacity = value;
    return element;
  }

  function setOpacity_IE(element, value) {
    if (STANDARD_CSS_OPACITY_SUPPORTED)
      return setOpacity(element, value);

    element = hasLayout_IE($(element));
    var filter = Element.getStyle(element, 'filter'),
     style = element.style;

    if (value == 1 || value === '') {
      filter = stripAlphaFromFilter_IE(filter);
      if (filter) style.filter = filter;
      else style.removeAttribute('filter');
      return element;
    }

    if (value < 0.00001) value = 0;

    style.filter = stripAlphaFromFilter_IE(filter) +
     'alpha(opacity=' + (value * 100) + ')';

    return element;
  }


  function getOpacity(element) {
    return Element.getStyle(element, 'opacity');
  }

  function getOpacity_IE(element) {
    if (STANDARD_CSS_OPACITY_SUPPORTED)
      return getOpacity(element);

    var filter = Element.getStyle(element, 'filter');
    if (filter.length === 0) return 1.0;
    var match = (filter || '').match(/alpha\(opacity=(.*)\)/);
    if (match[1]) return parseFloat(match[1]) / 100;
    return 1.0;
  }


  Object.extend(methods, {
    setStyle:   setStyle,
    getStyle:   getStyle,
    setOpacity: setOpacity,
    getOpacity: getOpacity
  });

  if ('styleFloat' in DIV.style) {
    methods.getStyle = getStyle_IE;
    methods.setOpacity = setOpacity_IE;
    methods.getOpacity = getOpacity_IE;
  }

  var UID = 0;

  GLOBAL.Element.Storage = { UID: 1 };

  function getUniqueElementID(element) {
    if (element === window) return 0;

    if (typeof element._prototypeUID === 'undefined')
      element._prototypeUID = Element.Storage.UID++;
    return element._prototypeUID;
  }

  function getUniqueElementID_IE(element) {
    if (element === window) return 0;
    if (element == document) return 1;
    return element.uniqueID;
  }

  var HAS_UNIQUE_ID_PROPERTY = ('uniqueID' in DIV);
  if (HAS_UNIQUE_ID_PROPERTY)
    getUniqueElementID = getUniqueElementID_IE;

  function getStorage(element) {
    if (!(element = $(element))) return;

    var uid = getUniqueElementID(element);

    if (!Element.Storage[uid])
      Element.Storage[uid] = $H();

    return Element.Storage[uid];
  }

  function store(element, key, value) {
    if (!(element = $(element))) return;
    var storage = getStorage(element);
    if (arguments.length === 2) {
      storage.update(key);
    } else {
      storage.set(key, value);
    }
    return element;
  }

  function retrieve(element, key, defaultValue) {
    if (!(element = $(element))) return;
    var storage = getStorage(element), value = storage.get(key);

    if (Object.isUndefined(value)) {
      storage.set(key, defaultValue);
      value = defaultValue;
    }

    return value;
  }


  Object.extend(methods, {
    getStorage: getStorage,
    store:      store,
    retrieve:   retrieve
  });


  var Methods = {}, ByTag = Element.Methods.ByTag,
   F = Prototype.BrowserFeatures;

  if (!F.ElementExtensions && ('__proto__' in DIV)) {
    GLOBAL.HTMLElement = {};
    GLOBAL.HTMLElement.prototype = DIV['__proto__'];
    F.ElementExtensions = true;
  }

  function checkElementPrototypeDeficiency(tagName) {
    if (typeof window.Element === 'undefined') return false;
    var proto = window.Element.prototype;
    if (proto) {
      var id = '_' + (Math.random() + '').slice(2),
       el = document.createElement(tagName);
      proto[id] = 'x';
      var isBuggy = (el[id] !== 'x');
      delete proto[id];
      el = null;
      return isBuggy;
    }

    return false;
  }

  var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY =
   checkElementPrototypeDeficiency('object');

  function extendElementWith(element, methods) {
    for (var property in methods) {
      var value = methods[property];
      if (Object.isFunction(value) && !(property in element))
        element[property] = value.methodize();
    }
  }

  var EXTENDED = {};
  function elementIsExtended(element) {
    var uid = getUniqueElementID(element);
    return (uid in EXTENDED);
  }

  function extend(element) {
    if (!element || elementIsExtended(element)) return element;
    if (element.nodeType !== Node.ELEMENT_NODE || element == window)
      return element;

    var methods = Object.clone(Methods),
     tagName = element.tagName.toUpperCase();

    if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

    extendElementWith(element, methods);
    EXTENDED[getUniqueElementID(element)] = true;
    return element;
  }

  function extend_IE8(element) {
    if (!element || elementIsExtended(element)) return element;

    var t = element.tagName;
    if (t && (/^(?:object|applet|embed)$/i.test(t))) {
      extendElementWith(element, Element.Methods);
      extendElementWith(element, Element.Methods.Simulated);
      extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
    }

    return element;
  }

  if (F.SpecificElementExtensions) {
    extend = HTMLOBJECTELEMENT_PROTOTYPE_BUGGY ? extend_IE8 : Prototype.K;
  }

  function addMethodsToTagName(tagName, methods) {
    tagName = tagName.toUpperCase();
    if (!ByTag[tagName]) ByTag[tagName] = {};
    Object.extend(ByTag[tagName], methods);
  }

  function mergeMethods(destination, methods, onlyIfAbsent) {
    if (Object.isUndefined(onlyIfAbsent)) onlyIfAbsent = false;
    for (var property in methods) {
      var value = methods[property];
      if (!Object.isFunction(value)) continue;
      if (!onlyIfAbsent || !(property in destination))
        destination[property] = value.methodize();
    }
  }

  function findDOMClass(tagName) {
    var klass;
    var trans = {
      "OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
      "FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
      "DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
      "H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
      "INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image", "CAPTION":
      "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol", "THEAD":
      "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection", "TR":
      "TableRow", "TH": "TableCell", "TD": "TableCell", "FRAMESET":
      "FrameSet", "IFRAME": "IFrame"
    };
    if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName + 'Element';
    if (window[klass]) return window[klass];
    klass = 'HTML' + tagName.capitalize() + 'Element';
    if (window[klass]) return window[klass];

    var element = document.createElement(tagName),
     proto = element['__proto__'] || element.constructor.prototype;

    element = null;
    return proto;
  }

  function addMethods(methods) {
    if (arguments.length === 0) addFormMethods();

    if (arguments.length === 2) {
      var tagName = methods;
      methods = arguments[1];
    }

    if (!tagName) {
      Object.extend(Element.Methods, methods || {});
    } else {
      if (Object.isArray(tagName)) {
        for (var i = 0, tag; tag = tagName[i]; i++)
          addMethodsToTagName(tag, methods);
      } else {
        addMethodsToTagName(tagName, methods);
      }
    }

    var ELEMENT_PROTOTYPE = window.HTMLElement ? HTMLElement.prototype :
     Element.prototype;

    if (F.ElementExtensions) {
      mergeMethods(ELEMENT_PROTOTYPE, Element.Methods);
      mergeMethods(ELEMENT_PROTOTYPE, Element.Methods.Simulated, true);
    }

    if (F.SpecificElementExtensions) {
      for (var tag in Element.Methods.ByTag) {
        var klass = findDOMClass(tag);
        if (Object.isUndefined(klass)) continue;
        mergeMethods(klass.prototype, ByTag[tag]);
      }
    }

    Object.extend(Element, Element.Methods);
    Object.extend(Element, Element.Methods.Simulated);
    delete Element.ByTag;
    delete Element.Simulated;

    Element.extend.refresh();

    ELEMENT_CACHE = {};
  }

  Object.extend(GLOBAL.Element, {
    extend:     extend,
    addMethods: addMethods
  });

  if (extend === Prototype.K) {
    GLOBAL.Element.extend.refresh = Prototype.emptyFunction;
  } else {
    GLOBAL.Element.extend.refresh = function() {
      if (Prototype.BrowserFeatures.ElementExtensions) return;
      Object.extend(Methods, Element.Methods);
      Object.extend(Methods, Element.Methods.Simulated);

      EXTENDED = {};
    };
  }

  function addFormMethods() {
    Object.extend(Form, Form.Methods);
    Object.extend(Form.Element, Form.Element.Methods);
    Object.extend(Element.Methods.ByTag, {
      "FORM":     Object.clone(Form.Methods),
      "INPUT":    Object.clone(Form.Element.Methods),
      "SELECT":   Object.clone(Form.Element.Methods),
      "TEXTAREA": Object.clone(Form.Element.Methods),
      "BUTTON":   Object.clone(Form.Element.Methods)
    });
  }

  Element.addMethods(methods);

})(this);
(function() {

  function toDecimal(pctString) {
    var match = pctString.match(/^(\d+)%?$/i);
    if (!match) return null;
    return (Number(match[1]) / 100);
  }

  function getRawStyle(element, style) {
    element = $(element);

    var value = element.style[style];
    if (!value || value === 'auto') {
      var css = document.defaultView.getComputedStyle(element, null);
      value = css ? css[style] : null;
    }

    if (style === 'opacity') return value ? parseFloat(value) : 1.0;
    return value === 'auto' ? null : value;
  }

  function getRawStyle_IE(element, style) {
    var value = element.style[style];
    if (!value && element.currentStyle) {
      value = element.currentStyle[style];
    }
    return value;
  }

  function getContentWidth(element, context) {
    var boxWidth = element.offsetWidth;

    var bl = getPixelValue(element, 'borderLeftWidth',  context) || 0;
    var br = getPixelValue(element, 'borderRightWidth', context) || 0;
    var pl = getPixelValue(element, 'paddingLeft',      context) || 0;
    var pr = getPixelValue(element, 'paddingRight',     context) || 0;

    return boxWidth - bl - br - pl - pr;
  }

  if ('currentStyle' in document.documentElement) {
    getRawStyle = getRawStyle_IE;
  }


  function getPixelValue(value, property, context) {
    var element = null;
    if (Object.isElement(value)) {
      element = value;
      value = getRawStyle(element, property);
    }

    if (value === null || Object.isUndefined(value)) {
      return null;
    }

    if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
      return window.parseFloat(value);
    }

    var isPercentage = value.include('%'), isViewport = (context === document.viewport);

    if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
      var style = element.style.left, rStyle = element.runtimeStyle.left;
      element.runtimeStyle.left = element.currentStyle.left;
      element.style.left = value || 0;
      value = element.style.pixelLeft;
      element.style.left = style;
      element.runtimeStyle.left = rStyle;

      return value;
    }

    if (element && isPercentage) {
      context = context || element.parentNode;
      var decimal = toDecimal(value), whole = null;

      var isHorizontal = property.include('left') || property.include('right') ||
       property.include('width');

      var isVertical   = property.include('top') || property.include('bottom') ||
        property.include('height');

      if (context === document.viewport) {
        if (isHorizontal) {
          whole = document.viewport.getWidth();
        } else if (isVertical) {
          whole = document.viewport.getHeight();
        }
      } else {
        if (isHorizontal) {
          whole = $(context).measure('width');
        } else if (isVertical) {
          whole = $(context).measure('height');
        }
      }

      return (whole === null) ? 0 : whole * decimal;
    }

    return 0;
  }

  function toCSSPixels(number) {
    if (Object.isString(number) && number.endsWith('px'))
      return number;
    return number + 'px';
  }

  function isDisplayed(element) {
    while (element && element.parentNode) {
      var display = element.getStyle('display');
      if (display === 'none') {
        return false;
      }
      element = $(element.parentNode);
    }
    return true;
  }

  var hasLayout = Prototype.K;
  if ('currentStyle' in document.documentElement) {
    hasLayout = function(element) {
      if (!element.currentStyle.hasLayout) {
        element.style.zoom = 1;
      }
      return element;
    };
  }

  function cssNameFor(key) {
    if (key.include('border')) key = key + '-width';
    return key.camelize();
  }

  Element.Layout = Class.create(Hash, {
    initialize: function($super, element, preCompute) {
      $super();
      this.element = $(element);

      Element.Layout.PROPERTIES.each( function(property) {
        this._set(property, null);
      }, this);

      if (preCompute) {
        this._preComputing = true;
        this._begin();
        Element.Layout.PROPERTIES.each( this._compute, this );
        this._end();
        this._preComputing = false;
      }
    },

    _set: function(property, value) {
      return Hash.prototype.set.call(this, property, value);
    },

    set: function(property, value) {
      throw "Properties of Element.Layout are read-only.";
    },

    get: function($super, property) {
      var value = $super(property);
      return value === null ? this._compute(property) : value;
    },

    _begin: function() {
      if (this._isPrepared()) return;

      var element = this.element;
      if (isDisplayed(element)) {
        this._setPrepared(true);
        return;
      }


      var originalStyles = {
        position:   element.style.position   || '',
        width:      element.style.width      || '',
        visibility: element.style.visibility || '',
        display:    element.style.display    || ''
      };

      element.store('prototype_original_styles', originalStyles);

      var position = getRawStyle(element, 'position'), width = element.offsetWidth;

      if (width === 0 || width === null) {
        element.style.display = 'block';
        width = element.offsetWidth;
      }

      var context = (position === 'fixed') ? document.viewport :
       element.parentNode;

      var tempStyles = {
        visibility: 'hidden',
        display:    'block'
      };

      if (position !== 'fixed') tempStyles.position = 'absolute';

      element.setStyle(tempStyles);

      var positionedWidth = element.offsetWidth, newWidth;
      if (width && (positionedWidth === width)) {
        newWidth = getContentWidth(element, context);
      } else if (position === 'absolute' || position === 'fixed') {
        newWidth = getContentWidth(element, context);
      } else {
        var parent = element.parentNode, pLayout = $(parent).getLayout();

        newWidth = pLayout.get('width') -
         this.get('margin-left') -
         this.get('border-left') -
         this.get('padding-left') -
         this.get('padding-right') -
         this.get('border-right') -
         this.get('margin-right');
      }

      element.setStyle({ width: newWidth + 'px' });

      this._setPrepared(true);
    },

    _end: function() {
      var element = this.element;
      var originalStyles = element.retrieve('prototype_original_styles');
      element.store('prototype_original_styles', null);
      element.setStyle(originalStyles);
      this._setPrepared(false);
    },

    _compute: function(property) {
      var COMPUTATIONS = Element.Layout.COMPUTATIONS;
      if (!(property in COMPUTATIONS)) {
        throw "Property not found.";
      }

      return this._set(property, COMPUTATIONS[property].call(this, this.element));
    },

    _isPrepared: function() {
      return this.element.retrieve('prototype_element_layout_prepared', false);
    },

    _setPrepared: function(bool) {
      return this.element.store('prototype_element_layout_prepared', bool);
    },

    toObject: function() {
      var args = $A(arguments);
      var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
       args.join(' ').split(' ');
      var obj = {};
      keys.each( function(key) {
        if (!Element.Layout.PROPERTIES.include(key)) return;
        var value = this.get(key);
        if (value != null) obj[key] = value;
      }, this);
      return obj;
    },

    toHash: function() {
      var obj = this.toObject.apply(this, arguments);
      return new Hash(obj);
    },

    toCSS: function() {
      var args = $A(arguments);
      var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
       args.join(' ').split(' ');
      var css = {};

      keys.each( function(key) {
        if (!Element.Layout.PROPERTIES.include(key)) return;
        if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;

        var value = this.get(key);
        if (value != null) css[cssNameFor(key)] = value + 'px';
      }, this);
      return css;
    },

    inspect: function() {
      return "#<Element.Layout>";
    }
  });

  Object.extend(Element.Layout, {
    PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),

    COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),

    COMPUTATIONS: {
      'height': function(element) {
        if (!this._preComputing) this._begin();

        var bHeight = this.get('border-box-height');
        if (bHeight <= 0) {
          if (!this._preComputing) this._end();
          return 0;
        }

        var bTop = this.get('border-top'),
         bBottom = this.get('border-bottom');

        var pTop = this.get('padding-top'),
         pBottom = this.get('padding-bottom');

        if (!this._preComputing) this._end();

        return bHeight - bTop - bBottom - pTop - pBottom;
      },

      'width': function(element) {
        if (!this._preComputing) this._begin();

        var bWidth = this.get('border-box-width');
        if (bWidth <= 0) {
          if (!this._preComputing) this._end();
          return 0;
        }

        var bLeft = this.get('border-left'),
         bRight = this.get('border-right');

        var pLeft = this.get('padding-left'),
         pRight = this.get('padding-right');

        if (!this._preComputing) this._end();
        return bWidth - bLeft - bRight - pLeft - pRight;
      },

      'padding-box-height': function(element) {
        var height = this.get('height'),
         pTop = this.get('padding-top'),
         pBottom = this.get('padding-bottom');

        return height + pTop + pBottom;
      },

      'padding-box-width': function(element) {
        var width = this.get('width'),
         pLeft = this.get('padding-left'),
         pRight = this.get('padding-right');

        return width + pLeft + pRight;
      },

      'border-box-height': function(element) {
        if (!this._preComputing) this._begin();
        var height = element.offsetHeight;
        if (!this._preComputing) this._end();
        return height;
      },

      'border-box-width': function(element) {
        if (!this._preComputing) this._begin();
        var width = element.offsetWidth;
        if (!this._preComputing) this._end();
        return width;
      },

      'margin-box-height': function(element) {
        var bHeight = this.get('border-box-height'),
         mTop = this.get('margin-top'),
         mBottom = this.get('margin-bottom');

        if (bHeight <= 0) return 0;

        return bHeight + mTop + mBottom;
      },

      'margin-box-width': function(element) {
        var bWidth = this.get('border-box-width'),
         mLeft = this.get('margin-left'),
         mRight = this.get('margin-right');

        if (bWidth <= 0) return 0;

        return bWidth + mLeft + mRight;
      },

      'top': function(element) {
        var offset = element.positionedOffset();
        return offset.top;
      },

      'bottom': function(element) {
        var offset = element.positionedOffset(),
         parent = element.getOffsetParent(),
         pHeight = parent.measure('height');

        var mHeight = this.get('border-box-height');

        return pHeight - mHeight - offset.top;
      },

      'left': function(element) {
        var offset = element.positionedOffset();
        return offset.left;
      },

      'right': function(element) {
        var offset = element.positionedOffset(),
         parent = element.getOffsetParent(),
         pWidth = parent.measure('width');

        var mWidth = this.get('border-box-width');

        return pWidth - mWidth - offset.left;
      },

      'padding-top': function(element) {
        return getPixelValue(element, 'paddingTop');
      },

      'padding-bottom': function(element) {
        return getPixelValue(element, 'paddingBottom');
      },

      'padding-left': function(element) {
        return getPixelValue(element, 'paddingLeft');
      },

      'padding-right': function(element) {
        return getPixelValue(element, 'paddingRight');
      },

      'border-top': function(element) {
        return getPixelValue(element, 'borderTopWidth');
      },

      'border-bottom': function(element) {
        return getPixelValue(element, 'borderBottomWidth');
      },

      'border-left': function(element) {
        return getPixelValue(element, 'borderLeftWidth');
      },

      'border-right': function(element) {
        return getPixelValue(element, 'borderRightWidth');
      },

      'margin-top': function(element) {
        return getPixelValue(element, 'marginTop');
      },

      'margin-bottom': function(element) {
        return getPixelValue(element, 'marginBottom');
      },

      'margin-left': function(element) {
        return getPixelValue(element, 'marginLeft');
      },

      'margin-right': function(element) {
        return getPixelValue(element, 'marginRight');
      }
    }
  });

  if ('getBoundingClientRect' in document.documentElement) {
    Object.extend(Element.Layout.COMPUTATIONS, {
      'right': function(element) {
        var parent = hasLayout(element.getOffsetParent());
        var rect = element.getBoundingClientRect(),
         pRect = parent.getBoundingClientRect();

        return (pRect.right - rect.right).round();
      },

      'bottom': function(element) {
        var parent = hasLayout(element.getOffsetParent());
        var rect = element.getBoundingClientRect(),
         pRect = parent.getBoundingClientRect();

        return (pRect.bottom - rect.bottom).round();
      }
    });
  }

  Element.Offset = Class.create({
    initialize: function(left, top) {
      this.left = left.round();
      this.top  = top.round();

      this[0] = this.left;
      this[1] = this.top;
    },

    relativeTo: function(offset) {
      return new Element.Offset(
        this.left - offset.left,
        this.top  - offset.top
      );
    },

    inspect: function() {
      return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
    },

    toString: function() {
      return "[#{left}, #{top}]".interpolate(this);
    },

    toArray: function() {
      return [this.left, this.top];
    }
  });

  function getLayout(element, preCompute) {
    return new Element.Layout(element, preCompute);
  }

  function measure(element, property) {
    return $(element).getLayout().get(property);
  }

  function getHeight(element) {
    return Element.getDimensions(element).height;
  }

  function getWidth(element) {
    return Element.getDimensions(element).width;
  }

  function getDimensions(element) {
    element = $(element);
    var display = Element.getStyle(element, 'display');

    if (display && display !== 'none') {
      return { width: element.offsetWidth, height: element.offsetHeight };
    }

    var style = element.style;
    var originalStyles = {
      visibility: style.visibility,
      position:   style.position,
      display:    style.display
    };

    var newStyles = {
      visibility: 'hidden',
      display:    'block'
    };

    if (originalStyles.position !== 'fixed')
      newStyles.position = 'absolute';

    Element.setStyle(element, newStyles);

    var dimensions = {
      width:  element.offsetWidth,
      height: element.offsetHeight
    };

    Element.setStyle(element, originalStyles);

    return dimensions;
  }

  function getOffsetParent(element) {
    element = $(element);

    if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
      return $(document.body);

    var isInline = (Element.getStyle(element, 'display') === 'inline');
    if (!isInline && element.offsetParent) return $(element.offsetParent);

    while ((element = element.parentNode) && element !== document.body) {
      if (Element.getStyle(element, 'position') !== 'static') {
        return isHtml(element) ? $(document.body) : $(element);
      }
    }

    return $(document.body);
  }


  function cumulativeOffset(element) {
    element = $(element);
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return new Element.Offset(valueL, valueT);
  }

  function positionedOffset(element) {
    element = $(element);

    var layout = element.getLayout();

    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        if (isBody(element)) break;
        var p = Element.getStyle(element, 'position');
        if (p !== 'static') break;
      }
    } while (element);

    valueL -= layout.get('margin-top');
    valueT -= layout.get('margin-left');

    return new Element.Offset(valueL, valueT);
  }

  function cumulativeScrollOffset(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return new Element.Offset(valueL, valueT);
  }

  function viewportOffset(forElement) {
    var valueT = 0, valueL = 0, docBody = document.body;

    var element = $(forElement);
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == docBody &&
        Element.getStyle(element, 'position') == 'absolute') break;
    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (element != docBody) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);
    return new Element.Offset(valueL, valueT);
  }

  function absolutize(element) {
    element = $(element);

    if (Element.getStyle(element, 'position') === 'absolute') {
      return element;
    }

    var offsetParent = getOffsetParent(element);
    var eOffset = element.viewportOffset(),
     pOffset = offsetParent.viewportOffset();

    var offset = eOffset.relativeTo(pOffset);
    var layout = element.getLayout();

    element.store('prototype_absolutize_original_styles', {
      left:   element.getStyle('left'),
      top:    element.getStyle('top'),
      width:  element.getStyle('width'),
      height: element.getStyle('height')
    });

    element.setStyle({
      position: 'absolute',
      top:    offset.top + 'px',
      left:   offset.left + 'px',
      width:  layout.get('width') + 'px',
      height: layout.get('height') + 'px'
    });

    return element;
  }

  function relativize(element) {
    element = $(element);
    if (Element.getStyle(element, 'position') === 'relative') {
      return element;
    }

    var originalStyles =
     element.retrieve('prototype_absolutize_original_styles');

    if (originalStyles) element.setStyle(originalStyles);
    return element;
  }


  function scrollTo(element) {
    element = $(element);
    var pos = Element.cumulativeOffset(element);
    window.scrollTo(pos.left, pos.top);
    return element;
  }


  function makePositioned(element) {
    element = $(element);
    var position = Element.getStyle(element, 'position'), styles = {};
    if (position === 'static' || !position) {
      styles.position = 'relative';
      if (Prototype.Browser.Opera) {
        styles.top  = 0;
        styles.left = 0;
      }
      Element.setStyle(element, styles);
      Element.store(element, 'prototype_made_positioned', true);
    }
    return element;
  }

  function undoPositioned(element) {
    element = $(element);
    var storage = Element.getStorage(element),
     madePositioned = storage.get('prototype_made_positioned');

    if (madePositioned) {
      storage.unset('prototype_made_positioned');
      Element.setStyle(element, {
        position: '',
        top:      '',
        bottom:   '',
        left:     '',
        right:    ''
      });
    }
    return element;
  }

  function makeClipping(element) {
    element = $(element);

    var storage = Element.getStorage(element),
     madeClipping = storage.get('prototype_made_clipping');

    if (Object.isUndefined(madeClipping)) {
      var overflow = Element.getStyle(element, 'overflow');
      storage.set('prototype_made_clipping', overflow);
      if (overflow !== 'hidden')
        element.style.overflow = 'hidden';
    }

    return element;
  }

  function undoClipping(element) {
    element = $(element);
    var storage = Element.getStorage(element),
     overflow = storage.get('prototype_made_clipping');

    if (!Object.isUndefined(overflow)) {
      storage.unset('prototype_made_clipping');
      element.style.overflow = overflow || '';
    }

    return element;
  }

  function clonePosition(element, source, options) {
    options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, options || {});

    source  = $(source);
    element = $(element);
    var p, delta, layout, styles = {};

    if (options.setLeft || options.setTop) {
      p = Element.viewportOffset(source);
      delta = [0, 0];
      if (Element.getStyle(element, 'position') === 'absolute') {
        var parent = Element.getOffsetParent(element);
        if (parent !== document.body) delta = Element.viewportOffset(parent);
      }
    }

    if (options.setWidth || options.setHeight) {
      layout = Element.getLayout(source);
    }

    if (options.setLeft)
      styles.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if (options.setTop)
      styles.top  = (p[1] - delta[1] + options.offsetTop)  + 'px';

    if (options.setWidth)
      styles.width  = layout.get('border-box-width')  + 'px';
    if (options.setHeight)
      styles.height = layout.get('border-box-height') + 'px';

    return Element.setStyle(element, styles);
  }


  if (Prototype.Browser.IE) {
    getOffsetParent = getOffsetParent.wrap(
      function(proceed, element) {
        element = $(element);

        if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
          return $(document.body);

        var position = element.getStyle('position');
        if (position !== 'static') return proceed(element);

        element.setStyle({ position: 'relative' });
        var value = proceed(element);
        element.setStyle({ position: position });
        return value;
      }
    );

    positionedOffset = positionedOffset.wrap(function(proceed, element) {
      element = $(element);
      if (!element.parentNode) return new Element.Offset(0, 0);
      var position = element.getStyle('position');
      if (position !== 'static') return proceed(element);

      var offsetParent = element.getOffsetParent();
      if (offsetParent && offsetParent.getStyle('position') === 'fixed')
        hasLayout(offsetParent);

      element.setStyle({ position: 'relative' });
      var value = proceed(element);
      element.setStyle({ position: position });
      return value;
    });
  } else if (Prototype.Browser.Webkit) {
    cumulativeOffset = function(element) {
      element = $(element);
      var valueT = 0, valueL = 0;
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        if (element.offsetParent == document.body) {
          if (Element.getStyle(element, 'position') == 'absolute') break;
        }

        element = element.offsetParent;
      } while (element);

      return new Element.Offset(valueL, valueT);
    };
  }


  Element.addMethods({
    getLayout:              getLayout,
    measure:                measure,
    getWidth:               getWidth,
    getHeight:              getHeight,
    getDimensions:          getDimensions,
    getOffsetParent:        getOffsetParent,
    cumulativeOffset:       cumulativeOffset,
    positionedOffset:       positionedOffset,
    cumulativeScrollOffset: cumulativeScrollOffset,
    viewportOffset:         viewportOffset,
    absolutize:             absolutize,
    relativize:             relativize,
    scrollTo:               scrollTo,
    makePositioned:         makePositioned,
    undoPositioned:         undoPositioned,
    makeClipping:           makeClipping,
    undoClipping:           undoClipping,
    clonePosition:          clonePosition
  });

  function isBody(element) {
    return element.nodeName.toUpperCase() === 'BODY';
  }

  function isHtml(element) {
    return element.nodeName.toUpperCase() === 'HTML';
  }

  function isDocument(element) {
    return element.nodeType === Node.DOCUMENT_NODE;
  }

  function isDetached(element) {
    return element !== document.body &&
     !Element.descendantOf(element, document.body);
  }

  if ('getBoundingClientRect' in document.documentElement) {
    Element.addMethods({
      viewportOffset: function(element) {
        element = $(element);
        if (isDetached(element)) return new Element.Offset(0, 0);

        var rect = element.getBoundingClientRect(),
         docEl = document.documentElement;
        return new Element.Offset(rect.left - docEl.clientLeft,
         rect.top - docEl.clientTop);
      }
    });
  }


})();

(function() {

  var IS_OLD_OPERA = Prototype.Browser.Opera &&
   (window.parseFloat(window.opera.version()) < 9.5);
  var ROOT = null;
  function getRootElement() {
    if (ROOT) return ROOT;
    ROOT = IS_OLD_OPERA ? document.body : document.documentElement;
    return ROOT;
  }

  function getDimensions() {
    return { width: this.getWidth(), height: this.getHeight() };
  }

  function getWidth() {
    return getRootElement().clientWidth;
  }

  function getHeight() {
    return getRootElement().clientHeight;
  }

  function getScrollOffsets() {
    var x = window.pageXOffset || document.documentElement.scrollLeft ||
     document.body.scrollLeft;
    var y = window.pageYOffset || document.documentElement.scrollTop ||
     document.body.scrollTop;

    return new Element.Offset(x, y);
  }

  document.viewport = {
    getDimensions:    getDimensions,
    getWidth:         getWidth,
    getHeight:        getHeight,
    getScrollOffsets: getScrollOffsets
  };

})();
window.$$ = function() {
  var expression = $A(arguments).join(', ');
  return Prototype.Selector.select(expression, document);
};

Prototype.Selector = (function() {

  function select() {
    throw new Error('Method "Prototype.Selector.select" must be defined.');
  }

  function match() {
    throw new Error('Method "Prototype.Selector.match" must be defined.');
  }

  function find(elements, expression, index) {
    index = index || 0;
    var match = Prototype.Selector.match, length = elements.length, matchIndex = 0, i;

    for (i = 0; i < length; i++) {
      if (match(elements[i], expression) && index == matchIndex++) {
        return Element.extend(elements[i]);
      }
    }
  }

  function extendElements(elements) {
    for (var i = 0, length = elements.length; i < length; i++) {
      Element.extend(elements[i]);
    }
    return elements;
  }


  var K = Prototype.K;

  return {
    select: select,
    match: match,
    find: find,
    extendElements: (Element.extend === K) ? K : extendElements,
    extendElement: Element.extend
  };
})();
/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set );
			}
		}

	} else {
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					var doneName = match[0],
						parent = elem.parentNode;

					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent.sizcache = doneName;
					}

					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		if ( aup === bup ) {
			return siblingCheck( a, b );

		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

(function(){
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	root.insertBefore( form, root.firstChild );

	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	root = form = null;
})();

(function(){

	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			if ( !seed && !Sizzle.isXML(context) ) {
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						if ( elem && elem.parentNode ) {
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						if ( ret || !disconnectedMatch ||
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};


window.Sizzle = Sizzle;

})();

Prototype._original_property = window.Sizzle;

;(function(engine) {
  var extendElements = Prototype.Selector.extendElements;

  function select(selector, scope) {
    return extendElements(engine(selector, scope || document));
  }

  function match(element, selector) {
    return engine.matches(selector, [element]).length == 1;
  }

  Prototype.Selector.engine = engine;
  Prototype.Selector.select = select;
  Prototype.Selector.match = match;
})(Sizzle);

window.Sizzle = Prototype._original_property;
delete Prototype._original_property;

var Form = {
  reset: function(form) {
    form = $(form);
    form.reset();
    return form;
  },

  serializeElements: function(elements, options) {
    if (typeof options != 'object') options = { hash: !!options };
    else if (Object.isUndefined(options.hash)) options.hash = true;
    var key, value, submitted = false, submit = options.submit, accumulator, initial;

    if (options.hash) {
      initial = {};
      accumulator = function(result, key, value) {
        if (key in result) {
          if (!Object.isArray(result[key])) result[key] = [result[key]];
          result[key].push(value);
        } else result[key] = value;
        return result;
      };
    } else {
      initial = '';
      accumulator = function(result, key, value) {
        value = value.gsub(/(\r)?\n/, '\r\n');
        value = encodeURIComponent(value);
        value = value.gsub(/%20/, '+');
        return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
      }
    }

    return elements.inject(initial, function(result, element) {
      if (!element.disabled && element.name) {
        key = element.name; value = $(element).getValue();
        if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
            submit !== false && (!submit || key == submit) && (submitted = true)))) {
          result = accumulator(result, key, value);
        }
      }
      return result;
    });
  }
};

Form.Methods = {
  serialize: function(form, options) {
    return Form.serializeElements(Form.getElements(form), options);
  },


  getElements: function(form) {
    var elements = $(form).getElementsByTagName('*');
    var element, results = [], serializers = Form.Element.Serializers;

    for (var i = 0; element = elements[i]; i++) {
      if (serializers[element.tagName.toLowerCase()])
        results.push(Element.extend(element));
    }
    return results;
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name) return $A(inputs).map(Element.extend);

    for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) || (name && input.name != name))
        continue;
      matchingInputs.push(Element.extend(input));
    }

    return matchingInputs;
  },

  disable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('disable');
    return form;
  },

  enable: function(form) {
    form = $(form);
    Form.getElements(form).invoke('enable');
    return form;
  },

  findFirstElement: function(form) {
    var elements = $(form).getElements().findAll(function(element) {
      return 'hidden' != element.type && !element.disabled;
    });
    var firstByIndex = elements.findAll(function(element) {
      return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
    }).sortBy(function(element) { return element.tabIndex }).first();

    return firstByIndex ? firstByIndex : elements.find(function(element) {
      return /^(?:input|select|textarea)$/i.test(element.tagName);
    });
  },

  focusFirstElement: function(form) {
    form = $(form);
    var element = form.findFirstElement();
    if (element) element.activate();
    return form;
  },

  request: function(form, options) {
    form = $(form), options = Object.clone(options || { });

    var params = options.parameters, action = form.readAttribute('action') || '';
    if (action.blank()) action = window.location.href;
    options.parameters = form.serialize(true);

    if (params) {
      if (Object.isString(params)) params = params.toQueryParams();
      Object.extend(options.parameters, params);
    }

    if (form.hasAttribute('method') && !options.method)
      options.method = form.method;

    return new Ajax.Request(action, options);
  }
};

/*--------------------------------------------------------------------------*/


Form.Element = {
  focus: function(element) {
    $(element).focus();
    return element;
  },

  select: function(element) {
    $(element).select();
    return element;
  }
};

Form.Element.Methods = {

  serialize: function(element) {
    element = $(element);
    if (!element.disabled && element.name) {
      var value = element.getValue();
      if (value != undefined) {
        var pair = { };
        pair[element.name] = value;
        return Object.toQueryString(pair);
      }
    }
    return '';
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    return Form.Element.Serializers[method](element);
  },

  setValue: function(element, value) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    Form.Element.Serializers[method](element, value);
    return element;
  },

  clear: function(element) {
    $(element).value = '';
    return element;
  },

  present: function(element) {
    return $(element).value != '';
  },

  activate: function(element) {
    element = $(element);
    try {
      element.focus();
      if (element.select && (element.tagName.toLowerCase() != 'input' ||
          !(/^(?:button|reset|submit)$/i.test(element.type))))
        element.select();
    } catch (e) { }
    return element;
  },

  disable: function(element) {
    element = $(element);
    element.disabled = true;
    return element;
  },

  enable: function(element) {
    element = $(element);
    element.disabled = false;
    return element;
  }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;

var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = (function() {
  function input(element, value) {
    switch (element.type.toLowerCase()) {
      case 'checkbox':
      case 'radio':
        return inputSelector(element, value);
      default:
        return valueSelector(element, value);
    }
  }

  function inputSelector(element, value) {
    if (Object.isUndefined(value))
      return element.checked ? element.value : null;
    else element.checked = !!value;
  }

  function valueSelector(element, value) {
    if (Object.isUndefined(value)) return element.value;
    else element.value = value;
  }

  function select(element, value) {
    if (Object.isUndefined(value))
      return (element.type === 'select-one' ? selectOne : selectMany)(element);

    var opt, currentValue, single = !Object.isArray(value);
    for (var i = 0, length = element.length; i < length; i++) {
      opt = element.options[i];
      currentValue = this.optionValue(opt);
      if (single) {
        if (currentValue == value) {
          opt.selected = true;
          return;
        }
      }
      else opt.selected = value.include(currentValue);
    }
  }

  function selectOne(element) {
    var index = element.selectedIndex;
    return index >= 0 ? optionValue(element.options[index]) : null;
  }

  function selectMany(element) {
    var values, length = element.length;
    if (!length) return null;

    for (var i = 0, values = []; i < length; i++) {
      var opt = element.options[i];
      if (opt.selected) values.push(optionValue(opt));
    }
    return values;
  }

  function optionValue(opt) {
    return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
  }

  return {
    input:         input,
    inputSelector: inputSelector,
    textarea:      valueSelector,
    select:        select,
    selectOne:     selectOne,
    selectMany:    selectMany,
    optionValue:   optionValue,
    button:        valueSelector
  };
})();

/*--------------------------------------------------------------------------*/


Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
  initialize: function($super, element, frequency, callback) {
    $super(callback, frequency);
    this.element   = $(element);
    this.lastValue = this.getValue();
  },

  execute: function() {
    var value = this.getValue();
    if (Object.isString(this.lastValue) && Object.isString(value) ?
        this.lastValue != value : String(this.lastValue) != String(value)) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    Form.getElements(this.element).each(this.registerCallback, this);
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        default:
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
(function(GLOBAL) {
  var DIV = document.createElement('div');
  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
   && 'onmouseleave' in docEl;

  var Event = {
    KEY_BACKSPACE: 8,
    KEY_TAB:       9,
    KEY_RETURN:   13,
    KEY_ESC:      27,
    KEY_LEFT:     37,
    KEY_UP:       38,
    KEY_RIGHT:    39,
    KEY_DOWN:     40,
    KEY_DELETE:   46,
    KEY_HOME:     36,
    KEY_END:      35,
    KEY_PAGEUP:   33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT:   45
  };


  var isIELegacyEvent = function(event) { return false; };

  if (window.attachEvent) {
    if (window.addEventListener) {
      isIELegacyEvent = function(event) {
        return !(event instanceof window.Event);
      };
    } else {
      isIELegacyEvent = function(event) { return true; };
    }
  }

  var _isButton;

  function _isButtonForDOMEvents(event, code) {
    return event.which ? (event.which === code + 1) : (event.button === code);
  }

  var legacyButtonMap = { 0: 1, 1: 4, 2: 2 };
  function _isButtonForLegacyEvents(event, code) {
    return event.button === legacyButtonMap[code];
  }

  function _isButtonForWebKit(event, code) {
    switch (code) {
      case 0: return event.which == 1 && !event.metaKey;
      case 1: return event.which == 2 || (event.which == 1 && event.metaKey);
      case 2: return event.which == 3;
      default: return false;
    }
  }

  if (window.attachEvent) {
    if (!window.addEventListener) {
      _isButton = _isButtonForLegacyEvents;
    } else {
      _isButton = function(event, code) {
        return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) :
         _isButtonForDOMEvents(event, code);
      }
    }
  } else if (Prototype.Browser.WebKit) {
    _isButton = _isButtonForWebKit;
  } else {
    _isButton = _isButtonForDOMEvents;
  }

  function isLeftClick(event)   { return _isButton(event, 0) }

  function isMiddleClick(event) { return _isButton(event, 1) }

  function isRightClick(event)  { return _isButton(event, 2) }

  function element(event) {
    return Element.extend(_element(event));
  }

  function _element(event) {
    event = Event.extend(event);

    var node = event.target, type = event.type,
     currentTarget = event.currentTarget;

    if (currentTarget && currentTarget.tagName) {
      if (type === 'load' || type === 'error' ||
        (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
          && currentTarget.type === 'radio'))
            node = currentTarget;
    }

    if (node.nodeType == Node.TEXT_NODE)
      node = node.parentNode;

    return Element.extend(node);
  }

  function findElement(event, expression) {
    var element = _element(event), match = Prototype.Selector.match;
    if (!expression) return Element.extend(element);
    while (element) {
      if (Object.isElement(element) && match(element, expression))
        return Element.extend(element);
      element = element.parentNode;
    }
  }

  function pointer(event) {
    return { x: pointerX(event), y: pointerY(event) };
  }

  function pointerX(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollLeft: 0 };

    return event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));
  }

  function pointerY(event) {
    var docElement = document.documentElement,
     body = document.body || { scrollTop: 0 };

    return  event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));
  }


  function stop(event) {
    Event.extend(event);
    event.preventDefault();
    event.stopPropagation();

    event.stopped = true;
  }


  Event.Methods = {
    isLeftClick:   isLeftClick,
    isMiddleClick: isMiddleClick,
    isRightClick:  isRightClick,

    element:     element,
    findElement: findElement,

    pointer:  pointer,
    pointerX: pointerX,
    pointerY: pointerY,

    stop: stop
  };

  var methods = Object.keys(Event.Methods).inject({ }, function(m, name) {
    m[name] = Event.Methods[name].methodize();
    return m;
  });

  if (window.attachEvent) {
    function _relatedTarget(event) {
      var element;
      switch (event.type) {
        case 'mouseover':
        case 'mouseenter':
          element = event.fromElement;
          break;
        case 'mouseout':
        case 'mouseleave':
          element = event.toElement;
          break;
        default:
          return null;
      }
      return Element.extend(element);
    }

    var additionalMethods = {
      stopPropagation: function() { this.cancelBubble = true },
      preventDefault:  function() { this.returnValue = false },
      inspect: function() { return '[object Event]' }
    };

    Event.extend = function(event, element) {
      if (!event) return false;

      if (!isIELegacyEvent(event)) return event;

      if (event._extendedByPrototype) return event;
      event._extendedByPrototype = Prototype.emptyFunction;

      var pointer = Event.pointer(event);

      Object.extend(event, {
        target: event.srcElement || element,
        relatedTarget: _relatedTarget(event),
        pageX:  pointer.x,
        pageY:  pointer.y
      });

      Object.extend(event, methods);
      Object.extend(event, additionalMethods);

      return event;
    };
  } else {
    Event.extend = Prototype.K;
  }

  if (window.addEventListener) {
    Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
    Object.extend(Event.prototype, methods);
  }

  var EVENT_TRANSLATIONS = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };

  function getDOMEventName(eventName) {
    return EVENT_TRANSLATIONS[eventName] || eventName;
  }

  if (MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED)
    getDOMEventName = Prototype.K;

  function getUniqueElementID(element) {
    if (element === window) return 0;

    if (typeof element._prototypeUID === 'undefined')
      element._prototypeUID = Element.Storage.UID++;
    return element._prototypeUID;
  }

  function getUniqueElementID_IE(element) {
    if (element === window) return 0;
    if (element == document) return 1;
    return element.uniqueID;
  }

  if ('uniqueID' in DIV)
    getUniqueElementID = getUniqueElementID_IE;

  function isCustomEvent(eventName) {
    return eventName.include(':');
  }

  Event._isCustomEvent = isCustomEvent;

  function getRegistryForElement(element, uid) {
    var CACHE = GLOBAL.Event.cache;
    if (Object.isUndefined(uid))
      uid = getUniqueElementID(element);
    if (!CACHE[uid]) CACHE[uid] = { element: element };
    return CACHE[uid];
  }

  function destroyRegistryForElement(element, uid) {
    if (Object.isUndefined(uid))
      uid = getUniqueElementID(element);
    delete GLOBAL.Event.cache[uid];
  }


  function register(element, eventName, handler) {
    var registry = getRegistryForElement(element);
    if (!registry[eventName]) registry[eventName] = [];
    var entries = registry[eventName];

    var i = entries.length;
    while (i--)
      if (entries[i].handler === handler) return null;

    var uid = getUniqueElementID(element);
    var responder = GLOBAL.Event._createResponder(uid, eventName, handler);
    var entry = {
      responder: responder,
      handler:   handler
    };

    entries.push(entry);
    return entry;
  }

  function unregister(element, eventName, handler) {
    var registry = getRegistryForElement(element);
    var entries = registry[eventName];
    if (!entries) return;

    var i = entries.length, entry;
    while (i--) {
      if (entries[i].handler === handler) {
        entry = entries[i];
        break;
      }
    }

    if (!entry) return;

    var index = entries.indexOf(entry);
    entries.splice(index, 1);

    return entry;
  }


  function observe(element, eventName, handler) {
    element = $(element);
    var entry = register(element, eventName, handler);

    if (entry === null) return element;

    var responder = entry.responder;
    if (isCustomEvent(eventName))
      observeCustomEvent(element, eventName, responder);
    else
      observeStandardEvent(element, eventName, responder);

    return element;
  }

  function observeStandardEvent(element, eventName, responder) {
    var actualEventName = getDOMEventName(eventName);
    if (element.addEventListener) {
      element.addEventListener(actualEventName, responder, false);
    } else {
      element.attachEvent('on' + actualEventName, responder);
    }
  }

  function observeCustomEvent(element, eventName, responder) {
    if (element.addEventListener) {
      element.addEventListener('dataavailable', responder, false);
    } else {
      element.attachEvent('ondataavailable', responder);
      element.attachEvent('onlosecapture',   responder);
    }
  }

  function stopObserving(element, eventName, handler) {
    element = $(element);
    var handlerGiven = !Object.isUndefined(handler),
     eventNameGiven = !Object.isUndefined(eventName);

    if (!eventNameGiven && !handlerGiven) {
      stopObservingElement(element);
      return element;
    }

    if (!handlerGiven) {
      stopObservingEventName(element, eventName);
      return element;
    }

    var entry = unregister(element, eventName, handler);

    if (!entry) return element;
    removeEvent(element, eventName, entry.responder);
    return element;
  }

  function stopObservingStandardEvent(element, eventName, responder) {
    var actualEventName = getDOMEventName(eventName);
    if (element.removeEventListener) {
      element.removeEventListener(actualEventName, responder, false);
    } else {
      element.detachEvent('on' + actualEventName, responder);
    }
  }

  function stopObservingCustomEvent(element, eventName, responder) {
    if (element.removeEventListener) {
      element.removeEventListener('dataavailable', responder, false);
    } else {
      element.detachEvent('ondataavailable', responder);
      element.detachEvent('onlosecapture',   responder);
    }
  }



  function stopObservingElement(element) {
    var uid = getUniqueElementID(element),
     registry = getRegistryForElement(element, uid);

    destroyRegistryForElement(element, uid);

    var entries, i;
    for (var eventName in registry) {
      if (eventName === 'element') continue;

      entries = registry[eventName];
      i = entries.length;
      while (i--)
        removeEvent(element, eventName, entries[i].responder);
    }
  }

  function stopObservingEventName(element, eventName) {
    var registry = getRegistryForElement(element);
    var entries = registry[eventName];
    if (!entries) return;
    delete registry[eventName];

    var i = entries.length;
    while (i--)
      removeEvent(element, eventName, entries[i].responder);
  }


  function removeEvent(element, eventName, handler) {
    if (isCustomEvent(eventName))
      stopObservingCustomEvent(element, eventName, handler);
    else
      stopObservingStandardEvent(element, eventName, handler);
  }



  function getFireTarget(element) {
    if (element !== document) return element;
    if (document.createEvent && !element.dispatchEvent)
      return document.documentElement;
    return element;
  }

  function fire(element, eventName, memo, bubble) {
    element = getFireTarget($(element));
    if (Object.isUndefined(bubble)) bubble = true;
    memo = memo || {};

    var event = fireEvent(element, eventName, memo, bubble);
    return Event.extend(event);
  }

  function fireEvent_DOM(element, eventName, memo, bubble) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('dataavailable', bubble, true);

    event.eventName = eventName;
    event.memo = memo;

    element.dispatchEvent(event);
    return event;
  }

  function fireEvent_IE(element, eventName, memo, bubble) {
    var event = document.createEventObject();
    event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';

    event.eventName = eventName;
    event.memo = memo;

    element.fireEvent(event.eventType, event);
    return event;
  }

  var fireEvent = document.createEvent ? fireEvent_DOM : fireEvent_IE;



  Event.Handler = Class.create({
    initialize: function(element, eventName, selector, callback) {
      this.element   = $(element);
      this.eventName = eventName;
      this.selector  = selector;
      this.callback  = callback;
      this.handler   = this.handleEvent.bind(this);
    },


    start: function() {
      Event.observe(this.element, this.eventName, this.handler);
      return this;
    },

    stop: function() {
      Event.stopObserving(this.element, this.eventName, this.handler);
      return this;
    },

    handleEvent: function(event) {
      var element = Event.findElement(event, this.selector);
      if (element) this.callback.call(this.element, event, element);
    }
  });

  function on(element, eventName, selector, callback) {
    element = $(element);
    if (Object.isFunction(selector) && Object.isUndefined(callback)) {
      callback = selector, selector = null;
    }

    return new Event.Handler(element, eventName, selector, callback).start();
  }

  Object.extend(Event, Event.Methods);

  Object.extend(Event, {
    fire:          fire,
    observe:       observe,
    stopObserving: stopObserving,
    on:            on
  });

  Element.addMethods({
    fire:          fire,

    observe:       observe,

    stopObserving: stopObserving,

    on:            on
  });

  Object.extend(document, {
    fire:          fire.methodize(),

    observe:       observe.methodize(),

    stopObserving: stopObserving.methodize(),

    on:            on.methodize(),

    loaded:        false
  });

  if (GLOBAL.Event) Object.extend(window.Event, Event);
  else GLOBAL.Event = Event;

  GLOBAL.Event.cache = {};

  function destroyCache_IE() {
    GLOBAL.Event.cache = null;
  }

  if (window.attachEvent)
    window.attachEvent('onunload', destroyCache_IE);

  DIV = null;
  docEl = null;
})(this);

(function(GLOBAL) {
  /* Code for creating leak-free event responders is based on work by
   John-David Dalton. */

  var docEl = document.documentElement;
  var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
    && 'onmouseleave' in docEl;

  function isSimulatedMouseEnterLeaveEvent(eventName) {
    return !MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
     (eventName === 'mouseenter' || eventName === 'mouseleave');
  }

  function createResponder(uid, eventName, handler) {
    if (Event._isCustomEvent(eventName))
      return createResponderForCustomEvent(uid, eventName, handler);
    if (isSimulatedMouseEnterLeaveEvent(eventName))
      return createMouseEnterLeaveResponder(uid, eventName, handler);

    return function(event) {
      var cacheEntry = Event.cache[uid];
      var element = cacheEntry.element;

      Event.extend(event, element);
      handler.call(element, event);
    };
  }

  function createResponderForCustomEvent(uid, eventName, handler) {
    return function(event) {
      var cacheEntry = Event.cache[uid], element = cacheEntry.element;

      if (Object.isUndefined(event.eventName))
        return false;

      if (event.eventName !== eventName)
        return false;

      Event.extend(event, element);
      handler.call(element, event);
    };
  }

  function createMouseEnterLeaveResponder(uid, eventName, handler) {
    return function(event) {
      var cacheEntry = Event.cache[uid], element = cacheEntry.element;

      Event.extend(event, element);
      var parent = event.relatedTarget;

      while (parent && parent !== element) {
        try { parent = parent.parentNode; }
        catch(e) { parent = element; }
      }

      if (parent === element) return;
      handler.call(element, event);
    }
  }

  GLOBAL.Event._createResponder = createResponder;
  docEl = null;
})(this);

(function(GLOBAL) {
  /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

  var TIMER;

  function fireContentLoadedEvent() {
    if (document.loaded) return;
    if (TIMER) window.clearTimeout(TIMER);
    document.loaded = true;
    document.fire('dom:loaded');
  }

  function checkReadyState() {
    if (document.readyState === 'complete') {
      document.detachEvent('onreadystatechange', checkReadyState);
      fireContentLoadedEvent();
    }
  }

  function pollDoScroll() {
    try {
      document.documentElement.doScroll('left');
    } catch (e) {
      TIMER = pollDoScroll.defer();
      return;
    }

    fireContentLoadedEvent();
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
  } else {
    document.attachEvent('onreadystatechange', checkReadyState);
    if (window == top) TIMER = pollDoScroll.defer();
  }

  Event.observe(window, 'load', fireContentLoadedEvent);
})(this);


Element.addMethods();
/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = { display: Element.toggle };

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
  Before: function(element, content) {
    return Element.insert(element, {before:content});
  },

  Top: function(element, content) {
    return Element.insert(element, {top:content});
  },

  Bottom: function(element, content) {
    return Element.insert(element, {bottom:content});
  },

  After: function(element, content) {
    return Element.insert(element, {after:content});
  }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
  includeScrollOffsets: false,

  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  within: function(element, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = Element.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = Element.cumulativeScrollOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = Element.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },


  cumulativeOffset: Element.Methods.cumulativeOffset,

  positionedOffset: Element.Methods.positionedOffset,

  absolutize: function(element) {
    Position.prepare();
    return Element.absolutize(element);
  },

  relativize: function(element) {
    Position.prepare();
    return Element.relativize(element);
  },

  realOffset: Element.Methods.cumulativeScrollOffset,

  offsetParent: Element.Methods.getOffsetParent,

  page: Element.Methods.viewportOffset,

  clone: function(source, target, options) {
    options = options || { };
    return Element.clonePosition(target, source, options);
  }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods){
  function iter(name) {
    return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
  }

  instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
  function(element, className) {
    className = className.toString().strip();
    var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
    return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
  } : function(element, className) {
    className = className.toString().strip();
    var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
    if (!classNames && !className) return elements;

    var nodes = $(element).getElementsByTagName('*');
    className = ' ' + className + ' ';

    for (var i = 0, child, cn; child = nodes[i]; i++) {
      if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
          (classNames && classNames.all(function(name) {
            return !name.toString().blank() && cn.include(' ' + name + ' ');
          }))))
        elements.push(Element.extend(child));
    }
    return elements;
  };

  return function(className, parentElement) {
    return $(parentElement || document.body).getElementsByClassName(className);
  };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator, context) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator, context);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set($A(this).concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set($A(this).without(classNameToRemove).join(' '));
  },

  toString: function() {
    return $A(this).join(' ');
  }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

(function() {
  window.Selector = Class.create({
    initialize: function(expression) {
      this.expression = expression.strip();
    },

    findElements: function(rootElement) {
      return Prototype.Selector.select(this.expression, rootElement);
    },

    match: function(element) {
      return Prototype.Selector.match(element, this.expression);
    },

    toString: function() {
      return this.expression;
    },

    inspect: function() {
      return "#<Selector: " + this.expression + ">";
    }
  });

  Object.extend(Selector, {
    matchElements: function(elements, expression) {
      var match = Prototype.Selector.match,
          results = [];

      for (var i = 0, length = elements.length; i < length; i++) {
        var element = elements[i];
        if (match(element, expression)) {
          results.push(Element.extend(element));
        }
      }
      return results;
    },

    findElement: function(elements, expression, index) {
      index = index || 0;
      var matchIndex = 0, element;
      for (var i = 0, length = elements.length; i < length; i++) {
        element = elements[i];
        if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
          return Element.extend(element);
        }
      }
    },

    findChildElements: function(element, expressions) {
      var selector = expressions.toArray().join(', ');
      return Prototype.Selector.select(selector, element || document);
    }
  });
})();
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.2 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\
!function(a){var b,c,d="0.4.2",e="hasOwnProperty",f=/[\.\/]/,g="*",h=function(){},i=function(a,b){return a-b},j={n:{}},k=function(a,d){a=String(a);var e,f=c,g=Array.prototype.slice.call(arguments,2),h=k.listeners(a),j=0,l=[],m={},n=[],o=b;b=a,c=0;for(var p=0,q=h.length;q>p;p++)"zIndex"in h[p]&&(l.push(h[p].zIndex),h[p].zIndex<0&&(m[h[p].zIndex]=h[p]));for(l.sort(i);l[j]<0;)if(e=m[l[j++]],n.push(e.apply(d,g)),c)return c=f,n;for(p=0;q>p;p++)if(e=h[p],"zIndex"in e)if(e.zIndex==l[j]){if(n.push(e.apply(d,g)),c)break;do if(j++,e=m[l[j]],e&&n.push(e.apply(d,g)),c)break;while(e)}else m[e.zIndex]=e;else if(n.push(e.apply(d,g)),c)break;return c=f,b=o,n.length?n:null};k._events=j,k.listeners=function(a){var b,c,d,e,h,i,k,l,m=a.split(f),n=j,o=[n],p=[];for(e=0,h=m.length;h>e;e++){for(l=[],i=0,k=o.length;k>i;i++)for(n=o[i].n,c=[n[m[e]],n[g]],d=2;d--;)b=c[d],b&&(l.push(b),p=p.concat(b.f||[]));o=l}return p},k.on=function(a,b){if(a=String(a),"function"!=typeof b)return function(){};for(var c=a.split(f),d=j,e=0,g=c.length;g>e;e++)d=d.n,d=d.hasOwnProperty(c[e])&&d[c[e]]||(d[c[e]]={n:{}});for(d.f=d.f||[],e=0,g=d.f.length;g>e;e++)if(d.f[e]==b)return h;return d.f.push(b),function(a){+a==+a&&(b.zIndex=+a)}},k.f=function(a){var b=[].slice.call(arguments,1);return function(){k.apply(null,[a,null].concat(b).concat([].slice.call(arguments,0)))}},k.stop=function(){c=1},k.nt=function(a){return a?new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)").test(b):b},k.nts=function(){return b.split(f)},k.off=k.unbind=function(a,b){if(!a)return void(k._events=j={n:{}});var c,d,h,i,l,m,n,o=a.split(f),p=[j];for(i=0,l=o.length;l>i;i++)for(m=0;m<p.length;m+=h.length-2){if(h=[m,1],c=p[m].n,o[i]!=g)c[o[i]]&&h.push(c[o[i]]);else for(d in c)c[e](d)&&h.push(c[d]);p.splice.apply(p,h)}for(i=0,l=p.length;l>i;i++)for(c=p[i];c.n;){if(b){if(c.f){for(m=0,n=c.f.length;n>m;m++)if(c.f[m]==b){c.f.splice(m,1);break}!c.f.length&&delete c.f}for(d in c.n)if(c.n[e](d)&&c.n[d].f){var q=c.n[d].f;for(m=0,n=q.length;n>m;m++)if(q[m]==b){q.splice(m,1);break}!q.length&&delete c.n[d].f}}else{delete c.f;for(d in c.n)c.n[e](d)&&c.n[d].f&&delete c.n[d].f}c=c.n}},k.once=function(a,b){var c=function(){return k.unbind(a,c),b.apply(this,arguments)};return k.on(a,c)},k.version=d,k.toString=function(){return"You are running Eve "+d},"undefined"!=typeof module&&module.exports?module.exports=k:"undefined"!=typeof define?define("eve",[],function(){return k}):a.eve=k}(window||this),function(a,b){"function"==typeof define&&define.amd?define(["eve"],function(c){return b(a,c)}):b(a,a.eve)}(this,function(a,b){function c(a){if(c.is(a,"function"))return u?a():b.on("raphael.DOMload",a);if(c.is(a,V))return c._engine.create[D](c,a.splice(0,3+c.is(a[0],T))).add(a);var d=Array.prototype.slice.call(arguments,0);if(c.is(d[d.length-1],"function")){var e=d.pop();return u?e.call(c._engine.create[D](c,d)):b.on("raphael.DOMload",function(){e.call(c._engine.create[D](c,d))})}return c._engine.create[D](c,arguments)}function d(a){if("function"==typeof a||Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[z](c)&&(b[c]=d(a[c]));return b}function e(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function f(a,b,c){function d(){var f=Array.prototype.slice.call(arguments,0),g=f.join("␀"),h=d.cache=d.cache||{},i=d.count=d.count||[];return h[z](g)?(e(i,g),c?c(h[g]):h[g]):(i.length>=1e3&&delete h[i.shift()],i.push(g),h[g]=a[D](b,f),c?c(h[g]):h[g])}return d}function g(){return this.hex}function h(a,b){for(var c=[],d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function i(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function j(a,b,c,d,e,f,g,h,j){null==j&&(j=1),j=j>1?1:0>j?0:j;for(var k=j/2,l=12,m=[-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],n=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],o=0,p=0;l>p;p++){var q=k*m[p]+k,r=i(q,a,c,e,g),s=i(q,b,d,f,h),t=r*r+s*s;o+=n[p]*N.sqrt(t)}return k*o}function k(a,b,c,d,e,f,g,h,i){if(!(0>i||j(a,b,c,d,e,f,g,h)<i)){var k,l=1,m=l/2,n=l-m,o=.01;for(k=j(a,b,c,d,e,f,g,h,n);Q(k-i)>o;)m/=2,n+=(i>k?1:-1)*m,k=j(a,b,c,d,e,f,g,h,n);return n}}function l(a,b,c,d,e,f,g,h){if(!(O(a,c)<P(e,g)||P(a,c)>O(e,g)||O(b,d)<P(f,h)||P(b,d)>O(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(k){var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(!(n<+P(a,c).toFixed(2)||n>+O(a,c).toFixed(2)||n<+P(e,g).toFixed(2)||n>+O(e,g).toFixed(2)||o<+P(b,d).toFixed(2)||o>+O(b,d).toFixed(2)||o<+P(f,h).toFixed(2)||o>+O(f,h).toFixed(2)))return{x:l,y:m}}}}function m(a,b,d){var e=c.bezierBBox(a),f=c.bezierBBox(b);if(!c.isBBoxIntersect(e,f))return d?0:[];for(var g=j.apply(0,a),h=j.apply(0,b),i=O(~~(g/5),1),k=O(~~(h/5),1),m=[],n=[],o={},p=d?0:[],q=0;i+1>q;q++){var r=c.findDotsAtSegment.apply(c,a.concat(q/i));m.push({x:r.x,y:r.y,t:q/i})}for(q=0;k+1>q;q++)r=c.findDotsAtSegment.apply(c,b.concat(q/k)),n.push({x:r.x,y:r.y,t:q/k});for(q=0;i>q;q++)for(var s=0;k>s;s++){var t=m[q],u=m[q+1],v=n[s],w=n[s+1],x=Q(u.x-t.x)<.001?"y":"x",y=Q(w.x-v.x)<.001?"y":"x",z=l(t.x,t.y,u.x,u.y,v.x,v.y,w.x,w.y);if(z){if(o[z.x.toFixed(4)]==z.y.toFixed(4))continue;o[z.x.toFixed(4)]=z.y.toFixed(4);var A=t.t+Q((z[x]-t[x])/(u[x]-t[x]))*(u.t-t.t),B=v.t+Q((z[y]-v[y])/(w[y]-v[y]))*(w.t-v.t);A>=0&&1.001>=A&&B>=0&&1.001>=B&&(d?p++:p.push({x:z.x,y:z.y,t1:P(A,1),t2:P(B,1)}))}}return p}function n(a,b,d){a=c._path2curve(a),b=c._path2curve(b);for(var e,f,g,h,i,j,k,l,n,o,p=d?0:[],q=0,r=a.length;r>q;q++){var s=a[q];if("M"==s[0])e=i=s[1],f=j=s[2];else{"C"==s[0]?(n=[e,f].concat(s.slice(1)),e=n[6],f=n[7]):(n=[e,f,e,f,i,j,i,j],e=i,f=j);for(var t=0,u=b.length;u>t;t++){var v=b[t];if("M"==v[0])g=k=v[1],h=l=v[2];else{"C"==v[0]?(o=[g,h].concat(v.slice(1)),g=o[6],h=o[7]):(o=[g,h,g,h,k,l,k,l],g=k,h=l);var w=m(n,o,d);if(d)p+=w;else{for(var x=0,y=w.length;y>x;x++)w[x].segment1=q,w[x].segment2=t,w[x].bez1=n,w[x].bez2=o;p=p.concat(w)}}}}}return p}function o(a,b,c,d,e,f){null!=a?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function p(){return this.x+H+this.y+H+this.width+" × "+this.height}function q(a,b,c,d,e,f){function g(a){return((l*a+k)*a+j)*a}function h(a,b){var c=i(a,b);return((o*c+n)*c+m)*c}function i(a,b){var c,d,e,f,h,i;for(e=a,i=0;8>i;i++){if(f=g(e)-a,Q(f)<b)return e;if(h=(3*l*e+2*k)*e+j,Q(h)<1e-6)break;e-=f/h}if(c=0,d=1,e=a,c>e)return c;if(e>d)return d;for(;d>c;){if(f=g(e),Q(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}var j=3*b,k=3*(d-b)-j,l=1-j-k,m=3*c,n=3*(e-c)-m,o=1-m-n;return h(a,1/(200*f))}function r(a,b){var c=[],d={};if(this.ms=b,this.times=1,a){for(var e in a)a[z](e)&&(d[_(e)]=a[e],c.push(_(e)));c.sort(lb)}this.anim=d,this.top=c[c.length-1],this.percents=c}function s(a,d,e,f,g,h){e=_(e);var i,j,k,l,m,n,p=a.ms,r={},s={},t={};if(f)for(v=0,x=ic.length;x>v;v++){var u=ic[v];if(u.el.id==d.id&&u.anim==a){u.percent!=e?(ic.splice(v,1),k=1):j=u,d.attr(u.totalOrigin);break}}else f=+s;for(var v=0,x=a.percents.length;x>v;v++){if(a.percents[v]==e||a.percents[v]>f*a.top){e=a.percents[v],m=a.percents[v-1]||0,p=p/a.top*(e-m),l=a.percents[v+1],i=a.anim[e];break}f&&d.attr(a.anim[a.percents[v]])}if(i){if(j)j.initstatus=f,j.start=new Date-j.ms*f;else{for(var y in i)if(i[z](y)&&(db[z](y)||d.paper.customAttributes[z](y)))switch(r[y]=d.attr(y),null==r[y]&&(r[y]=cb[y]),s[y]=i[y],db[y]){case T:t[y]=(s[y]-r[y])/p;break;case"colour":r[y]=c.getRGB(r[y]);var A=c.getRGB(s[y]);t[y]={r:(A.r-r[y].r)/p,g:(A.g-r[y].g)/p,b:(A.b-r[y].b)/p};break;case"path":var B=Kb(r[y],s[y]),C=B[1];for(r[y]=B[0],t[y]=[],v=0,x=r[y].length;x>v;v++){t[y][v]=[0];for(var D=1,F=r[y][v].length;F>D;D++)t[y][v][D]=(C[v][D]-r[y][v][D])/p}break;case"transform":var G=d._,H=Pb(G[y],s[y]);if(H)for(r[y]=H.from,s[y]=H.to,t[y]=[],t[y].real=!0,v=0,x=r[y].length;x>v;v++)for(t[y][v]=[r[y][v][0]],D=1,F=r[y][v].length;F>D;D++)t[y][v][D]=(s[y][v][D]-r[y][v][D])/p;else{var K=d.matrix||new o,L={_:{transform:G.transform},getBBox:function(){return d.getBBox(1)}};r[y]=[K.a,K.b,K.c,K.d,K.e,K.f],Nb(L,s[y]),s[y]=L._.transform,t[y]=[(L.matrix.a-K.a)/p,(L.matrix.b-K.b)/p,(L.matrix.c-K.c)/p,(L.matrix.d-K.d)/p,(L.matrix.e-K.e)/p,(L.matrix.f-K.f)/p]}break;case"csv":var M=I(i[y])[J](w),N=I(r[y])[J](w);if("clip-rect"==y)for(r[y]=N,t[y]=[],v=N.length;v--;)t[y][v]=(M[v]-r[y][v])/p;s[y]=M;break;default:for(M=[][E](i[y]),N=[][E](r[y]),t[y]=[],v=d.paper.customAttributes[y].length;v--;)t[y][v]=((M[v]||0)-(N[v]||0))/p}var O=i.easing,P=c.easing_formulas[O];if(!P)if(P=I(O).match(Z),P&&5==P.length){var Q=P;P=function(a){return q(a,+Q[1],+Q[2],+Q[3],+Q[4],p)}}else P=nb;if(n=i.start||a.start||+new Date,u={anim:a,percent:e,timestamp:n,start:n+(a.del||0),status:0,initstatus:f||0,stop:!1,ms:p,easing:P,from:r,diff:t,to:s,el:d,callback:i.callback,prev:m,next:l,repeat:h||a.times,origin:d.attr(),totalOrigin:g},ic.push(u),f&&!j&&!k&&(u.stop=!0,u.start=new Date-p*f,1==ic.length))return kc();k&&(u.start=new Date-u.ms*f),1==ic.length&&jc(kc)}b("raphael.anim.start."+d.id,d,a)}}function t(a){for(var b=0;b<ic.length;b++)ic[b].el.paper==a&&ic.splice(b--,1)}c.version="2.1.2",c.eve=b;var u,v,w=/[, ]+/,x={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},y=/\{(\d+)\}/g,z="hasOwnProperty",A={doc:document,win:a},B={was:Object.prototype[z].call(A.win,"Raphael"),is:A.win.Raphael},C=function(){this.ca=this.customAttributes={}},D="apply",E="concat",F="ontouchstart"in A.win||A.win.DocumentTouch&&A.doc instanceof DocumentTouch,G="",H=" ",I=String,J="split",K="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[J](H),L={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},M=I.prototype.toLowerCase,N=Math,O=N.max,P=N.min,Q=N.abs,R=N.pow,S=N.PI,T="number",U="string",V="array",W=Object.prototype.toString,X=(c._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),Y={NaN:1,Infinity:1,"-Infinity":1},Z=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,$=N.round,_=parseFloat,ab=parseInt,bb=I.prototype.toUpperCase,cb=c._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},db=c._availableAnimAttrs={blur:T,"clip-rect":"csv",cx:T,cy:T,fill:"colour","fill-opacity":T,"font-size":T,height:T,opacity:T,path:"path",r:T,rx:T,ry:T,stroke:"colour","stroke-opacity":T,"stroke-width":T,transform:"transform",width:T,x:T,y:T},eb=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,fb={hs:1,rg:1},gb=/,?([achlmqrstvxz]),?/gi,hb=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,ib=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,jb=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,kb=(c._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,{}),lb=function(a,b){return _(a)-_(b)},mb=function(){},nb=function(a){return a},ob=c._rectPath=function(a,b,c,d,e){return e?[["M",a+e,b],["l",c-2*e,0],["a",e,e,0,0,1,e,e],["l",0,d-2*e],["a",e,e,0,0,1,-e,e],["l",2*e-c,0],["a",e,e,0,0,1,-e,-e],["l",0,2*e-d],["a",e,e,0,0,1,e,-e],["z"]]:[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},pb=function(a,b,c,d){return null==d&&(d=c),[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},qb=c._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return pb(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return pb(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return ob(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return ob(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return ob(b.x,b.y,b.width,b.height)},set:function(a){var b=a._getBBox();return ob(b.x,b.y,b.width,b.height)}},rb=c.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;for(a=Kb(a),e=0,g=a.length;g>e;e++)for(i=a[e],f=1,h=i.length;h>f;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d;return a};if(c._g=A,c.type=A.win.SVGAngle||A.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML","VML"==c.type){var sb,tb=A.doc.createElement("div");if(tb.innerHTML='<v:shape adj="1"/>',sb=tb.firstChild,sb.style.behavior="url(#default#VML)",!sb||"object"!=typeof sb.adj)return c.type=G;tb=null}c.svg=!(c.vml="VML"==c.type),c._Paper=C,c.fn=v=C.prototype=c.prototype,c._id=0,c._oid=0,c.is=function(a,b){return b=M.call(b),"finite"==b?!Y[z](+a):"array"==b?a instanceof Array:"null"==b&&null===a||b==typeof a&&null!==a||"object"==b&&a===Object(a)||"array"==b&&Array.isArray&&Array.isArray(a)||W.call(a).slice(8,-1).toLowerCase()==b},c.angle=function(a,b,d,e,f,g){if(null==f){var h=a-d,i=b-e;return h||i?(180+180*N.atan2(-i,-h)/S+360)%360:0}return c.angle(a,b,f,g)-c.angle(d,e,f,g)},c.rad=function(a){return a%360*S/180},c.deg=function(a){return 180*a/S%360},c.snapTo=function(a,b,d){if(d=c.is(d,"finite")?d:10,c.is(a,V)){for(var e=a.length;e--;)if(Q(a[e]-b)<=d)return a[e]}else{a=+a;var f=b%a;if(d>f)return b-f;if(f>a-d)return b-f+a}return b};c.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=16*N.random()|0,c="x"==a?b:3&b|8;return c.toString(16)});c.setWindow=function(a){b("raphael.setWindow",c,A.win,a),A.win=a,A.doc=A.win.document,c._engine.initWin&&c._engine.initWin(A.win)};var ub=function(a){if(c.vml){var b,d=/^\s+|\s+$/g;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),b=e.body}catch(g){b=createPopup().document.body}var h=b.createTextRange();ub=f(function(a){try{b.style.color=I(a).replace(d,G);var c=h.queryCommandValue("ForeColor");return c=(255&c)<<16|65280&c|(16711680&c)>>>16,"#"+("000000"+c.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=A.doc.createElement("i");i.title="Raphaël Colour Picker",i.style.display="none",A.doc.body.appendChild(i),ub=f(function(a){return i.style.color=a,A.doc.defaultView.getComputedStyle(i,G).getPropertyValue("color")})}return ub(a)},vb=function(){return"hsb("+[this.h,this.s,this.b]+")"},wb=function(){return"hsl("+[this.h,this.s,this.l]+")"},xb=function(){return this.hex},yb=function(a,b,d){if(null==b&&c.is(a,"object")&&"r"in a&&"g"in a&&"b"in a&&(d=a.b,b=a.g,a=a.r),null==b&&c.is(a,U)){var e=c.getRGB(a);a=e.r,b=e.g,d=e.b}return(a>1||b>1||d>1)&&(a/=255,b/=255,d/=255),[a,b,d]},zb=function(a,b,d,e){a*=255,b*=255,d*=255;var f={r:a,g:b,b:d,hex:c.rgb(a,b,d),toString:xb};return c.is(e,"finite")&&(f.opacity=e),f};c.color=function(a){var b;return c.is(a,"object")&&"h"in a&&"s"in a&&"b"in a?(b=c.hsb2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.hex=b.hex):c.is(a,"object")&&"h"in a&&"s"in a&&"l"in a?(b=c.hsl2rgb(a),a.r=b.r,a.g=b.g,a.b=b.b,a.hex=b.hex):(c.is(a,"string")&&(a=c.getRGB(a)),c.is(a,"object")&&"r"in a&&"g"in a&&"b"in a?(b=c.rgb2hsl(a),a.h=b.h,a.s=b.s,a.l=b.l,b=c.rgb2hsb(a),a.v=b.b):(a={hex:"none"},a.r=a.g=a.b=a.h=a.s=a.v=a.l=-1)),a.toString=xb,a},c.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;return a=a%360/60,i=c*b,h=i*(1-Q(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a],zb(e,f,g,d)},c.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h),(a>1||b>1||c>1)&&(a/=360,b/=100,c/=100),a*=360;var e,f,g,h,i;return a=a%360/60,i=2*b*(.5>c?c:1-c),h=i*(1-Q(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a],zb(e,f,g,d)},c.rgb2hsb=function(a,b,c){c=yb(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;return f=O(a,b,c),g=f-P(a,b,c),d=0==g?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=0==g?0:g/f,{h:d,s:e,b:f,toString:vb}},c.rgb2hsl=function(a,b,c){c=yb(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;return g=O(a,b,c),h=P(a,b,c),i=g-h,d=0==i?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=0==i?0:.5>f?i/(2*f):i/(2-2*f),{h:d,s:e,l:f,toString:wb}},c._path2string=function(){return this.join(",").replace(gb,"$1")};c._preload=function(a,b){var c=A.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,A.doc.body.removeChild(this)},c.onerror=function(){A.doc.body.removeChild(this)},A.doc.body.appendChild(c),c.src=a};c.getRGB=f(function(a){if(!a||(a=I(a)).indexOf("-")+1)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:g};if("none"==a)return{r:-1,g:-1,b:-1,hex:"none",toString:g};!(fb[z](a.toLowerCase().substring(0,2))||"#"==a.charAt())&&(a=ub(a));var b,d,e,f,h,i,j=a.match(X);return j?(j[2]&&(e=ab(j[2].substring(5),16),d=ab(j[2].substring(3,5),16),b=ab(j[2].substring(1,3),16)),j[3]&&(e=ab((h=j[3].charAt(3))+h,16),d=ab((h=j[3].charAt(2))+h,16),b=ab((h=j[3].charAt(1))+h,16)),j[4]&&(i=j[4][J](eb),b=_(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),d=_(i[1]),"%"==i[1].slice(-1)&&(d*=2.55),e=_(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),"rgba"==j[1].toLowerCase().slice(0,4)&&(f=_(i[3])),i[3]&&"%"==i[3].slice(-1)&&(f/=100)),j[5]?(i=j[5][J](eb),b=_(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),d=_(i[1]),"%"==i[1].slice(-1)&&(d*=2.55),e=_(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),("deg"==i[0].slice(-3)||"°"==i[0].slice(-1))&&(b/=360),"hsba"==j[1].toLowerCase().slice(0,4)&&(f=_(i[3])),i[3]&&"%"==i[3].slice(-1)&&(f/=100),c.hsb2rgb(b,d,e,f)):j[6]?(i=j[6][J](eb),b=_(i[0]),"%"==i[0].slice(-1)&&(b*=2.55),d=_(i[1]),"%"==i[1].slice(-1)&&(d*=2.55),e=_(i[2]),"%"==i[2].slice(-1)&&(e*=2.55),("deg"==i[0].slice(-3)||"°"==i[0].slice(-1))&&(b/=360),"hsla"==j[1].toLowerCase().slice(0,4)&&(f=_(i[3])),i[3]&&"%"==i[3].slice(-1)&&(f/=100),c.hsl2rgb(b,d,e,f)):(j={r:b,g:d,b:e,toString:g},j.hex="#"+(16777216|e|d<<8|b<<16).toString(16).slice(1),c.is(f,"finite")&&(j.opacity=f),j)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:g}},c),c.hsb=f(function(a,b,d){return c.hsb2rgb(a,b,d).hex}),c.hsl=f(function(a,b,d){return c.hsl2rgb(a,b,d).hex}),c.rgb=f(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),c.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);return b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b})),c.hex},c.getColor.reset=function(){delete this.start},c.parsePathString=function(a){if(!a)return null;var b=Ab(a);if(b.arr)return Cb(b.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];return c.is(a,V)&&c.is(a[0],V)&&(e=Cb(a)),e.length||I(a).replace(hb,function(a,b,c){var f=[],g=b.toLowerCase();if(c.replace(jb,function(a,b){b&&f.push(+b)}),"m"==g&&f.length>2&&(e.push([b][E](f.splice(0,2))),g="l",b="m"==b?"l":"L"),"r"==g)e.push([b][E](f));else for(;f.length>=d[g]&&(e.push([b][E](f.splice(0,d[g]))),d[g]););}),e.toString=c._path2string,b.arr=Cb(e),e},c.parseTransformString=f(function(a){if(!a)return null;var b=[];return c.is(a,V)&&c.is(a[0],V)&&(b=Cb(a)),b.length||I(a).replace(ib,function(a,c,d){{var e=[];M.call(c)}d.replace(jb,function(a,b){b&&e.push(+b)}),b.push([c][E](e))}),b.toString=c._path2string,b});var Ab=function(a){var b=Ab.ps=Ab.ps||{};return b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[z](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])}),b[a]};c.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=R(j,3),l=R(j,2),m=i*i,n=m*i,o=k*a+3*l*i*c+3*j*i*i*e+n*g,p=k*b+3*l*i*d+3*j*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,w=j*e+i*g,x=j*f+i*h,y=90-180*N.atan2(q-s,r-t)/S;return(q>s||t>r)&&(y+=180),{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:w,y:x},alpha:y}},c.bezierBBox=function(a,b,d,e,f,g,h,i){c.is(a,"array")||(a=[a,b,d,e,f,g,h,i]);var j=Jb.apply(null,a);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},c.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},c.isBBoxIntersect=function(a,b){var d=c.isPointInsideBBox;return d(b,a.x,a.y)||d(b,a.x2,a.y)||d(b,a.x,a.y2)||d(b,a.x2,a.y2)||d(a,b.x,b.y)||d(a,b.x2,b.y)||d(a,b.x,b.y2)||d(a,b.x2,b.y2)||(a.x<b.x2&&a.x>b.x||b.x<a.x2&&b.x>a.x)&&(a.y<b.y2&&a.y>b.y||b.y<a.y2&&b.y>a.y)},c.pathIntersection=function(a,b){return n(a,b)},c.pathIntersectionNumber=function(a,b){return n(a,b,1)},c.isPointInsidePath=function(a,b,d){var e=c.pathBBox(a);return c.isPointInsideBBox(e,b,d)&&n(a,[["M",b,d],["H",e.x2+10]],1)%2==1},c._removedFactory=function(a){return function(){b("raphael.log",null,"Raphaël: you are calling to method “"+a+"” of removed object",a)}};var Bb=c.pathBBox=function(a){var b=Ab(a);if(b.bbox)return d(b.bbox);if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=Kb(a);for(var c,e=0,f=0,g=[],h=[],i=0,j=a.length;j>i;i++)if(c=a[i],"M"==c[0])e=c[1],f=c[2],g.push(e),h.push(f);else{var k=Jb(e,f,c[1],c[2],c[3],c[4],c[5],c[6]);g=g[E](k.min.x,k.max.x),h=h[E](k.min.y,k.max.y),e=c[5],f=c[6]}var l=P[D](0,g),m=P[D](0,h),n=O[D](0,g),o=O[D](0,h),p=n-l,q=o-m,r={x:l,y:m,x2:n,y2:o,width:p,height:q,cx:l+p/2,cy:m+q/2};return b.bbox=d(r),r},Cb=function(a){var b=d(a);return b.toString=c._path2string,b},Db=c._pathToRelative=function(a){var b=Ab(a);if(b.rel)return Cb(b.rel);c.is(a,V)&&c.is(a&&a[0],V)||(a=c.parsePathString(a));var d=[],e=0,f=0,g=0,h=0,i=0;"M"==a[0][0]&&(e=a[0][1],f=a[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=a.length;k>j;j++){var l=d[j]=[],m=a[j];if(m[0]!=M.call(m[0]))switch(l[0]=M.call(m[0]),l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;o>n;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}else{l=d[j]=[],"m"==m[0]&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;q>p;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}return d.toString=c._path2string,b.rel=Cb(d),d},Eb=c._pathToAbsolute=function(a){var b=Ab(a);if(b.abs)return Cb(b.abs);if(c.is(a,V)&&c.is(a&&a[0],V)||(a=c.parsePathString(a)),!a||!a.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,i=0,j=0;"M"==a[0][0]&&(e=+a[0][1],f=+a[0][2],g=e,i=f,j++,d[0]=["M",e,f]);for(var k,l,m=3==a.length&&"M"==a[0][0]&&"R"==a[1][0].toUpperCase()&&"Z"==a[2][0].toUpperCase(),n=j,o=a.length;o>n;n++){if(d.push(k=[]),l=a[n],l[0]!=bb.call(l[0]))switch(k[0]=bb.call(l[0]),k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":for(var p=[e,f][E](l.slice(1)),q=2,r=p.length;r>q;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[E](h(p,m));break;case"M":g=+l[1]+e,i=+l[2]+f;default:for(q=1,r=l.length;r>q;q++)k[q]=+l[q]+(q%2?e:f)}else if("R"==l[0])p=[e,f][E](l.slice(1)),d.pop(),d=d[E](h(p,m)),k=["R"][E](l.slice(-2));else for(var s=0,t=l.length;t>s;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=i;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],i=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}return d.toString=c._path2string,b.abs=Cb(d),d},Fb=function(a,b,c,d){return[a,b,c,d,c,d]},Gb=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},Hb=function(a,b,c,d,e,g,h,i,j,k){var l,m=120*S/180,n=S/180*(+e||0),o=[],p=f(function(a,b,c){var d=a*N.cos(c)-b*N.sin(c),e=a*N.sin(c)+b*N.cos(c);return{x:d,y:e}});if(k)y=k[0],z=k[1],w=k[2],x=k[3];else{l=p(a,b,-n),a=l.x,b=l.y,l=p(i,j,-n),i=l.x,j=l.y;var q=(N.cos(S/180*e),N.sin(S/180*e),(a-i)/2),r=(b-j)/2,s=q*q/(c*c)+r*r/(d*d);s>1&&(s=N.sqrt(s),c=s*c,d=s*d);var t=c*c,u=d*d,v=(g==h?-1:1)*N.sqrt(Q((t*u-t*r*r-u*q*q)/(t*r*r+u*q*q))),w=v*c*r/d+(a+i)/2,x=v*-d*q/c+(b+j)/2,y=N.asin(((b-x)/d).toFixed(9)),z=N.asin(((j-x)/d).toFixed(9));y=w>a?S-y:y,z=w>i?S-z:z,0>y&&(y=2*S+y),0>z&&(z=2*S+z),h&&y>z&&(y-=2*S),!h&&z>y&&(z-=2*S)}var A=z-y;if(Q(A)>m){var B=z,C=i,D=j;z=y+m*(h&&z>y?1:-1),i=w+c*N.cos(z),j=x+d*N.sin(z),o=Hb(i,j,c,d,e,0,h,C,D,[z,B,w,x])}A=z-y;var F=N.cos(y),G=N.sin(y),H=N.cos(z),I=N.sin(z),K=N.tan(A/4),L=4/3*c*K,M=4/3*d*K,O=[a,b],P=[a+L*G,b-M*F],R=[i+L*I,j-M*H],T=[i,j];if(P[0]=2*O[0]-P[0],P[1]=2*O[1]-P[1],k)return[P,R,T][E](o);o=[P,R,T][E](o).join()[J](",");for(var U=[],V=0,W=o.length;W>V;V++)U[V]=V%2?p(o[V-1],o[V],n).y:p(o[V],o[V+1],n).x;return U},Ib=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:R(j,3)*a+3*R(j,2)*i*c+3*j*i*i*e+R(i,3)*g,y:R(j,3)*b+3*R(j,2)*i*d+3*j*i*i*f+R(i,3)*h}},Jb=f(function(a,b,c,d,e,f,g,h){var i,j=e-2*c+a-(g-2*e+c),k=2*(c-a)-2*(e-c),l=a-c,m=(-k+N.sqrt(k*k-4*j*l))/2/j,n=(-k-N.sqrt(k*k-4*j*l))/2/j,o=[b,h],p=[a,g];return Q(m)>"1e12"&&(m=.5),Q(n)>"1e12"&&(n=.5),m>0&&1>m&&(i=Ib(a,b,c,d,e,f,g,h,m),p.push(i.x),o.push(i.y)),n>0&&1>n&&(i=Ib(a,b,c,d,e,f,g,h,n),p.push(i.x),o.push(i.y)),j=f-2*d+b-(h-2*f+d),k=2*(d-b)-2*(f-d),l=b-d,m=(-k+N.sqrt(k*k-4*j*l))/2/j,n=(-k-N.sqrt(k*k-4*j*l))/2/j,Q(m)>"1e12"&&(m=.5),Q(n)>"1e12"&&(n=.5),m>0&&1>m&&(i=Ib(a,b,c,d,e,f,g,h,m),p.push(i.x),o.push(i.y)),n>0&&1>n&&(i=Ib(a,b,c,d,e,f,g,h,n),p.push(i.x),o.push(i.y)),{min:{x:P[D](0,p),y:P[D](0,o)},max:{x:O[D](0,p),y:O[D](0,o)}}}),Kb=c._path2curve=f(function(a,b){var c=!b&&Ab(a);if(!b&&c.curve)return Cb(c.curve);for(var d=Eb(a),e=b&&Eb(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=(function(a,b,c){var d,e,f={T:1,Q:1};if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];switch(!(a[0]in f)&&(b.qx=b.qy=null),a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][E](Hb[D](0,[b.x,b.y][E](a.slice(1))));break;case"S":"C"==c||"S"==c?(d=2*b.x-b.bx,e=2*b.y-b.by):(d=b.x,e=b.y),a=["C",d,e][E](a.slice(1));break;case"T":"Q"==c||"T"==c?(b.qx=2*b.x-b.qx,b.qy=2*b.y-b.qy):(b.qx=b.x,b.qy=b.y),a=["C"][E](Gb(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][E](Gb(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][E](Fb(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][E](Fb(b.x,b.y,a[1],b.y));break;case"V":a=["C"][E](Fb(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][E](Fb(b.x,b.y,b.X,b.Y))}return a}),i=function(a,b){if(a[b].length>7){a[b].shift();for(var c=a[b];c.length;)a.splice(b++,0,["C"][E](c.splice(0,6)));a.splice(b,1),l=O(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&"M"==a[g][0]&&"M"!=b[g][0]&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=O(d.length,e&&e.length||0))},k=0,l=O(d.length,e&&e.length||0);l>k;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var m=d[k],n=e&&e[k],o=m.length,p=e&&n.length;f.x=m[o-2],f.y=m[o-1],f.bx=_(m[o-4])||f.x,f.by=_(m[o-3])||f.y,g.bx=e&&(_(n[p-4])||g.x),g.by=e&&(_(n[p-3])||g.y),g.x=e&&n[p-2],g.y=e&&n[p-1]}return e||(c.curve=Cb(d)),e?[d,e]:d},null,Cb),Lb=(c._parseDots=f(function(a){for(var b=[],d=0,e=a.length;e>d;d++){var f={},g=a[d].match(/^([^:]*):?([\d\.]*)/);if(f.color=c.getRGB(g[1]),f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),b.push(f)}for(d=1,e=b.length-1;e>d;d++)if(!b[d].offset){for(var h=_(b[d-1].offset||0),i=0,j=d+1;e>j;j++)if(b[j].offset){i=b[j].offset;break}i||(i=100,j=e),i=_(i);for(var k=(i-h)/(j-d+1);j>d;d++)h+=k,b[d].offset=h+"%"}return b}),c._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)}),Mb=(c._tofront=function(a,b){b.top!==a&&(Lb(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},c._toback=function(a,b){b.bottom!==a&&(Lb(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},c._insertafter=function(a,b,c){Lb(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},c._insertbefore=function(a,b,c){Lb(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},c.toMatrix=function(a,b){var c=Bb(a),d={_:{transform:G},getBBox:function(){return c}};return Nb(d,b),d.matrix}),Nb=(c.transformPath=function(a,b){return rb(a,Mb(a,b))},c._extractTransform=function(a,b){if(null==b)return a._.transform;b=I(b).replace(/\.{3}|\u2026/g,a._.transform||G);var d=c.parseTransformString(b),e=0,f=0,g=0,h=1,i=1,j=a._,k=new o;if(j.transform=d||[],d)for(var l=0,m=d.length;m>l;l++){var n,p,q,r,s,t=d[l],u=t.length,v=I(t[0]).toLowerCase(),w=t[0]!=v,x=w?k.invert():0;"t"==v&&3==u?w?(n=x.x(0,0),p=x.y(0,0),q=x.x(t[1],t[2]),r=x.y(t[1],t[2]),k.translate(q-n,r-p)):k.translate(t[1],t[2]):"r"==v?2==u?(s=s||a.getBBox(1),k.rotate(t[1],s.x+s.width/2,s.y+s.height/2),e+=t[1]):4==u&&(w?(q=x.x(t[2],t[3]),r=x.y(t[2],t[3]),k.rotate(t[1],q,r)):k.rotate(t[1],t[2],t[3]),e+=t[1]):"s"==v?2==u||3==u?(s=s||a.getBBox(1),k.scale(t[1],t[u-1],s.x+s.width/2,s.y+s.height/2),h*=t[1],i*=t[u-1]):5==u&&(w?(q=x.x(t[3],t[4]),r=x.y(t[3],t[4]),k.scale(t[1],t[2],q,r)):k.scale(t[1],t[2],t[3],t[4]),h*=t[1],i*=t[2]):"m"==v&&7==u&&k.add(t[1],t[2],t[3],t[4],t[5],t[6]),j.dirtyT=1,a.matrix=k}a.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,1==h&&1==i&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1}),Ob=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return 4==a.length?[b,0,a[2],a[3]]:[b,0];case"s":return 5==a.length?[b,1,1,a[3],a[4]]:3==a.length?[b,1,1]:[b,1]}},Pb=c._equaliseTransform=function(a,b){b=I(b).replace(/\.{3}|\u2026/g,a),a=c.parseTransformString(a)||[],b=c.parseTransformString(b)||[];for(var d,e,f,g,h=O(a.length,b.length),i=[],j=[],k=0;h>k;k++){if(f=a[k]||Ob(b[k]),g=b[k]||Ob(f),f[0]!=g[0]||"r"==f[0].toLowerCase()&&(f[2]!=g[2]||f[3]!=g[3])||"s"==f[0].toLowerCase()&&(f[3]!=g[3]||f[4]!=g[4]))return;for(i[k]=[],j[k]=[],d=0,e=O(f.length,g.length);e>d;d++)d in f&&(i[k][d]=f[d]),d in g&&(j[k][d]=g[d])
}return{from:i,to:j}};c._getContainer=function(a,b,d,e){var f;return f=null!=e||c.is(a,"object")?a:A.doc.getElementById(a),null!=f?f.tagName?null==b?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:b,height:d}:{container:1,x:a,y:b,width:d,height:e}:void 0},c.pathToRelative=Db,c._engine={},c.path2curve=Kb,c.matrix=function(a,b,c,d,e,f){return new o(a,b,c,d,e,f)},function(a){function b(a){return a[0]*a[0]+a[1]*a[1]}function d(a){var c=N.sqrt(b(a));a[0]&&(a[0]/=c),a[1]&&(a[1]/=c)}a.add=function(a,b,c,d,e,f){var g,h,i,j,k=[[],[],[]],l=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],m=[[a,c,e],[b,d,f],[0,0,1]];for(a&&a instanceof o&&(m=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]),g=0;3>g;g++)for(h=0;3>h;h++){for(j=0,i=0;3>i;i++)j+=l[g][i]*m[i][h];k[g][h]=j}this.a=k[0][0],this.b=k[1][0],this.c=k[0][1],this.d=k[1][1],this.e=k[0][2],this.f=k[1][2]},a.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new o(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},a.clone=function(){return new o(this.a,this.b,this.c,this.d,this.e,this.f)},a.translate=function(a,b){this.add(1,0,0,1,a,b)},a.scale=function(a,b,c,d){null==b&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},a.rotate=function(a,b,d){a=c.rad(a),b=b||0,d=d||0;var e=+N.cos(a).toFixed(9),f=+N.sin(a).toFixed(9);this.add(e,f,-f,e,b,d),this.add(1,0,0,1,-b,-d)},a.x=function(a,b){return a*this.a+b*this.c+this.e},a.y=function(a,b){return a*this.b+b*this.d+this.f},a.get=function(a){return+this[I.fromCharCode(97+a)].toFixed(4)},a.toString=function(){return c.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},a.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},a.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},a.split=function(){var a={};a.dx=this.e,a.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];a.scalex=N.sqrt(b(e[0])),d(e[0]),a.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*a.shear,e[1][1]-e[0][1]*a.shear],a.scaley=N.sqrt(b(e[1])),d(e[1]),a.shear/=a.scaley;var f=-e[0][1],g=e[1][1];return 0>g?(a.rotate=c.deg(N.acos(g)),0>f&&(a.rotate=360-a.rotate)):a.rotate=c.deg(N.asin(f)),a.isSimple=!(+a.shear.toFixed(9)||a.scalex.toFixed(9)!=a.scaley.toFixed(9)&&a.rotate),a.isSuperSimple=!+a.shear.toFixed(9)&&a.scalex.toFixed(9)==a.scaley.toFixed(9)&&!a.rotate,a.noRotation=!+a.shear.toFixed(9)&&!a.rotate,a},a.toTransformString=function(a){var b=a||this[J]();return b.isSimple?(b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4),(b.dx||b.dy?"t"+[b.dx,b.dy]:G)+(1!=b.scalex||1!=b.scaley?"s"+[b.scalex,b.scaley,0,0]:G)+(b.rotate?"r"+[b.rotate,0,0]:G)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(o.prototype);var Qb=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);v.safari="Apple Computer, Inc."==navigator.vendor&&(Qb&&Qb[1]<4||"iP"==navigator.platform.slice(0,2))||"Google Inc."==navigator.vendor&&Qb&&Qb[1]<8?function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:mb;for(var Rb=function(){this.returnValue=!1},Sb=function(){return this.originalEvent.preventDefault()},Tb=function(){this.cancelBubble=!0},Ub=function(){return this.originalEvent.stopPropagation()},Vb=function(a){var b=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,c=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft;return{x:a.clientX+c,y:a.clientY+b}},Wb=function(){return A.doc.addEventListener?function(a,b,c,d){var e=function(a){var b=Vb(a);return c.call(d,a,b.x,b.y)};if(a.addEventListener(b,e,!1),F&&L[b]){var f=function(b){for(var e=Vb(b),f=b,g=0,h=b.targetTouches&&b.targetTouches.length;h>g;g++)if(b.targetTouches[g].target==a){b=b.targetTouches[g],b.originalEvent=f,b.preventDefault=Sb,b.stopPropagation=Ub;break}return c.call(d,b,e.x,e.y)};a.addEventListener(L[b],f,!1)}return function(){return a.removeEventListener(b,e,!1),F&&L[b]&&a.removeEventListener(L[b],e,!1),!0}}:A.doc.attachEvent?function(a,b,c,d){var e=function(a){a=a||A.win.event;var b=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,e=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;return a.preventDefault=a.preventDefault||Rb,a.stopPropagation=a.stopPropagation||Tb,c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){return a.detachEvent("on"+b,e),!0};return f}:void 0}(),Xb=[],Yb=function(a){for(var c,d=a.clientX,e=a.clientY,f=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,g=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft,h=Xb.length;h--;){if(c=Xb[h],F&&a.touches){for(var i,j=a.touches.length;j--;)if(i=a.touches[j],i.identifier==c.el._drag.id){d=i.clientX,e=i.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}else a.preventDefault();var k,l=c.el.node,m=l.nextSibling,n=l.parentNode,o=l.style.display;A.win.opera&&n.removeChild(l),l.style.display="none",k=c.el.paper.getElementByPoint(d,e),l.style.display=o,A.win.opera&&(m?n.insertBefore(l,m):n.appendChild(l)),k&&b("raphael.drag.over."+c.el.id,c.el,k),d+=g,e+=f,b("raphael.drag.move."+c.el.id,c.move_scope||c.el,d-c.el._drag.x,e-c.el._drag.y,d,e,a)}},Zb=function(a){c.unmousemove(Yb).unmouseup(Zb);for(var d,e=Xb.length;e--;)d=Xb[e],d.el._drag={},b("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,a);Xb=[]},$b=c.el={},_b=K.length;_b--;)!function(a){c[a]=$b[a]=function(b,d){return c.is(b,"function")&&(this.events=this.events||[],this.events.push({name:a,f:b,unbind:Wb(this.shape||this.node||A.doc,a,b,d||this)})),this},c["un"+a]=$b["un"+a]=function(b){for(var d=this.events||[],e=d.length;e--;)d[e].name!=a||!c.is(b,"undefined")&&d[e].f!=b||(d[e].unbind(),d.splice(e,1),!d.length&&delete this.events);return this}}(K[_b]);$b.data=function(a,d){var e=kb[this.id]=kb[this.id]||{};if(0==arguments.length)return e;if(1==arguments.length){if(c.is(a,"object")){for(var f in a)a[z](f)&&this.data(f,a[f]);return this}return b("raphael.data.get."+this.id,this,e[a],a),e[a]}return e[a]=d,b("raphael.data.set."+this.id,this,d,a),this},$b.removeData=function(a){return null==a?kb[this.id]={}:kb[this.id]&&delete kb[this.id][a],this},$b.getData=function(){return d(kb[this.id]||{})},$b.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},$b.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var ac=[];$b.drag=function(a,d,e,f,g,h){function i(i){(i.originalEvent||i).preventDefault();var j=i.clientX,k=i.clientY,l=A.doc.documentElement.scrollTop||A.doc.body.scrollTop,m=A.doc.documentElement.scrollLeft||A.doc.body.scrollLeft;if(this._drag.id=i.identifier,F&&i.touches)for(var n,o=i.touches.length;o--;)if(n=i.touches[o],this._drag.id=n.identifier,n.identifier==this._drag.id){j=n.clientX,k=n.clientY;break}this._drag.x=j+m,this._drag.y=k+l,!Xb.length&&c.mousemove(Yb).mouseup(Zb),Xb.push({el:this,move_scope:f,start_scope:g,end_scope:h}),d&&b.on("raphael.drag.start."+this.id,d),a&&b.on("raphael.drag.move."+this.id,a),e&&b.on("raphael.drag.end."+this.id,e),b("raphael.drag.start."+this.id,g||f||this,i.clientX+m,i.clientY+l,i)}return this._drag={},ac.push({el:this,start:i}),this.mousedown(i),this},$b.onDragOver=function(a){a?b.on("raphael.drag.over."+this.id,a):b.unbind("raphael.drag.over."+this.id)},$b.undrag=function(){for(var a=ac.length;a--;)ac[a].el==this&&(this.unmousedown(ac[a].start),ac.splice(a,1),b.unbind("raphael.drag.*."+this.id));!ac.length&&c.unmousemove(Yb).unmouseup(Zb),Xb=[]},v.circle=function(a,b,d){var e=c._engine.circle(this,a||0,b||0,d||0);return this.__set__&&this.__set__.push(e),e},v.rect=function(a,b,d,e,f){var g=c._engine.rect(this,a||0,b||0,d||0,e||0,f||0);return this.__set__&&this.__set__.push(g),g},v.ellipse=function(a,b,d,e){var f=c._engine.ellipse(this,a||0,b||0,d||0,e||0);return this.__set__&&this.__set__.push(f),f},v.path=function(a){a&&!c.is(a,U)&&!c.is(a[0],V)&&(a+=G);var b=c._engine.path(c.format[D](c,arguments),this);return this.__set__&&this.__set__.push(b),b},v.image=function(a,b,d,e,f){var g=c._engine.image(this,a||"about:blank",b||0,d||0,e||0,f||0);return this.__set__&&this.__set__.push(g),g},v.text=function(a,b,d){var e=c._engine.text(this,a||0,b||0,I(d));return this.__set__&&this.__set__.push(e),e},v.set=function(a){!c.is(a,"array")&&(a=Array.prototype.splice.call(arguments,0,arguments.length));var b=new mc(a);return this.__set__&&this.__set__.push(b),b.paper=this,b.type="set",b},v.setStart=function(a){this.__set__=a||this.set()},v.setFinish=function(){var a=this.__set__;return delete this.__set__,a},v.setSize=function(a,b){return c._engine.setSize.call(this,a,b)},v.setViewBox=function(a,b,d,e,f){return c._engine.setViewBox.call(this,a,b,d,e,f)},v.top=v.bottom=null,v.raphael=c;var bc=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,h=b.top+(A.win.pageYOffset||e.scrollTop||d.scrollTop)-f,i=b.left+(A.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:h,x:i}};v.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=A.doc.elementFromPoint(a,b);if(A.win.opera&&"svg"==e.tagName){var f=bc(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var h=d.getIntersectionList(g,null);h.length&&(e=h[h.length-1])}if(!e)return null;for(;e.parentNode&&e!=d.parentNode&&!e.raphael;)e=e.parentNode;return e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null},v.getElementsByBBox=function(a){var b=this.set();return this.forEach(function(d){c.isBBoxIntersect(d.getBBox(),a)&&b.push(d)}),b},v.getById=function(a){for(var b=this.bottom;b;){if(b.id==a)return b;b=b.next}return null},v.forEach=function(a,b){for(var c=this.bottom;c;){if(a.call(b,c)===!1)return this;c=c.next}return this},v.getElementsByPoint=function(a,b){var c=this.set();return this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)}),c},$b.isPointInside=function(a,b){var d=this.realPath=qb[this.type](this);return this.attr("transform")&&this.attr("transform").length&&(d=c.transformPath(d,this.attr("transform"))),c.isPointInsidePath(d,a,b)},$b.getBBox=function(a){if(this.removed)return{};var b=this._;return a?((b.dirty||!b.bboxwt)&&(this.realPath=qb[this.type](this),b.bboxwt=Bb(this.realPath),b.bboxwt.toString=p,b.dirty=0),b.bboxwt):((b.dirty||b.dirtyT||!b.bbox)&&((b.dirty||!this.realPath)&&(b.bboxwt=0,this.realPath=qb[this.type](this)),b.bbox=Bb(rb(this.realPath,this.matrix)),b.bbox.toString=p,b.dirty=b.dirtyT=0),b.bbox)},$b.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());return this.__set__&&this.__set__.push(a),a},$b.glow=function(a){if("text"==this.type)return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||qb[this.type](this);f=this.matrix?rb(f,this.matrix):f;for(var g=1;c+1>g;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cc=function(a,b,d,e,f,g,h,i,l){return null==l?j(a,b,d,e,f,g,h,i):c.findDotsAtSegment(a,b,d,e,f,g,h,i,k(a,b,d,e,f,g,h,i,l))},dc=function(a,b){return function(d,e,f){d=Kb(d);for(var g,h,i,j,k,l="",m={},n=0,o=0,p=d.length;p>o;o++){if(i=d[o],"M"==i[0])g=+i[1],h=+i[2];else{if(j=cc(g,h,i[1],i[2],i[3],i[4],i[5],i[6]),n+j>e){if(b&&!m.start){if(k=cc(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),l+=["C"+k.start.x,k.start.y,k.m.x,k.m.y,k.x,k.y],f)return l;m.start=l,l=["M"+k.x,k.y+"C"+k.n.x,k.n.y,k.end.x,k.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!a&&!b)return k=cc(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),{x:k.x,y:k.y,alpha:k.alpha}}n+=j,g=+i[5],h=+i[6]}l+=i.shift()+i}return m.end=l,k=a?n:b?m:c.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),k.alpha&&(k={x:k.x,y:k.y,alpha:k.alpha}),k}},ec=dc(1),fc=dc(),gc=dc(0,1);c.getTotalLength=ec,c.getPointAtLength=fc,c.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return gc(a,b).end;var d=gc(a,c,1);return b?gc(d,b).end:d},$b.getTotalLength=function(){var a=this.getPath();if(a)return this.node.getTotalLength?this.node.getTotalLength():ec(a)},$b.getPointAtLength=function(a){var b=this.getPath();if(b)return fc(b,a)},$b.getPath=function(){var a,b=c._getPath[this.type];if("text"!=this.type&&"set"!=this.type)return b&&(a=b(this)),a},$b.getSubpath=function(a,b){var d=this.getPath();if(d)return c.getSubpath(d,a,b)};var hc=c.easing_formulas={linear:function(a){return a},"<":function(a){return R(a,1.7)},">":function(a){return R(a,.48)},"<>":function(a){var b=.48-a/1.04,c=N.sqrt(.1734+b*b),d=c-b,e=R(Q(d),1/3)*(0>d?-1:1),f=-c-b,g=R(Q(f),1/3)*(0>f?-1:1),h=e+g+.5;return 3*(1-h)*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a-=1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){return a==!!a?a:R(2,-10*a)*N.sin(2*(a-.075)*S/.3)+1},bounce:function(a){var b,c=7.5625,d=2.75;return 1/d>a?b=c*a*a:2/d>a?(a-=1.5/d,b=c*a*a+.75):2.5/d>a?(a-=2.25/d,b=c*a*a+.9375):(a-=2.625/d,b=c*a*a+.984375),b}};hc.easeIn=hc["ease-in"]=hc["<"],hc.easeOut=hc["ease-out"]=hc[">"],hc.easeInOut=hc["ease-in-out"]=hc["<>"],hc["back-in"]=hc.backIn,hc["back-out"]=hc.backOut;var ic=[],jc=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(a){setTimeout(a,16)},kc=function(){for(var a=+new Date,d=0;d<ic.length;d++){var e=ic[d];if(!e.el.removed&&!e.paused){var f,g,h=a-e.start,i=e.ms,j=e.easing,k=e.from,l=e.diff,m=e.to,n=(e.t,e.el),o={},p={};if(e.initstatus?(h=(e.initstatus*e.anim.top-e.prev)/(e.percent-e.prev)*i,e.status=e.initstatus,delete e.initstatus,e.stop&&ic.splice(d--,1)):e.status=(e.prev+(e.percent-e.prev)*(h/i))/e.anim.top,!(0>h))if(i>h){var q=j(h/i);for(var r in k)if(k[z](r)){switch(db[r]){case T:f=+k[r]+q*i*l[r];break;case"colour":f="rgb("+[lc($(k[r].r+q*i*l[r].r)),lc($(k[r].g+q*i*l[r].g)),lc($(k[r].b+q*i*l[r].b))].join(",")+")";break;case"path":f=[];for(var t=0,u=k[r].length;u>t;t++){f[t]=[k[r][t][0]];for(var v=1,w=k[r][t].length;w>v;v++)f[t][v]=+k[r][t][v]+q*i*l[r][t][v];f[t]=f[t].join(H)}f=f.join(H);break;case"transform":if(l[r].real)for(f=[],t=0,u=k[r].length;u>t;t++)for(f[t]=[k[r][t][0]],v=1,w=k[r][t].length;w>v;v++)f[t][v]=k[r][t][v]+q*i*l[r][t][v];else{var x=function(a){return+k[r][a]+q*i*l[r][a]};f=[["m",x(0),x(1),x(2),x(3),x(4),x(5)]]}break;case"csv":if("clip-rect"==r)for(f=[],t=4;t--;)f[t]=+k[r][t]+q*i*l[r][t];break;default:var y=[][E](k[r]);for(f=[],t=n.paper.customAttributes[r].length;t--;)f[t]=+y[t]+q*i*l[r][t]}o[r]=f}n.attr(o),function(a,c,d){setTimeout(function(){b("raphael.anim.frame."+a,c,d)})}(n.id,n,e.anim)}else{if(function(a,d,e){setTimeout(function(){b("raphael.anim.frame."+d.id,d,e),b("raphael.anim.finish."+d.id,d,e),c.is(a,"function")&&a.call(d)})}(e.callback,n,e.anim),n.attr(m),ic.splice(d--,1),e.repeat>1&&!e.next){for(g in m)m[z](g)&&(p[g]=e.totalOrigin[g]);e.el.attr(p),s(e.anim,e.el,e.anim.percents[0],null,e.totalOrigin,e.repeat-1)}e.next&&!e.stop&&s(e.anim,e.el,e.next,null,e.totalOrigin,e.repeat)}}}c.svg&&n&&n.paper&&n.paper.safari(),ic.length&&jc(kc)},lc=function(a){return a>255?255:0>a?0:a};$b.animateWith=function(a,b,d,e,f,g){var h=this;if(h.removed)return g&&g.call(h),h;var i=d instanceof r?d:c.animation(d,e,f,g);s(i,h,i.percents[0],null,h.attr());for(var j=0,k=ic.length;k>j;j++)if(ic[j].anim==b&&ic[j].el==a){ic[k-1].start=ic[j].start;break}return h},$b.onAnimation=function(a){return a?b.on("raphael.anim.frame."+this.id,a):b.unbind("raphael.anim.frame."+this.id),this},r.prototype.delay=function(a){var b=new r(this.anim,this.ms);return b.times=this.times,b.del=+a||0,b},r.prototype.repeat=function(a){var b=new r(this.anim,this.ms);return b.del=this.del,b.times=N.floor(O(a,0))||1,b},c.animation=function(a,b,d,e){if(a instanceof r)return a;(c.is(d,"function")||!d)&&(e=e||d||null,d=null),a=Object(a),b=+b||0;var f,g,h={};for(g in a)a[z](g)&&_(g)!=g&&_(g)+"%"!=g&&(f=!0,h[g]=a[g]);return f?(d&&(h.easing=d),e&&(h.callback=e),new r({100:h},b)):new r(a,b)},$b.animate=function(a,b,d,e){var f=this;if(f.removed)return e&&e.call(f),f;var g=a instanceof r?a:c.animation(a,b,d,e);return s(g,f,g.percents[0],null,f.attr()),f},$b.setTime=function(a,b){return a&&null!=b&&this.status(a,P(b,a.ms)/a.ms),this},$b.status=function(a,b){var c,d,e=[],f=0;if(null!=b)return s(a,this,-1,P(b,1)),this;for(c=ic.length;c>f;f++)if(d=ic[f],d.el.id==this.id&&(!a||d.anim==a)){if(a)return d.status;e.push({anim:d.anim,status:d.status})}return a?0:e},$b.pause=function(a){for(var c=0;c<ic.length;c++)ic[c].el.id!=this.id||a&&ic[c].anim!=a||b("raphael.anim.pause."+this.id,this,ic[c].anim)!==!1&&(ic[c].paused=!0);return this},$b.resume=function(a){for(var c=0;c<ic.length;c++)if(ic[c].el.id==this.id&&(!a||ic[c].anim==a)){var d=ic[c];b("raphael.anim.resume."+this.id,this,d.anim)!==!1&&(delete d.paused,this.status(d.anim,d.status))}return this},$b.stop=function(a){for(var c=0;c<ic.length;c++)ic[c].el.id!=this.id||a&&ic[c].anim!=a||b("raphael.anim.stop."+this.id,this,ic[c].anim)!==!1&&ic.splice(c--,1);return this},b.on("raphael.remove",t),b.on("raphael.clear",t),$b.toString=function(){return"Raphaël’s object"};var mc=function(a){if(this.items=[],this.length=0,this.type="set",a)for(var b=0,c=a.length;c>b;b++)!a[b]||a[b].constructor!=$b.constructor&&a[b].constructor!=mc||(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},nc=mc.prototype;nc.push=function(){for(var a,b,c=0,d=arguments.length;d>c;c++)a=arguments[c],!a||a.constructor!=$b.constructor&&a.constructor!=mc||(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},nc.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},nc.forEach=function(a,b){for(var c=0,d=this.items.length;d>c;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var oc in $b)$b[z](oc)&&(nc[oc]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][D](c,b)})}}(oc));return nc.attr=function(a,b){if(a&&c.is(a,V)&&c.is(a[0],"object"))for(var d=0,e=a.length;e>d;d++)this.items[d].attr(a[d]);else for(var f=0,g=this.items.length;g>f;f++)this.items[f].attr(a,b);return this},nc.clear=function(){for(;this.length;)this.pop()},nc.splice=function(a,b){a=0>a?O(this.length+a,0):a,b=O(0,P(this.length-a,b));var c,d=[],e=[],f=[];for(c=2;c<arguments.length;c++)f.push(arguments[c]);for(c=0;b>c;c++)e.push(this[a+c]);for(;c<this.length-a;c++)d.push(this[a+c]);var g=f.length;for(c=0;c<g+d.length;c++)this.items[a+c]=this[a+c]=g>c?f[c]:d[c-g];for(c=this.items.length=this.length-=b-g;this[c];)delete this[c++];return new mc(e)},nc.exclude=function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]==a)return this.splice(b,1),!0},nc.animate=function(a,b,d,e){(c.is(d,"function")||!d)&&(e=d||null);var f,g,h=this.items.length,i=h,j=this;if(!h)return this;e&&(g=function(){!--h&&e.call(j)}),d=c.is(d,U)?d:g;var k=c.animation(a,b,d,g);for(f=this.items[--i].animate(k);i--;)this.items[i]&&!this.items[i].removed&&this.items[i].animateWith(f,k,k),this.items[i]&&!this.items[i].removed||h--;return this},nc.insertAfter=function(a){for(var b=this.items.length;b--;)this.items[b].insertAfter(a);return this},nc.getBBox=function(){for(var a=[],b=[],c=[],d=[],e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}return a=P[D](0,a),b=P[D](0,b),c=O[D](0,c),d=O[D](0,d),{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},nc.clone=function(a){a=this.paper.set();for(var b=0,c=this.items.length;c>b;b++)a.push(this.items[b].clone());return a},nc.toString=function(){return"Raphaël‘s set"},nc.glow=function(a){var b=this.paper.set();return this.forEach(function(c){var d=c.glow(a);null!=d&&d.forEach(function(a){b.push(a)})}),b},nc.isPointInside=function(a,b){var c=!1;return this.forEach(function(d){return d.isPointInside(a,b)?(c=!0,!1):void 0}),c},c.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[z](d)&&(b.face[d]=a.face[d]);if(this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b],!a.svg){b.face["units-per-em"]=ab(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[z](e)){var f=a.glyphs[e];if(b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"},f.k)for(var g in f.k)f[z](g)&&(b.glyphs[e].k[g]=f.k[g])}}return a},v.getFont=function(a,b,d,e){if(e=e||"normal",d=d||"normal",b=+b||{normal:400,bold:700,lighter:300,bolder:800}[b]||400,c.fonts){var f=c.fonts[a];if(!f){var g=new RegExp("(^|\\s)"+a.replace(/[^\w\d\s+!~.:_-]/g,G)+"(\\s|$)","i");for(var h in c.fonts)if(c.fonts[z](h)&&g.test(h)){f=c.fonts[h];break}}var i;if(f)for(var j=0,k=f.length;k>j&&(i=f[j],i.face["font-weight"]!=b||i.face["font-style"]!=d&&i.face["font-style"]||i.face["font-stretch"]!=e);j++);return i}},v.print=function(a,b,d,e,f,g,h,i){g=g||"middle",h=O(P(h||0,1),-1),i=O(P(i||1,3),1);var j,k=I(d)[J](G),l=0,m=0,n=G;if(c.is(e,"string")&&(e=this.getFont(e)),e){j=(f||16)/e.face["units-per-em"];for(var o=e.face.bbox[J](w),p=+o[0],q=o[3]-o[1],r=0,s=+o[1]+("baseline"==g?q+ +e.face.descent:q/2),t=0,u=k.length;u>t;t++){if("\n"==k[t])l=0,x=0,m=0,r+=q*i;else{var v=m&&e.glyphs[k[t-1]]||{},x=e.glyphs[k[t]];l+=m?(v.w||e.w)+(v.k&&v.k[k[t]]||0)+e.w*h:0,m=1}x&&x.d&&(n+=c.transformPath(x.d,["t",l*j,r*j,"s",j,j,p,s,"t",(a-p)/j,(b-s)/j]))}}return this.path(n).attr({fill:"#000",stroke:"none"})},v.add=function(a){if(c.is(a,"array"))for(var b,d=this.set(),e=0,f=a.length;f>e;e++)b=a[e]||{},x[z](b.type)&&d.push(this[b.type]().attr(b));return d},c.format=function(a,b){var d=c.is(b,V)?[0][E](b):arguments;return a&&c.is(a,U)&&d.length-1&&(a=a.replace(y,function(a,b){return null==d[++b]?G:d[b]})),a||G},c.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;return c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),"function"==typeof e&&f&&(e=e()))}),e=(null==e||e==d?a:e)+""};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),c.ninja=function(){return B.was?A.win.Raphael=B.is:delete Raphael,c},c.st=nc,function(a,b,d){function e(){/in/.test(a.readyState)?setTimeout(e,9):c.eve("raphael.DOMload")}null==a.readyState&&a.addEventListener&&(a.addEventListener(b,d=function(){a.removeEventListener(b,d,!1),a.readyState="complete"},!1),a.readyState="loading"),e()}(document,"DOMContentLoaded"),b.on("raphael.DOMload",function(){u=!0}),function(){if(c.svg){var a="hasOwnProperty",b=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=c.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};c.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var q=function(d,e){if(e){"string"==typeof d&&(d=q(d));for(var f in e)e[a](f)&&("xlink:"==f.substring(0,6)?d.setAttributeNS(n,f.substring(6),b(e[f])):d.setAttribute(f,b(e[f])))}else d=c._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(a,e){var j="linear",k=a.id+e,m=.5,n=.5,o=a.node,p=a.paper,r=o.style,s=c._g.doc.getElementById(k);if(!s){if(e=b(e).replace(c._radial_gradient,function(a,b,c){if(j="radial",b&&c){m=d(b),n=d(c);var e=2*(n>.5)-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&.5!=n&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/),"linear"==j){var t=e.shift();if(t=-d(t),isNaN(t))return null;var u=[0,0,f.cos(c.rad(t)),f.sin(c.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=c._parseDots(e);if(!w)return null;if(k=k.replace(/[\(\)\s,\xb0#]/g,"_"),a.gradient&&k!=a.gradient.id&&(p.defs.removeChild(a.gradient),delete a.gradient),!a.gradient){s=q(j+"Gradient",{id:k}),a.gradient=s,q(s,"radial"==j?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:a.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;y>x;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}return q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1,1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if("path"==d.type){for(var g,h,i,j,k,m=b(e).toLowerCase().split("-"),n=d.paper,r=f?"end":"start",s=d.node,t=d.attrs,u=t["stroke-width"],v=m.length,w="classic",x=3,y=3,z=5;v--;)switch(m[v]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":w=m[v];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}if("open"==w?(x+=2,y+=2,z+=2,i=1,j=f?4:1,k={fill:"none",stroke:t.stroke}):(j=i=x/2,k={fill:t.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={},"none"!=w){var A="raphael-marker-"+w,B="raphael-marker-"+r+w+x+y;c._g.doc.getElementById(A)?p[A]++:(n.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[w],id:A})),p[A]=1);var C,D=c._g.doc.getElementById(B);D?(p[B]++,C=D.getElementsByTagName("use")[0]):(D=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:j,refY:y/2}),C=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),D.appendChild(C),n.defs.appendChild(D),p[B]=1),q(C,k);var E=i*("diamond"!=w&&"oval"!=w);f?(g=d._.arrows.startdx*u||0,h=c.getTotalLength(t.path)-E*u):(g=E*u,h=c.getTotalLength(t.path)-(d._.arrows.enddx*u||0)),k={},k["marker-"+r]="url(#"+B+")",(h||g)&&(k.d=c.getSubpath(t.path,g,h)),q(s,k),d._.arrows[r+"Path"]=A,d._.arrows[r+"Marker"]=B,d._.arrows[r+"dx"]=E,d._.arrows[r+"Type"]=w,d._.arrows[r+"String"]=e}else f?(g=d._.arrows.startdx*u||0,h=c.getTotalLength(t.path)-g):(g=0,h=c.getTotalLength(t.path)-(d._.arrows.enddx*u||0)),d._.arrows[r+"Path"]&&q(s,{d:c.getSubpath(t.path,g,h)}),delete d._.arrows[r+"Path"],delete d._.arrows[r+"Marker"],delete d._.arrows[r+"dx"],delete d._.arrows[r+"Type"],delete d._.arrows[r+"String"];for(k in p)if(p[a](k)&&!p[k]){var F=c._g.doc.getElementById(k);F&&F.parentNode.removeChild(F)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,c,d){if(c=u[b(c).toLowerCase()]){for(var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=c.length;h--;)g[h]=c[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[a](o)){if(!c._availableAttrs[a](o))continue;var p=f[o];switch(k[o]=p,o){case"blur":d.blur(p);break;case"title":var u=i.getElementsByTagName("title");if(u.length&&(u=u[0]))u.firstChild.nodeValue=p;else{u=q("title");var w=c._g.doc.createTextNode(p);u.appendChild(w),i.appendChild(u)}break;case"href":case"target":var x=i.parentNode;if("a"!=x.tagName.toLowerCase()){var z=q("a");x.insertBefore(z,i),z.appendChild(i),x=z}"target"==o?x.setAttributeNS(n,"show","blank"==p?"new":p):x.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var A=b(p).split(j);if(4==A.length){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var B=q("clipPath"),C=q("rect");B.id=c.createUUID(),q(C,{x:A[0],y:A[1],width:A[2],height:A[3]}),B.appendChild(C),d.paper.defs.appendChild(B),q(i,{"clip-path":"url(#"+B.id+")"}),d.clip=C}if(!p){var D=i.getAttribute("clip-path");if(D){var E=c._g.doc.getElementById(D.replace(/(^url\(#|\)$)/g,l));E&&E.parentNode.removeChild(E),q(i,{"clip-path":l}),delete d.clip}}break;case"path":"path"==d.type&&(q(i,{d:p?k.path=c._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":if(i.setAttribute(o,p),d._.dirty=1,!k.fx)break;o="x",p=k.x;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if("rx"==o&&"rect"==d.type)break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":if(i.setAttribute(o,p),d._.dirty=1,!k.fy)break;o="y",p=k.y;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if("ry"==o&&"rect"==d.type)break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":"rect"==d.type?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":"image"==d.type&&i.setAttributeNS(n,"href",p);break;case"stroke-width":(1!=d._.sx||1!=d._.sy)&&(p/=g(h(d._.sx),h(d._.sy))||1),d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var F=b(p).match(c._ISURL);if(F){B=q("pattern");var G=q("image");B.id=c.createUUID(),q(B,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(G,{x:0,y:0,"xlink:href":F[1]}),B.appendChild(G),function(a){c._preload(F[1],function(){var b=this.offsetWidth,c=this.offsetHeight;q(a,{width:b,height:c}),q(G,{width:b,height:c}),d.paper.safari()})}(B),d.paper.defs.appendChild(B),q(i,{fill:"url(#"+B.id+")"}),d.pattern=B,d.pattern&&s(d);break}var H=c.getRGB(p);if(H.error){if(("circle"==d.type||"ellipse"==d.type||"r"!=b(p).charAt())&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var I=c._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(I){var J=I.getElementsByTagName("stop");q(J[J.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}}else delete f.gradient,delete k.gradient,!c.is(k.opacity,"undefined")&&c.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!c.is(k["fill-opacity"],"undefined")&&c.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});H[a]("opacity")&&q(i,{"fill-opacity":H.opacity>1?H.opacity/100:H.opacity});case"stroke":H=c.getRGB(p),i.setAttribute(o,H.hex),"stroke"==o&&H[a]("opacity")&&q(i,{"stroke-opacity":H.opacity>1?H.opacity/100:H.opacity}),"stroke"==o&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":("circle"==d.type||"ellipse"==d.type||"r"!=b(p).charAt())&&r(d,p);break;case"opacity":k.gradient&&!k[a]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){I=c._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),I&&(J=I.getElementsByTagName("stop"),q(J[J.length-1],{"stop-opacity":p}));break}default:"font-size"==o&&(p=e(p,10)+"px");var K=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[K]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if("text"==d.type&&(f[a]("text")||f[a]("font")||f[a]("font-size")||f[a]("x")||f[a]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(c._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;
if(f[a]("text")){for(g.text=f.text;h.firstChild;)h.removeChild(h.firstChild);for(var j,k=b(f.text).split("\n"),m=[],n=0,o=k.length;o>n;n++)j=q("tspan"),n&&q(j,{dy:i*x,x:g.x}),j.appendChild(c._g.doc.createTextNode(k[n])),h.appendChild(j),m[n]=j}else for(m=h.getElementsByTagName("tspan"),n=0,o=m.length;o>n;n++)n?q(m[n],{dy:i*x,x:g.x}):q(m[0],{dy:0});q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&c.is(r,"finite")&&q(m[0],{dy:r})}},z=function(a,b){this[0]=this.node=a,a.raphael=!0,this.id=c._oid++,a.raphaelid=this.id,this.matrix=c.matrix(),this.realPath=null,this.paper=b,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!b.bottom&&(b.bottom=this),this.prev=b.top,b.top&&(b.top.next=this),b.top=this,this.next=null},A=c.el;z.prototype=A,A.constructor=z,c._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);return d.type="path",w(d,{fill:"none",stroke:"#000",path:a}),d},A.rotate=function(a,c,e){if(this.removed)return this;if(a=b(a).split(j),a.length-1&&(c=d(a[1]),e=d(a[2])),a=d(a[0]),null==e&&(c=e),null==c||null==e){var f=this.getBBox(1);c=f.x+f.width/2,e=f.y+f.height/2}return this.transform(this._.transform.concat([["r",a,c,e]])),this},A.scale=function(a,c,e,f){if(this.removed)return this;if(a=b(a).split(j),a.length-1&&(c=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),null==c&&(c=a),null==f&&(e=f),null==e||null==f)var g=this.getBBox(1);return e=null==e?g.x+g.width/2:e,f=null==f?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,c,e,f]])),this},A.translate=function(a,c){return this.removed?this:(a=b(a).split(j),a.length-1&&(c=d(a[1])),a=d(a[0])||0,c=+c||0,this.transform(this._.transform.concat([["t",a,c]])),this)},A.transform=function(b){var d=this._;if(null==b)return d.transform;if(c._extractTransform(this,b),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix}),1!=d.sx||1!=d.sy){var e=this.attrs[a]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){return!this.removed&&this.paper.safari(this.node.style.display="none"),this},A.show=function(){return!this.removed&&this.paper.safari(this.node.style.display=""),this},A.remove=function(){if(!this.removed&&this.node.parentNode){var a=this.paper;a.__set__&&a.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&a.defs.removeChild(this.gradient),c._tear(this,a),"a"==this.node.parentNode.tagName.toLowerCase()?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var b in this)this[b]="function"==typeof this[b]?c._removedFactory(b):null;this.removed=!0}},A._getBBox=function(){if("none"==this.node.style.display){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}return a&&this.hide(),b},A.attr=function(b,d){if(this.removed)return this;if(null==b){var e={};for(var f in this.attrs)this.attrs[a](f)&&(e[f]=this.attrs[f]);return e.gradient&&"none"==e.fill&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform,e}if(null==d&&c.is(b,"string")){if("fill"==b&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;if("transform"==b)return this._.transform;for(var g=b.split(j),h={},i=0,l=g.length;l>i;i++)b=g[i],h[b]=b in this.attrs?this.attrs[b]:c.is(this.paper.customAttributes[b],"function")?this.paper.customAttributes[b].def:c._availableAttrs[b];return l-1?h:h[g[0]]}if(null==d&&c.is(b,"array")){for(h={},i=0,l=b.length;l>i;i++)h[b[i]]=this.attr(b[i]);return h}if(null!=d){var m={};m[b]=d}else null!=b&&c.is(b,"object")&&(m=b);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[a](n)&&m[a](n)&&c.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[a](p)&&(m[p]=o[p])}return w(this,m),this},A.toFront=function(){if(this.removed)return this;"a"==this.node.parentNode.tagName.toLowerCase()?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var a=this.paper;return a.top!=this&&c._tofront(this,a),this},A.toBack=function(){if(this.removed)return this;var a=this.node.parentNode;"a"==a.tagName.toLowerCase()?a.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):a.firstChild!=this.node&&a.insertBefore(this.node,this.node.parentNode.firstChild),c._toback(this,this.paper);this.paper;return this},A.insertAfter=function(a){if(this.removed)return this;var b=a.node||a[a.length-1].node;return b.nextSibling?b.parentNode.insertBefore(this.node,b.nextSibling):b.parentNode.appendChild(this.node),c._insertafter(this,a,this.paper),this},A.insertBefore=function(a){if(this.removed)return this;var b=a.node||a[0].node;return b.parentNode.insertBefore(this.node,b),c._insertbefore(this,a,this.paper),this},A.blur=function(a){var b=this;if(0!==+a){var d=q("filter"),e=q("feGaussianBlur");b.attrs.blur=a,d.id=c.createUUID(),q(e,{stdDeviation:+a||1.5}),d.appendChild(e),b.paper.defs.appendChild(d),b._blur=d,q(b.node,{filter:"url(#"+d.id+")"})}else b._blur&&(b._blur.parentNode.removeChild(b._blur),delete b._blur,delete b.attrs.blur),b.node.removeAttribute("filter");return b},c._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);return f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs),f},c._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);return h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs),h},c._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);return g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs),g},c._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);return h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image",h},c._engine.text=function(a,b,d,e){var f=q("text");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);return g.attrs={x:b,y:d,"text-anchor":"middle",text:e,font:c._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs),g},c._engine.setSize=function(a,b){return this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox),this},c._engine.create=function(){var a=c._getContainer.apply(0,arguments),b=a&&a.container,d=a.x,e=a.y,f=a.width,g=a.height;if(!b)throw new Error("SVG container not found.");var h,i=q("svg"),j="overflow:hidden;";return d=d||0,e=e||0,f=f||512,g=g||342,q(i,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),1==b?(i.style.cssText=j+"position:absolute;left:"+d+"px;top:"+e+"px",c._g.doc.body.appendChild(i),h=1):(i.style.cssText=j+"position:relative",b.firstChild?b.insertBefore(i,b.firstChild):b.appendChild(i)),b=new c._Paper,b.width=f,b.height=g,b.canvas=i,b.clear(),b._left=b._top=0,h&&(b.renderfix=function(){}),b.renderfix(),b},c._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f,h,i=g(c/this.width,d/this.height),j=this.top,l=e?"xMidYMid meet":"xMinYMin";for(null==a?(this._vbSize&&(i=1),delete this._vbSize,f="0 0 "+this.width+m+this.height):(this._vbSize=i,f=a+m+b+m+c+m+d),q(this.canvas,{viewBox:f,preserveAspectRatio:l});i&&j;)h="stroke-width"in j.attrs?j.attrs["stroke-width"]:1,j.attr({"stroke-width":h}),j._.dirty=1,j._.dirtyT=1,j=j.prev;return this._viewBox=[a,b,c,d,!!e],this},c.prototype.renderfix=function(){var a,b=this.canvas,c=b.style;try{a=b.getScreenCTM()||b.createSVGMatrix()}catch(d){a=b.createSVGMatrix()}var e=-a.e%1,f=-a.f%1;(e||f)&&(e&&(this._left=(this._left+e)%1,c.left=this._left+"px"),f&&(this._top=(this._top+f)%1,c.top=this._top+"px"))},c.prototype.clear=function(){c.eve("raphael.clear",this);for(var a=this.canvas;a.firstChild;)a.removeChild(a.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(c._g.doc.createTextNode("Created with Raphaël "+c.version)),a.appendChild(this.desc),a.appendChild(this.defs=q("defs"))},c.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var a in this)this[a]="function"==typeof this[a]?c._removedFactory(a):null};var B=c.st;for(var C in A)A[a](C)&&!B[a](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}}(),function(){if(c.vml){var a="hasOwnProperty",b=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=c.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(a){var d=/[ahqstv]/gi,e=c._pathToAbsolute;if(b(a).match(d)&&(e=c._path2curve),d=/[clmz]/g,e==c._pathToAbsolute&&!b(a).match(d)){var g=b(a).replace(q,function(a,b,c){var d=[],e="m"==b.toLowerCase(),g=p[b];return c.replace(s,function(a){e&&2==d.length&&(g+=d+p["m"==b?"l":"L"],d=[]),d.push(f(a*u))}),g+d});return g}var h,i,j=e(a);g=[];for(var k=0,l=j.length;l>k;k++){h=j[k],i=j[k][0].toLowerCase(),"z"==i&&(i="x");for(var m=1,r=h.length;r>m;m++)i+=f(h[m]*u)+(m!=r-1?",":o);g.push(i)}return g.join(n)},y=function(a,b,d){var e=c.matrix();return e.rotate(-a,.5,.5),{dx:e.x(b,d),dy:e.y(b,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q=u/b,r=u/c;if(m.visibility="hidden",b&&c){if(l.coordsize=i(q)+n+i(r),m.rotation=f*(0>b*c?-1:1),f){var s=y(f,d,e);d=s.dx,e=s.dy}if(0>b&&(p+="x"),0>c&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-q+n+e*-r,k||g.fillsize){var t=l.getElementsByTagName(j);t=t&&t[0],l.removeChild(t),k&&(s=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),t.position=s.dx*o+n+s.dy*o),g.fillsize&&(t.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(t)}m.visibility="visible"}};c.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var A=function(a,c,d){for(var e=b(c).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";g--;)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),r=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),s=e;for(var t in i)i[a](t)&&(m[t]=i[t]);if(q&&(m.path=c._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur),(i.path&&"path"==e.type||q)&&(l.path=x(~b(m.path).toLowerCase().indexOf("r")?c._pathToAbsolute(m.path):m.path),"image"==e.type&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0))),"transform"in i&&e.transform(i.transform),r){var y=+m.cx,B=+m.cy,D=+m.rx||+m.r||0,E=+m.ry||+m.r||0;l.path=c.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((y-D)*u),f((B-E)*u),f((y+D)*u),f((B+E)*u),f(y*u)),e._.dirty=1}if("clip-rect"in i){var G=b(i["clip-rect"]).split(k);if(4==G.length){G[2]=+G[2]+ +G[0],G[3]=+G[3]+ +G[1];var H=l.clipRect||c._g.doc.createElement("div"),I=H.style;I.clip=c.format("rect({1}px {2}px {3}px {0}px)",G),l.clipRect||(I.position="absolute",I.top=0,I.left=0,I.width=e.paper.width+"px",I.height=e.paper.height+"px",l.parentNode.insertBefore(H,l),H.appendChild(l),l.clipRect=H)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var J=e.textpath.style;i.font&&(J.font=i.font),i["font-family"]&&(J.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(J.fontSize=i["font-size"]),i["font-weight"]&&(J.fontWeight=i["font-weight"]),i["font-style"]&&(J.fontStyle=i["font-style"])}if("arrow-start"in i&&A(s,i["arrow-start"]),"arrow-end"in i&&A(s,i["arrow-end"],1),null!=i.opacity||null!=i["stroke-width"]||null!=i.fill||null!=i.src||null!=i.stroke||null!=i["stroke-width"]||null!=i["stroke-opacity"]||null!=i["fill-opacity"]||null!=i["stroke-dasharray"]||null!=i["stroke-miterlimit"]||null!=i["stroke-linejoin"]||null!=i["stroke-linecap"]){var K=l.getElementsByTagName(j),L=!1;if(K=K&&K[0],!K&&(L=K=F(j)),"image"==e.type&&i.src&&(K.src=i.src),i.fill&&(K.on=!0),(null==K.on||"none"==i.fill||null===i.fill)&&(K.on=!1),K.on&&i.fill){var M=b(i.fill).match(c._ISURL);if(M){K.parentNode==l&&l.removeChild(K),K.rotate=!0,K.src=M[1],K.type="tile";var N=e.getBBox(1);K.position=N.x+n+N.y,e._.fillpos=[N.x,N.y],c._preload(M[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else K.color=c.getRGB(i.fill).hex,K.src=o,K.type="solid",c.getRGB(i.fill).error&&(s.type in{circle:1,ellipse:1}||"r"!=b(i.fill).charAt())&&C(s,i.fill,K)&&(m.fill="none",m.gradient=i.fill,K.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var O=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+c.getRGB(i.fill).o+1||2)-1);O=h(g(O,0),1),K.opacity=O,K.src&&(K.color="none")}l.appendChild(K);var P=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],Q=!1;!P&&(Q=P=F("stroke")),(i.stroke&&"none"!=i.stroke||i["stroke-width"]||null!=i["stroke-opacity"]||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])&&(P.on=!0),("none"==i.stroke||null===i.stroke||null==P.on||0==i.stroke||0==i["stroke-width"])&&(P.on=!1);var R=c.getRGB(i.stroke);P.on&&i.stroke&&(P.color=R.hex),O=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+R.o+1||2)-1);var S=.75*(d(i["stroke-width"])||1);if(O=h(g(O,0),1),null==i["stroke-width"]&&(S=m["stroke-width"]),i["stroke-width"]&&(P.weight=S),S&&1>S&&(O*=S)&&(P.weight=1),P.opacity=O,i["stroke-linejoin"]&&(P.joinstyle=i["stroke-linejoin"]||"miter"),P.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(P.endcap="butt"==i["stroke-linecap"]?"flat":"square"==i["stroke-linecap"]?"square":"round"),"stroke-dasharray"in i){var T={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};P.dashstyle=T[a](i["stroke-dasharray"])?T[i["stroke-dasharray"]]:o}Q&&l.appendChild(P)}if("text"==s.type){s.paper.canvas.style.display=o;var U=s.paper.span,V=100,W=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=U.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),W=d(m["font-size"]||W&&W[0])||10,p.fontSize=W*V+"px",s.textpath.string&&(U.innerHTML=b(s.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var X=U.getBoundingClientRect();s.W=m.w=(X.right-X.left)/V,s.H=m.h=(X.bottom-X.top)/V,s.X=m.x,s.Y=m.y+s.H/2,("x"in i||"y"in i)&&(s.path.v=c.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));for(var Y=["x","y","text","font","font-family","font-weight","font-style","font-size"],Z=0,$=Y.length;$>Z;Z++)if(Y[Z]in i){s._.dirty=1;break}switch(m["text-anchor"]){case"start":s.textpath.style["v-text-align"]="left",s.bbx=s.W/2;break;case"end":s.textpath.style["v-text-align"]="right",s.bbx=-s.W/2;break;default:s.textpath.style["v-text-align"]="center",s.bbx=0}s.textpath.style["v-text-kern"]=!0}},C=function(a,f,g){a.attrs=a.attrs||{};var h=(a.attrs,Math.pow),i="linear",j=".5 .5";if(a.attrs.gradient=f,f=b(f).replace(c._radial_gradient,function(a,b,c){return i="radial",b&&c&&(b=d(b),c=d(c),h(b-.5,2)+h(c-.5,2)>.25&&(c=e.sqrt(.25-h(b-.5,2))*(2*(c>.5)-1)+.5),j=b+n+c),o}),f=f.split(/\s*\-\s*/),"linear"==i){var k=f.shift();if(k=-d(k),isNaN(k))return null}var l=c._parseDots(f);if(!l)return null;if(a=a.shape||a.node,l.length){a.removeChild(g),g.on=!0,g.method="none",g.color=l[0].color,g.color2=l[l.length-1].color;for(var m=[],p=0,q=l.length;q>p;p++)l[p].offset&&m.push(l[p].offset+n+l[p].color);g.colors=m.length?m.join():"0% "+g.color,"radial"==i?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=j,g.angle=0):(g.type="gradient",g.angle=(270-k)%360),a.appendChild(g)}return 1},D=function(a,b){this[0]=this.node=a,a.raphael=!0,this.id=c._oid++,a.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=b,this.matrix=c.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!b.bottom&&(b.bottom=this),this.prev=b.top,b.top&&(b.top.next=this),b.top=this,this.next=null},E=c.el;D.prototype=E,E.constructor=D,E.transform=function(a){if(null==a)return this._.transform;var d,e=this.paper._viewBoxShift,f=e?"s"+[e.scale,e.scale]+"-1-1t"+[e.dx,e.dy]:o;e&&(d=a=b(a).replace(/\.{3}|\u2026/g,this._.transform||o)),c._extractTransform(this,f+a);var g,h=this.matrix.clone(),i=this.skew,j=this.node,k=~b(this.attrs.fill).indexOf("-"),l=!b(this.attrs.fill).indexOf("url(");if(h.translate(1,1),l||k||"image"==this.type)if(i.matrix="1 0 0 1",i.offset="0 0",g=h.split(),k&&g.noRotation||!g.isSimple){j.style.filter=h.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;j.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else j.style.filter=o,z(this,g.scalex,g.scaley,g.dx,g.dy,g.rotate);else j.style.filter=o,i.matrix=b(h),i.offset=h.offset();return d&&(this._.transform=d),this},E.rotate=function(a,c,e){if(this.removed)return this;if(null!=a){if(a=b(a).split(k),a.length-1&&(c=d(a[1]),e=d(a[2])),a=d(a[0]),null==e&&(c=e),null==c||null==e){var f=this.getBBox(1);c=f.x+f.width/2,e=f.y+f.height/2}return this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,c,e]])),this}},E.translate=function(a,c){return this.removed?this:(a=b(a).split(k),a.length-1&&(c=d(a[1])),a=d(a[0])||0,c=+c||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=c),this.transform(this._.transform.concat([["t",a,c]])),this)},E.scale=function(a,c,e,f){if(this.removed)return this;if(a=b(a).split(k),a.length-1&&(c=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),null==c&&(c=a),null==f&&(e=f),null==e||null==f)var g=this.getBBox(1);return e=null==e?g.x+g.width/2:e,f=null==f?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,c,e,f]])),this._.dirtyT=1,this},E.hide=function(){return!this.removed&&(this.node.style.display="none"),this},E.show=function(){return!this.removed&&(this.node.style.display=o),this},E._getBBox=function(){return this.removed?{}:{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),c.eve.unbind("raphael.*.*."+this.id),c._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var a in this)this[a]="function"==typeof this[a]?c._removedFactory(a):null;this.removed=!0}},E.attr=function(b,d){if(this.removed)return this;if(null==b){var e={};for(var f in this.attrs)this.attrs[a](f)&&(e[f]=this.attrs[f]);return e.gradient&&"none"==e.fill&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform,e}if(null==d&&c.is(b,"string")){if(b==j&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;for(var g=b.split(k),h={},i=0,m=g.length;m>i;i++)b=g[i],h[b]=b in this.attrs?this.attrs[b]:c.is(this.paper.customAttributes[b],"function")?this.paper.customAttributes[b].def:c._availableAttrs[b];return m-1?h:h[g[0]]}if(this.attrs&&null==d&&c.is(b,"array")){for(h={},i=0,m=b.length;m>i;i++)h[b[i]]=this.attr(b[i]);return h}var n;null!=d&&(n={},n[b]=d),null==d&&c.is(b,"object")&&(n=b);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[a](o)&&n[a](o)&&c.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[a](q)&&(n[q]=p[q])}n.text&&"text"==this.type&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){return!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&c._tofront(this,this.paper),this},E.toBack=function(){return this.removed?this:(this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),c._toback(this,this.paper)),this)},E.insertAfter=function(a){return this.removed?this:(a.constructor==c.st.constructor&&(a=a[a.length-1]),a.node.nextSibling?a.node.parentNode.insertBefore(this.node,a.node.nextSibling):a.node.parentNode.appendChild(this.node),c._insertafter(this,a,this.paper),this)},E.insertBefore=function(a){return this.removed?this:(a.constructor==c.st.constructor&&(a=a[0]),a.node.parentNode.insertBefore(this.node,a.node),c._insertbefore(this,a,this.paper),this)},E.blur=function(a){var b=this.node.runtimeStyle,d=b.filter;return d=d.replace(r,o),0!==+a?(this.attrs.blur=a,b.filter=d+n+m+".Blur(pixelradius="+(+a||1.5)+")",b.margin=c.format("-{0}px 0 0 -{0}px",f(+a||1.5))):(b.filter=d,b.margin=0,delete this.attrs.blur),this},c._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");return f.on=!0,c.appendChild(f),d.skew=f,d.transform(o),d},c._engine.rect=function(a,b,d,e,f,g){var h=c._rectPath(b,d,e,f,g),i=a.path(h),j=i.attrs;return i.X=j.x=b,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect",i},c._engine.ellipse=function(a,b,c,d,e){{var f=a.path();f.attrs}return f.X=b-d,f.Y=c-e,f.W=2*d,f.H=2*e,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e}),f},c._engine.circle=function(a,b,c,d){{var e=a.path();e.attrs}return e.X=b-d,e.Y=c-d,e.W=e.H=2*d,e.type="circle",B(e,{cx:b,cy:c,r:d}),e},c._engine.image=function(a,b,d,e,f,g){var h=c._rectPath(d,e,f,g),i=a.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];return k.src=b,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=b,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0),i},c._engine.text=function(a,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=c.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=b(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,a),l={fill:"#000",stroke:"none",font:c._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=b(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),a.canvas.appendChild(h);var m=F("skew");return m.on=!0,h.appendChild(m),k.skew=m,k.transform(o),k},c._engine.setSize=function(a,b){var d=this.canvas.style;return this.width=a,this.height=b,a==+a&&(a+="px"),b==+b&&(b+="px"),d.width=a,d.height=b,d.clip="rect(0 "+a+" "+b+" 0)",this._viewBox&&c._engine.setViewBox.apply(this,this._viewBox),this},c._engine.setViewBox=function(a,b,d,e,f){c.eve("raphael.setViewBox",this,this._viewBox,[a,b,d,e,f]);var h,i,j=this.width,k=this.height,l=1/g(d/j,e/k);return f&&(h=k/e,i=j/d,j>d*h&&(a-=(j-d*h)/2/h),k>e*i&&(b-=(k-e*i)/2/i)),this._viewBox=[a,b,d,e,!!f],this._viewBoxShift={dx:-a,dy:-b,scale:l},this.forEach(function(a){a.transform("...")}),this};var F;c._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},c._engine.initWin(c._g.win),c._engine.create=function(){var a=c._getContainer.apply(0,arguments),b=a.container,d=a.height,e=a.width,f=a.x,g=a.y;if(!b)throw new Error("VML container not found.");var h=new c._Paper,i=h.canvas=c._g.doc.createElement("div"),j=i.style;return f=f||0,g=g||0,e=e||512,d=d||342,h.width=e,h.height=d,e==+e&&(e+="px"),d==+d&&(d+="px"),h.coordsize=1e3*u+n+1e3*u,h.coordorigin="0 0",h.span=c._g.doc.createElement("span"),h.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",i.appendChild(h.span),j.cssText=c.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",e,d),1==b?(c._g.doc.body.appendChild(i),j.left=f+"px",j.top=g+"px",j.position="absolute"):b.firstChild?b.insertBefore(i,b.firstChild):b.appendChild(i),h.renderfix=function(){},h},c.prototype.clear=function(){c.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=c._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},c.prototype.remove=function(){c.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var a in this)this[a]="function"==typeof this[a]?c._removedFactory(a):null;return!0};var G=c.st;for(var H in E)E[a](H)&&!G[a](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}}(),B.was?A.win.Raphael=c:Raphael=c,c});
// script.aculo.us builder.js v1.9.0, Thu Dec 23 16:54:48 -0500 2010

// Copyright (c) 2005-2010 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/

var Builder = {
  NODEMAP: {
    AREA: 'map',
    CAPTION: 'table',
    COL: 'table',
    COLGROUP: 'table',
    LEGEND: 'fieldset',
    OPTGROUP: 'select',
    OPTION: 'select',
    PARAM: 'object',
    TBODY: 'table',
    TD: 'table',
    TFOOT: 'table',
    TH: 'table',
    THEAD: 'table',
    TR: 'table'
  },
  // note: For Firefox < 1.5, OPTION and OPTGROUP tags are currently broken,
  //       due to a Firefox bug
  node: function(elementName) {
    elementName = elementName.toUpperCase();

    // try innerHTML approach
    var parentTag = this.NODEMAP[elementName] || 'div';
    var parentElement = document.createElement(parentTag);
    try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
      parentElement.innerHTML = "<" + elementName + "></" + elementName + ">";
    } catch(e) {}
    var element = parentElement.firstChild || null;

    // see if browser added wrapping tags
    if(element && (element.tagName.toUpperCase() != elementName))
      element = element.getElementsByTagName(elementName)[0];

    // fallback to createElement approach
    if(!element) element = document.createElement(elementName);

    // abort if nothing could be created
    if(!element) return;

    // attributes (or text)
    if(arguments[1])
      if(this._isStringOrNumber(arguments[1]) ||
        (arguments[1] instanceof Array) ||
        arguments[1].tagName) {
          this._children(element, arguments[1]);
        } else {
          var attrs = this._attributes(arguments[1]);
          if(attrs.length) {
            try { // prevent IE "feature": http://dev.rubyonrails.org/ticket/2707
              parentElement.innerHTML = "<" +elementName + " " +
                attrs + "></" + elementName + ">";
            } catch(e) {}
            element = parentElement.firstChild || null;
            // workaround firefox 1.0.X bug
            if(!element) {
              element = document.createElement(elementName);
              for(attr in arguments[1])
                element[attr == 'class' ? 'className' : attr] = arguments[1][attr];
            }
            if(element.tagName.toUpperCase() != elementName)
              element = parentElement.getElementsByTagName(elementName)[0];
          }
        }

    // text, or array of children
    if(arguments[2])
      this._children(element, arguments[2]);

     return $(element);
  },
  _text: function(text) {
     return document.createTextNode(text);
  },

  ATTR_MAP: {
    'className': 'class',
    'htmlFor': 'for'
  },

  _attributes: function(attributes) {
    var attrs = [];
    for(attribute in attributes)
      attrs.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) +
          '="' + attributes[attribute].toString().escapeHTML().gsub(/"/,'&quot;') + '"');
    return attrs.join(" ");
  },
  _children: function(element, children) {
    if(children.tagName) {
      element.appendChild(children);
      return;
    }
    if(typeof children=='object') { // array can hold nodes and text
      children.flatten().each( function(e) {
        if(typeof e=='object')
          element.appendChild(e);
        else
          if(Builder._isStringOrNumber(e))
            element.appendChild(Builder._text(e));
      });
    } else
      if(Builder._isStringOrNumber(children))
        element.appendChild(Builder._text(children));
  },
  _isStringOrNumber: function(param) {
    return(typeof param=='string' || typeof param=='number');
  },
  build: function(html) {
    var element = this.node('div');
    $(element).update(html.strip());
    return element.down();
  },
  dump: function(scope) {
    if(typeof scope != 'object' && typeof scope != 'function') scope = window; //global scope

    var tags = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " +
      "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " +
      "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+
      "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+
      "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+
      "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);

    tags.each( function(tag){
      scope[tag] = function() {
        return Builder.node.apply(Builder, [tag].concat($A(arguments)));
      };
    });
  }
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// formatDate :
// a PHP date like function, for formatting date strings
// authored by Svend Tofte <www.svendtofte.com>
// the code is in the public domain
//
// see http://www.svendtofte.com/code/date_format/
// and http://www.php.net/date
//
// thanks to 
//  - Daniel Berlin <mail@daniel-berlin.de>,
//    major overhaul and improvements
//  - Matt Bannon,
//    correcting some stupid bugs in my days-in-the-months list!
//
// input : format string
// time : epoch time (seconds, and optional)
//
// if time is not passed, formatting is based on 
// the current "this" date object's set time.
//
// supported switches are
// a, A, B, c, d, D, F, g, G, h, H, i, I (uppercase i), j, l (lowercase L),
// L, m, M, n, N, O, P, r, s, S, t, U, w, W, y, Y, z, Z
// 
// unsupported (as compared to date in PHP 5.1.3)
// T, e, o

Date.prototype.formatDate = function (input,time) {
	
	// removed their hard-coded string arrays and moved to loc
	var daysLong = '_Dates.Weekdays'.loc().split(',');
	var daysFull = '_Dates.LongWeekdays'.loc().split(',');
	var daysShort = '_Dates.ShortWeekdays'.loc().split(',');
	var monthsShort = '_Dates.Months'.loc().split(',');
	var monthsLong = '_Dates.LongMonths'.loc().split(',');
	var ampm = '_Dates.AMPM'.loc().split(',');

	var switches = { // switches object
		
		a : function () {
			// Lowercase Ante meridiem and Post meridiem
			// modified to use loc array
			return ampm[Math.floor(date.getHours()/12)];
		},
		
		A : function () {
			// Uppercase Ante meridiem and Post meridiem
			return (this.a().toUpperCase());
		},
	
		B : function (){
			// Swatch internet time. code simply grabbed from ppk,
			// since I was feeling lazy:
			// http://www.xs4all.nl/~ppk/js/beat.html
			var off = (date.getTimezoneOffset() + 60)*60;
			var theSeconds = (date.getHours() * 3600) + 
							 (date.getMinutes() * 60) + 
							  date.getSeconds() + off;
			var beat = Math.floor(theSeconds/86.4);
			if (beat > 1000) beat -= 1000;
			if (beat < 0) beat += 1000;
			if ((String(beat)).length == 1) beat = "00"+beat;
			if ((String(beat)).length == 2) beat = "0"+beat;
			return beat;
		},
		
		c : function () {
			// ISO 8601 date (e.g.: "2004-02-12T15:19:21+00:00"), as per
			// http://www.cl.cam.ac.uk/~mgk25/iso-time.html
			return (this.Y() + "-" + this.m() + "-" + this.d() + "T" + 
					this.h() + ":" + this.i() + ":" + this.s() + this.P());
		},
		
		d : function () {
			// Day of the month, 2 digits with leading zeros
			var j = String(this.j());
			return (j.length == 1 ? "0"+j : j);
		},
		
		D : function () {
			// A textual representation of a day, three letters
			return daysShort[date.getDay()];
		},
		
		F : function () {
			// A full textual representation of a month
			return monthsLong[date.getMonth()];
		},
		
		g : function () {
			// 12-hour format of an hour without leading zeros
			return date.getHours() > 12? date.getHours()-12 : (date.getHours()==0?12:date.getHours());
		},
		
		G : function () {
			// 24-hour format of an hour without leading zeros
			return date.getHours();
		},
		
		h : function () {
			// 12-hour format of an hour with leading zeros
			var g = String(this.g());
			return (g.length == 1 ? "0"+g : g);
		},
		
		H : function () {
			// 24-hour format of an hour with leading zeros
			var G = String(this.G());
			return (G.length == 1 ? "0"+G : G);
		},
		
		i : function () {
			// Minutes with leading zeros
			var min = String (date.getMinutes ());
			return (min.length == 1 ? "0" + min : min);
		},
		
		I : function () {
			// Whether or not the date is in daylight saving time (DST)
			// note that this has no bearing in actual DST mechanics,
			// and is just a pure guess. buyer beware.
			var noDST = new Date ("January 1 " + this.Y() + " 00:00:00");
			return (noDST.getTimezoneOffset () == 
					date.getTimezoneOffset () ? 0 : 1);
		},
		
		j : function () {
			// Day of the month without leading zeros
			return date.getDate();
		},
		
		l : function () {
			// A full textual representation of the day of the week
			return daysLong[date.getDay()];
		},
		
		x : function () {
			// Overload x to get proper full textual representation of the day of the week.
			return daysFull[date.getDay()];
		},
		
		L : function () {
			// leap year or not. 1 if leap year, 0 if not.
			// the logic should match iso's 8601 standard.
			// http://www.uic.edu/depts/accc/software/isodates/leapyear.html
			var Y = this.Y();
			if (         
				(Y % 4 == 0 && Y % 100 != 0) ||
				(Y % 4 == 0 && Y % 100 == 0 && Y % 400 == 0)
				) {
				return 1;
			} else {
				return 0;
			}
		},
		
		m : function () {
			// Numeric representation of a month, with leading zeros
			var n = String(this.n());
			return (n.length == 1 ? "0"+n : n);
		},
		
		M : function () {
			// A short textual representation of a month, three letters
			return monthsShort[date.getMonth()];
		},
		
		n : function () {
			// Numeric representation of a month, without leading zeros
			return date.getMonth()+1;
		},
		
		N : function () {
			// ISO-8601 numeric representation of the day of the week
			var w = this.w();
			return (w == 0 ? 7 : w);
		},
		
		O : function () {
			// Difference to Greenwich time (GMT) in hours
			var os = Math.abs(date.getTimezoneOffset());
			var h = String(Math.floor(os/60));
			var m = String(os%60);
			h.length == 1? h = "0"+h:1;
			m.length == 1? m = "0"+m:1;
			return date.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
		},
		
		P : function () {
			// Difference to GMT, with colon between hours and minutes
			var O = this.O();
			return (O.substr(0, 3) + ":" + O.substr(3, 2));
		},      
		
		r : function () {
			// RFC 822 formatted date
			var r; // result
			//  Thu         ,     21               Dec              2000
			r = this.D() + ", " + this.d() + " " + this.M() + " " + this.Y() +
			//    16          :    01          :    07               0200
			" " + this.H() + ":" + this.i() + ":" + this.s() + " " + this.O();
			return r;
		},

		s : function () {
			// Seconds, with leading zeros
			var sec = String (date.getSeconds ());
			return (sec.length == 1 ? "0" + sec : sec);
		},        
		
		S : function () {
			// English ordinal suffix for the day of the month, 2 characters
			switch (date.getDate ()) {
				case  1: return ("st"); 
				case  2: return ("nd"); 
				case  3: return ("rd");
				case 21: return ("st"); 
				case 22: return ("nd"); 
				case 23: return ("rd");
				case 31: return ("st");
				default: return ("th");
			}
		},
		
		t : function () {
			// thanks to Matt Bannon for some much needed code-fixes here!
			var daysinmonths = [null,31,28,31,30,31,30,31,31,30,31,30,31];
			if (this.L()==1 && this.n()==2) return 29; // ~leap day
			return daysinmonths[this.n()];
		},
		
		U : function () {
			// Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
			return Math.round(date.getTime()/1000);
		},

		w : function () {
			// Numeric representation of the day of the week
			return date.getDay();
		},
		
		W : function () {
			// Weeknumber, as per ISO specification:
			// http://www.cl.cam.ac.uk/~mgk25/iso-time.html
		
			var DoW = this.N ();
			var DoY = this.z ();

			// If the day is 3 days before New Year's Eve and is Thursday or earlier,
			// it's week 1 of next year.
			var daysToNY = 364 + this.L () - DoY;
			if (daysToNY <= 2 && DoW <= (3 - daysToNY)) {
				return 1;
			}

			// If the day is within 3 days after New Year's Eve and is Friday or later,
			// it belongs to the old year.
			if (DoY <= 2 && DoW >= 5) {
				return new Date (this.Y () - 1, 11, 31).formatDate ("W");
			}
			
			var nyDoW = new Date (this.Y (), 0, 1).getDay ();
			nyDoW = nyDoW != 0 ? nyDoW - 1 : 6;

			if (nyDoW <= 3) { // First day of the year is a Thursday or earlier
				return (1 + Math.floor ((DoY + nyDoW) / 7));
			} else {  // First day of the year is a Friday or later
				return (1 + Math.floor ((DoY - (7 - nyDoW)) / 7));
			}
		},
		
		y : function () {
			// A two-digit representation of a year
			var y = String(this.Y());
			return y.substring(y.length-2,y.length);
		},        
		
		Y : function () {
			// A full numeric representation of a year, 4 digits
	
			// we first check, if getFullYear is supported. if it
			// is, we just use that. ppks code is nice, but wont
			// work with dates outside 1900-2038, or something like that
			if (date.getFullYear) {
				var newDate = new Date("January 1 2001 00:00:00 +0000");
				var x = newDate .getFullYear();
				if (x == 2001) {              
					// i trust the method now
					return date.getFullYear();
				}
			}
			// else, do this:
			// codes thanks to ppk:
			// http://www.xs4all.nl/~ppk/js/introdate.html
			var x = date.getYear();
			var y = x % 100;
			y += (y < 38) ? 2000 : 1900;
			return y;
		},

		
		z : function () {
			// The day of the year, zero indexed! 0 through 366
			var t = new Date("January 1 " + this.Y() + " 00:00:00");
			var diff = date.getTime() - t.getTime();
			return Math.floor(diff/1000/60/60/24);
		},

		Z : function () {
			// Timezone offset in seconds
			return (date.getTimezoneOffset () * -60);
		}        
	
	}

	function getSwitch(str) {
		if (switches[str] != undefined) {
			return switches[str]();
		} else {
			return str;
		}
	}

	var date;
	if (time) {
		var date = new Date (time);
	} else {
		var date = this;
	}

	var formatString = input.split("");
	var i = 0;
	while (i < formatString.length) {
		if (formatString[i] == "\\") {
			// this is our way of allowing users to escape stuff
			formatString.splice(i,1);
		} else {
			formatString[i] = getSwitch(formatString[i]);
		}
		i++;
	}
	
	return formatString.join("");
}


// Some (not all) predefined format strings from PHP 5.1.1, which 
// offer standard date representations.
// See: http://www.php.net/manual/en/ref.datetime.php#datetime.constants
//

// Atom      "2005-08-15T15:52:01+00:00"
Date.DATE_ATOM    = "Y-m-d\\TH:i:sP";
// ISO-8601  "2005-08-15T15:52:01+0000"
Date.DATE_ISO8601 = "Y-m-d\\TH:i:sO";
// RFC 2822  "Mon, 15 Aug 2005 15:52:01 +0000"
Date.DATE_RFC2822 = "D, d M Y H:i:s O";
// W3C       "2005-08-15T15:52:01+00:00"
Date.DATE_W3C     = "Y-m-d\\TH:i:sP";
if (window.loaded) loaded('formatDate.js');
/*!

 handlebars v1.3.0

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */

var Handlebars = (function() {
// handlebars/safe-string.js
var __module3__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module2__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr] || "&amp;";
  }

  function extend(obj, value) {
    for(var key in value) {
      if(Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;
  return __exports__;
})(__module3__);

// handlebars/exception.js
var __module4__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module1__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "1.3.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 4;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '>= 1.0.0'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) { fn.not = inverse; }
        this.helpers[name] = fn;
      }
    },

    registerPartial: function(name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = str;
      }
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(arg) {
      if(arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception("Missing helper: '" + arg + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;

      if (isFunction(context)) { context = context.call(this); }

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    instance.registerHelper('each', function(context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) { 
                data.key = key; 
                data.index = i;
                data.first = (i === 0);
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      if (!Utils.isEmpty(context)) return options.fn(context);
    });

    instance.registerHelper('log', function(context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, obj) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, obj);
        }
      }
    }
  };
  __exports__.logger = logger;
  function log(level, obj) { logger.log(level, obj); }

  __exports__.log = log;var createFrame = function(object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module2__, __module4__);

// handlebars/runtime.js
var __module5__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    if (!env) {
      throw new Exception("No environment passed to template");
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) { return result; }

      if (env.compile) {
        var options = { helpers: helpers, partials: partials, data: data };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = {};
          Utils.extend(ret, common);
          Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: env.VM.programWithDepth,
      noop: env.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var namespace = options.partial ? options : env,
          helpers,
          partials;

      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(
            container,
            namespace, context,
            helpers,
            partials,
            options.data);

      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }

      return result;
    };
  }

  __exports__.template = template;function programWithDepth(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var prog = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }

  __exports__.programWithDepth = programWithDepth;function program(i, fn, data) {
    var prog = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;
  return __exports__;
})(__module2__, __module4__, __module1__);

// handlebars.runtime.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module3__, __module4__, __module2__, __module5__);

  return __module0__;
})();
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Add inline notification support to functions as properties on an object.
// Signals this function as a responder to notifications with a given signature.
// By default, notifications are restricted to a XCS.Object instance only. Passing
// inOptAnyInstance as true will register this observer for all notification
// broadcasts for a given signature, regardless of scope.

Function.prototype.observes = function(inNotificationSignature, inOptAnyInstance) {
	if (!inNotificationSignature || !globalNotificationCenter()) return this;
	if (!this._observers) this._observers = [];
	this._observers.push([inNotificationSignature, inOptAnyInstance]);
	return this;
};

// Base object class. Identical to the Prototype implementation of a class
// hierarchy, adding support for object/class type introspection (isClass and
// isObject). Also adds support for inline notification registration to any
// XCS.Object property that is a function.

var XCS = XCS || new Object();

XCS.Object = Class.create({
	isObject: true,
	initialize: function(/* [inOptAttributes] */) {
		if (arguments.length > 0 && arguments[0]) Object.extend(this, arguments[0]);
		// Initialize any notification observers for this class.
		for (key in this) {
			var value = this[key];
			if (value && (XCS.typeOf(value) == XCS.T_FUNCTION)) {
				if (value._observers) {
					var observers = value._observers, observerIdx, observer;
					for (observerIdx = 0; observerIdx < observers.length; observerIdx++) {
						observer = observers[observerIdx];
						globalNotificationCenter().subscribe(observer[0], value.bind(this), (observer[1] == true ? undefined : this));
					}
				}
			}
		}
	},
	kindOf: function(klass) {
		return this.constructor.kindOf(klass);
	}
});

var ClassProtocol = {
	isClass: true,
	kindOf: function(klass) {
		if (this == klass || this.constructor == klass || klass.subclasses.include(this)) return true;
		if (klass.subclasses.length == 0) return false;
		return klass.subclasses.any(function(k) {
			return this.kindOf(k);
		}, this);
	}
};

Object.extend(XCS.Object, ClassProtocol);

// Wraps the prototype-default Class.create to support our ClassProtocol
// on the class instance it returns.

XCS.Object._create = Class.create;
Class.create = function() {
	var klass = XCS.Object._create.apply(this, arguments);
	Object.extend(klass, ClassProtocol);
	return klass;
};

// Global type constants.

Object.extend(XCS, {
	T_ERROR: 'error', T_OBJECT: 'object', T_NULL: 'null', T_CLASS: 'class', T_HASH: 'hash', T_FUNCTION: 'function',
	T_UNDEFINED: 'undefined', T_NUMBER: 'number', T_BOOL: 'boolean', T_ARRAY: 'array', T_STRING: 'string',
	T_DATE: 'date', T_REGEXP: 'regexp'
});

// Returns the type of a supplied item as a type constant. Returns undefined
// where the supplied item is also undefined. Supports both XCS.Object instances
// and prototype-style Class instances.

XCS.typeOf = function(item) {
	if (item === undefined) return XCS.T_UNDEFINED;
	if (item === null) return XCS.T_NULL;
	var ret = typeof(item);
	if (ret == 'object') {
		if (item instanceof Array) {
			ret = XCS.T_ARRAY;
		} else if (item instanceof Function) {
			ret = (item.isClass || item.addMethods) ? XCS.T_CLASS : XCS.T_FUNCTION;
		} else if (item instanceof Date) {
			ret = (item.isClass || item.addMethods) ? XCS.T_CLASS : XCS.T_DATE;
		} else if (item instanceof RegExp) {
			ret = (item.isClass || item.addMethods) ? XCS.T_CLASS : XCS.T_REGEXP;
		} else if (item.isObject || item.addMethods === undefined) {
			return XCS.T_OBJECT;
		} else ret = XCS.T_HASH;
	} else if (ret === XCS.T_FUNCTION) {
		ret = (item.isClass || item.addMethods) ? XCS.T_CLASS : XCS.T_FUNCTION;
	}
	return ret;
};

// Utility method which returns true if an object is an instance of a supplied class
// or one of its subclasses, and false otherwise.

XCS.kindOf = function(object, klass) {
	if (object && !object.isClass) object = object.constructor;
	return !!(object && object.kindOf && object.kindOf(klass));
};

// Traverses a property path returning an object instance where it exists.

XCS.objectForPropertyPath = function(path, root, stopAt) {
	var loc, nextDotAt, key, max;
	if (!root) root = window;
	if (XCS.typeOf(path) === XCS.T_STRING) {
		if (stopAt === undefined) stopAt = path.length;
		loc = 0;
		while((root) && (loc < stopAt)) {
			nextDotAt = path.indexOf('.', loc) ;
			if ((nextDotAt < 0) || (nextDotAt > stopAt)) nextDotAt = stopAt;
			key = path.slice(loc, nextDotAt);
			root = root[key];
			loc = nextDotAt + 1;
		}
		if (loc < stopAt) root = undefined;
	}
	return root;
};

// Given a property path, returns a materialized object where the object at that
// path is a constructor, otherwise returns the object itself.

XCS.objectInstanceForPropertyPath = function(path) {
	var obj = ((XCS.typeOf(path) == XCS.T_STRING) ? XCS.objectForPropertyPath(path) : path);
	if (obj == undefined) return obj;
	return (XCS.typeOf(obj) == XCS.T_OBJECT) ? obj : new obj();
};

// Deep clones an object.

XCS.deepClone = function(inObject) {
	if (XCS.typeOf(inObject) != XCS.T_OBJECT) return inObject;
	if (inObject == null) return inObject;
	var newObject = new Object();
	for (var key in inObject) newObject[key] = XCS.deepClone(inObject[key]);
	return newObject;
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Breaks a string into an array of tokens.

String.prototype.w = function() {
	var result = [], parts = this.split(' '), length = parts.length;
	for (var idx = 0; idx < length; idx++) {
		var part = parts[idx] ;
		if (part.length !== 0) result.push(part);
	}
	return result;
};

// Returns true if a string is just whitespace.

String.prototype.isWhitespace = function() {
	return this.match(/^[ \t\r\n]+$/);
};

// Substitutes into a string. Borrowed from SproutCore.

String.prototype.fmt = function() {
	var args = arguments;
	var idx  = 0;
	return this.replace(/%@([0-9]+)?/g, function(s, argIndex) {
		argIndex = (argIndex) ? parseInt(argIndex,0) - 1 : idx++;
		s = args[argIndex];
		return ((s === null) ? '(null)' : (s === undefined) ? '' : s).toString(); 
	});
};

// Returns a string with the first character uppercased. We have a seperate method for this
// versus Prototype#capitalize method because Prototype downcases the entire string before
// uppercasing the first character.

String.prototype.capitalizeFirstCharacter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.titleCase = function() {
    return this.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

String.prototype.trim = function() {
	return this.toString().replace(/^[\s\t\n\r]*|[\s\t\n\r]*$/g,'');
};

// Returns a random string.

var buildRandomString = function(inLength) {
	var result = "";
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var idx = 0; idx < (inLength || 5); idx++) {
		result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}
	return result;
};

// Does a string look like a GUID?

var looksLikeGUID = function(inString) {
	return (inString || "").match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
};

// Returns the intersection of an array of strings and a given array of strings (an array of items
// where items exist in both arrays). Accepts an optional inDifferenceInstead flag where the difference
// between the first and second arrays will be returned instead (an array of items in the second
// array but NOT in the first).

var stringArrayIntersection = function(firstArray, secondArray, inDifferenceInstead) {
	var shortestArray = firstArray, longestArray = secondArray;
	if (firstArray.length > secondArray.length) {
		longestArray = firstArray;
		shortestArray = secondArray;
	}
	// If we're building the intersection, loop over the shortest array and build
	// a result of keys that exist in the shortest array and the hash we just built.
	// If we're building the difference, do the opposite.
	var hashingArray = (inDifferenceInstead ? shortestArray : longestArray);
	var hash = {}, idx, length = hashingArray.length;
	for (idx = 0; idx < length; idx++) {
		hash[hashingArray[idx]] = true;
	}
	var loopingArray = shortestArray;
	if (inDifferenceInstead) loopingArray = longestArray;
	var value, length = loopingArray.length, result = [];
	for (idx = 0; idx < length; idx++) {
		value = loopingArray[idx];
		if ((value in hash) && !inDifferenceInstead) {
			result.push(value);
		}
		if (inDifferenceInstead && !(value in hash)) {
			result.push(value);
		}
	}
	return result;
};

var stringArrayDifference = function(firstArray, secondArray) {
	return stringArrayIntersection(firstArray, secondArray, true);
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Creates a global that you can use to refer to an instance of a class.  Shared
// instances are referenced using a supplied name, and can be created on-demand or on
// page load (depending on the value of inOptInstantiateOnAwakeFromPage).  Auto-creating
// happens as soon as the document object is available, instead of waiting around for the
// window onload event.

Class.createWithSharedInstance = function(inOptInstanceShortcutName, inOptInstantiateOnAwakeFromPage) {
	var cls = null;
	cls = function() {
		var result = this.initialize.apply(this, arguments);
		if (result == invalidate) {
			var timeoutCallback = function() {
				try {
					if (this && this['_parentClass'] && this['_parentClass']['_sharedInstance'] == this) {
						this['_parentClass']['_sharedInstance'] = null;
					}
				}
				catch(e) {
					throw e;
				}
			}
			setTimeout(timeoutCallback.bind(this), 200);
		}
	}
	cls.autocreate = inOptInstantiateOnAwakeFromPage;
	cls.sharedInstance = function() {
		if (!cls['_sharedInstance']) {
			cls['_sharedInstance'] = new cls();
			cls['_sharedInstance']['_parentClass'] = cls;
		}
		return cls['_sharedInstance'];
	}
	if (inOptInstanceShortcutName) window[inOptInstanceShortcutName] = cls.sharedInstance;
	if (inOptInstantiateOnAwakeFromPage) {
		if (typeof(globalNotificationCenter) !== "undefined") {
			globalNotificationCenter().subscribe('PAGE_INITIALIZE_FINISHED', function() {
				if (cls.autocreate) cls.sharedInstance();
			});
		}
	}
	return cls;
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



// Javascript port of NSNotificationCenter allowing you to broadcasting notifications.
// Basically a notification dispatch table where callback functions can be registered
// and executed when a notification is received matching a given name from a given sender.
// Delivers notifications to observers synchronously.

XCS.Notifications = XCS.Notifications || new Object();
XCS.Notifications.Mixins = XCS.Notifications.Mixins || new Object();

// Optimization when broadcasting notifications to a large number of recipients.

XCS.Notifications.Mixins.SupportsOptimizedNotifications = {
	mSupportsOptimizedNotifications: true,
	// Returns a unique string identifier representation for this object. Allows us
	// to look up notification recievers for a targeted notification in linear time.
	getNotificationsIdentifer: function() { /* Interface */ }
};

XCS.Notifications.GlobalNotificationCenter = Class.createWithSharedInstance('globalNotificationCenter');
XCS.Notifications.GlobalNotificationCenter.prototype = {
	initialize: function() {
		// A hash of callback functions keyed by notification identifier.
		this.mGenericSubscribers = {};
		// A hash of targeted callbacks keyed by notification identifer.
		this.mTargetedSubscribers = {};
		// An optimized hash of targeted callbacks keyed by message name and notification identifier.
		this.mOptimizedTargetedSubscribers = {};
	},
	publish: function(inMessage, inObject, inOptExtras) {
		if (!inMessage) return false;
		var shouldNotifyGenericSubscribers = true;
		if (inObject != undefined) {
			// Notify any targeted subscribers.
			if (inObject.mSupportsOptimizedNotifications) {
				var optimized = this.mOptimizedTargetedSubscribers[inMessage];
				if (optimized) {
					var optimizedSubscriber = optimized[inObject.getNotificationsIdentifer()];
					if (optimizedSubscriber) optimizedSubscriber(inMessage, inObject, inOptExtras);
					shouldNotifyGenericSubscribers = false;
				}
			} else {
				var targetedSubscribers = this.mTargetedSubscribers[inMessage];
				if (targetedSubscribers) {
					var targetedIdx, targetedSubscriber, callback;
					for (targetedIdx = 0; targetedIdx < targetedSubscribers.length; targetedIdx++) {
						targetedSubscriber = targetedSubscribers[targetedIdx];
						callback = targetedSubscriber[0], o = targetedSubscriber[1];
						if (o == inObject && callback) callback(inMessage, inObject, inOptExtras);
					}
					shouldNotifyGenericSubscribers = false;
				}
			}
		}
		// Notify any generic subscribers (if we need to)
		if (shouldNotifyGenericSubscribers) {
			var callbacks = this.mGenericSubscribers[inMessage], callbackIdx, callback;
			if (callbacks) {
				for (callbackIdx = 0; callbackIdx < callbacks.length; callbackIdx++) {
					callback = callbacks[callbackIdx];
					callback(inMessage, inObject, inOptExtras);
				}
			}
		}
		// Always signal the test tool where it exists.
		if (window.parent && window.parent.AppleUnitTester) {
			window.parent.AppleUnitTester.sharedTester().publishMessage(inMessage);
		}
		return true;
	},
	subscribe: function(inMessage, inCallback, inOptObject) {
		if (!inMessage || !inCallback) return false;
		// Is this subscription targeted?
		if (inOptObject != undefined) {
			if (inOptObject.mSupportsOptimizedNotifications) {
				if (!this.mOptimizedTargetedSubscribers[inMessage]) this.mOptimizedTargetedSubscribers[inMessage] = {};
				var notificationID = inOptObject.getNotificationsIdentifer();
				var targetedSubscribersForMessage = this.mOptimizedTargetedSubscribers[inMessage];
				targetedSubscribersForMessage[notificationID] = inCallback;
			} else {
				if (!this.mTargetedSubscribers[inMessage]) this.mTargetedSubscribers[inMessage] = new Array();
				this.mTargetedSubscribers[inMessage].push([inCallback, inOptObject]);
			}
		} else {
			if (!this.mGenericSubscribers[inMessage]) this.mGenericSubscribers[inMessage] = new Array();
			this.mGenericSubscribers[inMessage].push(inCallback);
		}
	},
	batchSubscribe: function(inMessages, inCallback, inOptObject) {
		for (var idx = 0; idx < inMessages.length; idx++) {
			this.subscribe(inMessages[idx], inCallback, inOptObject);
		}
	},
	unsubscribe: function(inMessage, inCallback, inOptObject) {
		if (inOptObject) {
			if (inOptObject.mSupportsOptimizedNotifications) {
				var optimized = this.mOptimizedTargetedSubscribers[inMessage];
				if (optimized) return optimized.unset(inOptObject.getNotificationsIdentifer());
				return true;
			}
			var targeted = this.mTargetedSubscribers[inMessage]
			if (targeted) {
				this.mTargetedSubscribers = this.mTargetedSubscribers[inMessage].reject(function(subscriber) {
					return (subscriber[0] == inCallback && subscriber[1] == inOptObject);
				});
			}
		}
		if (!this.mGenericSubscribers[inMessage]) return false;
		this.mGenericSubscribers = this.mGenericSubscribers[inMessage].without(inCallback);
		return true;
	},
	batchUnsubscribe: function(inMessages, inCallback, inOptObject) {
		for (var idx = 0; idx < inMessages.length; idx++) {
			this.unsubscribe(inMessages[idx], inCallback, inOptObject);
		}
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.Accessibility = XCS.Accessibility || new Object();

// Tab index name constants.

/* Header menu items */
XCS.Accessibility.TAB_INDEX_NAME_NAV_GENERAL 			= 'cc-tab-index-header-general';
XCS.Accessibility.TAB_INDEX_NAME_NAV_EDIT 				= 'cc-tab-index-header-edit';
XCS.Accessibility.TAB_INDEX_NAME_NAV_DOWNLOAD 			= 'cc-tab-index-header-download';
XCS.Accessibility.TAB_INDEX_NAME_NAV_SCOREBOARD 			= 'cc-tab-index-header-scoreboard';
XCS.Accessibility.TAB_INDEX_NAME_NAV_PLUS 				= 'cc-tab-index-header-plus';
XCS.Accessibility.TAB_INDEX_NAME_NAV_PLUS_NEW_BOT		= 'cc-tab-index-header-plus-new-bot';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR 				= 'cc-tab-index-header-gear';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_MOVE 			= 'cc-tab-index-header-gear-move';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_APPROVE 		= 'cc-tab-index-header-gear-approve';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_DELETE 		= 'cc-tab-index-header-gear-delete';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_HIDE 			= 'cc-tab-index-header-gear-hide';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_USER_SETTINGS 	= 'cc-tab-index-header-gear-user-settings';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_BOT_DELETE 	= 'cc-tab-index-header-gear-bot-delete';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_BOT_SETTINGS 	= 'cc-tab-index-header-gear-bot-settings';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_ABOUT 			= 'cc-tab-index-header-gear-about';
XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_HELP 			= 'cc-tab-index-header-gear-help';
XCS.Accessibility.TAB_INDEX_NAME_NAV_LOGIN 				= 'cc-tab-index-header-login';
XCS.Accessibility.TAB_INDEX_NAME_NAV_LOGOUT 				= 'cc-tab-index-header-logout';
XCS.Accessibility.TAB_INDEX_NAME_NAV_SEARCH 				= 'cc-tab-index-header-search';

/* Banner menu items */
XCS.Accessibility.TAB_INDEX_NAME_BANNER_HOME 			= 'cc-tab-index-banner-home';
XCS.Accessibility.TAB_INDEX_NAME_BANNER_ACTIVITY 		= 'cc-tab-index-banner-activity';
XCS.Accessibility.TAB_INDEX_NAME_BANNER_DOCUMENTS 		= 'cc-tab-index-banner-documents';
XCS.Accessibility.TAB_INDEX_NAME_BANNER_TAGS 			= 'cc-tab-index-banner-tags';
XCS.Accessibility.TAB_INDEX_NAME_BANNER_CALENDAR 		= 'cc-tab-index-banner-calendar';
XCS.Accessibility.TAB_INDEX_NAME_BANNER_BLOG 			= 'cc-tab-index-banner-blog';

/* Filter menu items */
XCS.Accessibility.TAB_INDEX_NAME_FILTER_MAIN 			= 'cc-tab-index-filter-main';
XCS.Accessibility.TAB_INDEX_NAME_FILTER_SORT_BY 			= 'cc-tab-index-filter-sort-by';
XCS.Accessibility.TAB_INDEX_NAME_FILTER_SORT_BY_TYPE 	= 'cc-tab-index-filter-sort-by-type';
XCS.Accessibility.TAB_INDEX_NAME_FILTER_KEYWORD 			= 'cc-tab-index-filter-keyword';
XCS.Accessibility.TAB_INDEX_NAME_FILTER_SAVE 			= 'cc-tab-index-filter-save';
XCS.Accessibility.TAB_INDEX_NAME_FILTER_DONE				= 'cc-tab-index-filter-done';

/* Sidebar menu items */
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_TAGS 						= 'cc-tab-index-sidebar-tags';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_TAGS_TEXTBOX 				= 'cc-tab-index-sidebar-tags-textbox';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_TAGS_COLLECTION 			= 'cc-tab-index-sidebar-tags-collection';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_RELATED 					= 'cc-tab-index-sidebar-related';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_RELATED_SEARCH 				= 'cc-tab-index-sidebar-related-search';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_RELATED_RECENT 				= 'cc-tab-index-sidebar-related-recent';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_COMMENTS 					= 'cc-tab-index-sidebar-comments';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_NOTIFICATIONS 				= 'cc-tab-index-sidebar-notifications';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY 					= 'cc-tab-index-sidebar-history';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_SHOWMORE			= 'cc-tab-index-sidebar-history-showmore';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_CLOSE 		= 'cc-tab-index-sidebar-history-action-close';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_RESTORE	 	= 'cc-tab-index-sidebar-history-action-restore';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_SHOWCHANGES 	= 'cc-tab-index-sidebar-history-action-showchanges';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_HIDECHANGES 	= 'cc-tab-index-sidebar-history-action-hidechanges';
XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_SHARING 					= 'cc-tab-index-sidebar-sharing';

/* Popup items - Settings */
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_GENERAL 					= 'cc-tab-index-popup-settings-general';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_APPEARANCE 				= 'cc-tab-index-popup-settings-appearance';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_APPEARANCE_PARAMS		= 'cc-tab-index-popup-settings-appearance-params';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS 				= 'cc-tab-index-popup-settings-permissions';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_NAME 		= 'cc-tab-index-popup-settings-permissions-name';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_ACCESS 		= 'cc-tab-index-popup-settings-permissions-access';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_COMMENTS		= 'cc-tab-index-popup-settings-permissions-comments';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_MODERATION	= 'cc-tab-index-popup-settings-permissions-moderation';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_BUTTON_SAVE				= 'cc-tab-index-popup-settings-button-save';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_BUTTON_CANCEL			= 'cc-tab-index-popup-settings-button-cancel';

/* Popup items - Dialog */
XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_NEW_PAGE		 			= 'cc-tab-index-popup-new-page';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_DELETE_PAGE				= 'cc-tab-index-popup-move-delete-page';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_UPLOAD_FILE_TO_DOCUMENTS	= 'cc-tab-index-popup-upload-file-to-documents';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_MOVE_SIMPLETEXT			= 'cc-tab-index-popup-move-simpletext';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_OK_BUTTON 					= 'cc-tab-index-popup-ok-button';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_CANCEL_BUTTON 				= 'cc-tab-index-popup-cancel-button';

/* Popup items - Dialog */
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_BOT_SETTINGS_TABS					= 'cc-tab-index-popup-create-bot-settings-tabs';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_INFO_VIEW					= 'cc-tab-index-popup-create-new-bot-info-view';			// (Step 1/4)
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_SCHEDULE_VIEW				= 'cc-tab-index-popup-create-new-bot-schedule-view';		// (Step 2/4)
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_TESTING_VIEW				= 'cc-tab-index-popup-create-new-bot-testing-view';			// (Step 3/4)
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_NOTIFICATION_VIEW			= 'cc-tab-index-popup-create-new-bot-notification-view';	// (Step 4/4)
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_TESTING_VIEW_DEVICES		= 'cc-tab-index-popup-create-new-bot-testing-view-devices';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_SCHEDULE_VIEW_SELECT_BOX	= 'cc-tab-index-popup-create-new-bot-schedule-view-select-box';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_BUTTON_CANCEL				= 'cc-tab-index-popup-create-new-bot-button-cancel';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_BUTTON_PREVIOUS 			= 'cc-tab-index-popup-create-new-bot-button-previous';
XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_BUTTON_NEXT 				= 'cc-tab-index-popup-create-new-bot-button-next';

/* List of items (Activities, Documents) */
XCS.Accessibility.TAB_INDEX_NAME_LIST_ITEMS 	= 'cc-tab-index-list-items';

/* XCode - Bot List */ 
XCS.Accessibility.TAB_INDEX_NAME_BOT_LIST 	= 'cc-tab-index-bot-list';

/* Bot Header View items */
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_ENTITY_TITLE 					= 'cc-tab-index-bot-header-view-entity-title';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY 						= 'cc-tab-index-bot-header-view-summary';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_INFO 					= 'cc-tab-index-bot-header-view-summary-info';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS 				= 'cc-tab-index-bot-header-view-summary-results';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_ERRORS 			= 'cc-tab-index-bot-header-view-summary-results-errors';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_WARNINGS 		= 'cc-tab-index-bot-header-view-summary-results-warnings';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_ISSUES 			= 'cc-tab-index-bot-header-view-summary-results-issues';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_TESTS_SUMMARY 	= 'cc-tab-index-bot-header-view-summary-results-tests-summary';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_DOWNLOADS 				= 'cc-tab-index-bot-header-view-summary-downloads';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS 							= 'cc-tab-index-bot-header-view-tests';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_HEADER					= 'cc-tab-index-bot-header-view-tests-header';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_DETAILS					= 'cc-tab-index-bot-header-view-tests-details';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_DEVICE					= 'cc-tab-index-bot-header-view-tests-device';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_BOTTOM					= 'cc-tab-index-bot-header-view-tests-bottom';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_INFO 						= 'cc-tab-index-bot-header-view-tests-info';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS					= 'cc-tab-index-bot-header-view-tests-results';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TOTALS			= 'cc-tab-index-bot-header-view-tests-results-total';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TESTS_FAILED 		= 'cc-tab-index-bot-header-view-tests-results-tests-failed';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TESTS_PASSED 		= 'cc-tab-index-bot-header-view-tests-results-tests-passed';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_COMMITS 						= 'cc-tab-index-bot-header-view-commits';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_LOGS 							= 'cc-tab-index-bot-header-view-logs';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_ARCHIVES 						= 'cc-tab-index-bot-header-view-archives';
XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_INTEGRATE						= 'cc-tab-index-bot-header-view-integrate';

XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP									= 'cc-tab-index-bot-summary-top';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_LAST_INTEGRATION				= 'cc-tab-index-bot-summary-top-last-integration';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_LAST_INTEGRATION_VIEW_SUMMARY 	= 'cc-tab-index-bot-summary-top-last-integration-view-summary';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_NEXT_INTEGRATION				= 'cc-tab-index-bot-summary-top-next-integration';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_NEXT_INTEGRATION_INTEGRATE_NOW	= 'cc-tab-index-bot-summary-top-next-integration-integrate-now';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_DOWNLOADS						= 'cc-tab-index-bot-summary-top-downloads';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_DOWNLOADS_VIEW_ARCHIVES			= 'cc-tab-index-bot-summary-top-downloads-view-archives';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_DOWNLOADS_ARCHIVE_LINK			= 'cc-tab-index-bot-summary-top-downloads-archive-link';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_BOTTOM								= 'cc-tab-index-bot-summary-bottom';
XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_BOTTOM_LIST 						= 'cc-tab-index-bot-summary-bottom-list';

XCS.Accessibility.TAB_INDEX_NAME_MAP = {};
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GENERAL] = '10';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_EDIT] = '20';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_DOWNLOAD] = '30';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_SCOREBOARD] = '40';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_PLUS] = '50';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_PLUS_NEW_BOT] = '51';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR] = '60';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_MOVE] = '70';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_APPROVE] = '80';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_DELETE] = '90';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_HIDE] = '100';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_WIKI_SETTINGS] = '110';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_REPLACE] = '120';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_USER_SETTINGS] = '130';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_BOT_DELETE] = '131';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_BOT_SETTINGS] = '132';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_ABOUT] = '140';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_GEAR_HELP] = '150';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_LOGIN] = '160';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_LOGOUT] = '170';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_NAV_SEARCH] = '180';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BANNER_HOME] = '200';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BANNER_ACTIVITY] = '210';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BANNER_DOCUMENTS] = '220';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BANNER_TAGS] = '230';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BANNER_CALENDAR] = '240';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BANNER_BLOG] = '250';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_FILTER_MAIN] = '260';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_FILTER_SORT_BY] = '270';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_FILTER_SORT_BY_TYPE] = '280';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_FILTER_KEYWORD] = '290';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_FILTER_SAVE] = '291';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_FILTER_DONE] = '292';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_TAGS] = '300';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_TAGS_TEXTBOX] = '310';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_TAGS_COLLECTION] = '320';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_RELATED] = '330';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_RELATED_SEARCH] = '340';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_RELATED_RECENT] = '350';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_COMMENTS] = '360';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_NOTIFICATIONS] = '370';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY] = '380';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_SHOWMORE] = '390';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_CLOSE] = '501';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_RESTORE] = '502';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_SHOWCHANGES] = '503';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_HISTORY_ACTION_HIDECHANGES] = '504';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_SIDEBAR_SHARING] = '600';

// used for list of tags in the side bar
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_TAGS_COLLECTION] = '700';

// used for list of documents, activities, etc
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_LIST_ITEMS] = '1000'; 

/* Popups */
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_GENERAL] = '2000';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_APPEARANCE] = '2100';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_APPEARANCE_PARAMS] = '2101';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS] = '2200';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_NAME] ='2210';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_ACCESS] ='2220';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_COMMENTS] ='2230';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_PERMISSIONS_MODERATION] ='2240';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_BUTTON_SAVE] = '2301';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_SETTINGS_BUTTON_CANCEL] = '2302';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_NEW_PAGE] = '2400'; 					// Popup: New Page in My Documents...
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_DELETE_PAGE] = '2410';					// Popup: Delet Page...
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_UPLOAD_FILE_TO_DOCUMENTS] = '2420'; 	// Popup: Upload File to My Documents...
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_MOVE_TO_WIKI_NAME] = '2430'; 			// Popup: Move to Wiki...
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_MOVE_TO_WIKI_RESULT] = '2440';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_MOVE_SIMPLETEXT] = '2450';				// Popups: Log out, About, etc..
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_OK_BUTTON] = '2901'; 					// Popup Buttons: OK, CANCEL
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_DIALOG_CANCEL_BUTTON] = '2902';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_BOT_SETTINGS_TABS] = '2900';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_INFO_VIEW] = '2910';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_SCHEDULE_VIEW] = '2920';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_SCHEDULE_VIEW_SELECT_BOX] = '2921';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_TESTING_VIEW] = '2940';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_TESTING_VIEW_DEVICES] = '2945';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_NOTIFICATION_VIEW] = '2960';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_BUTTON_CANCEL] = '2970';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_BUTTON_PREVIOUS] = '2980';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_POPUP_CREATE_NEW_BOT_BUTTON_NEXT] = '2990';

// Used for traveling through list of bots on the left side bar
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_LIST] = '3000';

XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_ENTITY_TITLE] = '3100';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY] = '3200';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_INFO] = '3210';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS] = '3220';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_ERRORS] = '3221';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_WARNINGS] = '3222';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_ISSUES] = '3223';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_TESTS_SUMMARY] = '3224';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_DOWNLOADS] = '3230';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS] = '3300';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_HEADER] = '3301';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_INFO] = '3310';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS] = '3320';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TOTAL] = '3321';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TESTS_FAILED] = '3322';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TESTS_PASSED] = '3323';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_DETAILS] = '3400';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_DEVICE] = '3410';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_BOTTOM] = '3500';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_COMMITS] = '3600';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_LOGS] = '3700';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_ARCHIVES] = '3800';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_INTEGRATE] = '4100';

// Summary Bot View
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP] = '3211';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_LAST_INTEGRATION] = '3213';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_LAST_INTEGRATION_VIEW_SUMMARY] = '3214';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_NEXT_INTEGRATION] = '3225';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_NEXT_INTEGRATION_INTEGRATE_NOW] = '3226';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_DOWNLOADS] = '3231';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_DOWNLOADS_VIEW_ARCHIVES] = '3232';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_TOP_DOWNLOADS_ARCHIVE_LINK] = '3233';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_BOTTOM] = '4000';
XCS.Accessibility.TAB_INDEX_NAME_MAP[XCS.Accessibility.TAB_INDEX_NAME_BOT_SUMMARY_BOTTOM_LIST] = '4010';

XCS.Accessibility.TabIndexerElements = [];
XCS.Accessibility.TabIndexerElements_Panel = [];

XCS.Accessibility.accessibility = Class.createWithSharedInstance('accessibility', true);

XCS.Accessibility.accessibility.prototype = {
	initialize: function() {
		// Root views element for a basic dialog
		XCS.Accessibility.TabIndexerElements.push('root');
		XCS.Accessibility.TabIndexerElements.push('quicksearch');
		XCS.Accessibility.TabIndexerElements.push('table_block_settings_dialog');
		XCS.Accessibility.TabIndexerElements.push('dialog_mask');
		XCS.Accessibility.TabIndexerElements.push('table_block_inline_popup');
		XCS.Accessibility.TabIndexerElements.push('progress_message_dialog');
		XCS.Accessibility.TabIndexerElements.push('search');
		
		// Root views element for a panel modal window
		XCS.Accessibility.TabIndexerElements_Panel.push('header');
		XCS.Accessibility.TabIndexerElements_Panel.push('main');
		XCS.Accessibility.TabIndexerElements_Panel.push('dialog_mask');
		XCS.Accessibility.TabIndexerElements_Panel.push('table_block_inline_popup');
		XCS.Accessibility.TabIndexerElements_Panel.push('progress_message_dialog');
		XCS.Accessibility.TabIndexerElements_Panel.push('search');
	},
	
	/* Return tabIndex for a given element name */
	requestTabIndex: function(inName) {
		return XCS.Accessibility.TAB_INDEX_NAME_MAP[inName];
	},	
	/* Set aria-hidden attribute on root views located behind modal dialogs */
	setRootViewsAriaHidden: function(isHidden, isPanel) {
		if (!isPanel) {
			for (i=0; i < XCS.Accessibility.TabIndexerElements.length; i++) {
				if ($(XCS.Accessibility.TabIndexerElements[i]))
					$(XCS.Accessibility.TabIndexerElements[i]).writeAttribute('aria-hidden', isHidden.toString());
			}			
		} else {
			for (i=0; i < XCS.Accessibility.TabIndexerElements_Panel.length; i++) {
				if ($(XCS.Accessibility.TabIndexerElements_Panel[i]))
					$(XCS.Accessibility.TabIndexerElements_Panel[i]).writeAttribute('aria-hidden', isHidden.toString());
			}			
		}
	},
	/* Set aria-hidden attribute on root views (parent view) from an iframe */
	setRootViewsAriaHiddenFromIframe: function(isHidden) {
		for (i=0; i < XCS.Accessibility.TabIndexerElements.length; i++) {
			if (window.parent.document.getElementById(XCS.Accessibility.TabIndexerElements[i])) {
				window.parent.document.getElementById(XCS.Accessibility.TabIndexerElements[i]).writeAttribute('aria-hidden', isHidden.toString());
			}			
		}
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.ActivityQueueContext = Class.create({
	mQueue: null,
	mPopper: null,
	mDisarmed: false,
	initialize: function ready(inQueue, inPopper) {
		this.mQueue = inQueue;
		this.mPopper = inPopper;
	},
	ready: function ready() {
		if (this.mDisarmed) {
			return;
        }
		
		this.mDisarmed = true;
		this.mQueue.subscribe(this.mPopper);
	}
});

XCS.ActivityQueue = Class.create({
	mPendingMessages: null,
	mBlockedAt: null,
	mCoalesce: false,
	initialize: function initialize(inOptCoalesce) {
		this.mPendingMessages = [];
		this.mBlockedAt = [];
		if (inOptCoalesce !== undefined) {
			this.mCoalesce = inOptCoalesce;
        }
	},
	push: function push(inMessageOrObject, inObj, inOptExtras) {
		var message = inOptExtras;
		if (!Object.isArray(message)) {
			message = [message];
        }

		for (var i = 0; i < message.length; i++)
		{
			if (typeof(message[i]) == 'object') {
				message[i].action = inMessageOrObject;
			}
			if (this.mBlockedAt.length > 0) {
				this._execute(this.mBlockedAt.shift(), message[i]);
            }
			else {
				this._coalesceAndAppend(message[i]);
            }
		}
	},
	pop: function pop(inPopper) {
		if (this.mPendingMessages.length > 0) {
			this._execute(inPopper, this.mPendingMessages.shift());
        }
		else {
			this.mBlockedAt.push(inPopper);
        }
	},
	subscribe: function subscribe(inPopper) {
		var context = new XCS.ActivityQueueContext(this, inPopper);
		this.pop(function(inActivity){
			inPopper(inActivity, context);
		});
	},
    queue_size: function queue_size() {
        return this.mBlockedAt.length;
    },
	_execute: function _execute(inPopper, inMessage) {
		XCS.RunLoop.nextTick(function(){
			inPopper(inMessage);
		}, inMessage);
	},
	_coalesceAndAppend: function _coalesceAndAppend(inMessage) {
		if (!this.mCoalesce ||
			 XCS.ActivityQueue.COALESCING_ACTIVITY_TYPES.indexOf(inMessage.action) == -1)
		{
			this.mPendingMessages.push(inMessage);
			return;
		}
		
		for (var i = 0; i < this.mPendingMessages.length; i++)
		{
			if (this.mPendingMessages[i].action == inMessage.action &&
				this.mPendingMessages[i].entityGUID == inMessage.entityGUID) {
				return;
            }
		}
		
		this.mPendingMessages.push(inMessage);
	}
});

XCS.ActivityQueue.COALESCING_ACTIVITY_TYPES = ['com.apple.activity.EntityUpdated'];
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
//
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



var apple_loc_strings = apple_loc_strings || {};

XCS.LocalizationManager = Class.createWithSharedInstance('globalLocalizationManager', false);
XCS.LocalizationManager.prototype = {
	_strings: {},
	initialize: function() {
	    this.setStrings(apple_loc_strings);
	},
	setStrings: function(stringsHash) {
	    Object.extend(this._strings, stringsHash);
	},
	localize: function(key) {
		return this._strings[key] || key;
	},
	getLprojLocale: function() {
		var LANGUAGE_TO_LPROJ_MAP = {
		  'de': 'de',
		  'en': 'en',
		  'es': 'es',
		  'fr': 'fr',
		  'it': 'it',
		  'ja': 'ja',
		  'ko': 'ko',
		  'nl': 'nl',
		  'zh-cn': 'zh_CN',
		  'zh-tw': 'zh_TW'
		};
		var browserLocale = navigator.language || navigator.browserLanguage || 'en';
		var lProjLocale = LANGUAGE_TO_LPROJ_MAP[browserLocale];
		if (!lProjLocale) {
			// If we can't find an exact match on language AND region, try language alone.
			// For ex, browser can return zh-cn, but also fr-fr or ja-jp, and in the last 2 cases we need to match on fr and ja.
			lProjLocale = LANGUAGE_TO_LPROJ_MAP[browserLocale.split('-')[0]];
		}
		return lProjLocale || 'en';
	},
	localizedDay: function(inDate, inOptUseShortFormat) {
		var adjustedDate = this.adjustDateForUTCOffset(inDate);
		if (adjustedDate) {
			var day_index = adjustedDate.getDay();
			if (day_index < 7) {
				if (inOptUseShortFormat) {
					return "_Date.Short.Day.Names".loc().split(',')[day_index];
				} else {
					return "_Date.Day.Names".loc().split(',')[day_index];
				}
			}
		}
		return "_Date.Unknown".loc();
	},
	localizedDate: function(inDate, inOptUseShortFormat) {
		var adjustedDate = this.adjustDateForUTCOffset(inDate);
		if (adjustedDate) {
			var day_delta = this.calculateDayDeltaForDateFromToday(adjustedDate);
			if (day_delta == 0) {
				return "_Date.Today".loc();
			} else if (day_delta == -1) {
				return "_Date.Yesterday".loc();
			} else if (day_delta == 1) {
				return "_Date.Tomorrow".loc();
			} else {
				var month = adjustedDate.getMonth();
				var localizedMonth;
				if (inOptUseShortFormat) {
					localizedMonth = "_Date.Short.Month.Names".loc().split(',')[month % 12];
				} else {
					localizedMonth = "_Date.Month.Names".loc().split(',')[month % 12];
				}
				var day = adjustedDate.getDate();
				if (Math.abs(day_delta) <= 365) {
					return "_Date.Short.Format".loc(localizedMonth, day);
				} else {
					var year = adjustedDate.getFullYear();
					return "_Date.Long.Format".loc(localizedMonth, day, year);
				}
			}
		}
		return "_Date.Unknown".loc();
	},
	localizedDateWithTime: function(inDate, inOptUseShortFormat) {
		if (inDate) {
			return "_DateTime.Format".loc(this.localizedDate(inDate, inOptUseShortFormat), this.localizedTime(inDate));
		}
		return "_DateTime.Unknown".loc();
	},
	localizedTime: function(inDate) {
		var adjustedDate = this.adjustDateForUTCOffset(inDate);
		if (adjustedDate) {
			var hours = adjustedDate.getHours();
			var am = false;
			if (hours == 0) {
				hours = 12;
				am = true;
			} else if (hours < 12) {
				if (hours > 0) am = true;
			} else if (hours > 12) {
				hours -= 12;
			}
			var minutes = adjustedDate.getMinutes();
			if (minutes < 10) minutes = "0" + minutes;
			return "_Time.Default.Format".loc(hours, minutes, (am ? "_Time.AM".loc() : "_Time.PM".loc()));
		}
		return "_Time.Unknown".loc();
	},
	// Returns a "Today", "Yesterday", "XX at YY:ZZ PM" UTC-adjusted formatted date string.
	localizedDateTime: function(inDate) {
		if (inDate) {
			var adjustedDate = this.adjustDateForUTCOffset(inDate);
			if (adjustedDate) {
				var date = this.localizedDate(adjustedDate);
				var time = this.localizedTime(adjustedDate);
				return "_DateTime.Format".loc(date, time);
			}
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns a "Day at YY:ZZ PM" date string.
	localizedDayAndTime: function(inDate) {
		if (inDate) {
			var adjustedDate = this.adjustDateForUTCOffset(inDate);
			if (adjustedDate) {
				var localizedDay = this.localizedDay(adjustedDate);
				var localizedTime = this.localizedTime(adjustedDate);
				return "_DateTime.Format".loc(localizedDay, localizedTime);
			}
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns the time if the given date is today, otherwise a XX/YY/ZZZZ at AA:BB UTC-adjusted formatted date time string.
	shortLocalizedDateTime: function(inDate) {
		if (inDate) {
			var adjustedDate = this.adjustDateForUTCOffset(inDate);
			if (adjustedDate) {
				var day_delta = this.calculateDayDeltaForDateFromToday(adjustedDate);
				if (day_delta == 0) {
					return this.localizedTime(adjustedDate);
				} else {
					// Remember to increment the month value since they're zero-indexed.
					var localizedDate = "_Date.Default.Format".loc((adjustedDate.getMonth() + 1), adjustedDate.getDate(), adjustedDate.getFullYear());
					var localizedTime = this.localizedTime(adjustedDate);
					return "_DateTime.Format".loc(localizedDate, localizedTime);
				}
			}
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns a "XX/YY/ZZZZ" date string.
	shortLocalizedDate: function(inDate) {
		if (inDate) {
			var adjustedDate = this.adjustDateForUTCOffset(inDate);
			if (adjustedDate) {
				// Remember to increment the month value since they're zero-indexed.
				return "_Date.Default.Format".loc((adjustedDate.getMonth() + 1), adjustedDate.getDate(), adjustedDate.getFullYear());
			}
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns a "XX/YY/ZZ" date string.
	shortestLocalizedDate: function(inDate) {
		if (inDate) {
			var adjustedDate = this.adjustDateForUTCOffset(inDate);
			if (adjustedDate) {
				// Remember to increment the month value since they're zero-indexed.
				return "_Date.Default.Format".loc((adjustedDate.getMonth() + 1), adjustedDate.getDate(), adjustedDate.getFullYear().toString().substr(2,2));
			}
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns a "XX/YY/ZZZZ HH:MM AM" date time string.
	shortLocalizedDateAndTime: function(inDate) {
		if (inDate) {
			return "_DateTime.NoAt.Format".loc(this.shortLocalizedDate(inDate), this.localizedTime(inDate));
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns a "XX/YY/ZZ HH:MM AM" date time string.
	shortestLocalizedDateAndTime: function(inDate) {
		if (inDate) {
			return "_DateTime.NoAt.Format".loc(this.shortestLocalizedDate(inDate), this.localizedTime(inDate));
		}
		return "_DateTime.Unknown".loc();
	},
	// Returns a "Mon DD YYYY" date time string.
	shortLocalizedDateWithMonthAsString: function(inDate) {
		var adjustedDate = this.adjustDateForUTCOffset(inDate);
		if (adjustedDate) {
			var month = adjustedDate.getMonth();
			var localizedMonth = "_Date.Short.Month.Names".loc().split(',')[month % 12];
			var day = adjustedDate.getDate();
			var year = adjustedDate.getFullYear();
			return "_Date.Long.Format".loc(localizedMonth, day, year);
		}
		return "_Date.Unknown".loc();
	},
	// Returns a "Mon DD YYYY HH:MM AM" if torday, or "Mon DD YYYY" date time string.
	shortLocalizedDateWithMonthAsStringWithTodaysTime: function(inDate) {
		var adjustedDate = this.adjustDateForUTCOffset(inDate);		
		if (adjustedDate) {
			var day_delta = this.calculateDayDeltaForDateFromToday(adjustedDate);
			var month = adjustedDate.getMonth();
			var day = adjustedDate.getDate();
			var year = adjustedDate.getFullYear();
			var localizedMonth = "_Date.Short.Month.Names".loc().split(',')[month % 12];
			
			if (day_delta == 0) {
				var time = this.localizedTime(adjustedDate);
				return "_Date.Long.WithTime.Format".loc(localizedMonth, day, year,time);
			}
			else {
				return "_Date.Long.Format".loc(localizedMonth, day, year);
			}
		}
		return "_Date.Unknown".loc();
	},
	calculateDayDeltaForDateFromToday: function(inDate) {
		return this.calculateDayDeltaForDateFromDate(inDate, new Date());
	},
	calculateDayDeltaForDateFromDate: function(inDate, inSecondDate) {
		if (!inDate || !inSecondDate) return undefined;
		// Strip everything but the day/month/year from the supplied dates.
		var inSecondDateStripped = new Date(inSecondDate.getFullYear(), inSecondDate.getMonth(), inSecondDate.getDate());
		var inDateStripped = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate());
		// If the difference between the two dates is zero, the day delta is 0.
		var dateDifference = inSecondDateStripped.getTime() - inDateStripped.getTime();
		// If the difference is greater than zero, the supplied date is before the stripped today date.
		// Otherwise if the difference is less than zero, the supplied date is after the stripped today
		// date. We negate the result here so one full day in the past is returned as -1.
		if (dateDifference > 0) {
			return -1 * ((dateDifference / (1000 * 60 * 60)) / 24)
		} else if (dateDifference < 0) {
			return ((Math.abs(dateDifference) / (1000 * 60 * 60)) / 24)
		} else {
			return 0;
		}
	},
	adjustDateForUTCOffset: function(inDate) {
		if (!inDate) return undefined;
		var dt = new Date();
		var offset = dt.getTimezoneOffset();
		var gmt_offset = inDate.getTimezoneOffset();
		var minutes_delta = offset - gmt_offset;
		inDate.setMinutes(inDate.getMinutes() + minutes_delta);
		return inDate;
	},
	localizedFileSize: function(inBytes) {
		if (!inBytes) return inBytes;
		if (inBytes < 1024) {
			return Math.round(inBytes) + " Bytes";
		} else if (inBytes < 1048576) {
			return Math.round(((inBytes / 1024) * 100) / 100)  + " KB";
		} else if (inBytes < 1073741824) {
			return  Math.round(((inBytes / 1048576) * 100) / 100) + " MB";
		} else {
			return  Math.round(((inBytes / 1073741824) * 100) / 100) + " GB";
		}
	},
	localizedDuration: function(inStartDate, inEndDate) {
		if (!inStartDate || !inEndDate) return;
		var delta = Math.abs(inEndDate.getTime() - inStartDate.getTime());
		var dayDifference = Math.floor(delta / (1000 * 60 * 60 * 24));
		delta = (delta % (1000 * 60 * 60 * 24));
		
		if (dayDifference > 1) {
			return "_Duration.MoreThanADay".loc();
		}
		
		var hourDifference = Math.floor(delta / (1000 * 60 * 60));
		delta = (delta % (1000 * 60 * 60));
		
		var minuteDifference = Math.floor(delta / (1000 * 60));
		delta = (delta % (1000 * 60));
		
		var secondDifference = Math.floor(delta / 1000);
		
		if (hourDifference >= 1) {
			if (hourDifference == 1) {
				if (minuteDifference == 1) {
					return "_Duration.SingleHourSingleMinutes".loc();
				} else {
					return "_Duration.SingleHourMinutes".loc(minuteDifference);
				}
			} else {
				if (minuteDifference == 1) {
					return "_Duration.PluralHourSingleMinutes".loc(hourDifference);
				} else {
					return "_Duration.PluralHourMinutes".loc(hourDifference, minuteDifference);
				}
			}
		}
		if (minuteDifference <= 1) {
			return "_Duration.LessThanAMinute".loc();
		} else {
			return "_Duration.Minutes".loc(minuteDifference);
		}
	},
	localizedTimeDuration: function(inTime) {
		var delta = inTime;
		var dayDifference = Math.floor(delta / (1000 * 60 * 60 * 24));
		delta = (delta % (1000 * 60 * 60 * 24));
		
		if (dayDifference > 1) {
			return "_Duration.MoreThanADay".loc();
		}
		
		var hourDifference = Math.floor(delta / (1000 * 60 * 60));
		delta = (delta % (1000 * 60 * 60));
		
		var minuteDifference = Math.floor(delta / (1000 * 60));
		delta = (delta % (1000 * 60));
		
		var secondDifference = Math.floor(delta / 1000);
		
		if (hourDifference >= 1) {
			if (hourDifference == 1) {
				if (minuteDifference == 1) {
					return "_Duration.SingleHourSingleMinutes".loc();
				} else {
					return "_Duration.SingleHourMinutes".loc(minuteDifference);
				}
			} else {
				if (minuteDifference == 1) {
					return "_Duration.PluralHourSingleMinutes".loc(hourDifference);
				} else {
					return "_Duration.PluralHourMinutes".loc(hourDifference, minuteDifference);
				}
			}
		}
		if (minuteDifference <= 1) {
			return "_Duration.LessThanAMinute".loc();
		} else {
			return "_Duration.Minutes".loc(minuteDifference);
		}
	},
	// Returns something like "Just now", "5 min ago", or "In 2 hrs"
	localizedTimeShift: function(inDate) {
		if (!inDate) return;
		var delta = Date.now() - inDate.getTime();
		var future = (delta < 0);
		delta = Math.abs(delta);
		
		// if we're in the future, and have non-zero seconds, add a minute for more "natural" countdowns
		if (future && Math.floor((delta % (1000 * 60)) / 1000) > 0)
			delta += (1000 * 60);
		
		var dayDifference = Math.floor(delta / (1000 * 60 * 60 * 24));
		delta = (delta % (1000 * 60 * 60 * 24));
		
		if (dayDifference >= 1) {
			if (dayDifference == 1) {
				return (future) ? "_TimeDifference.InSingleDays".loc() : "_TimeDifference.SingleDaysAgo".loc();
			} else {
				return (future) ? "_TimeDifference.InPluralDays".loc(dayDifference) : "_TimeDifference.PluralDaysAgo".loc(dayDifference);
			}
		}
		
		var hourDifference = Math.floor(delta / (1000 * 60 * 60));
		delta = (delta % (1000 * 60 * 60));
		
		var minuteDifference = Math.floor(delta / (1000 * 60));
		delta = (delta % (1000 * 60));
		
		var secondDifference = Math.floor(delta / 1000);
		
		if (hourDifference >= 1) {
			if (hourDifference == 1) {
				return (future) ? "_TimeDifference.InSingleHours".loc() : "_TimeDifference.SingleHoursAgo".loc();
			} else {
				return (future) ? "_TimeDifference.InPluralHours".loc(hourDifference) : "_TimeDifference.PluralHoursAgo".loc(hourDifference);
			}
		}
		
		if (minuteDifference < 1) {
			return (future) ? "_TimeDifference.InSingleMinutes".loc() : "_TimeDifference.LessThanAMinuteAgo".loc();
		} else if (minuteDifference == 1) {
			return (future) ? "_TimeDifference.InSingleMinutes".loc() : "_TimeDifference.SingleMinutesAgo".loc();
		} else {
			return (future) ? "_TimeDifference.InPluralMinutes".loc(minuteDifference) : "_TimeDifference.PluralMinutesAgo".loc(minuteDifference);
		}
	}
};

// Localizes a string.

String.prototype.loc = function() {
	var str = globalLocalizationManager().localize(this);
	return str.fmt.apply(str, arguments);
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.




// Does the browser support localStorage?
function browserSupportsLocalStorage() {
	try {
		return (('localStorage' in window) && window['localStorage'] != null);
	} catch (e) {
		return false;
	}
}


// Does the browser support addEventListener?

function browserSupportsAddEventListener() {
	try {
		return (('addEventListener' in window) && window['addEventListener'] != null);
	} catch (e) {
		return false;
	}
}

function browserSupportsModifyBodyClassName() {
	try {
		return (document && document.body && ('addClassName' in document.body) && document.body['addClassName'] != null);
	} catch (e) {
		return false;
	}
}

function browserSupportsJSON() {
	try {
		return (JSON !== undefined);
	} catch (e) {
		return false;
	}
}

XCS.Browser = Class.createWithSharedInstance('browser');
XCS.Browser.prototype = {
	initialize: function initialize() {
        this.mUserAgent = null;
	},
	addBrowserVersionToBodyTag: function addBrowserVersionToBodyTag(name) {
		var matches;
		if (this.isMobile()) {
			this.addClassName('mobile');
		}
		if (this.isiOS5Plus()) {
			this.addClassName('ios5plus');
		}
		if (this.isiOS6Plus()) {
			this.addClassName('ios6plus');
		}
		if (this.isiPhone()) {
			this.addClassName('iphone');
			return true;
		} else if (this.isiPod()) {
			this.addClassName('ipod');
			return true;
		} else if (this.isiPad()) {
			this.addClassName('ipad');
			return true;
		} else if (this.isSafari81Plus()) {
			this.addClassName('safari81');
			return true;
        } else if (this.isSafari5Plus()) {
            this.addClassName('safari5');
            return true;
		} else if (matches = this.getUserAgent().match(/(Chrome|Firefox)\/([\d]+)/)) {
			if (matches && matches[1] !== null && matches[2] !== null) {
				var application = matches[1];
				var version = parseFloat(matches[2]);
				if (application == "Chrome" && version >= 11) {
					this.addClassName('chrome11plus');
					return true;
				} else if (application == "Firefox" && version >= 4) {
					this.addClassName('firefox4plus');
					return true;
				}
			}
		} else if (matches = this.getUserAgent().match(/MSIE ([\d]+)/)) {
			if (matches && matches[1] !== null) {
				if (parseFloat(matches[1]) >= 9) {
					this.addClassName('ie9plus');
					return true;
				} else if (tridentMatches == this.getUserAgent().match(/Trident\/([\d]+)/)) {
					if (tridentMatches && tridentMatches[1] !== null) {
						if (parseFloat(tridentMatches[1]) >= 5) {
							this.addClassName('ie9plus');
							return true;
						}
					}
				}
			}
		} else if (matches = this.getUserAgent().match(/Mozilla\/5.0 \(Windows NT/)) {
			if (matches && matches[0] != null) {
				this.addClassName('ie9plus');
				return true;
			}
		}
		this.addClassName('unsupported_browser');
		alert("_UnsupportedBrowser.Warning".loc());
		return false;
	},
	locale: function locale() {
		return (navigator.language ? navigator.language : navigator.browserLanguage || 'en').split('-')[0];
	},
	isIE: function isIE() {
		return document.all && /MSIE/.test(this.getUserAgent());
	},
	isIE6: function isIE6() {
		return document.all && /MSIE 6/.test(this.getUserAgent());
	},
	isIE7: function isIE7() {
		return document.all && /MSIE 7/.test(this.getUserAgent());
	},
	isIE8: function isIE8() {
		return document.all && /MSIE 8/.test(this.getUserAgent());
	},
	isIE9: function isIE9() {
		return document.all && /MSIE 9/.test(this.getUserAgent());
	},
	isWebKit: function isWebKit() {
		return /WebKit/.test(this.getUserAgent());
	},
	isSafari: function isSafari() {
		return /AppleWebKit\/.+Version/.test(this.getUserAgent());
	},
	isSafari4: function isSafari4() {
		return /AppleWebKit\/.+Version\/4/.test(this.getUserAgent());
	},
	isSafari5: function isSafari5() {
		return /AppleWebKit\/.+Version\/5/.test(this.getUserAgent());
	},
	isSafari6: function isSafari6() {
		return /AppleWebKit\/.+Version\/6/.test(this.getUserAgent());
	},
	isSafari5Plus: function isSafari5Plus() {
		var matches = this.getUserAgent().match(/AppleWebKit\/.+Version\/([\d]+)/);
		if (matches && matches[1] != null) {
			if (parseFloat(matches[1]) >= 5) {
				return true
			}
		}
		return false;
	},
    isSafari81Plus: function isSafari81Plus() {
        var matches = this.getUserAgent().match(/AppleWebKit\/.+Version\/([\d]+(\.\d+)?)/);
		if (matches && matches[1] != null) {
			if (parseFloat(matches[1]) >= 8.1) {
				return true
			}
		}
		return false;
    },
	isMobile: function isMobile() {
		return /Mobile/.test(this.getUserAgent());
	},
	isMobileSafari: function isMobileSafari() {
		return / AppleWebKit\/.+Mobile\//.test(this.getUserAgent());
	},
	isiPad: function isiPad() {
		return this.isMobileSafari() && /iPad/.test(this.getUserAgent());
	},
	isiPhone: function isiPhone() {
		return this.isMobileSafari() && /iPhone/.test(this.getUserAgent());
	},
	isiPod: function isiPod() {
		return this.isMobileSafari() && /iPod/.test(this.getUserAgent());
	},
	isiOS4Plus: function isiOS4Plus() {
		var matches = this.getUserAgent().match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d)/);
		if (matches && matches.length > 0) {
			var version = parseFloat(matches[4]);
			if (version >= 4) {
				return true;
			}
		}
		return false;
	},
	isiOS5Plus: function isiOS5Plus() {
		var matches = this.getUserAgent().match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d)/);
		if (matches && matches.length > 0) {
			var version = parseFloat(matches[4]);
			if (version >= 5) {
				return true;
			}
		}
		return false;
	},
	isiOS6Plus: function isiOS6Plus() {
		var matches = this.getUserAgent().match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d)/);
		if (matches && matches.length > 0) {
			var version = parseFloat(matches[4]);
			if (version >= 6) {
				return true;
			}
		}
		return false;
	},
	isiOS: function isiOS() {
		var matches = this.getUserAgent().match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d)/);
		if (matches && matches.length > 0) {
			return true;
		}
		return false;
	},
	isChrome: function isChrome() {
		return /Chrome/.test(this.getUserAgent());
	},
	isGecko: function isGecko() {
		return /Gecko\/\d*/.test(this.getUserAgent());
	},
	isFirefox: function isFirefox() {
		return this.isGecko();
	},
	isCamino: function isCamino() {
		return /Gecko\/\d*.+Camino\/\d*/.test(this.getUserAgent());
	},
	isOpera: function isOpera() {
		return /Opera/.test(this.getUserAgent());
	},
	isMacintosh: function isMacintosh() {
		return /Macintosh/.test(this.getUserAgent());
	},
	isWindows: function isWindows() {
		return /Windows/.test(this.getUserAgent());
	},
	isLinux: function isLinux() {
		return /X11/.test(this.getUserAgent());
	},
	addClassName: function addClassName(inClassName) {
		if (browserSupportsModifyBodyClassName()) {
			document.body.classList.add(inClassName);
		}
	},
	deleteCookiesForCurrentDomain: function deleteCookiesForCurrentDomain() {
		var coockies = document.cookie.split(';');
		for (var i = 0; i < coockies.length; i++) {
			var cookie = coockies[i];
			var equalFound = cookie.indexOf("=");
			var expiration = "";
			if (equalFound > -1) {
				expiration = cookie.substr(0, equalFound);
			}
			else {
				expiration = cookie;
			}
			document.cookie = expiration + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	},
    getUrlParam: function getUrlParams(inParam) {
        if (inParam !== undefined) {
            var params = location.search.replace("?", "");
            params = params.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                if (param[0] == inParam) {
                    return param[1];
                }
            }
            return "";
        }
        else {
            return location.search.replace("?", "");
        }
    },
    hasDebugParam: function(inParam) {
        if (inParam !== undefined) {
            var params = this.getUrlParam('debug');
            params = params.split(',');
            if (params.indexOf(inParam) == -1) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    },
    setMeta: function setMeta(name, val) {
        var node = document.createElement('meta');
        node.writeAttribute('name', name);
        node.writeAttribute('content', val);
        document.head.appendChild(node);
    },
    getUserAgent: function getUserAgent() {
        if (this.mUserAgent !== null) {
            return this.mUserAgent;
        }
        else {
            return navigator.userAgent;
        }
    },
    _setUserAgent: function _setUserAgent(inUserAgent) {
        if (inUserAgent !== undefined) {
            this.mUserAgent = inUserAgent;
        }
    }
};

browser();
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.Logger = XCS.Logger || new Object();

XCS.Logger.LOG_LEVEL_DEBUG = 'debug';
XCS.Logger.LOG_LEVEL_INFO = 'info';
XCS.Logger.LOG_LEVEL_WARN = 'warn';
XCS.Logger.LOG_LEVEL_ERROR = 'error';
XCS.Logger.LOG_LEVEL_NONE = 'none';
XCS.Logger.LOG_ORDERING = [XCS.Logger.LOG_LEVEL_NONE, XCS.Logger.LOG_LEVEL_ERROR, XCS.Logger.LOG_LEVEL_WARN, XCS.Logger.LOG_LEVEL_INFO, XCS.Logger.LOG_LEVEL_DEBUG];

XCS.Logger.GlobalLoggerSharedInstance = Class.createWithSharedInstance('logger');
XCS.Logger.GlobalLoggerSharedInstance.prototype = {
	mLogLevel: XCS.Logger.LOG_LEVEL_INFO,
	initialize: function(/* [options] */) {
		if (arguments.length && arguments[0]) Object.extend(this, arguments[0]);
		// Use some bind magic for IE since console properties aren't true functions.
		if (document.all && /MSIE/.test(navigator.userAgent)) {
			if (!window.console) this.mLogLevel = XCS.Logger.LOG_LEVEL_NONE;
			if (this.mLogLevel != XCS.Logger.LOG_LEVEL_NONE && Function.prototype.bind && console && typeof console.log == "object") {
				$A(['log', 'info', 'warn', 'error']).each(function (method) {
					console[method] = this.bind(console[method], console);
			    }, Function.prototype.call);
			}
		}
		this.setLogLevel(this.mLogLevel);
	},
	setLogLevel: function(inLogLevel) {
		if (!inLogLevel) return false;
		if (!this._ensureLogging()) return;
		this.mLogLevel = XCS.Logger.LOG_LEVEL_INFO;
		this.info("Logger initialized (log level: %o)", inLogLevel);
		this.mLogLevel = inLogLevel;
	},
	debug: function(inLogMessage /*, [args] */) {
		if (!this._ensureLogging()) return;
		if (!this._ensureLogLevel(XCS.Logger.LOG_LEVEL_DEBUG)) return;
		console.log.apply(console, arguments);
	},
	info: function(inLogMessage /*, [args] */) {
		if (!this._ensureLogging()) return;
		if (!this._ensureLogLevel(XCS.Logger.LOG_LEVEL_INFO)) return;
		console.info.apply(console, arguments);
	},
	warn: function(inLogMessage /*, [args] */) {
		if (!this._ensureLogging()) return;
		if (!this._ensureLogLevel(XCS.Logger.LOG_LEVEL_WARN)) return;
		console.warn.apply(console, arguments);
	},
	error: function(inLogMessage /*, [args] */) {
		if (!this._ensureLogging()) return;
		if (!this._ensureLogLevel(XCS.Logger.LOG_LEVEL_ERROR)) return;
		console.error.apply(console, arguments);
	},
	_ensureLogging: function() {
		return (this.mLogLevel != XCS.Logger.LOG_LEVEL_NONE && console && console.log && console.info && console.warn && console.error);
	},
	_ensureLogLevel: function(inLogLevel) {
		var index = XCS.Logger.LOG_ORDERING.indexOf(inLogLevel)
		if (index == -1) return false;
		return (index <= XCS.Logger.LOG_ORDERING.indexOf(this.mLogLevel))
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.






XCS.ActivityStream = XCS.ActivityStream || new Object();

// Notifications.

XCS.ActivityStream.NOTIFICATION_DID_CONNECT = 'DID_CONNECT';
XCS.ActivityStream.NOTIFICATION_DID_DISCONNECT = 'DID_DISCONNECT';
XCS.ActivityStream.NOTIFICATION_DID_FAIL_CONNECT = 'DID_FAIL_CONNECT';
XCS.ActivityStream.NOTIFICATION_DID_ERROR = 'DID_ERROR';
XCS.ActivityStream.NOTIFICATION_DID_GET_HEARTBEAT = 'DID_GET_HEARTBEAT';
XCS.ActivityStream.NOTIFICATION_DID_GET_NEW_INTEGRATION_STATUS = 'DID_GET_NEW_INTEGRATION_STATUS';
XCS.ActivityStream.NOTIFICATION_DID_GET_ADVISORY_INTEGRATION_STATUS = 'DID_GET_ADVISORY_INTEGRATION_STATUS';
XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_UPDATED_STATUS = 'DID_GET_BOT_UPDATED_STATUS';
XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_REMOVED_STATUS = 'DID_GET_BOT_REMOVED_STATUS';
XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_CREATED_STATUS = 'DID_GET_BOT_CREATED_STATUS';
XCS.ActivityStream.NOTIFICATION_NO_STREAM_ACTIVITY = 'NO_STREAM_ACTIVITY';
XCS.ActivityStream.NOTIFICATION_ACTIVITY_STREAM_SHOULD_RECONNECT = 'ACTIVITY_STREAM_SHOULD_RECONNECT';
XCS.ActivityStream.NOTIFICATION_DID_GET_INTEGRATION_REMOVED_STATUS = 'DID_GET_INTEGRATION_REMOVED_STATUS';
XCS.ActivityStream.IFRAME_NO_ACTIVITY_INTERVAL = 300000;

XCS.ActivityStream.Socket = Class.create({
    mSocket: null,
    mCallBack: null,
    initialize: function initialize( /* [options] */ ) {
        if (arguments && arguments.length > 0) {
            Object.extend(this, arguments[0]);
        }

        var server = "%@//%@:%@".fmt(window.location.protocol, window.location.hostname, window.location.port);
        try {
            var delay = 1000 * 10;
            var socket = io.connect(server, {
                'resource': 'xcode/internal/socket.io',
                'reconnect': true,
                // Manually specify a reconnection limit because by default, each attempt is delayed exponentially by (attempt * delay)
                'reconnection limit': delay,
                // Never stop reconnecting
                'max reconnection attempts': Infinity,
                'force new connection': true
            });

            socket.on('connect', function sockectConnect() {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Socket connection established");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_CONNECT, this, undefined);
            }.bind(this));

            socket.on('disconnect', function socketDisconnect() {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().warn("Socket connection disconnected");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_DISCONNECT, this, undefined);
            }.bind(this));

            socket.on('connect_failed', function sicketConnectionFailed(exception) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().error("Socket connection failed", exception);
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_FAIL_CONNECT, this, undefined);
            }.bind(this));

            socket.on('error', function sockectError(exception) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().error("Error received on socket connection", exception);
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_ERROR, this, undefined);
            }.bind(this));

            socket.on('hrtb', function socketHeartbeat(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Heartbeat");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_HEARTBEAT, this, data);
            });

            socket.on('integrationStatus', function socketIntegrationStatus(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Integration status received");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_NEW_INTEGRATION_STATUS, this, data);
            });

            socket.on('advisoryIntegrationStatus', function socketAdvisoryIntegrationStatus(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Advisory integration status received");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_ADVISORY_INTEGRATION_STATUS, this, data);
            });

            socket.on('botRemoved', function socketBotRemoved(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Bot removed notification received");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_REMOVED_STATUS, this, data);
            });

            socket.on('botCreated', function socketBotCreated(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Bot created notification received");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_CREATED_STATUS, this, data);
            });

            socket.on('botUpdated', function socketBotUpdated(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Bot updated notification received");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_UPDATED_STATUS, this, data);
            });

            socket.on('integrationRemoved', function socketIntegrationRemoved(data) {
                if (browser().hasDebugParam('show_stream_updates')) {
                    logger().info("Integration removed notification received");
                }
                globalNotificationCenter().publish(XCS.ActivityStream.NOTIFICATION_DID_GET_INTEGRATION_REMOVED_STATUS, this, data);
            });

            this.mSocket = socket;
        } catch (e) {
            console.error('Failed to load socket.io library ', e);
        }
    },
    getSocket: function () {
        return this.mSocket;
    }
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.BotStorage = Class.createWithSharedInstance('botStorage');
XCS.BotStorage.prototype = {
	initialize: function initialize() {
		this.mBots = {};
        this.mBotsTinyIds = {};
	},
	addBot: function addBot(inBot) {
		if (inBot !== undefined && inBot !== null) {
            if (this.getBot(inBot.getId()) !== null) {
                var bot = this.getBot(inBot.getId());
                bot.update(inBot);
            }
            else {
                this.mBots[inBot.getId()] = inBot;
                this.mBotsTinyIds[inBot.getTinyId()] = inBot.getId();
            }
		}
	},
    removeBot: function removeBot(inBotId) {
        if (inBotId !== undefined && inBotId !== null) {
			var bot = this.getBot(inBotId);
            if (bot !== null) {
                delete this.mBots[inBotId];
            }
		}
    },
	getBot: function getBot(inBotId) {
		if (inBotId !== undefined && this.mBots[inBotId] !== undefined) {
			return this.mBots[inBotId];
		}
		else {
			return null;
		}
	},
	getBots: function getBots() {
		return this.mBots;
	},
    getBotsArray: function getBotsArray(inParam) {
        var bots = this.mBots;
        var botArray = [];
        
        for (var key in bots) {
            botArray.push(bots[key]);
        }
        
        if (inParam !== undefined && inParam.sort !== undefined) {
            switch(inParam.sort) {
                case 'alphabetical': 
                    botArray.sort(this._botNameAscSorter);
                    break;
                default:
                    botArray.sort(this._botNameAscSorter);
                    break;
            }
        }
        
        return botArray;
    },
	getBotName: function getBotName(inBotId) {
		var bot = this.getBot(inBotId);
		if (bot !== null) {
			return bot.getName();
		}
		else {
			return "";
		}
	},
	getLength: function getLength() {
		return Object.keys(this.mBots).length;
	},
    hasBots: function hasBots() {
        if (this.getLength() > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    getBotIdFromTinyId: function getBotIdFromTinyId(inTinyId) {
        if (this.mBotsTinyIds[inTinyId] !== undefined) {
            var botId = this.mBotsTinyIds[inTinyId];
            return botId;
        }
        else {
            return null;
        }
    },
    getBotByTinyId: function getBotByTinyId(inTinyId) {
        if (this.mBotsTinyIds[inTinyId] !== undefined) {
            var botId = this.mBotsTinyIds[inTinyId];
            return this.getBot(botId);
        }
        else {
            return null;
        }
    },
    hasTinyId: function hasTinyId(inTinyId) {
        if (this.mBotsTinyIds[inTinyId] !== undefined) {
             return true;
        }
        else {
            return false;
        }
    },
    hasBot: function hasBot(inBotId) {
        if (inBotId !== undefined && this.mBots[inBotId] !== undefined) {
            return true;
        }
        else {
            return false;
        }
    },
    reset: function reset() {
        for (var key in this.mBots) {
            delete this.mBots[key];
        }
        this.mBots = null;
        
        for (var tinyId in this.mBotsTinyIds) {
            delete this.mBotsTinyIds[tinyId];
        }
        this.mBots = null;
        this.mBotsTinyIds = null;
        
        this.mBots = {};
        this.mBotsTinyIds = {};
    },
    _botNameAscSorter: function _botNameAscSorter(a, b) {
		var aBotName = a.getName().toLowerCase();
		var bBotName = b.getName().toLowerCase();
		if (aBotName < bBotName) {
			return -1;
        }
		else if (aBotName > bBotName) {
			return 1;
        }
		else
		{
			return 0;
		}
	}
};
botStorage();
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

function createDateObjFromISO8601(inISOString, inOptIsGMT) {
	if (!inISOString) return null;
	var str = inISOString.match(/[Tt]/) ? inISOString : inISOString+'T000000Z';
	var d = str.match(/(\d{4})-?(\d{2})-?(\d{2})\s*[Tt]?(\d{2}):?(\d{2}):?(\d{2})/);
	if (!d) return null; // bail if the format doesn't match
	var dt = new Date(d[1], d[2]-1, d[3], d[4], d[5], d[6]);
	if (inOptIsGMT) dt.setHours(dt.getHours()-(dt.getTimezoneOffset() / 60));
	return dt;
}

// Copied from calendar_widget_core
function padNumberStr(theNumber, digits) {
	var padder = ((arguments.length > 2) ? arguments[2] : '0');
	var theString = "";
	theString += theNumber;
	
	for (var i = 0; i < (digits-theString.length); i++) {
		theString = padder + theString;
	}
	
	return theString;
}

function dateObjToISO8601(inDateObj, inOptMakeGMT, inIncludeZ) {
	if (!inDateObj) return null;
	var includeZ = (arguments.length > 2 ? inIncludeZ : true);
	var dt = new Date(inDateObj.getTime()); // copy the incoming date
	if (inOptMakeGMT) dt.setHours(dt.getHours()-(dt.getTimezoneOffset() / (-60)));
	var iso_string = '';
	iso_string += dt.getFullYear()
				+ padNumberStr(dt.getMonth()+1, 2)
				+ padNumberStr(dt.getDate(), 2)
				+ 'T'
				+ padNumberStr(dt.getHours(), 2)
				+ padNumberStr(dt.getMinutes(), 2)
				+ padNumberStr(dt.getSeconds(), 2)
				+ (includeZ ? 'Z' : '');
	return iso_string;
}

function getEndDateUsingDuration(inDate, inDuration) {
	var dt = new Date(inDate.getTime());
	if (inDuration.days) dt.setDate(dt.getDate() + inDuration.days);
	if (inDuration.hours) dt.setHours(dt.getHours() + inDuration.hours);
	if (inDuration.minutes) dt.setMinutes(dt.getMinutes() + inDuration.minutes);
	if (inDuration.seconds) dt.setMinutes(dt.getSeconds() + inDuration.seconds);
	return dt;
}

function getDurationUsingEndDate(inStartDate, inEndDate) {
	var time = Math.floor((inEndDate.getTime() - inStartDate.getTime()) / 1000);
	var whole = (time < 0 ? Math.ceil : Math.floor);
	var duration = {days:whole(time / 86400)};
	time = time % 86400;
	duration.hours = whole(time / 3600);
	time = time % 3600;
	duration.minutes = whole(time / 60);
	duration.seconds = time % 60;
	return duration;
}

function durationFromISO8601(inISOString) {
	if (!inISOString) return null; // bail if we're not being handed a string
	var dt = inISOString.match(/^P([^T]*)T?(.*)$/);
	if (!dt) return null; // bail if string isn't a valid format
	var duration = new Object();
	['years', 'months', 'days', 'hours', 'minutes', 'seconds'].each(function(key, i) {
		var mat = dt[Math.floor(i/3)+1].match("([0-9]+)"+key.charAt(0).toUpperCase());
		duration[key] = mat ? parseInt(mat[1]) : 0;
	});
	return duration;
}

function durationToISO8601(inDuration) {
	var str = 'P';
	if (inDuration.years && inDuration.years > 0) str += inDuration.years+'Y';
	if (inDuration.months && inDuration.months > 0) str += inDuration.months+'M';
	if (inDuration.days && inDuration.days > 0) str += inDuration.days+'D';
	str += 'T';
	if (inDuration.hours && inDuration.hours > 0) str += inDuration.hours+'H';
	if (inDuration.minutes && inDuration.minutes > 0) str += inDuration.minutes+'M';
	if (inDuration.seconds && inDuration.seconds > 0) str += inDuration.seconds+'S';
	return str;
}

function getLocalizedHourKey(inHours, inOptMinutes) {
	var dt = new Date();
	dt.setHours(inHours);
	dt.setMinutes(inOptMinutes||0);
	var formatString = (inOptMinutes && inOptMinutes > 0 ? '_Dates.DateFormats.HourAndMinutes' : '_Dates.DateFormats.Hour');
	return dt.formatDate(formatString.loc());
}

function getTimeRangeDisplayString(inStartDate, inDuration) {
	if (inDuration.days > 0 && inDuration.hours == 0 && inDuration.minutes == 0) {
		var str = inStartDate.formatDate('_Dates.DateFormats.MediumDate'.loc());
		if (inDuration.days > 1) {
			var endDate = getEndDateUsingDuration(inStartDate, inDuration);
			endDate.setDate(endDate.getDate()-1);
			str += ' - ' + endDate.formatDate('_Dates.DateFormats.MediumDate'.loc());
		}
		return str;
	}
	var time_string = getLocalizedHourKey(inStartDate.getHours(), inStartDate.getMinutes());
	var endDate = getEndDateUsingDuration(inStartDate, inDuration);
	return inStartDate.formatDate('_Dates.DateFormats.MediumDate'.loc()) + '; ' + time_string + ' - ' + getLocalizedHourKey(endDate.getHours(), endDate.getMinutes());
}
;
// Copyright (c) 2014 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

/*
    dispatch.js
    A minimal kind of "GCD Lite" for use in the CalDAV library.
    
    This library does not provide actual concurrency, but it does allow you
    to serialize operations on a queue. This is used in CalDAV to simulate "pseudo-background"
    tasks. For example, when creating an event store for the current principal, the lookup
    request for the current principal is dispatched to a background queue. This allows the
    event store object to be returned immediately in a "not fully initialized" state,
    letting object methods that need full state to be delayed until everything is
    ready to run.
    
    Every attempt has been made to mimic the existing GCD API, though some
    functions have been modified to more appropriately suit JavaScript use cases.
    
    SPECIAL NOTE: if you perform an *actually* asynchronous operation inside a
    block (e.g., an Ajax call), you must dispatch_suspend before beginning the call,
    and dispatch_resume in the event handler to get the desired serial-blocking behavior.
*/

/* Class implementations */

function DispatchManager() {
    this.executionStack = [];
    this.usePostMessage = (window.postMessage !== null);
	this.pauseDelay = -1;
	this.pauseHandler = null;
    
    if (this.usePostMessage) {
        this.pendingMessages = [];
        
        var self = this;
		if (browserSupportsAddEventListener()) {
	        window.addEventListener('message', function dispatchBrowserSupport(e) {
	            if (e.source == window && e.data == '__dispatch') {
	                e.stopPropagation();
                
	                while (self.pendingMessages.length > 0) {
	                    var fn = self.pendingMessages.shift();
	                    if (fn[1] !== null) {
	                        fn[0].call(fn[1]);
                        }
	                    else {
	                        fn[0]();
                        }
	                }
	            }
	        }, false);
		}
    }
}

DispatchManager.prototype.nextTick = function nextTick(callback, optContext) {
    if (this.usePostMessage) {
        this.pendingMessages.push([callback, optContext]);
        window.postMessage('__dispatch', '*');
    } else {
        if (optContext !== null) {
            setTimeout(function netxTickTimeout() {
                callback.call(optContext);
            }, 0);
        } else {
            setTimeout(callback, 0);
        }
    }
};

DispatchManager.prototype.beginExecution = function beginExecution(queue) {
    this.executionStack.push(queue);
};

DispatchManager.prototype.endExecution = function endExecution() {
    this.executionStack.pop();
};

DispatchManager.prototype.enablePauseDetection = function enablePauseDetection(callback, delay) {
	this.pauseHandler = callback;
	this.pauseDelay = delay;
};

DispatchManager.prototype.disablePauseDetection = function disablePauseDetection() {
	this.pauseHandler = null;
	this.pauseDelay = -1;
};

var __dispatch_manager = new DispatchManager();

function DispatchQueue(label, isManaged) {
    this.label = label;
    this.tasks = [];
	this.finalTask = null;
    this.executing = false;
    this.suspendCount = 0;
	this.pauseTimeout = null;
    this.managed = ((isManaged) ? true : false);
}

DispatchQueue.prototype.dispatch = function dispatch(callback) {
    // add this to the end of the queue
    this.tasks.push(callback);
    if (!this.executing) {
        __dispatch_manager.nextTick(this.execute, this);
    }
};

DispatchQueue.prototype.dispatchNext = function dispatchNext(callback) {
    // add this to the front of the queue
    this.tasks.unshift(callback);
    if (!this.executing) {
        __dispatch_manager.nextTick(this.execute, this);
    }
};

DispatchQueue.prototype.execute = function execute() {
    if (this.suspendCount > 0) {
        return;
    }
    
    this.executing = true;
    __dispatch_manager.beginExecution(this);
    
	// If we have no tasks to execute, and we have a final task, run it.
	if (this.tasks.length === 0 && this.finalTask !== null) {
		this.executeFinalTask();
	}
	
	var executeTask = function executeTask(task) {
		if (task !== undefined && task !== null) {
			try {
				task({
					next: this.managedNext.bind(this),
					data: this.lastManagedArguments,
					final: this.executeFinalTask.bind(this)
				});
			}
			catch (e) {
				logger().error('Encountered exception:', e);
				this.managedNext();
			}
		}
	}.bind(this);
	
    while (this.tasks.length > 0) {
        if (this.managed) {
            this.suspend();
			if (this.tasks.length) {
				var task = this.tasks.shift();
				
				if (task instanceof DispatchTaskGroup) {
					var taskGroup = task.getTasks();
					this.suspendCount += taskGroup.length-1;
					for (var i = 0; i < taskGroup.length; i++) {
						var individualTask = taskGroup[i];
						executeTask(individualTask);
					}
				}
				else {
					executeTask(task);
				}
			}
        } else {
            this.tasks.shift()();
        }
        
        if (this.suspendCount > 0) {
            break;
        }
    }
    
    __dispatch_manager.endExecution();
    this.executing = false;
};

DispatchQueue.prototype.suspend = function suspend() {
    if (this.suspendCount++ === 0 && __dispatch_manager.pauseHandler !== null && !this.managed) {
		var queue = this;
    	this.pauseTimeout = setTimeout(function(){
    		if (__dispatch_manager.pauseHandler !== null) {
				__dispatch_manager.pauseHandler.call(queue, queue);
            }
    	}, __dispatch_manager.pauseDelay);
	}
};

DispatchQueue.prototype.resume = function resume() {
    if (--this.suspendCount <= 0) {
        this.suspendCount = 0;
        if (!this.executing) {
            __dispatch_manager.nextTick(this.execute, this);
        }
		
		if (this.pauseTimeout !== null) {
			clearTimeout(this.pauseTimeout);
			this.pauseTimeout = null;
		}
    }
};

DispatchQueue.prototype.reset = function reset() {
    this.suspendCount = 0;
    this.tasks = [];
    
    if (!this.executing) {
        __dispatch_manager.nextTick(this.execute, this);
    }
    
    if (this.pauseTimeout !== null) {
        clearTimeout(this.pauseTimeout);
        this.pauseTimeout = null;
    }
};


DispatchQueue.prototype.managedNext = function managedNext() {
	if (this.tasks.length === 0 && this.finalTask !== null) {
		this.executeFinalTask();
	}
	else {
		this.lastManagedArguments = Array.prototype.slice.call(arguments);
		this.resume();
	}
};

DispatchQueue.prototype.executeFinalTask = function executeFinalTask() {
	if (this.finalTask) {
		this.finalTask();
	}
	this.finalTask = null;
	this.tasks = [];
	this.lastManagedArguments = Array.prototype.slice.call(arguments);
	this.resume();
};

function DispatchTaskGroup() {
	this.tasks = [];
}
DispatchTaskGroup.prototype.addTask = function addTask(callback) {
	if (callback !== undefined) {
		if (Array.isArray(callback)) {
			for (var i = 0; i < callback.length; i++) {
				this.tasks.push(callback[i]);
			}
		}
		else {
			this.tasks.push(callback);
		}
	}
};

DispatchTaskGroup.prototype.getTasks = function getTasks() {
	return this.tasks;
};

/* Creating and Managing Queues */
function dispatch_queue_create(label, isManaged) {
    return new DispatchQueue(label, isManaged);
}

function dispatch_get_current_queue() {
    if (__dispatch_manager.executionStack.length === 0) {
        return null;
    }
    
    return __dispatch_manager.executionStack[__dispatch_manager.executionStack.length - 1];
}

function dispatch_queue_get_label(queue) {
    return queue.label;
}

/* Queuing Tasks for Dispatch */
function dispatch_async(queue, callback) {
	if (callback !== undefined) {
		if (Array.isArray(callback)) {
			for (var i = 0; i < callback.length; i++) {
				queue.dispatch(callback[i]);
			}
		}
		else {
			queue.dispatch(callback);
		}
	}
}

// Note: we can't wait() because JavaScript is single-threaded; this just does async
function dispatch_sync(queue, callback) {
    if (console && console.warn) {
        console.warn('dispatch_sync is unavailable, performing dispatch_async instead');
    }
    
    dispatch_async(queue, callback);
}

function dispatch_after(delay, queue, callback) {
    setTimeout(function dispatchAfterTimeout() {
        queue.dispatchNext(callback);
    }, delay);
}

function dispatch_final(queue, callback) {
	queue.finalTask = callback;
}

function dispatch_execute_final(queue) {
	queue.executeFinalTask();
}

// This takes an optional continuation block to be called when all iterations are done
function dispatch_apply(iterations, queue, callback, continuation) {
    dispatch_async(queue, function dispatchApplyBlock() {
        for (var i = 0; i < iterations; i++) {
            callback(i);
        }
        
        if (typeof(continuation) === 'function') {
            __dispatch_manager.nextTick(continuation);
        }
    });
}

function dispatch_empty_queue(queue) {
	queue.tasks = [];
}

/* Suspending and resuming */
function dispatch_suspend(queue) {
    queue.suspend();
}

function dispatch_resume(queue) {
    queue.resume();
}

function dispatch_reset(queue) {
    queue.reset();
}


function dispatch_queue_size(queue) {
	return queue.tasks.length;
}

/* Debugging */
function dispatch_enable_pause_detection(callback, delay) {
	__dispatch_manager.enablePauseDetection(callback, delay);
}

function dispatch_disable_pause_detection() {
	__dispatch_manager.disablePauseDetection();
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

function insertBefore(inElement, inReferenceElement) {
	var elm = $(inElement);
	var ref = $(inReferenceElement);
	ref.parentNode.insertBefore(elm, ref);
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.HiDPI = Class.createWithSharedInstance('hidpi', true);
XCS.HiDPI.prototype = {
	initialize: function() {
		this.setDPIClassName();
	},
	isHiDPI: function() {
		if (!('devicePixelRatio' in window)) return false;
		if (('devicePixelRatio' in window) && window['devicePixelRatio'] == undefined) return false;
		return (window.devicePixelRatio >= 2);
	},
	setDPIClassName: function() {
		if (this.isHiDPI()) {
			document.body.addClassName('hidpi');
		} else {
			document.body.removeClassName('hidpi');
		}
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// A nextTick method which ensures that the passed function will be run on the next
// iteration of the event loop. Uses setTimeout(..., 0) as a fallback, but on supporting
// browsers, uses window.postMessage, which is significantly more efficient: http://jsperf.com/postmessage



XCS.RunLoop = XCS.RunLoop || new Object();
XCS.RunLoop._usePostMessage = (window.postMessage != null);
XCS.RunLoop._pendingMessages = [];
XCS.RunLoop.nextTick = function(inCallback, inOptContext) {
   if (XCS.RunLoop._usePostMessage) {
       XCS.RunLoop._pendingMessages.push([inCallback, inOptContext]);
       window.postMessage('__cc-nextTick', '*');
   } else {
       if (inOptContext != null) {
           setTimeout(function() {
               inCallback.call(inOptContext);
           }, 0);
       } else {
           setTimeout(inCallback, 0);
       }
   }
};

if (browserSupportsAddEventListener()) {
	window.addEventListener('message', function(e){
	   if (e.source == window && e.data == '__cc-nextTick') {
	       e.stopPropagation();

	       while (XCS.RunLoop._pendingMessages.length > 0) {
	           var fn = XCS.RunLoop._pendingMessages.shift();
	           if (fn[1] != null)
	               fn[0].call(fn[1]);
	           else
	               fn[0]();
	       }
	   }
	}, false);
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.XCSClient = XCS.XCSClient || new Object();

XCS.XCSClient.RECEIVED_SERVER_MAINTENANCE_ERROR = "RECEIVED_SERVER_MAINTENANCE_ERROR";
XCS.XCSClient.RECEIVED_SUCCESSFUL_RESPONSE = "XCS.XCSClient.RECEIVED_SUCCESSFUL_RESPONSE";

// Simple JSON encoder/decoder classes.

XCS.XCSClient.JSONEncoder = Class.create({
    encode_object: function (obj) {
        return JSON.stringify(obj);
    }
});

XCS.XCSClient.JSONDecoder = Class.create({
    decode_object: function (data) {
        return JSON.parse(data);
    }
});

// Service client instance.

XCS.XCSClient.XCSClientSharedInstance = Class.createWithSharedInstance('xcs_client');
XCS.XCSClient.XCSClientSharedInstance.prototype = {
    basePath: "/xcode/internal/api",
    encoder: null,
    decoder: null,
    session_guid: null,
    referencedObjects: null,
    mFailRandomApi: false,
    // Automatic request batching support.
    autobatchRequests: true,
    autobatchWindow: 100, // 100ms
    autobatchQueue: [],
    initialize: function initialize() {
        this.encoder = new XCS.XCSClient.JSONEncoder();
        this.decoder = new XCS.XCSClient.JSONDecoder();
        this.requestHeaders = {};
    },
    _http: function _http(inRequestType, inRequestPath, inRequestData, inCallback, inErrback, inErrCode) {
        this.requestHeaders['X-HTTP-Method-Override'] = inRequestType;

        if (inErrCode !== null) {
            this.requestHeaders['X-XCSResponseStatus'] = inErrCode;
        } else {
            delete this.requestHeaders['X-XCSResponseStatus'];
        }

        if (browser().hasDebugParam('fail_random_api') || this.mFailRandomApi === true) {
            if (Math.random() >= 0.7) {
                this.requestHeaders['X-XCSResponseStatus'] = "500";
            }
        }
        if (browser().hasDebugParam('fail_api')) {
            this.requestHeaders['X-XCSResponseStatus'] = "500";
        }
        
        delete this.requestHeaders['X-XCSRequestUUID'];
        this.requestHeaders['X-XCSRequestUUID'] = this.createUUID();
        

        return new Ajax.Request(this.basePath + inRequestPath, {
            method: inRequestType,
            contentType: 'application/json',
            postBody: Object.toJSON(inRequestData),
            requestHeaders: this.requestHeaders,
            onSuccess: function (response) {
                try {
                    globalNotificationCenter().publish(XCS.XCSClient.RECEIVED_SUCCESSFUL_RESPONSE, this, undefined);

                    if (inCallback !== undefined && inCallback !== null) {
                        if (response !== undefined && response.responseJSON !== undefined && response.responseJSON !== null && response.getResponseHeader('X-XCSResultsList') === "true" && response.responseJSON.results !== undefined && response.responseJSON.results !== null) {
                            return inCallback(response.responseJSON.results);
                        } else if (response !== undefined && response.responseJSON !== undefined && response.responseJSON !== null) {
                            return inCallback(response.responseJSON);
                        } else {
                            return inCallback(response);
                        }
                    } else {
                        return;
                    }
                } catch (e) {
                    logger().error('Encountered exception:', e);
                }
            }.bind(this),
            onFailure: function (response) {
                try {
                    if (response !== undefined && response.status === 532) {
                        globalNotificationCenter().publish(XCS.XCSClient.RECEIVED_SERVER_MAINTENANCE_ERROR, this, undefined);
                    }
                    if (inErrback !== undefined && inErrback !== null) {
                        return inErrback(response);
                    }
                } catch (e) {
                    logger().error('Encountered exception:', e);
                }
            }
        });
    },
    httpGET: function httpGET(inRequestPath, inCallback, inErrback, inErrCode) {
        var errCode = inErrCode || null;
        this._http('get', inRequestPath, undefined, inCallback, inErrback, errCode);
    },
    httpPUT: function httpPUT(inRequestPath, inRequestData, inCallback, inErrback, inErrCode) {
        var errCode = inErrCode || null;
        this._http('put', inRequestPath, inRequestData, inCallback, inErrback, errCode);
    },
    httpPOST: function httpPOST(inRequestPath, inRequestData, inCallback, inErrback, inErrCode) {
        var errCode = inErrCode || null;
        this._http('post', inRequestPath, inRequestData, inCallback, inErrback, errCode);
    },
    httpPATCH: function httpPATCH(inRequestPath, inRequestData, inCallback, inErrback, inErrCode) {
        var errCode = inErrCode || null;
        this._http('patch', inRequestPath, inRequestData, inCallback, inErrback, errCode);
    },
    httpDELETE: function httpDELETE(inRequestPath, inRequestData, inCallback, inErrback, inErrCode) {
        var errCode = inErrCode || null;
        this._http('delete', inRequestPath, inRequestData, inCallback, inErrback, errCode);
    },
    createUUID: function createUUID() {
        var uuid = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        for(var i = 0; i < 5; i++) {
            uuid += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return uuid;
    }
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.XCSProxy = XCS.XCSProxy || {};

// A server proxy shared instance.

XCS.XCSProxy.SharedInstance = Class.createWithSharedInstance('xcs_proxy');
XCS.XCSProxy.SharedInstance.prototype = {
	initialize: function initialize() {},
	getBots: function getBots(inCallback, inErrback, errCode) {
		function callback(inBots) {
            if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var botArray = [];
			for (var i = 0; i < inBots.length; i++) {
				var botObj = XCS.CreateObject("Bot", inBots[i]);
				if (botObj !== null) {
					botArray.push(botObj);
				}
			}
			inCallback(botArray);
		}
		xcs_client().httpGET('/bots', callback, inErrback, errCode);
	},
	getBotById: function getBotById(inBotId, inCallback, inErrback, errCode) {
		function callback(inBot) {
            if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var bot = null;
			if (inBot !== undefined) {
				bot = XCS.CreateObject("Bot", inBot);
			}
			inCallback(bot);
		}
		
		xcs_client().httpGET('/bots/%@'.fmt(inBotId), callback, inErrback, errCode);
	},
	getLatestIntegrationForBots: function getLatestIntegrationForBots(inCallback, inErrback, errCode) {
		function callback(inIntegrations) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var integrations = [];
			for (var i = 0; i < inIntegrations.length; i++) {
				var integration = XCS.CreateObject("Integration", inIntegrations[i]);
				integrations.push(integration);
			}
			inCallback(integrations);
		}
		xcs_client().httpGET('/integrations/filter/latest', callback, inErrback, errCode);
	},
	getLatestFailedIntegrationForBots: function getLatestFailedIntegrationForBots(inCallback, inErrback, errCode) {
		function callback(inIntegrations) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var integrations = [];
			for (var i = 0; i < inIntegrations.length; i++) {
				var integration = XCS.CreateObject("Integration", inIntegrations[i]);
				integrations.push(integration);
			}
			inCallback(integrations);
		}
		xcs_client().httpGET('/integrations/filter/failed', callback, inErrback, errCode);
	},
	getLatestSucceededIntegrationForBots: function getLatestSucceededIntegrationForBots(inCallback, inErrback, errCode) {
		function callback(inIntegrations) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var integrations = [];
			for (var i = 0; i < inIntegrations.length; i++) {
				var integration = XCS.CreateObject("Integration", inIntegrations[i]);
				integrations.push(integration);
			}
			inCallback(integrations);
		}
		xcs_client().httpGET('/integrations/filter/succeeded', callback, inErrback, errCode);
	},
	getLatestFlaggedIntegrationForBots: function getLatestFlaggedIntegrationForBots(inCallback, inErrback, errCode) {
		function callback(inIntegrations) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var integrations = [];
			for (var i = 0; i < inIntegrations.length; i++) {
				var integration = XCS.CreateObject("Integration", inIntegrations[i]);
				integrations.push(integration);
			}
			inCallback(integrations);
		}
		xcs_client().httpGET('/integrations/filter/tag/flagged', callback, inErrback, errCode);
	},
	getLastestNonFatalIntegrationForBot: function getLastestNonFatalIntegrationForBot(inBotId, inCallback, inErrback, errCode) {
		function callback(inIntegration) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var integration = null;
			if (inIntegration.length && inIntegration[0] !== undefined) {
				integration = XCS.CreateObject("Integration", inIntegration[0]);
			}
			inCallback(integration);
		}
		xcs_client().httpGET('/bots/%@/integrations/non_fatal?last=1'.fmt(inBotId), callback, inErrback, errCode);
	},
	getIntegration: function getIntegration(inIntegrationId, inCallback, inErrback, errCode) {
		function callback(inIntegration) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (inIntegration !== undefined) {
				var integrationObj = XCS.CreateObject("Integration", inIntegration);
				
				if (integrationObj !== null) {
					inCallback(integrationObj);
				}
				else {
					inErrback(inIntegration);
				}
			}
			else {
				inErrback(inIntegration);
			}
		}
		
		xcs_client().httpGET('/integrations/%@'.fmt(inIntegrationId), callback, inErrback, errCode);
	},
	getCommitsForIntegration: function getCommitsForIntegration(inIntegrationId, inCallback, inErrback, errCode) {
		function callback(inCommitHistory) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (!inCommitHistory) {
				inErrback(inCommitHistory);
				return;
			}
			
			if (inCommitHistory.length === 0) {
				inCallback([]);
				return;
			}
			// Commit history is returned in a document keyed by repository (blueprint). So we need
			// to unpack the commits to a flattened list.
			var commitsByRepository = (inCommitHistory[0].commits || {});
			var flattenedCommits = [];
			for (var key in commitsByRepository) {
				if (commitsByRepository.hasOwnProperty(key)) {
					flattenedCommits = flattenedCommits.concat(commitsByRepository[key]);
				}
			}
			var commitsArray = [];
			for (var i = 0; i < flattenedCommits.length; i++) {
				// Commits aren't a document of their own, so trick the object code into thinking they are.
				var flattenedCommit = flattenedCommits[i];
				flattenedCommit.doc_type = "commit";
				var commit = XCS.CreateObject("Commit", flattenedCommit);
				if (commit !== null) {
					commitsArray.push(commit);
				}
			}
			inCallback(commitsArray);
		}
		xcs_client().httpGET('/integrations/%@/commits'.fmt(inIntegrationId), callback, inErrback, errCode);
	},
	getIssuesForIntegration: function getIssuesForIntegration(inIntegrationId, inCallback, inErrback, errCode) {
		function callback(inIssues) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (inIssues !== undefined) {
				inCallback(inIssues);
			}
			else {
				inErrback();
			}
		}
		xcs_client().httpGET('/integrations/%@/issues'.fmt(inIntegrationId), callback, inErrback, errCode);
	},
	addTagsToIntegration: function addTagsToIntegration(inIntegrationId, inTags, inCallback, inErrback, errCode) {
		var body = {
			'tags': inTags
		};
		function callback() {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			inCallback(true);
		}
		xcs_client().httpPOST('/integrations/%@/tags'.fmt(inIntegrationId), body, callback, inErrback, errCode);
	},
	removeTagsFromIntegration: function removeTagsFromIntegration(inIntegrationId, inTags, inCallback, inErrback, errCode) {
		var body = {
			'tags': inTags
		};
		function callback() {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			inCallback(true);
		}
		xcs_client().httpDELETE('/integrations/%@/tags'.fmt(inIntegrationId), body, callback, inErrback, errCode);
	},
	logout: function logout(inCallback, inErrback, errCode) {
		xcs_client().httpPOST('/auth/logout', undefined, inCallback, inErrback, errCode);
	},
	login: function login(inCallback, inErrback, errCode) {
		xcs_client().httpPOST('/auth/login', undefined, inCallback, inErrback, errCode);
	},
	isLoggedIn: function(inCallback, inErrback, errCode) {
		function callback(inResponse) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (inResponse !== undefined && inResponse !== null && inResponse.result !== undefined) {
				inCallback(inResponse.result);
			}
			else {
				inErrback();
			}
		}
		
		xcs_client().httpGET('/auth/islogged', callback, inErrback, errCode);
	},
	getVersion: function getVersion(inCallback, inErrback, errCode) {
		function callback(inVersion) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (inVersion !== undefined && inVersion !== null) {
				inCallback(inVersion);
			}
			else {
				inErrback();
			}
		}
		xcs_client().httpGET('/versions', callback, inErrback, errCode);
	},
	isBotCreator: function isBotCreator(inCallback, inErrback, errCode) {
		function callback(inResponse) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (inResponse !== undefined && inResponse !== null && inResponse.result !== undefined) {
				inCallback(inResponse.result);
			}
			else {
				inErrback();
			}
		}
		
		xcs_client().httpGET('/auth/isBotCreator', callback, inErrback, errCode);
	},
	integrateBot: function integrateBot(inBotId, inCallback, inErrback, errCode) {
		function callback(inIntegration) {
            if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			var integrationObj = null;
			if (inIntegration !== undefined) {
				integrationObj = XCS.CreateObject("Integration", inIntegration);
			}
			if (integrationObj !== null) {
				inCallback(integrationObj);
			}
			else {
				inErrback(inIntegration);
			}
		}
		xcs_client().httpPOST('/bots/%@/integrations'.fmt(inBotId), undefined, callback, inErrback, errCode);
	},
	forceLogin: function forceLogin(inCallback, inErrback, errCode) {
		function callback() {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			inCallback();
		}
		xcs_client().httpPOST('/auth/force_login', undefined, callback, inErrback, errCode);
	},
	getServerHostname: function getServerHostname(inCallback, inErrback, errCode) {
		function callback(inResponse) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			if (inResponse !== undefined && inResponse !== null && inResponse.hostname !== undefined) {
				inCallback(inResponse.hostname);
			}
		}
		xcs_client().httpGET('/hostname', callback, inErrback, errCode);
	},
	getRunningIntegrations: function getRunningIntegrations(inCallback, inErrback, errCode) {
        function callback(inIntegrations) {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			inCallback(inIntegrations);
		}
        
		xcs_client().httpGET('/integrations/running', callback, inErrback, errCode);
	},
	cancelIntegration: function cancelIntegration(inIntegrationId, inCallback, inErrback, errCode) {
		function callback() {
			if (inCallback === undefined || inCallback === null) {
                return;
            }
            
			inCallback();
		}
		xcs_client().httpPOST('/integrations/%@/cancel'.fmt(inIntegrationId), undefined, callback, inErrback, errCode);
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

function invalidate() {
	return false;
}

function alphabeticalSort(a, b) {
	var aUp = a.toUpperCase(), bUp = b.toUpperCase();
	for (i = 0; i < aUp.length; i++) {
		if (aUp[i] < bUp[i]) {
			return -1;
		}
		if (aUp[i] > bUp[i]) {
			return 1;
		}
	}
	return 0;
}

function isCommandClickEvent(inEvent) {
	if (browser().isMacintosh()) {
		if (inEvent && inEvent.metaKey) {
			return true;
		}
	}
	else {
		if (inEvent && inEvent.ctrlKey) {
			return true;
		}
	}
	
	if (inEvent && inEvent.which == 2){
		return true;
	}
	
	return false;
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Mvc = XCS.Mvc || new Object();
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Base view class.

XCS.Mvc.View = Class.create(XCS.Object, {
	// The content of this view.
	mContent: null,
	// The root element of this view.
	mParentElement: null,
	// Has this view rendered yet?
	mRendered: false,
	// Is this view displayed or hidden?
	mIsVisible: false,
	// The subviews of this view.
	mSubviews: null,
	// The parent view for this view (if it exists).
	mSuperview: null,
	// The class name(s) for this view.
	mClassName: null,
	mClassNames: null,
	// Template for this view
	mTemplate: null,
	// Minimum loading spinner duration for this view.
	mMinimumLoadingTimer: 250,
	initialize: function($super) {
		$super.apply(null, Array.prototype.slice.call(arguments, 1));
		this.mSubviews = new Array();
	},
	// Returns the current rendered version of this view, or optionally a child
	// of this view matching a given selector.
	$: function(inOptSelector) {
		if (inOptSelector) {
			var result = this.mParentElement.select(inOptSelector);
			if (XCS.typeOf(result) == XCS.T_ARRAY) return result[0];
			return result;
		}
		return this.mParentElement;
	},
	// Forces a render of this view.
	forceRender: function() {
		if (this.rendered()) return this.mParentElement;
		return this._render();
	},
	// Private function for rendering and caching this view. You should not
	// normally override this method. Registers event handlers for this view.
	_render: function() {
		var rendered = this.render();
		if (!rendered) rendered = document.createElement('div');
		rendered.addClassName('xcs-view');
		this.handleDidRenderView({'element': Element.extend(rendered)});
		if (this.mClassName) this.mParentElement.addClassName(this.mClassName);
		if (this.mClassNames) this.mParentElement.addClassName(this.mClassNames.join(" "));
		this.makeAccessible();
		return this.mParentElement;
	},
	renderTemplate: function(inData, inTemplate) {
		if (inData !== undefined && this.mTemplate !== null){
			var html = '';
			var template = this.mTemplate;
			if (inTemplate !== undefined)
				template = inTemplate;
			html = template(inData);
			
			var firstLine = html.split('\n')[0];
			if (firstLine.indexOf('<tr>') !== -1) {
				var node = document.createElement('table');
				node.innerHTML = html;
				return node.querySelector('tbody').firstChild;
			}
			else {
				var node = document.createElement('div');
				node.innerHTML = html;
				return node.firstChild;
			}
		}
	},
	// Renders and attaches any necessary event handlers to this view. Returns a DOM
	// node ready to be appended to the page.
	render: function() { /* Interface */ },
	// Private function for rendering this view as an HTML fragment. You should not normally
	// override this method.
	_renderAsHTML: function() { /* Interface */ },
	// Renders and returns the contents of this view as an HTML fragment. Returns a tuple of
	// fragment identifier and fragment content. It is expected that the fragment identifer
	// returns corresponds to a class name that can be used to query the DOM later.
	renderAsHTML: function() { /* Interface */ },
	// Make views accessible using the accessible OS X feature
	makeAccessible: function() { /* Interface */},	
	// Private function for registering event handlers. You should not normally override this
	// method.
	_registerEventHandlers: function() {
		this.registerEventHandlers();
	},
	// Is this view rendered?
	rendered: function() {
		return (this.mRendered == true);
	},
	// Registers any event handlers on your rendered view. Called once the view has been
	// rendered and appended to the DOM.
	registerEventHandlers: function() { /* Interface */ },
	// Private observer of view rendering. You should not normally override this method.
	handleDidRenderView: function(inOptInfo) {
		if (inOptInfo && inOptInfo.element) {
			this.mParentElement = Element.extend(inOptInfo.element);
			this._registerEventHandlers();
			this.mRendered = this.mIsVisible = true;
			if (browser().isMobileSafari()) {
				this.mParentElement.select('.clickable').each(function(clickable) {
					clickable.setAttribute('onclick', "function() { return false; }");
				});
			}
		}
	},
	// Appends a subview to this view (by tracking the view instance and appending its
	// rendered element to the parent view of this element). Note that calling this will
	// automatically render the passed subview if it has not yet been drawn. Accepts an
	// optional selector argument that can be used when you want to append this child view
	// at a specific position in the tree of this rendered view.
	addSubview: function(inSubview, inOptPositionSelector, inOptInsertAtTop, inOptBeforeSelector) {
		if (!XCS.kindOf(inSubview, XCS.Mvc.View)) {
			logger().error("Cannot append %o as a subview because it does not appear to be a XCS.Mvc.View", inBlock);
			return undefined;
		}
		if (!this.mRendered) this._render();
		if (!inSubview.mRendered) inSubview._render();
		this.mSubviews.push(inSubview);
		inSubview.mSuperview = this;
		if (inOptPositionSelector) {
			var selected = this.mParentElement.down(inOptPositionSelector);
			if (selected) {
				if (inOptInsertAtTop) {
					if (inOptInsertAtTop === 'before' && inOptBeforeSelector !== undefined) {
						var beforeElement = selected.querySelector(inOptBeforeSelector);
						selected.insertBefore(inSubview.mParentElement, beforeElement);
					}
					else {
						Element.insert(selected, {'top': inSubview.mParentElement});
					}
				} else {
					selected.appendChild(inSubview.mParentElement);
				}
				return;
			}
		}
		if (inOptInsertAtTop) {
			Element.insert(this.mParentElement, {'top': inSubview.mParentElement});
		} else {
			this.mParentElement.appendChild(inSubview.mParentElement);
		}
	},
	// Adds a subview to this view (as above), but allows you to specify where it should
	// appear within the view hierarchy.
	insertSubviewAtIndex: function(inSubview, inIndex, inOptPositionSelector) {
		if (!XCS.kindOf(inSubview, XCS.Mvc.View)) {
			logger().error("Cannot append %o as a subview because it does not appear to be a XCS.Mvc.View", inBlock);
			return undefined;
		}
		
		var container = this.mParentElement;
		if (inOptPositionSelector) {
			container = this.mParentElement.down(inOptPositionSelector) || this.mParentElement;
		}
		
		var children = Element.childElements(container);
		if (inIndex < 0 || inIndex > children.length) {
			logger().error("Cannot append %o as a subview because the index %d is invalid", inSubview, inIndex);
			return undefined;
		}
		
		if (!this.mRendered) this._render();
		if (!inSubview.mRendered) inSubview._render();
		this.mSubviews.push(inSubview);
		inSubview.mSuperview = this;
		
		if (inIndex == children.length) {
			container.appendChild(inSubview.mParentElement);
		} else {
			Element.insert(children[inIndex], {'before': inSubview.mParentElement});
		}
	},
	// Removes a given array of subviews from this view.
	removeSubviews: function(inSubviews) {
		var currentSubviews = this.mSubviews, subviewsToRemove = (inSubviews || []), subviewsToKeep = [], subview, subviewElement;
		for (var idx = 0; idx < currentSubviews.length; idx++) {
			subview = currentSubviews[idx];
			if (subviewsToRemove.indexOf(subview) != -1) {
				subviewElement = subview.mParentElement;
				if (subviewElement && subviewElement.parentNode) {
				    subviewElement.parentNode.removeChild(subviewElement);
				}
			} else {
				subviewsToKeep.push(subview);
			}
		}
		this.mSubviews = subviewsToKeep;
	},
	// Removes all subviews from this view.
	removeAllSubviews: function() {
		this.removeSubviews(this.mSubviews);
	},
	// Returns first subview
	getFirstSubview: function() {
		if (this.mSubviews.length) {
			return this.mSubviews[0];
		}
		else {
			return null;
		}
	},
	// Helper functions for hiding/showing this view.
	setVisible: function(inShouldBeVisible) {
		if (inShouldBeVisible == true) {
			Element.show(this.mParentElement);
			this.mIsVisible = true;
		} else {
			Element.hide(this.mParentElement);
			this.mIsVisible = false;
		}
	},
	// Helper functions for enable/disable this view.
	setActive: function(inShouldBeActive) {
		if (inShouldBeActive == true) {
			this.mParentElement.addClassName('active');
			this.mActive = true;
		} else {
			this.mParentElement.removeClassName('active');
			this.mActive = false;
		}
	},
	// Marks this view as loading.
	markAsLoading: function(inShouldBeLoading) {
		if (inShouldBeLoading == true) {
			this.mParentElement.addClassName('loading');
			this.mIsLoading = true;
		} else {
			if (this.mMarkAsLoadingFalseTimer) clearTimeout(this.mMarkAsLoadingFalseTimer);
			this.mMarkAsLoadingFalseTimer = setTimeout(function() {
				this.mParentElement.removeClassName('loading');
				this.mIsLoading = false;
			}.bind(this), this.mMinimumLoadingTimer);
		}
	},
	// Clear the UI from views related to data
	clear: function() { /* Interface */ },
	getTemplate: function(inTemplateName) {
		return (Handlebars && Handlebars.templates && Handlebars.templates[inTemplateName] || null);;
	},
	getAccessibilityID: function(inKey) {
		return accessibility().requestTabIndex(inKey);
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Base view controller class.

XCS.Mvc.ViewController = Class.create(XCS.Object, {
	mViewInstance: null,
	mRouteInvocation: null,
	initialize: function($super) {
		$super();
		this.main();
	},
	main: function() {},
	configure: function(inRouteInvocation) {
		if (inRouteInvocation !== undefined) {
			this.mRouteInvocation = inRouteInvocation;
		}
		this.mRouteInvocation.routeDidComplete();
	},
    getBotById: function getBotById(inBotId) {
		return function getBotByIdBlock(manager) {
			function getBotByIdErrback() {
				manager.next();
			}
			
			function getBotByIdCallback(inBot) {
				if (inBot !== undefined) {
					var botId = inBot.getId();
                    botStorage().addBot(inBot);
					
					manager.next(botId);
				}
				else {
					manager.next();
				}
			}
			
			xcs_proxy().getBotById(inBotId, getBotByIdCallback.bind(this), getBotByIdErrback.bind(this));
		}.bind(this);
	},
    getBotsAndFilteredIntegrations: function getBotsAndFilteredIntegrations() {
		return function getBotsAndFilteredIntegrationsBlock(manager) {
			var botsCache = null;
			var integrationsCache = null;
			
			function getBotsAndFilteredIntegrationsErrback() {
				manager.next();
			}
			
			var getBotsAndFilteredIntegrationsFinalCallback = function getBotsAndFilteredIntegrationsFinalCallback() {
				if (botsCache !== null && integrationsCache !== null) {
					var bot = null;
					
					for (var i = 0; i < botsCache.length; i++) {
						bot = botsCache[i];
						botStorage().addBot(bot);
					}
					
					for (var key in botStorage().getBots()) {
						var localBot = botStorage().getBot(key);
						
						var botFound = false;
						for (var j = 0; j < integrationsCache.length; j++) {
							var integration = integrationsCache[j];
							if (integration !== undefined && integration !== null) {
				                var integrationbotId = integration.getBotId();
								if (localBot !== undefined && localBot !== null && integrationbotId === localBot.getId()) {
									localBot.updateIntegration(integration, this.mSelectedFilter);
									botFound = true;
								}
							}
						}
						if (!botFound) {
							localBot.updateIntegration(null, this.mSelectedFilter);
						}
					}
					
					manager.next();
				}
			}.bind(this);
			
			function getBotsCallback(inBots) {
				if (inBots !== undefined && inBots !== null) {
					botsCache = inBots;
					getBotsAndFilteredIntegrationsFinalCallback();
				}
			}
			function getFilteredIntegrationsCallback(inIntegrations) {
				if (inIntegrations !== undefined && inIntegrations !== null) {
					integrationsCache = inIntegrations;
					getBotsAndFilteredIntegrationsFinalCallback();
				}
			}
			
			xcs_proxy().getBots(getBotsCallback, getBotsAndFilteredIntegrationsErrback);
			switch(this.mSelectedFilter) {
				case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
				default:
					xcs_proxy().getLatestIntegrationForBots(getFilteredIntegrationsCallback, getBotsAndFilteredIntegrationsErrback);
					break;
				case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
					xcs_proxy().getLatestFailedIntegrationForBots(getFilteredIntegrationsCallback, getBotsAndFilteredIntegrationsErrback);
					break;
				case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
					xcs_proxy().getLatestSucceededIntegrationForBots(getFilteredIntegrationsCallback, getBotsAndFilteredIntegrationsErrback);
					break;
				case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
					xcs_proxy().getLatestFlaggedIntegrationForBots(getFilteredIntegrationsCallback, getBotsAndFilteredIntegrationsErrback);
					break;
			}
		}.bind(this);
	},
    getRunningIntegrations: function getRunningIntegrations() {
		var tasks = [];
		tasks.push(function getRunningIntegrationsBlock(manager) {
			function getRunningIntegrationsCallback(inIntegrations) {
				manager.next(inIntegrations);
			}
			function getRunningIntegrationsErrback() {
				manager.next();
			}
			
			xcs_proxy().getRunningIntegrations(getRunningIntegrationsCallback, getRunningIntegrationsErrback);
		}.bind(this));
		
		tasks.push(function getIntegrationsForRunningIntegrationsBlock(manager) {
			var inIntegrations = manager && manager.data && manager.data[0];
			var loopCount = (inIntegrations && inIntegrations.length) || 0;
			var count = 0;
            
            function getIntegrationErrback() {
                count++;
                if (count == loopCount) {
                    manager.next();
                }
            }

            function getIntegrationCallback(inIntegration) {
                if (inIntegration !== undefined) {
                    var botId = inIntegration.getBotId();
                    var bot = botStorage().getBot(botId);
                    var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
                    if (integration !== null) {
                        integration.setCurrentStep(inIntegration.getCurrentStep());
                    }
                    else {
                        integration = inIntegration;
                    }
                    if (bot !== null) {
                        bot.updateIntegration(integration);
                    }

                    count++;
                    if (count == loopCount) {
                        manager.next();
                    }
                }
            }
			
            function getRunningIntegrationsForRunningIntegrationsLoopBlock(i) {
                var integrationUpdate = inIntegrations[i];
                var integrationId = integrationUpdate._id || null;
                var currentStep = integrationUpdate.currentStep || null;

                if (currentStep === XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING || currentStep === XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) {
                    count++;
                    if (count == loopCount) {
                        manager.next();
                    }
                }
                else {
                    if (integrationId !== null && integrationId !== undefined) {
                        xcs_proxy().getIntegration(integrationId, getIntegrationCallback.bind(this), getIntegrationErrback);
                    }
                    else {
                        count++;
                        if (count == loopCount) {
                            manager.next();
                        }
                    }
                }
            }
            
            
			if (inIntegrations !== undefined && inIntegrations.length > 0) {
				for (var i = 0; i < inIntegrations.length; i++) {
                    getRunningIntegrationsForRunningIntegrationsLoopBlock(i);
				}
			}
			else {
				manager.next();
			}
		}.bind(this));
		
		return tasks;
	},
    getIntegration: function getIntegration(inIntegationId) {
		return function getIntegrationBlock(manager) {
			function getIntegrationErrback() {
				manager.next();
			}
			
			function getIntegrationCallback(inIntegration) {
				if (inIntegration !== undefined) {
					var botId = inIntegration.getBotId();
					if (botStorage().getBot(botId) !== null) {
						var bot = botStorage().getBot(botId);
                        if (bot !== null) {
                            bot.updateIntegration(inIntegration);
                        }
						this.mCurrentIntegrationId = inIntegration.getId();
					}
				}
				manager.next();
			}
			
			xcs_proxy().getIntegration(inIntegationId, getIntegrationCallback.bind(this), getIntegrationErrback);
		}.bind(this);
	},
    getCommitsAndIssuesForIntegration: function getCommitsAndIssuesForIntegration(inIntegationId, inBotId) {
		return function getCommitsAndIssuesForIntegrationBlock(manager) {
			var currentBot = botStorage().getBot(inBotId);    
			var expectedResponses = 0;
			var responseCount = 0;
            var integration = null;
            
            function getCommitsForIntegrationErrback() {
                responseCount++;
                if (responseCount === expectedResponses) {
                    manager.next();
                }
            }

            function getCommitsForIntegrationCallback(inCommits) {
                if (inCommits !== undefined) {
                    integration.setCommits(inCommits);
                }

                // Make sur we fetech all the data we need before rendering
                responseCount++;
                if (responseCount === expectedResponses) {
                    manager.next();
                }
            }
            
            function getIssuesForIntegrationErrback() {
                responseCount++;
                if (responseCount === expectedResponses) {
                    manager.next();
                }
            }

            function getIssuesForIntegrationCallback(inIssues) {
                if (inIssues !== undefined) {
                    integration.setResultDetails(inIssues);
                }
                responseCount++;
                if (responseCount === expectedResponses) {
                    manager.next();
                }
            }
            
            if (currentBot !== undefined && currentBot !== null) {
                integration = currentBot.getIntegrationById(inIntegationId);
                
                // if we have an integration
                if (integration !== undefined && integration !== null) {
                    // and that intgegration has reached the triggers step
                    if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING) && integration.getCommits() === null) {
                        expectedResponses++;

                        // if we already have commits
                        if (integration.getCommits() !== null) {
                            responseCount++;
                        }
                        else {
                            // if not then let's query the server
                            xcs_proxy().getCommitsForIntegration(integration.getId(), getCommitsForIntegrationCallback.bind(this), getCommitsForIntegrationErrback);
                        }
                    }

                    // and that integration has reached the triggers step
                    if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && integration.getResultDetails() === null) {
                        expectedResponses++;

                        // if we already have commits
                        if (integration.getResultDetails() !== null) {
                            responseCount++;
                        }
                        else {
                            // if not then let's query the server
                            xcs_proxy().getIssuesForIntegration(integration.getId(), getIssuesForIntegrationCallback.bind(this), getIssuesForIntegrationErrback);
                        }
                    }

                    if (expectedResponses === responseCount) {
                        manager.next();
                    }

                }
                else {
                    manager.next();
                }
            }
            else {
                manager.next();
            }
		}.bind(this);
	},
    getCommitsAndIssuesForFilteredIntegrations: function getCommitsAndIssuesForFilteredIntegrations() {
		return function getCommitsAndIssuesForFilteredIntegrationsBlock(manager) {
			var maxCount = botStorage().getLength();
			var count = 0;
			
			if (maxCount === 0) {
				manager.next();
				return;
			}
		
            var getCommitsAndIssuesForFilteredIntegrationsLoopBlock = function getCommitsAndIssuesForFilteredIntegrationsLoopBlock(key) {
                var bot = botStorage().getBot(key);
                var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
                var expectedResponses = 0;
                var responseCount = 0;
                
                function getCommitsForIntegrationErrback() {
                    responseCount++;
                    if (responseCount === expectedResponses) {
                        count++;
                    }
                    if (count === maxCount) {
                        manager.next();
                    }
                }

                function getCommitsForIntegrationCallback(inCommits) {
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
                }

                function getIssuesForIntegrationErrback() {
                    responseCount++;
                    if (responseCount === expectedResponses) {
                        count++;
                    }
                    if (count === maxCount) {
                        manager.next();
                    }
                }

                function getIssuesForIntegrationCallback(inIssues) {
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
                }
                
                if (integration !== undefined && integration !== null) {
                    // and that intgegration has reached the triggers step
                    if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING) && integration.getCommits() === null) {
                        expectedResponses++;

                        // if we already have commits
                        if (integration.getCommits() !== null) {
                            responseCount++;
                        }
                        else {
                            // if not then let's query the server
                            xcs_proxy().getCommitsForIntegration(integration.getId(), getCommitsForIntegrationCallback.bind(this), getCommitsForIntegrationErrback);
                        }
                    }

                    // and that integration has reached the triggers step
                    if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) && integration.getResultDetails() === null) {
                        expectedResponses++;

                        // if we already have commits
                        if (integration.getResultDetails() !== null) {
                            responseCount++;
                        }
                        else {
                            // if not then let's query the server
                            xcs_proxy().getIssuesForIntegration(integration.getId(), getIssuesForIntegrationCallback.bind(this), getIssuesForIntegrationErrback);
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
            }.bind(this);
            
            
			for (var key in botStorage().getBots()) {
				getCommitsAndIssuesForFilteredIntegrationsLoopBlock(key);
			}
		}.bind(this);
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.CreateObject = function(inObject, inData) {
	var object = XCS.objectForPropertyPath(inObject, XCS);
	if (object !== undefined && inData !== undefined) {
		object = new object(inData);
		return (object.isValid() ? object : null);
	}
	else {
		return null;
	}
};

XCS.isEmpty = function(inValue) {
	if (inValue === undefined || inValue === null || inValue === "") {
		return true;
	}
	else {
		return false;
	}
}

XCS.BaseObject = Class.create({
	type: null,
	data: null,
	valid: null,
	initialize: function(inData) {
		if (inData !== undefined) {
			this.data = inData;
			this._test();
		}
		else {
			this._setValid(false);
			logger().error("No data source for", this.type, "object.");
		}
	},
	isValid: function() {
		if (this.valid == null || this.valid == false) {
			return false;
		}
		else {
			return true;
		}
	},
	getValueForKey: function(inPath, inDepth) {
		var value = XCS.objectForPropertyPath(inPath, this.data, inDepth);
		if (value !== undefined) {
			return value;
		}
		else {
			return null;
		}
	},
	hasProperty: function(inPath, inDepth) {
		var value = this.getValueForKey(inPath, inDepth);
		if (value === null) {
			return false;
		}
		else {
			return true;
		}
	},
	getProperty: function(inName) {
		if (inName !== undefined && this[inName] !== undefined) {
			return this[inName];
		}
		else {
			return "";
		}
	},
	setProperty: function(inName, inValue) {
		if (inName !== undefined && inValue !== undefined) {
			this[inName] = inValue;
		}
	},
	hasOwnProperty: function(inName) {
		return ((inName !== undefined && this[inName] !== undefined) ? true : false);
	},
	getBool: function(inValue) {
		if (inValue !== undefined) {
			if (inValue == "true") {
				return true;
			}
			else if (inValue == "false"){
				return false;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	},
	// Private Method
	///////////////////
	_getData: function() {
		return this.data;
	},
	_setValid: function(inValue) {
		if (!(inValue == true || inValue == false)) {
			return;
		}
		
		if (this.valid == null) {
			this.valid = inValue;
		}
		else if (this.valid == true && inValue == false) {
			this.valid = inValue;
		}
	},
	_test: function() {
		if (this.data !== null && this.data.doc_type !== undefined) {
			var value = XCS.objectForPropertyPath("doc_type", this.data);
			if (value !== undefined && this.type !== null && value === this.type ) {
				this._setValid(true);
			}
			else {
				this._setValid(false);
				logger().error("Wrong data source. Attempting to use", value, "data in a", this.type, "object.");
			}
		}
		
		if (this.isValid) {
			this._testObj();
		}
		
		return this.isValid();
	},
	// Interface
	_testObj: function() {}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.BotFilter = XCS.BotFilter || new Object();

XCS.BotFilter.INTEGRATION_FILTER_LATEST = "Latest";
XCS.BotFilter.INTEGRATION_FILTER_CONTRIBUTED = "Contributed";
XCS.BotFilter.INTEGRATION_FILTER_FAILED = "Failed";
XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED = "Succeeded";
XCS.BotFilter.INTEGRATION_FILTER_FLAGGED = "Flagged";

XCS.Bot = Class.create(XCS.BaseObject, {
    type: "bot",
    initialize: function ($super, inData) {
        $super(inData);
        this.mIntegrations = null;
        this.mLatestIntegration = null;
        this.mLatestFailedIntegration = null;
        this.mLatestSucceededIntegration = null;
        this.mLatestFlaggedIntegration = null;
        this.mRunningIntegration = null;
        this.mIntegrationIdDict = {};
    },
    getName: function () {
        return this.getValueForKey("name");
    },
    getGroup: function () {
        return this.getValueForKey("group");
    },
    getId: function () {
        return this.getValueForKey("_id");
    },
    getTinyId: function () {
        return this.getValueForKey("tinyID");
    },
    getType: function () {
        return this.getValueForKey("type");
    },
    getConfiguration: function () {
        return this.getValueForKey('configuration');
    },
    isBuiltFromClean: function () {
        return this.getValueForKey('configuration.builtFromClean');
    },
    getSchemeName: function () {
        return this.getValueForKey('configuration.schemeName');
    },
    getTestingDestinationType: function () {
        return this.getValueForKey('configuration.testingDestinationType');
    },
    isMacApp: function () {
        var macIndexes = [4, 5, 6, 7];
        var testingDestinationType = this.getTestingDestinationType();
        var result = null;
        if (testingDestinationType !== undefined && testingDestinationType !== null) {
            if (macIndexes.indexOf(testingDestinationType) !== -1) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    },
    isIosApp: function () {
        var macIndexes = [0, 1, 2, 3];
        var testingDestinationType = this.getTestingDestinationType();
        var result = null;
        if (testingDestinationType !== undefined && testingDestinationType !== null) {
            if (macIndexes.indexOf(testingDestinationType) !== -1) {
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    },
    isAnalysisEnabled: function isAnalysisEnabled() {
        return this.getValueForKey('configuration.performsAnalyzeAction');
    },
    isTestingEnabled: function isTestingEnabled() {
        return this.getValueForKey('configuration.performsTestAction');
    },
    isCodeCoverageEnabled: function isCodeCoverageEnabled() {
        var codeCoverage = this.getValueForKey('configuration.codeCoveragePreference');
        if (codeCoverage !== null && codeCoverage > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    _testObj: function () {
        var XCSXcodeBotTypeBuildBot = 1;

        // name	
        if (XCS.isEmpty(this.getName())) {
            this._setValid(false);
            logger().error('Name in %@ is empty'.fmt(this.type));
        }
        if (typeof (this.getName()) != "string") {
            this._setValid(false);
            logger().error('Name in %@ is not a string'.fmt(this.type));
        }
        // id
        if (XCS.isEmpty(this.getId())) {
            this._setValid(false);
            logger().error('Id in %@ is empty'.fmt(this.type));
        }
        if (typeof (this.getId()) != "string") {
            this._setValid(false);
            logger().error('Id in %@ is not a string'.fmt(this.type));
        }
        // tinyId
        if (XCS.isEmpty(this.getTinyId())) {
            this._setValid(false);
            logger().error('tinyID in %@ is empty'.fmt(this.type));
        }
        if (typeof (this.getTinyId()) != "string") {
            this._setValid(false);
            logger().error('tinyID in %@ is not a string'.fmt(this.type));
        }
        // type
        if (XCS.isEmpty(this.getType())) {
            this._setValid(false);
            logger().error('type in %@ is empty'.fmt(this.type));
        }
        if (typeof (this.getType()) != "number") {
            this._setValid(false);
            logger().error('type in %@ is not a number'.fmt(this.type));
        }
        if (this.getType() !== XCSXcodeBotTypeBuildBot) {
            this._setValid(false);
            logger().error('type in %@ is not a Bot'.fmt(this.type));
        }
        // configuration
        if (XCS.isEmpty(this.getConfiguration())) {
            this._setValid(false);
            logger().error('configuration in %@ is empty'.fmt(this.type));
        }
        if (typeof (this.getConfiguration()) != "object") {
            this._setValid(false);
            logger().error('configuration in %@ is not an object'.fmt(this.type));
        }
    },
    resetIntegrations: function () {
        this.mIntegrations = {};
    },
    addIntegrations: function (inIntegrations) {
        if (inIntegrations !== undefined && inIntegrations !== null) {
            if (this.mIntegrations === null || this.mIntegrations.length === 0) {
                this.mIntegrations = {};
            }

            if (inIntegrations.length !== undefined) {
                for (var i = 0; i < inIntegrations.length; i++) {
                    var integration = inIntegrations[i];
                    this.updateIntegration(integration);
                }
            } else {
                this.updateIntegration(inIntegrations);
            }

        }
    },
    updateIntegration: function (inIntegration, inFilter) {
        if (inIntegration !== undefined) {
            if (inIntegration === null) {
                this.setIntegrationFromFilter(null, inFilter);
            } else {
                var integrationId = inIntegration.getId();

                if (this.mIntegrations === null) {
                    this.mIntegrations = {};
                }

                if (this.mIntegrations[integrationId] === undefined) {
                    this.mIntegrations[integrationId] = inIntegration;
                } else {
                    this.mIntegrations[integrationId].update(inIntegration);
                }
                this.mIntegrationIdDict[inIntegration.getTinyId()] = integrationId;

                if (!inIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
                    this.mRunningIntegration = inIntegration;
                } else {
                    if (this.mRunningIntegration instanceof XCS.Integration) {
                        if (inIntegration.getIntegrationNumber() >= this.mRunningIntegration.getIntegrationNumber()) {
                            this.mRunningIntegration = null;
                        }
                    }
                    if (this.mLatestIntegration === null || (inIntegration.getIntegrationNumber() >= this.mLatestIntegration.getIntegrationNumber())) {
                        this.mLatestIntegration = inIntegration;
                    }
                }

                this.setIntegrationFromFilter(inIntegration, inFilter);
            }
        }
    },
    getIntegrations: function () {
        return this.mIntegrations;
    },
    setIntegrationFromFilter: function (inIntegration, inFilter) {
        if (inIntegration !== undefined && inFilter !== undefined && inFilter !== null) {
            if (inIntegration === null) {
                switch (inFilter) {
                case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
                default:
                    // get integrations for current bot
                    this.setLatestIntegration(inIntegration);
                    break;
                case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
                    this.setLatestFailedIntegration(inIntegration);
                    break;
                case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
                    this.setLatestSucceededIntegration(inIntegration);
                    break;
                case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
                    this.setLatestFlaggedIntegration(inIntegration);
                    break;
                }
            } else {
                if (inIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
                    var integrationId = inIntegration.getId();
                    var integration = this.getIntegrationById(integrationId);

                    switch (inFilter) {
                    case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
                    default:
                        // get integrations for current bot
                        this.setLatestIntegration(integration);
                        break;
                    case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
                        this.setLatestFailedIntegration(integration);
                        break;
                    case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
                        this.setLatestSucceededIntegration(integration);
                        break;
                    case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
                        this.setLatestFlaggedIntegration(integration);
                        break;
                    }
                }
            }
        }
    },
    getIntegrationFromFilter: function (inFilter, inStrict) {
        var integration = null;
        if (inFilter !== undefined && inFilter !== null) {

            if (((inStrict === undefined && this.mRunningIntegration === null) || (inStrict !== undefined && inStrict === false && this.mRunningIntegration === null)) || ((inStrict !== undefined && inStrict === true))) {
                switch (inFilter) {
                case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
                default:
                    integration = this.getLatestIntegration();
                    break;
                case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
                    integration = this.getLatestFailedIntegration();
                    break;
                case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
                    integration = this.getLatestSucceededIntegration();
                    break;
                case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
                    integration = this.getLatestFlaggedIntegration();
                    break;
                }
            } else {
                integration = this.mRunningIntegration;
            }
        }
        return integration;
    },
    getIntegrationsCount: function () {
        return Object.keys(this.getIntegrations()).length;
    },
    getIntegrationById: function (inIntegrationId) {
        if (inIntegrationId !== undefined) {
            var integration = this.mIntegrations[inIntegrationId];
            if (integration === undefined) {
                integration = this.getIntegrationByTinyId[inIntegrationId];
            }
            return integration;
        }
    },
    getIntegrationByTinyId: function (inTinyId) {
        if (inTinyId !== undefined && inTinyId !== null) {
            var integrationId = this.mIntegrationIdDict[inTinyId] || null;
            if (integrationId !== null) {
                return this.mIntegrations[integrationId];
            } else {
                return null;
            }
        }
    },
    setRunningIntegration: function (inIntegration) {
        if (inIntegration !== undefined) {
            this.mRunningIntegration = inIntegration;
        }
    },
    getRunningIntegration: function () {
        return this.mRunningIntegration;
    },
    findAndSetLastestIntegration: function () {
        if (this.mIntegrations !== null && this.mIntegrations.length) {
            var integrationNumber = null;
            var latestIntegration = null;
            for (var i = 0; i < this.mIntegrations.length; i++) {
                if (integrationNumber === null) {
                    integrationNumber = this.mIntegrations[i].getIntegrationNumber();
                    latestIntegration = this.mIntegrations[i];
                }
                if (this.mIntegrations[i].getIntegrationNumber() > integrationNumber) {
                    integrationNumber = this.mIntegrations[i].getIntegrationNumber();
                    latestIntegration = this.mIntegrations[i];
                }
            }

            this.mLatestIntegration = latestIntegration;
        }
    },
    setLatestIntegration: function (inIntegration) {
        if (inIntegration !== undefined) {
            this.mLatestIntegration = inIntegration;
        }
    },
    getLatestIntegration: function () {
        return this.mLatestIntegration;
    },
    setLatestFailedIntegration: function (inIntegration) {
        if (inIntegration !== undefined) {
            this.mLatestFailedIntegration = inIntegration;
        }
    },
    getLatestFailedIntegration: function () {
        return this.mLatestFailedIntegration;
    },
    setLatestSucceededIntegration: function (inIntegration) {
        if (inIntegration !== undefined) {
            this.mLatestSucceededIntegration = inIntegration;
        }
    },
    getLatestSucceededIntegration: function () {
        return this.mLatestSucceededIntegration;
    },
    setLatestFlaggedIntegration: function (inIntegration) {
        if (inIntegration !== undefined) {
            this.mLatestFlaggedIntegration = inIntegration;
        }
    },
    getLatestFlaggedIntegration: function () {
        return this.mLatestFlaggedIntegration;
    },
    update: function (inBot) {
        if (inBot !== undefined && inBot !== null) {
            this.data = inBot._getData();
        }
    },
    cleanupUnusedIntegrations: function () {
        for (var key in this.mIntegrations) {
            var integration = this.mIntegrations[key];
            
            if (integration === this.mLatestIntegration || integration === this.mLatestFailedIntegration || integration === this.mLatestSucceededIntegration || integration === this.mLatestFlaggedIntegration || integration === this.mRunningIntegration) {
                // Let the integration live
            }
            else {
                delete(this.mIntegrationIdDict[integration.getTinyId()]);
                delete(this.mIntegrations[key]);
            }
        }
    }
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.Commit = Class.create(XCS.BaseObject, {
	initialize: function($super, inData) {
		$super(inData);
		this.mContributorHash = this._buildContributorHash();
	},
	type: "commit",
	getDate: function() {
		var timestamp = this.getValueForKey('XCSCommitTimestamp');
		return new Date(timestamp);
	},
	getMessage: function() {
		return this.getValueForKey('XCSCommitMessage');
	},
	getAuthorEmail: function() {
		var emails = this.getValueForKey('XCSCommitContributor.XCSContributorEmails');
		if (emails && emails.length > 0) {
			return emails[0];
		}
		return null;
	},
	getAuthorName: function() {
		var name = this.getValueForKey('XCSCommitContributor.XCSContributorName');
		var displayName = this.getValueForKey('XCSCommitContributor.XCSContributorDisplayName');
		return (displayName || name)
	},
	getAuthorShortName: function() {
		var name = this.getAuthorName();
		var nameArray = name.split(" ");
		var shortName = "";
		
		for (var i = 0; i < nameArray.length; i++) {
			var partialName = nameArray[i];
			if (partialName.length) {
				if (i == 0) {
					shortName += partialName.toLowerCase().titleCase();
				}
				if (i == 1) {
					shortName += " "+partialName[0].toUpperCase()+".";
				}
			}
		}
		return shortName;
	},
	getAuthorInitials: function() {
		var name = this.getAuthorName();
		var nameArray = name.split(" ");
		var maxInitials = 2;
		var initials = "";
		
		for (var i = 0; i < nameArray.length; i++) {
			if (i < maxInitials) {
				var partialName = nameArray[i];
				if (partialName.length) {
					initials += partialName[0].toUpperCase();
				}
			}
		}
		return initials;
	},
	getAuthorFirstName: function() {
		var name = this.getAuthorName();
		var nameArray = name.split(" ");
		if (nameArray[0] != undefined) {
			return nameArray[0].titleCase();
		}
		else {
			return name.titleCase();
		}
	},
	getAuthorImageUrl: function() {
		var value = this.getValueForKey("author.imageUrl");
		return ( value !== '' ? value : null );
	},
	getCommitHash: function() {
		return this.getValueForKey('XCSCommitHash');
	},
	getShortCommitHash: function() {
		var hash = this.getCommitHash();
		if (hash !== null) {
			return hash.substring(1, 12);
		}
		else {
			return "";
		}
	},
	getFilesChanged: function() {
		var filesChanged = this.getValueForKey('XCSCommitCommitChangeFilePaths');
		var filePaths = [];
		if (filesChanged) {
			for (var idx = 0; idx < filesChanged.length; filesChanged++) {
				var filePath = filesChanged[idx].filePath;
				if (filePath) {
					filePaths.push(filePath);
				}
			}
		}
		return filePaths;
	},
	getFilesChangedCount: function() {
		var filesChanged = this.getValueForKey('XCSCommitCommitChangeFilePaths');
		if (filesChanged) {
			return filesChanged.length;
		}
		return 0;
	},
	getContributorHash: function() {
		return this.mContributorHash;
	},
	_testObj: function() {
		// date
		if (XCS.isEmpty(this.getDate())) { this._setValid(false); logger().error('Date in %@ is empty'.fmt(this.type)); };
		if (XCS.typeOf(this.getDate()) != XCS.T_DATE) { this._setValid(false); logger().error('Date in %@ is not a date'.fmt(this.type)); };
		// message
		if (XCS.isEmpty(this.getMessage())) { this._setValid(false); logger().error('Message in %@ is empty'.fmt(this.type)); };
		if (XCS.typeOf(this.getMessage()) != XCS.T_STRING) { this._setValid(false); logger().error('Message in %@ is not a string'.fmt(this.type)); };
		// author email
		if (!XCS.isEmpty(this.getAuthorEmail())) {
			if (XCS.typeOf(this.getAuthorEmail()) != XCS.T_STRING) { this._setValid(false); logger().error('Author email in %@ is not a string'.fmt(this.type)); };
		}
		// author name
		if (XCS.isEmpty(this.getAuthorName())) { this._setValid(false); logger().error('Author name in %@ is empty'.fmt(this.type)); };
		if (XCS.typeOf(this.getAuthorName()) != XCS.T_STRING) { this._setValid(false); logger().error('Author name in %@ is not a string'.fmt(this.type)); };
		// files changed
		if (XCS.typeOf(this.getFilesChanged()) != XCS.T_ARRAY) { this._setValid(false); logger().error('Files changed in %@ is not an array'.fmt(this.type)); };
		// files changed count
		if (XCS.isEmpty(this.getFilesChangedCount())) { this._setValid(false); logger().error('Files changed count in %@ is empty'.fmt(this.type)); };
		if (XCS.typeOf(this.getFilesChangedCount()) != XCS.T_NUMBER) { this._setValid(false); logger().error('Files changed count in %@ is not a number'.fmt(this.type)); };
	},
	_buildContributorHash: function() {
		var name = this.getAuthorName();
		var email = this.getAuthorEmail();
		var hash = "";
		
		if (name !== null) {
			hash += name.replace(/ /g, '').escapeHTML().toLowerCase();
		}
		if (email !== null) {
			hash += email.replace(/ /g, '').escapeHTML().toLowerCase();
		}
		return hash;
	},
	getCommitMessageInfo: function() {
		var commitTimestamp = globalLocalizationManager().localizedDateTime(this.getDate());
		
		return {
			commit_message: this.getMessage(),
			commit_timestamp_message: "_XCS.BotDetail.Summary.ContributorsCommitsMessages.Timestamps".loc(this.getShortCommitHash(), commitTimestamp)
		}
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.



XCS.Integration = Class.create(XCS.BaseObject, {
    type: "integration",
    initialize: function ($super, inData) {
        if (inData !== undefined && inData !== null && inData.bot !== undefined) {
            this.botSnapshot = XCS.CreateObject('Bot', inData.bot);
        }

        $super(inData);

        this.mCommits = null;
        this.deviceIdsArray = [];
        this.devices = this._buildDevicesDict();
        this.normalizedStatus = this._buildNormalizedStatus();
        this.mContributors = null;
        this.mContributorsIssues = null;
        this.mResultDetails = null;
        this.mForceIsRunning = false;
    },
    // Getters
    ////////////
    getId: function getId() {
        var _id = this.getValueForKey("_id");
        var integrationID = this.getValueForKey("integrationID");
        if (_id !== null) {
            return _id;
        }
        if (integrationID !== null) {
            return integrationID;
        }
        return null;
    },
    getRevision: function getRevision() {
        return this.getValueForKey('_rev');
    },
    getShouldClean: function getShouldClean() {
        return this.getValueForKey('shouldClean');
    },
    getResult: function getResult() {
        return this.getValueForKey('result');
    },
    getCurrentStep: function getCurrentStep() {
        return this.getValueForKey('currentStep');
    },
    setCurrentStep: function setCurrentStep(inValue) {
        this.data.currentStep = inValue;
    },
    getNormalizedStatus: function getNormalizedStatus() {
        var value = this.normalizedStatus;
        return ((value !== undefined && value !== null) ? value : "");
    },
    getIntegrationNumber: function getIntegrationNumber() {
        return this.getValueForKey("number");
    },
    getSuccessStreak: function getSuccessStreak() {
        return this.getValueForKey("success_streak");
    },
    // Build counts
    getBuildResultSummary: function getBuildResultSummary() {
        return this.getValueForKey("buildResultSummary");
    },
    getAnalyzerWarningCount: function getAnalyzerWarningCount() {
        var value = this.getValueForKey('buildResultSummary.analyzerWarningCount');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getAnalyzerWarningChange: function getAnalyzerWarningChange() {
        var value = this.getValueForKey('buildResultSummary.analyzerWarningChange');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getWarningCount: function getWarningCount() {
        var value = this.getValueForKey('buildResultSummary.warningCount');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getWarningChange: function getWarningChange() {
        var value = this.getValueForKey('buildResultSummary.warningChange');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getErrorCount: function getErrorCount() {
        var value = this.getValueForKey('buildResultSummary.errorCount');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getErrorChange: function getErrorChange() {
        var value = this.getValueForKey('buildResultSummary.errorChange');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getTestsCount: function getTestsCount() {
        var value = this.getValueForKey('buildResultSummary.testsCount');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getTestsChange: function getTestsChange() {
        var value = this.getValueForKey('buildResultSummary.testsChange');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getTestFailureCount: function getTestFailureCount() {
        var value = this.getValueForKey('buildResultSummary.testFailureCount');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getTestFailureChange: function getTestFailureChange() {
        var value = this.getValueForKey('buildResultSummary.testFailureChange');
        return ((value !== undefined && value !== null) ? value : null);
    },
    getAnalyzerSummaries: function getAnalyzerSummaries() {
        var value = this.getValueForKey("buildResultSummary.analyzerWarnings");
        return (value === null ? [] : value);
    },
    getWarningSummaries: function getWarningSummaries() {
        var value = this.getValueForKey("buildResultSummary.warnings");
        return (value === null ? [] : value);
    },
    getErrorSummaries: function getErrorSummaries() {
        var value = this.getValueForKey("buildResultSummary.errors");
        return (value === null ? [] : value);
    },
    getRegressedPerformanceTestCount: function getRegressedPerformanceTestCount() {
        var value = this.getValueForKey("buildResultSummary.regressedPerfTestCount");
        return ((value !== undefined && value !== null) ? value : null);
    },
    getImprovedPerformanceTestCount: function getImprovedPerformanceTestCount() {
        var value = this.getValueForKey("buildResultSummary.improvedPerfTestCount");
        return ((value !== undefined && value !== null) ? value : null);
    },
    getCodeCoveragePercentage: function getCodeCoveragePercentage() {
        var value = this.getValueForKey("buildResultSummary.codeCoveragePercentage");
        return ((value !== undefined && value !== null) ? value : null);
    },
    getCodeCoveragePercentageDelta: function getCodeCoveragePercentageDelta() {
        var value = this.getValueForKey("buildResultSummary.codeCoveragePercentageDelta");
        return ((value !== undefined && value !== null) ? value : null);
    },
    getTestHierarchy: function getTestHierarchy() {
        return this.getValueForKey('testHierarchy');
    },
    getPerfMetricNames: function getPerfMetricNames() {
        return this.getValueForKey('perfMetricNames');
    },
    getPerfMetricKeyPath: function getPerfMetricKeyPath() {
        return this.getValueForKey('perfMetricKeyPath');
    },
    getResultDetails: function getResultDetails() {
        return this.mResultDetails;
    },
    setResultDetails: function setResultDetails(inValue) {
        if (inValue !== undefined) {
            this.mResultDetails = inValue;
            if (this.getCommitsByContributors() !== null) {
                this._buildIssuesByContributor();
            }
        }
    },
    getUnresolvedErrors: function getUnresolvedErrors() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.errors.unresolvedIssues;
        }
        return value;
    },
    getUnresolvedErrorsCount: function getUnresolvedErrorsCount() {
        var issues = this.getUnresolvedErrors();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getResolvedErrors: function getResolvedErrors() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.errors.resolvedIssues;
        }
        return value;
    },
    getResolvedErrorsCount: function getResolvedErrorsCount() {
        var issues = this.getResolvedErrors();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getFreshErrors: function getFreshErrors() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.errors.freshIssues;
        }
        return value;
    },
    getFreshErrorsCount: function getFreshErrorsCount() {
        var issues = this.getFreshErrors();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getUnresolvedWarnings: function getUnresolvedWarnings() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.warnings.unresolvedIssues;
        }
        return value;
    },
    getUnresolvedWarningsCount: function getUnresolvedWarningsCount() {
        var issues = this.getUnresolvedWarnings();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getResolvedWarnings: function getResolvedWarnings() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.warnings.resolvedIssues;
        }
        return value;
    },
    getResolvedWarningsCount: function getResolvedWarningsCount() {
        var issues = this.getResolvedWarnings();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getFreshWarnings: function getFreshWarnings() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.warnings.freshIssues;
        }
        return value;
    },
    getFreshWarningsCount: function getFreshWarningsCount() {
        var issues = this.getFreshWarnings();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getUnresolvedAnalyzerWarnings: function getUnresolvedAnalyzerWarnings() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.analyzerWarnings.unresolvedIssues;
        }
        return value;
    },
    getUnresolvedAnalyzerWarningsCount: function getUnresolvedAnalyzerWarningsCount() {
        var issues = this.getUnresolvedAnalyzerWarnings();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getResolvedAnalyzerWarnings: function getResolvedAnalyzerWarnings() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.analyzerWarnings.resolvedIssues;
        }
        return value;
    },
    getResolvedAnalyzerWarningsCount: function getResolvedAnalyzerWarningsCount() {
        var issues = this.getResolvedAnalyzerWarnings();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getFreshAnalyzerWarnings: function getFreshAnalyzerWarnings() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.analyzerWarnings.freshIssues;
        }
        return value;
    },
    getFreshAnalyzerWarningsCount: function getFreshAnalyzerWarningsCount() {
        var issues = this.getFreshAnalyzerWarnings();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getUnresolvedTestFailures: function getUnresolvedTestFailures() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.testFailures.unresolvedIssues;
        }
        return value;
    },
    getUnresolvedTestFailuresCount: function getUnresolvedTestFailuresCount() {
        var issues = this.getUnresolvedTestFailures();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getResolvedTestFailures: function getResolvedTestFailures() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.testFailures.resolvedIssues;
        }
        return value;
    },
    getResolvedTestFailuresCount: function getResolvedTestFailuresCount() {
        var issues = this.getResolvedTestFailures();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getFreshTestFailures: function getFreshTestFailures() {
        var resultDetails = this.getResultDetails();
        var value = null;
        if (resultDetails !== null) {
            value = resultDetails.testFailures.freshIssues;
        }
        return value;
    },
    getFreshTestFailuresCount: function getFreshTestFailuresCount() {
        var issues = this.getFreshTestFailures();
        var value = null;
        if (issues !== null) {
            value = issues.length;
        }
        return value;
    },
    getQueuedTime: function getQueuedTime() {
        var value = this.getValueForKey("queuedDate");
        var newDate = new Date(value);
        if (value !== null && value !== "" && typeof (value) === "string" && Object.prototype.toString.call(newDate) === "[object Date]") {
            return newDate;
        } else {
            return null;
        }
    },
    getRevisionBlueprint: function getRevisionBlueprint() {
        return this.getValueForKey("revisionBlueprint");
    },
    getStartTime: function getStartTime() {
        var value = this.getValueForKey("startedTime");
        var newDate = new Date(value);
        if (value !== null && value !== "" && typeof (value) === "string" && Object.prototype.toString.call(newDate) === "[object Date]") {
            return newDate;
        } else {
            return null;
        }
    },
    getEndTime: function getEndTime() {
        var value = this.getValueForKey("endedTime");
        var newDate = new Date(value);
        if (value !== null && value !== "" && typeof (value) === "string" && Object.prototype.toString.call(newDate) === "[object Date]") {
            return newDate;
        } else {
            return null;
        }
    },
    getMostRecentTime: function getMostRecentTime() {
        var queuedTime = this.getQueuedTime();
        var startTime = this.getStartTime();
        var endTime = this.getEndTime();
        if (endTime !== null) {
            return endTime;
        } else if (startTime !== null) {
            return startTime;
        } else {
            return queuedTime;
        }
    },
    getDevices: function getDevices() {
        var value = this.devices;
        return (value === null ? null : value);
    },
    getDeviceById: function getDeviceById(inId) {
        if (inId !== undefined) {
            var device = this.getDevices()[inId];
            if (device !== undefined) {
                return device;
            } else {
                logger().debug("No device found in Integration.getDeviceById.");
                return null;
            }
        } else {
            logger().debug("Missing parameter inId in Integration.getDevicesById.");
            return null;
        }
    },
    getDevicesIds: function getDevicesIds() {
        return this.deviceIdsArray;
    },
    resetCommits: function resetCommits() {
        this.mCommits = [];
    },
    setCommits: function setCommits(inCommits) {
        if (inCommits !== undefined) {
            this.mCommits = inCommits;
            this._buildCommitsByContributor();
        }
    },
    getCommits: function getCommits() {
        return this.mCommits;
    },
    getCommitsCount: function getCommitsCount() {
        var commits = this.getCommits();
        if (commits !== undefined && commits !== null) {
            return commits.length;
        } else {
            return null;
        }
    },
    getCommitsByContributors: function getCommitsByContributors() {
        return this.mContributors;
    },
    getContributorsCount: function getContributorsCount() {
        if (this.getCommitsCount() !== null) {
            var commitCount = this.getCommitsCount();
            if (commitCount === 0) {
                return 0;
            } else {
                var contributors = this.getCommitsByContributors();
                if (contributors !== undefined && contributors !== null) {
                    return Object.keys(contributors).length;
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    },
    getContributorByHash: function getContributorByHash(inHash) {
        if (inHash !== undefined) {
            var contributors = this.getCommitsByContributors();
            if (contributors !== null) {
                var contributor = contributors[inHash];
                if (contributor !== undefined) {
                    return contributor;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    getIssuesByContributors: function getIssuesByContributors() {
        return this.mContributorsIssues;
    },
    getDownloadableAssets: function getDownloadableAssets() {
        return this.getValueForKey("assets");
    },
    getProduct: function getProduct() {
        return this.getValueForKey("assets.product");
    },
    getArchive: function getArchive() {
        return this.getValueForKey("assets.archive");
    },
    hasIpa: function hasIpa() {
        var product = this.getProduct();
        var result = null;
        if (product !== undefined && product !== null) {
            var relativePath = product.relativePath || null;
            if (relativePath !== null && relativePath.indexOf('ipa') !== -1) {
                result = true;
            } else {
                result = false;
            }
        } else {
            result = false;
        }
        return result;
    },
    hasArchive: function hasArchive() {
        var archive = this.getArchive();
        var result = null;
        if (archive !== undefined && archive !== null) {
            var relativePath = archive.relativePath || null;
            if (relativePath !== null) {
                result = true;
            } else {
                result = false;
            }
        } else {
            result = false;
        }
        return result;
    },
    getArchiveSize: function getArchiveSize() {
        return this.getValueForKey("assets.archive.size");
    },
    getArchiveRelativePath: function getArchiveRelativePath() {
        return this.getValueForKey("assets.archive.relativePath");
    },
    hasProduct: function hasProduct() {
        var product = this.getProduct();
        if (product !== null) {
            return true;
        } else {
            return false;
        }
    },
    getProductRelativePath: function getProductRelativePath() {
        return this.getValueForKey("assets.product.relativePath");
    },
    getIpaSize: function getIpaSize() {
        return this.getValueForKey("assets.product.size");
    },
    getDuration: function getDuration() {
        return this.getValueForKey("duration");
    },
    setTags: function setTags(inTags) {
        var tags = this.getTags();
        if (inTags !== undefined && inTags !== null && tags !== undefined && tags !== null) {
            this.data.tags = inTags;
        }
    },
    getTags: function getTags() {
        return this.getValueForKey("tags");
    },
    // Get bot snapshot
    /////////////////////
    getBotSnapshot: function getBotSnapshot() {
        return this.botSnapshot;
    },
    getBotId: function getBotId() {
        return this.botSnapshot.getId();
    },
    getTinyId: function getTinyId() {
        return this.getValueForKey("tinyID");
    },
    getBotName: function getBotName() {
        return this.botSnapshot.getName();
    },
    getBotConfiguration: function getBotConfiguration() {
        return this.botSnapshot.getConfiguration();
    },
    isBotBuiltFromClean: function isBotBuiltFromClean() {
        return this.botSnapshot.isBuiltFromClean();
    },
    getBotSchemeName: function getBotSchemeName() {
        return this.botSnapshot.getSchemeName();
    },
    isMacApp: function isMacApp() {
        return this.botSnapshot.isMacApp();
    },
    isIosApp: function isIosApp() {
        return this.botSnapshot.isIosApp();
    },
    isAnalysisEnabled: function isAnalysisEnabled() {
        return this.botSnapshot.isAnalysisEnabled();
    },
    isTestingEnabled: function isTestingEnabled() {
        return this.botSnapshot.isTestingEnabled();
    },
    isCodeCoverageEnabled: function isCodeCoverageEnabled() {
        return this.botSnapshot.isCodeCoverageEnabled();
    },
    // Helper
    ///////////
    isTerminalStatus: function isTerminalStatus() {
        var currentStep = this.getCurrentStep().toLowerCase();
        return (currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED);
    },
    isRunningStatus: function isRunningStatus() {
        if (this.isForceRunning()) {
            return true;
        }
        var currentStep = this.getCurrentStep().toLowerCase();
        return (currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_PREPARING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_CHECKOUT || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_BEFORE_TRIGGERS || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_TESTING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_ARCHIVING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_PROCESSING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_AFTER_TRIGGERS || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING);
    },
    isStepGreaterOrEqualThan: function (inBaseStep) {
        var currentStep = this.getCurrentStep();
        if (currentStep !== null && typeof (currentStep) === "string") {
            currentStep = currentStep.toLowerCase();

            var statuses = {};
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_UNKNOWN] = 0;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING] = 1;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_PREPARING] = 2;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_CHECKOUT] = 3;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_BEFORE_TRIGGERS] = 4;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING] = 5;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_TESTING] = 6;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_ARCHIVING] = 7;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_PROCESSING] = 8;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_AFTER_TRIGGERS] = 9;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING] = 10;
            statuses[XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED] = 11;

            if (statuses[currentStep] >= statuses[inBaseStep]) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    doesMatchFilter: function doesMatchFilter(inFilter) {
        var result = null;
        if (inFilter !== undefined) {
            switch (inFilter) {
            case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
            default:
                result = true;
                break;
            case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
                if (this.hasFailed()) {
                    result = true;
                } else {
                    result = false;
                }
                break;
            case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
                if (this.hasSucceded()) {
                    result = true;
                } else {
                    result = false;
                }
                break;
            case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
                if (this.hasTag('flagged')) {
                    result = true;
                } else {
                    result = false;
                }
                break;
            }
        }
        return result;
    },
    hasSucceded: function hasSucceded() {
        if (this.getResult() !== null) {
            var result = this.getResult().toLowerCase();
            if (result == XCS.Helpers.INTEGRATION_RESULT_SUCCEEDED) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    hasFailed: function hasFailed() {
        if (this.getResult() !== null) {
            var result = this.getResult().toLowerCase();
            switch (result) {
                case XCS.Helpers.INTEGRATION_RESULT_BUILD_FAILED:
                case XCS.Helpers.INTEGRATION_RESULT_CANCELED:
                case XCS.Helpers.INTEGRATION_RESULT_CHECKOUT_ERROR:
                case XCS.Helpers.INTEGRATION_RESULT_INTERNAL_BUILD_ERROR:
                case XCS.Helpers.INTEGRATION_RESULT_INTERNAL_CHECKOUT_ERROR:
                case XCS.Helpers.INTEGRATION_RESULT_INTERNAL_ERROR:
                case XCS.Helpers.INTEGRATION_RESULT_INTERNAL_PROCESSING_ERROR:
                case XCS.Helpers.INTEGRATION_RESULT_TRIGGER_ERROR:
                    return true;
                default:
                    return false;
            }
        }
        else {
            return false;
        }
    },
    
    isBuildSuccessFull: function isBuildSuccessFull() {
        if (this.getResult() !== null) {
            var result = this.getResult().toLowerCase();
            if (result == XCS.Helpers.INTEGRATION_RESULT_SUCCEEDED || result == XCS.Helpers.INTEGRATION_RESULT_TEST_FAILURES || result == XCS.Helpers.INTEGRATION_RESULT_WARNINGS || result == XCS.Helpers.INTEGRATION_RESULT_ANALYZER_WARNINGS) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    update: function update(inIntegration) {
        if (inIntegration !== undefined && inIntegration !== null) {
            this.data = inIntegration._getData();

            if (inIntegration.getCommits() !== null) {
                this.mCommits = inIntegration.getCommits();
                this.mContributors = inIntegration.getCommitsByContributors();
            }
            this.botSnapshot = XCS.CreateObject('Bot', this._getBotData());
        }
    },
    addTag: function addTag(inTag) {
        var tags = this.getTags();
        if (tags !== undefined && tags !== null && inTag !== undefined && inTag !== null) {
            if (tags.indexOf(inTag) === -1) {
                tags.push(inTag);
                this.setTags(tags);
            }
        }
    },
    removeTag: function removeTag(inTag) {
        var tags = this.getTags();
        if (tags !== undefined && tags !== null && inTag !== undefined && inTag !== null) {
            var index = tags.indexOf(inTag);
            if (index !== -1) {
                tags.splice(index, 1);
                this.setTags(tags);
            }
        }
    },
    hasTag: function hasTag(inTag) {
        var tags = this.getTags();
        if (tags !== undefined && tags !== null && inTag !== undefined && inTag !== null) {
            var index = tags.indexOf(inTag);
            if (index === -1) {
                return false;
            } else {
                return true;
            }
        }
    },
    setForceRunning: function setForceRunning(inValue) {
        if (inValue !== undefined) {
            this.mForceIsRunning = inValue;
        }
    },
    isForceRunning: function isForceRunning() {
        return this.mForceIsRunning;
    },
    // Private methods
    ////////////////////
    _testObj: function _testObj() {
        // id
        if (XCS.isEmpty(this.getId())) {
            this._setValid(false);
            logger().error('Id in %@ is empty'.fmt(this.type), this);
        }
        if (typeof (this.getId()) != "string") {
            this._setValid(false);
            logger().error('Id in %@ is not a string'.fmt(this.type), this);
        }
        // bot
        if (XCS.isEmpty(this.getBotSnapshot())) {
            this._setValid(false);
            logger().error('Bot in %@ is empty'.fmt(this.type), this);
        }
        if (typeof (this.getBotSnapshot()) instanceof XCS.Bot) {
            this._setValid(false);
            logger().error('Bot in %@ is not a Bot'.fmt(this.type), this);
        }
        // currentStep
        if (XCS.isEmpty(this.getCurrentStep())) {
            this._setValid(false);
            logger().error('Current step in %@ is empty'.fmt(this.type), this);
        }
        if (typeof (this.getCurrentStep()) != "string") {
            this._setValid(false);
            logger().error('Current step in %@ is not a string'.fmt(this.type), this);
        }
        // integration number
        if (XCS.isEmpty(this.getIntegrationNumber())) {
            this._setValid(false);
            logger().error('Integration Number in %@ is empty'.fmt(this.type), this);
        }
        if (typeof (this.getIntegrationNumber()) != "number") {
            this._setValid(false);
            logger().error('Integration Number in %@ is not a number'.fmt(this.type), this);
        }
        // tinyId
        if (XCS.isEmpty(this.getTinyId())) {
            this._setValid(false);
            logger().error('Integration TinyID in %@ is empty'.fmt(this.type), this);
        }
        if (typeof (this.getTinyId()) != "string") {
            this._setValid(false);
            logger().error('Integration TinyID in %@ is not a date'.fmt(this.type), this);
        }
        // tags
        if (this.getTags() !== undefined && this.getTags() !== null) {
            if (Object.prototype.toString.call(this.getTags()) != "[object Array]") {
                this._setValid(false);
                logger().error('Integration Tags in %@ is not an Array'.fmt(this.type), this);
            }
        }
        // result
        if (this.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING)) {
            if (XCS.isEmpty(this.getResult())) {
                this._setValid(false);
                logger().error('Result in %@ is empty'.fmt(this.type), this);
            }
            if (typeof (this.getResult()) != "string") {
                this._setValid(false);
                logger().error('Result in %@ is not a string'.fmt(this.type), this);
            }
        }

        // build result summary
        if (this.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING) && this.isBuildSuccessFull()) {
            if (XCS.isEmpty(this.getBuildResultSummary())) {
                this._setValid(false);
                logger().error('Build Result Summary in %@ is empty'.fmt(this.type), this);
            }
            if (typeof (this.getBuildResultSummary()) != "object") {
                this._setValid(false);
                logger().error('Build Result Summary in %@ is not a number'.fmt(this.type), this);
            }
            // analyzer warning count
            if (XCS.isEmpty(this.getAnalyzerWarningCount())) {
                this._setValid(false);
                logger().error('Analyzer Warning Count in %@ is empty'.fmt(this.type), this);
            }
            if (typeof (this.getAnalyzerWarningCount()) != "number") {
                this._setValid(false);
                logger().error('Analyzer Warning Count in %@ is not a number'.fmt(this.type), this);
            }
            // warning count
            if (XCS.isEmpty(this.getWarningCount())) {
                this._setValid(false);
                logger().error('Warning Count in %@ is empty'.fmt(this.type), this);
            }
            if (typeof (this.getWarningCount()) != "number") {
                this._setValid(false);
                logger().error('Warning Count in %@ is not a number'.fmt(this.type), this);
            }
            // error count
            if (XCS.isEmpty(this.getErrorCount())) {
                this._setValid(false);
                logger().error('Error Count in %@ is empty'.fmt(this.type), this);
            }
            if (typeof (this.getErrorCount()) != "number") {
                this._setValid(false);
                logger().error('Error Count in %@ is not a number'.fmt(this.type), this);
            }
        }
    },
    // Used to map integration status to a status string we can use for CSS class names, etc.
    _buildNormalizedStatus: function _buildNormalizedStatus() {
        var result = this.getResult();
        var currentStep = this.getCurrentStep();

        if (currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) {
            if (result.indexOf('error') !== -1) {
                return "error";
            }
            else if (result == XCS.Helpers.INTEGRATION_RESULT_BUILD_FAILED) {
                return 'error';
            }
            else if (result == XCS.Helpers.INTEGRATION_RESULT_TEST_FAILURES) {
                return 'test-fail';
            }
            else if (result == XCS.Helpers.INTEGRATION_RESULT_ANALYZER_WARNINGS) {
                return 'issue';
            }
            else if (result == XCS.Helpers.INTEGRATION_RESULT_WARNINGS) {
                return 'warning';
            }
            else {
                return 'success';
            }
        } else if (currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_PREPARING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_CHECKOUT || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_TRIGGERS || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_PROCESSING || currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING) {
            return "running";
        } else if (currentStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING) {
            return "pending";
        } else {
            return "fail";
        }

        return result;
    },
    _getBotData: function _getBotData() {
        var value = this.getValueForKey('bot');
        return (value === null ? {} : value);
    },
    _getDevicesData: function _getDevicesData() {
        var value = this.getValueForKey('testedDevices');
        return (value === null ? [] : value);
    },
    _buildDevicesDict: function _buildDevicesDict() {
        var devices = this._getDevicesData();
        var devicesDict = {};

        for (var i = 0; i < devices.length; i++) {
            var device = XCS.CreateObject('Device', devices[i]);
            if (device !== null) {
                this.deviceIdsArray.push(device.getId());
                devicesDict[device.getId()] = device;
            }
        }
        return devicesDict;
    },
    _buildCommitsByContributor: function _buildCommitsByContributor() {
        var commits = this.getCommits();
        if (commits.length) {
            this.mContributors = {};
        }
        for (var i = 0; i < commits.length; i++) {
            var commit = commits[i];
            if (commit !== null) {
                if (this.mContributors[commit.getContributorHash()] === undefined) {
                    this.mContributors[commit.getContributorHash()] = [];
                }
                this.mContributors[commit.getContributorHash()].push(commit);
            }
        }
    },
    _buildIssuesByContributor: function _buildIssuesByContributor() {
        if (this.mResultDetails !== null) {
            this.mContributorsIssues = {};

            if (this.mResultDetails.errors && this.mResultDetails.errors.freshIssues) {
                var errors = this.mResultDetails.errors.freshIssues;
                var contributorsFound = {};
                for (var i = 0; i < errors.length; i++) {
                    var commits = errors[i].commits;

                    for (var j = 0; j < commits.length; j++) {
                        var commitData = commits[j];
                        commitData.doc_type = 'commit';
                        var commit = XCS.CreateObject("Commit", commitData);
                        if (commit !== null) {
                            contributorsFound[commit.getContributorHash()] = 1;
                        }
                    }
                }

                for (var key in contributorsFound) {
                    if (this.mContributorsIssues[key] === undefined) {
                        this.mContributorsIssues[key] = {};
                        this.mContributorsIssues[key].errors = 1;
                    } else {
                        this.mContributorsIssues[key].errors += 1;
                    }
                }
            }

            if (this.mResultDetails.warnings && this.mResultDetails.warnings.freshIssues) {
                var warnings = this.mResultDetails.warnings.freshIssues;
                var contributorsFound1 = {};
                for (var k = 0; k < warnings.length; k++) {
                    var commits1 = warnings[k].commits;

                    for (var m = 0; m < commits1.length; m++) {
                        var commitData1 = commits1[m];
                        commitData1.doc_type = 'commit';
                        var commit1 = XCS.CreateObject("Commit", commitData1);
                        if (commit1 !== null) {
                            contributorsFound1[commit1.getContributorHash()] = 1;
                        }
                    }
                }

                for (var key1 in contributorsFound1) {
                    if (this.mContributorsIssues[key1] === undefined) {
                        this.mContributorsIssues[key1] = {};
                        this.mContributorsIssues[key1].warnings = 1;
                    } else {
                        this.mContributorsIssues[key1].warnings += 1;
                    }
                }
            }

            if (this.mResultDetails.analyzerWarnings && this.mResultDetails.analyzerWarnings.freshIssues) {
                var analyzerWarnings = this.mResultDetails.analyzerWarnings.freshIssues;
                var contributorsFound2 = {};
                for (var o = 0; o < analyzerWarnings.length; o++) {
                    var commits2 = analyzerWarnings[o].commits;

                    for (var p = 0; p < commits2.length; p++) {
                        var commitData2 = commits2[p];
                        commitData2.doc_type = 'commit';
                        var commit2 = XCS.CreateObject("Commit", commitData2);
                        if (commit2 !== null) {
                            contributorsFound2[commit2.getContributorHash()] = 1;
                        }
                    }
                }

                for (var key2 in contributorsFound2) {
                    if (this.mContributorsIssues[key2] === undefined) {
                        this.mContributorsIssues[key2] = {};
                        this.mContributorsIssues[key2].analysis = 1;
                    } else {
                        this.mContributorsIssues[key2].analysis += 1;
                    }
                }
            }
        }
    }
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Helpers = XCS.Helpers || new Object();

XCS.Helpers.deviceTestInformationForTimeseriesData = function(inTimeseriesData) {
	var botRunTests = inTimeseriesData;
	
	// Build a structure of tests per device keyed by an identifier we will form, with a results dictionary
	// and passCount, failCount and integrationNumber keys. Results contains each of the test results we see
	// for a given device identifier.  We compute running totals for pass/fail for each device identifier.
	var devices = {};
	
	// For n devices and m test cases we will get nxm items of data (m tests in n columns).  We need to walk
	// over each of the test results, and each of the tags/results for each test result.
	if (botRunTests && botRunTests.length > 0) {
		for (var a = 0; a < botRunTests.length; a++ ) {
			var testResultForSomeDevice = botRunTests[a];
			if (testResultForSomeDevice.tags.length == 0)
				continue;
			
			// Pluck out the tags we care about.
			var deviceName = "";
			var family = "";
			var os = "";
			var processor = "";
			var platformIdentifier = "";
			var modelName = "";
			var modelCode = "";
			var modelUTI = "";
			
			// Tags are returned in a single string as head:value, so we need to split them up.  For each test
			// result we see, we build an identifier from all the tags we care about.  If we haven't seen that
			// identifier before, assume we're looking at a new column of test results for an unseen device. If
			// we have seen that identifier, append the results to the running mDevices hash.
			for (var b = 0; b < testResultForSomeDevice.tags.length; b++) {
				var tag = testResultForSomeDevice.tags[b];
				var headTag = tag.split(":").length && tag.split(":")[0];
				var tagValue = tag.split(":").length && tag.split(":")[1];
				switch (headTag) {
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_OS_TAG:
						os = tagValue;
						break;
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_PROCESSOR_TAG:
						processor = tagValue;
						break;
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_NAME_TAG:
						deviceName = tagValue;
						break;
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_MODEL_UTI:
						modelUTI = tagValue;
						break;
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_MODEL_NAME:
						modelName = tagValue;
						family = tagValue;  // TODO: for now, family and model name tags are the same
						break;
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_MODEL_CODE:
						modelCode = tagValue;
						break;
					case XCS.XcodeServer.BOT_RUN_TEST_DETAIL_PLATFORM_IDENTIFIER_TAG:
						platformIdentifier = tagValue;
						break;
				}
			}
			
			var synthesizedDeviceIdentifier = "%@%@%@%@%@".fmt(family, os, processor, deviceName, platformIdentifier);
			if (!devices[synthesizedDeviceIdentifier]) {
				devices[synthesizedDeviceIdentifier] = {
					Success: 0,
					Fail: 0,
					Tests: []
				};
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_FAMILY_TAG] = family;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_OS_TAG] = os;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_PROCESSOR_TAG] = processor;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_NAME_TAG] = deviceName;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_MODEL_UTI] = modelUTI;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_MODEL_NAME] = modelName;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_MODEL_CODE] = modelCode;
				devices[synthesizedDeviceIdentifier][XCS.XcodeServer.BOT_RUN_TEST_DETAIL_PLATFORM_IDENTIFIER_TAG] = platformIdentifier;
			}
			
			// Ignore bookend tests
			if (testResultForSomeDevice.key == 'IDESchemeActionDummyTestSummary')
				continue;
			
			// Increment the running total of passes/failures for the current device.
			if (testResultForSomeDevice.category == 'test-summary' && testResultForSomeDevice.key == 'fail-count') {
				devices[synthesizedDeviceIdentifier].Fail += testResultForSomeDevice.value;
			} else if (testResultForSomeDevice.category == 'test-summary' && testResultForSomeDevice.key == 'pass-count') {
				devices[synthesizedDeviceIdentifier].Success += testResultForSomeDevice.value;
			} else if (testResultForSomeDevice.category == 'test-run') {
				devices[synthesizedDeviceIdentifier][(testResultForSomeDevice.value) ? 'Success' : 'Fail'] += 1;
			}
			
			// Push this test result into the array of tests for the current device.
			devices[synthesizedDeviceIdentifier].Tests.push(testResultForSomeDevice)
		}
	}
	
	return devices;
};

XCS.Helpers.getDeviceFamily = function(inDeviceInfo) {
	var platformIdentifier = inDeviceInfo.getPlatformIdentifier();
	var modelUTI = inDeviceInfo.getModelUTI();
	var deviceFamily = 'unknown';
	
	// If the platform contains osx, always display a Mac icon.  Otherwise look at the model UTI which we will get for
	// "real" devices, otherwise look at the platform identifier for a device reference e.g. com.apple.iphone-simulator,
	// otherwise look for just simulator (for the generic simulators like com.apple.ios-simulator), and finally fall back
	// to unknown.
	
	if (platformIdentifier && platformIdentifier.toLowerCase().indexOf('osx') > -1)
		deviceFamily = 'mac';
	else if (modelUTI && modelUTI.toLowerCase().indexOf('ipad') > -1)
		deviceFamily = 'ipad';
	else if (modelUTI && modelUTI.toLowerCase().indexOf('ipod') > -1)
		deviceFamily = 'ipod';
	else if (modelUTI && modelUTI.toLowerCase().indexOf('iphone') > -1)
		deviceFamily = 'iphone';
	else if (platformIdentifier && platformIdentifier.toLowerCase().indexOf('ipad') > -1)
		deviceFamily = 'ipad';
	else if (platformIdentifier && platformIdentifier.toLowerCase().indexOf('ipod') > -1)
		deviceFamily = 'ipod';
	else if (platformIdentifier && platformIdentifier.toLowerCase().indexOf('iphone') > -1)
		deviceFamily = 'iphone';
	else if (platformIdentifier && platformIdentifier.toLowerCase().indexOf('simulator') > -1)
		deviceFamily = 'iphone';
	else
		deviceFamily = 'unknown';
		
	return deviceFamily;
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Helpers = XCS.Helpers || new Object();

XCS.Helpers.INTEGRATION_RESULT_UNKNOWN = "unknown";
XCS.Helpers.INTEGRATION_RESULT_SUCCEEDED = "succeeded";
XCS.Helpers.INTEGRATION_RESULT_BUILD_ERRORS = "build-errors";
XCS.Helpers.INTEGRATION_RESULT_TEST_FAILURES = "test-failures";
XCS.Helpers.INTEGRATION_RESULT_WARNINGS = "warnings";
XCS.Helpers.INTEGRATION_RESULT_ANALYZER_WARNINGS = "analyzer-warnings";
XCS.Helpers.INTEGRATION_RESULT_BUILD_FAILED = "build-failed";
XCS.Helpers.INTEGRATION_RESULT_CHECKOUT_ERROR = "checkout-error";
XCS.Helpers.INTEGRATION_RESULT_INTERNAL_ERROR = "internal-error";
XCS.Helpers.INTEGRATION_RESULT_INTERNAL_CHECKOUT_ERROR = "internal-checkout-error";
XCS.Helpers.INTEGRATION_RESULT_INTERNAL_BUILD_ERROR = "internal-build-error";
XCS.Helpers.INTEGRATION_RESULT_INTERNAL_PROCESSING_ERROR = "internal-processing-error";
XCS.Helpers.INTEGRATION_RESULT_CANCELED = "canceled";
XCS.Helpers.INTEGRATION_RESULT_TRIGGER_ERROR = "trigger-error";

XCS.Helpers.INTEGRATION_CURRENT_STEP_UNKNOWN = undefined;
XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING = "pending";
XCS.Helpers.INTEGRATION_CURRENT_STEP_PREPARING = "preparing";
XCS.Helpers.INTEGRATION_CURRENT_STEP_CHECKOUT = "checkout";
XCS.Helpers.INTEGRATION_CURRENT_STEP_BEFORE_TRIGGERS = "before-triggers";
XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING = "building";
XCS.Helpers.INTEGRATION_CURRENT_STEP_TESTING = "testing";
XCS.Helpers.INTEGRATION_CURRENT_STEP_ARCHIVING = "archiving";
XCS.Helpers.INTEGRATION_CURRENT_STEP_PROCESSING = "processing";
XCS.Helpers.INTEGRATION_CURRENT_STEP_AFTER_TRIGGERS = "after-triggers";
XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING = "uploading";
XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED = "completed";


//// !!!!! 
//// THESE ARE OLD AND SHOULD NOT BE USED

XCS.Helpers.BOT_RUN_STATUS_READY = 'ready';
XCS.Helpers.BOT_RUN_STATUS_RUNNING = 'running';
XCS.Helpers.BOT_RUN_STATUS_COMPLETED = 'completed';
XCS.Helpers.BOT_RUN_STATUS_FAILED = 'failed';
XCS.Helpers.BOT_RUN_STATUS_PAUSED = 'paused';
XCS.Helpers.BOT_RUN_STATUS_CANCELED = 'canceled';
XCS.Helpers.BOT_RUN_SUBSTATUS_CHECKOUT = "checkout";
XCS.Helpers.BOT_RUN_SUBSTATUS_BUILDING = "building";
XCS.Helpers.BOT_RUN_SUBSTATUS_UPLOADING = "uploading";
XCS.Helpers.BOT_RUN_SUBSTATUS_BUILD_ERRORS = "build-errors";
XCS.Helpers.BOT_RUN_SUBSTATUS_BUILD_FAILED = "build-failed";
XCS.Helpers.BOT_RUN_SUBSTATUS_CHECKOUT_ERROR = "checkout-error";
XCS.Helpers.BOT_RUN_SUBSTATUS_COMMIT_HISTORY_ERROR = "commit-history-error";
XCS.Helpers.BOT_RUN_SUBSTATUS_INTERNAL_ERROR = "internal-error";
XCS.Helpers.BOT_RUN_SUBSTATUS_INTERNAL_ERRORS = "internal-";
XCS.Helpers.BOT_RUN_SUBSTATUS_TEST_FAILURES = "test-failures";
XCS.Helpers.BOT_RUN_SUBSTATUS_WARNINGS = "warnings";
XCS.Helpers.BOT_RUN_SUBSTATUS_ANALYSIS_ISSUES = "analysis-issues";
XCS.Helpers.BOT_RUN_SUBSTATUS_SUCCEEDED = "succeeded";

/////










// Bot run status element helpers.

XCS.Helpers.BOT_RUN_STATUS_STYLE_TEXT = "BOT_RUN_STATUS_STYLE_TEXT";
XCS.Helpers.BOT_RUN_STATUS_STYLE_ICON = "BOT_RUN_STATUS_STYLE_ICON";

XCS.Helpers.statusElementForBotRunEntity = function(inBotRunEntity, inOptUseIconStyle, inOptDisabled) {
	return XCS.Helpers.statusElementForBotRunStatus(inBotRunEntity.status, inBotRunEntity.subStatus, inOptUseIconStyle, inOptDisabled);
};

XCS.Helpers.statusElementForBotRunStatus = function(inStatus, inSubStatus, inOptUseIconStyle, inOptDisabled) {
	var style = (inOptUseIconStyle ? XCS.Helpers.BOT_RUN_STATUS_STYLE_ICON : XCS.Helpers.BOT_RUN_STATUS_STYLE_TEXT);
	var tabIndex = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_INTEGRATE);
	var elem = Builder.node('span', {'tabindex': tabIndex, 'role': 'presentation', className: 'xc-bot-status'});
	if (style == XCS.Helpers.BOT_RUN_STATUS_STYLE_ICON) elem.addClassName('icon-only');
	if (inOptDisabled) elem.addClassName('disabled');
	XCS.Helpers.updateStatusElementWithStatus(elem, inStatus, inSubStatus);
	return elem;
};

XCS.Helpers.updateStatusElementWithStatus = function(inElement, inStatus, inSubStatus) {
	var elem = $(inElement);
	if (!elem) return;
	var displayedStatusString = XCS.Helpers.statusStringForStatus(inStatus, inSubStatus);
	var iconOnly = false, disabled = false;
	if (elem.hasClassName('icon-only')) iconOnly = true;
	if (elem.hasClassName('disabled')) disabled = true;
	elem.className = "xc-bot-status";
	var normalizedStatus = XCS.Helpers.normalizedStatusForBot(inStatus);
	var normalizedSubStatus = XCS.Helpers.normalizedStatusForBot(inSubStatus);
	var statusClassName = normalizedStatus;
	if (normalizedSubStatus) statusClassName += " " + normalizedSubStatus;
	elem.addClassName(statusClassName);
	if (iconOnly) elem.addClassName('icon-only');
	if (disabled) elem.addClassName('disabled');
	elem.setAttribute('data-status', normalizedStatus);
	elem.setAttribute('data-sub-status', normalizedSubStatus);
	elem.update(displayedStatusString);
};

XCS.Helpers.statusStringForStatus = function(inStatus, inSubStatus) {
	var displayedStatusString = "";
	var normalizedStatus = XCS.Helpers.normalizedStatusForBot(inStatus);
	var normalizedSubStatus = XCS.Helpers.normalizedStatusForBot(inSubStatus);
	var localizedStatus = "_XC.Bot.Status.%@".fmt(XCS.Helpers.localizationStringSubstringForStatus(inStatus)).loc();
	var localizedSubStatus = "_XC.Bot.SubStatus.%@".fmt(XCS.Helpers.localizationStringSubstringForStatus(inSubStatus)).loc();
	if (normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_RUNNING || normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_COMPLETED) {
		if (normalizedSubStatus) {
			displayedStatusString = localizedSubStatus;
		} else {
			displayedStatusString = localizedStatus;
		}
	} else {
		displayedStatusString = localizedStatus;
	}
	return displayedStatusString;
};

// Bot run summary element helpers

XCS.Helpers.summaryElementForBotRunSummary = function(inErrorCount, inWarningCount, inIssueCount, inOptTestsPassed, inOptTestsFailed, inOptPastErrorCount, inOptPastWarningCount, inOptPastIssueCount, inOptPastTestsPassed, inOptPastTestsFailed) {
	
	var tabindexResultsErrors = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_ERRORS);
	var tabindexResultsWarnings = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_WARNINGS);
	var tabindexResultsIssues = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_ISSUES);
	var tabindexResultsSummary = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_SUMMARY_RESULTS_TESTS_SUMMARY);	
	
	var el = Builder.node('div', {'role': 'presentation', className: 'xc-bot-run-summary'}, [
		Builder.node('div', {'tabindex': tabindexResultsErrors, 'aria-readonly': 'true', className: 'status errors'}, [
			Builder.node('div', {className: 'count ellipsis reltext'}),
			Builder.node('div', {className: 'label ellipsis reltext'}, '_XC.Bot.Summary.Errors.Label'.loc())
		]),
		Builder.node('div', {'tabindex': tabindexResultsWarnings, 'aria-readonly': 'true', className: 'status warnings'}, [
			Builder.node('div', {className: 'count ellipsis reltext'}),
			Builder.node('div', {className: 'label ellipsis reltext'}, '_XC.Bot.Summary.Warnings.Label'.loc())
		]),
		Builder.node('div', {'tabindex': tabindexResultsIssues, 'aria-readonly': 'true', className: 'status issues'}, [
			Builder.node('div', {className: 'count ellipsis reltext'}),
			Builder.node('div', {className: 'label ellipsis reltext'}, '_XC.Bot.Summary.AnalysisIssues.Label'.loc())
		]),
		Builder.node('div', {'tabindex': tabindexResultsSummary, 'aria-readonly': 'true', className: 'status test-summary'}, [
			Builder.node('div', {className: 'count ellipsis reltext'}),
			Builder.node('div', {className: 'label passed ellipsis reltext'}, '_XC.Bot.Summary.TestsPassed.Label'.loc()),
			Builder.node('div', {className: 'label failed ellipsis reltext'}, '_XC.Bot.Summary.TestsFailed.Label'.loc())
		])
	]);
	XCS.Helpers.updateSummaryElementWithSummary(el, inErrorCount, inWarningCount, inIssueCount, inOptTestsPassed, inOptTestsFailed, inOptPastErrorCount, inOptPastWarningCount, inOptPastIssueCount, inOptPastTestsPassed, inOptPastTestsFailed);
	return el;
};

XCS.Helpers.summaryElementForTestsOnlyForBotRunSummary = function(inOptTestsPassed, inOptTestsFailed, inOptPastTestsPassed, inOptPastTestsFailed) {
	
	var tabindexResultsTotal = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TOTAL);
	var tabindexResultsFailed = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TESTS_FAILED);
	var tabindexResultsPassed = accessibility().requestTabIndex(XCS.Accessibility.TAB_INDEX_NAME_BOT_HEADER_VIEW_TESTS_RESULTS_TESTS_PASSED);
	
	var el = Builder.node('div', {'role': 'presentation', 'aria-label': "_XC.Accessibility.Label.ResultSummary".loc(), className: 'xc-bot-run-summary'}, [
		Builder.node('div', {'tabindex': tabindexResultsTotal, 'aria-readonly': 'true', className: 'status total-tests'}, [
			Builder.node('div', {className: 'count ellipsis'}),
			Builder.node('div', {className: 'label ellipsis'}, '_XC.Bot.Summary.TestsTotal.Label'.loc())
		]),
		Builder.node('div', {'tabindex': tabindexResultsPassed, 'aria-readonly': 'true', className: 'status passed-tests'}, [
			Builder.node('div', {className: 'count ellipsis'}),
			Builder.node('div', {className: 'label ellipsis'}, '_XC.Bot.Summary.TestsPassed.Label'.loc())
		]),
		Builder.node('div', {'tabindex': tabindexResultsFailed, 'aria-readonly': 'true', className: 'status failed-tests'}, [
			Builder.node('div', {className: 'count ellipsis'}),
			Builder.node('div', {className: 'label ellipsis'}, '_XC.Bot.Summary.TestsFailed.Label'.loc())
		])
	]);
	XCS.Helpers.updateSummaryElementWithSummary(el, undefined, undefined, undefined, inOptTestsPassed, inOptTestsFailed, undefined, undefined, undefined, inOptPastTestsPassed, inOptPastTestsFailed);
	return el;
};

XCS.Helpers.updateSummaryElementWithSummary = function(inElement, inErrorCount, inWarningCount, inIssueCount, inOptTestsPassed, inOptTestsFailed, inOptPastErrorCount, inOptPastWarningCount, inOptPastIssueCount, inOptPastTestsPassed, inOptPastTestsFailed) {
	if (!inElement) return;
	
	var errorsElement = inElement.down('.status.errors');
	if (errorsElement) {
		var errorsCountElement = errorsElement.down('.count');
		
		if (errorsCountElement) {
			errorsCountElement.innerHTML = "";
			errorsElement.addClassName('none');
			errorsElement.removeClassName('delta-increase');
			errorsElement.removeClassName('delta-decrease');
			
			if (inErrorCount !== undefined && inErrorCount == inErrorCount) {
				XCS.Helpers.printBotStatusCount(inErrorCount, errorsCountElement);
				if (inErrorCount == 0) {
					errorsElement.addClassName('none');
				} else {
					errorsElement.removeClassName('none');
				}
			}
		}

		if (inOptPastErrorCount !== undefined && inOptPastErrorCount !== null && inErrorCount != inOptPastErrorCount)
		{
			if (inErrorCount > inOptPastErrorCount) {
				errorsElement.addClassName('delta-increase');
			} else {
				errorsElement.addClassName('delta-decrease');
			}
		}
	}
	
	var warningsElement = inElement.down('.status.warnings');
	if (warningsElement) {
		var warningsCountElement = warningsElement.down('.count');
		if (warningsCountElement) {
			warningsCountElement.innerHTML = "";
			warningsElement.addClassName('none');
			warningsElement.removeClassName('delta-increase');
			warningsElement.removeClassName('delta-decrease');
			
			if (inWarningCount !== undefined && inWarningCount == inWarningCount) {
				XCS.Helpers.printBotStatusCount(inWarningCount, warningsCountElement);
				if (inWarningCount == 0) {
					warningsElement.addClassName('none');
				} else {
					warningsElement.removeClassName('none');
				}
			}
		}

		
		if (inOptPastWarningCount !== undefined && inOptPastWarningCount !== null && inWarningCount != inOptPastWarningCount)
		{
			if (inWarningCount > inOptPastWarningCount) {
				warningsElement.addClassName('delta-increase');
			} else {
				warningsElement.addClassName('delta-decrease');
			}
		}
	}
	
	var issuesElement = inElement.down('.status.issues');
	if (issuesElement) {
		var issueCountElement = issuesElement.down('.count');
		if (issueCountElement) {
			issueCountElement.innerHTML = "";
			issuesElement.addClassName('none');
			issuesElement.removeClassName('delta-increase');
			issuesElement.removeClassName('delta-decrease');
			
			if (inIssueCount !== undefined && inIssueCount == inIssueCount) {
				XCS.Helpers.printBotStatusCount(inIssueCount, issueCountElement);
				if (inIssueCount == 0) {
					issuesElement.addClassName('none');
				} else {
					issuesElement.removeClassName('none');
				}
			}
		}
		
		if (inOptPastIssueCount !== undefined && inOptPastIssueCount !== null && inIssueCount != inOptPastIssueCount)
		{
			if (inIssueCount > inOptPastIssueCount) {
				issuesElement.addClassName('delta-increase');
			} else {
				issuesElement.addClassName('delta-decrease');
			}
		}
	}

	// If we have any failing tests, show fail/total text, otherwise show the total failing or passing.

	var failedTests = (inOptTestsFailed || 0);
	var passedTests = (inOptTestsPassed || 0);
	var totalTests = (failedTests + passedTests);
	
	var testSummaryElement =  inElement.down('.status.test-summary');
	if (testSummaryElement) {
		testSummaryElement.removeClassName('passed').removeClassName('failed').addClassName('none');
		var testSummaryCountElement = testSummaryElement.down('.count');
		if (testSummaryCountElement) {
			testSummaryCountElement.innerHTML = "";
		}
		if (inOptTestsFailed && inOptTestsFailed > 0) {
			XCS.Helpers.printBotStatusCount(failedTests, testSummaryCountElement);
			testSummaryElement.removeClassName('none');
			testSummaryElement.addClassName('failed');
		}
		else if (inOptTestsPassed && inOptTestsPassed > 0) {
			XCS.Helpers.printBotStatusCount(inOptTestsPassed, testSummaryCountElement);
			testSummaryElement.removeClassName('none');
			testSummaryElement.addClassName('passed');
		} else {
			testSummaryElement.addClassName('none');
		}
	}
	
	var totalTestsElement = inElement.down('.status.total-tests');
	if (totalTestsElement) {
		totalTestsElement.removeClassName('passed').removeClassName('failed').addClassName('none');
		var totalTestsCountElement = totalTestsElement.down('.count');
		if (totalTestsCountElement) {
			totalTestsCountElement.innerHTML = "";
		}
		if (totalTests != undefined && totalTests == totalTests) { // "working" version of isNaN; this works, don't touch
			XCS.Helpers.printBotStatusCount(totalTests, totalTestsCountElement);
			(totalTests > 0) ? totalTestsElement.removeClassName('none') : totalTestsElement.addClassName('none');
		}
	}

	var passedTestsElement = inElement.down('.status.passed-tests');
	var failedTestsElement = inElement.down('.status.failed-tests');
	if (passedTestsElement && failedTestsElement) {
		var passedTestsCountElement = passedTestsElement.down('.count');
		var failedTestsCountElement = failedTestsElement.down('.count');
		
		passedTestsElement.removeClassName('passed').addClassName('none');
		failedTestsElement.removeClassName('failed').addClassName('none');
		
		if (passedTestsCountElement) {
			passedTestsCountElement.innerHTML = "";
		}
		if (failedTestsCountElement) {
			failedTestsCountElement.innerHTML = "";
		}
		
		if (passedTests != undefined && passedTests == passedTests) {  // "working" version of isNaN; this works, don't touch
			XCS.Helpers.printBotStatusCount(passedTests, passedTestsCountElement);
			if (passedTests > 0) {
				passedTestsElement.removeClassName('none');
				passedTestsElement.addClassName('passed');
			}
			else {
				passedTestsElement.addClassName('none');
			}
		}
		
		if (failedTests != undefined && failedTests == failedTests) {  // "working" version of isNaN; this works, don't touch
			XCS.Helpers.printBotStatusCount(failedTests, failedTestsCountElement);
			if (failedTests > 0) {
				failedTestsElement.removeClassName('none');
				failedTestsElement.addClassName('failed');
			}
			else {
				failedTestsElement.addClassName('none');
			}
		}
	}
	
	if (testSummaryElement) {
		testSummaryElement.removeClassName('delta-increase');
		testSummaryElement.removeClassName('delta-decrease');
	}
	if (totalTestsElement) {
		totalTestsElement.removeClassName('delta-increase');
		totalTestsElement.removeClassName('delta-decrease');
	}
	if (passedTestsElement && failedTestsElement) {
		passedTestsElement.removeClassName('delta-increase');
		passedTestsElement.removeClassName('delta-decrease');
		failedTestsElement.removeClassName('delta-increase');
		failedTestsElement.removeClassName('delta-decrease');
	}
	
	var passingTestsDidIncrease = (inOptTestsPassed !== undefined && inOptPastTestsPassed !== undefined && inOptTestsPassed > inOptPastTestsPassed);
	var passingTestsDidDecrease = (inOptTestsPassed !== undefined && inOptPastTestsPassed !== undefined && inOptTestsPassed < inOptPastTestsPassed);
	var failingTestsDidIncrease = (inOptTestsFailed !== undefined && inOptPastTestsFailed !== undefined && inOptTestsFailed > inOptPastTestsFailed);
	var failingTestsDidDecrease = (inOptTestsFailed !== undefined && inOptPastTestsFailed !== undefined && inOptTestsFailed < inOptPastTestsFailed);
	var totalTestsDidIncrease = ((inOptTestsPassed !== undefined && inOptPastTestsPassed !== undefined) &&
		(inOptTestsFailed !== undefined && inOptPastTestsFailed !== undefined) &&
		((inOptTestsPassed + inOptTestsFailed) > (inOptPastTestsPassed + inOptPastTestsFailed)));
	var totalTestsDidDecrease = ((inOptTestsPassed !== undefined && inOptPastTestsPassed !== undefined) &&
		(inOptTestsFailed !== undefined && inOptPastTestsFailed !== undefined) &&
		((inOptTestsPassed + inOptTestsFailed) < (inOptPastTestsPassed + inOptPastTestsFailed)));
		
	if (passingTestsDidIncrease) {
		if (passedTestsElement) {
			passedTestsElement.addClassName('delta-increase');
		}
	}
	if (passingTestsDidDecrease) {
		if (passedTestsElement) {
			passedTestsElement.addClassName('delta-decrease');
		}
	}
	if (failingTestsDidIncrease) {
		if (failedTestsElement) {
			failedTestsElement.addClassName('delta-increase');
		}
	}
	if (failingTestsDidDecrease) {
		if (failedTestsElement) {
			failedTestsElement.addClassName('delta-decrease');
		}
	}
	if (totalTestsDidIncrease) {
		if (totalTestsElement) {
			totalTestsElement.addClassName('delta-increase');
		}
	}
	if (totalTestsDidDecrease) {
		if (totalTestsElement) {
			totalTestsElement.addClassName('delta-decrease');
		}
	}
};

// Bot run status helpers.

XCS.Helpers.normalizedStatusForBot = function(inBotStatus) {
	return (inBotStatus || "").toLowerCase();
};

XCS.Helpers.localizationStringSubstringForStatus = function(normalizedStatus) {
	var parts = (normalizedStatus || "").split("-");
	var localizationStringSubstring = "";
	for (var idx = 0; idx < parts.length; idx++) {
		localizationStringSubstring += (parts[idx]).capitalizeFirstCharacter();
	}
	return localizationStringSubstring;
};

// Returns true if a bot has a terminal status.

XCS.Helpers.isTerminalBotStatus = function(inStatus) {
	var normalizedStatus = XCS.Helpers.normalizedStatusForBot(inStatus);
	return (normalizedStatus && (normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_COMPLETED || normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_FAILED || normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_CANCELED));
};
XCS.Helpers.isRunningBotStatus = function(inStatus) {
	var normalizedStatus = XCS.Helpers.normalizedStatusForBot(inStatus);
	return (normalizedStatus && (normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_RUNNING || normalizedStatus == XCS.Helpers.BOT_RUN_STATUS_PAUSED));
};

// Returns a normalized status class for use in (e.g.) Big Screen.

XCS.Helpers.normalizedStatusClassForStatus = function(inStatus, inSubStatus) {
	if (inStatus == XCS.Helpers.BOT_RUN_STATUS_COMPLETED) {
		if (inSubStatus == XCS.Helpers.BOT_RUN_SUBSTATUS_BUILD_ERRORS)
			return 'error';
		else if (inSubStatus == XCS.Helpers.BOT_RUN_SUBSTATUS_BUILD_FAILED)
			return 'error';
		else if (inSubStatus == XCS.Helpers.BOT_RUN_SUBSTATUS_TEST_FAILURES)
			return 'test-fail';
		else if (inSubStatus == XCS.Helpers.BOT_RUN_SUBSTATUS_WARNINGS)
			return 'warning';
		else if (inSubStatus == XCS.Helpers.BOT_RUN_SUBSTATUS_ANALYSIS_ISSUES)
			return 'issue';
		else
			return 'success';
	} else if (inStatus == XCS.Helpers.BOT_RUN_STATUS_FAILED || inStatus == XCS.Helpers.BOT_RUN_STATUS_CANCELED) {
		return 'fail';
	} else if (inStatus == XCS.Helpers.BOT_RUN_STATUS_RUNNING || inStatus == XCS.Helpers.BOT_RUN_STATUS_READY) {
		return 'running';
	} else {
		return 'success';
	}
};

XCS.Helpers.printBotStatusCount = function(inCount, inNode) {
	var digits = inCount.toString().length;
	if (digits == 3 ) {
		inNode.addClassName('three-digits');
	}
	else if (digits == 4 ) {
		inNode.addClassName('four-digits');
	}
	else if (digits >= 5 ) {
		inNode.addClassName('five-digits');
		inNode.setAttribute('title', 'inCount');
	}
	else {
		inNode.removeClassName('three-digits');
		inNode.removeClassName('four-digits');
		inNode.removeClassName('five-digits');
	}
	inNode.textContent = inCount;
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Tools = XCS.Tools || new Object();

XCS.Tools.getHumanReadableFileSize = function getHumanReadableFileSize(inValue) {
	if (inValue !== undefined) {
		var value = parseInt(inValue);
		var i = 0;
		var units = ['bytes', ' KB', ' MB', ' GB', ' TB'];
		while (value > 1024) {
			value = value / 1024;
			i++;
		}
		
		return Math.max(value, 0.1).toFixed(1) + " "+units[i];
	}
	else {
		return null;
	}
};

XCS.Tools.newLinesToHTML = function newLinesToHTML(inValue) {
	if (inValue !== undefined) {
		var value = "";
		value = inValue.replace(/\n/g, '<br/>');
		value = value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
		return value;
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Views.IntegrationStatus = Class.create(XCS.Mvc.View, {
    initialize: function initialize($super) {
        $super();
        this.mTemplate = this.getTemplate('integration_status');
    },
    render: function render() {
        return this.renderTemplate({});
    },
    setBlur: function setBlur(inValue) {
        if (inValue !== undefined) {
            if (inValue) {
                this.mParentElement.classList.add('blur');
            } else {
                this.mParentElement.classList.remove('blur');
            }
        }
    },
    update: function update(inIntegration) {
        var statusNode = this.mParentElement;
        var errorsContainer = statusNode.querySelector('.xcs-integration-status-badge-container.errors');
        var warningsContainer = statusNode.querySelector('.xcs-integration-status-badge-container.warnings');
        var analysisContainer = statusNode.querySelector('.xcs-integration-status-badge-container.analysis');
        var testsContainer = statusNode.querySelector('.xcs-integration-status-badge-container.tests');
        var perfContainer = statusNode.querySelector('.xcs-integration-status-badge-container.performance');

        if (inIntegration !== undefined && inIntegration !== null) {
            var errorCount = (inIntegration.getErrorCount() || 0);
            var errorEnabled = true;
            var analyzerWarningCount = (inIntegration.getAnalyzerWarningCount() || 0);
            var analysisEnabled = (inIntegration.isAnalysisEnabled());
            var warningEnabled = true;
            var warningCount = (inIntegration.getWarningCount() || 0);
            var testCount = (inIntegration.getTestsCount() || 0);
            var failedCount = (inIntegration.getTestFailureCount() || 0);
            var passedCount = Math.max(testCount - failedCount, 0);
            var finalTestCount = 0;
            var regressionPerfTestCount = (inIntegration.getRegressedPerformanceTestCount() || 0);
            var improvedPerfTestCount = (inIntegration.getImprovedPerformanceTestCount() || 0);
            var finalPerfTestCount = 0;
            var testsEnabled = (inIntegration.isTestingEnabled() || false);
            var coveragePercentage = (inIntegration.getCodeCoveragePercentage() || 0);
            var coveragePercentageDelta = (inIntegration.getCodeCoveragePercentageDelta() || 0);
            var coverageEnabled = (inIntegration.isCodeCoverageEnabled() || false);
            var hasSucceeded = (!inIntegration.hasFailed() || false);

            statusNode.classList.remove('integration-failed', 'integration-succeeded', 'errors-success', 'errors-failure', 'errors-disabled', 'warnings-success', 'warnings-failure', 'warnings-disabled', 'analysis-success', 'analysis-failure', 'analysis-disabled', 'tests-enabled', 'tests-positive', 'tests-negative', 'tests-disabled', 'performance-enabled', 'performance-positive', 'performance-negative', 'performance-disabled', 'coverage-enabled', 'coverage-positive', 'coverage-negative', 'coverage-disabled');

            this.setBlur(false);

            if (failedCount === 0) {
                finalTestCount = passedCount;
            } else {
                finalTestCount = failedCount;
            }

            if (regressionPerfTestCount === 0) {
                finalPerfTestCount = improvedPerfTestCount;
            } else {
                finalPerfTestCount = regressionPerfTestCount;
            }

            // Check if build has succeeded and update build summary accordingly
            if (!hasSucceeded) {
                statusNode.classList.add('integration-failed');
                errorEnabled = false;
                warningEnabled = false;
                analysisEnabled = false;
                testsEnabled = false;
                coverageEnabled = false;
            }

            errorsContainer.querySelector('.xcs-integration-status-count').innerHTML = errorCount;
            if (errorEnabled) {
                if (errorCount > 0) {
                    statusNode.classList.add('errors-failure');
                } else if (errorCount === 0) {
                    statusNode.classList.add('errors-success');
                } else {
                    statusNode.classList.add('errors-disabled');
                }
            }
            else {
                statusNode.classList.add('errors-disabled');
            }

            warningsContainer.querySelector('.xcs-integration-status-count').innerHTML = warningCount;
            if (warningEnabled) {
                if (warningCount > 0) {
                    statusNode.classList.add('warnings-failure');
                } else if (warningCount === 0) {
                    statusNode.classList.add('warnings-success');
                } else {
                    statusNode.classList.add('warnings-disabled');
                }
            }
            else {
                statusNode.classList.add('warnings-disabled');
            }

            if (analysisEnabled) {
                if (analyzerWarningCount >= 0) {
                    if (analyzerWarningCount > 0) {
                        statusNode.classList.add('analysis-failure');
                    } else if (analyzerWarningCount === 0) {
                        statusNode.classList.add('analysis-success');
                    }
                    analysisContainer.querySelector('.xcs-integration-status-count-label').innerHTML = analyzerWarningCount;
                }
                else {
                    statusNode.classList.add('analysis-disabled');
                    analysisContainer.querySelector('.xcs-integration-status-count-label').innerHTML = "";
                }
            } else {
                analysisContainer.querySelector('.xcs-integration-status-count-label').innerHTML = "";
                statusNode.classList.add('analysis-disabled');
            }

            if (testsEnabled) {
                if (failedCount === 0) {
                    if (errorCount > 0 && testCount === 0) {
                        testsEnabled = false;
                        statusNode.classList.add('tests-disabled');
                        testsContainer.querySelector('.xcs-integration-status-count-label').innerHTML = "";
                        testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "";
                    }
                    else {
                        statusNode.classList.add('tests-positive');
                        testsContainer.querySelector('.xcs-integration-status-count-label').innerHTML = finalTestCount;
                    }
                } else {
                    statusNode.classList.add('tests-negative');
                    testsContainer.querySelector('.xcs-integration-status-count-label').innerHTML = finalTestCount;
                }
            } else {
                statusNode.classList.add('tests-disabled');
                testsContainer.querySelector('.xcs-integration-status-count-label').innerHTML = "";
                testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "";
                
            }

            if (testsEnabled && finalPerfTestCount > 0) {
                if (regressionPerfTestCount === 0) {
                    statusNode.classList.add('performance-positive');
                } else {
                    statusNode.classList.add('performance-negative');
                }
                perfContainer.querySelector('.xcs-integration-status-count-label').innerHTML = finalPerfTestCount;
                perfContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "_XCS.IntegrationStatus.Performance".loc();
            } else {
                statusNode.classList.add('performance-disabled');
                perfContainer.querySelector('.xcs-integration-status-count-label').innerHTML = "";
                perfContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "";
            }

            if (testsEnabled && coverageEnabled) {
                if (coveragePercentageDelta > 1 || coveragePercentageDelta < -1) {
                    if (coveragePercentageDelta > 1) {
                        statusNode.classList.add('coverage-positive');
                    } else if (coveragePercentageDelta < 1) {
                        statusNode.classList.add('coverage-negative');
                    }
                } else {
                    statusNode.classList.add('coverage-positive');
                }
            }


            var showErrorSeparator = ((inIntegration.getFreshErrorsCount() !== null && inIntegration.getResolvedErrorsCount() !== null && inIntegration.getFreshErrorsCount() !== 0 && inIntegration.getResolvedErrorsCount() !== 0) ? true : false);
            var errorChangeCountContainer = errorsContainer.querySelector('.xcs-integration-status-change-count');
            errorChangeCountContainer.classList.remove('no-separator');
            if (!showErrorSeparator) {
                errorChangeCountContainer.classList.add('no-separator');
            }
            errorsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = ((inIntegration.getFreshErrorsCount() !== 0 && inIntegration.getFreshErrorsCount() !== null) ? "+%@".fmt(inIntegration.getFreshErrorsCount()) : "");
            errorsContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = ((showErrorSeparator) ? 'block' : 'none');
            errorsContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = ((inIntegration.getResolvedErrorsCount() !== 0 && inIntegration.getResolvedErrorsCount() !== null) ? "-%@".fmt(inIntegration.getResolvedErrorsCount()) : "");

            var showWarningsSeparator = ((inIntegration.getFreshWarningsCount() !== null && inIntegration.getResolvedWarningsCount() !== null && inIntegration.getFreshWarningsCount() !== 0 && inIntegration.getResolvedWarningsCount() !== 0) ? true : false);
            var warningChangeCountContainer = warningsContainer.querySelector('.xcs-integration-status-change-count');
            warningChangeCountContainer.classList.remove('no-separator');
            if (!showWarningsSeparator) {
                warningChangeCountContainer.classList.add('no-separator');
            }
            warningsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = ((inIntegration.getFreshWarningsCount() !== 0 && inIntegration.getFreshWarningsCount() !== null) ? "+%@".fmt(inIntegration.getFreshWarningsCount()) : "");
            warningsContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = ((showWarningsSeparator) ? 'block' : 'none');
            warningsContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = ((inIntegration.getResolvedWarningsCount() !== 0 && inIntegration.getResolvedWarningsCount() !== null) ? "-%@".fmt(inIntegration.getResolvedWarningsCount()) : "");

            var showAnalysisSeparator = ((inIntegration.getFreshAnalyzerWarningsCount() !== null && inIntegration.getResolvedAnalyzerWarningsCount() !== null && inIntegration.getFreshAnalyzerWarningsCount() !== 0 && inIntegration.getResolvedAnalyzerWarningsCount() !== 0) ? true : false);
            var analysisChangeCountContainer = analysisContainer.querySelector('.xcs-integration-status-change-count');
            analysisChangeCountContainer.classList.remove('no-separator');
            if (!showAnalysisSeparator) {
                analysisChangeCountContainer.classList.add('no-separator');
            }
            analysisContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = ((inIntegration.getFreshAnalyzerWarningsCount() !== 0 && inIntegration.getFreshAnalyzerWarningsCount() !== null) ? "+%@".fmt(inIntegration.getFreshAnalyzerWarningsCount()) : "");
            analysisContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = ((showAnalysisSeparator) ? 'block' : 'none');
            analysisContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = ((inIntegration.getResolvedAnalyzerWarningsCount() !== 0 && inIntegration.getResolvedAnalyzerWarningsCount() !== null) ? "-%@".fmt(inIntegration.getResolvedAnalyzerWarningsCount()) : "");

            var showTestsSeparator = false;
            testsContainer.classList.add('no-separator');
            testsContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = ((showTestsSeparator) ? 'block' : 'none');
            if ((testsEnabled && !coverageEnabled) || (testsEnabled && coverageEnabled && failedCount === 0) ) {
                if (inIntegration.getTestFailureChange() !== null && inIntegration.getTestFailureChange() !== 0 && inIntegration.getTestFailureChange() > 0) {
                    testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "+%@".fmt(inIntegration.getTestFailureChange());
                }
                else if (inIntegration.getTestFailureChange() !== null && inIntegration.getTestFailureChange() !== 0 && inIntegration.getTestFailureChange() < 0) {
                    testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "%@".fmt(inIntegration.getTestFailureChange());
                }
                else {
                    testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
                }
            }
            
            if (testsEnabled && coverageEnabled) {
                testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
                testsContainer.querySelector('.xcs-integration-status-change-count-solved-test-or-coverage-count').innerHTML = '';
                
                if (failedCount !== 0) {
                    testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "_XCS.IntegrationStatus.TestTotalCount".loc(testCount);
                }
                if (coveragePercentageDelta > 1 || coveragePercentageDelta < -1) {
                    testsContainer.querySelector(".xcs-integration-status-change-count-solved-coverage").innerHTML = "_XCS.IntegrationStatus.Coverage".loc();
                    testsContainer.querySelector(".xcs-integration-status-change-count-solved-test-or-coverage-count").innerHTML = "_XCS.IntegrationStatus.CoverageDeltaCount".loc(coveragePercentageDelta);
                    testsContainer.querySelector(".xcs-integration-status-change-count-solved-glyph").classList.remove('hide');
                } else {
                    testsContainer.querySelector(".xcs-integration-status-change-count-solved-coverage").innerHTML = "";
                    testsContainer.querySelector(".xcs-integration-status-change-count-solved-test-or-coverage-count").innerHTML = "_XCS.IntegrationStatus.CoverageCount".loc(coveragePercentage);
                    testsContainer.querySelector(".xcs-integration-status-change-count-solved-glyph").classList.add('hide');
                }
            }
            else if (testsEnabled && !coverageEnabled) {
                testsContainer.querySelector(".xcs-integration-status-change-count-solved-coverage").innerHTML = "";
                testsContainer.querySelector(".xcs-integration-status-change-count-solved-test-or-coverage-count").innerHTML = "";
                testsContainer.querySelector(".xcs-integration-status-change-count-solved-glyph").classList.add('hide');
            }
            else if (!testsEnabled) {
                testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = "";
                testsContainer.querySelector('.xcs-integration-status-change-count-solved-test-or-coverage-count').innerHTML = "";
                testsContainer.querySelector(".xcs-integration-status-change-count-solved-glyph").classList.add('hide');
            }

            perfContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = 'none';
            perfContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = "";

            if (inIntegration.hasSucceded()) {
                statusNode.classList.add('integration-succeeded');
            } else {
                statusNode.classList.remove('integration-succeeded');
            }

        } else {
            statusNode.classList.remove('integration-failed', 'integration-succeeded', 'errors-success', 'errors-failure', 'errors-disabled', 'warnings-success', 'warnings-failure', 'warnings-disabled', 'analysis-success', 'analysisfailure', 'analysis-disabled', 'tests-enabled', 'tests-positive', 'tests-negative', 'tests-disabled', 'performance-enabled', 'performance-positive', 'performance-negative', 'performance-disabled', 'coverage-enabled', 'coverage-positive', 'coverage-negative', 'coverage-disabled');
            statusNode.classList.add('errors-disabled', 'warnings-disabled', 'analysis-disabled', 'tests-disabled', 'performance-disabled', 'coverage-disabled');

            errorsContainer.querySelector('.xcs-integration-status-count').innerHTML = '0';
            errorsContainer.querySelector('.xcs-integration-status-change-count').classList.add('no-separator');
            errorsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
            errorsContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = 'none';
            errorsContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = '';

            warningsContainer.querySelector('.xcs-integration-status-count').innerHTML = '0';
            warningsContainer.querySelector('.xcs-integration-status-change-count').classList.add('no-separator');
            warningsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
            warningsContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = 'none';
            warningsContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = '';

            analysisContainer.querySelector('.xcs-integration-status-count-label').innerHTML = '';
            analysisContainer.querySelector('.xcs-integration-status-change-count').classList.add('no-separator');
            analysisContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
            analysisContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = 'none';
            analysisContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = '';

            testsContainer.querySelector('.xcs-integration-status-count-label').innerHTML = '';
            testsContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
            testsContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = 'none';
            testsContainer.querySelector('.xcs-integration-status-change-count-solved-coverage').innerHTML = '';
            testsContainer.querySelector('.xcs-integration-status-change-count-solved-test-or-coverage-count').innerHTML = '';
            testsContainer.querySelector(".xcs-integration-status-change-count-solved-glyph").classList.add('hide');

            perfContainer.querySelector('.xcs-integration-status-count-label').innerHTML = '';
            perfContainer.querySelector('.xcs-integration-status-change-count-fresh').innerHTML = '';
            perfContainer.querySelector('.xcs-integration-status-change-count-separator').style.display = 'none';
            perfContainer.querySelector('.xcs-integration-status-change-count-solved').innerHTML = '';

            this.setBlur(true);
        }
    }
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Main view class.

XCS.Views.MainView = Class.create(XCS.Mvc.View, {
	render: function() {
		var elem = Builder.node('div', {id: 'main'});
		return elem;
	},
	makeAccessible: function() {
		// Set Navigation landmark (Actions/Nav)
		var main = this.mParentElement;
		main.writeAttribute('aria-label', "_Accessibility.Navigation.PageContent".loc());
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Application = XCS.Application || new Object();

// Some globals we'll want to reference later.

var mainView, mainViewController, mainView;

// Basic error message support.

var renderErrorMessage = function(inErrorMessage, inOptShowBanner) {
	var view = new XCS.Views.ErrorMessageView({
		mErrorMessage: inErrorMessage
	});
	mainView.addSubview(view, '#main', true);
};

var renderErrorHTML = function(inErrorHTML, inOptShowBanner) {
	var view = new XCS.Views.ErrorMessageView({
		mErrorMessage: ""
	});
	view.forceRender();
	// This is safe because only we generate the supplied inner HTML.
	view.$('p').innerHTML = inErrorHTML;
	mainView.addSubview(view, '#main', true);
};

// Base application class.

XCS.Application = Class.create({
	mRoutesTriggerReload: true,
	mApplicationIdentifier: '',
	initialize: function(/* [options] */) {
		if (arguments && arguments.length > 0) Object.extend(this, arguments[0]);
		globalNotificationCenter().subscribe('PAGE_INITIALIZE_FINISHED', this.__initialize.bind(this));
	},
	// Internal function that is called to initialize this application. You should not
	// normally override this function.
	__initialize: function() {
		this.__registerRoutes();
		this.createApplication();
	},
	// Called when the page is ready and the application will be created.
	createApplication: function() {
		// Routes should trigger a page reload on desktop.
		globalRouteHandler().mRoutesTriggerReload = this.mRoutesTriggerReload;
		// Write the locale to the body tag.
		document.body.addClassName(globalLocalizationManager().getLprojLocale());
		document.body.addClassName(this.mApplicationIdentifier);
		// Create a special root view and append it to the DOM so we have something to draw into.
		mainView = new XCS.Views.MainView();
		mainView._render();
		var mainViewParentElement = mainView.mParentElement;
		mainViewParentElement.id = 'root';
		document.body.appendChild(mainViewParentElement);
		// Create the root view controller.
		mainViewController = new XCS.Mvc.ViewController();
		mainViewController.mViewInstance = mainView;
	},
	// Your subclass should implement this function to return a tuple of route patterns and routing functions.
	// Note that routes should be returned in most to least specific order.
	computeRoutes: function() { /* Interface */ },
	// Internal function that registers routes computed above.
	__registerRoutes: function() {
		var routes = (this.computeRoutes() || []);
		var route, routePattern, routeFunction;
		for (var rdx = 0; rdx < routes.length; rdx++) {
			route = routes[rdx];
			routePattern = route[0];
			routeFunction = route[1];
			globalRouteHandler().register(routePattern, routeFunction);
		}
	},
	routeInitialRequest: function() {
		var routeURL = XCS.getRouteFromURL();
		var routed;
		if (routeURL) {
			routed = globalRouteHandler().routeURL(routeURL, undefined, true);
		}
		if (!routeURL || !routed) {
			globalRouteHandler().routeURL('/', undefined, true);
		}
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Shared desktop route helpers.

XCS.RouteHelpers = XCS.RouteHelpers || new Object();

// Sets the browser title.

XCS.RouteHelpers.setBrowserWindowTitle = function(inTitle) {
	var title = (inTitle || "_XCServer".loc());
	document.title = title;
};

XCS.RouteHelpers.setBodyClassName = function(inClassName, inOptShouldSet) {
	if (!inClassName) return;
	var shouldSet = (inOptShouldSet == undefined ? true : inOptShouldSet);
	if (shouldSet) {
		document.body.addClassName(inClassName);
	} else {
		document.body.removeClassName(inClassName);
	}
};

XCS.RouteHelpers.setTopLevelClassNames = function(inOptShouldSet) {
	XCS.RouteHelpers.setBodyClassName('toplevel', inOptShouldSet);
};

XCS.RouteHelpers.setContentPrimaryFullWidth = function(inOptShouldSet, inOptShouldAnimate) {
	var shouldSet = (inOptShouldSet == undefined ? true : inOptShouldSet);
	var contentPrimary = mainView.$();
	if (shouldSet) {
		contentPrimary.addClassName('full-width');
	} else {
		contentPrimary.removeClassName('full-width');
	}
};

// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.Routes = XCS.Routes || new Object();

// Built-in regexp patterns for default application routes.

XCS.Routes.TrailingSlashOptionalQueryParam = "/?(\\\?[^\/]+)?";

// Route notifications.

XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE = 'ROUTES_SHOULD_UPDATE';
XCS.Routes.NOTIFICATION_ROUTE_DID_DISPATCH = 'ROUTE_DID_DISPATCH';
XCS.Routes.NOTIFICATION_ROUTE_DID_COMPLETE = 'ROUTE_DID_COMPLETE';
XCS.Routes.NOTIFICATION_ROUTE_DID_FAIL = 'ROUTE_DID_FAIL';
XCS.Routes.NOTIFICATION_UPDATE_ROUTES_TAB_NAME = 'UPDATE_ROUTES_TAB_NAME';
XCS.Routes.NOTIFICATION_UPDATE_ROUTES_INTEGRATION_NUMBER = 'UPDATE_ROUTES_INTEGRATION_NUMBER';

// Route constants.

XCS.Routes.ROUTE_FAILED = 0;
XCS.Routes.ROUTE_FIRED = 1;
XCS.Routes.ROUTE_QUEUED = 2;
XCS.Routes.ROUTE_IGNORED = 3;

// Base route class. A route is a combination of a route regex pattern and a callback function
// that fires when that route is matched.

XCS.Routes.Route = Class.create(XCS.Object, {
	mRegexPatternString: null,
	mCallback: null,
	initialize: function(/* [options] */) {
		if (arguments && arguments.length > 0) Object.extend(this, arguments[0]);
	},
	// Callback function that will fire when this route is activated. You will be passed a
	// XCS.Routes.RouteInvocation instance.
	mCallback: function(inRouteInvocation) {
		window.location.url = inURL;
	}
});

// Route invocation class. Your route callback will be passed a route invocation when it fires.
// The global routes system only fires one route at a time. When your route fires, you can do
// whatever work you need to in your route callback function, but it is your responsibility to
// call routeDidComplete or routeDidFail to dequeue this route invocation from the global queue.

XCS.Routes.RouteInvocation = Class.create(XCS.Object, {
	// The URL that activated this route.
	url: null,
	// A hash of named regular expression matches (e.g. {tinyID: 'abc123', title: 'Title.html'}).
	namedMatches: null,
	// An array of all matches. 
	matches: null,
	// Callback function for this route.
	callback: null,
	// Should this route alter the URL hash?
	setURLHash: false,
	// Should we push a URL state for this route?
	pushURLState: false,
	// Window title for this route.
	windowTitle: "",
	// State.
	_completed: false,
	_failed: false,
	routeDidComplete: function() {
		this._completed = true;
		globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTE_DID_COMPLETE, this);
	},
	routeDidFail: function() {
		this._failed = true;
		globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTE_DID_FAIL, this);
	}
});

// A wrapper around an array that behaves as a stack.

XCS.Routes.RouteHistoryStack = Class.create({
	initialize: function() {
		this.flush();
	},
	stack: function() {
		return this._stack;
	},
	// Pushes a new route on to the stack returning true where the route was added successfully.
	pushRoute: function(inRoute) {
		if (inRoute) {
			this._stack.push(inRoute);
			return true;
		}
		return false;
	},
	// Pops the least recent route from the stack and returns it.
	popLeastRecentRoute: function() {
		return this._stack.shift();
	},
	// Pops the most recent route from the stack and returns it.
	popMostRecentRoute: function() {
		return this._stack.pop();
	},
	flush: function() {
		this._stack = new Array();
	},
	isFirstLoad: function(){
		var stack = this.stack();
		if (stack.length > 1) {
			return true;
		}
		else {
			return false;
		}
	}
});

// Route handling.

XCS.Routes.GlobalRouteHandler = Class.createWithSharedInstance('globalRouteHandler');
XCS.Routes.GlobalRouteHandler.prototype = {
	// An array of (compiledRegex, groupingNames, callback) tuples for each registered route.
	mRegisteredRoutes: new Array(),
	// Global route queue.  Routes are dispatched from this queue in order, one at a time.
	mGlobalRouteQueue: new Array(),
	// The currently active route.
	mCurrentRoute: null,
	// Route history stack.  When a route is fired, the invocation is automatically pushed onto the route history stack.
	mRouteStack: new XCS.Routes.RouteHistoryStack(),
	// The current prefire callback function.
	mRoutePrefireCallback: null,
	// Does firing a route trigger a page redirect to the route url?
	mRoutesTriggerReload: false,
	// Should we set the URL hash by default?
	mDefaultRoutesSetURLHash: false,
	// Should we push URL state by default?
	mDefaultRoutesPushURLState: false,
	// Should we route ALL links (regardless of their cc-routable status)?
	mRouteAllLinks: true,
	// touch start y position
	mTouchStartY: null,
	// touch end y position
	mTouchEndY: null,
	// The CSS selector that determines which elements should be routeable.
	mRouteSelectorPattern: '*.xcs-routable:not(.xcs-route-enabled)',
	initialize: function() {
		globalNotificationCenter().subscribe(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE, this.handleRoutesShouldUpdateNotification.bind(this));
		globalNotificationCenter().subscribe(XCS.Routes.NOTIFICATION_ROUTE_DID_COMPLETE, this.handleRouteStatusNotification.bind(this));
		globalNotificationCenter().subscribe(XCS.Routes.NOTIFICATION_ROUTE_DID_FAIL, this.handleRouteStatusNotification.bind(this));
		window.onpopstate = this.handlePopStateEvent.bind(this);
	},
	// Registers an arbitrary pattern string and callback function.
	register: function(inRegexPatternString, inCallback) {
		var route = new XCS.Routes.Route({
			'mRegexPatternString': inRegexPatternString,
			'mCallback': inCallback
		});
		this.registerRoute(route);
	},
	// Registers a new XCS.Routes.Route handler.
	registerRoute: function(inRoute) {
		if (!XCS.kindOf(inRoute, XCS.Routes.Route)) logger().error("Tried to register something other than a XCS.Routes.Route as a route handler");
		var patternString = inRoute.mRegexPatternString, callback = inRoute.mCallback;
		// Compile the regex for this route, and keep track of the named groupings.
		var namedParamMatchesRegex = /(:[A-Za-z0-9-_]+)/g;
		var namedParamMatches = patternString.match(namedParamMatchesRegex);
		var replacedPatternString = patternString.replace(namedParamMatchesRegex, "([^\/]+)");
		replacedPatternString = "^" + replacedPatternString.replace(/\//g, "\\/") + "$";
        
        if (typeof(testEnv) !== "undefined" && testEnv === true) {
            replacedPatternString = inRoute;
        }
        
		// Drop the ":" off the front of each grouping name.
		var groupingNames = [];
		if (namedParamMatches) {
			for (var idx = 0; idx < namedParamMatches.length; idx++) {
				var param = namedParamMatches[idx];
				groupingNames.push(param.substring(1, param.length));
			}
		}
		// Push this registered route in reverse-registered order so routes registered later have the opportunity
		// to override default routes.
		this.mRegisteredRoutes.unshift([replacedPatternString, groupingNames, inRoute.mCallback, patternString]);
		logger().debug("Registered new route (%@, %@, %@)", replacedPatternString, groupingNames, inRoute.mCallback);
	},
	// Evaluates a URL against all registered route handlers (in the order in which they were registered). Instantiates
	// a route invocation for the first matching route, and pushes it on to the global route dispatch queue.
	__evaluateURL: function(inURLString) {
		if (!inURLString) return false;
		var routes = this.mRegisteredRoutes, route, regexp, namedGroupings, namedGrouping, callback, originalRoutePattern, matches, namedMatches;
		for (var rdx = 0; rdx < routes.length; rdx++) {
			route = routes[rdx];
			regexp = route[0], namedGroupings = route[1], callback = route[2], originalRoutePattern = route[3], matches, namedMatches = {};
			// Evaluate the URL against the compiled regular expression for this route.
			matches = inURLString.match(regexp);
			if (matches && matches.length) {
				// We got a match, do we have any named groupings?
				if (namedGroupings && namedGroupings.length) {
					for (gdx = 0; gdx < namedGroupings.length; gdx++) {
						namedGrouping = namedGroupings[gdx];
						if (namedGrouping) namedMatches[namedGrouping] = matches[gdx + 1].escapeHTML();
					}
				}
				
				if (namedMatches['containerName'] && namedMatches['containerName'] != 'projects' && namedMatches['containerName'] != 'people' && namedMatches['containerName'] != 'mypage') {
					logger().warn("Failed to find matching route for URL (%@) with container name (%@)".fmt(inURLString, namedMatches['containerName']));
					return false;
				}
				
				// Return a tuple of callback, url, hash of named matches and array of original matches for the regex.
				logger().debug("Found matching route for URL (%@, %@, %@, %@)".fmt(inURLString, namedMatches, matches, callback));
				return [callback, inURLString, namedMatches, matches, originalRoutePattern];
			} else {
				continue;
			}
		}
		logger().warn("Failed to find matching route for URL (%@)".fmt(inURLString));
		return false;
	},
	// Internal method that dispatches the next route in the global route queue. You should not call manually.
	__dispatchRoute: function(inRouteInvocation) {
		if (!inRouteInvocation || !inRouteInvocation.url) return XCS.Routes.ROUTE_FAILED;
		var url = inRouteInvocation.url;
		// Do we have a queued identical route? Routes are deemed to be identical if their URLs are identical.
		var queue = this.mGlobalRouteQueue, queueItem;
		if (queue.length) {
			for (var idx = (queue.length - 1); idx >= 0; idx--) {
				queueItem = queue[idx];
				if (queueItem && queueItem.url == url) {
					logger().info("Ignoring route because an identical route is already queued (%@)".fmt(url));
					return XCS.Routes.ROUTE_IGNORED;
				}
			}
		}
		// Do we have a route in progress that is identical?
		if (this.mCurrentRoute && (this.mCurrentRoute.url == url)) {
			logger().info("Ignoring route because it has a url that is identical to the last route (%@)".fmt(url));
			return XCS.Routes.ROUTE_IGNORED;
		}
		// Push this route invocation onto the queue.
		this.mGlobalRouteQueue.push(inRouteInvocation);
		// Immediately dispatch if we don't have an active route already.
		if (!this.mCurrentRoute) this.__dispatchNextRoute();
	},
	__dispatchNextRoute: function() {
		delete this.mCurrentRoute;
		if (this.mGlobalRouteQueue.length > 0) {
			var queued = false;
			if (this.mGlobalRouteQueue.length != 1) queued = true;
			// Grab the next route invocation in the dispatch queue.
			var nextRoute = this.mGlobalRouteQueue.shift();
			if (nextRoute && nextRoute.callback) {
				this.mCurrentRoute = nextRoute;
				var cb = nextRoute.callback;
				cb(nextRoute);
				globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTE_DID_DISPATCH, nextRoute);
				// Push the route we just fired onto the route stack.
				this.mRouteStack.pushRoute(nextRoute);
				return (queued ? XCS.Routes.ROUTE_QUEUED : XCS.Routes.ROUTE_FIRED);
			} else {
				this.__dispatchNextRoute();
			}
		}
	},
	// Enables a route for every link tag or element with a cc-routable class name element on the page.
	handleRoutesShouldUpdateNotification: function(inMessage, inObject, inOptExtras) {
		var bound = this.routeEvent.bindAsEventListener(this);
		var routables = [], routable;
		var selector = (this.mRouteAllLinks ? this.mRouteSelectorPattern : this.mRouteSelectorPattern);
		// Did we get passed an explicit root element?
		if (inOptExtras && inOptExtras.rootElement) {
			routables = inOptExtras.rootElement.querySelector(selector);
		} else {
			routables = document.querySelectorAll(selector);
		}
		for (var idx = 0; idx < routables.length; idx++) {
			routable = routables[idx];
			if (browser().isMobile()) {
				var touchStartCallback = function(inEvent) {
					if (inEvent !== undefined && inEvent.targetTouches !== undefined && inEvent.targetTouches.length && inEvent.targetTouches[0] !== undefined && inEvent.targetTouches[0].clientY !== undefined) {
						this.mTouchStartY = inEvent.targetTouches[0].clientY;
					}
					
				}.bind(this);
				
				var touchEndCallback = function(inEvent) {
					if (inEvent !== undefined && inEvent.changedTouches !== undefined && inEvent.changedTouches.length && inEvent.changedTouches[0] !== undefined && inEvent.changedTouches[0].clientY !== undefined) {
						this.mTouchEndY = inEvent.changedTouches[0].clientY;
					}
					if (this.mTouchStartY !== null && this.mTouchEndY !== null) {
						if ( (Math.abs(this.mTouchEndY - this.mTouchStartY) > 10) || (Math.abs(this.mTouchEndY - this.mTouchStartY) > 10) ) {
							inEvent.preventDefault();
						}
						else {
							bound();
						}
					}
					this.mTouchStartY = null;
					this.mTouchEndY = null;
				}.bind(this);
				
                routable.addEventListener('touchstart', touchStartCallback);
                routable.addEventListener('touchend', touchEndCallback);
			}
			else {
                routable.addEventListener('click', bound);
			}
            routable.classList.add('xcs-route-enabled');
		}
	},
	// Route status changed notification handler.
	handleRouteStatusNotification: function(inMessage, inObject, inOptExtras) {
		var didComplete = (inMessage == XCS.Routes.NOTIFICATION_ROUTE_DID_COMPLETE);
		didComplete ? logger().debug("Route completed:", inObject) : logger().error("Route failed:", inObject);
		if (inObject == this.mCurrentRoute) {
			// Set the URL hash if we need to.
			var setHash = (inObject.setURLHash || this.mDefaultRoutesSetURLHash);
			if (didComplete && setHash) window.location.hash = "route=%@".fmt(inObject.url);
			// Push the URL state if we need to.
			var shouldPushURLState = (inObject.pushURLState || this.mDefaultRoutesPushURLState);
			if (didComplete && shouldPushURLState) {
				if (history.pushState) {
					history.pushState({}, (inObject.windowTitle || ""), inObject.url);
				}
				else {
					window.location = inObject.url;
				}
			}
			this.__dispatchNextRoute();
		} else {
			logger().debug("Got a route notification for a route other than the active route, ignoring");
		}
	},
	handlePopStateEvent: function(inEvent) {
		if (this.mRouteStack.isFirstLoad()) {
			this.routeURL(window.location.pathname, undefined, true, false, false, document.title);
		}
	},
	// Default callback for all routed elements which evaluates a URL to a routing tuple and fires a registered
	// callback where it exists. Otherwise the event proceeds as normal.
	routeEvent: function(inEvent) {
		var isCommandClick = isCommandClickEvent(inEvent);
		
		var elem = Event.findElement(inEvent, '.xcs-route-enabled');
		if (elem) {
			// Grab the URL by looking at a data-route-href attribute first, and an href second.
			var href = elem.getAttribute('data-route-href') || elem.getAttribute('href');
			var redirectOverrideFlag = (elem.getAttribute('data-redirect-override') == "true" ? true : false);
			var pushState = (elem.getAttribute('data-push-state') == "true" ? true : false);
			var urlHash = (elem.getAttribute('data-url-hash') == "true" ? true : false);

			var botName = (elem.getAttribute('data-bot-name'));
			
			if (!isCommandClick) {
				inEvent.preventDefault();
			}
			else {
				return true;
			}
			
			if (href) {
				return this.routeURL(href, inEvent, redirectOverrideFlag, urlHash, pushState);
			}
		}
		return false;
	},
	routeURL: function(inURL, inOptSourceEvent, inOptRedirectOverrideFlag, inOptSetURLHash, inOptPushURLState, inOptWindowTitle) {
		// Do we have a prefire callback?  If we do, check if we should even process this route.
		if (this.mRoutePrefireCallback) {
			var _callback = this.mRoutePrefireCallback;
			var shouldProceed = _callback();
			if (!shouldProceed) return true;
		}
		var routeTuple = this.__evaluateURL(inURL);
		var routeInvocation;
		if (routeTuple && routeTuple.length) {
			// Do routes trigger a page reload?  Only redirect if the override flag has not been passed.
			if (this.mRoutesTriggerReload && !inOptPushURLState && !inOptRedirectOverrideFlag) {
				window.location.href = inURL;
				return true;
			}
			// Stop the event since we're about to handle it.
			if (inOptSourceEvent) Event.stop(inOptSourceEvent);
			var callback = routeTuple[0], url = routeTuple[1], namedMatches = routeTuple[2], matches = routeTuple[3], originalRoutePattern = routeTuple[4];
			// Initialize a route invocation.
			var invocationHash = {
				'callback': (callback || Prototype.emptyFunction),
				'url': (url || ""),
				'namedMatches': (namedMatches || {}),
				'matches': (matches || []),
				'originalRoutePattern': originalRoutePattern
			};
			if (inOptSetURLHash !== undefined) invocationHash['setURLHash'] = (inOptSetURLHash == true);
			if (inOptPushURLState !== undefined) invocationHash['pushURLState'] = (inOptPushURLState == true);
			if (inOptWindowTitle) invocationHash['windowTitle'] = inOptWindowTitle;
			routeInvocation = new XCS.Routes.RouteInvocation(invocationHash);
			// Dispatch it.
			this.__dispatchRoute(routeInvocation);
			return true;
		}
		logger().debug("Got an empty route tuple after evaluating URL (%@)", inURL);
		return false;
	},
	// Registers a callback function that fires before any route is fired similar to the window onunload event
	// that fires when the user tries to click away from the active window.  Useful for mimicing the same
	// behavior where routes are in use but the window is not reloading.  If you return true the route will fire,
	// otherwise the route will be cancelled.
	setRoutePrefireCallback: function(inCallback) {
		if (!inCallback) {
			logger().warn("Called setRoutePrefireCallback without passing a valid callback (%@) ... current callback will be cleared", inCallback);
			this.mRoutePrefireCallback = null;
		} else {
			logger().debug("Set a new prefire callback (%@) in globalRouteHandler", inCallback);
			this.mRoutePrefireCallback = inCallback;
		}
	}
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

// Returns the current set of URL parameters in an Object keyed by parameter name.

XCS.params = function(inOptHref) {
	var href = (inOptHref || window.location.href);
	var properties = href.slice(href.indexOf('?') + 1);
	return properties.toQueryParams();
};

// Sniffs a route from the URL itself, expects http://.../wiki/foo/bar.

XCS.getRouteFromURL = function() {
	var search = window.location.search;
	var href = window.location.pathname + (search != "?" ? search : "");
	return href;
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var test_bigscreen_controller = function test_bigscreen_controller() {
    
     test('BigScreenUIController', function() {
         stop();
         new XCS.BigScreen.Application();
         globalNotificationCenter().publish('PAGE_INITIALIZE_FINISHED', document);
     });
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var botData = {
   "_id": "63b507c3a62d7885c6bb28fcf33012fc",
   "_rev": "5-8dc11b63dfaf82f079f23ef186b8bd22",
   "group": {
       "name": "9870B6F4-7C34-4C5E-8A5F-4BAED97CDC4A"
   },
   "configuration": {
       "builtFromClean": 0,
       "periodicScheduleInterval": 0,
       "performsTestAction": true,
       "triggers": [
       ],
       "performsAnalyzeAction": true,
       "schemeName": "ShutterBugz",
       "weeklyScheduleDay": 0,
       "testingDeviceIDs": [
           "63b507c3a62d7885c6bb28fcf300a874"
       ],
       "minutesAfterHourToIntegrate": 0,
       "hourOfIntegration": 0,
       "scheduleType": 3,
       "performsArchiveAction": true,
       "testingDestinationType": 3,
       "sourceControlBlueprint": {
           "DVTSourceControlWorkspaceBlueprintLocationsKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                   "DVTSourceControlBranchIdentifierKey": "master",
                   "DVTSourceControlBranchOptionsKey": 214,
                   "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
               }
           },
           "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
           "DVTSourceControlWorkspaceBlueprintWorkingCopyRepositoryLocationsKey": {
           },
           "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationStrategiesKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationTypeKey": "DVTSourceControlBasicAuthenticationStrategy"
               }
           },
           "DVTSourceControlWorkspaceBlueprintWorkingCopyStatesKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": 0
           },
           "DVTSourceControlWorkspaceBlueprintIdentifierKey": "A6F0DA83-FCD5-47FC-96FC-956C9E3B3A6F",
           "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz/"
           },
           "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
           "DVTSourceControlWorkspaceBlueprintVersion": 203,
           "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
           "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
               {
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
               }
           ]
       }
   },
   "name": "ShutterBugz",
   "type": 1,
   "integration_counter": 2,
   "doc_type": "bot",
   "tinyID": "FD73C2E",
   "lastRevisionBlueprint": {
       "DVTSourceControlWorkspaceBlueprintLocationsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": {
               "DVTSourceControlBranchIdentifierKey": "master",
               "DVTSourceControlLocationRevisionKey": "3850f10853e1301494cd8f2d98fddd195519ed9d",
               "DVTSourceControlBranchOptionsKey": 50,
               "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
           }
       },
       "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
       "DVTSourceControlWorkspaceBlueprintIdentifierKey": "FCC968B5-E977-4BA9-889E-6EC55F65439C",
       "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz"
       },
       "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
       "DVTSourceControlWorkspaceBlueprintVersion": 203,
       "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
       "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
           {
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
           }
       ]
   }
};

var test_bot_storage = function test_bot_storage() {
    test('BotStorageIsAvailable', function() {
		ok(typeof(botStorage()) === "object", 'Bot Storage is available');
	});
    
    test('AddBotToStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        botStorage().addBot(bot);
        var getBot = botStorage().getBot(botId);
        ok(botId === getBot.getId(), 'Bot added successfully');
    });
    
    test('RemoveBotFromStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        botStorage().addBot(bot);
        var getBot = botStorage().getBot(botId);
        ok(botId === getBot.getId(), 'Bot added successfully');
        botStorage().removeBot(botId);
        getBot = botStorage().getBot(botId);
        ok(getBot === null, 'Bot removed successfully');
    });
    
    test('GetBotsFromStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        botStorage().addBot(bot);
        var getBots = botStorage().getBots();
        ok(Object.keys(getBots).length !== undefined, 'Retrieved bots successfully');
        var getBot = getBots[botId];
        ok(botId === getBot.getId(), 'Retrieved bot successfully');
    });
    
    test('GetBotsArrayFromStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        var botName = bot.getName();
        botStorage().addBot(bot);
        var getBotName = botStorage().getBotName(botId);
        ok(botName === getBotName, 'Retrieved bot name successfully');
    });
    
    test('GetBotStorageLength', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        botStorage().addBot(bot);
        var botStorageLength = botStorage().getLength();
        ok(botStorageLength === 1, 'Retrieved the expected number of bots');
    });
    
    test('BotStorageHasBots', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        var hasBots = botStorage().hasBots();
        ok(hasBots === false, "Bot Storage doesn't have bots");
        botStorage().addBot(bot);
        hasBots = botStorage().hasBots();
        ok(hasBots === true, 'Bot Storage has bots');
    });
    
    test('GetBotIdFromTinyIdInBotStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var tinyId = bot.getTinyId();
        var botId = bot.getId();
        botStorage().addBot(bot);
        var getBotId = botStorage().getBotIdFromTinyId(tinyId);
        ok(getBotId === botId, 'Bot Id retrieved successfully');
    });
    
    test('GetBotByTinyIdFromStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var tinyId = bot.getTinyId();
        var botId = bot.getId();
        botStorage().addBot(bot);
        var getBot = botStorage().getBotByTinyId(tinyId);
        ok(botId === getBot.getId(), 'Retrieved bot successfully');
    });
    
    test('BotStorageHasTinyId', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var tinyId = bot.getTinyId();
        botStorage().addBot(bot);
        var hasTinyId = botStorage().hasTinyId(tinyId);
        ok(hasTinyId === true, 'Bot Storage has bot');
        hasTinyId = botStorage().hasTinyId('123');
        ok(hasTinyId === false, "Bot Storage does not have bot");
    });
    
    test('BotStorageHasBot', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        botStorage().addBot(bot);
        var hasBot = botStorage().hasBot(botId);
        ok(hasBot === true, 'Bot Storage has bot');
        hasBot = botStorage().hasTinyId('123');
        ok(hasBot === false, "Bot Storage does not have bot");
    });
    
    test('ResetBotStorage', function() {
        botStorage().reset();
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var botId = bot.getId();
        botStorage().addBot(bot);
        var getBot = botStorage().getBot(botId);
        ok(botId === getBot.getId(), 'Bot added successfully');
        botStorage().reset();
        getBot = botStorage().getBot(botId);
        ok(getBot === null, 'Bot storage reset successfully');
    });
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.

var botData = {
   "_id": "63b507c3a62d7885c6bb28fcf33012fc",
   "_rev": "5-8dc11b63dfaf82f079f23ef186b8bd22",
   "group": {
       "name": "9870B6F4-7C34-4C5E-8A5F-4BAED97CDC4A"
   },
   "configuration": {
       "builtFromClean": 0,
       "periodicScheduleInterval": 0,
       "performsTestAction": true,
       "triggers": [
       ],
       "performsAnalyzeAction": true,
       "schemeName": "ShutterBugz",
       "weeklyScheduleDay": 0,
       "testingDeviceIDs": [
           "63b507c3a62d7885c6bb28fcf300a874"
       ],
       "minutesAfterHourToIntegrate": 0,
       "hourOfIntegration": 0,
       "scheduleType": 3,
       "performsArchiveAction": true,
       "testingDestinationType": 3,
       "sourceControlBlueprint": {
           "DVTSourceControlWorkspaceBlueprintLocationsKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                   "DVTSourceControlBranchIdentifierKey": "master",
                   "DVTSourceControlBranchOptionsKey": 214,
                   "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
               }
           },
           "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
           "DVTSourceControlWorkspaceBlueprintWorkingCopyRepositoryLocationsKey": {
           },
           "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationStrategiesKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationTypeKey": "DVTSourceControlBasicAuthenticationStrategy"
               }
           },
           "DVTSourceControlWorkspaceBlueprintWorkingCopyStatesKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": 0
           },
           "DVTSourceControlWorkspaceBlueprintIdentifierKey": "A6F0DA83-FCD5-47FC-96FC-956C9E3B3A6F",
           "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
               "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz/"
           },
           "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
           "DVTSourceControlWorkspaceBlueprintVersion": 203,
           "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
           "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
               {
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
                   "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
               }
           ]
       }
   },
   "name": "ShutterBugz",
   "type": 1,
   "integration_counter": 2,
   "doc_type": "bot",
   "tinyID": "FD73C2E",
   "lastRevisionBlueprint": {
       "DVTSourceControlWorkspaceBlueprintLocationsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": {
               "DVTSourceControlBranchIdentifierKey": "master",
               "DVTSourceControlLocationRevisionKey": "3850f10853e1301494cd8f2d98fddd195519ed9d",
               "DVTSourceControlBranchOptionsKey": 50,
               "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
           }
       },
       "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
       "DVTSourceControlWorkspaceBlueprintIdentifierKey": "FCC968B5-E977-4BA9-889E-6EC55F65439C",
       "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz"
       },
       "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
       "DVTSourceControlWorkspaceBlueprintVersion": 203,
       "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
       "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
           {
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
           }
       ]
   }
};

var integrationData = {
   "_id": "63b507c3a62d7885c6bb28fcf3302b72",
   "_rev": "18-61063f12fd15d26ba9185b6282f81785",
   "bot": {
       "_id": "63b507c3a62d7885c6bb28fcf33012fc",
       "_rev": "3-0f6bd9ce87d2fcbde9e624c6dcfba243",
       "group": {
           "name": "9870B6F4-7C34-4C5E-8A5F-4BAED97CDC4A"
       },
       "configuration": {
           "builtFromClean": 0,
           "periodicScheduleInterval": 0,
           "performsTestAction": true,
           "triggers": [
           ],
           "performsAnalyzeAction": true,
           "schemeName": "ShutterBugz",
           "weeklyScheduleDay": 0,
           "testingDeviceIDs": [
               "63b507c3a62d7885c6bb28fcf300a874"
           ],
           "minutesAfterHourToIntegrate": 0,
           "sourceControlBlueprint": {
               "DVTSourceControlWorkspaceBlueprintLocationsKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                       "DVTSourceControlBranchIdentifierKey": "master",
                       "DVTSourceControlBranchOptionsKey": 214,
                       "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
                   }
               },
               "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
               "DVTSourceControlWorkspaceBlueprintWorkingCopyRepositoryLocationsKey": {
               },
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationStrategiesKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationTypeKey": "DVTSourceControlBasicAuthenticationStrategy"
                   }
               },
               "DVTSourceControlWorkspaceBlueprintWorkingCopyStatesKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": 0
               },
               "DVTSourceControlWorkspaceBlueprintIdentifierKey": "A6F0DA83-FCD5-47FC-96FC-956C9E3B3A6F",
               "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz/"
               },
               "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
               "DVTSourceControlWorkspaceBlueprintVersion": 203,
               "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
                   {
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
                   }
               ]
           },
           "hourOfIntegration": 0,
           "scheduleType": 3,
           "performsArchiveAction": true,
           "testingDestinationType": 3
       },
       "name": "ShutterBugz",
       "type": 1,
       "integration_counter": 1,
       "doc_type": "bot",
       "tinyID": "FD73C2E"
   },
   "shouldClean": false,
   "currentStep": "completed",
   "number": 1,
   "queuedDate": "2014-09-03T23:41:16.632Z",
   "success_streak": 1,
   "doc_type": "integration",
   "tinyID": "3EA4C9E",
   "buildServiceFingerprint": "82:9F:9C:3B:3A:30:84:D1:1A:9F:C9:84:70:A8:D7:D6:F1:01:CC:4F",
   "tags": [
   ],
   "startedTime": "2014-09-03T23:41:17.556Z",
   "revisionBlueprint": {
       "DVTSourceControlWorkspaceBlueprintLocationsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": {
               "DVTSourceControlBranchIdentifierKey": "master",
               "DVTSourceControlLocationRevisionKey": "3850f10853e1301494cd8f2d98fddd195519ed9d",
               "DVTSourceControlBranchOptionsKey": 50,
               "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
           }
       },
       "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
       "DVTSourceControlWorkspaceBlueprintIdentifierKey": "FCC968B5-E977-4BA9-889E-6EC55F65439C",
       "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz"
       },
       "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
       "DVTSourceControlWorkspaceBlueprintVersion": 203,
       "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
       "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
           {
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
           }
       ]
   },
   "buildResultSummary": {
       "analyzerWarningCount": 1,
       "testFailureCount": 0,
       "testsChange": 12,
       "errorCount": 0,
       "testsCount": 12,
       "testFailureChange": 0,
       "warningChange": 3,
       "regressedPerfTestCount": 0,
       "warningCount": 3,
       "errorChange": 0,
       "improvedPerfTestCount": 0,
       "analyzerWarningChange": 1
   },
   "result": "warnings",
   "testedDevices": [
       {
           "connected": true,
           "ID": "63b507c3a62d7885c6bb28fcf300a874",
           "simulator": true,
           "revision": "3-036baff3e229c2240fa79908177d8b7e",
           "osVersion": "8.0",
           "deviceType": "com.apple.iphone-simulator",
           "supported": true,
           "identifier": "EF17DB24-690B-4574-B33A-B5E75A3ED088",
           "enabledForDevelopment": true,
           "architecture": "x86_64",
           "isServer": false,
           "doc_type": "device",
           "platformIdentifier": "com.apple.platform.iphonesimulator",
           "name": "iPhone 5s",
           "retina": false
       }
   ],
   "testHierarchy": {
       "ShutterBugzTests": {
           "_xcsAggrDeviceStatus": {
               "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
           },
           "ShutterBugzTests": {
               "testPhotoRotate": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoShrink": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testRadialBlurWithCenteredOffset": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoZoom": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testXMLLoadPerformance": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoLevels": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testAtLeastOnePhotoReturned": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoApplySepiaEffect": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "_xcsAggrDeviceStatus": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoScale": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testInvalidPhotoData": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testApplyPhotoEffectBlur": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testApplyPhotoEffectShadow": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               }
           }
       }
   },
   "perfMetricNames": [
       "Time"
   ],
   "perfMetricKeyPaths": [
       "ShutterBugzTests.ShutterBugzTests.testXMLLoadPerformance"
   ],
   "assets": {
       "product": {
           "infoDictionary": {
               "CFBundleName": "ShutterBugz",
               "DTXcode": "0600",
               "DTSDKName": "iphoneos8.0",
               "DTSDKBuild": "12A365",
               "CFBundleDevelopmentRegion": "en",
               "CFBundleVersion": "1",
               "BuildMachineOSBuild": "14A352",
               "DTPlatformName": "iphoneos",
               "CFBundlePackageType": "APPL",
               "CFBundleShortVersionString": "1.0",
               "CFBundleSupportedPlatforms": [
                   "iPhoneOS"
               ],
               "CFBundleInfoDictionaryVersion": "6.0",
               "UIRequiredDeviceCapabilities": [
                   "armv7"
               ],
               "CFBundleExecutable": "ShutterBugz",
               "UILaunchImages": [
                   {
                       "UILaunchImageSize": "{320, 568}",
                       "UILaunchImageName": "LaunchImage-700-568h",
                       "UILaunchImageMinimumOSVersion": "7.0",
                       "UILaunchImageOrientation": "Portrait"
                   }
               ],
               "DTCompiler": "com.apple.compilers.llvm.clang.1_0",
               "CFBundleIdentifier": "com.apple.dt.ShutterBugz",
               "CFBundleResourceSpecification": "ResourceRules.plist",
               "DTPlatformVersion": "8.0",
               "DTXcodeBuild": "6A312",
               "LSRequiresIPhoneOS": true,
               "CFBundleSignature": "????",
               "MinimumOSVersion": "7.1",
               "UIDeviceFamily": [
                   1
               ],
               "DTPlatformBuild": "12A365"
           },
           "size": 75418,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/ShutterBugz.ipa"
       },
       "sourceControlLog": {
           "size": 15846,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/sourceControl.log"
       },
       "archive": {
           "size": 124793,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/Archive.xcarchive.zip"
       },
       "additionalAssets": [
           {
               "size": 10762,
               "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/Session-2014-09-03_16:41:22-2IgayL.log"
           }
       ],
       "xcodebuildOutput": {
           "size": 26380,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/xcodebuild_result.bundle.zip"
       },
       "xcodebuildLog": {
           "size": 215334,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/build.log"
       },
       "buildServiceLog": {
           "size": 23962,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/buildService.log"
       }
   },
   "endedTime": "2014-09-03T23:41:51.253Z",
   "endedTimeDate": [
       2014,
       9,
       3,
       23,
       41,
       51
   ],
   "duration": 33.697
};

var test_bots = function() {
	test('InitBot', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		ok(bot instanceof XCS.Bot, 'Is Bot object');
	});
	
	test('InitBotWithContentMissing', function() {
		var data = undefined;
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('InitBotWithContentEmpty', function() {
		var data = {};
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('InitBotWithContentWrong', function() {
		var data = new Date();
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithDocTypeMissing', function() {
		var data = JSON.parse(JSON.stringify(botData));
		delete data.doc_type;
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithDocTypeEmpty', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data.doc_type = "";
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithDocTypeWrong', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data.doc_type = '1234';
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithNameMissing', function() {
		var data = JSON.parse(JSON.stringify(botData));
		delete data.name;
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithNameEmpty', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data.name = "";
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithNameWrong', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data.name = new Date();
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithIdMissing', function() {
		var data = JSON.parse(JSON.stringify(botData));
		delete data._id;
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithIdEmpty', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data._id = "";
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithIdWrong', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data._id = new Date();
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});	
	
	test('BotWithTinyIdMissing', function() {
		var data = JSON.parse(JSON.stringify(botData));
		delete data.tinyID;
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithTinyIdEmpty', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data.tinyID = "";
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});
	
	test('BotWithTinyIdWrong', function() {
		var data = JSON.parse(JSON.stringify(botData));
		data.tinyID = new Date();
		var bot = XCS.CreateObject('Bot', data);
		equal(bot, null, 'Bot is null');
	});	
	
	test('BotResetIntegrations', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		bot.mIntegrations = null;
		bot.resetIntegrations();
		var integrations = bot.getIntegrations();
		equal(Object.keys(integrations).length, 0, "Bot doesn't have any integrations");
	});
	
	test('BotAddIntegration', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var integration = XCS.CreateObject('Integration', integrationData);
		var botIntegrations = bot.getIntegrations();
		equal(botIntegrations, null, "Bot doesn't have any integrations");
		bot.addIntegrations(integration);
		botIntegrations = bot.getIntegrations();
		var testIntegration = botIntegrations[Object.keys(botIntegrations)[0]];
		equal(testIntegration.getId(), integration.getId(), 'Add Integration Succeeded');
	});
	
	test('BotUpdateIntegration', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var integration = XCS.CreateObject('Integration', integrationData);
		var botIntegrations = bot.getIntegrations();
		equal(botIntegrations, null, "Bot doesn't have any integrations");
		bot.addIntegrations(integration);
		botIntegrations = bot.getIntegrations();
		var testIntegration = botIntegrations[Object.keys(botIntegrations)[0]];
		var integrationId = testIntegration.getId();
		equal(integrationId, integration.getId(), 'Add Integration Succeeded');
		bot.updateIntegration(integration);
		var updatedIntegration = botIntegrations[Object.keys(botIntegrations)[0]];
		var updatedIntegrationId = updatedIntegration.getId();
		equal(updatedIntegrationId, integrationId, 'Update Integration Succeeded');
	});
	
	test('BotGetIntegrations', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var integrations = bot.getIntegrations();
		var integration = XCS.CreateObject('Integration', integrationData);
		equal(integrations, null, "Bot doesn't have any integrations");
		bot.addIntegrations(integration);
		integrations = bot.getIntegrations();
		equal(Object.keys(integrations).length, 1, "Bot has one integrations");
	});
	
	test('BotGetSetIntegrationFromFilter', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var integration = XCS.CreateObject('Integration', integrationData);
		
		var bot = XCS.CreateObject('Bot', data);
		bot.addIntegrations(integration);
		bot.setIntegrationFromFilter(integration, XCS.BotFilter.INTEGRATION_FILTER_LATEST);
		var testIntegration = bot.getIntegrationFromFilter(XCS.BotFilter.INTEGRATION_FILTER_LATEST);
		equal(integration.getId(), testIntegration.getId(), "Bot has successfully set and retrieved the latest integration");
		bot = null;
		
		
		var bot = XCS.CreateObject('Bot', data);
		bot.addIntegrations(integration);
		bot.setIntegrationFromFilter(integration, XCS.BotFilter.INTEGRATION_FILTER_FAILED);
		var testIntegration = bot.getIntegrationFromFilter(XCS.BotFilter.INTEGRATION_FILTER_FAILED);
		equal(integration.getId(), testIntegration.getId(), "Bot has successfully set and retrieved the latest failed integration");
		bot = null;
		
		var bot = XCS.CreateObject('Bot', data);
		bot.addIntegrations(integration);
		bot.setIntegrationFromFilter(integration, XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED);
		var testIntegration = bot.getIntegrationFromFilter(XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED);
		equal(integration.getId(), testIntegration.getId(), "Bot has successfully set and retrieved the latest succeeded integration");
		bot = null;
		
		var bot = XCS.CreateObject('Bot', data);
		bot.addIntegrations(integration);
		bot.setIntegrationFromFilter(integration, XCS.BotFilter.INTEGRATION_FILTER_FLAGGED);
		var testIntegration = bot.getIntegrationFromFilter(XCS.BotFilter.INTEGRATION_FILTER_FLAGGED);
		equal(integration.getId(), testIntegration.getId(), "Bot has successfully set and retrieved the latest flagged integration");
		bot = null;
	});
	
	test('BotGetIntegrationsCount', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var integration = XCS.CreateObject('Integration', integrationData);
		bot.addIntegrations(integration);
		equal(bot.getIntegrationsCount(), 1, "Retrieved Bot Integration count successfully");
	});
	
	test('BotGetIntegrationById', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var integration = XCS.CreateObject('Integration', integrationData);
		bot.addIntegrations(integration);
		
		var testIntegration = bot.getIntegrationById(integration.getId());
		equal(integration.getId(), testIntegration.getId(), "Retrieved Bot Integration successfully");
	});
	
	test('BotGetSetRunningIntegration', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var integration = XCS.CreateObject('Integration', integrationData);
		bot.addIntegrations(integration);
		
		bot.setRunningIntegration(integration);
		var testIntegration = bot.getRunningIntegration();
		equal(integration.getId(), testIntegration.getId(), "Retrieved Bot Running Integration successfully");
	});
	
	test('BotUpdate', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		var bot2 = XCS.CreateObject('Bot', data);
		bot.data = null;
		equal(bot.data, null, 'Bot has no data');
		bot.update(bot2);
		notEqual(bot.data, null, 'Bot has been updated');
	});
	
	test('BotIsMacApp', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		equal(bot.isMacApp(), false, 'Bot is not a Mac app');
	});
	
	test('BotIsIosApp', function() {
		var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
		equal(bot.isIosApp(), true, 'Bot is iOS app');
	});
    
    test('CleanupUnusedIntegrations', function() {
        var data = JSON.parse(JSON.stringify(botData));
		var bot = XCS.CreateObject('Bot', data);
        var integrationData1 = JSON.parse(JSON.stringify(integrationData));
        integrationData1._id = "63b507c3a62d7885c6bb28fcf3302b72";
        var integration1 = XCS.CreateObject('Integration', integrationData1);
        var integrationData2 = JSON.parse(JSON.stringify(integrationData));
        integrationData2._id = "63b507c3a62d7885c6bb28fcf3302b73";
        var integration2 = XCS.CreateObject('Integration', integrationData2);
        var integrationData3 = JSON.parse(JSON.stringify(integrationData));
        integrationData3._id = "63b507c3a62d7885c6bb28fcf3302b74";
        var integration3 = XCS.CreateObject('Integration', integrationData3);
        
        bot.addIntegrations(integration1);
        bot.addIntegrations(integration2);
        bot.addIntegrations(integration3);
        
        bot.setRunningIntegration(integration1);
        bot.setLatestSucceededIntegration(integration3);
        
        bot.cleanupUnusedIntegrations();
        
        var cleanedIntegrations = bot.getIntegrations();
        
        equal(Object.keys(cleanedIntegrations).length, 2, "Integrations in Bot have been properly cleaned.");
    });
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var test_dispatch_queue = function() {
	test('DispatchQueueRunsItemsInOrder', function() {
		stop();
		expect(4);
		var queue = dispatch_queue_create('dispatch_queue');
		var count = 0;
		
		dispatch_suspend(queue);
		dispatch_async(queue, function() {
			count++;
			equal(count, 1, "First item in the queue");
		});
		
		dispatch_async(queue, function() {
			count++;
			equal(count, 2, "Second item in the queue");
		});
		
		dispatch_async(queue, function() {
			count++;
			equal(count, 3, "Third item in the queue");
		});
		
		dispatch_async(queue, function() {
			count++;
			equal(count, 4, "Last item in the queue");
			start();
		});
		dispatch_resume(queue);
	});
	
	test('DispatchQueueRunsItemsInOrderWithFinal', function() {
		stop();
		expect(5);
		var queue = dispatch_queue_create('dispatch_queue');
		var count = 0;
		var isFinal = false;
		
		dispatch_suspend(queue);
		dispatch_async(queue, function() {
			count++;
			equal(count, 1, "First item in the queue");
		});
		
		dispatch_async(queue, function() {
			count++;
			equal(count, 2, "Second item in the queue");
		});
		
		dispatch_async(queue, function() {
			count++;
			equal(count, 3, "Third item in the queue");
		});
		
		dispatch_async(queue, function() {
			count++;
			equal(count, 4, "Last item in the queue");
			isFinal = true;
		});
		
		dispatch_final(queue, function() {
			equal(isFinal, true, "Final item runs after last item od the queue");
			start();
		});
		dispatch_resume(queue);
	});
	
	test('DispatchManagedQueueRunsItemsInOrder', function() {
		stop();
		expect(4);
		var queue = dispatch_queue_create('dispatch_queue', true);
		var count = 0;
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 1, "First item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 2, "Second item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 3, "Third item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 4, "Last item in the queue");
			start();
		});
	});
	
	test('DispatchManagedQueueRunsItemsInOrderWithFinal', function() {
		stop();
		expect(5);
		var queue = dispatch_queue_create('dispatch_queue', true);
		var count = 0;
		var isFinal = false;
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 1, "First item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 2, "Second item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 3, "Third item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 4, "Last item in the queue");
			isFinal = true;
			manager.next();
		});
		
		dispatch_final(queue, function(manager) {
			equal(isFinal, true, "Final item runs after last item in the queue");
			start();
		});
	});
	
	test('DispatchManagedQueueRunsItemsInOrderWithFinalInterrupted', function() {
		stop();
		expect(4);
		var queue = dispatch_queue_create('dispatch_queue', true);
		var count = 0;
		var isFinal = false;
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 1, "First item in the queue");
			manager.next();
		});
		
		dispatch_async(queue, function(manager) {
			count++;
			equal(count, 2, "Second item in the queue");
			manager.next();
		});
		
		dispatch_final(queue, function(manager) {
			equal(count, 2, "Final item runs, count hasn't been incremented");
			equal(dispatch_queue_size(queue), 0, "Final item runs after interrupted queue");
			start();
		});
	});
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var integrationData = {
   "_id": "63b507c3a62d7885c6bb28fcf3302b72",
   "_rev": "18-61063f12fd15d26ba9185b6282f81785",
   "bot": {
       "_id": "63b507c3a62d7885c6bb28fcf33012fc",
       "_rev": "3-0f6bd9ce87d2fcbde9e624c6dcfba243",
       "group": {
           "name": "9870B6F4-7C34-4C5E-8A5F-4BAED97CDC4A"
       },
       "configuration": {
           "builtFromClean": 0,
           "periodicScheduleInterval": 0,
           "performsTestAction": true,
           "triggers": [
           ],
           "performsAnalyzeAction": true,
           "schemeName": "ShutterBugz",
           "weeklyScheduleDay": 0,
           "testingDeviceIDs": [
               "63b507c3a62d7885c6bb28fcf300a874"
           ],
           "minutesAfterHourToIntegrate": 0,
           "sourceControlBlueprint": {
               "DVTSourceControlWorkspaceBlueprintLocationsKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                       "DVTSourceControlBranchIdentifierKey": "master",
                       "DVTSourceControlBranchOptionsKey": 214,
                       "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
                   }
               },
               "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
               "DVTSourceControlWorkspaceBlueprintWorkingCopyRepositoryLocationsKey": {
               },
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationStrategiesKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": {
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositoryAuthenticationTypeKey": "DVTSourceControlBasicAuthenticationStrategy"
                   }
               },
               "DVTSourceControlWorkspaceBlueprintWorkingCopyStatesKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": 0
               },
               "DVTSourceControlWorkspaceBlueprintIdentifierKey": "A6F0DA83-FCD5-47FC-96FC-956C9E3B3A6F",
               "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
                   "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz/"
               },
               "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
               "DVTSourceControlWorkspaceBlueprintVersion": 203,
               "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
                   {
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
                       "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
                   }
               ]
           },
           "hourOfIntegration": 0,
           "scheduleType": 3,
           "performsArchiveAction": true,
           "testingDestinationType": 3,
           "codeCoveragePreference": 1
       },
       "name": "ShutterBugz",
       "type": 1,
       "integration_counter": 1,
       "doc_type": "bot",
       "tinyID": "FD73C2E"
   },
   "shouldClean": false,
   "currentStep": "completed",
   "number": 1,
   "queuedDate": "2014-09-03T23:41:16.632Z",
   "success_streak": 1,
   "doc_type": "integration",
   "tinyID": "3EA4C9E",
   "buildServiceFingerprint": "82:9F:9C:3B:3A:30:84:D1:1A:9F:C9:84:70:A8:D7:D6:F1:01:CC:4F",
   "tags": [
   ],
   "startedTime": "2014-09-03T23:41:17.556Z",
   "revisionBlueprint": {
       "DVTSourceControlWorkspaceBlueprintLocationsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": {
               "DVTSourceControlBranchIdentifierKey": "master",
               "DVTSourceControlLocationRevisionKey": "3850f10853e1301494cd8f2d98fddd195519ed9d",
               "DVTSourceControlBranchOptionsKey": 50,
               "DVTSourceControlWorkspaceBlueprintLocationTypeKey": "DVTSourceControlBranch"
           }
       },
       "DVTSourceControlWorkspaceBlueprintPrimaryRemoteRepositoryKey": "AF077021614FF4CED9ED9AB5075D25881DB32529",
       "DVTSourceControlWorkspaceBlueprintIdentifierKey": "FCC968B5-E977-4BA9-889E-6EC55F65439C",
       "DVTSourceControlWorkspaceBlueprintWorkingCopyPathsKey": {
           "AF077021614FF4CED9ED9AB5075D25881DB32529": "shutterbugz"
       },
       "DVTSourceControlWorkspaceBlueprintNameKey": "ShutterBugz",
       "DVTSourceControlWorkspaceBlueprintVersion": 203,
       "DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey": "ShutterBugz.xcodeproj",
       "DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey": [
           {
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey": "https://gitlab.sd.apple.com/nesbitt/shutterbugz.git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositorySystemKey": "com.apple.dt.Xcode.sourcecontrol.Git",
               "DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey": "AF077021614FF4CED9ED9AB5075D25881DB32529"
           }
       ]
   },
   "buildResultSummary": {
       "analyzerWarningCount": 1,
       "testFailureCount": 0,
       "testsChange": 12,
       "errorCount": 0,
       "testsCount": 12,
       "testFailureChange": 0,
       "warningChange": 3,
       "regressedPerfTestCount": 0,
       "warningCount": 3,
       "errorChange": 0,
       "improvedPerfTestCount": 0,
       "analyzerWarningChange": 1,
       "codeCoveragePercentage": 52,
       "codeCoveragePercentageDelta": 12
   },
   "result": "warnings",
   "testedDevices": [
       {
           "connected": true,
           "ID": "63b507c3a62d7885c6bb28fcf300a874",
           "simulator": true,
           "revision": "3-036baff3e229c2240fa79908177d8b7e",
           "osVersion": "8.0",
           "deviceType": "com.apple.iphone-simulator",
           "supported": true,
           "identifier": "EF17DB24-690B-4574-B33A-B5E75A3ED088",
           "enabledForDevelopment": true,
           "architecture": "x86_64",
           "isServer": false,
           "doc_type": "device",
           "platformIdentifier": "com.apple.platform.iphonesimulator",
           "name": "iPhone 5s",
           "retina": false
       }
   ],
   "testHierarchy": {
       "ShutterBugzTests": {
           "_xcsAggrDeviceStatus": {
               "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
           },
           "ShutterBugzTests": {
               "testPhotoRotate": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoShrink": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testRadialBlurWithCenteredOffset": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoZoom": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testXMLLoadPerformance": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoLevels": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testAtLeastOnePhotoReturned": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoApplySepiaEffect": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "_xcsAggrDeviceStatus": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testPhotoScale": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testInvalidPhotoData": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testApplyPhotoEffectBlur": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               },
               "testApplyPhotoEffectShadow": {
                   "EF17DB24-690B-4574-B33A-B5E75A3ED088": 1
               }
           }
       }
   },
   "perfMetricNames": [
       "Time"
   ],
   "perfMetricKeyPaths": [
       "ShutterBugzTests.ShutterBugzTests.testXMLLoadPerformance"
   ],
   "assets": {
       "product": {
           "infoDictionary": {
               "CFBundleName": "ShutterBugz",
               "DTXcode": "0600",
               "DTSDKName": "iphoneos8.0",
               "DTSDKBuild": "12A365",
               "CFBundleDevelopmentRegion": "en",
               "CFBundleVersion": "1",
               "BuildMachineOSBuild": "14A352",
               "DTPlatformName": "iphoneos",
               "CFBundlePackageType": "APPL",
               "CFBundleShortVersionString": "1.0",
               "CFBundleSupportedPlatforms": [
                   "iPhoneOS"
               ],
               "CFBundleInfoDictionaryVersion": "6.0",
               "UIRequiredDeviceCapabilities": [
                   "armv7"
               ],
               "CFBundleExecutable": "ShutterBugz",
               "UILaunchImages": [
                   {
                       "UILaunchImageSize": "{320, 568}",
                       "UILaunchImageName": "LaunchImage-700-568h",
                       "UILaunchImageMinimumOSVersion": "7.0",
                       "UILaunchImageOrientation": "Portrait"
                   }
               ],
               "DTCompiler": "com.apple.compilers.llvm.clang.1_0",
               "CFBundleIdentifier": "com.apple.dt.ShutterBugz",
               "CFBundleResourceSpecification": "ResourceRules.plist",
               "DTPlatformVersion": "8.0",
               "DTXcodeBuild": "6A312",
               "LSRequiresIPhoneOS": true,
               "CFBundleSignature": "????",
               "MinimumOSVersion": "7.1",
               "UIDeviceFamily": [
                   1
               ],
               "DTPlatformBuild": "12A365"
           },
           "size": 75418,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/ShutterBugz.ipa"
       },
       "sourceControlLog": {
           "size": 15846,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/sourceControl.log"
       },
       "archive": {
           "size": 124793,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/Archive.xcarchive.zip"
       },
       "additionalAssets": [
           {
               "size": 10762,
               "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/Session-2014-09-03_16:41:22-2IgayL.log"
           }
       ],
       "xcodebuildOutput": {
           "size": 26380,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/xcodebuild_result.bundle.zip"
       },
       "xcodebuildLog": {
           "size": 215334,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/build.log"
       },
       "buildServiceLog": {
           "size": 23962,
           "relativePath": "63b507c3a62d7885c6bb28fcf33012fc-ShutterBugz/1/buildService.log"
       }
   },
   "endedTime": "2014-09-03T23:41:51.253Z",
   "endedTimeDate": [
       2014,
       9,
       3,
       23,
       41,
       51
   ],
   "duration": 33.697
};

var test_integrations = function() {
	// Init
	test('IntegrationInit', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		var integration = XCS.CreateObject('Integration', data);
		ok(integration instanceof XCS.Integration, 'Is Integration object');
	});
	
	test('InitIntegrationWithContentMissing', function() {
		var data = undefined;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('InitIntegrationWithContentEmpty', function() {
		var data = {};
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('InitIntegrationWithContentWrong', function() {
		var data = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	// ID
	test('IntegrationWithIdMissing', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		delete data._id;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithIdEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data._id = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithIdWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data._id = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	// Bot
	test('IntegrationWithBotSnapshotMissing', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		delete data.bot;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithBotSnapshotEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.bot = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithBotSnapshotWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.bot = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	// Current Step
	test('IntegrationWithCurrentStepMissing', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		delete data.currentStep;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithCurrentStepEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.currentStep = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithCurrentStepWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.currentStep = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	// Integration Number
	test('IntegrationWithNumberMissing', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		delete data.number;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithNumberEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.number = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithNumberWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.number = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	// tinyID
	test('IntegrationWithTinyIDMissing', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		delete data.tinyID;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithTinyIDEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.tinyID = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithTinyIDWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.tinyID = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	// DocType
	test('IntegrationWithDocTypeMissing', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		delete data.doc_type;
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithDocTypeEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.doc_type = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithDocTypeWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.doc_type = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});

	// Tags
	test('IntegrationWithTagsEmpty', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.tags = "";
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
	
	test('IntegrationWithTagsWrong', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		data.tags = new Date();
		var integration = XCS.CreateObject('Integration', data);
		equal(integration, null, 'Integration is null');
	});
    
    // Code Coverage
    test('IntegrationHasCodeCoverageEnabled', function() {
        var data = JSON.parse(JSON.stringify(integrationData));
        var integration = XCS.CreateObject('Integration', data);
        var codeCoverageEnabled = integration.isCodeCoverageEnabled();
        equal(codeCoverageEnabled, true, 'Code coverage enabled is null');
    });
    
    test('IntegrationHasCodeCoverageBoolean', function() {
        var data = JSON.parse(JSON.stringify(integrationData));
        var integration = XCS.CreateObject('Integration', data);
        var codeCoverageEnabled = integration.isCodeCoverageEnabled();
        ok((codeCoverageEnabled === true || codeCoverageEnabled === false), 'Code coverage is not boolean');
    });
    
    test('IntegrationHasCodeCoveragePercentage', function() {
        var data = JSON.parse(JSON.stringify(integrationData));
        var integration = XCS.CreateObject('Integration', data);
        var codeCoveragePercentage = integration.getCodeCoveragePercentage();
        notEqual(codeCoveragePercentage, null, 'Code coverage percentage is null');
    });
    
    test('IntegrationHasCodeCoverageDelta', function() {
        var data = JSON.parse(JSON.stringify(integrationData));
        var integration = XCS.CreateObject('Integration', data);
        var codeCoverageDelta = integration.getCodeCoveragePercentageDelta();
        notEqual(codeCoverageDelta, null, 'Code coverage delta is null');
    });
	
	test('IntegrationHasIpa', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		var integration = XCS.CreateObject('Integration', data);
		equal(integration.hasIpa(), true, 'Integration has Ipa');
	});
	
	test('IntegrationHasArchive', function() {
		var data = JSON.parse(JSON.stringify(integrationData));
		var integration = XCS.CreateObject('Integration', data);
		equal(integration.hasArchive(), true, 'Integration has Archive');
	});
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var test_mobile_bigscreen_controller = function test_mobile_bigscreen_controller() {
    
     test('MobileBigScreenUIController', function() {
         browser()._setUserAgent("Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53");
         stop();
         new XCS.BigScreen.Application();
         globalNotificationCenter().publish('PAGE_INITIALIZE_FINISHED', document);
     });
}
;
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var application;

var test_mobile_webui_controller = function test_mobile_webui_controller() {

    test('MobileWebUIController', function () {
        browser()._setUserAgent("Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53");
        stop();
        application = new XCS.WebUI.Application();
        globalNotificationCenter().publish('PAGE_INITIALIZE_FINISHED', document);
    });
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

var application;

var test_webui_controller = function test_webui_controller() {

    test('WebUIController', function () {
        stop();
        application = new XCS.WebUI.Application();
        globalNotificationCenter().publish('PAGE_INITIALIZE_FINISHED', document);
    });
};
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

function test_xcs_proxy() {

    test('GetBots', function () {
        stop();

        var callback = function (inBotArray) {
            ok(inBotArray !== undefined, "Bot found");
            ok(inBotArray.length > 0, "Found bots");
            start();
        };
        var errback = function () {
            ok(false, "No bots found");
            start();
        };
        xcs_proxy().getBots(callback, errback);
    });

    test('GetLatestIntegrationForBots', function () {
        stop();

        var callback = function (inIntegrations) {
            ok(inIntegrations !== undefined, "Valid response");
            ok(inIntegrations.length > 0, "Found integrations");
            start();
        };
        var errback = function () {
            ok(false, "No integration found");
            start();
        };
        xcs_proxy().getLatestIntegrationForBots(callback, errback);
    });

    test('GetBotById', function () {
        stop();

        var queue = dispatch_queue_create('get_integration_dispatch_queue', true);

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var firstBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'bot2') {
                        firstBot = bot;
                    }
                }

                manager.next(firstBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inBot) {
                ok(inBot !== undefined, "Valid response");
                if (inBot === undefined || inBot === null) {
                    ok(false, 'Failed to retreive bot');
                    start();
                } else {
                    ok(true, "Foumd bot");
                    start();
                }
            };
            var errback = function () {
                ok(false, "No bot found");
                start();
            };
            xcs_proxy().getBotById(bot.getId(), callback, errback);
        });
    });

    test('GetLatestFailedIntegrationForBots', function () {
        stop();

        var callback = function (inIntegrations) {
            ok(inIntegrations !== undefined, "Integration found");
            ok(inIntegrations.length > 0, "Found integrations");

            for (var i = 0; i < inIntegrations.length; i++) {
                var integration = inIntegrations[i];

                if (integration === null) {
                    ok(integration !== null, "Found null integration");
                    start();
                    return;
                }
                ok(!integration.hasFailed(), "Has returned expected non failed integration");
                ok(!integration.isBuildSuccessFull(), "Has returned expected errors in integration");
            }

            start();
        };
        var errback = function () {
            ok(false, "No integration found");
            start();
        };
        xcs_proxy().getLatestFailedIntegrationForBots(callback, errback);
    });

    test('GetLatestSucceededIntegrationForBots', function () {
        stop();

        var callback = function (inIntegrations) {
            ok(inIntegrations !== undefined, "Integration found");
            ok(inIntegrations.length > 0, "Found integrations");

            for (var i = 0; i < inIntegrations.length; i++) {
                var integration = inIntegrations[i];

                if (integration === null) {
                    ok(integration !== null, "Found null integration");
                    start();
                    return;
                }

                ok(integration.hasSucceded(), "Has returned expected succeeded integration");
            }
            start();
        };
        var errback = function () {
            ok(false, "No integration found");
            start();
        };
        xcs_proxy().getLatestSucceededIntegrationForBots(callback, errback);
    });

    test('GetLatestFlaggedIntegrationForBots', function () {
        stop();

        var callback = function (inIntegrations) {
            ok(inIntegrations !== undefined, "Integration found");
            ok(inIntegrations.length > 0, "Found integrations");

            for (var i = 0; i < inIntegrations.length; i++) {
                var integration = inIntegrations[i];

                if (integration === null) {
                    ok(integration !== null, "Found null integration");
                    start();
                    return;
                }

                ok(integration.hasTag('flagged'), "Has returned expected flagged integration");
            }

            start();
        };
        var errback = function () {
            ok(false, "No integration found");
            start();
        };
        xcs_proxy().getLatestFlaggedIntegrationForBots(callback, errback);
    });

    test('GetLatestNonFatalIntegrationForBot', function () {
        stop();

        var queue = dispatch_queue_create('latest_non_fatal_dispatch_queue', true);

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var firstBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'bot2') {
                        firstBot = bot;
                    }
                }

                manager.next(firstBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }
                ok(inIntegration.isBuildSuccessFull(), "Has returned expected succeeded integration");
                start();
            };
            var errback = function () {
                ok(false, "No integration found");
                start();
            };
            xcs_proxy().getLastestNonFatalIntegrationForBot(bot.getId(), callback, errback);
        });
    });

    test('GetIntegrationById', function () {
        stop();

        var queue = dispatch_queue_create('get_integration_dispatch_queue', true);

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var firstBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'bot2') {
                        firstBot = bot;
                    }
                }

                manager.next(firstBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }
                ok(inIntegration.isBuildSuccessFull(), "Has returned expected succeeded integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getLastestNonFatalIntegrationForBot(bot.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                ok(inIntegration !== null, "Integration is not null");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }

                ok(inIntegration.getId() === integration.getId(), "Found matching integration");
                start();
            };
            var errback = function () {
                ok(false, "No integration found");
                start();
            };
            xcs_proxy().getIntegration(integration.getId(), callback, errback);
        });
    });

    test('GetCommitsForIntegration', function () {
        stop();

        var queue = dispatch_queue_create('get_commits_dispatch_queue', true);

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var firstBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'bot2') {
                        firstBot = bot;
                    }
                }

                manager.next(firstBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }
                ok(inIntegration.isBuildSuccessFull(), "Has returned expected succeeded integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getLastestNonFatalIntegrationForBot(bot.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                ok(inIntegration !== null, "Integration is not null");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }

                ok(inIntegration.getId() === integration.getId(), "Found matching integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getIntegration(integration.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var callback = function (commitsArray) {
                ok(commitsArray !== undefined, "Valid response");
                ok(Array.isArray(commitsArray), "Received array");
                if (commitsArray === undefined && commitsArray === null) {
                    ok(false, "No commits found");
                    start();
                    return;
                }

                start();
            };
            var errback = function () {
                ok(false, "No commits found");
                start();
            };
            xcs_proxy().getCommitsForIntegration(integration.getId(), callback, errback);
        });
    });

    test('Add&GetTagFromIntegration', function () {
        stop();

        var queue = dispatch_queue_create('get_commits_dispatch_queue', true);

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var firstBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'bot2') {
                        firstBot = bot;
                    }
                }

                manager.next(firstBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }
                ok(inIntegration.isBuildSuccessFull(), "Has returned expected succeeded integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getLastestNonFatalIntegrationForBot(bot.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var tags = [];
            tags.push(testUUID);

            var callback = function () {
                ok(true, "Tag added successfully.");
                manager.next(integration);
            };

            var errback = function () {
                ok(false, "Failed to add tag");
                manager.next();
            };

            xcs_proxy().addTagsToIntegration(integration.getId(), tags, callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                ok(inIntegration !== null, "Integration is not null");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }

                ok(inIntegration.getId() === integration.getId(), "Found matching integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getIntegration(integration.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found bot");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var tags = integration.getTags();
            ok(tags.indexOf(testUUID) !== -1, "Found tag in integration");
            start();
        });
    });

    test('RemoveTagFromIntegration', function () {
        stop();

        var queue = dispatch_queue_create('get_commits_dispatch_queue', true);

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var firstBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'bot2') {
                        firstBot = bot;
                    }
                }

                manager.next(firstBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }
                ok(inIntegration.isBuildSuccessFull(), "Has returned expected succeeded integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getLastestNonFatalIntegrationForBot(bot.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var tags = [];
            tags.push(testUUID);

            var callback = function () {
                ok(true, "Tag added successfully.");
                manager.next(integration);
            };

            var errback = function () {
                ok(false, "Failed to add tag");
                manager.next();
            };

            xcs_proxy().addTagsToIntegration(integration.getId(), tags, callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                ok(inIntegration !== null, "Integration is not null");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }

                ok(inIntegration.getId() === integration.getId(), "Found matching integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getIntegration(integration.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found bot");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var tags = integration.getTags();
            ok(tags.indexOf(testUUID) !== -1, "Found tag in integration");
            manager.next(integration);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var tags = [];
            tags.push(testUUID);

            var callback = function () {
                ok(true, "Tag added successfully.");
                manager.next(integration);
            };

            var errback = function () {
                ok(false, "Failed to add tag");
                manager.next();
            };

            xcs_proxy().removeTagsFromIntegration(integration.getId(), tags, callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found integration");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                ok(inIntegration !== null, "Integration is not null");
                if (inIntegration === undefined || inIntegration === null) {
                    start();
                    return;
                }

                ok(inIntegration.getId() === integration.getId(), "Found matching integration");
                manager.next(inIntegration);
            };
            var errback = function () {
                ok(false, "No integration found");
                manager.next();
            };
            xcs_proxy().getIntegration(integration.getId(), callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var integration = manager && manager.data && manager.data[0];
            ok(integration !== undefined && integration !== null, "Found bot");
            if (integration === undefined || integration === null) {
                start();
                return;
            }

            var tags = integration.getTags();
            ok(tags.indexOf(testUUID) == -1, "Tag not found in integration");
            start();
        });
    });

    test("UserSession", function () {
        var queue = dispatch_queue_create('user_session_dispatch_queue', true);
        stop();

        dispatch_async(queue, function (manager) {
            var callback = function () {
                ok(true, "Succeeded login in");
                manager.next();
            };
            var errback = function () {
                ok(false, "Failed login in");
                manager.next();
            };

            var auth = {
                username: 'xcsdebugadmin',
                password: 'xcsdebugpassword'
            };
            var header = "Basic " + btoa(auth.username + ":" + auth.password);
            xcs_client().requestHeaders.Authorization = header;

            xcs_proxy().login(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (isLoggedIn) {
                ok(isLoggedIn, "Is logged in");
                manager.next();
            };
            var errback = function () {
                ok(false, "Failed verifying if user is logged in");
                manager.next();
            };
            delete xcs_client().requestHeaders.Authorization;

            xcs_proxy().isLoggedIn(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (isLoggedIn) {
                ok(isLoggedIn, "Is bot creator");
                manager.next();
            };
            var errback = function () {
                ok(false, "Failed verifying if user is bot creator");
                manager.next();
            };
            delete xcs_client().requestHeaders.Authorization;

            xcs_proxy().isBotCreator(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function () {
                ok(true, "Succeeded to log out");
                manager.next();
            };
            var errback = function () {
                ok(false, "Succeeded to log out");
                manager.next();
            };

            xcs_proxy().logout(callback, errback);
        });

        dispatch_async(queue, function () {
            var callback = function (isLoggedIn) {
                ok(!isLoggedIn, "Is not logged in");
                start();
            };
            var errback = function () {
                ok(false, "Failed verifying if user is logged out");
                start();
            };

            xcs_proxy().isLoggedIn(callback, errback);
        });
    });

    test("IntegrateBot", function () {
        var queue = dispatch_queue_create('integrate_bot_dispatch_queue', true);
        stop();

        dispatch_async(queue, function (manager) {
            var callback = function () {
                ok(true, "Succeeded login in");
                manager.next();
            };
            var errback = function () {
                ok(false, "Failed login in");
                manager.next();
            };

            var auth = {
                username: 'xcsdebugadmin',
                password: 'xcsdebugpassword'
            };
            var header = "Basic " + btoa(auth.username + ":" + auth.password);
            xcs_client().requestHeaders.Authorization = header;

            xcs_proxy().login(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (isLoggedIn) {
                ok(isLoggedIn, "Is logged in");
                manager.next();
            };
            var errback = function () {
                ok(false, "Failed verifying if user is logged in");
                manager.next();
            };
            delete xcs_client().requestHeaders.Authorization;

            xcs_proxy().isLoggedIn(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (isLoggedIn) {
                ok(isLoggedIn, "Is bot creator");
                manager.next();
            };
            var errback = function () {
                ok(false, "Failed verifying if user is bot creator");
                manager.next();
            };
            delete xcs_client().requestHeaders.Authorization;

            xcs_proxy().isBotCreator(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, "Integration found");
                ok(inBotArray.length > 0, "Found bots");
                ok(inBotArray[0] !== undefined, "Found first bot");
                var nanoBot = null;

                for (var i = 0; i < inBotArray.length; i++) {
                    var bot = inBotArray[i];
                    if (bot.getName() === 'nanostore') {
                        nanoBot = bot;
                    }
                }

                manager.next(nanoBot);
            };
            var errback = function () {
                ok(false, "No bots found");
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var bot = manager && manager.data && manager.data[0];
            ok(bot !== undefined && bot !== null, "Found nanostore bot");
            if (bot === undefined || bot === null) {
                start();
                return;
            }

            var callback = function (inIntegration) {
                ok(inIntegration !== undefined, "Valid response");
                if (inIntegration !== undefined && inIntegration !== null) {
                    ok(true, "Received integration");
                    start();
                } else {
                    start();
                    return;
                }
            };
            var errback = function () {
                ok(false, "Failed to integrate bot");
                start();
            };

            xcs_proxy().integrateBot(bot.getId(), callback, errback);
        });
    });

    test("GetVersion", function () {
        stop();
        var callback = function (inVersion) {
            ok(inVersion !== undefined && inVersion !== null, "Succeeded to retrieve server version");
            if (inVersion !== undefined && inVersion !== null) {
                ok(inVersion.doc_type == "version", "Is version doc_type");
            }
            start();
        };
        var errback = function () {
            ok(false, "Failed to retrieve server version");
            start();
        };
        xcs_proxy().getVersion(callback, errback);
    });

    test("GetServerHostname", function () {
        stop();
        var callback = function (inHostname) {
            ok(inHostname !== undefined && inHostname !== null, "Succeeded to retrieve server hostname");
            if (inHostname !== undefined && inHostname !== null) {
                if (testLocalhost !== null && testLocalhost === "0") {
                    ok(true, "Localhost test. Skip.");
                }
                else if (testLocalhost !== null && testLocalhost === "1") {
                    ok(inHostname == "xcsnode.apple.com", "Is xcsnode");
                }
                else {
                    ok(false, "testLocalhost is null");
                }
            }
            start();
        };
        var errback = function () {
            ok(false, "Failed to retrieve server hostname");
            start();
        };

        xcs_proxy().getServerHostname(callback, errback);
    });

    test("APIErrorEndpoint", function () {
        stop();
        expect(4);

        var queue = dispatch_queue_create('dispatch_queue', true);
        xcs_proxy().mFailRandomApi = true;

        dispatch_suspend(queue);
        dispatch_async(queue, function (manager) {
            var callback = function (inBotArray) {
                ok(inBotArray !== undefined, 'Received bots');
                manager.next();
            };
            var errback = function () {
                ok('Failed to receive bots');
                manager.next();
            };
            xcs_proxy().getBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (inIntegrations) {
                ok(inIntegrations !== undefined, 'Received integrations');
                manager.next();
            };
            var errback = function () {
                ok('Failed to receive integrations');
                manager.next();
            };
            xcs_proxy().getLatestIntegrationForBots(callback, errback);
        });

        dispatch_async(queue, function (manager) {
            var callback = function (inIntegrations) {
                ok(inIntegrations !== undefined, 'Received integrations');
                manager.next();
            };
            var errback = function () {
                ok('Failed to receive integrations');
                manager.next();
            };
            xcs_proxy().getLatestFailedIntegrationForBots(callback, errback);
        });

        dispatch_async(queue, function () {
            var callback = function (inIntegrations) {
                ok(inIntegrations !== undefined, 'Received integrations');
                xcs_proxy().mFailRandomApi = false;
                start();
            };
            var errback = function () {
                ok('Failed to receive integrations');
                xcs_proxy().mFailRandomApi = false;
                start();
            };
            xcs_proxy().getLatestFlaggedIntegrationForBots(callback, errback);
        });
        dispatch_resume(queue);
    });
    
    test("ServerIsInMaintenance", function() {
        stop();
        expect(2);
        
        globalNotificationCenter().subscribe(XCS.XCSClient.RECEIVED_SERVER_MAINTENANCE_ERROR, function() {
            ok(true, 'Maintenance notification has been fired');
        });
        
        var callback = function () {
            ok(false, 'Server should have returned 532, maintenance mode');
            start();
        };
        var errback = function () {
            ok('Failed to receive bots');
            start();
        };

        xcs_proxy().getBots(callback, errback, "532");
    });
}
;
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['integration_status'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"xcs-integration-status-summary errors-disabled warnings-disabled analysis-disabled tests-disabled performance-disabled\">\n	<div class=\"xcs-integration-status-summary-update-left-curtain\"></div>\n	<div class=\"xcs-integration-status-summary-update-right-curtain\"></div>\n    <div class=\"xcs-integration-status-summary-update-blur-mask\"></div>\n	<div class=\"xcs-integration-status-badge-container errors\">\n		<div class=\"xcs-integration-status-count-icon-container\">\n			<div class=\"xcs-integration-status-count-icon\"></div>\n		</div>\n		<div class=\"xcs-integration-status-count-bar\"></div>\n		<div class=\"xcs-integration-status-count-container\">\n			<div class=\"xcs-integration-status-count\"></div>\n			<div class=\"xcs-integration-status-change-count\">\n				<span class=\"xcs-integration-status-change-count-fresh\"></span>\n				<span class=\"xcs-integration-status-change-count-separator\">|</span>\n				<span class=\"xcs-integration-status-change-count-solved\"></span>\n			</div>\n		</div>\n	</div>\n	<div class=\"xcs-integration-status-badge-container warnings\">\n		<div class=\"xcs-integration-status-count-icon-container\">\n			<div class=\"xcs-integration-status-count-icon\"></div>\n		</div>\n		<div class=\"xcs-integration-status-count-bar\"></div>\n		<div class=\"xcs-integration-status-count-container\">\n			<div class=\"xcs-integration-status-count\"></div>\n			<div class=\"xcs-integration-status-change-count\">\n				<span class=\"xcs-integration-status-change-count-fresh\"></span>\n				<span class=\"xcs-integration-status-change-count-separator\">|</span>\n				<span class=\"xcs-integration-status-change-count-solved\"></span>\n			</div>\n		</div>\n	</div>\n	<div class=\"xcs-integration-status-badge-container analysis\">\n		<div class=\"xcs-integration-status-count-icon-container\">\n			<div class=\"xcs-integration-status-count-icon\"></div>\n		</div>\n		<div class=\"xcs-integration-status-count-bar\"></div>\n		<div class=\"xcs-integration-status-count-container\">\n			<div class=\"xcs-integration-status-count\">\n                <span class=\"xcs-integration-status-count-label\"></span>\n				<div class=\"xcs-integration-status-change-no-count-icon\"></div>\n            </div>\n			<div class=\"xcs-integration-status-change-count\">\n				<span class=\"xcs-integration-status-change-count-fresh\"></span>\n				<span class=\"xcs-integration-status-change-count-separator\">|</span>\n				<span class=\"xcs-integration-status-change-count-solved\"></span>\n			</div>\n		</div>\n	</div>\n	<div class=\"xcs-integration-status-badge-container tests\">\n		<div class=\"xcs-integration-status-count-icon-container\">\n			<div class=\"xcs-integration-status-count-icon\"></div>\n		</div>\n		<div class=\"xcs-integration-status-count-bar\"></div>\n		<div class=\"xcs-integration-status-count-container\">\n			<div class=\"xcs-integration-status-count\">\n				<span class=\"xcs-integration-status-count-label\"></span>\n				<div class=\"xcs-integration-status-change-no-count-icon\"></div>\n			</div>\n			<div class=\"xcs-integration-status-change-count no-separator\">\n				<span class=\"xcs-integration-status-change-count-fresh\"></span>\n				<span class=\"xcs-integration-status-change-count-separator\">|</span>\n				<div class=\"xcs-integration-status-change-count-solved\">\n                    <span class=\"xcs-integration-status-change-count-solved-coverage\"></span>\n                    <span class=\"xcs-integration-status-change-count-solved-glyph\"></span>\n                    <span class=\"xcs-integration-status-change-count-solved-test-or-coverage-count\"></span>\n                </div>\n			</div>\n		</div>\n	</div>\n	<div class=\"xcs-integration-status-badge-container performance\">\n		<div class=\"xcs-integration-status-count-icon-container\">\n			<div class=\"xcs-integration-status-count-icon\"></div>\n		</div>\n		<div class=\"xcs-integration-status-count-bar\"></div>\n		<div class=\"xcs-integration-status-count-container\">\n			<div class=\"xcs-integration-status-count\">\n				<span class=\"xcs-integration-status-count-label\"></span>\n				<div class=\"xcs-integration-status-change-no-count-icon\"></div>\n			</div>\n			<div class=\"xcs-integration-status-change-count no-separator\">\n				<span class=\"xcs-integration-status-change-count-fresh\"></span>\n				<span class=\"xcs-integration-status-change-count-separator\">|</span>\n				<span class=\"xcs-integration-status-change-count-solved\"></span>\n			</div>\n		</div>\n	</div>\n</div>\n";
  });
})();
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

















;

// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
	
	"_XCS.PlaceHolder.NotBots.NoBotsConfigured": "No Bots",
	"_XCS.PlaceHolder.NotBots.CreateNewBot": "Create a new bot in Xcode from the product menu.",
    "_XCS.PlaceHolder.Maintenance": "Maintenance",
	"_XCS.PlaceHolder.Maintenance.Message": "Server undergoing maintenance",
	
	"_XCS.BotList.Button.About": "About",

	"_XCS.BotDetail.Header.History.Popup.Logs": "Logs",
	"_XCS.BotDetail.Header.IntegrateNow": "Integrate Now",
	
	"_XCS.BotDetail.BotList.Empty.Latest": "No Integrations",
	"_XCS.BotDetail.BotList.Empty.Failed": "No Failed Integrations",
	"_XCS.BotDetail.BotList.Empty.Succeeded": "No Successful Integrations",
	"_XCS.BotDetail.BotList.Empty.Flagged": "No Flagged Integrations",
	"_XCS.BotDetail.BotList.Empty.Contributed": "No Integrations",
	"_XCS.BotDetail.BotList.Integrate": "Integrate",
	"_XCS.BotDetail.BotList.Waiting": "Waiting",
	
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
/** 
* Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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

// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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


  buffer += "<div class=\"xcs-webui-bot-list-item\">\n	<div class=\"xcs-webui-bot-list-item-title-container\">\n		<div class=\"xcs-webui-bot-list-item-title-label\">\n			<div class=\"xcs-webui-bot-list-item-title-label-string\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n		</div>\n		<a class=\"xcs-webui-bot-list-item-integrate-button\">\n			";
  if (helper = helpers.integrate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.integrate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n		</a>\n		<a class=\"xcs-webui-bot-list-item-integration-progression-container\">\n			<div class=\"xcs-webui-bot-list-item-integration-progression-waiting\">";
  if (helper = helpers.waiting) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.waiting); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n			<div class=\"xcs-webui-bot-list-item-integration-progression-circle-container\"></div>\n		</a>\n	</div>\n	<a href=\"/xcode/bots/";
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
    + "</a>\n			</div>\n			<div id=\"xcs-webui-header-filter-label-container\" class=\"show\">\n				<div id=\"xcs-webui-header-filter-label-arrow\"></div>\n				<div id=\"xcs-webui-header-filter-label\">";
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
templates['placeholder'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id='xcs-webui-no-bots-placeholder'>\n	<div id='xcs-webui-no-bots-container'>\n		<div id='xcs-webui-no-bots-icon'></div>\n		<div id='xcs-webui-no-bots-first-line'></div>\n		<div id='xcs-webui-no-bots-second-line-container'>\n			<span id='xcs-webui-not-bots-create-new-bot'></span>\n			<a href='https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/xcode_guide-continuous_integration/ConfigureBots.html' target='_blank' id='xcs-webui-not-bots-create-new-bot-link'>\n				<div id='xcs-webui-not-bots-create-new-bot-link-icon'></div>\n			</a>\n		</div>\n	</div>\n</div>";
  });
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['progression_circle'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"xcs-webui-progression-circle\"></div>";
  });
})();
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
                
                var initialsYPosition = 12.8;
                if (browser().isFirefox()) {
                    initialsYPosition = 25;
                }

				page.text(25,initialsYPosition, this.mInitials).attr({"font-size": 15, "font-family": "Helvetica Neue", "font-weight": "100", fill: "#FFF"});
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
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.WebUI.Views.ProgressionCircle = Class.create(XCS.Mvc.View, {
	mClassName: null,
	initialize: function($super, inParams) {
		if (inParams === undefined) {
			var inParams = {};
		}
		
		this.mTemplate = this.getTemplate('progression_circle');
		this.mBackgroundCircle = null;
		this.mBackgroundSquare = null;
		this.mCircle = null;
		this.mDimension = 10;
		this.mRadius = null;
		this.mPadding = 1;
		this.mValue = 0;
		
		this.mColor = "#989898";
	},
	render: function() {
		var elem = this.renderTemplate({});
		this.createCircle(elem);
		return elem;
	},
	createCircle: function(inElem) {
		if (inElem !== undefined) {
			
			var page = Raphael(inElem, "100%", "100%");
			page.setViewBox(0, 0, this.mDimension, this.mDimension);
			var positionStart = this.mDimension / 2;
			var positionX = this.mDimension / 2;
			var positionY = this.mDimension / 2;
			var backgroundRadius = positionStart;
			this.mRadius = positionStart - this.mPadding;
			
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
			
			this.mBackgroundCircle = page.circle(positionX, positionY, backgroundRadius-0.5).attr({"stroke-width": "0.3px", stroke: this.mColor});
			this.mBackgroundSquare = page.rect(positionX - 0.5, positionY - 0.5, 1, 1).attr({stroke: this.mColor, "stroke-width": "1px"});
			this.mCircle = page.path().attr({stroke: this.mColor, "stroke-width": "1px", arc: [0, 100, this.mRadius]});
		}
	},
	resetValue: function() {
		this.mValue = 0;
		this.mCircle.attr({arc: [this.mValue, 100, this.mRadius]});
	},
	setValue: function(inValue) {
		if (inValue !== undefined) {
			this.mValue = inValue;
			this.updateValue();
		}
	},
	updateValue: function() {
		if (this.mValue !== null && this.mCircle !== null) {
			this.mCircle.animate({arc: [this.mValue, 100, this.mRadius]}, 500, "<");
		}
	},
	setPending: function(inValue) {
		if (inValue !== undefined) {
			if (inValue) {
				this.mColor = "#989898";
			}
			else {
				this.mColor = "#2285f4";
			}
			this.mCircle.attr({stroke: this.mColor});
			this.mBackgroundCircle.attr({stroke: this.mColor});
			this.mBackgroundSquare.attr({stroke: this.mColor});
		}
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

/* global browser */


XCS.WebUI.NOTIFICATION_INTEGRATION_ITEM_DOWNLOAD_POPUP_GEAR_CLICKED = "INTEGRATION_ITEM_DOWNLOAD_POPUP_GEAR_CLICKED";
XCS.WebUI.NOTIFICATION_WINDOW_HAS_BEEN_CLICKED = "WINDOW_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_LOAD_MORE_INTEGRATIONS = "LOAD_MORE_INTEGRATIONS";
XCS.WebUI.NOTIFICATION_INTEGRATION_FLAG_HAS_BEEN_CLICKED = "INTEGRATION_FLAG_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_INTEGRATION_SET_FLAG_HAS_FAILED = "INTEGRATION_SET_FLAG_HAS_FAILED";
XCS.WebUI.NOTIFICATION_SIGNOUT_HAS_BEEN_CLICKED = "SIGNOUT_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_SIGNIN_HAS_BEEN_CLICKED = "SIGNIN_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_FILTER_BUTTON_HAS_BEEN_CLICKED = "FILTER_BUTTON_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED = "FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_INTEGRATE_NOW_HAS_BEEN_CLICKED = "INTEGRATE_NOW_HAS_BEEN_CLICKED";
XCS.WebUI.NOTIFICATION_CANCEL_INTEGRATION_HAS_BEEN_CLICKED = "CANCEL_INTEGRATION_HAS_BEEN_CLICKED";

XCS.WebUI.WebUIController = Class.create(XCS.Mvc.ViewController, {
	mQueue: null,
	mCurrentBotId: null,
	mCurrentBotTinyId: null,
	mCurrentIntegrationId: null,
	mCurrentIntegrationTinyId: null,
    mParams: null,
	mRoutePattern: null,
	mSelectedFilter: null,
    mShowingMaintenanceUI: false,
    mPollingForMaintenanceEndInterval: null, 
	mServerHostname: window.location.hostname, // Default to the window hostname, we will fetch the real hostname from the server async
	main: function main() {
		// Create views
		this.botListView = new XCS.WebUI.Views.BotListView();
		this.placeholder = new XCS.WebUI.Views.PlaceholderView();
		this.headerView = new XCS.WebUI.Views.Header();
		this.integrationsFilter = new XCS.WebUI.Views.IntegrationsFilter();
		this.integrationSummaryView = new XCS.WebUI.Views.BotSummaryView();
		this.mQueue = dispatch_queue_create('webui_controller', true);
		this.mCurrentBotId = null;
		this.mCurrentBotTinyId = null;
		this.mCurrentIntegrationId = null;
		this.mCurrentIntegrationTinyId = null;
		this.mSelectedFilter = null;
        this.mShowingMaintenanceUI = false;
        this.mPollingForMaintenanceEndInterval = null;
		
		// Add views to main
		mainView.addSubview(this.headerView);
		mainView.addSubview(this.integrationsFilter);
		mainView.addSubview(this.botListView);
		mainView.addSubview(this.placeholder);
		mainView.addSubview(this.integrationSummaryView);
		
		if (browser().isMobile()) {
			browser().setMeta('viewport', 'minimum-scale=1.0, maximum-scale=1, width=device-width, user-scalable=no');
		}
		
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_NEW_INTEGRATION_STATUS, this.handleIntegrationActivityStreamUpdate.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_ADVISORY_INTEGRATION_STATUS, this.handleIntegrationAdvisoryStreamUpdate.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_REMOVED_STATUS, this.handleBotHasBeenRemoved.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_CREATED_STATUS, this.handleBotHasBeenCreated.bind(this));
		globalNotificationCenter().subscribe(XCS.ActivityStream.NOTIFICATION_DID_GET_BOT_UPDATED_STATUS, this.handleBotHasBeenUpdated.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_SIGNOUT_HAS_BEEN_CLICKED, this.handleSignOutHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_SIGNIN_HAS_BEEN_CLICKED, this.handleSignInHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_INTEGRATION_FLAG_HAS_BEEN_CLICKED, this.handleIntegrationFlagHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_INTEGRATE_NOW_HAS_BEEN_CLICKED, this.handleIntegrationNowHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_CANCEL_INTEGRATION_HAS_BEEN_CLICKED, this.handleCancelIntegrationHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_FILTER_BUTTON_HAS_BEEN_CLICKED, this.handleFilterButtonHasBeenClicked.bind(this));
		globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_FILTER_CANCEL_BUTTON_HAS_BEEN_CLICKED, this.handleFilterCancelButtonHasBeenClicked.bind(this));
        globalNotificationCenter().subscribe(XCS.XCSClient.RECEIVED_SERVER_MAINTENANCE_ERROR, this.handleServerMaintenanceErrorNotification.bind(this));
        globalNotificationCenter().subscribe(XCS.XCSClient.RECEIVED_SUCCESSFUL_RESPONSE, this.handleSuccessfulResponseNotification.bind(this));
		
		// Register Handlebars Helper
		Handlebars.registerHelper('newLinesToHTML', XCS.Tools.newLinesToHTML);
	},
	load: function load(inParams, inRoutePattern) {
		// Make sur that the queue is ready
		if (dispatch_queue_size(this.mQueue) === 0) {
			dispatch_resume(this.mQueue);
		}
		
		var filterParam = (inParams && inParams.filter) || null;
		var botTinyIdParam = (inParams && inParams.botTinyId) || null;
		var integrationTinyIdParam = (inParams && inParams.integrationTinyId) || null;
		
        // save current params
        this.mParams = inParams;
        
		// save route pattern
		this.mRoutePattern = inRoutePattern;
		
		// Batchs of async requests
		var taskGroup1 = new DispatchTaskGroup();
		var taskGroup2 = new DispatchTaskGroup();
		var taskGroup3 = new DispatchTaskGroup();
		var taskGroup4 = new DispatchTaskGroup();
		
		var shouldRenderBots = false;
		
		// Close Filter menu 
		this.closeFilterMenu();
		
		// If bot list is empty
		if (this.botListView && this.botListView.mSubviews && this.botListView.mSubviews.length === 0 && botTinyIdParam === null) {
			this.mCurrentBotTinyId = null;
			taskGroup1.addTask(this.getBotsAndFilteredIntegrations());
			shouldRenderBots = true;
		} 
		else if (this.botListView && this.botListView.mSubviews && this.botListView.mSubviews.length > 0 && botTinyIdParam === null && filterParam !== null && filterParam !== this.mSelectedFilter.toLowerCase()){
			taskGroup1.addTask(this.getFilteredIntegrationForBots());
			shouldRenderBots = false;
		}
		
		// If filter
		if (filterParam !== undefined && filterParam !== null) {
			switch(filterParam) {
				case XCS.BotFilter.INTEGRATION_FILTER_LATEST.toLowerCase():
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
				default:
					globalRouteHandler().routeURL('/xcode/bots/latest/%@'.fmt(filterParam), undefined, true);
					break;
			}
		}
		else {
			this.mSelectedFilter = XCS.BotFilter.INTEGRATION_FILTER_LATEST;
		}
		
		// Update filter views
		this.updateFilterViews();
		
		// If bot list is full and we have a bot id
		if (botTinyIdParam !== undefined && botTinyIdParam !== null) {
			// Get botId for tinyId
			var botId = null;
			this.mCurrentBotTinyId = botTinyIdParam;
			if (botStorage().hasTinyId(botTinyIdParam)) {
                botId = botStorage().getBotIdFromTinyId(botTinyIdParam);
				
				// If bot is in the list
				if (this.mCurrentBotId !== botId && botStorage().getBot(botId) !== null) {
					this.mCurrentBotId = botId;
				}
				else if (botStorage().getBot(botId) === undefined) {
					taskGroup1.addTask(this.getBotsAndFilteredIntegrations());
					shouldRenderBots = true;
				}
			}
			else {
				taskGroup1.addTask(this.getBotsAndFilteredIntegrations());
				shouldRenderBots = true;
			}
		}
		
		if (integrationTinyIdParam !== undefined && integrationTinyIdParam !== null) {
			this.mCurrentIntegrationTinyId = integrationTinyIdParam;
		}
		else {
			this.mCurrentIntegrationTinyId = null;
		}
		this.mCurrentIntegrationId = null;
		
		// Clean integrations view
		taskGroup1.addTask(this.cleanIntegrationViews());
		
		// Set integrations views as loading
		taskGroup1.addTask(this.setIntegrationViewsLoading());
		
		// Send task groups to the queue
		dispatch_async(this.mQueue, taskGroup1);
		
		if (shouldRenderBots) {
			// for render
			taskGroup2.addTask(this.renderBotsInBotList());
		}
		
		// Update views with bot data
		taskGroup2.addTask(this.renderBots());
		
		// Send task groups to the queue
		dispatch_async(this.mQueue, taskGroup2);
		
		// Update UI views based on route pattern
		dispatch_async(this.mQueue, this.setActiveView());
        
        // Make sure that we have a currentBotId before fetching commits and issues
		dispatch_async(this.mQueue, function setCurrentBotId(manager){
            if (botStorage().hasTinyId(botTinyIdParam)) {
                var botId = botStorage().getBotIdFromTinyId(botTinyIdParam);
				
				// If bot is in the list
				if (this.mCurrentBotId !== botId && botStorage().getBot(botId) !== null) {
					this.mCurrentBotId = botId;
                }
            }
            manager.next();
        });
        
		// Get commits and issues
		dispatch_async(this.mQueue, this.getCommitsAndIssuesForFilteredIntegrations());
		
		// Get running integrations
		dispatch_async(this.mQueue, this.getRunningIntegrations());

		// update bot list view with integration data
		taskGroup3.addTask(this.renderIntegrationsInBotList());
		
		if (this.mRoutePattern === XCS.WebUI.Routes.SLASH_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_INDEX_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE) {
			// Send task groups to the queue
			dispatch_async(this.mQueue, taskGroup3);
		}
		if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE) {
			if (integrationTinyIdParam !== undefined && integrationTinyIdParam !== null) {
				taskGroup3.addTask(this.getIntegration(integrationTinyIdParam));
				// Send task groups to the queue
				dispatch_async(this.mQueue, taskGroup3);
				
				dispatch_async(this.mQueue, this.getCommitsAndIssuesForIntegration(integrationTinyIdParam, this.mCurrentBotId));
				dispatch_async(this.mQueue, this.renderIntegration());
				dispatch_async(this.mQueue, this.renderCommitsAndIssuesForIntegration());
			}
			else {
				// Update detail views with integration data
				dispatch_async(this.mQueue, this.renderIntegrations());
				// Update views with commits data
				dispatch_async(this.mQueue, this.renderCommitsAndIssues());
			}
		}

		// Update window title
		taskGroup4.addTask(this.updateWindowTitle());

		// Check if user is currently loggued in
		taskGroup4.addTask(this.getUserAuthStatus());
		
		// Get Server Hostname
		taskGroup4.addTask(this.getServerHostname());
		
		// Send task groups to the queue
		dispatch_async(this.mQueue, taskGroup4);
		
		// Update routes
		dispatch_async(this.mQueue, function dispatchRoutesShouldUpdate(manager) {
			globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
			manager.next();
		}.bind(this));
		
		dispatch_final(this.mQueue, function dispatchFinal() {
			logger().debug("Final queue item fired");
            
            if (typeof(testEnv) !== "undefined" && testEnv === true) {
                ok(true, 'Loaded web UI controller.');
                start();
            }
		});
	},
	handleIntegrationActivityStreamUpdate: function handleIntegrationActivityStreamUpdate(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			// Batchs of async requests

			var integrationId = (inParams && inParams._id);
			var botId = (inParams && inParams.botId);
			var currentStep = (inParams && inParams.currentStep);
			// if we have the params that we need
			if (typeof(integrationId) == "string" && typeof(botId) == "string") {
				if (dispatch_queue_size(this.mQueue) === 0) {
					dispatch_resume(this.mQueue);
				}
				
				if (botStorage().getBot(botId) === null) {
					// Get bot data
					dispatch_async(this.mQueue, this.getBotById(botId));
					// Add bot to list view
					dispatch_async(this.mQueue, this.renderBotInBotList(botId));
				}
				// Fetch integration data
				dispatch_async(this.mQueue, this.getIntegration(integrationId));
				
				// Get integrations based on current filter
				dispatch_async(this.mQueue, this.getFilteredIntegrationForBots(botId));
				
				// Render integration data in bot list
				dispatch_async(this.mQueue, this.renderIntegrationInBotList(botId, currentStep));

				// Update routes
				dispatch_async(this.mQueue, function dispatchRoutesShouldUpdate(manager) {
                    var bot = botStorage().getBot(botId);
                    var integration = bot.getIntegrationById(integrationId);
                    if (integration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
                        bot.cleanupUnusedIntegrations();
                    }
                    
					globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
					manager.next();
				}.bind(this));
			}
		}
	},
	handleIntegrationAdvisoryStreamUpdate: function handleIntegrationAdvisoryStreamUpdate(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			var integrationId = (inParams && inParams._id);
			var botId = (inParams && inParams.botId);
			var percentage = (inParams && inParams.percentage);
			
			if (typeof(integrationId) == "string" && typeof(botId) == "string") {
				if (dispatch_queue_size(this.mQueue) === 0) {
					dispatch_resume(this.mQueue);
				}
				
				dispatch_async(this.mQueue, this.renderIntegrationProgression(botId, integrationId, percentage));
			}
		}
	},
	handleBotHasBeenRemoved: function handleBotHasBeenRemoved(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			var botId = (inParams && inParams._id);
			
			// remove from bot list
			this.botListView.removeBot(botId);
			
			// if currently displayed then change bot focus
			if (botId === this.mCurrentBotId) {
				var viewHasBots = this.botListView.hadBots();
				if (!viewHasBots) {
					// show no bots placeholder
					this.showNoBotsPlaceholder();
				}
			}
		
			// remove bot from storage
			if (botStorage().getBot(botId) !== undefined) {
				botStorage().removeBot(botId);
			}
		}
	},
	handleBotHasBeenCreated: function handleBotHasBeenCreated(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			// Make sur that the queue is ready
			if (dispatch_queue_size(this.mQueue) === 0) {
				dispatch_resume(this.mQueue);
			}
			
			var botId = (inParams && inParams._id);
			
			if (botStorage().getBot(botId) === undefined) {
				dispatch_async(this.mQueue, this.getBotById(botId));
				// Add bot to list view
				dispatch_async(this.mQueue, this.renderBotInBotList(botId));
			}
			
			// Update routes
			dispatch_async(this.mQueue, function dispatchRoutesShouldUpdate(manager) {
				globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
				manager.next();
			}.bind(this));
		}
	},
	handleBotHasBeenUpdated: function handleBotHasBeenUpdated(inMessage, inObject, inParams) {
		if (inParams !== undefined) {
			// Make sur that the queue is ready
			if (dispatch_queue_size(this.mQueue) === 0) {
			    dispatch_resume(this.mQueue);
			}
			
			var botId = (inParams && inParams._id);
			
			if (botStorage().getBot(botId) !== undefined) {
				dispatch_async(this.mQueue, this.getBotById(botId));
				// update bots
				dispatch_async(this.mQueue, this.renderBotInBotList(botId));
				
				// Update window title
				dispatch_async(this.mQueue, this.updateWindowTitle());
			}
			
			// Update routes
			dispatch_async(this.mQueue, function dispatchRoutesShouldUpdate(manager) {
				globalNotificationCenter().publish(XCS.Routes.NOTIFICATION_ROUTES_SHOULD_UPDATE);
				manager.next();
			}.bind(this));
		}
	},
	handleSignOutHasBeenClicked: function handleSignOutHasBeenClicked() {
		function resetWindowLocation() {
			window.location = '/xcode';
		}
		
		function logoutCallback() {
			xcs_proxy().forceLogin(resetWindowLocation, resetWindowLocation);
		}
			
		xcs_proxy().logout(logoutCallback, logoutCallback);
	},
	handleSignInHasBeenClicked: function handleSignInHasBeenClicked() {
		function signInCallback() {
			// Make sur that the queue is ready
			if (dispatch_queue_size(this.mQueue) === 0) {
				dispatch_resume(this.mQueue);
			}

			dispatch_async(this.mQueue, this.getUserAuthStatus());
		}
        
		xcs_proxy().login(signInCallback.bind(this), signInCallback.bind(this));
	},
	handleIntegrationFlagHasBeenClicked: function handleIntegrationFlagHasBeenClicked(inMessage, inObject, inParams) {
		var tag = (inParams.tag || null);
		var action = (inParams.action || null);
		var integrationId = (inParams.integrationId || null);
		var botId = (inParams.botId || null);
        
        function integrationFlagHasBeenClickedErrback() {
            //globalNotificationCenter().subscribe(XCS.WebUI.NOTIFICATION_INTEGRATION_SET_FLAG_HAS_FAILED, undefined, inParams);
        }
        
        function integrationFlagHasBeenClickedCallback(inResponse) {
            if (inResponse !== undefined && inResponse !== null && inResponse) {
                var bot = botStorage().getBot(botId);
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
        }
        
		if (tag !== undefined && tag !== null && action !== undefined && action !== null && integrationId !== undefined && integrationId !== null) {
			
			
			if (action === 'add') {
				xcs_proxy().addTagsToIntegration(integrationId, [tag], integrationFlagHasBeenClickedCallback.bind(this), integrationFlagHasBeenClickedErrback);
			}
			else if (action === 'remove') {
				xcs_proxy().removeTagsFromIntegration(integrationId, [tag], integrationFlagHasBeenClickedCallback.bind(this), integrationFlagHasBeenClickedErrback);
			}
		}
	},
	handleIntegrationNowHasBeenClicked: function handleIntegrationNowHasBeenClicked(inMessage, inObject, inParams) {
		var botId = inParams && inParams.botId;
		function integrationNowHasBeenClickedCallback(inIntegration) {
			if (inIntegration !== undefined && inIntegration !== null) {
				if (dispatch_queue_size(this.mQueue) === 0) {
					dispatch_resume(this.mQueue);
				}
				var botId = inIntegration.getBotId();
				var bot = botStorage().getBot(botId);
				var step = inIntegration.getCurrentStep();
                if (bot !== null) {
                    bot.updateIntegration(inIntegration);
                }
				
				dispatch_async(this.mQueue, this.renderIntegrationInBotList(botId, step));
			}
		}
		function integrationNowHasBeenClickedErrback() {

		}
		
		xcs_proxy().integrateBot(botId, integrationNowHasBeenClickedCallback.bind(this), integrationNowHasBeenClickedErrback.bind(this));
	},
	handleCancelIntegrationHasBeenClicked: function handleCancelIntegrationHasBeenClicked(inMessage, inObject, inParams) {
		var integrationId = inParams && inParams.integrationId;
		function cancelIntegrationHasBeenClickedCallback() {

		}
		function cancelIntegrationHasBeenClickedErrback() {

		}
		
		xcs_proxy().cancelIntegration(integrationId, cancelIntegrationHasBeenClickedCallback.bind(this), cancelIntegrationHasBeenClickedErrback.bind(this));
	},
	handleFilterCancelButtonHasBeenClicked: function handleFilterCancelButtonHasBeenClicked() {
		this.integrationsFilter.close();
		this.headerView.updateFilterHeaderStatus();
	},
	handleFilterButtonHasBeenClicked: function handleFilterButtonHasBeenClicked() {
		this.integrationsFilter.toggle();
		this.headerView.updateFilterHeaderStatus();
	},
    handleServerMaintenanceErrorNotification: function handleServerMaintenanceErrorNotification() {
        if (this.mShowingMaintenanceUI === false) {
            this.mPollingForMaintenanceEndInterval = setInterval(xcs_proxy().getBots, 15000);
            this.showMaintenancePlaceholder();
        }
        this.mShowingMaintenanceUI = true;
    },
    handleSuccessfulResponseNotification: function handleSuccessfulResponseNotification() {
        if (this.mShowingMaintenanceUI === true) {
            clearInterval(this.mPollingForMaintenanceEndInterval);
            this.mPollingForMaintenanceEndInterval = null;
            this.hideMaintenancePlaceholder();
        }
        this.mShowingMaintenanceUI = false;
    },
	showNoBotsPlaceholder: function showNoBotsPlaceholder() {
        if (this.mShowingMaintenanceUI === false) {
            this.placeholder.showLink();
            this.headerView.hideFilterNode();
            this.showPlaceholder("_XCS.PlaceHolder.NotBots.NoBotsConfigured".loc(), "_XCS.PlaceHolder.NotBots.CreateNewBot".loc());
        }
	},
    showMaintenancePlaceholder: function showMaintenancePlaceholder() {
        this.placeholder.hideLink();
        this.headerView.hideFilterNode();
        this.showPlaceholder("", "_XCS.PlaceHolder.Maintenance.Message".loc());
    },
	hideNoBotsPlaceholder: function hideNoBotsPlaceholder() {
        if (this.mShowingMaintenanceUI === true) {
            this.headerView.showFilterNode();
            this.hidePlaceholder();
        }
	},
    hideMaintenancePlaceholder: function hideMaintenancePlaceholder() {
        this.hidePlaceholder();
        this.headerView.showFilterNode();
        this.load(this.mParams, this.mRoutePattern);
    },
    showPlaceholder: function showPlaceholder(inFirstLine, inSecondLine) {
        document.querySelector('body').classList.add('no-bots');
        this.disableAllViews();
        this.placeholder.updateMessages(inFirstLine, inSecondLine);
		this.placeholder.setActive(true);
		this.botListView.loaded();
		XCS.RouteHelpers.setBrowserWindowTitle();
    },
    hidePlaceholder: function hidePlaceholder() {
        document.querySelector('body').classList.remove('no-bots');
		this.placeholder.setActive(false);
		// Update UI views based on route pattern
		dispatch_async(this.mQueue, this.setActiveView());
    },
	// Actions
	setActiveView: function setActiveView() {
		return function setActiveViewBlock(manager) {
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
					case XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE:
						this.disableAllViews();
						this.integrationSummaryView.setActive(true);
						this.headerView.setHeaderFor('bot_summary');
						break;
				}
			}
			manager.next();
		}.bind(this);
	},
	updateFilterViews: function updateFilterViews() {
		this.integrationsFilter.close();
		this.headerView.updateFilterHeaderStatus(this.mSelectedFilter);
		this.integrationsFilter.setFilter(this.mSelectedFilter);
		this.botListView.updateFilter(this.mSelectedFilter);
		this.integrationSummaryView.updateFilter(this.mSelectedFilter);
		if (botStorage().getLength() === 0) {
			this.botListView.loading();
		}
	},
	closeFilterMenu: function closeFilterMenu() {
		this.integrationsFilter.close();
	},
	disableAllViews: function disableAllViews() {
		this.botListView.setActive(false);
		this.integrationSummaryView.setActive(false);
	},
	renderBotsInBotList: function renderBotsInBotList() {
		return function renderBotsInBotListBlock(manager) {
			this.botListView.reset(botStorage().getBots(), this.mSelectedFilter);
			if (botStorage().hasBots()) {
				// hide no bots placeholder
				this.hideNoBotsPlaceholder();
			}
			else {
				// show no bots placeholder
				this.showNoBotsPlaceholder();
			}
			manager.next();
			
		}.bind(this);
	},
	renderBotInBotList: function renderBotInBotList(inBotId) {
		return function renderBotInBotListBlock(manager) {
			if (inBotId !== undefined && botStorage().getBot(inBotId) !== undefined) {
				var bot = botStorage().getBot(inBotId);
				this.botListView.updateOrAddBot(bot, this.mSelectedFilter);
				// hide no bots placeholder
				this.hideNoBotsPlaceholder();

				if (botStorage().getLength() == 1) {
					this.mCurrentBotId = bot.getId();
				}
				manager.next();
			}
			else {
				manager.next();
			}
			
		}.bind(this);
	},
	renderBots: function renderBots() {
		return function renderBotsBlock(manager) {
			if (botStorage().hasBots()) {
				// Set selected bot
				if (this.mCurrentBotId === null && this.mCurrentBotTinyId !== null && botStorage().hasTinyId(this.mCurrentBotTinyId)) {
					this.mCurrentBotId = botStorage().getBotIdFromTinyId(this.mCurrentBotTinyId);
				}
				else if (this.mCurrentBotTinyId !== null && !botStorage().hasTinyId(this.mCurrentBotTinyId)) {
					manager.final();
					this.mCurrentBotTinyId = null;
					globalRouteHandler().routeURL('/xcode/bots/latest'.fmt(), undefined, true);
					return;
				}
				this.botListView.selectBot(this.mCurrentBotId);
				this.mCurrentBotId = this.botListView.getSelectedBotId();
				this.botListView.loaded();
			}

			manager.next();
			
		}.bind(this);
	},
	renderIntegrationsInBotList: function renderIntegrationsInBotList() {
		return function renderIntegrationsInBotListBlock(manager) {
			// Update views with integration data
			for (var key in botStorage().getBots()) {
				var bot = botStorage().getBot(key);
				var integration = bot.getIntegrationFromFilter(this.mSelectedFilter, true);
				this.botListView.update(bot, integration);
			}

			manager.next();
		}.bind(this);
	},
	renderIntegrationInBotList: function renderIntegrationInBotList(inBotId, inStep) {
		return function renderIntegrationInBotListBlock(manager) {
			if (inBotId !== undefined) {
				var bot = botStorage().getBot(inBotId);
				var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
				this.botListView.update(bot, integration, inStep);
			}
				
			manager.next();
		}.bind(this);
	},
	renderIntegrationProgression: function renderIntegrationProgression(inBotId, inRunningIntegrationId, inPercentage) {
		return function renderIntegrationProgressionBlock(manager) {
			if (inBotId !== undefined) {
				var bot = botStorage().getBot(inBotId);
				var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
				
				this.botListView.update(bot, integration, undefined, inPercentage, inRunningIntegrationId);
			}
			
			manager.next();
		}.bind(this);
	},
	renderIntegrations: function renderIntegrations() {
		return function renderInttegrationsBlock(manager) {
			// Update views with integration data
			var bot = botStorage().getBot(this.mCurrentBotId);
			var integration = bot.getIntegrationFromFilter(this.mSelectedFilter, true);
			this.headerView.updateBotName(bot.getName());
			this.integrationSummaryView.updateIntegrationViews(bot, integration, this.mServerHostname);
			manager.next();
		}.bind(this);
	},
	renderIntegration: function renderIntegration() {
		return function renderIntegrationBlock(manager) {
			// Update views with integration data
			var bot = botStorage().getBot(this.mCurrentBotId);
			var integration = bot.getIntegrationById(this.mCurrentIntegrationId);
			this.headerView.updateBotName(bot.getName());
			this.integrationSummaryView.updateIntegrationViews(bot, integration, this.mServerHostname);
			manager.next();
		}.bind(this);
	},
	renderCommitsAndIssues: function renderCommitsAndIssues() {
		return function renderCommitsAndIssuesBlock(manager) {
			// Update views with integration data
			var bot = botStorage().getBot(this.mCurrentBotId);
			var integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
			this.integrationSummaryView.updateCommitsViews(integration);
			manager.next();
		}.bind(this);
	},
	renderCommitsAndIssuesForIntegration: function renderCommitsAndIssuesForIntegration() {
		return function renderCommitsAndIssuesForIntegrationBlock(manager) {
			// Update views with integration data
			var bot = botStorage().getBot(this.mCurrentBotId);
			var integration = bot.getIntegrationById(this.mCurrentIntegrationId);
			this.integrationSummaryView.updateCommitsViews(integration);
			manager.next();
		}.bind(this);
	},
	cleanIntegrationViews: function cleanIntegrationViews() {
		return function cleanIntegrationViewsBlock(manager) {
			if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE) {
				this.headerView.clear();
				this.integrationSummaryView.clean();
			}
			manager.next();
		}.bind(this);
	},
	setIntegrationViewsLoading: function setIntegrationViewsLoading() {
		return function setIntegrationViewsLoadingBlock(manager) {
			if (this.mRoutePattern === XCS.WebUI.Routes.SLASH_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_INDEX_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_ROUTE) {
				this.botListView.loading();
			}
			if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE && (this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE)) {
				this.botListView.loadingSubviews();
			}
			if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE) {
				this.integrationSummaryView.loading();
			}
			
			manager.next();
		}.bind(this);
	},
	updateWindowTitle: function updateWindowTitle() {
		// Update window title
		return function updateWindowTitleBlock(manager) {
			if (this.mCurrentBotId) {
				var bot = botStorage().getBot(this.mCurrentBotId);
				var botName = (bot.getName() && bot.getName().escapeHTML().titleCase());
                var integration = null;
				if (this.mCurrentIntegrationId !== null) {
					integration = bot.getIntegrationById(this.mCurrentIntegrationId);
				}
				else {
					integration = bot.getIntegrationFromFilter(this.mSelectedFilter);
				}
				var integrationNumber = null;
				if (integration !== undefined && integration !== null) {
					integrationNumber = integration.getIntegrationNumber();
				}

				if (this.mRoutePattern === XCS.WebUI.Routes.SLASH_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_INDEX_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_ROUTE || (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE && this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern !== XCS.WebUI.Routes.XCODE_BOT_ROUTE)) {
					XCS.RouteHelpers.setBrowserWindowTitle("_XCS.WebUI.WindowTitle.WithBot".loc(this.mSelectedFilter));
				}
				if (this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOT_ROUTE || this.mRoutePattern === XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE) {
					XCS.RouteHelpers.setBrowserWindowTitle("_XCS.WebUI.WindowTitle.WithBotAndIntegration".loc(botName, integrationNumber));
				}
			}
			manager.next();
		}.bind(this);
	},
	// Data
	getUserAuthStatus: function getUserAuthStatus() {
		return function getUserAuthStatusBlock(manager) {
			function loggedInCallback(isLoggedIn) {
				this.headerView.updateUserAuthStatusViews(isLoggedIn);
				manager.next();
			}
			
			function loggedInErrback() {
				logger().error("Could not determine user authentication status");
				manager.next();
			}
			
			xcs_proxy().isLoggedIn(loggedInCallback.bind(this), loggedInErrback.bind(this));
		}.bind(this);
	},
	getServerHostname: function getServerHostname() {
		return function getServerHostnameBlock(manager) {
			function getServerHostnameCallback(inHostname) {
				if (inHostname !== undefined && inHostname !== null) {
					this.mServerHostname = inHostname;
				}
				manager.next();
			}
			
			function getServerHostnameErrback() {
				logger().error("Could not get server hostname");
				manager.next();
			}
			
			xcs_proxy().getServerHostname(getServerHostnameCallback.bind(this), getServerHostnameErrback.bind(this));
		}.bind(this);
	},
	getBots: function getBots(inBotTinyId) {
		return function getBotsBlock(manager) {
			function getBotsErrback() {
				manager.next();
			}
			
			function getBotsCallback(inBots) {
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

				        botStorage().addBot(bot);
					}
				}
				manager.next();
			}
			
			xcs_proxy().getBots(getBotsCallback.bind(this), getBotsErrback.bind(this));
		}.bind(this);
	},
	getFilteredIntegrationForBots: function getFilteredIntegrationForBots(inBotId) {
		return function getFilteredIntegrationsForBotBlock(manager) {
			
			var runningIntegration = null;
			if (inBotId !== undefined) {
				var bot = botStorage().getBot(inBotId);
				if (bot !== undefined && bot !== null) {
					runningIntegration = bot.getRunningIntegration();
				}
			}
			
			function getFilteredIntegrationForBotCallback(inIntegrations) {
				if (inIntegrations !== undefined && inIntegrations !== null) {
					for (var key in botStorage().getBots()) {
						var localBot = botStorage().getBot(key);
						
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
			}
			
			function getFilteredIntegrationForBotErrback() {
				manager.next();
			}
			
			if (runningIntegration === null) {
				switch(this.mSelectedFilter) {
					case XCS.BotFilter.INTEGRATION_FILTER_LATEST:
					default:
						xcs_proxy().getLatestIntegrationForBots(getFilteredIntegrationForBotCallback.bind(this), getFilteredIntegrationForBotErrback);
						break;
					case XCS.BotFilter.INTEGRATION_FILTER_FAILED:
						xcs_proxy().getLatestFailedIntegrationForBots(getFilteredIntegrationForBotCallback.bind(this), getFilteredIntegrationForBotErrback);
						break;
					case XCS.BotFilter.INTEGRATION_FILTER_SUCCEEDED:
						xcs_proxy().getLatestSucceededIntegrationForBots(getFilteredIntegrationForBotCallback.bind(this), getFilteredIntegrationForBotErrback);
						break;
					case XCS.BotFilter.INTEGRATION_FILTER_FLAGGED:
						xcs_proxy().getLatestFlaggedIntegrationForBots(getFilteredIntegrationForBotCallback.bind(this), getFilteredIntegrationForBotErrback);
						break;
				}
			}
			else {
				manager.next();
			}
		}.bind(this);
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
					botView.update(inBot, undefined, true);
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
	hadBots: function() {
		var botViews = this.mSubviews;
		if (botViews.length == 0) {
			return false;
		}
		else {
			return true;
		}
	},
	update: function(inBot, inIntegration, inStep, inPercentage, inRunningIntegrationId) {
		if (inBot instanceof XCS.Bot) {
			for (var i = 0; i < this.mSubviews.length; i++) {
				var botView = this.mSubviews[i];
		
				if (botView.getBot().getId() == inBot.getId()) {
					botView.update(inBot, inIntegration, undefined, inStep, inPercentage, inRunningIntegrationId);
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
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
	initialize: function initialize($super, inBot, inIntegration, inFilter ) {
		$super();
		
		this.mSpinnerTimeout = null;
		this.mLoadingTimeout = null;
		this.mProgressionCircle = null;
		this.mIntermediateProgression = null;
		this.mProgression = null;
		this.mHideProgressionCircleTimeout = null;
		this.mRunningIntegrationId = null;
		this.mCanceledIntegrationId = null;
		this.mIntegrateButtonNode = null;
        this.mIntegration = null;
		
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
	render: function render() {
		var time = "";
		var integrationNumber = "";
		this.mStatus = "";
		if (this.mIntegration !== undefined && this.mIntegration !== null) {
			time = globalLocalizationManager().localizedTimeShift(this.mIntegration.getMostRecentTime());
			integrationNumber = this.mIntegration.getIntegrationNumber();
			if (this.mIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
				this.mStatus = this.mIntegration.getResult();
                this.setUrl();
			}
			else {
				this.mStatus = "loading";
			}
		}
		
		var elem = this.renderTemplate({
			filter: this.mFilter,
			id: this.mBot.getTinyId(),
			name: this.mBot.getName(),
			integrate: "_XCS.BotDetail.BotList.Integrate".loc(),
			integration_number: "_XCS.BotDetail.Summary.IntegrationNumber".loc(integrationNumber),
			time: time,
			waiting: "_XCS.BotDetail.BotList.Waiting".loc()
		});
		
		this.mProgressionCircle = new XCS.WebUI.Views.ProgressionCircle();
		this.mProgressionCircle.forceRender();
		elem.querySelector('.xcs-webui-bot-list-item-integration-progression-circle-container').appendChild(this.mProgressionCircle.mParentElement);
		
		elem.classList.add('empty');
		elem.classList.add('loading');
		
		this.mIntegrateButtonNode = elem.querySelector('.xcs-webui-bot-list-item-integrate-button');
		var progressionContainer = elem.querySelector('.xcs-webui-bot-list-item-integration-progression-container');
		if (browser().isMobile()) {
            this.mIntegrateButtonNode.addEventListener('touchend', this.handleIntegrateHasBeenClicked.bind(this));
            progressionContainer.addEventListener('touchend', this.handleCancelIntegrateHasBeenClicked.bind(this));
		}
		else {
            this.mIntegrateButtonNode.addEventListener('click', this.handleIntegrateHasBeenClicked.bind(this));
            progressionContainer.addEventListener('click', this.handleCancelIntegrateHasBeenClicked.bind(this));
		}

		return elem;
	},
	setSelected: function setSelected(inBool) {
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
	getPlaceholderStringForCurrentFilter: function getPlaceholderStringForCurrentFilter() {
		var currentFilter = application.mWebUIController.mSelectedFilter;
		return "_XCS.BotDetail.BotList.Empty.%@".fmt(currentFilter);
	},
	update: function update(inBot, inIntegration, inShouldNotUpdateIntegration, inStep, inPercentage, inRunningIntegrationId) {
		this.mBot = inBot;
		
		if (inIntegration !== undefined && inIntegration !== null) {
			if (inIntegration.isStepGreaterOrEqualThan(XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED)) {
				this.mIntegration = inIntegration;
				
				if (inStep === undefined && inPercentage === undefined) {
                    var runningIntegration = this.mBot.getRunningIntegration();
                    if (runningIntegration !== null) {
					   this.mProgression = runningIntegration.getCurrentStep();
                    }
                    else {
                        this.mProgression = this.mIntegration.getCurrentStep();
                    }
				}
				
				var time = "";
				var integrationNumber = "";
				time = globalLocalizationManager().localizedTimeShift(inIntegration.getMostRecentTime());
				integrationNumber = inIntegration.getIntegrationNumber();
				this.mIntegrationStatus.update(inIntegration);
	
				this.updateUrl();
				this.updateBotName();
	
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-name').innerHTML = "_XCS.BotDetail.Summary.IntegrationNumber".loc(integrationNumber);
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-time').innerHTML = time;
				// Enable access to summary page
				this.mParentElement.querySelector('a.xcs-webui-bot-list-item-labels-container').setAttribute('href', this.mUrl);
				
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-empty-label').innerHTML = '';
				this.notEmpty();
				this.loaded();
			}
			else {
				this.mRunningIntegrationId = inIntegration.getId();
                
                if (this.mIntegration === null) {
                    this.loading();
                }
                
				if (this.mIntegration === null) {
					this.mProgression = inIntegration.getCurrentStep();
				}
                
                if (inIntegration.getResult() === XCS.Helpers.INTEGRATION_RESULT_CANCELED) {
                    this.mCanceledIntegrationId = inIntegration.getId();
                }
			}
		}
		else {
			if (inShouldNotUpdateIntegration !== undefined && inShouldNotUpdateIntegration) {
				this.updateBotName();
			}
			else {
				// Disable access to summary page
				this.mParentElement.querySelector('a').removeAttribute('href');
				this.mParentElement.querySelector('.xcs-webui-bot-list-item-empty-label').innerHTML = this.getPlaceholderStringForCurrentFilter().loc();
				this.empty();
				this.loaded();
			}
		}
		if (inRunningIntegrationId !== undefined && this.mCanceledIntegrationId === null) {
			this.mRunningIntegrationId = inRunningIntegrationId;
		}
        
		this.updateProgressionCircle(inStep, inPercentage);
	},
	updateUrl: function updateUrl() {
		var aNode = this.mParentElement.querySelector('a.xcs-webui-bot-list-item-labels-container');
		this.setUrl();
		aNode.setAttribute('href', this.mUrl);
	},
	setUrl: function setUrl() {
		if (this.mFilter !== null) {
			this.mUrl = '/xcode/bots/%@/%@'.fmt(this.mFilter.toLowerCase(), this.mBot.getTinyId());
		}
	},
	updateViewForBotSummary: function updateViewForBotSummary() {
		this.mParentElement.classList.remove('xcs-routable');
		this.mParentElement.removeAttribute('data-route-href');
		this.mParentElement.removeAttribute('data-push-state');
		this.mParentElement.querySelector('.xcs-webui-bot-list-item-title-container').remove();
	},
	showProgression: function showProgression() {
		this.mParentElement.classList.add('running');
	},
	hideProgression: function hideProgression() {
		this.mParentElement.classList.remove('running');
		this.setPending(false);
		this.mProgressionCircle.updateValue(0);
	},
	isShowing: function isShowing() {
		return this.mParentElement.classList.contains('running');
	},
	setPending: function setPending(inValue, inShowMessage) {
		if (inValue !== undefined) {
			this.mProgressionCircle.setPending(inValue);
		}
		if (inValue !== undefined && inValue === true && inShowMessage !== undefined && inShowMessage) {
			this.mParentElement.classList.add('pending');
		}
		else {
			this.mParentElement.classList.remove('pending');
		}
	},
	updateBotName: function updateBotName() {
		var botName = ((this.mBot.getName() && this.mBot.getName().escapeHTML()) || "");
		var botTitleNode = this.mParentElement.querySelector('.xcs-webui-bot-list-item-title-label-string');
		if (botTitleNode !== null) {
			botTitleNode.innerHTML = botName;
		}
		this.mParentElement.setAttribute('data-bot-name', botName);
	},
	updateFilter: function updateFilter(inFilter) {
		if (inFilter !== undefined && inFilter !== null) {
			this.mFilter = inFilter;
		}
		this.updateUrl();
	},
	getBot: function getBot() {
		return this.mBot;
	},
	getUrl: function getUrl() {
		return this.mUrl;
	},
	loading: function loading(inImmediate) {
		if (this.mLoadingTimeout !== null) {
			clearTimeout(this.mLoadingTimeout);
			this.mLoadingTimeout = null;
		}
        if (inImmediate !== undefined && inImmediate === true) {
            this.mParentElement.classList.add('loading');
        }
        else {
            this.mLoadingTimeout = setTimeout(function() {
                this.mParentElement.classList.add('loading');
                clearTimeout(this.mLoadingTimeout);
                this.mLoadingTimeout = null;
            }.bind(this), 500);
        }
		
	},
	loaded: function loaded() {
		if (this.mLoadingTimeout !== null) {
			clearTimeout(this.mLoadingTimeout);
			this.mLoadingTimeout = null;
		}
		this.mParentElement.classList.remove('loading');
	},
	isEmpty: function isEmpty() {
		return this.mParentElement.classList.contains('empty');
	},
	empty: function empty() {
		this.mParentElement.classList.add('empty');
	},
	notEmpty: function notEmpty() {
		this.mParentElement.classList.remove('empty');
	},
	updateProgressionCircle: function updateProgressionCircle(inStep, inPercentage) {
		var value = 0;
		var delta = 0;
        
		if (inStep !== undefined && inStep !== null) {
			if (inStep !== this.mProgression) {
				this.mIntermediateProgression = 0;
			}
			this.mProgression = inStep;
		}
		
		switch(this.mProgression) {
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING:
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_PREPARING:
				value = 0;
				delta = 10;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_CHECKOUT:
				value = 10;
				delta = 20;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_BEFORE_TRIGGERS:
				value = 30;
				delta = 10;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_BUILDING:
				value = 40;
				delta = 20;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_TESTING:
				value = 60;
				delta = 10;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_ARCHIVING:
				value = 70;
				delta = 5;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_PROCESSING:
				value = 75;
				delta = 5;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_AFTER_TRIGGERS:
				value = 80;
				delta = 10;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_UPLOADING:
				value = 90;
				delta = 9;
				break;
			case XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED:
				value = 100;
				delta = 0;
				break;
		}
		
		if (inPercentage !== undefined && inPercentage !== null) {
			if (inPercentage > this.mIntermediateProgression) {
				this.mIntermediateProgression = inPercentage;
			}
		}
		value = value + (this.mIntermediateProgression * delta);
		
		if (this.mProgression === XCS.Helpers.INTEGRATION_CURRENT_STEP_COMPLETED) {
			if (this.mHideProgressionCircleTimeout !== null) {
				clearTimeout(this.mHideProgressionCircleTimeout);
				this.mHideProgressionCircleTimeout = null;
			}
			
			if (this.mCanceledIntegrationId === null) {
				if (this.isShowing()) {
					this.mHideProgressionCircleTimeout = setTimeout(function(){
						this.hideProgression();
						this.mProgressionCircle.resetValue();
						this.mCanceledIntegrationId = null;
						this.mRunningIntegrationId = null;
					}.bind(this), 700);
					this.mProgressionCircle.setValue(value);
				}
				else {
					this.hideProgression();
					this.mProgressionCircle.resetValue();
					this.mCanceledIntegrationId = null;
					this.mRunningIntegrationId = null;
				}
			}
			else {
				if (this.mRunningIntegrationId == this.mCanceledIntegrationId) {
					this.hideProgression();
					this.mRunningIntegrationId = null;
				}
				else {
					this.showProgression();
					this.setPending(true);
				}
				
				this.mProgressionCircle.resetValue();
				this.mCanceledIntegrationId = null;
			}
			
		}
		else {
			if (inStep == XCS.Helpers.INTEGRATION_CURRENT_STEP_PENDING) {
				this.mProgressionCircle.resetValue();
				this.showProgression();
				this.setPending(true, true);
			} 
			else if (this.mCanceledIntegrationId !== null) {
				this.mProgressionCircle.resetValue();
				value = 0;
				this.mIntermediateProgression = 0;
				if (this.mCanceledIntegrationId !== null && this.mRunningIntegrationId !== null && this.mRunningIntegrationId !== true && this.mRunningIntegrationId == this.mCanceledIntegrationId) {
					this.hideProgression();
				}
				else {
					this.setPending(true, true);
				}
			}
			else {
				this.setPending(false);
                
                if (inStep === undefined && inPercentage === undefined && this.mIntegration === null) {
				    this.hideProgression();
                    this.mProgressionCircle.resetValue();
                }
                else {
                    this.showProgression();
				    this.mProgressionCircle.setValue(value);
                }
			}
			clearTimeout(this.mHideProgressionCircleTimeout);
			this.mHideProgressionCircleTimeout = null;
		}
		
		this.mIntegrateButtonNode.classList.add('show');
	},
	handleIntegrateHasBeenClicked: function handleIntegrateHasBeenClicked() {
		globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_INTEGRATE_NOW_HAS_BEEN_CLICKED, this, {botId: this.mBot.getId()});
		this.mProgressionCircle.resetValue();
		this.mRunningIntegrationId = true;
		this.showProgression();
		this.setPending(true, true);
	},
	handleCancelIntegrateHasBeenClicked: function handleCancelIntegrateHasBeenClicked() {
		if (this.mRunningIntegrationId !== null && this.mCanceledIntegrationId === null) {
			globalNotificationCenter().publish(XCS.WebUI.NOTIFICATION_CANCEL_INTEGRATION_HAS_BEEN_CLICKED, this, {integrationId: this.mRunningIntegrationId});
			this.mCanceledIntegrationId = this.mRunningIntegrationId;
			this.hideProgression();
		}
	}
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
            elem.addEventListener('touchend', this.handleContainerHasBeenClicked.bind(this));
            this.mFlag.addEventListener('touchend', this.handleFlagButtonHasBeenClicked.bind(this));
            profileBadge.addEventListener('touchend', this.handleInstallProfileHasBeenClicked.bind(this));
            downloadBadge.addEventListener('touchend', this.handleInstallHasBeenClicked.bind(this));
			
			if (browser().isiPad()) {
				elem.style.display = 'none';
			}
		}
		else {
            elem.addEventListener('click', this.handleContainerHasBeenClicked.bind(this));
            this.mFlag.addEventListener('click', this.handleFlagButtonHasBeenClicked.bind(this));
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
			
			this.mParentElement.querySelector('#xcs-webui-integration-build-download-logs').setAttribute('href', '/xcode/internal/api/integrations/%@/assets'.fmt(this.mIntegration.getId()));
			this.mParentElement.querySelector('#xcs-webui-integration-build-open-xcode').setAttribute('href', 'xcbot://%@/botID/%@/integrationID/%@'.fmt(inServerHostname, this.mIntegration.getBotId(), this.mIntegration.getId()));
			
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
				downloadLogs.setAttribute('href', '/xcode/internal/api/integrations/%@/assets'.fmt(this.mIntegration.getId()));
				downloadLogs.classList.add('show');
				openInXcode.setAttribute('href', 'xcbot://%@/botID/%@/integrationID/%@'.fmt(inServerHostname, this.mIntegration.getBotId(), this.mIntegration.getId()));
				openInXcode.classList.add('show');
				
				if (this.mIntegration.hasArchive()) {
					archiveNode.setAttribute('href', '/xcode/internal/api/assets/%@'.fmt(this.mIntegration.getArchiveRelativePath()));
					archiveNode.classList.add('show');
				}
				else {
					archiveNode.removeAttribute('href');
					archiveNode.classList.remove('show');
				}
				if (this.mIntegration.hasProduct()) {
					productNode.setAttribute('href', '/xcode/internal/api/assets/%@'.fmt(this.mIntegration.getProductRelativePath()));
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
				window.location = '/xcode/internal/api/profiles/ota.mobileconfig';
			}
			else {
				this.disableInstallButton();
				alert("_XCS.BotDetail.Summary.HostnameInstallAlert".loc(this.mServerHostname));
			}
		}
	},
	handleInstallHasBeenClicked: function(inEvent) {
		var integrationId = this.mIntegration.getId();
		var ipaUrl = '/xcode/internal/api/integrations/%@/install_product'.fmt(integrationId);
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
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
    mFilterNode: null,
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
		this.mFilterNode = elem.querySelector('#xcs-webui-header-filter-label-container');
		
		if (browser().isMobile()) {
            signOutNode.addEventListener('touchend', this.handleSignOutHasBeenClicked);
            signInNode.addEventListener('touchend', this.handleSignInHasBeenClicked);
            this.mFilterNode.addEventListener('touchend', this.handleFilterHasBeenClicked.bind(this));
		}
		else {
            signOutNode.addEventListener('click', this.handleSignOutHasBeenClicked);
            signInNode.addEventListener('click', this.handleSignInHasBeenClicked);
            this.mFilterNode.addEventListener('click', this.handleFilterHasBeenClicked.bind(this));
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
					this.showBotListHeader();
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
	showBotListHeader: function() {
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
    showFilterNode: function showFilterNode() {
        this.mFilterNode.classList.add('show');
    },
    hideFilterNode: function hideFilterNode() {
        this.mFilterNode.classList.remove('show');
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
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
            cancelButton.addEventListener('touchend', this.handleCancelButtonHasBeenClicked.bind(this));
            elem.addEventListener('touchend', this.handleContainerHasBeenClicked.bind(this));
			
			if (browser().isiPad()) {
				elem.style.display = 'none';
			}
		}
		else {
            cancelButton.addEventListener('click', this.handleCancelButtonHasBeenClicked.bind(this));
            elem.addEventListener('click', this.handleContainerHasBeenClicked.bind(this));
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
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
// 
// IMPORTANT NOTE: This file is licensed only for use on Apple-branded
// computers and is subject to the terms and conditions of the Apple Software
// License Agreement accompanying the package this file is a part of.
// You may not port this file to another platform without Apple's written consent.
//
// IMPORTANT NOTE: This file is licensed only for use with the Wiki Server feature
// of the Apple Software and is subject to the terms and conditions of the Apple
// Software License Agreement accompanying the package this file is part of.

XCS.WebUI.Views.PlaceholderView = Class.create(XCS.Mvc.View, {
	initialize: function initialize($super) {
		$super();
		this.mTemplate = this.getTemplate('placeholder');
	},
	render: function render() {
		return this.renderTemplate({});
	},
    updateMessages: function setMessage(inFirstLine, inSecondLine) {
        if (inFirstLine !== undefined && inFirstLine !== null) {
            this.mParentElement.querySelector('#xcs-webui-no-bots-first-line').innerHTML = inFirstLine.escapeHTML();
        }
        if (inSecondLine !== undefined && inSecondLine !== null) {
            this.mParentElement.querySelector('#xcs-webui-not-bots-create-new-bot').innerHTML = inSecondLine.escapeHTML();
        }
    },
    showLink: function showLink() {
        this.mParentElement.querySelector('#xcs-webui-not-bots-create-new-bot-link').classList.add('show');
    },
    hideLink: function hideLink() {
        this.mParentElement.querySelector('#xcs-webui-not-bots-create-new-bot-link').classList.remove('show');
    }
});
// Copyright (c) 2009-2015 Apple Inc. All Rights Reserved.
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
XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE = "/xcode/bots/:botTinyId/integrations/:integrationTinyId" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOT_ROUTE = "/xcode/bots/:filter/:botTinyId" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD = "/xcode/bots/:filter/:botTinyId/.*" + XCS.Routes.TrailingSlashOptionalQueryParam;
XCS.WebUI.Routes.XCODE_BOT_TEST_ROUTE = "";

XCS.WebUI.Routes.NOTIFICATION_MENU_ITEM_CLICKED = "NOTIFICATION_MENU_ITEM_CLICKED";

XCS.WebUI.Application = Class.create(XCS.Application, {
	mApplicationIdentifier: "xcs",
	mWebUIController: null,
	createApplication: function($super) {
		$super();
		
		this.mActivityStream = new XCS.ActivityStream.Socket();

		this.mWebUIController = new XCS.WebUI.WebUIController();
		
		// update body classes based on browser
		browser().addBrowserVersionToBodyTag();

		// Route the initial request.
		this.routeInitialRequest();
	},
	webUIControllerRoute: function(inRouteInvocation) {
		if (inRouteInvocation !== undefined && inRouteInvocation.namedMatches) {
			var namedMatched = inRouteInvocation.namedMatches;
			var originalRoutePattern = inRouteInvocation.originalRoutePattern;
			var params = {
				botTinyId: undefined,
				filter: undefined,
				integrationTinyId: undefined
			};
			
			if (namedMatched.botTinyId !== undefined) {
				params.botTinyId = namedMatched.botTinyId;
			}
			if (namedMatched.filter !== undefined) {
				params.filter = namedMatched.filter;
			}
			if (namedMatched.botTinyId !== undefined && namedMatched.integrationTinyId) {
				params.botTinyId = namedMatched.botTinyId;
				params.integrationTinyId = namedMatched.integrationTinyId;
			}
			this.mWebUIController.load(params, originalRoutePattern);
		}
		
		this.mWebUIController.configure(inRouteInvocation);
	},
	computeRoutes: function() {
		var routes = [
			[XCS.WebUI.Routes.SLASH_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_INDEX_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOTS_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOTS_FILTER_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOT_ROUTE_WILDCARD, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOTS_INTEGRATION_ROUTE, this.webUIControllerRoute.bind(this)],
			[XCS.WebUI.Routes.XCODE_BOT_ROUTE, this.webUIControllerRoute.bind(this)]
		];
        
        if (typeof(testEnv) !== "undefined" && testEnv === true) {
            routes.push([XCS.WebUI.Routes.XCODE_BOT_TEST_ROUTE, this.webUIControllerRoute.bind(this)]);
        }
        
        return routes;
	}
});

// Warn about disabled cookies.
if (!navigator.cookieEnabled) {
	alert("_Cookies.NoCookiesUnsupported".loc());
}

// Called once the document object is available.

var d;
document.observe('dom:loaded', function() {
	d = document;
	// Signal any shared instances and delegates to be created.
	globalNotificationCenter().publish('PAGE_INITIALIZE_FINISHED', document);
});

if (typeof(testEnv) === "undefined") {
    var application = new XCS.WebUI.Application();
}

;

