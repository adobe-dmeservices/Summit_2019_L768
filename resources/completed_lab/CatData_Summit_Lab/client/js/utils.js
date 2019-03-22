function MapHelper() {}
MapHelper.map;
/* Helper function to convert Degrees Decimal Minutes (DDM) to Decimal Degrees (DD) */
MapHelper.convertDDMtoDD = (ddm) => {
    let parseDDM = ddm.split(','),
        degree = parseDDM[0],
        minute = parseDDM[1].slice(0, -2),
        direction = parseDDM[1].slice(-1),
        dd = parseInt(degree) + (parseFloat(minute) / 60);
    if (direction === "S" || direction === "W") {
        dd = dd * -1;
    }
    return dd;
}

MapHelper.setLeafletMap = (mapContainer, lat, long, pin = false) => {
    let map = MapHelper.map
    if (map !== undefined) {
        map.remove();
    }
    map = L.map(mapContainer).setView([lat, long], 10)
    map.scrollWheelZoom.disable()
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    if (pin === true) {
        const marker = L.marker([lat, long]).addTo(map);
    }
    MapHelper.map = map;
}

function JSXHelper() {}
/* Helper function to Load JSX */
JSXHelper.loadJSX = (fileName) => {
    let csInterface = new CSInterface()
    let extensionRoot = `${csInterface.getSystemPath(SystemPath.EXTENSION)}/host/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}${fileName}")`);
}

/* Helper function to create and return a promise object */
JSXHelper.runEvalScript = (script) => {
    let csInterface = new CSInterface()
    return new Promise((resolve, reject) => {
        csInterface.evalScript(script, resolve);
    });
}
