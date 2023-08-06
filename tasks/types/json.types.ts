
interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

type JSONValue =
  string |
  number |
  boolean |
  JSONArray |
  JSONObject;
