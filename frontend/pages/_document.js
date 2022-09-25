import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export const networks = {
  137: {
    unlockAddress: "0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f", // Smart contracts docs include all addresses on all networks
    provider: "https://polygon-mainnet.g.alchemy.com/v2/53QZ031nRaLKVkyoB_jrnlXUbSqGsszC",
  }
}

export const paywallConfig = {
  locks: {
    "0x1e11135Db117D67915d33d6931Bb84F6F130dD55": {
      network: 137,
      name: "blubbr.xyz trending nfts",
    },
    title: "blubbr.xyz trending nfts",
    icon: "https://raw.githubusercontent.com/0xChampi/blubbr/main/frontend/public/logos/blubbr_logo.png",
    metadataInputs: [
        {
            "name": "Name",
            "type": "text",
            "required": true
        }
    ],
    pessimistic: true,
  }
}

export default function Document() {
    return (
        <Html>
            <Head>
                {/* Custom Icon */}
                {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /> */}
                <Script src="https://paywall.unlock-protocol.com/static/unlock.latest.min.js" strategy="beforeInteractive"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                ></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

