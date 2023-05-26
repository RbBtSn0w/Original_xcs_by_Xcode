function(doc) {
    if ((doc.doc_type == 'integration') && (doc.currentStep != 'completed') && (doc.currentStep != 'pending') && (doc.bot._id)) {
        value = {
            bot: {
                _id: doc.bot._id
            },
            _id: doc._id,
            number: doc.number,
            currentStep: doc.currentStep
        };
        if (doc.xcsunittest) {
            if (doc.bot._id) {
                emit([doc.xcsunittest, doc.bot._id], value);
            }
        } else {
            if (doc.bot._id) {
                emit(doc.bot._id, value);
            }
        }
    }
}
