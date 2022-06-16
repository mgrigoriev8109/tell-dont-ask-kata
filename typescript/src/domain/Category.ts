class Category {
  constructor(name: string, taxPercentage: number) {
      this.name = name;
      this.taxPercentage = taxPercentage;
  }
  
  public name: string;
  public taxPercentage: number;
}

export default Category;

