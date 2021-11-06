// License: GPLv3
// kode by @shunduquar aka shung

const { ethers } = require("ethers")
const { spawn } = require("child_process")

require("dotenv").config()
const minWork = process.env.MIN_WORK
const privateKey = process.env.PRIVATE_KEY

const contractAddress = "0x74A68215AEdf59f317a23E87C13B848a292F27A4"
const rpcUri = "https://api.avax.network/ext/bc/C/rpc"
const provider = new ethers.providers.JsonRpcProvider(rpcUri)
const signer = new ethers.Wallet(privateKey, provider)
const walletAddress = signer.address.toLowerCase().substring(2)
const contractAbi = [
	"function interval() view returns (uint256)",
	"function deadline() view returns (uint256)",
	"function mint(uint256 _nonce)"
]
const xpowContract = new ethers.Contract(contractAddress, contractAbi, signer)

const os = process.platform
var minerExecutable
if (os === 'linux') {
	minerExecutable = './xpow-miner'
} else if (os === 'win32') {
	minerExecutable = 'xpow-miner.exe'
}

async function mint(nonce) {
	await xpowContract
		.mint(nonce)
		.then(() => {
			console.log("Submitted nonce " + nonce + ".")
		})
		.catch((error) => {
			console.log(error)
		})
}

async function mine() {
	const interval = ethers.utils.formatUnits(await xpowContract.interval(),0)
	const deadline = 3600 - ethers.utils.formatUnits(await xpowContract.deadline(),0)
	const startingNonce = Math.floor((Math.random() * 10 ** 16 ) + 2 * 10 ** 16) // arbitrary random value
	const miner = spawn(minerExecutable, [startingNonce, walletAddress, interval, minWork, deadline])
	miner.stdout.on('data', (data) => {
		const line = data.toString('utf-8')
		if (line.startsWith("Good nonce:")) {
			const nonce = line.replace(/^Good nonce:\s([0-9]+).*/, '$1')
			mint(nonce.trim())
		}
	})
}

mine()
