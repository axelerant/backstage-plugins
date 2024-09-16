# Backstage Platform.sh Plugin

Backstage plugin which project details and environments data from platform.sh

## Features

- A Page to list all projects from platform.sh.
- An Entity Card to display current project detail.
- An Entity card to display all environments for current project
- Option to resume/pause/activate/deactivate/delete development environments
- Permission support for environment actions

## Setup

The following sections will help you get the Platform.sh plugin setup and running

### Platformsh Backend

You need to setup the [Platformsh Backend plugin](https://github.com/axelerant/backstage-plugins/tree/main/plugins/platformsh-backend) before you move forward with any of these steps if you haven't already

### Entity Annotation

To be able to use the platformsh plugin you need to add the following annotation to any entities you want to use it with:

```yaml
platform.sh/project-id: <platformsh-project-id>
```

### Installation

To get the platformsh component working you'll need to do the following two steps:

1. First we need to add the `@axelerant/backstage-plugin-platformsh` package to your frontend app:

```ts
# From your Backstage root directory
yarn --cwd packages/app add @axelerant/backstage-plugin-platformsh
```

2. Platformsh plugin provides a page component to list all projects from platform.sh.

- Add a route to `App.tsx`

  ```ts
  // import the the page
  import { PlatformshPage } from '@axelerant/backstage-plugin-platformsh';

  // add to `routes`
  <Route path="/platformsh" element={<PlatformshPage />} />;
  ```

- Add a menu item to Sidebar menu using `Root.tsx`

  ```ts
  // Import an icon.
  import StorageIcon from '@material-ui/icons/Storage';

  // Add to sidebar items list
  <SidebarItem icon={StorageIcon} to="platformsh" text="Platform.sh" />;
  ```

3. Platformsh plugin provides a Entity tab component named `EntityPlatformshContents`.

```ts
// At the top imports
import { EntityPlatformshContents } from '@axelerant/backstage-plugin-platformsh';

// You can add the tab to any number of pages, the service page is shown as an
// example here
const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route path="/platformsh" title="Platformsh">
      <EntityPlatformshContents />
    </EntityLayout.Route>
```

Note: This require entities to have a platform.sh annotation `platform.sh/project-id: project-id`. If not set, it will show a missing annotation warning.

If you want to show the tab to only those entities where `platform.sh/project-id: project-id` is available, plugin provides an conditional export `isPlatformshAvailable` for the same.

```ts
// At the top imports
import { EntityPlatformshContents, isPlatformshAvailable } from '@axelerant/backstage-plugin-platformsh';

// You can add the tab to any number of pages, the service page is shown as an
// example here
const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route path="/platformsh" title="Platformsh" if={isPlatformshAvailable}>
      <EntityPlatformshContents />
    </EntityLayout.Route>
```
