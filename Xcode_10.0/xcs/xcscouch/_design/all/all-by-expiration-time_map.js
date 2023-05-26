function(doc) {
  	if (doc.willExpire) {
  		emit([doc.willExpire], {_id:doc._id,_rev:doc._rev});
	}
}