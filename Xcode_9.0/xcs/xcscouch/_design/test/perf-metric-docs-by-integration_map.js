function(doc) {
    if ((doc.doc_type == 'perfMetricKeyPaths') || (doc.doc_type == 'perfMetricNames') || (doc.doc_type == 'testedDevices') || (doc.doc_type == 'testHierarchy')) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.integrationSubDocUUID], null);
        } else {
  			emit([doc.integrationSubDocUUID], null);
        }
    }
}