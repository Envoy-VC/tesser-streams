import type { Config, CreateConnectorFn, Transport } from '@wagmi/core';
import type { Chain } from '@wagmi/core/chains';

export class TesserStreamsClient<
  const Chains extends readonly [Chain, ...Chain[]],
  Transports extends Record<Chains[number]['id'], Transport>,
  const ConnectorFns extends readonly CreateConnectorFn[],
> {
  config: Config<Chains, Transports, ConnectorFns>;

  constructor(config: Config<Chains, Transports, ConnectorFns>) {
    this.config = config;
  }
}
