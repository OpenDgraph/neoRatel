interface SchemaObj {
  data: {
    schema: any;
    types: any;
  };
}

export async function convertSchemaToText(schemaObj: SchemaObj) {
  const { schema, types } = schemaObj.data;

  // Group predicates by type
  const predicatesByType: { [key: string]: any[] } = {};
  for (const predicate of schema) {
    if (!predicate.predicate.startsWith('dgraph.')) {
      if (!predicatesByType[predicate.type]) {
        predicatesByType[predicate.type] = [];
      }
      predicatesByType[predicate.type].push(predicate);
    }
  }

  let schemaText = '';
  // Iterate through each type
  for (const type in predicatesByType) {
    schemaText += `# ${type.toUpperCase()} Predicates\n`;
    for (const predicate of predicatesByType[type]) {
      schemaText += `    <${predicate.predicate}>: `;
      if (predicate.list) {
        schemaText += `[${predicate.type}]`;
      } else {
        schemaText += predicate.type;
      }
      if (predicate.lang) {
        schemaText += ' @lang';
      }
      if (predicate.index) {
        schemaText += ' @index(' + predicate.tokenizer.join(", ") + ')';
      }
      if (predicate.reverse) {
        schemaText += ' @reverse';
      }
      schemaText += ' .\n';
    }
    schemaText += '\n';
  }

  if (schemaText !== '') {
    schemaText += '# Types\n';
  } else if (schemaText === '') {
    schemaText += '# No predicates found || Looks like a clean cluster \n';
  }
  
  for (const type of types) {
    if (!type.name.startsWith('dgraph.')) {
      schemaText += `type <${type.name}> {\n`;
      for (const field of type.fields) {
        if (!field.name.startsWith('dgraph.')) {
          schemaText += `  ${field.name}\n`;
        }
      }
      schemaText += '}\n\n';
    }
  }

  return schemaText;
}
