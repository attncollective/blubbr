from web3 import Web3, HTTPProvider
import json

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
        "imageUrl",
        "chain",
        "network"
            ],
        }
    )

    #resp = json.dumps(resp)
    assets = resp["result"]["assets"] # this results in a list of dicts, one per NFT in the wallet 
    return assets  

def get_all_contracts(_assets):
    """Gathers the contract addresses into a list, not including duplicates.
    :returns: A list of all of the contracts used for NFTs owned by the wallet. 
    :rtype: list
    """
    pass 

def get_top_collections(_contracts): # This also needs to return floor price; not just the contracts 
    """Takes the de-duplicated list of NFT contracts, and queries OS for the floor price of each.
    :returns: A dict of the four top NFT collections by floor price, and the current floor price. 
    :rtype: dict
    """
    # example final data:
    """
    {
        "0xc784e2d033b3cf2e5cb283f4aa4f9b903436b0af": "3.2",
        "0x793daf78b74aadf1eda5cc07a558fed932360a60": "2.4",
        "0xb3767b2033cf24334095dc82029dbf0e9528039d", "2.2",
        "0x79fcdef22feed20eddacbb2587640e45491b757f", "0.9"
    }
    """
    pass

def get_sale_price(_top_collections):
    """Takes the top collections and gets the last sale price for each collection. 
    :returns: The last sale price of each of the top four collections.
    :rtype: List of ints 
    """
    pass

def main():
    wallet_address = "0x46295302252aD1fE561B35542669BA8fEA22Cfcc"
    nfts = get_wallet_nfts(wallet_address)
    contracts = get_all_contracts(nfts)
    top_collections = get_top_collections(contracts)
    sale_prices = get_sale_price(top_collections)

    # assign sale prices to each collection
    top_1_price, top_2_price, top_3_price, top_4_price = sale_prices[0], sale_prices[1], sale_prices[2], sale_prices[3]

    # TODO: Get the data format in a better state that includes contract address, floor price, and last sale for use on the webpage 