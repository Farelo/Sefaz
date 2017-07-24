const fs               = require('fs');
const glob             = require('glob');
const YAML             = require('js-yaml');
const extendify        = require('extendify');
const swagger_files    = require('./config.swagger')


  const contents = swagger_files.map(f => {
    console.log(f);
    return YAML.load(fs.readFileSync(f).toString());
  });

  const extend = extendify({
    inPlace: false,
    isDeep: true
  });

  const merged = contents.reduce(extend);
  console.log("Generating swagger.yaml, swagger.json");
  fs.existsSync("api/swagger") || fs.mkdirSync("api/swagger");
  fs.writeFile("api/swagger/swagger.yaml", YAML.dump(merged));
  fs.writeFile("api/swagger/swagger.json", JSON.stringify(merged, null, 2));
