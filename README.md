# XPOW Autominter

This is a wrapper script around [Itamar Carvalho](https://github.com/itamarcps)’s [XPOW](https://www.xpowermine.com/about) [CPU miner](https://discord.gg/dvshmGVYyJ). With this script you can mine XPOW in the background.

Donate (AVAX✅, ETH✅, BSC✅): 0xa8101F6Ec7080dE84233f1eE4fc1D6A2C1568327

## Instructions

1. Clone this repository
2. Download Ita’s miner ([Linux](https://cdn.discordapp.com/attachments/906369656191873064/906397010876321802/linux.zip), [Windows](https://cdn.discordapp.com/attachments/906369656191873064/906396986910064670/windows.zip))
3. Move the Ita’s miner to the repo directory
4. Make the miner executable on Linux with command `chmod +x xpow-miner`
5. Install [NodeJS](https://nodejs.org) and [npm](https://npmjs.org) (with `apt install nodejs npm` on Linux), on Windows God help you
6. Install ethers library inside the repo dir with command `npm i ethers dotenv`
7. Create a new wallet through MetaMask and fund it with AVAX (do not store large amounts in this wallet)
8. Copy `.env.example` to `.env` and add your private key to `PRIVATE_KEY`
9. Adjust `MIN_WORK` based on your needs
10. Run `sh starts.sh` on Linux and `start.bat` on Windows to start mining & minting

### On `minWork`

`minWork` is the easiest nonce that will be submitted to the blockchain. Lower minWork means that you will mint more often with small transactions, resulting in high gas fee usage. `6` is recommended value at the current market conditions for XPOW. If you have a weaker computer you might find `5` more useful. If you have a stronger computer and do not want to spend too much on gas you might find `7` more useful.

## TODO

* Fix concurrent transaction nonce error
* Use multiple cores

### Completed ✅

* Add full Windows support
* Source private key from `.env`
