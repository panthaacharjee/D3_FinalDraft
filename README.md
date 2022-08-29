# [Ω DEFI Frontend](https://app.d3protocol.io/)
This is the front-end repo for DEFI that allows users be part of the future of Greece. 

**_ Note We're currently in the process of switching to TypeScript. Please read  this  guide on how to use TypeScript for this repository. https://github.com/d3pro/d3-frontend/wiki/TypeScript-Refactor-General-Guidelines _**

##  🔧 Setting up Local Development

Required: 
- [Node v14](https://nodejs.org/download/release/latest-v14.x/)  
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) 
- [Git](https://git-scm.com/downloads)


```bash
$ git clone https://github.com/d3pro/d3protocol.git
$ cd defidao

# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

## Rinkeby Testing

**Rinkeby faucet for sOHM:**
[Lives here](https://rinkeby.etherscan.io/address/0x800B3d87b77361F0D1d903246cA1F51b5acb43c9#writeContract), to retrieve test sOHM click `Connect to Web3` and use function #3: `dripSOHM`. After connecting to web3, click `Write` to execute and 10 sDEFI will automatically be transferred to your connected wallet.

Note: The faucet is limited to one transfer per wallet every 6500 blocks (~1 day)

**Rinkeby faucet for WETH:**
[Wrap rinkeby eth on rinkeby uniswap](https://app.uniswap.org/#/swap)

**Rinkeby faucets for LUSD, FRAX & DAI can be taken from rinkeby etherscan:**

1. Go to `src/helpers/AllBonds.ts`
2. then copy the rinkeby `reserveAddress` for the applicable bond & navigate to that contract on rinkeby etherscan. 
3. On Rinkeby etherscan use the `mint` function. You can use the number helper for 10^18 & then add four more zeros for 10,000 units of whichever reserve you are minting.

## Avax Fuji Testnet
1. [avax faucet](https://faucet.avax-test.network/)
2. [explorer](https://explorer.avax-test.network/)

## Architecture/Layout
The app is written in [React](https://reactjs.org/) using [Redux](https://redux.js.org/) as the state container. 

The files/folder structure are a  **WIP** and may contain some unused files. The project is rapidly evolving so please update this section if you see it is inaccurate!

```
./src/
├── App.jsx       // Main app page
├── abi/          // Contract ABIs from etherscan.io
├── actions/      // Redux actions 
├── assets/       // Static assets (SVGs)
├── components/   // Reusable individual components
├── constants.js/ // Mainnet Addresses & common ABI
├── contracts/    // TODO: The contracts be here as submodules
├── helpers/      // Helper methods to use in the app
├── hooks/        // Shared reactHooks
├── themes/       // Style sheets for dark vs light theme
└── views/        // Individual Views
```

## Application translation

DEFI uses [linguijs](https://github.com/lingui/js-lingui) to manage translation.

The language files are located in a submodule deployed in `src/locales/translations`. This submodule points to the [defi translation repository](https://github.com/d3pro/)

In order to mark text for translation you can use:
- The <Trans> component in jsx templates eg. `<Trans>Translate me!</Trans>`
- The t function in javascript code and jsx templates. ``` t`Translate me` ```
You can also add comments for the translators. eg.
```
t({
	id: "do_bond",
	comment: "The action of bonding (verb)",
})
```

When new texts are created or existing texts are modified in the application please leave a message in the DefiDao app-translation channel for the translators to translate them.

### Resolving merge conflicts with translations

```bash
$ git diff
# shows two commits in conflict below (fbdd867,e6e0919)
diff --cc src/locales/translations
index fbdd867,e6e0919..0000000
--- a/src/locales/translations
+++ b/src/locales/translations

cd src/locales/translations
# first commit
git checkout fbdd867
# merge in second commit
git merge e6e0919
git commit

cd ../../..
git add src/locales/translations
git commit
```

## 🚀 Deployment
Auto deployed on [Fleek.co](http://fleek.co/) fronted by [Cloudflare](https://www.cloudflare.com/). Since it is hosted via IPFS there is no running "server" component and we don't have server sided business logic. Users are served an `index.html` and javascript to run our applications. 

_**TODO**: TheGraph implementation/how/why we use it._


**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch. 

