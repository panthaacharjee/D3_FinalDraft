interface AssetOpts {
    name: string; 
    displayName: string; 
    bondIconSvg: React.ReactNode;
    network: string;
    reserveContractAddress: string;
    nameForPrice: string,
    decimal: number
  }
  
  // Technically only exporting for the interface
  export abstract class Asset {
    // Standard Bond fields regardless of LP bonds or stable bonds.
    readonly name: string;
    readonly displayName: string;
    readonly bondIconSvg: React.ReactNode;
    readonly network: string;
    readonly reserveContractAddress: string;  
    readonly nameForPrice: string;
    readonly decimal: number;

    constructor(assetOpts: AssetOpts) {
      this.name = assetOpts.name;
      this.displayName = assetOpts.displayName;
      this.bondIconSvg = assetOpts.bondIconSvg;
      this.network = assetOpts.network;
      this.reserveContractAddress = assetOpts.reserveContractAddress;
      this.nameForPrice = assetOpts.nameForPrice;
      this.decimal = assetOpts.decimal;
    }
  }