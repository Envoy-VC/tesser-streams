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

  async createVestingSchedule(
    params: Types.CreateVestingScheduleParams,
    options?: Types.WriteTransactionOptions
  ) {
    return await Actions.createVestingSchedule(this.config, params, options);
  }
}
