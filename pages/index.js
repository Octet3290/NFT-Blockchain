import Header from '../components/Header'
import Hero from '../components/Hero'
// import {useWeb3} from '@3rdweb/hooks'
import { useAddress, useMetamask } from '@thirdweb-dev/react'
import {useEffect} from 'react'
import {client} from '../lib/sanityClient'
import toast, {Toaster} from 'react-hot-toast'
 

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
} 


const Home = () => {

  // const {address, connectWallet} = useWeb3();
  const connectWithMetamask = useMetamask();
  const address = useAddress();

  const welcomeUser = (userName, toastHandler = toast) => {
    toastHandler.success(
      `Welcome back ${userName != 'Unnamed' ? `${userName}` : '' }!`,
      {
        style: {
          background: '#40111d',
          color: '#fff'
        }
      }
    )
  }

  useEffect(() => {
    if(!address) return
    ;(async () => {
      const userDoc = {
        _type: 'users',
        _id: address,
        userName: 'Unnamed',
        walletAddress: address
      }


      const result = await client.createIfNotExists(userDoc)

      welcomeUser(result.userName)
    })()

  }, [address])



  return (
    
    <div className={style.wrapper}>
      <Toaster position='top-center' reverseOrder={false} />
      {
        address ? (
          <>
            <Header/>
            <Hero/>
          </>
        ) : (
          <div className={style.walletConnectWrapper}>
            <button
              className={style.button}
              onClick={connectWithMetamask}
            >
              Connect Wallet
            </button>

            <div className={style.details}>
              You need Chrome to be
              <br /> able to run this app.
            </div>
          </div>
          
        )
      }
    </div>

  )
}

export default Home