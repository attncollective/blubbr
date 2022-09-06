from web3 import Web3, HTTPProvider

OPTIONS = {
  'headers':
    {
      'x-qn-api-version': '1'
    }
}
w3 = Web3(HTTPProvider('https://boldest-holy-shape.discover.quiknode.pro/d5f0ea02a4f3ad5971e328cd02db1f32a39d6274/', request_kwargs=OPTIONS))
resp = w3.provider.make_request('qn_fetchNFTs', {
  "wallet": "0x46295302252aD1fE561B35542669BA8fEA22Cfcc",
  "omitFields": [
    "provenance",
    "traits"
  ],
  "page": 1,
  "perPage": 10,
  "contracts": [
    "0xc784e2d033b3cf2e5cb283f4aa4f9b903436b0af",
    "0x793daf78b74aadf1eda5cc07a558fed932360a60",
    "0xb3767b2033cf24334095dc82029dbf0e9528039d"
  ]
})
print(resp)
