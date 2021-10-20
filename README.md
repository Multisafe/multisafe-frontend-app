# Parcel Frontend

[![Lint](https://github.com/Uniswap/uniswap-interface/workflows/Lint/badge.svg)](https://github.com/ParcelHQ/parcel-frontend-app)
[![Tests](https://github.com/Uniswap/uniswap-interface/workflows/Tests/badge.svg)](https://github.com/ParcelHQ/parcel-frontend-app)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for Parcel - a decentralized, crypto treasury management service with built-in end-to-end data encryption using Gnosis Safe, Filecoin & IPFS..

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`

The interface will currently work on Rinkeby and Mainnet

## Contributions

**Please open all pull requests against the `master` branch.**
CI checks will run against all PRs.
