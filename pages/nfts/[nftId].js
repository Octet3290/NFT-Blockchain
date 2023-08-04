import Header from '../../components/Header'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImages'
import GeneralDetails from '../../components/nft/GeneralDetails'
import ItemActivity from '../../components/nft/ItemActivity'
import Purchase from '../../components/nft/Purchase'
import { useContract, useActiveListings } from '@thirdweb-dev/react'


const style = {
    wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
    container: `container p-6`,
    topContent: `flex`,
    nftImgContainer: `flex-1 mr-4`,
    detailsContainer: `flex-[2] ml-4`,
}
//0x10F2731698aF689A136E6827400D4ecDeaCb19a0
// 0x8c993103f60C6F3D4072f0930afECd4E01Dbe7E0

const Nft = () => {
  const [selectedNft, setSelectedNft] = useState()
  const router = useRouter()
  const { nftId } = router.query
  const collectionId = "0x10F2731698aF689A136E6827400D4ecDeaCb19a0"
  const { contract:marketPlace } = useContract("0x8c993103f60C6F3D4072f0930afECd4E01Dbe7E0", "marketplace")
  const {data:listings} = useActiveListings(marketPlace);

  const nftFilter = (list) => {
    for(let item of list){
      if(item.asset.id == nftId){
        return item.asset
      }
    }

    return null;
  }

  useEffect(() => {
    if(listings){
      let selected = nftFilter(listings);

      setSelectedNft(selected)
    }
  }, [listings])

  
  
 
  
  
  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                isListed={router.query.isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketPlace}
                collectionId={collectionId}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  )
}

export default Nft