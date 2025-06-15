import type { Config, CreateConnectorFn, Transport } from '@wagmi/core';
import type { Chain } from '@wagmi/core/chains';

// biome-ignore lint/style/useNamingConvention: <explanation>
// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as Actions from './actions';
// biome-ignore lint/style/useNamingConvention: <explanation>
import type * as Types from './types';

export class TesserStreamsClient<
  const Chains extends readonly [Chain, ...Chain[]],
  Transports extends Record<Chains[number]['id'], Transport>,
  const ConnectorFns extends readonly CreateConnectorFn[],
> {
  config: Config<Chains, Transports, ConnectorFns>;

  constructor(config: Config<Chains, Transports, ConnectorFns>) {
    this.config = config;
  }

  async createVestingSchedule(params: Types.CreateVestingScheduleParams) {
    return await Actions.createVestingSchedule(this.config, params);
  }

  async getVestingSchedule(params: Types.GetVestingScheduleParams) {
    return await Actions.getVestingSchedule(this.config, params);
  }

  async approveToken(params: Types.ApproveTokenParams) {
    return await Actions.approveToken(this.config, params);
  }

  async getTokenAllowance(params: Types.GetAllowanceParams) {
    return await Actions.getTokenAllowance(this.config, params);
  }
}

export * from './data';
export * from './types';
// biome-ignore lint/style/useNamingConvention: safe
export * as Abi from './abi';
