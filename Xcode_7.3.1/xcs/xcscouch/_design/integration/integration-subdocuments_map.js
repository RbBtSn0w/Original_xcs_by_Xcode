function(doc) {
    if (doc.integrationSubDocUUID) {
        emit(doc.integrationSubDocUUID, null);
    }
}
