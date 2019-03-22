// Load Plugplug Lib for CSXSEvent
if (xLib === undefined) {
    var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
}

var dispatchCepEvent = function (in_eventType, in_message) {
    if (xLib) {
        var eventObj = new CSXSEvent();
        eventObj.type = in_eventType;
        eventObj.data = in_message;
        eventObj.dispatch();
    }
}

var onSelectedThumb = function (event) {
    if (event.object instanceof Document && event.type == "selectionsChanged") {
        var doc = event.object
        var thumb = doc.selections[0];
        if (thumb !== undefined && thumb.hasMetadata) {
            var filename = thumb.spec.fsName;
            dispatchCepEvent("cep.extendscript.event.selectedEvent", filename);
        }
    }
}

app.eventHandlers = []
app.synchronousMode = true;
app.eventHandlers.push({
    handler: onSelectedThumb
});
