function (doc) {
    if (doc.doc_type == 'file') {
        var hasVariant = doc.variantIds ? 1 : 0;
        if (doc.productID) {
            emit([doc.integrationID, hasVariant, doc.productID, 1], null);
        } else if (doc.fileName.lastIndexOf('.ipa') == (doc.fileName.length - 4)) {
            emit([doc.integrationID, hasVariant, doc._id, 0], null);
        }
    }
}