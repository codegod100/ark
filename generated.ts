import fs from "fs";

// Function to convert JSON schema to TypeScript type
function jsonSchemaToTypeScript(
  schema: Record<string, any>,
  typeName: string,
): string {
  let typeDefinition = `export const ${typeName} = type({\n`;
  const newtypes = [];
  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === "string") {
      // Handle primitive types (e.g., "string", "number", "boolean")
      typeDefinition += `  ${key}: "${value}",\n`;
    } else if (Array.isArray(value)) {
      // Handle arrays (e.g., "string[]")
      const arrayType = value[0].replace("[]", ""); // Extract the type from "string[]"
      typeDefinition += `  ${key}: "${arrayType}[]",\n`;
    } else if (typeof value === "object" && !Array.isArray(value)) {
      // Handle nested objects
      const nestedTypeName = `${typeName}_${key}`;
      let typeDef = ``;
      typeDefinition += `  ${key}: ${nestedTypeName},\n`;
      // Recursively generate the nested type definition
      typeDef += jsonSchemaToTypeScript(value, nestedTypeName);
      newtypes.push(typeDef);
    }
  }
  typeDefinition += `});\n\n`;

  let out = ``;
  for (const newtype of newtypes) {
    out += newtype;
  }
  return out + typeDefinition;
}

// Read the JSON schema from a file
const schemaFilePath = "./schema.json";
const schemaFileContent = fs.readFileSync(schemaFilePath, "utf-8");
const schema = JSON.parse(schemaFileContent);

// Generate TypeScript types for each schema
let typeScriptCode = `import {type} from "arktype"
  `;
for (const [typeName, typeSchema] of Object.entries(schema)) {
  typeScriptCode += jsonSchemaToTypeScript(
    typeSchema as Record<string, any>,
    typeName,
  );
}

// Write the generated TypeScript code to a file
const outputFilePath = "./generated-types.ts";
fs.writeFileSync(outputFilePath, typeScriptCode, { encoding: "utf-8" });

console.log(`TypeScript file generated at: ${outputFilePath}`);
