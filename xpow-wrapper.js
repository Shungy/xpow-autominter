// License: GPLv3
// kode by @shunduquar (shung) and Borg

const { ethers } = require("ethers")
const { spawn } = require("child_process")
const { cpus } = require("os")
require("dotenv").config()

const minWork = process.env.MIN_WORK
const privateKey = process.env.PRIVATE_KEY
const processes = process.env.XPOW_WORKER_COUNT || cpus().length

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

function delay(timeout) {
	return new Promise(resolve => {
		setTimeout(resolve, timeout)
	})
}

function waitTimeout(txResponse, timeout) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => resolve(false), timeout)
		txResponse.wait(1).then(() => {
			clearTimeout(timer)
			resolve(true)
		})
	})
}

async function mint(size, nonce) {
	let remainingTries = 5
	while (remainingTries--) {
		try {
			const txResponse = await xpowContract.mint(nonce)
			const result = await waitTimeout(txResponse, 60000)
			if (!result) {
				console.log(`Confirmation for none ${nonce} timed out, retrying...`)
				continue
			}
			console.log(`Submitted nonce for ${size}: ${nonce}.`)
		} catch (err) {
			console.log(err)
		}
		break
	}
}

let nonces = []
let resolver
function noncesAvailable() {
	return new Promise((resolve) => {
		resolver = resolve
	})
}

function produce(size, nonce) {
	console.log("Found", [size, nonce])
	nonces.push([size, nonce])
	if (resolver) resolver()
}

async function consumer() {
	while (true) {
		await noncesAvailable()
		resolver = null
		while (nonces.length) {
			const [size, nonce] = nonces.shift()
			try {
				await mint(size, nonce)
			} catch (err) {
				console.error("failed to mint:", err)
			}
		}
	}
}

async function init() {
	const interval = ethers.utils.formatUnits(await xpowContract.interval(),0)
	const deadline = 3600 - ethers.utils.formatUnits(await xpowContract.deadline(),0)
	return [interval, deadline]
}

async function mine(interval, deadline) {
	const startingNonce = Math.floor((Math.random() * 10 ** 16 ) + 2 * 10 ** 16) // arbitrary random value
	const miner = spawn(minerExecutable, [startingNonce, walletAddress, interval, minWork, deadline])
	miner.stdout.on('data', (data) => {
		const line = data.toString('utf-8')
		if (line.startsWith("Good nonce:")) {
			const size = 2**parseInt(line.split(" counter: ")[1])-1
			produce(size, line.replace(/^Good nonce:\s([0-9]+).*/, '$1').trim())
		}
	})
	return new Promise((resolve) => {
		miner.on('exit', resolve)
	})
}

async function runWorkers() {
	const [interval, deadline] = await init()
	const workers = []
	nonces = []
	for (let i = 0; i < processes; i++) {
		console.log(`spawned worker: ${i}`);
		workers.push(mine(interval, deadline))
	}
	await Promise.all(workers)
}

async function main() {
	consumer()
	while (true) {
		await runWorkers()
		console.log("all workers exited, restarting after 1 minute")
		await delay(60000)
	}
}

main()
