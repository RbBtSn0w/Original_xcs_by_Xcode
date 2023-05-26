function(doc) {
    if (doc.doc_type == 'integration' && doc.currentStep == 'completed' && !doc.assetsPruned) {
        emit([doc.bot._id, doc.bot.name, doc.number], 1);
    }
}
