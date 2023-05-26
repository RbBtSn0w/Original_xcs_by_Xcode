function(doc) {
    if (doc.doc_type == 'integration' && doc.currentStep == 'completed' && !doc.assetsPruned) {
		emit(doc.bot._id,{"_id": doc._id,"result": doc.result,"number": doc.number,"bot":{"_id": doc.bot._id,"name": doc.bot.name}});
    }
}