const uiFields = [{
        "fieldID": "cat_name",
        "namespace": "http://cat.adobe.com",
        "prefix": "cat",
        "property": "name"
    },
    {
        "fieldID": "cat_breed",
        "namespace": "http://cat.adobe.com",
        "prefix": "cat",
        "property": "breed"
    },
    {
        "fieldID": "cat_age",
        "namespace": "http://cat.adobe.com",
        "prefix": "cat",
        "property": "age"
    },
    {
        "fieldID": "cat_gender",
        "namespace": "http://cat.adobe.com",
        "prefix": "cat",
        "property": "gender"
    }
];
var currentFilename = "";


function getXMPfromJSX(paramObj) {
    // TODO: Lesson 4.4 - function to retrieve XMP from JSX
}


function setXMPfromJSX(paramObj) {
    // TODO: Lesson 4.5 - function to set XMP from JSX
}

/* Populate UI Fields with XMP Data */
function populateXMPFields() {
    $("#img_thumb").attr("src", currentFilename);

    // Review - Lesson 5.3 - Get XMP Value for Editable Fields
    for (let field of uiFields) {
        let params = {
            filename: currentFilename,
            namespace: field.namespace,
            property: field.property
        }
        getXMPfromJSX(params).then(result => {
            if (_.isEmpty(result) === false) {
                $(`#${field.fieldID}`).val(JSON.parse(result));
            } else {
                $(`#${field.fieldID}`).val("");
            }
        })
    }

    // Review - Lesson 5.4 - Get Latitude and Longitude from EXIF GPS Data
    let gpsLat = getXMPfromJSX({
        filename: currentFilename,
        namespace: "http://ns.adobe.com/exif/1.0/",
        property: "GPSLatitude"
    });

    let gpsLong = getXMPfromJSX({
        filename: currentFilename,
        namespace: "http://ns.adobe.com/exif/1.0/",
        property: "GPSLongitude"
    });

    Promise.all([gpsLat,gpsLong]).then(results => {
        if (!_.isEmpty(results) && results.length == 2) {
            let ddLat = MapHelper.convertDDMtoDD(JSON.parse(results[0])),
                ddLong = MapHelper.convertDDMtoDD(JSON.parse(results[1]));
            console.log(`Lat: ${ddLat} | Long: ${ddLong}`);
            MapHelper.setLeafletMap('mapid', ddLat, ddLong, true);
        }
    });

    // Review - Lesson 5.5 - Get predictedTags from DAM namespace
    getXMPfromJSX({
        filename: currentFilename,
        namespace: "http://www.day.com/dam/1.0",
        property: "predictedTags"
    }).then(result => {
        if (_.isEmpty(result) === false) {
            //get the first 10 predicted tags
            let tags = JSON.parse(result).slice(0, 10)
            for (let tag of tags) {
                $("#predictedTags").val($("#predictedTags").val() + `${tag.predictedTagName} - ${(tag.predictedTagConfidence * 100).toFixed(2)}%\n`);
            }
        } else {
            $("#predictedTags").val("");
        }
    });
}

// Review - Lesson 5.6 - Save button to set XMP
function save() {
    if (!_.isEmpty(currentFilename)) {
        for (let field of uiFields) {
            let value = $(`#${field.fieldID}`).val();
            if (_.isEmpty(value) === false) {
                let params = {
                    filename: currentFilename,
                    namespace: field.namespace,
                    prefix: field.prefix,
                    property: field.property,
                    value: value
                }
                setXMPfromJSX(params);
            }
        }
    }
}

$(document).ready(() => {
    let csInterface = new CSInterface()
    //load JSON library into JSX. JSX does not have native support for JSON so we have to load it.
    JSXHelper.loadJSX("json2.js");

    // TODO: Lesson 2.6 - Add EventListener for Dispatch File Select Event from Startup Script
        // TODO: Lesson 5.2 - If Select Event Detected retrieve and populate XMP
});