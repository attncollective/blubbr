# blubbr
![blubbui](https://user-images.githubusercontent.com/86300766/191803348-412224dc-d870-4656-a4ad-42f482d981ca.png)

![Screen Shot 2022-09-25 at 2 29 11 PM](https://user-images.githubusercontent.com/86300766/192159384-1d05db66-3f87-4fc6-b0f2-bb7f1928e9e7.png)
![Screen Shot 2022-09-25 at 2 29 17 PM](https://user-images.githubusercontent.com/86300766/192159390-cf0cdb8e-9a3e-4e70-b21c-1128cdf458c8.png)
![Screen Shot 2022-09-25 at 2 29 25 PM](https://user-images.githubusercontent.com/86300766/192159396-befd1784-1fe0-44a5-9848-9ebbc6f2abe5.png)

## Tech Stack
- Website hosted with NEXT

- Blockchains
blubbr is focused on mainnet for the MVP, but will include Polygon, Aave and possibly others depending on our progress.

- Authentication
Wagmi

- Storage
IPFS and Filecoin are used for image storage when needed. IPFS could be queried at random for NFT collection pictures, if desired.

- Social
Lens will be used to allow users to follow each other's activity, and mirror.xyz is used to enable content creation. 

- Data Querying
QuickNode's NFT API is used for gathering data about the currently signed in user's NFTs they've collected. It may also be used for DeFi information if we get that far.
The Graph is used to query data about ERC20 tokens held by the signed in user. 

- Notifications
Notifications are sent via EPNS for activity that occurs on blubbr 

- Licensing
Unlock could be used for NFT licensing to enable access to a paid tier of blubbr
https://docs.unlock-protocol.com/tools/paywall/locking-page

- APIs
QuickNode's API, NFT Port, Icy TOols

## Full Sponsor List (in order of priority)
1. QuickNode
2. IPFS/ Filecoin
3. The Graph
4. Unlock
5. EPNS
6. Polygon
7. Aave
8. LivePeer
9. Superfluid
