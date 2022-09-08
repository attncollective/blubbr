# attnethglobal
![attnmoney-ethglobal](https://user-images.githubusercontent.com/104535511/188544615-b3e15451-c459-4c30-b4d6-4a22f20b6e03.png)

## Tech Stack
- Website hosted with React

- Blockchains
attn.money is focused on mainnet for the MVP, but will include Polygon, Aave and possibly others depending on our progress.

- Authentication
Current plan is to use Moralis/ Rainbow Kit for authentication. We could potentially use Sign-in With Ethereum (made by Spruce) as well. 

- Storage
IPFS and Filecoin are used for image storage when needed. IPFS could be queried at random for NFT collection pictures, if desired.

- Social
Lens will be used to allow users to follow each other's activity, and mirror.xyz is used to enable content creation. 

- Data Querying
QuickNode's NFT API is used for gathering data about the currently signed in user's NFTs they've collected. It may also be used for DeFi information if we get that far.
The Graph is used to query data about ERC20 tokens held by the signed in user. 

- Notifications
Notifications are sent via EPNS for activity that occurs on attn.money. 

- Licensing
Valist could be used for NFT licensing to enable access to a paid tier of attn.money. 

- RPCs
QuickNode's endpoints are used for RPC and HTTP endpoints, where needed.

## Full Sponsor List (in order of priority)
1. QuickNode
2. IPFS/ Filecoin
3. The Graph
4. Lens
5. EPNS
6. Polygon
7. Aave
8. Valist
9. LivePeer
10. Optimism 
11. Spruce (Sign-in With Ethereum) 
