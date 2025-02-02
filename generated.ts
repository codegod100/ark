import fs from "fs";

/**
 * Converts a JSON schema to TypeScript type definitions
 * @param schema - The JSON schema to convert
 * @param typeName - The name of the type to generate
 * @returns The TypeScript type definition as a string
 */
function jsonSchemaToTypeScript(
  schema: Record<string, any>,
  typeName: string,
): string {
  const lines: string[] = [`export const ${typeName} = type({`];
  const nestedTypes: string[] = [];

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === "string") {
      // Handle primitive types (e.g., "string", "number", "boolean")
      lines.push(`  ${key}: "${value}",`);
    } else if (Array.isArray(value)) {
      // Handle arrays (e.g., "string[]")
      const arrayType = getValueType(value);
      lines.push(`  ${key}: "${arrayType}[]",`);
    } else if (typeof value === "object" && !Array.isArray(value)) {
      // Handle nested objects
      const nestedTypeName = `${typeName}_${key}`;
      lines.push(`  ${key}: ${nestedTypeName},`);
      const nestedType = createNestedType(value, nestedTypeName);
      nestedTypes.push(nestedType);
    }
  }

  lines.push(`});`);
  return [nestedTypes.join("\n"), lines.join("\n")].join("\n");
}

function getValueType(value: any[]): string {
  return value[0].replace("[]", "");
}

function createNestedType(value: Record<string, any>, typeName: string): string {
  const lines: string[] = [];
  lines.push(`export const ${typeName} = type({`);
  
  for (const [key, val] of Object.entries(value)) {
    if (typeof val === "string") {
      lines.push(`  ${key}: "${val}",`);
    }
  }
  
  lines.push(`});`);
  return lines.join("\n");
}

// Read the JSON schema from a file
const schemaFilePath = "./schema.json";
const schemaFileContent = fs.readFileSync(schemaFilePath, "utf-8");
const schema = JSON.parse(schemaFileContent);

// Generate TypeScript types for each schema
let typeScriptCode = `import {type} from "arktype"\n\n`;
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
