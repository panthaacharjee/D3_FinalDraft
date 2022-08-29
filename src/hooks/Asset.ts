import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {ASSETS} from "../constants";
import { IUserBondDetails } from "../slices/AccountSlice";
import { Asset } from "../lib/Asset";
import { IAssetDetails } from "../slices/AssetSlice";

interface IAssetsStateView {
  assets: {
    [key: string]: any;
  };
}

// Smash all the interfaces together to get the BondData Type
export interface IAllAssetData extends Asset, IAssetDetails {}

const initialBondArray = ASSETS;
// Slaps together bond data within the account & bonding states
function useAssets() {
  const assetState = useSelector((state: IAssetsStateView) => state.assets);
  console.log("assetState---->>>", assetState);
  const [assets, setAssets] = useState<Asset[] | IAllAssetData[]>(initialBondArray);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    let assetDetails: IAllAssetData[];
    let totalBal = 0;
    assetDetails = ASSETS
      .flatMap(asset => {
        if (assetState[asset.name] && assetState[asset.name].assetPrice) {
          totalBal += assetState[asset.name].assetPrice*assetState[asset.name].assetAmount;
          return Object.assign(asset, assetState[asset.name]); // Keeps the object type
        }
        return asset;
      })

    setAssets(assetDetails);
    setTotal(totalBal);
  }, [assetState]);

  // Debug Log:
  // console.log(bonds);
  return { assets, total };
}

export default useAssets;