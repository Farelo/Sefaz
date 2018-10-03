const fs = require('fs');
const glob = require('glob-promise');
const YAML = require('js-yaml');
const extendify = require('extendify');

async function compileSwagger() {
  try {
    const index = await glob('api/swagger/index.yaml');

    const paths = await glob('api/swagger/paths/*.yaml');

    const definitions = await glob('api/swagger/definitions/*.yaml');

    let contents = index.concat(paths).concat(definitions);

    contents = contents.map(f => YAML.load(fs.readFileSync(f).toString()));

    const extend = extendify({
      inPlace: false,
      isDeep: true,
    });

    const merged = contents.reduce(extend);
    console.log('Generating swagger.yaml, swagger.json');
    // fs.writeFileSync('api/swagger/swagger.yaml', YAML.dump(merged));
    fs.writeFileSync('api/swagger/swagger.json', JSON.stringify(merged, null, 2));
  } catch (error) {
    return 'Erro na Criação da documentação do Swagger';
  }

  return 'Criação da documentação do Swagger';
}

compileSwagger().then(() => console.log("compileSwagger"))

module.exports = {
  compileSwagger,
};
