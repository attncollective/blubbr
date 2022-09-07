from web3 import Web3, HTTPProvider
import json
import requests

OPTIONS = {
  'headers':
    {
      'x-qn-api-version': '1'
    }
}
w3 = Web3(HTTPProvider('https://boldest-holy-shape.discover.quiknode.pro/d5f0ea02a4f3ad5971e328cd02db1f32a39d6274/', request_kwargs=OPTIONS))



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
    """Gathers the contract addresses into a list, not including duplicates.
    :returns: A list of all of the contracts used for NFTs owned by the wallet. 
    :rtype: list
    """
    all_contracts = []
    
    for asset in _assets:
        if asset["collectionAddress"] not in all_contracts:
            all_contracts.append(asset["collectionAddress"])

    return all_contracts


def get_top_collections(_contracts): # This also needs to return floor price; not just the contracts 
    """Takes the de-duplicated list of NFT contracts, and queries OS for the floor price of each.
    Before we can query the floor price, we first have to query the OS API to find the collection_slug value
    in order to use the correct endpoint that includes floor price info. 
    :returns: A dict of the four top NFT collections by floor price, and the current floor price. 
    :rtype: dict
    """
    # TODO: Make sure to include picture from IPFS; of which one from collection? maybe the floor piece? 
    # TODO: Determine how we should handle contracts that don't have an OS slug available (if any like this exist)
    os_slugs = []
    floor_prices = {} # os_slug: floor_price_int
    
    for contract in _contracts:
        url = f"https://api.opensea.io/api/v1/asset_contract/{contract}"
        headers = {
            "Accept": "application/json",
            "X-API-KEY": "keygoeshere"
        }
        response = requests.get(url, headers=headers)
        os_slugs.append(response.text["collection"]["slug"])
        
        # if I decide a dict is better
        #os_slugs[contract] = response.text["colleciton"]["slug"]

    print("OS SLUGS")
    print(os_slugs)

    for slug in os_slugs:
        
        
        url = url = f"https://api.opensea.io/api/v1/collection/{slug}"
        headers = {
            "Accept": "application/json",
            "X-API-KEY": "keygoeshere"
        }
        response = requests.get(url, headers=headers)

        floor_prices[slug] = response.text["stats"]["floor_price"]
        
    print("FLOOR PRICES: ")
    print(floor_price)
    return floor_prices


def get_sale_price(_top_collections):
    """Takes the top collections and gets the last sale price for each collection. 
    :returns: The last sale price of each of the top four collections.
    :rtype: List of ints 
    """
    pass

def main():
    nft_collection_data_example = {"contract_address": [{"floor_price": 1}, {"last_sale_price": 1.1}]}
    
    wallet_address = "0x46295302252aD1fE561B35542669BA8fEA22Cfcc" # this will need to come from frontend instead
    nfts = get_wallet_nfts(wallet_address)
    contracts = get_all_contracts(nfts)
    top_collections = get_top_collections(contracts)
    sale_prices = get_sale_price(top_collections)

    # assign sale prices to each collection
    #top_1_price, top_2_price, top_3_price, top_4_price = sale_prices[0], sale_prices[1], sale_prices[2], sale_prices[3]

    # TODO: Get the data format in a better state that includes contract address, floor price, and last sale for use on the webpage 

main()