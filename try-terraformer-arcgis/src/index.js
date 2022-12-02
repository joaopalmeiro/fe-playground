// https://blog.logrocket.com/reading-writing-json-files-nodejs-complete-tutorial/
// https://github.com/terraformer-js/terraformer/tree/main/packages/arcgis#terraformergeojsontoarcgisgeojson-idattribute--object
// https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
// https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options
// https://github.com/chris48s/arcgis2geojson/

const { readFileSync, writeFileSync } = require('fs');
const { geojsonToArcGIS } = require('@terraformer/arcgis');

const GEOJSON_PATH = './geo.json';

const geoJsonData = JSON.parse(readFileSync(GEOJSON_PATH));
// console.log(geoJsonData);

const esriJsonData = geojsonToArcGIS(geoJsonData);
console.log(esriJsonData);

writeFileSync('./esri.json', JSON.stringify(esriJsonData));
