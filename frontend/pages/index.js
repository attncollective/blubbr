import { gql, useQuery } from '@apollo/client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
    return <></>
}

export async function getServerSideProps(context) {
    const ethers = require('ethers')
    const fs = require('fs')
    require('dotenv').config()

    const sampleEndpointName = process.env.SAMPLE_ENDPOINT_NAME
    const quicknodeKey = process.env.QUICKNODE_KEY

    const provider = new ethers.providers.JsonRpcProvider({
        url: `https://${sampleEndpointName}.discover.quiknode.pro/${quicknodeKey}/`,
        headers: { 'x-qn-api-version': 1 },
    })

    const heads = await provider.send('qn_fetchNFTs', {
        wallet: '0x91b51c173a4bdaa1a60e234fc3f705a16d228740',
        // omitFields: ['provenance', 'traits'],
        page: 1,
        perPage: 10,
    })

    let json = JSON.stringify(heads)
    fs.writeFile('nft_test.json', json)

    return {
        props: {},
    }
}
