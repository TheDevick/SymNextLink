import { Item } from "./item";

export class Url implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public longUrl?: string,
    public shortUrl?: string,
    public createDate?: Date
  ) {
    this["@id"] = _id;
  }
}
