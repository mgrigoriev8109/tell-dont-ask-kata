class Category {
  constructor(name: string) {
      this.name = name;
  }
  
  private name: string;
  private taxPercentage: number;

  public getName(): string {
      return this.name;
  }

  public getTaxPercentage(): number {
      return this.taxPercentage;
  }

  public setTaxPercentage(taxPercentage: number) {
      this.taxPercentage = taxPercentage;
  }
}

export default Category;

