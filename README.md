# XPOW Autominter

This is a wrapper script around [Itamar Carvalho](https://github.com/itamarcps)’s [XPOW](https://www.xpowermine.com/about) [CPU miner](https://discord.gg/dvshmGVYyJ). With this script you can mine XPOW in the background.

## Instructions

1. Clone this repository
2. Download [Ita’s miner](https://cdn.discordapp.com/attachments/906369656191873064/906397010876321802/linux.zip) (Linux only)
3. Move the Ita’s miner to the repo directory
4. Make the miner executable with command `chmod +x xpow-miner`
5. Install [NodeJS](https://nodejs.org) and [npm](https://npmjs.org) with `apt install nodejs npm`
6. Install ethers library inside the repo dir with command `npm i ethers`
7. Create a new wallet through MetaMask and fund it with AVAX (do not store large amounts in this wallet)
8. Add your private key to `const privateKey` inside `xpow-wrapper.js`
9. Adjust `const minWork` based on your needs
10. Run `sh starts.sh` to start mining & minting

### On `minWork`

`minWork` is the easiest nonce that will be submitted to the blockchain. Lower minWork means that you will mint more often with small transactions, resulting in high gas fee usage. `6` is recommended value at the current market conditions for XPOW. If you have a weaker computer you might find `5` more useful. If you have a stronger computer and do not want to spend too much on gas you might find `7` more useful.

## TODO

* Fix concurrent transaction nonce error
* Use multiple cores
* Add Windows support
* Move private key from `.env`
