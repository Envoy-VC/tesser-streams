# Tesser Streams SDK

A SDK for managing fractional vesting schedules from Tesser Streams. This SDK provides a comprehensive set of tools to create, manage, list, sell, and buy fractional vesting schedules with ease.

## Features

- Create vesting schedules with customizable parameters
- Release vested tokens
- Query vesting schedule details
- Manage token approvals
- List and buy vesting schedules on the marketplace
- Remove schedule listings

## Installation

```bash
npm install @tesser-streams/sdk
# or
yarn add @tesser-streams/sdk
# or
pnpm add @tesser-streams/sdk
```

## Getting Started

First, you'll need to set up the client with your wagmi configuration:

```typescript
import { TesserStreamsClient } from '@tesser-streams/sdk';
import { createConfig } from '@wagmi/core';
import { defineChain } from 'viem';
const assetHubChain = defineChain({...})

const config = createConfig({
  chains: [assetHubChain],
  // ... your wagmi configuration
});

const client = new TesserStreamsClient(config);
```

## API Reference

### `createVestingSchedule`

Creates a new vesting schedule with specified parameters. This function sets up a new vesting contract that will gradually release tokens to the beneficiary according to the specified schedule.

Parameters:
- `beneficiary`: The Ethereum address that will receive the vested tokens
- `tokenAddress`: The address of the ERC20 token to be vested
- `totalAmount`: The total amount of tokens to be vested (in wei)
- `cliffDuration`: The duration of the cliff period in seconds (e.g., 1 year = 31536000)
- `vestingDuration`: The total duration of the vesting period in seconds
- `alpha`: A parameter that controls the shape of the vesting curve

```typescript
const params = {
  beneficiary: "0x...", // Address of the beneficiary
  tokenAddress: "0x...", // Address of the token to be vested
  totalAmount: BigInt("1000000000000000000"), // Total amount to be vested (in wei)
  cliffDuration: 31536000, // Cliff duration in seconds (e.g., 1 year)
  vestingDuration: 157680000, // Total vesting duration in seconds (e.g., 5 years)
  alpha: BigInt("1000000000000000000") // Alpha parameter for the vesting curve
};

const result = await client.createVestingSchedule(params);
```

### `releaseSchedule`

Releases vested tokens from a schedule to the beneficiary. This function can be called by anyone to release the currently vested tokens to the beneficiary. The amount released is calculated based on the vesting curve and the current time.

Parameters:
- `vestingId`: The unique identifier of the vesting schedule (66-character hex string)

```typescript
const params = {
  vestingId: "0x..." // Hex ID of the vesting schedule
};

const result = await client.releaseSchedule(params);
```

### `getVestingSchedule`

Retrieves detailed information about a specific vesting schedule. Returns information including the beneficiary, token address, start time, cliff duration, vesting duration, total amount, released amount, and current status.

Parameters:
- `vestingId`: The unique identifier of the vesting schedule (66-character hex string)

Returns a `VestingSchedule` object containing:
- `beneficiary`: The address that will receive the tokens
- `tokenAddress`: The address of the vested token
- `startTime`: When the vesting schedule began
- `cliffDuration`: Duration of the cliff period
- `vestingDuration`: Total duration of the vesting period
- `alpha`: The vesting curve parameter
- `totalAmount`: Total amount of tokens to be vested
- `released`: Amount of tokens already released
- `frozen`: Whether the schedule is frozen

```typescript
const params = {
  vestingId: "0x..." // Hex ID of the vesting schedule
};

const schedule = await client.getVestingSchedule(params);
```

### `approveToken`

Approves the vesting contract to spend tokens on behalf of the caller. This is required before creating a vesting schedule to ensure the contract can transfer the tokens.

Parameters:
- `spender`: The address of the vesting contract that will spend the tokens
- `value`: The amount of tokens to approve (in wei)

```typescript
const params = {
  spender: "0x...", // Address of the spender (vesting contract)
  value: BigInt("1000000000000000000") // Amount to approve
};

const result = await client.approveToken(params);
```

### `getTokenAllowance`

Checks how many tokens the spender (vesting contract) is allowed to spend on behalf of the owner. This is useful to verify if token approval is sufficient before creating a vesting schedule.

Parameters:
- `owner`: The address of the token owner
- `spender`: The address of the spender (vesting contract)

Returns a `bigint` representing the current allowance.

```typescript
const params = {
  owner: "0x...", // Address of the token owner
  spender: "0x..." // Address of the spender
};

const allowance = await client.getTokenAllowance(params);
```

### `listSchedule`

Lists a vesting schedule for sale on the marketplace. This converts the vesting schedule into an NFT that can be traded.

Parameters:
- `owner`: The address of the current schedule owner
- `tokenId`: The ID of the vesting schedule token
- `value`: The price at which to list the schedule (in wei)

```typescript
const params = {
  owner: "0x...", // Address of the schedule owner
  tokenId: BigInt("1"), // ID of the vesting schedule token
  value: BigInt("1000000000000000000") // Listing price
};

const result = await client.listSchedule(params);
```

### `buySchedule`

Purchases a listed vesting schedule from the marketplace. This transfers ownership of the vesting schedule to the buyer.

Parameters:
- `tokenId`: The ID of the vesting schedule token to purchase
- `buyer`: The address of the buyer

```typescript
const params = {
  tokenId: BigInt("1"), // ID of the vesting schedule token
  buyer: "0x..." // Address of the buyer
};

const result = await client.buySchedule(params);
```

### `removeScheduleListing`

Removes a vesting schedule from the marketplace. This cancels the listing and makes the schedule no longer available for purchase.

Parameters:
- `tokenId`: The ID of the vesting schedule token to remove from listing

```typescript
const params = {
  tokenId: BigInt("1") // ID of the vesting schedule token
};

const result = await client.removeScheduleListing(params);
```

## Contributing

We welcome contributions to the Tesser Streams SDK! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Envoy-VC/tesser-streams.git
cd tesser-streams
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the package:
```bash
pnpm build
```

4. Run tests:
```bash
pnpm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.