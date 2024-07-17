const fs = require('fs');
const path = require('path');

const prismaSchemaPath = path.join(__dirname, 'prisma/schema.prisma');
const modelsOutputPath = path.join(__dirname, 'src/utils/shared/shared-types/prisma-models.ts');
const enumsOutputPath = path.join(__dirname, 'src/utils/shared/shared-types/prisma-enums.ts');

const schemaContent = fs.readFileSync(prismaSchemaPath, 'utf-8');

const modelPattern = /model\s+(\w+)\s+{([^}]+)}/g;
const enumPattern = /enum\s+(\w+)\s+{([^}]+)}/g;

// List of basic TypeScript types
const tsTypes = ['String', 'Int', 'Boolean', 'Float', 'DateTime', 'number', 'string', 'boolean', 'Date'];

const getModelNames = (schema) => {
  let match;
  const modelNames = [];

  while ((match = modelPattern.exec(schema)) !== null) {
    const [_, modelName] = match;
    modelNames.push(modelName);
  }
  return modelNames;
};

const parseFields = (fieldsBlock, enums, modelNames, withRelations) => {
  const fields = fieldsBlock.trim().split('\n');
  return fields.map(field => {
    const parts = field.trim().split(/\s+/);
    if (parts.length < 2 || parts[0] == 'password') return null;

    const [name, type] = parts;
   
    let tsType = type.replace('Int', 'number')
      .replace('String', 'string')
      .replace('Boolean', 'boolean')
      .replace('Float', 'number')
      .replace('DateTime', 'Date');

    // Handle optional and array types
    let optional = false;
    if (tsType.endsWith('?')) {
      tsType = tsType.slice(0, -1);
      optional = true;
    } else if (tsType.endsWith('[]')) {
      tsType = `${tsType.slice(0, -2)}[]`;
    }

    // If the type is an enum and not a built-in type, import it from prisma-enums
    if (enums.includes(type) && type !== 'Date') {
      tsType = `${type}`;
    } else if (modelNames.includes(type.replace('?', '').replace('[]', ''))) {
      if (withRelations) {
        tsType = `IDB${type.replace('?', '').replace('[]', '')}${tsType.includes('[]') ? '[]' : ''}`;
      } else {
        return null;
      }
    }

    if(withRelations)
    return `  ${name}${optional ? '?' : ''}: ${tsType};`;
    return `  ${name}: ${tsType} ${optional ? ' | null' : ''};`;

  }).filter(Boolean).join('\n');
};

const generateModels = (schema, enums, modelNames) => {
  let models = '';
  let match;
  const imports = new Set();

  while ((match = modelPattern.exec(schema)) !== null) {
    const [_, modelName, fieldsBlock] = match;
    const fields = parseFields(fieldsBlock, enums, modelNames, false);
    const fieldsWithRelations = parseFields(fieldsBlock, enums, modelNames, true);

    fieldsWithRelations.match(/:\s+I?([A-Z]\w*)/g)?.forEach(enumMatch => {
      const enumName = enumMatch.split(': ')[1];
      if (enumName !== 'Date' && enums.includes(enumName)) {
        imports.add(enumName);
      }
    });

    models += `export interface IDB${modelName} {\n${fields}\n}\n\n`;
    models += `export interface IDB${modelName}WithRelations {\n${fieldsWithRelations}\n}\n\n`;
  }

  // const importsStr = [...imports].map(enumName => `import { ${enumName} } from './prisma-enums';`).join('\n');
  const importsStr = `import { ${[...imports].map(enumName => enumName).join(',') } } from '@prisma/client';`;
  return `${importsStr}\n\n${models}`;
};

const generateEnums = (schema) => {
  let enums = '';
  let enumNames = [];
  let match;

  while ((match = enumPattern.exec(schema)) !== null) {
    const [_, enumName, enumValuesBlock] = match;
    enumNames.push(enumName);
    const values = enumValuesBlock.trim().split('\n').map(value => {
      const enumValue = value.trim();
      return `  ${enumValue} = "${enumValue}",`;
    }).join('\n');
    enums += `export enum ${enumName} {\n${values}\n}\n\n`;
  }

  return { enums, enumNames };
};

const { enums, enumNames } = generateEnums(schemaContent);
const modelNames = getModelNames(schemaContent);
const models = generateModels(schemaContent, enumNames, modelNames);

fs.writeFileSync(modelsOutputPath, `// Auto-generated Prisma models\n\n${models}`);
fs.writeFileSync(enumsOutputPath, `// Auto-generated Prisma enums\n\n${enums}`);

console.log('Prisma models and enums have been generated successfully.');
console.log('Running type error check  ----');
