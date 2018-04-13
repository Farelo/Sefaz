'use strict';

const fs               = require('fs');
const glob             = require('glob');
const YAML             = require('js-yaml');
const extendify        = require('extendify');


glob("api/swagger/index.yaml", function(er, files) {
  const index = files;
  glob("api/swagger/paths/*.yaml", function(er, files) {
    const paths = files;
    glob("api/swagger/definitions/*.yaml", function(er, files) {
      const definitions = files;
      let contents = index.concat(paths).concat(definitions);
      contents = contents.map(f => {
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
      fs.writeFileSync("api/swagger/swagger.yaml", YAML.dump(merged));
      fs.writeFileSync("api/swagger/swagger.json", JSON.stringify(merged, null, 2));

    });
  });
});
