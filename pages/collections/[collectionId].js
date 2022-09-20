
import {useRouter} from 'next/router'
import Link from 'next/link'
import React, {useEffect, useState, useMemo} from "react";
import { useWeb3 } from "@3rdweb/hooks";
import {client} from '../../lib/sanityClient'
import {ThirdwebSDK} from '@3rdweb/sdk'
import Header from "../../components/Header";
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../../components/NFTCard'



const style = {
    bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
    bannerImage: `w-full object-cover`,
    infoContainer: `w-screen px-4`,
    midRow: `w-full flex justify-center text-white`,
    endRow: `w-full flex justify-end text-white`,
    profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
    socialIconsContainer: `flex text-3xl mb-[-2rem]`,
    socialIconsWrapper: `w-44`,
    socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
    socialIcon: `my-2`,
    divider: `border-r-2`,
    title: `text-5xl font-bold mb-4`,
    createdBy: `text-lg mb-4`,
    statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
    collectionStat: `w-1/4`,
    statValue: `text-3xl font-bold w-full flex items-center justify-center`,
    ethLogo: `h-6 mr-2`,
    statName: `text-lg w-full text-center mt-1`,
    description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
  }
  
const Collection = () =>{
    const router = useRouter()
    const { provider } = useWeb3()
    const { collectionId } = router.query
    const [collection, setCollection] = useState({})
    const [nfts, setNfts] = useState([])
    const [listings, setListings] = useState([])

    //https://eth-goerli.g.alchemy.com/v2/bKReRC41sZAQ2yMca5em5VTLX4aKJN6E

    const nftModule = useMemo(()=>{
        if(!provider) return
        const sdk = new ThirdwebSDK(
            provider.getSigner(),
            'https://eth-goerli.g.alchemy.com/v2/bKReRC41sZAQ2yMca5em5VTLX4aKJN6E'
        )
        return sdk.getNFTModule(collectionId)

    },[provider])

    useEffect(()=>{
        if(!nftModule) return
        ;(async ()=>{
            const nfts = await nftModule.getAll()
            setNfts(nfts)
        })()
    }, [nftModule])

    const marketPlaceModule = useMemo(()=>{
        if(!provider)return
        const sdk = new ThirdwebSDK(
            provider.getSigner(),
            'https://eth-goerli.g.alchemy.com/v2/bKReRC41sZAQ2yMca5em5VTLX4aKJN6E'
        )
        return sdk.getMarketplaceModule(
            '0x8c993103f60C6F3D4072f0930afECd4E01Dbe7E0'
        )
    },[provider])

    useEffect(()=>{
        if(!marketPlaceModule) return
        ;(async()=>{
            setListings(await marketPlaceModule.getAllListings())
        })

    },[marketPlaceModule])

   

      const fetchCollectionData = async (sanityClient = client, 
      ) => {
        const query = `*[_type == "marketItems" && contractAddress == '${collectionId}'] {
            "imageUrl": profileImage.asset->url, 
            "bannerImageUrl": bannerImage.asset->url, 
            volumeTraded, createdBy, contractAddress,
            "creator": createdBy->userName,
           
            title, floorPrice, "allOwners": owners[]->,description
          }`

        const collectionData = await sanityClient.fetch(query)
     
        await setCollection(collectionData[0])
      }

      useEffect(()=>{
        fetchCollectionData()

      }, [collectionId])
    
    return (
        <div className="overflow-hidden">
         <Header />
        <div className={style.bannerImageContainer}>
        <img 
            className={style.bannerImage}
            src={
                collection?.bannerImageUrl
                ? collection.bannerImageUrl
                : 'https://i.redd.it/1aozz7aqrnu61.jpg'
            }
            alt="banner"
        />

        </div>
        <div className={style.infoContainer}>
        <div className={style.midRow}>
        <img 
        className={style.profileImg}
        src={
            collection?.imageUrl
            ? collection.imageUrl
            : 'https://s.yimg.com/ny/api/res/1.2/xyDA3zt0QiBIkHeESR_KnQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTQ4MA--/https://s.yimg.com/uu/api/res/1.2/OCRjwCNEWlyGfs7IGgenAQ--~B/aD01MTI7dz0xMDI0O2FwcGlkPXl0YWNoeW9u/https://media.zenfs.com/en/coin_rivet_596/ba2754dbc025784c5a0eeb5ba68dd7d1'
        }
        alt="profile image"
        />

        </div>
        <div className={style.endRow}>
        <div className={style.socialIconsContainer}>
        <div className={style.socialIconsWrapper}>
        <div className={style.socialIconsContent}>
        <div className={style.socialIcon}>
            <CgWebsite />

        </div>
        <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>

        </div>
        

        </div>
            
        </div>
            
        </div>

        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{' '}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>

        </div>
        <div className={style.midRow}>
        <div className={style.statsContainer}>
        <div className={style.collectionStat}>
        <div className={style.statValue}>{nfts.length}
        

        </div>
        

        </div>


        </div>

        </div>

        </div>

       
        
    )
}
export default Collection