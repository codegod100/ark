import {type} from "arktype"
  export const person_location = type({
  city: "string",
});

export const person = type({
  name: "string",
  age: "number",
  location: person_location,
  isActive: "boolean",
  hobbies: "string[]",
});

