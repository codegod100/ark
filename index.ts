import { type } from "arktype";
const user = type({
  name: "string",
  age: "number.integer<100"

});

type User = typeof user.infer;




function main(){
  const person = user({ name: "yolo", age:75, year:2025 });

  if (person instanceof type.errors) {
    // hover summary to see validation errors
    return console.error(person.summary)
  }
  console.log({ person });
}

main()