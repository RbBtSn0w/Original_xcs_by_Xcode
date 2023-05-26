function (doc) {
  if (doc.doc_type === 'file') {
    if (doc.xcsunittest) {
      emit([doc.xcsunittest, doc.relativePath], null);
    }
    emit(doc.relativePath, null);
  }
}
