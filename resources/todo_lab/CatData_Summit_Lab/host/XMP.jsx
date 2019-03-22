function XMPAdapter() {
    'use strict';
    var xmpFile, xmpMeta;
    // TODO: Lesson 3.2 - Load the XMP Script library

    // Review: Lesson 3.5
    var getArrayItems = function (namespace, property) {
        if (xmpMeta) {
            // Get a count of items in an array property
            var cnt = xmpMeta.countArrayItems(namespace, property);
            var objArr = [];
            if (cnt > 0) {
                // Note: Starting Index of an array is 1 not 0;
                for (var i = 1; i <= cnt; i++) {
                    // Retrieve an array item at a specified index
                    arrItem = xmpMeta.getArrayItem(namespace, property, i);
                    // Check for nested Structure object
                    if (arrItem && arrItem.options & XMPConst.PROP_IS_STRUCT) {
                        var obj = getStructObj(namespace, property + "[" + i + "]")
                        objArr.push(obj);
                    } else {
                        objArr.push(arrItem.toString());
                    }
                }
                return objArr;
            }
        }
    }

    // Review: Lesson 3.6
    var getStructObj = function (namespace, property) {

        var obj = {},
            iter = xmpMeta.iterator(XMPConst.JUST_CHILDREN, namespace, property),
            item = iter.next();
        while (item) {
            if (item.value) {
                // Contructing JSON object by parsing propertyName from Path
                var propertyName = (item.path).match(/(\w+)$/g)[0]
                // Check to make sure property value is not an array
                if (item.options & XMPConst.PROP_IS_ARRAY) {
                    obj[propertyName] = getArrayItems(namespace, propertyName);
                } else {
                    obj[propertyName] = item.value;
                }
            }
            item = iter.next()
        }
        return obj;
    }

    XMPAdapter.prototype.open = function (filename) {
        if (filename) {
            // TODO: Lesson 3.3 - Open file for modifiy/update

            // TODO: Lesson 3.3 - Get the XMP data

        }
    }

    XMPAdapter.prototype.get = function (namespace, property) {
        if (xmpMeta) {
            //TODO: Lesson 3.4 - Get property value

            if (prop !== undefined) {
                // TODO: Lesson 3.4 - Check if property value is an array
                if (...) {
                    var items = getArrayItems(namespace, property);
                    return items;
                } else {
                    return prop.toString();
                }
            }
        }
    }

    XMPAdapter.prototype.set = function (namespace, prefix, property, value) {
        if (xmpMeta) {
            // TODO: Lesson 3.7 - Register XMP Namespace and prefix

            if (Object.prototype.toString.call(value) === '[object Array]') {
                if (xmpMeta.doesPropertyExist(namespace, property)) {
                    xmpMeta.deleteProperty(namespace, property);
                }
                // TODO: Lesson 3.7 - Create Empty Array type property

                //Append Array Items to the Property
                for (var i = 0; i < value.length; i++) {
                    // TODO: Lesson 3.7 - Append an item to an array property

                }
            } else {
                // TODO: Lesson 3.7 - Set string type value to the property

            }
        }
    }

    XMPAdapter.prototype.commit = function () {
        if (xmpFile && xmpMeta) {
            // TODO: Lesson 3.8 - Commit the changes and save back XMPMeta.

        }
    }

    XMPAdapter.prototype.close = function () {
        if (xmpFile) {
            // TODO: Lesson 3.9 - Close opened file

            xmpFile = undefined;
            xmpMeta = undefined;
        }
    }

}

//helper functions to help us bridge CEP with our custom XMP adapter.
function XMPCEPHelper() {}

// Review: Lesson 4.2 - Get XMP for CEP
XMPCEPHelper.getXMP = function (args) {
    var filename = args.filename,
        namespace = args.namespace,
        property = args.property;
    var xmp = new XMPAdapter();
    xmp.open(filename);
    var result = xmp.get(namespace, property);
    xmp.close();
    if (result !== undefined) {
        return JSON.stringify(result);
    }
}
// Review: Lesson 4.3 - Set XMP for CEP
XMPCEPHelper.setXMP = function (args) {
    var filename = args.filename,
        namespace = args.namespace,
        prefix = args.prefix,
        property = args.property,
        value = args.value;

    var xmp = new XMPAdapter();
    xmp.open(filename);
    xmp.set(namespace, prefix, property, value);
    xmp.commit();
    xmp.close();
}
