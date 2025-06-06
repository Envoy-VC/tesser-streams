<p align="center">
<img src="./assets/logo-text.png" alt=""  width="400px"/></p>

Tesser Streams is a fractional vesting protocol that enables customizable token vesting schedules with mathematical precision.

Unlike traditional linear vesting, it supports fractional exponent curves (like square root, early/late acceleration) that provide nuanced control over token release patterns.

## Why Fractional Vesting? 🤔

Traditional vesting oversimplifies incentive alignment. Tesser’s curves enable:

- Project-Specific Incentives: Match release to development roadmaps
- Market Stability: Prevent token dumping via controlled early-stage liquidity

## Architecture 🏗️

The system is implemented as a modular Diamond Proxy smart contract architecture, ensuring upgradability and gas efficiency.

### Diamond Proxy Framework (EIP-2535)

- `TesserDiamond.sol`: Proxy contract routing calls to facets

#### Facets

- `VestingCoreFacet`: Schedule creation/release (createVestingSchedule, release)
- `VestingMathFacet`: Curve calculations (computeVestedAmount)
- `OwnershipFacet`: Ownership management (transferOwnership)
- `DiamondCutFacet`: Upgrade functionality (diamondCut)
- `DiamondLoupeFacet`: Contract introspection (facets, facetFunctionSelectors)

#### Fractional Math Engine

Fractional math is implemented using the [PRBMath](https://github.com/paulrberg/prb-math) library. It uses `UD60x18` numbers to represent fractional exponents, allowing for precision up to 18 decimal places.

It can hold up to 18 decimal places of precision and 60 places before the decimal point.

## Demo Video 🎥

Watch the demo video to see Tesser Streams in action:

[![Tesser Streams Demo](https://img.youtube.com/vi/yoiyy3XC22g/0.jpg)](https://www.youtube.com/watch?v=yoiyy3XC22g)

## Key Vesting Curve Types 📈

1. Square Root Vesting (α = 0.5)
    - **Formula**: `V(t) = totalAmount * √(t/T)`
    - **Behavior**: Slow initial release accelerating over time
        - 25% tokens release at 6.25% of the period
        - 50% at 25% of the period
        - 90% at 81% of the period
    - **Ideal For**: Founders demonstrating long-term commitment
    - **Example**: 4-year founder vesting with backloaded rewards
2. Early Acceleration (α < 0.5)
    - **Formula**: `V(t) = totalAmount * (t/T)^α`
    - **Behavior**: Rapid initial release slowing over time
        - 50% tokens release at 15% of the period
    - **Ideal For**: Early contributors needing liquidity
    - **Example**: 1-year advisor vesting with 70% released in first 3 months
3. Late Acceleration (α > 0.5)
    - **Formula**: `V(t) = totalAmount * (t/T)^α`
    - **Behavior**: Slow start with aggressive late-stage release
        - 25% tokens release at 40% of the period
        - 50% at 60% of the period
    - **Ideal For**: Long-term team incentives
    - **Example**: 5-year employee grants with retention focus

## 🧑🏼‍💻 Tech Stack

- **Frontend**: Vite, Tailwind CSS, `@shadcn/ui`
- **Integration**: `wagmi`, `web3modal`
- **Smart Contracts**: Solidity, Hardhat, resolc, PolkaVM

## Get Started 🚀

The following repository is a turborepo and divided into the following:

- **apps/web** - The web application built using Vite.

First install the dependencies by running the following:

```bash
pnpm install
```

Then fill in the Environment variables in `apps/web/.env.local`

```bash
VITE_REOWN_PROJECT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Then run the following command to start the application:

```bash
pnpm dev
```

To build and deploy contracts, navigate to the `packages/contracts` directory and run the following command:

```bash
pnpm compile # compile contracts
pnpm deploy:local # deploy contracts to local network
pnpm deploy:live # deploy contracts to Polkadot Asset Hub
```

---
