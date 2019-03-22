function XMPAdapter() {
    'use strict';
    var xmpFile, xmpMeta;
    // Load the XMP Script library
    if (xmpLib === undefined) {
        var xmpLib = new ExternalObject("lib:AdobeXMPScript");
    }
    //private
    var getStructObj = function (namespace, property) {
        var obj = {},
            iter = xmpMeta.iterator(XMPConst.JUST_CHILDREN, namespace, property),
            item = iter.next();
        while (item) {
            if (item.value) {
                var propertyName = (item.path).match(/(\w+)$/g)[0]
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
    //private
    var getArrayItems = function (namespace, property) {
        if (xmpMeta) {
            var cnt = xmpMeta.countArrayItems(namespace, property);
            var objArr = [];
            if (cnt > 0) {
                for (var i = 1; i <= cnt; i++) {
                    arrItem = xmpMeta.getArrayItem(namespace, property, i);
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
    //public
    XMPAdapter.prototype.open = function (filename) {
        if (filename) {
            // Open file for modifiy/update
            xmpFile = new XMPFile(filename, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE);
            // Get the XMP data
            xmpMeta = xmpFile.getXMP();
        }
    }
    //public
    XMPAdapter.prototype.get = function (namespace, property) {
        if (xmpMeta) {
            //Get property value
            var prop = xmpMeta.getProperty(namespace, property);
            if (prop !== undefined) {
                //Check if property value is an array
                if (prop.options & XMPConst.PROP_IS_ARRAY) {
                    var items = getArrayItems(namespace, property);
                    return items;
                } else {
                    return prop.toString();
                }
            }
        }
    }
    //public
    XMPAdapter.prototype.set = function (namespace, prefix, property, value) {
        if (xmpMeta) {
            //In order to write, Namespace URI and Prefix must be register for a given file.
            //You cannot write property if Namespace is not register in the file.
            XMPMeta.registerNamespace(namespace, prefix);
            if (Object.prototype.toString.call(value) === '[object Array]') {
                if (xmpMeta.doesPropertyExist(namespace, property)) {
                    xmpMeta.deleteProperty(namespace, property);
                }
                //Create Empty Property with Array Type
                xmpMeta.setProperty(namespace, property, null, XMPConst.PROP_IS_ARRAY);
                //Append Array Items to the Property
                for (var i = 0; i < value.length; i++) {
                    xmpMeta.appendArrayItem(namespace, property, value[i]);
                }
            } else {
                //if simple value, use setProperty
                xmpMeta.setProperty(namespace, property, value);
            }
        }
    }
    //public
    XMPAdapter.prototype.commit = function () {
        if (xmpFile && xmpMeta) {
            //commit the change, save back XMPMeta.
            xmpFile.putXMP(xmpMeta);
        }
    }
    //public
    XMPAdapter.prototype.close = function () {
        if (xmpFile) {
            //close
            xmpFile.closeFile();
            xmpFile = undefined;
            xmpMeta = undefined;
        }
    }

}

//helper functions to help us bridge CEP with our custom XMP adapter.
function XMPCEPHelper() {}

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
