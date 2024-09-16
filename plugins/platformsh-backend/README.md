# Platformsh Backend Plugin

Backend Plugin for [Platformsh frontend plugin](https://github.com/axelerant/backstage-plugins/tree/main/plugins/platformsh).

## Setup

1. Install plugin

```bash
yarn --cwd packages/backend add @axelerant/backstage-plugin-platformsh-backend
```

2. Add to backend package

In your packages/backend/src/index.ts make the following changes:

```diff
  import { createBackend } from '@backstage/backend-defaults';

  const backend = createBackend();

+ backend.add(import('@axelerant/backstage-plugin-platformsh-backend'));

  backend.start();
```

3. Configure a CLI token. Token can be created at [https://console.platform.sh/-/users/<your-user-name>/settings/tokens](https://console.platform.sh/-/users/<your-user-name>/settings/tokens)

```yaml
# app-config.yaml
platformsh:
  cli_token: <cli-token>
```
