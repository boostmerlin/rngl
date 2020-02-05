import { Asset } from 'expo-asset';

function localGet(uri){
    const id = uri;
    return Asset.loadAsync(id).then(()=>{
      const asset = {
          localUri: Asset.fromModule(id).uri
      };
      return asset;
    })
}

export function get(uri){
    if(typeof uri === 'number') {
        return localGet(uri);
    }
}