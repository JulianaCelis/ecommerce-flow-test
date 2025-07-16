export class Products {
  constructor(
    public readonly id: number,
    public name: string,
    public description: string,
    public price: number,
    public image_url: string,
    public created_at?: Date,
  ) {}
}
