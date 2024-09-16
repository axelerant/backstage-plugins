# Platform.sh Backend Plugin

Backend plugin for the [Platform.sh frontend plugin](https://github.com/axelerant/backstage-plugins/tree/main/plugins/platformsh).

## Setup

1. Install the plugin:

   ```bash
   yarn --cwd packages/backend add @axelerant/backstage-plugin-platformsh-backend
   ```

2. Add the plugin to the backend package:

   In your `packages/backend/src/index.ts`, make the following changes:

   ```diff
   import { createBackend } from '@backstage/backend-defaults';

   const backend = createBackend();

   + backend.add(import('@axelerant/backstage-plugin-platformsh-backend'));

   backend.start();
   ```

3. Configure a CLI token. You can create a token at [https://console.platform.sh/-/users/<your-user-name>/settings/tokens](https://console.platform.sh/-/users/<your-user-name>/settings/tokens).

   ```yaml
   # app-config.yaml
   platformsh:
     cli_token: <cli-token>
   ```
