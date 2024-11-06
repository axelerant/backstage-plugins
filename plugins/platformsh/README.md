# Backstage Platform.sh Plugin

A Backstage plugin that retrieves project details and environment data from Platform.sh.

## Current Features

- A page to list all projects from Platform.sh.
- An entity card to display the current project details.
- An entity card to display all environments for the current project.
- Options to resume, pause, activate, deactivate, or delete development environments.
- Permission support for environment actions.
- Support for New Front End system

## Future Development Plans

- Display environment activities and logs
- Create and deploy new or existing branches
- Add a scaffolder action for deploying new services
- Display metrics (Currently, there is no API endpoint available for this. Once available, we can consider adding it)

## Setup

The following sections will guide you through setting up and running the Platform.sh plugin.

### Platform.sh Backend

Before proceeding, ensure that you have set up the [Platform.sh Backend plugin](https://github.com/axelerant/backstage-plugins/tree/main/plugins/platformsh-backend).

### Entity Annotation

To use the Platform.sh plugin, add the following annotation to the entities you want to associate with Platform.sh:

```yaml
platform.sh/project-id: <platformsh-project-id>
```

### Installation

To get the Platform.sh component working, follow these steps:

1. First, add the `@axelerant/backstage-plugin-platformsh` package to your frontend app:

   ```bash
   # From your Backstage root directory
   yarn --cwd packages/app add @axelerant/backstage-plugin-platformsh
   ```

2. The Platform.sh plugin provides a page component to list all projects from Platform.sh.

   - Add a route to `App.tsx`:

     ```ts
     // Import the page component
     import { PlatformshPage } from '@axelerant/backstage-plugin-platformsh';

     // Add the route
     <Route path="/platformsh" element={<PlatformshPage />} />;
     ```

   - Add a menu item to the sidebar in `Root.tsx`:

     ```ts
     // Import an icon
     import StorageIcon from '@material-ui/icons/Storage';

     // Add to the sidebar items list
     <SidebarItem icon={StorageIcon} to="platformsh" text="Platform.sh" />;
     ```

3. The Platform.sh plugin provides an entity tab component named `EntityPlatformshContents`.

   ```ts
   // At the top imports
   import { EntityPlatformshContents } from '@axelerant/backstage-plugin-platformsh';

   // Add the tab to any entity page, using the service entity page as an example.
   const serviceEntityPage = (
     <EntityLayout>
       {/* other tabs... */}
       <EntityLayout.Route path="/platformsh" title="Platform.sh">
         <EntityPlatformshContents />
       </EntityLayout.Route>
     </EntityLayout>
   );
   ```

**Note:** This requires entities to have the Platform.sh annotation `platform.sh/project-id: <project-id>`. If not set, a missing annotation warning will be displayed.

To display the tab only for entities where `platform.sh/project-id: <project-id>` is available, the plugin provides a conditional export `isPlatformshAvailable`.

```ts
// At the top imports
import {
  EntityPlatformshContents,
  isPlatformshAvailable,
} from '@axelerant/backstage-plugin-platformsh';

// Add the tab conditionally based on annotation availability
const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route
      path="/platformsh"
      title="Platform.sh"
      if={isPlatformshAvailable}
    >
      <EntityPlatformshContents />
    </EntityLayout.Route>
  </EntityLayout>
);
```
