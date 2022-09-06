# AttnMoney - QuickNode code
Goal of the code in this folder is to query the attached wallet's NFTs, and show the value of them. 
## Useful QuickNode Endpoints (listed in order of how useful they could be)
https://www.quicknode.com/docs/ethereum/qn_fetchNFTs
https://www.quicknode.com/docs/ethereum/qn_fetchNFTsByCollection 
https://www.quicknode.com/docs/ethereum/qn_fetchNFTCollectionDetails 
https://www.quicknode.com/docs/ethereum/qn_getTransfersByNFT

## Steps
1. Gather all collections in the user's wallet (all_collections)
2. Query OpenSea API to discover floor price of each collection
3. Take the top four collections and store in an object (top_NFTs)
4. Query OS API to discover the last sale price of all collections in top_NFTs