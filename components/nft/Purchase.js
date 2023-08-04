import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { HiTag } from 'react-icons/hi'
import { IoMdWallet } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'

import {
  useMetamask,
  useNetwork,
  useNetworkMismatch,
  useAddress
} from "@thirdweb-dev/react";

import {
  ChainId,
  NATIVE_TOKENS,
} from "@thirdweb-dev/sdk";
import { ethers } from 'ethers'


const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
}

const MakeOffer = ({ isListed, selectedNft, listings, marketPlaceModule,  }) => {
  const router = useRouter()
  const [selectedMarketNft, setSelectedMarketNft] = useState()
  const [enableButton, setEnableButton] = useState(false)
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  // Hooks to detect user is on the right network and switch them if they are not
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  useEffect(() => {
    if (!listings || isListed === 'false' || !selectedNft) return
    ;(async () => {
      setSelectedMarketNft(
        listings.find((marketNft) => marketNft.asset.id === selectedNft.id)
      )
    })()
  }, [selectedNft, listings, isListed])

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return

    setEnableButton(true)
  }, [selectedMarketNft, selectedNft])

  const confirmPurchase = () => {
    toast(() => (
      <div>
        <img src={selectedNft.image} width="300px"></img>
      </div>
    ), {
      style: {
        background: '#04111d',
        color: '#fff',
      },
      position: "top-center"
    });

    toast.success(`Purchase ${selectedNft.name} successful!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
      position: "top-center"
    }, )

    
    router.push(`/collections/${'0x66Eb8F1c2D5a8d38b461013cA7A2830497331590'}`);
  }
    

  const errorPurchase = (error) => {
    console.log(error)
    toast.error(`Error Purchase`, {
      style: {
        background: '#04111d',
      },
      position: "top-center"
    })
  }
    

  const buyItem = async (
    listingId = selectedMarketNft.id,
    quantityDesired = 1,
    marketPlace = marketPlaceModule
  ) => {
    try{
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(ChainId.Goerli);
        return;
      }

      if(!address){
        console.log("ADDRESS NOT FOUND")
        connectWithMetamask()
        return
      }


      await marketPlace.buyoutListing(
        listingId,
        quantityDesired,
        address
      )
  
      confirmPurchase()
    }catch(error){
      errorPurchase(error)
    }
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedMarketNft.id, 1) : null
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText} onClick={() => testing()}>Make Offer</div>
          </div>
        </>
      ) : (
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText} >List Item</div>
        </div>
      )}
    </div>
  )
}

export default MakeOffer