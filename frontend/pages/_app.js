import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
    cssStringFromTheme,
} from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css'

// RAINBOW_KIT_STUFF: Configure the chains and generate the required connectors
const { chains, provider } = configureChains(
    [chain.polygon, chain.polygonMumbai],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_POLYGON_MAINNET_ALCHEMY_ID }),
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_ALCHEMY_ID }),
        publicProvider(),
    ]
)
const { connectors } = getDefaultWallets({
    appName: 'attnmoney',
    chains,
})
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider attribute="class">
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider theme={null} chains={chains}>
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
                            :root {
                            ${cssStringFromTheme(
                                lightTheme({
                                    accentColor: '#9ca3af',
                                    borderRadius: 'medium',
                                    fontStack: 'system',
                                    overlayBlur: 'small',
                                })
                            )}
                            }
                            html[class="dark"] {
                            ${cssStringFromTheme(
                                darkTheme({
                                    accentColor: '#1f2937',
                                    borderRadius: 'medium',
                                    fontStack: 'system',
                                    overlayBlur: 'small',
                                })
                            )}
                            }
                        `,
                        }}
                    />
                    <ApolloProvider client={client}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ApolloProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </ThemeProvider>
    )
}

export default MyApp
