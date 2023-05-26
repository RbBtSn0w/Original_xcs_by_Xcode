function (doc) {
  if (doc.doc_type === 'file') {
    if (doc.xcsunittest) {
      emit([doc.xcsunittest, doc.integrationID], null);
    }
    emit(doc.integrationID, null);

    if (doc.types) {
      doc.types.forEach(function (type) {
        if (doc.xcsunittest) {
          emit([doc.xcsunittest, doc.integrationID, type], null);
        }
        emit([doc.integrationID, type], null);
      });
    }
  }
}
