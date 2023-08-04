import '../styles/globals.css'
// import {ThirdwebWeb3Provider} from '@3rdweb/hooks'
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

// const supportedChainIds = [5, 11155111]
// const connectors = {
//   injected: {}
// }

// the chainId our app wants to be running on
// for our example the Goerli Testnet
const desiredChainId = ChainId.Goerli;

function MyApp({ Component, pageProps }) {
  return (
    // <ThirdwebWeb3Provider
    //   supportedChainIds={supportedChainIds}
    //   connectors = {connectors}
    // >
    //   <Component {...pageProps} />
    // </ThirdwebWeb3Provider>

    <ThirdwebProvider
    desiredChainId={desiredChainId}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp