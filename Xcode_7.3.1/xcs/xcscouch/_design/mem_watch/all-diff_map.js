function(doc) {
	if (doc.doc_type == 'mw_diff') {
		if (doc.heap_diff.change.size_bytes > 0) {
			var value = Array.concat([doc.doc_type], doc.date);
			var obj = {};
			obj.url = doc.url;
			obj.change_size_bytes = doc.heap_diff.change.size_bytes;
			obj.change_size = doc.heap_diff.change.size;
			obj.dateISO8601 = doc.dateISO8601;

			var details = doc.heap_diff.change.details;
			var max_obj = undefined;

			for (var detail in details) {
				var detailObj = details[detail];
				if (undefined == max_obj) {
					max_obj = detailObj;
				} else {
					if (detailObj.size_bytes > max_obj.size_bytes) {
						max_obj = detailObj;
					}
				}
			}

			obj.max_obj = max_obj;

			if (max_obj.size_bytes > 0) {
				emit(value, obj);
			}
		}
	}
}
