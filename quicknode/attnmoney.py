from web3 import Web3, HTTPProvider
import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

QUICKNODE_KEY = os.getenv("QUICKNODE_KEY")
MODULENFT_KEY = os.getenv("MODULENFT_KEY")

OPTIONS = {
  'headers':
    {
      'x-qn-api-version': '1'
    }
}

w3 = Web3(HTTPProvider(f'https://boldest-holy-shape.discover.quiknode.pro/{QUICKNODE_KEY}/', request_kwargs=OPTIONS))

def get_erc20_tokens(_wallet_address):
    """Queries QuickNode for the connected wallet's tokens. 
    :returns: A list of data about all of the ERC20 tokens in the wallet
    :rtype: list of dicts
    """

    resp = w3.provider.make_request('qn_getWalletTokenBalance', {
    "wallet": _wallet_address,
    })

    assets = resp["result"]["assets"] # returns name, decimals, symbol, chain, network, amount
    return assets 

def get_wallet_nfts(_wallet_address):
    """Queries QuickNode for the connected wallet's NFTs. 

    :param resp: Response from the API call to QuickNode to gather NFTs for the connected wallet
    :type resp: web3 provider
    :param assets: All of the individual NFT assets from the connected wallet
    :type assets: list of dicts 
    :returns: A list of data about all of the NFT assets in the wallet
    :rtype: list of dicts 
    """

    resp = w3.provider.make_request('qn_fetchNFTs', {
    "wallet": _wallet_address,
    "omitFields": [
        "traits",
        "imageUrl", # maybe this imageUrl is the picture we pull
        "chain",
        "network"
            ],
        }
    )

    assets = resp["result"]["assets"] # this results in a list of dicts, one per NFT in the wallet 
    return assets  

def get_all_contracts(_assets):
    """Gathers the contract addresses into a list, and deduplicates them.
    :returns: A list of all of the contracts used for NFTs owned by the wallet. 
    :rtype: list
    """
    all_contracts = []
    
    for asset in _assets:
        if asset["collectionAddress"] not in all_contracts:
            all_contracts.append(asset["collectionAddress"])

    return all_contracts


def get_collection_data(_all_collections): 
    """Takes all collections and gathers their name, floor price and image URL into a dict.
    :returns: A list of dicts, each dict acting as data for a single collection. 
    :rtype: List of dicts
    """
    collections_data = []
    headers = {
        "Accept": "application/json",
        "X-API-KEY": f"{MODULENFT_KEY}"
    }

    for collection in _all_collections:
        collection_data = {}
        url = f"https://api.modulenft.xyz/api/v1/opensea/collection/info?type={collection}"

        response = requests.get(url, headers=headers)
        response = json.loads(response.text)

        try:
            collection_data["name"] = response["info"]["name"]
            collection_data["floorPrice"] = float(response["info"]["statistics"]["floorPrice"]["unit"])
            collection_data["imageUrl"] = response["info"]["owner"]["imageUrl"]
            collections_data.append(collection_data)

        # Logic is required to catch collections with no active listings to prevent an error; easiest thing to do is assume that this collection isn't worth anything and skip it
        except TypeError as e:
            pass

    return collections_data



def determine_top_5_collections(_collection_data): 
    """Takes all collections and determines the top 5 in terms of floor price. 
    :returns: A list of dicts; each dict has data about one collection 
    :rtype: List of dicts
    """
    _collection_data.sort(key = lambda x: x["floorPrice"], reverse=True)
    top_5_collections = _collection_data[0:4]

    return top_5_collections



def get_last_sale(_top_5_collections):
    """Takes the top 5 collections and retrieves their last sale price.
    NOTE: This currently only gathers sales data from OpenSea. 
    :returns: The final data to send to the frontend, containing collection name, floor price, last sale price, and image URL. 
    :rtype: List of dicts
    """
    frontend_data = []
    #print("TYPE OF FRONTEND DATA")
    #print(type(frontend_data))
    
    headers = {
        "Accept": "application/json",
        "X-API-KEY": f"{MODULENFT_KEY}"
    }
    
    for collection in _top_5_collections:
        url = f"https://api.modulenft.xyz/api/v1/opensea/orders/sales?type=0x8184a482A5038B124d933B779E0Ea6e0fb72F54E&count=1&currencySymbol=ETH"
        response = requests.get(url, headers=headers)
        response = json.loads(response.text)
        last_sale_price = response["sales"][0]["price"]
        collection["lastSalePrice"] = last_sale_price
        frontend_data.append(collection)

    return frontend_data

def main():    
    wallet_address = "0x03576d59D983436688664926105A4795Def1d381" # this will need to come from frontend instead
    erc20_tokens = get_erc20_tokens(wallet_address)
    nfts = get_wallet_nfts(wallet_address)
    contracts = get_all_contracts(nfts)
    collections = get_collection_data(contracts)
    top_5_collections = determine_top_5_collections(collections)
    frontend_data = get_last_sale(top_5_collections)
    print(frontend_data)


if __name__ == "__main__":
    main()