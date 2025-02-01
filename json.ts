import { type } from "arktype"

const did = type(/^did:.*/)
const user = type({
    name: "string",
    did
}) 

const parseJson = type("string.json.parse").to(user)
function main() {

    const json = `{"name": "yolo", "did": "did:1234"}`
    const out = parseJson(json)
    if (out instanceof type.errors) return console.log(out.summary)
    console.log(out)
}

main()